import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  MapPin,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentLocation } = useLocation();
  const navigate = useNavigate();

  const notifications = [
    { id: '1', title: 'Safety Alert', message: 'Heavy rain expected in your area', type: 'warning' as const, time: '5m ago' },
    { id: '2', title: 'Location Update', message: 'Location tracking is active', type: 'info' as const, time: '10m ago' },
    { id: '3', title: 'New Advisory', message: 'Travel advisory for downtown area', type: 'alert' as const, time: '1h ago' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Location Display */}
        <div className="flex items-center gap-2 ml-12 lg:ml-0">
          <MapPin className="w-4 h-4 text-primary-600" />
          <span className="text-sm text-gray-600 hidden sm:inline">
            {currentLocation
              ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
              : 'Fetching location...'}
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Live
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search places, facilities..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* SOS Quick Button */}
          <button
            onClick={() => navigate('/sos')}
            className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <span className="badge bg-primary-50 text-primary-700">
                        {notifications.length} new
                      </span>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-1.5 rounded-lg mt-0.5 ${
                              notif.type === 'warning'
                                ? 'bg-yellow-100 text-yellow-600'
                                : notif.type === 'alert'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-100">
                    <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
                      View All Notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
