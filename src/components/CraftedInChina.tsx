"use client";

import React from "react";
import { motion } from "framer-motion";

const factoryImages = [
    "/Factory image/1.jpg",
    "/Factory image/2.jpg",
    "/Factory image/3-1.jpg",
    "/Factory image/4.jpg",
    "/Factory image/5-1.jpg",
    "/Factory image/6.jpg",
    "/Factory image/7.jpg",
    "/Factory image/8.jpg",
];

const CraftedInChina = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden shadow-xl">
                            <img
                                src="/Factory image/9.jpg"
                                alt="Luxury Hardware Detail"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-3xl md:text-5xl font-serif mb-8 text-gray-900 leading-tight">
                            Crafted in China, <br /> Trusted by Luxury Brands
                        </h2>
                        <div className="space-y-6 text-gray-500 font-light leading-relaxed">
                            <p>
                                For over a decade, Soocci has been quietly redefining what “Made in China” means — combining European luxury standards with the precision and scale of advanced Chinese manufacturing.
                            </p>
                            <p>
                                Specializing in custom stainless steel components, we are a trusted partner for international brands seeking exceptional quality, flawless finishes, and sustainable materials. Our factory is SA8000 certified, our production is rooted in 316L marine-grade stainless steel, and our commitment to ethical labor and environmental standards is uncompromising.
                            </p>
                            <p>
                                From locking clasps to dog hooks and tailored fittings, every piece we produce carries the Soocci hallmark: precision-engineered, beautifully finished, and ready to elevate your product.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {factoryImages.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="aspect-square overflow-hidden grayscale hover:grayscale-0 transition-all duration-700"
                        >
                            <img
                                src={img}
                                alt={`Factory Operation ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CraftedInChina;
