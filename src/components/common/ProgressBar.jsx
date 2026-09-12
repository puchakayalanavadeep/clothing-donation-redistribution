import React from 'react';

export default function ProgressBar({ label, percentage, color = "emerald", showPercentage = true }) {
  let barGradient = "from-emerald-500 to-teal-400";
  let textColor = "text-emerald-400";

  if (color === 'cyan') {
    barGradient = "from-cyan-500 to-blue-400";
    textColor = "text-cyan-400";
  } else if (color === 'amber') {
    barGradient = "from-amber-500 to-yellow-400";
    textColor = "text-amber-400";
  } else if (color === 'rose') {
    barGradient = "from-rose-500 to-red-400";
    textColor = "text-rose-400";
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs font-medium">
        <span className="text-slate-300">{label}</span>
        {showPercentage && <span className={`font-bold ${textColor}`}>{percentage}%</span>}
      </div>
      <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
