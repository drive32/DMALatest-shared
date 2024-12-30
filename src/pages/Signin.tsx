import React, { useState, useEffect, startTransition } from "react";
import { motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import "./Signin.css";

interface SignInForm {
    email: string;
    password: string;
}
export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { signIn } = useAuth();

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

    return (
        <>
            <div className="sign-container sign-container-signin">
                <div className="sign-container--left">
                    <div className="sign-container--left">
                        <Link to="/" className="flex items-center">
                            <motion.span
                                className="text-2xl font-display font-bold text-accent-600"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                Decikar.ai
                            </motion.span>
                        </Link>
                        <div className="sign-description mb-4">
                            <h1 id="org-name-holder" className="sign-description--title">
                                Sign in to your account
                            </h1>
                        </div>
                        <div className="sign-art hidden sm:block">
                            <img
                                src='/login-image.jpg'
                                alt="writer character"
                                width="323"
                                height="400"
                            />
                        </div>
                    </div>
                </div>
                <div className="sign-container--right">
                    <div className="box box-sign shadow-md transform transition-all bg-white rounded-3xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.12)] p-6 inset-0 bg-gradient-to-r from-blue-50 to-purple-50">
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
                            <div className="sign-form--row">
                                <label htmlFor="password" className="sign-form--label">
                                    password
                                </label>
                                <input
                                    id="password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    type="password"
                                    placeholder="Enter your password"
                                    className="form-input sign-form--input"
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
                            <div className="sign-form--row main-btn">
                                <div className="sign-in-btn">
                                    {
                                        isLoading ? (
                                            <button className="btn btn-blue" id="sign-in-button" disabled={isLoading}>
                                                <div className="spin" style={{ display: 'block' }}>
                                                    <div className="bounce1"></div>
                                                    <div className="bounce2"></div>
                                                    <div className="bounce3"></div>
                                                </div>
                                                <span className="holder" style={{ opacity: '0' }}>Sign in</span>
                                            </button>
                                        ) : (
                                            <button className="btn btn-blue" id="sign-in-button">
                                                <div className="spin">
                                                    <div className="bounce1"></div>
                                                    <div className="bounce2"></div>
                                                    <div className="bounce3"></div>
                                                </div>
                                                <span className="holder">Sign in</span>
                                            </button>
                                        )
                                    }

                                </div>
                            </div>
                            <div
                                id="identity-separator"
                                className="sign-form--row main-separator"
                            >
                                <div className="or">
                                    <span>or</span>
                                </div>
                            </div>
                            <div
                                className="sign-form--row secondary-btn"
                                id="additional-identity"
                            >
                                <button
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
                                    <span>Sign in with Google</span>
                                </button>
                            </div>
                            <div className="sign-form--row forgot-password sign-form--internal-link">
                                <Link
                                    to="/resetPassword" id="forgot-password-handler" className="">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="sign-form--row forgot-password">
                                Don't have an account yet? <Link
                                    to="/signup" id="forgot-password-handler">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
