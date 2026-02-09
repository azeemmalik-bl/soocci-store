"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowRight, Box, ShieldCheck, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ProductData {
    id: string;
    title: string;
    sku: string;
    material: string;
    description: string;
    images: string[];
    technical_specs: string; // JSON string or text we'll parse
    categories: {
        name: string;
        slug: string;
    };
}

export default function ProductDetailPage() {
    const params = useParams();
    const productSlug = params.productSlug as string;
    const categorySlug = params.categorySlug as string;

    const [product, setProduct] = useState<ProductData | null>(null);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, categories(name, slug)')
                    .eq('slug', productSlug)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        }

        if (productSlug) {
            fetchProduct();
        }
    }, [productSlug]);

    if (loading) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-300" size={48} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-32 pb-24 min-h-screen text-center">
                <h1 className="text-2xl font-serif">Product Not Found</h1>
                <Link href="/product" className="mt-4 text-xs uppercase tracking-widest border-b border-black">Back to Collections</Link>
            </div>
        );
    }

    // Parse specs if they are stored as JSON string, otherwise use default
    let specs = [];
    try {
        specs = JSON.parse(product.technical_specs);
    } catch (e) {
        // Fallback or use a split technique if they are comma separated
        specs = [
            { label: "Material", value: product.material },
            { label: "SKU", value: product.sku },
        ];
    }

    return (
        <div className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6">
                <Breadcrumbs
                    items={[
                        { name: product.categories.name, href: `/product/${product.categories.slug}` },
                        { name: product.title, href: "#" }
                    ]}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Gallery */}
                    <div className="lg:col-span-7 space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="aspect-square bg-gray-50 overflow-hidden relative"
                        >
                            <img
                                src={product.images[activeImage]}
                                alt={product.title}
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`aspect-square bg-gray-50 overflow-hidden border-2 transition-all ${activeImage === idx ? "border-black" : "border-transparent opacity-60"
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <span className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-4 block">Premium Hardware</span>
                        <h1 className="text-4xl md:text-5xl font-serif mb-2 leading-tight">{product.title}</h1>
                        <p className="text-sm tracking-widest text-gray-500 mb-8">{product.sku}</p>

                        <div className="space-y-8 mb-12">
                            <div>
                                <h3 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Description</h3>
                                <p className="text-gray-600 font-light leading-relaxed">{product.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 border-t border-b border-gray-100 py-6">
                                {specs.map((spec: any) => (
                                    <div key={spec.label}>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{spec.label}</p>
                                        <p className="text-sm font-medium">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Link
                                href="/contact"
                                className="flex items-center justify-center space-x-3 bg-black text-white px-8 py-5 uppercase tracking-widest text-xs font-semibold hover:bg-gray-800 transition-colors w-full"
                            >
                                <span>Inquire Now</span>
                                <ArrowRight size={16} />
                            </Link>

                            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 opacity-40">
                                <div className="flex flex-col items-center text-center">
                                    <ShieldCheck size={20} className="mb-2" />
                                    <span className="text-[8px] uppercase tracking-widest">Lifetime Warranty</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <Box size={20} className="mb-2" />
                                    <span className="text-[8px] uppercase tracking-widest">Customizable</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <Zap size={20} className="mb-2" />
                                    <span className="text-[8px] uppercase tracking-widest">Fast Prototype</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
