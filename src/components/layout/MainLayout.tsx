import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { ChatWindow } from "../chat/ChatWindow"

export function MainLayout() {
    return (
        <div className="flex h-screen bg-black overflow-hidden font-sans text-foreground selection:bg-red-900/30">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[url('/src/assets/noise.png')] bg-repeat opacity-100">
                <Header />
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <Outlet />
                </div>
                <ChatWindow />
            </main>
        </div>
    )
}
