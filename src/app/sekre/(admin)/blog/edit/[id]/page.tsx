"use client";

import React, { useState, useEffect, useMemo } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { useRouter, useParams } from "next/navigation";
import { databases, storage, account, DATABASE_ID, BUCKET_ID, ID } from "@/lib/appwrite";
import { Loader2, Upload, AlertCircle, Save, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Select from "react-select";
import "react-quill-new/dist/quill.snow.css";
import Link from "next/link";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div className="h-40 w-full animate-pulse bg-gray-200 dark:bg-meta-4 rounded"></div>,
});

const TABLE_POSTS = process.env.NEXT_PUBLIC_APPWRITE_TABLE_POSTS || "post";
const TABLE_CATEGORIES = process.env.NEXT_PUBLIC_APPWRITE_TABLE_CATEGORIES || "categories";

export default function EditBlog() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState<any>(null);

    // Form States
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
    const [existingImageId, setExistingImageId] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Metadata States
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [status, setStatus] = useState("Published");
    const [publishDate, setPublishDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");

    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const session = await account.get();
                setUser(session);
            } catch (err) {
                console.error("User not logged in", err);
            }
        };

        const fetchData = async () => {
            try {
                // 1. Fetch Categories
                const catResponse = await databases.listDocuments(DATABASE_ID, TABLE_CATEGORIES);
                const options = catResponse.documents.map(doc => ({
                    value: doc.name || doc.$id,
                    label: doc.name || doc.$id
                }));
                setCategoryOptions(options);

                // 2. Fetch Post Data
                const post = await databases.getDocument(DATABASE_ID, TABLE_POSTS, id as string);
                setTitle(post.title || "");
                setExcerpt(post.excerpt || "");
                setContent(post.content || "");
                setExistingImageId(post.featuredImage || "");
                setStatus(post.status || "Published");

                if (post.featuredImage) {
                    // Use getFileView for reliable image loading
                    setPreviewImage(storage.getFileView(BUCKET_ID, post.featuredImage).toString());
                }

                if (post.categoryName) {
                    setSelectedCategories([{ value: post.categoryId || post.categoryName, label: post.categoryName }]);
                }

                if (post.publishedAt) {
                    const dateObj = new Date(post.publishedAt);
                    setPublishDate(dateObj.toISOString().split('T')[0]);
                    setScheduleTime(dateObj.toTimeString().substring(0, 5));
                }
            } catch (err: any) {
                console.error("Failed to fetch data", err);
                setError("Failed to load article: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
        fetchData();
    }, [id]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                const uniqueId = ID.unique();
                const customFileId = `post_editor_${uniqueId}`;
                const response = await storage.createFile(BUCKET_ID, customFileId, file);
                const fileUrl = storage.getFileView(BUCKET_ID, response.$id).toString();

                const quillEditor = document.querySelector("#blog-editor .ql-editor") as any;
                const quill = quillEditor?.__quill;

                if (quill) {
                    const range = quill.getSelection();
                    quill.insertEmbed(range?.index || 0, "image", fileUrl);
                    quill.setSelection((range?.index || 0) + 1);
                }
            } catch (err: any) {
                alert("Upload failed: " + err.message);
            }
        };
    };

    const quillModules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "code-block"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), [title]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            let imageId = existingImageId;

            if (featuredImageFile) {
                const uniqueId = ID.unique();
                const uploadResponse = await storage.createFile(BUCKET_ID, `post_feat_${uniqueId}`, featuredImageFile);
                imageId = uploadResponse.$id;
            }

            const postData: Record<string, any> = {
                title,
                slug: generateSlug(title),
                excerpt: excerpt || title.substring(0, 100),
                content,
                featuredImage: imageId,
                categoryId: selectedCategories.length > 0 ? selectedCategories[0].value : "",
                categoryName: selectedCategories.length > 0 ? selectedCategories[0].label : "",
                status,
            };

            await databases.updateDocument(DATABASE_ID, TABLE_POSTS, id as string, postData);
            router.push("/sekre/blog");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to update post.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Edit Article" />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/sekre/blog" className="flex items-center gap-2 text-body hover:text-black dark:hover:text-white">
                    <ArrowLeft size={18} /> Back to List
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-9 md:grid-cols-12">
                <div className="md:col-span-8 flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter article title"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Excerpt</label>
                                <textarea
                                    rows={3}
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder="Brief summary..."
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <label className="mb-2.5 block text-black dark:text-white">Full Content</label>
                                <div id="blog-editor" className="bg-white dark:bg-form-input">
                                    <ReactQuill
                                        theme="snow"
                                        value={content}
                                        onChange={setContent}
                                        modules={quillModules}
                                        className="min-h-[400px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="p-6.5">
                            <label className="mb-2.5 block text-black dark:text-white">Featured Image</label>
                            <div className="relative mb-4 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <Upload size={20} className="text-primary" />
                                    <p className="text-xs text-center">Change image</p>
                                </div>
                            </div>
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="w-full rounded border border-stroke dark:border-strokedark" />
                            )}
                        </div>
                    </div>

                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Category</label>
                                <Select
                                    isMulti
                                    options={categoryOptions}
                                    value={selectedCategories}
                                    onChange={(val: any) => setSelectedCategories(val)}
                                    className="react-select-container text-black"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none dark:border-form-strokedark dark:bg-form-input"
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Scheduled">Scheduled</option>
                                </select>
                            </div>

                            {status === "Scheduled" && (
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Publish Date & Time</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            value={publishDate}
                                            onChange={(e) => setPublishDate(e.target.value)}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                        />
                                        <input
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => setScheduleTime(e.target.value)}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 flex items-center gap-2 rounded bg-danger/10 p-3 text-danger">
                                    <AlertCircle size={18} />
                                    <p className="text-xs font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex w-full justify-center rounded bg-[#1F7BC9] p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {saving ? "Updating..." : "Update Post"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <style jsx global>{`
                .react-select__control { background: transparent !important; border-color: #dee2e6 !important; }
                .dark .react-select__control { background: #1d2a39 !important; border-color: #3d4d60 !important; }
                .dark .react-select__menu { background: #24303f !important; }
                .ql-container { min-height: 250px; font-size: 18px; }
                .ql-editor { font-size: 18px; line-height: 1.6; }
                .dark .ql-toolbar, .dark .ql-container { border-color: #3d4d60; }
                .dark .ql-snow .ql-stroke { stroke: white; }
                .dark .ql-snow .ql-fill { fill: white; }
            `}</style>
        </>
    );
}
