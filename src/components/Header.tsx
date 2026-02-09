"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Product", href: "/product" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    if (pathname.includes("/admin")) return null;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-white/80 backdrop-blur-md py-4 border-gray-200"
                    : "bg-transparent py-6 border-transparent"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className={cn(
                        "text-2xl font-serif tracking-widest uppercase font-semibold transition-colors duration-300",
                        !isScrolled && (pathname === "/" || pathname === "/about") ? "text-white" : "text-black"
                    )}>
                        SOOCCI
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "text-sm tracking-[0.2em] uppercase transition-colors duration-300",
                                !isScrolled && (pathname === "/" || pathname === "/about")
                                    ? pathname === item.href
                                        ? "text-white font-semibold"
                                        : "text-white/70 hover:text-white"
                                    : pathname === item.href
                                        ? "text-black font-semibold"
                                        : "text-gray-600 hover:text-black"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className={cn(
                        "md:hidden transition-colors duration-300",
                        !isScrolled && (pathname === "/" || pathname === "/about") && !isMobileMenuOpen ? "text-white" : "text-black"
                    )}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col space-y-4 p-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "text-lg tracking-widest uppercase",
                                        pathname === item.href ? "text-black" : "text-gray-500"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
