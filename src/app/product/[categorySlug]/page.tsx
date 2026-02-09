"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface Product {
    id: string;
    title: string;
    slug: string;
    images: string[];
    sku: string;
}

export default function CategoryProductsPage() {
    const params = useParams();
    const categorySlug = params.categorySlug as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategoryAndProducts() {
            try {
                console.log("Fetching for Category Slug:", categorySlug);

                // 1. Fetch category details (no .single() to avoid connection resets/errors)
                const { data: categories, error: catError } = await supabase
                    .from('categories')
                    .select('id, name')
                    .eq('slug', categorySlug)
                    .eq('is_published', true);

                if (catError) {
                    console.error("Supabase Category Error:", catError);
                    throw catError;
                }

                if (!categories || categories.length === 0) {
                    console.warn("No published category found for slug:", categorySlug);
                    setLoading(false);
                    return;
                }

                const catData = categories[0];
                setCategoryName(catData.name);

                // 2. Fetch products for this category
                const { data: prodData, error: prodError } = await supabase
                    .from('products')
                    .select('id, title, slug, images, sku')
                    .eq('category_id', catData.id)
                    .eq('is_published', true);

                if (prodError) {
                    console.error("Supabase Products Error:", prodError);
                    throw prodError;
                }

                setProducts(prodData || []);
            } catch (error: any) {
                console.error("Detailed Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        }

        if (categorySlug) {
            fetchCategoryAndProducts();
        }
    }, [categorySlug]);

    return (
        <div className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6">
                <Breadcrumbs items={[{ name: categoryName || categorySlug, href: `/product/${categorySlug}` }]} />

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4 block">Collection</span>
                        <h1 className="text-5xl font-serif">{categoryName || 'Loading...'}</h1>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-gray-300" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16">
                        {products.length > 0 ? (
                            products.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <Link href={`/product/${categorySlug}/${product.slug}`} className="group block">
                                        <div className="aspect-square bg-gray-50 overflow-hidden mb-6 relative">
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-2">{product.sku}</p>
                                            <h3 className="text-sm tracking-widest uppercase group-hover:text-gray-500 transition-colors">
                                                {product.title}
                                            </h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-gray-400 font-light">
                                No products found in this category.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
