"use client";

import Link from "next/link";
import { MessageSquare, Share2, Settings, MoreHorizontal } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@frontend/ui/ui/tooltip";
import { Button } from "@frontend/ui/ui/button";

const TripOptions = [
    {
        icon: <MessageSquare className="h-4 w-4" />,
        tooltip: "Discussion",
        href: (tripId: string) => `/trip/${tripId}?tab=discussion`,
    },
    {
        icon: <Share2 className="h-4 w-4" />,
        tooltip: "Invite",
        href: (tripId: string) => `/trip/${tripId}?tab=members`,
    },
    {
        icon: <Settings className="h-4 w-4" />,
        tooltip: "Settings",
        href: (tripId: string) => `/trip/${tripId}?settings=true`,
    },
];

export function QuickTripOptions({ tripId }: { tripId: string }) {
    return (
        <div className="flex gap-2 justify-center items-center text-slate-700 border bg-white rounded-xl px-2 py-1.5 shadow-lg relative z-50">
            {TripOptions.map((option) => (
                <TripOptionPil
                    key={option.tooltip}
                    icon={option.icon}
                    tooltip={option.tooltip}
                    href={option.href}
                    tripId={tripId}
                />
            ))}
        </div>
    );
}

function TripOptionPil({
    icon,
    tooltip,
    href,
    tripId,
}: {
    icon: React.ReactNode;
    tooltip: string;
    href: (tripId: string) => string;
    tripId: string;
}) {
    return (
        <Link
            href={href(tripId)}
            className="p-1.5 group hover:bg-slate-100 rounded-full cursor-pointer flex flex-col items-center justify-center relative transition-colors"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="text-slate-500 group-hover:text-primary transition-colors">
                {icon}
            </div>
            <p className="text-[10px] uppercase tracking-wider font-bold absolute -top-8 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-900 text-white px-2 py-1 rounded-md text-center shadow-md whitespace-nowrap pointer-events-none translate-y-1 group-hover:translate-y-0">
                {tooltip}
            </p>
        </Link>
    );
}

export const QuickTooltipActions = ({ tripId = "action" }: { tripId?: string }) => {
    return (
        <div className="flex justify-center items-center" onClick={(e) => e.preventDefault()}>
            <TooltipProvider>
                <Tooltip key={tripId} delayDuration={0.2}>
                    <TooltipTrigger asChild>
                        <Button variant="secondary" className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm hover:bg-white border-none text-slate-700 hover:text-primary h-8 w-8" size={"icon"}>
                            <MoreHorizontal className={"size-4"} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        side="left"
                        sideOffset={8}
                        align="center"
                        className="p-0 bg-transparent border-0 shadow-none z-50 overflow-visible"
                    >
                        <QuickTripOptions tripId={tripId} />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};
