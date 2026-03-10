const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const tables = ['products_natura', 'products_bielenda', 'products_dsd_deluxe', 'products_insight', 'products_webepartners', 'products_ceneo', 'products_notino'];
    
    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('id, name, inci, description, usage, cosmetic_function')
            .ilike('name', '%John Frieda Szampon definiujący loki%')
            .limit(1);
            
        if (data && data.length > 0) {
            console.log(`Found in table: ${table}`);
            console.log(JSON.stringify(data[0], null, 2));
            return;
        }
    }
    console.log("Product not found.");
}
check();
