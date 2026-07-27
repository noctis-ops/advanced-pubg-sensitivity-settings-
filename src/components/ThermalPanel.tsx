import { Thermometer, AlertTriangle, CheckCircle, Flame } from "lucide-react";
import { thermalAdjustments, cameraSensitivity, adsSensitivity, gyroscopeSensitivity, adsGyroscopeSensitivity } from "../data/sensitivities";

export default function ThermalPanel() {
  const statusIcons = [
    <CheckCircle className="w-5 h-5 text-green-400" />,
    <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    <Flame className="w-5 h-5 text-red-400" />,
  ];

  const statusColors = [
    { border: "border-green-500/20", bg: "bg-green-500/5", text: "text-green-400" },
    { border: "border-yellow-500/20", bg: "bg-yellow-500/5", text: "text-yellow-400" },
    { border: "border-red-500/20", bg: "bg-red-500/5", text: "text-red-400" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
          <Thermometer className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">التعديلات الحرارية وانخفاض الفريمات</h3>
          <p className="text-xs text-gray-500">Thermal & FPS Drop Adjustments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {thermalAdjustments.map((adj, i) => {
          const colors = statusColors[i];
          const calcValue = (base: number, mult: number) => Math.round(base * mult);

          return (
            <div key={adj.fps} className={`rounded-2xl border ${colors.border} ${colors.bg} p-5`}>
              <div className="flex items-center gap-2 mb-4">
                {statusIcons[i]}
                <div>
                  <p className={`text-sm font-bold ${colors.text}`}>{adj.scenarioAr}</p>
                  <p className="text-[10px] text-gray-500">{adj.fps}</p>
                </div>
              </div>

              {/* Multipliers */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "كاميرا", mult: adj.cameraMultiplier },
                  { label: "تصويب", mult: adj.adsMultiplier },
                  { label: "جايرو", mult: adj.gyroMultiplier },
                  { label: "جايرو ADS", mult: adj.adsGyroMultiplier },
                ].map((m) => (
                  <div key={m.label} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-gray-500 mb-0.5">{m.label}</p>
                    <p className={`text-sm font-bold ${colors.text}`}>×{m.mult}</p>
                  </div>
                ))}
              </div>

              {/* Adjusted key values */}
              <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 mb-3">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                  القيم المعدّلة (Red Dot)
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">كاميرا:</span>
                    <span className={`font-bold ${colors.text}`}>
                      {calcValue(cameraSensitivity.scopes.redDot, adj.cameraMultiplier)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">تصويب:</span>
                    <span className={`font-bold ${colors.text}`}>
                      {calcValue(adsSensitivity.scopes.redDot, adj.adsMultiplier)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">جايرو:</span>
                    <span className={`font-bold ${colors.text}`}>
                      {calcValue(gyroscopeSensitivity.scopes.redDot, adj.gyroMultiplier)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">جايرو ADS:</span>
                    <span className={`font-bold ${colors.text}`}>
                      {calcValue(adsGyroscopeSensitivity.scopes.redDot, adj.adsGyroMultiplier)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">{adj.notesAr}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
