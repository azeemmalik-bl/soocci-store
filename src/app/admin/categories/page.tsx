"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, imageUrl?: string } | null>(null);

    // Form State
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [sortOrder, setSortOrder] = useState<number>(0);
    const [isPublished, setIsPublished] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });

        if (data) setCategories(data);
        setLoading(false);
    };

    const handleOpenModal = (category: any | null = null) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
            setSlug(category.slug);
            setDescription(category.description || "");
            setSortOrder(category.sort_order || 0);
            setIsPublished(category.is_published ?? true);
            setImagePreview(category.main_image);
        } else {
            setEditingCategory(null);
            setName("");
            setSlug("");
            setDescription("");
            setSortOrder(0);
            setIsPublished(true);
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        let imageUrl = imagePreview;

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `categories/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('images')
                .upload(filePath, imageFile);

            if (uploadError) {
                alert("Error uploading image: " + uploadError.message);
                setSubmitting(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            imageUrl = publicUrl;
        }

        const categoryData: any = {
            name,
            slug,
            description,
            sort_order: sortOrder,
            is_published: isPublished,
            main_image: imageUrl || "",
        };

        if (editingCategory) {
            const { error } = await supabase
                .from("categories")
                .update(categoryData)
                .eq("id", editingCategory.id);

            if (error) {
                console.error("Category Insert/Update Error:", error);
                alert("Database Error: " + error.message + "\nDetails: " + (error.details || 'None'));
            }
        } else {
            const { error } = await supabase
                .from("categories")
                .insert([categoryData]);

            if (error) {
                console.error("Category Insert Error:", error);
                alert("Database Error: " + error.message + "\nDetails: " + (error.details || 'None'));
            }
        }

        setSubmitting(false);
        setIsModalOpen(false);
        fetchCategories();
    };

    const handleDelete = (id: string, imageUrl?: string) => {
        setItemToDelete({ id, imageUrl });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        const { id, imageUrl } = itemToDelete;
        // Confirmation is now handled in the UI button handler for better UX
        try {
            // 1. If there's an image, delete it from storage
            // Fetch fresh data if imageUrl isn't provided to be safe
            let targetImage = imageUrl;
            if (!targetImage) {
                const { data } = await supabase.from('categories').select('main_image').eq('id', id).single();
                if (data) targetImage = data.main_image;
            }

            if (targetImage && targetImage.includes('supabase.co')) {
                // Extract relative path from URL
                // URL: https://.../storage/v1/object/public/images/categories/abc.jpg
                // Path: categories/abc.jpg
                const path = targetImage.split('/images/')[1];
                if (path) {
                    const { error: storageError } = await supabase.storage
                        .from('images')
                        .remove([path]);

                    if (storageError) console.error("Error deleting image:", storageError);
                }
            }

            // 2. Delete the database record
            const { error } = await supabase.from("categories").delete().eq("id", id);

            if (error) {
                console.error("Delete Error:", error);
                alert("Failed to delete category: " + error.message);
            } else {
                fetchCategories();
            }
        } catch (err) {
            console.error("Unexpected error during delete:", err);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <span className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-4 block">Store Management</span>
                    <h1 className="text-4xl font-serif">Categories</h1>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white px-8 py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                    <Plus size={14} />
                    <span>Add Category</span>
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white border border-gray-100 p-6 shadow-sm group">
                            <div className="aspect-[16/9] bg-gray-50 mb-6 overflow-hidden relative flex items-center justify-center">
                                {category.main_image ? (
                                    <img src={category.main_image} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="text-gray-200" size={40} />
                                )}
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-sm tracking-widest uppercase font-semibold">{category.name}</h3>
                                <span className={cn(
                                    "text-[8px] px-2 py-1 uppercase tracking-widest border",
                                    (category as any).is_published ? "border-green-200 text-green-600 bg-green-50" : "border-gray-200 text-gray-400 bg-gray-50"
                                )}>
                                    {(category as any).is_published ? "Published" : "Draft"}
                                </span>
                            </div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                                Sort Order: {category.sort_order || 0}
                            </div>
                            <p className="text-xs text-gray-400 font-light mb-6 line-clamp-2">{category.description || "No description provided."}</p>

                            <div className="flex space-x-2 pt-6 border-t border-gray-50 relative z-10">
                                <button
                                    type="button"
                                    onClick={() => handleOpenModal(category)}
                                    className="p-2 text-gray-400 hover:text-black transition-colors"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(category.id, category.main_image);
                                    }}
                                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer relative z-50 pointer-events-auto"
                                    title="Delete Category"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl bg-white p-12 shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh]"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-8 right-8 text-gray-400 hover:text-black"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-serif uppercase tracking-widest mb-10">
                                {editingCategory ? "Edit Category" : "New Category"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Name</label>
                                        <input
                                            required
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                if (!editingCategory) setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                                            }}
                                            className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors font-light text-sm"
                                            placeholder="e.g., Clasps"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Slug</label>
                                        <input
                                            required
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors font-light text-sm"
                                            placeholder="e.g., clasps"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Sort Order</label>
                                        <input
                                            type="number"
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                            className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors font-light text-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Description</label>
                                        <textarea
                                            rows={3}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors font-light text-sm resize-none"
                                            placeholder="Short description of the category..."
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3">
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
                                            {isPublished ? "Published (Visible on site)" : "Draft (Hidden from site)"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Cover Image</label>
                                    <div
                                        className="border-2 border-dashed border-gray-100 p-8 text-center relative hover:bg-gray-50 transition-colors group cursor-pointer"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                    >
                                        {imagePreview ? (
                                            <div className="relative aspect-video max-w-sm mx-auto">
                                                <img src={imagePreview} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="text-white" size={24} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center py-4">
                                                <ImageIcon className="text-gray-200 mb-4" size={48} />
                                                <p className="text-xs text-gray-400 tracking-widest uppercase">Click to upload main image</p>
                                            </div>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button
                                        disabled={submitting}
                                        className="w-full bg-black text-white py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={16} /> : <span>{editingCategory ? "Update Category" : "Create Category"}</span>}
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
                                <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Delete Category</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Are you sure you want to delete this category? This action cannot be undone and will remove all associated products.
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
