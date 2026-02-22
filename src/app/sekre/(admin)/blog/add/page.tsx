"use client";

import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";
import { databases, storage, account, DATABASE_ID, BUCKET_ID, ID } from "@/lib/appwrite";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Select from "react-select";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div className="h-40 w-full animate-pulse bg-gray-200 dark:bg-meta-4 rounded"></div>,
});

const TABLE_POSTS = process.env.NEXT_PUBLIC_APPWRITE_TABLE_POSTS || "post";
const TABLE_CATEGORIES = process.env.NEXT_PUBLIC_APPWRITE_TABLE_CATEGORIES || "categories";

export default function AddBlog() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState<any>(null);

    // Form States
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Metadata States
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [status, setStatus] = useState("Published");
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
    const [scheduleTime, setScheduleTime] = useState("09:00");

    // Options
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

        const fetchCategories = async () => {
            try {
                const response = await databases.listDocuments(DATABASE_ID, TABLE_CATEGORIES);
                const options = response.documents.map(doc => ({
                    value: doc.name || doc.$id,
                    label: doc.name || doc.$id
                }));
                // In your screenshot, names are "Berita Sekolah", "Tips Belajar", etc.
                setCategoryOptions(options);
            } catch (err) {
                console.error("Failed to fetch categories", err);
                setCategoryOptions([
                    { value: "Berita Sekolah", label: "Berita Sekolah" },
                    { value: "Info Admission 2026", label: "Info Admission 2026" },
                    { value: "Tips Belajar", label: "Tips Belajar" }
                ]);
            }
        };

        checkUser();
        fetchCategories();
    }, []);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImage(file);
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

            const slugStr = generateSlug(title || "untitled");
            const fileExt = file.name.split('.').pop();
            const uniqueId = ID.unique();

            const customFileId = `post_editor_${uniqueId}`;
            const customFileName = `post_${slugStr.substring(0, 20)}_${uniqueId}.${fileExt}`;
            const namedFile = new File([file], customFileName, { type: file.type });

            try {
                const response = await storage.createFile(BUCKET_ID, customFileId, namedFile);
                const fileUrl = storage.getFileView(BUCKET_ID, response.$id).toString();

                const quillEditor = document.querySelector("#blog-editor .ql-editor") as any;
                const quill = quillEditor?.__quill;

                if (quill) {
                    const range = quill.getSelection();
                    quill.insertEmbed(range?.index || 0, "image", fileUrl);
                    quill.setSelection((range?.index || 0) + 1);
                }
            } catch (err: any) {
                console.error("Editor Image Upload Failed:", err);
                alert("Failed to upload image to editor: " + err.message);
            }
        };
    };

    const quillModules = React.useMemo(() => ({
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
        setLoading(true);
        setError("");

        const slug = generateSlug(title);

        try {
            let imageId = "";

            // 1. Upload Image to Storage if exists
            if (featuredImage) {
                try {
                    const fileExt = featuredImage.name.split('.').pop();
                    const uniqueId = ID.unique();
                    const customFileId = `post_feat_${uniqueId}`;
                    const customFileName = `post_${slug.substring(0, 20)}_${uniqueId}.${fileExt}`;
                    const namedFile = new File([featuredImage], customFileName, { type: featuredImage.type });

                    const uploadResponse = await storage.createFile(
                        BUCKET_ID,
                        customFileId,
                        namedFile
                    );
                    imageId = uploadResponse.$id;
                } catch (imgErr: any) {
                    console.error("Storage Error:", imgErr);
                    throw new Error(`[STORAGE ERROR]: ${imgErr.message}`);
                }
            }

            // 2. Prepare Data based on actual schema (including denormalized names for performance)
            const postData = {
                title,
                slug: slug,
                excerpt: excerpt || title.substring(0, 100),
                content,
                featuredImage: imageId || "",
                categoryId: selectedCategories.length > 0 ? selectedCategories[0].value : "",
                categoryName: selectedCategories.length > 0 ? selectedCategories[0].label : "",
                authorId: user?.$id || "admin",
                authorName: user?.name || "Admin",
                status,
                views: 0
            };

            // 3. Save to Database
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    TABLE_POSTS,
                    ID.unique(),
                    postData
                );
            } catch (dbErr: any) {
                console.error("Database Error:", dbErr);
                throw new Error(`[DATABASE ERROR]: ${dbErr.message}`);
            }

            router.push("/sekre/blog");
            router.refresh();
        } catch (err: any) {
            console.error("Failed to create post:", err);
            setError(err.message || "An error occurred while saving the post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Breadcrumb pageName="Add New Blog" />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-9 md:grid-cols-12">
                <div className="md:col-span-8 flex flex-col gap-9">
                    {/* Content Section */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Content</h3>
                        </div>
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
                                        className="min-h-[300px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-9">
                    {/* Featured Image Section */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Featured Image</h3>
                        </div>
                        <div className="p-6.5">
                            <div className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <Upload size={20} className="text-primary" />
                                    <p className="text-xs text-center">Click or drag image</p>
                                </div>
                            </div>
                            {previewImage && (
                                <div className="mt-4">
                                    <img src={previewImage} alt="Preview" className="w-full rounded" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Metadata</h3>
                        </div>
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
                                <div className="mb-4.5 animate-fadeIn">
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
                                <div className="mb-4.5 flex items-start gap-2 rounded bg-danger/10 px-4 py-3 text-danger">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <p className="text-xs font-semibold">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded bg-[#1F7BC9] p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Publish Article"}
                            </button>
                        </div>
                    </div>
                </div>
            </form >

            <style jsx global>{`
                .react-select__control {
                    background-color: transparent !important;
                    border-color: #dee2e6 !important;
                }
                .dark .react-select__control {
                    background-color: #1d2a39 !important;
                    border-color: #3d4d60 !important;
                }
                .dark .react-select__menu {
                    background-color: #24303f !important;
                }
                .ql-container { min-height: 250px; font-size: 18px; }
                .ql-editor { font-size: 18px; line-height: 1.6; }
                .ql-editor.ql-blank::before { font-size: 18px; }
                .dark .ql-toolbar, .dark .ql-container { border-color: #3d4d60; }
                .dark .ql-snow .ql-stroke { stroke: white; }
                .dark .ql-snow .ql-fill { fill: white; }
                .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
