import React from 'react';

export default function StatusBadge({ status }) {
  let styleClasses = "bg-slate-800 text-slate-300 border-slate-700";
  let dotColor = "bg-slate-400";

  switch (status) {
    case 'Available':
      styleClasses = "bg-emerald-950/60 text-emerald-400 border-emerald-800/60";
      dotColor = "bg-emerald-400 animate-pulse";
      break;
    case 'Matching in Progress':
      styleClasses = "bg-cyan-950/60 text-cyan-400 border-cyan-800/60";
      dotColor = "bg-cyan-400 animate-pulse";
      break;
    case 'Matched':
      styleClasses = "bg-teal-950/60 text-teal-300 border-teal-800/60";
      dotColor = "bg-teal-400";
      break;
    case 'Collected':
      styleClasses = "bg-amber-950/60 text-amber-300 border-amber-800/60";
      dotColor = "bg-amber-400";
      break;
    case 'Delivered':
      styleClasses = "bg-emerald-900/40 text-emerald-300 border-emerald-700/50";
      dotColor = "bg-emerald-300";
      break;
    case 'Verified':
    case 'Active':
      styleClasses = "bg-emerald-950/80 text-emerald-300 border-emerald-700/80";
      dotColor = "bg-emerald-400";
      break;
    case 'Critical':
      styleClasses = "bg-rose-950/80 text-rose-300 border-rose-800/80";
      dotColor = "bg-rose-400 animate-ping";
      break;
    case 'High':
      styleClasses = "bg-orange-950/70 text-orange-300 border-orange-800/70";
      dotColor = "bg-orange-400";
      break;
    case 'Medium':
      styleClasses = "bg-amber-950/60 text-amber-300 border-amber-800/60";
      dotColor = "bg-amber-400";
      break;
    case 'Low':
      styleClasses = "bg-slate-800/80 text-slate-300 border-slate-700";
      dotColor = "bg-slate-400";
      break;
    case 'Pending':
      styleClasses = "bg-amber-950/50 text-amber-400 border-amber-800/50";
      dotColor = "bg-amber-400 animate-pulse";
      break;
    case 'Suspended':
      styleClasses = "bg-red-950/60 text-red-400 border-red-800/60";
      dotColor = "bg-red-500";
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styleClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}
