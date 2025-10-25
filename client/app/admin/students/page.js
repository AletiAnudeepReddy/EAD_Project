"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import StudentForm from "@/components/StudentForm";

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editStudent, setEditStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = "http://localhost:5000/api/students";

    // ✅ Fetch all students on page load
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch(API_BASE);
                const data = await res.json();
                setStudents(data || []);
            } catch (err) {
                console.error("Failed to fetch students:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // ✅ Search filter
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

    // ✅ Add or Update student (API integrated)
    const handleSave = async (data) => {
        try {
            if (editStudent) {
                // update
                const res = await fetch(`${API_BASE}/${editStudent._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error("Update failed");
                const updated = await res.json();
                setStudents((prev) =>
                    prev.map((s) => (s._id === updated._id ? updated : s))
                );
                setEditStudent(null);
            } else {
                // add new
                const res = await fetch(API_BASE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error("Create failed");
                const newStudent = await res.json();
                setStudents((prev) => [newStudent, ...prev]);
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Failed to save student. Check console for details.");
        } finally {
            setIsModalOpen(false);
        }
    };

    // ✅ Delete student (API integrated)
    const handleDelete = async (id) => {
        if (!confirm("Delete this student?")) return;
        try {
            const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            setStudents((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete student.");
        }
    };

    // ✅ Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                Loading students...
            </div>
        );
    }

    return (
        <div className="md:p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h1
                    data-aos="zoom-out"
                    data-aos-delay="100"
                    className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent text-center md:text-left"
                >
                    Manage Students
                </h1>

                {/* Search + Add */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
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

            {/* Mobile: Card List */}
            {/* Mobile: Card List */}
            <div className="space-y-4 md:hidden">
                {filteredStudents.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        No students found.
                    </div>
                )}

                {filteredStudents.map((student) => (
                    <div
                        key={student._id}
                        className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {student.name}
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {student.rollNumber}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Dept:</span>{" "}
                                {student.department || "—"}
                                <span className="mx-2">•</span>
                                <span className="font-medium">Room:</span>{" "}
                                {student.roomId
                                    ? `${student.roomId.roomNumber} (${student.roomId.hostelName})`
                                    : "—"}
                            </p>

                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Gender:</span>{" "}
                                {student.gender || "—"}
                                <span className="mx-2">•</span>
                                <span className="font-medium">Contact:</span>{" "}
                                {student.contact || "—"}
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
                                onClick={() => handleDelete(student._id)}
                                className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                                aria-label="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: Table */}
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
                                        key={student._id}
                                        className="border-b hover:bg-pink-50 transition duration-150"
                                    >
                                        <td className="py-3 px-4">{student.name}</td>
                                        <td className="py-3 px-4">{student.rollNumber}</td>
                                        <td className="py-3 px-4">{student.department}</td>
                                        <td className="py-3 px-4">{student.gender}</td>
                                        <td className="py-3 px-4">
                                            {student.roomId
                                                ? `${student.roomId.roomNumber} (${student.roomId.hostelName})`
                                                : "—"}
                                        </td>
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
                                                onClick={() => handleDelete(student._id)}
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
