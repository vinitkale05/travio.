"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import {
    Bell,
    Activity,
    Sparkles,
    MessageSquare,
    MapPin,
    Star,
    History,
    ArrowRight,
    Filter,
    Search,
    Inbox,
    Bookmark,
    Settings as SettingsIcon,
    MoreHorizontal
} from "lucide-react";
import { Badge } from "@frontend/ui/ui/badge";
import { Button } from "@frontend/ui/ui/button";
import { Input } from "@frontend/ui/ui/input";
import { cn } from "@shared/utils";
import { NotificationBell } from "@frontend/ui/notification-bell";

export default function ActivityPage() {
    const { user } = useUser();
    const [activeFilter, setActiveFilter] = useState("all");

    const filters = [
        { id: "all", label: "All Activity", icon: Inbox },
        { id: "mentions", label: "Mentions", icon: MessageSquare },
        { id: "trips", label: "Trip Updates", icon: MapPin },
        { id: "favorites", label: "Favorites", icon: Bookmark },
    ];

    const isDemoUser = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === "demo@travio.com";

    return (
        <div className="min-h-screen flex flex-col font-inter text-slate-900 overflow-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-30 bg-[#FAFAFA]/60 backdrop-blur-md border-b border-[#E5E7EB] h-[72px] flex items-center justify-between px-8" style={{ left: 'var(--sidebar-width, 240px)' }}>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-[#1A1A1A] font-medium">Activity</span>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationBell isDemoUser={!!isDemoUser} />
                    <div className="flex items-center border-l border-[#E5E7EB] pl-4 h-6">
                        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 ring-1 ring-slate-200 shadow-sm" } }} />
                    </div>
                </div>
            </header>

            <main className="flex-1 mt-[72px] flex relative h-[calc(100vh-72px)]">
                {/* PAGE SIDEBAR */}
                <div className="w-[280px] border-r border-[#E5E7EB] bg-[#FAFAFA]/40 backdrop-blur-[2px] flex flex-col shrink-0">
                    <div className="p-6">
                        <h2 className="text-xl font-bold tracking-tight mb-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>Notifications</h2>
                        <div className="space-y-1">
                            {filters.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                                        activeFilter === f.id
                                            ? "bg-white text-[#0066FF] shadow-sm border border-[#E5E7EB]"
                                            : "text-[#6B7280] hover:bg-black/5 hover:text-[#1A1A1A]"
                                    )}
                                >
                                    <f.icon className={cn("w-4.5 h-4.5 transition-colors", activeFilter === f.id ? "text-[#0066FF]" : "text-[#9CA3AF] group-hover:text-[#6B7280]")} />
                                    {f.label}
                                    {f.id === 'all' && isDemoUser && (
                                        <span className="ml-auto bg-[#0066FF] text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">12</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto p-6 border-t border-[#E5E7EB]">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-[#6B7280] hover:text-[#1A1A1A] rounded-xl">
                            <SettingsIcon className="w-4 h-4" />
                            Feed Settings
                        </Button>
                    </div>
                </div>

                {/* ACTIVITY FEED AREA */}
                <div className="flex-1 overflow-y-auto relative">
                    <div className="max-w-3xl mx-auto py-10 px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-[#0066FF]/10 text-[#0066FF] border-0 text-[10px] font-bold uppercase tracking-wider">Live Feed</Badge>
                                    <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest leading-none bg-[#F3F4F6] px-2 py-1 rounded">Beta v1.2</span>
                                </div>
                                <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Recent Activity</h1>
                            </div>
                            <Button variant="outline" className="rounded-xl border-[#E5E7EB] text-xs font-bold gap-2">
                                <Filter className="w-3.5 h-3.5" />
                                Options
                            </Button>
                        </div>

                        {/* PREMIUM OVERLAY */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[6px] z-20 flex pt-20 justify-center rounded-3xl border-2 border-dashed border-[#E5E7EB] pointer-events-none">
                                <div className="bg-white shadow-2xl border border-[#E5E7EB] px-10 py-10 rounded-[2rem] flex flex-col items-center gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700 pointer-events-auto h-fit max-w-[360px] text-center">
                                    <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-[#0066FF] -rotate-3 border border-blue-100/50 shadow-inner">
                                        <Sparkles className="w-8 h-8 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-[#1A1A1A] tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>Activity Hub Soon</h3>
                                        <p className="text-sm text-[#6B7280] leading-relaxed mt-2 font-medium">
                                            We're crafting a state-of-the-art notification system to keep you synced with your travel crew.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full mt-2">
                                        <Button asChild className="bg-[#1A1A1A] hover:bg-black text-white rounded-2xl h-12 font-bold shadow-xl shadow-black/10 transition-all hover:scale-[1.02]">
                                            <Link href="/dashboard">Back to Dashboard</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* FEED CONTENT (Hardcoded Mockup) */}
                            <div className="space-y-6 filter blur-[2.5px] opacity-25 select-none scale-[0.98]">
                                {[
                                    { icon: MessageSquare, iconColor: "text-blue-600", bg: "bg-blue-50", user: "Sarah Miller", action: "commented on", target: "Flight Itinerary", trip: "Goa March 2026", time: "2m ago" },
                                    { icon: MapPin, iconColor: "text-emerald-600", bg: "bg-emerald-50", user: "Alex Chen", action: "pinned a new spot:", target: "Baga Beach", trip: "Goa March 2026", time: "43m ago" },
                                    { icon: Star, iconColor: "text-amber-600", bg: "bg-amber-50", user: "System", action: "Booking confirmed for", target: "Solang Valley", trip: "Manali Adventure", time: "2h ago" },
                                    { icon: History, iconColor: "text-violet-600", bg: "bg-violet-50", user: "You", action: "changed dates for", target: "Trip Schedule", trip: "Manali Adventure", time: "5h ago" },
                                    { icon: Star, iconColor: "text-amber-600", bg: "bg-amber-50", user: "System", action: "New member joined:", target: "Liam Page", trip: "Goa March 2026", time: "1d ago" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 group cursor-pointer lg:px-2">
                                        <div className="flex flex-col items-center">
                                            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white shadow-sm", item.bg, item.iconColor)}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div className="w-0.5 flex-1 bg-[#F3F4F6] my-2 rounded-full" />
                                        </div>
                                        <div className="flex-1 bg-white p-5 rounded-[1.5rem] border border-[#E5E7EB] shadow-sm group-hover:shadow-md transition-all duration-300">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-bold text-[#1A1A1A]">
                                                    {item.user} <span className="font-medium text-[#6B7280]">{item.action}</span> {item.target}
                                                </p>
                                                <button className="text-[#9CA3AF] hover:text-[#1A1A1A]"><MoreHorizontal className="w-4 h-4" /></button>
                                            </div>
                                            <div className="flex items-center gap-3 mt-3">
                                                <Badge variant="outline" className="text-[10px] font-bold text-[#0066FF] border-[#0066FF]/20 bg-[#0066FF]/5 px-2.5 h-6 rounded-lg uppercase tracking-wider">{item.trip}</Badge>
                                                <span className="text-[11px] font-bold text-[#9CA3AF] tabular-nums">{item.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
