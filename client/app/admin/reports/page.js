"use client";
import { useState } from "react";
import { FileDown, BarChart3, PieChart } from "lucide-react";
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

    // Chart Data
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

    // ======= NEW FUNCTION: Download Report from Backend =======
    const handleDownloadReport = async (type) => {
        try {
            const endpoint = `http://localhost:5000/api/reports/${type}`;
            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error("Failed to generate report");
            }

            // Convert to Blob
            const blob = await response.blob();

            // Create a temporary download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download =
                type === "students"
                    ? "Students_Report.xlsx"
                    : type === "rooms"
                        ? "Rooms_Report.xlsx"
                        : "Allocations_Report.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Error downloading report. Please try again.");
        }
    };

    return (
        <div className="sm:p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 text-center md:text-left">
                <h1
                    data-aos="zoom-out"
                    data-aos-delay="100"
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent"
                >
                    Reports & Analytics
                </h1>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
                {/* Department Bar Chart */}
                <div
                    data-aos="zoom-in"
                    data-aos-delay="100"
                    className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100"
                >
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <BarChart3 className="text-pink-500" /> Students by Department
                    </h2>
                    <div className="w-full h-[250px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="department" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="students" fill="#ec4899" radius={[6, 6, 0, 0]} />
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Room Status Pie Chart */}
                <div
                    data-aos="zoom-in"
                    data-aos-delay="100"
                    className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100"
                >
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <PieChart className="text-cyan-500" /> Room Status Distribution
                    </h2>
                    <div className="w-full h-[250px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={roomStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
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
            </div>

            {/* Download Reports Section */}
            <div
                className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 text-center sm:text-left">
                    Download Reports
                </h2>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
                    <button
                        onClick={() => handleDownloadReport("students")}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition text-sm sm:text-base"
                    >
                        <FileDown size={18} /> Students Report
                    </button>

                    <button
                        onClick={() => handleDownloadReport("rooms")}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition text-sm sm:text-base"
                    >
                        <FileDown size={18} /> Rooms Report
                    </button>

                    <button
                        onClick={() => handleDownloadReport("allocations")}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition text-sm sm:text-base"
                    >
                        <FileDown size={18} /> Allocation Report
                    </button>
                </div>
            </div>
        </div>
    );
}
