"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
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
            {
                student: student.name,
                roomNumber: room.roomNumber,
                hostel: "Boys Hostel A",
            },
        ]);
        setMessage(`✅ ${student.name} allocated to Room ${room.roomNumber}`);
        setSelectedStudent("");
        setSelectedRoom("");
    };

    return (
        <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="border rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-pink-400 outline-none w-full"
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
                        className="border rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-cyan-400 outline-none w-full"
                    >
                        <option value="">Select Room</option>
                        {rooms
                            .filter((r) => r.status === "Vacant")
                            .map((r, i) => (
                                <option key={i} value={r.roomNumber}>
                                    {r.roomNumber} (Left: {r.capacity - r.currentOccupancy})
                                </option>
                            ))}
                    </select>

                    <button
                        onClick={handleAllocate}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold px-5 py-3 rounded-full shadow-md hover:scale-105 transition w-full"
                    >
                        <Plus size={18} /> Allocate Room
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <p className="mt-4 text-center text-sm sm:text-base font-medium text-gray-700">
                        {message}
                    </p>
                )}
            </div>

            {/* Allocations Table */}
            <div
                className="
          relative 
          overflow-x-auto 
          overflow-y-hidden 
          rounded-lg 
          scrollbar-thin 
          scrollbar-thumb-gray-300 
          scrollbar-track-gray-100
        "
            >
                {/* subtle scroll indicator for mobile */}
                <div className="absolute top-0 right-0 bg-gradient-to-l from-gray-50 w-8 h-full pointer-events-none sm:hidden"></div>

                <AllocationTable allocations={allocations} />
            </div>
        </div>
    );
}
