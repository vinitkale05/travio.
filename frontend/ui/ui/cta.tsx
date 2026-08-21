'use client';

import React from 'react';
import Link from 'next/link';

export function CTA() {
    return (
        <section className="py-12 relative overflow-hidden w-full bg-transparent">
            {/* Dots are handled by the fixed global background in layout.tsx */}

            {/* The Blue Card Wrapper */}
            <div className="max-w-[1240px] mx-auto px-6 relative z-10">
                <div className="bg-slate-950 rounded-[48px] py-6 px-8 md:px-20 text-center relative overflow-hidden border border-white/5 shadow-2xl">
                    {/* Removed radial gradients as per user request */}

                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-4 max-w-4xl" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                            Ready to start planning?
                        </h2>
                        <p className="text-slate-400 font-bold text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
                            Join over 50,000 explorers who use Travio to create unforgettable memories with their favorite people.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                            <Link href="/sign-up" className="h-14 px-8 bg-white text-slate-900 font-black text-base rounded-2xl flex items-center justify-center transition-all hover:bg-slate-50 shadow-xl active:scale-95 w-full sm:w-auto group">
                                Start Planning Free
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300">
                                    <path d="M5 12h14m-4-4l4 4-4 4" />
                                </svg>
                            </Link>
                            <a href="#demo" className="h-14 px-8 border border-white/20 bg-white/5 backdrop-blur-md text-white font-black text-base rounded-2xl flex items-center justify-center transition-all hover:bg-white/10 active:scale-95 w-full sm:w-auto">
                                View Demo
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
