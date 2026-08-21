// frontend/ui/expandable-chat.tsx
"use client";

import React, { useRef, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { cn } from "@shared/utils";
import { Button } from "@frontend/ui/ui/button";

export type ChatPosition = "bottom-right" | "bottom-left" | "center";
export type ChatSize = "sm" | "md" | "lg" | "xl" | "full";

const chatConfig = {
    dimensions: {
        sm: "sm:max-w-sm sm:max-h-[500px]",
        md: "sm:max-w-md sm:max-h-[600px]",
        lg: "sm:max-w-2xl sm:max-h-[650px]", // Tweaked for Travio Premium Feel
        xl: "sm:max-w-xl sm:max-h-[800px]",
        full: "sm:w-full sm:h-full",
    },
    positions: {
        "bottom-right": "fixed bottom-12 right-12",
        "bottom-left": "fixed bottom-12 left-12",
        "center": "relative", // For the ChatPage centered mode
    },
    chatPositions: {
        "bottom-right": "sm:bottom-[calc(100%+10px)] sm:right-0",
        "bottom-left": "sm:bottom-[calc(100%+10px)] sm:left-0",
        "center": "",
    },
    states: {
        open: "pointer-events-auto opacity-100 visible scale-100 translate-y-0",
        closed: "pointer-events-none opacity-0 invisible scale-95 translate-y-8",
    },
};

interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
    position?: ChatPosition;
    size?: ChatSize;
    icon?: React.ReactNode;
    isOpen?: boolean;
}

const ExpandableChat: React.FC<ExpandableChatProps> = ({
    className,
    position = "center",
    size = "lg",
    icon,
    isOpen: propsIsOpen,
    children,
    ...props
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = propsIsOpen ?? internalIsOpen;
    const chatRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => setInternalIsOpen(!isOpen);

    return (
        <div
            className={cn(
                position !== "center" && `z-50 ${chatConfig.positions[position]}`,
                className
            )}
            {...props}
        >
            <div
                ref={chatRef}
                className={cn(
                    "flex flex-col bg-white/95 backdrop-blur-3xl border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    position !== "center" ? "absolute sm:w-[90vw] sm:h-[80vh] w-full h-full" : "w-full h-full",
                    position !== "center" && chatConfig.chatPositions[position],
                    chatConfig.dimensions[size],
                    isOpen ? chatConfig.states.open : chatConfig.states.closed,
                    className,
                )}
            >
                {children}
            </div>
            {position !== "center" && (
                <ExpandableChatToggle
                    icon={icon}
                    isOpen={isOpen}
                    toggleChat={toggleChat}
                />
            )}
        </div>
    );
};

ExpandableChat.displayName = "ExpandableChat";

const ExpandableChatHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div
        className={cn("flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/40 backdrop-blur-md relative z-20", className)}
        {...props}
    />
);

ExpandableChatHeader.displayName = "ExpandableChatHeader";

const ExpandableChatBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => <div className={cn("flex-grow overflow-hidden flex flex-col relative", className)} {...props} />;

ExpandableChatBody.displayName = "ExpandableChatBody";

const ExpandableChatFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => <div className={cn("border-t border-slate-50 bg-white/40 backdrop-blur-md p-6 relative z-20", className)} {...props} />;

ExpandableChatFooter.displayName = "ExpandableChatFooter";

interface ExpandableChatToggleProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    isOpen: boolean;
    toggleChat: () => void;
}

const ExpandableChatToggle: React.FC<ExpandableChatToggleProps> = ({
    className,
    icon,
    isOpen,
    toggleChat,
    ...props
}) => (
    <Button
        variant="default"
        onClick={toggleChat}
        className={cn(
            "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center bg-[#1A1A1A] hover:bg-[#000] text-white hover:scale-110 active:scale-95 transition-all duration-500 ring-4 ring-white/10",
            className,
        )}
        {...props}
    >
        {isOpen ? (
            <X className="h-7 w-7" />
        ) : (
            icon || <MessageCircle className="h-7 w-7 fill-current" />
        )}
    </Button>
);

ExpandableChatToggle.displayName = "ExpandableChatToggle";

export {
    ExpandableChat,
    ExpandableChatHeader,
    ExpandableChatBody,
    ExpandableChatFooter,
};
