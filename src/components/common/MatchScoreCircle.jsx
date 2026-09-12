import React from 'react';

export default function MatchScoreCircle({ score = 95, size = 'md', showLabel = true }) {
  const radius = size === 'lg' ? 42 : size === 'sm' ? 24 : 32;
  const stroke = size === 'lg' ? 7 : size === 'sm' ? 4 : 5;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const widthHeight = radius * 2;

  // Determine color based on score
  let strokeColor = "#10b981"; // emerald-500
  let textColor = "text-emerald-400";
  let bgGlow = "rgba(16, 185, 129, 0.2)";

  if (score < 80) {
    strokeColor = "#06b6d4"; // cyan-500
    textColor = "text-cyan-400";
    bgGlow = "rgba(6, 182, 212, 0.2)";
  } else if (score >= 90) {
    strokeColor = "#10b981"; // emerald
    textColor = "text-emerald-400";
    bgGlow = "rgba(16, 185, 129, 0.3)";
  }

  return (
    <div className="relative inline-flex items-center justify-center flex-col">
      <svg
        height={widthHeight}
        width={widthHeight}
        className="transform -rotate-90 transition-all duration-700"
        style={{ filter: `drop-shadow(0 0 8px ${bgGlow})` }}
      >
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={`font-extrabold tracking-tight ${textColor} ${
          size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-xs' : 'text-base'
        }`}>
          {score}%
        </span>
        {size === 'lg' && showLabel && (
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Match</span>
        )}
      </div>
    </div>
  );
}
