"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    CheckCircle,
    Award,
    Target,
    ArrowRight,
    Users,
    Quote,
    ChevronDown,
    Plus,
    Minus,
    BookOpen,
    Globe,
    HandHeart,
    BrainCircuit
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { visionaries, missions, philosophy } from "./data";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        // Animations for cards and sections
        const revealItems = sectionRef.current.querySelectorAll(".reveal-item");
        revealItems.forEach((item) => {
            gsap.fromTo(item,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                    }
                }
            );
        });
    }, []);

    return (
        <div ref={sectionRef} className="bg-white">
            {/* ── HERO SECTION ── */}
            <section className="relative h-[45vh] lg:h-[40vh] pb-10 flex items-end justify-center overflow-hidden bg-[#003366]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/80 via-transparent to-[#003366]"></div>
                </div>

                <div className="container mx-auto px-5 lg:px-12 relative z-10 text-center">
                    <span className="inline-block rounded-full bg-[#FFCC00]/20 border border-[#FFCC00]/30 px-6 md:px-12 py-2 text-xs md:text-sm font-bold text-[#FFCC00] mb-6 animate-fade-in uppercase tracking-widest">
                        Our Profile
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        Jakarta Cosmopolite <span className="text-[#FFCC00]">Islamic School</span>
                    </h1>
                </div>
            </section>

            {/* ── MODERN ISLAMIC FUTURE LEADERS ── */}
            <section className="py-24 overflow-hidden">
                <div className="container mx-auto px-5 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="reveal-item">
                            <span className="text-sm font-medium uppercase tracking-widest text-[#FFCC00]">About Our School</span>
                            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-[#003366] leading-tight mb-8">
                                Jakarta Cosmopolite <br className="hidden md:block" /> Islamic School
                            </h2>
                            <div className="space-y-6 text-lg text-gray-500 leading-relaxed">
                                <p>
                                    Jakarta Cosmopolite Islamic School is an integrated Islamic school combining divine values with modern education to prepare global Muslim leaders.
                                </p>
                                <p>
                                    Our curriculum integrates religious education with STEAM subjects, equipping students with the skills necessary for future success while staying firmly rooted in their faith and noble character.
                                </p>
                            </div>
                            <div className="mt-10 grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366]">
                                        <Award size={24} strokeWidth={1} />
                                    </div>
                                    <span className="font-bold text-[#003366]">A+ Excellence</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                        <Users size={24} strokeWidth={1} />
                                    </div>
                                    <span className="font-bold text-[#003366]">Bilingual Environment</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative reveal-item">
                            <div className="aspect-[3/3] rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <Image
                                    src="/about/building.png"
                                    alt="JACOS Building"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-[#FFCC00] p-10 rounded-[2rem] shadow-xl text-[#003366] text-center hidden md:block">
                                <div className="text-5xl font-bold mb-1">100%</div>
                                <div className="text-xs font-bold uppercase tracking-widest">Islamic Foundation</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MEET OUR VISIONER ── */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-5 lg:px-12 text-center mb-20">
                    <span className="text-[#FFCC00] font-bold text-sm uppercase tracking-widest">Leadership Team</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mt-4">Meet Our Visioner</h2>
                </div>

                <div className="container mx-auto px-5 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                    {visionaries.map((v, i) => (
                        <div key={i} className="reveal-item bg-white p-10 rounded-xl  hover:shadow-xl transition-all duration-500 border-1 border-gray-200 flex flex-col items-left text-left group">
                            <div className="relative h-24 w-24 mb-6">
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFCC00] group-hover:rotate-180 transition-transform duration-1000"></div>
                                <div className="absolute inset-2 rounded-full overflow-hidden bg-gray-100">
                                    <Image src={v.image} alt={v.name} fill className="object-cover" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-[#FFCC00] p-2 rounded-full shadow-lg">
                                    <Quote size={12} className="text-[#003366]" fill="#003366" />
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-[#000000] mb-1">{v.name}</h4>
                            <p className="text-[#236DAF] text-sm font-bold uppercase tracking-widest mb-4">{v.role}</p>
                            <p className="text-[#303030] text-md leading-relaxed mb-6 flex-grow">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── VISION & MISSION ── */}
            <section className="py-24 relative overflow-hidden bg-[#003366]">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-[0.03] skew-x-12 translate-x-20"></div>

                <div className="container mx-auto px-5 lg:px-12 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 px-6 py-2 text-sm font-bold text-[#FFCC00] mb-8">
                            <Target size={18} strokeWidth={2} /> Our Vision
                        </div>
                        <h2 className="text-3xl md:text-3xl font-medium text-white italic leading-tight">
                            "To raise confident, compassionate, and globally aware Muslim children, firmly rooted in Islamic values and noble character."
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-20">
                        <div className="reveal-item">
                            <h3 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Our Mission</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                                {missions.map((m, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="text-[#FFCC00] font-bold text-3xl">0{i + 1}.</div>
                                        <h4 className="text-lg font-bold text-white">{m.title}</h4>
                                        <p className="text-blue-100 text-md leading-relaxed opacity-70">{m.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="reveal-item bg-white/5 backdrop-blur-md rounded-[3rem] p-12 border border-white/10">
                            <Quote className="text-[#FFCC00] opacity-30 mb-6" size={64} />
                            <p className="text-xl text-blue-100 leading-relaxed mb-10">
                                We believe that a child’s success goes far beyond academics. It is deeply rooted in their mental well-being and the support they receive at home.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden relative">
                                    <Image src="/visionary/psychology.jpg" alt="Mrs. Elly" fill className="object-cover" />
                                </div>
                                <div className="text-white">
                                    <p className="font-bold">Mrs. Elly</p>
                                    <p className="text-xs text-[#FFCC00] uppercase tracking-widest">Psychology & Parenting Advisor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── EDUCATIONAL PHILOSOPHY ── */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-5 lg:px-12">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="bg-[#003366] text-[#FFCC00] px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest">Our DNA</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mt-6">Our Educational Philosophy</h2>
                        <p className="mt-6 text-gray-500 text-lg">Integrating Islamic values with modern education and advanced technology.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {philosophy.map((p, i) => (
                            <div key={i} className="reveal-item group bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center">
                                <div className={`h-20 w-20 rounded-full mx-auto mb-8 flex items-center justify-center ${p.color} transition-transform group-hover:scale-110`}>
                                    {p.icon === "mosque" && <Award size={32} strokeWidth={1} />}
                                    {p.icon === "globe" && <Globe size={32} strokeWidth={1} />}
                                    {p.icon === "book" && <BookOpen size={32} strokeWidth={1} />}
                                    {p.icon === "heart" && <HandHeart size={32} strokeWidth={1} />}
                                </div>
                                <h4 className="text-xl font-bold text-[#003366] mb-4 group-hover:text-[#FFCC00] transition-colors">{p.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ── */}
            <section className="py-28 relative overflow-hidden bg-gray-50">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFCC00]/30 to-transparent"></div>

                <div className="container mx-auto px-5 lg:px-12">
                    <div className="flex flex-col lg:flex-row gap-20">
                        <div className="lg:w-1/2 reveal-item">
                            <span className="text-[#003366] font-bold text-sm uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-lg">Why JACOS?</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mt-6 mb-8 leading-tight">
                                Providing a Continuous Path <span className="text-[#FFCC00]">of Excellence</span>
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed mb-10">
                                Jakarta Cosmopolite Islamic School integrates Islamic values with modern education and advanced technology to nurture intelligent, creative, and globally competitive learners.
                            </p>
                            <Link
                                href="/admission"
                                className="inline-flex items-center gap-3 rounded-full bg-[#003366] px-10 py-5 font-bold text-white shadow-2xl hover:bg-[#FFCC00] hover:text-[#003366] transition group"
                            >
                                Start Your Journey <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="lg:w-1/2 space-y-4">
                            {[
                                { q: "Bilingual instruction starting early", a: "We provide English, Arabic, and Indonesian-based instruction from the very start in a nurturing environment." },
                                { q: "Halal and Loving School Culture", a: "Our school culture is built on safety, halal principles, and a loving, joyful atmosphere for child growth." },
                                { q: "STEAM Integrated Learning", a: "Developing critical thinking and creativity through Integrated Technology, Engineering, Art, and Math within an Islamic framework." },
                                { q: "Strong Focus on Akhlāq", a: "Daily practices focus on building emotional well-being, social skills, and noble characters rooted in Sunnah." }
                            ].map((item, i) => (
                                <FaqItem key={i} question={item.q} answer={item.a} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="reveal-item bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-8 text-left"
            >
                <span className="font-bold text-[#003366] text-lg pr-4">{question}</span>
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#FFCC00] text-[#003366] rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                    <ChevronDown size={20} strokeWidth={3} />
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-8 px-8' : 'max-h-0 opacity-0'}`}>
                <div className="h-[2px] w-12 bg-gray-100 mb-6"></div>
                <p className="text-gray-500 leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}
