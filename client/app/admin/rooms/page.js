"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import RoomForm from "@/components/RoomForm";

export default function RoomsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [rooms, setRooms] = useState([
        {
            roomNumber: "A101",
            hostelName: "Boys Hostel A",
            capacity: 2,
            currentOccupancy: 1,
            status: "Vacant",
        },
        {
            roomNumber: "G203",
            hostelName: "Girls Hostel G",
            capacity: 3,
            currentOccupancy: 3,
            status: "Filled",
        },
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.hostelName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === "All" ? true : room.status.toLowerCase() === filter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 md:p-2 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent">
                    Manage Rooms
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search room..."
                            className="pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-pink-400 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Vacant">Vacant</option>
                        <option value="Filled">Filled</option>
                    </select>

                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:opacity-90 transition"
                    >
                        <Plus size={20} /> Add Room
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-pink-100 text-pink-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Room No</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Hostel Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Capacity</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Occupied</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {filteredRooms.map((room, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">{room.roomNumber}</td>
                                <td className="px-6 py-4">{room.hostelName}</td>
                                <td className="px-6 py-4">{room.capacity}</td>
                                <td className="px-6 py-4">{room.currentOccupancy}</td>
                                <td className={`px-6 py-4 font-semibold ${room.status === "Vacant" ? "text-green-600" : "text-red-500"}`}>
                                    {room.status}
                                </td>
                                <td className="px-6 py-4 flex gap-3">
                                    <button className="text-blue-600 hover:text-blue-800 transition">
                                        <Edit size={20} />
                                    </button>
                                    <button className="text-red-600 hover:text-red-800 transition">
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Popup Form */}
            <RoomForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} setRooms={setRooms} />
        </div>
    );
}
