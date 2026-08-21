"use client";

import React, { useEffect, useMemo, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronRight, Link as LinkIcon, Loader2, Lock, MapPin } from "lucide-react";

import { AvatarGroup } from "@frontend/ui/ui/avatar-group";
import { Button } from "@frontend/ui/ui/button";
import { CARD_IMAGE_SIZES, getLocalMediaSrc, normalizeRemoteImage } from "@shared/media";

interface JoinTripMember {
    name: string;
    avatar?: string;
}

interface JoinTripPreview {
    title: string;
    destination?: string;
    startDate: string;
    endDate: string;
    coverImage?: string;
    members?: JoinTripMember[];
}

function JoinCardSkeleton() {
    return (
        <div className="w-full max-w-[420px] rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-white p-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] sm:p-5">
            <div className="mb-4 h-48 animate-pulse rounded-xl bg-slate-200" />
            <div className="mb-5 space-y-3 px-4">
                <div className="mx-auto h-4 w-24 animate-pulse rounded-full bg-blue-100" />
                <div className="mx-auto h-8 w-2/3 animate-pulse rounded-full bg-slate-200" />
                <div className="mx-auto h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="mb-5 rounded-xl bg-[#F5F3ED] p-4">
                <div className="mx-auto h-4 w-20 animate-pulse rounded-full bg-slate-200" />
                <div className="mx-auto mt-4 h-9 w-28 animate-pulse rounded-full bg-slate-200" />
                <div className="mx-auto mt-3 h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-xl bg-blue-200" />
        </div>
    );
}

export default function JoinTripPage({ params }: { params: Promise<{ inviteCode: string }> }) {
    const { inviteCode } = use(params);
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");

    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [trip, setTrip] = useState<JoinTripPreview | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fallbackCover = useMemo(
        () => getLocalMediaSrc("curatedRoadTrip", 1200) ?? "/optimized/curatedRoadTrip-1200.avif",
        [],
    );

    useEffect(() => {
        const fetchTripPreview = async () => {
            try {
                const res = await fetch(`/api/invite/${inviteCode}`);
                if (!res.ok) {
                    throw new Error("Invalid or expired invite link");
                }
                const data = await res.json();
                setTrip(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Invalid or expired invite link");
            } finally {
                setLoading(false);
            }
        };
        fetchTripPreview();
    }, [inviteCode]);

    const handleJoinTrip = async () => {
        if (!user) return;
        setJoining(true);
        try {
            const res = await fetch(`/api/invite/${inviteCode}`, {
                method: "POST",
            });
            const data = await res.json();

            if (res.ok || data.message === "Already a member") {
                router.push(`/trip/${data.tripId}`);
                return;
            }

            setError(data.error || "Failed to join trip");
        } catch {
            setError("An error occurred while joining");
        } finally {
            setJoining(false);
        }
    };

    if (loading || !isLoaded) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F3ED] p-4 font-sans sm:p-6">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: `
                    radial-gradient(circle at 15% 50%, rgba(0, 0, 0, 0.02) 0%, transparent 40%), 
                    radial-gradient(circle at 85% 30%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
                    repeating-linear-gradient(45deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 1px, transparent 1px, transparent 20px)
                `,
                    }}
                />
                <JoinCardSkeleton />
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] p-6 font-inter">
                <div className="flex w-full max-w-md flex-col items-center text-center">
                    <div className="mb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <LinkIcon className="h-7 w-7 text-slate-400" />
                        </div>
                    </div>
                    <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                        Invalid Link
                    </h1>
                    <p className="mx-auto mb-10 max-w-[320px] text-[15px] font-medium leading-relaxed text-slate-500">
                        This invitation link is invalid or has expired. Please ask the trip organizer for a new access link.
                    </p>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                        <Button className="h-12 w-full rounded-xl bg-[#3b82f6] text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-blue-600 sm:w-48">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const inviterName = trip.members?.[0]?.name || "Someone";
    const coverImage = normalizeRemoteImage(trip.coverImage || fallbackCover, 1200, 72);
    const nights = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000));

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F3ED] p-4 font-sans sm:p-6">
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: `
                    radial-gradient(circle at 15% 50%, rgba(0, 0, 0, 0.02) 0%, transparent 40%), 
                    radial-gradient(circle at 85% 30%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
                    repeating-linear-gradient(45deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 1px, transparent 1px, transparent 20px)
                `,
                }}
            />

            <main className="relative z-10 flex w-full max-w-[420px] flex-col items-center">
                <div className="mb-5 flex justify-center">
                    <div className="group flex items-center gap-2 text-[#0066FF]">
                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute h-8 w-8 fill-current">
                                <path d="M120-120v-80h720v80H120Z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="plane-animate absolute h-8 w-8 fill-current" style={{ animationIterationCount: "infinite" }}>
                                <path d="M190-320L40-570l96-26 112 94 140-37-207-276 116-31 299 251 170-46q32-9 60.5 7.5T864-585q9 32-7.5 60.5T808-487L190-320Z" />
                            </svg>
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Travio</span>
                    </div>
                </div>

                <div
                    className="relative mb-5 w-full rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-white p-4 transition-transform duration-300 hover:scale-[1.01] sm:p-5"
                    style={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                    <div className="group relative mb-4 h-48 overflow-hidden rounded-xl">
                        <Image
                            alt={trip.title}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            src={coverImage}
                            fill
                            priority
                            sizes={CARD_IMAGE_SIZES}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <div className="mb-4 px-2 text-center sm:px-4">
                        <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-widest text-[#0066FF]">You&apos;re Invited</p>
                        <h1 className="mb-2 text-2xl font-bold leading-tight text-[#1A1A1A]">{trip.title}</h1>
                        <div className="flex w-full flex-nowrap items-center justify-center overflow-hidden whitespace-nowrap text-[13px] font-medium text-[#6B7280]">
                            <MapPin className="mr-1 h-3.5 w-3.5 shrink-0" />
                            <span className="max-w-[120px] truncate sm:max-w-[160px]">{trip.destination || "Wonderful Getaway"}</span>
                            <span className="mx-2 shrink-0 opacity-50">•</span>
                            <CalendarIcon className="mr-1 h-3.5 w-3.5 shrink-0" />
                            <span className="shrink-0">{format(startDate, "MMM d")} - {format(endDate, "MMM d")} • {nights} nights</span>
                        </div>
                    </div>

                    <div className="mb-5 rounded-xl bg-[#F5F3ED] p-4">
                        <p className="mb-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Who&apos;s Going</p>
                        <div className="mb-2.5 flex items-center justify-center -space-x-3">
                            <AvatarGroup
                                avatars={(trip.members || []).map((member: JoinTripMember) => ({
                                    src: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`,
                                    label: member.name,
                                }))}
                                maxVisible={4}
                                size={36}
                                overlap={10}
                            />
                        </div>
                        <p className="text-center text-[13px] text-[#6B7280]">
                            <span className="font-bold text-[#1A1A1A]">{inviterName}</span> invited you to join this trip.
                        </p>
                    </div>

                    {user ? (
                        <Button
                            onClick={handleJoinTrip}
                            disabled={joining}
                            className="flex h-auto w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] py-3.5 text-base font-medium text-white shadow-md shadow-[#0066FF]/20 transition-all hover:-translate-y-0.5 hover:bg-[#0066FF]/90 hover:shadow-lg"
                        >
                            {joining ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Joining...
                                </>
                            ) : (
                                <>
                                    Join Trip
                                    <ChevronRight className="h-5 w-5" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="pointer-events-none opacity-70">
                            <Button
                                disabled
                                className="flex h-auto w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] py-3.5 text-base font-medium text-white shadow-md shadow-[#0066FF]/20"
                            >
                                <Lock className="-ml-1 h-4 w-4" />
                                Join Trip
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>

                {!user && (
                    <div className="w-full space-y-4 pb-4 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-[#F5F3ED] px-3 text-[#6B7280]">New to Travio?</span>
                            </div>
                        </div>

                        <SignUpButton mode="modal" fallbackRedirectUrl={`${appUrl}/join/${inviteCode}`} signInFallbackRedirectUrl={`${appUrl}/join/${inviteCode}`}>
                            <button className="flex w-full items-center justify-center rounded-xl border border-[#E5E7EB] bg-white py-3 font-medium text-[#1A1A1A] shadow-sm transition-colors duration-200 hover:bg-gray-50">
                                Create account
                            </button>
                        </SignUpButton>
                        <p className="pt-2 text-sm text-[#6B7280]">
                            Already a member?{" "}
                            <SignInButton mode="modal" fallbackRedirectUrl={`${appUrl}/join/${inviteCode}`}>
                                <button className="font-semibold text-[#0066FF] underline-offset-4 decoration-2 hover:underline">Log in</button>
                            </SignInButton>
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
