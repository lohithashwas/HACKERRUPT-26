import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Siren,
    ShieldCheck,
    BarChart3,
    BrainCircuit,
    FileText,
    FileSpreadsheet,
    Settings,
    HelpCircle
} from "lucide-react"

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/", count: null },
    { icon: Siren, label: "Emergency Alerts", href: "/alerts", count: 3, variant: "destructive" },
    { icon: ShieldCheck, label: "Safety Zones", href: "/geofence", count: null },
    { icon: BarChart3, label: "Analytics", href: "/analytics", count: null },
    { icon: BrainCircuit, label: "Predictions", href: "/predictions", count: "AI", variant: "default" },
    { icon: FileText, label: "Audit Logs", href: "/audit", count: null },
    { icon: FileSpreadsheet, label: "E FIR Registration", href: "/efir", count: null },
    { icon: Settings, label: "System Settings", href: "/settings", count: null },
    { icon: HelpCircle, label: "Documentation", href: "/help", count: null },
]

export function Sidebar() {
    const location = useLocation()

    return (
        <aside className="w-72 bg-dark-lighter border-r border-gray-800 flex-shrink-0 overflow-y-auto h-screen hidden md:block">
            <div className="p-6">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 animate-fade-in">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-white tracking-tight">Protect-R</h1>
                        <p className="text-xs text-gray-400">Women Safety Platform</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={index}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/20 translate-x-1"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                                <span>{item.label}</span>
                                {item.count && (
                                    <span className={cn(
                                        "ml-auto text-xs px-2 py-0.5 rounded-full",
                                        item.variant === "destructive" ? "bg-red-600 text-white" :
                                            item.variant === "default" ? "bg-red-900/40 text-red-400" : "bg-gray-800"
                                    )}>
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    )
}
