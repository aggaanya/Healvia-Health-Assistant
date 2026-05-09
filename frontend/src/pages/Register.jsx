import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HealviaLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="85" stroke="url(#grad1)" strokeWidth="8" fill="none" opacity="0.6"/>
    <circle cx="100" cy="100" r="70" stroke="url(#grad2)" strokeWidth="6" fill="none" opacity="0.4"/>
    <path d="M100 60 L100 100 L140 100" stroke="url(#grad3)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M85 100 L100 100 L100 115" stroke="url(#grad3)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#60a5fa', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
      </linearGradient>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#93c5fd', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#60a5fa', stopOpacity: 1}} />
      </linearGradient>
      <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
      </linearGradient>
    </defs>
  </svg>
);

const fadeIn = (direction, delay) => {
  return {
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div 
        variants={fadeIn('up', 0.2)}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <motion.div 
            variants={fadeIn('down', 0.3)}
            initial="hidden"
            animate="show"
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
              <HealviaLogo size={40} />
            </div>
          </motion.div>

          <motion.h2 
            variants={fadeIn('up', 0.4)}
            initial="hidden"
            animate="show"
            className="text-2xl font-bold text-center mb-2 text-gray-900"
          >
            {isSignUp ? (
              <>Welcome to <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Healvia</span></>
            ) : (
              <>Sign in to <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Healvia</span></>
            )}
          </motion.h2>

          <motion.p 
            variants={fadeIn('up', 0.5)}
            initial="hidden"
            animate="show"
            className="text-gray-500 text-center mb-8 text-sm"
          >
            {isSignUp 
              ? 'Create an account to have full access of all the features' 
              : 'Enter your credentials to access your account'}
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <motion.div
                variants={fadeIn('right', 0.6)}
                initial="hidden"
                animate="show"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              variants={fadeIn('right', isSignUp ? 0.7 : 0.6)}
              initial="hidden"
              animate="show"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn('right', isSignUp ? 0.8 : 0.7)}
              initial="hidden"
              animate="show"
            >
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {!isSignUp && (
                  <button 
                    type="button" 
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </motion.div>

            {isSignUp && (
              <motion.div
                variants={fadeIn('right', 0.9)}
                initial="hidden"
                animate="show"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            <motion.button
              variants={fadeIn('up', isSignUp ? 1.0 : 0.8)}
              initial="hidden"
              animate="show"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm mt-6"
            >
              <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <motion.div 
            variants={fadeIn('up', isSignUp ? 1.1 : 0.9)}
            initial="hidden"
            animate="show"
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeIn('up', isSignUp ? 1.2 : 1.0)}
            initial="hidden"
            animate="show"
            className="text-center"
          >
            <span className="text-gray-600 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            {' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors text-sm"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </motion.div>

          {isSignUp && (
            <motion.div 
              variants={fadeIn('up', 1.3)}
              initial="hidden"
              animate="show"
              className="mt-6 pt-4 border-t border-gray-100"
            >
              <p className="text-xs text-center text-gray-500">
                By creating an account, you agree to our{' '}
                <button className="text-blue-600 hover:text-blue-700 hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button className="text-blue-600 hover:text-blue-700 hover:underline">Privacy Policy</button>.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default AuthPage;