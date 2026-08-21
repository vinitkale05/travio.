"use client";

import { cn } from "@shared/utils";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Send, MoreHorizontal, MessageSquareMore } from "lucide-react";

function TravioLogo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center justify-center relative overflow-hidden h-8 w-8 shrink-0 group/logo", className)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current">
                <path d="M120-120v-80h720v80H120Z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute w-8 h-8 fill-current group-hover/logo:animate-[planeTakeoffAndLand_2.5s_ease-in-out_infinite]">
                <path d="M190-320L40-570l96-26 112 94 140-37-207-276 116-31 299 251 170-46q32-9 60.5 7.5T864-585q9 32-7.5 60.5T808-487L190-320Z" />
            </svg>
        </div>
    );
}

export interface Character {
    id?: string | number;
    name: string;
    avatar: string;
    online: boolean;
    backgroundColor?: string;
    isPremium?: boolean;
}

export interface MessageDockProps {
    characters?: Character[];
    onMessageSend?: (message: string, character: Character, characterIndex: number) => void;
    onCharacterSelect?: (character: Character, characterIndex: number) => void;
    onDockToggle?: (isExpanded: boolean) => void;
    className?: string;
    expandedWidth?: number;
    position?: "bottom" | "top";
    showSparkleButton?: boolean;
    showMenuButton?: boolean;
    enableAnimations?: boolean;
    animationDuration?: number;
    placeholder?: (characterName: string) => string;
    theme?: "light" | "dark" | "auto";
    autoFocus?: boolean;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    closeOnSend?: boolean;
}

