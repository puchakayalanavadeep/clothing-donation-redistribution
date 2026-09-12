import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import ImpactCard from '../components/common/ImpactCard';
import RequirementCard from '../components/common/RequirementCard';
import Modal from '../components/common/Modal';
import { 
  Building2, Layers, Truck, Sparkles, Users, PlusCircle, 
  FilePlus, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { MOCK_NGO_REQUIREMENTS } from '../data/mockData';

export default function NgoDashboard({ user, requirements = MOCK_NGO_REQUIREMENTS, onNavigate, onEditReq }) {
  const [activeTab, setActiveTab] = useState('ngo-dashboard');
  const [reqList, setReqList] = useState(requirements);
  const [selectedReqToUpdate, setSelectedReqToUpdate] = useState(null);
  const [addQty, setAddQty] = useState(5);

  const ngoName = user?.name || 'Hope Shelter Foundation';

  const activeReqCount = reqList.length;
  const incomingDonations = 3;
  const successfulMatches = 42;
  const peopleSupported = 120;

  const handleUpdateQuantity = (req) => {
    setSelectedReqToUpdate(req);
  };

  const confirmQuantityUpdate = () => {
    if (!selectedReqToUpdate) return;
    setReqList(prev => prev.map(r => {
      if (r.id === selectedReqToUpdate.id) {
        return { ...r, quantityFulfilled: Math.min(r.quantityRequired, r.quantityFulfilled + Number(addQty)) };
      }
      return r;
    }));
    setSelectedReqToUpdate(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <Sidebar
          role="NGO"
          user={user}
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-950 px-2.5 py-1 rounded-full border border-teal-800/50">
                  Verified NGO Hub
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
                {ngoName} Portal
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage demand listings and incoming smart matched donations.
              </p>
            </div>


            <button
              onClick={() => onNavigate && onNavigate('create-requirement')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
            >
              <FilePlus className="w-4 h-4" />
              Post New Requirement
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ImpactCard
              icon={Layers}
              title="Active Requirements"
              value={activeReqCount.toString()}
              unit="listings"
              subtext="Open shelter needs"
              color="emerald"
            />
            <ImpactCard
              icon={Truck}
              title="Incoming Donations"
              value={incomingDonations.toString()}
              unit="shipments"
              subtext="En route to shelter"
              color="cyan"
            />
            <ImpactCard
              icon={Sparkles}
              title="Successful Matches"
              value={successfulMatches.toString()}
              unit="matched"
              subtext="Garment demands fulfilled"
              color="teal"
            />
            <ImpactCard
              icon={Users}
              title="People Supported"
              value={peopleSupported.toString()}
              unit="individuals"
              subtext="Community beneficiaries"
              color="amber"
            />
          </div>

          {/* Current Clothing Requirements Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Current Clothing Requirements</h3>
                <p className="text-xs text-slate-400">Live listings visible to ReWear Connect AI matching engine</p>
              </div>

              <button
                onClick={() => onNavigate && onNavigate('create-requirement')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                + Publish Requirement
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reqList.map((req) => (
                <RequirementCard
                  key={req.id}
                  req={req}
                  onEdit={onEditReq}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* Update Quantity Modal */}
      <Modal
        isOpen={!!selectedReqToUpdate}
        onClose={() => setSelectedReqToUpdate(null)}
        title="Update Requirement Fulfillment"
      >
        {selectedReqToUpdate && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              Update quantity fulfilled for <strong className="text-white">{selectedReqToUpdate.clothingType}</strong>
            </p>

            <div>
              <label className="block text-slate-400 mb-1">Add Fulfilled Items</label>
              <input
                type="number"
                min="1"
                value={addQty}
                onChange={(e) => setAddQty(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={confirmQuantityUpdate}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
              >
                Save Progress
              </button>
              <button
                onClick={() => setSelectedReqToUpdate(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
