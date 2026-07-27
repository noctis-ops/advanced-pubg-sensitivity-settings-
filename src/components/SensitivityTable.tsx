import { type SensitivityCategory, scopeLabels } from "../data/sensitivities";

interface Props {
  data: SensitivityCategory;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  icon: React.ReactNode;
}

export default function SensitivityTable({ data, colorClass, bgClass, borderClass, icon }: Props) {
  const scopeKeys = Object.keys(data.scopes) as (keyof typeof data.scopes)[];

  return (
    <div className={`rounded-2xl border ${borderClass} ${bgClass} overflow-hidden`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${colorClass}`}>{data.labelAr}</h3>
          <p className="text-xs text-gray-500 font-medium">{data.label}</p>
        </div>
      </div>

      {/* Scope values */}
      <div className="p-4 space-y-2">
        {scopeKeys.map((key) => {
          const label = scopeLabels[key];
          const value = data.scopes[key];
          const isGyro = data.label.toLowerCase().includes("gyroscope");
          const maxVal = isGyro ? 400 : (key === "noScope" ? 200 : 100);
          const percentage = (value / maxVal) * 100;

          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300 font-medium">{label.ar}</span>
                  <span className="text-[10px] text-gray-600">{label.en}</span>
                </div>
                <span className={`text-lg font-black ${colorClass} tabular-nums`}>{value}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${colorClass.includes("amber") ? "bg-amber-500" : colorClass.includes("blue") ? "bg-blue-500" : colorClass.includes("green") ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Aim Features */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">
            Aim Features (إعدادات التصويب المتقدمة)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-lg bg-white/[0.03]">
              <p className="text-[10px] text-gray-500 mb-0.5">Aim TPP</p>
              <p className={`text-xl font-black ${colorClass}`}>{data.aimFeatures.aimTPP}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/[0.03]">
              <p className="text-[10px] text-gray-500 mb-0.5">Aim FPP</p>
              <p className={`text-xl font-black ${colorClass}`}>{data.aimFeatures.aimFPP}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
