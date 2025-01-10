import React, { useState,startTransition } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, AlertCircle,CheckCircle } from 'lucide-react';

interface ForgotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ForgotForm {
  email: string;
}

export function ForgotModal({ isOpen, onClose }: ForgotModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);


    try {
      const { error: existingUser } = await forgotPassword(data.email);
      setIsLoading(false);
      if (existingUser) {
        setError(existingUser);
        return;
      }      
      console.log(existingUser);
      const successMsg = 'reset link sent to your email';
      setSuccess(successMsg);

      // Close modal first
     // onClose();
      // Then navigate
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
          <Dialog.Title as="h3" className="text-xl font-display font-bold text-primary mb-6">
            Forgot Password
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
                  sending reset link...
                </>
              ) : (
                'Submit'
              )}
            </button>

            <p className="text-sm text-center text-gray-600">
              
              <button
                type="button"
                onClick={() => {
                  onClose();
                  document.dispatchEvent(new Event('open-signin-modal'));
                }}
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
    </Dialog>
  );
}