import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden px-4">
            {/* Background decorations for a premium look */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-70"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[80px] -z-10 mix-blend-multiply opacity-70"></div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center justify-center mx-auto">
                <div className="mb-10 text-center w-full flex justify-center">
                    <Link href="/" className="inline-block group mx-auto">
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center justify-center text-primary relative overflow-hidden h-8 w-8">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current">
                                    <path d="M120-120v-80h720v80H120Z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current plane-animate">
                                    <path d="M190-320L40-570l96-26 112 94 140-37-207-276 116-31 299 251 170-46q32-9 60.5 7.5T864-585q9 32-7.5 60.5T808-487L190-320Z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
                                Travio
                            </h2>
                        </div>
                    </Link>
                </div>

                <div className="w-full flex justify-center mx-auto">
                    <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                        fallbackRedirectUrl="/dashboard"
                        appearance={{
                            layout: {
                                socialButtonsPlacement: 'top',
                                logoPlacement: "none",
                            },
                            elements: {
                                rootBox: "w-full flex justify-center mx-auto",
                                cardBox: "shadow-2xl shadow-slate-200/50 ring-1 ring-slate-900/5 rounded-3xl bg-white w-full",
                                card: "bg-transparent shadow-none w-full border-none px-8 py-10",
                                headerTitle: "text-2xl font-bold font-display text-slate-900 tracking-tight text-center mb-1",
                                headerSubtitle: "text-slate-500 text-sm font-medium text-center",
                                socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl w-full flex items-center justify-center gap-3 transition-colors shadow-sm",
                                formFieldLabel: "text-sm font-semibold text-slate-700 mb-1.5",
                                formFieldInput: "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white",
                                formButtonPrimary: "w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2",
                                formFieldSuccessText: "text-sm text-emerald-600",
                                formFieldErrorText: "text-sm text-red-500",
                                dividerLine: "bg-slate-100",
                                dividerText: "text-sm text-slate-400 font-medium px-4",
                                footerActionText: "text-slate-500 text-sm font-medium",
                                footerActionLink: "text-primary hover:text-blue-700 font-semibold text-sm transition-colors",
                                footerPages: "hidden"
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
