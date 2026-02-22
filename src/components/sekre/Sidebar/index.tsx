"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    ClipboardList,
    MessageSquare,
    Mail,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const pathname = usePathname();
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const [collapsed, setCollapsed] = useState(false);

    // Close on click outside (mobile)
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // Close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/sekre", exact: true },
        { name: "Blog/Articles", icon: FileText, path: "/sekre/blog" },
        { name: "Job Vacancy", icon: Briefcase, path: "/sekre/jobs" },
        { name: "Job Applications", icon: ClipboardList, path: "/sekre/jobs/applications" },
        { name: "Enquiries", icon: MessageSquare, path: "/sekre/enquiries" },
        { name: "Contact Us", icon: Mail, path: "/sekre/contact" },
        { name: "User Management", icon: Users, path: "/sekre/users" },
        { name: "App Settings", icon: Settings, path: "/sekre/settings" },
    ];

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } ${collapsed ? "w-20" : "w-70"}`}
        >
            {/* SIDEBAR HEADER */}
            <div className={`flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 ${collapsed ? "px-4 justify-center" : "px-6"}`}>
                {!collapsed && (
                    <Link href="/sekre" className="flex items-center gap-2">
                        <Image
                            width={110}
                            height={32}
                            src="/logo.png"
                            alt="Logo"
                            priority
                        />
                    </Link>
                )}

                <div className="flex items-center gap-2">
                    {/* Mobile toggle */}
                    <button
                        ref={trigger}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-controls="sidebar"
                        aria-expanded={sidebarOpen}
                        className="block lg:hidden"
                    >
                        <ChevronLeft />
                    </button>

                    {/* Desktop toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:block text-bodydark2 hover:text-primary transition-colors"
                        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
                    </button>
                </div>
            </div>
            {/* SIDEBAR HEADER */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* Sidebar Menu */}
                <nav className={`mt-5 py-4 duration-300 ${collapsed ? "px-2" : "px-4 lg:px-3"}`}>
                    <div>
                        {!collapsed && (
                            <h3 className="mb-4 ml-4 text-lg font-semibold text-bodydark2 uppercase">
                                MENU
                            </h3>
                        )}

                        <ul className="mb-6 flex flex-col gap-1.5">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        title={collapsed ? item.name : ""}
                                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-3 text-md text-bodydark1 duration-300 ease-in-out hover:bg-[#40A1FB] hover:text-white dark:hover:bg-meta-4 ${(item.exact ? pathname === item.path : pathname.startsWith(item.path) && !menuItems.some(m => m.path !== item.path && m.path.startsWith(item.path) && pathname.startsWith(m.path)))
                                            ? "bg-[#1F7BC9] font-medium text-white shadow-sm"
                                            : ""
                                            } ${collapsed ? "justify-center px-2" : ""}`}
                                    >
                                        <item.icon size={20} className="flex-shrink-0" />
                                        {!collapsed && <span className="truncate">{item.name}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Bottom Toggle for convenience */}
            {!collapsed && (
                <div className="mt-auto p-6 hidden lg:block border-t border-stroke dark:border-strokedark">
                    <button
                        onClick={() => setCollapsed(true)}
                        className="flex items-center gap-2 text-sm text-bodydark2 hover:text-primary transition-all"
                    >
                        <ChevronLeft size={16} /> Collapse Menu
                    </button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;

