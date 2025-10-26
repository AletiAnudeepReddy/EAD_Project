"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AllocationTable from "@/components/AllocationTable";

const API_BASE = "http://localhost:5000/api";

export default function AllocationPage() {
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [allocations, setAllocations] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [message, setMessage] = useState("");

    // ✅ Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, roomsRes, allocRes] = await Promise.all([
                    fetch(`${API_BASE}/students`),
                    fetch(`${API_BASE}/rooms`),
                    fetch(`${API_BASE}/allocations`),
                ]);

                const [studentsData, roomsData, allocData] = await Promise.all([
                    studentsRes.json(),
                    roomsRes.json(),
                    allocRes.json(),
                ]);

                setStudents(studentsData);
                setRooms(roomsData);
                setAllocations(allocData);
            } catch (err) {
                console.error("Error loading data:", err);
                setMessage("⚠️ Failed to load data from server.");
            }
        };

        fetchData();
    }, []);

    // ✅ Handle allocation (calls backend)
    const handleAllocate = async () => {
        if (!selectedStudent || !selectedRoom) {
            setMessage("Please select both student and room!");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/allocations/allocate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: selectedStudent,
                    roomId: selectedRoom,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Allocation failed");

            setMessage(`✅ ${data.message}`);

            // Refresh allocations + rooms
            const [newAllocRes, newRoomsRes] = await Promise.all([
                fetch(`${API_BASE}/allocations`),
                fetch(`${API_BASE}/rooms`),
            ]);

            setAllocations(await newAllocRes.json());
            setRooms(await newRoomsRes.json());

            setSelectedStudent("");
            setSelectedRoom("");
        } catch (err) {
            console.error("Allocation error:", err);
            setMessage(`❌ ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1
                    data-aos="zoom-out"
                    data-aos-delay="100"
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent text-center sm:text-left"
                >
                    Room Allocation
                </h1>
            </div>

            {/* Allocation Form */}
            <div
                data-aos="zoom-in"
                data-aos-delay="200"
                className="bg-white rounded-xl border-2 border-dashed border-pink-200 p-4 sm:p-6 mb-8 shadow-sm"
            >
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 text-center sm:text-left">
                    Allocate a Room
                </h2>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="w-full rounded-lg border px-3 py-3 text-base outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                    >
                        <option value="">Select Student</option>
                        {students.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name} ({s.rollNumber})
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="w-full rounded-lg border px-3 py-3 text-base outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
                    >
                        <option value="">Select Room</option>
                        {rooms
                            .filter((r) => r.status === "Vacant")
                            .map((r) => (
                                <option key={r._id} value={r._id}>
                                    {r.roomNumber} ({r.capacity - r.currentOccupancy} left)
                                </option>
                            ))}
                    </select>

                    <button
                        onClick={handleAllocate}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold shadow-md hover:scale-105 transition text-sm sm:text-base"
                    >
                        <Plus size={18} /> Allocate Room
                    </button>
                </div>

                {message && (
                    <p className="mt-4 text-center text-sm sm:text-base font-medium text-gray-700">
                        {message}
                    </p>
                )}
            </div>

            {/* Allocation Table */}
            <AllocationTable allocations={allocations} />
        </div>
    );
}
