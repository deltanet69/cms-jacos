"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const TABLE_ENQUIRIES = process.env.NEXT_PUBLIC_APPWRITE_TABLE_ENQUIRIES || "enquiries";

export default function EditEnquiry() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Form fields
    const [parentName, setParentName] = useState("");
    const [studentName, setStudentName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [levelGrade, setLevelGrade] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchEnquiry = async () => {
            try {
                const doc = await databases.getDocument(DATABASE_ID, TABLE_ENQUIRIES, id as string);
                setParentName(doc.parentName || "");
                setStudentName(doc.studentName || "");
                setEmail(doc.email || "");
                setPhoneNumber(doc.phoneNumber || "");
                setLevelGrade(doc.levelGrade || "Pre-school P1");
                setLocation(doc.location || "");
                setMessage(doc.message || "");
                setStatus(doc.status || "Pending");
            } catch (err: any) {
                console.error("Failed to fetch enquiry:", err);
                setError(err.message || "Failed to load enquiry data.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEnquiry();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const enquiryData = {
                parentName,
                studentName,
                email,
                phoneNumber,
                levelGrade,
                location,
                message,
                status,
            };

            await databases.updateDocument(DATABASE_ID, TABLE_ENQUIRIES, id as string, enquiryData);
            router.push("/sekre/enquiries");
        } catch (err: any) {
            console.error("Failed to update enquiry:", err);
            setError(err.message || "Failed to update enquiry.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-60 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Edit Enquiry" />

            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark flex items-center justify-between">
                        <h3 className="font-medium text-black dark:text-white">Edit Admission Enquiry</h3>
                        <Link href="/sekre/enquiries" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                            <ArrowLeft size={16} /> Back to List
                        </Link>
                    </div>

                    {error && (
                        <div className="mx-6.5 mt-4 flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
                            <AlertTriangle size={20} />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            <div className="mb-4.5 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Parent Name <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={parentName}
                                        onChange={(e) => setParentName(e.target.value)}
                                        placeholder="Enter parent's full name"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Student Name <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        placeholder="Enter student's full name"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="mb-4.5 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Email Address <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter contact email"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="e.g. 628123456789"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="mb-4.5 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Level / Grade
                                    </label>
                                    <select
                                        value={levelGrade}
                                        onChange={(e) => setLevelGrade(e.target.value)}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    >
                                        <option value="Pre-school P1">Pre-school P1</option>
                                        <option value="Pre-school P2">Pre-school P2</option>
                                        <option value="Kindergarten K1">Kindergarten K1</option>
                                        <option value="Kindergarten K2">Kindergarten K2</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Location / Address
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Enter parent's location"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Message / Enquiry Details
                                </label>
                                <textarea
                                    rows={6}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type enquiry message here..."
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                ></textarea>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Enrolled">Enrolled</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70 transition-all"
                            >
                                {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Update Enquiry"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
