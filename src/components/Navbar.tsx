import { useState } from "react";
import { Link } from "react-router-dom";
import { Film, TrendingUp, Star, Clock, Heart, Menu, X, User } from "lucide-react";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/movies/trending", icon: <TrendingUp className="w-4 h-4" />, label: "Trending" },
    { path: "/movies/top-rated", icon: <Star className="w-4 h-4" />, label: "Top Rated" },
    { path: "/movies/upcoming", icon: <Clock className="w-4 h-4" />, label: "Upcoming" },
    { path: "/watchlist", icon: <Heart className="w-4 h-4" />, label: "Watchlist" },
    { path: "/favorite-actors", icon: <User className="w-4 h-4" />, label: "Favorite Actors" }
  ];

  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <Film className="w-8 h-8 text-yellow-400 transition-all duration-300 group-hover:rotate-12" />
              <span className="text-white font-bold text-xl transition-all duration-300 group-hover:text-yellow-400">
                MovieDB
              </span>
            </Link>
          </div>

          {/* Right Section - Search Bar and Navigation Items */}
          <div className="flex items-center space-x-6 ml-auto">
            {/* Search Bar - Positioned Right of "Trending" */}
            <SearchBar className="max-w-[180px] bg-zinc-900/80 text-white rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400" />

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-300 hover:text-yellow-400 flex items-center space-x-2 transition-all duration-300 hover:scale-105"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white transition-all duration-300 hover:text-yellow-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden fixed inset-y-0 left-0 w-64 bg-black/95 border-r border-zinc-800 backdrop-blur-md z-50">
            <div className="flex flex-col h-full p-4">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Search and Trending Section */}
              <div className="mt-8 space-y-6">
                {/* Search Row */}
                <div className="flex items-center space-x-2 px-2">
                  <SearchBar className="w-full bg-zinc-900/60 text-white border border-zinc-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-gray-400" />
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="text-gray-300 hover:text-white flex items-center space-x-3 px-2 py-1.5 transition-colors duration-200"
                    >
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
