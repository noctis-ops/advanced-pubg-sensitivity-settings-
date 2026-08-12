import type {
  CalibratedReachZone,
  ControlButtonId,
  ControlButtonLayout,
  ControlLayoutAnalysis,
  ControlLayoutCandidate,
  ControlLayoutConflict,
  ControlLayoutOptimization,
  ControlLayoutProfile,
  ControlSpec,
  Device,
  FingerAssignment,
  FingerId,
  GripAnalysis,
  HandSide,
  LandscapeCoordinateSystem,
  MeasurementSource,
  OptimizerWeights,
  PlayerModel,
  PlayerSettings,
  PlayerSkillProfile,
  WeaponProfile,
  ReachCalibrationInput,
  SensitivityCategory
} from '../types';
import { buildPlayerModel } from './player-model';
import { calculateSensitivity } from './sensitivity-calculator';

export const FINGER_IDS: FingerId[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];

export const DEFAULT_OPTIMIZER_WEIGHTS: OptimizerWeights = {
  // Reach and compatibility are the strongest positive terms because an
  // unreachable button cannot be made usable by visual polish.
  reachCost: 1.35,
  fingerTravel: 1.05,
  comfort: 1.10,
  frequency: 1.00,
  fingerLoad: 1.15,
  actionSynergy: 1.10,
  fingerCompatibility: 1.25,
  overlap: 5.50,
  conflict: 7.00,
  overload: 4.50,
  safeArea: 5.00,
  occlusion: 0.75,
  buttonSize: 0.85,
  simultaneousCompatibility: 1.50,
  sensitivityProfile: 0.90,
  playerSkillProfile: 0.90
};

export interface ControlLayoutOptimizerOptions {
  reachCalibration?: ReachCalibrationInput[];
  seed?: number;
  weights?: Partial<OptimizerWeights>;
  candidateOverrides?: Partial<Record<ControlButtonId, ControlLayoutCandidate[]>>;
  controlSpecs?: ControlSpec[];
  reachZones?: CalibratedReachZone[];
  playerModel?: PlayerModel;
  skillProfile?: PlayerSkillProfile;
  weaponProfile?: WeaponProfile;
  deviceMetrics?: PlayerModel['deviceMetrics'];
  beamWidth?: number;
}

export interface ControlLayoutOptimizationInput {
  device: Device;
  settings: PlayerSettings;
  assignment: FingerAssignment;
  sensitivityProfile: SensitivityCategory;
  playerProfile?: PlayerModel;
  skillProfile?: PlayerSkillProfile;
  weaponProfile?: WeaponProfile;
  reachZones?: CalibratedReachZone[];
  controlSpecs?: ControlSpec[];
  deviceMetrics?: PlayerModel['deviceMetrics'];
  seed?: number;
  weights?: Partial<OptimizerWeights>;
}

interface LayoutContext {
  device: Device;
  settings: PlayerSettings;
  assignment: FingerAssignment;
  sensitivity: SensitivityCategory;
  playerModel: PlayerModel;
  weaponProfile?: WeaponProfile;
  coordinateSystem: LandscapeCoordinateSystem;
  safeArea: ControlLayoutAnalysis['device']['safeArea'];
  reachZones: CalibratedReachZone[];
  specs: ControlSpec[];
  weights: OptimizerWeights;
  seed: number;
}

interface LayoutSearchResult {
  buttons: ControlButtonLayout[];
  score: number;
  scoreBreakdown: ReturnType<typeof scoreLayout>['breakdown'];
  iterations: number;
  candidatesEvaluated: number;
  repairAttempts: number;
  conflicts: ControlLayoutConflict[];
  valid: boolean;
}

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));
const round = (value: number): number => Math.round(value * 100) / 100;

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  return hash >>> 0;
}

function stableSeed(device: Device, settings: PlayerSettings, assignment: FingerAssignment, sensitivity: SensitivityCategory): number {
  return hashSeed(JSON.stringify({ device: device.id, screen: [device.specs.screenWidth, device.specs.screenHeight], settings, assignment, sensitivity }));
}

function normalizeCalibrationPoint(point: { x: number; y: number }): { x: number; y: number } {
  return {
    x: clamp(Math.abs(point.x) <= 1 ? point.x * 100 : point.x, 0, 100),
    y: clamp(Math.abs(point.y) <= 1 ? point.y * 100 : point.y, 0, 100)
  };
}

export function getLandscapeCoordinateSystem(device: Device, metrics?: PlayerModel['deviceMetrics']): LandscapeCoordinateSystem {
  const width = metrics?.landscapeWidth ?? Math.max(device.specs.screenWidth, device.specs.screenHeight);
  const height = metrics?.landscapeHeight ?? Math.min(device.specs.screenWidth, device.specs.screenHeight);
  return {
    width,
    height,
    aspectRatio: width / height,
    orientation: 'landscape',
    normalize: (x: number, y: number) => ({ x: clamp(x / width * 100, 0, 100), y: clamp(y / height * 100, 0, 100) })
  };
}

export function getSafeArea(device: Device): { left: number; right: number; top: number; bottom: number } {
  const landscape = getLandscapeCoordinateSystem(device);
  const ratio = landscape.aspectRatio;
  const sideInset = ratio >= 2 ? 5.5 : ratio >= 1.7 ? 4.5 : 3.5;
  const bottomInset = device.type === 'tablet' ? 4.5 : 5;
  return { left: sideInset, right: sideInset, top: 4.5, bottom: bottomInset };
}

function defaultZoneFor(hand: HandSide, finger: FingerId, device: Device, assignment: FingerAssignment): CalibratedReachZone {
  const base: Record<FingerId, { x: number; y: number; radius: number }> = {
    thumb: { x: 18, y: 78, radius: 22 },
    index: { x: 31, y: 31, radius: 17 },
    middle: { x: 39, y: 26, radius: 16 },
    ring: { x: 46, y: 24, radius: 15 },
    pinky: { x: 53, y: 28, radius: 14 }
  };
  const deviceScale = clamp(6.5 / device.specs.screenSize, 0.82, 1.18);
  const handCount = assignment[hand].length;
  const activeShift = (handCount - 2) * 1.6;
  const sourceX = base[finger].x + activeShift + (finger === 'thumb' ? 0 : (handCount >= 3 ? 1.5 : 0));
  const x = hand === 'left' ? sourceX : 100 - sourceX;
  const radius = clamp(base[finger].radius * deviceScale, 10, 27);
  const radiusX = clamp(radius * (device.type === 'tablet' ? 1.08 : 1), 10, 29);
  const radiusY = clamp(radius * (device.specs.screenHeight > device.specs.screenWidth ? 0.92 : 1), 9, 26);
  return {
    hand,
    finger,
    centerX: x,
    centerY: base[finger].y,
    radiusX,
    radiusY,
    comfortableRadius: Math.min(radiusX, radiusY),
    source: 'estimated',
    sampleCount: 0,
    confidence: 0.30
  };
}

