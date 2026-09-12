import React, { useState } from 'react';
import Modal from '../components/common/Modal';
import LiveLocationPicker from '../components/common/LiveLocationPicker';
import { 
  Upload, CheckCircle2, MapPin, Calendar, Sparkles, 
  ArrowRight, ArrowLeft, Shirt, Tag, Star, Image as ImageIcon, Heart
} from 'lucide-react';


export default function DonateClothesPage({ onAddDonation, onNavigateToSmartMatch }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newDonationData, setNewDonationData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Jacket',
    gender: 'Male',
    ageGroup: 'Adult',
    size: 'M',
    condition: 'Excellent',
    conditionDesc: 'Looks almost new',
    address: '42 Greenfield Avenue, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    quantity: 1,
    description: 'Clean insulated jacket ready for immediate winter redistribution.',
    preferredPickupDate: '2026-09-16',
    imagePreview: '/assets/blue_jacket.jpg'
  });

  const clothingTypes = ['Shirt', 'T-Shirt', 'Pants', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Shoes', 'Other'];
  const genders = ['Male', 'Female', 'Unisex'];
  const ageGroups = ['Child', 'Teen', 'Adult', 'Senior'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const conditions = [
    {
      name: 'Excellent',
      desc: 'Looks almost new',
      rating: '5/5 Quality',
      color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
    },
    {
      name: 'Good',
      desc: 'Minor signs of use',
      rating: '4/5 Quality',
      color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
    },
    {
      name: 'Fair',
      desc: 'Usable but visibly worn',
      rating: '3/5 Quality',
      color: 'border-amber-500 bg-amber-950/40 text-amber-300'
    }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imagePreview: url }));
    }
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const createdItem = {
      id: `DON-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title || `${formData.gender} ${formData.condition} ${formData.type}`,
      type: formData.type,
      size: formData.size,
      gender: formData.gender,
      ageGroup: formData.ageGroup,
      condition: formData.condition,
      conditionDesc: formData.conditionDesc,
      quantity: Number(formData.quantity),
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      donorName: "Navadeep",
      preferredPickupDate: formData.preferredPickupDate,
      status: "Matching in Progress",
      image: formData.imagePreview || "/assets/blue_jacket.jpg",
      createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    setNewDonationData(createdItem);
    if (onAddDonation) onAddDonation(createdItem);
    setShowSuccessModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-800/60">
          Smart Circular Donation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          Donate Clothes
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Complete the details below to enable AI recipient matching
        </p>
      </div>

      {/* Step Indicator Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 mb-8 border border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold">
          {[
            { step: 1, label: 'Clothing Info' },
            { step: 2, label: 'Condition' },
            { step: 3, label: 'Pickup Location' },
            { step: 4, label: 'Details & Submit' },
          ].map((item) => (
            <div
              key={item.step}
              className={`flex items-center gap-2 ${
                currentStep >= item.step ? 'text-emerald-400 font-bold' : 'text-slate-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                  currentStep === item.step
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/60 ring-4 ring-emerald-950'
                    : currentStep > item.step
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {currentStep > item.step ? <CheckCircle2 className="w-4 h-4" /> : item.step}
              </div>
              <span className="hidden sm:inline">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-step Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: CLOTHING INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shirt className="w-5 h-5 text-emerald-400" />
                Step 1: Clothing Information
              </h3>

              {/* Title input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Item Title / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Navy Blue Winter Jacket"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Upload image */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Upload Clothing Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 hover:border-emerald-500/50 transition-colors">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-xl border border-slate-700"
                  />
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs text-slate-300 font-medium">Drag & drop image or choose file</p>
                    <p className="text-[10px] text-slate-400">JPG, PNG or WEBP up to 5MB</p>
                    <label className="inline-block px-4 py-2 mt-2 rounded-xl bg-slate-800 text-emerald-400 font-semibold text-xs cursor-pointer hover:bg-slate-700 transition-all border border-slate-700">
                      Browse File
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Clothing Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Clothing Type</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {clothingTypes.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setFormData({ ...formData, type })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                        formData.type === type
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Gender Suitability</label>
                  <div className="grid grid-cols-3 gap-2">
                    {genders.map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                          formData.gender === g
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                            : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Age Group</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ageGroups.map((ag) => (
                      <button
                        type="button"
                        key={ag}
                        onClick={() => setFormData({ ...formData, ageGroup: ag })}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                          formData.ageGroup === ag
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                            : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        {ag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Size</label>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => setFormData({ ...formData, size: sz })}
                      className={`py-2 rounded-xl text-xs font-extrabold border ${
                        formData.size === sz
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: CONDITION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-400" />
                Step 2: Clothing Condition
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {conditions.map((cond) => {
                  const isSelected = formData.condition === cond.name;
                  return (
                    <div
                      key={cond.name}
                      onClick={() => setFormData({ ...formData, condition: cond.name, conditionDesc: cond.desc })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? cond.color + ' shadow-xl'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-bold text-white">{cond.name}</h4>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mb-3">"{cond.desc}"</p>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-700">
                        {cond.rating}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Detailed Condition Notes</label>
                <textarea
                  rows={3}
                  value={formData.conditionDesc}
                  onChange={(e) => setFormData({ ...formData, conditionDesc: e.target.value })}
                  placeholder="Describe any minor wear, buttons, zippers, or fabric cleanliness..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-400" />
                Step 3: Pickup Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Pickup Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Live Location Detector & Interactive Map */}
              <LiveLocationPicker
                locationData={{
                  address: formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                  lat: formData.lat,
                  lng: formData.lng
                }}
                onChangeLocation={(detectedLoc) => {
                  setFormData(prev => ({
                    ...prev,
                    address: detectedLoc.address || prev.address,
                    city: detectedLoc.city || prev.city,
                    state: detectedLoc.state || prev.state,
                    pincode: detectedLoc.pincode || prev.pincode,
                    lat: detectedLoc.lat,
                    lng: detectedLoc.lng
                  }));
                }}
              />

            </div>
          )}

          {/* STEP 4: ADDITIONAL DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Step 4: Additional Details & Confirmation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Quantity (Number of Garments)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Preferred Pickup Date</label>
                  <input
                    type="date"
                    value={formData.preferredPickupDate}
                    onChange={(e) => setFormData({ ...formData, preferredPickupDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Additional Description / Notes</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Summary Box */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-2 text-xs">
                <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Smart Match Ready Summary
                </h4>
                <p className="text-slate-300">
                  {formData.title || 'Donated Item'} ({formData.type}) • Size {formData.size} • {formData.gender} • Condition: {formData.condition}
                </p>
                <p className="text-slate-400 text-[11px]">
                  Pickup Address: {formData.address}, {formData.city}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Buttons Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-sm font-extrabold transition-all shadow-xl shadow-emerald-950/60 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                Submit Donation
              </button>
            )}
          </div>

        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thank You for Donating! 🎉"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Our smart matching system will find the most suitable recipient for your clothing based on size, climate urgency, and proximity.
          </p>

          {newDonationData && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-1">
              <span className="text-emerald-400 font-bold block">Donation Reference: {newDonationData.id}</span>
              <p className="text-white font-medium">{newDonationData.title} ({newDonationData.size})</p>
              <p className="text-slate-400">Status: <span className="text-cyan-400 font-semibold">Matching in Progress</span></p>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setShowSuccessModal(false);
                if (onNavigateToSmartMatch) onNavigateToSmartMatch(newDonationData);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              View Best Connection Recommendations
            </button>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
