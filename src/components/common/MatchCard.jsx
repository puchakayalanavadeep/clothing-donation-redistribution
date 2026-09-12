import React from 'react';
import MatchScoreCircle from './MatchScoreCircle';
import StatusBadge from './StatusBadge';
import { Building2, MapPin, Users, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MatchCard({ recipient, onSelectMatch, onViewExplanation }) {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 relative border border-slate-700/60 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{recipient.name}</h3>
                {recipient.verified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" title="Verified Partner Organization" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-semibold text-teal-300 border border-slate-700">
                  {recipient.type}
                </span>
                <StatusBadge status={recipient.urgency} />
              </div>
            </div>
          </div>

          <MatchScoreCircle score={recipient.matchScore} size="md" />
        </div>

        {/* Requirements description */}
        <p className="text-xs text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <strong className="text-emerald-400 font-medium">Need: </strong>
          {recipient.currentRequirement}
        </p>

        {/* Reason checklist */}
        <div className="space-y-1.5 mb-5 text-xs text-slate-300">
          {recipient.reasoning?.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Location and Beneficiaries */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-5 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4 text-teal-400" />
            <span>{recipient.location || `${recipient.distanceKm} km away`}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{recipient.peopleBenefited} People Benefit</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => onViewExplanation && onViewExplanation(recipient)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 transition-all border border-slate-700/60 text-center"
        >
          Why Match?
        </button>

        <button
          onClick={() => onSelectMatch && onSelectMatch(recipient)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-xs font-bold text-slate-950 transition-all shadow-md shadow-emerald-950/50 flex items-center justify-center gap-1.5"
        >
          Select Match
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
