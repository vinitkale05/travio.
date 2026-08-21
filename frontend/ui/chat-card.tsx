"use client"

import {
    SmilePlus,
    Check,
    CheckCheck,
    MoreHorizontal,
    Send,
    X,
} from "lucide-react"
import { cn } from "@shared/utils"
import { useState, useEffect, useRef } from "react"

export interface Message {
    id: string
    content: string
    sender: {
        name: string
        avatar: string
        isOnline: boolean
        isCurrentUser?: boolean
    }
    timestamp: string
    status: "sent" | "delivered" | "read"
    reactions?: Array<{
        emoji: string
        count: number
        reacted: boolean
    }>
}

interface ChatCardProps {
    chatName?: string
    membersCount?: number
    onlineCount?: number
    initialMessages?: Message[]
    currentUser?: {
        name: string
        avatar: string
    }
    onSendMessage?: (message: string) => void
    onReaction?: (messageId: string, emoji: string) => void
    onMoreClick?: () => void
    onClose?: () => void
    className?: string
    theme?: "light" | "dark"
}

export function ChatCard({
    chatName = "Team Chat",
    membersCount = 3,
    onlineCount = 2,
    initialMessages = [],
    currentUser = {
        name: "You",
        avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-03-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
    },
    onSendMessage,
    onReaction,
    onMoreClick,
    onClose,
    className,
    theme = "dark",
}: ChatCardProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [inputValue, setInputValue] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMessages(initialMessages)
    }, [initialMessages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = () => {
        if (!inputValue.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: {
                name: currentUser.name,
                avatar: currentUser.avatar,
                isOnline: true,
                isCurrentUser: true,
            },
            timestamp: new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }),
            status: "sent",
        }

        setMessages((prev) => [...prev, newMessage])
        setInputValue("")
        onSendMessage?.(inputValue)

        // Simulation of receiving message status
        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
                ),
            )
        }, 1000)

        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessage.id ? { ...msg, status: "read" } : msg,
                ),
            )
        }, 2000)
    }

    const handleReaction = (messageId: string, emoji: string) => {
        setMessages((prev) =>
            prev.map((message) => {
                if (message.id === messageId) {
                    const existingReaction = message.reactions?.find(
                        (r) => r.emoji === emoji,
                    )
                    const newReactions = message.reactions || []

                    if (existingReaction) {
                        return {
                            ...message,
                            reactions: newReactions.map((r) =>
                                r.emoji === emoji
                                    ? {
                                        ...r,
                                        count: r.reacted ? r.count - 1 : r.count + 1,
                                        reacted: !r.reacted,
                                    }
                                    : r,
                            ),
                        }
                    } else {
                        return {
                            ...message,
                            reactions: [...newReactions, { emoji, count: 1, reacted: true }],
                        }
                    }
                }
                return message
            }),
        )
        onReaction?.(messageId, emoji)
    }

    return (
        <div
            className={cn(
                "w-full max-w-2xl mx-auto rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] bg-white/95 backdrop-blur-3xl border border-slate-200/60 ring-1 ring-white/20",
                className,
            )}
        >
            <div className="flex flex-col h-[550px]">
                {/* Header */}
                <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/40 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="w-12 h-12 rounded-[1.25rem] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-2 border-white transition-transform duration-300 group-hover:scale-105">
                                <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 tracking-tight leading-none" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                {chatName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5 leading-none">
                                <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-[0.2em] opacity-90">Travio Premium Sync</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={onMoreClick}
                            className="p-2.5 rounded-2xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-900 transition-all active:scale-95"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth">
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500", message.sender.isCurrentUser ? "items-end" : "items-start")}>
                            <div className={cn("flex gap-3 max-w-[85%] relative group", message.sender.isCurrentUser ? "flex-row-reverse" : "flex-row")}>
                                {!message.sender.isCurrentUser && (
                                    <img
                                        src={message.sender.avatar}
                                        alt={message.sender.name}
                                        className="w-8 h-8 rounded-full border border-white shadow-sm shrink-0 sticky top-0 mt-1"
                                    />
                                )}
                                <div className={cn("flex flex-col", message.sender.isCurrentUser ? "items-end" : "items-start")}>
                                    <div className={cn(
                                        "px-4.5 py-3 rounded-[1.5rem] text-[13px] font-medium transition-all duration-300",
                                        message.sender.isCurrentUser
                                            ? "bg-[#1A1A1A] text-white border-white/5 rounded-tr-none shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
                                            : "bg-white text-slate-900 border border-slate-100 rounded-tl-none font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.05)]"
                                    )} style={{ fontFamily: "'Inter', sans-serif", paddingLeft: '1.125rem', paddingRight: '1.125rem' }}>
                                        {message.content}
                                    </div>

                                    {message.reactions && message.reactions.length > 0 && (
                                        <div className="flex items-center gap-1 mt-2.5">
                                            {message.reactions.map((reaction) => (
                                                <button
                                                    key={reaction.emoji}
                                                    onClick={() =>
                                                        handleReaction(message.id, reaction.emoji)
                                                    }
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 transition-all active:scale-90",
                                                        reaction.reacted
                                                            ? "bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20"
                                                            : "bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100"
                                                    )}
                                                >
                                                    <span className="text-[14px] leading-none">{reaction.emoji}</span>
                                                    <span className="text-[10px] font-black">{reaction.count}</span>
                                                </button>
                                            ))}
                                            <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-slate-600">
                                                <SmilePlus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}

                                    <div className={cn("flex items-center gap-2 mt-2 px-1", message.sender.isCurrentUser ? "justify-end" : "justify-start")}>
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#0066FF] opacity-60">
                                            {message.sender.isCurrentUser ? "Verified User" : "Premium Member"}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 opacity-30 uppercase tracking-[0.1em]">
                                            {message.timestamp}
                                        </span>
                                        {message.sender.isCurrentUser && (
                                            <div className="flex items-center ml-1 space-x-0.5">
                                                {message.status === "read" && (
                                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                                )}
                                                {message.status === "delivered" && (
                                                    <CheckCheck className="w-3.5 h-3.5 text-slate-300" />
                                                )}
                                                {message.status === "sent" && (
                                                    <Check className="w-3.5 h-3.5 text-slate-200" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-6 border-t border-slate-50 bg-white/40 backdrop-blur-md relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }
                                }}
                                placeholder="Compose secure message..."
                                className={cn(
                                    "w-full px-6 py-4 rounded-2xl border border-slate-200/60 bg-white text-[12px] font-bold outline-none ring-primary/20 transition-all duration-300",
                                    "focus:ring-2 focus:border-primary/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
                                    "placeholder:text-slate-300 text-slate-800"
                                )}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-[#0066FF] transition-all hover:scale-110 active:scale-90"
                            >
                                <SmilePlus className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className="p-4 bg-[#0066FF] text-white rounded-2xl hover:bg-[#0052CC] transition-all shadow-[0_8px_24px_-4px_rgba(0,102,255,0.4)] active:scale-95 disabled:opacity-20 disabled:shadow-none shrink-0"
                        >
                            <Send className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                    <div className="mt-4 flex items-center justify-center pt-1 border-t border-slate-50/50">
                        <div className="flex items-center gap-2 opacity-20">
                            <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-500">Secure Peer-to-Peer Node Activated</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
