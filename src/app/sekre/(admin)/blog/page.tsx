"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, AlertTriangle, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { databases, storage, DATABASE_ID, BUCKET_ID, Query, COLLECTIONS } from "@/lib/appwrite";

const TABLE_POSTS = COLLECTIONS.POSTS;
const TABLE_CATEGORIES = COLLECTIONS.CATEGORIES;

interface Post {
    $id: string;
    title: string;
    categoryId: string;
    categoryName?: string;
    authorId?: string;
    authorName?: string;
    featuredImage?: string;
    $createdAt: string;
    status: string;
    views?: number;
}

export default function BlogListing() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

    // Filter & Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [sortBy, setSortBy] = useState("$createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await databases.listDocuments(DATABASE_ID, TABLE_CATEGORIES);
                setCategories(response.documents.map(d => ({ id: d.$id, name: d.name || d.$id })));
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const queries = [];

                // Sorting
                if (sortOrder === "desc") {
                    queries.push(Query.orderDesc(sortBy));
                } else {
                    queries.push(Query.orderAsc(sortBy));
                }

                // Filtering by category (use categoryName for matching)
                if (filterCategory) {
                    queries.push(Query.equal("categoryName", filterCategory));
                }

                // Search is handled client-side after fetch (Query.contains doesn't work on string attributes)

                // Pagination
                queries.push(Query.limit(limit));
                queries.push(Query.offset((page - 1) * limit));

                // PERFORMANCE CRITICAL: Only fetch fields needed for the list. 
                // Exclude 'content' which can be huge and caused the 10s lag.
                queries.push(Query.select([
                    "$id",
                    "title",
                    "categoryName",
                    "categoryId",
                    "status",
                    "views",
                    "featuredImage",
                    "$createdAt",
                    "authorName"
                ]));

                const response = await databases.listDocuments(
                    DATABASE_ID,
                    TABLE_POSTS,
                    queries
                );

                // Client-side title search filter
                let filteredDocs = response.documents;
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    filteredDocs = filteredDocs.filter((doc: any) =>
                        doc.title?.toLowerCase().includes(q)
                    );
                }

                setPosts(filteredDocs as unknown as Post[]);
                setTotal(searchQuery ? filteredDocs.length : response.total);
            } catch (err: any) {
                console.error("Failed to fetch posts:", err);
                setError(err.message || "Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPosts();
        }, searchQuery ? 500 : 0); // Debounce search

        return () => clearTimeout(timer);
    }, [searchQuery, filterCategory, sortBy, sortOrder, page]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await databases.deleteDocument(DATABASE_ID, TABLE_POSTS, id);
            setPosts(posts.filter(post => post.$id !== id));
        } catch (err: any) {
            alert("Failed to delete post: " + err.message);
        }
    };

    return (
        <>
            <Breadcrumb pageName="Blog / Articles" />

            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Posts
                        </h4>
                        <p className="text-sm text-body">Total: {total} articles</p>
                    </div>
                    <Link
                        href="/sekre/blog/add"
                        className="flex items-center gap-2 rounded-md bg-[#1F7BC9] px-4 py-2 font-medium text-white hover:bg-opacity-90 transition-all"
                    >
                        <Plus size={18} /> Add New
                    </Link>
                </div>

                {/* Filters & Controls */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search title..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body pointer-events-none">
                            <Filter size={18} />
                        </span>
                        <select
                            value={filterCategory}
                            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                            className="w-full appearance-none rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body pointer-events-none">
                            <ArrowUpDown size={18} />
                        </span>
                        <select
                            value={`${sortBy}:${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split(":");
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="w-full appearance-none rounded-md border border-stroke bg-gray-2 py-2.5 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                        >
                            <option value="$createdAt:desc">Date (Newest)</option>
                            <option value="$createdAt:asc">Date (Oldest)</option>
                            <option value="title:asc">Title (A-Z)</option>
                            <option value="views:desc">Most Viewed</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => p - 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 disabled:opacity-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-medium">Page {page}</span>
                        <button
                            disabled={page * limit >= total || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 disabled:opacity-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Thumb</h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Title</h5>
                        </div>
                        <div className="p-2.5  xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Category</h5>
                        </div>
                        <div className="p-2.5  xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
                        </div>
                        <div className="p-2.5  xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Views</h5>
                        </div>
                        <div className="hidden p-2.5  sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
                        </div>
                        <div className="hidden p-2.5  sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
                        </div>
                    </div>

                    {loading && (
                        <>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="grid grid-cols-3 sm:grid-cols-7 border-b border-stroke dark:border-strokedark animate-pulse">
                                    <div className="p-2.5 xl:p-5 flex justify-center"><div className="h-10 w-10 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="p-2.5 xl:p-5"><div className="h-4 w-3/4 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="p-2.5 xl:p-5 flex justify-center"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="p-2.5 xl:p-5 flex justify-center"><div className="h-4 w-1/2 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="p-2.5 xl:p-5 flex justify-center"><div className="h-4 w-8 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="hidden p-2.5 sm:flex justify-center xl:p-5"><div className="h-6 w-16 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                    <div className="hidden p-2.5 sm:flex justify-center xl:p-5"><div className="h-6 w-12 bg-gray-200 dark:bg-meta-4 rounded"></div></div>
                                </div>
                            ))}
                        </>
                    )}

                    {error && (
                        <div className="p-5 text-center text-danger font-medium flex flex-col items-center gap-2">
                            <AlertTriangle size={24} />
                            <p>{error}</p>
                            <p className="text-xs font-normal text-body mt-2">
                                Tip: Check if NEXT_PUBLIC_APPWRITE_TABLE_POSTS in .env.local is set to "post"
                            </p>
                        </div>
                    )}

                    {!loading && !error && posts.length === 0 && (
                        <div className="p-5 text-center text-body">
                            No posts found.
                        </div>
                    )}

                    {!loading && !error && posts.map((post, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-7 ${key === posts.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                                }`}
                            key={post.$id}
                        >
                            <div className="flex items-center justify-start p-2 xl:p-4" title={post.featuredImage ? `Image ID: ${post.featuredImage}` : "No featured image"}>
                                {(() => {
                                    const imgValue = post.featuredImage;
                                    if (!imgValue || imgValue.length < 5) {
                                        return (
                                            <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-2 dark:bg-meta-4 text-[10px] text-body text-center leading-tight p-1">
                                                No Image
                                            </div>
                                        );
                                    }

                                    // If it's already a full URL (legacy or external), use it directly
                                    if (imgValue.startsWith("http")) {
                                        return (
                                            <img
                                                src={imgValue}
                                                alt=""
                                                className="h-12 w-12 rounded object-cover shadow-sm transition-transform hover:scale-110"
                                                onError={(e) => {
                                                    (e.target as any).src = `https://placehold.co/100x100?text=Invalid_URL`;
                                                }}
                                            />
                                        );
                                    }

                                    // Otherwise assume it's an Appwrite File ID — use getFileView (more reliable than getFilePreview)
                                    try {
                                        const viewUrl = storage.getFileView(BUCKET_ID, imgValue).toString();
                                        return (
                                            <img
                                                src={viewUrl}
                                                alt=""
                                                className="h-12 w-12 rounded object-cover shadow-sm transition-transform hover:scale-110"
                                                onError={(e) => {
                                                    (e.target as any).src = `https://placehold.co/100x100?text=No+Image`;
                                                }}
                                            />
                                        );
                                    } catch (err) {
                                        return <div className="text-[10px] text-danger">ID Error</div>;
                                    }
                                })()}
                            </div>

                            <div className="flex items-center p-2.5 xl:p-5">
                                <Link
                                    href={`/sekre/blog/edit/${post.$id}`}
                                    className="text-black dark:text-white font-medium hover:text-primary transition-colors line-clamp-2 leading-tight"
                                    title={`Click to edit: ${post.title}`}
                                >
                                    {post.title}
                                </Link>
                            </div>

                            <div className="flex items-center  p-2.5 xl:p-5 text-center">
                                <p className="text-black dark:text-white text-sm">
                                    {post.categoryName || post.categoryId || "-"}
                                </p>
                            </div>

                            <div className="flex items-center  p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">
                                    {new Date(post.$createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center  p-2.5 xl:p-5">
                                <p className="text-meta-3">{post.views || 0}</p>
                            </div>

                            <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
                                <span className={`px-2 py-1 rounded text-xs capitalize ${post.status?.toLowerCase() === 'published'
                                    ? 'bg-green-100 text-green-600'
                                    : post.status?.toLowerCase() === 'scheduled'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {post.status || 'Draft'}
                                </span>
                            </div>

                            <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={`/blog/${post.$id}`} // Assuming public view path
                                        target="_blank"
                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                        title="View published article"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        href={`/sekre/blog/edit/${post.$id}`}
                                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                                        title="Edit article"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.$id)}
                                        className="text-danger hover:text-red-700 transition-colors"
                                        title="Delete article"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
