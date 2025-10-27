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
  };
  contactFields: string[];
  instagram?: string;
  seoKeywords: string[];
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_DUMMY_KEY_REPLACE_WITH_REAL_ONE';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Pexels API for high-quality business images
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

/**
 * Fetch real, relevant images from Pexels API for better quality and variety
 * Optimized for speed with shorter timeout and direct fallback
 */
async function fetchRealImages(keywords: string[], count: number = 4): Promise<string[]> {
  console.log(`📸 Fetching ${count} real images for keywords:`, keywords);
  
  const images: string[] = [];
  const usedUrls = new Set<string>();
  
  // Fast fallback: Always use Unsplash as primary (no API calls, direct URLs)
  // This is faster and more reliable than Pexels API calls
  for (let i = 0; i < count && i < keywords.length; i++) {
    const keyword = keywords[i];
    const seed = Date.now() + i + Math.floor(Math.random() * 10000);
    const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)}&sig=${seed}`;
    
    if (!usedUrls.has(imageUrl)) {
      images.push(imageUrl);
      usedUrls.add(imageUrl);
      console.log(`✅ Image ${i + 1} for "${keyword}"`);
    }
  }
  
  // Fill remaining slots with generic business images
  while (images.length < count) {
    const fallbackKeywords = ['business team', 'office workspace', 'professional service', 'modern business'];
    const keyword = fallbackKeywords[images.length % fallbackKeywords.length];
    const seed = Date.now() + images.length + Math.floor(Math.random() * 10000);
    const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)}&sig=${seed}`;
    
    if (!usedUrls.has(imageUrl)) {
      images.push(imageUrl);
      usedUrls.add(imageUrl);
    }
  }
  
  console.log(`✅ Fetched ${images.length} images successfully`);
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
    "about": "Compelling about section (60-100 words, tell the story)",
    "features": ["feature1", "feature2", "feature3", "feature4", "feature5"] (5 unique value propositions),
    "callToAction": "Motivating CTA text (10-15 words)"
  },
  "contactFields": ["Name", "Email", "Phone", "Message"] (add custom fields like "Appointment Date" if relevant),
  "instagram": "handle if mentioned, else null",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"] (6 SEO keywords)
}

CRITICAL Instructions for Images:
- imageKeywords: Must be EXTREMELY SPECIFIC and DESCRIPTIVE (3-5 words each)
  Examples: 
  * BAD: "yoga", "coffee", "gym"
  * GOOD: "woman doing yoga sunrise", "barista pouring latte art", "modern gym equipment weights"
- Include ACTION WORDS and CONTEXT in keywords
- Think about what REAL photos would show for this business
- imageDescriptions: Short, natural descriptions for screen readers and alt text
- Ensure keywords are diverse enough to get DIFFERENT images

Other Critical Instructions:
- businessName: Extract from transcript, make it catchy and memorable
- tagline: MUST be unique, emotional, and action-oriented (not generic)
- description: Focus on what makes THIS business special
- about: Tell a story that connects emotionally, mention years/experience if applicable
- features: Each feature should be a unique selling point (USP), not generic statements
- callToAction: Should create urgency and excitement
- Think like a marketing expert writing for a premium brand

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
        max_tokens: 2000,
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

      console.log('✅ AI Generated Content with real images:', {
        businessName: aiContent.businessName,
        imageCount: realImages.length,
        hasDescriptions: !!aiContent.imageDescriptions
      });
      
      return {
        ...aiContent,
        realImages, // Add real Pexels/Unsplash image URLs
        imageDescriptions: aiContent.imageDescriptions || aiContent.imageKeywords // Fallback to keywords if no descriptions
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
    bakery: ['baker kneading dough professional', 'fresh pastries display bakery', 'artisan bread oven baking', 'decorated cakes showcase'],
    cafe: ['barista making latte art', 'cozy cafe interior customers', 'coffee beans roasting machine', 'people enjoying coffee cafe'],
    gym: ['person lifting weights gym', 'modern fitness equipment', 'trainer coaching client', 'group exercise class'],
    photography: ['photographer holding camera professional', 'photo studio lighting setup', 'wedding couple posing', 'portrait photography session'],
    restaurant: ['chef cooking kitchen professional', 'elegant food plating dish', 'fine dining restaurant interior', 'customers enjoying meal'],
    salon: ['hairstylist cutting hair', 'beauty spa treatment relaxing', 'modern salon interior', 'makeup artist working'],
    hotel: ['luxury hotel room interior', 'resort swimming pool view', 'hotel reception lobby', 'concierge service hospitality'],
    shop: ['boutique store display products', 'retail shopping interior', 'customer browsing products', 'modern store design'],
    tech: ['developers working computers office', 'modern technology workspace', 'innovation digital devices', 'software coding screen'],
    consulting: ['business meeting professional team', 'consultant presenting strategy', 'office collaboration discussion', 'corporate workspace modern'],
    yoga: ['woman doing yoga sunrise', 'peaceful meditation space', 'yoga class group practicing', 'instructor teaching pose'],
    spa: ['spa massage therapy relaxing', 'wellness treatment room', 'aromatherapy candles towels', 'person relaxing spa'],
    pet: ['veterinarian examining pet', 'happy dog pet care', 'pet grooming service', 'animals veterinary clinic'],
    education: ['teacher students classroom', 'modern learning environment', 'studying books library', 'online education technology'],
    medical: ['doctor patient consultation', 'modern medical clinic', 'healthcare professional working', 'hospital equipment clean'],
    legal: ['lawyer office professional', 'law books library', 'business meeting legal', 'courthouse justice concept'],
    automotive: ['mechanic working car engine', 'modern auto shop', 'car repair service', 'automotive tools equipment'],
    'real-estate': ['modern house exterior architecture', 'real estate agent showing property', 'luxury home interior', 'beautiful property landscape'],
    travel: ['airplane flying sunset', 'travel destination beautiful', 'tourist exploring city', 'vacation resort tropical'],
    general: ['professional business team meeting', 'modern office workspace', 'customer service interaction', 'quality products display']
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
