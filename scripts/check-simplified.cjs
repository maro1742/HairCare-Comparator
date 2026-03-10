const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const tables = ['products_natura', 'products_bielenda', 'products_dsd_deluxe', 'products_insight', 'products_webepartners'];
    
    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('id, name, simplified_data')
            .not('simplified_data', 'is', null)
            .limit(1);
            
        if (data && data.length > 0) {
            console.log(`Znalazlem w tabeli ${table}:`);
            console.log(`Nazwa: ${data[0].name}`);
            console.log(JSON.stringify(data[0].simplified_data, null, 2));
            return;
        }
    }
    console.log("Brak produktów z wypełnionym simplified_data.");
}
check();
