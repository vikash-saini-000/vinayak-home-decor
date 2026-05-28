import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/matches', icon: Heart, label: 'Matches' },
  { to: '/notifications', icon: Bell, label: 'Alerts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/80 backdrop-blur-2xl border-t border-white/[0.06]">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="relative flex flex-col items-center gap-1 px-3 py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-tab"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <tab.icon
                size={20}
                className={`transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-zinc-600'
                }`}
              />
              <span
                className={`text-[10px] transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-zinc-600'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
