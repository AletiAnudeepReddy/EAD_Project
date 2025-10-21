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

    // Filtered data (search across name, roll, dept, room)
    const filteredStudents = students.filter((s) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            s.name.toLowerCase().includes(q) ||
            s.rollNumber.toLowerCase().includes(q) ||
            (s.department || "").toLowerCase().includes(q) ||
            (s.roomId || "").toLowerCase().includes(q)
        );
    });

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
            setStudents([data, ...students]); // newest first
        }
        setIsModalOpen(false);
    };

    // Delete
    const handleDelete = (rollNumber) => {
        if (!confirm("Delete this student?")) return;
        setStudents(students.filter((s) => s.rollNumber !== rollNumber));
    };

    return (
        <div className=" md:p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h1
                    data-aos="zoom-out"
                    data-aos-delay="100"
                    className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent text-center md:text-left"
                >
                    Manage Students
                </h1>

                {/* Search + Add (stacks on mobile) */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch gap-3">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-3 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search student by name, roll, dept or room..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-pink-400 outline-none w-full"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setEditStudent(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:scale-105 transition w-full sm:w-auto"
                    >
                        <Plus size={16} /> Add Student
                    </button>
                </div>
            </div>

            {/* ===== Mobile: Card List (shown on small screens) ===== */}
            <div className="space-y-4 md:hidden">
                {filteredStudents.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No students found.</div>
                )}

                {filteredStudents.map((student) => (
                    <div
                        key={student.rollNumber}
                        className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                                <span className="text-sm text-gray-500">{student.rollNumber}</span>
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Dept:</span> {student.department || "—"}
                                <span className="mx-2">•</span>
                                <span className="font-medium">Room:</span> {student.roomId || "—"}
                            </p>

                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Gender:</span> {student.gender || "—"}
                                <span className="mx-2">•</span>
                                <span className="font-medium">Contact:</span> {student.contact || "—"}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mt-3 sm:mt-0">
                            <button
                                onClick={() => {
                                    setEditStudent(student);
                                    setIsModalOpen(true);
                                }}
                                className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                                aria-label="Edit"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(student.rollNumber)}
                                className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                                aria-label="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== Desktop: Table (md and up) - unchanged layout visually ===== */}
            <div className="hidden md:block mt-2">
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                    <table className="min-w-full text-sm text-left border-collapse">
                        <thead data-aos="fade-up" data-aos-delay="100">
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
                                        data-aos="fade-up"
                                        data-aos-delay={`${150 + idx * 30}`}
                                        key={student.rollNumber}
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
                                    <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                                        No students found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
