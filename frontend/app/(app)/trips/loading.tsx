export default function TripsLoading() {
    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 font-inter text-slate-900">
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md lg:px-8">
                <div className="space-y-2">
                    <div className="h-3 w-20 shimmer rounded-full" />
                    <div className="h-5 w-28 shimmer rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-28 shimmer rounded-xl" />
                    <div className="h-8 w-8 shimmer rounded-full" />
                </div>
            </header>
            <main className="grid grid-cols-1 gap-6 px-6 pb-20 pt-8 md:grid-cols-2 lg:px-8 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                        <div className="h-44 shimmer" />
                        <div className="space-y-5 p-5">
                            <div className="space-y-2">
                                <div className="h-6 w-2/3 shimmer rounded-full" />
                                <div className="h-3 w-1/2 shimmer rounded-full" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="h-8 w-24 shimmer rounded-full" />
                                <div className="h-6 w-16 shimmer rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
