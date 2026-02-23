"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { format } from "date-fns";
import { databases, storage, DATABASE_ID, COLLECTIONS, BUCKET_ID, Query } from "@/lib/appwrite";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";

function getImageUrl(fileId: string | undefined): string | null {
    if (!fileId) return null;
    if (fileId.startsWith("http")) return fileId;
    try {
        return storage.getFileView(BUCKET_ID, fileId).toString();
    } catch {
        return null;
    }
}

function estimateReadTime(content: string): string {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}

export default function NewsDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                // Try to find post by slug first, then by $id
                let doc: any = null;
                try {
                    const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.POSTS, [
                        Query.equal("slug", slug),
                        Query.limit(1),
                    ]);
                    if (res.documents.length > 0) doc = res.documents[0];
                } catch {
                    // slug field might not exist, that's ok
                }

                if (!doc) {
                    // Fallback: fetch by document $id
                    doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.POSTS, slug);
                }

                setPost(doc);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="pt-32 pb-20 container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
                    <div className="h-12 w-3/4 bg-gray-200 rounded-2xl"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    <div className="aspect-video bg-gray-200 rounded-3xl"></div>
                    <div className="space-y-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center text-center px-4 pt-24">
                <h1 className="text-6xl font-black text-[#003366]">404</h1>
                <p className="mt-4 text-xl text-gray-500">Article not found.</p>
                <Link href="/news" className="mt-8 rounded-full bg-[#003366] px-8 py-3 font-bold text-white hover:bg-[#FFCC00] hover:text-[#003366] transition-all">
                    Back to News
                </Link>
            </div>
        );
    }

    const featuredImageUrl = getImageUrl(post.featuredImage);

    return (
        <div className="bg-white min-h-screen">
            {/* HERO / FEATURED IMAGE */}
            <section className="relative h-[55vh] md:h-[60vh] w-full overflow-hidden bg-[#003366]">
                {featuredImageUrl && (
                    <img
                        src={featuredImageUrl}
                        alt={post.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-30 md:opacity-40"
                    />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#003366] via-[#003366]/60 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,204,0,0.1),transparent_50%)]" />

                <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-20">
                    <div className="container mx-auto px-5 md:px-6 max-w-5xl">
                        {/* Back navigation inside hero */}
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-[#FFCC00] transition-colors mb-8 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to News
                        </Link>

                        <div className="flex flex-col gap-6">
                            <h1 className="text-3xl md:text-6xl font-black text-white leading-[1.1] max-w-4xl tracking-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 md:gap-8">
                                <span className="inline-block rounded-full bg-[#FFCC00] px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#003366] shadow-lg">
                                    {post.category || "General"}
                                </span>

                                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-bold text-blue-100/80">
                                    <span className="flex items-center gap-2">
                                        <Calendar size={16} className="text-[#FFCC00]" />
                                        {format(new Date(post.publishedAt || post.$createdAt), "MMM d, yyyy")}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <User size={16} className="text-[#FFCC00]" />
                                        {post.authorName || "JACOS Admin"}
                                    </span>
                                    {post.content && (
                                        <span className="flex items-center gap-2">
                                            <Clock size={16} className="text-[#FFCC00]" />
                                            {estimateReadTime(post.content)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-5 md:px-6 max-w-5xl py-16 md:py-24">

                {/* CONTENT */}
                <article
                    className="prose text-lg prose-sm md:prose-lg max-w-none break-words
                        prose-headings:text-[#003366] prose-headings:font-bold
                        prose-p:text-gray-600 prose-p:leading-relaxed
                        prose-a:text-[#003366] prose-a:underline
                        prose-img:rounded-3xl prose-img:shadow-xl
                        prose-blockquote:border-l-4 prose-blockquote:border-[#FFCC00] prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-2xl prose-blockquote:p-6
                        prose-strong:text-[#003366]"
                    dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || "<p>No content available.</p>" }}
                />

                {/* FOOTER */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Share this article</p>
                        <div className="flex gap-3">
                            {["Facebook", "Twitter", "WhatsApp"].map(platform => (
                                <button key={platform} className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-500 hover:border-[#003366] hover:text-[#003366] transition-all">
                                    {platform}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 rounded-full bg-[#003366] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#FFCC00] hover:text-[#003366]"
                    >
                        <ArrowLeft size={16} /> More Articles
                    </Link>
                </div>
            </div>
        </div>
    );
}
