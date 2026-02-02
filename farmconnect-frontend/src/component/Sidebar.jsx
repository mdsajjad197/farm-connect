import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Users, LogOut, Menu, X, Settings, Package, Shield, User, MessageSquare } from "lucide-react";

export default function Sidebar({ role, isOpen, setIsOpen }) {
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const menuItems = role === "ADMIN" ? [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { name: "Users", icon: Users, path: "/admin/users" },
        { name: "Consumers", icon: Shield, path: "/admin/consumers" },
        { name: "Orders", icon: Package, path: "/admin/orders" },

    ] : [
        { name: "Dashboard", icon: LayoutDashboard, path: "/consumer/dashboard" },
        { name: "My Products", icon: ShoppingBag, path: "/consumer/dashboard?tab=products" },
        { name: "Orders", icon: Package, path: "/consumer/dashboard?tab=orders" },
        { name: "Inbox", icon: MessageSquare, path: "/consumer/dashboard?tab=inbox" },
        { name: "Profile", icon: User, path: "/consumer/dashboard?tab=profile" },
    ];

    return (
        <div
            className={`h-screen bg-green-900 text-white shadow-xl flex flex-col fixed left-0 top-0 z-50 overflow-hidden transition-all duration-300 
            ${isOpen ? "translate-x-0 w-[250px]" : "-translate-x-full md:translate-x-0 md:w-[80px] w-[250px]"}
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16 border-b border-green-800">
                <span
                    className={`font-bold text-xl tracking-tight transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 md:opacity-0"}`}
                >
                    FarmConnect
                </span>
                <button onClick={toggleSidebar} className="p-1 rounded hover:bg-green-800 transition-colors hidden md:block">
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-6 space-y-2 px-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link to={item.path} key={item.name}>
                            <div
                                className={`flex items-center p-3 rounded-lg transition-all cursor-pointer ${isActive ? "bg-green-700 text-green-100 shadow-md transform scale-105" : "hover:bg-green-800 hover:text-green-200"
                                    }`}
                            >
                                <item.icon size={22} className="min-w-[22px]" />
                                <span
                                    className={`ml-4 font-medium whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100 block" : "opacity-0 hidden"}`}
                                >
                                    {item.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-green-800">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
                        navigate("/login");
                    }}
                    className="flex items-center p-3 w-full rounded-lg hover:bg-red-600/20 hover:text-red-300 transition-colors text-red-100"
                >
                    <LogOut size={22} className="min-w-[22px]" />
                    <span
                        className={`ml-4 font-medium transition-opacity duration-200 ${isOpen ? "opacity-100 block" : "opacity-0 hidden"}`}
                    >
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
}
