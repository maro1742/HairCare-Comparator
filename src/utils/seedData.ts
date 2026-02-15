import { createClient } from '@supabase/supabase-js';
import pkg from 'dotenv';
pkg.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SEED_PRODUCTS = [
    {
        name: 'Bielenda Hair Coach - Odżywka Suche & Zniszczone',
        price: 24.99,
        category: 'suche-zniszczone',
        image_url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop',
        affiliate_link: 'https://sklep.bielenda.pl/hair-coach-dry-shampoo'
    },
    {
        name: 'Bielenda Hair Coach - Serum Wypadanie & Cienkie',
        price: 32.50,
        category: 'wypadanie-cienkie',
        image_url: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=400&h=400&fit=crop',
        affiliate_link: 'https://sklep.bielenda.pl/hair-coach-serum'
    },
    {
        name: 'Bielenda Hair Coach - Szampon Łupież & Przetłuszczanie',
        price: 19.99,
        category: 'lupiez-przetluszczanie',
        image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop',
        affiliate_link: 'https://sklep.bielenda.pl/hair-coach-dandruff'
    },
    {
        name: 'Bielenda Hair Coach - Aktywator Skrętu Kręcone',
        price: 28.00,
        category: 'krecone',
        image_url: 'https://images.unsplash.com/photo-1552046122-03184de85e08?w=400&h=400&fit=crop',
        affiliate_link: 'https://sklep.bielenda.pl/hair-coach-curly'
    },
    {
        name: 'Bielenda Hair Coach - Maska Farbowane & Rozjaśniane',
        price: 26.90,
        category: 'farbowane-rozjasniane',
        image_url: 'https://images.unsplash.com/photo-1594410292212-32a8ba77a288?w=400&h=400&fit=crop',
        affiliate_link: 'https://sklep.bielenda.pl/hair-coach-color'
    }
];

async function seed() {
    console.log('Starting seed process...');

    for (const product of SEED_PRODUCTS) {
        const { data, error } = await supabase
            .from('products_bielenda')
            .insert([product])
            .select();

        if (error) {
            console.error(`Error seeding ${product.name}:`, error.message);
        } else {
            console.log(`Successfully seeded: ${product.name}`);
        }
    }

    console.log('Seed process finished.');
}

seed();
