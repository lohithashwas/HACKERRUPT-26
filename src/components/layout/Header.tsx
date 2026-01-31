import { Search, LogOut, Bell } from "lucide-react"

export function Header() {
    return (
        <header className="px-8 py-5 border-b border-gray-800 bg-dark/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center justify-between">
                <div className="animate-fade-in">
                    <h1 className="text-2xl font-bold text-white">
                        Women Safety Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Privacy-first, hands-free protection built for real-world emergencies.</p>
                </div>

                <div className="flex items-center gap-6 animate-slide-up">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            placeholder="Search by User ID or phone..."
                            className="pl-10 pr-4 py-2 bg-dark-lighter border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all w-80 placeholder:text-gray-600"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-white">Admin User</div>
                                <div className="text-xs text-gray-500">Authorized</div>
                            </div>
                            <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                                AD
                            </div>
                        </div>

                        {/* Logout */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg border border-white/10 transition-all ml-2">
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
