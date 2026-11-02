import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Flag,
  ShieldCheck,
  HeartHandshake,
  Plus,
  Trash2,
  Edit2,
  Star,
  Bell,
  Lock,
  LogOut,
  Camera,
  CheckCircle2,
  AlertCircle,
  Share2,
  History,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { contactsAPI, travelAPI } from '../../services/api';
import type { EmergencyContact, EmergencyContactInput, TravelRecord } from '../../types';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, uploadAvatar, logout, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'contacts' | 'settings'>('profile');

  // Personal Info Form
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.date_of_birth || '1995-06-15');
  const [gender, setGender] = useState(user?.gender || 'female');
  const [nationality, setNationality] = useState(user?.nationality || 'United States');
  const [address, setAddress] = useState(user?.address || 'Hotel Grand Palace, Rm 402, Tourist District');
  const [govId, setGovId] = useState(user?.government_id || 'US-PASS-9823412');
  const [savingProfile, setSavingProfile] = useState(false);

  // Contacts State
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactRelation, setContactRelation] = useState('Family');
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactIsPrimary, setContactIsPrimary] = useState(false);

  // Settings State
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [notifSafety, setNotifSafety] = useState(true);
  const [notifWeather, setNotifWeather] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [travelHistory, setTravelHistory] = useState<TravelRecord[]>([]);

  useEffect(() => {
    loadContacts();
    travelAPI.getHistory().then(setTravelHistory);
  }, []);

  const loadContacts = async () => {
    try {
      const data = await contactsAPI.getContacts();
      setContacts(data);
    } catch (e) {
      console.warn('Could not load contacts', e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        full_name: fullName,
        phone,
        date_of_birth: dob,
        gender: gender as any,
        nationality,
        address,
        government_id: govId,
      });
      toast.success('Tourist Profile updated successfully!');
    } catch (err: any) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar(file);
        toast.success('Avatar updated!');
      } catch (e) {
        toast.error('Could not upload avatar');
      }
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      toast.error('Please fill in name and phone number');
      return;
    }
    const input: EmergencyContactInput = {
      name: contactName,
      relationship: contactRelation,
      phone: contactPhone,
      whatsapp_number: contactWhatsapp || contactPhone.replace(/[^0-9+]/g, ''),
      is_primary: contactIsPrimary,
    };

    try {
      if (editingContactId) {
        await contactsAPI.updateContact(editingContactId, input);
        toast.success('Emergency contact updated');
      } else {
        await contactsAPI.addContact(input);
        toast.success('Emergency contact added');
      }
      setShowAddContactModal(false);
      resetContactForm();
      loadContacts();
    } catch (e) {
      toast.error('Failed to save contact');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this emergency contact?')) {
      try {
        await contactsAPI.deleteContact(id);
        toast.success('Contact deleted');
        loadContacts();
      } catch (e) {
        toast.error('Failed to delete contact');
      }
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await contactsAPI.setPrimary(id);
      toast.success('Primary emergency contact updated');
      loadContacts();
    } catch (e) {
      toast.error('Failed to set primary');
    }
  };

  const openEditModal = (c: EmergencyContact) => {
    setEditingContactId(c.id);
    setContactName(c.name);
    setContactRelation(c.relationship);
    setContactPhone(c.phone);
    setContactWhatsapp(c.whatsapp_number);
    setContactIsPrimary(c.is_primary);
    setShowAddContactModal(true);
  };

  const resetContactForm = () => {
    setEditingContactId(null);
    setContactName('');
    setContactRelation('Family');
    setContactPhone('');
    setContactWhatsapp('');
    setContactIsPrimary(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await resetPassword(newPassword);
      setNewPassword('');
      toast.success('Password updated successfully');
    } catch (e) {
      toast.error('Failed to change password');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar with Camera icon */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-primary-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-extrabold text-primary-600">
                {user?.full_name?.charAt(0) || 'T'}
              </span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-md cursor-pointer hover:bg-primary-700 transition-colors">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        {/* User basic info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{user?.full_name || 'Tourist'}</h1>
            <span className="badge-safe w-fit mx-auto sm:mx-0">Verified Traveler ID</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Member of SafeTravel Tourist Security Network
          </p>
        </div>

        {/* Quick Logout */}
        <button
          onClick={handleLogout}
          className="btn-outline text-xs py-2 px-4 flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-sm">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Personal Details
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'contacts'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          Emergency Contacts ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Security & Privacy
        </button>
      </div>

      {/* TAB 1: Personal Information */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="card bg-white space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
            <p className="text-xs text-gray-500">
              Information used to verify your identity with tourist police & medical authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Full Legal Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field pl-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field pl-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Date of Birth</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="input-field pl-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="input-field text-xs"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="input-label">Nationality / Country of Origin</label>
              <div className="relative">
                <Flag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="input-field pl-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Passport / National ID Number</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={govId}
                  onChange={(e) => setGovId(e.target.value)}
                  placeholder="e.g. US-PASS-9823412"
                  className="input-field pl-10 text-xs"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Encrypted in Supabase for emergency consular identification.
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="input-label">Current Stay / Hotel Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Hotel name, room number, district..."
                  className="input-field pl-10 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button type="submit" disabled={savingProfile} className="btn-primary text-xs py-2.5 px-6">
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Emergency Contacts */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="card bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Emergency Contacts</h2>
              <p className="text-xs text-gray-500">
                These contacts receive immediate WhatsApp location messages when SOS is triggered.
              </p>
            </div>
            <button
              onClick={() => {
                resetContactForm();
                setShowAddContactModal(true);
              }}
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Emergency Contact
            </button>
          </div>

          {/* List of Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`card bg-white p-5 relative border-2 ${
                  contact.is_primary ? 'border-primary-500 ring-2 ring-primary-50' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-gray-900">{contact.name}</h3>
                      {contact.is_primary && (
                        <span className="badge-safe flex items-center gap-1">
                          <Star className="w-3 h-3 fill-emerald-600" />
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-gray-400">
                      Relationship: {contact.relationship}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(contact)}
                      className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>Phone: {contact.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp: {contact.whatsapp_number}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  {!contact.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(contact.id)}
                      className="text-primary-600 font-bold hover:underline"
                    >
                      Set as Primary
                    </button>
                  )}
                  <a
                    href={`https://wa.me/${contact.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      'Hello! This is a test message from SafeTravel tourist safety system.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold hover:underline ml-auto"
                  >
                    Test WhatsApp →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Security & Privacy Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Tracking & Alerts */}
          <div className="card bg-white space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Monitoring & Geofence Permissions</h2>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-900">Background GPS Location Tracking</p>
                <p className="text-xs text-gray-500">
                  Allow SafeTravel to track position and check for hazard zones while app is open.
                </p>
              </div>
              <input
                type="checkbox"
                checked={trackingEnabled}
                onChange={(e) => setTrackingEnabled(e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-900">Immediate Hazard & Risk Notifications</p>
                <p className="text-xs text-gray-500">
                  Receive alerts when nearing caution zones, dark alleys, or pickpocket hot-spots.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifSafety}
                onChange={(e) => setNotifSafety(e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-bold text-gray-900">Severe Weather & Sunset Advisories</p>
                <p className="text-xs text-gray-500">
                  Daily sunset return prompts and localized weather warnings.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifWeather}
                onChange={(e) => setNotifWeather(e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </div>
          </div>

          {/* Change Password */}
          <div className="card bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-3">
              <div>
                <label className="input-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="input-field text-xs"
                />
              </div>
              <button type="submit" className="btn-primary text-xs py-2 px-4">
                Update Password
              </button>
            </form>
          </div>

          {/* Travel History Logs */}
          <div className="card bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-primary-600" />
                Monitored Travel History
              </h2>
              <button
                onClick={() => {
                  localStorage.removeItem('safetravel_travel_history');
                  setTravelHistory([]);
                  toast.success('Travel history cleared');
                }}
                className="text-xs text-red-600 font-semibold hover:underline"
              >
                Clear History
              </button>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {travelHistory.map((t) => (
                <div key={t.id} className="p-3 bg-gray-50 rounded-xl text-xs flex justify-between">
                  <div>
                    <p className="font-bold text-gray-900">
                      {t.source} → {t.destination}
                    </p>
                    <p className="text-gray-400 text-[11px]">
                      {new Date(t.started_at).toLocaleDateString()} • {t.distance} km • {t.duration} mins
                    </p>
                  </div>
                  <span className="badge-safe">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              {editingContactId ? 'Edit Contact' : 'Add Emergency Contact'}
            </h3>

            <form onSubmit={handleSaveContact} className="space-y-3">
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Sarah Morgan"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="input-label">Relationship</label>
                <select
                  value={contactRelation}
                  onChange={(e) => setContactRelation(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Family">Family Member</option>
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Friend">Friend / Travel Partner</option>
                  <option value="Hotel Desk">Hotel Reception Desk</option>
                  <option value="Embassy">Embassy Consulate Officer</option>
                </select>
              </div>

              <div>
                <label className="input-label">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 555-019-2834"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="input-label">WhatsApp Number (for SOS dispatch)</label>
                <input
                  type="tel"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="+15550192834 (with country code)"
                  className="input-field text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactIsPrimary}
                    onChange={(e) => setContactIsPrimary(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  Set as Primary Contact for Instant 1-Tap SOS
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-4">
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
