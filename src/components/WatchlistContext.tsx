import { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface Movie {
  id: number;
  title: string;
  poster?: string;
  genres?: string[];
  vote_average?: number;
  release_date?: string;
  overview: string;
}

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  recommendMovies: (allMovies: Movie[]) => Movie[];
}

export const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movie: Movie) => {
    console.log("Adding movie to watchlist:", movie);
    setWatchlist((prevWatchlist) => {
      if (prevWatchlist.some((m) => m.id === movie.id)) {
        return prevWatchlist;
      }
      return [...prevWatchlist, movie];
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((movie) => movie.id !== movieId)
    );
  };

  const recommendMovies = (allMovies: Movie[]): Movie[] => {
    if (watchlist.length === 0) return [];

    // Create a map of genre preferences
    const genrePreferences = new Map<string, number>();
    watchlist.forEach(movie => {
      movie.genres?.forEach(genre => {
        genrePreferences.set(genre, (genrePreferences.get(genre) || 0) + 1);
      });
    });

    // Score each movie based on multiple factors
    const scoredMovies = allMovies
      .filter(movie => !watchlist.some(wm => wm.id === movie.id)) // Exclude movies already in watchlist
      .map(movie => {
        let score = 0;

        // Genre matching score
        movie.genres?.forEach(genre => {
          score += (genrePreferences.get(genre) || 0) * 2;
        });

        // Rating bonus
        if (movie.vote_average && movie.vote_average > 7) {
          score += (movie.vote_average - 7) * 10;
        }

        // Recency bonus (if movie is from last 2 years)
        if (movie.release_date) {
          const movieYear = new Date(movie.release_date).getFullYear();
          const currentYear = new Date().getFullYear();
          if (currentYear - movieYear <= 2) {
            score += 10;
          }
        }

        return { movie, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ movie }) => movie)
      .slice(0, 10);

    return scoredMovies;
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, recommendMovies }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};