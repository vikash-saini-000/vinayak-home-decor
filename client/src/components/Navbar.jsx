import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Bell, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/search', label: 'Search' },
        { to: '/matches', label: 'Matches' },
      ]
    : [
        { to: '/#features', label: 'Features' },
        { to: '/#privacy', label: 'Privacy' },
        { to: '/#how-it-works', label: 'How It Works' },
      ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/60 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                campus<span className="text-purple-400 group-hover:text-purple-300 transition-colors">crush</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className="text-sm text-zinc-400 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/notifications"
                    className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                  >
                    <Bell size={18} className="text-zinc-400" />
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                    >
                      <Shield size={18} className="text-zinc-400" />
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                  >
                    <User size={18} className="text-zinc-400" />
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                  >
                    <LogOut size={18} className="text-zinc-400" />
                  </button>
                </>
              ) : (
                <a href="/auth/google" className="btn-primary text-sm py-2 px-5">
                  Continue with Google
                </a>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-20 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg text-zinc-300 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="w-full h-px bg-white/[0.06] my-2" />
              {user ? (
                <>
                  <Link to="/notifications" onClick={() => setMobileOpen(false)} className="text-lg text-zinc-300 hover:text-white">
                    Notifications
                  </Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-lg text-zinc-300 hover:text-white">
                    Profile
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-lg text-zinc-300 hover:text-white">
                      Admin
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-lg text-zinc-400 hover:text-white">
                    Logout
                  </button>
                </>
              ) : (
                <a href="/auth/google" className="btn-primary w-full text-center">
                  Continue with Google
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
