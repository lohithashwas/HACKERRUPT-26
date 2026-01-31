import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
    message: {
        text: string;
        sender: 'user' | 'bot';
        type: string;
    }
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isBot = message.sender === 'bot';

    return (
        <div className={cn("flex gap-3 mb-4", isBot ? "" : "flex-row-reverse")}>
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                isBot ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"
            )}>
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1",
                isBot
                    ? "bg-dark-card border border-gray-700 text-gray-100 rounded-tl-none"
                    : "bg-red-600 text-white rounded-tr-none"
            )}>
                <ReactMarkdown
                    components={{
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="marker:text-gray-500" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />
                    }}
                >
                    {message.text}
                </ReactMarkdown>
            </div>
        </div>
    );
}
