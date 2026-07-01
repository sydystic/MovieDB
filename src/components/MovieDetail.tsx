import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Calendar } from 'lucide-react';
import { getMovieCredits } from '../utils/api';
import Cast from './Cast';
import StarRating from './StarRating';
import MovieReviews from './MovieReviews';

interface Movie {
  title: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  runtime: number;
  release_date: string;
  tagline?: string;
  overview: string;
  genres: { id: number; name: string }[];
  totalRatings: number;
  userRatings: { [key: string]: number };
  vote_count: number;
  apiVoteCount: number;
  apiRating: number;
  ratingDistribution: { [stars: number]: number }; // added dynamic distribution
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    if (!id) {
      console.error('Movie ID is undefined');
      return;
    }

    const savedRatings = localStorage.getItem(`movieRatings_${id}`);
    const ratings = savedRatings ? JSON.parse(savedRatings) : { userRatings: {}, totalRatings: 0 };

    const fetchData = async () => {
      try {
        const [movieResponse, creditsResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`
          ),
          getMovieCredits(id),
        ]);

        const movieData = await movieResponse.json();

        // Calculate the average rating by combining API and user ratings
        const enhancedMovieData = {
          ...movieData,
          userRatings: ratings.userRatings,
          totalRatings: Object.keys(ratings.userRatings).length + movieData.vote_count,  // Correct total count
          apiVoteCount: movieData.vote_count,
          apiRating: movieData.vote_average,
          vote_average: calculateAverageRating(
            ratings.userRatings,
            movieData.vote_average,
            movieData.vote_count
          ),
          ratingDistribution: calculateRatingDistribution(ratings.userRatings, movieData.vote_count), // New distribution
        };

        setMovie(enhancedMovieData);
        setCast(creditsResponse.cast);

        const userId = 'user1';
        if (ratings.userRatings[userId]) {
          setUserRating(ratings.userRatings[userId]);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const calculateAverageRating = (
    userRatings: { [key: string]: number },
    apiRating: number,
    apiVoteCount: number
  ): number => {
    const userRatingValues = Object.values(userRatings);
    const userRatingSum = userRatingValues.reduce((sum, rating) => sum + rating, 0);
    const userRatingCount = userRatingValues.length;

    // Total weighted sum: (API votes × API rating) + sum of user ratings
    const totalSum = (apiVoteCount * apiRating) + userRatingSum;
    // Total number of votes: API votes + number of user ratings
    const totalCount = apiVoteCount + userRatingCount;

    return totalCount > 0 ? totalSum / totalCount : apiRating;
  };

  const calculateRatingDistribution = (
    userRatings: { [key: string]: number },
    apiVoteCount: number
  ) => {
    const distribution: { [key: number]: number } = {};

    // Simulate a rating distribution (this can be adjusted based on your data)
    for (let i = 1; i <= 5; i++) {
      distribution[i] = 0; // Initialize distribution for each rating from 1 to 5
    }

    // Add user ratings to the distribution
    Object.values(userRatings).forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    // Add API votes to the distribution
    for (let i = 1; i <= 5; i++) {
      const apiRatingCount = Math.floor((apiVoteCount / 5) * i); // Simulate API vote distribution
      distribution[i] += apiRatingCount;
    }

    return distribution;
  };

  const handleRatingChange = (newRating: number) => {
    if (!movie || !id) return;

    const userId = 'user1';
    const updatedUserRatings = {
      ...movie.userRatings,
      [userId]: newRating
    };

    // Calculate new average using the original API values
    const newAverage = calculateAverageRating(
      updatedUserRatings,
      movie.apiRating,
      movie.apiVoteCount
    );

    // Store in localStorage
    localStorage.setItem(`movieRatings_${id}`, JSON.stringify({
      userRatings: updatedUserRatings,
      totalRatings: Object.keys(updatedUserRatings).length
    }));

    // Update state
    setUserRating(newRating);
    setMovie(prev => (prev ? {
      ...prev,
      userRatings: updatedUserRatings,
      totalRatings: Object.keys(updatedUserRatings).length + prev.apiVoteCount, // Adjust total count
      vote_average: newAverage,
      ratingDistribution: calculateRatingDistribution(updatedUserRatings, prev.apiVoteCount), // Update distribution
    } : prev));
  };

  if (loading || !movie) {
    return (
      <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[400px] bg-gray-700 rounded-lg mb-8"></div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 rounded-lg shadow-lg"
          />

          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-gray-400 text-lg italic mb-4">{movie.tagline}</p>
            )}

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>{movie.vote_average.toFixed(1)}</span>
                <span className="text-sm text-gray-400 ml-1">
                  ({movie.totalRatings} {movie.totalRatings === 1 ? 'rating' : 'ratings'})
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-1" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-1" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>

            <div className="mb-6">
              <StarRating
                rating={movie.vote_average}
                onRatingChange={handleRatingChange}
                totalRatings={movie.totalRatings}
                userRating={userRating}
                ratingDistribution={movie.ratingDistribution} // Dynamic distribution
              />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300">{movie.overview}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Cast cast={cast} />
        <MovieReviews movieId={id || ''} />
      </div>
    </div>
  );
};

export default MovieDetail;
