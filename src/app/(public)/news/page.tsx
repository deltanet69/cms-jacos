"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { sdk, DATABASE_ID, COLLECTIONS, storage, BUCKET_ID } from "@/lib/appwrite";

function getImageUrl(fileId: string | undefined): string | null {
    if (!fileId) return null;
    if (fileId.startsWith("http")) return fileId;
    try {
        return storage.getFileView(BUCKET_ID, fileId).toString();
    } catch {
        return null;
    }
}
import { ArrowRight, Calendar, User, Search, Filter } from "lucide-react";

export default function NewsPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await sdk.databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.POSTS,
                    []
                    // We can add logic to get only 'published' posts here if needed
                );
                setPosts(response.documents);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            {/* PREMIUM HEADER */}
            <section className="relative h-[45vh] pb-16 flex items-end overflow-hidden bg-[#003366]">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-900/50 backdrop-blur-sm border border-blue-800/50 px-4 py-1.5 text-xs font-bold text-[#FFCC00] mb-6 uppercase tracking-widest">
                                Updates & Insights
                            </div>
                            <h1 className="text-4xl font-extrabold text-white md:text-6xl leading-[1.1] mb-2 uppercase tracking-tight">
                                School <span className="text-[#FFCC00]">News</span>
                            </h1>
                            <p className="text-lg text-blue-100/70 leading-relaxed font-medium">
                                Stay updated with the latest happenings at JACOS Islamic School.
                            </p>
                        </div>

                        {/* Search Bar - Integrated into Header */}
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-[#FFCC00] transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-2xl border border-blue-800/50 bg-blue-900/30 backdrop-blur-md py-4 pl-12 pr-4 text-sm text-white placeholder:text-blue-300/50 focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* NEWS LISTING */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse space-y-4">
                                    <div className="aspect-video rounded-3xl bg-gray-200"></div>
                                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                                    <div className="h-8 w-full rounded bg-gray-200"></div>
                                    <div className="h-4 w-full rounded bg-gray-200"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredPosts.map((post) => (
                                <article key={post.$id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                                        {(() => {
                                            const imgUrl = getImageUrl(post.featuredImage);
                                            return imgUrl ? (
                                                <Image
                                                    src={imgUrl}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                                    No Image
                                                </div>
                                            );
                                        })()}
                                        <div className="absolute top-4 left-4 rounded-full bg-[#FFCC00] px-4 py-1.5 text-xs font-bold text-[#003366] shadow-lg">
                                            {post.category || "General"}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="mb-4 flex items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {format(new Date(post.publishedAt || post.$createdAt), "MMM d, yyyy")}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <User size={14} />
                                                Admin
                                            </span>
                                        </div>
                                        <h3 className="mb-4 text-xl font-bold text-[#003366] line-clamp-2 hover:text-[#FFCC00] transition-colors leading-relaxed">
                                            <Link href={`/news/${post.slug || post.$id}`}>{post.title}</Link>
                                        </h3>
                                        <p className="mb-8 text-sm text-gray-500 line-clamp-3 leading-loose">
                                            {post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '') + "..."}
                                        </p>
                                        <div className="mt-auto">
                                            <Link
                                                href={`/news/${post.slug || post.$id}`}
                                                className="inline-flex items-center gap-2 text-sm font-bold text-[#003366] hover:gap-3 transition-all"
                                            >
                                                Read Article <ArrowRight size={18} className="text-[#FFCC00]" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <h3 className="text-xl font-bold text-gray-400">No news articles found</h3>
                            <button onClick={() => setSearchTerm("")} className="mt-4 text-[#003366] font-bold underline">Clear Search</button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
