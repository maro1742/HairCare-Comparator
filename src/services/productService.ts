import { supabase } from '../lib/supabaseClient';
import type { Product as DBProduct } from '../types/supabase';
import type { Product as UIProduct, HairGoal, HairType, ScalpType } from '../types';
import { PRODUCTS } from '../data/products';
import { GoogleGenAI } from '@google/genai';

// Inicjalizacja klienta Gemini (wymaga klucza dla klienta lub proxy)
// W środowisku produkcyjnym rekomendowane jest proxy przez własny backend by nie ujawniać klucza!
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

/**
 * Fetches products from the products_bielenda table, optionally filtered by category.
 * @param categoryName Optional category to filter by
 * @returns A promise that resolves to an array of Bielenda products
 */
/**
 * Fetches products from both Bielenda and DSD Deluxe tables, optionally filtered by category.
 */
export async function fetchDbProducts(categoryName?: string): Promise<DBProduct[]> {
    const tables = ['products_bielenda', 'products_dsd_deluxe', 'products_natura', 'products_ceneo', 'products_insight'];

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
export async function searchProducts(query: string): Promise<UIProduct[]> {
    if (!query) return [];

    let vectorResults: DBProduct[] = [];
    let usedVectorSearch = false;

    // 1. Zaczynamy od wyszukiwania wektorowego (RAG) jeśli mamy podpięty Gemini
    if (ai) {
        try {
            console.log("Szukam wektora dla zapytania: ", query);
            const embeddingResult = await ai.models.embedContent({
                model: 'gemini-embedding-001',
                contents: query,
            });
            if (!embeddingResult.embeddings || !embeddingResult.embeddings[0]) {
                throw new Error("Pusta odpowiedź z modelu Embeddings");
            }
            const queryVector = embeddingResult.embeddings[0].values;
            
            // Wyszukujemy przez funkcję RPC
            const { data, error } = await supabase.rpc('match_products', {
                query_embedding: queryVector,
                match_threshold: 0.5, // 50% podobieństwa
                match_count: 20
            });

            if (error) {
                console.error("Błąd wyszukiwania wektorowego (RPC):", error);
            } else if (data && data.length > 0) {
                usedVectorSearch = true;
                
                const sourceMap = data.reduce((acc: any, row: any) => {
                    if (!acc[row.table_source]) acc[row.table_source] = [];
                    acc[row.table_source].push(row.id);
                    return acc;
                }, {});

                const fullDocsPromises = Object.keys(sourceMap).map(async (table) => {
                    const { data: fullDocs } = await supabase
                        .from(table)
                        .select('*')
                        .in('id', sourceMap[table]);
                    return fullDocs || [];
                });
                
                const docsMatrix = await Promise.all(fullDocsPromises);
                vectorResults = docsMatrix.flat() as DBProduct[];
                
                vectorResults.sort((a, b) => {
                    const scoreA = data.find((d:any) => d.id === a.id)?.similarity || 0;
                    const scoreB = data.find((d:any) => d.id === b.id)?.similarity || 0;
                    return scoreB - scoreA;
                });
                
                console.log(`Znaleziono (wektorami): ${vectorResults.length} produktów!`);
            }
        } catch (err) {
            console.error("Błąd podczas odpytywania Gemini dla szukania wektorowego. Spadam do szukania klasycznego.", err);
        }
    }

    if (usedVectorSearch && vectorResults.length > 0) {
        const mappedVector = vectorResults.map(mapToUIProduct);
        // Połącz z ewentualnymi statycznymi trafieniami
        const staticMatches = PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || 
            p.brand.toLowerCase().includes(query.toLowerCase())
        );
        return [...mappedVector, ...staticMatches];
    }

    // 2. FALLBACK (Klasyczne szukanie ILIKE po polach tekstowych)
    console.log("Fallback: Wyszukiwanie tradycyjne ILIKE...");
    const tables = ['products_bielenda', 'products_dsd_deluxe', 'products_natura', 'products_ceneo', 'products_insight'];
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

    const dbResults = results.flat() as DBProduct[];
    const mappedDb = dbResults.map(mapToUIProduct);

    // Merge with static products that match the query
    const staticMatches = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(query.toLowerCase())
    );

    return [...mappedDb, ...staticMatches];
}

