export default function TripLoading() {
    return (
        <div className="min-h-screen bg-slate-100/60 pb-20 font-inter text-slate-900">
            <div className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
                <div className="relative h-[280px] w-full overflow-hidden rounded-[2rem] bg-slate-200 shadow-lg sm:h-[320px]">
                    <div className="absolute inset-0 shimmer" />
                    <div className="absolute bottom-6 left-6 right-6 space-y-4">
                        <div className="h-8 w-56 animate-pulse rounded-full bg-white/30" />
                        <div className="h-12 w-80 max-w-full animate-pulse rounded-full bg-white/40" />
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-6 max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-center">
                    <div className="h-14 w-[480px] max-w-full shimmer rounded-2xl bg-white shadow-sm" />
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="flex gap-6 overflow-hidden">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="w-[340px] shrink-0 rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="mb-6 h-7 w-28 shimmer rounded-full" />
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((__, cardIdx) => (
                                            <div key={cardIdx} className="rounded-xl border border-slate-200 p-4">
                                                <div className="mb-3 h-4 w-16 shimmer rounded-full" />
                                                <div className="mb-2 h-5 w-2/3 shimmer rounded-full" />
                                                <div className="h-4 w-1/2 shimmer rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 h-6 w-32 shimmer rounded-full" />
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="h-8 w-8 shimmer rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-20 shimmer rounded-full" />
                                        <div className="h-4 w-40 shimmer rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
