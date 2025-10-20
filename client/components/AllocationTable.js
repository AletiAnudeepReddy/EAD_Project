"use client";

export default function AllocationTable({ allocations }) {
    return (
        <div className="bg-gray-50 rounded-xl shadow-sm p-5">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Current Allocations
            </h2>

            {allocations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                    No allocations found yet.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-pink-100 text-pink-800 ">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">
                                    Student Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">
                                    Room Number
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">
                                    Hostel
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allocations.map((a, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">{a.student}</td>
                                    <td className="px-6 py-4">{a.roomNumber}</td>
                                    <td className="px-6 py-4">{a.hostel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
