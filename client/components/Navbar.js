"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Home } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function AdminNavbar() {
    const [isOpen, setIsOpen] = useState(false); // mobile menu
    const [isAuthOpen, setIsAuthOpen] = useState(false); // auth modal
    const [isAdminPage, setIsAdminPage] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        // Detect if current page is inside /admin
        setIsAdminPage(pathname.startsWith("/admin"));
    }, [pathname]);

    return (
        <>
            <nav
                className={`fixed w-full z-50 shadow-xl transition-all duration-300 ${isAdminPage
                        ? "bg-gradient-to-r from-pink-600 to-cyan-500"
                        : "bg-pink-600"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Left Side: Logo / App Name */}
                        <div className="flex items-center space-x-3">
                            <Home className="text-white w-8 h-8" />
                            <span className="text-white text-2xl font-extrabold tracking-wide">
                                HostelHub
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center">
                            {!isAdminPage && (
                                <button
                                    onClick={() => setIsAuthOpen(true)} // open modal instead of redirect
                                    className="bg-white text-pink-600 font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-pink-50 transition duration-300"
                                >
                                    Get Started
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-white focus:outline-none"
                            >
                                {isOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {isOpen && (
                    <div className="md:hidden shadow-lg border-t border-pink-300 bg-opacity-95 transition">
                        <div className="flex flex-col items-center py-4 space-y-3">
                            {!isAdminPage && (
                                <button
                                    onClick={() => {
                                        setIsAuthOpen(true);
                                        setIsOpen(false);
                                    }}
                                    className="bg-white text-pink-600 font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-pink-50 transition duration-300"
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Auth Modal */}
            <AuthModal isOpen={isAuthOpen} setIsOpen={setIsAuthOpen} />
        </>
    );
}
