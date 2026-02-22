"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { databases, DATABASE_ID, COLLECTIONS, storage, BUCKET_ID, Query } from "@/lib/appwrite";
import {
    BookOpen, Users, Award, Globe, Star, ArrowRight, Play,
    CheckCircle, Sparkles, ChevronRight, Heart, Brain, Sprout, Laugh, Home
} from "lucide-react";
import { format } from "date-fns";

gsap.registerPlugin(ScrollTrigger);

// ─── HERO SLIDES ─────────────────────────────────────────────────────────────
const heroSlides = [
    {
        badge: "🌟 Rabbani Education",
        headline1: "Nurturing Faith,",
        headline2: "Building Characters.",
        desc: "An integrated Islamic school that combines divine values with modern education to prepare global Muslim leaders.",
        img: "/hero/hero1.jpg",
        accent: "#FFCC00",
    },
    {
        badge: "🏆 Award-Winning School",
        headline1: "Excellence in",
        headline2: "Islamic Education.",
        desc: "Trilingual, STEAM-integrated curriculum rooted in Qur'an & Hadith — preparing students for the 21st century.",
        img: "/hero/hero2.jpg",
        accent: "#4FC3F7",
    },
    {
        badge: "🌍 Global Perspective",
        headline1: "Inspiring",
        headline2: "Joyful Learning.",
        desc: "Play-based learning, character education, and family enrichment program — all under one inspiring school.",
        img: "/hero/hero3.jpg",
        accent: "#FFCC00",
    },
];

