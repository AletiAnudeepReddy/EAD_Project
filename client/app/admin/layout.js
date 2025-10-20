"use client";
import { useState } from "react";
import Link from "next/link";
import {
    Menu,
    X,
    Home,
    Users,
    BedDouble,
    ClipboardList,
    BarChart3,
    LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

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
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } bg-white/80 backdrop-blur-md border-r border-pink-200 shadow-xl transition-all duration-500 fixed h-screen flex flex-col justify-between`}
            >
                <div>
                    {/* Logo + Toggle */}
                    <div className="flex items-center justify-between p-5 border-b border-pink-100">
                        <Link href="/">
                            <div className="flex items-center gap-2">
                                <Home className="text-pink-600 w-7 h-7" />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            key="logo-text"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="text-xl font-bold text-pink-600"
                                        >
                                            HostelHub
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-pink-600 transition"
                        >
                            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="mt-6 flex flex-col gap-2 px-3">
                        {menuItems.map((item, i) => {
                            const Icon = item.icon;
                            const active = pathname === item.path;
                            return (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: "easeInOut" }}
                                >
                                    <Link
                                        href={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${active
                                            ? "bg-gradient-to-r from-pink-500 to-cyan-400 text-white shadow-md"
                                            : "text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-cyan-100 hover:text-pink-600"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {isSidebarOpen && <span>{item.name}</span>}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="p-4 border-t border-pink-100"
                >
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-cyan-400 text-white py-2 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition"
                    >
                        <LogOut size={18} />
                        {isSidebarOpen && "Logout"}
                    </button>
                </motion.div>
            </motion.aside>

            {/* Main Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`flex-1 transition-all duration-500 ${isSidebarOpen ? "ml-64" : "ml-20"} p-8 pt-5`}
            >
                {/* Header */}
                <motion.div
                    initial={{ y: -25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="mb-6 sticky top-0 z-100 backdrop-blur-3xl border-b-3 border-dashed border-pink-200 p-2 flex justify-between items-center"
                >
                    <h1 className="text-2xl font-bold text-pink-600">Admin Panel</h1>
                    <p className="text-gray-600 text-sm">
                        Welcome back,{" "}
                        <span className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-cyan-400 bg-clip-text text-transparent">
                            Anudeep
                        </span>{" "}
                        👋
                    </p>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="bg-white/70 backdrop-blur-md border border-pink-100 rounded-2xl p-6 shadow-md"
                >
                    {children}
                </motion.div>
            </motion.main>
        </div>
    );
}
