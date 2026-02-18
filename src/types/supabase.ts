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
    volume_ml?: number;
    hair_porosity?: 'LOW' | 'MEDIUM' | 'HIGH';
    category_type?: 'shampoo' | 'conditioner' | 'mask' | 'serum';
    peh_ratio?: string;
    recommended_season?: 'all' | 'winter' | 'summer' | 'spring_fall';
}
