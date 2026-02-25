"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AboutPage() {
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section ref={heroRef} className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <motion.div
                        style={{ y }}
                        className="absolute inset-0 w-full h-[120%] -top-[10%]"
                    >
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: "url('/Factory image/14.jpg')" }}
                        />
                    </motion.div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ opacity }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="text-xs tracking-[0.4em] uppercase text-gray-300 mb-6 block">Our Mission</span>
                        <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
                            Excellence in Hardware
                        </h1>
                        <p className="text-gray-100/90 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto">
                            To set the global benchmark in stainless steel hardware for luxury brands by combining exceptional craftsmanship, cutting-edge engineering, and uncompromising attention to detail.
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"
                    />
                </div>
            </section>

            <div className="container mx-auto px-6 py-24 md:py-32">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-6 block">Our Story</span>
                        <h2 className="text-4xl md:text-6xl font-serif mb-16">About Soocci</h2>

                        <div className="space-y-12 text-lg md:text-xl font-light leading-relaxed text-gray-600">
                            <p>
                                Founded in 2011, Soocci began with a single insight: the luxury industry needed faster, stronger, and more sustainable alternatives to traditional brass hardware.
                            </p>

                            <p>
                                At the time, Italian thick gold-plated brass was the industry’s gold standard—elegant, but expensive and notoriously slow to produce.
                            </p>

                            <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <p className="text-gray-800 font-normal italic border-l-2 border-black pl-8 py-4">
                                    "Inspired by China’s world-class stainless steel watchmaking techniques, founder Simon set out to apply the same precision to luxury metal accessories."
                                </p>
                                <div className="aspect-[4/3] bg-gray-100 overflow-hidden shadow-lg">
                                    <img
                                        src="/Factory image/3-2.jpg"
                                        alt="Precision Metalwork"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <p>
                                After years of focused R&D, Soocci introduced high-grade 316L stainless steel as a smarter, more resilient alternative—without compromising the refined finish that luxury brands demand.
                            </p>

                            <p>
                                In 2015, Montblanc recognized the innovation. After three rounds of sampling and stringent testing, Soocci became a trusted supplier, helping the brand transition from traditional brass to stainless steel hardware.
                            </p>

                            <div className="py-8">
                                <div className="aspect-[21/9] bg-gray-100 overflow-hidden shadow-xl mb-12">
                                    <img
                                        src="/Factory image/5-2.jpg"
                                        alt="Montblanc Collaboration Milestone"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <p>
                                Today, Soocci continues to set the benchmark for stainless steel accessories in the luxury market. With SA8000-certified production, advanced material know-how, and a decade-long focus on performance and aesthetics, Soocci is the partner of choice for luxury brands seeking precision, beauty, and reliable delivery at scale.
                            </p>
                        </div>

                        <div className="mt-24 pt-16 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] tracking-[0.4em] uppercase text-gray-400">
                            <div>Est. 2011</div>
                            <div>SA8000 Certified</div>
                            <div>316L Stainless</div>
                            <div>Global Supplier</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
