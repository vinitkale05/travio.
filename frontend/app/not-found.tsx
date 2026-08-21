import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@frontend/ui/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 font-inter">
            <div className="max-w-md w-full flex flex-col items-center text-center">
                {/* Minimal Logo */}
                <div className="mb-8">
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                        <div className="relative h-8 w-8">
                            <Image src="/icon.svg" alt="Travio" fill className="object-contain" />
                        </div>
                    </div>
                </div>

                {/* Typography */}
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    Page not found
                </h1>

                <p className="text-[15px] text-slate-500 max-w-[320px] mx-auto mb-10 font-medium leading-relaxed">
                    The endpoint you are looking for might have been removed, renamed, or is temporarily unavailable.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="w-full sm:w-40 h-12 rounded-xl bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold text-[14px] shadow-sm transition-all"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </Link>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-40 h-12 rounded-xl bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold text-[14px] shadow-sm transition-all">
                            <Home className="w-4 h-4 mr-2" />
                            Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
