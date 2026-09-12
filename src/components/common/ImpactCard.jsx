import React from 'react';

export default function ImpactCard({ icon: Icon, title, value, unit, subtext, trend, color = "emerald" }) {
  let iconBg = "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30";
  let glowColor = "shadow-emerald-950/40";

  if (color === "cyan") {
    iconBg = "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30";
  } else if (color === "amber") {
    iconBg = "from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30";
  } else if (color === "teal") {
    iconBg = "from-teal-500/20 to-emerald-500/10 text-teal-300 border-teal-500/30";
  }

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border border-slate-800 shadow-lg ${glowColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
            {unit && <span className="text-sm font-semibold text-emerald-400">{unit}</span>}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconBg} border flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{subtext}</span>
          {trend && (
            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
