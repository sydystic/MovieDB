import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the structure of an Actor
interface Actor {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

// Context interface
interface FavoriteContextType {
  favoriteActors: Actor[];
  addToFavorites: (actor: Actor) => void;
  removeFromFavorites: (actorId: number) => void;
}

// Create context with an initial value of `undefined`
const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// Provider component
interface FavoriteProviderProps {
  children: ReactNode;
}

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ children }) => {
  // Initialize state for favorite actors with localStorage data
  const [favoriteActors, setFavoriteActors] = useState<Actor[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteActors');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem('favoriteActors', JSON.stringify(favoriteActors));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favoriteActors]);

  // Function to add an actor to the favorites
  const addToFavorites = (actor: Actor) => {
    setFavoriteActors((prev) => {
      if (!prev.some((fav) => fav.id === actor.id)) {
        return [...prev, actor];
      }
      return prev; // Avoid adding duplicates
    });
  };

  // Function to remove an actor from the favorites
  const removeFromFavorites = (actorId: number) => {
    setFavoriteActors((prev) => prev.filter((actor) => actor.id !== actorId));
  };

  return (
    <FavoriteContext.Provider value={{ favoriteActors, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

// Custom hook to access the favorite context
export const useFavoriteActors = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavoriteActors must be used within a FavoriteProvider');
  }
  return context;
};