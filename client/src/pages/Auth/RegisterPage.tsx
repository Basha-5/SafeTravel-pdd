import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ShieldCheck, HeartHandshake, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { contactsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Emergency contact setup during registration
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelation, setContactRelation] = useState('Family');

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error('Please accept the Terms of Service & Safety Privacy Policy');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName, phone);

      // Save initial emergency contact if provided
      if (contactName && contactPhone) {
        try {
          await contactsAPI.addContact({
            name: contactName,
            relationship: contactRelation,
            phone: contactPhone,
            whatsapp_number: contactPhone.replace(/[^0-9+]/g, ''),
            is_primary: true,
          });
        } catch (e) {
          console.warn('Initial contact save error', e);
        }
      }

      toast.success('Registration successful! Welcome to SafeTravel');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto pr-1">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Tourist Profile</h2>
        <p className="text-gray-500 text-sm mt-1">
          Stay monitored and safeguarded anywhere in the world
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Personal Details */}
        <div>
          <label className="input-label">Full Name</label>
          <div className="relative">
            <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Morgan"
              className="input-field pl-11"
            />
          </div>
        </div>

        <div>
          <label className="input-label">Email Address</label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="input-field pl-11"
            />
          </div>
        </div>

        <div>
          <label className="input-label">Mobile Phone (with country code)</label>
          <div className="relative">
            <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555-019-2834"
              className="input-field pl-11"
            />
          </div>
        </div>

        <div>
          <label className="input-label">Password</label>
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
          {/* Strength Bar */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full flex-1 ${strength >= 1 ? 'bg-red-500' : 'bg-transparent'}`} />
                <div className={`h-full flex-1 ${strength >= 2 ? 'bg-yellow-500' : 'bg-transparent'}`} />
                <div className={`h-full flex-1 ${strength >= 3 ? 'bg-blue-500' : 'bg-transparent'}`} />
                <div className={`h-full flex-1 ${strength >= 4 ? 'bg-green-500' : 'bg-transparent'}`} />
              </div>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                {strength <= 1 ? 'Weak password' : strength <= 3 ? 'Medium strength' : 'Strong password'}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="input-label">Confirm Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-11"
            />
          </div>
        </div>

        {/* Emergency Contact Setup */}
        <div className="p-4 bg-red-50/60 border border-red-100 rounded-2xl mt-4">
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake className="w-5 h-5 text-red-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              Primary Emergency Contact (For WhatsApp SOS)
            </h4>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact Person Name (e.g. Sarah Morgan)"
              className="input-field bg-white text-sm py-2.5"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="WhatsApp Number"
                className="input-field bg-white text-sm py-2.5"
              />
              <select
                value={contactRelation}
                onChange={(e) => setContactRelation(e.target.value)}
                className="input-field bg-white text-sm py-2.5"
              >
                <option value="Family">Family</option>
                <option value="Spouse">Spouse / Partner</option>
                <option value="Friend">Friend</option>
                <option value="Embassy">Embassy / Official</option>
              </select>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-primary-600"
            />
            <span>
              I agree to the{' '}
              <a href="#" className="text-primary-600 underline">Terms of Service</a> and allow{' '}
              <a href="#" className="text-primary-600 underline">SafeTravel</a> to access GPS location for safety monitoring and SOS broadcasting.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
        >
          <ShieldCheck className="w-5 h-5" />
          {loading ? 'Creating Account...' : 'Register & Secure Travel'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already registered?{' '}
        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
