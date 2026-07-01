import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';
import MovieList from './components/MovieList';
import SearchResults from './components/SearchResults';
import ActorDetail from './components/ActorDetail';
import { FavoriteProvider } from './components/FavoriteContext';
import FavoriteActorsPage from './components/FavoriteActorsPage';
import NotFound from './components/NotFound';
import WatchlistPage from './components/WatchlistPage';
import { WatchlistProvider } from './components/WatchlistContext';

function App() {
  return (
    <Router>
      <div className="bg-black min-h-screen">
        <Navbar />
        <FavoriteProvider>
          <WatchlistProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies/:type" element={<MovieList />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/search/:query" element={<SearchResults />} />
              <Route path="/actor/:id" element={<ActorDetail />} />
              <Route path="/favorite-actors" element={<FavoriteActorsPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WatchlistProvider>
        </FavoriteProvider>
      </div>
    </Router>
  );
}

export default App;
