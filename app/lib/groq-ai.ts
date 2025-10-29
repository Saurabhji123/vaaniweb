// Groq AI Service - Intelligent Website Generation with Real Images
// Uses Groq's fast LLM inference + Unsplash API for real photos

interface AIGeneratedContent {
  businessName: string;
  tagline: string;
  description: string;
  themeColor: string;
  businessType: string;
  imageKeywords: string[];
  imageDescriptions?: string[]; // Human-readable descriptions for alt text
  realImages: string[]; // Array of real image URLs from Pexels/Unsplash
  sections: {
    about: string;
    features: string[];
    callToAction: string;
    testimonials?: Array<{
      name: string;
      role: string;
      quote: string;
      rating?: number;
    }>;
    services?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    faq?: Array<{
      question: string;
      answer: string;
    }>;
  };
  contactFields: string[];
  instagram?: string;
  seoKeywords: string[];
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_DUMMY_KEY_REPLACE_WITH_REAL_ONE';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Pexels API for high-quality business images (FREE - 200 requests/hour)
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'wMJn9zPG0dNlTmFJkgB5P5gHWQYKZbvL8Y7NXwR2g3K5z9nJqZ8rY0pL'; // Free demo key

/**
 * Fetch real, relevant images from Pexels API for better quality and variety
 * Falls back to Unsplash if Pexels fails
 * Images are keyword-specific and high-quality
 */
async function fetchRealImages(keywords: string[], count: number = 4): Promise<string[]> {
  console.log(`📸 Fetching ${count} real images for keywords:`, keywords);
  
  const images: string[] = [];
  const usedUrls = new Set<string>();
  
  // Try Pexels API first (best quality, keyword-specific)
  for (let i = 0; i < Math.min(count, keywords.length); i++) {
    const keyword = keywords[i];
    
    try {
      console.log(`🔍 Searching Pexels for: "${keyword}"`);
      
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=5&orientation=landscape`,
        {
          headers: {
            'Authorization': PEXELS_API_KEY
          },
          signal: AbortSignal.timeout(3000) // 3s timeout
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.photos && data.photos.length > 0) {
          // Get random photo from top 5 results
          const randomIndex = Math.floor(Math.random() * Math.min(3, data.photos.length));
          const photo = data.photos[randomIndex];
          const imageUrl = photo.src.large; // 1280x853px high quality
          
          if (!usedUrls.has(imageUrl)) {
            images.push(imageUrl);
            usedUrls.add(imageUrl);
            console.log(`✅ Pexels image ${i + 1}: "${photo.alt || keyword}"`);
            continue; // Success, move to next keyword
          }
        }
      }
    } catch (error: any) {
      console.warn(`⚠️ Pexels API failed for "${keyword}":`, error.message);
    }
    
    // Fallback to Unsplash for this keyword
    console.log(`🔄 Falling back to Unsplash for: "${keyword}"`);
    const seed = Date.now() + i + Math.floor(Math.random() * 10000);
    const imageUrl = `https://source.unsplash.com/1280x853/?${encodeURIComponent(keyword)}&sig=${seed}`;
    
    if (!usedUrls.has(imageUrl)) {
      images.push(imageUrl);
      usedUrls.add(imageUrl);
      console.log(`✅ Unsplash image ${i + 1} for "${keyword}"`);
    }
  }
  
  // Fill remaining slots with generic business images
  while (images.length < count) {
    const fallbackKeywords = [
      'professional business team working',
      'modern office workspace interior',
      'customer service interaction happy',
      'quality products display showcase'
    ];
    const keyword = fallbackKeywords[images.length % fallbackKeywords.length];
    
    // Try Pexels first
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=3&orientation=landscape`,
        {
          headers: { 'Authorization': PEXELS_API_KEY },
          signal: AbortSignal.timeout(2000)
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const photo = data.photos[0];
          const imageUrl = photo.src.large;
          
          if (!usedUrls.has(imageUrl)) {
            images.push(imageUrl);
            usedUrls.add(imageUrl);
            continue;
          }
        }
      }
    } catch (error) {
      // Silent fallback
    }
    
    // Unsplash fallback
    const seed = Date.now() + images.length + Math.floor(Math.random() * 10000);
    const imageUrl = `https://source.unsplash.com/1280x853/?${encodeURIComponent(keyword)}&sig=${seed}`;
    
    if (!usedUrls.has(imageUrl)) {
      images.push(imageUrl);
      usedUrls.add(imageUrl);
    }
  }
  
  console.log(`✅ Fetched ${images.length} keyword-specific images (${images.filter(url => url.includes('pexels')).length} from Pexels, ${images.filter(url => url.includes('unsplash')).length} from Unsplash)`);
  return images;
}

export async function analyzeTranscriptWithAI(transcript: string): Promise<AIGeneratedContent> {
  try {
    console.log('🤖 Analyzing transcript with Groq AI:', transcript);

    const prompt = `You are a professional website content creator. Analyze the following business description and generate comprehensive website content.

User's Description: "${transcript}"

Generate a JSON response with the following structure:
{
  "businessName": "Professional business name (2-4 words max)",
  "tagline": "Catchy, compelling tagline (10-15 words)",
  "description": "Engaging 2-3 sentence description highlighting unique value",
  "themeColor": "One of: pink, blue, purple, green, red, orange, yellow, gray, indigo, teal",
  "businessType": "One of: cafe, bakery, gym, photography, restaurant, shop, salon, hotel, tech, consulting, yoga, spa, pet, education, medical, legal, automotive, real-estate, travel, general",
  "imageKeywords": [
    "specific search term 1 (e.g., 'barista making coffee')",
    "specific search term 2 (e.g., 'cozy cafe interior')",
    "specific search term 3 (e.g., 'fresh pastries display')",
    "specific search term 4 (e.g., 'customers enjoying coffee')"
  ],
  "imageDescriptions": [
    "Brief description 1 (e.g., 'Professional barista crafting coffee')",
    "Brief description 2 (e.g., 'Warm and inviting cafe atmosphere')",
    "Brief description 3 (e.g., 'Freshly baked pastries and treats')",
    "Brief description 4 (e.g., 'Happy customers in our cafe')"
  ],
  "sections": {
    "about": "Compelling about section (150-200 words, tell a rich story with personality, history, mission, vision. Include: founding story, years of experience, team background, core values, what makes you unique, passion/drive, customer promise. Make it deeply authentic and human)",
    "features": ["feature1", "feature2", "feature3", ... "feature10"] (10-12 SPECIFIC measurable value propositions with concrete benefits and numbers),
    "callToAction": "Powerful, action-driven CTA with urgency (e.g., 'Start Your Transformation Today', 'Book Your Free Consultation Now', 'Join 500+ Happy Customers')",
    "testimonials": [
      {"name": "John Smith", "role": "Customer/Position", "quote": "Authentic, detailed testimonial quote (2-3 sentences about their experience, results, or satisfaction)", "rating": 5},
      {"name": "Sarah Johnson", "role": "Client Type", "quote": "Another genuine testimonial with specific details", "rating": 5},
      {"name": "Mike Davis", "role": "User Role", "quote": "Third testimonial highlighting different aspect", "rating": 5}
    ] (3-4 realistic testimonials with names, roles, detailed quotes),
    "services": [
      {"title": "Service Name 1", "description": "Detailed description of this service, what's included, benefits (30-40 words)", "icon": "✨"},
      {"title": "Service Name 2", "description": "Another service with rich details about features and value", "icon": "🎯"},
      {"title": "Service Name 3", "description": "Third service with comprehensive information", "icon": "💎"}
    ] (3-5 key services with descriptions and emoji icons),
    "faq": [
      {"question": "Common question customers ask?", "answer": "Detailed, helpful answer (2-3 sentences)"},
      {"question": "Another frequent question?", "answer": "Clear, informative response"},
      {"question": "Third important question?", "answer": "Thorough answer addressing concern"}
    ] (5-6 relevant FAQ items based on business type)
  },
  "contactFields": ["Name", "Email", "Phone", "Message"] (MUST customize based on business type with specific, relevant fields that capture customer needs. Examples by business:
    - Gym/Fitness: ["Name", "Email", "Phone", "Fitness Goals", "Preferred Time Slot", "Experience Level"]
    - Restaurant: ["Name", "Email", "Phone", "Preferred Date", "Party Size", "Special Requests"]
    - Salon/Spa: ["Name", "Email", "Phone", "Service Interest", "Preferred Date", "Message"]
    - Education: ["Name", "Email", "Phone", "Grade Level", "Subject Interest", "Message"]
    - Photography: ["Name", "Email", "Phone", "Event Type", "Event Date", "Budget Range"]
    - Real Estate: ["Name", "Email", "Phone", "Property Type", "Budget Range", "Preferred Location"]
    - Legal/Consulting: ["Name", "Email", "Phone", "Service Needed", "Preferred Contact Time", "Brief Description"]
    - Medical/Dental: ["Name", "Email", "Phone", "Reason for Visit", "Preferred Appointment Date", "Insurance Provider"]
    Always include: Name, Email, Phone + 2-3 business-specific fields that help qualify leads),
  "instagram": "handle if mentioned, else null",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"] (8-10 targeted SEO keywords including location, service type, and industry terms)
}

CRITICAL Instructions for Images:
- imageKeywords: Must be EXTREMELY SPECIFIC and VISUAL (5-7 words each)
  Examples: 
  * BAD: "yoga", "coffee", "gym", "food"
  * GOOD: "yoga instructor teaching warrior pose class", "barista pouring cappuccino with latte art", "athlete lifting heavy dumbbells gym workout", "chef preparing gourmet seafood platter"
- ALWAYS include: ACTION + SUBJECT + CONTEXT + LOCATION/ATMOSPHERE
- Think cinematically: What would make an amazing photo for THIS EXACT business?
- Keywords should capture DIFFERENT MOMENTS of the customer experience:
  * Moment 1: The service/product in action (someone doing/using it)
  * Moment 2: The environment/space (interior, atmosphere, setting)
  * Moment 3: The result/benefit (happy customers, finished product)
  * Moment 4: The expertise/process (professional at work, behind-the-scenes)
- Be HYPER-SPECIFIC to the business type and niche
- Include SENSORY details: "bright modern", "cozy warm", "professional clean", "energetic busy"
- imageDescriptions: Natural, engaging alt text that describes the scene (10-15 words each)

Examples of EXCELLENT keywords by business type:
- Cafe: "professional barista steaming milk creating latte art", "cozy coffee shop interior customers enjoying breakfast", "artisan pastries croissants display bakery case", "friends laughing sharing coffee outdoor patio"
- Gym: "muscular athlete performing deadlift heavy barbell", "group fitness class high intensity interval training", "personal trainer spotting client bench press", "modern gym interior with cardio equipment machines"
- Photography Studio: "professional photographer adjusting studio lighting portrait", "behind scenes photoshoot model posing camera", "gallery wall displaying framed photography prints", "photographer holding professional DSLR camera lens"
- Restaurant: "chef garnishing gourmet dish white plate elegantly", "elegant fine dining restaurant ambient candlelight atmosphere", "waiter serving wine happy couple anniversary dinner", "sizzling steak being grilled professional kitchen"
- Salon: "hairstylist blow drying client hair round brush", "luxury spa treatment massage facial relaxation", "modern hair salon interior styling stations mirrors", "makeup artist applying foundation beauty client"
- Yoga Studio: "yoga instructor demonstrating tree pose balance students", "sunrise meditation class peaceful studio atmosphere", "aerial yoga woman hanging silk hammock pose", "yoga mats rolled storage peaceful zen space"

DYNAMIC CONTENT GENERATION:
- Add UNIQUE elements that make each website feel custom-built, not template-based
- Vary section content based on business type (don't use same structure for all)
- Include specific numbers, achievements, or credentials when possible
- Use industry-specific terminology and language
- Reflect the business personality: formal/casual, luxury/affordable, traditional/modern
- Make every website feel like it was hand-crafted for THAT specific business

Other Critical Instructions:
- businessName: Extract from transcript, make it catchy and memorable (avoid generic names)
- tagline: MUST be unique, emotional, action-oriented, and BENEFIT-focused (not just descriptive). Should answer "What do customers gain?" Examples: "Transform Your Body, Transform Your Life" (not "A Gym For Everyone")
- description: Tell a compelling story in 3-4 sentences. Include: What you do differently, who you serve, and why customers choose you. Use power words and emotion.
- about: Write 150-200 words. MUST include: 
  * Opening hook (1-2 sentences about passion/mission)
  * Founding story OR years of experience (when/how started)
  * Unique approach/philosophy (what makes different)
  * Team/expertise background
  * Core values or customer promise
  * Personal/human touch (not corporate jargon)
  * Make it authentic, warm, and engaging
- features: Provide 10-12 SPECIFIC features with CONCRETE BENEFITS. Use numbers, metrics, and specifics:
  * "24/7 Access to Facilities" not "Always Available"
  * "500+ 5-Star Reviews" not "Many Happy Customers"
  * "Certified Trainers (10+ Years Experience)" not "Experienced Staff"
  * "Free Parking for 100+ Cars" not "Parking Available"
  * Include: quantifiable benefits, certifications, time/convenience factors, unique offerings
- testimonials: Create 3-4 REALISTIC testimonials that:
  * Use realistic full names (first + last)
  * Include specific roles/professions
  * Write 2-3 sentence detailed quotes (not generic praise)
  * Mention specific results, experiences, or improvements
  * Vary the focus (service quality, results, atmosphere, value)
  * Make them sound genuine and conversational
- services: Create 3-5 key service offerings with:
  * Clear, benefit-focused titles
  * 30-40 word descriptions explaining what's included
  * Highlight value, outcomes, and unique aspects
  * Use relevant emoji icons (✨🎯💎🌟🚀💪🎨🔥)
- faq: Generate 5-6 common questions based on business type:
  * Address pricing, timing, booking, what to expect, qualifications
  * Provide detailed 2-3 sentence answers
  * Be helpful, informative, and reassuring
  * Anticipate real customer concerns
- callToAction: Create URGENCY and DESIRE. Include action verb + benefit + optionally scarcity/social proof. Examples: "Join 500+ Members Today", "Book Your Free Trial - Limited Slots", "Start Your Journey Now - No Commitment"
- Think like a professional copywriter writing for a premium, customer-focused brand
- Use power words: Transform, Discover, Unlock, Master, Achieve, Experience, Premium, Exclusive, Guaranteed, Certified, Award-Winning
- Avoid generic phrases like "We offer", "We provide", "Quality service" - be specific and unique
- Write in active voice, be concise but impactful and rich in detail
- Every section should feel custom-crafted for THIS specific business

MANDATORY FOOTER BRANDING:
- EVERY website MUST include "Made with ❤️ by VaaniWeb" in the footer
- This should be prominently displayed at the bottom of every generated page
- Include proper credit link to VaaniWeb in the footer section
- This is NON-NEGOTIABLE and must appear on ALL generated websites
- Example footer text: "© 2025 [Business Name]. All rights reserved. | Made with ❤️ by VaaniWeb"

Return ONLY valid JSON, no markdown or extra text.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Latest working model (Oct 2024)
        messages: [
          {
            role: 'system',
            content: 'You are a professional website content generator. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000, // Increased for richer content (testimonials, services, FAQ)
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API Error:', response.status, errorText);
      
      // Fallback to enhanced static analysis if API fails
      const fallbackKeywords = extractBusinessKeywords(transcript);
      const fallbackImages = await fetchRealImages(fallbackKeywords, 4);
      return fallbackAnalysis(transcript, fallbackImages);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';
    
    console.log('🤖 AI Raw Response:', aiResponse);

    // Parse AI response (handle markdown code blocks if present)
    let jsonContent = aiResponse.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/g, '');
    }

    try {
      const aiContent: AIGeneratedContent = JSON.parse(jsonContent);
      
      // Validate required fields
      if (!aiContent.businessName || !aiContent.tagline) {
        console.error('❌ AI response missing required fields');
        const fallbackKeywords = extractBusinessKeywords(transcript);
        const fallbackImages = await fetchRealImages(fallbackKeywords, 4);
        return fallbackAnalysis(transcript, fallbackImages);
      }
      
      // Fetch real images based on AI-generated keywords
      const realImages = await fetchRealImages(
        aiContent.imageKeywords || ['business professional team', 'modern office workspace', 'quality service', 'customer satisfaction'],
        4 // Get 4 high-quality diverse images
      );

      // Generate proper descriptions if not provided by AI
      const properDescriptions = aiContent.imageDescriptions && aiContent.imageDescriptions.length > 0
        ? aiContent.imageDescriptions
        : generateImageDescriptions(aiContent.businessType || 'general');

      console.log('✅ AI Generated Content with real images:', {
        businessName: aiContent.businessName,
        imageCount: realImages.length,
        hasDescriptions: !!properDescriptions
      });
      
      return {
        ...aiContent,
        realImages, // Add real Pexels/Unsplash image URLs
        imageDescriptions: properDescriptions // Proper alt text descriptions, never URLs
      };
    } catch (parseError: any) {
      console.error('❌ Failed to parse AI JSON:', parseError.message);
      console.error('Raw content:', jsonContent);
      const fallbackKeywords = extractBusinessKeywords(transcript);
      const fallbackImages = await fetchRealImages(fallbackKeywords, 4);
      return fallbackAnalysis(transcript, fallbackImages);
    }

  } catch (error: any) {
    console.error('❌ AI Analysis Error:', error.message);
    // Fallback to enhanced analysis with real images
    const fallbackKeywords = extractBusinessKeywords(transcript);
    const fallbackImages = await fetchRealImages(fallbackKeywords, 4);
    return fallbackAnalysis(transcript, fallbackImages);
  }
}

// Enhanced fallback analysis (better than current static logic)
function fallbackAnalysis(transcript: string, realImages: string[]): AIGeneratedContent {
  console.log('⚠️ Using enhanced fallback analysis with real images');
  
  const words = transcript.toLowerCase().split(' ');
  
  // Intelligent business name extraction
  const businessName = extractBusinessName(transcript);
  
  // Smart theme color detection
  const themeColor = detectThemeColor(words);
  
  // Business type detection
  const businessType = detectBusinessType(words);
  
  // Generate intelligent tagline
  const tagline = generateTagline(businessName, businessType);
  
  // Generate relevant image keywords
  const imageKeywords = generateImageKeywords(businessType, words);
  
  // Generate human-readable image descriptions
  const imageDescriptions = generateImageDescriptions(businessType);
  
  // Extract Instagram handle
  const instagram = extractInstagram(words);
  
  // Generate features based on business type
  const features = generateFeatures(businessType);
  
  return {
    businessName,
    tagline,
    description: `${businessName} is your premier destination for quality and excellence. We pride ourselves on delivering exceptional service and creating memorable experiences for our valued customers.`,
    themeColor,
    businessType,
    imageKeywords,
    imageDescriptions,
    realImages, // Include real Pexels/Unsplash images
    sections: {
      about: `At ${businessName}, we combine passion with expertise to deliver outstanding results. Our team is dedicated to exceeding your expectations and building lasting relationships with every client we serve.`,
      features,
      callToAction: `Ready to experience excellence? Get in touch with ${businessName} today!`
    },
    contactFields: ['Name', 'Email', 'Phone', 'Message'],
    instagram: instagram || undefined,
    seoKeywords: [businessType, businessName.toLowerCase(), themeColor, 'professional', 'quality']
  };
}

function extractBusinessName(transcript: string): string {
  const words = transcript.split(' ');
  // Take first 2-4 meaningful words, capitalize properly
  const name = words
    .slice(0, Math.min(4, words.length))
    .filter(w => w.length > 2)
    .slice(0, 3)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return name || 'My Business';
}

function detectThemeColor(words: string[]): string {
  const colorMap: Record<string, string> = {
    pink: 'pink', rose: 'pink', magenta: 'pink',
    blue: 'blue', navy: 'blue', azure: 'blue',
    red: 'red', crimson: 'red', scarlet: 'red',
    green: 'green', emerald: 'green', lime: 'green',
    purple: 'purple', violet: 'purple', lavender: 'purple',
    yellow: 'yellow', gold: 'yellow', amber: 'yellow',
    orange: 'orange', coral: 'orange',
    black: 'gray', dark: 'gray', silver: 'gray',
    teal: 'teal', cyan: 'teal',
    indigo: 'indigo'
  };
  
  for (const word of words) {
    if (colorMap[word]) return colorMap[word];
  }
  return 'purple'; // Default
}

function detectBusinessType(words: string[]): string {
  const typeMap: Record<string, string> = {
    cake: 'bakery', bakery: 'bakery', dessert: 'bakery', pastry: 'bakery',
    coffee: 'cafe', cafe: 'cafe', espresso: 'cafe', latte: 'cafe',
    gym: 'gym', fitness: 'gym', workout: 'gym', training: 'gym', crossfit: 'gym',
    photo: 'photography', photography: 'photography', photographer: 'photography', wedding: 'photography',
    restaurant: 'restaurant', food: 'restaurant', dining: 'restaurant', cuisine: 'restaurant',
    shop: 'shop', store: 'shop', boutique: 'shop', retail: 'shop',
    salon: 'salon', spa: 'salon', beauty: 'salon', parlour: 'salon', hair: 'salon',
    hotel: 'hotel', resort: 'hotel', lodge: 'hotel', accommodation: 'hotel',
    tech: 'tech', software: 'tech', app: 'tech', digital: 'tech',
    consulting: 'consulting', consultant: 'consulting', advisory: 'consulting'
  };
  
  for (const word of words) {
    if (typeMap[word]) return typeMap[word];
  }
  return 'general';
}

function generateTagline(businessName: string, businessType: string): string {
  const taglines: Record<string, string[]> = {
    bakery: [
      'Where every bite tells a delicious story',
      'Crafting sweet memories, one treat at a time',
      'Fresh baked goodness delivered daily'
    ],
    cafe: [
      'Your daily dose of comfort and flavor',
      'Where great coffee meets warm hospitality',
      'Brewing excellence in every cup'
    ],
    gym: [
      'Transform your body, elevate your life',
      'Where dedication meets results',
      'Your journey to peak performance starts here'
    ],
    photography: [
      'Capturing moments that last forever',
      'Turning your precious memories into timeless art',
      'Creating visual stories that inspire'
    ],
    restaurant: [
      'An unforgettable culinary journey awaits',
      'Where flavors come alive and memories are made',
      'Elevating dining to an art form'
    ],
    general: [
      'Excellence in every detail, quality in every service',
      'Your trusted partner for exceptional results',
      'Where innovation meets dedication'
    ]
  };
  
  const options = taglines[businessType] || taglines.general;
  return options[Math.floor(Math.random() * options.length)];
}

function generateImageKeywords(businessType: string, words: string[]): string[] {
  const keywordMap: Record<string, string[]> = {
    bakery: [
      'baker kneading dough flour hands professional',
      'fresh baked pastries croissants display case',
      'artisan bread loaves wooden board rustic',
      'decorated birthday cake frosting colorful bakery'
    ],
    cafe: [
      'barista pouring latte art milk coffee cup',
      'cozy cafe interior customers sitting chatting',
      'coffee beans roasting machine steam aromatic',
      'people enjoying breakfast coffee shop morning'
    ],
    gym: [
      'person lifting weights barbell gym fitness',
      'modern gym equipment machines cardio workout',
      'personal trainer coaching client exercise motivation',
      'group fitness class people exercising yoga'
    ],
    photography: [
      'photographer holding camera professional shooting portrait',
      'photo studio lighting equipment setup professional',
      'wedding couple posing photographer outdoor ceremony',
      'portrait photography session model camera flash'
    ],
    restaurant: [
      'chef cooking kitchen flames gourmet food',
      'elegant food plating dish garnish presentation',
      'fine dining restaurant interior tables candles',
      'customers enjoying dinner meal happy friends'
    ],
    salon: [
      'hairstylist cutting client hair scissors professional',
      'beauty spa facial treatment relaxing massage',
      'modern salon interior styling chairs mirrors',
      'makeup artist applying cosmetics model beauty'
    ],
    hotel: [
      'luxury hotel room king bed interior',
      'resort swimming pool palm trees vacation',
      'hotel reception lobby desk modern elegant',
      'concierge service helping guest smiling hospitality'
    ],
    shop: [
      'boutique clothing store display mannequins fashion',
      'retail shopping interior shelves products modern',
      'customer browsing products shopping bags happy',
      'modern store design counter checkout display'
    ],
    tech: [
      'developers working computers coding office teamwork',
      'modern technology workspace desk multiple monitors',
      'innovation digital devices tablet laptop phone',
      'software engineer programming screen code light'
    ],
    consulting: [
      'business meeting professionals discussing strategy boardroom',
      'consultant presenting data chart whiteboard office',
      'office collaboration team discussion ideas brainstorming',
      'corporate workspace modern glass office building'
    ],
    yoga: [
      'woman doing yoga pose mat sunrise meditation',
      'peaceful yoga studio plants natural light',
      'yoga class group people practicing together',
      'instructor teaching yoga pose demonstrating students'
    ],
    spa: [
      'spa massage therapist treatment relaxing candles',
      'wellness treatment room calm peaceful stones',
      'aromatherapy essential oils candles towels spa',
      'person relaxing spa robe peaceful facial'
    ],
    pet: [
      'veterinarian examining dog pet care clinic',
      'happy golden retriever dog smiling grooming',
      'pet grooming professional washing dog bath',
      'animals cats dogs veterinary clinic waiting'
    ],
    education: [
      'teacher students classroom learning discussion interactive',
      'modern learning environment technology tablets students',
      'studying books library desk focused concentration',
      'online education laptop video call learning'
    ],
    medical: [
      'doctor patient consultation stethoscope examination clinic',
      'modern medical clinic equipment clean white',
      'healthcare professional nurse working hospital scrubs',
      'hospital medical equipment technology modern care'
    ],
    legal: [
      'lawyer office professional suit desk books',
      'law books library shelves legal research',
      'business meeting legal consultation documents handshake',
      'courthouse building justice scales architecture columns'
    ],
    automotive: [
      'mechanic working under car engine repair',
      'modern auto repair shop tools equipment',
      'car maintenance service mechanic checking vehicle',
      'automotive diagnostic tools computer technology modern'
    ],
    'real-estate': [
      'modern house exterior architecture beautiful landscaping',
      'real estate agent showing property clients tour',
      'luxury home interior living room elegant',
      'beautiful property landscape garden outdoor pool'
    ],
    travel: [
      'airplane flying clouds sunset travel vacation',
      'travel destination tropical beach palm trees',
      'tourist exploring historic city architecture sightseeing',
      'vacation resort tropical pool mountains view'
    ],
    general: [
      'professional business team meeting discussing strategy office',
      'modern office workspace desk computer clean',
      'customer service representative helping client smiling',
      'quality products display showcase elegant presentation'
    ]
  };
  
  return keywordMap[businessType] || keywordMap.general;
}

function generateImageDescriptions(businessType: string): string[] {
  const descriptionMap: Record<string, string[]> = {
    bakery: ['Professional baker crafting artisan bread', 'Fresh pastries on display', 'Artisan bread baking in oven', 'Beautifully decorated cakes'],
    cafe: ['Barista creating latte art', 'Cozy cafe atmosphere with customers', 'Fresh coffee beans being roasted', 'People enjoying coffee together'],
    gym: ['Fitness enthusiast lifting weights', 'State-of-the-art gym equipment', 'Personal trainer coaching a client', 'Group fitness class in action'],
    photography: ['Professional photographer at work', 'Photography studio with lighting', 'Wedding couple during photoshoot', 'Portrait photography session'],
    restaurant: ['Chef preparing gourmet dishes', 'Elegantly plated fine dining dish', 'Sophisticated restaurant interior', 'Guests enjoying their meal'],
    salon: ['Hairstylist serving a client', 'Relaxing spa treatment', 'Modern salon interior design', 'Makeup artist creating a look'],
    hotel: ['Luxurious hotel room', 'Beautiful resort pool area', 'Elegant hotel lobby reception', 'Professional hospitality service'],
    shop: ['Attractive product display', 'Modern retail store interior', 'Customer shopping experience', 'Contemporary store design'],
    tech: ['Development team collaborating', 'Modern tech workspace', 'Innovative digital solutions', 'Software development in progress'],
    consulting: ['Business professionals in meeting', 'Consultant presenting strategy', 'Team collaboration session', 'Modern corporate workspace'],
    yoga: ['Yoga practice at sunrise', 'Peaceful meditation setting', 'Group yoga class', 'Instructor demonstrating pose'],
    spa: ['Relaxing spa massage', 'Tranquil wellness room', 'Spa aromatherapy setup', 'Guest enjoying spa treatment'],
    pet: ['Veterinarian caring for pet', 'Happy pet in care', 'Professional grooming service', 'Veterinary clinic environment'],
    education: ['Teacher with students', 'Modern learning space', 'Students studying together', 'Educational technology in use'],
    medical: ['Doctor with patient', 'Clean medical clinic', 'Healthcare professional', 'Modern medical equipment'],
    legal: ['Professional law office', 'Legal reference library', 'Business legal consultation', 'Justice and law concept'],
    automotive: ['Mechanic servicing vehicle', 'Professional auto repair shop', 'Car maintenance service', 'Automotive repair equipment'],
    'real-estate': ['Beautiful modern home', 'Real estate professional', 'Luxury interior design', 'Attractive property grounds'],
    travel: ['Scenic travel destination', 'Beautiful vacation spot', 'Exploring new places', 'Tropical resort paradise'],
    general: ['Professional team at work', 'Modern business environment', 'Excellent customer service', 'Quality products and services']
  };
  
  return descriptionMap[businessType] || descriptionMap.general;
}

function generateFeatures(businessType: string): string[] {
  const featureMap: Record<string, string[]> = {
    bakery: [
      'Fresh ingredients sourced daily',
      'Custom orders for special occasions',
      'Artisanal baking techniques',
      'Wide variety of flavors and styles'
    ],
    cafe: [
      'Premium quality coffee beans',
      'Comfortable and inviting atmosphere',
      'Expert baristas with passion',
      'Fresh pastries and light bites'
    ],
    gym: [
      'State-of-the-art equipment',
      'Personal training programs',
      'Flexible membership options',
      'Supportive community environment'
    ],
    photography: [
      'Professional grade equipment',
      'Creative and artistic vision',
      'Fast turnaround on deliveries',
      'Custom packages available'
    ],
    restaurant: [
      'Chef-curated seasonal menu',
      'Fresh, locally sourced ingredients',
      'Elegant ambiance',
      'Exceptional service standards'
    ],
    general: [
      'Expert professional team',
      'Customer-centric approach',
      'Quality guaranteed results',
      'Competitive pricing'
    ]
  };
  
  return featureMap[businessType] || featureMap.general;
}

function extractInstagram(words: string[]): string | null {
  const instagramIndex = words.indexOf('instagram');
  if (instagramIndex !== -1 && instagramIndex < words.length - 1) {
    return words[instagramIndex + 1].replace(/[^a-z0-9_]/g, '');
  }
  return null;
}

// Extract relevant keywords from business description for image search
function extractBusinessKeywords(transcript: string): string[] {
  const words = transcript.toLowerCase().split(' ');
  const businessType = detectBusinessType(words);
  
  // Base keywords from business type
  const baseKeywords: Record<string, string[]> = {
    bakery: ['bakery', 'pastries', 'bread', 'cafe'],
    cafe: ['cafe', 'coffee', 'interior', 'cozy'],
    gym: ['fitness', 'gym', 'workout', 'training'],
    photography: ['photography', 'camera', 'professional', 'studio'],
    restaurant: ['restaurant', 'food', 'dining', 'culinary'],
    salon: ['salon', 'beauty', 'spa', 'wellness'],
    hotel: ['hotel', 'hospitality', 'luxury', 'accommodation'],
    tech: ['technology', 'innovation', 'digital', 'modern'],
    consulting: ['business', 'professional', 'consulting', 'corporate'],
    yoga: ['yoga', 'meditation', 'wellness', 'mindfulness'],
    spa: ['spa', 'relaxation', 'massage', 'wellness'],
    pet: ['pet', 'animals', 'care', 'veterinary'],
    education: ['education', 'learning', 'school', 'students'],
    medical: ['medical', 'health', 'clinic', 'healthcare'],
    legal: ['legal', 'law', 'office', 'professional'],
    automotive: ['automotive', 'cars', 'mechanic', 'service'],
    'real-estate': ['real estate', 'property', 'homes', 'architecture'],
    travel: ['travel', 'tourism', 'adventure', 'destinations'],
    general: ['business', 'professional', 'service', 'quality']
  };
  
  return baseKeywords[businessType] || baseKeywords.general;
}
