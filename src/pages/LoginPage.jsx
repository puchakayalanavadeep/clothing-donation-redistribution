import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Leaf, Shirt, Users, RefreshCw, KeyRound, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onNavigate }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('Donor'); // 'Donor' | 'NGO' | 'Admin'
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' | 'password'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Pudukkottai');

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email -> 2: OTP & New Password
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);


  // Timer countdown hook for OTP expiration
  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      setStatusMessage({ type: 'error', text: 'OTP expired. Please click Resend OTP.' });
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Request OTP via SMTP API
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: isRegister ? 'register' : 'login' })
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setTimer(300);
        setTimerActive(true);
        setStatusMessage({
          type: 'success',
          text: `Verification OTP sent to ${email}. Please check your email inbox.`
        });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to send OTP.' });
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setStatusMessage({ type: 'error', text: 'Server connection error. Please ensure backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP API
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setStatusMessage({ type: 'error', text: 'Please enter the 6-digit OTP code.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otpCode,
          role,
          name: name || (role === 'NGO' ? 'Hope Shelter Foundation' : role === 'Admin' ? 'ReWear Connect Admin' : 'Karthik Subramanian'),
          phone,
          city,
          purpose: isRegister ? 'register' : 'login'
        })
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.user || createMockUser());
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Invalid OTP code. Please check your email inbox.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Connection error while verifying OTP.' });
    } finally {
      setLoading(false);
    }
  };


  const createMockUser = () => ({
    name: name || (role === 'NGO' ? 'Hope Shelter Foundation' : role === 'Admin' ? 'ReWear Connect Admin' : 'Karthik Subramanian'),
    email: email || `${role.toLowerCase()}@rewearconnect.org`,
    role: role,
    city: city || 'Pudukkottai',
    phone: phone || '+91 98765 11111',
    avatar: role === 'NGO' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
  });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatusMessage({ type: 'error', text: 'Please fill in both email and password.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    const endpoint = isRegister ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: name || email.split('@')[0],
          role
        })
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.user || createMockUser());
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Authentication failed.' });
      }
    } catch (err) {
      console.error('Password auth error:', err);
      setStatusMessage({ type: 'error', text: 'Server connection error. Please ensure backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  // Send Password Reset OTP
  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatusMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setResetStep(2);
        setStatusMessage({ type: 'success', text: data.message || 'Password reset OTP sent to your email.' });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to request password reset.' });
      }
    } catch (err) {
      console.error('Error sending reset OTP:', err);
      setStatusMessage({ type: 'error', text: 'Server connection error. Please ensure backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  // Reset Password & Log In
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetOtp || !newPassword || !confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match. Please re-enter.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: resetOtp, newPassword })
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.user || createMockUser());
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to reset password.' });
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setStatusMessage({ type: 'error', text: 'Server connection error. Please ensure backend is running.' });
    } finally {
      setLoading(false);
    }
  };



  const handleQuickDemo = (demoRole) => {
    setRole(demoRole);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let mockUser;
      if (demoRole === 'Donor') {
        mockUser = {
          name: 'Karthik Subramanian',
          email: 'karthik@example.com',
          role: 'Donor',
          city: 'Pudukkottai',
          phone: '+91 98765 11111',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
        };
      } else if (demoRole === 'NGO') {
        mockUser = {
          name: 'Hope Shelter Foundation',
          email: 'info@hopeshelter.org',
          role: 'NGO',
          city: 'Bengaluru',
          phone: '+91 98450 12345',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200'
        };
      } else {
        mockUser = {
          name: 'ReWear Connect Admin',
          email: 'admin@rewearconnect.org',
          role: 'Admin',
          city: 'Central Hub',
          phone: '+91 99999 00000',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200'
        };
      }
      onLoginSuccess(mockUser);
    }, 400);
  };

  return (
    <div 
      className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-8 bg-cover bg-center bg-no-repeat font-sans selection:bg-emerald-800 selection:text-white"
      style={{
        backgroundImage: `url('/assets/login_bg.jpg')`
      }}
    >
      {/* Light subtle overlay for natural depth while keeping background artwork crisp */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px] pointer-events-none" />

      {/* Main Responsive Grid Layout */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-end gap-8 py-6">
        
        {/* Floating Glassmorphic Login Card */}
        <div className="w-full max-w-[430px] bg-[#f8faf8]/92 backdrop-blur-2xl rounded-[2.5rem] p-7 sm:p-9 shadow-2xl shadow-slate-950/20 border border-white/90 space-y-4">
          
          {/* Logo & Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#093529] text-white flex items-center justify-center shadow-md shadow-emerald-950/30">
                <Leaf className="w-6 h-6 fill-emerald-300 text-emerald-300" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#093529] tracking-tight">
                ReWear Connect
              </h1>
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Give Every Garment a Second Life.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('Donor')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                role === 'Donor' ? 'bg-[#093529] text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Donor
            </button>
            <button
              type="button"
              onClick={() => setRole('NGO')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                role === 'NGO' ? 'bg-[#093529] text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              NGO / Shelter
            </button>
            <button
              type="button"
              onClick={() => setRole('Admin')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                role === 'Admin' ? 'bg-[#093529] text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Status Message Banner */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* FORGOT PASSWORD FLOW */}
          {isForgotPassword ? (
            <div className="space-y-3.5">
              <div className="text-center space-y-1 bg-slate-100/90 p-3 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-[#093529]">🔑 Reset Account Password</h3>
                <p className="text-[11px] text-slate-600">
                  {resetStep === 1 
                    ? "Enter your registered email to receive a password reset OTP code." 
                    : "Enter the OTP code sent to your email and your new password."}
                </p>
              </div>

              {resetStep === 1 ? (
                /* Step 1: Enter Email to Send Reset OTP */
                <form onSubmit={handleSendResetOtp} className="space-y-3.5">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter registered email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-[#093529] focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#093529] hover:bg-[#06261d] text-white font-extrabold text-xs shadow-lg shadow-[#093529]/30 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span>Send Password Reset OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Enter Reset OTP & New Password */
                <form onSubmit={handleResetPassword} className="space-y-3">
                  {/* OTP Code */}
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="6-Digit Reset OTP"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-sm font-mono tracking-widest font-bold placeholder-slate-400 focus:outline-none focus:border-[#093529] focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-[#093529] focus:bg-white transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-[#093529] focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#093529] hover:bg-[#06261d] text-white font-extrabold text-xs shadow-lg shadow-[#093529]/30 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                    ) : (
                      <span>Reset Password & Log In</span>
                    )}
                  </button>
                </form>
              )}

              {/* Back to Login Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(false); setStatusMessage(null); }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD AUTHENTICATION FLOW */
            <>
              {/* Authentication Mode Switcher (SMTP OTP vs Password) */}
              <div className="flex justify-center border-b border-slate-200 text-xs font-bold pb-2">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('otp'); setStatusMessage(null); }}
                  className={`px-4 py-1 flex items-center gap-1.5 border-b-2 transition-all ${
                    authMethod === 'otp' ? 'border-[#093529] text-[#093529]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Email OTP (SMTP)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod('password'); setStatusMessage(null); }}
                  className={`px-4 py-1 flex items-center gap-1.5 border-b-2 transition-all ${
                    authMethod === 'password' ? 'border-[#093529] text-[#093529]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Password</span>
                </button>
              </div>

              {/* MODE 1: Email OTP Authentication */}
              {authMethod === 'otp' ? (
                <div className="space-y-3.5">
                  {!otpSent ? (
                    /* Step 1: Send OTP Form */
                    <form onSubmit={handleSendOtp} className="space-y-3.5">
                      {isRegister && (
                        <input
                          type="text"
                          required
                          placeholder={role === 'NGO' ? "Organization Name" : "Full Name"}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-[#093529] focus:bg-white transition-all shadow-inner"
                        />
                      )}

                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-[#093529] focus:bg-white transition-all shadow-inner"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl bg-[#093529] hover:bg-[#06261d] text-white font-extrabold text-xs shadow-lg shadow-[#093529]/30 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span>Send Verification OTP</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Step 2: Enter & Verify OTP Form */
                    <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                      <div className="text-center space-y-1 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80">
                        <p className="text-xs text-slate-700 font-medium">
                          Enter the 6-digit verification code sent to <br />
                          <strong className="text-emerald-950 font-bold">{email}</strong>
                        </p>
                      </div>

                      <div className="relative">
                        <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          maxLength={6}
                          required
                          placeholder="6-Digit OTP Code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="w-full pl-11 pr-24 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-sm font-mono tracking-widest font-bold placeholder-slate-400 focus:outline-none focus:border-[#093529] focus:bg-white transition-all shadow-inner"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-lg">
                          {formatTimer(timer)}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl bg-[#093529] hover:bg-[#06261d] text-white font-extrabold text-xs shadow-lg shadow-[#093529]/30 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                        ) : (
                          <span>Verify OTP & Log In</span>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-xs text-slate-600 px-1 pt-1">
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-slate-600 hover:text-slate-900 font-semibold"
                        >
                          ← Change Email
                        </button>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-[#093529] font-bold hover:underline"
                        >
                          Resend OTP
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* MODE 2: Password Authentication */
                <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                  {isRegister && (
                    <input
                      type="text"
                      required
                      placeholder={role === 'NGO' ? "Organization Name" : "Full Name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#093529] focus:bg-white transition-all"
                    />
                  )}

                  {/* Email Input */}
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-[#093529] focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-[#093529] focus:bg-white transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Checkbox & Forgot Password */}
                  <div className="flex items-center justify-between text-xs text-slate-700 px-1 pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-[#093529] focus:ring-[#093529] w-3.5 h-3.5"
                      />
                      <span>Remember me</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => { setIsForgotPassword(true); setResetStep(1); setStatusMessage(null); }}
                      className="text-slate-800 hover:underline font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#093529] hover:bg-[#06261d] text-white font-extrabold text-xs shadow-lg shadow-[#093529]/30 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                    ) : (
                      <span>{isRegister ? `Sign Up as ${role}` : `Login`}</span>
                    )}
                  </button>
                </form>
              )}
            </>
          )}


          {/* Social Logins Divider */}
          <div className="space-y-2.5 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-300/80 w-full" />
              <span className="bg-[#f8faf8] px-3 text-[10px] uppercase font-extrabold tracking-wider text-slate-500 absolute">
                OR CONTINUE WITH
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleQuickDemo(role)}
                className="py-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all shadow-sm"
                title="Sign in with Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleQuickDemo(role)}
                className="py-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all text-slate-900 shadow-sm"
                title="Sign in with Apple"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.67-.82 1.13-1.96.99-3.1-.98.04-2.18.66-2.88 1.47-.62.72-1.16 1.89-1.01 3.01 1.1.09 2.23-.56 2.9-1.38z"/>
                </svg>
              </button>

              {/* Microsoft */}
              <button
                type="button"
                onClick={() => handleQuickDemo(role)}
                className="py-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all shadow-sm"
                title="Sign in with Microsoft"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Toggle Sign Up */}
          <div className="text-center text-xs text-slate-700 pt-1 font-medium border-t border-slate-200/80">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setStatusMessage(null); }}
              className="text-[#093529] font-extrabold hover:underline"
            >
              {isRegister ? "Login" : "Sign Up"}
            </button>
          </div>

        </div>

        {/* Right Side Feature Badges (Matching Screenshot Exactly) */}
        <div className="hidden lg:flex flex-col gap-8 text-[#093529] ml-4">
          
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-14 h-14 rounded-full bg-white/75 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#093529] shadow-lg shadow-emerald-950/10">
              <Shirt className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#093529] leading-tight max-w-[80px]">
              REDUCE<br />WASTE
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-14 h-14 rounded-full bg-white/75 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#093529] shadow-lg shadow-emerald-950/10">
              <Users className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#093529] leading-tight max-w-[80px]">
              HELP<br />COMMUNITIES
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-14 h-14 rounded-full bg-white/75 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#093529] shadow-lg shadow-emerald-950/10">
              <Leaf className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#093529] leading-tight max-w-[80px]">
              SUSTAIN<br />THE PLANET
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

