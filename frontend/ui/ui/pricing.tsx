'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Rocket, Gauge, Handshake, Calendar } from 'lucide-react';

export function Pricing() {
    return (
        <section className="relative py-12 overflow-hidden border-t border-slate-100 bg-transparent" id="pricing">

            <div className="relative z-10 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 px-4">
                    <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
                        <p className="text-sm font-bold text-[#0066FF] uppercase tracking-[0.2em] mb-4">Transparent Pricing</p>
                        <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-[-0.03em] leading-[1.1] font-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                            Plans that match your <span className="text-[#0066FF]">momentum.</span>
                        </h3>
                        <p className="text-slate-500 font-bold text-lg mt-6 leading-relaxed max-w-[80ch]">
                            Clear scopes, unlimited sync, and real-time coordination. No surprises—just progress for your group adventures.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-4">
                    {/* Starter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-[32px] border border-slate-200/50 bg-white/40 backdrop-blur-md p-8 lg:p-10 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 group flex flex-col">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight font-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>Starter Squad</h4>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                <Rocket className="w-3 h-3 text-[#0066FF]" />
                                Quick Start
                            </span>
                        </div>
                        <div className="mt-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-slate-900 tracking-[-0.05em]">₹0</span>
                                <span className="text-slate-400 font-bold text-sm uppercase">Free </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-4 font-bold">Best for small groups or MVP trip validation.</p>
                        </div>
                        <ul className="mt-10 space-y-5 flex-grow">
                            {[
                                "1 pod: Up to 5 squad members",
                                "Real-time sync on all tools",
                                "Weekly automated summaries",
                                "Basic expense settlement"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-4 text-[14px] text-slate-600 font-bold">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-12 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-900 text-sm font-black py-4 transition-all duration-300">
                            Start with Starter
                        </button>
                    </motion.div>

                    {/* Growth (Featured) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative rounded-[32px] border-2 border-[#0066FF] bg-white p-8 lg:p-10 shadow-lg md:scale-105 z-20 flex flex-col">
                        <div className="absolute -top-4 left-8 inline-flex items-center rounded-full bg-[#0066FF] text-white text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2 ring-4 ring-white shadow-md">
                            Most popular
                        </div>
                        <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight font-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>Growth Sprint</h4>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/50 px-3 py-1.5 text-[10px] font-black text-[#0066FF] uppercase tracking-wider">
                                <Gauge className="w-3.5 h-3.5" />
                                More velocity
                            </span>
                        </div>
                        <div className="mt-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-slate-900 tracking-[-0.05em]">₹499</span>
                                <span className="text-slate-400 font-bold text-sm uppercase">per trip</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-4 font-bold">Standard features for independent travelers.</p>
                        </div>
                        <ul className="mt-10 space-y-5 flex-grow">
                            {[
                                "Unlimited squad members",
                                "Advanced AI expense matrix",
                                "Shared asset repository",
                                "Priority cloud sync",
                                "Full coordination dashboard"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-4 text-[14px] text-slate-700 font-bold">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-[#0066FF]" strokeWidth={3} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-12 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0066FF] text-white hover:bg-blue-600 border border-blue-700 shadow-md text-sm font-black py-5 transition-all">
                            Select Growth plan
                            <Calendar className="w-4 h-4" />
                        </button>
                    </motion.div>

                    {/* Embedded / Partner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative rounded-[32px] border border-slate-200/50 bg-white p-8 lg:p-10 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 group flex flex-col">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight font-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>Agency Pro</h4>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                <Handshake className="w-3.5 h-3.5" />
                                Enterprise
                            </span>
                        </div>
                        <div className="mt-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-slate-900 tracking-[-0.05em]">₹9,999</span>
                                <span className="text-slate-400 font-bold text-sm uppercase">per month</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-4 font-bold">For travel agencies managing multi-client groups.</p>
                        </div>
                        <ul className="mt-10 space-y-5 flex-grow">
                            {[
                                "Unlimited active itineraries",
                                "API/Webhook access & deep integration",
                                "White-label group interfaces",
                                "Dedicated account manager support"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-4 text-[14px] text-slate-600 font-bold">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-12 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black py-4 transition-all duration-300">
                            Contact for Enterprise
                        </button>
                    </motion.div>
                </div>

                <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12 text-[13px] pt-16 border-t border-slate-100">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] mb-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0066FF]"></span>
                            What&apos;s included
                        </div>
                        <p className="text-slate-400 font-bold leading-relaxed pr-8">
                            Every plan includes weekly demos, shared roadmaps, async updates, and access to source files or trip repos.
                        </p>
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] mb-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Flexible scope
                        </div>
                        <p className="text-slate-400 font-bold leading-relaxed pr-8">
                            Pause between sprints. Scale pods up or down as your group coordination priorities shift.
                        </p>
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] mb-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                            Custom engagements
                        </div>
                        <p className="text-slate-400 font-bold leading-relaxed pr-8">
                            Have a unique trip scope? We will tailor a custom coordination plan and price to your specific goals.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
