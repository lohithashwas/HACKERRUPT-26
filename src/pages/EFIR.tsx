import { FIRForm } from "@/components/EFIR/FIRForm"

export function EFIR() {
    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                        <span role="img" aria-label="shield" className="text-2xl">🛡️</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-none">PROTECT-R</h1>
                        <p className="text-xs text-red-400 font-mono mt-1 tracking-wider">TN POLICE • OFFICIAL E-FIR PORTAL</p>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div>
                            <div className="text-[10px] text-gray-500 font-bold tracking-wider">SYSTEM</div>
                            <div className="text-xs font-medium text-white">ONLINE</div>
                        </div>
                    </div>

                    <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div>
                            <div className="text-[10px] text-gray-500 font-bold tracking-wider">BLOCKCHAIN</div>
                            <div className="text-xs font-medium text-white">CONNECTED</div>
                        </div>
                    </div>
                </div>
            </div>

            <FIRForm />
        </div>
    )
}
