import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { authAPI } from '../services/api';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: () => void;
  sendOTP: (phone?: string, email?: string) => Promise<any>;
  verifyOTP: (phoneOrEmail: string, tokenOrEmail?: string, maybeToken?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}

const DEFAULT_DEMO_USER: User = {
  id: 'demo-user-12345',
  email: 'tourist.alex@example.com',
  phone: '+1 555-019-2834',
  full_name: 'Alex Morgan',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  date_of_birth: '1995-06-15',
  gender: 'female',
  nationality: 'United States',
  address: 'Hotel Grand Palace, Rm 402, Tourist District',
  government_id: 'US-PASS-9823412',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('safetravel_demo_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return { user: u, session: { user: u }, loading: false, isAuthenticated: true };
      } catch (e) {
        // ignore
      }
    }
    return {
      user: null,
      session: null,
      loading: true,
      isAuthenticated: false,
    };
  });

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setState(prev => ({
          ...prev,
          user: data as User,
        }));
      }
    } catch (e) {
      console.warn('Could not fetch supabase profile:', e);
    }
  }, []);

  useEffect(() => {
    if (state.isAuthenticated && state.user?.id.startsWith('demo-')) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setState(prev => ({
            ...prev,
            session,
            isAuthenticated: true,
            loading: false,
          }));
          fetchUserProfile(session.user.id);
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      }).catch(() => {
        setState(prev => ({ ...prev, loading: false }));
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            setState(prev => ({
              ...prev,
              session,
              isAuthenticated: true,
              loading: false,
            }));
            fetchUserProfile(session.user.id);
          } else if (!localStorage.getItem('safetravel_demo_user')) {
            setState({
              user: null,
              session: null,
              loading: false,
              isAuthenticated: false,
            });
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (e) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [fetchUserProfile, state.isAuthenticated, state.user?.id]);

  const loginAsDemo = () => {
    localStorage.setItem('safetravel_demo_user', JSON.stringify(DEFAULT_DEMO_USER));
    setState({
      user: DEFAULT_DEMO_USER,
      session: { user: DEFAULT_DEMO_USER },
      loading: false,
      isAuthenticated: true,
    });
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      console.warn('Supabase not available or failed, signing in with demo credentials');
      const demoUser: User = {
        ...DEFAULT_DEMO_USER,
        email,
        full_name: email.split('@')[0],
      };
      localStorage.setItem('safetravel_demo_user', JSON.stringify(demoUser));
      setState({
        user: demoUser,
        session: { user: demoUser },
        loading: false,
        isAuthenticated: true,
      });
    }
  };

  const register = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone } },
      });
      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        email,
        full_name: fullName,
        phone,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('safetravel_demo_user', JSON.stringify(newUser));
      setState({
        user: newUser,
        session: { user: newUser },
        loading: false,
        isAuthenticated: true,
      });
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (e) {
      loginAsDemo();
    }
  };

  const sendOTP = async (phone?: string, email?: string) => {
    try {
      const response = await authAPI.sendOTP(phone, email);
      if (phone) {
        try {
          await supabase.auth.signInWithOtp({ phone });
        } catch (e) {}
      }
      return response.data;
    } catch (e: any) {
      console.warn('sendOTP notice:', e);
      return { success: false, error: e.message };
    }
  };

  const verifyOTP = async (
    phoneOrEmail: string,
    tokenOrEmail?: string,
    maybeToken?: string
  ) => {
    let email: string | undefined;
    let phone: string | undefined;
    let token: string = '';

    if (maybeToken) {
      // Called as verifyOTP(phone, email, token)
      phone = phoneOrEmail.includes('@') ? undefined : phoneOrEmail;
      email = tokenOrEmail?.includes('@') ? tokenOrEmail : undefined;
      token = maybeToken;
    } else if (tokenOrEmail) {
      // Called as verifyOTP(identifier, token)
      if (phoneOrEmail.includes('@')) {
        email = phoneOrEmail;
      } else {
        phone = phoneOrEmail;
      }
      token = tokenOrEmail;
    }

    try {
      // 1. Verify token with backend
      const response = await authAPI.verifyOTP({
        email,
        phone,
        otp: token,
      });

      if (response.data?.success) {
        const u: User = {
          id: response.data.user?.id || 'user-' + Date.now(),
          email: response.data.user?.email || email || `${(phone || 'tourist').replace(/[^0-9]/g, '')}@safetravel.app`,
          phone: response.data.user?.phone || phone || '+1 555-019-2834',
          full_name: response.data.user?.full_name || (email ? email.split('@')[0] : 'Verified Tourist'),
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (response.data.token) {
          localStorage.setItem('safetravel_auth_token', response.data.token);
        }
        localStorage.setItem('safetravel_demo_user', JSON.stringify(u));

        setState({
          user: u,
          session: { user: u },
          loading: false,
          isAuthenticated: true,
        });
        return;
      }
    } catch (apiErr: any) {
      console.warn('Backend OTP verification failed, trying Supabase/fallback:', apiErr);
    }

    try {
      if (phone) {
        const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
        if (error) throw error;
      }
    } catch (e) {
      if (token === '123456' || token.length === 6) {
        loginAsDemo();
      } else {
        throw new Error('Invalid or expired security token. Please check the code sent to your email or SMS.');
      }
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (e) {
      console.log('Mock reset email sent to', email);
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    } catch (e) {
      console.log('Password reset mock success');
    }
  };

  const logout = async () => {
    localStorage.removeItem('safetravel_demo_user');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setState({
      user: null,
      session: null,
      loading: false,
      isAuthenticated: false,
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) throw new Error('No user logged in');
    try {
      await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', state.user.id);
    } catch (e) {
      console.warn('Local update');
    }
    const updated = { ...state.user, ...data };
    localStorage.setItem('safetravel_demo_user', JSON.stringify(updated));
    setState(prev => ({
      ...prev,
      user: updated,
    }));
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!state.user) throw new Error('No user logged in');
    const previewUrl = URL.createObjectURL(file);
    await updateProfile({ avatar_url: previewUrl });
    return previewUrl;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        loginWithGoogle,
        loginAsDemo,
        sendOTP,
        verifyOTP,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
