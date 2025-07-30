import React, { useState } from 'react';
import { Review } from '@/lib/types';
import { useAuth } from '@/app/contexts/AuthContext';
import { reviewsApi } from '@/hooks/useReviews';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

interface ReviewListProps {
  reviews: Review[];
  onReviewUpdate: () => void;
  className?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onReviewUpdate, className = '' }) => {
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState<number | null>(null);

  const handleEdit = (reviewId: number) => {
    setEditingReview(reviewId);
  };

  const handleDelete = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsApi.delete(reviewId);
        onReviewUpdate();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review');
      }
    }
  };

  const handleEditSubmit = async (reviewId: number, rating: number, comment: string) => {
    try {
      await reviewsApi.update(reviewId, { rating, comment });
      setEditingReview(null);
      onReviewUpdate();
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    }
  };

  const canModifyReview = (review: Review) => {
    return user && review.user_id === user.id;
  };

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 text-lg mb-2">📝</div>
        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Reviews ({reviews.length})
      </h3>
      
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 space-y-3"
        >
          {editingReview === review.id ? (
            // Edit mode
            <EditReviewForm
              review={review}
              onSubmit={(rating, comment) => handleEditSubmit(review.id, rating, comment)}
              onCancel={() => setEditingReview(null)}
            />
          ) : (
            // Display mode
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm text-gray-400">
                      by {review.user?.email || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                    {review.is_verified_purchase && (
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                        ✓ Verified Purchase
                      </span>
                    )}
                    {review.is_spoiler && (
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                        ⚠️ Spoiler
                      </span>
                    )}
                  </div>
                  
                  {review.comment && (
                    <div className={`text-gray-300 ${review.is_spoiler ? 'spoiler-blur hover:spoiler-reveal' : ''}`}>
                      {review.comment}
                    </div>
                  )}
                </div>

                {canModifyReview(review) && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(review.id)}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {review.helpful_count > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>👍</span>
                  <span>{review.helpful_count} people found this helpful</span>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

// Component for editing a review
interface EditReviewFormProps {
  review: Review;
  onSubmit: (rating: number, comment: string) => void;
  onCancel: () => void;
}

const EditReviewForm: React.FC<EditReviewFormProps> = ({ review, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          editable={true}
          size="md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
          rows={3}
          placeholder="Update your comment"
        />
      </div>
      
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          Update
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewList;