/**
 * Maps a database product to the UI Product format.
 */
export function mapToUIProduct(p: DBProduct): UIProduct {
    const nameLower = p.name.toLowerCase();

    // Guess category from name
    let category: UIProduct['category'] = 'other';

    // Priority check for technical products (force to 'other')
    if (nameLower.includes('rozjaśniacz') || nameLower.includes('rozjaśniaj') || nameLower.includes('farba') || nameLower.includes('trwała ondulacja') || nameLower.includes('utleniacz') || nameLower.includes('aktywator') || nameLower.includes('developer')) {
        category = 'other';
    } else if (nameLower.includes('szampon') || nameLower.includes('shampoo') || nameLower.includes('wash') || nameLower.includes('cleanser') || nameLower.includes('kąpiel')) {
        category = 'shampoo';
    } else if (nameLower.includes('odżywka') || nameLower.includes('conditioner')) {
        category = 'conditioner';
    } else if (nameLower.includes('maska') || nameLower.includes('mask')) {
        category = 'mask';
    } else if (nameLower.includes('serum') || nameLower.includes('olejek') || nameLower.includes('oil') || nameLower.includes('jedwab') || nameLower.includes('silk')) {
        category = 'serum';
    } else if (nameLower.includes('wcierka') || nameLower.includes('tonik') || nameLower.includes('tonic') || nameLower.includes('peeling') || nameLower.includes('scrub')) {
        category = 'scalp_tonic';
    } else if (nameLower.includes('suplement') || nameLower.includes('tabletki') || nameLower.includes('kapsułki') || nameLower.includes('capsules')) {
        category = 'supplement';
    } else if (nameLower.includes('żel') || nameLower.includes('gel') || nameLower.includes('spray') || nameLower.includes('lakier') || nameLower.includes('lacquer') || nameLower.includes('pianka') || nameLower.includes('mousse') || nameLower.includes('mgiełka') || nameLower.includes('mist') || nameLower.includes('pasta') || nameLower.includes('paste')) {
        category = 'styling';
    }

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
        const isDandruffSpecific = nameLower.includes('łupież') || nameLower.includes('dandruff') || nameLower.includes('anti-dandruff');
        const isOilySpecific = nameLower.includes('przetłuszcz') || nameLower.includes('normaliz') || nameLower.includes('brzozow') || nameLower.includes('oczyszcz');

        if (isDandruffSpecific) {
            hair_goals.push('dandruff');
            scalp_fit.push('dandruff');
            if (isOilySpecific) hair_goals.push('oily_scalp');
        } else if (isOilySpecific) {
            hair_goals.push('oily_scalp');
            scalp_fit.push('oily');
        } else {
            hair_goals.push('dandruff', 'oily_scalp');
            scalp_fit.push('dandruff', 'oily');
        }
    } else if (p.category === 'Kręcone') {
        hair_goals.push('frizz');
        hair_type_fit.push('curly');
    } else if (p.category === 'Farbowane') {
        hair_goals.push('damage');
        hair_type_fit.push('colored', 'bleached');
    }

    // Attempt to extract INCI if missing but present in description
    const rawDesc = p.description || '';
    let inci = p.inci || '';
    if (!inci && (rawDesc.toLowerCase().includes('inci') || rawDesc.toLowerCase().includes('skład') || rawDesc.toLowerCase().includes('ingredients'))) {
        const match = rawDesc.match(/(?:\bINCI\b|\bSkład \(INCI\)\b|\bSkład\b|\bSkładniki\b|\bIngredients\b):?\s*([\s\S]*?)(?=<br|<p|<\/p|###|$)/i);
        if (match) inci = match[1].replace(/<[^>]+>/g, ' ').trim();
    }

    // Attempt to extract usage if missing
    let usage = p.usage || '';
    if (!usage && (rawDesc.toLowerCase().includes('stosowania') || rawDesc.toLowerCase().includes('użycia') || rawDesc.toLowerCase().includes('aplikacja'))) {
        const match = rawDesc.match(/(?:\bSposób użycia\b|\bStosowanie\b|\bAplikacja\b|\bJak używać\b):?\s*([\s\S]*?)(?=<br|<p|<\/p|###|$)/i);
        if (match) usage = match[1].replace(/<[^>]+>/g, ' ').trim();
    }

    // Attempt to extract capacity from description
    let capacity = '';
    if (rawDesc.toLowerCase().includes('pojemność')) {
        const match = rawDesc.match(/Pojemność:?\s*(\d+\s*(?:ml|l|g))/i);
        if (match) capacity = match[1].trim();
    }

    // Deterministic rating fallback (mocking "Google reviews" as requested)
    const getMockRating = (id: string) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = ((hash << 5) - hash) + id.charCodeAt(i);
            hash |= 0;
        }
        const absHash = Math.abs(hash);
        return {
            average: 4.2 + (absHash % 8) / 10, // 4.2 to 4.9
            count: 124 + (absHash % 376) // 124 to 500
        };
    };

    return {
        id: p.id,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: p.brand || 'Hair Care',
        name: p.name,
        category,
        hair_goals,
        hair_type_fit,
        scalp_fit,
        free_from: [],
        claims: [],
        inci: inci || 'Informacja o składzie w opisie produktu.',
        ingredient_flags: {
            has_silicones: p.has_silicones || false,
            has_sulfates: p.has_sulfates || false,
            has_parabens: false,
            has_drying_alcohols: false,
            has_fragrance: false
        },
        has_proteins: p.has_proteins,
        has_humectants: p.has_humectants,
        has_emollients: p.has_emollients,
        is_cg_approved: p.is_cg_approved,
        peh_balance: p.peh_balance,
        key_ingredients: typeof p.key_ingredients === 'string' ? JSON.parse(p.key_ingredients) : p.key_ingredients,
        simplified_data: typeof p.simplified_data === 'string' ? JSON.parse(p.simplified_data) : p.simplified_data,
        images: p.image_url ? [p.image_url] : [],
        popularity: 70,
        cosmetic_function: p.cosmetic_function || 'Regeneracja i pielęgnacja włosów.',
        usage: usage || 'Nanieś na mokre włosy, wmasuj i spłucz lub zastosuj zgodnie z instrukcją na opakowaniu.',
        ingredient_categories: p.ingredient_categories ? p.ingredient_categories.split(',').map(s => s.trim()) : [],
        offers: [
            {
                merchant: p.brand === 'DSD de Luxe' ? 'DSD' :
                    (p.brand?.toLowerCase().includes('bielenda') ? 'Bielenda' :
                        (p.brand?.toLowerCase().includes('insight') ? 'Insight' : 'Sklep')),
                price_pln: p.price,
                url: p.affiliate_link,
                last_checked: new Date().toISOString().split('T')[0]
            }
        ],
        updated_at: new Date().toISOString().split('T')[0],
        description: p.description || 'Brak szczegółowego opisu produktu.',
        capacity: capacity || undefined,
        rating: getMockRating(p.id),
        // Technical comparison fields
        volume_ml: p.volume_ml,
        hair_porosity: p.hair_porosity,
        category_type: p.category_type,
        peh_ratio: p.peh_ratio,
        recommended_season: p.recommended_season || 'all'
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
        const mappedDb = dbProducts.map(mapToUIProduct);
        
        // Merge with our hardcoded products (like Davines)
        return [...mappedDb, ...PRODUCTS];
    } catch (e) {
        console.error('Error in getAllProducts:', e);
        return PRODUCTS; // Fallback to at least show static products
    }
}
export async function getProductBySlug(slug: string): Promise<UIProduct | null> {
    try {
        const all = await getAllProducts();
        return all.find(p => p.slug === slug) || null;
    } catch (e) {
        console.error('Error fetching product by slug:', e);
        return null;
    }
}
