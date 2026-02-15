const axios = require('axios');
const xml2js = require('xml2js');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const XML_URL = 'https://service.weben1.com/xml/45c7ad04-4f6a-4d22-84c9-f7b1503f3504.xml';

if (!SUPABASE_URL || (!SUPABASE_ANON_KEY && !SUPABASE_SERVICE_ROLE_KEY)) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

// Prefer service role key for sync operations to bypass RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);

const categoryKeywords = {
    'Suche': ['suche', 'zniszczon', 'regenerat', 'nawilż', 'dry', 'damaged'],
    'Wypadanie': ['wypadan', 'cienki', 'wzmocnien', 'biotyn', 'kofein', 'niacynamid', 'falls', 'thin'],
    'Łupież': ['łupież', 'przetłuszcz', 'oczyszcz', 'kwas salicylowy', 'dandruff', 'oily'],
    'Kręcone': ['skręt', 'kręcon', 'loki', 'curly'],
    'Farbowane': ['farbowan', 'rozjaśnian', 'ochrona koloru', 'antyoksydant', 'colored', 'bleached']
};

function generateUUID(str) {
    const hash = crypto.createHash('sha1').update(str).digest('hex');
    return [
        hash.substring(0, 8),
        hash.substring(8, 12),
        '4' + hash.substring(13, 16),
        ((parseInt(hash.substring(16, 18), 16) & 0x3f) | 0x80).toString(16) + hash.substring(18, 20),
        hash.substring(20, 32)
    ].join('-');
}

function mapCategory(name, description) {
    const text = (name + ' ' + description).toLowerCase();

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    return 'other'; // default or unmapped
}

async function sync() {
    try {
        console.log('Fetching XML from:', XML_URL);
        const { data: xmlData } = await axios.get(XML_URL);

        console.log('Parsing XML...');
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlData);

        const offers = result.nokaut.offers.offer;
        console.log(`Found ${offers.length} products. Processing...`);

        const productsToInsert = [];

        for (const offer of offers) {
            // Filter only hair products if possible, or just Bielenda
            // Looking at the feed, it seems it contains various Bielenda products.
            const name = offer.name;
            const description = offer.description;
            const shopCategory = offer.shopcategory || '';

            // We only care about hair products for this specific task
            if (!shopCategory.toLowerCase().includes('włosy') && !name.toLowerCase().includes('włosów')) {
                continue;
            }

            const category = mapCategory(name, description);

            // Skip 'other' if we want only the 5 main categories, or keep it.
            // User asked to map to: Suche, Wypadanie, Łupież, Kręcone, Farbowane.
            if (category === 'other') continue;

            const price = parseFloat(offer.price.replace(',', '.'));

            productsToInsert.push({
                id: generateUUID(offer.id), // XML ID is numeric, table expects UUID
                name: name,
                price: price,
                category: category,
                image_url: offer.image,
                affiliate_link: offer.url,
                brand: offer.producer || 'Bielenda', // Default to Bielenda if missing
                description: description
            });
        }

        console.log(`Mapped ${productsToInsert.length} hair products. Inserting into Supabase...`);

        // Use upsert to avoid duplicates by 'id'
        const { data, error } = await supabase
            .from('products_bielenda')
            .upsert(productsToInsert, { onConflict: 'id' });

        if (error) {
            console.error('Error inserting into Supabase:', error.message);
            if (error.message.includes('row-level security')) {
                console.error('TIP: Ensure RLS is disabled for INSERT/UPSERT on "products_bielenda" for the "anon" role, or use a service_role key.');
            }
        } else {
            console.log('Successfully synchronized products!');
        }

    } catch (error) {
        console.error('Sync failed:', error.message);
    }
}

sync();
