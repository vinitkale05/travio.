"use client";

import React from "react";
import Link from "next/link";
import { Bell, MessageCircle, Map, Sparkle, UserPlus, BellRing } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@frontend/ui/ui/popover";
import { cn } from "@shared/utils";

const MOCK_NOTIFICATIONS = [
    { id: 1, type: "comment", user: "Sarah Miller", msg: "commented on the Goa itinerary", time: "2m ago", read: false },
    { id: 2, type: "trip", user: "Alex Chen", msg: "added a new spot to Goa: 'Baga Beach'", time: "45m ago", read: false },
    { id: 3, type: "system", user: "System", msg: "Your Manali trip has been confirmed!", time: "2h ago", read: true },
    { id: 4, type: "member", user: "Liam Page", msg: "joined the Goa March 2026 trip", time: "1d ago", read: true },
];

interface NotificationBellProps {
    isDemoUser: boolean;
}

export function NotificationBell({ isDemoUser }: NotificationBellProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] shadow-sm transition-all duration-300 hover:border-[#0066FF] hover:text-[#0066FF] active:scale-95">
                    <Bell className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:rotate-[12deg]" />
                    {isDemoUser && (
                        <span className="absolute top-[8px] right-[8px] flex h-[8px] w-[8px]">
                            <span className="relative inline-flex h-[8px] w-[8px] rounded-full bg-[#0066FF] border-2 border-white shadow-sm shadow-[#0066FF]/20"></span>
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl border border-slate-200 shadow-2xl bg-white overflow-hidden z-[100]" align="end" sideOffset={8}>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                    {isDemoUser && <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">2 New</span>}
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                    {isDemoUser ? (
                        <div className="divide-y divide-slate-50">
                            {MOCK_NOTIFICATIONS.map((n) => (
                                <div key={n.id} className={cn("p-4 hover:bg-slate-50/80 transition-all cursor-pointer flex gap-4 items-start group/item", !n.read && "bg-blue-50/40")}>
                                    <div className="relative shrink-0">
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100",
                                            n.type === 'comment' ? 'bg-[#EEF2FF] text-[#4F46E5]' :
                                                n.type === 'trip' ? 'bg-[#ECFDF5] text-[#10B981]' :
                                                    n.type === 'system' ? 'bg-[#FFF7ED] text-[#F59E0B]' :
                                                        'bg-[#F8FAFC] text-[#6366F1]'
                                        )}>
                                            {n.type === 'comment' && <MessageCircle className="w-4 h-4" />}
                                            {n.type === 'trip' && <Map className="w-4 h-4" />}
                                            {n.type === 'system' && <Sparkle className="w-4 h-4" />}
                                            {n.type === 'member' && <UserPlus className="w-4 h-4" />}
                                        </div>
                                        {!n.read && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#0066FF] rounded-full border-2 border-white shadow-sm" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <p className="text-[13px] text-slate-600 leading-snug">
                                            <span className="font-bold text-slate-900">{n.user}</span> <span className="font-medium">{n.msg}</span>
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{n.time}</span>
                                            <div className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                                            <span className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider group-hover/item:translate-x-0.5 transition-transform">View →</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 px-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Bell className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-slate-900">All caught up!</p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">No new notifications at the moment.</p>
                        </div>
                    )}
                </div>
                <Link
                    href="/activity"
                    className="block p-3 text-center text-[11px] font-bold text-[#6B7280] hover:text-[#0066FF] hover:bg-slate-50 border-t border-slate-100 transition-all uppercase tracking-widest"
                >
                    View All Activity
                </Link>
            </PopoverContent>
        </Popover>
    );
}
