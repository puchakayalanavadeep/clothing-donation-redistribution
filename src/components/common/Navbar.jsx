import React, { useState } from 'react';
import { RefreshCw, Bell, User, Menu, X, Sparkles, ChevronDown, HeartHandshake, ShieldCheck, Heart, LayoutDashboard, PlusCircle, Globe, LogOut } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, activeRole, setActiveRole, notificationCount = 3, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Your donation 'Navy Blue Winter Jacket' matched Hope Shelter (95% score)!", time: "10m ago", unread: true },
    { id: 2, text: "Sunshine Children's Home published a new urgent sweater request.", time: "1h ago", unread: true },
    { id: 3, text: "Impact Milestone: ReWear Connect saved 8.5 Tons of textile waste!", time: "1d ago", unread: false },
  ];

  const handleNav = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDashboardPageForRole = (role) => {
    if (role === 'Donor') return 'donor-dashboard';
    if (role === 'NGO') return 'ngo-dashboard';
    if (role === 'Admin') return 'admin-dashboard';
    return 'donor-dashboard';
  };

  const getUserInitials = (name) => {
    if (!name) return 'ND';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('landing')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-900/40 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-white tracking-tight">ReWear Connect</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                AI SMART
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Smart Clothing Redistribution</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => handleNav('landing')}
            className={`px-4 py-2 rounded-full transition-all ${
              activePage === 'landing' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('donate')}
            className={`px-4 py-2 rounded-full transition-all ${
              activePage === 'donate' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Donate
          </button>
          <button
            onClick={() => handleNav('explore')}
            className={`px-4 py-2 rounded-full transition-all ${
              activePage === 'explore' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => handleNav('smart-matching')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1 ${
              activePage === 'smart-matching' || activePage === 'match-explanation'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md'
                : 'text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Best Connection
          </button>
          <button
            onClick={() => handleNav('impact')}
            className={`px-4 py-2 rounded-full transition-all ${
              activePage === 'impact' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Impact
          </button>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          
          {/* Role Switcher Pill for Demo */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-medium text-slate-200 hover:border-emerald-500/50 transition-all"
              title="Switch user perspective (Donor, NGO, Admin)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 hidden sm:inline">Role:</span>
              <strong className="text-emerald-300 font-bold">{activeRole}</strong>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-2 z-50 animate-fade-in">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Select Perspective
                </div>
                <button
                  onClick={() => { setActiveRole('Donor'); setActivePage('donor-dashboard'); setRoleMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left ${activeRole === 'Donor' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Heart className="w-4 h-4 text-emerald-400" />
                  Donor View
                </button>
                <button
                  onClick={() => { setActiveRole('NGO'); setActivePage('ngo-dashboard'); setRoleMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left ${activeRole === 'NGO' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <HeartHandshake className="w-4 h-4 text-teal-400" />
                  NGO / Recipient View
                </button>
                <button
                  onClick={() => { setActiveRole('Admin'); setActivePage('admin-dashboard'); setRoleMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left ${activeRole === 'Admin' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Admin Panel
                </button>
              </div>
            )}
          </div>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all border border-slate-700/60"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center animate-bounce">
                  {notificationCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded-full">
                    {notifications.filter(n => n.unread).length} New
                  </span>
                </div>
                <div className="space-y-2 mt-3 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-xl text-xs ${n.unread ? 'bg-slate-800/90 border border-emerald-500/30' : 'bg-slate-950/40 text-slate-400'}`}>
                      <p className="text-slate-200 font-medium">{n.text}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Dashboard Action */}
          <button
            onClick={() => handleNav(getDashboardPageForRole(activeRole))}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            Dashboard
          </button>

          {/* Logged In User Profile Chip OR Login/Register Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-[10px]">
                  {getUserInitials(user.name)}
                </div>
                <span className="text-emerald-300 font-bold truncate max-w-[100px]">
                  {user.name || 'Navadeep'}
                </span>
              </div>

              <button
                onClick={() => onLogout && onLogout()}
                className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('login')}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                activePage === 'login'
                  ? 'bg-emerald-400 text-slate-950 shadow-emerald-950/50'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 p-4 space-y-2 text-sm animate-fade-in">
          <button
            onClick={() => handleNav('landing')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium ${activePage === 'landing' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('donate')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium ${activePage === 'donate' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}
          >
            Donate Clothes
          </button>
          <button
            onClick={() => handleNav('smart-matching')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 ${activePage === 'smart-matching' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-400'}`}
          >
            <Sparkles className="w-4 h-4" />
            Best Connection Recommendations
          </button>
          <button
            onClick={() => handleNav('explore')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium ${activePage === 'explore' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}
          >
            Explore Donations
          </button>
          <button
            onClick={() => handleNav('impact')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium ${activePage === 'impact' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'}`}
          >
            Impact & Analytics
          </button>
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNav(getDashboardPageForRole(activeRole))}
              className="w-full py-2.5 text-center bg-slate-800 rounded-xl font-semibold text-emerald-300 flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to {activeRole} Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
