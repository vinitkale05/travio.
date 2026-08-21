"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Plus, ArrowUpRight, ArrowDownRight, Bell } from "lucide-react";

import { AvatarGroup } from "@frontend/ui/ui/avatar-group";
import { Badge } from "@frontend/ui/ui/badge";
import { Button } from "@frontend/ui/ui/button";
import { NotificationBell } from "@frontend/ui/notification-bell";
import { QuickTooltipActions } from "@frontend/ui/ui/quick-tooltip-actions";
import { CARD_IMAGE_SIZES, getLocalMediaSrc, normalizeRemoteImage } from "@shared/media";
import { cn } from "@shared/utils";

interface TripMember {
    userId: string;
    name: string;
    avatar: string;
    role: string;
}

interface TripData {
    _id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    coverImage: string;
    members: TripMember[];
    expenses?: Array<{ amount: number }>;
    checklist?: Array<{ _id?: string }>;
    ownerId: string;
    inviteCode: string;
    isDemo?: boolean;
}

function TripCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-[1.5rem] bg-white/50">
            <div className="h-44 animate-pulse bg-slate-200/60" />
            <div className="space-y-5 p-5">
                <div className="space-y-2">
                    <div className="h-6 w-2/3 animate-pulse rounded-full bg-slate-200/80" />
                    <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-200/60" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200/60" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200/60" />
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/50 pt-4">
                    <div className="space-y-2">
                        <div className="h-3 w-16 animate-pulse rounded-full bg-slate-200/60" />
                        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200/80" />
                    </div>
                    <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200/60" />
                </div>
            </div>
        </div>
    );
}

