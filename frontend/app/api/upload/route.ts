import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

// Configure once (server-side only — API secret is never exposed to client)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Allowed MIME types
const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
]);

// 10 MB limit
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
    // ── Auth guard ────────────────────────────────────────────────
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Config guard ──────────────────────────────────────────────
    if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    ) {
        console.error("Cloudinary env vars missing");
        return NextResponse.json(
            { error: "File upload service is not configured. Please contact the admin." },
            { status: 500 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        // ── File presence ──────────────────────────────────────────
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // ── File type validation ───────────────────────────────────
        if (!ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json(
                { error: `Unsupported file type: ${file.type}. Allowed: JPG, PNG, WEBP, PDF.` },
                { status: 400 }
            );
        }

        // ── File size validation ───────────────────────────────────
        if (file.size > MAX_BYTES) {
            return NextResponse.json(
                { error: `File too large. Maximum size is 10 MB.` },
                { status: 400 }
            );
        }

        // ── Convert File → Buffer for Cloudinary SDK ──────────────
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ── Upload via SDK (signed, server-side) ──────────────────
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `travio/${userId}`,
                    resource_type: "auto",      // handles images + PDFs
                    use_filename: true,
                    unique_filename: true,
                    overwrite: false,
                    // Tag for easy Cloudinary dashboard filtering
                    tags: ["travio", userId],
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // ── Return structured response ────────────────────────────
        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
            resourceType: result.resource_type,
            width: result.width ?? null,
            height: result.height ?? null,
            name: file.name,
        });
    } catch (error: any) {
        console.error("[upload] Cloudinary error:", error);
        return NextResponse.json(
            { error: error?.message ?? "Upload failed. Please try again." },
            { status: 500 }
        );
    }
}
