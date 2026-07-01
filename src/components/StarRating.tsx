import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (newRating: number) => void;
  totalRatings?: number;
  userRating?: number;
  className?: string;
  ratingDistribution?: { [key: number]: number };  // Change the key to number
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  totalRatings = 0,
  userRating = 0,
  className = '',
  ratingDistribution = {},
}) => {
  const [hovered, setHovered] = useState(0);

  const handleMouseEnter = (starIndex: number) => setHovered(starIndex);
  const handleMouseLeave = () => setHovered(0);
  const handleClick = (starIndex: number) => onRatingChange(starIndex);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isHovered = i <= hovered;
      const isRated = i <= userRating;

      stars.push(
        <Star
          key={i}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          className={`w-8 h-8 cursor-pointer transition-colors duration-200
            ${isHovered || isRated ? 'text-yellow-400' : 'text-gray-600'}`}
          fill={isHovered || isRated ? 'currentColor' : 'none'}
        />
      );
    }
    return stars;
  };

  const renderRatingBars = () => {
    // Initialize default distribution if empty
    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, ...ratingDistribution };

    // Calculate total votes for percentage
    const totalVotes = Object.values(distribution).reduce((sum, count) => sum + count, 0) || 1; // Prevent division by zero

    // Find max count for bar scaling
    const maxCount = Math.max(...Object.values(distribution), 1);

    return Array.from({ length: 5 }, (_, i) => {
      const stars = 5 - i; // Reverse order (5 to 1)
      const count = distribution[stars] || 0;
      const percentage = ((count / totalVotes) * 100).toFixed(1);
      const barWidth = `${(count / maxCount) * 100}%`;

      return (
        <div key={stars} className="flex items-center gap-2 mb-1">
          <div className="w-6 text-sm text-gray-400">
            {stars}★
          </div>

          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: barWidth }}
            />
          </div>

          <div className="w-16 text-right text-sm text-gray-400">
            {percentage}%
          </div>
        </div>
      );
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Rate This Movie</h2>
        {userRating > 0 && (
          <div className="text-sm text-gray-400">
            Your rating: {userRating}
          </div>
        )}
      </div>

      <div className="flex space-x-1">{renderStars()}</div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Rating Distribution</span>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>{rating.toFixed(1)}</span>
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span>({totalRatings})</span>
          </div>
        </div>
        <div>{renderRatingBars()}</div>
      </div>
    </div>
  );
};

export default StarRating;