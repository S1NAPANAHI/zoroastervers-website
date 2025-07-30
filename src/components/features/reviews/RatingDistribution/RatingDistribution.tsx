import React from 'react';
import { Review } from '@/lib/types';

interface RatingDistributionProps {
  reviews: Review[];
  className?: string;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({ reviews, className = '' }) => {
  // Calculate rating distribution
  const distribution = reviews.reduce(
    (acc, review) => {
      acc[review.rating - 1]++;
      return acc;
    },
    [0, 0, 0, 0, 0] // For ratings 1-5
  );

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Rating Distribution</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-400">
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Rating bars */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating - 1];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-sm text-gray-300 w-4">{rating}</span>
              <span className="text-yellow-400">⭐</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingDistribution;
