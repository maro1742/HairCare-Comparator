const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Dictionary lines based on popular cosmetic ingredients
const PEH_DICTIONARY = {
    P: [
        'keratin', 'silk', 'protein', 'collagen', 'elastin', 'wheat', 'soy', 'oat', 'amino acid', 'milk', 'keratyn', 'jedwab', 'peptyd', 'kolagen', 'pszenic', 'owies', 'soj', 'mlek', 'ryż'
    ],
    E: [
        'oil', 'butter', 'stearyl', 'cetyl', 'cetearyl', 'lanolin', 'wax', 'squalane', 'dimethicone', 'amodimethicone', 'cyclopentasiloxane', 'caprylic', 'caprate', 'isopropyl myristate', 'olej', 'masło', 'wosk', 'olejek', 'lanolina'
    ],
    H: [
        'glycerin', 'panthenol', 'aloe', 'hyaluronic', 'urea', 'propylene glycol', 'honey', 'allantoin', 'sorbitol', 'sodium pca', 'lactic acid', 'gliceryna', 'aloes', 'kwas hialuronowy', 'mocznik', 'miód', 'alantoina', 'pantenol'
    ]
};

function analyzePEH(text) {
    if (!text) return '';
    const lowerText = text.toLowerCase();
    
    let result = '';
    
    // Check Proteins
    if (PEH_DICTIONARY.P.some(keyword => lowerText.includes(keyword))) {
        result += 'P';
    }
    
    // Check Emollients
    if (PEH_DICTIONARY.E.some(keyword => lowerText.includes(keyword))) {
        result += 'E';
    }
    
    // Check Humectants
    if (PEH_DICTIONARY.H.some(keyword => lowerText.includes(keyword))) {
        result += 'H';
    }
    
    return result;
}

async function run() {
    const tables = ['products_bielenda', 'products_dsd_deluxe', 'products_natura', 'products_ceneo', 'products_insight'];
    
    for (const table of tables) {
        console.log(`\n============================`);
        console.log(`Analyzing table: ${table}`);
        console.log(`============================`);
        
        let hasMore = true;
        let offset = 0;
        const limit = 100;
        let updatedCount = 0;
        
        while (hasMore) {
            const { data: products, error } = await supabase
                .from(table)
                .select('id, name, inci, description, peh_balance')
                .range(offset, offset + limit - 1);
                
            if (error) {
                console.error(`Error fetching products from ${table}:`, error);
                break;
            }
            
            if (!products || products.length === 0) {
                hasMore = false;
                break;
            }
            
            for (const product of products) {
                const textToAnalyze = product.inci || product.description || '';
                const detectedPEH = analyzePEH(textToAnalyze);
                
                // Only update if it changed
                if (detectedPEH !== (product.peh_balance || '')) {
                    const { error: updateError } = await supabase
                        .from(table)
                        .update({ peh_balance: detectedPEH })
                        .eq('id', product.id);
                        
                    if (updateError) {
                        console.error(`Failed to update product ${product.id} in ${table}:`, updateError);
                    } else {
                        updatedCount++;
                        if (updatedCount % 50 === 0) {
                            console.log(`Updated ${updatedCount} products into ${table}... (Last updated: ${product.name} with [${detectedPEH}])`);
                        }
                    }
                }
            }
            
            offset += limit;
        }
        
        console.log(`Done for ${table}. Total updated: ${updatedCount}`);
    }
    
    console.log('\n✅ All tables processed successfully!');
}

run();
