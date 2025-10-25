'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useState } from 'react';
import { ProfileIcon } from './Icons';

export default function Navigation() {
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.svg" 
              alt="VaaniWeb - Voice to Website" 
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Services
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Pricing
            </Link>
            <Link href="/feed" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Showcase
            </Link>
            
            {loading ? (
              <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : user ? (
              <Link 
                href="/profile" 
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <ProfileIcon size={20} />
                Profile
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                About
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                Services
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                Pricing
              </Link>
              <Link href="/feed" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                Showcase
              </Link>
              
              {loading ? (
                <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : user ? (
                <Link 
                  href="/profile" 
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-center font-medium flex items-center justify-center gap-2"
                >
                  <ProfileIcon size={20} />
                  Profile
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
