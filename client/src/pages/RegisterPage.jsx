import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Premium RegisterPage Component.
 * Features a modern split-screen SaaS layout with Google OAuth and a deep emerald productivity showcase.
 */
export default function RegisterPage() {
  const { register, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password
      );
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setAuthError(res.error || 'Registration failed');
      }
    } catch (err) {
      setAuthError(err.message || 'An unexpected error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else if (!res.cancelled) {
        setAuthError(res.error || 'Google sign-up failed');
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to authenticate with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between py-10 px-6 sm:px-12 xl:px-16 bg-white shadow-xl z-10">
        <div>
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/logo.png"
              alt="TaskFlow Logo"
              className="h-9 w-auto object-contain"
            />
          </div>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Create an account
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                Start organizing your workflows and boosting your daily productivity.
              </p>
            </div>

            {authError && (
              <div className="mb-4">
                <ErrorMessage
                  title="Registration Failed"
                  message={authError}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <Input
                label="Full Name"
                name="name"
                type="text"
                placeholder="e.g. Alex Morgan"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                autoComplete="name"
              />

              {/* Email */}
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                autoComplete="email"
              />

              {/* Password */}
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                autoComplete="new-password"
              />

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full justify-center shadow-md hover:shadow-lg hover:shadow-[#27845B]/20 py-2.5 font-bold cursor-pointer"
                >
                  Create Account
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#64748B] uppercase tracking-wider font-semibold text-[11px]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#27845B] transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#64748B]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Login Redirect Link */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-[#64748B]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-[#27845B] hover:text-[#206C4A] transition-colors inline-flex items-center gap-1"
                >
                  Sign in
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="mt-6 text-center text-xs text-[#94A3B8]">
          TaskFlow &bull; Personal Task &amp; Productivity Manager
        </p>
      </div>

      {/* Right Showcase Section (Desktop only - Deep Emerald Luxury) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 bg-gradient-to-br from-[#061811] via-[#0A261D] to-[#071912] p-12 xl:p-16 flex-col justify-between relative overflow-hidden text-white border-l border-emerald-900/40">
        {/* Concentric Orbit Rings Background */}
        <div className="absolute -right-24 -top-24 w-[500px] h-[500px] rounded-full border border-emerald-500/10 pointer-events-none" />
        <div className="absolute -right-40 -top-40 w-[680px] h-[680px] rounded-full border border-emerald-500/5 pointer-events-none" />
        <div className="absolute right-12 bottom-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-8 top-1/3 w-64 h-64 bg-[#FF6B4A]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Tagline */}
        <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-300 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>TaskFlow Productivity Engine 2.0</span>
        </div>

        {/* Center Content: Headline & 3 Floating Productivity Glass Cards */}
        <div className="relative z-10 my-auto space-y-8 max-w-lg">
          <div>
            <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight">
              Build unstoppable momentum with TaskFlow.
            </h2>
            <p className="mt-3 text-sm text-emerald-100/75 leading-relaxed">
              Experience a streamlined, distraction-free productivity system designed to keep your priorities sharp and goals within reach.
            </p>
          </div>

          {/* 3 Real TaskFlow Productivity Metric Cards */}
          <div className="space-y-3.5">
            {/* Card 1: Completed Sprint Milestone */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_#10B981]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Full-Stack Production Release</div>
                  <div className="text-[11px] text-emerald-200/80">Milestone completed on time</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold border border-emerald-400/30">
                100% Done
              </span>
            </div>

            {/* Card 2: In-Progress Deep Focus Session */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_#F59E0B]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">System Architecture & APIs</div>
                  <div className="text-[11px] text-amber-200/80">In Progress &bull; Priority High</div>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md font-bold border border-rose-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                High Priority
              </span>
            </div>

            {/* Card 3: Velocity & Analytics */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-[0_0_12px_#0EA5E9]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Weekly Productivity Velocity</div>
                  <div className="text-[11px] text-sky-200/80">Optimal streak maintained</div>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-300">
                94% Score
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Tech Stack Signals */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted HTTP-Only Sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant Cloud Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
}
