"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TravelStats = () => {
    return (
        <section className="relative w-full py-12 min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-transparent">
            {/* Aerial Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/landing-aerial-bg.png"
                    alt="Aerial ocean view"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Visual refinement overlay */}
                <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply" />
            </div>

            <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 flex flex-col items-center">
                <h3 className="text-white text-[15px] sm:text-[18px] font-bold tracking-[0.1em] uppercase mb-16 lg:mb-20 text-center drop-shadow-md opacity-90" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    Trusted by thousands of travelers around the world
                </h3>

                <div className="relative w-full flex items-center justify-center group/slider">

                    {/* Left Navigation Arrow */}
                    <button className="hidden lg:flex absolute -left-6 z-30 w-14 h-14 bg-white/90 backdrop-blur-md items-center justify-center rounded-full shadow-xl hover:scale-105 hover:bg-white transition-all text-slate-800">
                        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                    </button>

                    <div className="flex flex-row items-center w-full lg:w-auto overflow-x-auto pb-10 -mb-10 px-4 snap-x snap-mandatory lg:overflow-visible lg:p-0 lg:m-0 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <div className="flex flex-row gap-12 mx-auto">
                            <div className="snap-center shrink-0 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                <TicketCard
                                    numberText="44K+"
                                    description="Happy explorers who found their dream trips with Travio"
                                    showLeftHole={true}
                                    showRightHole={true}
                                />
                            </div>
                            <div className="snap-center shrink-0 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                <TicketCard
                                    numberText="300+"
                                    description="Handpicked destinations curated for every kind of traveler"
                                    showLeftHole={true}
                                    showRightHole={true}
                                />
                            </div>
                            <div className="snap-center shrink-0 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                <TicketCard
                                    numberText="30%"
                                    description="Book your next trip today and enjoy exclusive Travio deals"
                                    showLeftHole={true}
                                    showRightHole={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Navigation Arrow */}
                    <button className="hidden lg:flex absolute -right-6 z-30 w-14 h-14 bg-white/90 backdrop-blur-md items-center justify-center rounded-full shadow-xl hover:scale-105 hover:bg-white transition-all text-slate-800">
                        <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                    </button>

                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

const TicketCard = ({
    numberText,
    description,
    showLeftHole = true,
    showRightHole = true
}: {
    numberText: string;
    description: string;
    showLeftHole?: boolean;
    showRightHole?: boolean;
}) => {
    // Generate the CSS Masks using string literals
    const leftMask = showLeftHole
        ? `radial-gradient(circle at 0px 50%, transparent 20px, black 20.5px)`
        : `linear-gradient(black, black)`;

    const rightMask = showRightHole
        ? `radial-gradient(circle at 100% 50%, transparent 20px, black 20.5px)`
        : `linear-gradient(black, black)`;

    return (
        <div
            className="relative flex-none w-[300px] sm:w-[320px] lg:w-[350px] h-[400px] bg-white flex flex-col items-center justify-center px-8 lg:px-12 text-center"
            style={{
                WebkitMaskImage: `
                    radial-gradient(circle at 12px 0px, transparent 8px, black 8.5px),
                    radial-gradient(circle at 12px 20px, transparent 8px, black 8.5px),
                    ${leftMask},
                    ${rightMask}
                `,
                WebkitMaskSize: `
                    24px 20px,
                    24px 20px,
                    50% calc(100% - 40px),
                    50% calc(100% - 40px)
                `,
                WebkitMaskPosition: `
                    top left,
                    bottom left,
                    0px 20px,
                    100% 20px
                `,
                WebkitMaskRepeat: `
                    repeat-x,
                    repeat-x,
                    no-repeat,
                    no-repeat
                `,
                maskImage: `
                    radial-gradient(circle at 12px 0px, transparent 8px, black 8.5px),
                    radial-gradient(circle at 12px 20px, transparent 8px, black 8.5px),
                    ${leftMask},
                    ${rightMask}
                `,
                maskSize: `
                    24px 20px,
                    24px 20px,
                    50% calc(100% - 40px),
                    50% calc(100% - 40px)
                `,
                maskPosition: `
                    top left,
                    bottom left,
                    0px 20px,
                    100% 20px
                `,
                maskRepeat: `
                    repeat-x,
                    repeat-x,
                    no-repeat,
                    no-repeat
                `
            }}
        >
            {/* Dashed background center line perfectly aligned with the 20px side cutouts - REMOVED GRADIENT */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 border-t border-dashed border-slate-200" />

            <div className="mb-auto mt-16 font-sans">
                <span className="text-[72px] lg:text-[84px] font-[800] text-slate-900 tracking-tighter leading-none" style={{ letterSpacing: "-0.05em", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    {numberText}
                </span>
            </div>

            <div className="mt-auto mb-16 relative z-10 bg-white/0 px-2 font-sans text-center">
                <p className="text-slate-500 font-medium text-[15px] lg:text-[16px] leading-[1.6] max-w-[240px] mx-auto" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    {description}
                </p>
            </div>
        </div>
    );
};
