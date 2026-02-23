"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { sdk, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import {
    Briefcase,
    MapPin,
    Clock,
    ArrowRight,
    Search,
    Moon,
    Sprout,
    Coins,
    HeartPulse,
    ChevronRight
} from "lucide-react";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// ── Benefits data ──────────────────────────────────────────────────────────
const benefits = [
    {
        icon: Moon,
        color: "bg-blue-50 text-[#003366]",
        title: "Islamic Environment",
        desc: "Work in a culture that values faith, integrity, and compassionate leadership.",
    },
    {
        icon: Sprout,
        color: "bg-green-50 text-green-600",
        title: "Continuous Growth",
        desc: "Access professional development and career advancement opportunities.",
    },
    {
        icon: Coins,
        color: "bg-yellow-50 text-yellow-600",
        title: "Competitive Salary",
        desc: "We recognise your expertise with a fair and transparent compensation package.",
    },
    {
        icon: HeartPulse,
        color: "bg-pink-50 text-pink-500",
        title: "Health & Wellbeing",
        desc: "Comprehensive health coverage and balanced workloads for lasting well-being.",
    },
];

export default function CareerPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await sdk.databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.JOB_VACANCY,
                    []
                );
                setJobs(response.documents);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(
        (job) =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white">

            {/* ── HERO ──────────────────────────────────────────────────────────── */}
            <section className="relative h-[45vh] lg:h-[40vh] pb-10 flex items-end justify-center overflow-hidden bg-[#003366]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FFCC0015,transparent_60%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/60 via-transparent to-[#003366]" />
                </div>
                <div className="container mx-auto px-5 lg:px-12 relative z-10 text-center">
                    <span className="inline-block rounded-full bg-[#FFCC00]/20 border border-[#FFCC00]/30 px-10 py-2 text-sm font-bold text-[#FFCC00] mb-6">
                        Join Our Team
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white">
                        Build Something <span className="text-[#FFCC00]">Meaningful</span>
                    </h1>
                </div>
            </section>

            {/* ── SEARCH BAR ───────────────────────────────────────────────────── */}
            <section className="py-10 bg-[#f9f9f9] border-b border-gray-100">
                <div className="container mx-auto px-5 lg:px-12">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="relative w-full max-w-2xl">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={22} strokeWidth={1.5} />
                            <input
                                type="text"
                                placeholder="Search by role or location…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-white py-5 pl-16 pr-6 text-base font-medium text-[#003366] shadow-sm focus:border-[#FFCC00] focus:outline-none focus:ring-2 focus:ring-[#FFCC00]/20 transition placeholder:text-gray-300"
                            />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400 font-medium shrink-0">
                            <span>{filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""} found</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── JOBS LISTING ─────────────────────────────────────────────────── */}
            <section className="py-20 lg:py-28">
                <div className="container mx-auto px-5 lg:px-12">

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-28 w-full rounded-2xl bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredJobs.length > 0 ? (
                        <div className="space-y-4">
                            {filteredJobs.map((job) => (
                                <Link
                                    key={job.$id}
                                    href={`/career/${slugify(job.title)}`}
                                    className="group flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white px-8 py-7 rounded-2xl border border-gray-100 hover:border-[#003366]/20 hover:shadow-lg transition-all relative overflow-hidden"
                                >
                                    {/* Left accent line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gray-100 group-hover:bg-[#FFCC00] transition-colors duration-300" />

                                    <div className="space-y-2 pl-4">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#003366]">
                                                <Briefcase size={10} strokeWidth={2} />
                                                {job.jobType || "Full-time"}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-600">
                                                <MapPin size={10} strokeWidth={2} />
                                                {job.location}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#003366]">{job.title}</h3>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                            <Clock size={13} strokeWidth={1.5} />
                                            <span>Posted {format(new Date(job.$createdAt), "MMM d, yyyy")}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 pl-4 md:pl-0">
                                        <span className="rounded-full bg-[#003366] px-7 py-3 text-sm font-bold text-white group-hover:bg-[#FFCC00] group-hover:text-[#003366] transition-all flex items-center gap-2">
                                            Apply Now
                                            <ChevronRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 text-gray-200">
                                <Search size={48} strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#003366] mb-2">No positions found</h3>
                            <p className="text-gray-400 mb-8">
                                {searchTerm ? "Try a different search term." : "No openings right now — please check back soon."}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="rounded-full border-2 border-[#003366] px-8 py-3 text-sm font-bold text-[#003366] hover:bg-[#003366] hover:text-white transition-all"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}

                </div>
            </section>

            {/* ── WHY JOIN JACOS ────────────────────────────────────────────────── */}
            <section className="bg-[#f9f9f9] py-32">
                <div className="container mx-auto px-5 lg:px-12">
                    <div className="text-center mb-20">
                        <span className="text-[#FFCC00] font-bold text-sm uppercase tracking-widest">What We Offer</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mt-4">Why Join JACOS?</h2>
                        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
                            More than a job — a chance to shape the future of Islamic education.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map(({ icon: Icon, color, title, desc }, i) => (
                            <div key={i} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#003366]/10 hover:shadow-xl transition-all">
                                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${color} transition-transform group-hover:scale-110`}>
                                    <Icon size={28} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-lg font-bold text-[#003366] mb-3">{title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-20 text-center">
                        <p className="text-gray-500 mb-6 text-lg">Don't see a role that fits?</p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-3 rounded-full border-2 border-[#003366] px-10 py-4 font-bold text-[#003366] hover:bg-[#003366] hover:text-white transition-all hover:scale-105"
                        >
                            Send a General Application <ArrowRight size={18} strokeWidth={2} />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
