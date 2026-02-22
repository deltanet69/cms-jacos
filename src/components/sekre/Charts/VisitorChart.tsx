"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamic import to avoid SSR issues with ApexCharts
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

type FilterType = "day" | "week" | "month";

const VisitorChart: React.FC = () => {
    const [filter, setFilter] = useState<FilterType>("month");

    // Mock data for different filters
    const chartData = {
        day: {
            series: [30, 40, 35, 50, 49, 60, 70, 91, 125, 80, 60, 40],
            categories: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
        },
        week: {
            series: [150, 230, 180, 290, 200, 310, 280],
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        month: {
            series: [450, 520, 380, 610, 480, 750, 690, 820, 710, 950, 880, 1100],
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        }
    };

    const options: ApexOptions = {
        legend: {
            show: false,
        },
        colors: ["#1F7BC9"],
        chart: {
            fontFamily: "Satoshi, sans-serif",
            height: 335,
            type: "area",
            dropShadow: {
                enabled: true,
                color: "#1F7BC9",
                top: 5,
                left: 0,
                blur: 10,
                opacity: 0.1,
            },
            toolbar: {
                show: false,
            },
        },
        stroke: {
            width: 3,
            curve: "smooth", // Spline style
        },
        grid: {
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 4,
            colors: "#fff",
            strokeColors: ["#1F7BC9"],
            strokeWidth: 3,
            strokeOpacity: 0.9,
            fillOpacity: 1,
            hover: {
                size: 6,
            },
        },
        xaxis: {
            type: "category",
            categories: chartData[filter].categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: "#A3AED0",
                    fontSize: "12px",
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#A3AED0",
                    fontSize: "12px",
                }
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100],
            },
        },
        tooltip: {
            x: {
                format: "dd/MM/yy HH:mm",
            },
            theme: "dark"
        },
    };

    const series = [
        {
            name: "Visitors",
            data: chartData[filter].series,
        },
    ];

    return (
        <div className="col-span-12 rounded-xl border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-sm dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-4">
                <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                    <div className="flex min-w-47.5">
                        <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
                        </span>
                        <div className="w-full">
                            <p className="font-bold text-black dark:text-white">Visitor Analytics</p>
                            <p className="text-sm font-medium text-bodydark2">Performance overview</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
                        {(["day", "week", "month"] as FilterType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`rounded px-3 py-1 text-xs font-medium hover:bg-white hover:shadow-card dark:hover:bg-boxdark ${filter === type
                                        ? "bg-white text-black shadow-card dark:bg-boxdark dark:text-white"
                                        : "text-bodydark2"
                                    } transition-all capitalize`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div id="visitorChart" className="-ml-5">
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="area"
                        height={350}
                        width={"100%"}
                    />
                </div>
            </div>
        </div>
    );
};

export default VisitorChart;

