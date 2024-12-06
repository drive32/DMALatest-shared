import React, { useState,startTransition } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SignInForm {
  email: string;
  password: string;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, error: signInError } = await signIn(data.email, data.password);

      if (signInError) {
        setError(signInError);
        setIsLoading(false);
        return;
      }

      if (!user) {
        setError('Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Close modal first
      onClose();
      // Then navigate
      startTransition(() => {
        navigate('/dashboard');
      });    
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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
          <Dialog.Title as="h3" className="text-2xl font-display font-bold text-primary mb-6">
            Welcome back
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
                placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="text-sm text-center text-gray-600">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  document.dispatchEvent(new Event('open-signup-modal'));
                }}
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </Dialog>
  );
}