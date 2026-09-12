import React, { useState } from 'react';
import MatchScoreCircle from '../components/common/MatchScoreCircle';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import { 
  Building2, MapPin, CheckCircle2, ShieldCheck, ArrowRight, 
  Map, Sparkles, Truck, Heart, ArrowLeft, AlertCircle 
} from 'lucide-react';

export default function MatchExplanationPage({ recipient, onBack, onConfirmRedistribution }) {
  const [showMapModal, setShowMapModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Default to Hope Shelter Foundation if none provided
  const targetRecipient = recipient || {
    id: "NGO-201",
    name: "Hope Shelter Foundation",
    type: "Shelter",
    verified: true,
    distanceKm: 3.2,
    matchScore: 95,
    currentRequirement: "Urgent winter jackets & thermal apparel for adult men in temporary winter housing.",
    peopleBenefited: 45,
    urgency: "Critical",
    location: "MG Road District, 3.2 km away",
    breakdown: {
      clothingCompatibility: 100,
      sizeMatch: 95,
      currentDemand: 98,
      locationProximity: 90,
      urgencyLevel: 92
    },
    reasoning: [
      "Currently has a high requirement for winter clothing for adult men",
      "Donated item is size M and in Excellent condition",
      "Located within 3.2 km, minimizing transport carbon emissions",
      "High urgency requirement serving 45 homeless individuals"
    ],
    contactPerson: "Dr. Rajesh Kumar",
    phone: "+91 98765 43210"
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Smart Recommendations
      </button>

      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3.5 py-1.5 rounded-full border border-emerald-800/60">
          AI Transparency Breakdown
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          Why is this the Best Match?
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
          Detailed breakdown showing why ReWear Connect algorithm recommended {targetRecipient.name}.
        </p>
      </div>

      {/* Main Recipient Summary Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 relative overflow-hidden bg-slate-900/90 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Recommended Recipient</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" title="Verified Partner" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">{targetRecipient.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{targetRecipient.type} • {targetRecipient.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MatchScoreCircle score={targetRecipient.matchScore} size="lg" />
          </div>
        </div>
      </div>

      {/* AI Reasoning Categories with Progress Bars */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Algorithm Compatibility Breakdown
        </h3>

        <div className="space-y-4">
          <ProgressBar
            label="Clothing Compatibility"
            percentage={targetRecipient.breakdown.clothingCompatibility}
            color="emerald"
          />
          <ProgressBar
            label="Size Match (Medium / Adult)"
            percentage={targetRecipient.breakdown.sizeMatch}
            color="emerald"
          />
          <ProgressBar
            label="Current Shelter Demand Urgency"
            percentage={targetRecipient.breakdown.currentDemand}
            color="teal"
          />
          <ProgressBar
            label="Location Proximity (3.2 km)"
            percentage={targetRecipient.breakdown.locationProximity}
            color="cyan"
          />
          <ProgressBar
            label="Urgency & Need Level"
            percentage={targetRecipient.breakdown.urgencyLevel}
            color="amber"
          />
        </div>
      </div>

      {/* Detailed Narrative Explanation Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Matching Logic Explanation</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          "This organization currently has a high requirement for winter clothing for adult men. The donated jacket is size M and in excellent condition, making it highly suitable. The organization is located nearby, reducing transportation requirements and environmental impact."
        </p>

        <div className="pt-2 space-y-2 text-xs text-slate-300">
          <h4 className="font-bold text-white">Key Matching Reasons:</h4>
          {targetRecipient.reasoning.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={() => setShowMapModal(true)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-card hover:bg-slate-800 text-slate-200 font-bold text-xs transition-all border border-slate-700 flex items-center justify-center gap-2"
        >
          <Map className="w-4 h-4 text-teal-400" />
          View on Map
        </button>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          Confirm Redistribution
        </button>
      </div>

      {/* Map View Modal */}
      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        title={`Location Map: ${targetRecipient.name}`}
      >
        <div className="space-y-4">
          <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">{targetRecipient.name}</p>
              <p className="text-xs text-slate-400">{targetRecipient.location}</p>
              <span className="inline-block text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                Route Distance: {targetRecipient.distanceKm} km (Est. Pickup 15 mins)
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowMapModal(false)}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
          >
            Close Map
          </button>
        </div>
      </Modal>

      {/* Confirm Redistribution Success Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Redistribution Confirmed! 🚚"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-pulse">
            <Heart className="w-8 h-8 fill-emerald-400" />
          </div>

          <h3 className="text-lg font-bold text-white">Matching Locked & Courier Scheduled</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your donated garment has been reserved for <strong className="text-emerald-400">{targetRecipient.name}</strong>. Our eco-friendly electric courier will collect the item on your preferred date.
          </p>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-1">
            <span className="text-emerald-400 font-bold">Match ID: MTH-9842</span>
            <p className="text-slate-300">Recipient: {targetRecipient.name}</p>
            <p className="text-slate-400">Carbon Offset Saved: 4.2 kg CO₂</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setShowConfirmModal(false);
                if (onConfirmRedistribution) onConfirmRedistribution(targetRecipient);
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