const defaultCharacters: Character[] = [
    { id: "1", name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", online: true, isPremium: true },
    { id: "2", name: "Alex", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", online: true },
    { id: "3", name: "Mariana", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", online: true, isPremium: true },
    { id: "4", name: "Liam", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200", online: false },
    { id: "5", name: "James", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", online: true },
];

export function MessageDock({
    characters = defaultCharacters,
    onMessageSend,
    onCharacterSelect,
    onDockToggle,
    className,
    expandedWidth = 400,
    position = "bottom",
    showSparkleButton = true,
    showMenuButton = true,
    enableAnimations = true,
    animationDuration = 1,
    placeholder = (name: string) => `Message ${name}...`,
    theme = "light",
    autoFocus = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    closeOnSend = true,
}: MessageDockProps) {
    const shouldReduceMotion = useReducedMotion();
    const [expandedCharacter, setExpandedCharacter] = useState<number | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const dockRef = useRef<HTMLDivElement>(null);
    const [collapsedWidth, setCollapsedWidth] = useState<number>(310); // Slightly wider for logo
    const [hasInitialized, setHasInitialized] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        if (dockRef.current && !hasInitialized) {
            const width = dockRef.current.offsetWidth;
            if (width > 0) {
                setCollapsedWidth(width);
                setHasInitialized(true);
            }
        }
    }, [hasInitialized]);

    useEffect(() => {
        if (!closeOnClickOutside) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
                setExpandedCharacter(null);
                setMessageInput("");
                onDockToggle?.(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeOnClickOutside, onDockToggle]);

    const containerVariants = {
        hidden: { opacity: 0, y: 100, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30,
                mass: 0.8,
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const handleCharacterClick = (index: number) => {
        const character = characters[index];
        if (expandedCharacter === index) {
            setExpandedCharacter(null);
            setMessageInput("");
            onDockToggle?.(false);
        } else {
            setExpandedCharacter(index);
            onCharacterSelect?.(character, index);
            onDockToggle?.(true);
        }
    };

    const handleSendMessage = () => {
        if (messageInput.trim() && expandedCharacter !== null) {
            const character = characters[expandedCharacter];
            onMessageSend?.(messageInput, character, expandedCharacter);
            setMessageInput("");
            if (closeOnSend) {
                setExpandedCharacter(null);
                onDockToggle?.(false);
            }
        }
    };

    const selectedCharacter = expandedCharacter !== null ? characters[expandedCharacter] : null;
    const isExpanded = expandedCharacter !== null;

    const positionClasses = position === "top"
        ? "absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4"
        : "absolute bottom-10 left-1/2 -translate-x-1/2 z-50 px-4";

    return (
        <motion.div
            ref={dockRef}
            className={cn(positionClasses, className)}
            initial={enableAnimations ? "hidden" : "visible"}
            animate="visible"
            variants={enableAnimations ? containerVariants : {}}
        >
            <motion.div
                className="rounded-full px-4 py-1.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] border border-slate-200/60 backdrop-blur-md flex items-center"
                animate={{
                    width: isExpanded ? expandedWidth : "auto",
                    background: isExpanded ? "#1A1A1A" : "rgba(255, 255, 255, 0.95)",
                }}
                transition={enableAnimations ? {
                    type: "spring" as const,
                    stiffness: isExpanded ? 300 : 500,
                    damping: isExpanded ? 30 : 35,
                    mass: isExpanded ? 0.8 : 0.6,
                } : { duration: 0 }}
            >
                <div className="flex items-center gap-2.5 relative h-11 w-full text-slate-900">
                    {/* Messaging Entry Point */}
                    {!isExpanded && (
                        <div className="flex items-center gap-2 pr-3 border-r border-slate-200/60 ml-1">
                            <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <MessageSquareMore className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col -space-y-0.5 pointer-events-none">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#0066FF]">Travio</span>
                            </div>
                        </div>
                    )}

                    {/* Character buttons */}
                    <div className="flex items-center gap-1.5 flex-1 justify-center">
                        {characters.map((character, index) => {
                            const isSelected = expandedCharacter === index;

                            return (
                                <motion.div
                                    key={character.id || character.name}
                                    className={cn(
                                        "relative flex items-center justify-center",
                                        isSelected && isExpanded && "z-20"
                                    )}
                                    animate={{
                                        opacity: isExpanded && !isSelected ? 0 : 1,
                                        scale: isExpanded && !isSelected ? 0 : 1,
                                        width: isExpanded && !isSelected ? 0 : "auto",
                                        marginRight: isExpanded && !isSelected ? 0 : 4,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 35,
                                    }}
                                >
                                    <motion.button
                                        className={cn(
                                            "relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border border-slate-200/80 shadow-sm transition-all bg-white",
                                            isSelected && isExpanded ? "ring-2 ring-[#0066FF] border-transparent" : "hover:border-slate-400 group"
                                        )}
                                        onClick={() => handleCharacterClick(index)}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        whileHover={!isExpanded ? { y: -3, scale: 1.05 } : { scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    >
                                        <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                                    </motion.button>

                                    {/* PREMIUM NAME LABEL ABOVE AVATAR */}
                                    <AnimatePresence>
                                        {!isExpanded && hoveredIndex === index && (
                                            <motion.div
                                                className="absolute -top-11 left-1/2 -translate-x-1/2 pointer-events-none z-50 whitespace-nowrap"
                                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 30,
                                                    mass: 0.8
                                                }}
                                            >
                                                <div className="px-2.5 py-1 bg-[#1A1A1A] text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10 shadow-2xl flex items-center gap-2">
                                                    {character.name}
                                                </div>
                                                <div className="w-2 h-2 bg-[#1A1A1A] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}

                        {/* Text input - Integrated naturally into Flex flow */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSendMessage();
                                        if (e.key === "Escape" && closeOnEscape) {
                                            setExpandedCharacter(null);
                                            setMessageInput("");
                                            onDockToggle?.(false);
                                        }
                                    }}
                                    placeholder={placeholder(selectedCharacter?.name || "")}
                                    className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-white placeholder-slate-500 z-50 px-3 min-w-[150px]"
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                    autoFocus={autoFocus}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0, transition: { delay: 0.15 } }}
                                    exit={{ opacity: 0, x: -5 }}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Menu / Send button */}
                    <motion.div className="flex items-center justify-center z-20">
                        <AnimatePresence mode="wait">
                            {!isExpanded ? (
                                <motion.button
                                    key="menu"
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="send"
                                    onClick={handleSendMessage}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0066FF] text-white hover:bg-[#0052CC] transition-all disabled:opacity-30 relative z-30 shadow-lg active:scale-90"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={!messageInput.trim()}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
