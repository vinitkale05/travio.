"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { normalizeRemoteImage } from "@shared/media";
import { cn } from "@shared/utils";

type Direction = "left" | "right";

// --- DESTINATION GALLERY ---
type PhotoItem = {
    id: number;
    direction: Direction;
    src: string;
    label: string;
};

const BASE_PHOTOS: PhotoItem[] = [
    { id: 1, direction: "left", src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80", label: "Paris" },
    { id: 2, direction: "right", src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80", label: "Santorini" },
    { id: 3, direction: "left", src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", label: "Goa Beach" },
    { id: 4, direction: "right", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", label: "Swiss Alps" },
    { id: 5, direction: "left", src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80", label: "Bali Jungle" },
    { id: 6, direction: "right", src: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=600&q=80", label: "Maldives" },
    { id: 7, direction: "left", src: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=600&q=80", label: "Iceland" },
];

export const DestinationGallery = () => {
    const [activeIndex, setActiveIndex] = useState(3);

    const next = () => setActiveIndex((prev) => (prev + 1) % BASE_PHOTOS.length);
    const prev = () => setActiveIndex((prev) => (prev - 1 + BASE_PHOTOS.length) % BASE_PHOTOS.length);

    const getTransformStyles = (index: number, active: number) => {
        let diff = index - active;
        const length = BASE_PHOTOS.length;

        if (diff > Math.floor(length / 2)) diff -= length;
        if (diff < -Math.floor(length / 2)) diff += length;

        let translateX = "0%";
        let scale = 1;
        let zIndex = 20;
        let opacity = 1;

        if (diff === 0) {
            translateX = "0%";
            scale = 1;
            zIndex = 30;
            opacity = 1;
        } else if (diff === 1) {
            translateX = "105%";
            scale = 0.82;
            zIndex = 20;
            opacity = 1;
        } else if (diff === -1) {
            translateX = "-105%";
            scale = 0.82;
            zIndex = 20;
            opacity = 1;
        } else if (diff === 2) {
            translateX = "200%";
            scale = 0.68;
            zIndex = 10;
            opacity = 0.8;
        } else if (diff === -2) {
            translateX = "-200%";
            scale = 0.68;
            zIndex = 10;
            opacity = 0.8;
        } else {
            translateX = diff > 0 ? "300%" : "-300%";
            scale = 0.5;
            zIndex = 0;
            opacity = 0;
        }

        return {
            transform: `translate(calc(-50% + ${translateX}), -50%) scale(${scale})`,
            zIndex,
            opacity,
        };
    };

    return (
        <section className="relative w-full overflow-hidden border-0 py-12 bg-transparent">
            {/* Dots are handled globally */}

            <div className="relative z-20 flex flex-col items-center text-center py-4 mb-2 px-4">
                <h3 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-5xl leading-[1.1]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    Built for every type of trip.
                </h3>
                <p className="mt-4 text-slate-500 font-medium text-[15px] md:text-base max-w-2xl leading-relaxed">
                    Discover the world&apos;s most popular vacation spots, curated carefully for every kind of traveler. From weekend getaways to month-long expeditions.
                </p>
            </div>

            <div className="relative w-full flex justify-center items-center h-[400px] lg:h-[480px] max-w-screen-2xl mx-auto px-4 overflow-hidden">

                {/* Global Left Arrow */}
                <button
                    onClick={prev}
                    className="absolute left-2 md:left-12 z-40 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full w-11 h-11 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
                </button>

                <div className="relative w-full h-full perspective-1000">
                    {BASE_PHOTOS.map((photo, index) => {
                        const styles = getTransformStyles(index, activeIndex);
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={photo.id}
                                onClick={() => setActiveIndex(index)}
                                className="absolute top-[40%] left-1/2 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer flex flex-col items-center"
                                style={styles}
                            >
                                <div className={cn(
                                    "relative overflow-hidden shadow-2xl transition-all duration-700 delay-75",
                                    isActive ? "w-[180px] sm:w-[220px] md:w-[240px] lg:w-[260px] h-[240px] sm:h-[300px] md:h-[320px] lg:h-[340px] rounded-[24px] border border-slate-100/50"
                                        : "w-[140px] sm:w-[180px] md:w-[200px] lg:w-[210px] h-[190px] sm:h-[240px] md:h-[260px] lg:h-[280px] rounded-[20px] border-none grayscale-[20%]",
                                )}>
                                    <Image
                                        src={normalizeRemoteImage(photo.src, 600, 80)}
                                        alt={photo.label}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 250px, 400px"
                                        draggable={false}
                                    />
                                    {/* Removed gradient vignette as per user request */}
                                </div>

                                <div className={cn(
                                    "mt-4 text-center transition-all duration-700 absolute top-full w-full",
                                    isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                                )}>
                                    <h4 className="text-[22px] md:text-[26px] tracking-tight font-extrabold text-slate-800" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                        {photo.label}
                                    </h4>
                                    <div className="mt-2.5 flex flex-row items-center justify-center gap-2.5 text-[13px] md:text-[14px] font-bold text-slate-500">
                                        <div className="w-2 h-2 rounded-full bg-[#00D084] shadow-[0_0_12px_rgba(0,208,132,0.6)]" />
                                        <span>12k+ Happy Tourist</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Global Right Arrow */}
                <button
                    onClick={next}
                    className="absolute right-2 md:right-12 z-40 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                >
                    <ChevronRight className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
                </button>
            </div>


        </section>
    );
};


