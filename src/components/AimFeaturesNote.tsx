import { Settings, CheckCircle2 } from "lucide-react";

export default function AimFeaturesNote() {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
          <Settings className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-amber-400 mb-2">
            ⚠️ تفعيل Aim Features — إلزامي
          </h3>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            يجب تفعيل Aim Features من الإعدادات المتقدمة في اللعبة. هذا الخيار يضيف قيم Aim TPP و Aim FPP
            في كل من: حساسية الكاميرا، حساسية التصويب، حساسية الجايروسكوب، وحساسية جايروسكوب التصويب.
          </p>

          <div className="space-y-2">
            {[
              "اذهب إلى Settings → Sensitivity → Advanced",
              'فعّل "Aim Features" أو "Aim Assist Options"',
              "ستظهر خيارات Aim TPP و Aim FPP في كل قسم حساسية",
              "أدخل القيم المحددة لكل قسم كما هو موضح أعلاه",
              "تأكد من ضبطها في الأقسام الأربعة جميعها",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-gray-300">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
