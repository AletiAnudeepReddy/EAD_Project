"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, Users, BedDouble, ClipboardList, BarChart3, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();

    const menuItems = [
        { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
        { name: "Students", icon: Users, path: "/admin/students" },
        { name: "Rooms", icon: BedDouble, path: "/admin/rooms" },
        { name: "Allocation", icon: ClipboardList, path: "/admin/allocation" },
        { name: "Reports", icon: BarChart3, path: "/admin/reports" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("adminLoggedIn");
        router.push("/");
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-pink-100 via-white to-cyan-100">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } bg-white/80 backdrop-blur-md border-r border-pink-200 shadow-xl transition-all duration-300 fixed h-screen flex flex-col justify-between`}
            >
                <div>
                    {/* Logo + Toggle */}
                    <div className="flex items-center justify-between p-5 border-b border-pink-100">
                        <div className="flex items-center gap-2">
                            <Home className="text-pink-600 w-7 h-7" />
                            {isSidebarOpen && (
                                <span className="text-xl font-bold text-pink-600">HostelHub</span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-pink-600 transition"
                        >
                            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="mt-6 flex flex-col gap-2 px-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-pink-100 hover:to-cyan-100 hover:text-pink-600 transition-all"
                            >
                                <item.icon className="w-5 h-5 text-pink-600" />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-pink-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-cyan-400 text-white py-2 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition"
                    >
                        <LogOut size={18} />
                        {isSidebarOpen && "Logout"}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"
                    } p-8 pt-20`}
            >
                {/* Header */}
                <div className="mb-8 bg-white/60 backdrop-blur-md border border-pink-100 rounded-2xl p-4 shadow-sm flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-pink-600">Admin Dashboard</h1>
                    <p className="text-gray-600 text-sm">Welcome back, Admin 👋</p>
                </div>

                {/* Page Content */}
                <div className="bg-white/70 backdrop-blur-md border border-pink-100 rounded-2xl p-6 shadow-md">
                    {children}
                </div>
            </main>
        </div>
    );
}
