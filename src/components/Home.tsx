import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import MovieCard from './MovieCard';
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

const API_KEY = 'f3b84b66da5036db1e2c14c81d2901d3';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, popularRes, upcomingRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`)
        ]);

        const trendingData = await trendingRes.json();
        const popularData = await popularRes.json();
        const upcomingData = await upcomingRes.json();

        console.log("Trending Movies:", trendingData);
        console.log("Popular Movies:", popularData);
        console.log("Upcoming Movies:", upcomingData);

        setTrendingMovies(trendingData.results?.slice(0, 5) || []);
        setPopularMovies(popularData.results || []);
        setUpcomingMovies(upcomingData.results || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-[600px] bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div>
      <Carousel showThumbs={false} autoPlay infiniteLoop showStatus={false} interval={5000} transitionTime={500} className="relative">
        {trendingMovies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id}>
            <div className="relative h-[600px]">
              <img src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 p-8 text-white max-w-2xl">
                  <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
                  <p className="text-lg mb-4">{movie.overview}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </Carousel>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Popular Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Upcoming Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {upcomingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
