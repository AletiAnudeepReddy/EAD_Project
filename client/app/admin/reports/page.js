"use client";
import { useState } from "react";
import { FileDown, BarChart3, PieChart } from "lucide-react";
import * as XLSX from "xlsx";
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Pie,
    PieChart as RePieChart,
    Cell,
    Legend,
} from "recharts";

export default function ReportsPage() {
    const [students] = useState([
        { name: "Shiva", rollNumber: "21ECE123", department: "ECE", room: "A101" },
        { name: "Priya", rollNumber: "21EEE078", department: "EEE", room: "B202" },
        { name: "Kiran", rollNumber: "21CSE045", department: "CSE", room: "A103" },
    ]);

    const [rooms] = useState([
        { roomNumber: "A101", hostelName: "Boys Hostel A", capacity: 2, currentOccupancy: 2, status: "Filled" },
        { roomNumber: "B202", hostelName: "Girls Hostel B", capacity: 2, currentOccupancy: 1, status: "Vacant" },
        { roomNumber: "A103", hostelName: "Boys Hostel A", capacity: 2, currentOccupancy: 2, status: "Filled" },
    ]);

    const [allocations] = useState([
        { student: "Shiva", roomNumber: "A101", date: "2025-10-10" },
        { student: "Priya", roomNumber: "B202", date: "2025-10-12" },
        { student: "Kiran", roomNumber: "A103", date: "2025-10-14" },
    ]);

    // Data for charts
    const roomStatusData = [
        { name: "Filled", value: rooms.filter((r) => r.status === "Filled").length },
        { name: "Vacant", value: rooms.filter((r) => r.status === "Vacant").length },
    ];

    const COLORS = ["#ec4899", "#06b6d4"];

    const departmentData = [
        { department: "ECE", students: 1 },
        { department: "EEE", students: 1 },
        { department: "CSE", students: 1 },
    ];

    // Download Excel Report
    const handleDownloadReport = (type) => {
        let data = [];
        let fileName = "";

        if (type === "students") {
            data = students;
            fileName = "Students_Report.xlsx";
        } else if (type === "rooms") {
            data = rooms;
            fileName = "Rooms_Report.xlsx";
        } else if (type === "allocations") {
            data = allocations;
            fileName = "Allocations_Report.xlsx";
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="p-6 md:p-2 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <h1 data-aos="zoom-out"
                    data-aos-delay="100" className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent">
                    Reports & Analytics
                </h1>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Bar Chart */}
                <div data-aos="zoom-in"
                    data-aos-delay="100" className="bg-gray-50 rounded-2xl border-2 border-dashed border-pink-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <BarChart3 className="text-pink-500" /> Students by Department
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <ReBarChart data={departmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="department" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="students" fill="#ec4899" radius={[6, 6, 0, 0]} />
                        </ReBarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div data-aos="zoom-in"
                    data-aos-delay="100" className="bg-gray-50 rounded-2xl border-2 border-dashed border-pink-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <PieChart className="text-cyan-500" /> Room Status Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                            <Pie
                                data={roomStatusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {roomStatusData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </RePieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Download Reports Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 data-aos="fade-down"
                    data-aos-delay="100" className="text-lg font-semibold text-gray-700 mb-4">
                    Download Reports
                </h2>
                <div className="flex flex-wrap gap-4">
                    <button data-aos="fade-up"
                        data-aos-delay="100"
                        onClick={() => handleDownloadReport("students")}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
                    >
                        <FileDown size={18} /> Students Report
                    </button>
                    <button data-aos="fade-up"
                        data-aos-delay="200"
                        onClick={() => handleDownloadReport("rooms")}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
                    >
                        <FileDown size={18} /> Rooms Report
                    </button>
                    <button data-aos="fade-up"
                        data-aos-delay="300"
                        onClick={() => handleDownloadReport("allocations")}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
                    >
                        <FileDown size={18} /> Allocation Report
                    </button>
                </div>
            </div>
        </div>
    );
}
