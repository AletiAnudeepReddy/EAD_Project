"use client";
import { useEffect, useState } from "react";
import {
    Users,
    BedDouble,
    Bed,
    Activity,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 120,
        totalRooms: 60,
        vacantRooms: 20,
        allocatedRooms: 40,
    });

    const activityData = [
        { date: "Oct 1", allocations: 5 },
        { date: "Oct 5", allocations: 10 },
        { date: "Oct 10", allocations: 7 },
        { date: "Oct 15", allocations: 12 },
        { date: "Oct 18", allocations: 9 },
    ];

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen text-gray-900">
            {/* Header */}
            <div className="mb-8 mt-15">
                <h1 className="text-3xl font-extrabold text-pink-600 tracking-tight">
                    HostelHub Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                    Overview of student allocations, room statistics, and activity.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users className="text-pink-600 w-8 h-8" />}
                    title="Total Students"
                    value={stats.totalStudents}
                />
                <StatCard
                    icon={<BedDouble className="text-pink-600 w-8 h-8" />}
                    title="Total Rooms"
                    value={stats.totalRooms}
                />
                <StatCard
                    icon={<Bed className="text-pink-600 w-8 h-8" />}
                    title="Vacant Rooms"
                    value={stats.vacantRooms}
                />
                <StatCard
                    icon={<Activity className="text-pink-600 w-8 h-8" />}
                    title="Allocated Rooms"
                    value={stats.allocatedRooms}
                />
            </div>

            {/* Charts + Activity Section */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-pink-600 mb-4">
                        Allocation Trends
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="allocations" fill="#ec4899" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-pink-600 mb-4">
                        Recent Allocation Activity
                    </h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-pink-100 text-pink-800 text-left">
                                <th className="py-3 px-4">Student</th>
                                <th className="py-3 px-4">Room No</th>
                                <th className="py-3 px-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { student: "Ananya Sharma", room: "B-102", date: "Oct 17, 2025" },
                                { student: "Ravi Kumar", room: "A-210", date: "Oct 16, 2025" },
                                { student: "Meena Patel", room: "C-105", date: "Oct 15, 2025" },
                                { student: "Vikram Singh", room: "A-115", date: "Oct 14, 2025" },
                            ].map((a, idx) => (
                                <tr key={idx} className="border-b hover:bg-pink-50 transition">
                                    <td className="py-3 px-4">{a.student}</td>
                                    <td className="py-3 px-4">{a.room}</td>
                                    <td className="py-3 px-4 text-gray-500">{a.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
            <div className="p-3 bg-pink-100 rounded-full">{icon}</div>
            <div>
                <h3 className="text-gray-600 font-semibold">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
