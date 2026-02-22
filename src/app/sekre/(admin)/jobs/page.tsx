"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, AlertTriangle, Search, ArrowUpDown, ChevronLeft, ChevronRight, MapPin, Briefcase, Clock, Tag } from "lucide-react";
import { databases, DATABASE_ID, Query } from "@/lib/appwrite";

const TABLE_JOBS = process.env.NEXT_PUBLIC_APPWRITE_TABLE_JOB_VACANCY || "job_vacancy";

interface Job {
    $id: string;
    title: string;
    position?: string;
    location?: string;
    jobType?: string;
    timePeriod?: string;
    email?: string; // Fallback
    phone?: string; // Fallback
    attachmentId?: string;
    $createdAt: string;
}

export default function JobListing() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchJobs = async () => {
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

                const response = await databases.listDocuments(DATABASE_ID, TABLE_JOBS, queries);

                let filteredDocs = response.documents;
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    filteredDocs = filteredDocs.filter((doc: any) =>
                        doc.title?.toLowerCase().includes(q) ||
                        doc.position?.toLowerCase().includes(q) ||
                        (doc.jobType || doc.email)?.toLowerCase().includes(q)
                    );
                }

                setJobs(filteredDocs as unknown as Job[]);
                setTotal(searchQuery ? filteredDocs.length : response.total);
            } catch (err: any) {
                console.error("Failed to fetch jobs:", err);
                setError(err.message || "Failed to load jobs.");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => fetchJobs(), searchQuery ? 500 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, sortOrder, page]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job vacancy?")) return;
        try {
            await databases.deleteDocument(DATABASE_ID, TABLE_JOBS, id);
            setJobs(jobs.filter(j => j.$id !== id));
            setTotal(t => t - 1);
        } catch (err: any) {
            alert("Failed to delete: " + err.message);
        }
    };

    return (
        <>
            <Breadcrumb pageName="Job Vacancies" />

            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="text-xl font-semibold text-black dark:text-white">All Job Vacancies</h4>
                        <p className="text-sm text-body">Total: {total} positions</p>
                    </div>
                    <Link
                        href="/sekre/jobs/add"
                        className="flex items-center gap-2 rounded-md bg-[#1F7BC9] px-4 py-2 font-medium text-white hover:bg-opacity-90 transition-all"
                    >
                        <Plus size={18} /> Add New
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search job title, position..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body pointer-events-none">
                            <ArrowUpDown size={18} />
                        </span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full appearance-none rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        >
                            <option value="desc">Date (Newest)</option>
                            <option value="asc">Date (Oldest)</option>
                        </select>
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

                {/* Table */}
                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Job Title</h5>
                        </div>
                        <div className="hidden p-2.5 sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Position</h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Job Type</h5>
                        </div>
                        <div className="hidden p-2.5 sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Time Period</h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Location</h5>
                        </div>
                        <div className="hidden p-2.5 sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
                        </div>
                    </div>

                    {loading && (
                        <>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="grid grid-cols-3 sm:grid-cols-6 border-b border-stroke dark:border-strokedark animate-pulse">
                                    <div className="p-2.5 xl:p-5"><div className="h-4 w-3/4 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="p-2.5 xl:p-5 flex items-center"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="p-2.5 xl:p-5 flex items-center"><div className="h-4 w-1/3 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-6 w-16 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                </div>
                            ))}
                        </>
                    )}

                    {error && (
                        <div className="p-5 text-center text-danger font-medium flex flex-col items-center gap-2">
                            <AlertTriangle size={24} />
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && jobs.length === 0 && (
                        <div className="p-5 text-center text-body">No job vacancies found.</div>
                    )}

                    {!loading && !error && jobs.map((job, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-6 ${key === jobs.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
                            key={job.$id}
                        >
                            <div className="flex items-center p-2.5 xl:p-5">
                                <Link
                                    href={`/sekre/jobs/edit/${job.$id}`}
                                    className="text-black dark:text-white font-medium hover:text-primary transition-colors line-clamp-2 leading-tight"
                                >
                                    {job.title || "Untitled"}
                                </Link>
                            </div>

                            <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                                <p className="text-sm text-black dark:text-white text-start">
                                    {job.position || "-"}
                                </p>
                            </div>

                            <div className="flex items-center p-2.5 xl:p-5">
                                <span className={`px-2.5 py-1 rounded text-xs font-medium ${(job.jobType || job.email) === "Full-time" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                                    {job.jobType || job.email || "-"}
                                </span>
                            </div>

                            <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                                <p className="text-sm text-body flex items-center gap-1">
                                    <Clock size={14} className="text-body" />
                                    {job.timePeriod || job.phone || "-"}
                                </p>
                            </div>

                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white text-sm flex items-center gap-1">
                                    <MapPin size={14} className="text-body" />
                                    {job.location || "-"}
                                </p>
                            </div>

                            <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={`/sekre/jobs/edit/${job.$id}`}
                                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(job.$id)}
                                        className="text-danger hover:text-red-700 transition-colors"
                                        title="Delete"
                                    >
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
