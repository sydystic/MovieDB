import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

const MovieReviews = ({ movieId }: { movieId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedReviews = localStorage.getItem(`movieReviews_${movieId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [movieId]);

  const handleSubmitReview = () => {
    if (!newReview.trim()) return;

    setIsSubmitting(true);

    const review: Review = {
      id: Date.now().toString(),
      userId: 'user1',
      username: 'Movie Fan',
      content: newReview.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    localStorage.setItem(`movieReviews_${movieId}`, JSON.stringify(updatedReviews));
    setNewReview('');
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>

      {/* Review Input Section - Matching the UI style from the screenshot */}
      <div className="mb-6">
        <div className="bg-gray-800/30 rounded-lg">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write a review..."
            className="w-full h-20 bg-transparent p-3 text-white placeholder-gray-400 focus:outline-none resize-none"
          />
          <div className="flex justify-end p-2 border-t border-gray-700">
            <button
              onClick={handleSubmitReview}
              disabled={!newReview.trim() || isSubmitting}
              className="px-4 py-1.5 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Post Review
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">Be the first to review this movie!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{review.username}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{review.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieReviews;