"use client";

import React, { useState } from "react";
import { sdk, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { ID } from "appwrite";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    CheckCircle,
    Instagram,
    Youtube,
    Facebook
} from "lucide-react";
import MapBox from "@/components/public/MapBox";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            await sdk.databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.CONTACT,
                ID.unique(),
                {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message
                }
            );
            setStatus("success");
            setFormData({ fullName: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("Contact submission error:", error);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* PREMIUM HEADER */}
            <section className="relative h-[45vh] lg:h-[40vh] pb-10 flex items-end overflow-hidden bg-[#003366]">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-900/50 backdrop-blur-sm border border-blue-800/50 px-4 py-1.5 text-xs font-bold text-[#FFCC00] mb-6 uppercase tracking-widest">
                            Official Channels
                        </div>
                        <h1 className="text-3xl font-extrabold text-white md:text-6xl leading-[1.1] mb-2 uppercase tracking-tight">
                            Contact <span className="text-[#FFCC00]">Us</span>
                        </h1>
                        <p className="text-lg text-blue-100/70 leading-relaxed font-medium">
                            We would love to hear from you. Have a question or feedback? Drop us a message below.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 py-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* INFO COLUMN */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-[#003366]">Get in Touch</h2>
                            <p className="text-gray-500 leading-relaxed text-lg">
                                Visit our campus or reach out via our official communication channels.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-start group">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#003366] transition-all group-hover:bg-[#003366] group-hover:text-[#FFCC00]">
                                    <MapPin size={28} strokeWidth={1} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-[#003366] mb-1">Our Location</h4>
                                    <p className="text-md text-gray-500 leading-relaxed">
                                        Jl. Raya Condet No.5, Balekambang, Kramat jati, Jakarta Timur 13530
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-[#FFCC00] transition-all group-hover:bg-[#FFCC00] group-hover:text-white">
                                    <Phone size={28} strokeWidth={1} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-[#003366] mb-1">Call / WhatsApp</h4>
                                    <p className="text-md text-gray-500 leading-relaxed">
                                        +62 821 4000 0477
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-all group-hover:bg-[#003366] group-hover:text-white">
                                    <Mail size={28} strokeWidth={1} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-[#003366] mb-1">Official Email</h4>
                                    <p className="text-md text-gray-500 leading-relaxed">
                                        info@jacos.id
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h4 className="font-bold text-[#003366] mb-6">Follow Our Socials</h4>
                            <div className="flex space-x-6">
                                <a href="#" className="text-gray-400 hover:text-[#003366] transition-all"><Instagram size={28} strokeWidth={1} /></a>
                                <a href="#" className="text-gray-400 hover:text-[#003366] transition-all"><Youtube size={28} strokeWidth={1} /></a>
                                <a href="#" className="text-gray-400 hover:text-[#003366] transition-all"><Facebook size={28} strokeWidth={1} /></a>
                            </div>
                        </div>
                    </div>

                    {/* FORM COLUMN */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl border-1 border-gray-100">
                            {status === "success" ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <CheckCircle size={40} strokeWidth={1} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#003366] mb-4">Message Received!</h3>
                                    <p className="text-gray-500 mb-10">We have received your message and will get back to you soon.</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="font-bold text-[#003366] underline underline-offset-8"
                                    >
                                        Send New Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter your name"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full border-b-2 border-gray-100 bg-transparent py-4 text-lg font-medium text-[#003366] focus:border-[#40A1FB] focus:outline-none transition-all placeholder:text-gray-200"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full border-b-2 border-gray-100 bg-transparent py-4 text-lg font-medium text-[#003366] focus:border-[#40A1FB] focus:outline-none transition-all placeholder:text-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone (Optional)</label>
                                        <input
                                            type="tel"
                                            placeholder="+62..."
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full border-b-2 border-gray-100 bg-transparent py-4 text-lg font-medium text-[#003366] focus:border-[#40A1FB] focus:outline-none transition-all placeholder:text-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full border-b-2 border-gray-100 bg-transparent py-4 text-lg font-medium text-[#003366] focus:border-[#40A1FB] focus:outline-none transition-all placeholder:text-gray-200 resize-none"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="inline-flex items-center gap-3 rounded-full bg-[#003366] px-12 py-5 font-black text-white shadow-2xl transition-all hover:bg-[#FFCC00] hover:text-[#003366] disabled:opacity-50"
                                    >
                                        {status === "loading" ? "SENDING..." : "SEND MESSAGE"} <Send size={20} strokeWidth={1} />
                                    </button>
                                    {status === "error" && (
                                        <p className="text-sm font-bold text-red-500">Something went wrong. Please try again.</p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE MAP */}
            <section className="w-full h-[500px] md:h-[650px] lg:h-[750px] mt-24">
                <MapBox />
            </section>
        </div>
    );
}
