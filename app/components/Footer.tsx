import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white py-12 sm:py-16 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-pink-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.svg"
              alt="VaaniWeb"
              width={160}
              height={56}
              className="h-12 sm:h-14 w-auto drop-shadow-lg"
              priority
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
            Made with <HeartIcon size={16} className="text-pink-400 animate-pulse" /> by VaaniWeb
          </p>
        </div>
      </div>
    </footer>
  );
}
