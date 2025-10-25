// Groq AI Service - Intelligent Website Generation
// Uses Groq's fast LLM inference for dynamic content creation

interface AIGeneratedContent {
  businessName: string;
  tagline: string;
  description: string;
  themeColor: string;
  businessType: string;
  imageKeywords: string[];
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

export async function analyzeTranscriptWithAI(transcript: string): Promise<AIGeneratedContent> {
  try {
    console.log('🤖 Analyzing transcript with Groq AI:', transcript);

    const prompt = `You are a professional website content creator. Analyze the following business description and generate comprehensive website content.

User's Description: "${transcript}"

Generate a JSON response with the following structure:
{
  "businessName": "Professional business name (2-4 words)",
  "tagline": "Catchy, compelling tagline (10-15 words)",
  "description": "Engaging 2-3 sentence description",
  "themeColor": "One of: pink, blue, purple, green, red, orange, yellow, gray, indigo, teal",
  "businessType": "One of: cafe, bakery, gym, photography, restaurant, shop, salon, hotel, tech, consulting, general",
  "imageKeywords": ["keyword1", "keyword2", "keyword3"] (3 relevant image search keywords),
  "sections": {
    "about": "Compelling about section (50-80 words)",
    "features": ["feature1", "feature2", "feature3", "feature4"] (4 unique features),
    "callToAction": "Motivating CTA text (10-15 words)"
  },
  "contactFields": ["Name", "Email", "Phone", "Message"] (add custom fields if needed),
  "instagram": "handle if mentioned, else null",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"] (5 SEO keywords)
}

Important: 
- Make content professional and appealing to investors
- Tagline should be unique and memorable
- Image keywords should be specific to the business
- Features should highlight unique value propositions
- Return ONLY valid JSON, no markdown or extra text`;

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
      return fallbackAnalysis(transcript);
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
        return fallbackAnalysis(transcript);
      }
      
      console.log('✅ AI Generated Content:', aiContent);
      return aiContent;
    } catch (parseError: any) {
      console.error('❌ Failed to parse AI JSON:', parseError.message);
      console.error('Raw content:', jsonContent);
      return fallbackAnalysis(transcript);
    }

  } catch (error: any) {
    console.error('❌ AI Analysis Error:', error.message);
    // Fallback to enhanced analysis
    return fallbackAnalysis(transcript);
  }
}

// Enhanced fallback analysis (better than current static logic)
function fallbackAnalysis(transcript: string): AIGeneratedContent {
  console.log('⚠️ Using enhanced fallback analysis');
  
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
    bakery: ['artisan bread', 'pastries', 'cake decoration'],
    cafe: ['latte art', 'coffee beans', 'cozy cafe interior'],
    gym: ['fitness training', 'gym equipment', 'athletic workout'],
    photography: ['professional camera', 'portrait photography', 'wedding ceremony'],
    restaurant: ['gourmet food', 'fine dining', 'chef cooking'],
    salon: ['hair styling', 'beauty treatment', 'spa relaxation'],
    hotel: ['luxury hotel room', 'resort pool', 'hospitality service'],
    shop: ['boutique store', 'shopping display', 'retail products'],
    tech: ['modern technology', 'digital innovation', 'software development'],
    consulting: ['business meeting', 'professional consultation', 'strategy planning'],
    general: ['professional service', 'business success', 'quality work']
  };
  
  return keywordMap[businessType] || keywordMap.general;
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
