import { useEffect, useState } from 'react';
import { useWatchlist } from './WatchlistContext';
import { useFavoriteActors } from './FavoriteContext';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  poster?: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
  genres?: string[];
  overview?: string;
  original_language?: string; // Adding language property
}

const WatchlistPage = () => {
  const { watchlist } = useWatchlist();
  const { favoriteActors } = useFavoriteActors();
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [recommendationScores, setRecommendationScores] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (watchlist.length === 0) {
        setRecommendedMovies([]);
        return;
      }

      try {
        // Hardcoded API URL and API key
        const apiUrl = 'https://api.themoviedb.org/3'; // Replace with your actual API URL
        const apiKey = 'f3b84b66da5036db1e2c14c81d2901d3'; // Your actual API key

        if (!apiUrl || !apiKey) {
          throw new Error('API URL or API key is missing');
        }

        // Get recommendations for a random movie from the watchlist to start
        const randomMovie = watchlist[Math.floor(Math.random() * watchlist.length)];
        const response = await fetch(
          `${apiUrl}/movie/${randomMovie.id}/recommendations?api_key=${apiKey}`
        );

        if (!response.ok) throw new Error('Failed to fetch recommendations');

        const data = await response.json();
        const recommendationsList = data.results || [];

        // Filter out movies already in the watchlist
        const filteredRecommendations = recommendationsList.filter(
          (movie: Movie) => !watchlist.some(wm => wm.id === movie.id)
        );

        // Calculate scores
        const scores = new Map<number, number>();
        const scoredMovies = filteredRecommendations.map((movie: Movie) => {
          // Basic score based on vote average (0-50 points)
          let score = (movie.vote_average || 0) * 5;

          // Genre matching bonus (up to 30 points)
          const matchingGenres = movie.genre_ids?.filter(genre =>
            watchlist.some(wm => wm.genres?.includes(genre.toString()))
          ).length || 0;
          score += matchingGenres * 10;

          // Recency bonus (up to 20 points)
          if (movie.release_date) {
            const movieYear = new Date(movie.release_date).getFullYear();
            const currentYear = new Date().getFullYear();
            if (currentYear - movieYear <= 2) {
              score += 20;
            }
          }

          scores.set(movie.id, Math.round(score));
          return { movie, score };
        });

        // Sort by score and take top 8
        interface ScoredMovie {
          movie: Movie;
          score: number;
        }

        const topRecommendations: Movie[] = (scoredMovies as ScoredMovie[]).sort(
          (a, b) => b.score - a.score
        ).slice(0, 8).map(({ movie }) => ({
          ...movie,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/api/placeholder/500/750'
        }));

        setRecommendationScores(scores);
        setRecommendedMovies(topRecommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [watchlist]);

  return (
    <div className="p-4">
      <h2 className="text-2xl text-white mb-4">Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <div className="text-center text-white">
          <h2 className="text-2xl">Your Watchlist is empty!</h2>
          <p className="mt-2">Add movies to get personalized recommendations</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} view="watchlist" />
          ))}
        </div>
      )}

      {recommendedMovies.length > 0 && (
        <>
          <h2 className="text-2xl text-white mt-8 mb-4">Movies You Might Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedMovies.map((movie) => (
              <div key={movie.id} className="relative">
                <MovieCard
                  movie={{ ...movie, overview: movie.overview || '' }}
                  view="recommended"
                />
                <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded">
                  Match: {recommendationScores.get(movie.id)}%
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* If no recommendations found */}
      {recommendedMovies.length === 0 && watchlist.length > 0 && (
        <div className="text-center text-white">
          <h2 className="text-2xl">No recommendations found</h2>
          <p className="mt-2">Try adding more movies to your watchlist!</p>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
