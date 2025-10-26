"use client";

export default function AllocationTable({ allocations }) {
    return (
        <section className="mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
                <h2
                    data-aos="fade-down"
                    data-aos-delay="100"
                    className="text-lg sm:text-xl font-semibold mb-3 text-gray-700 text-center sm:text-left"
                >
                    Current Allocations
                </h2>

                {/* Empty state */}
                {(!allocations || allocations.length === 0) ? (
                    <p className="text-gray-500 text-center py-6">
                        No allocations found yet.
                    </p>
                ) : (
                    <>
                        {/* ====== Mobile View (Cards) ====== */}
                        <div className="space-y-3 md:hidden">
                            {allocations.map((a, i) => (
                                <div
                                    key={a._id || i}
                                    data-aos="fade-up"
                                    data-aos-delay={150 + i * 40}
                                    className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            {a.student?.name || "—"}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            {a.room?.roomNumber || "—"}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Hostel:</span>{" "}
                                            {a.room?.hostelName || "—"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ====== Desktop View (Table) ====== */}
                        <div className="hidden md:block overflow-x-auto rounded-lg">
                            <table className="min-w-full text-sm md:text-base border-collapse">
                                <thead className="bg-pink-100 text-pink-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Student Name
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Roll Number
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Room Number
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Hostel
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {allocations.map((a, i) => (
                                        <tr
                                            key={a._id || i}
                                            data-aos="fade-up"
                                            data-aos-delay={180 + i * 40}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-3">{a.student?.name || "—"}</td>
                                            <td className="px-4 py-3">{a.student?.rollNumber || "—"}</td>
                                            <td className="px-4 py-3">{a.room?.roomNumber || "—"}</td>
                                            <td className="px-4 py-3">{a.room?.hostelName || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
