import React from 'react';
import StatusBadge from './StatusBadge';
import { Tag, MapPin, Calendar, Sparkles, Layers, Box } from 'lucide-react';

export default function ClothingCard({ item, onSelectMatch, onViewDetails }) {
  const getConditionStyle = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'bg-emerald-950/90 text-emerald-400 border-emerald-700/60';
      case 'good':
        return 'bg-teal-950/90 text-teal-300 border-teal-700/60';
      case 'fair':
        return 'bg-amber-950/90 text-amber-300 border-amber-700/60';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 shadow-xl shadow-slate-950/40">
      <div>
        {/* Large Clothing Image & Overlay Badges */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-900">
          <img
            src={item.image || '/assets/blue_jacket.jpg'}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

          {/* Status Badge Top Right */}
          <div className="absolute top-3 right-3 shadow-md">
            <StatusBadge status={item.status} />
          </div>

          {/* Condition Pill Top Left */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border backdrop-blur-md ${getConditionStyle(item.condition)}`}>
              {item.condition} Condition
            </span>
          </div>

          {/* Bottom Left Category & Size Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-xs font-bold text-emerald-400 border border-emerald-500/30">
              {item.type} • {item.size}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-xs font-bold text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <Box className="w-3 h-3 text-teal-400" />
              Qty: {item.quantity || 1}
            </span>
          </div>
        </div>

        {/* Card Metadata Details */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
              {item.title}
            </h3>
            {item.conditionDesc && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {item.conditionDesc}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Target: <strong className="text-slate-100">{item.gender} • {item.ageGroup}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate font-medium">{item.location?.city || item.location?.address || "Pudukkottai"}</span>
            </div>

            {item.createdAt && (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] pt-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Donated on {item.createdAt}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between gap-2.5">
        <button
          onClick={() => onViewDetails && onViewDetails(item)}
          className="px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition-all flex-1 text-center border border-slate-700/50"
        >
          View Details
        </button>

        {onSelectMatch && (
          <button
            onClick={() => onSelectMatch(item)}
            className="px-3.5 py-2.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 flex-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Best Connection
          </button>
        )}
      </div>
    </div>
  );
}

