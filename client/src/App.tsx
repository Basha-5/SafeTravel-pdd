import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import AuthLayout from './components/Layout/AuthLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import OTPVerification from './pages/Auth/OTPVerification';
import ForgotPassword from './pages/Auth/ForgotPassword';
import HomePage from './pages/Home/HomePage';
import MapPage from './pages/Map/MapPage';
import RoutesPage from './pages/Routes/RoutesPage';
import FacilitiesPage from './pages/Facilities/FacilitiesPage';
import SOSPage from './pages/SOS/SOSPage';
import ProfilePage from './pages/Profile/ProfilePage';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading SafeTravel...</h2>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/sos" element={<SOSPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
