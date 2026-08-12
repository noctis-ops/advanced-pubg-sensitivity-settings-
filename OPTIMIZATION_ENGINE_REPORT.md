# تقرير تنفيذ محرك الحساسية والـ Control Layout Optimizer

## الحالة

تم استبدال المسار الحسابي الأساسي من قالب ثابت إلى مسار قابل للقياس والتحسين:

```text
Player Input
  -> Device / Landscape Model
  -> Finger + Grip Model
  -> Reach Calibration
  -> Player Skill Model
  -> Domain Weapon / Scope Model
  -> Candidate Generation
  -> Scoring
  -> Grid Search
  -> Coordinate Descent
  -> Conflict Repair
  -> Hard Validation
  -> Explainable Result
```

> لا يوجد ادعاء بأن النظام يقرأ ارتداد PUBG مباشرة. خصائص الأسلحة غير المقاسة موسومة صراحةً بـ `expert-defined-normalized`.

## الملفات الجديدة الأساسية

- `src/data/weapon-profiles.ts`
  - 19 ملف سلاح مطلوب، بما فيها FAMAS.
  - الخصائص: الفئة، نمط الارتداد، الميل العمودي والأفقي، معدل الإطلاق، burst characteristics، المدى، استخدام المناظير، tracking/flick/stability/precision demand.
  - كل الملفات الحالية `measured: false` و`source: expert-defined-normalized`.
- `src/utils/player-model.ts`
  - `createPlayerSkillProfile()`
  - `buildPlayerModel()`
  - مصدر كل قيمة: `measured` أو `estimated` أو `user-provided`.
- `src/utils/reach-calibration.ts`
  - واجهة عامة لبناء `CalibratedReachZone` من نقاط اللاعب.
- `src/utils/optimizer-engine.test.ts`
  - اختبارات السيناريوهات المطلوبة.

## الملفات الجوهرية التي تغيرت

- `src/types/index.ts`
  - `PlayerSkillProfile`
  - `SensitivityExperiment`
  - `WeaponProfile`
  - `ControlSpec`
  - `CalibratedReachZone`
  - `OptimizerWeights`
  - `ControlLayoutCandidate`
  - `LayoutScoreBreakdown`
  - metadata للـ optimizer والـ explainability.
- `src/utils/sensitivity-calculator.ts`
  - فصل `calculateRuleBasedSensitivity()` عن `calculateSensitivity()`.
  - إضافة مرحلة optimizer فعلية بعد الـ expert prior.
  - تخزين `playerModel` وبيانات optimization في النتيجة.
- `src/utils/sensitivity-optimizer.ts`
  - `generateCandidates()`
  - `evaluateCandidate()`
  - `rankCandidates()`
  - `optimizeSensitivity()`
  - `generateSensitivityCandidates()`
  - `optimizeSensitivityVector()`
  - Grid Search محدود ثم Coordinate Descent.
- `src/utils/weapon-sensitivity-calculator.ts`
  - ربط Weapon Profile وPlayer Skill Profile وScope Profile مع كل Weapon/Scope pair.
  - إضافة score/evidence/target لكل زوج.
- `src/utils/control-layout.ts`
  - إزالة الإحداثيات النهائية الثابتة.
  - توليد مرشحين للموقع والحجم والإصبع معاً.
  - scoring، beam search، hard validation، automatic repair.
- `src/components/results/ControlsLayoutPanel.tsx`
  - واجهة إدخال calibration لنقاط الوصول المريحة.
  - عرض score، عدد المرشحين، تفسير كل زر، ومصدر reach data.
- `src/components/results/MeasurementLabPanel.tsx`
  - كل Training Ground measurement مقبول يتحول إلى `SensitivityExperiment` ويعاد تشغيل المحرك.
- `src/context/AppContext.tsx`
  - `SET_SENSITIVITY_EXPERIMENTS`
  - `SET_REACH_CALIBRATION`

## Sensitivity Engine

### فصل الأنظمة

القيمة النهائية لا تساوي قيمة واحدة منسوخة بين الأنظمة. لكل زوج Weapon/Scope يتم حساب:

```text
Camera = baseCamera
       × scopeCameraSpeed
       × tracking/flick profile
       × weapon flick demand
       × measured overshoot correction

ADS = baseADS
    × scope precision/acquisition
    × micro/headshot profile
    × weapon stability/recoil profile
    × measured correction

Gyroscope = baseGyro
          × scope gyro control
          × vertical/horizontal recoil demand
          × fire-rate demand
          × gyro skill
          × measured recoil evidence

ADS Gyroscope = baseADSGyro
              × scope gyro precision
              × recoil demand
              × micro/headshot profile
              × measured recoil evidence
```

لذلك لا يجب أن تكون Camera وADS وGyroscope وADS Gyroscope نسخاً من بعضها.

كما أن قيمة `Gyroscope` ليست متجهة دائماً إلى 400؛ تم خفض الـ gyro priors حتى لا يمحو الـ clamp الفروقات بين السلاح والمنظار. وعند تفعيل الجايرو توجد أرضية عملية تعتمد على التكبير وارتداد السلاح، وليس قيمة 400 ثابتة.

