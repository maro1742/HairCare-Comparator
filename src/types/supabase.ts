export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
    affiliate_link: string;
    brand?: string;
    description?: string;
    cosmetic_function?: string;
    usage?: string;
    ingredient_categories?: string; // Stored as comma-separated or JSON string
    inci?: string;
}
