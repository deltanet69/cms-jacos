"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Reset password logic with Appwrite would go here
        setSubmitted(true);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-boxdark-2">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
                <div className="mb-8 text-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={150}
                        height={30}
                        className="mx-auto mb-4"
                    />
                    <h2 className="text-2xl font-bold text-black dark:text-white">Reset Password</h2>
                    <p className="text-sm text-gray-500">
                        Enter your email and we'll send you instructions to reset your password.
                    </p>
                </div>

                {submitted ? (
                    <div className="text-center">
                        <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-600">
                            Recovery email sent! Check your inbox.
                        </div>
                        <Link
                            href="/sekre/login"
                            className="flex items-center justify-center gap-2 text-primary hover:underline"
                        >
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4">
                                    <Mail size={22} className="text-gray-400" />
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mb-6 flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
                        >
                            Send Instructions
                        </button>

                        <Link
                            href="/sekre/login"
                            className="flex items-center justify-center gap-2 text-sm font-medium text-bodydark2 hover:text-primary"
                        >
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}
