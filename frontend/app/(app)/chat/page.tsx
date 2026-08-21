"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Search, X, Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { Input } from "@frontend/ui/ui/input";
import { MessageDock } from "@frontend/ui/message-dock";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessageList } from "@frontend/ui/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper } from "@frontend/ui/chat-bubble";
import { ChatInput } from "@frontend/ui/chat-input";
import { Button } from "@frontend/ui/ui/button";

interface AppMessage {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isAi?: boolean;
}

interface ChatThread {
    characterId: string;
    messages: AppMessage[];
    isThinking: boolean;
}

export default function ChatPage() {
    const { user } = useUser();
    const [threads, setThreads] = useState<Record<string, ChatThread>>({});
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [input, setInput] = useState("");

    const handleSend = (text: string, character?: any) => {
        const targetCharId = character?.id || activeChatId;
        if (!targetCharId) return;

        const targetCharacter = character || [
            { id: "pranav", name: "Pranav Gawai", avatar: user?.imageUrl || "https://i.pravatar.cc/150?u=pranav" },
            { id: "ananya", name: "Ananya Mehra", avatar: "https://i.pravatar.cc/150?u=ananya" },
            { id: "vikram", name: "Vikram Singh", avatar: "https://i.pravatar.cc/150?u=vikram" },
            { id: "rahul", name: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?u=rahul" },
        ].find(c => c.id === targetCharId);

        if (!threads[targetCharId]) {
            setThreads(prev => ({
                ...prev,
                [targetCharId]: { characterId: targetCharId, messages: [], isThinking: false }
            }));
        }

        const userMsg: AppMessage = {
            id: Math.random().toString(),
            text,
            sender: user?.firstName || "You",
            timestamp: new Date()
        };

        setThreads(prev => ({
            ...prev,
            [targetCharId]: {
                ...prev[targetCharId],
                messages: [...(prev[targetCharId]?.messages || []), userMsg],
                isThinking: true
            }
        }));

        setActiveChatId(targetCharId);

        setTimeout(() => {
            const aiMsg: AppMessage = {
                id: Math.random().toString(),
                text: `Premium messaging feature will soon be available on the Travio application.`,
                sender: "Travio AI",
                timestamp: new Date(),
                isAi: true
            };
            setThreads(prev => ({
                ...prev,
                [targetCharId]: {
                    ...prev[targetCharId],
                    messages: [...prev[targetCharId].messages, aiMsg],
                    isThinking: false
                }
            }));
        }, 1500);
    };

    const thread = activeChatId ? threads[activeChatId] : null;
    const activeCharacter = [
        { id: "pranav", name: "Pranav Gawai", avatar: user?.imageUrl || "https://i.pravatar.cc/150?u=pranav" },
        { id: "ananya", name: "Ananya Mehra", avatar: "https://i.pravatar.cc/150?u=ananya" },
        { id: "vikram", name: "Vikram Singh", avatar: "https://i.pravatar.cc/150?u=vikram" },
        { id: "rahul", name: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?u=rahul" },
    ].find(c => c.id === activeChatId) || { name: "Guest", avatar: "" };

    const TravioLogoIcon = () => (
        <img src="/icon.svg" alt="Travio" className="w-full h-full object-cover" />
    );

    return (
        <div className="min-h-screen flex flex-col font-inter text-slate-900 bg-transparent selection:bg-primary/10 overflow-hidden">
            <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAFAFA]/60 backdrop-blur-md border-b border-slate-200 h-[72px] flex items-center justify-between px-8" style={{ left: 'var(--sidebar-width, 240px)' }}>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-[#1A1A1A] font-medium">Messaging</span>
                </div>

                <div className="flex items-center gap-4">
                    <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 ring-1 ring-slate-200 shadow-sm" } }} />
                </div>
            </header>

            <main className="flex-1 mt-[72px] flex relative overflow-hidden">
                <div className="absolute inset-0 z-10 overflow-y-auto custom-scrollbar flex flex-col items-center">

                    {/* BACKGROUND BRANDING AREA */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-2xl min-h-[400px]">
                        <div className="flex flex-col items-center gap-5 pointer-events-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 opacity-20 hover:opacity-100 transition-opacity">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter text-center leading-[1.05]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                Connect with your<br />travel circle.
                            </h2>

                            <div className="flex flex-col items-center gap-2.5 text-center">
                                <div className="h-[2px] w-10 bg-slate-900/10 mb-1" />
                                <p className="text-[#1A1A1A] text-[9px] font-black uppercase tracking-[0.5em]">
                                    Coming Very Soon
                                </p>
                                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.15em] opacity-40">
                                    Ultimate traveler connection
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVE CHAT CARD - CENTERED (EXACT PROVIDED DESIGN) */}
                    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center px-10">
                        <AnimatePresence mode="wait">
                            {activeChatId && (
                                <motion.div
                                    key={activeChatId}
                                    initial={{ opacity: 0, scale: 0.95, y: 30, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.95, y: -30, filter: "blur(10px)" }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="pointer-events-auto w-full max-w-2xl"
                                >
                                    <div className="h-[550px] border shadow-2xl bg-background rounded-2xl flex flex-col overflow-hidden">
                                        {/* Header */}
                                        <div className="flex items-center justify-between p-4 border-b bg-card">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
                                                    <img src={activeCharacter.avatar} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h1 className="text-base font-bold tracking-tight">{activeCharacter.name}</h1>
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-70 underline underline-offset-4 decoration-primary/20">Travio</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => setActiveChatId(null)} className="h-8 w-8 rounded-lg hover:bg-muted">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Body */}
                                        <div className="flex-1 overflow-hidden">
                                            <ChatMessageList>
                                                {thread?.messages.map((message) => (
                                                    <ChatBubble
                                                        key={message.id}
                                                        variant={message.isAi ? "received" : "sent"}
                                                    >
                                                        <ChatBubbleAvatar
                                                            src={message.isAi ? undefined : (user?.imageUrl || "https://i.pravatar.cc/150?u=me")}
                                                            fallback={message.isAi ? <TravioLogoIcon /> : (user?.firstName?.charAt(0) || "U")}
                                                            className={message.isAi ? "overflow-hidden" : ""}
                                                        />
                                                        <div className="flex flex-col">
                                                            <div className={`flex items-center gap-2 mb-1 px-1 ${message.isAi ? "justify-start" : "justify-end"}`}>
                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                                    {message.sender}
                                                                </span>
                                                            </div>
                                                            <ChatBubbleMessage
                                                                variant={message.isAi ? "received" : "sent"}
                                                            >
                                                                {message.text}
                                                            </ChatBubbleMessage>
                                                        </div>
                                                    </ChatBubble>
                                                ))}

                                                {thread?.isThinking && (
                                                    <ChatBubble variant="received">
                                                        <ChatBubbleAvatar
                                                            fallback={<TravioLogoIcon />}
                                                            className="overflow-hidden"
                                                        />
                                                        <ChatBubbleMessage isLoading />
                                                    </ChatBubble>
                                                )}
                                            </ChatMessageList>
                                        </div>

                                        {/* Footer */}
                                        <div className="p-4 border-t bg-card">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (input.trim()) {
                                                        handleSend(input);
                                                        setInput("");
                                                    }
                                                }}
                                                className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
                                            >
                                                <ChatInput
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    placeholder="Type your message..."
                                                    className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                                                />
                                                <div className="flex items-center p-3 pt-0 justify-between">
                                                    <div className="flex">
                                                        <Button variant="ghost" size="icon" type="button" className="h-8 w-8">
                                                            <Paperclip className="size-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" type="button" className="h-8 w-8">
                                                            <Mic className="size-4" />
                                                        </Button>
                                                    </div>
                                                    <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={!input.trim()}>
                                                        Send Message
                                                        <CornerDownLeft className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-auto pb-12 pt-20 w-fit pointer-events-auto relative z-40">
                        <MessageDock
                            onMessageSend={handleSend}
                            closeOnSend={false}
                            className="!relative !bottom-0 !left-0 !translate-x-0"
                            characters={[
                                { id: "pranav", name: "Pranav Gawai", avatar: user?.imageUrl || "https://i.pravatar.cc/150" + "?u=pranav", online: false, isPremium: true },
                                { id: "ananya", name: "Ananya Mehra", avatar: "https://i.pravatar.cc/150" + "?u=ananya", online: false },
                                { id: "vikram", name: "Vikram Singh", avatar: "https://i.pravatar.cc/150" + "?u=vikram", online: false },
                                { id: "rahul", name: "Rahul Sharma", avatar: "https://i.pravatar.cc/150" + "?u=rahul", online: false },
                            ]}
                        />
                    </div>
                </div>

                {/* SIDEBAR MOCKUP (BLURRED BACKGROUND) */}
                <div className="w-80 border-r border-slate-200 bg-white/20 hidden lg:flex flex-col filter blur-[4px] opacity-10 select-none backdrop-blur-[1px]">
                    <div className="p-5 border-b border-slate-100/50">
                        <div className="relative opacity-40">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <Input className="pl-9 bg-slate-100/50 border-none rounded-xl h-9 text-[11px]" placeholder="Search..." readOnly />
                        </div>
                    </div>
                </div>

                {/* CHAT AREA MOCKUP (BLURRED BACKGROUND) */}
                <div className="flex-1 flex flex-col bg-white/10 filter blur-[8px] opacity-[0.03] select-none backdrop-blur-[2px]">
                    <div className="h-16 border-b border-slate-200/50" />
                    <div className="flex-1" />
                </div>
            </main>
        </div>
    );
}
