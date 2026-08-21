/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    Calendar as CalendarIcon,
    Plus,
    PlaneTakeoff,
    MoreHorizontal,
    Settings,
    UploadCloud,
    Share2,
    Edit2,
    Trash2,
    MapPin,
    MessageSquare,
    Bell,
    FileText,
    CheckCircle2,
    Wallet,
    Download,
    Copy,
    Paperclip,
    Search,
    QrCode,
    GripVertical,
    ChevronDown,
    Loader2,
    RefreshCcw,
    Users,
    PieChart,
    Filter,
    Coffee,
    Home,
    Car,
    Ticket,
    Eye,
    EyeOff,
    ListChecks,
} from "lucide-react";
import { Button } from "@frontend/ui/ui/button";
import { Badge } from "@frontend/ui/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@frontend/ui/ui/dialog";
import { Input } from "@frontend/ui/ui/input";
import { Textarea } from "@frontend/ui/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@frontend/ui/ui/tabs";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@frontend/ui/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@frontend/ui/ui/avatar";
import { Checkbox } from "@frontend/ui/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@frontend/ui/ui/dropdown-menu";
import { THUMBNAIL_IMAGE_SIZES, normalizeRemoteImage } from "@shared/media";
import { cn } from "@shared/utils";
import { AvatarGroup } from "@frontend/ui/ui/avatar-group";
import { NotificationBell } from "@frontend/ui/notification-bell";
import { useUser, UserButton } from "@clerk/nextjs";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableActivity({ item, actIdx, dayIdx, user, updateActivity, deleteActivity, tripMembers, canEdit, tripId }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item._id,
        disabled: !canEdit
    });
    const [editForm, setEditForm] = useState(item);
    const [comments, setComments] = useState<{ id: string; text: string; user: string; avatar: string; time: string; isYou: boolean }[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [sending, setSending] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);

    const DUMMY_SEEDS = [
        "Can't wait for this one! 🙌",
        "Are we booking this in advance?",
        "Looks expensive but totally worth it.",
        "Let's leave early to avoid the crowd.",
        "I'll handle the tickets for everyone.",
        "Who else is joining this activity?",
        "Should we split the cost equally?",
        "This is going to be epic!",
        "Reminder: wear comfortable shoes.",
    ];

    useEffect(() => {
        setEditForm(item);
    }, [item]);

    useEffect(() => {
        if (!sheetOpen || !tripId || !item._id) return;
        setLoadingComments(true);
        fetch(`/api/trips/${tripId}/comments?activityId=${item._id}`)
            .then(r => r.json())
            .then((data: any[]) => {
                if (!Array.isArray(data) || data.length === 0) {
                    // Seed dummy comments for this activity
                    const count = [3, 4, 9][actIdx % 3];
                    const seeds = Array.from({ length: count }, (_, i) => {
                        const member = (tripMembers || [])[i % Math.max(tripMembers?.length || 1, 1)];
                        const isYou = user?.id === member?.userId;
                        return {
                            id: `seed-${actIdx}-${i}`,
                            text: DUMMY_SEEDS[(actIdx + i) % DUMMY_SEEDS.length],
                            user: isYou ? (user?.fullName || "You") : (member?.name || "Traveler"),
                            avatar: isYou ? user?.imageUrl : (member?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member?.name || "T")}&background=random`),
                            time: `${i + 1}h ago`,
                            isYou,
                        };
                    });
                    setComments(seeds);
                } else {
                    setComments(data.map((c: any) => ({
                        id: c._id,
                        text: c.text,
                        user: c.userName,
                        avatar: c.avatar,
                        time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isYou: c.userId === user?.id,
                    })));
                }
            })
            .catch(() => { })
            .finally(() => setLoadingComments(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sheetOpen, tripId, item._id]);

    const handleSendComment = async () => {
        const text = newComment.trim();
        if (!text || sending) return;
        setSending(true);
        // Optimistic update
        const optimistic = {
            id: `opt-${Date.now()}`,
            text,
            user: user?.fullName || user?.firstName || "You",
            avatar: user?.imageUrl || "",
            time: "just now",
            isYou: true,
        };
        setComments(prev => [...prev, optimistic]);
        setNewComment("");
        try {
            const res = await fetch(`/api/trips/${tripId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activityId: item._id, text }),
            });
            const saved = await res.json();
            if (res.ok) {
                setComments(prev => prev.map(c =>
                    c.id === optimistic.id
                        ? { ...c, id: saved._id, time: new Date(saved.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                        : c
                ));
            }
        } catch {
            // keep optimistic comment on failure
        } finally {
            setSending(false);
        }
    };

    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };
    const isFlight = item.category === 'Flight';

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <div className="group bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer relative text-left">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-md tracking-wide" style={{ fontFamily: "'Quicksand', sans-serif" }}>{item.time}</span>
                            {canEdit && (
                                <div {...listeners} className="p-1 -m-1">
                                    <GripVertical className="h-4 w-4 text-slate-300 transition-colors opacity-50 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <h4 className="font-bold text-slate-900 mb-1.5 text-[16px] truncate" style={{ fontFamily: "'Quicksand', sans-serif" }}>{item.title}</h4>
                            <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                {isFlight ? <PlaneTakeoff className="h-3.5 w-3.5 text-slate-400" /> : <MapPin className="h-3.5 w-3.5 text-slate-400" />}
                                <span className="truncate">{item.location}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-50">
                            <div className="flex -space-x-1.5">
                                {(tripMembers || []).slice(0, 4).map((m: any, i: number, arr: any[]) => (
                                    <div
                                        key={i}
                                        className="group/avatar relative rounded-full border-[1.5px] border-white bg-slate-200 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:z-50 cursor-pointer"
                                        style={{ zIndex: arr.length - i }}
                                    >
                                        <Image
                                            src={normalizeRemoteImage(i === 0 && user ? user.imageUrl : (m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}`), 96, 65)}
                                            alt={m.name || "Traveler"}
                                            width={24}
                                            height={24}
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                        {/* Tooltip */}
                                        <div
                                            className="pointer-events-none absolute left-1/2 z-[100] whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-xl transition-all duration-200 group-hover/avatar:-translate-y-1 group-hover/avatar:opacity-100"
                                            style={{
                                                top: '-28px', transform: "translateX(-50%)"
                                            }}
                                        >
                                            {m.name || "Traveler"}
                                            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center text-slate-400 gap-1.5 text-[13px] font-bold" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                <MessageSquare className="h-3.5 w-3.5 fill-slate-300 text-slate-200" />
                                <span>{actIdx * 3 + (actIdx === 0 ? 2 : 0)}</span>
                            </div>
                        </div>
                    </div>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-xl w-full p-0 border-l border-slate-200 shadow-2xl bg-white flex flex-col overflow-hidden rounded-l-3xl">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm">
                        <SheetTitle className="font-bold text-xl text-slate-900 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>Edit Activity</SheetTitle>
                        <Badge className="bg-white border border-slate-200 text-slate-700 shadow-sm px-3 py-1 text-xs font-bold uppercase tracking-widest">{item.category}</Badge>
                    </div>
                    <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="space-y-5">
                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5 block">Activity Title</label>
                                <Input
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#3b82f6]/20 bg-slate-50/30"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5 block">Time</label>
                                    <Input
                                        value={editForm.time}
                                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                        className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#3b82f6]/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5 block">Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-[#3b82f6]/20 outline-none"
                                    >
                                        <option value="Activity">Activity</option>
                                        <option value="Flight">Flight</option>
                                        <option value="Food">Food</option>
                                        <option value="Stay">Stay</option>
                                        <option value="Transport">Transport</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5 block">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="h-12 pl-11 rounded-xl border-slate-200 focus-visible:ring-[#3b82f6]/20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5 block">Notes</label>
                                <Textarea
                                    value={editForm.notes}
                                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                    className="min-h-[80px] rounded-xl border-slate-200 focus-visible:ring-[#3b82f6]/20 resize-none"
                                />
                            </div>

                            {/* COMMENTS SECTION */}
                            <div className="pt-6 border-t border-slate-100">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-4 flex items-center justify-between">
                                    Discussion
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{comments.length}</span>
                                </label>
                                <div className="space-y-4 mb-4 max-h-48 overflow-y-auto">
                                    {loadingComments ? (
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Loader2 className="h-4 w-4 animate-spin" /> Loading discussion…
                                        </div>
                                    ) : comments.length === 0 ? (
                                        <p className="text-sm text-slate-400 italic">No comments yet. Start the discussion!</p>
                                    ) : (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-3">
                                                <Avatar className="h-8 w-8 shrink-0 border border-slate-200">
                                                    <AvatarImage src={normalizeRemoteImage(comment.avatar || "", 32, 21)} />
                                                    <AvatarFallback className="bg-slate-100 text-[10px] font-bold">{comment.user[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-3 border border-slate-100">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[13px] font-bold text-slate-900" style={{ fontFamily: "'Quicksand', sans-serif" }}>{comment.user}</span>
                                                            {comment.isYou && <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-0 rounded text-[9px] px-1 py-0 h-4">You</Badge>}
                                                        </div>
                                                        <span className="text-[10px] font-medium text-slate-400">{comment.time}</span>
                                                    </div>
                                                    <p className="text-[13px] text-slate-600 leading-snug">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type a message…"
                                        className="h-10 rounded-xl border-slate-200 focus-visible:ring-[#0066FF]/20 text-[13px]"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(); } }}
                                        disabled={sending}
                                    />
                                    <Button
                                        size="icon"
                                        className="h-10 w-10 shrink-0 rounded-xl bg-[#0066FF] hover:bg-[#0066FF]/90 text-white shadow-sm disabled:opacity-40"
                                        onClick={handleSendComment}
                                        disabled={!newComment.trim() || sending}
                                    >
                                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <SheetClose asChild>
                            <Button
                                variant="ghost"
                                onClick={() => deleteActivity(dayIdx, item._id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl px-6"
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                        </SheetClose>
                        <div className="flex gap-3">
                            <SheetClose asChild>
                                <Button
                                    onClick={() => updateActivity(dayIdx, item._id, editForm)}
                                    className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-xl px-8 h-12 shadow-sm"
                                >
                                    Save Changes
                                </Button>
                            </SheetClose>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

function TripDetailLoadingSkeleton() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-inter pb-20 relative overflow-hidden">
            {/* DOT PATTERN BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundImage: "radial-gradient(#E4E4E7 1px, transparent 1px)",
                backgroundSize: "24px 24px"
            }} />

            {/* Nav Skeleton */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5E7EB] bg-white sticky top-0 z-30">
                <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200/60" />
                <div className="flex items-center gap-4">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200/60" />
                    <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200/60" />
                </div>
            </div>

            {/* Banner Skeleton */}
            <div className="relative h-48 sm:h-[260px] w-full z-10 shrink-0 bg-slate-200">
                <div className="absolute inset-0 animate-pulse bg-slate-300" />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="space-y-4 w-full">
                        <div className="h-6 w-48 animate-pulse rounded-full bg-black/10" />
                        <div className="h-10 w-72 max-w-full animate-pulse rounded-full bg-black/10" />
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="w-full flex-1 flex flex-col mt-0">
                <div className="bg-white border-b border-[#E5E7EB] z-20 px-8 w-full">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <div className="flex gap-8 py-4">
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <div key={idx} className="h-5 w-16 animate-pulse rounded-full bg-slate-200/60" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-4 w-full sm:px-8 py-8 space-y-8 flex-1">
                    <div className="flex gap-6 overflow-hidden">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="w-[340px] shrink-0 rounded-[1.25rem] bg-white p-5 shadow-sm border border-slate-100">
                                <div className="mb-6 h-7 w-28 animate-pulse rounded-full bg-slate-200/60" />
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((__, cardIdx) => (
                                        <div key={cardIdx} className="rounded-xl bg-slate-50/50 p-4 border border-slate-100">
                                            <div className="mb-3 h-4 w-16 animate-pulse rounded-full bg-slate-200/60" />
                                            <div className="mb-2 h-5 w-2/3 animate-pulse rounded-full bg-slate-200/80" />
                                            <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200/60" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TripDetailPage({ params }: { params: Promise<{ tripId: string }> }) {
    const { tripId } = use(params);
    const { user } = useUser();
    const isDemoUser = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === "demo@travio.com";
    const [activeTab, setActiveTab] = useState("itinerary");
    const [loading, setLoading] = useState(true);
    const [, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    interface TripMember { userId: string; name: string; avatar: string; role: string; email?: string; }
    interface Activity { _id: string; title: string; time: string; location: string; notes: string; cost: number; category: string; }
    interface Day { label: string; date: string; activities: Activity[]; }
    interface Expense { _id: string; name: string; category: string; amount: number; paidBy: string; paidByName: string; date: string; }
    interface ChecklistItem { _id?: string; text: string; done: boolean; category?: string; }
    interface TripFile {
        _id: string;
        name: string;
        url: string;
        publicId?: string;
        format?: string;
        bytes?: number;
        resourceType?: "image" | "raw" | "video";
        documentCategory?: "flight" | "hotel" | "insurance" | "car" | "general";
        width?: number;
        height?: number;
        uploadedByName: string;
        createdAt: string;
    }
    interface Trip {
        _id: string; title: string; startDate: string; endDate: string; ownerId: string;
        isDemo?: boolean; coverImage: string;
        members: TripMember[];
        days: Day[]; expenses: Expense[]; checklist: ChecklistItem[]; files: TripFile[]; inviteCode: string;
    }

    const [trip, setTrip] = useState<Trip | null>(null);
    const [localRoles, setLocalRoles] = useState<Record<string, string>>({});
    const [days, setDays] = useState<Day[]>([]);
    const [budgetData, setBudgetData] = useState<Expense[]>([]);
    const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
    const [newChecklistItems, setNewChecklistItems] = useState<Record<string, string>>({});
    const [newCategoryName, setNewCategoryName] = useState("");
    const [files, setFiles] = useState<TripFile[]>([]);

    // File Upload Dialog State
    const [uploading, setUploading] = useState(false);
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<"flight" | "hotel" | "insurance" | "car" | "general">("general");
    const [previewFile, setPreviewFile] = useState<TripFile | null>(null);

    const router = useRouter();
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/$/, "");

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isCoverHidden, setIsCoverHidden] = useState(false);
    const [transactionFilter, setTransactionFilter] = useState("All");
    const fetchTrip = useCallback(async (isInitial = true) => {
        try {
            if (isInitial) setLoading(true);
            setError(null);
            const res = await fetch(`/api/trips/${tripId}`);
            const data = await res.json();

            if (res.ok) {
                setTrip(data);
                setDays(data.days || []);
                setBudgetData(data.expenses || []);
                setChecklists(data.checklist || []);
                setFiles(data.files || []);
            } else {
                setError(data.error || "Failed to load trip");
            }
        } catch {
            setError("A network error occurred. Please try again.");
        } finally {
            if (isInitial) setLoading(false);
        }
    }, [tripId]);

    useEffect(() => { fetchTrip(); }, [fetchTrip]);

    useEffect(() => {
        if (trip) setEditedTitle(trip.title);
    }, [trip]);

    const saveTrip = async (updates: any) => {
        setSaving(true);
        try {
            await fetch(`/api/trips/${tripId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
        } finally {
            setSaving(false);
        }
    };

    const sensors = useSensors(useSensor(PointerSensor));

    const onDragEnd = async (event: DragEndEvent, dayIdx: number) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIdx = days[dayIdx].activities.findIndex((a) => a._id === active.id);
        const newIdx = days[dayIdx].activities.findIndex((a) => a._id === over.id);

        const newDays = [...days];
        newDays[dayIdx].activities = arrayMove(newDays[dayIdx].activities, oldIdx, newIdx);
        setDays(newDays);
        await saveTrip({ days: newDays });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setFileToUpload(file);
        setIsFileModalOpen(true);
        // Reset input value so same file can be selected again if needed
        e.target.value = "";
    };

    const confirmFileUpload = async () => {
        if (!fileToUpload || !user) return;

        setUploading(true);
        setIsFileModalOpen(false);

        const formData = new FormData();
        formData.append("file", fileToUpload);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();

            if (res.ok) {
                const newFile: any = {
                    name: data.name,
                    url: data.url,
                    publicId: data.publicId,
                    format: data.format,
                    bytes: data.bytes,
                    resourceType: data.resourceType,
                    documentCategory: selectedCategory,
                    width: data.width,
                    height: data.height,
                    uploadedBy: user.id || "userId",
                    uploadedByName: user.fullName || user.firstName || "You",
                    createdAt: new Date().toISOString()
                };
                const updated = [...files, newFile];
                setFiles(updated);
                await saveTrip({ files: updated });
                fetchTrip(false); // reload to get IDs without full page refresh
            } else {
                alert(data.error || "Upload failed. Please check your Cloudinary configuration.");
            }
        } catch {
            alert("File upload failed. Ensure CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET are set.");
        } finally {
            setUploading(false);
            setFileToUpload(null);
            setSelectedCategory("general");
        }
    };

    const deleteFile = async (id: string) => {
        const updated = files.filter(f => f._id !== id);
        setFiles(updated);
        await saveTrip({ files: updated });
    };

    const updateActivity = async (dayIdx: number, activityId: string, updates: any) => {
        const newDays = [...days];
        const actIdx = newDays[dayIdx].activities.findIndex(a => a._id === activityId);
        if (actIdx === -1) return;
        newDays[dayIdx].activities[actIdx] = { ...newDays[dayIdx].activities[actIdx], ...updates };
        setDays(newDays);
        await saveTrip({ days: newDays });
    };

    const deleteActivity = async (dayIdx: number, activityId: string) => {
        const newDays = [...days];
        newDays[dayIdx].activities = newDays[dayIdx].activities.filter(a => a._id !== activityId);
        setDays(newDays);
        await saveTrip({ days: newDays });
    };

    const handleSaveTitle = async () => {
        if (!editedTitle || editedTitle === trip?.title) {
            setIsEditingTitle(false);
            return;
        }
        setIsEditingTitle(false);
        if (trip) {
            setTrip({ ...trip, title: editedTitle });
            await saveTrip({ title: editedTitle });
        }
    };

    const handleDeleteTrip = async () => {
        if (!window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/dashboard");
            } else {
                alert("Failed to delete trip");
            }
        } finally {
            setDeleting(false);
        }
    };

    const toggleChecklist = async (id: string) => {
        const updated = checklists.map(item => item._id === id ? { ...item, done: !item.done } : item);
        setChecklists(updated);
        await saveTrip({ checklist: updated });
    };

    const addChecklist = async (category: string) => {
        const text = newChecklistItems[category];
        if (!text) return;
        const newItem = { text, done: false, category };
        const updated = [...checklists, newItem as any];
        setChecklists(updated);
        setNewChecklistItems(prev => ({ ...prev, [category]: "" }));
        await saveTrip({ checklist: updated });
        fetchTrip(false); // Get back with IDs without refresh
    };

    const addNewCategory = async () => {
        if (!newCategoryName) return; // Add a dummy item to save the category
        const newItem = { text: "New Item", done: false, category: newCategoryName };
        const updated = [...checklists, newItem as any];
        setChecklists(updated);
        setNewCategoryName("");
        await saveTrip({ checklist: updated });
        fetchTrip(false);
    };

    const deleteChecklistCategory = async (category: string) => {
        if (!window.confirm("Are you sure you want to delete this entire list?")) return;
        const updated = checklists.filter(c => c.category !== category);
        setChecklists(updated);
        await saveTrip({ checklist: updated });
    };

    const deleteExpense = async (id: string) => {
        const updated = budgetData.filter(e => e._id !== id);
        setBudgetData(updated);
        await saveTrip({ expenses: updated });
    };

    const addActivity = async (dayIdx: number) => {
        const newAct = { _id: `temp_${Date.now()}`, title: "New Activity", time: "10:00 AM", location: "Location", notes: "", category: "Misc", cost: 0 };
        const newDays = [...days];

        // Ensure we clone the specific day to avoid direct state mutation
        newDays[dayIdx] = { ...newDays[dayIdx] };
        newDays[dayIdx].activities = [...(newDays[dayIdx].activities || []), newAct as any];

        setDays(newDays);
        await saveTrip({ days: newDays });
        fetchTrip(false);
    };

    const handleUpdateRole = async (userId: string, newRole: string) => {
        if (!trip) return;
        const updatedMembers = trip.members.map(m => m.userId === userId ? { ...m, role: newRole } : m);
        setTrip({ ...trip, members: updatedMembers });
        await saveTrip({ members: updatedMembers });
        setLocalRoles(prev => ({ ...prev, [userId]: newRole.charAt(0).toUpperCase() + newRole.slice(1) }));
    };

    // Calculate aggregates
    const totalBudget = (budgetData || []).reduce((a, b) => a + b.amount, 0);
    const aggBudgetData = (() => {
        const categories = ['Food', 'Travel', 'Stay', 'Transport', 'Activities', 'Misc'];
        const colors: Record<string, string> = {
            'Food': '#3b82f6',
            'Travel': '#f59e0b',
            'Stay': '#10b981',
            'Transport': '#ec4899',
            'Activities': '#8b5cf6',
            'Misc': '#64748b'
        };
        return categories.map(cat => ({
            name: cat,
            value: (budgetData || []).filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
            color: colors[cat] || '#64748b'
        })).filter(i => i.value > 0);
    })();

    const isImageFile = (file: TripFile) => {
        if (file.resourceType) {
            return file.resourceType === "image";
        }

        return Boolean(file.format?.match(/^(jpg|jpeg|png|webp|avif|gif)$/i));
    };

    if (loading) return <TripDetailLoadingSkeleton />;

    if (!trip || error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-slate-900 mb-2 leading-tight">
                    {error || "Trip not found"}
                </h1>
                <p className="text-slate-500 mb-8">
                    We couldn&apos;t load the trip details. Please check your connection or dashboard.
                </p>
                <Link href="/dashboard">
                    <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl px-8 font-semibold">
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
    // ─── Role Derivation ─────────────────────────────────────────────────────────
    const currentMember = trip.members.find((m: TripMember) => m.userId === user?.id);
    const isOwner = trip.ownerId === user?.id;
    const currentRole = isOwner ? "owner" : (currentMember?.role?.toLowerCase() || "viewer");
    const canEdit = currentRole === "owner" || currentRole === "editor"; // viewer cannot edit ANYTHING
    // ────────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen flex flex-col font-inter pb-20 animate-fade-in">

            {/* TOP NAVIGATION BAR */}
            <header className="flex h-[72px] items-center justify-between px-8 border-b border-[#E5E7EB] bg-[#FAFAFA]/80 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/trips" className="hover:text-slate-900 transition-colors">Trips</Link>
                    <span>/</span>
                    <span className="text-[#1A1A1A] font-medium">{trip.title}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCoverHidden(!isCoverHidden)}
                        title={isCoverHidden ? "Show Cover Image" : "Hide Cover Image"}
                        className="relative w-9 h-9 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-slate-900 transition-colors shadow-sm"
                    >
                        {isCoverHidden ? <Eye className="w-[18px] h-[18px]" /> : <EyeOff className="w-[18px] h-[18px]" />}
                    </button>

                    <NotificationBell isDemoUser={isDemoUser} />

                    <div className="flex items-center border-l border-[#E5E7EB] pl-4 h-6">
                        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 ring-1 ring-slate-200 shadow-sm" } }} />
                    </div>
                </div>
            </header>

            {/* HEADER BANNER */}
            <div className={`relative w-full z-10 shrink-0 transition-all duration-500 overflow-hidden ${isCoverHidden ? 'h-32 sm:h-[160px]' : 'h-48 sm:h-[260px]'}`}>
                {!isCoverHidden ? (
                    <>
                        <Image
                            src={normalizeRemoteImage(trip.coverImage, 1200, 74)}
                            alt={`${trip.title} cover`}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800"></div>
                )}

                {canEdit && (
                    <div className="absolute top-4 right-4 z-20">
                        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                            <DialogTrigger asChild>
                                <button className="flex items-center justify-center h-8 w-8 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors text-white/90 border border-white/10">
                                    <Settings className="h-[15px] w-[15px]" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border border-[#E5E7EB] rounded-[1.5rem] shadow-2xl bg-[#FAFAFA]" aria-describedby="dialog-description">
                                <div className="flex flex-col bg-white border-b border-[#E5E7EB] px-8 py-6">
                                    <DialogTitle className="text-2xl font-bold tracking-tight text-[#1A1A1A]" style={{ fontFamily: "'Quicksand', sans-serif" }}>Trip Settings</DialogTitle>
                                    <DialogDescription id="dialog-description" className="text-[#6B7280] text-sm mt-1">Manage your trip preferences and configuration.</DialogDescription>
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* Display Preferences Card */}
                                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
                                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Display Preferences</h2>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-[#1A1A1A]">Hide Cover Image</p>
                                                <p className="text-xs text-[#6B7280] mt-0.5">Show a minimal header without the cover photo.</p>
                                            </div>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={isCoverHidden}
                                                onClick={() => setIsCoverHidden(!isCoverHidden)}
                                                className={`relative inline-flex h-5 w-[38px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isCoverHidden ? 'bg-[#0066FF]' : 'bg-[#E5E7EB]'}`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isCoverHidden ? 'translate-x-4' : 'translate-x-0'}`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Trip Data Card */}
                                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
                                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Trip Data</h2>
                                        <div className="flex items-center justify-between pb-5 border-b border-[#E5E7EB]">
                                            <div>
                                                <p className="text-sm font-medium text-[#1A1A1A]">Rename Trip</p>
                                                <p className="text-xs text-[#6B7280] mt-0.5">Change the display name of this trip.</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="text-sm px-4 py-1.5 h-auto text-[#1A1A1A] rounded-lg font-medium border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
                                                onClick={() => { setIsSettingsOpen(false); setIsEditingTitle(true); }}
                                            >
                                                Rename
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between pt-5">
                                            <div>
                                                <p className="text-sm font-medium text-[#e11d48]">Delete Trip</p>
                                                <p className="text-xs text-[#f43f5e] mt-0.5">Permanently remove this trip and all data.</p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                className="text-sm px-4 py-1.5 h-auto bg-[#fff1f2] text-[#e11d48] hover:bg-[#ffe4e6] hover:text-[#be123c] shadow-none border border-[#ffe4e6] rounded-lg font-medium transition-colors"
                                                onClick={handleDeleteTrip}
                                                disabled={deleting}
                                            >
                                                {deleting ? "Deleting..." : "Delete Permanently"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border-t border-[#E5E7EB] p-5 flex justify-end rounded-b-[1.5rem]">
                                    <Button onClick={() => setIsSettingsOpen(false)} className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white rounded-lg px-6 py-2 h-auto font-medium shadow-sm transition-colors">Done</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {/* Bottom Overlay: Title, Dates, Users */}
                <div className={`absolute left-8 right-8 flex justify-between items-end ${isCoverHidden ? 'bottom-6' : 'bottom-8'}`}>
                    <div className="text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-[#0066FF] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider leading-none shadow-sm">
                                {canEdit ? "Upcoming" : "Viewer"}
                            </span>
                            <span className="text-[15px] font-medium text-white/90 drop-shadow-sm tracking-wide">
                                {format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1.5 group/title">
                            {isEditingTitle ? (
                                <Input
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    onBlur={handleSaveTitle}
                                    onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                                    autoFocus
                                    className="text-[34px] sm:text-[40px] font-bold bg-white/10 text-white border-white/30 h-auto py-1 px-3 rounded-lg focus-visible:ring-[#0066FF]/50 max-w-sm leading-tight"
                                />
                            ) : (
                                <h1 className="text-[34px] sm:text-[40px] font-bold text-white tracking-tight drop-shadow-lg flex items-center gap-3 cursor-pointer leading-tight" onClick={() => canEdit && setIsEditingTitle(true)}>
                                    {trip.title}
                                    {canEdit && <Edit2 className="h-5 w-5 opacity-0 group-hover/title:opacity-100 transition-opacity text-white/70" />}
                                </h1>
                            )}
                            <p className="text-[15px] font-medium opacity-90 flex items-center gap-1.5 text-white drop-shadow mt-0.5">
                                <MapPin className="h-[16px] w-[16px] text-white/80" /> {(trip.days && trip.days.length > 0 && trip.days[0]?.activities[0]?.location) || "Multiple Locations"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center hidden sm:flex gap-4">
                        <div className="flex -space-x-2 items-center">
                            {(trip.members || []).slice(0, 4).map((m: TripMember, idx, arr) => (
                                <div
                                    key={m.userId}
                                    className="group/avatar relative shrink-0 rounded-full border-[2px] border-white bg-white shadow-sm transition-transform duration-300 hover:-translate-y-[6px] hover:z-50 cursor-pointer"
                                    style={{ zIndex: arr.length - idx }}
                                >
                                    <Image
                                        alt={m.name}
                                        width={32}
                                        height={32}
                                        className="w-[32px] h-[32px] rounded-full object-cover"
                                        src={idx === 0 && user ? user.imageUrl : (m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}`)}
                                    />
                                    {/* Tooltip */}
                                    <div
                                        className="pointer-events-none absolute left-1/2 z-[100] whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white opacity-0 shadow-xl transition-all duration-200 group-hover/avatar:-translate-y-2 group-hover/avatar:opacity-100"
                                        style={{
                                            top: '-36px', transform: "translateX(-50%)"
                                        }}
                                    >
                                        {m.name}
                                        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {canEdit && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigator.clipboard.writeText(`${appUrl}/join/${trip?.inviteCode}`);
                                    alert("Invite link copied to clipboard!");
                                }}
                                title="Copy Shareable Invite Link"
                                className="group relative w-[44px] h-[44px] shrink-0 rounded-full border-[2px] border-white bg-white/30 hover:bg-white/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 text-white shadow-sm z-0 hover:z-50 hover:-translate-y-[6px]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <line x1="19" y1="8" x2="19" y2="14" />
                                    <line x1="22" y1="11" x2="16" y2="11" />
                                </svg>
                                {/* Tooltip */}
                                <div
                                    className="pointer-events-none absolute left-1/2 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100"
                                    style={{ top: -38, transform: "translateX(-50%)" }}
                                >
                                    Copy Invite Link
                                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col mt-0 border-0 p-0 shadow-none relative">
                <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 w-full overflow-hidden py-3">
                    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-8">
                        <TabsList className="inline-flex h-11 items-center justify-start rounded-xl bg-slate-100/80 p-1 text-slate-500 shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {['Itinerary', 'Budget', 'Checklist', 'Files', 'Members'].map((tab) => {
                                const tabValue = tab.toLowerCase() === 'checklist' ? 'checklists' : tab.toLowerCase();
                                return (
                                    <TabsTrigger
                                        key={tab}
                                        value={tabValue}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-1.5 text-[14px] font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm hover:text-slate-700 h-full"
                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                    >
                                        {tab}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-4 w-full sm:px-8 py-8 space-y-8 flex-1">
                    {/* ITINERARY TAB */}
                    <TabsContent value="itinerary" className="outline-none border-none m-0 p-0 h-full mt-2">
                        <div className="flex-1 overflow-x-auto pb-12 no-scrollbar px-4 sm:px-0">
                            <div className="flex gap-6 min-w-max items-start">
                                {days.map((day, idx) => (
                                    <div key={day.date} className="w-[340px] flex flex-col bg-white border border-slate-200 rounded-[1.25rem] shadow-sm overflow-hidden h-fit">
                                        <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-[22px] text-slate-900 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>Day {idx + 1}</h3>
                                                <p className="text-[13px] text-slate-500 font-medium mt-0.5" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                    {format(new Date(day.date), "EEE, MMM d")} • {day.label || "Planned"}
                                                </p>
                                            </div>
                                            {canEdit && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="text-slate-400 hover:text-slate-700 transition-colors mt-1">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-200 p-2 min-w-[160px]">
                                                        <DropdownMenuItem className="rounded-lg font-medium cursor-pointer py-2 text-slate-700 text-[13px]" style={{ fontFamily: "'Quicksand', sans-serif" }}>Edit Day Info</DropdownMenuItem>
                                                        {isOwner && (
                                                            <DropdownMenuItem className="text-red-600 rounded-lg font-medium cursor-pointer py-2 text-[13px] focus:bg-red-50 focus:text-red-700" style={{ fontFamily: "'Quicksand', sans-serif" }}>Remove Day</DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>

                                        <div className="p-4 flex flex-col gap-4 bg-slate-50/30 min-h-[100px]">
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragEnd={(e) => canEdit && onDragEnd(e, idx)}
                                            >
                                                <SortableContext
                                                    items={(day.activities || []).map(a => a._id)}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    {(day.activities || []).map((item: Activity, actIdx) => (
                                                        <SortableActivity
                                                            key={item._id}
                                                            item={item}
                                                            actIdx={actIdx}
                                                            dayIdx={idx}
                                                            user={user}
                                                            tripMembers={trip?.members}
                                                            updateActivity={updateActivity}
                                                            deleteActivity={deleteActivity}
                                                            canEdit={canEdit}
                                                            tripId={trip?._id}
                                                        />
                                                    ))}
                                                </SortableContext>
                                            </DndContext>

                                            {/* Add Activity Button placed directly below the cards */}
                                            {canEdit && (
                                                <button
                                                    onClick={() => addActivity(idx)}
                                                    className="w-full py-3.5 rounded-xl border-[1.5px] border-dashed border-slate-200 text-slate-500 font-bold text-[14px] hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 bg-transparent shadow-sm mt-2"
                                                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                                                >
                                                    <Plus className="h-4 w-4" /> Add Activity
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {canEdit && (
                                    <div
                                        onClick={() => addActivity(days.length - 1)} // Assuming it adds to last day or we can create a new addDay function if needed
                                        className="w-[340px] flex-shrink-0 flex flex-col bg-transparent border-[1.5px] border-dashed border-slate-300 rounded-[1.25rem] h-[180px] hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer group items-center justify-center mt-0"
                                    >
                                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                                            <Plus className="h-6 w-6 text-slate-500 group-hover:text-slate-700" />
                                        </div>
                                        <span className="text-[16px] font-bold text-slate-500 group-hover:text-slate-700" style={{ fontFamily: "'Quicksand', sans-serif" }}>Add Another Day</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* BUDGET TAB */}
                    <TabsContent value="budget" className="mt-4 outline-none">
                        <div className="space-y-8 pb-12">
                            {/* Budget Overview Header */}
                            <div className="flex items-end justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>Budget Overview</h2>
                                    <p className="text-slate-500 text-sm font-medium">Track expenses and manage splits for your trip.</p>
                                </div>
                                {canEdit && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm shadow-sm shadow-blue-500/20">
                                                <Plus className="h-4 w-4" /> Add Expense
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] border-0 shadow-2xl p-6 sm:p-8 bg-white">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>New Expense</DialogTitle>
                                                <DialogDescription className="text-slate-500 font-medium">Record a new cost for the trip.</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-5 py-6">
                                                <div className="grid gap-2.5">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">What was this for?</label>
                                                    <Input id="expense-name" placeholder="E.g. Dinner, Taxi, Tickets" className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#3b82f6]/20 bg-slate-50/50 font-bold text-slate-800" />
                                                </div>
                                                <div className="grid gap-2.5">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Amount (₹)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                                        <Input id="expense-amount" type="number" placeholder="0.00" className="h-12 pl-8 rounded-xl border-slate-200 focus-visible:ring-[#3b82f6]/20 bg-slate-50/50 font-bold text-slate-800" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2.5">
                                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Category</label>
                                                        <select id="expense-category" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#3b82f6]/20 appearance-none">
                                                            <option value="Food">Food</option>
                                                            <option value="Stay">Stay</option>
                                                            <option value="Travel">Travel</option>
                                                            <option value="Transport">Transport</option>
                                                            <option value="Activities">Activities</option>
                                                            <option value="Misc">Misc</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid gap-2.5">
                                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Paid By</label>
                                                        <select id="expense-payer" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#3b82f6]/20 appearance-none">
                                                            {(trip.members || []).map((m: TripMember) => {
                                                                const isYou = user && m.userId === user.id;
                                                                return <option key={m.userId} value={m.userId}>{isYou ? "You" : m.name}</option>;
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="w-full rounded-xl bg-[#3b82f6] hover:bg-blue-600 font-bold shadow-md h-12 text-white tracking-wide" onClick={async () => {
                                                const nameInput = document.getElementById('expense-name') as HTMLInputElement;
                                                const amountInput = document.getElementById('expense-amount') as HTMLInputElement;
                                                const payerSelect = document.getElementById('expense-payer') as HTMLSelectElement;
                                                const categorySelect = document.getElementById('expense-category') as HTMLSelectElement;
                                                if (nameInput?.value && amountInput?.value) {
                                                    const m = trip.members.find(m => m.userId === payerSelect.value);
                                                    const rawName = m?.name || "Member";
                                                    const isDemoOwner = rawName === "Demo User";
                                                    const isYou = user && m?.userId === user.id;
                                                    const dName = (isYou || isDemoOwner) ? (user?.fullName || user?.firstName || "chaicode") : rawName;
                                                    const newExpense = {
                                                        name: nameInput.value,
                                                        amount: Number(amountInput.value),
                                                        category: categorySelect.value || 'Misc',
                                                        paidBy: payerSelect.value,
                                                        paidByName: dName,
                                                        date: new Date().toISOString()
                                                    };
                                                    const updated = [...budgetData, newExpense as any];
                                                    setBudgetData(updated);
                                                    await saveTrip({ expenses: updated });
                                                    nameInput.value = '';
                                                    amountInput.value = '';
                                                }
                                            }}>Add Transaction</Button>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>

                            {/* 4 Column Top Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Total Spent */}
                                <div className="bg-white dark:bg-[#2A2A2A] p-4 rounded-xl border border-slate-200 dark:border-[#374151] shadow-sm">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#3b82f6] flex items-center justify-center mb-2.5">
                                        <Wallet className="h-3.5 w-3.5 stroke-[2.5px]" />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Spent</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-[22px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>₹{totalBudget.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Your Balance / Pending Splits */}
                                {(() => {
                                    const yourTotalPaid = user ? budgetData.filter(e => e.paidBy === user.id || e.paidByName === (user.fullName || user.firstName)).reduce((sum, e) => sum + e.amount, 0) : 0;
                                    const yourShare = totalBudget / (trip.members?.length || 1);
                                    const yourBalance = yourTotalPaid - yourShare;
                                    const isOwed = yourBalance >= 0;
                                    return (
                                        <div className="bg-white dark:bg-[#2A2A2A] p-4 rounded-xl border border-slate-200 dark:border-[#374151] shadow-sm">
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2.5", isOwed ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                                                <RefreshCcw className="h-3.5 w-3.5 stroke-[2.5px]" />
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{isOwed ? "They Owe You" : "You Owe"}</p>
                                            <div className="flex items-end gap-2">
                                                <span className={cn("text-[22px] font-bold tracking-tight", isOwed ? "text-emerald-500" : "text-rose-500")} style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                    {isOwed ? "+" : "-"}₹{Math.abs(Math.round(yourBalance)).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Average Per Person */}
                                <div className="bg-white dark:bg-[#2A2A2A] p-4 rounded-xl border border-slate-200 dark:border-[#374151] shadow-sm">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mb-2.5">
                                        <Users className="h-3.5 w-3.5 stroke-[2.5px]" />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Per Person</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-[22px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>₹{Math.round(totalBudget / (trip.members?.length || 1)).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Budget Remaining (Static Demo for UX) */}
                                <div className="bg-white dark:bg-[#2A2A2A] p-4 rounded-xl border border-slate-200 dark:border-[#374151] shadow-sm relative overflow-hidden">
                                    <div className="absolute right-0 top-0 h-full w-1.5 bg-emerald-500"></div>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mb-2.5">
                                        <PieChart className="h-3.5 w-3.5 stroke-[2.5px]" />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Budget Target</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-[22px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>₹{totalBudget.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3">
                                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Premium Category Breakdown */}
                            {budgetData.length > 0 && (() => {
                                const cats = budgetData.reduce((acc: any, curr: Expense) => {
                                    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
                                    return acc;
                                }, {});

                                const totalCatRaw = Object.values(cats).reduce((a: number, b: unknown) => a + Number(b), 0);
                                const totalCat: number = totalCatRaw || 1;

                                const colors: Record<string, string> = {
                                    Food: "#f97316", // orange-500
                                    Stay: "#3b82f6", // blue-500
                                    Travel: "#a855f7", // purple-500
                                    Transport: "#8b5cf6", // violet-500
                                    Adventure: "#10b981", // emerald-500
                                    Activities: "#14b8a6", // teal-500
                                    Misc: "#94a3b8" // slate-400
                                };

                                const sortedCats = Object.entries(cats).sort((a: [string, unknown], b: [string, unknown]) => Number(b[1]) - Number(a[1]));

                                let currentDeg = 0;
                                const gradientStops = sortedCats.map(([cat, amount]) => {
                                    const percentage = (Number(amount) / totalCat) * 100;
                                    const stop = `${colors[cat] || colors.Misc} ${currentDeg}%, ${colors[cat] || colors.Misc} ${currentDeg + percentage}%`;
                                    currentDeg += percentage;
                                    return stop;
                                }).join(", ");

                                return (
                                    <div className="bg-white dark:bg-[#2A2A2A] rounded-[1.25rem] border border-slate-200 dark:border-[#374151] p-8 shadow-sm flex flex-col md:flex-row items-center gap-10 lg:gap-16 mt-8 overflow-hidden relative">
                                        {/* Decorative blurred blob */}
                                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>

                                        <div className="w-full md:w-1/3 flex flex-col items-center">
                                            <h3 className="font-bold text-slate-900 text-xl mb-8 tracking-tight self-start md:self-center" style={{ fontFamily: "'Quicksand', sans-serif" }}>Spending Split</h3>
                                            <div className="relative w-48 h-48 rounded-full shadow-md transition-transform duration-500 hover:scale-105" style={{ background: `conic-gradient(${gradientStops || "#f8fafc 0% 100%"})` }}>
                                                {/* Inner white circle for Donut effect */}
                                                <div className="absolute inset-0 m-auto w-[130px] h-[130px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                                                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-0.5">Total</span>
                                                    <span className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>₹{totalBudget.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-2/3 flex flex-col gap-5 pt-4 md:pt-14 relative z-10">
                                            {sortedCats.map(([cat, amount]) => {
                                                const amountNum = Number(amount);
                                                const pct = Math.round((amountNum / totalCat) * 100);
                                                return (
                                                    <div key={cat} className="group relative">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: colors[cat] || colors.Misc }}></div>
                                                                <span className="text-sm font-semibold text-slate-700">{cat}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[13px] font-bold text-slate-400 w-8 text-right">{pct}%</span>
                                                                <span className="text-[15px] font-bold text-slate-900 w-16 text-right">₹{amountNum.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                                                            <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, backgroundColor: colors[cat] || colors.Misc }}></div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Recent Expenses Table Section */}
                            <div className="bg-white dark:bg-[#2A2A2A] rounded-[1.25rem] border border-slate-200 dark:border-[#374151] shadow-sm overflow-hidden mt-8">
                                <div className="px-6 py-5 border-b border-slate-100 dark:border-[#374151] flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 text-lg tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>Transactions</h3>
                                    <div className="flex items-center gap-2 hidden sm:flex">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="text-[13px] font-bold text-slate-500 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                                    <Filter className="h-3.5 w-3.5" /> {transactionFilter === 'All' ? 'Filter' : transactionFilter}
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-200 p-2 min-w-[160px]">
                                                {['All', 'Food', 'Stay', 'Travel', 'Transport', 'Activities', 'Misc'].map(cat => (
                                                    <DropdownMenuItem key={cat} onClick={() => setTransactionFilter(cat)} className="rounded-lg font-medium cursor-pointer py-2 text-slate-700 text-[13px]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                        {cat}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <button
                                            onClick={() => {
                                                const headers = "Expense,Paid By,Category,Amount\n";
                                                const rows = budgetData.map(e => `"${e.name}",${e.paidByName},${e.category},${e.amount}`);
                                                const csv = headers + rows.join("\n");
                                                const blob = new Blob([csv], { type: 'text/csv' });
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.style.display = 'none';
                                                a.href = url;
                                                a.download = `${trip?.title || 'Trip'}_Expenses.csv`;
                                                document.body.appendChild(a);
                                                a.click();
                                                setTimeout(() => {
                                                    document.body.removeChild(a);
                                                    window.URL.revokeObjectURL(url);
                                                }, 100);
                                            }}
                                            className="text-[13px] font-bold text-slate-500 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                        >
                                            <Download className="h-3.5 w-3.5" /> Export
                                        </button>
                                    </div>
                                </div>

                                {budgetData.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/50">
                                        <Wallet className="h-10 w-10 text-slate-300 mb-3" />
                                        <p className="font-bold text-sm tracking-wide">No transactions yet</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <th className="px-6 py-4">Expense</th>
                                                    <th className="px-6 py-4">Paid By</th>
                                                    <th className="px-6 py-4">Category</th>
                                                    <th className="px-6 py-4">Amount</th>
                                                    <th className="px-6 py-4 hidden md:table-cell">Split Details</th>
                                                    <th className="px-6 py-4 text-right"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {[...budgetData].filter(e => transactionFilter === 'All' || e.category === transactionFilter).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense: Expense, idx) => {
                                                    const m = trip.members.find((m: TripMember) => m.userId === expense.paidBy) || trip.members.find((m: TripMember) => m.name === expense.paidByName);
                                                    const isYou = !!(user && expense.paidBy === user.id);
                                                    const payeeName = isYou ? (user!.fullName || user!.firstName || 'You') : (m?.name || expense.paidByName || 'Member');
                                                    const payeeAvatar = isYou ? user!.imageUrl : (m?.avatar || '');

                                                    const iconMap: Record<string, any> = { 'Food': <Coffee className="h-3.5 w-3.5 mr-1.5" />, 'Stay': <Home className="h-3.5 w-3.5 mr-1.5" />, 'Travel': <PlaneTakeoff className="h-3.5 w-3.5 mr-1.5" />, 'Transport': <Car className="h-3.5 w-3.5 mr-1.5" />, 'Activities': <Ticket className="h-3.5 w-3.5 mr-1.5" />, 'Misc': <Wallet className="h-3.5 w-3.5 mr-1.5" /> };
                                                    const colorMap: Record<string, string> = { 'Food': 'bg-orange-50 text-orange-600 border-orange-100', 'Stay': 'bg-blue-50 text-blue-600 border-blue-100', 'Travel': 'bg-cyan-50 text-cyan-600 border-cyan-100', 'Transport': 'bg-emerald-50 text-emerald-600 border-emerald-100', 'Activities': 'bg-purple-50 text-purple-600 border-purple-100', 'Misc': 'bg-slate-100 text-slate-600 border-slate-200' };

                                                    return (
                                                        <tr key={expense._id || idx} className="hover:bg-slate-50/60 transition-colors group">
                                                            <td className="px-6 py-5">
                                                                <div className="flex flex-col min-w-[140px]">
                                                                    <span className="font-bold text-[15px] text-slate-900" style={{ fontFamily: "'Quicksand', sans-serif" }}>{expense.name}</span>
                                                                    <span className="text-[12px] font-semibold text-slate-400 mt-1">{format(new Date(expense.date), "MMM d, yyyy")}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-7 w-7 border-0 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)]">
                                                                        <AvatarImage src={payeeAvatar} />
                                                                        <AvatarFallback className="bg-slate-200 text-slate-700 text-[10px] font-bold">{payeeName[0]?.toUpperCase()}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-[14px] font-bold text-slate-700" style={{ fontFamily: "'Quicksand', sans-serif" }}>{isYou ? "You" : payeeName}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <span className={cn("inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold border", colorMap[expense.category] || colorMap['Misc'])}>
                                                                    {iconMap[expense.category] || iconMap['Misc']} {expense.category}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <span className="font-bold text-[16px] text-slate-900 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>₹{expense.amount.toLocaleString()}</span>
                                                            </td>
                                                            <td className="px-6 py-5 hidden md:table-cell">
                                                                <div className="flex items-center gap-3">
                                                                    <AvatarGroup avatars={(trip.members || []).slice(0, 4).map((m: TripMember, mIdx) => ({ src: mIdx === 0 && user ? user.imageUrl : m.avatar, label: m.name }))} maxVisible={4} size={24} overlap={6} />
                                                                    <span className="text-[12px] font-bold text-slate-400">Equally</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 text-right">
                                                                {canEdit && (
                                                                    <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense._id)} className="h-8 w-8 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all ml-auto">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* CHECKLISTS TAB */}
                    <TabsContent value="checklists" className="mt-6 outline-none">
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[900px] mx-auto px-4 md:px-0 mt-8">

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-[24px] font-bold text-slate-800 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                        Packing & To-Do Lists
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[15px] mt-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                        Organize everything you need to bring or do before the trip.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Array.from(new Set(checklists.map(c => c.category || "General"))).map((categoryName) => {
                                    const categoryItems = checklists.filter(c => (c.category || "General") === categoryName);
                                    const completedCount = categoryItems.filter(c => c.done).length;
                                    const totalCount = categoryItems.length;

                                    return (
                                        <div key={categoryName} className="bg-white border border-slate-100 rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] p-6 sm:p-8 flex flex-col h-full relative overflow-hidden group/card">
                                            {/* Top decorative gradient bar */}
                                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] to-blue-300 opacity-80" />

                                            <div className="flex justify-between items-start mb-6 mt-1">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <div className="bg-blue-50 p-2 rounded-xl text-[#0066FF]">
                                                            <CheckCircle2 className="h-5 w-5" />
                                                        </div>
                                                        <h3 className="font-bold text-slate-800 text-[20px]" style={{ fontFamily: "'Quicksand', sans-serif" }}>{categoryName}</h3>
                                                    </div>
                                                    <p className="text-[13px] text-slate-500 font-bold tracking-wide" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                        {completedCount} / {totalCount} ITEMS COMPLETED
                                                    </p>
                                                </div>
                                                {canEdit && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-800 rounded-full h-9 w-9 bg-slate-50 hover:bg-slate-100">
                                                                <MoreHorizontal className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                            <DropdownMenuItem onClick={() => deleteChecklistCategory(categoryName)} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-bold text-[14px]">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete List
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                                                <div
                                                    className="bg-[#0066FF] h-2 rounded-full transition-all duration-700 ease-in-out"
                                                    style={{ width: `${totalCount === 0 ? 0 : (completedCount / totalCount) * 100}%` }}
                                                />
                                            </div>

                                            <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[220px]">
                                                {categoryItems.map((item: ChecklistItem, idx) => (
                                                    <div key={item._id || idx} className="flex items-center justify-between group p-3.5 rounded-2xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100/50">
                                                        <div className="flex items-center space-x-4">
                                                            <Checkbox
                                                                id={`pack-${item._id}`}
                                                                checked={item.done}
                                                                onCheckedChange={() => canEdit && toggleChecklist(item._id!)}
                                                                disabled={!canEdit}
                                                                className="h-[24px] w-[24px] rounded-[6px] border-slate-200 data-[state=checked]:bg-[#0066FF] data-[state=checked]:border-[#0066FF] shadow-sm transition-all"
                                                            />
                                                            <label htmlFor={`pack-${item._id}`} className={cn("text-[15px] font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer pt-0.5", item.done ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700")} style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                                {item.text}
                                                            </label>
                                                        </div>
                                                        {canEdit && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={async () => {
                                                                    const updated = checklists.filter(c => c._id !== item._id);
                                                                    setChecklists(updated);
                                                                    await saveTrip({ checklist: updated });
                                                                }}
                                                                className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-auto"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}

                                                {categoryItems.length === 0 && (
                                                    <div className="text-center py-10 flex flex-col items-center">
                                                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                            <ListChecks className="h-6 w-6 text-slate-300" />
                                                        </div>
                                                        <p className="text-slate-400 font-medium text-sm" style={{ fontFamily: "'Quicksand', sans-serif" }}>Your list is empty.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {canEdit && (
                                                <div className="mt-6 pt-5 border-t border-slate-100/80 flex gap-3 relative">
                                                    <div className="absolute left-4 top-[35px] text-slate-400 pointer-events-none">
                                                        <Plus className="h-5 w-5" />
                                                    </div>
                                                    <Input
                                                        value={newChecklistItems[categoryName] || ""}
                                                        onChange={(e) => setNewChecklistItems(prev => ({ ...prev, [categoryName]: e.target.value }))}
                                                        onKeyDown={(e) => e.key === 'Enter' && addChecklist(categoryName)}
                                                        placeholder="Add new item..."
                                                        className="rounded-2xl border-slate-200 h-12 pl-11 focus-visible:ring-[#0066FF]/20 focus-visible:border-[#0066FF]/40 text-[15px] font-bold shadow-sm bg-slate-50/50 hover:bg-white transition-colors w-full"
                                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                                    />
                                                    <Button
                                                        onClick={() => addChecklist(categoryName)}
                                                        className="rounded-2xl px-6 shrink-0 bg-[#0066FF] hover:bg-[#0066FF]/90 text-white font-bold h-12 shadow-[0_4px_12px_-4px_rgba(0,102,255,0.4)] transition-all text-[15px]"
                                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Create New List Button / Container */}
                                {canEdit && (
                                    <div
                                        className="bg-[#FAFAFA] border-2 border-slate-200 border-dashed rounded-[24px] p-8 flex flex-col items-center justify-center text-center h-full min-h-[420px] hover:border-[#0066FF]/40 hover:bg-blue-50/50 transition-all group cursor-pointer relative"
                                        onClick={() => document.getElementById('newListInput')?.focus()}
                                    >
                                        <div className="h-16 w-16 bg-white shadow-sm border border-slate-100 text-[#0066FF] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                            <Plus className="h-8 w-8" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-[20px] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Create new list</h3>
                                        <p className="text-slate-500 font-medium text-[15px] mb-8 max-w-[240px]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                            Tasks, shopping, or groceries? Keep everything perfectly organized.
                                        </p>

                                        <div className="flex flex-col gap-3 w-full max-w-[300px] z-10 transition-all">
                                            <Input
                                                id="newListInput"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addNewCategory()}
                                                placeholder="e.g. Toiletries, Documents..."
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded-2xl border-slate-200 h-12 text-[15px] font-bold shadow-sm bg-white focus-visible:ring-[#0066FF]/20"
                                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                                            />
                                            <Button
                                                onClick={(e) => { e.stopPropagation(); addNewCategory(); }}
                                                disabled={!newCategoryName}
                                                className="rounded-2xl h-12 w-full bg-[#0066FF] hover:bg-[#0066FF]/90 font-bold shadow-[0_4px_12px_-4px_rgba(0,102,255,0.4)] text-white text-[15px]"
                                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                                            >
                                                Create List
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* FILES TAB (FIGMA MATCH) */}
                    <TabsContent value="files" className="mt-6 outline-none">
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[900px] mx-auto px-4 md:px-0 mt-8">

                            {/* Ticket-style Upload Dropzone */}
                            {canEdit && (
                                <label className="bg-[#FAFAFA] border-2 border-dashed border-slate-200 rounded-[12px] p-8 flex flex-col items-center justify-center text-center hover:border-[#0066FF]/40 hover:bg-blue-50/50 transition-all cursor-pointer group shadow-sm mx-auto">
                                    <div className="h-14 w-14 bg-white border border-slate-100 shadow-sm group-hover:scale-110 rounded-[14px] flex items-center justify-center mb-4 transition-transform duration-300 text-[#0066FF] group-hover:text-[#0066FF]">
                                        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-[18px] mb-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                        {uploading ? "Uploading..." : "Click or drag to upload files"}
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[14px]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                        Supports PDF, JPG, PNG (Max 10MB per file)
                                    </p>
                                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                </label>
                            )}

                            {/* Dialog for selecting category BEFORE uploading */}
                            <Dialog open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>
                                <DialogContent className="sm:max-w-[400px] rounded-[24px] p-8" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold text-slate-800 mx-auto">Select Document Type</DialogTitle>
                                        <DialogDescription className="text-center text-slate-500 text-[15px] pt-1">
                                            What kind of document is this?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <select
                                            value={selectedCategory}
                                            onChange={(e: any) => setSelectedCategory(e.target.value)}
                                            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-[15px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                                        >
                                            <option value="flight">✈️ Flight Tickets</option>
                                            <option value="hotel">🏨 Hotel Confirmation</option>
                                            <option value="insurance">🛡️ Travel Insurance</option>
                                            <option value="car">🚗 Car Rental Info</option>
                                            <option value="general">📄 General Document</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-3 mt-4 w-full">
                                        <Button variant="outline" className="flex-1 rounded-xl h-11 text-slate-500 font-bold border-slate-200" onClick={() => setIsFileModalOpen(false)}>Cancel</Button>
                                        <Button onClick={confirmFileUpload} disabled={!fileToUpload} className="flex-1 rounded-xl h-11 bg-[#0066FF] hover:bg-[#0066FF]/90 text-white font-bold transition-colors shadow-sm">
                                            Upload
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Files Grid (Ticket Cards) */}
                            {files.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-slate-400 font-medium" style={{ fontFamily: "'Quicksand', sans-serif" }}>No files uploaded yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {files.map((file) => {
                                        const type = file.documentCategory || "general";
                                        let icon = <FileText className="h-5 w-5" />;
                                        let iconBg = "bg-[#F3F4F6] text-[#6B7280]";
                                        let title = "General Document";

                                        if (type === "flight") {
                                            icon = <PlaneTakeoff className="h-6 w-6" />;
                                            iconBg = "bg-[#E5F0FF] text-[#0066FF]";
                                            title = "Flight Tickets";
                                        } else if (type === "hotel") {
                                            icon = <Home className="h-6 w-6" />;
                                            iconBg = "bg-[#E5F0FF] text-[#1F75FF]";
                                            title = "Hotel Confirmation";
                                        } else if (type === "insurance") {
                                            icon = <CheckCircle2 className="h-6 w-6" />;
                                            iconBg = "bg-[#E5F7ED] text-[#00A84D]";
                                            title = "Travel Insurance";
                                        } else if (type === "car") {
                                            icon = <Car className="h-6 w-6" />;
                                            iconBg = "bg-[#F3F4F6] text-[#6B7280]";
                                            title = "Car Rental Info";
                                        }

                                        const isImg = isImageFile(file);

                                        return (
                                            <div key={file._id} className="relative bg-white rounded-[20px] flex flex-col shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden group hover:shadow-xl hover:border-blue-100/50 transition-all duration-300">
                                                {/* Left/Right Cutouts to look like a ticket */}
                                                <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-8 bg-[#FAFAFA] rounded-r-full z-10 border-r border-slate-100"></div>
                                                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-8 bg-[#FAFAFA] rounded-l-full z-10 border-l border-slate-100"></div>

                                                {/* Premium Card Header / Preview Area */}
                                                <div className="relative h-44 w-full bg-slate-50 overflow-hidden border-b border-slate-50 flex items-center justify-center">
                                                    {isImg ? (
                                                        <Image
                                                            src={file.url}
                                                            alt={file.name}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center shadow-sm", iconBg)}>
                                                            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-8 w-8" })}
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                    {/* Actions Overlay */}
                                                    <div className="absolute top-3 right-3 z-20 flex gap-2">
                                                        {canEdit && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="flex items-center justify-center h-8 w-8 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full transition-all text-slate-600 shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-100 min-w-[140px] font-medium" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                                    {isImg && (
                                                                        <DropdownMenuItem onClick={() => setPreviewFile(file)} className="cursor-pointer text-slate-700 py-2">
                                                                            <Eye className="h-4 w-4 mr-2 text-slate-400" /> View Full
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem onClick={() => deleteFile(file._id)} className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-500 py-2">
                                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete File
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>

                                                    {/* Category Badge Overlay */}
                                                    <div className="absolute top-3 left-3 z-20">
                                                        <Badge className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border-0 shadow-sm", iconBg)}>
                                                            {title}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="p-5 flex flex-col flex-1">
                                                    <div className="mb-4">
                                                        <h4 className="font-bold text-slate-800 text-[16px] truncate" style={{ fontFamily: "'Quicksand', sans-serif" }}>{file.name}</h4>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                                                {file.format || (file.bytes ? "FILE" : "DOCUMENT")}
                                                            </span>
                                                            <span className="text-slate-300">•</span>
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                                                {file.bytes ? `${Math.round(file.bytes / 1024)} KB` : "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider" style={{ fontFamily: "'Quicksand', sans-serif" }}>Uploaded</span>
                                                            <span className="text-[11px] font-bold text-slate-500" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                                {format(new Date(file.createdAt || new Date()), "MMM dd, yyyy")}
                                                            </span>
                                                        </div>
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="h-9 px-4 rounded-xl bg-blue-50 text-[#0066FF] hover:bg-[#0066FF] hover:text-white font-bold text-[12px] flex items-center gap-2 transition-all"
                                                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                                                        >
                                                            Download <Download className="h-3.5 w-3.5" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* MEMBERS TAB - PREMIUM REDESIGN */}
                    <TabsContent value="members" className="mt-6 outline-none">
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1000px] mx-auto px-4 md:px-0">
                            {/* Invite Friends Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>Invite Friends</h3>
                                    <p className="text-slate-500 font-medium text-[14px] mt-1.5" style={{ fontFamily: "'Quicksand', sans-serif" }}>Share this link to let others join your trip planning.</p>
                                </div>

                                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <Input
                                            readOnly
                                            value={`${appUrl.replace(/^https?:\/\//, '')}/join/${trip.inviteCode}`}
                                            className="h-11 w-full sm:w-[280px] bg-white border-slate-200 text-slate-500 font-medium text-[14px] rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
                                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${appUrl}/join/${trip.inviteCode}`);
                                                alert("Link copied!");
                                            }}
                                            className="h-11 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-[14px] rounded-xl px-6 flex items-center gap-2 transition-all shadow-sm"
                                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                                        >
                                            <Copy className="h-4 w-4" /> Copy
                                        </Button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="h-11 w-11 p-0 rounded-xl bg-white border-slate-200 text-slate-500 hover:text-[#3b82f6] shadow-sm transition-all focus-visible:ring-0 hover:bg-slate-50">
                                                    <QrCode className="h-5 w-5" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden border-0 rounded-[2rem] shadow-2xl bg-white">
                                                <div className="p-8 text-center space-y-8">
                                                    <div className="space-y-2">
                                                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900" style={{ fontFamily: "'Quicksand', sans-serif" }}>Trip Invite QR</DialogTitle>
                                                        <DialogDescription className="text-[15px] font-medium text-slate-500" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                            Scan this to join the trip workspace.
                                                        </DialogDescription>
                                                    </div>
                                                    <div className="mx-auto w-56 h-56 bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-center relative">
                                                        <Image
                                                            src={normalizeRemoteImage(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&ecc=H&data=${encodeURIComponent(`${appUrl}/join/${trip?.inviteCode || ""}`)}&color=0f172a&bgcolor=ffffff&qzone=1`, 400, 80)}
                                                            alt="QR"
                                                            width={224}
                                                            height={224}
                                                            sizes="224px"
                                                            className="h-full w-full"
                                                            unoptimized
                                                        />
                                                        {/* Premium Logo inside QR */}
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-white rounded-[10px] flex items-center justify-center shadow-sm border-[3px] border-white p-1 pointer-events-none">
                                                            <div className="relative h-full w-full">
                                                                <Image src="/icon.svg" alt="Travio Logo" fill className="object-contain" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={async () => {
                                                            try {
                                                                const qrUrl = normalizeRemoteImage(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&ecc=H&data=${encodeURIComponent(`${appUrl}/join/${trip?.inviteCode || ""}`)}&color=0f172a&bgcolor=ffffff&qzone=1`, 400, 80);
                                                                const response = await fetch(qrUrl);
                                                                if (!response.ok) throw new Error("Network response was not ok");
                                                                const blob = await response.blob();
                                                                const url = window.URL.createObjectURL(blob);
                                                                const link = document.createElement("a");
                                                                link.href = url;
                                                                link.download = `invite-qr-${trip?.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || "trip"}.png`;
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                document.body.removeChild(link);
                                                                window.URL.revokeObjectURL(url);
                                                            } catch (error) {
                                                                console.error("Failed to download QR", error);
                                                            }
                                                        }}
                                                        className="w-full h-14 rounded-xl bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-[15px] shadow-sm transition-all"
                                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                                    >
                                                        <Download className="h-5 w-5 mr-2" /> Download QR Code
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>

                            {/* Members Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-12 mb-3">
                                <h3 className="text-[22px] font-bold text-slate-800 tracking-tight flex items-center gap-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                    Trip Members <span className="text-slate-400 font-medium text-[18px]">({trip.members.length})</span>
                                </h3>
                                <div className="relative w-full sm:w-[260px]">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Filter members..."
                                        className="h-10 pl-10 bg-white border-slate-200 text-[14px] font-medium rounded-xl focus-visible:ring-slate-200 shadow-sm"
                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="bg-white border border-slate-200 rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 border-b border-slate-100 bg-white">
                                    <div className="col-span-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'Quicksand', sans-serif" }}>User</div>
                                    <div className="col-span-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'Quicksand', sans-serif" }}>Email Address</div>
                                    <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'Quicksand', sans-serif" }}>Role</div>
                                    <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'Quicksand', sans-serif" }}>Joined Date</div>
                                    <div className="col-span-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right" style={{ fontFamily: "'Quicksand', sans-serif" }}>Actions</div>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {(trip.members || []).map((member: TripMember) => {
                                        const isMemberOwner = member.role.toLowerCase() === "owner";
                                        const isYou = user && member.userId === user.id;

                                        const rawName = member.name || "Member";
                                        const displayName = isYou ? (user.fullName || user.firstName || "You") : (rawName === "Demo User" ? "Member" : rawName);
                                        const displayEmail = isYou ? user.primaryEmailAddress?.emailAddress : member.email;
                                        const displayAvatar = isYou ? user.imageUrl : member.avatar;
                                        const currentRole = localRoles[member.userId] || (isMemberOwner ? "Owner" : (member.role === "viewer" ? "Viewer" : "Editor"));

                                        return (
                                            <div key={member.userId} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 sm:px-8 py-5 bg-white hover:bg-slate-50/50 transition-colors">
                                                {/* User Info */}
                                                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                                    <Avatar className="h-11 w-11 border border-slate-100 shadow-sm bg-white">
                                                        <AvatarImage src={displayAvatar} />
                                                        <AvatarFallback className="bg-slate-100 text-slate-700 font-bold text-sm">
                                                            {displayName[0]?.toUpperCase() || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-slate-800 text-[15px]" style={{ fontFamily: "'Quicksand', sans-serif" }}>{displayName}</p>
                                                            {isYou && (
                                                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 rounded-md px-1.5 py-0 text-[10px] font-bold">You</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Email Address */}
                                                <div className="col-span-1 md:col-span-3 flex items-center">
                                                    <p className="text-[14px] font-medium text-slate-500 truncate" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                        {displayEmail}
                                                    </p>
                                                </div>

                                                {/* Role */}
                                                <div className="col-span-1 md:col-span-2 flex items-center">
                                                    {isMemberOwner ? (
                                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 font-bold text-[12px]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                            Owner
                                                        </span>
                                                    ) : (
                                                        isOwner ? (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="flex items-center justify-between min-w-[105px] px-3.5 py-1.5 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-sm outline-none focus:ring-2 focus:ring-slate-200" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                                        {currentRole} <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="start" className="w-[140px] rounded-xl p-1.5 border-slate-200 shadow-lg bg-white z-[100]">
                                                                    <DropdownMenuItem onClick={() => handleUpdateRole(member.userId, "viewer")} className="text-[13px] font-bold text-slate-700 rounded-lg cursor-pointer focus:bg-slate-50 py-2.5 px-3 focus:outline-none" style={{ fontFamily: "'Quicksand', sans-serif" }}>Viewer</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleUpdateRole(member.userId, "editor")} className="text-[13px] font-bold text-slate-700 rounded-lg cursor-pointer focus:bg-slate-50 py-2.5 px-3 focus:outline-none" style={{ fontFamily: "'Quicksand', sans-serif" }}>Editor</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleUpdateRole(member.userId, "admin")} className="text-[13px] font-bold text-slate-700 rounded-lg cursor-pointer focus:bg-slate-50 py-2.5 px-3 focus:outline-none" style={{ fontFamily: "'Quicksand', sans-serif" }}>Admin</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        ) : (
                                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 text-slate-600 font-bold text-[11px] uppercase tracking-wider" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                                {currentRole}
                                                            </span>
                                                        )
                                                    )}
                                                </div>

                                                {/* Joined Date */}
                                                <div className="col-span-1 md:col-span-2 flex items-center">
                                                    <p className="text-[14px] font-medium text-slate-500" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                        {format(new Date(trip.startDate), "MMM d, yyyy")}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-1 md:col-span-1 flex items-center justify-end">
                                                    {isOwner && !isYou ? (
                                                        <button
                                                            onClick={async () => {
                                                                if (trip && window.confirm(`Are you sure you want to remove ${displayName}?`)) {
                                                                    const updatedMembers = trip.members.filter(m => m.userId !== member.userId);
                                                                    setTrip({ ...trip, members: updatedMembers });
                                                                    await saveTrip({ members: updatedMembers });
                                                                }
                                                            }}
                                                            className="text-[14px] font-medium text-red-500 hover:text-red-700 transition-colors" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                            Remove
                                                        </button>
                                                    ) : (
                                                        <span className="text-[14px] font-medium text-slate-300" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                            {isMemberOwner ? "Owner" : "Manage"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer Text */}
                            <div className="px-2 pt-2 pb-6">
                                <p className="text-[13px] font-medium text-slate-400" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                    Showing {trip?.members.length} of {trip?.members.length} members
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
            {/* PREMIUM FILE PREVIEW DIALOG */}
            <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
                <DialogContent className="max-w-[90vw] sm:max-w-4xl p-0 overflow-hidden border-0 bg-transparent shadow-none" showCloseButton={false}>
                    <DialogTitle className="sr-only">File Preview: {previewFile?.name}</DialogTitle>
                    <DialogDescription className="sr-only">Visual preview of the uploaded document</DialogDescription>
                    {previewFile && (
                        <div className="relative group/preview flex flex-col items-center">
                            {/* Actions bar */}
                            <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover/preview:translate-y-0">
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm tracking-tight truncate max-w-[200px] sm:max-w-md">{previewFile.name}</span>
                                    <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">{previewFile.documentCategory || "Document"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={previewFile.url}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 px-5 rounded-xl bg-white text-black hover:bg-slate-100 font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
                                    >
                                        <Download className="h-4 w-4" /> Download
                                    </a>
                                    <button
                                        onClick={() => setPreviewFile(null)}
                                        className="h-10 w-10 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white backdrop-blur-sm flex items-center justify-center transition-all text-white border border-white/10 active:scale-95 shadow-lg"
                                    >
                                        <Plus className="h-5 w-5 rotate-45" />
                                    </button>
                                </div>
                            </div>

                            {/* Main Preview Container */}
                            <div className="w-full bg-slate-950/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] flex items-center justify-center aspect-[16/10] sm:aspect-auto sm:min-h-[500px] relative">
                                {isImageFile(previewFile) ? (
                                    <div className="relative w-full h-full flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent">
                                        <Image
                                            src={previewFile.url}
                                            alt={previewFile.name}
                                            width={1200}
                                            height={800}
                                            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                                            priority
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-8 text-white p-24 text-center">
                                        <div className="h-32 w-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center shadow-inner border border-white/10 ring-1 ring-white/10">
                                            <FileText className="h-16 w-16 text-[#0066FF]" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent" style={{ fontFamily: "'Quicksand', sans-serif" }}>No Preview Available</h3>
                                            <p className="text-white/40 max-w-sm mx-auto text-lg font-medium leading-relaxed">This document format cannot be previewed directly. Please download to view.</p>
                                        </div>
                                        <a href={previewFile.url} target="_blank" rel="noopener noreferrer" className="px-10 py-5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 font-bold transition-all shadow-[0_20px_50px_-12px_rgba(0,102,255,0.5)] active:scale-95 text-lg">
                                            Open Document
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Backdrop click to close helper */}
                            <div className="mt-8 text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse flex items-center gap-4">
                                <div className="h-[1px] w-8 bg-white/10" />
                                Click outside to exit
                                <div className="h-[1px] w-8 bg-white/10" />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

