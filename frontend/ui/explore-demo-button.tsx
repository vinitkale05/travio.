"use client";

import { useSignIn, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function ExploreDemoButton({ variant = "hero" }: { variant?: "hero" | "nav" }) {
    const { signIn, isLoaded, setActive } = useSignIn();
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDemoLogin = async () => {
        console.log("Demo login initiated...", { isLoaded, hasSignIn: !!signIn });
        if (!isLoaded || !signIn) {
            alert("Clerk is still loading. Please wait a few seconds and try again.");
            return;
        }
        setLoading(true);

        try {
            console.log("Attempting signIn.create with demo@travio.com");
            // 1. Attempt to sign in with demo credentials
            const result = await signIn.create({
                identifier: "demo@travio.com",
                password: "Demo@1701",
            });

            console.log("SignIn result status:", result.status);

            if (result.status === "complete") {
                console.log("SignIn success. Setting active session:", result.createdSessionId);
                await setActive({ session: result.createdSessionId });
                console.log("Session active. Redirecting to dashboard...");
                router.push("/dashboard");
            } else {
                console.warn("SignIn incomplete. Status:", result.status);
                alert(`Login incomplete. Status: ${result.status}. Please check your Clerk dashboard for this user.`);
            }
        } catch (err: any) {
            console.error("DEBUG: Demo login failed caught error:", err);
            const errorMessage = err.errors?.[0]?.longMessage || err.message || "Unknown error";
            const errorCode = err.errors?.[0]?.code || "no_code";
            alert(`Demo Login Failed:\n\nError: ${errorMessage}\nCode: ${errorCode}\n\nMake sure the user (demo@travio.com / Demo@1701) exists in your Clerk instance.`);
        } finally {
            setLoading(false);
        }
    };

    if (variant === "nav") {
        return (
            <Button
                onClick={handleDemoLogin}
                disabled={loading}
                className="h-11 flex items-center justify-center rounded-xl bg-[#0f172a] px-6 text-base font-bold text-white hover:bg-slate-800 transition-all shadow-soft group"
            >
                {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : null}
                Try Demo
            </Button>
        );
    }

    return (
        <Button
            onClick={handleDemoLogin}
            disabled={loading}
            className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-8 text-lg font-bold text-white hover:bg-white/20 hover:border-white/40 transition-all shadow-lg hover:-translate-y-0.5"
        >
            {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                    <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
            )}
            Explore Live Demo
        </Button>
    );
}
