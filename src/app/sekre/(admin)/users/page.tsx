"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { Plus, Edit, Trash2, ShieldCheck, Search, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { databases, DATABASE_ID, Query } from "@/lib/appwrite";

const TABLE_USERS = process.env.NEXT_PUBLIC_APPWRITE_TABLE_USERS || "users";

interface UserProfile {
    $id: string;
    fullName: string;
    email: string;
    password?: string;
    role: string;
    status: string;
    userId: string; // Appwrite Auth ID
    $createdAt: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError("");
            try {
                const queries = [
                    Query.orderDesc("$createdAt"),
                    Query.limit(limit),
                    Query.offset((page - 1) * limit)
                ];

                const response = await databases.listDocuments(DATABASE_ID, TABLE_USERS, queries);

                let docs = response.documents;
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    docs = docs.filter((doc: any) =>
                        doc.fullName?.toLowerCase().includes(q) ||
                        doc.email?.toLowerCase().includes(q)
                    );
                }

                setUsers(docs as unknown as UserProfile[]);
                setTotal(searchQuery ? docs.length : response.total);
            } catch (err: any) {
                console.error("Failed to fetch users:", err);
                setError(err.message || "Failed to load user records.");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => fetchUsers(), searchQuery ? 500 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, page]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user profile? This will not delete their Auth account.")) return;
        try {
            await databases.deleteDocument(DATABASE_ID, TABLE_USERS, id);
            setUsers(users.filter(u => u.$id !== id));
            setTotal(t => t - 1);
        } catch (err: any) {
            alert("Failed to delete: " + err.message);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "Super Admin": return "text-primary bg-blue-50 border-blue-100";
            case "Editor": return "text-warning bg-yellow-50 border-yellow-100";
            case "Recruitment": return "text-success bg-green-50 border-green-100";
            case "Staff": return "text-body bg-gray-50 border-gray-100";
            default: return "text-body bg-gray-50 border-gray-100";
        }
    };

    return (
        <>
            <Breadcrumb pageName="User Management" />

            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="text-xl font-semibold text-black dark:text-white">Registered Admin Users</h4>
                        <p className="text-sm text-body">Total: {total} users</p>
                    </div>
                    <Link
                        href="/sekre/users/add"
                        className="flex items-center gap-2 rounded-md bg-[#1F7BC9] px-4 py-2 font-medium text-white hover:bg-opacity-90 transition-all"
                    >
                        <Plus size={18} /> Add New User
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="relative md:col-span-2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => p - 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 disabled:opacity-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-medium">Page {page}</span>
                        <button
                            disabled={page * limit >= total || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 disabled:opacity-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">User</h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Role</h5>
                        </div>
                        <div className="hidden p-2.5 sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Password</h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
                        </div>
                        <div className="hidden p-2.5 sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base text-center">Actions</h5>
                        </div>
                    </div>

                    {loading && (
                        [1, 2].map((i) => (
                            <div key={i} className="grid grid-cols-3 sm:grid-cols-5 border-b border-stroke dark:border-strokedark animate-pulse">
                                <div className="p-2.5 xl:p-5"><div className="h-4 w-3/4 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="p-2.5 xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="p-2.5 xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="hidden p-2.5 sm:flex items-center justify-center xl:p-5"><div className="h-8 w-16 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                            </div>
                        ))
                    )}

                    {!loading && error && (
                        <div className="p-5 text-center text-danger font-medium flex flex-col items-center gap-2">
                            <AlertTriangle size={24} />
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && users.length === 0 && (
                        <div className="p-5 text-center text-body">No users found.</div>
                    )}

                    {!loading && !error && users.map((user, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-5 ${key === users.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
                            key={user.$id}
                        >
                            <div className="flex flex-col p-2.5 xl:p-5">
                                <p className="text-black dark:text-white font-medium truncate">{user.fullName}</p>
                                <p className="text-xs truncate">{user.email}</p>
                            </div>

                            <div className="flex items-center p-2.5 xl:p-5">
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                                    <ShieldCheck size={14} /> {user.role}
                                </span>
                            </div>

                            <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                                <p className="text-sm font-mono tracking-widest text-body">
                                    {user.password ? "••••••••" : "-"}
                                </p>
                            </div>

                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-meta-3 text-sm font-medium uppercase">{user.status || "Active"}</p>
                            </div>

                            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                <div className="flex items-center space-x-4">
                                    <Link href={`/sekre/users/edit/${user.$id}`} className="text-yellow-500 hover:text-yellow-600 transition-colors">
                                        <Edit size={18} />
                                    </Link>
                                    <button onClick={() => handleDelete(user.$id)} className="text-danger hover:text-red-700 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

