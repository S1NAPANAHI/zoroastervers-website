import React, { useState, useEffect } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/app/contexts/AuthContext';
import StarRating from './StarRating';
import RatingDistribution from './RatingDistribution';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

interface ReviewPanelProps {
  itemId: number;
  itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  itemTitle: string;
  isModal?: boolean;
  onClose?: () => void;
  className?: string;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({
  itemId,
  itemType,
  itemTitle,
  isModal = false,
  onClose,
  className = ''
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showWriteReview, setShowWriteReview] = useState(false);
  
  const { 
    reviews, 
    isLoading, 
    error, 
    refetch 
  } = useReviews({
    filters: { item_id: itemId, item_type: itemType },
    pagination: { limit: 20, offset: 0 }
  });

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Check if current user has already reviewed this item
  const userReview = reviews?.find(review => review.user_id === user?.id);

  const handleReviewSuccess = () => {
    setShowWriteReview(false);
    refetch();
  };

  const handleReviewUpdate = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="ml-3 text-gray-300">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-400 mb-2">⚠️</div>
        <p className="text-red-400">Failed to load reviews</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-cyan-400 hover:text-cyan-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Reviews for {itemTitle}
          </h2>
          <div className="flex items-center space-x-4">
            <StarRating rating={averageRating} size="lg" />
            <span className="text-gray-400">
              {reviews?.length || 0} review{(reviews?.length || 0) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Rating Distribution */}
      {reviews && reviews.length > 0 && (
        <RatingDistribution reviews={reviews} />
      )}

      {/* Write Review Section */}
      {isAuthenticated && !userReview && (
        <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
          {!showWriteReview ? (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Share Your Thoughts
              </h3>
              <p className="text-gray-400 mb-4">
                Help others by writing a review for this {itemType}.
              </p>
              <button
                onClick={() => setShowWriteReview(true)}
                className="neon-button-cyan px-6 py-3 font-medium"
              >
                ✍️ Write a Review
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Write Your Review
              </h3>
              <ReviewForm
                itemId={itemId}
                itemType={itemType}
                onSuccess={handleReviewSuccess}
              />
              <button
                onClick={() => setShowWriteReview(false)}
                className="mt-3 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* User's existing review notice */}
      {isAuthenticated && userReview && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">ℹ️</span>
            <span className="text-blue-300">
              You've already reviewed this {itemType}. You can edit or delete your review below.
            </span>
          </div>
        </div>
      )}

      {/* Login prompt for unauthenticated users */}
      {!isAuthenticated && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
          <p className="text-purple-300 mb-3">
            Sign in to write a review and help other readers.
          </p>
          <div className="space-x-3">
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="inline-block px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <ReviewList
        reviews={reviews || []}
        onReviewUpdate={handleReviewUpdate}
      />
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`glass-dark rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto ${className}`}>
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 rounded-lg border border-gray-700 p-6 ${className}`}>
      {content}
    </div>
  );
};

export default ReviewPanel;