function calibratedZone(input: ReachCalibrationInput, fallback: CalibratedReachZone): CalibratedReachZone {
  const points = [
    input.maximumComfortableReach,
    input.minimumComfortableReach,
    input.innerReach,
    input.outerReach,
    input.upperReach,
    input.lowerReach
  ].filter((point): point is { x: number; y: number } => Boolean(point)).map(normalizeCalibrationPoint);
  if (points.length === 0) return fallback;
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const radiusX = Math.max(8, Math.min(30, Math.max(...points.map((point) => Math.abs(point.x - centerX)), fallback.radiusX * 0.42)));
  const radiusY = Math.max(8, Math.min(28, Math.max(...points.map((point) => Math.abs(point.y - centerY)), fallback.radiusY * 0.42)));
  const source: MeasurementSource = input.source ?? 'user-provided';
  return {
    ...fallback,
    centerX,
    centerY,
    radiusX,
    radiusY,
    comfortableRadius: Math.min(radiusX, radiusY),
    source,
    sampleCount: input.sampleCount ?? points.length,
    confidence: source === 'measured' ? 0.92 : source === 'user-provided' ? 0.78 : 0.30
  };
}

export function buildReachZones(device: Device, assignment: FingerAssignment, calibration: ReachCalibrationInput[] = []): CalibratedReachZone[] {
  const selected = [
    ...assignment.left.map((finger) => ({ hand: 'left' as const, finger })),
    ...assignment.right.map((finger) => ({ hand: 'right' as const, finger }))
  ];
  return selected.map(({ hand, finger }) => {
    const fallback = defaultZoneFor(hand, finger, device, assignment);
    const input = calibration.find((item) => item.hand === hand && item.finger === finger);
    return input ? calibratedZone(input, fallback) : fallback;
  });
}

function gripAnalysis(settings: PlayerSettings, assignment: FingerAssignment, gyroSkill: number): GripAnalysis {
  const leftPressure = clamp(assignment.left.length / 4);
  const rightPressure = clamp(assignment.right.length / 4);
  const claw = settings.gripStyle === 'thumbs' ? 0.30 : settings.gripStyle === 'three-finger' ? 0.52 : settings.gripStyle === 'claw' ? 0.70 : settings.gripStyle === 'five-claw' ? 0.82 : 0.90;
  const thumbDependency = settings.gyroscopeMode === 'always-on' ? clamp(0.70 - gyroSkill * 0.28) : clamp(0.96 - gyroSkill * 0.10);
  return {
    style: settings.gripStyle,
    leftHandPressure: leftPressure,
    rightHandPressure: rightPressure,
    thumbAimingDependency: thumbDependency,
    clawStability: claw,
    simultaneousActionCapacity: clamp(0.35 + (assignment.left.length + assignment.right.length) * 0.10 + claw * 0.25),
    source: 'estimated',
    reason: {
      en: `Grip model uses ${settings.fingerCount} active fingers, ${settings.gripStyle} posture, and ${Math.round(gyroSkill * 100)}% estimated gyro control.`,
      ar: `يعتمد نموذج المسكة على ${settings.fingerCount} أصابع فعالة ووضعية ${settings.gripStyle} و${Math.round(gyroSkill * 100)}٪ تحكم جايرو مقدر.`
    }
  };
}

function spec(
  id: ControlButtonId,
  priority: ControlSpec['priority'],
  frequency: number,
  importance: number,
  minSize: number,
  maxSize: number,
  preferredHands: HandSide[],
  preferredFingers: FingerId[],
  options: Partial<Pick<ControlSpec, 'requiredFinger' | 'requiredHand' | 'canBeHeld' | 'simultaneousActions' | 'conflictingActions' | 'preferredZones'>> = {}
): ControlSpec {
  return {
    id,
    priority,
    frequency,
    importance,
    minSize,
    maxSize,
    preferredHands,
    preferredFingers,
    canBeHeld: options.canBeHeld ?? false,
    simultaneousActions: options.simultaneousActions ?? [],
    conflictingActions: options.conflictingActions ?? [],
    preferredZones: options.preferredZones ?? [],
    ...options
  };
}

export function buildControlSpecs(settings: PlayerSettings, sensitivity: SensitivityCategory): ControlSpec[] {
  const close = settings.playStyle === 'aggressive' || settings.playStyle === 'close-aggressive' || settings.playStyle === 'tournament-elite';
  const highCameraSpeed = sensitivity.camera.noScope >= 100;
  // Four-finger grips normally execute peek as a sequential index action;
  // movement/fire/aim remain the genuinely simultaneous core set.
  const movementSimultaneous: ControlButtonId[] = close ? ['fire', 'aim', 'scope', 'jump', 'crouch'] : ['fire', 'aim', 'scope', 'jump'];
  return [
    spec('movement', 'core', 1.00, 1.00, highCameraSpeed ? 92 : 84, 142, ['left'], ['thumb'], { requiredHand: 'left', requiredFinger: 'thumb', canBeHeld: true, simultaneousActions: movementSimultaneous, preferredZones: ['left-thumb'] }),
    spec('fire', 'core', 0.94, 1.00, 90, close ? 142 : 126, ['left', 'right'], ['index', 'middle'], { simultaneousActions: ['movement', 'aim', 'scope', 'jump'], preferredZones: ['left-index', 'right-index'] }),
    spec('aim', 'combat', 0.88, 0.90, 82, 124, ['right'], ['thumb'], { requiredHand: 'right', requiredFinger: 'thumb', canBeHeld: true, simultaneousActions: ['movement', 'fire', 'scope', 'jump'], preferredZones: ['right-thumb'] }),
    spec('scope', 'combat', 0.78, 0.84, 76, 116, ['right'], ['index', 'middle'], { simultaneousActions: ['movement', 'fire', 'aim'], preferredZones: ['right-index'] }),
    spec('jump', 'combat', close ? 0.76 : 0.62, 0.78, 74, 108, ['right'], ['middle', 'index', 'ring'], { simultaneousActions: ['movement', 'fire', 'aim'], preferredZones: ['right-middle', 'right-index'] }),
    spec('crouch', 'combat', 0.68, 0.72, 72, 104, ['right'], ['middle', 'index', 'ring'], { simultaneousActions: ['movement', 'fire', 'aim'], preferredZones: ['right-middle', 'right-index'] }),
    spec('prone', 'utility', 0.25, 0.54, 66, 96, ['right'], ['ring', 'middle', 'index'], { conflictingActions: ['jump'], preferredZones: ['right-ring'] }),
    spec('peekLeft', 'combat', close ? 0.76 : 0.55, 0.80, 76, close ? 118 : 106, ['left', 'right'], ['index', 'middle'], { simultaneousActions: ['movement'], preferredZones: ['left-index', 'right-index'] }),
    spec('peekRight', 'combat', close ? 0.76 : 0.55, 0.80, 76, close ? 118 : 106, ['right', 'left'], ['index', 'middle'], { simultaneousActions: ['movement'], preferredZones: ['right-index', 'left-index'] }),
    spec('reload', 'utility', 0.42, 0.62, 72, 104, ['right', 'left'], ['middle', 'ring', 'index'], { preferredZones: ['right-middle', 'right-ring'] }),
    spec('weaponPrimary', 'utility', 0.36, 0.58, 68, 100, ['right', 'left'], ['middle', 'ring', 'index'], { preferredZones: ['right-ring', 'right-middle'] }),
    spec('weaponSecondary', 'utility', 0.24, 0.54, 64, 94, ['right', 'left'], ['ring', 'middle', 'index'], { preferredZones: ['right-ring'] }),
    spec('grenade', 'utility', 0.30, 0.58, 66, 100, ['left', 'right'], ['index', 'middle', 'ring'], { preferredZones: ['left-index', 'left-middle'] }),
    spec('heal', 'utility', 0.28, 0.52, 64, 94, ['left', 'right'], ['middle', 'ring', 'index'], { preferredZones: ['left-middle', 'left-ring'] }),
    spec('map', 'utility', 0.12, 0.38, 58, 84, ['right', 'left'], ['ring', 'pinky', 'middle'], { preferredZones: ['right-ring', 'right-pinky'] }),
    spec('freeLook', 'utility', 0.34, 0.50, 64, 96, ['left', 'right'], ['thumb'], { preferredZones: ['left-thumb'] })
  ];
}

