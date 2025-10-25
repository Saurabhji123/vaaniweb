'use client';

import Link from 'next/link';
import Navigation from '../components/Navigation';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            About VaaniWeb
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Revolutionizing website creation with the power of voice and AI
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              VaaniWeb was born from a simple idea: <strong>What if anyone could create a professional website just by speaking?</strong>
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              We noticed that thousands of small businesses struggle with expensive web development costs, technical barriers, 
              and time-consuming processes. Traditional website builders still require hours of learning and design effort.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              So we built VaaniWeb - a platform that combines <strong>voice recognition</strong> with <strong>AI intelligence</strong> to 
              generate beautiful, professional websites in seconds. Just speak your vision, and we'll bring it to life.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl shadow-2xl p-10 text-white">
            <div className="text-5xl mb-6">🎯</div>
            <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg opacity-95">
              To democratize web development and empower every business owner, entrepreneur, and creative professional 
              to establish their online presence effortlessly - regardless of technical skills or budget.
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-3xl shadow-2xl p-10 text-white">
            <div className="text-5xl mb-6">🚀</div>
            <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-lg opacity-95">
              To become the world's first voice-powered website builder, making professional web design accessible 
              to millions of businesses globally and revolutionizing how the internet is built.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:scale-105 transition transform">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Speed</h3>
              <p className="text-gray-600">
                Generate professional websites in seconds, not days. Time is valuable, and we respect that.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:scale-105 transition transform">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Quality</h3>
              <p className="text-gray-600">
                Every website is investor-ready with professional designs, real images, and complete features.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:scale-105 transition transform">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Pioneering voice-AI technology to make web development accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-black mb-2">1000+</div>
              <div className="text-xl opacity-90">Websites Created</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">500+</div>
              <div className="text-xl opacity-90">Happy Users</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">15+</div>
              <div className="text-xl opacity-90">Template Variations</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">3s</div>
              <div className="text-xl opacity-90">Average Generation Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-800">Ready to Create Your Website?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of businesses who've built their online presence with VaaniWeb
          </p>
          <Link href="/" className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:scale-110 transition transform shadow-2xl">
            Start Building Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-3xl">🎤</span>
            <span className="text-2xl font-bold">VaaniWeb</span>
          </div>
          <p className="text-gray-400 mb-6">Voice-Powered Website Generator</p>
          <div className="flex justify-center gap-8 mb-8">
            <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition">About</Link>
            <Link href="/services" className="text-gray-400 hover:text-white transition">Services</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
            <Link href="/feed" className="text-gray-400 hover:text-white transition">Showcase</Link>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500">© {new Date().getFullYear()} VaaniWeb. All rights reserved.</p>
            <p className="text-gray-600 mt-2">Created with ❤️ by VaaniWeb Team</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
