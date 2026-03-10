const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const slugToFind = 'barwa-sunny-greece-szampon-nawil-aj-cy-380-ml';
    const { data } = await supabase.from('products_natura').select('*').ilike('name', '%Barwa Sunny Greece%').limit(1);
    if (data && data.length > 0) {
        console.log("=== DESCRIPTION ===");
        console.log(data[0].description);
        console.log("=== INCI ===");
        console.log(data[0].inci);
    }
}
run();
