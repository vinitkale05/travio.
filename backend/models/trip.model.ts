import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Sub-schemas ─────────────────────────────────────────────────────────────

const MemberSchema = new Schema(
    {
        userId: { type: String, required: true },       // Clerk user ID
        name: { type: String, required: true },
        email: { type: String },
        avatar: { type: String, default: "" },
        role: { type: String, enum: ["owner", "editor", "viewer"], default: "editor" },
    },
    { _id: false }
);

const ActivitySchema = new Schema(
    {
        title: { type: String, required: true },
        time: { type: String, default: "" },
        location: { type: String, default: "" },
        notes: { type: String, default: "" },
        category: { type: String, default: "activity" },
        cost: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
        bookingRef: { type: String, default: "" },
        status: { type: String, enum: ["planned", "confirmed", "cancelled"], default: "planned" },
    },
    { timestamps: true }
);

const DaySchema = new Schema(
    {
        label: { type: String, required: true }, // e.g. "Day 1 — Mar 10"
        date: { type: Date },
        activities: { type: [ActivitySchema], default: [] },
    },
    { _id: false }
);

const ExpenseSchema = new Schema(
    {
        name: { type: String, required: true },
        category: { type: String, default: "Other" },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        paidBy: { type: String, required: true },   // userId
        paidByName: { type: String, required: true }, // display name
        date: { type: Date, default: Date.now },
        splitWith: [{ type: String }],                // array of userIds
    },
    { timestamps: true }
);

const ChecklistItemSchema = new Schema(
    {
        text: { type: String, required: true },
        done: { type: Boolean, default: false },
        assignedTo: { type: String, default: "" },
        category: { type: String, default: "General" },
    },
    { _id: true }
);

const TripFileSchema = new Schema(
    {
        name: { type: String, required: true },
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
        format: { type: String, default: "" },
        bytes: { type: Number, default: 0 },
        resourceType: { type: String, enum: ["image", "raw", "video"], default: "raw" },
        documentCategory: { type: String, enum: ["flight", "hotel", "insurance", "car", "general"], default: "general" },
        width: { type: Number },
        height: { type: Number },
        uploadedBy: { type: String, default: "" },
        uploadedByName: { type: String, default: "" },
    },
    { timestamps: true }
);

const ActivityCommentSchema = new Schema(
    {
        activityId: { type: String, required: true },
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        avatar: { type: String, default: "" },
        text: { type: String, required: true },
    },
    { timestamps: true }
);

// ─── Main Trip Schema ─────────────────────────────────────────────────────────

export interface ITrip extends Document {
    title: string;
    destination: string;
    coverImage: string;
    startDate: Date;
    endDate: Date;
    ownerId: string;
    members: {
        userId: string;
        name: string;
        email?: string;
        avatar?: string;
        role: "owner" | "editor" | "viewer";
    }[];
    days: {
        label: string;
        date: Date;
        activities: {
            title: string;
            time: string;
            location: string;
            notes?: string;
            category: string;
            cost: number;
        }[];
    }[];
    expenses: {
        _id?: string;
        name: string;
        category: string;
        amount: number;
        paidBy: string;
        paidByName: string;
        date: Date;
    }[];
    checklist: {
        _id?: string;
        text: string;
        done: boolean;
        category?: string;
    }[];
    files: {
        _id?: string;
        name: string;
        url: string;
        publicId?: string;
        format?: string;
        bytes?: number;
        resourceType?: "image" | "raw" | "video";
        documentCategory?: "flight" | "hotel" | "insurance" | "car" | "general";
        width?: number;
        height?: number;
        uploadedBy?: string;
        uploadedByName?: string;
        createdAt?: Date;
    }[];
    inviteCode: string;
    isDemo: boolean;
    activityComments: {
        _id?: string;
        activityId: string;
        userId: string;
        userName: string;
        avatar?: string;
        text: string;
        createdAt?: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
    {
        title: { type: String, required: true, trim: true },
        destination: { type: String, default: "" },
        coverImage: { type: String, default: "" },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        ownerId: { type: String, required: true },
        members: { type: [MemberSchema], default: [] },
        days: { type: [DaySchema], default: [] },
        expenses: { type: [ExpenseSchema], default: [] },
        checklist: { type: [ChecklistItemSchema], default: [] },
        files: { type: [TripFileSchema], default: [] },
        inviteCode: {
            type: String,
            unique: true,
            default: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
        },
        isDemo: { type: Boolean, default: false },
        activityComments: { type: [ActivityCommentSchema], default: [] },
    },
    { timestamps: true }
);

TripSchema.index({ inviteCode: 1 });

// Model singleton (handles Next.js hot-reload double-registration)
const Trip: Model<ITrip> =
    (mongoose.models.Trip as Model<ITrip>) ?? mongoose.model<ITrip>("Trip", TripSchema);

export default Trip;
