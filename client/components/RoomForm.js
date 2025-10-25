"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function RoomForm({ setIsOpen, onSave, initialData }) {
    const [formData, setFormData] = useState({
        roomNumber: "",
        hostelName: "",
        capacity: "",
        currentOccupancy: "",
        status: "Vacant",
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else
            setFormData({
                roomNumber: "",
                hostelName: "",
                capacity: "",
                currentOccupancy: "",
                status: "Vacant",
            });
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-pink-600 transition"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-pink-600 mb-4">
                    {initialData ? "Edit Room" : "Add Room"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="roomNumber"
                        placeholder="Room Number"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        required
                        disabled={!!initialData}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        name="hostelName"
                        placeholder="Hostel Name"
                        value={formData.hostelName}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                    />
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="number"
                        name="currentOccupancy"
                        placeholder="Current Occupancy"
                        value={formData.currentOccupancy}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                    >
                        <option value="Vacant">Vacant</option>
                        <option value="Filled">Filled</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-cyan-400 text-white py-2 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition"
                    >
                        {initialData ? "Update Room" : "Add Room"}
                    </button>
                </form>
            </div>
        </div>
    );
}
