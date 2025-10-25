'use client';

import Link from 'next/link';
import Navigation from '../components/Navigation';

export default function Services() {
  const services = [
    {
      icon: '🎤',
      title: 'Voice Recording',
      description: 'Simply speak your business description, and our advanced speech recognition captures every detail with precision.',
      features: ['Real-time transcription', 'Multi-language support', 'Edit before generating']
    },
    {
      icon: '🤖',
      title: 'AI Content Generation',
      description: 'Powered by Groq AI, we intelligently analyze your description and generate professional content tailored to your business.',
      features: ['Smart content creation', 'SEO-optimized text', 'Industry-specific templates']
    },
    {
      icon: '🎨',
      title: 'Professional Design',
      description: 'Choose from 15+ premium templates designed by experts, each with unique layouts and professional aesthetics.',
      features: ['Hero sections', 'Testimonials', 'Pricing tables', 'Contact forms', 'Image galleries']
    },
    {
      icon: '📸',
      title: 'High-Quality Images',
      description: 'Automatically integrated professional images from Pexels, perfectly matched to your business type.',
      features: ['Curated business photos', 'Optimized loading', 'Industry-specific imagery']
    },
    {
      icon: '⚡',
      title: 'Instant Deployment',
      description: 'Your website is generated and deployed in seconds, ready to share with customers and investors.',
      features: ['Live preview', 'Shareable links', 'MongoDB storage']
    },
    {
      icon: '🎯',
      title: 'Custom Features',
      description: 'Every website includes essential sections: About, Services, Pricing, Testimonials, FAQs, and Contact forms.',
      features: ['Multi-section layouts', 'Interactive elements', 'Mobile responsive']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything you need to build a professional website in seconds
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-2xl p-8 hover:scale-105 transition transform">
              <div className="text-6xl mb-6">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <div className="space-y-2">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-white">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="bg-white/20 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center text-4xl font-black mx-auto mb-6">1</div>
              <h3 className="text-2xl font-bold mb-3">Speak</h3>
              <p className="opacity-90">Click the mic and describe your business</p>
            </div>
            <div className="text-center text-white">
              <div className="bg-white/20 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center text-4xl font-black mx-auto mb-6">2</div>
              <h3 className="text-2xl font-bold mb-3">AI Analyzes</h3>
              <p className="opacity-90">Our AI understands and generates content</p>
            </div>
            <div className="text-center text-white">
              <div className="bg-white/20 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center text-4xl font-black mx-auto mb-6">3</div>
              <h3 className="text-2xl font-bold mb-3">Design Applied</h3>
              <p className="opacity-90">Professional template with your content</p>
            </div>
            <div className="text-center text-white">
              <div className="bg-white/20 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center text-4xl font-black mx-auto mb-6">4</div>
              <h3 className="text-2xl font-bold mb-3">Launch</h3>
              <p className="opacity-90">Your website is ready to share!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">VaaniWeb vs Traditional Builders</h2>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="py-6 px-6 text-left text-xl font-bold">Feature</th>
                  <th className="py-6 px-6 text-center text-xl font-bold">VaaniWeb</th>
                  <th className="py-6 px-6 text-center text-xl font-bold">Traditional</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6 font-semibold">Creation Time</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold">3 seconds ⚡</td>
                  <td className="py-4 px-6 text-center text-gray-500">Hours/Days</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-4 px-6 font-semibold">Technical Skills Required</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold">None ✓</td>
                  <td className="py-4 px-6 text-center text-gray-500">Moderate to High</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-semibold">Voice Input</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold">Yes 🎤</td>
                  <td className="py-4 px-6 text-center text-gray-500">No</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-4 px-6 font-semibold">AI Content Generation</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold">Built-in 🤖</td>
                  <td className="py-4 px-6 text-center text-gray-500">Add-on/None</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-semibold">Professional Templates</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold">15+ 🎨</td>
                  <td className="py-4 px-6 text-center text-gray-500">Limited/Paid</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-semibold">Price</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold">Free 💰</td>
                  <td className="py-4 px-6 text-center text-gray-500">₹500-5000/month</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-800">Experience The Future of Web Design</h2>
          <p className="text-xl text-gray-600 mb-10">
            Stop paying thousands for websites. Create yours in seconds with VaaniWeb.
          </p>
          <Link href="/" className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:scale-110 transition transform shadow-2xl">
            Get Started Free →
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
