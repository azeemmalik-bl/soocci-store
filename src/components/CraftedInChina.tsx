"use client";

import React from "react";
import { motion } from "framer-motion";

const factoryImages = [
    "/assets/39dac8_0cb38c44d60e44448ef3034b2075ec36~mv2.jpg",
    "/assets/39dac8_262c2b2c7f05415cbbcee9ed53def017~mv2.jpg",
    "/assets/39dac8_72bb363b129a4cd2b63f07a91aceecef~mv2.jpg",
    "/assets/39dac8_7f1c90f7d910431cac9aef3355e55ce1~mv2.jpg",
    "/assets/39dac8_86a4d1d8342b4e4e80339f39c996c420~mv2.jpg",
    "/assets/39dac8_98b528ae73ee450194aaaed8d85efaa0~mv2.jpg",
    "/assets/39dac8_a13ed9feee284e6692f575daaf27c9ff~mv2.jpg",
    "/assets/39dac8_ab943c0804954ff49bac856dbe730a9c~mv2.jpg",
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
                                src="/assets/_MG_7011_JPG.jpg"
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
