"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white py-24"
        >
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 w-full h-[120%] -top-[10%]"
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: "url('/Factory image/13.jpg')" }}
                    />
                </motion.div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
                        Let’s Build Something <br /> Exceptional Together
                    </h2>
                    <p className="text-gray-200 max-w-2xl mx-auto mb-12 text-lg md:text-xl font-light leading-relaxed">
                        Whether you’re launching a new collection or upgrading your existing line, Soocci is ready to support your brand with precision-engineered hardware and world-class craftsmanship.
                    </p>
                    <p className="text-gray-300 max-w-3xl mx-auto mb-12 text-base font-light leading-relaxed italic">
                        Connect with our team and discover how we help global luxury houses turn ideas into iconic products.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center space-x-4 bg-transparent border border-white text-white px-10 py-5 uppercase tracking-widest text-xs font-semibold hover:bg-white hover:text-black transition-all duration-300"
                    >
                        <span>Get Started</span>
                        <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
