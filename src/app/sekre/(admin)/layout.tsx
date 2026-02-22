"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import Sidebar from "@/components/sekre/Sidebar";
import Header from "@/components/sekre/Header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    React.useEffect(() => {
        const init = async () => {
            try {
                await account.get();
                setLoading(false);
            } catch (error) {
                // Expected when guest, don't log as error to avoid overlay
                router.push("/sekre/login");
            }
        };
        init();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-boxdark">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="dark:bg-boxdark-2 bg-[#f6f6f6] dark:text-bodydark">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Content Area */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* Header */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                    {/* Main Content */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
