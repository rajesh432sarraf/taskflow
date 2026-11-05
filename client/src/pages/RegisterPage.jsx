import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Target,
  Flame,
  Database,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Enhanced RegisterPage Component.
 * Features a modern obsidian-emerald dark form on the left, and an interactive,
 * auto-playing animated productivity carousel with smooth transitions and pill pagination on the right.
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

  // Carousel slide index (0, 1, 2)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Auto-advance carousel every 4.5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

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
    <div className="min-h-screen bg-[#03140E] flex relative overflow-hidden">
      {/* Left Form Section (Sleek Dark Obsidian & Emerald Theme) */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between py-10 px-6 sm:px-12 xl:px-16 bg-[#040D0A] border-r border-emerald-500/20 text-white shadow-2xl z-10 relative overflow-hidden">
        {/* Subtle Ambient Light Glow */}
        <div className="absolute -left-20 -top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1.5 rounded-xl bg-white/95 shadow-sm inline-flex items-center">
              <img
                src="/logo.png"
                alt="TaskFlow Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
          </div>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Create an account
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-emerald-200/70">
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

            {/* Google Sign In Button (At top like Image 2) */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-white/[0.04] text-xs font-bold text-white hover:bg-white/[0.08] hover:border-emerald-400/50 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 transition-all cursor-pointer disabled:opacity-50 shadow-md"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-500/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#040D0A] px-3 text-emerald-200/60 uppercase tracking-wider font-semibold text-[11px]">
                  or register with Email
                </span>
              </div>
            </div>

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
                  className="w-full justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-98 cursor-pointer uppercase tracking-wider text-xs transition-all"
                >
                  Create Account
                </Button>
              </div>
            </form>

            {/* Login Redirect Link */}
            <div className="mt-5 pt-4 border-t border-emerald-500/15 text-center">
              <p className="text-xs text-emerald-200/70">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                >
                  Sign in
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="mt-6 text-center text-xs text-emerald-200/50 relative z-10">
          TaskFlow &bull; Personal Task &amp; Productivity Manager
        </p>
      </div>

      {/* Right Showcase Section: Interactive Animated Carousel (Like Image 2) */}
      <div 
        className="hidden lg:flex lg:w-1/2 xl:w-7/12 bg-gradient-to-br from-[#061C16] via-[#041510] to-[#010B08] p-12 xl:p-16 flex-col justify-between relative overflow-hidden text-white"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Concentric Orbit Rings Background */}
        <div className="absolute -right-24 -top-24 w-[500px] h-[500px] rounded-full border border-emerald-500/15 pointer-events-none" />
        <div className="absolute -right-40 -top-40 w-[680px] h-[680px] rounded-full border border-emerald-400/10 pointer-events-none" />
        <div className="absolute right-12 bottom-12 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-8 top-1/3 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Controls / Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-xs font-semibold text-emerald-300/80 tracking-wide uppercase">
            Productivity Suite
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Content: Animated Carousel Slides with Smooth Crossfade */}
        <div className="relative z-10 my-auto max-w-lg w-full min-h-[390px] flex flex-col justify-center">
          {/* SLIDE 0: Workflow Clarity & Execution */}
          <div 
            className={`transition-all duration-700 ease-in-out transform ${
              currentSlide === 0 
                ? 'opacity-100 translate-y-0 scale-100 block' 
                : 'opacity-0 translate-y-4 scale-95 hidden'
            }`}
          >
            <div>
              <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight">
                Build unstoppable momentum with TaskFlow.
              </h2>
              <p className="mt-3 text-sm text-emerald-100/75 leading-relaxed">
                Experience a streamlined, distraction-free productivity system designed to keep your priorities sharp and goals within reach.
              </p>
            </div>

            {/* 3 Real TaskFlow Productivity Metric Cards with Floating Animation */}
            <div className="mt-7 space-y-3.5">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between shadow-lg animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Full-Stack Production Release</div>
                    <div className="text-[11px] text-slate-300">Milestone completed on time</div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/25 text-emerald-200 px-2 py-0.5 rounded-md font-bold border border-emerald-500/40">
                  100% Done
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between shadow-lg animate-float-delay">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_#F59E0B]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">System Architecture &amp; APIs</div>
                    <div className="text-[11px] text-amber-200/80">In Progress &bull; Priority High</div>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md font-bold border border-rose-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  High Priority
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Weekly Productivity Velocity</div>
                    <div className="text-[11px] text-slate-300">Optimal streak maintained</div>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400">
                  94% Score
                </span>
              </div>
            </div>
          </div>

          {/* SLIDE 1: Intelligent Deadlines & Progress Dial */}
          <div 
            className={`transition-all duration-700 ease-in-out transform ${
              currentSlide === 1 
                ? 'opacity-100 translate-y-0 scale-100 block' 
                : 'opacity-0 translate-y-4 scale-95 hidden'
            }`}
          >
            <div>
              <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight">
                Intelligent deadlines &amp; momentum tracking.
              </h2>
              <p className="mt-3 text-sm text-emerald-100/75 leading-relaxed">
                Stay on top of critical dates with automated overdue alerts, visual priority markers, and completion progress metrics.
              </p>
            </div>

            <div className="mt-7 space-y-3.5">
              {/* Radial Completion Goal Glass Card */}
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between shadow-xl animate-float-slow">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.15)" strokeWidth="10" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="40" strokeLinecap="round" fill="none" />
                    </svg>
                    <span className="absolute text-xs font-black text-white">85%</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Weekly Completion Goal</div>
                    <div className="text-xs text-emerald-300 font-semibold">6 of 7 Milestones Finished</div>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg font-bold border border-emerald-500/30">
                  On Track
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between shadow-lg animate-float-delay">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Zero-Overdue Execution Buffer</div>
                    <div className="text-[11px] text-slate-300">Automated proactive deadline warnings</div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/25 text-emerald-200 px-2 py-0.5 rounded-md font-bold border border-emerald-500/40">
                  All Clear
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_#F59E0B]">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Daily Focus Streak</div>
                    <div className="text-[11px] text-slate-300">7 Consecutive days active</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300">
                  🔥 7 Days
                </span>
              </div>
            </div>
          </div>

          {/* SLIDE 2: Cloud Sync & Security */}
          <div 
            className={`transition-all duration-700 ease-in-out transform ${
              currentSlide === 2 
                ? 'opacity-100 translate-y-0 scale-100 block' 
                : 'opacity-0 translate-y-4 scale-95 hidden'
            }`}
          >
            <div>
              <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight">
                Built for speed, security, and seamless sync.
              </h2>
              <p className="mt-3 text-sm text-emerald-100/75 leading-relaxed">
                Real-time cloud synchronization backed by encrypted HTTP-only authentication and MongoDB Atlas resilience.
              </p>
            </div>

            <div className="mt-7 space-y-3.5">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between shadow-lg animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Encrypted HTTP-Only Sessions</div>
                    <div className="text-[11px] text-slate-300">Strict SameSite &amp; anti-tampering guards</div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/25 text-emerald-200 px-2 py-0.5 rounded-md font-bold border border-emerald-500/40">
                  Secured
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between shadow-lg animate-float-delay">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-[0_0_12px_#0EA5E9]">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">MongoDB Atlas Cloud Persistence</div>
                    <div className="text-[11px] text-slate-300">Continuous background synchronization</div>
                  </div>
                </div>
                <span className="text-[10px] bg-sky-500/25 text-sky-200 px-2 py-0.5 rounded-md font-bold border border-sky-500/40">
                  Cloud Live
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Instant Multi-Device Continuity</div>
                    <div className="text-[11px] text-slate-300">Seamless transition from phone to desktop</div>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Carousel Indicator: Animated Dots & Pills (Exact Match to Image 2) */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted HTTP-Only Sessions</span>
          </div>

          {/* Animated Carousel Indicator Pills (Like Image 2: ▬ • •) */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-7 bg-emerald-400 shadow-[0_0_10px_#10B981]'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
