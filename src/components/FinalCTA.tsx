"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
    const containerRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gray-50 text-gray-900 py-24"
        >
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
                    <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg md:text-xl font-light leading-relaxed">
                        Whether you’re launching a new collection or upgrading your existing line, Soocci is ready to support your brand with precision-engineered hardware and world-class craftsmanship.
                    </p>
                    <p className="text-gray-500 max-w-3xl mx-auto mb-12 text-base font-light leading-relaxed italic">
                        Connect with our team and discover how we help global luxury houses turn ideas into iconic products.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center space-x-4 bg-transparent border border-black text-black px-10 py-5 uppercase tracking-widest text-xs font-semibold hover:bg-black hover:text-white transition-all duration-300"
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
