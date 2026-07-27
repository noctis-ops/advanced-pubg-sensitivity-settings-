import { useState } from "react";
import { ChevronDown, Target, Zap } from "lucide-react";
import { type WeaponSensitivity, scopeLabels } from "../data/sensitivities";

interface Props {
  weapon: WeaponSensitivity;
}

const categoryColors: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  "Assault Rifle": { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", bar: "bg-red-500" },
  Sniper: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", bar: "bg-purple-500" },
  Shotgun: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", bar: "bg-orange-500" },
  LMG: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", bar: "bg-cyan-500" },
};

export default function WeaponCard({ weapon }: Props) {
  const [expanded, setExpanded] = useState(false);
  const colors = categoryColors[weapon.category] || categoryColors["Assault Rifle"];
  const scopeKeys = Object.keys(weapon.ads) as (keyof typeof weapon.ads)[];

  return (
    <div
      className={`rounded-2xl border ${colors.border} bg-[#0d1117]/80 backdrop-blur overflow-hidden transition-all duration-300 ${expanded ? "ring-1 ring-white/10" : ""}`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-2xl">{weapon.icon}</span>
        <div className="flex-1 text-right">
          <div className="flex items-center gap-2 justify-end">
            <h4 className="text-base font-bold text-white">{weapon.name}</h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} font-semibold`}>
              {weapon.categoryAr}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            أفضل سكوب: <span className={colors.text}>{weapon.bestScopeAr}</span>
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
          {/* Recoil tip */}
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                نصيحة الارتداد
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed text-right">{weapon.recoilTipAr}</p>
          </div>

          {/* ADS Sensitivity */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-bold text-blue-400">حساسية التصويب ADS</span>
            </div>
            <div className="space-y-1.5">
              {scopeKeys.map((key) => {
                const label = scopeLabels[key];
                const value = weapon.ads[key];
                const maxVal = key === "noScope" ? 150 : 100;
                const pct = (value / maxVal) * 100;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-gray-400">{label.ar}</span>
                      <span className="text-sm font-bold text-blue-400 tabular-nums">{value}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ADS Gyroscope Sensitivity */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-bold text-green-400">حساسية جايروسكوب التصويب ADS Gyro</span>
            </div>
            <div className="space-y-1.5">
              {scopeKeys.map((key) => {
                const label = scopeLabels[key];
                const value = weapon.adsGyro[key];
                const pct = (value / 400) * 100;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-gray-400">{label.ar}</span>
                      <span className="text-sm font-bold text-green-400 tabular-nums">{value}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
