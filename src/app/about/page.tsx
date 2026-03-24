"use client";

import Image from "next/image";
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
                        <Image
                            src="/Factory image/14.jpg"
                            alt="Factory Interior"
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
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

            {/* About Content */}
            <div className="container mx-auto px-6 py-24 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-6 block text-center">About Us</span>
                    <h2 className="text-4xl md:text-6xl font-serif mb-16 text-center text-gray-900 leading-tight">
                        DongGuan SOOCCI Accessories Ltd
                    </h2>

                    <div className="space-y-12 text-lg md:text-xl font-light leading-relaxed text-gray-600">
                        <p>
                            Founded in 2011, SOOCCI is a professional manufacturer specializing in high-end metal hardware
                            for luxury leather goods. The company is located at Room 405, Building 10, No.69 Zhenxing
                            Avenue, Xiegang Town, Dongguan City, Guangdong Province, China (523000), with a factory area
                            of approximately 4,000 m² and a team of 60+ skilled employees.
                        </p>
                        <p>
                            SOOCCI operates with a fully integrated in-house manufacturing system, covering the entire
                            process from technical drawing and product design, mold making, CNC programming, forming
                            and machining, polishing, assembly, to final quality inspection. With its own design &amp; R&amp;D team
                            and CNC programming team, SOOCCI ensures high precision, stable quality, and efficient project
                            execution.
                        </p>
                        <p>
                            The company is a long-term and stable supplier to multiple international luxury brands, including
                            Ferrari, Grace Han, Montblanc, Mulberry, and S.T. Dupont. SOOCCI produces a wide range of
                            leather-goods hardware, such as bag accessories, belt buckles, and functional metal
                            components.
                        </p>
                        <p>
                            Focusing primarily on 316L stainless steel sheet material, SOOCCI has deep expertise in premium
                            stainless-steel hardware solutions. The company operates under internationally recognized
                            management and compliance systems, including SA8000, ensuring consistent quality, responsible
                            manufacturing, and long-term reliability for global luxury partners.
                        </p>
                    </div>

                    <div className="mt-24 pt-16 border-t border-gray-100 flex flex-wrap justify-between gap-8 text-[10px] tracking-[0.4em] uppercase text-gray-400 items-center">
                        <div>Est. 2011</div>
                        <div>SA8000 Certified</div>
                        <div>316L Stainless</div>
                        <div>60+ Employees</div>
                        <div>Dongguan, China</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
