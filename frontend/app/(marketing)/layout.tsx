import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import ExploreDemoButton from '@frontend/ui/explore-demo-button';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                        <div className="flex items-center justify-center text-primary relative overflow-hidden h-8 w-8">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current">
                                <path d="M120-120v-80h720v80H120Z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current plane-animate">
                                <path d="M190-320L40-570l96-26 112 94 140-37-207-276 116-31 299 251 170-46q32-9 60.5 7.5T864-585q9 32-7.5 60.5T808-487L190-320Z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900 font-display">Travio</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link className="text-base font-semibold text-slate-600 hover:text-primary transition-colors" href="/#features">Features</Link>
                        <Link className="text-base font-semibold text-slate-600 hover:text-primary transition-colors" href="/#how-it-works">Workflows</Link>
                        <Link className="text-base font-semibold text-slate-600 hover:text-primary transition-colors" href="/#pricing">Pricing</Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <SignedOut>
                            <Link href="/sign-in" className="hidden sm:flex items-center justify-center text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">
                                Log In
                            </Link>
                            <ExploreDemoButton variant="nav" />
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard" className="hidden sm:flex items-center justify-center text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">Dashboard</Link>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </nav>


            {children}

            <section className="relative w-full pt-4 pb-0 overflow-hidden bg-transparent pointer-events-none select-none">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-[18vw] font-black leading-none tracking-tighter uppercase inline-block mx-auto text-transparent"
                        style={{
                            fontFamily: "'Quicksand', sans-serif",
                            WebkitTextStroke: "1px #cbd5e1"
                        }}>
                        TRAVIO
                    </h2>
                </div>
                {/* Line below TRAVIO */}
                <div className="max-w-7xl mx-auto px-6 mt-12">
                    <div className="w-full h-px bg-slate-900/10" />
                </div>
            </section>

            <footer className="py-8 relative z-50 bg-white border-t border-slate-900/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top Grouped Row */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-6">
                        {/* Left: Logo + Name + Message */}
                        <div className="flex flex-col gap-6">
                            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                                <div className="flex items-center justify-center text-slate-900 relative overflow-hidden h-7 w-7">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-7 h-7 fill-current opacity-20">
                                        <path d="M120-120v-80h720v80H120Z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-7 h-7 fill-current plane-animate">
                                        <path d="M190-320L40-570l96-26 112 94 140-37-207-276 116-31 299 251 170-46q32-9 60.5 7.5T864-585q9 32-7.5 60.5T808-487L190-320Z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-black tracking-tighter text-slate-900" style={{ fontFamily: "'Quicksand', sans-serif" }}>Travio</span>
                            </Link>
                            <p className="text-slate-500 font-bold text-[13px] max-w-[40ch] leading-relaxed">
                                A premium travel management platform. <br className="hidden md:block" /> Built with passion for the <a href="https://chaicode.com/" target="_blank" rel="noopener noreferrer" className="text-slate-900 border-b border-slate-900/10 hover:text-[#0066FF] hover:border-[#0066FF]/30 transition-all">ChaiCode Buildathon 2026</a>.
                            </p>
                        </div>

                        {/* Right: Social Links */}
                        <div className="flex gap-6 lg:justify-end">
                            <a className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110" href="https://linkedin.com/in/pranavgawai" target="_blank" rel="noopener noreferrer">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110" href="https://x.com/pranavgawai_" target="_blank" rel="noopener noreferrer">
                                <span className="sr-only">X</span>
                                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                </svg>
                            </a>
                            <a className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110" href="https://github.com/pranavgawaii" target="_blank" rel="noopener noreferrer">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="w-full pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[13px] font-bold text-slate-400 tracking-tight">© 2026 Travio Inc. All rights reserved.</p>
                        <p className="text-[13px] font-bold text-slate-400">
                            Designed and developed by <a href="https://pranavx.in" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-black hover:text-[#0066FF] transition-colors">pranavgawai</a>
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
