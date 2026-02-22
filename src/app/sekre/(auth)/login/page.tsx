"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { account } from "@/lib/appwrite";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    React.useEffect(() => {
        const checkSession = async () => {
            try {
                console.log("Checking active session...");
                const session = await account.get();
                console.log("Active session found:", session);
                window.location.href = "/sekre";
            } catch (err) {
                console.log("No active session.");
            }
        };
        checkSession();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log("Attempting login with:", email);
            await account.createEmailPasswordSession(email, password);
            console.log("Login success! Redirecting to /sekre...");
            window.location.href = "/sekre";
        } catch (err: any) {
            console.error("Login error:", err);
            // If session already exists, just redirect to dashboard
            if (err.type === 'general_session_already_exists' || err.code === 409) {
                console.log("Session already exists, redirecting...");
                window.location.href = "/sekre";
            } else {
                setError(err.message || "Failed to login. Please check your credentials.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-boxdark-2">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
                <div className="mb-8 text-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={200}
                        height={40}
                        className="mx-auto mb-4"
                    />
                    <h2 className="text-2xl font-bold text-black dark:text-white">Admin Login</h2>
                    <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
                </div>

                {error && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
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

                    <div className="mb-6">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                            <span className="absolute right-4 top-4">
                                <Lock size={22} className="text-gray-400" />
                            </span>
                        </div>
                    </div>

                    <div className="mb-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/sekre/forgot-password"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