### الأدلة

- `WeaponScopeSensitivity.optimization` يحفظ:
  - score
  - evidence source
  - target values
  - iterations
  - candidates evaluated
- `reason` يذكر سبب اختلاف Camera/ADS/Gyro، مثل recoil demand أو scope precision.

## Weapon Knowledge Model

البيانات الحالية ليست telemetry رسمية. مثال:

```text
M416:
  verticalRecoilTendency = 0.42
  horizontalRecoilTendency = 0.25
  stabilityDemand = 0.78
  source = expert-defined-normalized
  measured = false

Beryl M762:
  verticalRecoilTendency = 0.96
  horizontalRecoilTendency = 0.72
  stabilityDemand = 0.26
  source = expert-defined-normalized
  measured = false
```

كلما توفرت قياسات Training Ground لاحقاً، يمكن استبدال field محدد فقط وتحويل مصدره إلى `measured` دون تلويث باقي الخصائص.

## Player Skill Model

الحقول المطلوبة موجودة في `PlayerSkillProfile`:

```text
trackingScore
flickScore
microAdjustmentScore
recoilControlScore
headshotScore
gyroControlScore
reactionScore
touchPrecisionScore
closeRangeScore
midRangeScore
longRangeScore
confidence
sampleCount
```

وتوجد أيضاً الحقول التفصيلية:

```text
aimAcquisition
headshotControl
adsControl
fingerControl
correctionStability
```

كل metric يحتوي:

```text
score
source: measured | estimated | user-provided
sampleCount
confidence
```

عند عدم وجود اختبارات، لا يدّعي النظام أن اللاعب مقاس؛ يستخدم قيمة `estimated` مشتقة من اختيار skill level، مع confidence منخفضة `0.22`.

## Sensitivity Experiments

`TrainingGroundMeasurement` المقبول يتحول إلى `SensitivityExperiment` ويحتوي على:

```text
sensitivityVector
weapon
scope
testType
trackingAccuracy
targetAcquisitionTime
overshootRate
undershootRate
recoilDeviation
horizontalDeviation
headshotRate
correctionCount
sampleCount
confidence
source
```

لا يتم إنشاء `measured` experiment من دون إدخال اللاعب أو سجل قياس.

## Control Layout Optimizer

### ControlSpec

تم تعريف مواصفات فعلية لكل زر من الأزرار الستة عشر، وتشمل:

```text
id
priority
frequency
importance
minSize
maxSize
preferredHands
preferredFingers
requiredFinger
canBeHeld
simultaneousActions
conflictingActions
preferredZones
```

### Candidate Generation

`generateCandidates()` لا يعيد نقطة واحدة. لكل زر يتم توليد نقاط متعددة حول كل Reach Zone صالحة، مع:

- اليد
- الإصبع
- الحجم
- Safe Area
- الجهاز
- الحساسية
- skill/touch precision
- playstyle
- seed

لكل موقع يتم أيضاً اختبار ثلاثة أحجام bounded حول الحجم المقترح، ولذلك `Where + Which finger + What size` تدخل البحث نفسه. الإحداثيات القديمة يمكن أن تظهر كتأثير domain prior، لكنها ليست ناتجاً نهائياً مفروضاً.

### Reach Calibration

يمكن إدخال:

```text
maximumComfortableReach
minimumComfortableReach
innerReach
outerReach
upperReach
lowerReach
```

لكل إصبع ويد. إذا أُدخلت نقاط، يصبح المصدر `user-provided` أو `measured` حسب ما يحدده الإدخال. إذا لم تدخل نقاط، المنطقة `estimated` ومبنية على الجهاز والـ Landscape واليد وعدد الأصابع.

### Scoring

الأوزان في `DEFAULT_OPTIMIZER_WEIGHTS` وليست أرقاماً مبعثرة داخل الدوال:

```text
reachCost
fingerTravel
comfort
frequency
fingerLoad
actionSynergy
fingerCompatibility
overlap
conflict
overload
safeArea
occlusion
buttonSize
simultaneousCompatibility
sensitivityProfile
playerSkillProfile
```

والـ score يحسب:

```text
positive utility
- overlap penalty
- conflict penalty
- overload penalty
- safe-area penalty
- travel penalty
- occlusion penalty
```

### Conflict Repair

البحث يستخدم Beam Search، ويسجل المرشحين المرفوضين بسبب hard conflicts، ثم يعيد البحث حتى ثلاث محاولات عند فشل النتيجة. توجد أيضاً دالة عامة `repairControlLayout()` لإعادة التشغيل ببذرة إصلاح مختلفة. التعارضات الصلبة تمنع اعتماد النتيجة، ولا تتحول إلى warning:

- Movement ليس Left Thumb.
- Core buttons متداخلة.
- زر خارج Safe Area.
- Core button خارج reach الحرجة.
- إصبع مطلوب لعمليتين متزامنتين.
- عدم وجود Layout صالح.

التداخلات منخفضة الخطورة في utility controls قد تظهر كـ soft warning مع سبب واضح، لكن النتيجة لا تدعي خلوها من جميع التحذيرات.

