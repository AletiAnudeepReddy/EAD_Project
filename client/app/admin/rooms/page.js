"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import RoomForm from "@/components/RoomForm";

export default function RoomsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [editRoom, setEditRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = "http://localhost:5000/api/rooms";

    // ✅ Fetch Rooms from Backend
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch(API_BASE);
                const data = await res.json();
                setRooms(data || []);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    // ✅ Add or Update Room
    const handleSave = async (roomData) => {
        try {
            if (editRoom) {
                // Update existing room
                const res = await fetch(`${API_BASE}/${editRoom._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(roomData),
                });
                const updated = await res.json();
                setRooms((prev) =>
                    prev.map((r) => (r._id === updated._id ? updated : r))
                );
            } else {
                // Add new room
                const res = await fetch(API_BASE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(roomData),
                });
                const newRoom = await res.json();
                setRooms((prev) => [newRoom, ...prev]);
            }
        } catch (err) {
            console.error("Error saving room:", err);
        } finally {
            setEditRoom(null);
            setIsFormOpen(false);
        }
    };

    // ✅ Delete Room
    const handleDelete = async (id) => {
        if (!confirm("Delete this room?")) return;
        try {
            await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
            setRooms((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            console.error("Error deleting room:", err);
        }
    };

    // ✅ Filter + Search Logic
    const filteredRooms = rooms.filter((room) => {
        const roomNumber = (room.roomNumber || "").toString().toLowerCase();
        const hostelName = (room.hostelName || "").toString().toLowerCase();
        const status = (room.status || "").toString();

        const matchesSearch =
            roomNumber.includes(searchTerm.toLowerCase()) ||
            hostelName.includes(searchTerm.toLowerCase());

        const matchesFilter =
            filter === "All" || status === filter;

        return matchesSearch && matchesFilter;
    });


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Loading rooms...
            </div>
        );
    }

    return (
        <div className="sm:p-6 min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h1
                    data-aos="zoom-out"
                    data-aos-delay="100"
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent text-center md:text-left"
                >
                    Manage Rooms
                </h1>

                <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-3 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search room or hostel..."
                            className="pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-pink-400 outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter */}
                    <select
                        className="border rounded-full px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none w-full sm:w-auto"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Vacant">Vacant</option>
                        <option value="Filled">Filled</option>
                    </select>

                    {/* Add Button */}
                    <button
                        onClick={() => {
                            setEditRoom(null);
                            setIsFormOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:scale-105 transition w-full sm:w-auto"
                    >
                        <Plus size={16} /> Add Room
                    </button>
                </div>
            </div>

            {/* ===== Mobile: Card List ===== */}
            <div className="space-y-4 md:hidden">
                {filteredRooms.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No rooms found.</div>
                )}

                {filteredRooms
                    .filter((room) => room && room._id)
                    .map((room) => (
                        <div
                            key={room._id}
                            className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                        >
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {room.roomNumber}
                                    </h3>
                                    <span
                                        className={`text-sm font-medium ${room.status === "Vacant"
                                            ? "text-green-600"
                                            : "text-red-500"
                                            }`}
                                    >
                                        {room.status}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Hostel:</span>{" "}
                                    {room.hostelName || "—"}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Capacity:</span>{" "}
                                    {room.capacity} <span className="mx-1">•</span>
                                    <span className="font-medium">Occupied:</span>{" "}
                                    {room.currentOccupancy}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 mt-3 sm:mt-0">
                                <button
                                    className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    aria-label="Edit"
                                    onClick={() => {
                                        setEditRoom(room);
                                        setIsFormOpen(true);
                                    }}
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                                    aria-label="Delete"
                                    onClick={() => handleDelete(room._id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* ===== Desktop: Table ===== */}
            <div className="hidden md:block mt-2">
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                    <table className="min-w-full text-sm text-left border-collapse">
                        <thead data-aos="fade-up" data-aos-delay="100">
                            <tr className="bg-pink-100 text-pink-800">
                                <th className="py-3 px-4">Room No</th>
                                <th className="py-3 px-4">Hostel</th>
                                <th className="py-3 px-4">Capacity</th>
                                <th className="py-3 px-4">Occupied</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((room, idx) => (
                                    <tr
                                        data-aos="fade-up"
                                        data-aos-delay={`${150 + idx * 30}`}
                                        key={room._id}
                                        className="border-b hover:bg-pink-50 transition duration-150"
                                    >
                                        <td className="py-3 px-4">{room.roomNumber}</td>
                                        <td className="py-3 px-4">{room.hostelName}</td>
                                        <td className="py-3 px-4">{room.capacity}</td>
                                        <td className="py-3 px-4">{room.currentOccupancy}</td>
                                        <td
                                            className={`py-3 px-4 font-semibold ${room.status === "Vacant"
                                                ? "text-green-600"
                                                : "text-red-500"
                                                }`}
                                        >
                                            {room.status}
                                        </td>
                                        <td className="py-3 px-4 flex justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditRoom(room);
                                                    setIsFormOpen(true);
                                                }}
                                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room._id)}
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-6 text-gray-500 italic"
                                    >
                                        No rooms found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Popup Form */}
            {isFormOpen && (
                <RoomForm
                    isOpen={isFormOpen}
                    setIsOpen={setIsFormOpen}
                    setRooms={setRooms}
                    onSave={handleSave}
                    initialData={editRoom}
                />
            )}
        </div>
    );
}
