"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { Loader2, ArrowLeft, Save, User, Mail, ShieldCheck, Key } from "lucide-react";
import Link from "next/link";

const TABLE_USERS = process.env.NEXT_PUBLIC_APPWRITE_TABLE_USERS || "users";

export default function EditUser() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Staff");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const doc: any = await databases.getDocument(DATABASE_ID, TABLE_USERS, id as string);
                setFullName(doc.fullName || "");
                setEmail(doc.email || "");
                setRole(doc.role || "Staff");
                setUserId(doc.userId || "");
                setPassword(doc.password || "");
            } catch (err: any) {
                console.error("Failed to fetch user profile:", err);
                alert("Error loading profile: " + err.message);
                router.push("/sekre/users");
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchUser();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = {
                fullName,
                email,
                role,
                userId,
                password
            };

            await databases.updateDocument(DATABASE_ID, TABLE_USERS, id as string, userData);
            router.push("/sekre/users");
        } catch (err: any) {
            console.error("Failed to update user profile:", err);
            alert("Error: " + (err.message || "Failed to update user profile."));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-60 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Edit User Profile" />

            <div className="mb-6">
                <Link href="/sekre/users" className="flex items-center gap-2 text-sm font-medium text-body hover:text-primary">
                    <ArrowLeft size={16} /> Back to Users
                </Link>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-2xl mx-auto">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Update User Information
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6.5">
                    <div className="mb-4.5 space-y-4">
                        <div>
                            <label className="mb-2.5 block text-black dark:text-white">
                                Full Name <span className="text-meta-1">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-body">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2.5 block text-black dark:text-white">
                                Email Address <span className="text-meta-1">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-body">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. john@jacos.id"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2.5 block text-black dark:text-white">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-body">
                                    <Key size={18} />
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Update password or leave empty to keep current"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2.5 block text-black dark:text-white">
                                Appwrite User ID (Auth ID) <span className="text-meta-1">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-body">
                                    <Key size={18} />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="Copy ID from Appwrite Auth table"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2.5 block text-black dark:text-white">
                                Assign Role <span className="text-meta-1">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-body">
                                    <ShieldCheck size={18} />
                                </span>
                                <select
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Recruitment">Recruitment</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center items-center gap-2 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" /> Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} /> Update User Profile
                            </>
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}
