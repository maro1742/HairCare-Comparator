const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = ['products_bielenda', 'products_dsd_deluxe', 'products_natura', 'products_insight'];

const NON_HAIR_KEYWORDS = [
    'paznokci', 'rzęs', 'brwi', 'do ciała', 'do twarzy', 'do ust', 'do dłoni', 'do rąk', 'do stóp', 'do nóg', 
    'pod prysznic', 'kąpieli', 'micelarny', 'depilacji', 'higieny intymnej', 'make-up', 'makeup', 'makijaż',
    'błyszczyk', 'pomadka', 'szminka', 'cienie', 'tusz', 'dezodorant', 'antyperspirant', 'samoopalacz'
];

async function findNonHair() {
    let toDelete = [];

    for (const table of TABLES) {
        let { data: products, error } = await supabase.from(table).select('id, name, brand');
        if (error) {
            console.error(`Error fetching from ${table}:`, error);
            continue;
        }

        for (const product of products) {
            const nameLower = (product.name || '').toLowerCase();
            const brandLower = (product.brand || '').toLowerCase();
            const matchedKeywords = NON_HAIR_KEYWORDS.filter(k => nameLower.includes(k) || brandLower.includes('sally hansen'));

            if (matchedKeywords.length > 0) {
                toDelete.push({
                    table,
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    matched: matchedKeywords.join(', ')
                });
            }
        }
    }

    console.log(`Found ${toDelete.length} products to delete:`);
    toDelete.forEach(p => console.log(`- [${p.table}] ${p.brand} ${p.name} (Matched: ${p.matched})`));
}

findNonHair();
