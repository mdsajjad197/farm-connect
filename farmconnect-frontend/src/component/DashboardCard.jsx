
export default function DashboardCard({ title, value, icon: Icon, color = "bg-white" }) {
    return (
        <div
            className={`${color} p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative hover:-translate-y-1 hover:shadow-md transition-all duration-300`}
        >
            <div className="z-10 relative">
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className="z-10 relative p-3 bg-gray-50 rounded-xl">
                {Icon && <Icon className="text-gray-700" size={24} />}
            </div>

            {/* Background Decor */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-white/0 to-gray-500/5 rounded-full z-0" />
        </div>
    );
}
