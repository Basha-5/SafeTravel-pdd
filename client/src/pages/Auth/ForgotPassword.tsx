import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const location = useLocation();
  const isResetMode = location.pathname.includes('reset-password');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { forgotPassword, resetPassword } = useAuth();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(newPassword);
      setSubmitted(true);
      toast.success('Password updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isResetMode ? 'Set New Password' : 'Reset Password'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {isResetMode
            ? 'Choose a strong password to protect your tourist account'
            : 'Enter your registered email and we will send recovery instructions'}
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-6">
          <div className="inline-flex p-3 bg-green-50 text-green-600 rounded-full mb-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Check Your Inbox</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            If an account exists for {email}, a recovery link has been delivered.
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            Back to Sign In
          </Link>
        </div>
      ) : isResetMode ? (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="input-label">New Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-11"
              />
            </div>
          </div>
          <div>
            <label className="input-label">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-11"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRequestReset} className="space-y-4">
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
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Sending link...' : 'Send Reset Instructions'}
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/login"
          className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
