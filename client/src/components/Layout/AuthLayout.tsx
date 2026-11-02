import { Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">SafeTravel</h1>
          <p className="text-xl text-primary-100 mb-8">
            Tourist Safety Monitoring System
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-primary-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Real-time GPS location tracking</span>
            </div>
            <div className="flex items-center gap-3 text-primary-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Emergency SOS alerts via WhatsApp</span>
            </div>
            <div className="flex items-center gap-3 text-primary-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Safe route navigation</span>
            </div>
            <div className="flex items-center gap-3 text-primary-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Nearby emergency facilities</span>
            </div>
            <div className="flex items-center gap-3 text-primary-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Tourist safety score & alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">SafeTravel</h1>
            <p className="text-primary-200 mt-1">Tourist Safety Monitoring</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
