"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { Loader2, ArrowLeft, Mail, Phone, User, Briefcase, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

const TABLE_APPLICATIONS = process.env.NEXT_PUBLIC_APPWRITE_TABLE_JOB_APPLICATIONS || "job_applications";

interface ApplicationDetail {
    $id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    message?: string;
    status?: string;
    $createdAt: string;
}

export default function JobApplicationDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [app, setApp] = useState<ApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const doc = await databases.getDocument(DATABASE_ID, TABLE_APPLICATIONS, id as string);
                setApp(doc as unknown as ApplicationDetail);
            } catch (err: any) {
                setError("Failed to load application: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this application as "${newStatus}"?`)) return;
        setUpdating(true);
        try {
            await databases.updateDocument(DATABASE_ID, TABLE_APPLICATIONS, id as string, { status: newStatus });
            setApp(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (err: any) {
            alert("Failed to update status: " + err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (error || !app) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-danger font-medium">{error || "Application not found."}</p>
                <Link href="/sekre/jobs/applications" className="text-primary hover:underline">Back to Applications</Link>
            </div>
        );
    }

    const getStatusConfig = (status?: string) => {
        const s = status?.toLowerCase();
        if (s === "approved") return { color: "text-green-600", bg: "bg-green-100", icon: <CheckCircle size={20} />, label: "Approved" };
        if (s === "rejected") return { color: "text-red-500", bg: "bg-red-100", icon: <XCircle size={20} />, label: "Rejected" };
        return { color: "text-yellow-600", bg: "bg-yellow-100", icon: <Clock size={20} />, label: "Pending" };
    };

    const statusConfig = getStatusConfig(app.status);

    return (
        <>
            <Breadcrumb pageName="Application Detail" />

            <div className="mb-6">
                <Link href="/sekre/jobs/applications" className="flex items-center gap-2 text-body hover:text-black dark:hover:text-white">
                    <ArrowLeft size={18} /> Back to Applications
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-9 md:grid-cols-12">
                {/* Left Side: Message & Action */}
                <div className="md:col-span-7 flex flex-col gap-9">
                    {/* Cover Letter / Message */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Cover Letter / Message</h3>
                        </div>
                        <div className="p-6.5">
                            {app.message ? (
                                <div className="prose dark:prose-invert max-w-none text-body leading-relaxed whitespace-pre-wrap">
                                    {app.message}
                                </div>
                            ) : (
                                <p className="text-body italic">No message provided.</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Actions</h3>
                        </div>
                        <div className="p-6.5">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-sm text-body">Current Status:</span>
                                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize ${statusConfig.bg} ${statusConfig.color}`}>
                                    {statusConfig.icon} {statusConfig.label}
                                </span>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() => handleStatusChange("approved")}
                                    disabled={updating || app.status === "approved"}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle size={20} />
                                    {updating ? "Updating..." : "Approve"}
                                </button>
                                <button
                                    onClick={() => handleStatusChange("rejected")}
                                    disabled={updating || app.status === "rejected"}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <XCircle size={20} />
                                    {updating ? "Updating..." : "Reject"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Applicant Details */}
                <div className="md:col-span-5 flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Applicant Information</h3>
                        </div>
                        <div className="p-6.5">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-black dark:text-white">{app.fullName}</h4>
                                    <p className="text-sm text-body">Applied: {new Date(app.$createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 rounded-lg bg-gray-2 dark:bg-meta-4 p-4">
                                    <Mail size={18} className="text-primary shrink-0" />
                                    <div>
                                        <p className="text-xs text-body">Email</p>
                                        <a href={`mailto:${app.email}`} className="text-sm font-medium text-black dark:text-white hover:text-primary">{app.email}</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg bg-gray-2 dark:bg-meta-4 p-4">
                                    <Phone size={18} className="text-green-500 shrink-0" />
                                    <div>
                                        <p className="text-xs text-body">Phone</p>
                                        <a href={`tel:${app.phoneNumber}`} className="text-sm font-medium text-black dark:text-white hover:text-primary">{app.phoneNumber || "-"}</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg bg-gray-2 dark:bg-meta-4 p-4">
                                    <Briefcase size={18} className="text-yellow-500 shrink-0" />
                                    <div>
                                        <p className="text-xs text-body">Position Applied</p>
                                        <p className="text-sm font-medium text-black dark:text-white">{app.position || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
