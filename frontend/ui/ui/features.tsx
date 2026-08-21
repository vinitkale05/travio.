'use client';

import React from 'react';
import { MapPinned, UtensilsCrossed, UserPlus, Calendar, Gauge, Rocket } from 'lucide-react';

export function Features() {
    return (
        <section className="py-12 relative overflow-hidden bg-transparent w-full" id="features" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Features Header */}
                <div className="flex flex-col items-center text-center mb-24 px-4">
                    <span className="text-[11px] font-black text-[#0066FF] uppercase tracking-[0.3em] mb-6 inline-flex items-center gap-2">
                        <div className="w-6 h-[1px] bg-[#0066FF]/20" />
                        Features
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-[-0.03em] leading-none mb-8 w-full" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                        The operating system for <span className="text-[#0066FF]">group trips.</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-80">
                        A high-performance workspace designed to sync your squad and eliminate coordination chaos.
                    </p>
                </div>

                {/* Main Feature Grid with Individual Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {/* Card 1 */}
                    <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-sm transition-all hover:shadow-xl hover:border-[#0066FF]/20 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0066FF] mb-8 group-hover:bg-blue-50 transition-colors">
                            <MapPinned className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Unified Itinerary</h3>
                        <p className="text-slate-500 font-bold text-[15px] leading-relaxed">
                            A dynamic board where everyone can add, edit, and vote on activities in real-time. Syncs across all devices instantly.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-sm transition-all hover:shadow-xl hover:border-[#0066FF]/20 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-100 transition-colors">
                            <UtensilsCrossed className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Squad Finance</h3>
                        <p className="text-slate-500 font-bold text-[15px] leading-relaxed">
                            Deep ledger logic that handles currency conversions and group splits automatically. Never argue about money again.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-sm transition-all hover:shadow-xl hover:border-[#0066FF]/20 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0066FF] mb-8 group-hover:bg-blue-50 transition-colors">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Smart Vault</h3>
                        <p className="text-slate-500 font-bold text-[15px] leading-relaxed">
                            One secure place for all tickets and vouchers. Accessible offline so you&apos;re never scrambling at the airport.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-sm transition-all hover:shadow-xl hover:border-[#0066FF]/20 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-100 transition-colors">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Calendar Pulse</h3>
                        <p className="text-slate-500 font-bold text-[15px] leading-relaxed">
                            Bi-directional sync with Google and Apple calendars. Stay updated on trip deadlines and flight changes automatically.
                        </p>
                    </div>

                    {/* Card 5 */}
                    <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-sm transition-all hover:shadow-xl hover:border-[#0066FF]/20 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0066FF] mb-8 group-hover:bg-blue-50 transition-colors">
                            <Gauge className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Collaboration Sync</h3>
                        <p className="text-slate-500 font-bold text-[15px] leading-relaxed">
                            Multi-user cursor tracking and real-time presence indicators. See what your squad is planning as it happens.
                        </p>
                    </div>

                    {/* Card 6 */}
                    <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-sm transition-all hover:shadow-xl hover:border-[#0066FF]/20 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-100 transition-colors">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Vibe Check</h3>
                        <p className="text-slate-500 font-bold text-[15px] leading-relaxed">
                            AI-powered trip sentiment analysis. Get suggestions for pacing and activities based on your group&apos;s preferences.
                        </p>
                    </div>
                </div>

                {/* Stats Marquee - Side Scrolling - Line REMOVED */}
                <div className="mt-20 overflow-hidden relative">
                    <div className="flex animate-marquee whitespace-nowrap gap-24 py-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-24 shrink-0 items-center">
                                <div className="flex flex-col">
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">50,000+</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Explorers active</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">12,000+</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Trips structured</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-4xl font-black text-[#0066FF] tracking-tighter">99.9%</p>
                                    <p className="text-[10px] font-black text-[#0066FF]/70 uppercase tracking-[0.2em] mt-2">Sync Uptime</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">Instant</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Expense Settling</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">150+</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Currencies ready</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-4xl font-black text-[#0066FF] tracking-tighter">24/7</p>
                                    <p className="text-[10px] font-black text-[#0066FF]/70 uppercase tracking-[0.2em] mt-2">AI Assistance</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Fades for smooth scroll feel */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                    display: flex;
                    width: max-content;
                }
            `}</style>
        </section>
    );
}
