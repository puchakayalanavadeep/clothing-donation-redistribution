import React from 'react';
import { 
  LayoutDashboard, Heart, Sparkles, PieChart, User, Settings, 
  Package, FilePlus, HeartHandshake, Truck, ShieldCheck, Users, 
  BarChart3, FileText, Layers, LogOut
} from 'lucide-react';

export default function Sidebar({ role = 'Donor', user, activeTab, setActiveTab, onNavigate }) {
  const displayName = user?.name || (role === 'Donor' ? 'Navadeep' : role === 'NGO' ? 'Hope Shelter Org' : 'System Admin');
  const userInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const getNavItems = () => {
    if (role === 'Donor') {
      return [
        { id: 'donor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'donate', label: 'Donate Clothes', icon: Heart, badge: 'New' },
        { id: 'my-donations', label: 'My Donations', icon: Package, count: 6 },
        { id: 'smart-matching', label: 'Matches', icon: Sparkles },
        { id: 'impact', label: 'Impact', icon: PieChart },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    if (role === 'NGO') {
      return [
        { id: 'ngo-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'create-requirement', label: 'Post Requirement', icon: FilePlus, highlight: true },
        { id: 'ngo-requirements', label: 'My Requirements', icon: Layers, count: 4 },
        { id: 'explore', label: 'Available Matches', icon: Sparkles },
        { id: 'incoming-donations', label: 'Incoming Donations', icon: Truck, count: 3 },
        { id: 'distribution-history', label: 'History', icon: Package },
        { id: 'profile', label: 'Profile', icon: User },
      ];
    }

    // Admin Role
    return [
      { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'admin-users', label: 'Users', icon: Users, count: 128 },
      { id: 'admin-donations', label: 'Donations', icon: Package },
      { id: 'admin-orgs', label: 'Organizations', icon: HeartHandshake, count: 42 },
      { id: 'admin-matches', label: 'Matches', icon: Sparkles },
      { id: 'impact', label: 'Reports', icon: BarChart3 },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-full md:w-64 glass-panel rounded-3xl p-4 border border-slate-800 shrink-0 self-start">
      {/* User profile header badge */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-0.5 shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-emerald-400 text-sm">
            {userInitials}
          </div>
        </div>
        <div className="overflow-hidden">
          <h4 className="text-xs font-bold text-white truncate">
            {displayName} 👋
          </h4>
          <span className="text-[10px] font-semibold text-emerald-400 block truncate">
            {role} Portal
          </span>
        </div>
      </div>


      {/* Navigation list */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onNavigate) onNavigate(item.id);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-extrabold">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && (
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Switcher CTA */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/40">
          <p className="text-[11px] font-semibold text-emerald-300 mb-1">♻️ Zero Textile Waste</p>
          <p className="text-[10px] text-slate-400">Smart routing reduces emissions by 40%.</p>
        </div>
      </div>
    </aside>
  );
}
