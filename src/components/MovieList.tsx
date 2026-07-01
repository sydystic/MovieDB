import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from './MovieCard';
import { useWatchlist } from './WatchlistContext';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  totalRatings: number;
  genres: string[];
}

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { type } = useParams<{ type: string }>();
  const { watchlist, addToWatchlist, removeFromWatchlist, recommendMovies } = useWatchlist();

  // Map URL parameters to API endpoints
  const TYPE_MAPPING: Record<string, string> = {
    'popular': 'popular',
    'top-rated': 'top_rated',
    'upcoming': 'upcoming',
    'trending': 'trending/movie/day'
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      if (!type || !TYPE_MAPPING[type]) {
        console.error("Invalid movie type:", type);
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching movies of type: ${type}`);

        // Construct the appropriate URL based on the type
        const baseUrl = 'https://api.themoviedb.org/3';
        const endpoint = TYPE_MAPPING[type];
        const url = endpoint.startsWith('trending')
          ? `${baseUrl}/${endpoint}?api_key=f3b84b66da5036db1e2c14c81d2901d3`
          : `${baseUrl}/movie/${endpoint}?api_key=f3b84b66da5036db1e2c14c81d2901d3&language=en-US&page=1`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const GENRE_MAP: Record<number, string> = {
          28: "Action",
          12: "Adventure",
          16: "Animation",
          35: "Comedy",
          80: "Crime",
          99: "Documentary",
          18: "Drama",
          10751: "Family",
          14: "Fantasy",
          36: "History",
          27: "Horror",
          10402: "Music",
          9648: "Mystery",
          10749: "Romance",
          878: "Science Fiction",
          10770: "TV Movie",
          53: "Thriller",
          10752: "War",
          37: "Western"
        };

        const updatedMovies = data.results.map((movie: any) => ({
          ...movie,
          genres: movie.genre_ids.map((id: number) => GENRE_MAP[id] || "Unknown"),
          totalRatings: movie.vote_count,
        }));

        setMovies(updatedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }

      setLoading(false);
    };

    fetchMovies();
  }, [type]);

  const recommendations = recommendMovies(movies);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg h-[400px]"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getPageTitle = () => {
    switch (type) {
      case 'top-rated':
        return 'Top Rated Movies';
      case 'upcoming':
        return 'Upcoming Movies';
      case 'trending':
        return 'Trending Movies';
      default:
        return 'Popular Movies';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        {getPageTitle()}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => {
              const isInWatchlist = watchlist.some((m) => m.id === movie.id);
              isInWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieList;