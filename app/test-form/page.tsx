'use client';

import { useState } from 'react';

export default function TestFormPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult('Submitting...');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      websiteSlug: 'core-fitness-studio', // Test slug from your screenshot
      formData: {
        Name: formData.get('name'),
        Email: formData.get('email'),
        Phone: formData.get('phone'),
        Message: formData.get('message'),
      }
    };

    console.log('🧪 TEST: Submitting form data:', data);

    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();
      console.log('🧪 TEST: Response:', responseData);

      if (res.ok) {
        setResult(`✅ SUCCESS!\n${JSON.stringify(responseData, null, 2)}`);
        form.reset();
      } else {
        setResult(`❌ ERROR!\nStatus: ${res.status}\n${JSON.stringify(responseData, null, 2)}`);
      }
    } catch (error: any) {
      console.error('🧪 TEST: Error:', error);
      setResult(`💥 EXCEPTION!\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🧪 Form Submission Test</h1>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-sm text-yellow-700">
            <strong>Testing slug:</strong> core-fitness-studio
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Open browser console (F12) to see detailed logs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Your message here..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
          >
            {loading ? '⏳ Submitting...' : '🚀 Submit Test Form'}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Result:</h3>
            <pre className="text-xs whitespace-pre-wrap overflow-auto">{result}</pre>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-purple-600 hover:underline">← Back to Home</a>
          <span className="mx-3">|</span>
          <a href="/profile/submissions" className="text-purple-600 hover:underline">View Submissions →</a>
        </div>
      </div>
    </div>
  );
}
