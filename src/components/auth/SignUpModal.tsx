import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SignUpForm {
  email: string;
  password: string;
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error: signUpError, message, user } = await signUp(data.email, data.password);
      
      if (signUpError) {
        setError(signUpError);
        setIsLoading(false);
        return;
      }
      
      if (!user) {
        setError('Failed to create account');
        setIsLoading(false);
        return;
      }
      
      const successMsg = message || 'Account created successfully! Redirecting to profile setup...';
      setSuccess(successMsg);
      
      // Show success message for 1.5 seconds before redirecting
      setTimeout(() => {
        onClose();
        navigate('/profile');
      }, 1500);
      
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="inline-block w-full max-w-md my-8 p-8 text-left align-middle bg-secondary rounded-2xl shadow-xl transform transition-all">
          <Dialog.Title as="h3" className="text-xl font-display font-bold text-primary mb-6">
            Create your account
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="input-primary w-full"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="input-primary w-full"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-lg bg-accent-50 border border-accent-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-accent-600 font-medium">{success}</p>
                    <p className="text-xs text-accent-500 mt-1">
                      You will be redirected to the login page shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-sm text-center text-gray-600">
              Already a member?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  document.dispatchEvent(new Event('open-signin-modal'));
                }}
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </Dialog>
  );
}