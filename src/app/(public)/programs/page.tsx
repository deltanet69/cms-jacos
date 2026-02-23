"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import {
    Baby,
    Smile,
    Book,
    ChevronRight,
    Star,
    Zap,
    Heart,
    ArrowRight,
    MapPin,
    Calendar,
    ChevronDown,
    Globe
} from "lucide-react";
import { gsap } from "gsap";

const ProgramCard = ({
    title,
    age,
    desc,
    icon: Icon,
    color,
    features
}: {
    title: string;
    age: string;
    desc: string;
    icon: any;
    color: string;
    features: string[]
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    const onMouseEnter = () => {
        if (!bgRef.current || !cardRef.current) return;
        gsap.to(bgRef.current, { backgroundColor: "#003366", duration: 0.4, ease: "power2.out" });

        const textContent = cardRef.current.querySelectorAll(".text-content");
        const titleContent = cardRef.current.querySelector(".title-content");
        const featureIcons = cardRef.current.querySelectorAll(".feature-icon");
        const featureTexts = cardRef.current.querySelectorAll(".feature-text");
        const ageBadge = cardRef.current.querySelector(".age-badge");

        if (textContent.length) gsap.to(textContent, { color: "#ffffff", duration: 0.4 });
        if (titleContent) gsap.to(titleContent, { color: "#ffffff", duration: 0.4 });
        if (featureIcons.length) gsap.to(featureIcons, { color: "#FFCC00", duration: 0.4 });
        if (featureTexts.length) gsap.to(featureTexts, { color: "#ffffff", duration: 0.4 });
        if (ageBadge) gsap.to(ageBadge, { color: "#FFCC00", duration: 0.4 });
    };

    const onMouseLeave = () => {
        if (!bgRef.current || !cardRef.current) return;
        gsap.to(bgRef.current, { backgroundColor: "#ffffff", duration: 0.4, ease: "power2.in" });

        const textContent = cardRef.current.querySelectorAll(".text-content");
        const titleContent = cardRef.current.querySelector(".title-content");
        const featureIcons = cardRef.current.querySelectorAll(".feature-icon");
        const featureTexts = cardRef.current.querySelectorAll(".feature-text");
        const ageBadge = cardRef.current.querySelector(".age-badge");

        if (textContent.length) gsap.to(textContent, { color: "#4b5563", duration: 0.4 });
        if (titleContent) gsap.to(titleContent, { color: "#003366", duration: 0.4 });
        if (featureIcons.length) gsap.to(featureIcons, { color: "#FFCC00", duration: 0.4 });
        if (featureTexts.length) gsap.to(featureTexts, { color: "#374151", duration: 0.4 });
        if (ageBadge) gsap.to(ageBadge, { color: "#FFCC00", duration: 0.4 });
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="group relative overflow-hidden rounded-xl border border-gray-100 p-10 transition-all duration-500 cursor-default"
        >
            <div ref={bgRef} className="absolute inset-0 bg-white z-0 transition-colors"></div>

            <div className="relative z-10">
                <div className={`mb-8 inline-flex items-center justify-center rounded-xl ${color} p-5 text-white shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={36} strokeWidth={1} />
                </div>

                <div className="mb-4">
                    <span className="age-badge text-xs font-bold uppercase tracking-[0.2em] text-[#FFCC00]">{age}</span>
                    <h3 className="title-content text-3xl font-bold text-[#003366] mt-2 group-hover:text-white transition-colors">{title}</h3>
                </div>

                <p className="text-content mb-10 text-md leading-relaxed text-gray-500 group-hover:text-blue-100/80 transition-colors">
                    {desc}
                </p>

                <ul className="space-y-4">
                    {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm font-semibold">
                            <ChevronRight size={18} strokeWidth={2} className="feature-icon text-[#FFCC00] shrink-0" />
                            <span className="feature-text text-gray-700 group-hover:text-white transition-colors">{f}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// ── CAMPUS GALLERY ──
// Uses the PrebuiltUI "Hover Expand" pattern.
// For 10+ images, images are grouped into rows of 5.
// Only 1 row is shown initially; additional rows expand via GSAP animation.
const GALLERY_IMAGES = [
    // Row 1 — Always visible
    { src: "/campus/classroom.png", label: "Modern Classrooms" },
    { src: "/campus/outdoor.png", label: "Outdoor Play Area" },
    { src: "/campus/library.png", label: "School Library" },
    { src: "/campus/sports.png", label: "Sports & Physical Ed." },
    { src: "/campus/building.png", label: "Our Campus" },
    // Row 2 — Revealed after clicking "View More"
    { src: "/campus/campus1.png", label: "Campus Grounds" },
    { src: "/campus/classroom.png", label: "Science Lab" },
    { src: "/campus/outdoor.png", label: "Garden Area" },
    { src: "/campus/library.png", label: "Digital Library" },
    { src: "/campus/sports.png", label: "Football Field" },
    // Row 3 — For even more expansion
    { src: "/campus/building.png", label: "Auditorium" },
    { src: "/campus/campus1.png", label: "Cafeteria" },
    { src: "/campus/classroom.png", label: "Art Room" },
    { src: "/campus/outdoor.png", label: "Quran Room" },
    { src: "/campus/library.png", label: "Parent Waiting Area" },
];

const IMAGES_PER_ROW = 7;

const GalleryRow = ({ images }: { images: typeof GALLERY_IMAGES }) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const onHover = (hoveredIndex: number) => {
        if (!rowRef.current) return;
        const items = rowRef.current.querySelectorAll(".gallery-item");
        items.forEach((el, i) => {
            gsap.to(el, {
                flex: i === hoveredIndex ? 3 : 0.5,
                duration: 1,
                ease: "power3.out",
            });
        });
    };

    const onLeave = () => {
        if (!rowRef.current) return;
        const items = rowRef.current.querySelectorAll(".gallery-item");
        items.forEach((el) => {
            gsap.to(el, { flex: 1, duration: 0.5, ease: "power3.out" });
        });
    };

    return (
        <div ref={rowRef} className="flex flex-col md:flex-row gap-2 h-auto md:h-110" onMouseLeave={onLeave}>
            {images.map((img, i) => (
                <div
                    key={i}
                    className="gallery-item relative flex-1 h-64 md:h-auto overflow-hidden rounded-2xl cursor-pointer group"
                    onMouseEnter={() => onHover(i)}
                >
                    <img
                        src={img.src}
                        alt={img.label}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-0 w-full px-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="text-white text-xl  tracking-wide drop-shadow-lg">{img.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CampusGallery = () => {
    const [visibleRows, setVisibleRows] = React.useState(1);
    const extraRef = useRef<HTMLDivElement>(null);
    const totalRows = Math.ceil(GALLERY_IMAGES.length / IMAGES_PER_ROW);

    const loadMore = () => {
        const next = Math.min(visibleRows + 1, totalRows);
        setVisibleRows(next);
        // Animate the new row in
        setTimeout(() => {
            if (extraRef.current) {
                const rows = extraRef.current.querySelectorAll(".gallery-row");
                const target = rows[next - 2]; // newly revealed row
                if (target) {
                    gsap.from(target, { opacity: 0, y: 30, duration: 0.6, ease: "power3.out" });
                }
            }
        }, 50);
    };

    const showLess = () => setVisibleRows(1);

    const rows = Array.from({ length: totalRows }, (_, i) =>
        GALLERY_IMAGES.slice(i * IMAGES_PER_ROW, (i + 1) * IMAGES_PER_ROW)
    );

    return (
        <section className="py-24 bg-gray-50/30">
            <div className="container mx-auto px-5 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-[#FFCC00] font-bold text-sm uppercase tracking-widest">A Glimpse Inside</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mt-4">Our Campus Life</h2>
                    <p className="text-gray-500 mt-4 text-lg max-w-3xl mx-auto">
                        Experience the vibrant, joyful atmosphere of JACOS — where learning comes alive every day.
                    </p>
                </div>

                {/* Gallery Rows */}
                <div ref={extraRef} className="flex flex-col gap-3">
                    {rows.slice(0, visibleRows).map((rowImages, rowIndex) => (
                        <div key={rowIndex} className="gallery-row">
                            <GalleryRow images={rowImages} />
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center mt-10 gap-4">
                    {visibleRows < totalRows && (
                        <button
                            onClick={loadMore}
                            className="flex items-center gap-2 rounded-full border-2 border-[#003366] px-10 py-3.5 text-sm font-bold text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-300 hover:scale-105"
                        >
                            View More Photos
                            <ChevronDown size={18} strokeWidth={2} />
                        </button>
                    )}
                    {visibleRows > 1 && (
                        <button
                            onClick={showLess}
                            className="text-sm font-bold text-gray-400 hover:text-[#003366] transition-colors underline underline-offset-4"
                        >
                            Show Less
                        </button>
                    )}
                    <div className="text-sm text-gray-400 font-medium">
                        Showing {Math.min(visibleRows * IMAGES_PER_ROW, GALLERY_IMAGES.length)} of {GALLERY_IMAGES.length} photos
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function ProgramsPage() {
    const programs = [
        {
            title: "Preschool",
            age: "Ages 2 - 4 Years",
            desc: "Focusing on play-based learning and early character development through Islamic values in a nurturing environment.",
            icon: Baby,
            color: "bg-blue-500",
            features: [
                "Bilingual Environment",
                "Sensory & Creative Play",
                "Basic Islamic Manners",
                "Social Skills Development"
            ]
        },
        {
            title: "Kindergarten",
            age: "Ages 4 - 6 Years",
            desc: "Preparing young minds for formal education with a balance of structured learning and creative expression.",
            icon: Smile,
            color: "bg-[#FFCC00]",
            features: [
                "Early Literacy & Numeracy",
                "Quranic Recitation (Iqro)",
                "Thematic Learning",
                "Physical Development"
            ]
        },
        {
            title: "Primary School",
            age: "Ages 6 - 12 Years",
            desc: "Our primary program emphasizes critical thinking, academic excellence, and deep-rooted Islamic identity.",
            icon: Book,
            color: "bg-[#003366]",
            features: [
                "International Curriculum",
                "Advanced Science & Math",
                "Tahfidz Programs",
                "Critical Thinking Labs"
            ]
        }
    ];

    return (
        <div className="bg-white">
            {/* ── PAGE HEADER ── */}
            <section className="relative h-[45vh] lg:h-[40vh] pb-10 flex items-end justify-center overflow-hidden bg-[#003366]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FFCC0010,transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/80 via-transparent to-[#003366]"></div>
                </div>

                <div className="container mx-auto px-5 lg:px-12 relative z-10 text-center">
                    <span className="inline-block rounded-full bg-[#FFCC00]/20 border border-[#FFCC00]/30 px-6 md:px-12 py-2 text-xs md:text-sm font-bold text-[#FFCC00] mb-6 animate-fade-in uppercase tracking-widest">
                        Excellence in Education
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1]">
                        Our Educational <span className="text-[#FFCC00]">Programs</span>
                    </h1>
                </div>
            </section>

            {/* ── PROGRAMS GRID ── */}
            <section className="py-32 bg-gray-50/30">
                <div className="container mx-auto px-5 lg:px-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        {programs.map((p, idx) => (
                            <ProgramCard key={idx} {...p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── METHODOLOGY ── */}
            <section className="py-32 bg-[#f9f9f9]">
                <div className="container mx-auto px-5 lg:px-12">
                    <div className="text-center mb-24">
                        <span className="text-[#FFCC00] font-bold text-sm uppercase tracking-widest">Our Foundation</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mt-4">Innovative Methodology</h2>
                        <p className="text-gray-500 mt-6 text-lg max-w-2xl mx-auto">The core pillars of our educational approach designed for the modern Islamic generation.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="text-center group">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-blue-50 text-[#003366] mb-8 transition-transform group-hover:scale-110 group-hover:-rotate-6">
                                <Zap size={44} strokeWidth={1} />
                            </div>
                            <h4 className="text-2xl font-bold text-[#003366] mb-4">Technology Integrated</h4>
                            <p className="text-md text-gray-500 leading-relaxed">
                                We utilize modern digital tools to enhance learning experiences and prepare students for a digital-first world.
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-yellow-50 text-[#FFCC00] mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <Star size={44} strokeWidth={1} />
                            </div>
                            <h4 className="text-2xl font-bold text-[#003366] mb-4">Holistic Excellence</h4>
                            <p className="text-md text-gray-500 leading-relaxed">
                                Beyond grades, we focus on emotional intelligence, leadership, and physical well-being.
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-pink-50 text-pink-500 mb-8 transition-transform group-hover:scale-110 group-hover:-rotate-6">
                                <Heart size={44} strokeWidth={1} />
                            </div>
                            <h4 className="text-2xl font-bold text-[#003366] mb-4">Values Centric</h4>
                            <p className="text-md text-gray-500 leading-relaxed">
                                Strong Islamic character is at the heart of everything we do, guided by Quranic wisdom.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CAMPUS GALLERY ── */}
            <CampusGallery />

            {/* ── CALL TO ACTION — CAMPUS TOUR ── */}
            <section className="container mx-auto px-4 md:px-6 pb-32">
                <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-4xl bg-[#003366] p-10 md:p-16 lg:p-24 shadow-2xl">
                    {/* Background visual elements */}
                    <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-[#FFCC00]/10 to-transparent"></div>
                    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#FFCC00]/5 blur-[100px]"></div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 border-[40px] border-white/5 rounded-full blur-xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-xs font-bold text-[#FFCC00] mb-8 border border-white/10">
                                <MapPin size={16} strokeWidth={2} /> Visit JACOS
                            </div>
                            <h2 className="text-3xl md:text-6xl font-bold text-white leading-tight mb-8">
                                Experience Our <br /> <span className="text-[#FFCC00]">Campus Life</span>
                            </h2>
                            <p className="text-blue-100 text-lg max-w-xl mx-auto lg:mx-0 mb-12 leading-loose opacity-80">
                                Schedule a personalized tour to see our bilingual classrooms, meet our educators, and feel the joyful learning atmosphere.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                                <Link
                                    href="/contact"
                                    className="w-full sm:w-auto group flex items-center justify-center gap-3 rounded-full bg-[#FFCC00] px-10 py-5 font-bold text-lg text-[#003366] shadow-xl hover:bg-white transition-all hover:scale-105 active:scale-95"
                                >
                                    Enquiry Now! <Calendar size={20} strokeWidth={3} className="transition-transform group-hover:rotate-12" />
                                </Link>
                                <div className="flex items-center gap-4 text-white/60">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-[#003366] bg-gray-200 overflow-hidden shrink-0">
                                                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs md:text-sm font-bold tracking-wide">500+ Parents Joined</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/3 w-full">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/10">
                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="h-14 w-14 shrink-0 rounded-2xl bg-[#FFCC00] flex items-center justify-center text-[#003366] shadow-lg">
                                            <Smile size={32} strokeWidth={1} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-1">Joyful Learning</h4>
                                            <p className="text-blue-100/60 text-sm">A safe and happy environment for children to grow.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFCC00] border border-white/10 shadow-lg">
                                            <Globe size={32} strokeWidth={1} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-1">Global Mindset</h4>
                                            <p className="text-blue-100/60 text-sm">International standards with solid Islamic roots.</p>
                                        </div>
                                    </div>
                                    <div className="h-[1px] w-full bg-white/10"></div>
                                    <div className="pt-2">
                                        <p className="text-[#FFCC00] font-bold text-2xl mb-1">Free Admission Kit</p>
                                        <p className="text-blue-100/40 text-xs uppercase tracking-[0.2em] font-bold">Limited for first 10 visitors</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
