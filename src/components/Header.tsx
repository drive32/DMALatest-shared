import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { UserCircle, Menu, X } from 'lucide-react';
import { SignUpModal } from './auth/SignUpModal';
import { SignInModal } from './auth/SignInModal';
import { ForgotModal } from './auth/ForgotModal';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const { user, signOut } = useAuth();

   // Reset all modals
   const resetModals = () => {
    setShowSignIn(false);
    setShowSignUp(false);
    setShowForgot(false);
  };

  useEffect(() => {

    const handleOpenSignInModal = () => {
      resetModals();
      setShowSignIn(true);
    };

    const handleOpenSignUpModal = () => {
      resetModals();
      setShowSignUp(true);
    };

    const handleOpenForgotPasswordModal = () => {
      resetModals();
      setShowForgot(true);
    };

    document.addEventListener('open-signup-modal', handleOpenSignUpModal);
    document.addEventListener('open-signin-modal', handleOpenSignInModal);
    document.addEventListener('open-forgot-modal', handleOpenForgotPasswordModal);

    // Clean up event listeners
    return () => {
      document.removeEventListener("open-signin-modal", handleOpenSignInModal);
      document.removeEventListener("open-signup-modal", handleOpenSignUpModal);
      document.removeEventListener(
        "open-forgotpassword-modal",
        handleOpenForgotPasswordModal
      );
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const handleSignIn = async () => {
    navigate("/signin");
  };


  const showAuthButtons = !user && location.pathname !== '/decision';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-md border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Toggle Menu Button (Mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.span 
                className="text-2xl font-display font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Decikar.ai
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link 
                  to="/features" 
                  className="text-gray-600 hover:text-accent-600 transition-colors font-medium"
                >
                  Features
                </Link>
                <Link 
                  to="/pricing" 
                  className="text-gray-600 hover:text-accent-600 transition-colors font-medium"
                >
                  Pricing
                </Link>
              </div>

              <div className="flex items-center gap-6">
                <ThemeToggle />
                {showAuthButtons ? (
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/signin')}
                      className="text-gray-600 hover:text-accent-600 transition-colors font-medium"
                    >
                      Sign in
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSignIn()}
                      className="btn-primary px-6"
                    >
                      Get Started
                    </motion.button>
                  </div>
                ) : user && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <UserCircle className="w-6 h-6 text-accent-600" />
                      <span>{user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="text-primary hover:text-accent-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isMenuOpen ? 'auto' : 0 }}
            className={`lg:hidden overflow-hidden ${isMenuOpen ? 'border-t border-gray-100' : ''}`}
          >
            <div className="py-4 space-y-4">
              <Link 
                to="/features" 
                className="block px-4 py-2 text-gray-600 hover:text-accent-600 transition-colors font-medium"
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className="block px-4 py-2 text-gray-600 hover:text-accent-600 transition-colors font-medium"
              >
                Pricing
              </Link>
              {showAuthButtons && (
                <div className="space-y-2 px-4">
                  <button
                    onClick={() => setShowSignIn(true)}
                    className="block w-full text-left py-2 text-gray-600 hover:text-accent-600 transition-colors font-medium"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="block w-full btn-primary text-center"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </nav>
      </header>

      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
      />

      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
      />
       <ForgotModal
        isOpen={showForgot}
        onClose={() => setShowForgot(false)}
      />
    </>
  );
}