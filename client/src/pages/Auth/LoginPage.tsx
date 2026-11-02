import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, Eye, EyeOff, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [authMode, setAuthMode] = useState<'token' | 'password'>('token');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, sendOTP, loginAsDemo, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to SafeTravel!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      toast.error('Please enter an email address or mobile phone number');
      return;
    }
    setLoading(true);
    try {
      const res = await sendOTP(phone, email);
      toast.success(res?.message || 'Security token dispatched to your email and phone!');
      navigate(`/verify-otp?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&token=${res?.token || ''}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch security token');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginAsDemo();
    toast.success('Logged in as Tourist (Demo Mode)');
    navigate('/');
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Sign in to SafeTravel</h2>
        <p className="text-gray-500 text-sm mt-1">
          Your personal safety companion while exploring the world
        </p>
      </div>

      {/* Demo Mode Button for Instant Evaluation */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Quick Evaluation</p>
              <p className="text-xs text-gray-600">Access all features instantly with demo profile</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoAccess}
            className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            Instant Demo
          </button>
        </div>
      </div>

      {/* Toggle Tab */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setAuthMode('token')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            authMode === 'token'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          🛡️ Token / OTP Login
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('password')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            authMode === 'password'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          🔑 Password Login
        </button>
      </div>

      {authMode === 'token' ? (
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <div>
            <label className="input-label">Email Address (for Email Token)</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tourist@example.com"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <label className="input-label">Mobile Phone Number (for SMS Token)</label>
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-019-2834 or +91 9876543210"
                className="input-field pl-11"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
              <span>📩</span> A secure 6-digit authentication token will be dispatched to both your email & phone number.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Dispatching Token...' : 'Send Security Token to Email & Phone'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="input-label">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tourist@example.com"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="input-label mb-0">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In with Password'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Social / Google Login */}
      <div className="mt-6">
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-3 text-xs text-gray-500 font-medium uppercase absolute">
            Or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-gray-700 transition-all shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.9 7C.7 9.4 0 12 0 14.7s.7 5.3 1.9 7.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17c1.8 3.8 5.6 6.5 10.1 6.5z"
            />
          </svg>
          Google Account
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-8">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
          Create Tourist Profile
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
