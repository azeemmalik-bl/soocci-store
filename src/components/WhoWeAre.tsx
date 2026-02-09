"use client";

import React from "react";
import { motion } from "framer-motion";

const WhoWeAre = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <span className="text-sm tracking-[0.4em] uppercase text-gray-400 mb-4 block">
                        Who We Are
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif mb-12 text-gray-900 leading-tight">
                        Your Trusted Partner in <br /> Premium Metal Hardware
                    </h2>

                    <div className="space-y-8 text-lg text-gray-500 font-light leading-relaxed">
                        <p>
                            Founded in 2011, Soocci is a specialized manufacturer of precision stainless-steel hardware for luxury handbags, belts. With a decade of experience serving globally recognized brands, we combine advanced 316L stainless steel craftsmanship with environmentally responsible practices — including the use of recycled materials — to deliver exceptional, sustainable quality.
                        </p>
                        <p>
                            Our manufacturing facilities are SA8000-certified, and our product range includes high-performance clasps, buckles, locks, and custom hardware solutions. We pride ourselves on European-standard quality, precise engineering, and consistent delivery, making Soocci a long-term manufacturing partner for premium brands worldwide.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WhoWeAre;
