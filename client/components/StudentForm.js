"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function StudentForm({ setIsOpen, onSave, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        rollNumber: "",
        department: "",
        gender: "",
        roomId: "",
        contact: "",
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else
            setFormData({
                name: "",
                rollNumber: "",
                department: "",
                gender: "",
                roomId: "",
                contact: "",
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
                    {initialData ? "Edit Student" : "Add Student"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                        />
                        <input
                            name="rollNumber"
                            placeholder="Roll Number"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            required
                            disabled={!!initialData}
                            className="border rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                        />
                        <input
                            name="department"
                            placeholder="Department"
                            value={formData.department}
                            onChange={handleChange}
                            className="border rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                        />
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="border rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                        >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <input
                            name="roomId"
                            placeholder="Room Number (optional)"
                            value={formData.roomId}
                            onChange={handleChange}
                            className="border rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                        />
                        <input
                            name="contact"
                            placeholder="Contact Number"
                            value={formData.contact}
                            onChange={handleChange}
                            className="border rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-cyan-400 text-white py-2 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition"
                    >
                        {initialData ? "Update Student" : "Add Student"}
                    </button>
                </form>
            </div>
        </div>
    );
}