function getImageUrl(fileId: string | undefined): string | null {
    if (!fileId) return null;
    if (fileId.startsWith("http")) return fileId;
    try { return storage.getFileView(BUCKET_ID, fileId).toString(); } catch { return null; }
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % heroSlides.length);
                setAnimating(false);
            }, 400);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const slide = heroSlides[current];

    return (
        <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#003366]">
            {/* Background transition layers */}
            {heroSlides.map((s, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0 invisible"}`}
                >
                    <Image
                        src={s.img}
                        alt="Background"
                        fill
                        className="object-cover scale-105"
                        priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#001830]/90 via-[#001830]/60 to-transparent" />
                </div>
            ))}

            <div className="container mx-auto px-5 lg:px-12 relative z-10 pt-45  pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT — Animated slide text */}
                    <div className={`order-2 lg:order-1 transition-all duration-500 ${animating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}>
                        <span
                            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6 shadow-xl backdrop-blur-md"
                            style={{ backgroundColor: `${slide.accent}33`, color: slide.accent, borderColor: `${slide.accent}55` }}
                        >
                            {slide.badge}
                        </span>

                        <h1 className="text-5xl lg:text-7xl font-semibold text-white leading-[1.1] mb-6 tracking-tight">
                            {slide.headline1} <br />
                            <span style={{ color: slide.accent }} className="font-bold">{slide.headline2}</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-white/80 max-w-xl mb-10 leading-relaxed font-medium">
                            {slide.desc}
                        </p>

                        <div className="flex flex-wrap gap-5">
                            <Link
                                href="/admission"
                                className="px-8 py-4 rounded-full font-bold text-[#001830] transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
                                style={{ backgroundColor: slide.accent }}
                            >
                                Get Started <ArrowRight size={20} strokeWidth={1} />
                            </Link>
                            <Link
                                href="/about"
                                className="px-8 py-4 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all flex items-center gap-2"
                            >
                                Learn More <ChevronRight size={20} strokeWidth={1} />
                            </Link>
                        </div>

                        {/* Slide dots */}
                        <div className="mt-12 flex items-center gap-3">
                            {heroSlides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setAnimating(true);
                                        setTimeout(() => {
                                            setCurrent(i);
                                            setAnimating(false);
                                        }, 300);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-500 ${i === current ? "w-8" : "w-2 bg-white/30"}`}
                                    style={{ backgroundColor: i === current ? slide.accent : undefined }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — Admission Card / Image */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div className="relative group max-w-md w-full">
                            <div className="absolute -inset-4 bg-white/5 rounded-[40px] blur-2xl group-hover:bg-white/10 transition-all duration-700" />

                            <div className="relative bg-white rounded-[32px] overflow-hidden shadow-2xl p-8 border border-white/20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFCC00]/10 rounded-bl-full pointer-events-none" />

                                <div className="flex justify-between items-start mb-8 relative">
                                    <div>
                                        <div className="flex items-center gap-2 text-[#FFCC00] mb-2">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                                        <Users size={14} className="text-gray-400" strokeWidth={1} />
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold ml-1">500+ Students</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#003366]">Admission Open</h3>
                                        <p className="text-gray-500 text-sm font-medium">Session 2026 – 2027</p>
                                    </div>
                                    <div className="bg-[#003366] text-white p-3 rounded-2xl shadow-lg ring-4 ring-[#003366]/10">
                                        <BookOpen size={24} strokeWidth={1} />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {[
                                        { label: "Accredited A", icon: <CheckCircle size={18} strokeWidth={1} />, color: "text-green-600", bg: "bg-green-50" },
                                        { label: "Trilingual Program", icon: <Globe size={18} strokeWidth={1} />, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Islamic Character", icon: <Heart size={18} strokeWidth={1} />, color: "text-rose-600", bg: "bg-rose-50" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition bg-gray-50/50">
                                            <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                                                {item.icon}
                                            </div>
                                            <span className="font-bold text-gray-700">{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/admission"
                                    className="block w-full text-center bg-[#003366] text-white py-4 rounded-xl font-bold hover:bg-[#001830] transition shadow-xl"
                                >
                                    Register Now
                                </Link>

                                <p className="text-[10px] text-center text-gray-400 mt-5 font-bold uppercase tracking-[0.15em]">
                                    ★ Jakarta Cosmopolite Islamic School ★
                                </p>
                            </div>

                            {/* Floating decorative element */}
                            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:flex items-center gap-3 animate-bounce">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                    <ArrowRight size={20} strokeWidth={1} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Success Rate</div>
                                    <div className="text-lg font-bold text-[#003366]">98.5% Pass</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent" />
                <span className="text-[10px] text-white uppercase tracking-[0.2em] font-medium">Scroll</span>
            </div>
        </section>
    );
}

// ─── STATS BAR ─────────────────────────────────────────────────────────────
const stats = [
    { icon: BookOpen, value: "5+", label: "Programs Offered" },
    { icon: Users, value: "500+", label: "Students Enrolled" },
    { icon: Award, value: "Accredited A", label: "National Standard" },
    { icon: Globe, value: "3 Languages", label: "Arabic, English, Indonesian" },
];

function StatsBar() {
    return (
        <section className="bg-[#001830] py-0 relative z-10">
            <div className="container mx-auto py-8 px-12 lg:px-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="flex flex-col md:flex-row items-center gap-4 py-8 px-6 text-white hover:bg-white/5 transition"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFCC00]/10">
                                <stat.icon size={24} className="text-[#FFCC00]" strokeWidth={1} />
                            </div>
                            <div className="text-center md:text-left">
                                <div className="text-2xl font-medium mb-1">{stat.value}</div>
                                <div className="text-md text-blue-200/50  uppercase tracking-wider">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}



// ─── ABOUT SECTION ─────────────────────────────────────────────────────────
function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        gsap.fromTo(imageRef.current, { x: -80, opacity: 0 }, {
            x: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        });
        gsap.fromTo(".about-text-item", { x: 60, opacity: 0 }, {
            x: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%" }
        });
    }, []);

    return (
        <section ref={sectionRef} id="about" className="py-28 bg-white">
            <div className="container mx-auto px-5 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* LEFT — Image with floating elements */}
                    <div ref={imageRef} className="relative">
                        <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] bg-gradient-to-br from-[#003366] to-[#0066cc] shadow-2xl">
                            <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[20rem] font-black select-none">J</div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-12">
                                <div className="text-8xl mb-6">🕌</div>
                                <h3 className="text-3xl font-black mb-4">JACOS</h3>
                                <p className="text-blue-200 text-sm leading-relaxed">Jakarta Cosmopolite Islamic School</p>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <div className="absolute -right-4 top-12 animate-bounce">
                            <div className="bg-[#FFCC00] rounded-2xl px-5 py-3 shadow-xl flex items-center gap-2">
                                <Star size={16} strokeWidth={1} className="text-[#003366]" fill="#003366" />
                                <span className="font-black text-[#003366] text-sm">Accredited A</span>
                            </div>
                        </div>
                        <div className="absolute -left-4 bottom-20 animate-pulse">
                            <div className="bg-white rounded-2xl px-5 py-4 shadow-xl border border-gray-100">
                                <div className="text-2xl font-black text-[#003366]">500+</div>
                                <div className="text-xs text-gray-400 font-semibold">Happy Students</div>
                            </div>
                        </div>
                        <div className="absolute bottom-12 right-8">
                            <div className="bg-[#003366] rounded-full h-16 w-16 flex items-center justify-center text-2xl shadow-xl animate-spin-slow">
                                🌟
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Content */}
                    <div className="space-y-6">
                        <div className="about-text-item">
                            <span className="text-sm font-medium uppercase tracking-widest text-[#003366]/50">Welcome to</span>
                            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[#003366] leading-tight">
                                Jakarta Cosmopolite<br />Islamic School
                            </h2>
                        </div>

                        <p className="about-text-item text-gray-500 text-lg leading-relaxed">
                            Jakarta Cosmopolite Islamic School (JACOS) is an integrated Islamic kindergarten that combines Islamic values, holistic child development, and a global learning perspective. We provide a supportive and inclusive environment where children develop academically, socially, emotionally, and spiritually.
                        </p>

                        <div className="about-text-item rounded-2xl bg-[#003366]/5 border-l-4 border-[#FFCC00] p-6">
                            <p className="text-[#003366] font-bold text-lg italic">
                                "Nurturing Faith • Building Character • Inspiring Joyful Learning"
                            </p>
                        </div>

                        <p className="about-text-item text-lg text-gray-500 leading-relaxed">
                            Here, we develop a generation that is intelligent, creative, and ready to compete on the global stage. Find out more about our programs, facilities, and how we support student development to reach their full potential.
                        </p>

                        {/* Icon features */}
                        <div className="about-text-item grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { icon: BookOpen, label: "Integrated Curriculum", color: "text-amber-600 bg-amber-50" },
                                { icon: Heart, label: "Islamic Character Building", color: "text-rose-600 bg-rose-50" },
                                { icon: Globe, label: "Achievements & Global", color: "text-blue-600 bg-blue-50" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition text-center">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.color}`}>
                                        <item.icon size={22} strokeWidth={1} />
                                    </div>
                                    <span className="text-md font-medium text-[#003366]">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="about-text-item">
                            <Link href="/about" className="inline-flex items-center gap-2 rounded-full bg-[#003366] px-8 py-4 font-medium text-white hover:bg-[#FFCC00] hover:text-[#003366] transition shadow-xl">
                                Learn More About Us <ArrowRight size={18} strokeWidth={1} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── PROGRAMS SECTION ──────────────────────────────────────────────────────
const programs = [
    { icon: Heart, emoji: "🕌", title: "Islamic Integrated Curriculum", sub: "Based on Qur'an & Hadist", color: "bg-amber-50 text-amber-600", border: "hover:border-amber-400" },
    { icon: Globe, emoji: "🌍", title: "Trilingual Mastery", sub: "Arabic, English, Indonesian", color: "bg-blue-50 text-blue-600", border: "hover:border-blue-400" },
    { icon: Laugh, emoji: "🎮", title: "Character Education", sub: "Play-Based Learning", color: "bg-green-50 text-green-600", border: "hover:border-green-400" },
    { icon: Brain, emoji: "💡", title: "Social-Emotional Intelligence", sub: "Holistic Development", color: "bg-purple-50 text-purple-600", border: "hover:border-purple-400" },
    { icon: Home, emoji: "👨‍👩‍👧", title: "Family Program Enrichment", sub: "Parent Involvement", color: "bg-rose-50 text-rose-600", border: "hover:border-rose-400" },
];

function ProgramsSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const cards = sectionRef.current.querySelectorAll(".program-card");
        gsap.fromTo(cards,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} id="programs" className="py-28 bg-gray-50">
            <div className="container mx-auto px-5 lg:px-12">
                {/* Header */}
                <div className="max-w-5xl mx-auto text-center mb-16">
                    <span className="text-sm font-black uppercase tracking-widest text-[#FFCC00] bg-[#003366] px-4 py-1.5 rounded-full">Our Programs</span>
                    <h2 className="mt-6 text-4xl md:text-5xl font-black text-[#003366] leading-tight">
                        Programs for Outstanding Generations
                    </h2>
                    <p className="mt-5 text-gray-500 text-lg leading-relaxed">
                        We offer a variety of educational programs designed to meet the needs of students in the modern era.
                    </p>
                </div>

                {/* Sub-programs row */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {[
                        { emoji: "🌱", label: "Pre-School", sub: "Ages 2–4" },
                        { emoji: "⭐", label: "Kindergarten", sub: "Ages 4–6" },
                        { emoji: "📚", label: "Primary School", sub: "Ages 6–12" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 border border-gray-100 hover:border-[#003366] hover:shadow-xl transition group cursor-pointer">
                            <span className="text-2xl group-hover:scale-125 transition">{item.emoji}</span>
                            <div>
                                <div className="font-semibold text-[#003366] text-lg">{item.label}</div>
                                <div className="text-md text-gray-400">{item.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {programs.map((prog, i) => (
                        <div
                            key={i}
                            className={`program-card bg-white rounded-lg p-8 border-2 border-transparent ${prog.border} hover:shadow-xl transition-all duration-300 group cursor-pointer`}
                        >
                            <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${prog.color}`}>
                                {prog.emoji}
                            </div>
                            <h3 className="font-semibold text-[#003366] text-lg leading-tight mb-2">{prog.title}</h3>
                            <p className="text-md text-gray-400 font-medium">{prog.sub}</p>
                            <div className={`mt-6 h-1 w-8 rounded-full ${prog.color.replace("text-", "bg-").split(" ")[0].replace("50", "400")} group-hover:w-full transition-all duration-500`}></div>
                        </div>
                    ))}
                </div>

                {/* Desc below */}
                <div className="mt-16 bg-white rounded-lg p-10 md:p-14 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-3xl font-bold  text-[#003366] mb-4">Our curriculum integrates faith & innovation.</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Our curriculum integrates religious education with STEAM subjects, equipping students with the skills necessary for future success. We also provide extracurricular activities that support the development of students' interests and talents — including arts, sports, and technology.
                            </p>
                            <Link href="/programs" className="mt-8 inline-flex items-center gap-2 font-bold text-[#003366] hover:text-[#40A1FB] transition group">
                                Explore All Programs <ArrowRight size={18} strokeWidth={1} className="group-hover:translate-x-1 transition" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {["Integrated Curriculum", "Play-Based Learning", "Character Building", "Global Excellence"].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 rounded-2xl bg-gray-50 p-5 hover:bg-[#003366]/5 transition">
                                    <CheckCircle size={24} className="text-[#FFCC00] shrink-0 mt-0.5" />
                                    <span className="text-md font-medium text-[#003366]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── VIDEO SECTION ─────────────────────────────────────────────────────────
function VideoSection() {
    const [playing, setPlaying] = useState(false);

    return (
        <section className="py-28 bg-[#003366] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#FFCC00] blur-3xl -ml-48 -mt-48" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-400 blur-3xl -mr-48 -mb-48" />
            </div>

            <div className="container mx-auto px-5 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* LEFT — Text */}
                    <div className="text-white">
                        <span className="text-sm font-medium uppercase tracking-widest text-[#FFCC00]">🎬 JACOS Video</span>
                        <h2 className="mt-4 text-2xl md:text-4xl font-bold leading-tight">
                            Giving Birth to a Globally Competitive{" "}
                            <span className="text-[#FFCC00]">Islamic Generation</span>
                        </h2>
                        <p className="mt-6 text-blue-200 text-lg leading-relaxed">
                            Take a closer look at how Jakarta Cosmopolitan Islamic School shapes the modern Islamic generation with the best educational approach.
                        </p>
                        <a
                            href="https://youtube.com/@jacos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#FFCC00] px-8 py-4 font-medium text-[#003366] hover:bg-white transition shadow-xl"
                        >
                            <Play size={20} fill="#003366" /> Visit Our Channel
                        </a>
                    </div>

                    {/* RIGHT — Video embed */}
                    <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl bg-black/50 border border-white/10">
                        {!playing ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <div className="text-8xl mb-6 drop-shadow">🎥</div>
                                <button
                                    onClick={() => setPlaying(true)}
                                    className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFCC00] shadow-2xl hover:scale-110 transition group"
                                >
                                    <Play size={32} fill="#003366" className="text-[#003366] ml-1" />
                                </button>
                                <p className="mt-4 text-sm text-blue-200 font-semibold">Watch Our School Story</p>
                                {/* Decorative rings */}
                                <div className="absolute h-24 w-24 rounded-full border-2 border-[#FFCC00]/30 animate-ping" />
                                <div className="absolute h-32 w-32 rounded-full border border-[#FFCC00]/20 animate-ping delay-500" />
                            </div>
                        ) : (
                            <iframe
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                className="absolute inset-0 h-full w-full"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── NEWS SECTION ──────────────────────────────────────────────────────────
function NewsSection() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.POSTS, [
                    Query.orderDesc("views"),
                    Query.limit(3),
                ]);
                setPosts(res.documents);
            } catch {
                // silently fail — show empty state
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    function slugify(text: string) {
        return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    }

    return (
        <section className="py-28 bg-gray-50">
            <div className="container mx-auto px-5 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <span className="text-sm  uppercase tracking-widest text-[#FFCC00] bg-[#003366] px-4 py-1.5 rounded-full">News Update</span>
                        <h2 className="mt-5 text-4xl md:text-5xl font-bold text-[#003366]">Latest from JACOS</h2>
                    </div>
                    <Link href="/news" className="inline-flex items-center gap-2 font-medium text-[#003366] hover:text-[#40A1FB] transition group whitespace-nowrap">
                        View All News <ArrowRight size={18} strokeWidth={1} className="group-hover:translate-x-1 transition" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading
                        ? [...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse rounded-lg bg-white p-6 space-y-4 shadow-sm">
                                <div className="aspect-video rounded-lg bg-gray-200" />
                                <div className="h-4 w-1/3 bg-gray-200 rounded" />
                                <div className="h-6 w-full bg-gray-200 rounded" />
                                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                            </div>
                        ))
                        : posts.map((post) => {
                            const imgUrl = getImageUrl(post.featuredImage);
                            return (
                                <Link
                                    key={post.$id}
                                    href={`/news/${slugify(post.title) || post.$id}`}
                                    className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:border-[#303030] transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative aspect-video overflow-hidden bg-[#003366]/10">
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={post.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition duration-500" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-5xl">📰</div>
                                        )}
                                        <div className="absolute top-4 left-4 rounded-full bg-[#FFCC00] px-3 py-1 text-xs font-bold text-[#003366]">
                                            {post.category || "News"}
                                        </div>
                                    </div>
                                    <div className="p-7 flex flex-col flex-grow">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                            {format(new Date(post.publishedAt || post.$createdAt), "MMM d, yyyy")}
                                        </p>
                                        <h3 className="text-lg font-bold text-[#303030] line-clamp-2 leading-tight group-hover:text-[#000000] transition mb-3">{post.title}</h3>
                                        <p className="text-md text-gray-400 line-clamp-2 leading-relaxed flex-grow">{post.excerpt || ""}</p>
                                        <div className="mt-6 flex items-center gap-2 font-bold text-sm text-[#003366] hover:text-[#40A1FB] group-hover:gap-3 transition-all">
                                            Read Article <ArrowRight size={16} strokeWidth={1} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    }
                    {!loading && posts.length === 0 && (
                        <div className="col-span-3 text-center py-16 text-gray-400">
                            <p className="text-4xl mb-4">📰</p>
                            <p>No news articles yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// ─── CTA SECTION ──────────────────────────────────────────────────────────
function CTASection() {
    return (
        <section className="py-24 bg-gradient-to-br from-[#003366] via-[#004488] to-[#0066cc] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#FFCC00] blur-3xl -mr-48 -mt-48" />
            </div>
            <div className="container mx-auto px-5 lg:px-12 text-center relative z-10">
                <span className="inline-block rounded-full bg-[#FFCC00]/20 border border-[#FFCC00]/30 px-6 py-2 text-sm font-bold text-[#FFCC00] mb-6">
                    Registration Information / Pre-Registration
                </span>
                <h2 className="text-2xl md:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight">
                    JACOS Online Admission{" "}<br></br>
                    <span className="text-[#FFCC00]">2026–2027</span>
                </h2>
                <p className="mt-6 text-blue-200 text-xl max-w-4xl mx-auto leading-relaxed">
                    We are opening opportunities for parents who want to register their children early and become part of the Jakarta Cosmopolitan Islamic School family.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link
                        href="/admission"
                        className="flex items-center gap-2 rounded-full bg-[#FFCC00] px-14 py-5 font-medium text-[#003366] shadow-2xl hover:bg-white transition text-lg"
                    >
                        Admission <ArrowRight size={22} strokeWidth={1} />
                    </Link>
                    <Link
                        href="/contact"
                        className="flex items-center gap-2 rounded-full border-2 border-white/30 px-14 py-5 font-medium text-white hover:bg-white hover:text-[#003366] transition text-lg"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <StatsBar />
            <ProgramsSection />
            <AboutSection />
            <VideoSection />
            <NewsSection />
            <CTASection />
        </main>
    );
}
