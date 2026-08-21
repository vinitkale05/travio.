'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlaneTakeoff, UserPlus, MapPinned, Waves } from 'lucide-react';

export function HowItWorks() {
    return (
        <section className="py-12 relative overflow-hidden w-full bg-transparent" id="how-it-works">

            <div className="max-w-[1240px] mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-8 px-4 py-1.5 border border-slate-200/50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] backdrop-blur-md"
                    >
                        Engineering Your Journey
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-[900] text-slate-900 tracking-tight leading-[1] mb-8 font-heading"
                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                        From chaos to <span className="text-[#0066FF] inline-block relative">coordination.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 font-bold text-lg max-w-2xl leading-relaxed"
                    >
                        The synchronized operating system for groups. No cards, no clutter—just a seamless flow from start to finish.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* The Structural Flow Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-[1px] bg-slate-200 z-0">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
                            style={{ originX: 0 }}
                            className="w-full h-full bg-[#0066FF]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-8 relative">
                        {[
                            {
                                step: "01",
                                title: "Initialize",
                                desc: "Sync your squad and set the mission parameters in one tap.",
                                icon: <PlaneTakeoff className="w-5 h-6" />
                            },
                            {
                                step: "02",
                                title: "Invite",
                                desc: "Secure multi-user access via private encrypted squad link.",
                                icon: <UserPlus className="w-5 h-6" />
                            },
                            {
                                step: "03",
                                title: "Architect",
                                desc: "Build dynamic itineraries with real-time collaborative logic.",
                                icon: <MapPinned className="w-5 h-6" />
                            },
                            {
                                step: "04",
                                title: "Deploy",
                                desc: "Execute with precision. All assets synced and ready offline.",
                                icon: <Waves className="w-5 h-6" />
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i, duration: 0.8 }}
                                className="relative flex flex-col items-center group"
                            >
                                {/* Minimalist Node */}
                                <div className="w-[88px] h-[88px] rounded-full border-[1px] border-slate-200/50 flex items-center justify-center mb-10 relative z-10 group-hover:border-[#0066FF] group-hover:bg-white/50 transition-all duration-500 backdrop-blur-xl">
                                    <div className="text-slate-900 group-hover:text-[#0066FF] transition-colors duration-500">
                                        {item.icon}
                                    </div>
                                    <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-white text-[8px] font-black border-2 border-white shadow-sm">
                                        {item.step}
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight uppercase" style={{ fontFamily: "'Quicksand', sans-serif" }}>{item.title}</h3>
                                <p className="text-slate-500 font-bold text-[13px] leading-relaxed text-center px-4">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
