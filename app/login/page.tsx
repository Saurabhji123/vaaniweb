'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationWarning, setVerificationWarning] = useState(false);

  useEffect(() => {
    // Check if coming from verification
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage('✅ Email verified successfully! You can now login.');
    }
  }, [searchParams]);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google authentication failed');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Google login failed');
        setLoading(false);
        return;
      }

      // Store in auth context
      login(data.token, data.user);

      // Redirect to home
      router.push('/');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed. Please try again.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Check if email verification required
      if (data.requiresVerification) {
        setVerificationWarning(true);
      }

      // Store in auth context
      login(data.token, data.user);

      // Redirect to home
      router.push('/');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-black text-white">
              VaaniWeb
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/" className="text-white hover:text-pink-200 transition font-semibold">
                Home
              </Link>
              <Link href="/pricing" className="text-white hover:text-pink-200 transition font-semibold">
                Pricing
              </Link>
              <Link href="/register" className="text-white hover:text-pink-200 transition font-semibold">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Login to continue creating amazing websites!
          </p>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {successMessage}
            </div>
          )}

          {verificationWarning && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold mb-1">⚠️ Email Verification Required</p>
              <p className="text-sm">You can login, but verify your email to create websites. Check your inbox or profile.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your password"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
                text="signin_with"
                shape="rectangular"
                theme="outline"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-purple-600 font-semibold hover:text-purple-700">
                Create one now
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              🎉 <strong>Free Plan:</strong> 5 websites/month • No credit card required
            </p>
          </div>
        </div>
      </div>

      {/* Footer removed: now rendered globally via RootLayout */}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
