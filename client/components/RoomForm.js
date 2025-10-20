"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function RoomForm({ isOpen, setIsOpen, setRooms }) {
    const [formData, setFormData] = useState({
        roomNumber: "",
        hostelName: "",
        capacity: "",
        currentOccupancy: "",
        status: "Vacant",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setRooms((prev) => [...prev, formData]);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold mb-5 text-center bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
                    Add New Room
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="roomNumber"
                        placeholder="Room Number"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="text"
                        name="hostelName"
                        placeholder="Hostel Name"
                        value={formData.hostelName}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                    />
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="number"
                        name="currentOccupancy"
                        placeholder="Current Occupancy"
                        value={formData.currentOccupancy}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
                    >
                        <option value="Vacant">Vacant</option>
                        <option value="Filled">Filled</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold py-2 rounded-full shadow-lg hover:opacity-90 transition"
                    >
                        Save Room
                    </button>
                </form>
            </div>
        </div>
    );
}
