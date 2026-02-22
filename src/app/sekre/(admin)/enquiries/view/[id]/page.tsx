"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { Loader2, AlertTriangle, ArrowLeft, Mail, User, MapPin, GraduationCap, Clock, MessageSquare, CheckCircle, XCircle, Info } from "lucide-react";
import Link from "next/link";

const TABLE_ENQUIRIES = process.env.NEXT_PUBLIC_APPWRITE_TABLE_ENQUIRIES || "enquiries";

interface Enquiry {
    $id: string;
    parentName: string;
    studentName: string;
    email: string;
    phoneNumber?: string;
    levelGrade?: string;
    location?: string;
    message?: string;
    status?: string;
    $createdAt: string;
}

export default function ViewEnquiry() {
    const { id } = useParams();
    const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [error, setError] = useState("");

    const fetchEnquiry = async () => {
        try {
            const doc = await databases.getDocument(DATABASE_ID, TABLE_ENQUIRIES, id as string);
            setEnquiry(doc as unknown as Enquiry);
        } catch (err: any) {
            console.error("Failed to fetch enquiry:", err);
            setError(err.message || "Failed to load enquiry details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchEnquiry();
    }, [id]);

    const updateStatus = async (newStatus: string) => {
        if (!enquiry || updatingStatus) return;
        setUpdatingStatus(true);
        try {
            await databases.updateDocument(DATABASE_ID, TABLE_ENQUIRIES, enquiry.$id, { status: newStatus });
            setEnquiry({ ...enquiry, status: newStatus });
        } catch (err: any) {
            alert("Failed to update status: " + err.message);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusBadge = (status: string | undefined) => {
        const s = status?.toLowerCase() || "pending";
        switch (s) {
            case "contacted": return "bg-blue-100 text-blue-600 border-blue-200";
            case "enrolled": return "bg-green-100 text-green-600 border-green-200";
            case "rejected": return "bg-red-100 text-red-600 border-red-200";
            default: return "bg-yellow-100 text-yellow-600 border-yellow-200";
        }
    };

    if (loading) {
        return (
            <div className="flex h-60 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!enquiry) {
        return (
            <div className="p-5 text-center text-danger font-medium flex flex-col items-center gap-2">
                <AlertTriangle size={24} />
                <p>Enquiry not found.</p>
                <Link href="/sekre/enquiries" className="text-primary hover:underline">Go back</Link>
            </div>
        );
    }

    return (
        <>
            <Breadcrumb pageName="View Enquiry" />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/sekre/enquiries" className="flex items-center gap-2 text-sm font-medium text-body hover:text-primary">
                    <ArrowLeft size={16} /> Back to Enquiries
                </Link>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/sekre/enquiries/edit/${enquiry.$id}`}
                        className="rounded-md border border-stroke bg-white px-4 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    >
                        Edit Information
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Left: Applicant Details */}
                <div className="md:col-span-1 space-y-6">
                    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-semibold text-black dark:text-white">Applicant Status</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(enquiry.status)}`}>
                                {enquiry.status || "Pending"}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
                                    <User size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Parent Name</p>
                                    <p className="text-sm font-medium text-black dark:text-white">{enquiry.parentName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
                                    <User size={18} className="text-[#1F7BC9]" />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Student Name</p>
                                    <p className="text-sm font-medium text-black dark:text-white">{enquiry.studentName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
                                    <Mail size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Email Address</p>
                                    <a href={`mailto:${enquiry.email}`} className="text-sm font-medium text-primary hover:underline break-all">
                                        {enquiry.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
                                    <MessageSquare size={18} className="text-success" />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Phone Number</p>
                                    <a
                                        href={`https://wa.me/${enquiry.phoneNumber?.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        {enquiry.phoneNumber || "-"}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
                                    <GraduationCap size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Level / Grade</p>
                                    <p className="text-sm font-medium text-black dark:text-white uppercase">{enquiry.levelGrade || "-"}</p>
                                </div>
                            </div>

                            {enquiry.location && (
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
                                        <MapPin size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-body">Location</p>
                                        <p className="text-sm font-medium text-black dark:text-white">{enquiry.location}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
                                    <Clock size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Received Date</p>
                                    <p className="text-sm font-medium text-black dark:text-white">
                                        {new Date(enquiry.$createdAt).toLocaleString("en-GB", {
                                            day: "numeric", month: "long", year: "numeric",
                                            hour: "2-digit", minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <h4 className="mb-4 font-semibold text-black dark:text-white">Actions</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => updateStatus("Contacted")}
                                disabled={updatingStatus || enquiry.status === "Contacted"}
                                className="flex items-center justify-center gap-2 rounded bg-blue-500 py-2.5 px-4 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                            >
                                <Info size={14} /> Contacted
                            </button>
                            <button
                                onClick={() => updateStatus("Enrolled")}
                                disabled={updatingStatus || enquiry.status === "Enrolled"}
                                className="flex items-center justify-center gap-2 rounded bg-green-500 py-2.5 px-4 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                            >
                                <CheckCircle size={14} /> Enrolled
                            </button>
                            <button
                                onClick={() => updateStatus("Rejected")}
                                disabled={updatingStatus || enquiry.status === "Rejected"}
                                className="flex items-center justify-center gap-2 rounded bg-danger py-2.5 px-4 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                            >
                                <XCircle size={14} /> Rejected
                            </button>
                            <button
                                onClick={() => updateStatus("Pending")}
                                disabled={updatingStatus || enquiry.status === "Pending"}
                                className="flex items-center justify-center gap-2 rounded bg-body py-2.5 px-4 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                            >
                                <Clock size={14} /> Set Pending
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Message Content */}
                <div className="md:col-span-2">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark flex items-center gap-2">
                            <MessageSquare size={20} className="text-primary" />
                            <h3 className="font-semibold text-black dark:text-white">Enquiry Message</h3>
                        </div>
                        <div className="p-6.5">
                            {enquiry.message ? (
                                <div className="text-black dark:text-white whitespace-pre-wrap leading-relaxed bg-gray-2 dark:bg-meta-4 p-5 rounded-md border border-stroke dark:border-strokedark">
                                    {enquiry.message}
                                </div>
                            ) : (
                                <p className="italic text-body">No message provided.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
