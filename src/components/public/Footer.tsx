import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight, Instagram, Youtube, Facebook } from "lucide-react";

const footerLinks = [
    {
        title: "Quick Links",
        links: [
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Our Programs", href: "/programs" },
            { label: "Admission", href: "/admission" },
            { label: "Career", href: "/career" },
        ],
    },
    {
        title: "Programs",
        links: [
            { label: "Pre-School", href: "/programs" },
            { label: "Kindergarten", href: "/programs" },
            { label: "Primary School", href: "/programs" },
            { label: "STEAM Lab", href: "/programs" },
            { label: "Family Program", href: "/programs" },
        ],
    },
    {
        title: "Contact",
        links: [
            { label: "Enquiry", href: "/enquiry" },
            { label: "Contact Us", href: "/contact" },
            { label: "News & Articles", href: "/news" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden text-white">
            {/* Background image with dark overlay */}
            <div className="absolute inset-0">
                <Image
                    src="/footerbg.jpg"
                    alt="Footer background"
                    fill
                    className="object-cover object-center"
                    quality={60}
                />
                <div className="absolute inset-0 bg-[#001830]/90" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Top wave */}
                <div className="-mt-1">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
                        <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#001830" fillOpacity="0.9" />
                    </svg>
                </div>

                <div className="container mx-auto px-5 lg:px-12 pt-8 pb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-15">
                        {/* Brand */}
                        <div className="lg:col-span-4 space-y-8">
                            <Link href="/">
                                <Image src="/logoputih.png" alt="JACOS" width={160} height={50} className="h-14 w-auto object-contain" />
                            </Link>
                            <p className="text-blue-200 text-md mt-3 leading-relaxed max-w-sm">
                                Jakarta Cosmopolite Islamic School is an integrated Islamic school combining divine values, modern education, and a global perspective.
                            </p>
                            <div className="space-y-3 mt-3 text-md">
                                <div className="flex items-start gap-3 text-blue-200">
                                    <MapPin size={20} strokeWidth={1} className="text-[#FFCC00] shrink-0 mt-0.5" />
                                    <span>East Jakarta, Indonesia</span>
                                </div>
                                <div className="flex items-center gap-3 text-blue-200">
                                    <Phone size={20} strokeWidth={1} className="text-[#FFCC00] shrink-0" />
                                    <a href="tel:+622112345678" className="hover:text-[#FFCC00] transition">+62 21 123 4567</a>
                                </div>
                                <div className="flex items-center gap-3 text-blue-200">
                                    <Mail size={20} strokeWidth={1} className="text-[#FFCC00] shrink-0" />
                                    <a href="mailto:info@jacos.id" className="hover:text-[#FFCC00] transition">info@jacos.id</a>
                                </div>
                            </div>

                            {/* Social */}
                            <div className="flex gap-3 pt-2">
                                {[
                                    { icon: Instagram, href: "#", label: "Instagram" },
                                    { icon: Youtube, href: "#", label: "YouTube" },
                                    { icon: Facebook, href: "#", label: "Facebook" },
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-[#FFCC00] hover:text-[#003366] transition text-white"
                                    >
                                        <social.icon size={18} strokeWidth={1} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        {footerLinks.map((group) => (
                            <div key={group.title} className="lg:col-span-2">
                                <h4 className="font-bold text-white text-xl mduppercase tracking-widest mb-6">{group.title}</h4>
                                <ul className="space-y-3">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-md text-blue-200 hover:text-[#FFCC00] transition flex items-center gap-1.5 group"
                                            >
                                                <ArrowRight size={12} strokeWidth={1} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Admission CTA */}
                        <div className="lg:col-span-2">
                            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-6">Admission</h4>
                            <div className="rounded-2xl bg-[#FFCC00]/10 border border-[#FFCC00]/30 p-6 space-y-4">
                                <div className="text-[#FFCC00] font-black text-lg">2026–2027</div>
                                <p className="text-blue-200 text-xs leading-relaxed">
                                    Registration is now open. Secure your child's future at JACOS.
                                </p>
                                <Link
                                    href="/admission"
                                    className="flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-4 py-3 text-sm font-bold text-[#003366] hover:bg-white transition w-full"
                                >
                                    Register Now →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10">
                    <div className="container mx-auto px-5 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-md text-blue-300">
                        <p>© {new Date().getFullYear()} Jakarta Cosmopolite Islamic School. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-[#FFCC00] transition">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-[#FFCC00] transition">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
