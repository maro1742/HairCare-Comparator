const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = ['products_bielenda', 'products_dsd_deluxe', 'products_natura', 'products_insight'];

// Use word boundaries for some, or specific phrases
const NON_HAIR_KEYWORDS = [
    'paznokci', 'rzęs', 'brwi', 'do ciała', 'do twarzy', 'do ust', 'do dłoni', 'do rąk', 'do stóp', 'do nóg', 
    'kąpieli', 'micelarn', 'depilacji', 'higieny intymnej', 'make-up', 'makeup', 'makijaż',
    'błyszczyk', 'pomadka', 'szminka', 'dezodorant', 'antyperspirant', 'samoopalacz', 'tusz do',
    'face mask', 'body cream', 'face booster', 'body oil', 'hand cream', 'hand sanitizing', 'hand purifying', 'face serum', 'body fluid', 'hand balm'
];

async function generateSql() {
    let sqlLines = [];
    let count = 0;

    for (const table of TABLES) {
        let { data: products, error } = await supabase.from(table).select('id, name, brand');
        if (error) {
            console.error(`Error fetching from ${table}:`, error);
            continue;
        }

        let idsToDelete = [];

        for (const product of products) {
            const nameLower = (product.name || '').toLowerCase();
            const brandLower = (product.brand || '').toLowerCase();
            
            let isNonHair = false;

            // Check keywords
            for (const k of NON_HAIR_KEYWORDS) {
                if (nameLower.includes(k)) {
                    isNonHair = true;
                    break;
                }
            }

            // Exceptions
            if (nameLower.includes('szampon') || nameLower.includes('włosów')) {
                // E.g. Żel pod prysznic i szampon, or Mgiełka do ciała i włosów
                // We keep it if it explicitly says it's for hair/shampoo.
                // Exception for Sally Hansen which is nail brand
                if (brandLower.includes('sally hansen')) {
                    isNonHair = true; 
                } else {
                    isNonHair = false;
                }
            }
            
            // Sally Hansen is a nail brand
            if (brandLower.includes('sally hansen')) {
                isNonHair = true;
            }

            if (isNonHair) {
                idsToDelete.push(product.id);
                console.log(`[${table}] Will delete: ${product.brand} - ${product.name}`);
            }
        }

        if (idsToDelete.length > 0) {
            count += idsToDelete.length;
            const idsList = idsToDelete.map(id => `'${id}'`).join(', ');
            sqlLines.push(`DELETE FROM ${table} WHERE id IN (${idsList});`);
        }
    }

    if (count > 0) {
        fs.writeFileSync('delete_non_hair.sql', sqlLines.join('\n\n'));
        console.log(`\nGenerated delete_non_hair.sql with ${count} items to delete.`);
    } else {
        console.log('\nNo items to delete.');
    }
}

generateSql();
