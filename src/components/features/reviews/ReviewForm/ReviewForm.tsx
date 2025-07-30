import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ReviewInsert } from '@/lib/types';
import { reviewsApi } from '@/lib/hooks/useReviews';

// Define form schema using Zod
const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  itemId: number;
  itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ itemId, itemType, onSuccess }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 1,
      comment: '',
    }
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await reviewsApi.create({ ...data, item_id: itemId, item_type: itemType });
      onSuccess();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Rating *</label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <input
              type="number"
              min="1"
              max="5"
              {...field}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
              placeholder="Rate between 1 and 5"
            />
          )}
        />
        {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
              placeholder="Write your comment"
            />
          )}
        />
        {errors.comment && <p className="text-red-400 text-sm mt-1">{errors.comment.message}</p>}
      </div>

      <button
        type="submit"
        className="neon-button-orange px-6 py-3 w-full font-medium"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
