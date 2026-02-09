"use client";

import React from "react";
import { motion } from "framer-motion";

const SA8000Section = () => {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <span className="text-sm tracking-[0.4em] uppercase text-gray-400 mb-4 block">
                            Certification
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif mb-8 text-gray-900 leading-tight">
                            SA8000 Factory Certification
                        </h2>
                        <h3 className="text-xl font-light italic mb-8 text-gray-700">
                            Ethical. Transparent. Globally Compliant.
                        </h3>

                        <div className="space-y-6 text-gray-500 font-light leading-relaxed">
                            <p>
                                At Soocci, we don’t just deliver exceptional metal hardware — we do it the right way. Our factory proudly holds SA8000 certification, the international gold standard for ethical working conditions, fair labor practices, and social responsibility.
                            </p>
                            <p>
                                For our clients — including leading luxury brands — this means peace of mind: your supply chain meets the strictest global standards for worker welfare and factory accountability.
                            </p>
                            <p>
                                Backed by over a decade of technical experience and a focus on sustainable 316L stainless steel production, Soocci combines luxury-grade quality with global compliance, making us the trusted manufacturing partner for companies that care about both performance and values.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-1/2 w-full flex justify-center"
                    >
                        <div className="relative max-w-md shadow-2xl bg-white p-4">
                            <img
                                src="/assets/image_2025-05-07_095313450.png"
                                alt="SA8000 Factory Certification"
                                className="w-full h-auto"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SA8000Section;
