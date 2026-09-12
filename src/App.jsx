import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import DonorDashboard from './pages/DonorDashboard';
import DonateClothesPage from './pages/DonateClothesPage';
import SmartMatchingPage from './pages/SmartMatchingPage';
import MatchExplanationPage from './pages/MatchExplanationPage';
import NgoDashboard from './pages/NgoDashboard';
import CreateRequirementPage from './pages/CreateRequirementPage';
import ExploreDonationsPage from './pages/ExploreDonationsPage';
import ImpactPage from './pages/ImpactPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

// Mock Dataset
import { INITIAL_DONATIONS, MOCK_RECIPIENTS, MOCK_NGO_REQUIREMENTS } from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [activeRole, setActiveRole] = useState('Donor'); // 'Donor' | 'NGO' | 'Admin'
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState({
    name: 'Navadeep',
    email: 'navadeepasw@gmail.com',
    role: 'Donor',
    city: 'Pudukkottai',
    phone: '+91 98765 00000'
  });

  // Application Data State
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [requirements, setRequirements] = useState(MOCK_NGO_REQUIREMENTS);
  const [selectedGarmentForMatch, setSelectedGarmentForMatch] = useState(INITIAL_DONATIONS[0]);
  const [selectedRecipientForExplanation, setSelectedRecipientForExplanation] = useState(MOCK_RECIPIENTS[0]);

  // Handlers
  const handleAddDonation = (newDonation) => {
    setDonations(prev => [newDonation, ...prev]);
    setSelectedGarmentForMatch(newDonation);
  };

  const handleAddRequirement = (newReq) => {
    setRequirements(prev => [newReq, ...prev]);
  };

  const handleSelectMatchForGarment = (item) => {
    setSelectedGarmentForMatch(item);
    setActivePage('smart-matching');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecipientMatch = (recipient) => {
    setSelectedRecipientForExplanation(recipient);
    setActivePage('match-explanation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewExplanation = (recipient) => {
    setSelectedRecipientForExplanation(recipient);
    setActivePage('match-explanation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmRedistribution = (recipient) => {
    if (selectedGarmentForMatch) {
      setDonations(prev => prev.map(d => {
        if (d.id === selectedGarmentForMatch.id) {
          return { ...d, status: 'Matched', matchedRecipientId: recipient.id };
        }
        return d;
      }));
    }
    setActivePage('donor-dashboard');
  };

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    setActiveRole(userObj.role);
    if (userObj.role === 'NGO') {
      setActivePage('ngo-dashboard');
    } else if (userObj.role === 'Admin') {
      setActivePage('admin-dashboard');
    } else {
      setActivePage('donor-dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation Renderer
  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage onNavigate={setActivePage} />;

      case 'login':
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={setActivePage}
          />
        );

      case 'donor-dashboard':
      case 'my-donations':
      case 'profile':
      case 'settings':
        return (
          <DonorDashboard
            user={currentUser}
            donations={donations}
            onNavigate={setActivePage}
            onSelectMatch={handleSelectMatchForGarment}
            onViewDetails={(item) => handleSelectMatchForGarment(item)}
          />
        );

      case 'donate':
        return (
          <DonateClothesPage
            onAddDonation={handleAddDonation}
            onNavigateToSmartMatch={(item) => {
              setSelectedGarmentForMatch(item);
              setActivePage('smart-matching');
            }}
          />
        );

      case 'smart-matching':
        return (
          <SmartMatchingPage
            selectedItem={selectedGarmentForMatch}
            onSelectRecipientMatch={handleSelectRecipientMatch}
            onViewExplanation={handleViewExplanation}
          />
        );

      case 'match-explanation':
        return (
          <MatchExplanationPage
            recipient={selectedRecipientForExplanation}
            onBack={() => setActivePage('smart-matching')}
            onConfirmRedistribution={handleConfirmRedistribution}
          />
        );

      case 'ngo-dashboard':
      case 'incoming-donations':
      case 'distribution-history':
      case 'ngo-requirements':
        return (
          <NgoDashboard
            user={currentUser}
            requirements={requirements}
            onNavigate={setActivePage}
            onEditReq={(req) => setActivePage('create-requirement')}
          />
        );

      case 'create-requirement':
        return (
          <CreateRequirementPage
            onAddRequirement={handleAddRequirement}
            onNavigateToNgoDashboard={() => setActivePage('ngo-dashboard')}
          />
        );

      case 'explore':
        return (
          <ExploreDonationsPage
            donations={donations}
            onSelectMatch={handleSelectMatchForGarment}
          />
        );

      case 'impact':
        return <ImpactPage />;

      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-donations':
      case 'admin-orgs':
      case 'admin-matches':
        return <AdminDashboard onNavigate={setActivePage} />;

      default:
        return <LandingPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActivePage} />


    </div>
  );
}
