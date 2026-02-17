import { supabase } from '../lib/supabaseClient';
import type { Product as DBProduct } from '../types/supabase';
import type { Product as UIProduct, HairGoal, HairType, ScalpType } from '../types';
import { PRODUCTS as MOCK_PRODUCTS } from '../data/products';

/**
 * Fetches products from the products_bielenda table, optionally filtered by category.
 * @param categoryName Optional category to filter by
 * @returns A promise that resolves to an array of Bielenda products
 */
/**
 * Fetches products from both Bielenda and DSD Deluxe tables, optionally filtered by category.
 */
export async function fetchDbProducts(categoryName?: string): Promise<DBProduct[]> {
    const tables = ['products_bielenda', 'products_dsd_deluxe', 'products_natura'];

    const results = await Promise.all(tables.map(async (table) => {
        let query = supabase.from(table).select('*');

        if (categoryName) {
            const categoryMap: Record<string, string> = {
                'suche-zniszczone': 'Suche',
                'wypadanie-cienkie': 'Wypadanie',
                'lupiez-przetluszczanie': 'Łupież',
                'krecone': 'Kręcone',
                'farbowane-rozjasniane': 'Farbowane'
            };
            const dbCategory = categoryMap[categoryName] || categoryName;
            query = query.eq('category', dbCategory);
        }

        const { data, error } = await query;
        if (error) {
            console.error(`Error fetching products from ${table}:`, error);
            return [];
        }
        return data || [];
    }));

    return results.flat() as DBProduct[];
}

// Keep original name for compatibility if used elsewhere, but point to new generic function
export const fetchBielendaProducts = fetchDbProducts;

/**
 * Legacy function for generic products (kept for compatibility if needed)
 */
/**
 * Legacy function for generic products (kept for compatibility if needed)
 */
export async function getProductsByCategory(categoryName: string): Promise<any[]> {
    return fetchDbProducts(categoryName);
}

/**
 * Searches for products based on a query string.
 * Searches in name, description, and brand columns.
 * @param query The search term
 * @returns A promise that resolves to an array of matching products
 */
/**
 * Searches for products based on a query string across all product tables.
 */
export async function searchProducts(query: string): Promise<DBProduct[]> {
    if (!query) return [];

    const tables = ['products_bielenda', 'products_dsd_deluxe', 'products_natura'];
    const results = await Promise.all(tables.map(async (table) => {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`);

        if (error) {
            console.error(`Error searching ${table}:`, error);
            return [];
        }
        return data || [];
    }));

    return results.flat() as DBProduct[];
}

/**
 * Maps a database product to the UI Product format.
 */
function mapToUIProduct(p: DBProduct): UIProduct {
    const nameLower = p.name.toLowerCase();

    // Guess category from name
    let category: UIProduct['category'] = 'shampoo';
    if (nameLower.includes('odżywka')) category = 'conditioner';
    else if (nameLower.includes('maska')) category = 'mask';
    else if (nameLower.includes('serum') || nameLower.includes('olejek')) category = 'serum';
    else if (nameLower.includes('wcierka') || nameLower.includes('tonik')) category = 'scalp_tonic';
    else if (nameLower.includes('suplement') || nameLower.includes('tabletki')) category = 'supplement';

    const hair_goals: HairGoal[] = [];
    const hair_type_fit: HairType[] = [];
    const scalp_fit: ScalpType[] = ['normal'];

    if (p.category === 'Suche') {
        hair_goals.push('dryness', 'damage');
        hair_type_fit.push('thick');
    } else if (p.category === 'Wypadanie') {
        hair_goals.push('hairloss', 'volume');
        hair_type_fit.push('fine');
    } else if (p.category === 'Łupież') {
        hair_goals.push('dandruff', 'oily_scalp');
        scalp_fit.push('dandruff', 'oily');
    } else if (p.category === 'Kręcone') {
        hair_goals.push('frizz');
        hair_type_fit.push('curly');
    } else if (p.category === 'Farbowane') {
        hair_goals.push('damage');
        hair_type_fit.push('colored', 'bleached');
    }

    return {
        id: p.id,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: p.brand || 'Bielenda',
        name: p.name,
        category,
        hair_goals,
        hair_type_fit,
        scalp_fit,
        free_from: [],
        claims: [],
        inci: p.inci || '',
        ingredient_flags: {
            has_silicones: false,
            has_sulfates: false,
            has_parabens: false,
            has_drying_alcohols: false,
            has_fragrance: false
        },
        images: p.image_url ? [p.image_url] : [],
        popularity: 70, // Default for new products
        cosmetic_function: p.cosmetic_function,
        usage: p.usage,
        ingredient_categories: p.ingredient_categories ? p.ingredient_categories.split(',').map(s => s.trim()) : [],
        offers: [
            {
                merchant: 'other',
                price_pln: p.price,
                url: p.affiliate_link,
                last_checked: new Date().toISOString().split('T')[0]
            }
        ],
        updated_at: new Date().toISOString().split('T')[0],
        description: p.description
    };
}

/**
 * Fetches all products (Mock + Supabase)
 */
/**
 * Fetches all products (Mock + all Supabase tables)
 */
export async function getAllProducts(): Promise<UIProduct[]> {
    try {
        const dbProducts = await fetchDbProducts();
        const mapped = dbProducts.map(mapToUIProduct);
        return [...MOCK_PRODUCTS, ...mapped];
    } catch (e) {
        console.error('Error in getAllProducts:', e);
        return MOCK_PRODUCTS;
    }
}
/**
 * Fetches a single product by its slug (Mock or Supabase)
 */
export async function getProductBySlug(slug: string): Promise<UIProduct | null> {
    // 1. Check Mock Products
    const mockMatch = MOCK_PRODUCTS.find(p => p.slug === slug);
    if (mockMatch) return mockMatch;

    // 2. Check Supabase Products
    try {
        // We fetch all and find the match. In a larger app, we'd store slug in DB
        // or search by name transform.
        const all = await getAllProducts();
        return all.find(p => p.slug === slug) || null;
    } catch (e) {
        console.error('Error fetching product by slug:', e);
        return null;
    }
}
