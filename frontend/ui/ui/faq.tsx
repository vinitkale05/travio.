'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "How does the real-time syncing work?",
        answer: "Travio uses a high-frequency sync engine. Every time you drag an activity, add an expense, or update a date, the changes are reflected instantly for everyone in your squad without a page reload."
    },
    {
        question: "Can I use Travio offline while traveling?",
        answer: "Absolutely. Travio is built with a local-first architecture. You can access your itinerary, boarding passes, and split expenses even in areas with zero cell service. Changes will sync once you are back online."
    },
    {
        question: "Is there a limit to how many people can join a trip?",
        answer: "The Starter Squad plan allows up to 5 members per trip. For larger groups or professional planning, the Growth Sprint plan offers unlimited squad members and advanced coordination tools."
    },
    {
        question: "How do you handle expense settlements?",
        answer: "We use a smart settlement matrix. Just log who paid for what, and Travio automatically calculates the most efficient way to settle debts, minimizing the number of total transactions."
    },
    {
        question: "Can I export my data?",
        answer: "Yes, you can export your itineraries as PDF or sync them directly with your Google Calendar or Apple Calendar at any time."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-12 relative overflow-hidden w-full border-t border-slate-100" id="support">

            <div className="max-w-[800px] mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-16">
                    <p className="text-[11px] font-bold text-[#0066FF] uppercase tracking-[0.2em] mb-4">Support</p>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                        Common <span className="text-[#0066FF]">Queries.</span>
                    </h3>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="border border-slate-200/50 rounded-[24px] bg-white/40 backdrop-blur-xl overflow-hidden hover:border-[#0066FF]/20 transition-colors group"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left transition-colors"
                            >
                                <span className="text-lg font-bold text-slate-800 pr-8 group-hover:text-slate-900 transition-colors">{faq.question}</span>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm transition-all duration-300 group-hover:border-[#0066FF]/30" style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    {openIndex === i ? <Minus className="w-4 h-4 text-[#0066FF]" /> : <Plus className="w-4 h-4 text-slate-400" />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-8 pt-0">
                                            <p className="text-slate-500 font-bold text-[14px] leading-relaxed max-w-2xl">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-400 font-bold mb-4 italic text-[10px] tracking-[0.1em]">Still have questions?</p>
                    <a href="mailto:support@travio.fun" className="group inline-flex items-center gap-2 text-[#0066FF] font-black text-base hover:underline underline-offset-[10px] decoration-4 decoration-blue-100 transition-all">
                        Chat with our crew members <Plus className="w-4 h-4 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                    </a>
                </div>
            </div>
        </section>
    );
}
