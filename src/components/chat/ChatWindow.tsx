import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { sendMessageToGemini } from '@/services/geminiService';
import { Send, Trash2, X, MessageCircle, AlertTriangle } from 'lucide-react';

export function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([
        {
            id: 1,
            text: "🛡️ **WOMEN SAFETY ASSISTANT**\n\nHello! I'm here to help you with:\n\n• **Personal Safety Tips**\n• **Emergency Response**\n• **Legal Rights**\n• **Mental Health Support**\n\n**How can I assist you today?**",
            sender: 'bot',
            type: 'greeting'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const systemPrompt = `You are a compassionate Women Safety Assistant AI. Your role is to provide guidance on:\n1. Personal Safety\n2. Emergency Response\n3. Legal Rights\n4. Self-Defense\n5. Mental Health\n\nCRITICAL: If someone is in danger, URGENTLY recommend calling emergency services (USA: 911, India: 112). Be empathetic and factual.`;

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = {
            id: Date.now(),
            text: input.trim(),
            sender: 'user',
            type: 'user'
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await sendMessageToGemini(userMsg.text, systemPrompt, messages);

            const botMsg = {
                id: Date.now() + 1,
                text: response,
                sender: 'bot',
                type: 'response'
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err: any) {
            console.error(err);
            const errorMessage = err?.message || "Unknown error";
            setError(`Error: ${errorMessage}`);
            const errorMsg = {
                id: Date.now() + 1,
                text: `⚠️ **Connection Error**: ${errorMessage}\n\nPlease check your API Key and internet connection.`,
                sender: 'bot',
                type: 'error'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-600/30 flex items-center justify-center transition-transform hover:scale-110 z-50 animate-bounce-subtle"
                >
                    <MessageCircle className="w-7 h-7" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-dark-lighter border border-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in overflow-hidden">

                    {/* Header */}
                    <div className="p-4 bg-red-900/20 border-b border-red-900/30 flex items-center justify-between backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <div>
                                <h3 className="font-bold text-white text-sm">Safety Assistant</h3>
                                <p className="text-xs text-gray-400">Always available</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setMessages(messages.slice(0, 1))}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Clear Chat"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-500/10 border-b border-red-500/20 p-2 flex items-center gap-2 text-xs text-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            {error}
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
                        {messages.map((msg, idx) => (
                            <ChatMessage key={idx} message={msg} />
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                </div>
                                <div className="bg-dark-card border border-gray-700 text-gray-400 rounded-2xl rounded-tl-none px-4 py-2 text-sm flex items-center gap-1">
                                    <span>Thinking</span>
                                    <span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-800 bg-dark-lighter">
                        <form onSubmit={handleSendMessage} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your question..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-gray-600"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-gray-600">AI can make mistakes. Verify important info.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
