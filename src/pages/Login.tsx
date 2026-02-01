import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, ArrowRight, Lock, Users, Siren, LockKeyhole, HandHeart, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "../contexts/LanguageContext"

type Role = 'user' | 'police' | 'admin' | 'emergency' | 'volunteer'

export function Login() {
    const navigate = useNavigate()
    const { t, language, setLanguage } = useLanguage()
    const [activeRole, setActiveRole] = useState<Role>('user')
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === '1234') {
            setError('')

            if (activeRole === 'police') {
                navigate("/police/alerts")
            } else {
                navigate("/user/dashboard")
            }
        } else {
            setError(t('login.invalidCredentials'))
        }
    }

    const getRoleConfig = (role: Role) => {
        switch (role) {
            case 'user':
                return {
                    title: t('login.role.user'),
                    icon: Users,
                    desc: t('login.role.userDesc'),
                    placeholder: t('login.role.userPlaceholder'),
                    color: 'from-red-600 to-red-800'
                }
            case 'police':
                return {
                    title: t('login.role.police'),
                    icon: ShieldCheck,
                    desc: t('login.role.policeDesc'),
                    placeholder: t('login.role.policePlaceholder'),
                    color: 'from-blue-700 to-blue-900'
                }
            case 'admin':
                return {
                    title: t('login.role.admin'),
                    icon: LockKeyhole,
                    desc: t('login.role.adminDesc'),
                    placeholder: t('login.role.adminPlaceholder'),
                    color: 'from-emerald-600 to-emerald-900'
                }
            case 'emergency':
                return {
                    title: t('login.role.emergency'),
                    icon: Siren,
                    desc: t('login.role.emergencyDesc'),
                    placeholder: t('login.role.emergencyPlaceholder'),
                    color: 'from-orange-600 to-orange-800'
                }
            case 'volunteer':
                return {
                    title: t('login.role.volunteer'),
                    icon: HandHeart,
                    desc: t('login.role.volunteerDesc'),
                    placeholder: t('login.role.volunteerPlaceholder'),
                    color: 'from-purple-600 to-purple-800'
                }
        }
    }

    const config = getRoleConfig(activeRole)
    const RoleIcon = config.icon

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">

            {/* Language Selector - Top Right */}
            <div className="absolute top-6 right-6 z-50">
                <div className="flex items-center gap-3 bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-xl shadow-2xl">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'ta')}
                        className="bg-transparent border-none text-white text-sm font-medium focus:outline-none cursor-pointer"
                    >
                        <option value="en" className="bg-zinc-900">🇬🇧 English</option>
                        <option value="hi" className="bg-zinc-900">🇮🇳 हिन्दी</option>
                        <option value="ta" className="bg-zinc-900">🇮🇳 தமிழ்</option>
                    </select>
                </div>
            </div>

            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div
                    className="absolute w-[800px] h-[800px] bg-red-600/30 rounded-full blur-[120px] transition-all duration-1000 ease-out"
                    style={{
                        top: mousePosition.y * 0.05,
                        left: mousePosition.x * 0.05,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] transition-all duration-1000 ease-out"
                    style={{
                        bottom: mousePosition.y * 0.02,
                        right: mousePosition.x * 0.02,
                    }}
                />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side - Hero / Welcome */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hidden lg:block space-y-8"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-950/30 border border-red-900/50 text-red-500 text-sm font-medium backdrop-blur-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <span>{t('login.secureAccess')}</span>
                    </div>

                    <h1 className="text-8xl font-extrabold text-white leading-[1.1] tracking-tight">
                        PROTECT-R
                    </h1>

                    <p className="text-gray-400 text-xl max-w-lg leading-relaxed">
                        {t('login.tagline')} <strong>{t('login.taglineStrong')}</strong> {t('login.taglineEnd')}
                    </p>

                    <div className="flex items-center gap-8 pt-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                                    <Users className="w-6 h-6 text-gray-400" />
                                </div>
                            ))}
                        </div>
                        <div className="text-gray-400">
                            <span className="block text-white font-bold text-xl">10k+</span>
                            <span className="text-sm">{t('login.activeOfficers')}</span>
                        </div>
                        <div className="w-px h-12 bg-gray-800" />
                        <div className="text-gray-400">
                            <span className="block text-white font-bold text-xl">24/7</span>
                            <span className="text-sm">{t('login.realTimeCoverage')}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="bg-zinc-950/80 border border-white/10 rounded-3xl p-1.5 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
                >
                    {/* Glowing Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50 pointer-events-none rounded-3xl" />

                    <div className="relative bg-zinc-900/50 rounded-2xl overflow-hidden h-full">

                        {/* Tab Header */}
                        <div className="grid grid-cols-5 gap-0 bg-black/40 border-b border-white/5">
                            {(['user', 'police', 'emergency', 'admin', 'volunteer'] as Role[]).map((role) => {
                                const isActive = activeRole === role
                                const Icon = role === 'user' ? Users : role === 'police' ? ShieldCheck : role === 'emergency' ? Siren : role === 'admin' ? LockKeyhole : HandHeart

                                return (
                                    <button
                                        key={role}
                                        onClick={() => {
                                            setActiveRole(role)
                                            setError('')
                                            setPassword('')
                                        }}
                                        className="relative group h-24 flex flex-col items-center justify-center gap-2 transition-all duration-300 outline-none"
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-white/5 border-b-2 border-red-500"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                            <Icon className={`w-6 h-6 ${isActive ? `text-${role === 'police' ? 'blue' : role === 'admin' ? 'emerald' : role === 'emergency' ? 'orange' : role === 'volunteer' ? 'purple' : 'red'}-500` : ''}`} />
                                        </div>
                                        <span className={`relative z-10 text-[9px] font-bold tracking-widest uppercase ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                            {role}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Content Area */}
                        <div className="p-8 md:p-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeRole + language}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-lg`}>
                                            <RoleIcon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white tracking-tight">{config.title}</h2>
                                            <p className="text-gray-400 text-sm">{config.desc}</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-6">
                                        <div className="space-y-5">
                                            <div className="group space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-red-500 transition-colors">
                                                    {t('login.identity')}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Users className="h-5 w-5 text-gray-600 group-focus-within:text-white transition-colors" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder={config.placeholder}
                                                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-12 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>

                                            <div className="group space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-red-500 transition-colors">
                                                        {t('login.keyPhrase')}
                                                    </label>
                                                    {error && (
                                                        <span className="text-xs text-red-500 font-bold animate-pulse">
                                                            {error}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-white transition-colors" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => {
                                                            setPassword(e.target.value)
                                                            setError('')
                                                        }}
                                                        placeholder="••••••••••••"
                                                        className={`
                                                            w-full bg-black/40 border rounded-xl px-12 py-4 text-white placeholder:text-gray-700 
                                                            focus:outline-none focus:ring-1 transition-all font-medium
                                                            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-800 focus:border-red-500 focus:ring-red-500'}
                                                        `}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm pt-2">
                                            <label className="flex items-center space-x-2.5 cursor-pointer group">
                                                <div className="relative flex items-center">
                                                    <input type="checkbox" className="peer sr-only" />
                                                    <div className="w-5 h-5 border-2 border-gray-700 rounded transition-colors peer-checked:bg-red-600 peer-checked:border-red-600" />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none text-white">
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <span className="text-gray-500 group-hover:text-gray-300 transition-colors font-medium">{t('login.rememberMe')}</span>
                                            </label>
                                            <a href="#" className="text-red-500 hover:text-red-400 font-medium transition-colors hover:underline underline-offset-4">
                                                {t('login.lostAccess')}
                                            </a>
                                        </div>

                                        <button
                                            type="submit"
                                            className={`
                                                w-full bg-gradient-to-r ${config.color} hover:contrast-125
                                                text-white font-bold py-4 rounded-xl transition-all duration-300 
                                                flex items-center justify-center gap-3 group shadow-lg 
                                                uppercase tracking-wide text-sm
                                                hover:shadow-red-900/40 relative overflow-hidden
                                            `}
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                            <span className="relative z-10">{t('login.authenticateAccess')}</span>
                                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </form>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
