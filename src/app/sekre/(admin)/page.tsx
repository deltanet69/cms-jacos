"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText,
    Briefcase,
    MessageSquare,
    Users,
    TrendingUp,
    ChevronRight,
    Loader2,
    AlertCircle
} from "lucide-react";
import { databases, DATABASE_ID, Query, COLLECTIONS } from "@/lib/appwrite";
import VisitorChart from "@/components/sekre/Charts/VisitorChart";

const TABLES = {
    ARTICLES: COLLECTIONS.POSTS,
    VACANCIES: COLLECTIONS.JOB_VACANCY,
    ENQUIRIES: COLLECTIONS.ENQUIRIES,
    APPLICATIONS: COLLECTIONS.JOB_APPLICATIONS,
};

export default function Dashboard() {
    const [counts, setCounts] = useState({
        articles: 0,
        vacancies: 0,
        enquiries: 0,
        applications: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const [articles, vacancies, enquiries, applications] = await Promise.all([
                    databases.listDocuments(DATABASE_ID, TABLES.ARTICLES, [Query.limit(1)]),
                    databases.listDocuments(DATABASE_ID, TABLES.VACANCIES, [Query.limit(1)]),
                    databases.listDocuments(DATABASE_ID, TABLES.ENQUIRIES, [Query.limit(1)]),
                    databases.listDocuments(DATABASE_ID, TABLES.APPLICATIONS, [Query.limit(1)]),
                ]);

                setCounts({
                    articles: articles.total,
                    vacancies: vacancies.total,
                    enquiries: enquiries.total,
                    applications: applications.total
                });
            } catch (err: any) {
                console.error("Dashboard fetch error:", err);
                setError("Failed to load dashboard metrics.");
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const stats = [
        {
            name: "Total Articles",
            value: counts.articles,
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-50",
            path: "/sekre/blog"
        },
        {
            name: "Job Vacancies",
            value: counts.vacancies,
            icon: Briefcase,
            color: "text-green-500",
            bg: "bg-green-50",
            path: "/sekre/jobs"
        },
        {
            name: "New Enquiries",
            value: counts.enquiries,
            icon: MessageSquare,
            color: "text-purple-500",
            bg: "bg-purple-50",
            path: "/sekre/enquiries"
        },
        {
            name: "Job Applications",
            value: counts.applications,
            icon: TrendingUp,
            color: "text-orange-500",
            bg: "bg-orange-50",
            path: "/sekre/jobs/applications"
        },
    ];

    if (error) {
        return (
            <div className="flex h-60 items-center justify-center flex-col gap-2 text-danger">
                <AlertCircle size={40} />
                <p className="font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="text-primary underline text-sm">Retry</button>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-black dark:text-white">
                        System Overview
                    </h2>
                    <p className="text-sm text-body">Real-time stats from Appwrite Database</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 2xl:gap-7.5">
                {stats.map((stat, idx) => (
                    <div key={idx} className="p-5 bg-white border border-stroke rounded-xl shadow-sm dark:bg-boxdark dark:border-strokedark hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <Link href={stat.path} className="text-body hover:text-primary transition-colors">
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                        <div>
                            {loading ? (
                                <div className="h-8 w-16 bg-gray-200 dark:bg-meta-4 animate-pulse rounded mb-1"></div>
                            ) : (
                                <h4 className="text-2xl font-bold text-black dark:text-white">{stat.value}</h4>
                            )}
                            <p className="text-sm font-medium text-bodydark2">{stat.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                <VisitorChart />

                <div className="col-span-12 xl:col-span-4 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <h3 className="mb-6 text-xl font-semibold text-black dark:text-white">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link href="/sekre/blog/add" className="flex items-center justify-between p-4 rounded-lg border border-stroke hover:border-primary hover:bg-primary/5 transition-all group">
                            <div className="flex items-center gap-3">
                                <FileText size={20} className="text-primary" />
                                <span className="text-sm font-medium text-black dark:text-white">Create New Article</span>
                            </div>
                            <ChevronRight size={16} className="text-body group-hover:translate-x-1 duration-300" />
                        </Link>
                        <Link href="/sekre/jobs/add" className="flex items-center justify-between p-4 rounded-lg border border-stroke hover:border-primary hover:bg-primary/5 transition-all group">
                            <div className="flex items-center gap-3">
                                <Briefcase size={20} className="text-green-500" />
                                <span className="text-sm font-medium text-black dark:text-white">Post Job Vacancy</span>
                            </div>
                            <ChevronRight size={16} className="text-body group-hover:translate-x-1 duration-300" />
                        </Link>
                        <Link href="/sekre/users/add" className="flex items-center justify-between p-4 rounded-lg border border-stroke hover:border-primary hover:bg-primary/5 transition-all group">
                            <div className="flex items-center gap-3">
                                <Users size={20} className="text-purple-500" />
                                <span className="text-sm font-medium text-black dark:text-white">Add Team Member</span>
                            </div>
                            <ChevronRight size={16} className="text-body group-hover:translate-x-1 duration-300" />
                        </Link>
                    </div>

                    <div className="mt-8 rounded-lg bg-primary/5 p-4 border border-primary/10">
                        <h4 className="text-sm font-bold text-primary mb-1">Current Session</h4>
                        <p className="text-xs text-body">Changes are automatically synced with Appwrite Cloud.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
