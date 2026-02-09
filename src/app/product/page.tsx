"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    main_image: string;
}

export default function ProductCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('is_published', true)
                    .order('sort_order', { ascending: true });

                if (error) throw error;
                setCategories(data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    return (
        <div className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6">
                <Breadcrumbs items={[]} />

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4 block">Collections</span>
                        <h1 className="text-5xl font-serif">Product Categories</h1>
                        <p className="mt-6 text-gray-500 font-light leading-relaxed">
                            Explore our extensive range of high-precision stainless steel hardware, engineered
                            for durability and aesthetic perfection.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-gray-300" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((category, idx) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <Link href={`/product/${category.slug}`} className="group block">
                                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-6 relative">
                                        <img
                                            src={category.main_image || "/placeholder-category.jpg"}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-serif tracking-widest uppercase text-center group-hover:text-gray-500 transition-colors">
                                        {category.name}
                                    </h3>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
