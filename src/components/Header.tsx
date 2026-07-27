import { Crosshair, Smartphone, Cpu, Gamepad2 } from "lucide-react";

export default function Header() {
  return (
    <header className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#1a0a2e]" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/15 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium tracking-wider uppercase">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            Pro Combat System v3.0
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              PUBG MOBILE
            </span>
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 mb-4">
            منظومة الحساسية القتالية
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            منظومة احترافية مبنية خوارزمياً لتحقيق أعلى نسبة هيدشوت
            <br className="hidden sm:block" />
            وتتبع مرعب وسيطرة كاملة على الارتداد
          </p>
        </div>

        {/* Device specs */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {[
            { icon: Smartphone, text: "iPhone 15 Pro Max", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
            { icon: Cpu, text: "120 FPS", color: "text-green-400 bg-green-500/10 border-green-500/20" },
            { icon: Crosshair, text: "Full Gyroscope", color: "text-red-400 bg-red-500/10 border-red-500/20" },
            { icon: Gamepad2, text: "5 Fingers Claw", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
          ].map(({ icon: Icon, text, color }) => (
            <div
              key={text}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-medium ${color}`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