## Landscape Coordinate System

`getLandscapeCoordinateSystem()` يستخدم:

```text
width = max(screenWidth, screenHeight)
height = min(screenWidth, screenHeight)
aspectRatio = width / height
orientation = landscape
```

ويستخدم هذا النظام في:

- التحليل
- Reach Zones
- candidate generation
- safe area
- preview
- export metadata

وبذلك لا يوجد خلط بين portrait ratio في التحليل وlandscape ratio في المعاينة.

## Determinism

الـ optimization seed مشتق من input hash أو يمرر صراحةً إلى:

```text
generateControlLayout(..., { seed })
```

نفس المدخلات ونفس seed ينتجان نفس:

```text
buttons
assignments
coordinates
sizes
score
candidate order
```

`generatedAt` فقط metadata خارج الحساب، وprofile IDs أصبحت مستقرة بدلاً من `Date.now()`.

## عينة فعلية

المدخلات:

```text
iPhone 15 Pro Max
5 fingers
Always-on Gyroscope
Aggressive
120 FPS
```

| Weapon | Scope | Camera | ADS | Gyro | ADS Gyro |
|---|---:|---:|---:|---:|---:|
| M416 | Red Dot | 101 | 80 | 212 | 259 |
| M416 | 4x | 16 | 11 | 88 | 80 |
| AKM | Red Dot | 103 | 72 | 252 | 295 |
| AKM | 4x | 16 | 10 | 116 | 96 |
| Beryl M762 | Red Dot | 104 | 71 | 267 | 300 |
| Beryl M762 | 4x | 16 | 9 | 124 | 100 |
| M24 | Red Dot | 94 | 75 | 173 | 220 |
| M24 | 4x | 15 | 13 | 80 | 68 |
| M24 | 8x | 4 | 4 | 31 | 17 |
| AWM | Red Dot | 94 | 73 | 179 | 228 |
| AWM | 4x | 15 | 12 | 82 | 71 |
| AWM | 8x | 4 | 4 | 33 | 17 |

هذه القيم ليست “حقيقة ارتداد PUBG”؛ هي ناتج model + domain priors، ولذلك يظهر في واجهة السلاح أن المصدر غير telemetry مباشر وأن evidence الحالي `estimated` عند عدم إجراء اللاعب للاختبار.

## Before vs After

| جانب | قبل | بعد |
|---|---|---|
| الحساسية | base multipliers وتعديلات محدودة | 4 أنظمة، scope/weapon/player model، candidates وcoordinate descent |
| السلاح | telemetry تقريبية داخل calculator | Weapon Profile مستقل وموسوم domain knowledge |
| مهارة اللاعب | skill level فقط | 15 metric مع source/confidence/sampleCount |
| القياس | قياس محفوظ منفصلاً | يتحول إلى SensitivityExperiment ويؤثر بعد إعادة التوليد |
| Layout | X/Y ثابتة مع assignment rules | candidate positions + finger + size optimization |
| Reach | دوائر ثابتة | device/landscape/player calibration |
| التعارض | warning قد يمر | hard constraints + repair + رفض عند الفشل |
| determinism | id وتاريخ داخل النتيجة | seed وIDs ثابتة، التاريخ metadata فقط |
| explainability | reason عام | سبب الإصبع والموقع والحجم وscore وcandidate rank |

## نتائج الاختبارات

تم تشغيل:

```bash
npx tsc --noEmit
npm test -- --run
npm run build
```

النتيجة الحالية:

```text
TypeScript: passed
Test Files: 8 passed
Tests: 32 passed
Production build: passed
```

وتغطي الاختبارات:

- iPhone 15 Pro Max / 5 fingers / gyro / tournament-aggressive.
- تغيير توزيع الأصابع مع بقاء الجهاز.
- 4 fingers مقابل 6 fingers.
- Reach Calibration وتغير candidate order والـ final geometry.
- forced core collision وإعادة التوزيع.
- low/high sensitivity evidence.
- low/high gyro-control profile.
- M416 وAKM وBeryl وM24 وAWM.
- اختلاف scopes وsystems وعدم إنتاج `gyro ≈ 400` لكل الأسلحة.
- FAMAS والـ19 Weapon Profiles.
- deterministic same input + seed.

## ما يزال غير قابل للقياس تلقائياً

1. ارتداد PUBG الحقيقي في كل patch؛ لا يوجد مصدر telemetry رسمي مستخدم هنا.
2. زمن اللمس الحقيقي وtouch latency لكل جلسة.
3. وضعية اليد الفيزيائية من دون calibration يقدمه اللاعب.
4. مهارة اللاعب من دون Training Ground experiments.
5. تأثير attachments الفعلي في كل patch.
6. اختلاف FPS الحقيقي أثناء المباراة إذا لم يسجله اللاعب.
7. تفضيل اللاعب النفسي بين السرعة والدقة من دون اختبار أو user input.

هذه القيود تظهر كمصادر `estimated` أو `expert-defined-normalized` ولا يتم تقديمها على أنها قياسات حقيقية.
