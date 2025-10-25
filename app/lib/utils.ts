// Utility functions for VaaniWeb

/**
 * Get current year for copyright notices
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Generate professional image URLs from Pexels
 * Better quality and consistent results compared to Unsplash
 */
export function getPexelsImage(keyword: string, width: number = 1200, height: number = 800): string {
  // Curated professional business images from Pexels
  const businessImages: Record<string, string> = {
    business: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    office: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    cafe: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    bakery: 'https://images.pexels.com/photos/2955375/pexels-photo-2955375.jpeg',
    restaurant: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    gym: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg',
    fitness: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
    salon: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
    spa: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg',
    shop: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg',
    boutique: 'https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg',
    photography: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
    hotel: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    food: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    cake: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg',
    coffee: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    default: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
  };

  // Find matching image or use default
  const lowerKeyword = keyword.toLowerCase();
  const imageUrl = businessImages[lowerKeyword] || businessImages.default;
  
  // Add Pexels optimization parameters
  return `${imageUrl}?auto=compress&cs=tinysrgb&w=${width}&h=${height}&dpr=1`;
}

/**
 * Get multiple curated images for gallery sections
 */
export function getGalleryImages(keywords: string[]): string[] {
  return keywords.map((keyword, index) => {
    // Use different sizes for variety
    const sizes = [
      { w: 900, h: 900 },
      { w: 1000, h: 800 },
      { w: 800, h: 1000 }
    ];
    const size = sizes[index % sizes.length];
    return getPexelsImage(keyword, size.w, size.h);
  });
}
