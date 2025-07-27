'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push('/profile');
      } else {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const success = await login('loremaster@example.com', 'password123');
      if (success) {
        router.push('/profile');
      }
    } catch (error) {
      setErrors({ general: 'Demo login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        router.push('/profile');
      } else {
        setErrors({ general: 'Google login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Google login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithFacebook();
      if (success) {
        router.push('/profile');
      } else {
        setErrors({ general: 'Facebook login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Facebook login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/cosmic-bg.jpg')] bg-cover bg-center bg-fixed"></div>
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse -top-20 -left-20"></div>
          <div className="absolute w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl animate-pulse top-1/2 -right-10"></div>
          <div className="absolute w-80 h-80 rounded-full bg-pink-500/20 blur-3xl animate-pulse -bottom-20 left-1/2"></div>
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-300">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-dark p-8 rounded-2xl border border-white/20 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="your.email@domain.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full neon-button-cyan py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 font-medium backdrop-blur-sm"
            >
              <span className="text-xl">🔵</span>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 font-medium backdrop-blur-sm"
            >
              <span className="text-xl">🔷</span>
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Demo Login */}
          <div className="mt-6">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full neon-button-purple py-2 px-4 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 Demo Login (LoreMaster42)
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-sm text-purple-300 text-center mb-2">
              📝 Demo Credentials:
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <p><strong>Email:</strong> loremaster@example.com</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          <Link 
            href="/" 
            className="glass p-4 rounded-xl border border-white/10 text-center hover:border-cyan-400/30 transition-all group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏠</div>
            <p className="text-sm text-slate-300 group-hover:text-cyan-300">Back to Home</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
