import { Move, Gauge, Eye, Maximize, Search } from "lucide-react";
import { additionalSettings } from "../data/sensitivities";

export default function AdditionalSettingsPanel() {
  const s = additionalSettings;

  const items = [
    {
      icon: <Move className="w-5 h-5" />,
      label: "حجم زر الحركة",
      labelEn: "Movement Button Size",
      value: `${s.movementButtonSize}%`,
      note: s.movementButtonSizeNoteAr,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: "حساسية الركض",
      labelEn: "Sprint Sensitivity",
      value: s.sprintSensitivity,
      note: s.sprintNoteAr,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: "حساسية الطلعة",
      labelEn: "Peek Sensitivity",
      value: s.peekSensitivity,
      note: s.peekNoteAr,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: <Maximize className="w-5 h-5" />,
      label: "مجال الرؤية FOV",
      labelEn: "Field of View",
      value: s.fov,
      note: s.fovNoteAr,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      icon: <Search className="w-5 h-5" />,
      label: "النظرة الحرة",
      labelEn: "Free Look Sensitivity",
      value: s.freeLookSensitivity,
      note: s.freeLookNoteAr,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.labelEn}
          className={`rounded-2xl border ${item.border} ${item.bg} p-4 hover:bg-white/[0.03] transition-colors`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${item.color}`}>{item.label}</p>
              <p className="text-[10px] text-gray-500 font-medium">{item.labelEn}</p>
              <p className={`text-3xl font-black ${item.color} mt-2 tabular-nums`}>{item.value}</p>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{item.note}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
