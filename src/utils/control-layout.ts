import type {
  ControlButtonId,
  ControlButtonLayout,
  ControlLayoutAnalysis,
  ControlLayoutConflict,
  ControlLayoutProfile,
  Device,
  FingerAssignment,
  FingerId,
  PlayerSettings,
  SensitivityCategory
} from '../types';

export const FINGER_IDS: FingerId[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];

export function suggestFingerAssignment(fingerCount: PlayerSettings['fingerCount']): FingerAssignment {
  if (fingerCount === 2) return { left: ['thumb'], right: ['thumb'] };
  if (fingerCount === 3) return { left: ['thumb'], right: ['thumb', 'index'] };
  if (fingerCount === 4) return { left: ['thumb', 'index'], right: ['thumb', 'index'] };
  if (fingerCount === 5) return { left: ['thumb', 'index'], right: ['thumb', 'index', 'middle'] };
  return { left: ['thumb', 'index', 'middle'], right: ['thumb', 'index', 'middle'] };
}

export function countAssignedFingers(assignment: FingerAssignment): number {
  return assignment.left.length + assignment.right.length;
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

function pick(assignment: FingerAssignment, side: 'left' | 'right', preferred: FingerId[]): FingerId {
  const available = assignment[side];
  return preferred.find((finger) => available.includes(finger)) ?? available[0] ?? 'thumb';
}

function boundedSize(value: number, min: number, max: number) {
  return Math.round(Math.min(max, Math.max(min, value)));
}

function button(
  id: ControlButtonId,
  label: string,
  labelAr: string,
  x: number,
  y: number,
  buttonSize: number,
  assignedHand: 'left' | 'right',
  assignedFinger: FingerId,
  priority: ControlButtonLayout['priority'],
  reason: ControlButtonLayout['reason']
): ControlButtonLayout {
  return { id, label, labelAr, x, y, size: buttonSize, assignedHand, assignedFinger, priority, reason };
}

function getSafeArea(device: Device) {
  const physicalRatio = device.specs.screenWidth / device.specs.screenHeight;
  return {
    left: physicalRatio < 0.50 ? 6 : 4,
    right: physicalRatio < 0.50 ? 6 : 4,
    top: 4,
    bottom: 5
  };
}

function reachZone(hand: 'left' | 'right', finger: FingerId) {
  const leftPositions: Record<FingerId, { x: number; y: number; radius: number }> = {
    thumb: { x: 18, y: 78, radius: 22 },
    index: { x: 31, y: 31, radius: 17 },
    middle: { x: 39, y: 25, radius: 16 },
    ring: { x: 46, y: 22, radius: 15 },
    pinky: { x: 53, y: 26, radius: 14 }
  };
  const zone = leftPositions[finger];
  return hand === 'left' ? zone : { ...zone, x: 100 - zone.x };
}

function responsibilities(assignment: FingerAssignment): Array<{ buttonId: ControlButtonId; hand: 'left' | 'right'; finger: FingerId }> {
  const leftIndex = pick(assignment, 'left', ['index', 'middle', 'thumb']);
  const rightIndex = pick(assignment, 'right', ['index', 'middle', 'thumb']);
  const leftMiddle = pick(assignment, 'left', ['middle', 'index', 'thumb']);
  const rightMiddle = pick(assignment, 'right', ['middle', 'index', 'thumb']);
  const leftRing = pick(assignment, 'left', ['ring', 'middle', 'index', 'thumb']);
  const rightRing = pick(assignment, 'right', ['ring', 'middle', 'index', 'thumb']);
  return [
    { buttonId: 'movement', hand: 'left', finger: 'thumb' },
    { buttonId: 'fire', hand: 'left', finger: leftIndex },
    { buttonId: 'aim', hand: 'right', finger: 'thumb' },
    { buttonId: 'scope', hand: 'right', finger: rightIndex },
    { buttonId: 'jump', hand: 'right', finger: rightMiddle },
    { buttonId: 'crouch', hand: 'right', finger: rightRing },
    { buttonId: 'prone', hand: 'right', finger: rightRing },
    { buttonId: 'peekLeft', hand: 'left', finger: leftMiddle },
    { buttonId: 'peekRight', hand: 'right', finger: rightIndex },
    { buttonId: 'reload', hand: 'right', finger: rightMiddle },
    { buttonId: 'weaponPrimary', hand: 'right', finger: rightRing },
    { buttonId: 'weaponSecondary', hand: 'right', finger: rightRing },
    { buttonId: 'grenade', hand: 'left', finger: leftMiddle },
    { buttonId: 'heal', hand: 'left', finger: leftRing },
    { buttonId: 'map', hand: 'right', finger: rightRing },
    { buttonId: 'freeLook', hand: 'left', finger: 'thumb' }
  ];
}

export function analyzeControlInputs(
  device: Device,
  settings: PlayerSettings,
  assignment: FingerAssignment
): ControlLayoutAnalysis {
  const errors = validateFingerAssignment(assignment, settings.fingerCount);
  const safeArea = getSafeArea(device);
  const assigned = responsibilities(assignment);
  const selected = [
    ...assignment.left.map((finger) => ({ hand: 'left' as const, finger })),
    ...assignment.right.map((finger) => ({ hand: 'right' as const, finger }))
  ];
  const reachZones = selected.map(({ hand, finger }) => ({ hand, finger, ...reachZone(hand, finger) }));
  const conflicts: ControlLayoutConflict[] = errors.map((error) => ({
    type: 'duplicate-responsibility',
    buttonIds: [],
    severity: 'error',
    reason: { en: error, ar: error }
  }));
  return {
    player: { fingerCount: settings.fingerCount, assignmentValid: errors.length === 0, leftCount: assignment.left.length, rightCount: assignment.right.length },
    device: { screenWidth: device.specs.screenWidth, screenHeight: device.specs.screenHeight, aspectRatio: device.specs.screenWidth / device.specs.screenHeight, screenSize: device.specs.screenSize, safeArea },
    responsibilities: assigned,
    reachZones,
    conflicts,
    passed: errors.length === 0
  };
}

function createButtons(
  device: Device,
  settings: PlayerSettings,
  sensitivity: SensitivityCategory,
  assignment: FingerAssignment,
  safeArea: ControlLayoutAnalysis['device']['safeArea']
): ControlButtonLayout[] {
  const touchSpeed = (sensitivity.camera.noScope + sensitivity.ads.redDot) / 2;
  const closeProfile = settings.playStyle === 'close-aggressive' || settings.playStyle === 'tournament-elite' || settings.playStyle === 'aggressive';
  const spacing = Math.min(5, Math.max(0, (touchSpeed - 80) * 0.04));
  const leftIndex = pick(assignment, 'left', ['index', 'middle', 'thumb']);
  const rightIndex = pick(assignment, 'right', ['index', 'middle', 'thumb']);
  const leftMiddle = pick(assignment, 'left', ['middle', 'index', 'thumb']);
  const rightMiddle = pick(assignment, 'right', ['middle', 'index', 'thumb']);
  const leftRing = pick(assignment, 'left', ['ring', 'middle', 'index', 'thumb']);
  const rightRing = pick(assignment, 'right', ['ring', 'middle', 'index', 'thumb']);
  const movementSize = Math.min(140, Math.max(85, 105 + (settings.fingerCount >= 5 ? 10 : settings.fingerCount >= 4 ? 5 : 0) + (device.specs.screenSize < 6 ? 10 : device.specs.screenSize > 7 ? -8 : 0)));
  const fireSize = closeProfile ? 120 : 110;
  const peekSize = closeProfile ? 108 : 100;
  const highScopeScale = settings.playStyle === 'tournament-elite' ? 0.94 : 1;
  const reasonClose = { en: 'Placed for fast close-range acquisition.', ar: 'وضع للالتقاط السريع في القتال القريب.' };
  const reasonStable = { en: 'Spaced for stable micro-control and recoil management.', ar: 'تمت موازنته للتحكم الميكروي وثبات الارتداد.' };
  const fireOnLeft = assignment.left.includes('index');
  const fireHand = fireOnLeft ? 'left' : 'right';
  const fireFinger = fireOnLeft ? leftIndex : rightIndex;
  const controls: ControlButtonLayout[] = [
    button('movement', 'Movement', 'الحركة', 18, 78, boundedSize(movementSize, 80, 140), 'left', 'thumb', 'core', { en: 'Left thumb reach zone.', ar: 'منطقة وصول إبهام اليد اليسرى.' }),
    button('fire', 'Fire', 'إطلاق', fireOnLeft ? 31 : 69, 28, boundedSize(fireSize, 85, 150), fireHand, fireFinger, 'core', reasonClose),
    button('aim', 'Aim', 'تصويب', 82 + spacing / 2, 77, boundedSize(closeProfile ? 110 : 100, 75, 135), 'right', 'thumb', 'combat', reasonClose),
    button('scope', 'Scope', 'سكوب', 69, 32, boundedSize(closeProfile ? 100 : 92, 70, 130), 'right', rightIndex, 'combat', reasonStable),
    button('jump', 'Jump', 'قفز', 61, 24, 88, 'right', rightMiddle, 'combat', reasonClose),
    button('crouch', 'Crouch', 'انحناء', 54, 31, 84, 'right', rightRing, 'combat', reasonStable),
    button('prone', 'Prone', 'انبطاح', 47, 40, 78, 'right', rightRing, 'utility', reasonStable),
    button('peekLeft', 'Peek L', 'طلعة يسار', 31, 45, peekSize, 'left', leftMiddle, 'combat', reasonClose),
    button('peekRight', 'Peek R', 'طلعة يمين', 69, 45, peekSize, 'right', rightIndex, 'combat', reasonClose),
    button('reload', 'Reload', 'تلقيم', 61, 45, 86, 'right', rightMiddle, 'utility', reasonStable),
    button('weaponPrimary', 'Weapon 1', 'السلاح 1', 54, 48, 82, 'right', rightRing, 'utility', reasonStable),
    button('weaponSecondary', 'Weapon 2', 'السلاح 2', 47, 54, 78, 'right', rightRing, 'utility', reasonStable),
    button('grenade', 'Grenade', 'قنبلة', 39, 65, 78, 'left', leftMiddle, 'utility', reasonStable),
    button('heal', 'Heal', 'علاج', 48, 73, 76, 'left', leftRing, 'utility', reasonStable),
    button('map', 'Map', 'الخريطة', 91, 9, 70, 'right', rightRing, 'utility', reasonStable),
    button('freeLook', 'Eye', 'النظرة الحرة', 10, 34, 76, 'left', 'thumb', 'utility', reasonStable)
  ];
  return controls.map((control) => ({
    ...control,
    x: Math.min(100 - safeArea.right - control.size / 25, Math.max(safeArea.left + control.size / 25, control.x)),
    y: Math.min(100 - safeArea.bottom - control.size / 25, Math.max(safeArea.top + control.size / 25, control.y)),
    size: Math.round(control.size * highScopeScale)
  }));
}

function validateControls(buttons: ControlButtonLayout[], analysis: ControlLayoutAnalysis): ControlLayoutConflict[] {
  const conflicts = [...analysis.conflicts];
  const radius = (size: number) => Math.max(2, size / 16);
  for (let i = 0; i < buttons.length; i += 1) {
    for (let j = i + 1; j < buttons.length; j += 1) {
      const first = buttons[i];
      const second = buttons[j];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      if (distance < radius(first.size) + radius(second.size)) {
        conflicts.push({ type: 'overlap', buttonIds: [first.id, second.id], severity: first.priority === 'core' && second.priority === 'core' ? 'error' : 'warning', reason: { en: `${first.label} overlaps ${second.label}.`, ar: `يوجد تداخل بين ${first.labelAr} و${second.labelAr}.` } });
      }
    }
    const zone = analysis.reachZones.find((item) => item.hand === buttons[i].assignedHand && item.finger === buttons[i].assignedFinger);
    if (zone && Math.hypot(buttons[i].x - zone.x, buttons[i].y - zone.y) > zone.radius + 10) {
      conflicts.push({ type: 'unreachable', buttonIds: [buttons[i].id], severity: buttons[i].priority === 'core' ? 'error' : 'warning', reason: { en: `${buttons[i].label} is outside the ${buttons[i].assignedFinger} reach zone.`, ar: `${buttons[i].labelAr} خارج منطقة وصول ${buttons[i].assignedFinger}.` } });
    }
  }
  const core = buttons.filter((button) => button.priority === 'core');
  const responsibilitiesMap = new Map<string, ControlButtonLayout[]>();
  core.forEach((button) => {
    const key = `${button.assignedHand}-${button.assignedFinger}`;
    responsibilitiesMap.set(key, [...(responsibilitiesMap.get(key) ?? []), button]);
  });
  responsibilitiesMap.forEach((assigned, key) => {
    if (assigned.length > 1 && !key.endsWith('thumb')) {
      conflicts.push({ type: 'duplicate-responsibility', buttonIds: assigned.map((button) => button.id), severity: 'warning', reason: { en: `Core controls share ${key}.`, ar: `أزرار أساسية مشتركة على ${key}.` } });
    }
  });
  return conflicts;
}

export function generateControlLayout(device: Device, settings: PlayerSettings, sensitivity: SensitivityCategory, assignment: FingerAssignment): ControlLayoutProfile {
  const analysis = analyzeControlInputs(device, settings, assignment);
  const buttons = createButtons(device, settings, sensitivity, assignment, analysis.device.safeArea);
  const conflicts = validateControls(buttons, analysis);
  const finalAnalysis: ControlLayoutAnalysis = { ...analysis, conflicts, passed: conflicts.every((conflict) => conflict.severity !== 'error') };
  return {
    id: `layout-${device.id}-${Date.now()}`,
    deviceId: device.id,
    fingerAssignment: assignment,
    analysis: finalAnalysis,
    buttons,
    safeArea: analysis.device.safeArea,
    screenAspectRatio: analysis.device.aspectRatio,
    generatedAt: new Date().toISOString(),
    confidence: Math.max(35, Math.min(96, 92 - conflicts.filter((conflict) => conflict.severity === 'error').length * 18 - conflicts.filter((conflict) => conflict.severity === 'warning').length * 4)),
    rationale: [
      { en: 'The analysis ran before button placement.', ar: 'تم تنفيذ التحليل قبل توزيع الأزرار.' },
      { en: 'Movement is always assigned to the left thumb.', ar: 'زر الحركة مسند دائماً إلى الإبهام الأيسر.' },
      settings.playStyle === 'close-aggressive' || settings.playStyle === 'tournament-elite' ? { en: 'Combat buttons are prioritized for close-range acquisition while high-zoom controls stay spaced.', ar: 'تمت أولوية أزرار القتال القريب مع إبقاء أزرار التكبير العالي متباعدة.' } : { en: 'Core controls are spaced for stable access across the selected device.', ar: 'تم توزيع الأزرار الأساسية للوصول الثابت على الجهاز المختار.' }
    ]
  };
}
