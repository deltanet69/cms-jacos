"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { Trash2, Loader2, AlertTriangle, Search, ChevronLeft, ChevronRight, Eye, Mail, Phone, MessageSquare } from "lucide-react";
import { databases, DATABASE_ID, Query } from "@/lib/appwrite";

const TABLE_CONTACT = process.env.NEXT_PUBLIC_APPWRITE_TABLE_CONTACT || "contact_us";

interface Contact {
    $id: string;
    fullName: string;
    email: string;
    phone?: string;
    message?: string;
    status?: string;
    $createdAt: string;
}

export default function ContactListing() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            setError("");
            try {
                const queries = [
                    Query.orderDesc("$createdAt"),
                    Query.limit(limit),
                    Query.offset((page - 1) * limit)
                ];

                const response = await databases.listDocuments(DATABASE_ID, TABLE_CONTACT, queries);

                let docs = response.documents;
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    docs = docs.filter((doc: any) =>
                        doc.fullName?.toLowerCase().includes(q) ||
                        doc.email?.toLowerCase().includes(q) ||
                        doc.phone?.toLowerCase().includes(q)
                    );
                }

                if (filterStatus) {
                    docs = docs.filter((doc: any) => doc.status === filterStatus);
                }

                setContacts(docs as unknown as Contact[]);
                setTotal(searchQuery || filterStatus ? docs.length : response.total);
            } catch (err: any) {
                console.error("Failed to fetch contacts:", err);
                setError(err.message || "Failed to load contact submissions.");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => fetchContacts(), (searchQuery || filterStatus) ? 500 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, filterStatus, page]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact submission?")) return;
        try {
            await databases.deleteDocument(DATABASE_ID, TABLE_CONTACT, id);
            setContacts(contacts.filter(c => c.$id !== id));
            setTotal(t => t - 1);
        } catch (err: any) {
            alert("Failed to delete: " + err.message);
        }
    };

    const getStatusBadge = (status: string | undefined) => {
        const s = status?.toLowerCase() || "new";
        switch (s) {
            case "read": return "bg-blue-100 text-blue-600";
            case "responded": return "bg-green-100 text-green-600";
            case "ignored": return "bg-gray-100 text-gray-600";
            default: return "bg-yellow-100 text-yellow-600"; // new/pending
        }
    };

    return (
        <>
            <Breadcrumb pageName="Contact Us" />

            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="text-xl font-semibold text-black dark:text-white">Contact Submissions</h4>
                        <p className="text-sm text-body">Total: {total} messages</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="relative md:col-span-2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search name, email, or phone..."
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
                            <option value="New">New</option>
                            <option value="Read">Read</option>
                            <option value="Responded">Responded</option>
                            <option value="Ignored">Ignored</option>
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

                {/* Table Header */}
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Full Name</h5>
                    </div>
                    <div className="hidden p-2.5 sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
                    </div>
                    <div className="hidden p-2.5 sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Phone</h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
                    </div>
                    <div className="hidden p-2.5 sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-center">Actions</h5>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col">
                    {loading && (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="grid grid-cols-3 sm:grid-cols-6 border-b border-stroke dark:border-strokedark animate-pulse">
                                <div className="p-2.5 xl:p-5"><div className="h-4 w-3/4 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="p-2.5 xl:p-5 flex items-center"><div className="h-6 w-16 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="hidden p-2.5 sm:flex items-center xl:p-5"><div className="h-4 w-20 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                <div className="p-2.5 xl:p-5 flex items-center justify-center gap-3"><div className="h-8 w-16 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                            </div>
                        ))
                    )}

                    {!loading && !error && contacts.length === 0 && (
                        <div className="p-5 text-center text-body">No contact submissions found.</div>
                    )}

                    {!loading && !error && contacts.map((contact, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-6 ${key === contacts.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
                            key={contact.$id}
                        >
                            <div className="flex items-center p-2.5 xl:p-5">
                                <Link
                                    href={`/sekre/contact/view/${contact.$id}`}
                                    className="text-black dark:text-white font-medium hover:text-primary truncate"
                                >
                                    {contact.fullName}
                                </Link>
                            </div>

                            <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                                <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline truncate">
                                    {contact.email}
                                </a>
                            </div>

                            <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                                <a href={`https://wa.me/${contact.phone?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                    {contact.phone || "-"}
                                </a>
                            </div>

                            <div className="flex items-center p-2.5 xl:p-5">
                                <span className={`px-2.5 py-1 rounded text-xs font-medium capitalize ${getStatusBadge(contact.status)}`}>
                                    {contact.status || "new"}
                                </span>
                            </div>

                            <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                                <p className="text-sm text-body">
                                    {new Date(contact.$createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                </p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5 gap-4">
                                <Link
                                    href={`/sekre/contact/view/${contact.$id}`}
                                    className="text-primary hover:text-[#40A1FB]"
                                    title="View"
                                >
                                    <Eye size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(contact.$id)}
                                    className="text-danger hover:text-red-700"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
