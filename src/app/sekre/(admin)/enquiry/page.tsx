"use client";

import Breadcrumb from "@/components/sekre/Breadcrumbs/Breadcrumb";
import { Eye, CheckCircle, Clock } from "lucide-react";

export default function EnquiryListing() {
    const enquiries = [
        { id: "1", name: "John Doe", email: "john@example.com", subject: "Admission Inquiry", date: "2024-02-22", status: "New" },
        { id: "2", name: "Sarah Smith", email: "sarah@gmail.com", subject: "Fee Structure", date: "2024-02-21", status: "Read" },
    ];

    return (
        <>
            <Breadcrumb pageName="Enquiries" />

            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Visitor</h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Subject</h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
                        </div>
                    </div>

                    {enquiries.map((item, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-5 ${key === enquiries.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                                }`}
                            key={item.id}
                        >
                            <div className="flex flex-col p-2.5 xl:p-5">
                                <p className="text-black dark:text-white font-medium">{item.name}</p>
                                <p className="text-xs">{item.email}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{item.subject}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-meta-3">{item.date}</p>
                            </div>

                            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${item.status === 'New' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {item.status === 'New' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                    {item.status}
                                </span>
                            </div>

                            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                <button className="hover:text-primary flex items-center gap-1 font-medium">
                                    <Eye size={18} /> View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
