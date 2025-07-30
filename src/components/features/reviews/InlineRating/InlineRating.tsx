import React, { useState, useEffect } from 'react';
import StarRating from '../StarRating';

interface InlineRatingProps {
  itemId: number;
  itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const InlineRating: React.FC<InlineRatingProps> = ({
  itemId,
  itemType,
  onClick,
  size = 'sm',
  className = ''
}) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/books/reviews?item_id=${itemId}&item_type=${itemType}&limit=1000`);
        if (response.ok) {
          const reviews = await response.json();
          if (reviews.length > 0) {
            const averageRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length;
            setRating(averageRating);
            setReviewCount(reviews.length);
          }
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [itemId, itemType]);

  if (loading) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
        <div className="w-8 h-3 bg-gray-600 rounded animate-pulse"></div>
      </div>
    );
  }

  if (reviewCount === 0) {
    return (
      <div className={`flex items-center space-x-1 text-gray-500 ${className}`}>
        <span className="text-xs">No reviews</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center space-x-2 ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={onClick}
    >
      <StarRating rating={rating} size={size} />
      <span className="text-xs text-gray-400">
        ({reviewCount})
      </span>
    </div>
  );
};

export default InlineRating;