function preferredFinger(assignment: FingerAssignment, specItem: ControlSpec): Array<{ hand: HandSide; finger: FingerId }> {
  const all: Array<{ hand: HandSide; finger: FingerId }> = [
    ...assignment.left.map((finger) => ({ hand: 'left' as const, finger })),
    ...assignment.right.map((finger) => ({ hand: 'right' as const, finger }))
  ];
  const constrained = all.filter(({ hand, finger }) => {
    if (specItem.requiredHand && hand !== specItem.requiredHand) return false;
    if (specItem.requiredFinger && finger !== specItem.requiredFinger) return false;
    return true;
  });
  const preferredFingerMatches = constrained.filter(({ finger }) => specItem.preferredFingers.includes(finger));
  const eligible = preferredFingerMatches.length > 0
    ? preferredFingerMatches
    : constrained.filter(({ hand }) => specItem.preferredHands.includes(hand));
  return eligible.sort((left, right) => {
    const leftHand = specItem.preferredHands.indexOf(left.hand);
    const rightHand = specItem.preferredHands.indexOf(right.hand);
    const leftFinger = specItem.preferredFingers.indexOf(left.finger);
    const rightFinger = specItem.preferredFingers.indexOf(right.finger);
    return (Math.max(leftHand, 0) * 2 + Math.max(leftFinger, 0)) - (Math.max(rightHand, 0) * 2 + Math.max(rightFinger, 0));
  });
}

function zoneFor(zones: CalibratedReachZone[], hand: HandSide, finger: FingerId): CalibratedReachZone | undefined {
  return zones.find((zone) => zone.hand === hand && zone.finger === finger);
}

function normalizeZoneName(hand: HandSide, finger: FingerId): string {
  return `${hand}-${finger}`;
}

function buttonSize(specItem: ControlSpec, context: LayoutContext): number {
  const skill = context.playerModel.skillProfile;
  const touchPrecision = skill.touchPrecisionScore.score;
  const closeDemand = context.settings.playStyle === 'aggressive' || context.settings.playStyle === 'close-aggressive' || context.settings.playStyle === 'tournament-elite' ? 1.08 : 1;
  const gyroReduction = context.settings.gyroscopeMode === 'always-on' && skill.gyroControlScore.score > 0.70 && specItem.id === 'aim' ? 0.92 : 1;
  const screenFactor = clamp(6.5 / context.device.specs.screenSize, 0.86, 1.16);
  const skillFactor = 1 + (1 - touchPrecision) * 0.12;
  const sensitivityPressure = clamp((context.sensitivity.camera.noScope + context.sensitivity.ads.redDot) / 180, 0.65, 1.45);
  const target = specItem.minSize + (specItem.maxSize - specItem.minSize) * (0.36 + specItem.importance * 0.42 + specItem.frequency * 0.12);
  return Math.round(clamp(target * screenFactor * skillFactor * closeDemand * gyroReduction * (0.98 + sensitivityPressure * 0.03), specItem.minSize, specItem.maxSize));
}

function candidateOffsets(index: number, seed: number): Array<{ x: number; y: number }> {
  const patterns = [
    [0, 0], [-0.28, 0], [0.28, 0], [0, -0.28], [0, 0.28], [-0.22, -0.22], [0.22, 0.22], [-0.22, 0.22], [0.22, -0.22]
  ];
  const rotate = (seed + index) % patterns.length;
  return patterns.slice(rotate).concat(patterns.slice(0, rotate)).map(([x, y]) => ({ x, y }));
}

function clampInsideSafeArea(x: number, y: number, size: number, safeArea: LayoutContext['safeArea']): { x: number; y: number } {
  const radius = size / 18;
  return {
    x: clamp(x, safeArea.left + radius, 100 - safeArea.right - radius),
    y: clamp(y, safeArea.top + radius, 100 - safeArea.bottom - radius)
  };
}

export function generateCandidates(specItem: ControlSpec, context: LayoutContext): ControlLayoutCandidate[] {
  const candidates: ControlLayoutCandidate[] = [];
  const fingers = preferredFinger(context.assignment, specItem);
  fingers.forEach(({ hand, finger }, fingerIndex) => {
    const zone = zoneFor(context.reachZones, hand, finger);
    if (!zone) return;
    const baseSize = buttonSize(specItem, context);
    const sizeOptions = Array.from(new Set([
      baseSize,
      Math.round(clamp(baseSize * 0.92, specItem.minSize, specItem.maxSize)),
      Math.round(clamp(baseSize * 1.08, specItem.minSize, specItem.maxSize))
    ]));
    const offsets = candidateOffsets(fingerIndex, hashSeed(`${context.seed}:${specItem.id}:${hand}:${finger}`) % 9);
    sizeOptions.forEach((size, sizeIndex) => offsets.forEach((offset, index) => {
      const position = clampInsideSafeArea(
        zone.centerX + offset.x * zone.radiusX * 0.92,
        zone.centerY + offset.y * zone.radiusY * 0.92,
        size,
        context.safeArea
      );
      candidates.push({
        id: `${specItem.id}-${hand}-${finger}-${sizeIndex}-${index}`,
        buttonId: specItem.id,
        x: round(position.x),
        y: round(position.y),
        size,
        assignedHand: hand,
        assignedFinger: finger,
        sourceZone: normalizeZoneName(hand, finger),
        rank: fingerIndex * sizeOptions.length * offsets.length + sizeIndex * offsets.length + index + 1
      });
    }));
  });
  return candidates;
}

