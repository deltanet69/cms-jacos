"use client";

import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { Save, Database, Shield } from "lucide-react";

export default function Settings() {
    return (
        <>
            <Breadcrumb pageName="App Settings" />

            <div className="grid grid-cols-1 gap-8">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            General Information
                        </h3>
                    </div>
                    <div className="p-7">
                        <form action="#">
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                <div className="w-full sm:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Site Name
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        defaultValue="Jacos International School"
                                    />
                                </div>

                                <div className="w-full sm:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Contact Email
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="email"
                                        defaultValue="info@jacos.com"
                                    />
                                </div>
                            </div>

                            <div className="mb-5.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Address
                                </label>
                                <textarea
                                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    rows={4}
                                    defaultValue="123 Education Street, Central Jakarta"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-4.5">
                                <button
                                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex justify-center items-center gap-2 rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                    type="submit"
                                >
                                    <Save size={18} /> Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Data Management
                        </h3>
                    </div>
                    <div className="p-7">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <button className="flex flex-1 items-center justify-center gap-2 rounded border border-stroke p-4 hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4">
                                <Database className="text-primary" />
                                <span>Export to CSV (All Tables)</span>
                            </button>
                            <button className="flex flex-1 items-center justify-center gap-2 rounded border border-stroke p-4 hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4">
                                <Shield className="text-secondary" />
                                <span>Run Manual Backup</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
