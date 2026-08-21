"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, UploadCloud, ArrowUpRight, ArrowDownRight, MapPin, Compass, User, Paperclip, Sparkles, Loader2, Bell, ArrowUp, MessageSquare, Wallet, Users, Bookmark } from "lucide-react";
import { Button } from "@frontend/ui/ui/button";
import { Badge } from "@frontend/ui/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@frontend/ui/ui/dialog";
import { Input } from "@frontend/ui/ui/input";
import { Calendar } from "@frontend/ui/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@frontend/ui/ui/popover";
import { CARD_IMAGE_SIZES, getLocalBlurDataURL, getLocalMediaSrc, normalizeRemoteImage } from "@shared/media";
import { cn } from "@shared/utils";
import { AvatarGroup } from "@frontend/ui/ui/avatar-group";
import { NotificationBell } from "@frontend/ui/notification-bell";

// Types
interface TripMember { userId: string; name: string; avatar: string; role: string; }


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

const COVER_OPTIONS = [
    {
        key: "curatedRoadTrip",
        label: "Adventure",
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200",
        thumbnail: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400",
    },
    {
        key: "curatedMountains",
        label: "Mountains",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
        thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400",
    },
    {
        key: "curatedBeach",
        label: "Resort",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
    },
    {
        key: "curatedParis",
        label: "City",
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200",
        thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400",
    },
] as const;

const FALLBACK_TRIP_COVER = COVER_OPTIONS[1]?.url ?? COVER_OPTIONS[0].url;

function DashboardStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="rounded-xl bg-white p-5 border border-[#E5E7EB] shadow-sm">
                    <div className="mb-3 h-3 w-24 shimmer rounded-full" />
                    <div className="h-8 w-16 shimmer rounded-full" />
                </div>
            ))}
        </div>
    );
}

function UpcomingPlanSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex h-full flex-col rounded-2xl bg-white p-2 border-2 border-dashed border-[#E5E7EB]">
                    <div className="mb-3 h-48 shimmer rounded-xl" />
                    <div className="space-y-3 px-2 pb-2">
                        <div className="h-5 w-2/3 shimmer rounded-full" />
                        <div className="h-3 w-1/3 shimmer rounded-full" />
                        <div className="flex items-center justify-between pt-3">
                            <div className="h-3 w-24 shimmer rounded-full" />
                            <div className="h-6 w-16 shimmer rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [trips, setTrips] = useState<TripData[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newTripTitle, setNewTripTitle] = useState("");
    const [newTripDest, setNewTripDest] = useState("");
    const [selectedCover, setSelectedCover] = useState<string>(COVER_OPTIONS[0].url);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // AI Input State
    const [aiInput, setAiInput] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoaded || !user) return;

        let active = true;

        const safetyTimer = setTimeout(() => {
            if (active) setLoading(false);
        }, 8000);

        const run = async () => {
            try {
                const res = await fetch("/api/trips");
                if (res.ok) {
                    const data = await res.json();
                    if (active) setTrips(data);
                }
            } catch (err: any) {
                console.error("[Dashboard] Fetch error:", err);
            } finally {
                clearTimeout(safetyTimer);
                if (active) setLoading(false);
            }
        };

        run();
        return () => { active = false; clearTimeout(safetyTimer); };
    }, [isLoaded, user?.id]);


    const fetchTrips = useCallback(async () => {
        try {
            const res = await fetch("/api/trips");
            if (res.ok) setTrips(await res.json());
        } catch { /* silent */ }
    }, []);


    const handleCreateTrip = async () => {
        if (!newTripTitle || !startDate || !endDate) return;
        setCreating(true);
        try {
            const res = await fetch("/api/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTripTitle,
                    destination: newTripDest,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    coverImage: selectedCover,
                }),
            });
            if (res.ok) {
                const trip: TripData = await res.json();
                setTrips((prev) => [trip, ...prev]);
                setIsDialogOpen(false);
                setNewTripTitle("");
                setNewTripDest("");
                setStartDate(undefined);
                setEndDate(undefined);
                setSelectedCover(COVER_OPTIONS[0].url);
            }
        } finally {
            setCreating(false);
        }
    };

    const handleCoverUpload = async (file?: File) => {
        if (!file) return;

        setUploadingCover(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Cover upload failed");
            }

            setSelectedCover(data.url);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Cover upload failed");
        } finally {
            setUploadingCover(false);
        }
    };

    const handleAISubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiInput.trim() || isAiLoading) return;

        setIsAiLoading(true);
        setAiResponse(null);

        // Simulate network delay for premium feel
        setTimeout(() => {
            setIsAiLoading(false);
            setAiResponse("Travio Intelligence is currently rolling out to early access members. Your premium AI planner will be unlocked soon!");
            setAiInput("");

            // Clear message after 6 seconds
            setTimeout(() => {
                setAiResponse(null);
            }, 6000);
        }, 1500);
    };

    const isDemoUser = mounted && user?.primaryEmailAddress?.emailAddress?.toLowerCase() === "demo@travio.com";
    const selectedCoverOption = COVER_OPTIONS.find((option) => option.url === selectedCover);
    const selectedCoverSrc = normalizeRemoteImage(selectedCover || FALLBACK_TRIP_COVER, 1200, 72);

    return (
        <div className="flex flex-col min-h-screen font-inter text-slate-900 pb-20">

            {/* Main Content Layer */}
            <div className="col-start-1 row-start-1 flex flex-col relative z-10 pb-32 w-full max-w-full">
                {/* TOP HEADER (inside main area) */}
                <header className="sticky top-0 flex items-center justify-between px-8 py-5 border-b border-[#E5E7EB] bg-[#FAFAFA]/80 backdrop-blur-md z-20 shrink-0 h-[72px]">
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <span>Home</span>
                        <span>/</span>
                        <span className="text-[#1A1A1A] font-medium">Dashboard</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Demo Mode Indicator */}
                        {isDemoUser && (
                            <div className="hidden md:flex items-center px-3 py-1 bg-[#FFFFFF] border border-[#E5E7EB] rounded-full shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse mr-2" />
                                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.14em]">Demo Account</span>
                            </div>
                        )}
                        {/* Notification Bell */}
                        <NotificationBell isDemoUser={isDemoUser} />
                        <div className="flex items-center">
                            {mounted ? (
                                <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 border border-[#E5E7EB] cursor-pointer" } }} />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse border border-[#E5E7EB]" />
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 w-full flex flex-col relative z-10">
                    <div className="max-w-6xl w-full mx-auto px-8 pt-4 pb-20 space-y-10 relative z-10">

                        {loading ? (
                            <>
                                <div className="flex items-end justify-between">
                                    <div className="space-y-2">
                                        <div className="h-9 w-56 shimmer rounded-full" />
                                        <div className="h-4 w-80 shimmer rounded-full" />
                                    </div>
                                    <div className="h-11 w-32 shimmer rounded-xl" />
                                </div>
                                <DashboardStatsSkeleton />
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                    <div className="lg:col-span-2">
                                        <div className="mb-5 h-5 w-32 shimmer rounded-full" />
                                        <UpcomingPlanSkeleton />
                                    </div>
                                    <div>
                                        <div className="mb-5 h-5 w-28 shimmer rounded-full" />
                                        <div className="space-y-4 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 shadow-sm">
                                            {Array.from({ length: 4 }).map((_, idx) => (
                                                <div key={idx} className="flex items-start gap-4">
                                                    <div className="h-8 w-8 shimmer rounded-full" />
                                                    <div className="flex-1 space-y-2 pt-1">
                                                        <div className="h-3 w-20 shimmer rounded-full" />
                                                        <div className="h-4 w-40 shimmer rounded-full" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="animate-fade-in space-y-10">
                                <div className="flex items-end justify-between mb-8">
                                    <div>
                                        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-1">Trip Dashboard</h1>
                                        <p className="text-[#6B7280] text-sm">Manage, collaborate, and plan your upcoming adventures.</p>
                                    </div>
                                    <button onClick={() => setIsDialogOpen(true)} className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-sm shadow-[#0066FF]/20">
                                        <Plus className="w-4 h-4" />
                                        New Trip
                                    </button>
                                </div>

                                {/* SECTION 3 — QUICK ACTIONS */}
                                <div className="mb-12">
                                    <h2 className="text-[15px] font-bold text-[#1A1A1A] tracking-tight mb-4">Quick Actions</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-3 bg-[#FFFFFF] p-4 rounded-xl border border-[#E5E7EB] hover:border-[#0066FF]/50 hover:shadow-md transition-all group text-left">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white transition-colors shrink-0">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#1A1A1A]">Create Trip</p>
                                                <p className="text-[10px] text-[#6B7280]">Start from scratch</p>
                                            </div>
                                        </button>
                                        <Link href={trips.length > 0 ? `/trip/${trips[0]._id}` : "/trips"} className="flex items-center gap-3 bg-[#FFFFFF] p-4 rounded-xl border border-[#E5E7EB] hover:border-emerald-500/50 hover:shadow-md transition-all group text-left">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#1A1A1A]">Invite Friends</p>
                                                <p className="text-[10px] text-[#6B7280]">Share a link</p>
                                            </div>
                                        </Link>
                                        <Link href={trips.length > 0 ? `/trip/${trips[0]._id}` : "/trips"} className="flex items-center gap-3 bg-[#FFFFFF] p-4 rounded-xl border border-[#E5E7EB] hover:border-amber-500/50 hover:shadow-md transition-all group text-left">
                                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                                                <span className="font-bold text-xl leading-none">₹</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#1A1A1A]">Add Expense</p>
                                                <p className="text-[10px] text-[#6B7280]">Track spending</p>
                                            </div>
                                        </Link>
                                        <Link href={trips.length > 0 ? `/trip/${trips[0]._id}` : "/trips"} className="flex items-center gap-3 bg-[#FFFFFF] p-4 rounded-xl border border-[#E5E7EB] hover:border-violet-500/50 hover:shadow-md transition-all group text-left">
                                            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors shrink-0">
                                                <UploadCloud className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#1A1A1A]">Upload Docs</p>
                                                <p className="text-[10px] text-[#6B7280]">Save tickets</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* SECTION 4 — UPCOMING PLANS */}
                                    {/* SECTION 4 — UPCOMING PLANS */}
                                    <div className="lg:col-span-2 flex flex-col">
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="text-[15px] font-bold text-[#1A1A1A] tracking-tight">Upcoming Plans</h2>
                                            <Link href="/trips" className="text-xs font-semibold text-[#0066FF] hover:text-[#0066FF]/80 transition-colors uppercase tracking-wider">
                                                View all
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {trips.slice(0, 4).map((trip) => {
                                                const startDate = new Date(trip.startDate);
                                                const endDate = new Date(trip.endDate);
                                                const nights = Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000));

                                                return (
                                                    <Link href={`/trip/${trip._id}`} key={trip._id} className="group">
                                                        <div className="bg-[#FFFFFF] p-2 border-2 border-dashed border-[#E5E7EB] rounded-2xl relative shadow-sm hover:border-[#0066FF]/50 transition-colors h-full flex flex-col">

                                                            <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                                                                <Image
                                                                    src={normalizeRemoteImage(trip.coverImage || FALLBACK_TRIP_COVER, 1200, 72)}
                                                                    alt={trip.title}
                                                                    fill
                                                                    sizes={CARD_IMAGE_SIZES}
                                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                                />

                                                                {/* Floating Date Badge */}
                                                                <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-[10px] font-bold text-white leading-none text-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300 z-10">
                                                                    {format(startDate, "MMM").toUpperCase()}<br />{format(startDate, "dd")}
                                                                </div>

                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                                                <div className="absolute top-3 left-3 flex items-start justify-between z-10">
                                                                    {trip.isDemo && (
                                                                        <Badge className="bg-white/95 text-[#1A1A1A] border-0 rounded-full px-2.5 h-5 text-[9px] uppercase tracking-wider font-bold shadow-sm">
                                                                            Curated
                                                                        </Badge>
                                                                    )}
                                                                </div>

                                                                <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end">
                                                                    <div className="flex flex-col">
                                                                        <h3 className="font-bold text-lg text-white leading-tight tracking-tight line-clamp-1 mb-1 drop-shadow-md">{trip.title}</h3>
                                                                        <div className="flex items-center text-white/90 text-xs font-medium">
                                                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                                                            <span className="line-clamp-1">{trip.destination || "Not set"}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between px-2 pb-1 mt-auto">
                                                                <div className="text-[11px] font-medium text-[#6B7280] flex items-center">
                                                                    {format(startDate, "MMM d")} - {format(endDate, "MMM d")} • {nights} nights
                                                                </div>
                                                                <div className="flex -space-x-2">
                                                                    <AvatarGroup
                                                                        avatars={trip.members.map((m) => {
                                                                            const isCurrentUser = user && m.userId === user.id;
                                                                            return {
                                                                                src: isCurrentUser ? user.imageUrl : (m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`),
                                                                                label: isCurrentUser ? (user.fullName || user.firstName || m.name) : m.name
                                                                            };
                                                                        })}
                                                                        maxVisible={3}
                                                                        size={24}
                                                                        overlap={8}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* SECTION 5 — RECENT ACTIVITY */}
                                    <div>
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="text-[15px] font-bold text-[#1A1A1A] tracking-tight">Recent Activity</h2>
                                        </div>
                                        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm p-6 h-auto min-h-[300px]">
                                            {isDemoUser ? (
                                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[0.875rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-[#E5E7EB]">

                                                    {/* Activity Item 1 */}
                                                    <div className="relative flex items-start gap-4">
                                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0 relative z-10 mx-0">
                                                            <User className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex-1 pb-1 pt-1.5">
                                                            <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider mb-1">2 hours ago</p>
                                                            <p className="text-xs text-[#1A1A1A] leading-relaxed"><span className="font-semibold">Alex</span> joined <span className="font-semibold text-[#0066FF]">Bali 2026</span></p>
                                                        </div>
                                                    </div>

                                                    {/* Activity Item 2 */}
                                                    <div className="relative flex items-start gap-4">
                                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 relative z-10 mx-0">
                                                            <span className="font-bold text-sm leading-none mt-0.5">₹</span>
                                                        </div>
                                                        <div className="flex-1 pb-1 pt-1.5">
                                                            <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider mb-1">1 day ago</p>
                                                            <p className="text-xs text-[#1A1A1A] leading-relaxed"><span className="font-semibold">You</span> added expense <span className="font-semibold">Flights</span></p>
                                                        </div>
                                                    </div>

                                                    {/* Activity Item 3 */}
                                                    <div className="relative flex items-start gap-4">
                                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 relative z-10 mx-0">
                                                            <Compass className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex-1 pb-1 pt-1.5">
                                                            <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider mb-1">2 days ago</p>
                                                            <p className="text-xs text-[#1A1A1A] leading-relaxed"><span className="font-semibold">Priya</span> added <span className="font-semibold">Scuba Diving</span> to itinerary</p>
                                                        </div>
                                                    </div>

                                                    {/* Activity Item 4 */}
                                                    <div className="relative flex items-start gap-4">
                                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 relative z-10 mx-0">
                                                            <UploadCloud className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex-1 pb-1 pt-1.5">
                                                            <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider mb-1">3 days ago</p>
                                                            <p className="text-xs text-[#1A1A1A] leading-relaxed"><span className="font-semibold">David</span> completed checklist <span className="font-semibold">Book Hotels</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60 mt-10">
                                                    <Compass className="w-8 h-8 text-[#6B7280] mb-3" />
                                                    <p className="text-sm font-medium text-[#1A1A1A]">No recent activity</p>
                                                    <p className="text-xs text-[#6B7280] mt-1 max-w-[180px]">Your trip updates and activity log will appear here.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Chatbox Layer - Bottom */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-40 px-4 flex flex-col items-center pointer-events-none">

                {/* Premium AI Response Toast */}
                <div className={cn(
                    "w-full mb-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform pointer-events-auto flex justify-center",
                    aiResponse ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.96] translate-y-3 blur-[2px] pointer-events-none hidden"
                )}>
                    <div className="bg-[#1A1A1A]/95 text-white backdrop-blur-xl border border-white/10 rounded-[1rem] py-3.5 px-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex items-center text-center justify-center mx-auto max-w-[85%] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 via-[#0066FF] to-purple-500 opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                        <p className="text-[13.5px] font-medium leading-relaxed text-white/90 drop-shadow-sm relative z-10">
                            {aiResponse}
                        </p>
                    </div>
                </div>

                <div className="bg-[#FFFFFF] w-full rounded-2xl shadow-xl shadow-black/10 border border-[#E5E7EB] p-2 flex flex-col relative overflow-hidden group focus-within:border-[#0066FF]/50 focus-within:ring-2 focus-within:ring-[#0066FF]/20 transition-all pointer-events-auto">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-[#0066FF] to-purple-500 opacity-50"></div>

                    <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#0066FF] bg-[#0066FF]/10 px-2 py-0.5 rounded-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Travio AI <span className="text-[#6B7280] font-medium lowercase tracking-normal">(Coming Soon)</span>
                        </span>
                    </div>

                    <form onSubmit={handleAISubmit} className="flex items-center gap-2 p-1 relative">
                        <button type="button" className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:bg-black/5 hover:text-[#1A1A1A] rounded-lg transition-colors shrink-0">
                            <Paperclip className="w-5 h-5 -rotate-45" />
                        </button>
                        <input
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] px-1 outline-none font-medium transition-all"
                            placeholder={isAiLoading ? "Processing request..." : "Ask Travio AI to help plan your next adventure..."}
                            type="text"
                            disabled={isAiLoading}
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={isAiLoading || !aiInput.trim()}
                            className="w-8 h-8 flex items-center justify-center bg-[#F3F4F6] text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#E5E7EB] rounded-[8px] transition-colors shrink-0 disabled:opacity-50 disabled:hover:bg-[#F3F4F6] disabled:hover:text-[#6B7280] mr-0.5 shadow-sm"
                        >
                            {isAiLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-[#0066FF]" />
                            ) : (
                                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* SHARED CREATE DIALOG */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[920px] p-0 overflow-hidden border border-[#E5E7EB] rounded-3xl shadow-2xl bg-[#FFFFFF] flex flex-col md:flex-row max-h-[90vh]">

                    {/* ── Left: Cover Preview ── */}
                    <div className="relative md:w-[340px] shrink-0 min-h-[240px] md:min-h-0 overflow-hidden">
                        <Image
                            src={selectedCoverSrc}
                            alt="Cover Preview"
                            fill
                            sizes={CARD_IMAGE_SIZES}
                            className="object-cover transition-all duration-700"
                            placeholder="empty"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top label */}
                        <div className="absolute top-5 left-5 right-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 mb-1">Cover Preview</p>
                            <p className="text-[11px] text-white/50">This will be your trip&apos;s featured image</p>
                        </div>

                        {/* Bottom title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-2xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                                {newTripTitle || "Paris Getaway"}
                            </h3>
                            {newTripDest && (
                                <div className="flex items-center gap-1 mt-1.5 text-white/70 text-xs font-medium">
                                    <MapPin className="w-3 h-3" />
                                    {newTripDest}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Form ── */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="px-8 pt-8 pb-0">
                            <DialogTitle className="text-xl font-bold tracking-tight text-[#1A1A1A] mb-0.5">Create New Trip</DialogTitle>
                            <DialogDescription className="text-sm text-[#6B7280]">
                                Set up the basics for your next adventure.
                            </DialogDescription>
                        </div>

                        {/* Form fields */}
                        <div className="px-8 pt-6 pb-4 flex-1 overflow-y-auto space-y-5">
                            {/* Trip Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9CA3AF] ml-1">Adventure Name <span className="text-[#0066FF]">*</span></label>
                                <div className="relative group/input">
                                    <Input
                                        value={newTripTitle}
                                        onChange={(e) => setNewTripTitle(e.target.value)}
                                        placeholder="e.g. Bali Summer 2026"
                                        className="rounded-2xl border-[#E5E7EB] bg-white h-12 pl-11 focus-visible:ring-[#0066FF]/20 focus-visible:border-[#0066FF] text-sm font-semibold transition-all shadow-sm"
                                    />
                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0066FF] opacity-60 transition-opacity group-focus-within/input:opacity-100" />
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9CA3AF] ml-1">Destination</label>
                                <div className="relative group/input">
                                    <Input
                                        value={newTripDest}
                                        onChange={(e) => setNewTripDest(e.target.value)}
                                        placeholder="e.g. Kyoto, Japan"
                                        className="rounded-2xl border-[#E5E7EB] bg-white h-12 pl-11 focus-visible:ring-[#0066FF]/20 focus-visible:border-[#0066FF] text-sm font-semibold transition-all shadow-sm"
                                    />
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] transition-colors group-focus-within/input:text-[#0066FF]" />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9CA3AF] ml-1">Departure <span className="text-[#0066FF]">*</span></label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-semibold rounded-2xl border-[#E5E7EB] bg-white h-12 hover:bg-slate-50 text-sm transition-all shadow-sm px-4", !startDate && "text-[#9CA3AF]")}>
                                                <CalendarIcon className="mr-3 h-4 w-4 text-[#6B7280] shrink-0" />
                                                {startDate ? format(startDate, "MMM d, yyyy") : <span>Start date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-3xl shadow-2xl border-[#E5E7EB] bg-white overflow-hidden" align="start" sideOffset={8}>
                                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Select Start</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                                            </div>
                                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3" />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9CA3AF] ml-1">Return <span className="text-[#0066FF]">*</span></label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-semibold rounded-2xl border-[#E5E7EB] bg-white h-12 hover:bg-slate-50 text-sm transition-all shadow-sm px-4", !endDate && "text-[#9CA3AF]")}>
                                                <CalendarIcon className="mr-3 h-4 w-4 text-[#6B7280] shrink-0" />
                                                {endDate ? format(endDate, "MMM d, yyyy") : <span>End date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-3xl shadow-2xl border-[#E5E7EB] bg-white overflow-hidden" align="end" sideOffset={8}>
                                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Select Return</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                                            </div>
                                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(d) => startDate ? d < startDate : false} initialFocus className="p-3" />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Cover Style */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9CA3AF]">Cover Style</label>
                                    <span className="text-[9px] font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full uppercase tracking-[0.14em]">Curated</span>
                                </div>
                                <div className="flex gap-2">
                                    {COVER_OPTIONS.map((option) => (
                                        <div
                                            key={option.key}
                                            onClick={() => setSelectedCover(option.url)}
                                            className={cn(
                                                "relative flex-1 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                                                selectedCover === option.url
                                                    ? "border-[#0066FF] ring-2 ring-[#0066FF]/20 shadow-md"
                                                    : "border-transparent opacity-60 hover:opacity-90"
                                            )}
                                        >
                                            <Image
                                                src={option.thumbnail}
                                                alt={option.label}
                                                fill
                                                sizes="(max-width: 768px) 88px, 120px"
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                                                <span className="text-[8px] font-bold text-white uppercase tracking-wider block truncate">{option.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Upload tile */}
                                    <div
                                        className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-[#E5E7EB] bg-[#FAFAFA] flex flex-col items-center justify-center gap-1 hover:border-[#0066FF]/50 hover:bg-[#0066FF]/5 transition-all opacity-70 hover:opacity-100"
                                        onClick={() => document.getElementById('cover-upload-trigger')?.click()}
                                    >
                                        {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin text-[#0066FF]" /> : <UploadCloud className="h-4 w-4 text-[#9CA3AF]" />}
                                        <span className="text-[8px] font-bold text-[#9CA3AF] uppercase tracking-wider">{uploadingCover ? "Uploading" : "Upload"}</span>
                                        <input
                                            id="cover-upload-trigger"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                await handleCoverUpload(e.target.files?.[0]);
                                                e.target.value = "";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-5 flex items-center justify-between gap-3 border-t border-[#E5E7EB] bg-[#FAFAFA] shrink-0">
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="font-semibold text-[#6B7280] hover:text-[#1A1A1A] rounded-xl px-6 h-10">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateTrip}
                                disabled={creating || !newTripTitle || !startDate || !endDate}
                                className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white font-bold rounded-xl h-10 px-8 shadow-sm shadow-[#0066FF]/30 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:shadow-none disabled:translate-y-0"
                            >
                                {creating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> : "Create Trip →"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
