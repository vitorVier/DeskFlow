import { FiFileText, FiCheckCircle, FiUsers } from "react-icons/fi";

interface DashboardCardProps {
  label: string;
  value: number;
  color: "red" | "green" | "blue";
}

export function DashboardCard({ label, value, color }: DashboardCardProps) {
  const config = {
    red: {
      gradient: "from-red-500/20 via-red-500/10 to-transparent",
      border: "border-red-500/30",
      glow: "group-hover:shadow-[0_0_40px_rgba(239,68,68,0.3)]",
      text: "text-red-400",
      icon: <FiFileText size={28} />,
      accentGlow: "bg-red-500/20",
      pulse: "bg-red-500",
    },
    green: {
      gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
      border: "border-emerald-500/30",
      glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]",
      text: "text-emerald-400",
      icon: <FiCheckCircle size={28} />,
      accentGlow: "bg-emerald-500/20",
      pulse: "bg-emerald-500",
    },
    blue: {
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      border: "border-cyan-500/30",
      glow: "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]",
      text: "text-cyan-400",
      icon: <FiUsers size={28} />,
      accentGlow: "bg-cyan-500/20",
      pulse: "bg-cyan-500",
    },
  };

  const style = config[color];

  return (
    <div className="group relative">
      {/* Borda neon externa */}
      <div className={`absolute -inset-0.5 bg-linear-to-r ${style.gradient} rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500`} />
      
      {/* Card principal */}
      <div className={`
        relative overflow-hidden rounded-2xl border ${style.border} 
        bg-slate-900/80 backdrop-blur-xl p-6
        transition-all duration-500 hover:-translate-y-1 ${style.glow}
      `}>
        {/* Grid de fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size[2rem_2rem] opacity-20" />
        
        {/* Efeito de luz no canto */}
        <div className={`absolute -top-12 -right-12 w-32 h-32 ${style.accentGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Conteúdo */}
        <div className="relative z-10">
          {/* Header com ícone e status */}
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-xl bg-slate-800/50 border ${style.border} ${style.text} backdrop-blur-sm`}>
              {style.icon}
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${style.pulse} rounded-full animate-pulse`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Tempo Real
              </span>
            </div>
          </div>

          {/* Label */}
          <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            {label}
          </h2>

          {/* Valor principal */}
          <div className="flex items-end gap-2">
            <span className={`text-5xl md:text-6xl font-black ${style.text} tracking-tight leading-none`}>
              {value.toLocaleString()}
            </span>
            
            {/* Indicador de mudança (decorativo) */}
            <div className="mb-2 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700">
              <svg className={`w-3 h-3 ${style.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-xs font-bold text-gray-400">Live</span>
            </div>
          </div>

          {/* Linha decorativa inferior */}
          <div className={`mt-6 h-1 w-full bg-linear-to-r ${style.gradient} rounded-full`} />
        </div>

        {/* Efeito de scan animado */}
        <div className={`absolute inset-0 bg-linear-to-r ${style.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}>
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent translate-y-full group-hover:-translate-y-full transition-transform duration-[3s] ease-linear" />
        </div>
      </div>
    </div>
  );
}