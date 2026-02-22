"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { Loader2, AlertTriangle, Search, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Filter } from "lucide-react";
import { databases, DATABASE_ID, Query } from "@/lib/appwrite";

const TABLE_APPLICATIONS = process.env.NEXT_PUBLIC_APPWRITE_TABLE_JOB_APPLICATIONS || "job_applications";

interface Application {
    $id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    message?: string;
    status?: string;
    $createdAt: string;
}

export default function JobApplicationsListing() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortBy, setSortBy] = useState("$createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            setError("");
            try {
                const queries = [];

                if (sortOrder === "desc") {
                    queries.push(Query.orderDesc("$createdAt"));
                } else {
                    queries.push(Query.orderAsc("$createdAt"));
                }

                queries.push(Query.limit(limit));
                queries.push(Query.offset((page - 1) * limit));

                const response = await databases.listDocuments(DATABASE_ID, TABLE_APPLICATIONS, queries);

                let filteredDocs = response.documents;
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    filteredDocs = filteredDocs.filter((doc: any) =>
                        doc.fullName?.toLowerCase().includes(q) ||
                        doc.email?.toLowerCase().includes(q) ||
                        doc.position?.toLowerCase().includes(q)
                    );
                }

                // Client-side status filter
                if (filterStatus) {
                    filteredDocs = filteredDocs.filter((doc: any) =>
                        (doc.status || "pending").toLowerCase() === filterStatus.toLowerCase()
                    );
                }

                setApplications(filteredDocs as unknown as Application[]);
                setTotal(searchQuery || filterStatus ? filteredDocs.length : response.total);
            } catch (err: any) {
                console.error("Failed to fetch applications:", err);
                setError(err.message || "Failed to load applications.");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => fetchApplications(), searchQuery ? 500 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, filterStatus, sortBy, sortOrder, page]);

    const getStatusBadge = (status?: string) => {
        const s = status?.toLowerCase();
        if (s === "approved") return "bg-green-100 text-green-600";
        if (s === "rejected") return "bg-red-100 text-red-500";
        return "bg-yellow-100 text-yellow-600"; // pending
    };

    return (
        <>
            <Breadcrumb pageName="Job Applications" />

            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="text-xl font-semibold text-black dark:text-white">All Applications</h4>
                        <p className="text-sm text-body">Total: {total} applicants</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body"><Search size={18} /></span>
                        <input
                            type="text"
                            placeholder="Search name, email, position..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body pointer-events-none"><Filter size={18} /></span>
                        <select
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                            className="w-full appearance-none rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body pointer-events-none"><ArrowUpDown size={18} /></span>
                        <select
                            value={`${sortBy}:${sortOrder}`}
                            onChange={(e) => { const [f, o] = e.target.value.split(":"); setSortBy(f); setSortOrder(o); }}
                            className="w-full appearance-none rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        >
                            <option value="$createdAt:desc">Date (Newest)</option>
                            <option value="$createdAt:asc">Date (Oldest)</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)} className="flex h-10 w-10 items-center justify-center rounded-md border border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 disabled:opacity-50">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-medium">Page {page}</span>
                        <button disabled={page * limit >= total || loading} onClick={() => setPage(p => p + 1)} className="flex h-10 w-10 items-center justify-center rounded-md border border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 disabled:opacity-50">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Full Name</h5>
                        </div>
                        <div className="p-2.5  xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
                        </div>
                        <div className="hidden p-2.5  sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Phone</h5>
                        </div>
                        <div className="p-2.5  xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Position</h5>
                        </div>
                        <div className="hidden p-2.5  sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
                        </div>
                        <div className="hidden p-2.5  sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Action</h5></div>
                    </div>

                    {loading && [1, 2, 3, 4].map((i) => (
                        <div key={i} className="grid grid-cols-3 sm:grid-cols-6 border-b border-stroke dark:border-strokedark animate-pulse">
                            {[...Array(6)].map((_, j) => (
                                <div key={j} className={`p-2.5 xl:p-5 ${j > 1 && j < 6 ? "hidden sm:flex" : "flex"} justify-center`}>
                                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-meta-4 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {error && (
                        <div className="p-5 text-center text-danger font-medium flex flex-col items-center gap-2">
                            <AlertTriangle size={24} /><p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && applications.length === 0 && (
                        <div className="p-5 text-center text-body">No applications found.</div>
                    )}

                    {!loading && !error && applications.map((app, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-6 ${key === applications.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
                            key={app.$id}
                        >
                            <div className="flex items-center p-2.5 xl:p-5">
                                <Link href={`/sekre/jobs/applications/${app.$id}`} className="text-black dark:text-white font-medium hover:text-primary transition-colors line-clamp-1">
                                    {app.fullName}
                                </Link>
                            </div>
                            <div className="flex items-center  p-2.5 xl:p-5">
                                <p className="text-sm text-body truncate">{app.email}</p>
                            </div>
                            <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
                                <p className="text-sm text-body">{app.phoneNumber || "-"}</p>
                            </div>
                            <div className="flex items-center  p-2.5 xl:p-5">
                                <p className="text-sm text-black dark:text-white">{app.position || "-"}</p>
                            </div>
                            <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
                                <span className={`px-2.5 py-1 rounded text-xs font-medium capitalize ${getStatusBadge(app.status)}`}>
                                    {app.status || "pending"}
                                </span>
                            </div>
                            <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
                                <Link href={`/sekre/jobs/applications/${app.$id}`} className="text-blue-500 hover:text-blue-700 transition-colors" title="View Details">
                                    <Eye size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
