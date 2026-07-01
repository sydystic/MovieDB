import { useEffect, useState } from 'react';
import { Movie } from '../utils/types'; // Adjust the import path as necessary
import { useParams } from 'react-router-dom';
import MovieCard from './MovieCard';
import { searchMovies } from '../utils/api';

const SearchResults = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { query = '' } = useParams();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchMovies(query);
        setMovies(data.results);
      } catch (error) {
        console.error('Error searching movies:', error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Search Results for "{query}"
      </h1>
      {movies.length === 0 ? (
        <p className="text-gray-400 text-lg">No movies found for your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;