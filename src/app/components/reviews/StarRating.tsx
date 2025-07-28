import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRatingChange,
  editable = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const handleStarClick = (starIndex: number) => {
    if (editable && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalfFilled = index < rating && index >= Math.floor(rating);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(index)}
            disabled={!editable}
            className={`${
              editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform duration-200 ${
              isFilled 
                ? 'text-yellow-400' 
                : isHalfFilled 
                  ? 'text-yellow-300' 
                  : 'text-gray-600'
            }`}
          >
            ⭐
          </button>
        );
      })}
      <span className="ml-2 text-gray-300 text-sm">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
