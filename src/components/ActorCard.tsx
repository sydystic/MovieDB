import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavoriteActors } from './FavoriteContext';


interface ActorCardProps {
  actor: {
    id: number;
    name: string;
    profile_path: string;
    character: string;
  };
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const ActorCard: React.FC<ActorCardProps> = ({ actor }) => {
  const { favoriteActors, addToFavorites, removeFromFavorites } = useFavoriteActors();

  const isFavorite = favoriteActors.some((fav) => fav.id === actor.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation when clicking the heart
    if (isFavorite) {
      removeFromFavorites(actor.id);
    } else {
      addToFavorites(actor);
    }
  };

  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-actor.jpg'; // Replace with your placeholder image path
  };

  return (
    <div className="relative group overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1">
      <Link to={`/actor/${actor.id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
          alt={actor.name}
          onError={handleImageError}
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 p-4 text-white">
            <h3 className="text-lg font-bold truncate">{actor.name}</h3>
            <p className="text-sm text-gray-300 truncate">as {actor.character}</p>
          </div>
        </div>
      </Link>
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
      >
        <Heart
          className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
        />
      </button>
    </div>
  );
};

export default ActorCard;