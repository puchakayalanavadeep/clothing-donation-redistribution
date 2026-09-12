import React, { useState } from 'react';
import MatchCard from '../components/common/MatchCard';
import MatchScoreCircle from '../components/common/MatchScoreCircle';
import StatusBadge from '../components/common/StatusBadge';
import { Sparkles, SlidersHorizontal, Tag, MapPin, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { MOCK_RECIPIENTS } from '../data/mockData';

export default function SmartMatchingPage({ selectedItem, onSelectRecipientMatch, onViewExplanation }) {
  const [recipients, setRecipients] = useState(MOCK_RECIPIENTS);
  const [sortBy, setSortBy] = useState('score');
  const [filterType, setFilterType] = useState('All');

  // Default item if none selected
  const activeGarment = selectedItem || {
    id: "DON-101",
    title: "Blue Winter Jacket",
    type: "Jacket",
    size: "M",
    condition: "Excellent",
    gender: "Male",
    ageGroup: "Adult",
    image: "/assets/blue_jacket.jpg",
    location: { city: "Bengaluru", pincode: "560038" }
  };

  const handleSortChange = (criterion) => {
    setSortBy(criterion);
    let sorted = [...recipients];
    if (criterion === 'score') {
      sorted.sort((a, b) => b.matchScore - a.matchScore);
    } else if (criterion === 'distance') {
      sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (criterion === 'people') {
      sorted.sort((a, b) => b.peopleBenefited - a.peopleBenefited);
    }
    setRecipients(sorted);
  };

  const filteredRecipients = recipients.filter(r => {
    if (filterType === 'All') return true;
    return r.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Page Banner */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-bold mb-3">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>AI Demand Matching Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Best Connection Recommendations
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Intelligently calculated suitability based on garment attributes, shelter urgency, and proximity.
        </p>
      </div>

      {/* Selected Donated Item Header Card */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/40 relative overflow-hidden bg-slate-900/90 shadow-xl shadow-emerald-950/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={activeGarment.image}
              alt={activeGarment.title}
              className="w-24 h-24 rounded-2xl object-cover border border-emerald-500/30 shrink-0"
            />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                Selected Garment for Redistribution
              </span>
              <h2 className="text-xl font-extrabold text-white mt-0.5">{activeGarment.title}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-slate-700 font-semibold">
                  Size: {activeGarment.size}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 font-semibold">
                  Condition: {activeGarment.condition}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-teal-300 border border-slate-700 font-semibold">
                  Suitable for: {activeGarment.ageGroup} {activeGarment.gender}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <div className="text-left text-xs">
              <span className="text-slate-400 block text-[10px]">Algorithm Scan</span>
              <strong className="text-emerald-400">4 Optimal NGO Matches Found</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Sorting & Filter Controls */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter:
          </span>
          {['All', 'Shelter', 'NGO', 'Community Center'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                filterType === type
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Sort dropdown buttons */}
        <div className="flex items-center gap-2 text-xs w-full md:w-auto justify-end">
          <span className="text-slate-400 font-semibold shrink-0">Sort by:</span>
          <button
            onClick={() => handleSortChange('score')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              sortBy === 'score'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Highest Score
          </button>
          <button
            onClick={() => handleSortChange('distance')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              sortBy === 'distance'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Nearest Distance
          </button>
          <button
            onClick={() => handleSortChange('people')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              sortBy === 'people'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Most Beneficiaries
          </button>
        </div>

      </div>

      {/* Recipient Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipients.map((recipient) => (
          <MatchCard
            key={recipient.id}
            recipient={recipient}
            onSelectMatch={onSelectRecipientMatch}
            onViewExplanation={onViewExplanation}
          />
        ))}
      </div>

    </div>
  );
}
