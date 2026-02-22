"use client";

import React, { useState } from "react";
import { sdk, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { ID } from "appwrite";
import {
    Send,
    CheckCircle,
    Info,
    ArrowRight,
    User,
    Mail,
    Phone,
    GraduationCap,
    MapPin,
    MessageSquare
} from "lucide-react";

export default function EnquiryPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        parentName: "",
        studentName: "",
        email: "",
        phone: "",
        levelGrade: "Preschool",
        location: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            await sdk.databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.ENQUIRIES,
                ID.unique(),
                {
                    ...formData,
                    status: "Pending",
                    createdAt: new Date().toISOString()
                }
            );
            setStatus("success");
            setFormData({
                parentName: "",
                studentName: "",
                email: "",
                phone: "",
                levelGrade: "Preschool",
                location: "",
                message: ""
            });
        } catch (error) {
            console.error("Enquiry submission error:", error);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-24 pb-20">
                <div className="max-w-md w-full rounded-[3rem] bg-white p-12 text-center shadow-2xl border border-green-50">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 animate-bounce">
                        <CheckCircle size={48} strokeWidth={1} />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-[#003366]">Enquiry Sent!</h2>
                    <p className="text-gray-500 leading-relaxed">
                        Thank you for your interest in JACOS. Our admission team will contact you shortly via email or phone.
                    </p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#003366] px-8 py-3.5 font-bold text-white transition-all hover:bg-[#FFCC00] hover:text-[#003366]"
                    >
                        Send Another Enquiry <ArrowRight size={20} strokeWidth={1} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Side: Information */}
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-amber-600">
                            <Info size={16} strokeWidth={1} /> Admission Open for 2026/2027
                        </div>
                        <h1 className="text-4xl font-extrabold text-[#003366] md:text-6xl leading-[1.1]">
                            Register Your Child's <br /> <span className="text-[#FFCC00]">Bright Future</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                            Tell us a bit about your child, and our educational consultants will guide you through the best program choices and enrollment process.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: GraduationCap, title: "Premium Education", desc: "International standard curriculum" },
                                { icon: MapPin, title: "Modern Campus", desc: "Innovative learning facilities" },
                                { icon: MessageSquare, title: "Quick Response", desc: "Within 24 working hours" },
                                { icon: User, title: "Expert Guidance", desc: "Personalized admission help" }
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-[#FFCC00]">
                                        <item.icon size={20} strokeWidth={1} />
                                    </div>
                                    <h4 className="font-bold text-[#003366]">{item.title}</h4>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="rounded-[3rem] bg-white p-8 md:p-12 shadow-2xl border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#003366]/50 ml-1">Parent Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={1} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.parentName}
                                            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium text-[#003366] focus:border-[#FFCC00] focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#003366]/50 ml-1">Student Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={1} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Jane Doe"
                                            value={formData.studentName}
                                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium text-[#003366] focus:border-[#FFCC00] focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#003366]/50 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={1} />
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium text-[#003366] focus:border-[#FFCC00] focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#003366]/50 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={1} />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+62 821..."
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium text-[#003366] focus:border-[#FFCC00] focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#003366]/50 ml-1">Level Grade</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={1} />
                                        <select
                                            value={formData.levelGrade}
                                            onChange={(e) => setFormData({ ...formData, levelGrade: e.target.value })}
                                            className="w-full appearance-none rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium text-[#003366] focus:border-[#FFCC00] focus:outline-none transition-all"
                                        >
                                            <option>Preschool</option>
                                            <option>Kindergarten</option>
                                            <option>Primary School</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#003366]/50 ml-1">Location Preference</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={1} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Jakarta Selatan"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium text-[#003366] focus:border-[#FFCC00] focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#003366]/50 ml-1">Additional Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us more about your enquiry..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm font-medium text-[#003366] focus:border-[#FFCC00] focus:outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full rounded-full bg-[#003366] py-5 font-bold text-white shadow-xl transition-all hover:bg-[#FFCC00] hover:text-[#003366] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {status === "loading" ? "Sending..." : "Send Admission Enquiry"} <Send size={20} strokeWidth={1} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>

                            {status === "error" && (
                                <p className="text-sm font-bold text-red-500 text-center">Failed to send enquiry. Please try again.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
