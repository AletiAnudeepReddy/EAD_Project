"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import StudentForm from "@/components/StudentForm";

export default function StudentsPage() {
    const [students, setStudents] = useState([
        {
            name: "Shiva",
            rollNumber: "21ECE123",
            department: "ECE",
            gender: "Male",
            roomId: "A-101",
            contact: "9876543210",
        },
        {
            name: "Priya",
            rollNumber: "21CSE087",
            department: "CSE",
            gender: "Female",
            roomId: "B-202",
            contact: "9876501234",
        },
    ]);

    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editStudent, setEditStudent] = useState(null);

    // Filtered data
    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    // Add or Update
    const handleSave = (data) => {
        if (editStudent) {
            setStudents(
                students.map((s) =>
                    s.rollNumber === editStudent.rollNumber ? data : s
                )
            );
            setEditStudent(null);
        } else {
            setStudents([...students, data]);
        }
        setIsModalOpen(false);
    };

    // Delete
    const handleDelete = (rollNumber) => {
        setStudents(students.filter((s) => s.rollNumber !== rollNumber));
    };

    return (
        <div className="p-2 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent">Manage Students</h1>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-pink-400 outline-none w-64"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setEditStudent(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:scale-105 transition"
                    >
                        <Plus size={18} /> Add Student
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-pink-100 text-pink-800">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Roll No</th>
                            <th className="py-3 px-4">Department</th>
                            <th className="py-3 px-4">Gender</th>
                            <th className="py-3 px-4">Room</th>
                            <th className="py-3 px-4">Contact</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b hover:bg-pink-50 transition duration-150"
                                >
                                    <td className="py-3 px-4">{student.name}</td>
                                    <td className="py-3 px-4">{student.rollNumber}</td>
                                    <td className="py-3 px-4">{student.department}</td>
                                    <td className="py-3 px-4">{student.gender}</td>
                                    <td className="py-3 px-4">{student.roomId}</td>
                                    <td className="py-3 px-4">{student.contact}</td>
                                    <td className="py-3 px-4 flex justify-center gap-3">
                                        <button
                                            onClick={() => {
                                                setEditStudent(student);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.rollNumber)}
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
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500 italic"
                                >
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <StudentForm
                    setIsOpen={setIsModalOpen}
                    onSave={handleSave}
                    initialData={editStudent}
                />
            )}
        </div>
    );
}
