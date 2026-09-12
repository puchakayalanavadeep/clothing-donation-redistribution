import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import ImpactCard from '../components/common/ImpactCard';
import StatusBadge from '../components/common/StatusBadge';
import { Users, Package, HeartHandshake, Sparkles, ShieldCheck, Check, X, Search, MoreVertical } from 'lucide-react';
import { ADMIN_USERS, INITIAL_DONATIONS, MOCK_RECIPIENTS } from '../data/mockData';

export default function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('admin-dashboard');
  const [users, setUsers] = useState(ADMIN_USERS);
  const [selectedSubView, setSelectedSubView] = useState('overview');

  const handleVerify = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Verified' } : u));
  };

  const handleSuspend = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Suspended' } : u));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <Sidebar
          role="Admin"
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (onNavigate) onNavigate(tab);
          }}
        />

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          
          {/* Header */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800/50">
                System Administration
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
                Platform Control & Monitoring
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Oversee users, verified shelter NGOs, active garment donations, and AI match logs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                System Health: 100% Operational
              </span>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ImpactCard
              icon={Users}
              title="Total Platform Users"
              value="3,430"
              unit="accounts"
              subtext="Donors & NGOs"
              color="emerald"
            />
            <ImpactCard
              icon={Package}
              title="Total Donations"
              value="12,540"
              unit="garments"
              subtext="Logged in system"
              color="cyan"
            />
            <ImpactCard
              icon={HeartHandshake}
              title="Active Partner NGOs"
              value="154"
              unit="organizations"
              subtext="Verified shelters"
              color="teal"
            />
            <ImpactCard
              icon={Sparkles}
              title="Successful Matches"
              value="11,890"
              unit="completed"
              subtext="96% accuracy score"
              color="amber"
            />
          </div>

          {/* Pending NGO Verifications Table */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Organization Verification & Access Requests
                </h3>
                <p className="text-xs text-slate-400">Review non-profit tax documents & identity proofs</p>
              </div>

              <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800/60">
                {users.filter(u => u.status === 'Pending').length} Action Required
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">User / Org Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-semibold text-white">
                        {u.name}
                        {u.org && <span className="block text-[11px] text-slate-400">{u.org}</span>}
                      </td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3 text-slate-400">{u.email}</td>
                      <td className="p-3">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {u.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleVerify(u.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleSuspend(u.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                            >
                              Reject
                            </button>
                          </>
                        ) : u.status === 'Verified' || u.status === 'Active' ? (
                          <button
                            onClick={() => handleSuspend(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerify(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Match Activity Stream Table */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Recent Match Activity Stream</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Donation ID</th>
                    <th className="p-3">Item Details</th>
                    <th className="p-3">Matched Recipient</th>
                    <th className="p-3">Match Score</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {INITIAL_DONATIONS.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-emerald-400">{d.id}</td>
                      <td className="p-3 font-semibold text-white">{d.title} ({d.size})</td>
                      <td className="p-3 text-slate-300">Hope Shelter Foundation</td>
                      <td className="p-3 font-bold text-emerald-400">95%</td>
                      <td className="p-3">
                        <StatusBadge status={d.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
