"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { Loader2, AlertTriangle, ArrowLeft, Mail, User, Phone, MessageSquare, CheckCircle, Eye, Info } from "lucide-react";
import Link from "next/link";

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

export default function ViewContact() {
    const { id } = useParams();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const doc = await databases.getDocument(DATABASE_ID, TABLE_CONTACT, id as string);
                setContact(doc as unknown as Contact);
            } catch (err: any) {
                console.error("Failed to fetch contact:", err);
                setError(err.message || "Failed to load contact records.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchContact();
    }, [id]);

    const updateStatus = async (newStatus: string) => {
        if (!contact || updatingStatus) return;
        setUpdatingStatus(true);
        try {
            await databases.updateDocument(DATABASE_ID, TABLE_CONTACT, contact.$id, { status: newStatus });
            setContact({ ...contact, status: newStatus });
        } catch (err: any) {
            alert("Failed to update status: " + err.message);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusBadge = (status: string | undefined) => {
        const s = status?.toLowerCase() || "new";
        switch (s) {
            case "read": return "bg-blue-100 text-blue-600 border-blue-200";
            case "responded": return "bg-green-100 text-green-600 border-green-200";
            case "ignored": return "bg-gray-100 text-gray-600 border-gray-200";
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

    if (!contact) {
        return (
            <div className="p-5 text-center text-danger font-medium flex flex-col items-center gap-2">
                <AlertTriangle size={24} />
                <p>Contact message not found.</p>
                <Link href="/sekre/contact" className="text-primary hover:underline">Go back</Link>
            </div>
        );
    }

    return (
        <>
            <Breadcrumb pageName="View Contact" />

            <div className="mb-6">
                <Link href="/sekre/contact" className="flex items-center gap-2 text-sm font-medium text-body hover:text-primary">
                    <ArrowLeft size={16} /> Back to List
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Left: Contact Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-semibold text-black dark:text-white">Submission Status</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(contact.status)}`}>
                                {contact.status || "New"}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4 text-primary">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Full Name</p>
                                    <p className="text-sm font-medium text-black dark:text-white">{contact.fullName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4 text-primary">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Email Address</p>
                                    <a href={`mailto:${contact.email}`} className="text-sm font-medium text-primary hover:underline break-all">
                                        {contact.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4 text-success">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Phone Number</p>
                                    <a
                                        href={`https://wa.me/${contact.phone?.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        {contact.phone || "-"}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4 text-primary">
                                    <CheckCircle size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-body">Submitted At</p>
                                    <p className="text-sm font-medium text-black dark:text-white uppercase">
                                        {new Date(contact.$createdAt).toLocaleString("en-GB", {
                                            day: "numeric", month: "long", year: "numeric",
                                            hour: "2-digit", minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <h4 className="mb-4 font-semibold text-black dark:text-white">Admin Actions</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => updateStatus("Read")}
                                disabled={updatingStatus || contact.status === "Read"}
                                className="flex items-center justify-center gap-2 rounded bg-blue-500 py-2.5 px-4 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                            >
                                <Eye size={14} /> Mark as Read
                            </button>
                            <button
                                onClick={() => updateStatus("Responded")}
                                disabled={updatingStatus || contact.status === "Responded"}
                                className="flex items-center justify-center gap-2 rounded bg-green-500 py-2.5 px-4 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                            >
                                <CheckCircle size={14} /> Mark as Responded
                            </button>
                            <button
                                onClick={() => updateStatus("Ignored")}
                                disabled={updatingStatus || contact.status === "Ignored"}
                                className="flex items-center justify-center gap-2 rounded bg-body py-2.5 px-4 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                            >
                                <Info size={14} /> Ignore Submission
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Message Content */}
                <div className="md:col-span-2">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark flex items-center gap-2">
                            <MessageSquare size={20} className="text-primary" />
                            <h3 className="font-semibold text-black dark:text-white">Message Content</h3>
                        </div>
                        <div className="p-6.5">
                            <div className="text-black dark:text-white whitespace-pre-wrap leading-relaxed bg-gray-2 dark:bg-meta-4 p-5 rounded-md border border-stroke dark:border-strokedark">
                                {contact.message || <span className="italic">No message content.</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
