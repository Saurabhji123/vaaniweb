'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from './components/Navigation';
import { useAuth } from './context/AuthContext';
import { 
  MicrophoneIcon, 
  RecordingIcon, 
  EditIcon, 
  SparklesIcon, 
  CheckIcon, 
  ErrorIcon, 
  LightningIcon,
  FeedIcon,
  HeartIcon
} from './components/Icons';

export default function Home() {
  const { user, token, refreshUser } = useAuth();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitializedRef.current) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            }
          }
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
          }
        };
        
    recognitionRef.current.onerror = (event: any) => {
      console.error('Recognition error:', event.error);
      
      // Stop recognition on error
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.log('Stop on error failed');
      }
      
      setIsRecording(false);
      
      if (event.error === 'no-speech') {
        setStatus('No speech detected. Click and hold mic button, then speak clearly.');
      } else if (event.error === 'not-allowed') {
        setStatus('Microphone access denied. Please allow microphone permissions.');
      } else if (event.error === 'aborted') {
        setStatus('Recording stopped.');
      } else {
        setStatus(`Error: ${event.error}. Click mic to try again.`);
      }
    };        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
        
        isInitializedRef.current = true;
      }
    }
  }, []);

  // Handle remix parameter from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const remixPrompt = urlParams.get('remix');
      
      if (remixPrompt) {
        // Set the pre-filled prompt
        setTranscript(remixPrompt);
        setStatus('🎨 Remix mode! Edit the prompt below or click "Generate Website" to create a variation.');
        
        // Clean URL (remove remix parameter)
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);

  const handleMicToggle = async () => {
    try {
      if (!recognitionRef.current) {
        setStatus('Speech recognition not supported. Please use Chrome or Edge.');
        return;
      }
      
      // Toggle mic on/off
      if (isRecording) {
        // Turn OFF mic
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Already stopped');
        }
        setIsRecording(false);
        setStatus('Recording stopped! You can edit the text below and click "Generate Website".');
      } else {
        // Turn ON mic
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Clean stop');
        }
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setStatus('Listening... Speak now!');
        setIsRecording(true);
        recognitionRef.current.start();
      }
    } catch (error: any) {
      console.error('Mic toggle error:', error);
      if (error.message && error.message.includes('already started')) {
        try {
          recognitionRef.current.stop();
          await new Promise(resolve => setTimeout(resolve, 500));
          setIsRecording(true);
          recognitionRef.current.start();
          setStatus('Listening... Speak now!');
        } catch (retryError) {
          setStatus('Error: Mic control issue. Please refresh the page.');
          setIsRecording(false);
        }
      } else {
        setStatus(`Error: ${error.message}`);
        setIsRecording(false);
      }
    }
  };

  const handleGenerateWebsite = async () => {
    if (!transcript.trim()) {
      setStatus('Please provide a description for your website.');
      return;
    }

    if (!user || !token) {
      setStatus('❌ Please login or register to create websites. Click "Login" in the navigation menu.');
      return;
    }
    
    // Check if email is verified (for email-based accounts)
    if (user.authProvider === 'email' && user.isEmailVerified === false) {
      setStatus('❌ Please verify your email first to create websites. Check your inbox or profile for verification options.');
      return;
    }

    try {
      setIsRecording(false);
      setStatus('Generating your website...');

      console.log('🚀 Starting website generation...');
      console.log('📝 Transcript:', transcript);
      console.log('👤 User:', user?.email);
      console.log('🔑 Has Token:', !!token);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description: transcript })
      });

      console.log('📡 API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error Response:', errorData);
        const errorMessage = errorData.message || errorData.error || 'Failed to generate website';
        setStatus(`Error: ${errorMessage}`);
        return;
      }

      const data = await response.json();
      console.log('✅ Generation Success:', data);
      console.log('🔍 Slug from response:', data.slug);
      
      const generatedSlug = data.slug;

      if (generatedSlug) {
        // CRITICAL: Open new tab IMMEDIATELY (synchronously) - NO setTimeout!
        const fullUrl = `${window.location.origin}/${generatedSlug}`;
        console.log('🌐 Attempting to open URL:', fullUrl);
        
        const newWindow = window.open(fullUrl, '_blank', 'noopener,noreferrer');
        
        if (!newWindow || newWindow.closed) {
          console.error('❌ Popup blocked! Trying fallback...');
          // Fallback: try to open again
          window.location.href = fullUrl;
          return; // Exit early since we're redirecting
        } else {
          console.log('✅ New tab opened successfully!');
          newWindow.focus();
        }
        
        // NOW do other operations
        setStatus('✅ Website created!');
        
        // Refresh user data from database to get updated count
        await refreshUser();
        
        // Reset form immediately
        setTranscript('');
        
        // Final status
        setTimeout(() => {
          setStatus('');
        }, 2000);
      } else {
        setStatus('Error: Failed to generate website slug.');
      }
    } catch (error: any) {
      console.error('❌ Generation Exception:', error);
      setStatus(`Error: ${error.message || 'Failed to generate website'}`);
    }
  };

  const handleTest = () => {
    setStatus('You can now type your website description below:');
    setTranscript('');
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div id="generate" className="max-w-5xl mx-auto">
          {/* Hero Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-gradient">
              VaaniWeb
            </h1>
            
            {/* Verification Warning Banner - Only for unverified email users */}
            {user && user.authProvider === 'email' && user.isEmailVerified === false && (
              <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-yellow-900 mb-2">Email Verification Required</h3>
                    <p className="text-yellow-800 mb-3">
                      You need to verify your email address before creating websites. Check your inbox for the verification code or request a new one from your profile.
                    </p>
                    <Link 
                      href={`/verify-email?email=${encodeURIComponent(user.email)}`}
                      className="inline-block px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
                    >
                      Verify Email Now
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {user ? (
              <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <p className="text-gray-800 text-xl sm:text-2xl font-semibold mb-3 flex items-center justify-center gap-3 flex-wrap">
                  Welcome back, {user.name}! <span className="text-3xl">👋</span>
                </p>
                <p className="text-gray-600 text-base sm:text-lg">
                  You have <span className="font-bold text-purple-600 text-xl">{user.monthlyLimit === -1 ? '∞' : user.monthlyLimit - user.sitesCreated}</span> sites remaining this month
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-700 text-xl sm:text-2xl font-semibold">Voice-Powered Website Generator</p>
                <p className="text-gray-600 text-base sm:text-lg">Speak your vision, we build your website instantly</p>
              </div>
            )}
          </div>

        <div className="space-y-6 lg:space-y-8">
          {/* Step 1: Record */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-purple-200/50 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3 flex-wrap">
              <EditIcon size={32} className="text-purple-600 flex-shrink-0" />
              <span>Step 1: Record Your Vision</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-6">Hold the button and describe your website. Include:</p>
            <ul className="text-gray-600 text-base sm:text-lg mb-8 space-y-2 list-disc list-inside ml-4">
              <li>Business name and type</li>
              <li>Theme color (pink, blue, purple, green)</li>
              <li>Number of photos</li>
              <li>Instagram handle</li>
              <li>Features needed</li>
            </ul>
            <div className="space-y-4">
              <button
                onClick={handleMicToggle}
                className={`w-full py-5 sm:py-6 px-6 rounded-2xl font-bold text-lg sm:text-xl text-white transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-3 ${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/50 animate-pulse' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 hover:shadow-xl'
                }`}
              >
                {isRecording ? (
                  <>
                    <RecordingIcon size={28} />
                    <span>Recording... (Click to Stop)</span>
                  </>
                ) : (
                  <>
                    <MicrophoneIcon size={28} />
                    <span>Click to Record</span>
                  </>
                )}
              </button>
              <button 
                onClick={handleTest}
                className="w-full py-4 sm:py-5 px-6 rounded-2xl font-bold text-lg sm:text-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/50 hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <EditIcon size={24} />
                <span>Type Your Description</span>
              </button>
            </div>
          </div>

          {/* Step 2: Edit */}
          {(transcript || status.includes('type')) && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-blue-200/50 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3 flex-wrap">
                <EditIcon size={32} className="text-blue-600 flex-shrink-0" />
                <span>Step 2: Review & Edit Your Description</span>
              </h2>
              <textarea 
                value={transcript} 
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full p-5 sm:p-6 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-200 transition-all duration-200 min-h-[150px] text-gray-700 text-base sm:text-lg"
                placeholder="Example: Cake shop in Delhi specializing in custom cakes, pink theme, Instagram cakedelhi, contact form with name, email, phone"
              />
              <div className="flex items-start gap-2 text-gray-600 text-sm sm:text-base mt-4 mb-6">
                <LightningIcon size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <p>Tip: Make any corrections or add more details before generating</p>
              </div>
              <button 
                onClick={handleGenerateWebsite}
                className="w-full py-5 sm:py-6 px-6 rounded-2xl font-bold text-lg sm:text-xl text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg shadow-green-500/50 hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <SparklesIcon size={28} />
                <span>Generate Website</span>
              </button>
            </div>
          )}

          {/* Status Messages */}
          {status && (
            <div className={`p-5 sm:p-6 rounded-2xl flex items-center justify-center gap-3 text-base sm:text-lg font-semibold shadow-lg ${
              status.includes('Error') || status.includes('denied') || status.includes('incorrect')
                ? 'bg-red-100 border-2 border-red-300 text-red-700' 
                : status.includes('Success') || status.includes('set successfully') || status.includes('changed successfully')
                ? 'bg-green-100 border-2 border-green-300 text-green-700' 
                : 'bg-blue-100 border-2 border-blue-300 text-blue-700'
            }`}>
              {status.includes('Error') || status.includes('denied') || status.includes('incorrect') ? (
                <ErrorIcon size={24} />
              ) : status.includes('Success') || status.includes('set successfully') || status.includes('changed successfully') ? (
                <CheckIcon size={24} />
              ) : status.includes('Generating') ? (
                <LightningIcon size={24} className="animate-pulse" />
              ) : null}
              <p className="text-center">{status}</p>
            </div>
          )}

          {/* View All Pages Link */}
          <div className="text-center pt-6 pb-4">
            <a 
              href="/feed" 
              className="inline-flex items-center gap-3 text-purple-600 hover:text-purple-700 font-bold text-lg sm:text-xl transition-all duration-200 hover:scale-105 transform"
            >
              <FeedIcon size={24} />
              <span>View All Generated Pages</span>
              <span className="text-2xl">→</span>
            </a>
          </div>
        </div>
      </div>
    </main>

    {/* Footer */}
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
            Made with <HeartIcon size={16} className="text-pink-400 animate-pulse" /> by VaaniWeb
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}