"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
    CheckCircle,
    ClipboardCheck,
    FileText,
    Users,
    CreditCard,
    ArrowRight,
    HelpCircle,
    Phone,
    Mail,
    Calendar
} from "lucide-react";

// ── Stepper ──────────────────────────────────────────────────────────────────
const steps = [
    {
        number: "01",
        icon: HelpCircle,
        title: "Enquiry",
        desc: "Fill out our online enquiry form or visit our campus to learn about our curriculum, facilities, and admission requirements.",
    },
    {
        number: "02",
        icon: FileText,
        title: "Registration",
        desc: "Complete the official registration form and submit all required documents for our admissions team to review.",
    },
    {
        number: "03",
        icon: Users,
        title: "Observation & Interview",
        desc: "Students undergo a friendly observation while parents meet with our educational counsellors to discuss the programme.",
    },
    {
        number: "04",
        icon: CreditCard,
        title: "Enrollment",
        desc: "Upon acceptance, complete the enrollment process by fulfilling tuition requirements to secure your child's seat.",
    },
    {
        number: "05",
        icon: ClipboardCheck,
        title: "Orientation",
        desc: "Welcome to JACOS! Students attend orientation to meet teachers and classmates before the academic year begins.",
    },
];

const requirements = [
    "Completed Registration Form",
    "Copy of Student's Birth Certificate",
    "Copy of Parent's Identity Card (KTP/Passport)",
    "Passport-sized Photographs (Digital & Physical)",
    "Previous School Records (for Primary School applicants)",
    "Health & Immunization Records",
];

export default function AdmissionPage() {
    return (
        <div className="bg-white">

            {/* ── HERO ──────────────────────────────────────────────────────────── */}
            <section className="relative h-[45vh] pb-20 flex items-end justify-center overflow-hidden bg-[#003366]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FFCC0015,transparent_60%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/60 via-transparent to-[#003366]" />
                </div>
                <div className="container mx-auto px-5 lg:px-12 relative z-10 text-center">
                    <span className="inline-block rounded-full bg-[#FFCC00]/20 border border-[#FFCC00]/30 px-10 py-2 text-sm font-bold text-[#FFCC00] mb-6">
                        Start Your Journey
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white">
                        Join the <span className="text-[#FFCC00]">JACOS Family</span>
                    </h1>
                </div>
            </section>

            {/* ── HOW TO APPLY ─────────────────────────────────────────────────── */}
            <section className="py-32">
                <div className="container mx-auto px-5 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-24 items-start">

                        {/* Left — sticky label */}
                        <div className="lg:sticky lg:top-32">
                            <span className="text-[#FFCC00] font-bold text-sm uppercase tracking-widest">Simple Process</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mt-4 leading-tight">
                                How to <br /> Apply
                            </h2>
                            <p className="text-gray-500 mt-6 text-lg leading-relaxed">
                                Our admissions process is designed to be smooth and transparent. Follow these five steps to begin.
                            </p>
                            <Link
                                href="/enquiry"
                                className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#FFCC00] px-8 py-4 font-bold text-[#003366] shadow-xl hover:bg-[#003366] hover:text-white transition-all hover:scale-105"
                            >
                                Begin Enquiry <ArrowRight size={18} strokeWidth={2} />
                            </Link>
                        </div>

                        {/* Right — steps */}
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-7 top-0 bottom-0 w-px bg-gray-100 hidden md:block" />

                            <div className="space-y-12">
                                {steps.map(({ number, icon: Icon, title, desc }, i) => (
                                    <div key={i} className="flex gap-8 items-start group">
                                        {/* Number badge */}
                                        <div className="relative flex-none">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFCC00] text-[#003366] font-black text-lg shadow-lg group-hover:bg-[#003366] group-hover:text-[#FFCC00] transition-all duration-300">
                                                {number}
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 pt-2 pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Icon size={20} strokeWidth={1.5} className="text-[#FFCC00]" />
                                                <h4 className="text-xl font-bold text-[#003366]">{title}</h4>
                                            </div>
                                            <p className="text-gray-500 leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── REQUIREMENTS ─────────────────────────────────────────────────── */}
            <section className="bg-[#f9f9f9] py-32">
                <div className="container mx-auto px-5 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                        {/* Left */}
                        <div>
                            <span className="text-[#FFCC00] font-bold text-sm uppercase tracking-widest">What You Need</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mt-4 mb-10 leading-tight">
                                Document <br /> Requirements
                            </h2>
                            <ul className="space-y-5">
                                {requirements.map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003366]/10">
                                            <CheckCircle className="text-[#003366]" size={16} strokeWidth={2} />
                                        </div>
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-12">
                                <Link
                                    href="/enquiry"
                                    className="inline-flex items-center gap-3 rounded-full bg-[#003366] px-8 py-4 font-bold text-white shadow-xl hover:bg-[#FFCC00] hover:text-[#003366] transition-all hover:scale-105"
                                >
                                    Start Enquiry Now <ArrowRight size={18} strokeWidth={2} />
                                </Link>
                            </div>
                        </div>

                        {/* Right — visual card */}
                        <div className="relative">
                            <div className="bg-[#003366] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFCC00]/10 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-[#FFCC00]/20 border border-[#FFCC00]/30 px-5 py-2 text-[#FFCC00] text-sm font-bold mb-8">
                                        <Calendar size={16} /> Intake 2025 – 2026
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Now Open</h3>
                                    <p className="text-blue-100/80 leading-relaxed mb-10">
                                        Applications for the upcoming academic year are open. Secure your child's future at JACOS today.
                                    </p>
                                    <div className="space-y-4 border-t border-white/10 pt-8">
                                        <div className="flex items-center gap-4 text-sm">
                                            <Phone size={18} strokeWidth={1.5} className="text-[#FFCC00]" />
                                            <span className="text-blue-100">+62 21 XXXX XXXX</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <Mail size={18} strokeWidth={1.5} className="text-[#FFCC00]" />
                                            <span className="text-blue-100">admission@jacos.id</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── FAQ / CONTACT CTA ────────────────────────────────────────────── */}
            <section className="py-32">
                <div className="container mx-auto px-5 lg:px-12 text-center">
                    <span className="text-[#FFCC00] font-bold text-sm uppercase tracking-widest">Need Help?</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mt-4 mb-6">Have More Questions?</h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto mb-12">
                        Our friendly admissions team is ready to guide you through every step of the process.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="rounded-full bg-[#003366] px-10 py-4 font-bold text-white shadow-xl hover:bg-[#FFCC00] hover:text-[#003366] transition-all hover:scale-105"
                        >
                            Speak to Admissions Team
                        </Link>
                        <Link
                            href="/enquiry"
                            className="rounded-full border-2 border-[#003366] px-10 py-4 font-bold text-[#003366] hover:bg-[#003366] hover:text-white transition-all"
                        >
                            Submit an Enquiry
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
