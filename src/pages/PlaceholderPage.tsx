import { Card, CardContent } from "@/components/ui/Card"
import { Construction } from "lucide-react"

export function PlaceholderPage({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in text-center p-6">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
                <Construction className="w-10 h-10 text-red-500 animate-pulse" />
            </div>
            <div className="space-y-2 max-w-md">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                <p className="text-gray-400">{description}</p>
            </div>
            <Card className="bg-dark-card border-gray-800 max-w-lg w-full mt-8">
                <CardContent className="p-6">
                    <p className="text-sm text-gray-500">
                        This module is currently under development or migration.
                        Please check back later or contact the administrator for updates.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
