"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, AlertTriangle, Search, ArrowUpDown, ChevronLeft, ChevronRight, MessageSquare, User, GraduationCap, MapPin, Eye } from "lucide-react";
import { databases, DATABASE_ID, Query, COLLECTIONS } from "@/lib/appwrite";

const TABLE_ENQUIRIES = COLLECTIONS.ENQUIRIES;

interface Enquiry {
    $id: string;
    parentName: string;
    studentName: string;
    email: string;
    phoneNumber?: string;
    levelGrade?: string;
    location?: string;
    status?: string;
    $createdAt: string;
}

export default function EnquiryListing() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchEnquiries = async () => {
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

                const response = await databases.listDocuments(DATABASE_ID, TABLE_ENQUIRIES, queries);

                let filteredDocs = response.documents;
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    filteredDocs = filteredDocs.filter((doc: any) =>
                        doc.parentName?.toLowerCase().includes(q) ||
                        doc.studentName?.toLowerCase().includes(q) ||
                        doc.email?.toLowerCase().includes(q) ||
                        doc.phoneNumber?.toLowerCase().includes(q)
                    );
                }

                if (filterStatus) {
                    filteredDocs = filteredDocs.filter((doc: any) => doc.status === filterStatus);
                }

                setEnquiries(filteredDocs as unknown as Enquiry[]);
                setTotal(searchQuery || filterStatus ? filteredDocs.length : response.total);
            } catch (err: any) {
                console.error("Failed to fetch enquiries:", err);
                setError(err.message || "Failed to load enquiries.");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => fetchEnquiries(), (searchQuery || filterStatus) ? 500 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, filterStatus, sortOrder, page]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this enquiry?")) return;
        try {
            await databases.deleteDocument(DATABASE_ID, TABLE_ENQUIRIES, id);
            setEnquiries(enquiries.filter(e => e.$id !== id));
            setTotal(t => t - 1);
        } catch (err: any) {
            alert("Failed to delete: " + err.message);
        }
    };

    const getStatusBadge = (status: string | undefined) => {
        const s = status?.toLowerCase() || "pending";
        switch (s) {
            case "contacted": return "bg-blue-100 text-blue-600";
            case "enrolled": return "bg-green-100 text-green-600";
            case "rejected": return "bg-red-100 text-red-600";
            default: return "bg-yellow-100 text-yellow-600";
        }
    };

    return (
        <>
            <Breadcrumb pageName="Enquiries" />

            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="text-xl font-semibold text-black dark:text-white">Admission Enquiries</h4>
                        <p className="text-sm text-body">Total: {total} entries</p>
                    </div>
                    <Link
                        href="/sekre/enquiries/add"
                        className="flex items-center gap-2 rounded-md bg-[#1F7BC9] px-4 py-2 font-medium text-white hover:bg-opacity-90 transition-all"
                    >
                        <Plus size={18} /> Add New
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="relative md:col-span-2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search parent or student name..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                            className="w-full appearance-none rounded-md border border-stroke bg-gray-2 py-2.5 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Rejected">Rejected</option>
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
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Parent Name</h5>
                    </div>
                    <div className="hidden p-2.5 sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Student Name</h5>
                    </div>
                    <div className="hidden p-2.5 sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
                    </div>
                    <div className="hidden p-2.5 sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Phone</h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Level/Grade</h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
                    </div>
                    <div className="hidden p-2.5 sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
                    </div>
                </div>

                {loading && (
                    <>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="grid grid-cols-3 sm:grid-cols-7 border-b border-stroke dark:border-strokedark animate-pulse">
                                <div className="p-2.5 xl:p-5"><div className="h-4 w-3/4 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="p-2.5 xl:p-5 flex items-center"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="p-2.5 xl:p-5 flex items-center"><div className="h-6 w-16 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
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

                {!loading && !error && enquiries.length === 0 && (
                    <div className="p-5 text-center text-body">No enquiries found.</div>
                )}

                {!loading && !error && enquiries.map((enquiry, key) => (
                    <div
                        className={`grid grid-cols-3 sm:grid-cols-7 ${key === enquiries.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
                        key={enquiry.$id}
                    >
                        <div className="flex items-center p-2.5 xl:p-5">
                            <Link
                                href={`/sekre/enquiries/view/${enquiry.$id}`}
                                className="text-black dark:text-white font-medium hover:text-primary transition-colors line-clamp-2 leading-tight"
                            >
                                {enquiry.parentName || "Unknown"}
                            </Link>
                        </div>

                        <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                            <p className="text-sm text-black dark:text-white">
                                {enquiry.studentName || "-"}
                            </p>
                        </div>

                        <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                            <a href={`mailto:${enquiry.email}`} className="text-sm text-primary hover:underline truncate max-w-full">
                                {enquiry.email || "-"}
                            </a>
                        </div>

                        <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                            <a href={`https://wa.me/${enquiry.phoneNumber?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                {enquiry.phoneNumber || "-"}
                            </a>
                        </div>

                        <div className="flex items-center p-2.5 xl:p-5">
                            <p className="text-sm text-black dark:text-white uppercase">
                                {enquiry.levelGrade || "-"}
                            </p>
                        </div>

                        <div className="flex items-center p-2.5 xl:p-5">
                            <span className={`px-2.5 py-1 rounded text-xs font-medium capitalize ${getStatusBadge(enquiry.status)}`}>
                                {enquiry.status || "pending"}
                            </span>
                        </div>

                        <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={`/sekre/enquiries/view/${enquiry.$id}`}
                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                    title="View Details"
                                >
                                    <Eye size={18} />
                                </Link>
                                <Link
                                    href={`/sekre/enquiries/edit/${enquiry.$id}`}
                                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(enquiry.$id)}
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
        </>
    );
}
