import React from 'react';
import { RefreshCw, Heart, Leaf, Shield, Globe, Mail, Phone, MapPin, Share2, MessageCircle } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate && onNavigate('landing')}>
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">ReWear Connect</span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Smart clothing donation & redistribution platform preventing textile waste and empowering local communities through AI-driven demand matching.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate && onNavigate('landing')} className="hover:text-emerald-400 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('donate')} className="hover:text-emerald-400 transition-colors">
                  Donate Garments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('smart-matching')} className="hover:text-emerald-400 transition-colors">
                  Smart AI Matching
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-emerald-400 transition-colors">
                  Explore Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('impact')} className="hover:text-emerald-400 transition-colors">
                  Impact Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* NGOs & Partners */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-[11px]">For Organizations</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate && onNavigate('ngo-dashboard')} className="hover:text-emerald-400 transition-colors">
                  NGO Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('create-requirement')} className="hover:text-emerald-400 transition-colors">
                  Publish Requirement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('admin-dashboard')} className="hover:text-emerald-400 transition-colors">
                  Partner Verification
                </button>
              </li>
              <li>
                <a href="#privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy & Data Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-[11px]">Contact & Eco-Alerts</h4>
            <p className="text-slate-400 text-xs mb-3">Subscribe for circular fashion impact updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button className="px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all">
                Join
              </button>
            </div>
            <div className="mt-4 space-y-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>contact@rewearconnect.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Bengaluru Innovation Hub</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© 2026 ReWear Connect Platform. Built for Hackathons & Sustainability Innovation.</p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
            <Leaf className="w-3.5 h-3.5" />
            <span>Zero Textile Waste to Landfill</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
