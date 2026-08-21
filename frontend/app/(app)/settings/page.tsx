"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, CreditCard, Moon, Palette, Shield, User, Globe, Settings, MapPin } from "lucide-react";
import { Button } from "@frontend/ui/ui/button";
import { Badge } from "@frontend/ui/ui/badge";
import { THUMBNAIL_IMAGE_SIZES, normalizeRemoteImage } from "@shared/media";
import { cn } from "@shared/utils";
import { NotificationBell } from "@frontend/ui/notification-bell";

const SETTING_NAV = [
    { id: "account", label: "Account", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = React.useState("account");
    const isDemoUser = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === "demo@travio.com";

    return (
        <div className="min-h-screen font-inter text-slate-900 pb-20">

            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-[#E5E7EB] h-[72px] flex items-center justify-between px-8">
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-[#1A1A1A] font-medium">Settings</span>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationBell isDemoUser={!!isDemoUser} />
                    <div className="flex items-center border-l border-[#E5E7EB] pl-4">
                        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 ring-1 ring-slate-200 shadow-sm" } }} />
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-10 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1A1A1A] mb-1 tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>Account Settings</h1>
                    <p className="text-sm text-[#6B7280]">Manage your account preferences and personal information.</p>
                </div>

                {/* Settings Horizontal Tabs */}
                <div className="flex bg-slate-100/80 p-1 rounded-xl mb-8 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-inner max-w-fit">
                    {SETTING_NAV.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "px-5 py-2 text-[14px] font-bold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap h-full",
                                    isActive
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Settings Content Area */}
                <div className="space-y-8">
                    {activeTab === "account" && (
                        <>
                            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Personal Information</h2>

                                <div className="flex items-center gap-6 mb-6">
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-full border-4 border-white shadow-md bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                            {user?.imageUrl ? (
                                                <Image src={normalizeRemoteImage(user.imageUrl, 200, 75)} alt="Profile" fill sizes={THUMBNAIL_IMAGE_SIZES} className="object-cover" />
                                            ) : (
                                                <User className="h-10 w-10 text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-[#1A1A1A]">Profile Picture</h3>
                                        <p className="text-xs text-[#6B7280] mt-1 mb-3">Managed via Clerk authenticaton provider.</p>
                                        <div className="flex gap-3">
                                            <Button variant="outline" className="text-sm px-4 py-1.5 bg-[#FAFAFA] text-[#1A1A1A] rounded-md font-medium border border-[#E5E7EB] hover:bg-slate-50 transition-colors h-auto shadow-sm" onClick={() => document.querySelector('.cl-userButtonTrigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
                                                Manage in Clerk
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 border-t border-[#E5E7EB] pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">First Name</label>
                                            <input type="text" disabled value={user?.firstName || "Travio"} className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm text-[#1A1A1A] cursor-not-allowed opacity-80 focus:ring-0 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Last Name</label>
                                            <input type="text" disabled value={user?.lastName || "User"} className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm text-[#1A1A1A] cursor-not-allowed opacity-80 focus:ring-0 focus:outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Email Address</label>
                                        <input type="email" disabled value={user?.primaryEmailAddress?.emailAddress || "user@example.com"} className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm text-[#1A1A1A] cursor-not-allowed opacity-80 focus:ring-0 focus:outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 overflow-hidden">
                                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Connected Accounts</h3>
                                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.01 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[#1A1A1A]">Google</p>
                                            <p className="text-xs text-[#6B7280]">Managed dynamically by Clerk</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-[#E5E7EB]/50 text-[#1A1A1A] font-semibold border-0">Connected</Badge>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "appearance" && (
                        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 overflow-hidden">
                            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Theme Preferences</h3>
                            <p className="text-sm text-[#6B7280] mb-6">Customize the look and feel of your experience.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border-2 border-[#0066FF] rounded-xl p-4 cursor-pointer bg-[#0066FF]/5 flex flex-col items-center gap-3">
                                    <div className="h-20 w-full rounded-lg bg-[#FAFAFA] border border-[#E5E7EB] shadow-sm overflow-hidden flex">
                                        <div className="w-1/4 h-full border-r border-[#E5E7EB] bg-white"></div>
                                        <div className="w-3/4 h-full opacity-50 bg-gradient-to-b from-white to-slate-50"></div>
                                    </div>
                                    <p className="text-sm font-semibold text-[#1A1A1A]">Light Mode (Active)</p>
                                </div>
                                <div className="border border-[#E5E7EB] rounded-xl p-4 cursor-pointer hover:border-slate-300 transition-colors flex flex-col items-center gap-3 opacity-60">
                                    <div className="h-20 w-full rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex">
                                        <div className="w-1/4 h-full border-r border-slate-800 bg-slate-950"></div>
                                        <div className="w-3/4 h-full bg-slate-900"></div>
                                    </div>
                                    <p className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1.5"><Moon className="w-3.5 h-3.5" /> Dark Mode (Coming Soon)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "billing" && (
                        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 overflow-hidden relative">
                            <div className="flex items-center gap-2 mb-3 text-[#0066FF]">
                                <Globe className="h-6 w-6" />
                                <h3 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>Travio Premium</h3>
                            </div>
                            <p className="text-sm text-[#1A1A1A] font-medium mb-1">Current Plan: Explorer (Free)</p>
                            <p className="text-sm text-[#6B7280] mb-6 max-w-md">You are currently using the free tier. Upgrade to unlock limitless travel planning for you and your friends with AI recommendations.</p>

                            <Button className="bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-xl h-10 px-6 text-sm transition-colors shadow-sm">
                                Upgrade to Premium
                            </Button>
                        </div>
                    )}

                    {["notifications", "privacy"].includes(activeTab) && (
                        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm border-dashed p-10 flex flex-col items-center justify-center text-center group cursor-default h-64">
                            <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 shadow-sm">
                                <Settings className="w-5 h-5 text-[#6B7280]" />
                            </div>
                            <h3 className="text-base font-bold text-[#1A1A1A] mb-1">Configuration Unavailable</h3>
                            <p className="text-sm text-[#6B7280] max-w-sm">We are currently fine-tuning these settings for an optimal user experience. Advanced options will unlock shortly.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
