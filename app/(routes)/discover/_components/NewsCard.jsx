import React from 'react';
import Image from 'next/image';

const NewsCard = ({ news }) => {
  // Function to get the best available image
  const getImageUrl = (news) => {
    if (!news?.pagemap) return null;
    
    // Priority order for images
    const imageSources = [
      news.pagemap.cse_image?.[0]?.src,
      news.pagemap.imageobject?.[0]?.url,
      news.pagemap.metatags?.[0]?.['og:image'],
      news.pagemap.cse_thumbnail?.[0]?.src,
    ];
    
    return imageSources.find(src => src) || null;
  };

  const imageUrl = getImageUrl(news);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Section */}
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={news?.title || 'News image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Hide image on error
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {news?.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
          {news?.snippet}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {news?.displayLink}
          </span>
          <a 
            href={news?.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-medium text-sm"
          >
            Read More →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;