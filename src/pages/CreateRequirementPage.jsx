import React, { useState } from 'react';
import Modal from '../components/common/Modal';
import LiveLocationPicker from '../components/common/LiveLocationPicker';
import { FilePlus, CheckCircle2, Building2, AlertCircle, ArrowLeft, Layers } from 'lucide-react';


export default function CreateRequirementPage({ onAddRequirement, onNavigateToNgoDashboard }) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    orgName: 'Hope Shelter Foundation',
    orgType: 'Shelter',
    clothingType: 'Jacket',
    size: 'M, L',
    genderAge: 'Adult Male',
    quantityRequired: 25,
    urgency: 'Critical',
    location: 'MG Road District, Bengaluru',
    notes: 'Urgent winter jackets needed for nighttime cold spells.'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Math.floor(300 + Math.random() * 900)}`,
      orgName: formData.orgName,
      orgType: formData.orgType,
      clothingType: formData.clothingType,
      size: formData.size,
      genderAge: formData.genderAge,
      quantityRequired: Number(formData.quantityRequired),
      quantityFulfilled: 0,
      urgency: formData.urgency,
      location: formData.location,
      notes: formData.notes,
      datePosted: new Date().toISOString().split('T')[0]
    };

    if (onAddRequirement) onAddRequirement(newReq);
    setShowSuccessModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Back Navigation */}
      <button
        onClick={onNavigateToNgoDashboard}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to NGO Dashboard
      </button>

      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 bg-teal-950 px-3.5 py-1.5 rounded-full border border-teal-800/60">
          Shelter & Community Demand Form
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          Publish Clothing Requirement
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Submit immediate garment needs to be prioritized by ReWear Connect AI matching engine.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Org Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Organization Name</label>
              <input
                type="text"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Organization Type</label>
              <select
                value={formData.orgType}
                onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Shelter">Shelter</option>
                <option value="NGO">NGO</option>
                <option value="Community Center">Community Center</option>
                <option value="Individual">Individual Relief</option>
              </select>
            </div>
          </div>

          {/* Garment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Clothing Type Needed</label>
              <select
                value={formData.clothingType}
                onChange={(e) => setFormData({ ...formData, clothingType: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Jacket">Jacket / Heavy Coat</option>
                <option value="Sweater">Sweater / Fleece</option>
                <option value="Shirt">Shirt</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Pants">Pants / Trousers</option>
                <option value="Jeans">Jeans</option>
                <option value="Dress">Dress</option>
                <option value="Shoes">Shoes / Footwear</option>
                <option value="Other">Other Thermal Apparel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Sizes Required</label>
              <input
                type="text"
                placeholder="e.g. M, L, XL"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Target Demographic & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Target Demographic</label>
              <input
                type="text"
                placeholder="e.g. Adult Male, Child (Age 5-12)"
                value={formData.genderAge}
                onChange={(e) => setFormData({ ...formData, genderAge: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Quantity Required</label>
              <input
                type="number"
                min="1"
                value={formData.quantityRequired}
                onChange={(e) => setFormData({ ...formData, quantityRequired: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Urgency Level Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Urgency Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Low', 'Medium', 'High', 'Critical'].map((lvl) => {
                const isSel = formData.urgency === lvl;
                return (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setFormData({ ...formData, urgency: lvl })}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border ${
                      isSel
                        ? lvl === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border-rose-500 shadow-lg'
                          : lvl === 'High'
                          ? 'bg-orange-950 text-orange-300 border-orange-500 shadow-lg'
                          : 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {lvl} Urgency
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Delivery / Pickup Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <LiveLocationPicker
              locationData={{
                address: formData.location,
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560038'
              }}
              onChangeLocation={(detectedLoc) => {
                setFormData(prev => ({
                  ...prev,
                  location: `${detectedLoc.address}, ${detectedLoc.city} (${detectedLoc.pincode})`
                }));
              }}
            />
          </div>


          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Additional Requirement Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Specify fabric preferences, weather context, or emergency shelter details..."
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-sm font-extrabold transition-all shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2"
            >
              <FilePlus className="w-5 h-5" />
              Publish Requirement
            </button>
          </div>

        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Requirement Published! 🚀"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Your clothing requirement for <strong className="text-white">{formData.clothingType} ({formData.quantityRequired} items)</strong> has been published and fed into ReWear Connect AI matching stream.
          </p>

          <button
            onClick={() => {
              setShowSuccessModal(false);
              if (onNavigateToNgoDashboard) onNavigateToNgoDashboard();
            }}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg"
          >
            Go to NGO Dashboard
          </button>
        </div>
      </Modal>

    </div>
  );
}
