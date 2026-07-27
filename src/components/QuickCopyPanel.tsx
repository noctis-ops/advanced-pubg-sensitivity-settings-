import { useState } from "react";
import { Copy, Check, Camera, Crosshair, RotateCw, Target } from "lucide-react";
import {
  cameraSensitivity,
  adsSensitivity,
  gyroscopeSensitivity,
  adsGyroscopeSensitivity,
  scopeLabels,
  type SensitivityCategory,
} from "../data/sensitivities";

function formatSensitivity(cat: SensitivityCategory): string {
  const scopeKeys = Object.keys(cat.scopes) as (keyof typeof cat.scopes)[];
  let lines = `【 ${cat.labelAr} | ${cat.label} 】\n`;
  scopeKeys.forEach((key) => {
    lines += `${scopeLabels[key].ar}: ${cat.scopes[key]}\n`;
  });
  lines += `Aim TPP: ${cat.aimFeatures.aimTPP}\n`;
  lines += `Aim FPP: ${cat.aimFeatures.aimFPP}\n`;
  return lines;
}

export default function QuickCopyPanel() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const allText = [
    formatSensitivity(cameraSensitivity),
    formatSensitivity(adsSensitivity),
    formatSensitivity(gyroscopeSensitivity),
    formatSensitivity(adsGyroscopeSensitivity),
  ].join("\n");

  const categories = [
    { id: "camera", data: cameraSensitivity, icon: <Camera className="w-4 h-4" />, color: "text-amber-400" },
    { id: "ads", data: adsSensitivity, icon: <Crosshair className="w-4 h-4" />, color: "text-blue-400" },
    { id: "gyro", data: gyroscopeSensitivity, icon: <RotateCw className="w-4 h-4" />, color: "text-green-400" },
    { id: "adsgyro", data: adsGyroscopeSensitivity, icon: <Target className="w-4 h-4" />, color: "text-red-400" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1117]/80 p-5">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Copy className="w-5 h-5 text-amber-400" />
        نسخ سريع للحساسية
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {categories.map(({ id, data, icon, color }) => (
          <button
            key={id}
            onClick={() => copyToClipboard(formatSensitivity(data), id)}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-sm font-medium ${color}`}
          >
            {copiedId === id ? <Check className="w-4 h-4" /> : icon}
            <span className="truncate text-xs">{data.labelAr}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => copyToClipboard(allText, "all")}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30 hover:from-amber-500/30 hover:to-red-500/30 transition-all text-amber-400 font-bold text-sm"
      >
        {copiedId === "all" ? (
          <>
            <Check className="w-4 h-4" /> تم النسخ!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" /> نسخ جميع الحساسيات
          </>
        )}
      </button>
    </div>
  );
}
