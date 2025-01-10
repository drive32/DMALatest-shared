import React, { useState, useEffect, startTransition } from "react";
import { motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { CheckCircle } from 'lucide-react';

import "./Signin.css";

interface ForgotForm {
    email: string;
  }
export function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const { forgotPassword } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotForm>({
        defaultValues: {
            email: ""        },
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
        <>
            <div className="sign-container sign-container-signin" style={{background:'url(/bg.jpg) no-repeat',backgroundSize:'cover'}}>
              
                <div className="sign-container--right">
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
                                    Reset Password
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
                                    placeholder="Enter your email"
                                    className="form-input sign-form--input"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>
                            {error && (
                            <div className="sign-form--row">
                                <div className="sign-form--error" id="error-container">
                                    <p className="sign-form--error-message">{error}</p>
                                </div>
                            </div>
                            )}
                             {success && (
                                    <div className="sign-form--row">
                                     <div className="flex items-center gap-2">
                                   <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0" />
                                   <div>
                                     <p className="text-sm text-accent-600 font-medium">{success}</p>
                                    
                                   </div>
                                 </div>
                               </div>
                             )}
                            <div className="sign-form--row main-btn">
                                <div className="sign-in-btn w-full">
                                    {
                                        isLoading ? (
                                            <button className="btn-primary inline-flex items-center justify-center px-6 py-2 text-md shadow-lg hover:shadow-xl w-full" id="sign-in-button" disabled={isLoading}>
                                                <div className="spin" style={{ display: 'block' }}>
                                                    <div className="bounce1"></div>
                                                    <div className="bounce2"></div>
                                                    <div className="bounce3"></div>
                                                </div>
                                                <span className="holder" style={{ opacity: '0' }}>Sign in</span>
                                            </button>
                                        ) : (
                                            <button className="btn-primary inline-flex items-center justify-center px-6 py-2 text-md shadow-lg hover:shadow-xl w-full" id="sign-in-button">
                                                <div className="spin">
                                                    <div className="bounce1"></div>
                                                    <div className="bounce2"></div>
                                                    <div className="bounce3"></div>
                                                </div>
                                                <span className="holder">Submit</span>
                                            </button>
                                        )
                                    }

                                </div>
                            </div>
                          
                            <div className="sign-form--row forgot-password">
                            Already a member? <Link
                                    to="/signup" id="forgot-password-handler">
                                    Sign in
                                </Link>
                            </div>
                           
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
