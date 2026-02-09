"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const pathname = usePathname();

    if (pathname.includes("/admin")) return null;

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("submitting");
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus("idle"), 5000);
        } catch (err) {
            setStatus("error");
            setErrorMsg((err as Error).message);
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    return (
        <footer className="bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-20">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-serif tracking-widest uppercase mb-10">SOOCCI</h2>
                        <div className="space-y-6 text-sm text-gray-400 font-light leading-relaxed">
                            <p>
                                <span className="text-gray-200 block mb-1">Address:</span>
                                Room 405, Building 1, Virtue industrial park, Dongguan city, China
                            </p>
                            <p>
                                <span className="text-gray-200 block mb-1">Inquiry:</span>
                                <a href="mailto:simon@soocci.com" className="hover:text-white transition-colors">simon@soocci.com</a>
                            </p>
                            <p>
                                <span className="text-gray-200 block mb-1">Tel/Whatsapp:</span>
                                <a href="tel:+8613711282288" className="hover:text-white transition-colors">+86 13711282288</a>
                            </p>
                        </div>
                    </div>

                    {/* Menu */}
                    <div>
                        <h2 className="text-sm font-semibold tracking-widest uppercase mb-10 text-gray-300">Menu</h2>
                        <ul className="grid grid-cols-1 gap-4 text-sm text-gray-400 font-light">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/product" className="hover:text-white transition-colors">Product</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h2 className="text-sm font-semibold tracking-widest uppercase mb-10 text-gray-300">Newsletter</h2>
                        {status === "success" ? (
                            <div className="bg-gray-900 p-8 border border-gray-800 text-center space-y-4">
                                <CheckCircle2 size={32} className="mx-auto text-white" />
                                <p className="text-xs uppercase tracking-widest text-gray-300">Subscribed!</p>
                                <p className="text-[10px] text-gray-500 font-light">Thank you for joining our newsletter.</p>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubscribe}>
                                <div className="relative">
                                    <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-transparent border border-gray-800 p-4 text-sm focus:border-white outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input type="checkbox" required id="subscribe" className="bg-transparent border-gray-800" />
                                    <label htmlFor="subscribe" className="text-xs text-gray-500 font-light">
                                        Yes, subscribe me to your newsletter.
                                    </label>
                                </div>
                                <button
                                    disabled={status === "submitting"}
                                    className="w-full bg-white text-black py-4 text-xs font-semibold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                >
                                    {status === "submitting" ? (
                                        <>
                                            <span>Submitting...</span>
                                            <Loader2 size={12} className="animate-spin" />
                                        </>
                                    ) : (
                                        <span>Submit</span>
                                    )}
                                </button>
                                {status === "error" && (
                                    <p className="text-red-500 text-[10px] uppercase tracking-widest text-center">{errorMsg || "Error, try again."}</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>


                <div className="border-t border-gray-900 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 tracking-[0.3em] uppercase">
                    <p>© {new Date().getFullYear()} SOOCCI LIMITED. ALL RIGHTS RESERVED.</p>
                    <div className="mt-8 md:mt-0 flex space-x-8">
                        <span>ISO 9001:2015</span>
                        <span>SA8000 CERTIFIED</span>
                        <span>316L STAINLESS STEEL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
