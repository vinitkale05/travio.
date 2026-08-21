import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@backend/mongodb";
import Trip from "@backend/models/trip.model";

type Params = { params: Promise<{ tripId: string }> };

// GET /api/trips/[tripId]/comments?activityId=xxx
export async function GET(_req: Request, { params }: Params) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { tripId } = await params;
    const activityId = new URL(_req.url).searchParams.get("activityId");
    if (!activityId) return NextResponse.json({ error: "activityId required" }, { status: 400 });

    await connectDB();
    const trip = await Trip.findById(tripId).select("activityComments members ownerId").lean();
    if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMember =
        trip.ownerId === userId ||
        (trip.members as any[]).some((m) => m.userId === userId);
    if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const comments = (trip.activityComments as any[]).filter((c) => c.activityId === activityId);
    return NextResponse.json(comments);
}

// POST /api/trips/[tripId]/comments  { activityId, text }
export async function POST(req: Request, { params }: Params) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { tripId } = await params;
    const { activityId, text } = await req.json();
    if (!activityId || !text?.trim()) {
        return NextResponse.json({ error: "activityId and text are required" }, { status: 400 });
    }

    const user = await currentUser();
    const userName = user?.fullName || user?.firstName || "Traveler";
    const avatar = user?.imageUrl || "";

    await connectDB();
    const trip = await Trip.findById(tripId);
    if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMember =
        trip.ownerId === userId ||
        (trip.members as any[]).some((m) => m.userId === userId);
    if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const comment = { activityId, userId, userName, avatar, text: text.trim() };
    (trip.activityComments as any[]).push(comment);
    await trip.save();

    const saved = (trip.activityComments as any[]).at(-1);
    return NextResponse.json(saved, { status: 201 });
}
