"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Map,
    Bell,
    MessageSquare,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { THUMBNAIL_IMAGE_SIZES, normalizeRemoteImage } from "@shared/media";
import { cn } from "@shared/utils";
import { useUser } from "@clerk/nextjs";

interface TripStub {
    _id: string;
    title: string;
    coverImage: string;
}

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/trips", label: "Trips", icon: Map },
    { href: "/activity", label: "Activity", icon: Bell, badge: "12" },
    { href: "/chat", label: "Chat", icon: MessageSquare, soon: true },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [recentTrips, setRecentTrips] = useState<TripStub[]>([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const { user } = useUser();
    const isDemoUser = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === "demo@travio.com";

    useEffect(() => {
        let isMounted = true;
        const fetchRecent = async () => {
            try {
                const res = await fetch("/api/trips");
                if (res.ok && isMounted) {
                    const data: TripStub[] = await res.json();
                    setRecentTrips(data.slice(0, 5));
                }
            } catch {
                /* silent */
            } finally {
                if (isMounted) setLoadingTrips(false);
            }
        };
        fetchRecent();
        return () => { isMounted = false; };
    }, []);

    return (
        <aside
            className={cn(
                "relative flex flex-col h-screen bg-[#F5F3ED] border-r border-[#E5E7EB] transition-all duration-300 ease-in-out shrink-0 z-30",
                collapsed ? "w-[68px]" : "w-[240px]"
            )}
        >
            {/* ── Logo ── */}
            <div className={cn("py-6 flex items-center shrink-0", collapsed ? "px-0 justify-center w-full" : "px-6 justify-between")}>
                {!collapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2 text-[#0066FF] group">
                        <div className="flex items-center justify-center relative overflow-hidden h-8 w-8 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current">
                                <path d="M120-120v-80h720v80H120Z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current plane-animate">
                                <path d="M190-320L40-570l96-26 112 94 140-37-207-276 116-31 299 251 170-46q32-9 60.5 7.5T864-585q9 32-7.5 60.5T808-487L190-320Z" />
                            </svg>
                        </div>
                        <span className="font-bold text-2xl text-[#1A1A1A] group-hover:opacity-90 transition-opacity">Travio</span>
                    </Link>
                )}
                {collapsed && (
                    <Link href="/dashboard" className="flex items-center justify-center text-[#0066FF] relative overflow-hidden h-8 w-8 group">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current">
                            <path d="M120-120v-80h720v80H120Z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current plane-animate">
                            <path d="M190-320L40-570l96-26 112 94 140-37-207-276 116-31 299 251 170-46q32-9 60.5 7.5T864-585q9 32-7.5 60.5T808-487L190-320Z" />
                        </svg>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "text-[#6B7280] hover:text-[#1A1A1A] transition-colors z-40 flex items-center justify-center",
                        collapsed ? "absolute -right-3 top-7 w-6 h-6 bg-white border border-[#E5E7EB] rounded-full shadow-sm" : ""
                    )}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-4 w-4" />}
                </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="px-4 py-2 flex-1 overflow-y-auto">

                {/* Navigation */}
                <div className={cn("mb-6")}>
                    {!collapsed && (
                        <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3 px-2">Navigation</p>
                    )}
                    <nav className="space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const { href, label, icon: Icon, soon, badge } = item as any;
                            const isActive = pathname === href || (href === "/dashboard" && pathname === "/");

                            const content = (
                                <>
                                    <div className="flex items-center gap-3">
                                        <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-[#0066FF]" : "text-[#6B7280]")} />
                                        {!collapsed && (
                                            <span className={cn("text-sm", isActive && "text-[#1A1A1A]")}>
                                                {label}
                                            </span>
                                        )}
                                    </div>
                                    {!collapsed && (
                                        <div className="flex items-center justify-end flex-1 ml-2">
                                            {badge && isDemoUser && (
                                                <span className="bg-[#0066FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                                    {badge}
                                                </span>
                                            )}
                                            {soon && (
                                                <span className="text-[10px] bg-[#0066FF]/10 text-[#0066FF] px-1.5 py-0.5 rounded shrink-0">
                                                    Soon
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </>
                            );

                            const className = cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors",
                                isActive
                                    ? "bg-[#FFFFFF] text-[#1A1A1A] shadow-sm border border-[#E5E7EB]"
                                    : "text-[#6B7280] hover:bg-black/5 hover:text-[#1A1A1A] border border-transparent",
                                collapsed && "justify-center",
                                soon && "text-[#6B7280]"
                            );

                            if (soon && false) { // Logic to block click if desired, but currently open
                                return (
                                    <div key={href} className={className} title={collapsed ? label : undefined}>
                                        {content}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    title={collapsed ? label : undefined}
                                    className={className}
                                >
                                    {content}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Recent Trips */}
                {!collapsed && (
                    <div className="mt-8">
                        <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3 px-2">Recent Trips</p>
                        {loadingTrips ? (
                            <div className="space-y-2 px-1 py-2">
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <div key={idx} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                                        <div className="h-6 w-6 shimmer rounded bg-[#E5E7EB]" />
                                        <div className="h-3 flex-1 shimmer rounded-full bg-[#E5E7EB]" />
                                    </div>
                                ))}
                            </div>
                        ) : recentTrips.length === 0 ? (
                            <p className="text-xs text-[#6B7280] px-2 py-1">No trips yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {recentTrips.map((trip) => {
                                    const isActive = pathname === `/trip/${trip._id}`;
                                    return (
                                        <Link
                                            key={trip._id}
                                            href={`/trip/${trip._id}`}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-1.5 rounded-lg group transition-colors",
                                                isActive ? "bg-black/5" : "hover:bg-black/5"
                                            )}
                                        >
                                            <div className="h-6 w-6 rounded shadow-sm border overflow-hidden shrink-0">
                                                {trip.coverImage ? (
                                                    <div className="relative h-full w-full">
                                                        <Image
                                                            src={normalizeRemoteImage(trip.coverImage, 96, 70)}
                                                            alt={trip.title}
                                                            fill
                                                            sizes={THUMBNAIL_IMAGE_SIZES}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-full w-full bg-[#E5E7EB]" />
                                                )}
                                            </div>
                                            <span className={cn(
                                                "text-sm truncate flex-1 min-w-0",
                                                isActive ? "text-[#1A1A1A]" : "text-[#6B7280] group-hover:text-[#1A1A1A]"
                                            )}>
                                                {trip.title}
                                            </span>
                                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] ml-auto"></span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Footer / Premium ── */}
            <div className="p-4 mt-auto">
                {!collapsed && (
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl border border-blue-200 relative overflow-hidden mb-4">
                        <div className="relative z-10 flex items-start gap-3">
                            <svg className="w-4 h-4 text-[#0066FF] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <div>
                                <p className="text-xs font-medium text-[#1A1A1A]">Trial ends in 5 days</p>
                                <a className="text-xs font-bold text-[#1A1A1A] hover:text-[#0066FF] underline decoration-[#0066FF] decoration-2 underline-offset-2 transition-colors" href="#">Get premium now!</a>
                            </div>
                        </div>
                    </div>
                )}
                {!collapsed && (
                    <p className="text-[10px] text-[#6B7280] text-center">© 2026 Travio. All rights reserved.</p>
                )}
            </div>
        </aside>
    );
}
