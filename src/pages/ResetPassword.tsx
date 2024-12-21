import React, { useState, useEffect,startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'sonner';



const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordForm>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");

    if (!accessToken) {
      // Redirect to the home page if no access token is present
      window.location.href = "/";
    }
  }, []);

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");
    const { newPassword } = data;

    if (!accessToken) {
      setError("Access token is missing. Unable to update password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "apikey": supabaseAnonKey,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || "Failed to update password");
        setIsLoading(false);
        return;
      }
      toast.success("Password updated successfully!");
      startTransition(() => {
        navigate('/');
      });    
      
    } catch (error) {
      console.error("Unexpected error while updating password:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-sand-900">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto space-y-4" style={{ maxWidth: '30%' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-3"
          >
            <h3 className="text-2xl font-display font-bold text-primary mb-6">
              Reset Password
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  className="input-primary w-full"
                  placeholder="Enter your new password"
                  {...register("newPassword", { required: "New password is required." })}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="input-primary w-full"
                  placeholder="Confirm your new password"
                  {...register("confirmPassword", { required: "Confirm password is required." })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center items-center gap-2"
              >
                {isLoading ? "Updating password..." : "Submit"}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
