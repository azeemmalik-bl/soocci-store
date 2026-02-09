"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        categories: 0,
        products: 0,
        newCategories: 0,
        newProducts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            try {
                const [cats, prods, newCats, newProds] = await Promise.all([
                    supabase.from("categories").select("*", { count: "exact", head: true }),
                    supabase.from("products").select("*", { count: "exact", head: true }),
                    supabase.from("categories").select("*", { count: "exact", head: true }).gte("created_at", firstDayOfMonth),
                    supabase.from("products").select("*", { count: "exact", head: true }).gte("created_at", firstDayOfMonth),
                ]);

                setStats({
                    categories: cats.count || 0,
                    products: prods.count || 0,
                    newCategories: newCats.count || 0,
                    newProducts: newProds.count || 0
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const dashboardStats = [
        { label: "Total Categories", value: stats.categories, change: `+${stats.newCategories} this month` },
        { label: "Total Products", value: stats.products, change: `+${stats.newProducts} this month` },
        { label: "Pending Inquiries", value: "0", change: "Synced via Email" },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-12">
                <span className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-4 block">Overview</span>
                <h1 className="text-4xl font-serif">Dashboard</h1>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-300" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {dashboardStats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 border border-gray-100 shadow-sm"
                        >
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">{stat.label}</p>
                            <p className="text-4xl font-serif mb-2">{stat.value}</p>
                            <p className="text-[10px] uppercase tracking-widest text-green-500">{stat.change}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 border border-gray-100 min-h-[400px]">
                    <h2 className="text-xs font-semibold tracking-widest uppercase mb-8 pb-4 border-b border-gray-50">Recent Activity</h2>
                    <div className="text-center py-20 text-gray-400 text-xs uppercase tracking-widest">
                        {stats.newProducts > 0 || stats.newCategories > 0
                            ? `${stats.newProducts + stats.newCategories} updates this month`
                            : "No recent updates to catalog."}
                    </div>
                </div>
                <div className="bg-white p-8 border border-gray-100 min-h-[400px]">
                    <h2 className="text-xs font-semibold tracking-widest uppercase mb-8 pb-4 border-b border-gray-50">System Status</h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                            <span className="text-gray-400">Database</span>
                            <span className="text-green-500 font-bold">Connected</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                            <span className="text-gray-400">Storage</span>
                            <span className="text-green-500 font-bold">Connected</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                            <span className="text-gray-400">Auth Service</span>
                            <span className="text-green-500 font-bold">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
