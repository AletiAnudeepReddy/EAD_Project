"use client";
import { useEffect, useState } from "react";
import {
    Users,
    BedDouble,
    Bed,
    Activity,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const API_BASE = "http://localhost:5000/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalRooms: 0,
        vacantRooms: 0,
        allocatedRooms: 0,
    });

    const [activityData, setActivityData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [studentsRes, roomsRes, allocRes] = await Promise.all([
                    fetch(`${API_BASE}/students`),
                    fetch(`${API_BASE}/rooms`),
                    fetch(`${API_BASE}/allocations`),
                ]);

                const [students, rooms, allocations] = await Promise.all([
                    studentsRes.json(),
                    roomsRes.json(),
                    allocRes.json(),
                ]);

                // ✅ Compute Stats
                const totalStudents = students.length;
                const totalRooms = rooms.length;
                const allocatedRooms = rooms.filter((r) => r.status === "Occupied").length;
                const vacantRooms = totalRooms - allocatedRooms;

                setStats({
                    totalStudents,
                    totalRooms,
                    vacantRooms,
                    allocatedRooms,
                });

                // ✅ Generate Activity Data (group allocations by date)
                const activityMap = {};
                allocations.forEach((alloc) => {
                    const date = new Date(alloc.date || alloc.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    });
                    activityMap[date] = (activityMap[date] || 0) + 1;
                });

                const activityArr = Object.entries(activityMap).map(([date, allocations]) => ({
                    date,
                    allocations,
                }));

                setActivityData(activityArr.reverse());
            } catch (err) {
                console.error("Error loading dashboard data:", err);
                setError("⚠️ Failed to fetch data from backend.");
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="md:p-6 min-h-screen text-gray-900">
            {/* Header */}
            <div className="mb-6 text-center md:text-left">
                <h1
                    data-aos="zoom-out"
                    data-aos-delay="200"
                    className="text-2xl sm:text-3xl font-bold text-pink-600"
                >
                    HostelHub{" "}
                    <span className="bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent">
                        Admin Dashboard
                    </span>
                </h1>
                <p
                    data-aos="zoom-up"
                    data-aos-delay="100"
                    className="text-gray-600 mt-1 text-sm sm:text-base"
                >
                    Overview of student allocations, room statistics, and activity.
                </p>
            </div>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center font-medium">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon={<Users className="text-pink-600 w-7 h-7 sm:w-8 sm:h-8" />}
                    title="Total Students"
                    value={stats.totalStudents}
                />
                <StatCard
                    icon={<BedDouble className="text-pink-600 w-7 h-7 sm:w-8 sm:h-8" />}
                    title="Total Rooms"
                    value={stats.totalRooms}
                />
                <StatCard
                    icon={<Bed className="text-pink-600 w-7 h-7 sm:w-8 sm:h-8" />}
                    title="Vacant Rooms"
                    value={stats.vacantRooms}
                />
                <StatCard
                    icon={<Activity className="text-pink-600 w-7 h-7 sm:w-8 sm:h-8" />}
                    title="Allocated Rooms"
                    value={stats.allocatedRooms}
                />
            </div>

            {/* Charts + Activity */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart */}
                <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                >
                    <h2 className="text-lg sm:text-xl font-bold text-pink-600 mb-4">
                        Allocation Trends
                    </h2>
                    <div className="w-full h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" stroke="#888" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="allocations"
                                    fill="#ec4899"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Table */}
                <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 overflow-x-auto"
                >
                    <h2 className="text-lg sm:text-xl font-bold text-pink-600 mb-4">
                        Recent Allocation Activity
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm sm:text-base">
                            <thead>
                                <tr className="bg-pink-100 text-pink-800 text-left">
                                    <th className="py-3 px-4">Student</th>
                                    <th className="py-3 px-4">Room No</th>
                                    <th className="py-3 px-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityData.length > 0 ? (
                                    activityData.slice(-5).map((a, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b hover:bg-pink-50 transition"
                                        >
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {/* Dummy names just to preserve UI */}
                                                Student #{idx + 1}
                                            </td>
                                            <td className="py-3 px-4">Room - {idx + 101}</td>
                                            <td className="py-3 px-4 text-gray-500">{a.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No recent activity found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value }) {
    return (
        <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-gray-50 rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 hover:shadow-xl transition-shadow duration-300 text-center sm:text-left"
        >
            <div className="p-3 bg-cyan-100 rounded-full mb-2 sm:mb-0">{icon}</div>
            <div>
                <h3 className="text-gray-600 font-semibold text-sm sm:text-base">
                    {title}
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-700">
                    {value}
                </p>
            </div>
        </div>
    );
}
