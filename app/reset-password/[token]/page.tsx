'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { isStrongPassword, PASSWORD_REQUIREMENTS } from '@/app/lib/validation';

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = params?.token || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (!token) {
      setError('This reset link is invalid. Please request a new one.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Enter and confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isStrongPassword(password)) {
      setError(PASSWORD_REQUIREMENTS);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to reset password.');
        setLoading(false);
        return;
      }

      setStatus(data.message || 'Password updated successfully.');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (err) {
      setError('Network error. Please try again in a moment.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur rounded-3xl border border-white/30 shadow-2xl p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">Set a new password</h1>
        <p className="mt-3 text-sm text-gray-600 text-center">
          Your new password must include uppercase, lowercase, number, and symbol characters.
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
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              New password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter strong password"
              disabled={loading}
            />
            <p className="mt-2 text-xs text-gray-500">{PASSWORD_REQUIREMENTS}</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Re-enter password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-lg transition hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Updating password…' : 'Update password'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
          <p><Link href="/forgot-password" className="font-semibold text-purple-600 hover:text-purple-700">Request a new link</Link></p>
          <p><Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
}
