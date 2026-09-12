import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import ImpactCard from '../components/common/ImpactCard';
import ClothingCard from '../components/common/ClothingCard';
import ProgressBar from '../components/common/ProgressBar';
import { Package, Sparkles, Users, Leaf, Heart, PlusCircle, ArrowRight, TrendingUp, Filter, CheckCircle2, MapPin } from 'lucide-react';
import { INITIAL_DONATIONS } from '../data/mockData';

export default function DonorDashboard({ user, donations = INITIAL_DONATIONS, onNavigate, onSelectMatch, onViewDetails }) {
  const [activeTab, setActiveTab] = useState('donor-dashboard');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Available' | 'Matched' | 'Delivered'

  const userName = user?.name || 'Navadeep';
  const userCity = user?.city || 'Pudukkottai';

  const totalDonations = donations.length;
  const matchedCount = donations.filter(d => d.status === 'Matched' || d.status === 'Delivered' || d.status === 'Collected').length;
  const peopleHelped = matchedCount * 4 + 12; 
  const co2SavedKg = matchedCount * 8.5; 

  const filteredDonations = donations.filter(d => {
    if (statusFilter === 'Available') return d.status === 'Available';
    if (statusFilter === 'Matched') return d.status === 'Matched' || d.status === 'Matching in Progress';
    if (statusFilter === 'Delivered') return d.status === 'Delivered' || d.status === 'Collected';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <Sidebar
          role="Donor"
          user={user}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (onNavigate) onNavigate(tab);
          }}
        />


        {/* Main Dashboard Area */}
        <main className="flex-1 space-y-8">
          
          {/* Welcome Header */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/50">
                  Active Donor Profile
                </span>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  {userCity}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
                Welcome back, {userName} 👋
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                You have <strong className="text-emerald-400 font-bold">{donations.length} clothing items</strong> registered in your donation portfolio.
              </p>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('donate')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Donate New Item
            </button>
          </div>

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ImpactCard
              icon={Package}
              title="Total Donated Items"
              value={totalDonations.toString()}
              unit="items"
              subtext="Submitted to platform"
              color="emerald"
            />
            <ImpactCard
              icon={Sparkles}
              title="Successfully Matched"
              value={matchedCount.toString()}
              unit="items"
              subtext="Matched with local NGOs"
              color="cyan"
            />
            <ImpactCard
              icon={Users}
              title="People Benefited"
              value={peopleHelped.toString()}
              unit="lives"
              subtext="Shelter residents"
              color="teal"
            />
            <ImpactCard
              icon={Leaf}
              title="CO₂ & Waste Saved"
              value={co2SavedKg.toFixed(1)}
              unit="kg"
              subtext="Landfill diverted"
              color="amber"
            />
          </div>

          {/* Impact Visualization Section */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Your Circular Fashion Footprint
                </h3>
                <p className="text-xs text-slate-400">Environmental conservation score based on your active clothing donations</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/60">
                Tier 2 Eco-Champion 🏆
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <ProgressBar label="Textile Waste Diversion Rate" percentage={88} color="emerald" />
              <ProgressBar label="Local Proximity Match Score" percentage={94} color="cyan" />
              <ProgressBar label="Recipient Urgency Fulfillment" percentage={78} color="amber" />
            </div>
          </div>

          {/* My Donated Items Section */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-400" />
                  My Donated Clothing Items ({filteredDonations.length})
                </h3>
                <p className="text-xs text-slate-400">View real-time matching status, quantity, and recipient allocations for all your items.</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold self-start sm:self-auto">
                <button
                  onClick={() => setStatusFilter('All')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${statusFilter === 'All' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  All ({donations.length})
                </button>
                <button
                  onClick={() => setStatusFilter('Available')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${statusFilter === 'Available' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  Available
                </button>
                <button
                  onClick={() => setStatusFilter('Matched')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${statusFilter === 'Matched' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  Matched
                </button>
              </div>
            </div>

            {filteredDonations.length === 0 ? (
              <div className="glass-card rounded-3xl p-10 text-center text-slate-400 space-y-3 border border-slate-800">
                <Package className="w-10 h-10 mx-auto text-slate-600" />
                <h4 className="text-sm font-bold text-white">No Donated Items Found in this Category</h4>
                <p className="text-xs">Click Below to donate your first garment.</p>
                <button
                  onClick={() => onNavigate && onNavigate('donate')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Donate Clothes Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonations.map((item) => (
                  <ClothingCard
                    key={item.id}
                    item={item}
                    onSelectMatch={onSelectMatch}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

