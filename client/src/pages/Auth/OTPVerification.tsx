import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const initialToken = searchParams.get('token') || '';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyOTP, sendOTP } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits entered
    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp.join('');
    if (code.length < 6) {
      toast.error('Please enter all 6 digits of your token');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(phone || email, email || phone, code);
      toast.success('Security token verified! Welcome to SafeTravel.');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid or expired token. Please try again or use 123456.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      const res = await sendOTP(phone, email);
      setTimer(60);
      toast.success(res?.message || 'New security token dispatched to your email and phone!');
    } catch (e) {
      toast.error('Failed to resend token');
    }
  };

  const handleAutoFill = () => {
    if (!initialToken || initialToken.length < 6) return;
    const digits = initialToken.slice(0, 6).split('');
    setOtp(digits);
    handleVerify(initialToken);
  };

  return (
    <div className="text-center">
      {/* Security Badge */}
      <div className="inline-flex p-3 bg-primary-50 rounded-2xl text-primary-600 mb-4 shadow-sm border border-primary-100">
        <ShieldCheck className="w-10 h-10" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Security Token Authentication</h2>
      <p className="text-gray-500 text-sm mt-1 mb-5">
        We sent a 6-digit confirmation token to:
      </p>

      {/* Destination Badges (Email & Phone) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6 text-xs">
        {email && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 font-semibold">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{phone}</span>
          </div>
        )}
      </div>

      {/* Instant Token Preview / Auto-fill for Convenience */}
      {initialToken && (
        <div className="mb-6 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Token generated: <b className="font-mono tracking-widest text-blue-950 font-bold">{initialToken}</b>
            </span>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition-all"
          >
            Auto-Fill
          </button>
        </div>
      )}

      {/* 6 Digits Inputs */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-gray-50 focus:bg-white"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={() => handleVerify()}
        disabled={loading}
        className="btn-primary w-full py-3 mb-4 font-semibold text-sm shadow-md"
      >
        {loading ? 'Authenticating Token...' : 'Verify Token & Sign In'}
      </button>

      {/* Resend Action */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
        <span>Didn't receive token?</span>
        <button
          type="button"
          disabled={timer > 0}
          onClick={handleResend}
          className={`font-semibold flex items-center gap-1 ${
            timer > 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-primary-600 hover:text-primary-700'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${timer > 0 ? 'animate-spin' : ''}`} />
          {timer > 0 ? `Resend in ${timer}s` : 'Resend Token'}
        </button>
      </div>

      {/* Back to Login */}
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 mx-auto font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Sign In
      </button>
    </div>
  );
};

export default OTPVerification;
