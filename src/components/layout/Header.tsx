import { Search, LogOut, Bell, Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"

export function Header() {
    const navigate = useNavigate()
    const { t, language, setLanguage } = useLanguage()

    const handleLogout = () => {
        // Show confirmation dialog
        const confirmed = window.confirm(t('logout.confirm'))

        if (confirmed) {
            // Clear any stored authentication data (if you have any)
            localStorage.removeItem('userToken')
            localStorage.removeItem('userRole')
            localStorage.removeItem('userData')

            // Navigate to login page
            navigate('/login')
        }
    }

    return (
        <header className="px-8 py-5 border-b border-gray-800 bg-dark/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center justify-between">
                <div className="animate-fade-in">
                    <h1 className="text-2xl font-bold text-white">
                        {t('header.title')}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">{t('header.subtitle')}</p>
                </div>

                <div className="flex items-center gap-6 animate-slide-up">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            placeholder={t('header.search')}
                            className="pl-10 pr-4 py-2 bg-dark-lighter border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all w-80 placeholder:text-gray-600"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'ta')}
                                className="bg-transparent border-none text-white text-sm font-medium focus:outline-none cursor-pointer"
                            >
                                <option value="en" className="bg-gray-900">🇬🇧 English</option>
                                <option value="hi" className="bg-gray-900">🇮🇳 हिन्दी</option>
                                <option value="ta" className="bg-gray-900">🇮🇳 தமிழ்</option>
                            </select>
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-white">{t('header.adminUser')}</div>
                                <div className="text-xs text-gray-500">{t('header.authorized')}</div>
                            </div>
                            <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                                AD
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-600/20 text-white text-sm font-medium rounded-lg border border-white/10 hover:border-red-600/50 transition-all ml-2 group"
                        >
                            <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                            <span className="group-hover:text-red-400 transition-colors">{t('header.logout')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
