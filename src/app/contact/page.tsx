"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to send message");

            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
            console.error(error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    return (
        <div className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-20"
                    >
                        <span className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-4 block">Get In Touch</span>
                        <h1 className="text-5xl md:text-7xl font-serif">Connect With Us</h1>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        {/* Contact Form */}
                        <div>
                            {status === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gray-50 p-12 text-center space-y-6 flex flex-col items-center border border-gray-100"
                                >
                                    <CheckCircle2 size={48} className="text-black" />
                                    <h2 className="text-2xl font-serif uppercase tracking-widest">Message Sent</h2>
                                    <p className="text-gray-500 font-light max-w-sm">
                                        Thank you for reaching out. Simon will review your inquiry and get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-black pb-1 mt-4"
                                    >
                                        Send another
                                    </button>
                                </motion.div>
                            ) : (
                                <form className="space-y-8" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full border-b border-gray-200 py-4 focus:outline-none focus:border-black transition-colors font-light"
                                                placeholder="Jane Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full border-b border-gray-200 py-4 focus:outline-none focus:border-black transition-colors font-light"
                                                placeholder="jane@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Subject</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full border-b border-gray-200 py-4 focus:outline-none focus:border-black transition-colors font-light"
                                            placeholder="Product Inquiry"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Message</label>
                                        <textarea
                                            rows={6}
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full border border-gray-100 p-6 focus:outline-none focus:border-black transition-colors font-light resize-none bg-gray-50"
                                            placeholder="Tell us about your project..."
                                        />
                                    </div>

                                    <button
                                        disabled={status === "submitting"}
                                        className="flex items-center justify-center space-x-3 bg-black text-white px-12 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                                    >
                                        {status === "submitting" ? (
                                            <>
                                                <span>Sending...</span>
                                                <Loader2 size={14} className="animate-spin" />
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <Send size={14} />
                                            </>
                                        )}
                                    </button>

                                    {status === "error" && (
                                        <p className="text-red-500 text-xs tracking-widest uppercase">Failed to send message. Please try again.</p>
                                    )}
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-16">
                            <div className="space-y-12">
                                <div className="flex items-start space-x-6">
                                    <div className="mt-1 text-gray-400"><MapPin size={24} /></div>
                                    <div>
                                        <h3 className="text-xs font-semibold tracking-widest uppercase mb-4">Location</h3>
                                        <p className="text-gray-500 font-light leading-relaxed">
                                            Room 405, Building 1, NO.69, Zhenxing Avenue, 523610,<br />
                                            Xiegang Town, Dongguan City, Guangdong Province, China
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="mt-1 text-gray-400"><Mail size={24} /></div>
                                    <div>
                                        <h3 className="text-xs font-semibold tracking-widest uppercase mb-4">Email</h3>
                                        <p className="text-gray-500 font-light">simon@soocci.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="mt-1 text-gray-400"><Phone size={24} /></div>
                                    <div>
                                        <h3 className="text-xs font-semibold tracking-widest uppercase mb-4">Phone</h3>
                                        <p className="text-gray-500 font-light">+86 13711282288</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
