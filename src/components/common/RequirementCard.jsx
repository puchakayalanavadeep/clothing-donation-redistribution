import React from 'react';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { Building2, MapPin, Package, Edit2, AlertCircle } from 'lucide-react';

export default function RequirementCard({ req, onEdit, onUpdateQuantity }) {
  const fulfillmentPct = Math.min(100, Math.round((req.quantityFulfilled / req.quantityRequired) * 100));

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[11px] font-semibold uppercase text-emerald-400 tracking-wider">
              {req.orgType} Requirement
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">{req.clothingType}</h4>
            <p className="text-xs text-slate-400">{req.orgName}</p>
          </div>
          <StatusBadge status={req.urgency} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-4 text-slate-300 bg-slate-900/60 p-3 rounded-xl">
          <div>
            <span className="text-slate-400 block text-[11px]">Size Needed</span>
            <strong className="text-white font-semibold">{req.size}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Target Demographic</span>
            <strong className="text-white font-semibold">{req.genderAge}</strong>
          </div>
        </div>

        {req.notes && (
          <p className="text-xs text-slate-400 mb-4 line-clamp-2 italic">
            "{req.notes}"
          </p>
        )}

        <div className="space-y-1 mb-4">
          <ProgressBar
            label={`Fulfilled ${req.quantityFulfilled} of ${req.quantityRequired} items`}
            percentage={fulfillmentPct}
            color={fulfillmentPct > 70 ? "emerald" : "amber"}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span className="truncate max-w-[140px]">{req.location}</span>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(req)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Edit Requirement"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onUpdateQuantity && (
            <button
              onClick={() => onUpdateQuantity(req)}
              className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 transition-all font-medium text-[11px]"
            >
              + Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
