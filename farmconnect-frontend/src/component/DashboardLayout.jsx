
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children, role }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-green-900 text-white z-40 flex items-center justify-between p-4 shadow-md">
                <span className="font-bold text-xl tracking-tight">FarmConnect</span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ease-in-out pt-20 md:pt-0 ${isSidebarOpen ? "md:ml-[250px]" : "md:ml-[80px]"
                    } w-full`}
            >
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
