const axios = require('axios');
const xml2js = require('xml2js');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const XML_URL = 'https://service.weben1.com/xml/414330c8-d8bb-4527-9f7b-793b6e9cc93c.xml';
const FALLBACK_LOGO = 'https://drogerienatura.pl/static/version1770223728/frontend/Natura/hyva/pl_PL/images/logo.svg';

if (!SUPABASE_URL || (!SUPABASE_ANON_KEY && !SUPABASE_SERVICE_ROLE_KEY)) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);

const categoryKeywords = {
    'Suche': ['suche', 'zniszczon', 'regenerat', 'nawilż', 'dry', 'damaged'],
    'Wypadanie': ['wypadan', 'cienki', 'wzmocnien', 'biotyn', 'kofein', 'niacynamid', 'falls', 'thin', 'loss'],
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

function mapCategory(name, description, shopCategory) {
    const text = (name + ' ' + description + ' ' + shopCategory).toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    return 'other';
}

async function sync() {
    try {
        console.log('Fetching Drogeria Natura XML from:', XML_URL);
        const { data: xmlData } = await axios.get(XML_URL);

        console.log('Parsing XML...');
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlData);

        let offers = [];
        if (result.nokaut && result.nokaut.offers && result.nokaut.offers.offer) {
            offers = Array.isArray(result.nokaut.offers.offer) ? result.nokaut.offers.offer : [result.nokaut.offers.offer];
        } else {
            console.error('Unexpected XML structure.');
            return;
        }

        console.log(`Found ${offers.length} total products. Filtering hair products...`);

        const productsToInsert = [];

        for (const offer of offers) {
            const name = offer.name || '';
            const description = offer.description || '';
            const shopCategory = offer.shopcategory || '';

            const lowerShopCategory = shopCategory.toLowerCase();
            const lowerName = name.toLowerCase();

            // Strict filtering for Drogeria Natura to avoid non-hair products
            const isHairProduct =
                lowerShopCategory.includes('włosy') ||
                lowerShopCategory.includes('szampon') ||
                lowerShopCategory.includes('odżywka') ||
                lowerShopCategory.includes('maska') ||
                lowerName.includes('szampon') ||
                lowerName.includes('odżywka') ||
                lowerName.includes('maska do włosów') ||
                lowerName.includes('wcierka');

            if (!isHairProduct) continue;

            const category = mapCategory(name, description, shopCategory);
            // If we can't map to a specific problem category, we still keep it as 'Suche' (general) or skip if really not hair
            if (category === 'other' && !isHairProduct) continue;

            const price = parseFloat(offer.price.replace(',', '.'));

            let imageUrl = offer.image || '';
            if (!imageUrl || imageUrl.includes('placeholder')) {
                const imgMatch = description.match(/<img[^>]+src="([^">]+)"/i);
                if (imgMatch) imageUrl = imgMatch[1];
            }
            if (!imageUrl) imageUrl = FALLBACK_LOGO;

            productsToInsert.push({
                id: generateUUID(offer.id || name),
                name: name,
                price: price,
                category: category === 'other' ? 'Suche' : category,
                image_url: imageUrl,
                affiliate_link: offer.url,
                brand: offer.producer || 'Drogeria Natura',
                description: description,
                cosmetic_function: '',
                usage: '',
                ingredient_categories: '',
                inci: ''
            });
        }

        console.log(`Mapped ${productsToInsert.length} hair products. Inserting into "products_natura"...`);

        // Chunking the insert if there are many products
        const chunkSize = 100;
        for (let i = 0; i < productsToInsert.length; i += chunkSize) {
            const chunk = productsToInsert.slice(i, i + chunkSize);
            const { error } = await supabase
                .from('products_natura')
                .upsert(chunk, { onConflict: 'id' });

            if (error) {
                console.error(`Error inserting chunk ${i / chunkSize}:`, error.message);
            }
        }

        console.log('Successfully synchronized Drogeria Natura products!');

    } catch (error) {
        console.error('Sync failed:', error.message);
    }
}

sync();
