"use client";

import React from "react";
import { motion } from "framer-motion";

const clients = [
    {
        name: "Ferrari",
        logo: "/assets/39dac8_fdec81d2f8694d769bd12aac413025d0~mv2.webp",
    },
    {
        name: "Grace Han",
        logo: "/assets/39dac8_3f887a0287324f3594e11aa1e96482d7~mv2.png",
    },
    {
        name: "Mont Blanc",
        logo: "/assets/39dac8_b3913752626a4d6c879564a119eaccd2~mv2.webp",
    },
    {
        name: "Mulberry",
        logo: "/assets/39dac8_3f4cf66d147c4dae8d6c954e29268f5a~mv2.webp",
    },
    {
        name: "ST Dupont",
        logo: "/assets/39dac8_afba6f40570e40819a8dfbae01406024~mv2.png",
    },
];

const ClientsSection = () => {
    return (
        <section className="py-16 bg-white border-b border-gray-50">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-800">
                        Clients
                    </h2>
                </motion.div>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                    {clients.map((client, index) => (
                        <motion.div
                            key={client.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center justify-center transition-all duration-500 opacity-90 hover:opacity-100"
                        >
                            <img
                                src={client.logo}
                                alt={`${client.name} logo`}
                                className="h-16 md:h-24 w-auto object-contain"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClientsSection;
