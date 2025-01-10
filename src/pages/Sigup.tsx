import React, { useState, useEffect, startTransition } from "react";
import { motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { getSupabaseClient } from '../lib/supabase';

import "./Signin.css";


interface SignInForm {
    email: string;
    password: string;
}
export function SignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { signIn,refreshSession } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInForm>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {

        const handleAuth = async () => {
            const supabase = await getSupabaseClient();

            // Extract token from URL
           // Get the current URL
            // Get the URL hash
            const hash = window.location.hash;

            // Parse the hash into an object
            const params = new URLSearchParams(hash.substring(1)); // Remove the `#`

            // Extract the access token
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");
      
            if (!accessToken) {
              console.error("Access token not found in URL");
              return;
            }
      
            // Set the session with the access token
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });
      
            if (error) {
              console.error("Error setting session:", error);
              return;
            }
      
            console.log("Session set successfully:", data);
      
            // Fetch user data
            const { data: user, error: userError } = await supabase.auth.getUser();
      
            if (userError) {
              console.error("Error fetching user data:", userError);
              return;
            }
            refreshSession();
            // Redirect to dashboard
            navigate("/dashboard");
          };
      
          handleAuth();
      
      }, [navigate]);
    

    const onSubmit = async (data: SignInForm) => {
        setIsLoading(true);
        setError(null);

        try {
            const { user, error: signInError } = await signIn(
                data.email,
                data.password
            );

            if (signInError) {
                setError(signInError);
                setIsLoading(false);
                return;
            }

            if (!user) {
                setError("Invalid credentials");
                setIsLoading(false);
                return;
            }

            // Close modal first
            // onClose();
            // Then navigate
            startTransition(() => {
                navigate("/dashboard");
            });
        } catch (err) {
            console.error("Sign in error:", err);
            setError(
                err instanceof Error ? err.message : "An unexpected error occurred"
            );
            setIsLoading(false);
        }
    };

    const handleSignIn = async (provider: any) => {
        const supabase = await getSupabaseClient();

        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `${window.location.origin}/signup`,
            },
          });
          if (error) {
            console.error('Error signing in:', error.message);
          } else {
            console.log('Redirecting to OAuth provider...');
          }
        } catch (error) {
            console.error('An unknown error occurred:', error);
    
        }
      };
      

    return (
        <>
            <div className="sign-container" style={{background:'url(/bg.jpg) no-repeat',backgroundSize:'cover'}}>
                <div className="sign-container--right signup-container--right">
                    <div className="box box-sign shadow-md transform transition-all bg-white rounded-3xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.12)] p-6 inset-0 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className=" sign-form--row ">
                            <Link to="/" className="block text-center mb-1">
                                <motion.span
                                    className="text-xl font-display font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    Decikar.ai
                                </motion.span>
                            </Link>
                            <div className="sign-description mb-4 text-center">
                                <h5 id="org-name-holder" className="sign-description--title">
                                    Sign in to your account
                                </h5>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} id="sign-form" className="sign-form">
                            <div className="sign-form--row">
                                <label htmlFor="email" className="sign-form--label">
                                    email
                                </label>
                                <input
                                    id="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    className="form-input sign-form--input"
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="sign-form--row">
                                <label htmlFor="password" className="sign-form--label">
                                    password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    className="form-input sign-form--input"
                                    placeholder="Create a password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="sign-form--row">
                                <div className="sign-form--error" id="error-container">
                                    <p className="sign-form--error-message">{error}</p>
                                </div>
                            </div>
                            <div className="sign-form--row main-btn ">
                                <div className="sign-in-btn w-full">
                                    {
                                        isLoading ? (
                                            <button className="btn-primary inline-flex items-center justify-center px-6 py-2 text-md shadow-lg hover:shadow-xl w-full" id="sign-in-button" disabled={isLoading}>
                                                <div className="spin" style={{ display: 'block' }}>
                                                    <div className="bounce1"></div>
                                                    <div className="bounce2"></div>
                                                    <div className="bounce3"></div>
                                                </div>
                                                <span className="holder" style={{ opacity: '0' }}>Sign up</span>
                                            </button>
                                        ) : (
                                            <button className="btn-primary inline-flex items-center justify-center px-6 py-2 text-md shadow-lg hover:shadow-xl w-full" id="sign-in-button">
                                                <div className="spin">
                                                    <div className="bounce1"></div>
                                                    <div className="bounce2"></div>
                                                    <div className="bounce3"></div>
                                                </div>
                                                <span className="holder">Sign up</span>
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                            
                        </form>
                        <div id="identity-separator" className="sign-form--row main-separator">
                                <div className="or">
                                    <span>or</span>
                                </div>
                            </div>
                            <div
                                className="sign-form--row secondary-btn"
                                id="additional-identity"
                            >
                                <button onClick={() => handleSignIn('google')}
                                    className="sign-form--internal-image-button"
                                    id="google-identity-button"
                                >
                                    <span>
                                        <img
                                            alt="google logo"
                                            height="43"
                                            src="/google.svg"
                                            width="129"
                                        />
                                    </span>
                                    <span>Sign up with Google</span>
                                </button>
                            </div>
                            <div className="sign-form--row forgot-password">
                                Already a member? <Link
                                    to="/signin" id="forgot-password-handler">
                                    Sign in
                                </Link>
                            </div>
                    </div>
                </div>
            </div>
        </>
    );
}
