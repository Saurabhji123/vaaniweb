'use client';

import { useState } from 'react';
import Link from 'next/link';
import { validateEmailAddress } from '@/app/lib/validation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (!email.trim()) {
      setError('Enter the email address linked to your account.');
      return;
    }

    const validation = validateEmailAddress(email);
    if (!validation.valid || !validation.normalized) {
      setError(validation.message || 'Enter a valid email address (name@domain.com).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to process your request right now.');
        setLoading(false);
        return;
      }

      setStatus(data.message || 'If an account exists, password reset instructions have been emailed.');
      setEmail('');
      setLoading(false);
    } catch (err) {
      setError('Network error. Please try again in a moment.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">Reset your password</h1>
        <p className="mt-3 text-sm text-gray-600 text-center">
          We will email you a secure link to set a new password. For security reasons, the link will expire in 30 minutes.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {status && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@college.edu"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-semibold shadow-lg transition hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending reset link…' : 'Email me the reset link'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Remembered your password? <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700">Return to login</Link></p>
          <p className="mt-2">Need help? <a href="mailto:support@vaaniweb.com" className="font-semibold text-purple-600 hover:text-purple-700">Contact support</a></p>
        </div>
      </div>
    </div>
  );
}
