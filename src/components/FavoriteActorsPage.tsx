import React from 'react';
import { useFavoriteActors } from '../components/FavoriteContext';
import ActorCard from './ActorCard';

const FavoriteActorsPage: React.FC = () => {
  const { favoriteActors, removeFromFavorites } = useFavoriteActors();

  console.log('Favorite Actors:', favoriteActors); // Log the favorite actors here

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white">Favorite Actors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {favoriteActors.length > 0 ? (
          favoriteActors.map((actor) => (
            <ActorCard
              key={actor.id}
              actor={actor}
              isFavorite={true} // Now correctly passed as a prop
              onFavoriteToggle={() => removeFromFavorites(actor.id)}
            />
          ))
        ) : (
          <p className="text-white">No favorite actors yet!</p>
        )}
      </div>
    </div>
  );
};

export default FavoriteActorsPage;
