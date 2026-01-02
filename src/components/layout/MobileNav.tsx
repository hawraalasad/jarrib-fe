import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav() {
  const location = useLocation();
  const { user, savedListings } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/browse', icon: Search, label: 'Browse' },
    { path: '/add-listing', icon: Plus, label: 'Add' },
    { path: '/saved', icon: Heart, label: 'Saved', badge: savedListings.length },
    { path: user ? '/saved' : '/login', icon: User, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-soft-white border-t border-lilac/30 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <Link
            key={path + label}
            to={path}
            className={`flex flex-col items-center gap-1 px-4 py-2 relative ${
              isActive(path) ? 'text-indigo' : 'text-lavender'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-ui font-semibold">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span className="font-ui text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
