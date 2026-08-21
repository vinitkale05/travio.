import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@backend/mongodb";
import Trip from "@backend/models/trip.model";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { tripId } = body;

        if (!tripId) {
            return NextResponse.json({ error: "tripId is required" }, { status: 400 });
        }

        await connectDB();

        const trip = await Trip.findById(tripId);
        if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

        // Ensure user is owner or editor
        const isOwner = trip.ownerId === userId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const member = (trip.members as any[]).find((m) => m.userId === userId);
        const role = isOwner ? "owner" : member?.role;

        if (role !== "owner" && role !== "editor") {
            return NextResponse.json({ error: "Only owners and editors can generate invite links" }, { status: 403 });
        }

        // If trip doesn't have an invite code, generate one
        if (!trip.inviteCode) {
            trip.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            await trip.save();
        }

        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");

        return NextResponse.json({
            inviteLink: `${appUrl}/join/${trip.inviteCode}`
        }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
