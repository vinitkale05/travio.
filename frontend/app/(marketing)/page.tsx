import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AvatarGroup } from '@frontend/ui/ui/avatar-group';
import { Features } from '@frontend/ui/ui/features';
import ExploreDemoButton from '@frontend/ui/explore-demo-button';
import { DestinationGallery } from '@frontend/ui/ui/gallery';
import { TravelStats } from '@frontend/ui/ui/travel-stats';
import { HowItWorks } from '@frontend/ui/ui/how-it-works';
import { Pricing } from '@frontend/ui/ui/pricing';
import { FAQ } from '@frontend/ui/ui/faq';
import { CTA } from '@frontend/ui/ui/cta';
import { getLocalBlurDataURL, getLocalMediaSrc, HERO_IMAGE_SIZES } from '@shared/media';

export default async function Home() {
    const { userId } = await auth();

    if (userId) {
        redirect('/dashboard');
    }

    return (
        <main className="flex flex-col items-center bg-transparent selection:bg-primary/20 font-body w-full relative z-10">
            <section className="relative pt-0 pb-4 md:pb-6 w-full px-2 md:px-4 lg:px-6 xl:px-8 max-w-[1800px] mx-auto" id="home">
                <div className="w-full mx-auto relative rounded-3xl lg:rounded-[2.5rem] overflow-hidden min-h-[600px] md:min-h-[700px] lg:h-[95vh] lg:min-h-[800px] max-h-[1200px] flex flex-col items-center justify-start text-center group border border-white/5">
                    <Image
                        alt="Adventure awaits with Travio"
                        className="absolute inset-0 h-full w-full object-cover object-[center_20%] transition-transform duration-[40s] group-hover:scale-105"
                        src="/hero-section.png"
                        fill
                        priority
                        sizes={HERO_IMAGE_SIZES}
                    />
                    <div className="absolute inset-0 bg-black/10" />

                    {/* Bottom merge to white for seamless transition */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

                    <div className="relative z-20 w-full h-full max-w-6xl mx-auto flex flex-col items-center pt-8 md:pt-12 pb-6 md:pb-8 px-4">
                        <div className="flex flex-col items-center w-full mt-2 lg:mt-8">
                            <div className="flex justify-center items-center gap-3 mb-6 animate-fade-in-up">
                                <div className="text-xs md:text-sm font-[600] text-gray-200 tracking-wider flex items-center gap-2 opacity-90 drop-shadow-sm">
                                    <div className="w-5 h-[1px] bg-gray-200" />
                                    <span>It&apos;s time to go 🚀</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <div className="flex items-center py-0.5">
                                    <AvatarGroup
                                        avatars={[
                                            { src: "/hitesh.jpg" },
                                            { src: "/piyush.jpg" },
                                            { src: "/anirudh.jpg" },
                                            { src: "/Chaicode.jpg" }
                                        ]}
                                        maxVisible={4}
                                        size={36}
                                        overlap={12}
                                    />
                                </div>
                                <span className="text-sm md:text-base font-[500] text-gray-100 drop-shadow-sm ml-2 border-l border-white/30 pl-4">+100 travel groups trusted us</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-tight text-center" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}>
                                Your next trip deserves<br />better than a <span className="relative inline-block">
                                    WhatsApp
                                    <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#25D366] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                </span> group.
                            </h1>
                        </div>

                        <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col justify-center items-center mt-2 lg:mt-6 pb-8 z-20">
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                                <Link href="/sign-up" className="h-14 px-8 flex items-center justify-center rounded-full bg-[#0066FF] text-base font-black text-white hover:bg-blue-600 transition-all shadow-md hover:-translate-y-1 active:scale-95 group">
                                    Start Planning Free
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300">
                                        <path d="M5 12h14m-4-4l4 4-4 4" />
                                    </svg>
                                </Link>
                                <ExploreDemoButton />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Features />

            <HowItWorks />

            <DestinationGallery />
            <TravelStats />
            <Pricing />
            <FAQ />
            <CTA />
        </main>
    );
}
