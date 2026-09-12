import React, { useState } from 'react';
import ClothingCard from '../components/common/ClothingCard';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import { Search, Filter, Sparkles, MapPin, Tag, Calendar, User, X, Box, Check } from 'lucide-react';
import { INITIAL_DONATIONS } from '../data/mockData';

export default function ExploreDonationsPage({ donations = INITIAL_DONATIONS, onSelectMatch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Clothes');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [viewItemModal, setViewItemModal] = useState(null);

  const categories = [
    'All Clothes',
    'Shirts',
    'T-Shirts',
    'Pants',
    'Track Pants',
    'Boys Clothing',
    'Girls Clothing'
  ];

  const genders = ['All', 'Male', 'Female', 'Unisex'];
  const ageGroups = ['All', 'Adult', 'Teen', 'Child', 'Senior'];
  const sizes = ['All', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '10-12 Years', '8-10 Years', '6-8 Years'];
  const conditions = ['All', 'Excellent', 'Good', 'Fair'];
  const locations = ['All', 'Pudukkottai', 'Bengaluru'];

  const filteredItems = donations.filter((item) => {
    // Search Query filter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location?.address || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Top Category Quick Filters
    let matchesCategory = true;
    if (activeCategory === 'Shirts') {
      matchesCategory = item.type === 'Shirt';
    } else if (activeCategory === 'T-Shirts') {
      matchesCategory = item.type === 'T-Shirt';
    } else if (activeCategory === 'Pants') {
      matchesCategory = item.type === 'Pants' || item.type === 'Jeans';
    } else if (activeCategory === 'Track Pants') {
      matchesCategory = item.type === 'Track Pants';
    } else if (activeCategory === 'Boys Clothing') {
      matchesCategory = (item.ageGroup === 'Child' || item.ageGroup === 'Teen') && (item.gender === 'Male' || item.gender === 'Unisex');
    } else if (activeCategory === 'Girls Clothing') {
      matchesCategory = (item.ageGroup === 'Child' || item.ageGroup === 'Teen') && (item.gender === 'Female' || item.gender === 'Unisex');
    }

    // Dropdown Filters
    const matchesGender = selectedGender === 'All' || item.gender === selectedGender;
    const matchesAgeGroup = selectedAgeGroup === 'All' || item.ageGroup === selectedAgeGroup;
    const matchesSize = selectedSize === 'All' || item.size === selectedSize;
    const matchesCondition = selectedCondition === 'All' || item.condition === selectedCondition;
    const matchesLocation = selectedLocation === 'All' || (item.location?.city || '').includes(selectedLocation);

    return matchesSearch && matchesCategory && matchesGender && matchesAgeGroup && matchesSize && matchesCondition && matchesLocation;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('All Clothes');
    setSelectedGender('All');
    setSelectedAgeGroup('All');
    setSelectedSize('All');
    setSelectedCondition('All');
    setSelectedLocation('All');
  };

  const isFiltered =
    searchQuery ||
    activeCategory !== 'All Clothes' ||
    selectedGender !== 'All' ||
    selectedAgeGroup !== 'All' ||
    selectedSize !== 'All' ||
    selectedCondition !== 'All' ||
    selectedLocation !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-800/80 inline-block shadow-md">
          Redistribution Marketplace
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Available Clothing Donations
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Browse verified, clean garment donations available for direct community shelter matching and redistribution.
        </p>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 whitespace-nowrap flex items-center gap-2 border ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-950/50 scale-105'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Controls Box */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800/90 space-y-5 shadow-2xl shadow-slate-950/60">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clothing by type, size, condition, city (e.g. Pudukkottai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs pt-3 border-t border-slate-800/80">
          
          {/* Gender Filter */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-bold">Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Age Group Filter */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-bold">Age Group</label>
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {ageGroups.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-bold">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-bold">Condition</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {conditions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Location Filter */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-slate-400 mb-1.5 font-bold">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

        </div>

      </div>

      {/* Garments Grid & Status Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing <strong className="text-emerald-400 font-extrabold text-sm">{filteredItems.length}</strong> clothing items</span>
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-emerald-400 font-bold hover:underline flex items-center gap-1 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/40"
            >
              <X className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 text-slate-400 space-y-3">
            <Tag className="w-12 h-12 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No Matching Clothing Items Found</h3>
            <p className="text-xs">Try selecting a different category or click reset filters.</p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 text-xs font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onSelectMatch={onSelectMatch}
                onViewDetails={(item) => setViewItemModal(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details View Modal */}
      <Modal
        isOpen={!!viewItemModal}
        onClose={() => setViewItemModal(null)}
        title={viewItemModal?.title || "Donation Details"}
      >
        {viewItemModal && (
          <div className="space-y-4">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
              <img
                src={viewItemModal.image || '/assets/blue_jacket.jpg'}
                alt={viewItemModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status={viewItemModal.status} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Donor: <strong className="text-emerald-300">{viewItemModal.donorName || "Community Donor"}</strong>
              </span>
              <span className="text-xs font-bold text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800/60">
                Available Qty: {viewItemModal.quantity || 1}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div><span className="text-slate-400 block font-medium">Clothing Type:</span> <strong className="text-white text-sm">{viewItemModal.type}</strong></div>
              <div><span className="text-slate-400 block font-medium">Size:</span> <strong className="text-white text-sm">{viewItemModal.size}</strong></div>
              <div><span className="text-slate-400 block font-medium">Condition:</span> <strong className="text-emerald-400 font-bold text-sm">{viewItemModal.condition}</strong></div>
              <div><span className="text-slate-400 block font-medium">Target Audience:</span> <strong className="text-white text-sm">{viewItemModal.gender} • {viewItemModal.ageGroup}</strong></div>
              <div className="col-span-2 border-t border-slate-800/80 pt-2">
                <span className="text-slate-400 block font-medium">Pickup Location:</span>
                <strong className="text-slate-200">{viewItemModal.location?.address}, {viewItemModal.location?.city} ({viewItemModal.location?.pincode})</strong>
              </div>
            </div>

            {viewItemModal.conditionDesc && (
              <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/50">
                "{viewItemModal.conditionDesc}"
              </p>
            )}

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  const target = viewItemModal;
                  setViewItemModal(null);
                  if (onSelectMatch) onSelectMatch(target);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <Sparkles className="w-4 h-4" />
                Find Best Match with Smart AI
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
