import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout, savedListings } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-soft-white/80 backdrop-blur-md border-b border-lilac/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-arabic text-2xl font-semibold text-indigo">جرّب</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/browse"
              className="font-ui text-lavender hover:text-indigo transition-colors"
            >
              Browse
            </Link>
            <Link
              to="/about"
              className="font-ui text-lavender hover:text-indigo transition-colors"
            >
              About
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender" />
              <input
                type="text"
                placeholder="What do you want to try?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </form>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/saved"
              className="relative p-2 text-lavender hover:text-indigo transition-colors"
            >
              <Heart className="w-6 h-6" />
              {savedListings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-ui font-semibold">
                  {savedListings.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-ui text-sm text-lavender">{user.name}</span>
                <button
                  onClick={logout}
                  className="font-ui text-sm text-lavender hover:text-indigo transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="font-ui text-sm text-lavender hover:text-indigo transition-colors"
              >
                Login
              </Link>
            )}

            <Link to="/add-listing" className="btn-primary">
              Add Your Class
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-lavender hover:text-indigo"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-lilac/30 animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender" />
                <input
                  type="text"
                  placeholder="What do you want to try?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </form>

            {/* Mobile Links */}
            <div className="flex flex-col gap-3">
              <Link
                to="/browse"
                onClick={() => setIsMenuOpen(false)}
                className="font-ui text-lavender hover:text-indigo py-2"
              >
                Browse
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="font-ui text-lavender hover:text-indigo py-2"
              >
                About
              </Link>
              {user ? (
                <>
                  <span className="font-ui text-sm text-indigo py-2">Hi, {user.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="font-ui text-lavender hover:text-indigo py-2 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-ui text-lavender hover:text-indigo py-2"
                >
                  Login
                </Link>
              )}
              <Link
                to="/add-listing"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary text-center mt-2"
              >
                Add Your Class
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
