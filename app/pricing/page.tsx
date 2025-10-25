'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navigation from '../components/Navigation';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const monthlyPlans: Array<{
    name: string;
    price: string;
    period: string;
    sitesLimit: string;
    savings?: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
    available: boolean;
    gradient: string;
  }> = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      sitesLimit: '5 sites/month',
      description: 'Perfect for trying out VaaniWeb',
      features: [
        '5 websites per month',
        'Voice or text input',
        '15+ professional templates',
        'AI content generation',
        'Professional Pexels images',
        'Shareable VaaniWeb.com links',
        'Community support (Discord)',
        'Mobile responsive designs'
      ],
      cta: 'Start Free',
      popular: false,
      available: true,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Starter',
      price: '₹149',
      period: 'per month',
      sitesLimit: '50 sites/month',
      description: 'For growing businesses',
      features: [
        '50 websites per month',
        'Everything in Free plan',
        'Email + WhatsApp support',
        'HTML export download',
        'Password protect websites',
        'VaaniWeb.com subdomain links',
        'Advanced analytics by email',
        'Priority template access'
      ],
      cta: 'Get Started',
      popular: true,
      available: true,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      name: 'Pro',
      price: '₹299',
      period: 'per month',
      sitesLimit: '200 sites/month',
      description: 'For professionals and agencies',
      features: [
        '200 websites per month',
        'Everything in Starter plan',
        'Priority WhatsApp support (6h response)',
        'Detailed analytics via email',
        'Early access to beta features',
        'VaaniWeb.com subdomain links',
        'Custom color schemes',
        'API webhooks access',
        'CSV data export'
      ],
      cta: 'Get Pro',
      popular: false,
      available: true,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      name: 'Ultra',
      price: '₹499',
      period: 'per month',
      sitesLimit: 'Unlimited sites',
      description: 'Complete white-label solution',
      features: [
        'Unlimited website generation',
        'Everything in Pro plan',
        'Bring your own domain (.com/.in)',
        'Auto SSL certificate setup',
        'Remove VaaniWeb branding badge',
        'White-label option available',
        'Phone call support (Hindi/English)',
        'Dedicated account manager',
        'Advanced API webhooks',
        'Priority feature requests'
      ],
      cta: 'Coming Soon',
      popular: false,
      available: false,
      gradient: 'from-indigo-600 to-purple-700'
    }
  ];

  const yearlyPlans: Array<{
    name: string;
    price: string;
    period: string;
    sitesLimit: string;
    savings?: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
    available: boolean;
    gradient: string;
  }> = [
    {
      name: 'Starter',
      price: '₹1,490',
      period: 'per year',
      sitesLimit: '50 sites/month',
      savings: 'Save ₹298',
      description: 'Best value for growing businesses',
      features: [
        '50 websites per month',
        'Everything in Free plan',
        'Email + WhatsApp support',
        'HTML export download',
        'Password protect websites',
        'VaaniWeb.com subdomain links',
        'Advanced analytics by email',
        'Priority template access',
        '2 months FREE included'
      ],
      cta: 'Get Yearly Starter',
      popular: true,
      available: true,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      name: 'Pro',
      price: '₹2,990',
      period: 'per year',
      sitesLimit: '200 sites/month',
      savings: 'Save ₹598',
      description: 'Maximum savings for professionals',
      features: [
        '200 websites per month',
        'Everything in Starter plan',
        'Priority WhatsApp support (6h response)',
        'Detailed analytics via email',
        'Early access to beta features',
        'VaaniWeb.com subdomain links',
        'Custom color schemes',
        'API webhooks access',
        'CSV data export',
        '2 months FREE included'
      ],
      cta: 'Get Yearly Pro',
      popular: false,
      available: true,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      name: 'Ultra',
      price: '₹4,990',
      period: 'per year',
      sitesLimit: 'Unlimited sites',
      savings: 'Save ₹998',
      description: 'Ultimate white-label solution',
      features: [
        'Unlimited website generation',
        'Everything in Pro plan',
        'Bring your own domain (.com/.in)',
        'Auto SSL certificate setup',
        'Remove VaaniWeb branding badge',
        'White-label option available',
        'Phone call support (Hindi/English)',
        'Dedicated account manager',
        'Advanced API webhooks',
        'Priority feature requests',
        '2 months FREE included'
      ],
      cta: 'Coming Soon',
      popular: false,
      available: false,
      gradient: 'from-indigo-600 to-purple-700'
    }
  ];

  const activePlans = billingCycle === 'monthly' ? monthlyPlans : yearlyPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg sm:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Start free and upgrade when you're ready. No hidden fees, no surprises.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex bg-white rounded-full p-2 shadow-lg mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 sm:px-8 py-3 rounded-full font-bold transition text-sm sm:text-base ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 sm:px-8 py-3 rounded-full font-bold transition relative text-sm sm:text-base ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {activePlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-3xl shadow-2xl overflow-hidden ${
                plan.popular ? 'ring-4 ring-purple-600 lg:transform lg:scale-105' : ''
              } hover:scale-105 transition duration-300 ${!plan.available ? 'opacity-90' : ''}`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 font-bold text-sm sm:text-lg">
                  ⭐ MOST POPULAR
                </div>
              )}
              {!plan.available && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center py-3 font-bold text-sm sm:text-lg">
                  🚀 COMING SOON
                </div>
              )}
              <div className="p-6 sm:p-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className={`text-3xl sm:text-5xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2 text-sm sm:text-base">/ {plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="mb-4 bg-green-50 border-2 border-green-500 rounded-full px-4 py-2 inline-block">
                    <span className="text-green-700 font-bold text-sm sm:text-base">💰 {plan.savings}</span>
                  </div>
                )}
                <div className="mb-6 bg-purple-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-purple-700 font-bold text-xs sm:text-sm">{plan.sitesLimit}</p>
                </div>
                <button 
                  disabled={!plan.available}
                  className={`w-full py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg transition transform hover:scale-105 shadow-lg mb-6 sm:mb-8 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : plan.available
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {plan.cta}
                </button>
                <div className="space-y-3 sm:space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-500 font-bold text-lg sm:text-xl flex-shrink-0">✓</span>
                      <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Note */}
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 sm:p-10 border-4 border-purple-300">
            <div className="flex items-start gap-4">
              <span className="text-3xl sm:text-4xl">📢</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-purple-900 mb-3">Important Note</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
                  <strong>VaaniWeb.com branding stays on all plans (Free, Starter, Pro)</strong> - This helps us keep the service 
                  affordable and accessible to everyone. Only the Ultra plan offers white-label and custom domain options.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  The <strong>Ultra plan</strong> is currently under development and will launch when custom domain 
                  integration and white-label features are ready. You can manage <strong>1 custom domain</strong> on Ultra plan 
                  while creating unlimited websites on VaaniWeb.com subdomains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold text-center mb-10 sm:mb-16 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3">Is VaaniWeb really free?</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Yes! The Free plan includes 5 websites per month with all core features. You can create professional 
                websites without any charges. Upgrade to higher plans for more sites and advanced features.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3">Can I use my own domain?</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Custom domain (.com/.in) connection is available only in the Ultra plan (₹499/month - coming soon). 
                All other plans use VaaniWeb.com subdomain links which are fully shareable and professional.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3">Can I remove VaaniWeb branding?</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                VaaniWeb.com branding stays on Free, Starter, and Pro plans. Only the Ultra plan (coming soon) 
                offers white-label option to remove branding from your websites.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3">What happens when I reach my monthly limit?</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Your existing websites will continue to work. You'll need to wait until next month or upgrade to a 
                higher plan to create more websites.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3">How does the AI work?</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We use Groq AI (llama-3.3-70b-versatile) to analyze your business description and generate intelligent, 
                contextual content including business name, tagline, features, and sections - all optimized for your industry.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3">Can I get a refund on yearly plans?</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We offer a 7-day money-back guarantee on all yearly plans. If you're not satisfied, contact our 
                support team for a full refund within 7 days of purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">Ready to Get Started?</h2>
          <p className="text-lg sm:text-2xl mb-6 sm:mb-10 opacity-95">
            Join thousands of businesses building their online presence with VaaniWeb
          </p>
          <Link href="/" className="inline-block bg-white text-purple-600 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold hover:scale-110 transition transform shadow-2xl">
            Create Your Website Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl">🎤</span>
            <span className="text-xl sm:text-2xl font-bold">VaaniWeb</span>
          </div>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Voice-Powered Website Generator</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6 sm:mb-8 text-sm sm:text-base">
            <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition">About</Link>
            <Link href="/services" className="text-gray-400 hover:text-white transition">Services</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
            <Link href="/feed" className="text-gray-400 hover:text-white transition">Showcase</Link>
          </div>
          <div className="border-t border-gray-800 pt-4 sm:pt-6">
            <p className="text-sm sm:text-base text-gray-500">© {new Date().getFullYear()} VaaniWeb. All rights reserved.</p>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Created with ❤️ by VaaniWeb Team</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