function labels(id: ControlButtonId): { en: string; ar: string } {
  const map: Record<ControlButtonId, { en: string; ar: string }> = {
    movement: { en: 'Movement', ar: 'الحركة' }, fire: { en: 'Fire', ar: 'إطلاق' }, aim: { en: 'Aim', ar: 'تصويب' }, scope: { en: 'Scope', ar: 'سكوب' },
    jump: { en: 'Jump', ar: 'قفز' }, crouch: { en: 'Crouch', ar: 'انحناء' }, prone: { en: 'Prone', ar: 'انبطاح' }, peekLeft: { en: 'Peek L', ar: 'طلعة يسار' },
    peekRight: { en: 'Peek R', ar: 'طلعة يمين' }, reload: { en: 'Reload', ar: 'تلقيم' }, weaponPrimary: { en: 'Weapon 1', ar: 'السلاح 1' },
    weaponSecondary: { en: 'Weapon 2', ar: 'السلاح 2' }, grenade: { en: 'Grenade', ar: 'قنبلة' }, heal: { en: 'Heal', ar: 'علاج' }, map: { en: 'Map', ar: 'الخريطة' }, freeLook: { en: 'Eye', ar: 'النظرة الحرة' }
  };
  return map[id];
}

function circleRadius(size: number): number {
  return size / 18;
}

function overlapAmount(first: ControlButtonLayout, second: ControlButtonLayout): number {
  const distance = Math.hypot(first.x - second.x, first.y - second.y);
  return Math.max(0, circleRadius(first.size) + circleRadius(second.size) - distance);
}

function distanceToZone(button: ControlButtonLayout, zone: CalibratedReachZone): number {
  const dx = (button.x - zone.centerX) / Math.max(zone.radiusX, 1);
  const dy = (button.y - zone.centerY) / Math.max(zone.radiusY, 1);
  return Math.hypot(dx, dy);
}

function specFor(context: LayoutContext, id: ControlButtonId): ControlSpec {
  return context.specs.find((item) => item.id === id)!;
}

function simultaneousConflict(first: ControlButtonLayout, second: ControlButtonLayout, context: LayoutContext): boolean {
  if (first.assignedHand !== second.assignedHand || first.assignedFinger !== second.assignedFinger) return false;
  const firstSpec = specFor(context, first.id);
  const secondSpec = specFor(context, second.id);
  return firstSpec.simultaneousActions.includes(second.id)
    || secondSpec.simultaneousActions.includes(first.id)
    || firstSpec.conflictingActions.includes(second.id)
    || secondSpec.conflictingActions.includes(first.id);
}

function hardConflictBetween(first: ControlButtonLayout, second: ControlButtonLayout, context: LayoutContext): boolean {
  // Core collisions and simultaneous same-finger collisions are hard. Utility
  // overlap remains a scored warning when the calibrated hand model is crowded.
  return (overlapAmount(first, second) > 0.1 && first.priority === 'core' && second.priority === 'core') || simultaneousConflict(first, second, context);
}

