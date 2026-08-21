import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@backend/mongodb";
import Trip from "@backend/models/trip.model";

type Params = { params: Promise<{ tripId: string }> };

// ─── GET /api/trips/[tripId] ─────────────────────────────────────────────────
export async function GET(_req: Request, { params }: Params) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const { tripId } = await params;

        const trip = await Trip.findById(tripId).lean();
        if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

        const isMember =
            trip.ownerId === userId ||
            (trip.members as any[]).some((m) => m.userId === userId);

        if (!isMember) return NextResponse.json({ error: "Access denied" }, { status: 403 });

        return NextResponse.json(trip);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// ─── PATCH /api/trips/[tripId] ───────────────────────────────────────────────
export async function PATCH(request: Request, { params }: Params) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { tripId } = await params;
    const trip = await Trip.findById(tripId);
    if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Role enforcement: owner and editor can edit; viewer cannot
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const member = (trip.members as unknown as any[]).find((m) => m.userId === userId);
    const isOwner = trip.ownerId === userId;
    const isMember = isOwner || !!member;

    if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const role = isOwner ? "owner" : member?.role;
    if (role === "viewer") {
        return NextResponse.json({ error: "Viewers cannot edit the trip" }, { status: 403 });
    }

    const body = await request.json();
    const ALLOWED = ["title", "destination", "coverImage", "startDate", "endDate", "days", "expenses", "checklist", "members", "files"];
    for (const key of ALLOWED) {
        if (key in body) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (trip as any)[key] = body[key];
        }
    }
    await trip.save();
    return NextResponse.json(trip);
}

// ─── DELETE /api/trips/[tripId] ──────────────────────────────────────────────
export async function DELETE(_req: Request, { params }: Params) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { tripId } = await params;
    const trip = await Trip.findById(tripId);
    if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (trip.ownerId !== userId) return NextResponse.json({ error: "Only the owner can delete a trip" }, { status: 403 });

    await trip.deleteOne();
    return NextResponse.json({ success: true });
}
