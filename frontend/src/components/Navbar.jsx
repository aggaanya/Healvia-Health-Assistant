import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import favicon from '../assets/fav-icon.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/Locker', label: 'Digital Locker' },
    { href: '/Assistant', label: 'AI Assistant' },
    { href: '/Calendar', label: 'Calendar' },
    { href: '/Progress', label: 'Progress' },
    { href: '/Profile', label: 'Profile' }
  ];
;
  const handleSignUpClick = () => {
    navigate('/Register');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={favicon} alt="Healvia Logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Healvia
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-8">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className={`text-sm font-medium transition-colors relative
                    ${location.pathname === link.href 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-gray-900'
                    }
                    ${location.pathname === link.href 
                      ? 'after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-600' 
                      : ''
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleSignUpClick}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-all shadow-sm"
            >
              Sign up
            </button>
          </div>
          <button 
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 flex-shrink-0" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-sm font-medium py-2 transition-colors
                    ${location.pathname === link.href 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-gray-900'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={handleSignUpClick}
                  className="block w-full bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium text-center transition-all shadow-sm"
                >
                  Sign up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;