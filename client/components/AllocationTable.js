"use client";

export default function AllocationTable({ allocations }) {
    return (
        <div className="bg-gray-50 rounded-xl shadow-sm p-5">
            <h2
                data-aos="fade-down"
                data-aos-delay="100"
                className="text-xl font-semibold mb-4 text-gray-700"
            >
                Current Allocations
            </h2>

            {allocations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                    No allocations found yet.
                </p>
            ) : (
                <div
                    className="
            relative
            overflow-x-auto 
            overflow-y-hidden 
            rounded-lg
            scrollbar-thin 
            scrollbar-thumb-gray-300 
            scrollbar-track-gray-100
            sm:-mx-5 sm:px-5
          "
                >
                    {/* optional scroll hint */}
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-gray-50 w-8 h-full pointer-events-none sm:hidden"></div>

                    <table className="min-w-full text-sm sm:text-base border-collapse">
                        <thead
                            data-aos="fade-up"
                            data-aos-delay="100"
                            className="bg-pink-100 text-pink-800"
                        >
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left font-semibold whitespace-nowrap">
                                    Student Name
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left font-semibold whitespace-nowrap">
                                    Room Number
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left font-semibold whitespace-nowrap">
                                    Hostel
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allocations.map((a, i) => (
                                <tr
                                    data-aos="fade-up"
                                    data-aos-delay={200 + i * 50}
                                    key={i}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        {a.student}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        {a.roomNumber}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        {a.hostel}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
