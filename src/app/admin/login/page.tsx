"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/admin/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white p-12 shadow-sm border border-gray-100"
            >
                <div className="text-center mb-10">
                    <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 block mb-4">Secure Access</span>
                    <h1 className="text-3xl font-serif uppercase tracking-widest">Administrator</h1>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-500 text-xs tracking-widest uppercase text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-b border-gray-200 py-4 pl-8 focus:outline-none focus:border-black transition-colors font-light"
                                placeholder="admin@soocci.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-b border-gray-200 py-4 pl-8 pr-8 focus:outline-none focus:border-black transition-colors font-light"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-black text-white py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                    <p className="text-[8px] text-gray-300 uppercase tracking-[0.4em]">
                        Authorized Personnel Only
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