function evaluateFingerLoad(buttons: ControlButtonLayout[]): number {
  const counts = new Map<string, number>();
  buttons.forEach((button) => {
    const key = `${button.assignedHand}-${button.assignedFinger}`;
    counts.set(key, (counts.get(key) ?? 0) + (button.priority === 'core' ? 1.4 : button.priority === 'combat' ? 1 : 0.55));
  });
  if (counts.size === 0) return 0;
  return clamp(average(Array.from(counts.values()).map((value) => Math.max(0, value - 2) / 5)));
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sensitivityLayoutScore(buttons: ControlButtonLayout[], context: LayoutContext): number {
  const gyroSkill = context.playerModel.skillProfile.gyroControlScore.score;
  const closeDemand = context.settings.playStyle === 'aggressive' || context.settings.playStyle === 'close-aggressive' || context.settings.playStyle === 'tournament-elite' ? 1 : 0;
  const aim = buttons.find((button) => button.id === 'aim');
  const fire = buttons.find((button) => button.id === 'fire');
  if (!aim || !fire) return 0;
  const fireAimDistance = Math.hypot(aim.x - fire.x, aim.y - fire.y) / 100;
  const thumbDependency = context.settings.gyroscopeMode === 'always-on' ? 1 - gyroSkill * 0.35 : 1;
  const weaponFlickDemand = context.weaponProfile?.flickDemand ?? 0.5;
  return clamp(1 - fireAimDistance * (0.35 + closeDemand * 0.25 + weaponFlickDemand * 0.08) - thumbDependency * 0.04);
}

export function scoreLayout(buttons: ControlButtonLayout[], context: LayoutContext): { score: number; breakdown: {
  reachScore: number;
  comfortScore: number;
  frequencyScore: number;
  synergyScore: number;
  fingerCompatibilityScore: number;
  overlapPenalty: number;
  conflictPenalty: number;
  overloadPenalty: number;
  safeAreaPenalty: number;
  travelPenalty: number;
  occlusionPenalty: number;
  buttonSizeScore: number;
  simultaneousCompatibilityScore: number;
  sensitivityProfileScore: number;
  playerSkillProfileScore: number;
  total: number;
} } {
  const reachValues = buttons.map((button) => {
    const zone = zoneFor(context.reachZones, button.assignedHand, button.assignedFinger);
    return zone ? clamp(1 - distanceToZone(button, zone) / 1.35) : 0;
  });
  const comfortValues = buttons.map((button) => {
    const zone = zoneFor(context.reachZones, button.assignedHand, button.assignedFinger);
    return zone ? clamp(1 - distanceToZone(button, zone) / 1.60) : 0;
  });
  const specs = buttons.map((button) => specFor(context, button.id));
  const frequencyScore = average(buttons.map((button, index) => clamp(1 - Math.abs(button.size - (specs[index].minSize + (specs[index].maxSize - specs[index].minSize) * (0.4 + specs[index].frequency * 0.4))) / 90)));
  const fingerCompatibilityScore = average(buttons.map((button) => {
    const item = specFor(context, button.id);
    return clamp((item.preferredHands.includes(button.assignedHand) ? 0.55 : 0) + (item.preferredFingers.includes(button.assignedFinger) ? 0.45 : 0));
  }));
  const overlaps = buttons.flatMap((button, index) => buttons.slice(index + 1).map((other) => overlapAmount(button, other))).filter((value) => value > 0);
  const overlapPenalty = clamp(average(overlaps) / 8 + overlaps.length / Math.max(buttons.length * 3, 1));
  const conflicts = buttons.flatMap((button, index) => buttons.slice(index + 1).filter((other) => simultaneousConflict(button, other, context)));
  const conflictPenalty = clamp(conflicts.length / Math.max(buttons.length * 1.5, 1));
  const overloadPenalty = evaluateFingerLoad(buttons);
  const safeAreaPenalty = average(buttons.map((button) => {
    const radius = circleRadius(button.size);
    const outside = Math.max(0, context.safeArea.left - (button.x - radius)) + Math.max(0, (button.x + radius) - (100 - context.safeArea.right)) + Math.max(0, context.safeArea.top - (button.y - radius)) + Math.max(0, (button.y + radius) - (100 - context.safeArea.bottom));
    return clamp(outside / 20);
  }));
  const travelLinks: Array<[ControlButtonId, ControlButtonId]> = [['fire', 'aim'], ['fire', 'scope'], ['fire', 'peekLeft'], ['fire', 'peekRight'], ['aim', 'scope'], ['movement', 'fire'], ['movement', 'jump']];
  const travelPenalty = average(travelLinks.map(([firstId, secondId]) => {
    const first = buttons.find((button) => button.id === firstId);
    const second = buttons.find((button) => button.id === secondId);
    return first && second ? clamp(Math.hypot(first.x - second.x, first.y - second.y) / 100) : 1;
  }));
  const synergyScore = clamp(1 - travelPenalty);
  const simultaneousCompatibilityScore = clamp(1 - conflictPenalty);
  const centerOcclusion = buttons.filter((button) => button.priority === 'utility').map((button) => Math.max(0, 1 - Math.hypot(button.x - 50, button.y - 50) / 45));
  const occlusionPenalty = clamp(average(centerOcclusion));
  const buttonSizeScore = average(buttons.map((button, index) => {
    const item = specs[index];
    return clamp((button.size - item.minSize) / Math.max(item.maxSize - item.minSize, 1));
  }));
  const sensitivityProfileScore = sensitivityLayoutScore(buttons, context);
  const playerSkillProfileScore = clamp(0.45 + context.playerModel.skillProfile.touchPrecisionScore.score * 0.30 + context.playerModel.skillProfile.fingerControl.score * 0.25);
  const positiveWeight = context.weights.reachCost + context.weights.comfort + context.weights.frequency + context.weights.actionSynergy + context.weights.fingerCompatibility + context.weights.buttonSize + context.weights.simultaneousCompatibility + context.weights.sensitivityProfile + context.weights.playerSkillProfile;
  const positive = (
    average(reachValues) * context.weights.reachCost
    + average(comfortValues) * context.weights.comfort
    + frequencyScore * context.weights.frequency
    + synergyScore * context.weights.actionSynergy
    + fingerCompatibilityScore * context.weights.fingerCompatibility
    + buttonSizeScore * context.weights.buttonSize
    + simultaneousCompatibilityScore * context.weights.simultaneousCompatibility
    + sensitivityProfileScore * context.weights.sensitivityProfile
    + playerSkillProfileScore * context.weights.playerSkillProfile
  ) / positiveWeight;
  const penalty = (
    overlapPenalty * context.weights.overlap
    + conflictPenalty * context.weights.conflict
    + overloadPenalty * context.weights.overload
    + safeAreaPenalty * context.weights.safeArea
    + travelPenalty * context.weights.fingerTravel
    + occlusionPenalty * context.weights.occlusion
  ) / (context.weights.overlap + context.weights.conflict + context.weights.overload + context.weights.safeArea + context.weights.fingerTravel + context.weights.occlusion);
  const total = clamp(positive * 100 - penalty * 100, 0, 100);
  return {
    score: total,
    breakdown: {
      reachScore: average(reachValues), comfortScore: average(comfortValues), frequencyScore, synergyScore, fingerCompatibilityScore,
      overlapPenalty, conflictPenalty, overloadPenalty, safeAreaPenalty, travelPenalty, occlusionPenalty, buttonSizeScore,
      simultaneousCompatibilityScore, sensitivityProfileScore, playerSkillProfileScore, total
    }
  };
}

function toButton(candidate: ControlLayoutCandidate, specItem: ControlSpec, context: LayoutContext): ControlButtonLayout {
  const label = labels(specItem.id);
  const zone = zoneFor(context.reachZones, candidate.assignedHand, candidate.assignedFinger);
  const reach = zone ? Math.round(clamp(1 - distanceToZone({ ...candidate, id: specItem.id, priority: specItem.priority, label: label.en, labelAr: label.ar, reason: { en: '', ar: '' } }, zone) / 1.35, 0, 1) * 100) : 0;
  const handText = candidate.assignedHand === 'left' ? 'left hand' : 'right hand';
  const handTextAr = candidate.assignedHand === 'left' ? 'اليد اليسرى' : 'اليد اليمنى';
  return {
    id: specItem.id,
    label: label.en,
    labelAr: label.ar,
    x: candidate.x,
    y: candidate.y,
    size: candidate.size,
    assignedHand: candidate.assignedHand,
    assignedFinger: candidate.assignedFinger,
    priority: specItem.priority,
    candidateRank: candidate.rank,
    score: reach,
    reason: {
      en: `Selected ${candidate.assignedFinger} on the ${handText}: ${reach}% comfortable reach, candidate ${candidate.rank}, and ${specItem.frequency.toFixed(2)} use frequency.`,
      ar: `اختير ${candidate.assignedFinger} في ${handTextAr}: وصول مريح ${reach}%، المرشح ${candidate.rank}، وتكرار استخدام ${specItem.frequency.toFixed(2)}.`
    },
    explainability: {
      finger: `${candidate.assignedHand}/${candidate.assignedFinger}`,
      position: `(${candidate.x}%, ${candidate.y}%) from ${candidate.sourceZone}`,
      size: `${candidate.size} bounded units from ${specItem.minSize}-${specItem.maxSize}`,
      hand: handText
    }
  };
}

function analysisReachZones(zones: CalibratedReachZone[]): ControlLayoutAnalysis['reachZones'] {
  return zones.map((zone) => ({ hand: zone.hand, finger: zone.finger, x: zone.centerX, y: zone.centerY, radius: zone.comfortableRadius, radiusX: zone.radiusX, radiusY: zone.radiusY, source: zone.source }));
}

function provisionalResponsibilities(assignment: FingerAssignment, specs: ControlSpec[]): Array<{ buttonId: ControlButtonId; hand: HandSide; finger: FingerId }> {
  return specs.map((item) => {
    const selected = preferredFinger(assignment, item)[0] ?? { hand: item.requiredHand ?? 'right', finger: item.requiredFinger ?? 'thumb' };
    return { buttonId: item.id, hand: selected.hand, finger: selected.finger };
  });
}

export function countAssignedFingers(assignment: FingerAssignment): number {
  return assignment.left.length + assignment.right.length;
}

export function suggestFingerAssignment(fingerCount: PlayerSettings['fingerCount']): FingerAssignment {
  if (fingerCount === 2) return { left: ['thumb'], right: ['thumb'] };
  if (fingerCount === 3) return { left: ['thumb'], right: ['thumb', 'index'] };
  if (fingerCount === 4) return { left: ['thumb', 'index'], right: ['thumb', 'index'] };
  if (fingerCount === 5) return { left: ['thumb', 'index'], right: ['thumb', 'index', 'middle'] };
  return { left: ['thumb', 'index', 'middle'], right: ['thumb', 'index', 'middle'] };
}

export function validateFingerAssignment(assignment: FingerAssignment, expected: number): string[] {
  const errors: string[] = [];
  if (countAssignedFingers(assignment) !== expected) errors.push(`Expected ${expected} fingers, got ${countAssignedFingers(assignment)}.`);
  if (!assignment.left.includes('thumb')) errors.push('Left thumb is required for movement.');
  if (!assignment.right.includes('thumb')) errors.push('Right thumb is required for camera control.');
  if (new Set(assignment.left).size !== assignment.left.length) errors.push('Left hand contains duplicate fingers.');
  if (new Set(assignment.right).size !== assignment.right.length) errors.push('Right hand contains duplicate fingers.');
  return errors;
}

export function analyzeControlInputs(
  device: Device,
  settings: PlayerSettings,
  assignment: FingerAssignment,
  options: Pick<ControlLayoutOptimizerOptions, 'reachCalibration'> = {}
): ControlLayoutAnalysis {
  const errors = validateFingerAssignment(assignment, settings.fingerCount);
  const coordinateSystem = getLandscapeCoordinateSystem(device);
  const safeArea = getSafeArea(device);
  const sensitivity = calculateSensitivity(device, settings);
  const playerModel = buildPlayerModel(device, settings, assignment);
  const specs = buildControlSpecs(settings, sensitivity);
  const zones = buildReachZones(device, assignment, options.reachCalibration);
  const conflicts: ControlLayoutConflict[] = errors.map((error) => ({ type: 'duplicate-responsibility', buttonIds: [], severity: 'error', reason: { en: error, ar: error } }));
  return {
    player: { fingerCount: settings.fingerCount, assignmentValid: errors.length === 0, leftCount: assignment.left.length, rightCount: assignment.right.length },
    device: { screenWidth: coordinateSystem.width, screenHeight: coordinateSystem.height, aspectRatio: coordinateSystem.aspectRatio, screenSize: device.specs.screenSize, safeArea },
    coordinateSystem,
    grip: gripAnalysis(settings, assignment, playerModel.skillProfile.gyroControlScore.score),
    responsibilities: provisionalResponsibilities(assignment, specs),
    reachZones: analysisReachZones(zones),
    calibratedReachZones: zones,
    conflicts,
    passed: errors.length === 0
  };
}

function makeContext(device: Device, settings: PlayerSettings, sensitivity: SensitivityCategory, assignment: FingerAssignment, options: ControlLayoutOptimizerOptions): LayoutContext {
  const coordinateSystem = getLandscapeCoordinateSystem(device, options.deviceMetrics);
  const basePlayerModel = options.playerModel ?? buildPlayerModel(device, settings, assignment);
  const playerModel = options.skillProfile
    ? { ...basePlayerModel, skillProfile: options.skillProfile, deviceMetrics: options.deviceMetrics ?? basePlayerModel.deviceMetrics, estimated: options.skillProfile.confidence < 0.5 }
    : options.deviceMetrics ? { ...basePlayerModel, deviceMetrics: options.deviceMetrics } : basePlayerModel;
  const reachZones = options.reachZones ?? buildReachZones(device, assignment, options.reachCalibration);
  const weights: OptimizerWeights = { ...DEFAULT_OPTIMIZER_WEIGHTS, ...(options.weights ?? {}) };
  return {
    device, settings, assignment, sensitivity, playerModel, weaponProfile: options.weaponProfile, coordinateSystem, safeArea: getSafeArea(device), reachZones,
    specs: options.controlSpecs ?? buildControlSpecs(settings, sensitivity), weights,
    seed: options.seed ?? stableSeed(device, settings, assignment, sensitivity)
  };
}

function hasHardConflict(buttons: ControlButtonLayout[], context: LayoutContext): boolean {
  for (let index = 0; index < buttons.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < buttons.length; otherIndex += 1) {
      if (hardConflictBetween(buttons[index], buttons[otherIndex], context)) return true;
    }
  }
  return false;
}

