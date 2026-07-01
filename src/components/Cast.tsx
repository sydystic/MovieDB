import React from 'react';
import ActorCard from './ActorCard';

interface CastMember {
  id: number;
  name: string;
  profile_path: string;
  character: string;
  order: number;
  popularity: number;
}

interface CastProps {
  cast: CastMember[];
}

const Cast: React.FC<CastProps> = ({ cast }) => {
  // Filter and sort cast members by order (appearance in credits) and popularity
  const mainCast = cast
    .filter(actor => actor.profile_path) // Only include actors with profile images
    .sort((a, b) => {
      // Prioritize first few credited actors and those with high popularity
      const orderWeight = (a.order < 5 ? 10 : 0) - (b.order < 5 ? 10 : 0);
      const popularityDiff = b.popularity - a.popularity;
      return orderWeight + popularityDiff;
    })
    .slice(0, 4); // Show only top 4 actors

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Main Cast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {mainCast.map((actor) => (
          <ActorCard
            key={actor.id}
            actor={actor}
            isFavorite={false}
            onFavoriteToggle={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Cast;