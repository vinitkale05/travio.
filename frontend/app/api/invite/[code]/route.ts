import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@backend/mongodb";
import Trip from "@backend/models/trip.model";

// POST /api/invite/[code]  →  join the trip with the given invite code
export async function POST(_req: Request, { params }: { params: Promise<{ code: string }> }) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { code } = await params;
    const trip = await Trip.findOne({ inviteCode: code.toUpperCase() });
    if (!trip) return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });

    // Already a member?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const alreadyMember = (trip.members as any[]).some((m) => m.userId === userId);
    if (alreadyMember) return NextResponse.json({ message: "Already a member", tripId: trip._id });

    const user = await currentUser();
    const emailStr = user?.primaryEmailAddress?.emailAddress ?? "";
    const fallbackName = emailStr ? emailStr.split('@')[0] : "Traveler";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trip.members as any[]).push({
        userId,
        name: user?.fullName ?? user?.firstName ?? fallbackName,
        email: emailStr,
        avatar: user?.imageUrl ?? "",
        role: "viewer",  // Invited users join as viewer; owner can promote them
    });
    await trip.save();

    return NextResponse.json({ message: "Joined successfully", tripId: trip._id }, { status: 200 });
}

// GET /api/invite/[code]  →  preview trip info before joining
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
    await connectDB();
    const { code } = await params;
    const trip = await Trip.findOne({ inviteCode: code.toUpperCase() })
        .select("title destination startDate endDate coverImage members inviteCode")
        .lean();

    if (!trip) return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    return NextResponse.json(trip);
}
