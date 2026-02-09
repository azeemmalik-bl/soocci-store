export interface Category {
    id: string;
    name: string;
    slug: string;
    main_image: string;
    description?: string;
    created_at?: string;
    sort_order?: number;
}

export interface Product {
    id: string;
    category_id: string;
    title: string;
    slug: string;
    sku: string;
    material: string; // e.g., "316L Stainless Steel"
    description: string;
    technical_specs?: string;
    images: string[]; // Array of image URLs
    created_at?: string;
}
