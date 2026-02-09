"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Category, Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Upload, Loader2, Image as ImageIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState("");

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, images: string[] } | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [sku, setSku] = useState("");
    const [material, setMaterial] = useState("316L Stainless Steel");
    const [description, setDescription] = useState("");
    const [technicalSpecs, setTechnicalSpecs] = useState("");
    const [isPublished, setIsPublished] = useState(true);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const [cats, prods] = await Promise.all([
            supabase.from("categories").select("*").order("sort_order", { ascending: true }),
            supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false })
        ]);

        if (cats.data) setCategories(cats.data);
        if (prods.data) setProducts(prods.data as any);
        setLoading(false);
    };

    const handleOpenModal = (product: any | null = null) => {
        if (product) {
            setEditingProduct(product);
            setTitle(product.title);
            setSlug(product.slug);
            setCategoryId(product.category_id);
            setSku(product.sku);
            setMaterial(product.material);
            setDescription(product.description);
            setTechnicalSpecs(product.technical_specs || "");
            setIsPublished(product.is_published ?? true);
            setImagePreviews(product.images);
        } else {
            setEditingProduct(null);
            setTitle("");
            setSlug("");
            setCategoryId(categories[0]?.id || "");
            setSku("");
            setMaterial("316L Stainless Steel");
            setDescription("");
            setTechnicalSpecs("");
            setIsPublished(true);
            setImagePreviews([]);
        }
        setImageFiles([]);
        setIsModalOpen(true);
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setImageFiles([...imageFiles, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        let finalImageUrls = [...imagePreviews.filter(url => !url.startsWith('data:'))];

        // Upload new files
        for (const file of imageFiles) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                alert("Error uploading image: " + uploadError.message);
                setSubmitting(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);
            finalImageUrls.push(publicUrl);
        }

        const productData: any = {
            title,
            slug,
            category_id: categoryId,
            sku,
            material,
            description,
            is_published: isPublished,
            technical_specs: technicalSpecs,
            images: finalImageUrls,
        };

        if (!categoryId) {
            alert("Please create and select a category first.");
            setSubmitting(false);
            return;
        }

        if (editingProduct) {
            const { error } = await supabase
                .from("products")
                .update(productData)
                .eq("id", editingProduct.id);
            if (error) {
                console.error("Product Update Error:", error);
                alert("Database Error: " + error.message + "\nDetails: " + (error.details || 'None'));
            }
        } else {
            const { error } = await supabase
                .from("products")
                .insert([productData]);
            if (error) {
                console.error("Product Insert Error:", error);
                alert("Database Error: " + error.message + "\nDetails: " + (error.details || 'None'));
            }
        }

        setSubmitting(false);
        setIsModalOpen(false);
        fetchInitialData();
    };

    const handleDelete = (id: string, images: string[] = []) => {
        setItemToDelete({ id, images });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        const { id, images } = itemToDelete;
        // Confirmation is now handled in the UI button handler for better UX
        try {
            // 1. Delete associated images from storage
            // Fetch fresh data if needed, but we pass images usually
            let targetImages = images;
            if (targetImages.length === 0) {
                const { data } = await supabase.from('products').select('images').eq('id', id).single();
                if (data && data.images) targetImages = data.images;
            }

            const pathsToDelete: string[] = [];
            targetImages.forEach(url => {
                if (url.includes('supabase.co')) {
                    const path = url.split('/images/')[1];
                    if (path) pathsToDelete.push(path);
                }
            });

            if (pathsToDelete.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from('images')
                    .remove(pathsToDelete);

                if (storageError) console.error("Error deleting images:", storageError);
            }

            // 2. Delete the database record
            const { error } = await supabase.from("products").delete().eq("id", id);

            if (error) {
                console.error("Delete Error:", error);
                alert("Failed to delete product: " + error.message);
            } else {
                fetchInitialData();
            }
        } catch (err) {
            console.error("Unexpected error during product delete:", err);
            alert("An unexpected error occurred.");
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <span className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-4 block">Inventory</span>
                    <h1 className="text-4xl font-serif">Products</h1>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input
                            type="text"
                            placeholder="SEARCH CATALOG"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-b border-gray-200 py-3 pl-8 focus:outline-none focus:border-black transition-colors text-[10px] tracking-widest uppercase"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-black text-white px-8 py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                        <Plus size={14} />
                        <span>New Product</span>
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            ) : (
                <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 uppercase text-[8px] tracking-[0.3em] font-bold text-gray-400">
                            <tr>
                                <th className="px-8 py-4">Product</th>
                                <th className="px-8 py-4">SKU</th>
                                <th className="px-8 py-4">Category</th>
                                <th className="px-8 py-4">Material</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product: any) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <img src={product.images[0]} className="w-12 h-12 object-cover bg-gray-100" />
                                            <span className="text-xs tracking-widest uppercase font-medium">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs text-gray-400">{product.sku}</td>
                                    <td className="px-8 py-6 text-xs text-gray-400 uppercase tracking-widest">{(product as any).categories?.name}</td>
                                    <td className="px-8 py-6 text-xs text-gray-400">{product.material}</td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "text-[8px] px-2 py-1 uppercase tracking-widest border",
                                            product.is_published ? "border-green-200 text-green-600 bg-green-50" : "border-gray-200 text-gray-400 bg-gray-50"
                                        )}>
                                            {product.is_published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-black">
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDelete(product.id, product.images);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer relative z-50"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal - Same luxury styling as Categories */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-white p-12 shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh]">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black"><X size={24} /></button>
                            <h2 className="text-2xl font-serif uppercase tracking-widest mb-10">{editingProduct ? "Edit Product" : "New Product"}</h2>

                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Title</label>
                                            <input required value={title} onChange={(e) => {
                                                setTitle(e.target.value);
                                                if (!editingProduct) setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                                            }} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors font-light text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">SKU</label>
                                                <input required value={sku} onChange={(e) => setSku(e.target.value)} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors font-light text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Category</label>
                                                <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors font-light text-sm bg-transparent">
                                                    <option value="" disabled>Select a category</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                                {categories.length === 0 && (
                                                    <p className="text-[8px] text-red-500 uppercase tracking-widest mt-1">No categories found. Create one first!</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Description</label>
                                            <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-50 p-4 focus:outline-none focus:border-black transition-colors font-light text-sm bg-gray-50" />
                                        </div>

                                        <div className="flex items-center space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsPublished(!isPublished)}
                                                className={cn(
                                                    "w-10 h-5 rounded-full transition-colors relative",
                                                    isPublished ? "bg-black" : "bg-gray-200"
                                                )}
                                            >
                                                <div className={cn(
                                                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-transform",
                                                    isPublished ? "left-6" : "left-1"
                                                )} />
                                            </button>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                                                {isPublished ? "Published (Visible on site)" : "Draft (Hidden)"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Product Gallery</label>
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                {imagePreviews.map((prev, i) => (
                                                    <div key={i} className="aspect-square bg-gray-50 relative group">
                                                        <img src={prev} className="w-full h-full object-cover" />
                                                        <button type="button" onClick={() => {
                                                            setImagePreviews(p => p.filter((_, idx) => idx !== i));
                                                            // Also remove from imageFiles if it's a new upload
                                                        }} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <X className="text-white" size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => document.getElementById('multi-upload')?.click()} className="aspect-square border-2 border-dashed border-gray-100 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                                                    <Plus size={24} className="text-gray-200" />
                                                </button>
                                            </div>
                                            <input id="multi-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImagesChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Technical Specs (JSON or Line-separated)</label>
                                            <textarea rows={4} value={technicalSpecs} onChange={(e) => setTechnicalSpecs(e.target.value)} className="w-full border border-gray-50 p-4 focus:outline-none focus:border-black transition-colors font-light text-sm bg-gray-50" placeholder="Grade: 316L Stainless Steel\nFinish: Mirror Polished" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-50">
                                    <button disabled={submitting} className="w-full bg-black text-white py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3">
                                        {submitting ? <Loader2 className="animate-spin" size={16} /> : <span>{editingProduct ? "Update Catalog Entry" : "Publish Product"}</span>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white p-8 shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                                    <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Delete Product</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Are you sure you want to delete this product? This action cannot be undone and will remove all associated images.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            confirmDelete();
                                            setIsDeleteModalOpen(false);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
