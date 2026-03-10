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
    simplified_data?: {
        benefits?: string[];
        key_ingredients?: string[];
    };
    volume_ml?: number;
    hair_porosity?: 'LOW' | 'MEDIUM' | 'HIGH';
    category_type?: 'shampoo' | 'conditioner' | 'mask' | 'serum';
    peh_ratio?: string;
    recommended_season?: 'all' | 'winter' | 'summer' | 'spring_fall';

    // Gemini AI extracted fields
    has_silicones?: boolean;
    has_sulfates?: boolean;
    has_proteins?: boolean;
    has_humectants?: boolean;
    has_emollients?: boolean;
    is_cg_approved?: boolean;
    peh_balance?: string;
    key_ingredients?: string; // Stored as stringified JSON array
}
