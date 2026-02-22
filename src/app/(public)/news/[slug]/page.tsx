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
        <div className="pt-24 pb-20">
            {/* HERO / FEATURED IMAGE */}
            {featuredImageUrl && (
                <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden bg-gray-900">
                    <img
                        src={featuredImageUrl}
                        alt={post.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-5xl mx-auto">
                        <span className="mb-4 inline-block rounded-full bg-[#FFCC00] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#003366]">
                            {post.category || "General"}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-3xl">
                            {post.title}
                        </h1>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* BACK LINK */}
                <div className="py-8">
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#003366] hover:gap-3 transition-all"
                    >
                        <ArrowLeft size={18} className="text-[#FFCC00]" /> Back to News
                    </Link>
                </div>

                {/* IF no featured image, show title here */}
                {!featuredImageUrl && (
                    <div className="mb-8">
                        <span className="mb-4 inline-block rounded-full bg-[#FFCC00] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#003366]">
                            {post.category || "General"}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-[#003366] leading-tight mt-4">
                            {post.title}
                        </h1>
                    </div>
                )}

                {/* META */}
                <div className="flex flex-wrap items-center gap-6 border-y border-gray-100 py-6 mb-12 text-sm font-semibold text-gray-400">
                    <span className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#FFCC00]" />
                        {format(new Date(post.publishedAt || post.$createdAt), "MMMM d, yyyy")}
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

                {/* CONTENT */}
                <article
                    className="prose prose-lg max-w-none
                        prose-headings:text-[#003366] prose-headings:font-bold
                        prose-p:text-gray-600 prose-p:leading-relaxed
                        prose-a:text-[#003366] prose-a:underline
                        prose-img:rounded-3xl prose-img:shadow-xl
                        prose-blockquote:border-l-4 prose-blockquote:border-[#FFCC00] prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-2xl prose-blockquote:p-6
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
