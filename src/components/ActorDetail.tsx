import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getActorDetails, getActorMovies } from '../utils/api';
import MovieCard from './MovieCard';

interface Actor {
  id: number;
  name: string;
  profile_path: string;
  birthday: string;
  place_of_birth: string;
  biography: string;
  known_for_department: string;
}

const ActorDetail = () => {
  const { id } = useParams<{ id: string | undefined }>(); // Ensure 'id' is a string or undefined
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error('Error: Actor ID is undefined');
      return;
    }

    const fetchData = async () => {
      try {
        const [actorData, moviesData] = await Promise.all([
          getActorDetails(id),
          getActorMovies(id),
        ]);
        setActor(actorData);
        setMovies(moviesData.cast);
      } catch (error) {
        console.error('Error fetching actor data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading || !actor) {
    return (
      <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[400px] bg-gray-700 rounded-lg mb-8"></div>
      </div>
    );
  }

  const age =
    actor.birthday
      ? new Date().getFullYear() - new Date(actor.birthday).getFullYear()
      : 'N/A';

  const handleUpdateRating = (movieId: number, newRating: number) => {
    console.log(`Movie ID: ${movieId}, New Rating: ${newRating}`);
    // Implement rating update logic (e.g., API call)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
            alt={actor.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-gray-400">Age</h3>
              <p>{age}</p>
            </div>
            <div>
              <h3 className="text-gray-400">Birthday</h3>
              <p>{actor.birthday || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-400">Place of Birth</h3>
              <p>{actor.place_of_birth || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-400">Known For</h3>
              <p>{actor.known_for_department}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Biography</h2>
            <p className="text-gray-300">{actor.biography}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Known For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.slice(0, 8).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onUpdateRating={handleUpdateRating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActorDetail;
