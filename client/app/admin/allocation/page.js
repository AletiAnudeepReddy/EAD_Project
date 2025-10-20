"use client";
import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import AllocationTable from "@/components/AllocationTable";

export default function AllocationPage() {
    const [students, setStudents] = useState([
        { name: "Shiva", rollNumber: "21ECE123" },
        { name: "Kiran", rollNumber: "21CSE045" },
        { name: "Priya", rollNumber: "21EEE078" },
    ]);

    const [rooms, setRooms] = useState([
        { roomNumber: "A101", capacity: 2, currentOccupancy: 1, status: "Vacant" },
        { roomNumber: "B202", capacity: 1, currentOccupancy: 0, status: "Vacant" },
        { roomNumber: "C303", capacity: 2, currentOccupancy: 2, status: "Filled" },
    ]);

    const [allocations, setAllocations] = useState([
        { student: "Shiva", roomNumber: "A101", hostel: "Boys Hostel A" },
    ]);

    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [message, setMessage] = useState("");

    const handleAllocate = () => {
        const student = students.find((s) => s.name === selectedStudent);
        const room = rooms.find((r) => r.roomNumber === selectedRoom);

        if (!student || !room) {
            setMessage("Please select both student and room!");
            return;
        }

        const alreadyAssigned = allocations.some(
            (a) => a.student === selectedStudent
        );
        if (alreadyAssigned) {
            setMessage("❌ This student is already assigned a room.");
            return;
        }

        if (room.status === "Filled") {
            setMessage("⚠️ This room is already full.");
            return;
        }

        // Assign student
        const updatedRooms = rooms.map((r) =>
            r.roomNumber === room.roomNumber
                ? {
                    ...r,
                    currentOccupancy: r.currentOccupancy + 1,
                    status:
                        r.currentOccupancy + 1 >= r.capacity ? "Filled" : "Vacant",
                }
                : r
        );

        setRooms(updatedRooms);
        setAllocations((prev) => [
            ...prev,
            { student: student.name, roomNumber: room.roomNumber, hostel: "Boys Hostel A" },
        ]);
        setMessage(`✅ ${student.name} allocated to Room ${room.roomNumber}`);
        setSelectedStudent("");
        setSelectedRoom("");
    };

    return (
        <div className="p-6 md:p-2 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent">
                    Room Allocation
                </h1>
            </div>

            {/* Allocation Form */}
            <div className="bg-white rounded-xl border-2 border-dashed border-pink-200 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Allocate a Room
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
                    >
                        <option value="">Select Student</option>
                        {students.map((s, i) => (
                            <option key={i} value={s.name}>
                                {s.name} ({s.rollNumber})
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                    >
                        <option value="">Select Room</option>
                        {rooms
                            .filter((r) => r.status === "Vacant")
                            .map((r, i) => (
                                <option key={i} value={r.roomNumber}>
                                    {r.roomNumber} (Capacity: {r.capacity - r.currentOccupancy} left)
                                </option>
                            ))}
                    </select>

                    <button
                        onClick={handleAllocate}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:opacity-90 transition"
                    >
                        <Plus size={20} /> Allocate Room
                    </button>
                </div>

                {message && (
                    <p className="mt-4 text-center text-sm font-medium text-gray-700">
                        {message}
                    </p>
                )}
            </div>

            {/* Allocations Table */}
            <AllocationTable allocations={allocations} />
        </div>
    );
}
