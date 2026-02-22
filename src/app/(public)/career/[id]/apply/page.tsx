"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    databases,
    storage,
    DATABASE_ID,
    BUCKET_ID,
    COLLECTIONS,
    Query,
    ID,
} from "@/lib/appwrite";
import {
    ArrowLeft,
    Send,
    CheckCircle,
    User,
    Mail,
    Phone,
    Briefcase,
    Upload,
    FileText,
    X,
    AlertCircle,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────
function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

// ── component ─────────────────────────────────────────────────────────────────
export default function ApplyJobPage() {
    const { id: slugParam } = useParams<{ id: string }>();
    const [job, setJob] = useState<any>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        position: "",
        message: "",
    });

    // ── file upload state ──
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

    // ── fetch job ──────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchJob = async () => {
            if (!slugParam) return;
            try {
                const res = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.JOB_VACANCY,
                    [Query.limit(100)]
                );
                const match = res.documents.find(
                    (doc: any) => slugify(doc.title) === slugParam
                );
                if (match) {
                    setJob(match);
                    setFormData((prev) => ({ ...prev, position: match.title }));
                } else {
                    try {
                        const doc = await databases.getDocument(
                            DATABASE_ID,
                            COLLECTIONS.JOB_VACANCY,
                            slugParam
                        );
                        setJob(doc);
                        setFormData((prev) => ({ ...prev, position: doc.title }));
                    } catch { /* not found */ }
                }
            } catch (err) {
                console.error("Error fetching job:", err);
            }
        };
        fetchJob();
    }, [slugParam]);

    // ── file selection ─────────────────────────────────────────────────────────
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError("");
        const selected = Array.from(e.target.files || []);
        if (selected.length === 0) return;

        const errors: string[] = [];
        const valid: File[] = [];

        selected.forEach((f) => {
            if (f.type !== "application/pdf") {
                errors.push(`"${f.name}" is not a PDF.`);
            } else if (f.size > MAX_FILE_SIZE) {
                errors.push(`"${f.name}" exceeds 2 MB.`);
            } else {
                // Prevent duplicates
                if (!files.some((existing) => existing.name === f.name && existing.size === f.size)) {
                    valid.push(f);
                }
            }
        });

        if (errors.length > 0) setFileError(errors.join(" "));
        if (valid.length > 0) setFiles((prev) => [...prev, ...valid]);

        // Reset input so the same file can be re-added after removing
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setFileError("");
    };

    // ── submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            setFileError("Please upload at least one CV / Portfolio PDF (max 2 MB each).");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            // 1. Upload all files concurrently to Appwrite Storage
            setUploadProgress(20);
            const uploadedIds = await Promise.all(
                files.map((f) => storage.createFile(BUCKET_ID, ID.unique(), f).then((r) => r.$id))
            );
            setUploadProgress(60);

            // 2. Save application record with file ID in `document` column
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.JOB_APPLICATIONS,
                ID.unique(),
                {
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    position: formData.position || job?.title || "",
                    message: formData.message,
                    document: uploadedIds.join(","),
                }
            );
            setUploadProgress(100);
            setStatus("success");
        } catch (err: any) {
            console.error("Application submission error:", err);
            setErrorMsg(err?.message || "Submission failed. Please try again.");
            setStatus("error");
        }
    };

    // ── SUCCESS STATE ──────────────────────────────────────────────────────────
    if (status === "success") {
        return (
            <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4">
                <div className="max-w-md w-full rounded-[3rem] bg-white p-14 text-center shadow-2xl">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500">
                        <CheckCircle size={48} strokeWidth={1.5} />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-[#003366]">Application Sent!</h2>
                    <p className="text-gray-500 leading-relaxed">
                        Thank you for applying to{" "}
                        <span className="font-bold text-[#003366]">{job?.title}</span>. Our HR team
                        will review your application and reach out soon.
                    </p>
                    <div className="mt-10 space-y-3">
                        <Link
                            href="/career"
                            className="block w-full rounded-full bg-[#003366] py-4 font-bold text-white text-center hover:bg-[#FFCC00] hover:text-[#003366] transition-all"
                        >
                            View More Openings
                        </Link>
                        <Link
                            href="/"
                            className="block w-full text-gray-400 font-medium text-sm hover:text-[#003366] transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── MAIN PAGE ──────────────────────────────────────────────────────────────
    return (
        <div className="bg-white min-h-screen">

            {/* ── HERO HEADER ─────────────────────────────────────────────── */}
            <section className="relative h-[40vh] pb-16 flex items-end justify-center overflow-hidden bg-[#003366]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FFCC0015,transparent_60%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/60 via-transparent to-[#003366]" />
                </div>
                <div className="container mx-auto px-5 lg:px-12 relative z-10">
                    <Link
                        href={`/career/${slugParam}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#FFFFFF]/80 hover:text-[#40A1FB] transition-colors mb-6"
                    >
                        <ArrowLeft size={16} /> Back to Job Details
                    </Link>
                    <div className="flex items-center gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFCC00] text-[#003366] shadow-lg">
                            <Briefcase size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#FFCC00]/70 mb-1">
                                Applying For
                            </p>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">
                                {job?.title || "Loading…"}
                            </h1>
                            {job && (
                                <p className="text-blue-200 text-sm mt-1">
                                    {job.location} · {job.jobType}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FORM ────────────────────────────────────────────────────── */}
            <section className="py-10">
                <div className="container mx-auto px-5 lg:px-12 max-w-5xl">
                    <div className="rounded-[2.5rem] bg-white border border-gray-100 shadow-xl p-6 md:p-10">
                        <h2 className="text-3xl font-bold text-[#003366] mb-2">Apply Online</h2>
                        <p className="text-gray-600 mb-10 text-md">
                            Fill in the form below and attach your CV. We'll be in touch shortly.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Row 1: Name + Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Full Name *">
                                    <InputWithIcon icon={<User size={17} className="text-gray-300" />}>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Your full name"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className={inputBase}
                                        />
                                    </InputWithIcon>
                                </FormField>
                                <FormField label="Email Address *">
                                    <InputWithIcon icon={<Mail size={17} className="text-gray-300" />}>
                                        <input
                                            required
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={inputBase}
                                        />
                                    </InputWithIcon>
                                </FormField>
                            </div>

                            {/* Row 2: Phone + Position */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Phone Number *">
                                    <InputWithIcon icon={<Phone size={17} className="text-gray-300" />}>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+62 812…"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className={inputBase}
                                        />
                                    </InputWithIcon>
                                </FormField>
                                <FormField label="Position Applied For">
                                    <InputWithIcon icon={<Briefcase size={17} className="text-gray-300" />}>
                                        <input
                                            type="text"
                                            placeholder={job?.title || "Position"}
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            className={inputBase}
                                        />
                                    </InputWithIcon>
                                </FormField>
                            </div>

                            {/* ── CV / PORTFOLIO UPLOAD ────────────────────── */}
                            <FormField label="CV / Portfolio *">
                                {/* Uploaded files list */}
                                {files.length > 0 && (
                                    <div className="space-y-3 mb-3">
                                        {files.map((f, i) => (
                                            <div key={i} className="flex items-center gap-4 rounded-2xl border border-[#003366]/20 bg-blue-50 px-5 py-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003366] text-white">
                                                    <FileText size={18} strokeWidth={1.5} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-[#003366] truncate text-sm">{f.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {(f.size / 1024 / 1024).toFixed(2)} MB · PDF
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(i)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add more / initial upload button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`w-full rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer
                                        ${fileError && files.length === 0
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-200 bg-gray-50 hover:border-[#236DAF] hover:bg-gray-100"
                                        }`}
                                >
                                    <Upload
                                        size={28}
                                        strokeWidth={1.5}
                                        className={`mx-auto mb-2 ${fileError && files.length === 0 ? "text-red-400" : "text-[#003366]/30"}`}
                                    />
                                    <p className="font-bold text-[#003366] text-sm mb-1">
                                        {files.length === 0 ? "Click to Upload PDF" : "Add Another PDF"}
                                    </p>
                                    <p className="text-xs text-gray-400">PDF only · Max 2 MB per file</p>
                                </button>

                                {/* Hidden file input — multiple enabled */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                {/* File error */}
                                {fileError && (
                                    <div className="mt-3 flex items-center gap-2 text-red-500 text-sm font-medium">
                                        <AlertCircle size={16} strokeWidth={2} />
                                        {fileError}
                                    </div>
                                )}
                            </FormField>

                            {/* Upload progress bar */}
                            {status === "loading" && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-[#003366]">
                                        <span>Uploading…</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#FFCC00] transition-all duration-500"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Cover Letter */}
                            <FormField label="Cover Letter / Message">
                                <textarea
                                    rows={6}
                                    placeholder="Tell us about yourself, your experience, and why you want to join JACOS…"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-5 text-md text-[#003366] focus:border-[#236DAF] focus:outline-none focus:ring-2 focus:ring-[#236DAF]/20 transition resize-none"
                                />
                            </FormField>



                            {/* Error message */}
                            {status === "error" && errorMsg && (
                                <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-3 text-sm text-red-600">
                                    <AlertCircle size={18} strokeWidth={2} className="shrink-0 mt-0.5" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full rounded-full bg-[#003366] py-5 font-bold text-white shadow-xl transition-all hover:bg-[#FFCC00] hover:text-[#003366] disabled:opacity-50 flex items-center justify-center gap-3 text-base"
                            >
                                {status === "loading" ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Submitting…
                                    </>
                                ) : (
                                    <>
                                        Submit Application
                                        <Send size={18} strokeWidth={1.5} />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-700">
                                By submitting, you consent to JACOS processing your personal data for recruitment purposes.
                            </p>

                        </form>
                    </div>
                </div>
            </section>

        </div>
    );
}

// ── Small UI helpers ──────────────────────────────────────────────────────────
const inputBase =
    "w-full bg-transparent py-4 pl-12 pr-4 text-md  text-[#003366] focus:outline-none placeholder:text-gray-300";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#003366]/40">
                {label}
            </label>
            {children}
        </div>
    );
}

function InputWithIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="relative flex items-center rounded-lg border border-gray-300 bg-gray-50 focus-within:border-[#236DAF] focus-within:ring-2 focus-within:ring-[#236DAF]/20 transition-all">
            <span className="absolute left-4 pointer-events-none">{icon}</span>
            {children}
        </div>
    );
}
