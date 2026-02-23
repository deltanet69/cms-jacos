"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Our Programs", href: "/programs" },
    { label: "News", href: "/news" },
    { label: "Career", href: "/career" },
    { label: "Admission", href: "/admission" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(true);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            {/* ── PROMOTIONAL BANNER ── */}
            {bannerVisible && (
                <div
                    className="hidden md:block text-white text-center py-2.5 px-6 text-sm font-semibold relative"
                    style={{ background: "linear-gradient(to right, #f7ba2c, #ea5459)" }}
                >
                    <span className="mr-2"></span>
                    Online Admission 2026–2027 is now open!{" "}
                    <Link href="/admission" className="underline text-white font-bold hover:opacity-80 transition ml-1">
                        Register Now →
                    </Link>
                    <button
                        onClick={() => setBannerVisible(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition"
                        aria-label="Close"
                    >
                        <X size={16} strokeWidth={1} />
                    </button>
                </div>
            )}

            {/* ── MAIN NAVBAR ── */}
            <header
                className={`w-full transition-all duration-500 ${scrolled
                    ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100 py-5"
                    : "bg-transparent py-10"
                    }`}
            >
                {/* Main nav row */}
                <nav className="container mx-auto flex items-center justify-between px-5 lg:px-12">
                    {/* Logo swapping */}
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <Image
                            src={scrolled ? "/logo.png" : "/logoputih.png"}
                            alt="JACOS"
                            width={170}
                            height={40}
                            className="h-14 w-auto object-contain transition-all duration-300"
                            priority
                        />
                    </Link>

                    {/* Desktop links */}
                    <ul className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`relative px-4 py-2 text-lg  transition-colors duration-300 group ${scrolled ? "text-gray-700 hover:text-[#003366]" : "text-white/90 hover:text-white"
                                        }`}
                                >
                                    {link.label}
                                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 transition-all duration-300 group-hover:w-3/4 rounded-full ${scrolled ? "bg-[#003366]" : "bg-white"
                                        }`} />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop CTAs */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="/enquiry"
                            className={`rounded-full border px-5 py-2.5 text-md font-semibold transition-all duration-300 ${scrolled
                                ? "border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
                                : "border-white/30 text-white hover:bg-white hover:text-[#003366]"
                                }`}
                        >
                            Enquiry
                        </Link>
                        <Link
                            href="/admission"
                            className={`rounded-full px-5 py-2.5 text-md font-semibold transition-all duration-300 shadow-lg ${scrolled
                                ? "bg-[#003366] text-white hover:bg-[#FFCC00] hover:text-[#003366]"
                                : "bg-[#FFCC00] text-[#003366] hover:bg-white"
                                }`}
                        >
                            Admission →
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className={`lg:hidden p-2 transition-colors ${scrolled ? "text-[#003366]" : "text-white"}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={26} strokeWidth={1} /> : <Menu size={26} strokeWidth={1} />}
                    </button>
                </nav>

                {/* Mobile menu */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className={`flex flex-col px-6 pb-8 pt-4 gap-1 ${scrolled
                        ? "bg-transparent border-t border-gray-100"
                        : "bg-white border-t border-gray-100 shadow-xl mx-4 my-2 rounded-2xl"
                        }`}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-3 px-4 rounded-xl text-lg text-gray-700 hover:bg-[#003366]/5 hover:text-[#003366] transition"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-4 flex flex-col gap-3 px-4">
                            <Link href="/enquiry" onClick={() => setMobileOpen(false)} className="rounded-full border border-[#003366] py-3 text-center text-md font-semibold text-[#003366]">
                                Enquiry
                            </Link>
                            <Link href="/admission" onClick={() => setMobileOpen(false)} className="rounded-full bg-[#003366] py-3 text-center text-md font-semibold text-white">
                                Admission →
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