export default function TripsPage() {
    const { user, isLoaded } = useUser();
    const [trips, setTrips] = useState<TripData[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fallbackCover = useMemo(
        () => getLocalMediaSrc("curatedRoadTrip", 1200) ?? "/optimized/curatedRoadTrip-1200.avif",
        [],
    );

    useEffect(() => {
        // Wait for BOTH Clerk to finish AND user to be available
        if (!isLoaded || !user) return;

        let active = true;

        const fetchTrips = async () => {
            try {
                const res = await fetch("/api/trips");
                if (res.ok) {
                    const data = await res.json();
                    if (active) setTrips(data);
                }
            } catch (err: any) {
                console.error("Trip fetch error:", err);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchTrips();
        return () => { active = false; };
    }, [isLoaded, user?.id]); // safely run when user fully populates

    const isDemoUser = mounted && user?.primaryEmailAddress?.emailAddress?.toLowerCase() === "demo@travio.com";

    return (
        <div className="min-h-screen pb-20 font-inter text-slate-900">

            <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#E5E7EB] bg-[#FAFAFA]/80 px-8 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-[#1A1A1A] font-medium">Trips</span>
                    <Badge variant="secondary" className="ml-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 shadow-sm">
                        {loading ? "..." : trips.length}
                    </Badge>
                </div>

                <div className="flex items-center gap-3">
                    <NotificationBell isDemoUser={isDemoUser} />
                    <div className="ml-1 flex h-6 items-center border-l border-slate-200 pl-4">
                        {mounted ? (
                            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 ring-1 ring-slate-200 shadow-sm" } }} />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse ring-1 ring-slate-200" />
                        )}
                    </div>
                </div>
            </header>
            <main className="relative z-10 px-6 pb-20 pt-8 lg:px-8">
                {loading ? (
                    <div className="space-y-10">
                        {/* Stats Skeleton */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="bg-white/50 p-5 rounded-xl border border-slate-100 shadow-sm animate-pulse">
                                    <div className="h-3 w-20 bg-slate-200 rounded-full mb-3" />
                                    <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <TripCardSkeleton key={idx} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in space-y-10">
                        {/* SECTION 2 — STATS ROW */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in duration-700">
                            <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
                                <p className="text-xs font-medium text-[#6B7280] mb-3">Active Trips</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-2xl font-bold text-[#1A1A1A] leading-none">
                                        {trips.length}
                                    </span>
                                    {isDemoUser && (
                                        <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded mb-1 border border-green-200">
                                            <ArrowUpRight className="w-2.5 h-2.5" /> 1
                                        </div>
                                    )}
                                </div>
                                {isDemoUser && <p className="text-[10px] text-[#6B7280] mt-1 relative top-0.5">compared to last month</p>}
                            </div>

                            <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
                                <p className="text-xs font-medium text-[#6B7280] mb-3">Total Budget</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-2xl font-bold text-[#1A1A1A] leading-none">
                                        ₹{(trips.reduce((acc, t) => acc + (t.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0), 0) / 1000).toFixed(1)}k
                                    </span>
                                    {isDemoUser && (
                                        <div className="flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded mb-1 border border-red-200">
                                            <ArrowDownRight className="w-2.5 h-2.5" /> 12%
                                        </div>
                                    )}
                                </div>
                                {isDemoUser && <p className="text-[10px] text-[#6B7280] mt-1 relative top-0.5">compared to last month</p>}
                            </div>

                            <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
                                <p className="text-xs font-medium text-[#6B7280] mb-3">Members Collaborating</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-2xl font-bold text-[#1A1A1A] leading-none">
                                        {new Set(trips.flatMap(t => t.members.map(m => m.userId))).size}
                                    </span>
                                    {isDemoUser && (
                                        <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded mb-1 border border-green-200">
                                            <ArrowUpRight className="w-2.5 h-2.5" /> 3
                                        </div>
                                    )}
                                </div>
                                {isDemoUser && <p className="text-[10px] text-[#6B7280] mt-1 relative top-0.5">across all trips</p>}
                            </div>

                            <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
                                <p className="text-xs font-medium text-[#6B7280] mb-3">Saved Activities</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-2xl font-bold text-[#1A1A1A] leading-none">
                                        {trips.reduce((acc, t) => acc + (t.checklist?.length || 0), 0)}
                                    </span>
                                    {isDemoUser && (
                                        <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded mb-1 border border-green-200">
                                            <ArrowUpRight className="w-2.5 h-2.5" /> 8
                                        </div>
                                    )}
                                </div>
                                {isDemoUser && <p className="text-[10px] text-[#6B7280] mt-1 relative top-0.5">in the last 30 days</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 animate-in fade-in duration-1000 slide-in-from-bottom-2">
                            {trips.map((trip) => {
                                const startDate = new Date(trip.startDate);
                                const endDate = new Date(trip.endDate);
                                const nights = Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000));
                                const userRole = trip.members.find((member) => member.userId === user?.id)?.role === "owner" ? "Owner" : "Member";
                                const coverSrc = normalizeRemoteImage(trip.coverImage || fallbackCover, 1200, 72);

                                return (
                                    <Link href={`/trip/${trip._id}`} key={trip._id} className="group">
                                        <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.98]">
                                            <div className="relative h-44 overflow-hidden bg-slate-200">
                                                <Image
                                                    src={coverSrc}
                                                    alt={trip.title}
                                                    fill
                                                    sizes={CARD_IMAGE_SIZES}
                                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                                                <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                                                    {trip.isDemo && (
                                                        <Badge className="h-6 rounded-full border-0 bg-white/95 px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-sm">
                                                            Curated
                                                        </Badge>
                                                    )}
                                                    <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                                        <QuickTooltipActions tripId={trip._id} />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h3 className="line-clamp-1 text-[22px] font-bold leading-tight tracking-tight text-white" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                        {trip.title}
                                                    </h3>
                                                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90">
                                                        <CalendarIcon className="h-3 w-3" />
                                                        {format(startDate, "MMM d")} - {format(endDate, "MMM d")} • {nights} nights
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between p-5">
                                                <div className="flex items-center justify-between">
                                                    <AvatarGroup
                                                        avatars={trip.members.map((member) => {
                                                            const isCurrentUser = user && member.userId === user.id;
                                                            return {
                                                                src: isCurrentUser
                                                                    ? user.imageUrl
                                                                    : member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`,
                                                                label: isCurrentUser ? user.fullName || user.firstName || member.name : member.name,
                                                            };
                                                        })}
                                                        maxVisible={4}
                                                        size={32}
                                                        overlap={10}
                                                    />
                                                    <Badge
                                                        className={cn(
                                                            "rounded-full border-0 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]",
                                                            userRole === "Owner" ? "bg-[#2563eb] text-white" : "bg-slate-100 text-slate-600",
                                                        )}
                                                    >
                                                        {userRole}
                                                    </Badge>
                                                </div>

                                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Location</p>
                                                        <p className="mt-1 line-clamp-1 text-xs font-bold text-slate-700">{trip.destination || "Not set"}</p>
                                                    </div>
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 transition-colors group-hover:border-blue-100 group-hover:text-[#2563eb]">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div >
    );
}
