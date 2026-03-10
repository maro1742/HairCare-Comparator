const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkProduct() {
    const tables = ['products_bielenda', 'products_dsd_deluxe', 'products_natura', 'products_ceneo', 'products_insight'];
    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .ilike('name', '%Balneokosmetyki%');

        if (error) console.error(error);
        if (data && data.length > 0) {
            console.log("Found in", table);
            console.log(JSON.stringify(data, null, 2));
        }
    }
}

checkProduct();
