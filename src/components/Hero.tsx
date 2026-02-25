"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const slides = [
    {
        image: "/Factory image/10.jpg",
        title: "Precision Engineering For Luxury Brands",
        subtitle: "Established 1997",
        description: "We manufacture high-performance 316L stainless steel hardware that redefines excellence in the luxury fashion industry."
    },
    {
        image: "/Factory image/11.jpg",
        title: "Craftsmanship That Lasts a Lifetime",
        subtitle: "Mastery in Metal",
        description: "Our artisans blend traditional techniques with cutting-edge technology to create hardware of unparalleled quality."
    },
    {
        image: "/Factory image/12.jpg",
        title: "Innovative Design Global Excellence",
        subtitle: "Future Ready",
        description: "Partnering with the world's most prestigious fashion houses to push the boundaries of accessories design."
    }
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-[6000ms] scale-110"
                        style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="container mx-auto px-6 relative z-20 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-xs tracking-[0.4em] uppercase mb-6 block">
                            {slides[currentSlide].subtitle}
                        </span>

                        <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-tight">
                            {slides[currentSlide].title.split(" ").map((word, i) => (
                                <span key={i} className="inline-block mr-4 last:mr-0">
                                    {word}
                                    {i === 1 && <br className="hidden md:block" />}
                                </span>
                            ))}
                        </h1>

                        <p className="text-gray-300 max-w-2xl mx-auto mb-12 text-lg font-light leading-relaxed">
                            {slides[currentSlide].description}
                        </p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Link
                                href="/product"
                                className="inline-flex items-center space-x-3 bg-white text-black px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-gray-100 transition-colors"
                            >
                                <span>Explore Collection</span>
                                <ArrowRight size={16} />
                            </Link>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Slider Navigation Dots */}
            <div className="absolute bottom-12 right-12 flex flex-col space-y-4 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="group flex items-center space-x-4 focus:outline-none"
                    >
                        <span className={cn(
                            "text-[10px] uppercase tracking-widest transition-all duration-300 opacity-0 group-hover:opacity-100",
                            currentSlide === index ? "opacity-100 text-white" : "text-gray-400"
                        )}>
                            0{index + 1}
                        </span>
                        <div className={cn(
                            "h-[1px] transition-all duration-300",
                            currentSlide === index ? "w-12 bg-white" : "w-4 bg-white/30 group-hover:bg-white/60"
                        )} />
                    </button>
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent" />
            </div>
        </section>
    );
}
