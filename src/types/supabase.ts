export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
    affiliate_link: string;
    brand?: string;
    description?: string;
}
