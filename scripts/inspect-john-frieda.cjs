const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectProduct() {
    const tables = ['products_bielenda', 'products_dsd_deluxe', 'products_natura'];

    for (const table of tables) {
        console.log(`\n--- Searching in ${table} ---`);
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .ilike('name', '%John Frieda%');

        if (error) {
            console.error(`Error in ${table}:`, error);
            continue;
        }

        if (!data || data.length === 0) {
            console.log(`No John Frieda found in ${table}.`);
        } else {
            data.forEach(p => {
                console.log('\n[MATCH FOUND]');
                console.log('ID:', p.id);
                console.log('Name:', p.name);
                console.log('INCI in DB:', p.inci);
                console.log('Full Description:');
                console.log(p.description);
            });
        }
    }
}

inspectProduct();
