'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FeedItem } from '../types';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { 
  GalleryIcon, 
  EyeIcon, 
  RefreshIcon, 
  MicrophoneIcon, 
  ErrorIcon,
  HeartIcon,
  CameraIcon
} from '../components/Icons';

export default function FeedPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Wait for auth to load first
    if (authLoading) {
      return;
    }

    if (!token) {
      setError('Please login to view your generated pages');
      setLoading(false);
      return;
    }

    fetch('/api/feed', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Please login to view your pages');
          }
          throw new Error('Failed to load feed');
        }
        return res.json();
      })
      .then(data => {
        console.log('Feed data:', data);
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading feed:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [token, authLoading]);

  const handleRemix = (item: FeedItem) => {
    const prompt = `${item.json.title} ${item.json.tagline} ${item.json.theme_color} theme ${item.json.pics.join(' ')} instagram ${item.json.instagram} contact form`;
    alert(`Remix this page by saying:\n\n"${prompt}"`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-white">Loading feed...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-400">
        <div className="text-center bg-white/20 backdrop-blur-md rounded-xl p-8 max-w-md">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white mb-4">
            <ErrorIcon size={32} />
            <span>Authentication Required</span>
          </div>
          <div className="text-white mb-6">{error}</div>
          <div className="flex gap-3 justify-center">
            <a href="/login" className="inline-block px-6 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition">
              Login
            </a>
            <a href="/" className="inline-block px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition">
              Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-400">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl flex items-center justify-center gap-3">
            <GalleryIcon size={56} />
            <span>My Generated Pages</span>
          </h1>
          {user && (
            <p className="text-xl text-white drop-shadow-lg">
              {items.length} {items.length === 1 ? 'page' : 'pages'} created by {user.name}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white/20 backdrop-blur-md rounded-2xl">
            <div className="flex justify-center mb-6">
              <MicrophoneIcon size={64} className="text-white" />
            </div>
            <p className="text-white text-2xl font-bold mb-4">You haven't created any pages yet</p>
            <p className="text-white mb-6">Start creating amazing websites with your voice!</p>
            <a href="/" className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition shadow-xl">
              Create Your First Page
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-200"
              >
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 relative">
                  {item.json.pics && item.json.pics.length > 0 && (
                    <img
                      src={`https://source.unsplash.com/400x300/?${encodeURIComponent(item.json.pics[0])}`}
                      alt={item.json.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-purple-600">
                    {item.json.theme_color || 'colorful'}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {item.json.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {item.json.tagline}
                  </p>
                  
                  {item.json.instagram && (
                    <div className="mb-4 flex items-center gap-2">
                      <CameraIcon size={20} className="text-pink-500" />
                      <span className="text-gray-700 font-medium">
                        @{item.json.instagram}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <a
                      href={`/p/${item._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition text-sm font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      <EyeIcon size={18} />
                      <span>View Page</span>
                    </a>
                    <button
                      onClick={() => handleRemix(item)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-300 transition text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <RefreshIcon size={18} />
                      <span>Remix</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white py-12 sm:py-16 overflow-hidden mt-12">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-pink-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="/logo.svg" 
                alt="VaaniWeb" 
                className="h-12 sm:h-14 w-auto drop-shadow-lg"
              />
            </div>
            <p className="text-base sm:text-lg text-purple-100 max-w-md mx-auto">
              Transform your voice into stunning websites instantly
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 text-sm sm:text-base">
            <Link href="/" className="text-purple-200 hover:text-white transition-colors duration-200 hover:scale-105 transform">
              Home
            </Link>
            <Link href="/about" className="text-purple-200 hover:text-white transition-colors duration-200 hover:scale-105 transform">
              About
            </Link>
            <Link href="/services" className="text-purple-200 hover:text-white transition-colors duration-200 hover:scale-105 transform">
              Services
            </Link>
            <Link href="/pricing" className="text-purple-200 hover:text-white transition-colors duration-200 hover:scale-105 transform">
              Pricing
            </Link>
            <Link href="/feed" className="text-purple-200 hover:text-white transition-colors duration-200 hover:scale-105 transform">
              Showcase
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-purple-700/50 mb-6"></div>

          {/* Copyright Section */}
          <div className="text-center space-y-2">
            <p className="text-sm sm:text-base text-purple-200">
              © {new Date().getFullYear()} VaaniWeb. All rights reserved.
            </p>
            <p className="text-sm text-purple-300 flex items-center justify-center gap-2">
              Crafted with <HeartIcon size={16} className="text-pink-400 animate-pulse" /> by VaaniWeb Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