function partialScore(buttons: ControlButtonLayout[], context: LayoutContext): number {
  return scoreLayout(buttons, context).score;
}

function searchLayout(context: LayoutContext, options: ControlLayoutOptimizerOptions, repairAttempt: number): LayoutSearchResult {
  const order = [...context.specs].sort((first, second) => {
    const priority = { core: 0, combat: 1, utility: 2 } as const;
    return priority[first.priority] - priority[second.priority] || second.frequency - first.frequency;
  });
  type State = { buttons: ControlButtonLayout[]; score: number };
  let states: State[] = [{ buttons: [], score: 0 }];
  let candidatesEvaluated = 0;
  let rejectedCandidates = 0;
  const beamWidth = options.beamWidth ?? 56;
  for (const item of order) {
    const generated = generateCandidates(item, context);
    const overrides = options.candidateOverrides?.[item.id] ?? [];
    const candidates = [...overrides, ...generated];
    const seen = new Set<string>();
    const unique = candidates.filter((candidate) => {
      const key = `${candidate.assignedHand}:${candidate.assignedFinger}:${candidate.x}:${candidate.y}:${candidate.size}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const next: State[] = [];
    for (const state of states) {
      for (const candidate of unique) {
        candidatesEvaluated += 1;
        const button = toButton(candidate, item, context);
        const combined = [...state.buttons, button];
        if (hasHardConflict(combined, context)) {
          rejectedCandidates += 1;
          continue;
        }
        next.push({ buttons: combined, score: partialScore(combined, context) });
      }
    }
    next.sort((left, right) => right.score - left.score);
    states = next.slice(0, beamWidth);
    if (states.length === 0) break;
  }
  const ranked = states
    .map((state) => {
      const validation = validateControls(state.buttons, buildAnalysisForContext(context), context.specs, context);
      const scored = scoreLayout(state.buttons, context);
      return { state, validation, scored };
    })
    .sort((left, right) => {
      if (left.validation.some((item) => item.severity === 'error') !== right.validation.some((item) => item.severity === 'error')) return left.validation.some((item) => item.severity === 'error') ? 1 : -1;
      return right.scored.score - left.scored.score;
    });
  const best = ranked[0];
  if (!best) {
    return { buttons: [], score: 0, scoreBreakdown: scoreLayout([], context).breakdown, iterations: order.length, candidatesEvaluated, repairAttempts: repairAttempt + (rejectedCandidates > 0 ? 1 : 0), conflicts: [{ type: 'no-valid-layout', buttonIds: [], severity: 'error', reason: { en: 'No valid layout could be generated from the active fingers and calibrated reach zones.', ar: 'تعذر إنشاء توزيع صالح من الأصابع ومناطق الوصول المعايرة.' } }], valid: false };
  }
  return {
    buttons: best.state.buttons,
    score: best.scored.score,
    scoreBreakdown: best.scored.breakdown,
    iterations: order.length,
    candidatesEvaluated,
    repairAttempts: repairAttempt + (rejectedCandidates > 0 ? 1 : 0),
    conflicts: best.validation,
    valid: best.validation.every((item) => item.severity !== 'error')
  };
}

function buildAnalysisForContext(context: LayoutContext): ControlLayoutAnalysis {
  return {
    player: { fingerCount: context.settings.fingerCount, assignmentValid: true, leftCount: context.assignment.left.length, rightCount: context.assignment.right.length },
    device: { screenWidth: context.coordinateSystem.width, screenHeight: context.coordinateSystem.height, aspectRatio: context.coordinateSystem.aspectRatio, screenSize: context.device.specs.screenSize, safeArea: context.safeArea },
    coordinateSystem: context.coordinateSystem,
    grip: gripAnalysis(context.settings, context.assignment, context.playerModel.skillProfile.gyroControlScore.score),
    responsibilities: provisionalResponsibilities(context.assignment, context.specs),
    reachZones: analysisReachZones(context.reachZones),
    calibratedReachZones: context.reachZones,
    conflicts: [],
    passed: true
  };
}

export function validateControls(buttons: ControlButtonLayout[], analysis: ControlLayoutAnalysis, specs?: ControlSpec[], context?: LayoutContext): ControlLayoutConflict[] {
  const safeArea = analysis.device.safeArea;
  const conflicts: ControlLayoutConflict[] = [];
  const selectedSpecs = specs ?? buttons.map((button) => ({ id: button.id, priority: button.priority, frequency: 0, importance: 0, minSize: 0, maxSize: 200, preferredHands: [button.assignedHand], preferredFingers: [button.assignedFinger], canBeHeld: false, simultaneousActions: [], conflictingActions: [], preferredZones: [] }));
  const localContext = context;
  for (let index = 0; index < buttons.length; index += 1) {
    const button = buttons[index];
    const radius = circleRadius(button.size);
    if (button.x - radius < safeArea.left || button.x + radius > 100 - safeArea.right || button.y - radius < safeArea.top || button.y + radius > 100 - safeArea.bottom) {
      conflicts.push({ type: 'safe-area', buttonIds: [button.id], severity: 'error', reason: { en: `${button.label} leaves the safe area.`, ar: `${button.labelAr} يخرج عن المنطقة الآمنة.` } });
    }
    const calibrated = analysis.calibratedReachZones?.find((item) => item.hand === button.assignedHand && item.finger === button.assignedFinger);
    const simpleZone = analysis.reachZones.find((item) => item.hand === button.assignedHand && item.finger === button.assignedFinger);
    if (!calibrated && !simpleZone) {
      conflicts.push({ type: 'unreachable', buttonIds: [button.id], severity: button.priority === 'core' ? 'error' : 'warning', reason: { en: `${button.label} has no calibrated reach zone for its assigned finger.`, ar: `${button.labelAr} ليس له نطاق وصول معاير للإصبع المسؤول.` } });
    } else {
      const centerX = calibrated?.centerX ?? simpleZone?.x ?? 50;
      const centerY = calibrated?.centerY ?? simpleZone?.y ?? 50;
      const radiusX = calibrated?.radiusX ?? simpleZone?.radiusX ?? simpleZone?.radius ?? 20;
      const radiusY = calibrated?.radiusY ?? simpleZone?.radiusY ?? simpleZone?.radius ?? 20;
      const dx = (button.x - centerX) / Math.max(radiusX, 1);
      const dy = (button.y - centerY) / Math.max(radiusY, 1);
      if (Math.hypot(dx, dy) > 1.05) conflicts.push({ type: 'unreachable', buttonIds: [button.id], severity: button.priority === 'core' ? 'error' : 'warning', reason: { en: `${button.label} is outside the critical comfortable reach zone.`, ar: `${button.labelAr} خارج منطقة الوصول المريحة الحرجة.` } });
    }
    if (button.id === 'movement' && (button.assignedHand !== 'left' || button.assignedFinger !== 'thumb')) conflicts.push({ type: 'duplicate-responsibility', buttonIds: [button.id], severity: 'error', reason: { en: 'Movement must remain on the left thumb.', ar: 'يجب أن يبقى زر الحركة على الإبهام الأيسر.' } });
    for (let otherIndex = index + 1; otherIndex < buttons.length; otherIndex += 1) {
      const other = buttons[otherIndex];
      if (overlapAmount(button, other) > 0.1) conflicts.push({ type: 'overlap', buttonIds: [button.id, other.id], severity: button.priority === 'core' && other.priority === 'core' ? 'error' : 'warning', reason: { en: `${button.label} overlaps ${other.label}.`, ar: `يوجد تداخل بين ${button.labelAr} و${other.labelAr}.` } });
      if (localContext && simultaneousConflict(button, other, localContext)) conflicts.push({ type: 'simultaneous-conflict', buttonIds: [button.id, other.id], severity: 'error', reason: { en: `${button.label} and ${other.label} require the same finger during a simultaneous action.`, ar: `${button.labelAr} و${other.labelAr} يحتاجان الإصبع نفسه أثناء تنفيذ متزامن.` } });
    }
  }
  // selectedSpecs is intentionally referenced so validation can be used with a
  // minimal analysis in external tests without making specs mandatory.
  if (selectedSpecs.length === 0) conflicts.push({ type: 'no-valid-layout', buttonIds: [], severity: 'error', reason: { en: 'No control specifications were supplied.', ar: 'لم يتم تزويد مواصفات للأزرار.' } });
  if (buttons.some((button) => button.priority === 'core') && !buttons.some((button) => button.id === 'movement')) conflicts.push({ type: 'no-valid-layout', buttonIds: [], severity: 'error', reason: { en: 'The core layout has no movement control.', ar: 'التوزيع الأساسي لا يحتوي على زر الحركة.' } });
  return conflicts;
}

function stableLayoutId(device: Device, settings: PlayerSettings, assignment: FingerAssignment, seed: number): string {
  return `layout-${device.id}-${hashSeed(JSON.stringify({ settings, assignment, seed })).toString(16)}`;
}

function layoutRationale(result: LayoutSearchResult, context: LayoutContext): { en: string; ar: string }[] {
  const evidence = context.playerModel.skillProfile.confidence >= 0.5 ? 'measured/user-provided player evidence' : 'estimated player priors';
  return [
    { en: `Generated ${result.candidatesEvaluated} candidates over ${result.iterations} optimization stages; seed ${context.seed} makes the search reproducible.`, ar: `تم توليد ${result.candidatesEvaluated} مرشحاً عبر ${result.iterations} مراحل تحسين؛ البذرة ${context.seed} تجعل البحث قابلاً لإعادة الإنتاج.` },
    { en: `Coordinates use one landscape system (${context.coordinateSystem.width}×${context.coordinateSystem.height}, ${context.coordinateSystem.aspectRatio.toFixed(3)}:1); reach source is ${context.reachZones.some((zone) => zone.source === 'measured' || zone.source === 'user-provided') ? 'calibrated' : 'estimated'}.`, ar: `الإحداثيات تستخدم نظام Landscape موحداً (${context.coordinateSystem.width}×${context.coordinateSystem.height}، بنسبة ${context.coordinateSystem.aspectRatio.toFixed(3)}:1)؛ مصدر الوصول ${context.reachZones.some((zone) => zone.source === 'measured' || zone.source === 'user-provided') ? 'معاير' : 'مقدر'}.` },
    { en: `The score weights reachable, comfortable, simultaneous actions above cosmetic placement; player evidence is ${evidence}.`, ar: `تعطي الأوزان الأولوية للوصول والراحة والتنفيذ المتزامن فوق الشكل؛ ودليل اللاعب هو ${evidence}.` },
    { en: `Conflict repair attempts: ${result.repairAttempts}; unresolved hard constraints are never downgraded to warnings.`, ar: `محاولات إصلاح التعارض: ${result.repairAttempts}؛ لا يتم تحويل القيود الصلبة غير المحلولة إلى تحذيرات.` }
  ];
}

export function generateControlCandidatesFor(
  buttonId: ControlButtonId,
  device: Device,
  settings: PlayerSettings,
  sensitivity: SensitivityCategory,
  assignment: FingerAssignment,
  options: ControlLayoutOptimizerOptions = {}
): ControlLayoutCandidate[] {
  const context = makeContext(device, settings, sensitivity, assignment, options);
  const specItem = context.specs.find((item) => item.id === buttonId);
  return specItem ? generateCandidates(specItem, context) : [];
}

export function optimizeControlLayout(input: ControlLayoutOptimizationInput): ControlLayoutProfile;
export function optimizeControlLayout(
  device: Device,
  settings: PlayerSettings,
  sensitivity: SensitivityCategory,
  assignment: FingerAssignment,
  options?: ControlLayoutOptimizerOptions
): ControlLayoutProfile;
export function optimizeControlLayout(
  inputOrDevice: Device | ControlLayoutOptimizationInput,
  settingsArg?: PlayerSettings,
  sensitivityArg?: SensitivityCategory,
  assignmentArg?: FingerAssignment,
  optionsArg: ControlLayoutOptimizerOptions = {}
): ControlLayoutProfile {
  const objectInput = 'device' in inputOrDevice;
  const device = objectInput ? inputOrDevice.device : inputOrDevice;
  const settings = objectInput ? inputOrDevice.settings : settingsArg!;
  const sensitivity = objectInput ? inputOrDevice.sensitivityProfile : sensitivityArg!;
  const assignment = objectInput ? inputOrDevice.assignment : assignmentArg!;
  const options: ControlLayoutOptimizerOptions = objectInput
    ? { ...optionsArg, seed: inputOrDevice.seed ?? optionsArg.seed, weights: inputOrDevice.weights ?? optionsArg.weights, reachZones: inputOrDevice.reachZones ?? optionsArg.reachZones, playerModel: inputOrDevice.playerProfile ?? optionsArg.playerModel, skillProfile: inputOrDevice.skillProfile ?? optionsArg.skillProfile, weaponProfile: inputOrDevice.weaponProfile ?? optionsArg.weaponProfile, controlSpecs: inputOrDevice.controlSpecs ?? optionsArg.controlSpecs, deviceMetrics: inputOrDevice.deviceMetrics ?? optionsArg.deviceMetrics }
    : optionsArg;
  const context = makeContext(device, settings, sensitivity, assignment, options);
  const assignmentErrors = validateFingerAssignment(assignment, settings.fingerCount);
  let result: LayoutSearchResult = assignmentErrors.length > 0
    ? { buttons: [], score: 0, scoreBreakdown: scoreLayout([], context).breakdown, iterations: 0, candidatesEvaluated: 0, repairAttempts: 0, conflicts: assignmentErrors.map((error) => ({ type: 'duplicate-responsibility', buttonIds: [], severity: 'error', reason: { en: error, ar: error } })), valid: false }
    : searchLayout(context, options, 0);
  // Automatic repair is a second search, not a cosmetic warning. A different
  // deterministic beam order is used when the first candidate set is invalid.
  for (let attempt = 1; !result.valid && attempt <= 3; attempt += 1) {
    result = searchLayout({ ...context, seed: context.seed + attempt * 7919 }, options, attempt);
  }
  const baseAnalysis = buildAnalysisForContext(context);
  const finalResponsibilities = result.buttons.map((button) => ({ buttonId: button.id, hand: button.assignedHand, finger: button.assignedFinger }));
  const conflicts = [...baseAnalysis.conflicts, ...result.conflicts];
  const finalAnalysis: ControlLayoutAnalysis = { ...baseAnalysis, responsibilities: finalResponsibilities, conflicts, passed: result.valid && conflicts.every((item) => item.severity !== 'error') };
  const optimization: ControlLayoutOptimization = {
    score: result.score,
    scoreBreakdown: result.scoreBreakdown,
    iterations: result.iterations,
    candidatesEvaluated: result.candidatesEvaluated,
    repairAttempts: result.repairAttempts,
    seed: context.seed,
    weights: context.weights,
    warnings: conflicts.filter((item) => item.severity === 'warning')
  };
  const measuredReach = context.reachZones.some((zone) => zone.source === 'measured' || zone.source === 'user-provided');
  const confidence = Math.round(clamp(35 + result.score * 0.35 + context.playerModel.skillProfile.confidence * 15 + (measuredReach ? 12 : 0) - conflicts.filter((item) => item.severity === 'warning').length * 2, 0, 98));
  return {
    id: stableLayoutId(device, settings, assignment, context.seed),
    deviceId: device.id,
    fingerAssignment: assignment,
    analysis: finalAnalysis,
    buttons: result.buttons,
    safeArea: context.safeArea,
    screenAspectRatio: context.coordinateSystem.aspectRatio,
    coordinateSystem: context.coordinateSystem,
    score: result.score,
    scoreBreakdown: result.scoreBreakdown,
    optimization,
    generatedAt: new Date().toISOString(),
    confidence,
    rationale: layoutRationale(result, context)
  };
}

/** Explicit repair entry point for callers that want to re-run after a conflict. */
export function repairControlLayout(
  device: Device,
  settings: PlayerSettings,
  sensitivity: SensitivityCategory,
  assignment: FingerAssignment,
  options: ControlLayoutOptimizerOptions = {}
): ControlLayoutProfile {
  const seed = (options.seed ?? stableSeed(device, settings, assignment, sensitivity)) + 7919;
  return optimizeControlLayout(device, settings, sensitivity, assignment, { ...options, seed });
}

export function generateControlLayout(
  device: Device,
  settings: PlayerSettings,
  sensitivity: SensitivityCategory,
  assignment: FingerAssignment,
  options: ControlLayoutOptimizerOptions = {}
): ControlLayoutProfile {
  return optimizeControlLayout(device, settings, sensitivity, assignment, {
    ...options,
    reachCalibration: options.reachCalibration ?? settings.reachCalibration
  });
}
