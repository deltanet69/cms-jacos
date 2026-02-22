"use client";

import React, { useState, useEffect, useMemo } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { useRouter, useParams } from "next/navigation";
import { databases, storage, account, DATABASE_ID, BUCKET_ID, ID } from "@/lib/appwrite";
import { Loader2, Upload, AlertCircle, Save, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Link from "next/link";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div className="h-40 w-full animate-pulse bg-gray-200 dark:bg-meta-4 rounded"></div>,
});

const TABLE_JOBS = process.env.NEXT_PUBLIC_APPWRITE_TABLE_JOB_VACANCY || "job_vacancy";

export default function EditJobVacancy() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Form States — matching actual Appwrite schema
    const [title, setTitle] = useState("");
    const [position, setPosition] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("Full-time");
    const [timePeriod, setTimePeriod] = useState("");
    const [message, setMessage] = useState("");
    const [existingAttachmentId, setExistingAttachmentId] = useState("");
    const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const doc = await databases.getDocument(DATABASE_ID, TABLE_JOBS, id as string);
                setTitle(doc.title || "");
                setPosition(doc.position || "");
                setLocation(doc.location || "");
                setJobType(doc.jobType || doc.email || "Full-time");
                setTimePeriod(doc.timePeriod || doc.phone || "");
                setMessage(doc.message || "");
                setExistingAttachmentId(doc.attachmentId || "");

                if (doc.attachmentId) {
                    setPreviewImage(storage.getFileView(BUCKET_ID, doc.attachmentId).toString());
                }
            } catch (err: any) {
                setError("Failed to load job: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const quillModules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "code-block"],
                ["clean"],
            ],
        },
    }), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            let attachmentId = existingAttachmentId;

            if (featuredImageFile) {
                const uniqueId = ID.unique();
                const uploadResponse = await storage.createFile(BUCKET_ID, `job_feat_${uniqueId}`, featuredImageFile);
                attachmentId = uploadResponse.$id;
            }

            // Only send attributes that exist in the Appwrite schema
            const jobData: Record<string, any> = {
                title,
                position,
                location,
                jobType,
                timePeriod,
                message,
                attachmentId,
            };

            await databases.updateDocument(DATABASE_ID, TABLE_JOBS, id as string, jobData);

            // Redirect immediately.
            router.push("/sekre/jobs");
        } catch (err: any) {
            setError(err.message || "Failed to update job.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Edit Job Vacancy" />

            <div className="mb-6">
                <Link href="/sekre/jobs" className="flex items-center gap-2 text-body hover:text-black dark:hover:text-white">
                    <ArrowLeft size={18} /> Back to List
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-9 md:grid-cols-12">
                <div className="md:col-span-8 flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Job Details</h3>
                        </div>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Job Title</label>
                                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Teacher" className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Position</label>
                                <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Full-time / Part-time" className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Location</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Jakarta, Indonesia" className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Job Description & Requirements</h3>
                        </div>
                        <div className="p-6.5">
                            <div className="bg-white dark:bg-form-input">
                                <ReactQuill theme="snow" value={message} onChange={setMessage} modules={quillModules} className="min-h-[300px]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Featured Image</h3>
                        </div>
                        <div className="p-6.5">
                            <div className="relative mb-4 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4">
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none" />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <Upload size={20} className="text-primary" />
                                    <p className="text-xs text-center">Change image</p>
                                </div>
                            </div>
                            {previewImage && <img src={previewImage} alt="Preview" className="w-full rounded border border-stroke dark:border-strokedark" />}
                        </div>
                    </div>

                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Job Information</h3>
                        </div>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Job Type</label>
                                <select
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                </select>
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Time Period</label>
                                <input
                                    type="text"
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(e.target.value)}
                                    placeholder="e.g. 1 Year / Permanent"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                />
                            </div>

                            {error && (
                                <div className="mb-4 flex items-center gap-2 rounded bg-danger/10 p-3 text-danger">
                                    <AlertCircle size={18} />
                                    <p className="text-xs font-medium">{error}</p>
                                </div>
                            )}

                            <button type="submit" disabled={saving} className="flex w-full justify-center rounded bg-[#1F7BC9] p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 gap-2">
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {saving ? "Updating..." : "Update Job"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <style jsx global>{`
                .ql-container { min-height: 250px; font-size: 16px; }
                .ql-editor { font-size: 16px; line-height: 1.6; }
                .dark .ql-toolbar, .dark .ql-container { border-color: #3d4d60; }
                .dark .ql-snow .ql-stroke { stroke: white; }
                .dark .ql-snow .ql-fill { fill: white; }
            `}</style>
        </>
    );
}
