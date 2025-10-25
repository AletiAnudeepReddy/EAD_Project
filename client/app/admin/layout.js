"use client";
import { useState, useEffect } from "react";
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
import { signOut, useSession } from "next-auth/react";

/**
 * AdminLayout
 * - Desktop: left sidebar (unchanged)
 * - Mobile: sidebar hidden, bottom icon-only navbar fixed bottom (md:hidden)
 * - Small top-left menu button on mobile opens a slide-over menu if user wants more
 */
export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // affects desktop only
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // slide-over mobile menu
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                // keep desktop sidebar collapsed on mobile
                setIsSidebarOpen(false);
            } else {
                // restore default desktop state (open)
                setIsSidebarOpen(true);
                setIsMobileMenuOpen(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menuItems = [
        { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
        { name: "Students", icon: Users, path: "/admin/students" },
        { name: "Rooms", icon: BedDouble, path: "/admin/rooms" },
        { name: "Allocation", icon: ClipboardList, path: "/admin/allocation" },
        { name: "Reports", icon: BarChart3, path: "/admin/reports" },
    ];

    const handleLogout = async () => {
        localStorage.removeItem("adminLoggedIn");
        await signOut({ redirect: false });
        router.push("/");
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-pink-100 via-white to-cyan-100">
            {/* ---------- DESKTOP SIDEBAR (visible from md and up) ---------- */}
            <aside
                className={`hidden md:flex flex-col justify-between fixed h-screen transition-all duration-300 z-30
          ${isSidebarOpen ? "w-64" : "w-20"}
          bg-gradient-to-b from-pink-600/30 to-cyan-400/30 backdrop-blur-md border-r border-pink-200 shadow-xl`}
            >
                <div>
                    {/* Logo + toggle */}
                    <div className="flex items-center justify-between p-5 border-b border-pink-100">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            <Home className="text-pink-600 w-7 h-7" />
                            {isSidebarOpen && (
                                <span className="text-2xl font-bold bg-gradient-to-r from-pink-700 to-cyan-600 bg-clip-text text-transparent">HostelHub</span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsSidebarOpen((s) => !s)}
                            className="text-gray-500 hover:text-pink-600"
                            aria-label="Toggle sidebar"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav className="mt-6 flex flex-col gap-2 px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all
                    ${active
                                            ? "bg-gradient-to-r from-pink-500 to-cyan-400 text-white shadow-md"
                                            : "text-gray-700 hover:bg-gradient-to-l hover:from-pink-500 hover:to-cyan-400 hover:text-white hover:opacity"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {isSidebarOpen && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* logout */}
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

            {/* ---------- MOBILE SLIDE-OVER SIDEBAR (only when isMobileMenuOpen) ---------- */}
            {isMobile && isMobileMenuOpen && (
                <div className="fixed inset-0 z-40">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-64 bg-white/95 backdrop-blur-md border-r border-pink-200 shadow-xl p-4 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <Link href="/admin/dashboard" className="flex items-center gap-2">
                                <Home className="text-pink-600 w-7 h-7" />
                                <span className="text-xl font-bold text-pink-600">HostelHub</span>
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close">
                                <X size={22} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 font-medium rounded-md transition-all
                      ${active
                                                ? "bg-gradient-to-r from-pink-500 to-cyan-400 text-white"
                                                : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white py-2 rounded-xl"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- MAIN CONTENT AREA ---------- */}
            <div
                className={`flex-1 min-h-screen transition-all duration-300
          ${/* desktop left margin when sidebar open */ ""}
          md:pl-0`}
            // We keep content full-width on mobile; desktop styles above keep a fixed sidebar.
            >
                {/* ---------- TOP BAR ---------- */}
                <header className="sticky top-0 ml-0 md:ml-64 z-20 bg-gradient-to-r from-pink-600/30 to-cyan-400/30 backdrop-blur-md border-b border-pink-200 p-3 md:p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile: show small menu button top-left to open slide-over */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden text-pink-600"
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Title */}
                        <h1 className="text-2xl ml-6 font-bold bg-gradient-to-r from-pink-700 to-cyan-600 bg-clip-text text-transparent">Admin Panel</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <p className="text-gray-600 text-sm hidden sm:block">
                            Welcome back,
                            <span className="ml-2 font-semibold bg-gradient-to-r from-pink-600 to-cyan-400 bg-clip-text text-transparent">
                                {session?.user?.name ?? "Anudeep"}
                            </span>
                        </p>
                    </div>
                </header>

                {/* ---------- PAGE CONTENT ---------- */}
                <main className={`p-6 md:pl-72` /* md:pl-72 creates space for desktop sidebar */}>
                    <div className="bg-white/70 backdrop-blur-md border border-pink-100 rounded-2xl p-6 shadow-md">
                        {children}
                    </div>
                </main>

                {/* ---------- MOBILE BOTTOM NAV (icons only) ---------- */}
                <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 md:hidden">
                    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-full shadow-lg px-3 py-2 flex items-center gap-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`p-3 rounded-full flex items-center justify-center transition
                    ${active ? "bg-gradient-to-r from-pink-500 to-cyan-400 text-white" : "text-gray-600 hover:bg-pink-50"}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}
