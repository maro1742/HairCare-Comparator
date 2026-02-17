const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkData() {
    const tables = ['products_bielenda', 'products_dsd_deluxe', 'products_natura'];

    for (const table of tables) {
        console.log(`\nChecking table: ${table}`);
        const { data, error } = await supabase.from(table).select('*');

        if (error) {
            console.error(`Error fetching data from ${table}:`, error.message);
            continue;
        }

        const total = data.length;
        const missingBrand = data.filter(p => !p.brand).length;
        const missingName = data.filter(p => !p.name).length;
        const missingImage = data.filter(p => !p.image_url || p.image_url.includes('placeholder') || p.image_url.includes('logo.svg')).length;
        const missingCategory = data.filter(p => !p.category || p.category === 'other').length;
        const missingDesc = data.filter(p => !p.description || p.description.length < 10).length;
        const missingUsage = data.filter(p => !p.usage).length;
        const missingInci = data.filter(p => !p.inci).length;

        console.log(`Total products: ${total}`);
        console.log(`Missing Brand: ${missingBrand}`);
        console.log(`Missing Name: ${missingName}`);
        console.log(`Missing/Placeholder Image: ${missingImage}`);
        console.log(`Missing Category: ${missingCategory}`);
        console.log(`Short/Missing Description: ${missingDesc}`);
        console.log(`Missing Usage: ${missingUsage}`);
        console.log(`Missing Ingredients (INCI): ${missingInci}`);
    }
}

checkData();
