"use client";

import React from "react";
import { Sidebar } from "@frontend/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#FAFAFA] relative">
            {/* GLOBAL DOT PATTERN BACKGROUND */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: "radial-gradient(#E4E4E7 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                }}
            />

            {/* Persistent Sidebar */}
            <Sidebar />

            {/* Main scrollable content area */}
            <main className="flex-1 overflow-y-auto min-w-0 relative z-10">
                {children}
            </main>
        </div>
    );
}
