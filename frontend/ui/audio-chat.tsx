"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, X, MessageSquare, Send, Zap, Users2 } from "lucide-react";
import { cn } from "@shared/utils";

interface Participant {
    id: string;
    name: string;
    avatar: string;
    isSpeaking?: boolean;
}

const defaultParticipants: Participant[] = [
    { id: "1", name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", isSpeaking: true },
    { id: "2", name: "Alex", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
    { id: "3", name: "Mariana", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", isSpeaking: true },
    { id: "4", name: "Liam", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" },
    { id: "5", name: "Ana", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200" },
    { id: "6", name: "James", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", isSpeaking: true },
];

const COLLAPSED_WIDTH = 268;
const EXPANDED_WIDTH = 360;
const EXPANDED_HEIGHT = 420;

const AVATAR_SIZE_COLLAPSED = 44;
const AVATAR_SIZE_EXPANDED = 72;
const AVATAR_OVERLAP = -14;

function ActiveStatusIndicator({ show }: { show: boolean }) {
    return (
        <div
            className={cn(
                "absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg ring-1 ring-black/5 z-20",
                "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                show ? "opacity-100 scale-100" : "opacity-0 scale-0",
            )}
        >
            <div className="w-2.5 h-2.5 bg-[#0066FF] rounded-full" />
        </div>
    );
}

function MessagingIcon({ isExpanded }: { isExpanded: boolean }) {
    return (
        <div
            className={cn(
                "absolute w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center shadow-lg border border-white/10",
                "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isExpanded ? "opacity-0 scale-75" : "opacity-100 scale-100",
            )}
            style={{
                left: 12,
                top: "50%",
                transform: `translateY(-50%) ${isExpanded ? "scale(0.75)" : "scale(1)"}`,
            }}
        >
            <MessageSquare className="w-4 h-4 text-white fill-white/20" />
        </div>
    );
}

function getAvatarPosition(index: number, isExpanded: boolean) {
    if (!isExpanded) {
        const startX = 60; // after audio wave icon
        return {
            x: startX + index * (AVATAR_SIZE_COLLAPSED + AVATAR_OVERLAP),
            y: 8,
            size: AVATAR_SIZE_COLLAPSED,
            opacity: index < 4 ? 1 : 0,
            scale: 1,
        }
    } else {
        // 3-column grid
        const colWidth = 100;
        const rowHeight = 120;
        const gridStartX = 30;
        const gridStartY = 80;

        const col = index % 3;
        const row = Math.floor(index / 3);

        return {
            x: gridStartX + col * colWidth,
            y: gridStartY + row * rowHeight,
            size: AVATAR_SIZE_EXPANDED,
            opacity: index < 6 ? 1 : 0, // Show top 6 in grid
            scale: 1,
        }
    }
}

export function VoiceChat({ user }: { user?: any }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const participants = user ? [
        ...defaultParticipants.slice(0, 5),
        {
            id: "me",
            name: "You",
            avatar: user.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
            isSpeaking: false
        }
    ] : defaultParticipants;

    return (
        <div className="voice-chat-container">
            <div
                onClick={() => !isExpanded && setIsExpanded(true)}
                className={cn(
                    "relative bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-slate-200/50 overflow-hidden",
                    "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    !isExpanded && "cursor-pointer hover:shadow-[0_24px_48px_-12px_rgba(0,102,255,0.08)] hover:scale-[1.01] active:scale-[0.99]",
                )}
                style={{
                    width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
                    height: isExpanded ? EXPANDED_HEIGHT : 60,
                    borderRadius: isExpanded ? 32 : 999,
                }}
            >
                {/* Chat Icon */}
                <MessagingIcon isExpanded={isExpanded} />

                {/* Counter (collapsed only) - REMOVED +4 Chats as requested */}
                <div
                    className={cn(
                        "absolute flex items-center gap-1.5 text-slate-400 font-bold",
                        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isExpanded ? "opacity-0 pointer-events-none translate-x-4" : "opacity-100",
                    )}
                    style={{
                        right: 18,
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </div>

                {/* Header (expanded only) */}
                <div
                    className={cn(
                        "absolute inset-x-0 top-0 flex items-center justify-between px-7 pt-7 pb-4",
                        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none",
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF]">
                            <Zap className="w-4 h-4 fill-current" />
                        </div>
                        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]" style={{ fontFamily: "'Quicksand', sans-serif" }}>Messaging Hub</h2>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(false);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 active:scale-90"
                    >
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* Participants */}
                {participants.map((participant, index) => {
                    const pos = getAvatarPosition(index, isExpanded);
                    const delay = isExpanded ? index * 40 : (6 - index) * 20;

                    return (
                        <div
                            key={participant.id}
                            className="absolute transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                width: pos.size,
                                height: isExpanded ? pos.size + 30 : pos.size,
                                opacity: pos.opacity,
                                zIndex: isExpanded ? 10 : 10 - index,
                                transitionDelay: `${delay}ms`,
                                transform: `scale(${pos.scale})`,
                            }}
                        >
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={cn(
                                        "rounded-full overflow-hidden ring-[3px] ring-white shadow-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                                        participant.isSpeaking && isExpanded && "ring-[#0066FF] ring-offset-2"
                                    )}
                                    style={{
                                        width: pos.size,
                                        height: pos.size,
                                    }}
                                >
                                    <img
                                        src={participant.avatar}
                                        alt={participant.name}
                                        className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <ActiveStatusIndicator show={isExpanded && !!participant.isSpeaking} />

                                {/* Name */}
                                <span
                                    className={cn(
                                        "absolute text-[11px] font-bold text-slate-600 whitespace-nowrap uppercase tracking-wider",
                                        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                                        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                                    )}
                                    style={{
                                        top: pos.size + 12,
                                        transitionDelay: isExpanded ? `${200 + index * 40}ms` : "0ms",
                                    }}
                                >
                                    {participant.name}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* CTA Section */}
                <div
                    className={cn(
                        "absolute inset-x-8 bottom-8 flex flex-col gap-4",
                        "transition-all duration-700 delay-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none",
                    )}
                >
                    <button
                        className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:scale-[0.98] transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        Open Messaging
                        <Send className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                        <Users2 className="w-3 h-3" />
                        24 Active members
                    </p>
                </div>
            </div>
        </div>
    );
}
