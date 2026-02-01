import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import {
    LayoutDashboard,
    Siren,
    ShieldCheck,
    BarChart3,
    BrainCircuit,
    FileText,
    FileSpreadsheet,
    Settings,
    RadioTower,
    Camera,
    Volume2,
    Activity
} from "lucide-react"

export function Sidebar({ role }: { role?: 'user' | 'police' }) {
    const location = useLocation()
    const { t } = useLanguage()

    const userItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), href: "/user/dashboard", count: null },
        { icon: Activity, label: t('sidebar.vitals'), href: "/user/vitals", count: "LIVE", variant: "default" },
        { icon: ShieldCheck, label: t('sidebar.safetyZones'), href: "/user/geofence", count: null },
        { icon: RadioTower, label: t('sidebar.sosBeacon'), href: "/user/sos", count: null },
        { icon: Volume2, label: t('sidebar.guardianVoice'), href: "/user/guardian-voice", count: "LIVE", variant: "destructive" },
        { icon: BrainCircuit, label: t('sidebar.predictions'), href: "/user/predictions", count: "AI", variant: "default" },
        { icon: FileSpreadsheet, label: t('sidebar.fileEFIR'), href: "/user/efir", count: null },
    ]

    const policeItems = [
        { icon: Siren, label: t('sidebar.emergencyAlerts'), href: "/police/alerts", count: 3, variant: "destructive" },
        { icon: BarChart3, label: t('sidebar.analytics'), href: "/police/analytics", count: null },
        { icon: Camera, label: t('sidebar.surveillanceHub'), href: "/police/surveillance", count: "LIVE", variant: "destructive" },
        { icon: FileText, label: t('sidebar.auditLogs'), href: "/police/audit", count: null },
        { icon: FileSpreadsheet, label: t('sidebar.firRegistry'), href: "/police/efir-registry", count: null },
        { icon: ShieldCheck, label: t('sidebar.safetyZonesAdmin'), href: "/police/geofence-admin", count: null },
        { icon: Settings, label: t('sidebar.systemSettings'), href: "/police/settings", count: null },
    ]

    // Default to user items if no role specified, or merge? 
    // Actually, if role is undefined, we might be on a public page or generic layout.
    // But per App.tsx, we pass explicit roles.
    const items = role === 'police' ? policeItems : userItems

    return (
        <aside className="w-72 bg-dark-lighter border-r border-gray-800 flex-shrink-0 overflow-y-auto h-screen hidden md:block">
            <div className="p-6">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 animate-fade-in">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${role === 'police' ? 'bg-blue-900 shadow-blue-900/20' : 'bg-gradient-to-br from-red-600 to-red-800 shadow-red-900/20'}`}>
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-white tracking-tight">{role === 'police' ? t('sidebar.policeCommand') : t('sidebar.protectR')}</h1>
                        <p className="text-xs text-gray-400">{role === 'police' ? t('sidebar.officialTerminal') : t('sidebar.womenSafetyPlatform')}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {items.map((item, index) => {
                        const isActive = location.pathname.startsWith(item.href)
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
