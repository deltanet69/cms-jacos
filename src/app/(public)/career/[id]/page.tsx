"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { databases, DATABASE_ID, COLLECTIONS, Query } from "@/lib/appwrite";
import { ArrowLeft, Briefcase, MapPin, Clock, Calendar, ChevronRight, Send, FileText } from "lucide-react";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function CareerDetailPage() {
    const { id: slugParam } = useParams<{ id: string }>();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            if (!slugParam) return;
            try {
                // Fetch all jobs and find the one whose title slug matches
                const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.JOB_VACANCY, [
                    Query.limit(100),
                ]);
                const match = res.documents.find(
                    (doc: any) => slugify(doc.title) === slugParam
                );
                if (match) {
                    setJob(match);
                } else {
                    // Fallback: try to get by $id directly (for old links)
                    try {
                        const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.JOB_VACANCY, slugParam);
                        setJob(doc);
                    } catch {
                        setError(true);
                    }
                }
            } catch (err) {
                console.error("Error fetching job:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [slugParam]);

    if (loading) {
        return (
            <div className="pt-32 pb-20 container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
                    <div className="h-12 w-3/4 bg-gray-200 rounded-2xl"></div>
                    <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-100 rounded-3xl"></div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center text-center px-4 pt-24">
                <h1 className="text-6xl font-black text-[#003366]">404</h1>
                <p className="mt-4 text-xl text-gray-500">Job vacancy not found.</p>
                <Link href="/career" className="mt-8 rounded-full bg-[#003366] px-8 py-3 font-bold text-white hover:bg-[#FFCC00] hover:text-[#003366] transition-all">
                    Back to Careers
                </Link>
            </div>
        );
    }

    // The rich text content is stored in the 'message' field (as seen in the admin job add form)
    const jobContent = job.message || job.description || job.content || "";

    return (
        <div className="bg-white min-h-screen">
            {/* HERO HEADER */}
            <section className="relative h-[48vh] pb-16 flex items-end overflow-hidden bg-[#003366]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FFCC0015,transparent_60%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/60 via-transparent to-[#003366]" />
                </div>
                <div className="container mx-auto px-5 lg:px-12 relative z-10">
                    <Link
                        href="/career"
                        className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft size={16} /> Back to Careers
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        {job.jobType && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-bold text-[#FFCC00]">
                                <Briefcase size={14} /> {job.jobType}
                            </span>
                        )}
                        {job.location && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-bold text-blue-100">
                                <MapPin size={14} /> {job.location}
                            </span>
                        )}
                        {job.timePeriod && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-bold text-blue-100">
                                <Clock size={14} /> {job.timePeriod}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight">
                        {job.title}
                    </h1>
                    <p className="mt-4 text-blue-200/80 flex items-center gap-2 text-sm font-semibold">
                        <Calendar size={16} strokeWidth={1.5} /> Posted on {format(new Date(job.$createdAt), "MMMM d, yyyy")}
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <div className="container mx-auto px-5 lg:px-12 py-20 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT: Job Details */}
                    <div className="lg:col-span-8 space-y-10">
                        {jobContent ? (
                            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-[#003366] mb-8">Job Description &amp; Requirements</h2>
                                {/* Scoped styles — !important needed to override Tailwind Preflight reset */}
                                <style>{`
                                    .job-rich-content p { margin-bottom: 1rem !important; line-height: 1.75 !important; color: #374151; }
                                    .job-rich-content br { display: block; margin-bottom: 0.5rem; content: ""; }
                                    .job-rich-content ul { list-style-type: disc !important; padding-left: 1.75rem !important; margin-bottom: 1rem !important; }
                                    .job-rich-content ol { list-style-type: decimal !important; padding-left: 1.75rem !important; margin-bottom: 1rem !important; }
                                    .job-rich-content li { display: list-item !important; list-style: inherit !important; margin-bottom: 0.4rem !important; line-height: 1.75 !important; color: #374151 !important; }
                                    .job-rich-content .ql-indent-1 { padding-left: 2rem !important; }
                                    .job-rich-content .ql-indent-1 li,
                                    .job-rich-content ul ul li { list-style-type: circle !important; }
                                    .job-rich-content .ql-indent-2 li,
                                    .job-rich-content ul ul ul li { list-style-type: square !important; }
                                    .job-rich-content h1 { font-size: 1.875rem !important; font-weight: 800 !important; color: #003366 !important; margin: 1.5rem 0 0.75rem !important; }
                                    .job-rich-content h2 { font-size: 1.5rem !important; font-weight: 700 !important; color: #003366 !important; margin: 1.5rem 0 0.75rem !important; }
                                    .job-rich-content h3 { font-size: 1.25rem !important; font-weight: 700 !important; color: #003366 !important; margin: 1.25rem 0 0.5rem !important; }
                                    .job-rich-content strong, .job-rich-content b { font-weight: 700 !important; color: #111827 !important; }
                                    .job-rich-content em { font-style: italic !important; }
                                    .job-rich-content u { text-decoration: underline !important; }
                                    .job-rich-content s { text-decoration: line-through !important; }
                                    .job-rich-content blockquote { border-left: 4px solid #FFCC00 !important; background: #f0f4ff !important; padding: 1rem 1.5rem !important; border-radius: 0 1rem 1rem 0 !important; margin: 1rem 0 !important; color: #374151 !important; }
                                    .job-rich-content a { color: #003366 !important; text-decoration: underline !important; }
                                `}</style>
                                <div
                                    className="job-rich-content"
                                    dangerouslySetInnerHTML={{ __html: jobContent }}
                                />
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center text-gray-400">
                                <p>No job description available. Please check back later.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Quick Info */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                            <h3 className="text-lg font-bold text-[#003366]">Position Details</h3>
                            <div className="space-y-5">
                                {[
                                    { icon: Briefcase, label: "Employment Type", value: job.jobType || "Full-time" },
                                    { icon: MapPin, label: "Location", value: job.location || "-" },
                                    { icon: Clock, label: "Duration", value: job.timePeriod || "Not specified" },
                                    { icon: Calendar, label: "Posted", value: format(new Date(job.$createdAt), "MMM d, yyyy") },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#003366]">
                                            <item.icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
                                            <p className="font-semibold text-[#003366] mt-0.5">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Apply CTA — 2 Buttons */}
                        <div className="bg-[#003366] rounded-3xl p-8 text-white text-center shadow-xl">
                            <div className="mb-4 text-4xl">🎯</div>
                            <h3 className="text-xl font-black mb-2">Ready to Apply?</h3>
                            <p className="text-sm text-blue-200 mb-8 leading-relaxed">
                                Choose how you'd like to submit your application.
                            </p>
                            <div className="space-y-4">
                                {/* Button 1: Apply Online Form */}
                                <Link
                                    href={`/career/${slugParam}/apply`}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-6 py-4 font-black text-[#003366] transition-all hover:bg-white shadow-lg"
                                >
                                    <FileText size={18} /> Apply Now (Online)
                                </Link>
                                {/* Button 2: Apply via Email */}
                                <a
                                    href={`mailto:recruitment@jacos.id?subject=Job Application: ${encodeURIComponent(job.title)}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm px-6 py-4 font-bold text-white transition-all hover:bg-white hover:text-[#003366]"
                                >
                                    <Send size={18} /> Apply via Email
                                </a>
                                <p className="mt-1 text-xs text-blue-300">recruitment@jacos.id</p>
                            </div>
                        </div>

                        {/* Other Jobs Link */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-[#003366] mb-4">Explore More Roles</h3>
                            <Link
                                href="/career"
                                className="flex items-center justify-between rounded-2xl bg-blue-50/50 p-4 hover:bg-blue-100 transition-colors"
                            >
                                <span className="font-semibold text-[#003366] text-sm">View All Openings</span>
                                <ChevronRight size={18} className="text-[#FFCC00]" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
