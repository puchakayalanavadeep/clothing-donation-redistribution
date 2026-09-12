import React from 'react';
import ImpactCard from '../components/common/ImpactCard';
import { 
  Heart, Sparkles, Truck, ShieldCheck, ArrowRight, Recycle, 
  Layers, MapPin, Users, CheckCircle2, TrendingUp, Cpu, Leaf
} from 'lucide-react';
import { GLOBAL_STATS } from '../data/mockData';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-24 pb-12">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-8 animate-fade-in shadow-lg shadow-emerald-950/50">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI-Powered Circular Apparel Redistribution</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            Give Clothes a <span className="gradient-text-emerald">Second Life</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Smartly connect clothing donations with people and organizations that need them most. Zero waste, optimized logistics, direct community impact.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNavigate('donate')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-base transition-all transform hover:-translate-y-1 shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-slate-950" />
              Donate Clothes
            </button>
            
            <button
              onClick={() => onNavigate('explore')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card hover:bg-slate-800/80 text-white font-bold text-base transition-all border border-slate-700 hover:border-emerald-500/40 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5 text-teal-400" />
              Find Clothing
            </button>
          </div>

          {/* Hero Visual Asset Flow Section */}
          <div className="glass-panel rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative max-w-5xl mx-auto overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2 text-left">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Ecosystem Visualizer</span>
                <h3 className="text-lg font-bold text-white">Smart Match Flow Architecture</h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Network
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950">
              <img
                src="/assets/hero_sustainability.jpg"
                alt="Circular Fashion Ecosystem"
                className="w-full h-auto object-cover max-h-[480px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              {/* Overlay Flow Indicator */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-700/80">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">1. Donor Submits</h4>
                    <p className="text-[11px] text-slate-400">Garment details & location</p>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-emerald-400 hidden md:block shrink-0" />

                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">2. AI Smart Match</h4>
                    <p className="text-[11px] text-slate-400">Scores demand, size & location</p>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-emerald-400 hidden md:block shrink-0" />

                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">3. Recipient Receives</h4>
                    <p className="text-[11px] text-slate-400">Shelters & NGOs empowered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATISTICS CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ImpactCard
            icon={Recycle}
            title="Clothes Redistributed"
            value="12,500+"
            unit="items"
            subtext="Redirected from landfills"
            trend="+24% this month"
            color="emerald"
          />
          <ImpactCard
            icon={Users}
            title="Active Donors"
            value="3,200+"
            unit="people"
            subtext="Community contributors"
            trend="+18% growth"
            color="teal"
          />
          <ImpactCard
            icon={ShieldCheck}
            title="Partner NGOs"
            value="150+"
            unit="orgs"
            subtext="Verified shelters & hubs"
            trend="100% verified"
            color="cyan"
          />
          <ImpactCard
            icon={Leaf}
            title="Textile Waste Reduced"
            value="8.5"
            unit="Tons"
            subtext="Carbon emissions saved"
            trend="3,400km saved"
            color="amber"
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-800/60">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            How ReWear Connect Works
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Intelligent algorithm matches garment specifications with real-time shelter demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-xl mb-4 border border-emerald-500/30">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">Step 1: Donate Your Clothes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload photos, select garment type, size, condition, and pickup address in under 2 minutes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-extrabold text-xl mb-4 border border-cyan-500/30">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">Step 2: AI Analyzes Details</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our smart engine categorizes clothing parameters (warmth, size, durability, gender) for optimal fit.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-extrabold text-xl mb-4 border border-teal-500/30">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Step 3: Smart Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates match scores (90%+) considering recipient urgency, location proximity, and immediate need.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-xl mb-4 border border-amber-500/30">
              04
            </div>
            <h3 className="text-base font-bold text-white mb-2">Step 4: Garments Redistributed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optimized logistics pick up donated items and deliver directly to nearby shelters and verified NGOs.
            </p>
          </div>

        </div>
      </section>

      {/* WHY CIRCULAR THREADS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/60">
                Sustainable Innovation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Why ReWear Connect?
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Traditional donation drives often result in excess unwanted clothes shipped across continents or discarded. ReWear Connect ensures precision redistribution.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('smart-matching')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 hover:from-emerald-400 hover:to-teal-300 transition-all shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Try Best Connection Demo
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Leaf className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Reduce Textile Waste</h4>
                <p className="text-xs text-slate-400">Prevents usable garments from entering landfills by extending product lifecycles.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Smart Requirement Matching</h4>
                <p className="text-xs text-slate-400">Algorithms match exact size, gender, and climate needs with recipient requests.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Reduce Transportation</h4>
                <p className="text-xs text-slate-400">Hyper-local matching minimizes fuel consumption and delivery carbon footprints.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Help Communities</h4>
                <p className="text-xs text-slate-400">Directly serves local shelters, orphanages, and disaster relief centers.</p>
              </div>

              <div className="sm:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Transparent Redistribution</h4>
                <p className="text-xs text-slate-400">Donors receive real-time verification and digital proof when their clothes reach recipients.</p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* STRONG CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 p-8 sm:p-14 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Your unused clothes can make a difference.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of donors and NGOs building a zero-waste, compassionate fashion ecosystem today.
            </p>
            <div>
              <button
                onClick={() => onNavigate('donate')}
                className="px-9 py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-base transition-all transform hover:scale-105 shadow-xl shadow-emerald-950/60 inline-flex items-center gap-2"
              >
                <Heart className="w-5 h-5 fill-slate-950" />
                Start Donating
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
