import { Link } from 'react-router-dom';
import { Star, Plus, X } from 'lucide-react';
import { useWatchlist } from './WatchlistContext';

export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  poster?: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
  genres?: string[]; // Updated genres type
  overview: string;
}

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void; // Strongly typed
  onUpdateRating?: (movieId: number, newRating: number) => void;
  view?: 'watchlist' | 'browse' | 'onUpdateRating' | 'recommended';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onUpdateRating, view = 'browse' }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Ensure movie has required properties
  if (!movie?.id || !movie?.title) {
    return null;
  }

  // Check if movie is already in the watchlist
  const isInWatchlist = watchlist.some((m) => m.id === movie.id);

  // Handle adding or removing from watchlist
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      const genreIds = movie.genre_ids || movie.genres || [];
      addToWatchlist({
        id: movie.id,
        title: movie.title,
        poster: movie.poster || (movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '/api/placeholder/500/750'),
        genres: Array.isArray(genreIds) ? genreIds.map(String) : [],
        vote_average: movie.vote_average || 0, // Default to 0 if undefined
        release_date: movie.release_date || 'Unknown', // Default release date
        overview: movie.overview || 'No overview available', // Default overview
      });
    }
  };

  // Handle rating changes
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRating = parseFloat(e.target.value);
    if (onUpdateRating) {
      onUpdateRating(movie.id, newRating);
    }
  };

  // Set poster URL with fallback
  const posterUrl =
    view === 'watchlist'
      ? movie.poster
      : movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/api/placeholder/500/750';

  // Format release date
  const formattedDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Link
      to={`/movie/${movie.id}`}
      onClick={() => onClick?.(movie)}
      className="block"
    >
      <div
        className={`relative group overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 bg-white shadow-lg
          ${view === 'recommended' ? 'border-4 border-blue-500' : ''}`}
      >
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-[400px] object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/500/750';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 p-4 text-white">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold line-clamp-2">{movie.title}</h3>
              {(view === 'watchlist' || view === 'browse') && (
                <button
                  onClick={handleWatchlistToggle}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  {isInWatchlist ? (
                    <X className="w-4 h-4 text-white" />
                  ) : (
                    <Plus className="w-4 h-4 text-white" />
                  )}
                </button>
              )}
            </div>
            {typeof movie.vote_average === 'number' && (
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
            {movie.overview && (
              <p className="text-sm mt-2 line-clamp-3">{movie.overview}</p>
            )}
            {onUpdateRating && (
              <div className="mt-4">
                <label htmlFor={`rating-${movie.id}`} className="text-sm">
                  Update Rating:
                </label>
                <input
                  id={`rating-${movie.id}`}
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  defaultValue={movie.vote_average}
                  onChange={handleRatingChange}
                  className="ml-2 p-1 rounded bg-gray-800 text-white"
                />
              </div>
            )}
          </div>
        </div>
        {formattedDate && (
          <div className="absolute bottom-4 left-4 bg-gradient-to-t from-black to-transparent p-2 rounded-lg">
            <span className="text-white text-sm">{formattedDate}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
