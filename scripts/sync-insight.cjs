const axios = require('axios');
const xml2js = require('xml2js');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const XML_URL = 'https://service.weben1.com/xml/b0bbabf9-7d69-4e5d-9d86-3af95d0d8c55.xml';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const categoryKeywords = {
    'Suche': ['suchych', 'nawilż', 'dry', 'regenerat', 'odżywcz', 'damaged', 'matowe'],
    'Wypadanie': ['wypadan', 'stymul', 'gęstość', 'loss', 'cebulki', 'falls'],
    'Łupież': ['łupież', 'przeciwłupież', 'oczyszcz', 'dandruff', 'scalp', 'detox'],
    'Kręcone': ['skręt', 'kręcon', 'loki', 'curly'],
    'Farbowane': ['farbowan', 'koloru', 'colored', 'bleached', 'blond']
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
    return 'other';
}

function extractTechnicalData(name, description) {
    const text = (name + ' ' + description).toLowerCase();
    const volumeMatch = (name + ' ' + description).match(/(\d+)\s*(ml|l|g)/i);
    const volume = volumeMatch ? parseInt(volumeMatch[1]) : null;

    let catType = null;
    if (text.includes('szampon') || text.includes('kąpiel')) catType = 'shampoo';
    else if (text.includes('odżywka')) catType = 'conditioner';
    else if (text.includes('maska')) catType = 'mask';
    else if (text.includes('serum') || text.includes('olejek')) catType = 'serum';

    // PEH Guessing
    let peh = null;
    if (text.includes('protein')) peh = '60,20,20';
    else if (text.includes('emolient') || text.includes('olej') || text.includes('masło')) peh = '10,70,20';
    else if (text.includes('humektant') || text.includes('nawilż')) peh = '20,10,70';

    return { volume, catType, peh };
}

function extractFromDescription(html, sectionTitle) {
    if (!html) return '';
    const searchTerms = sectionTitle.toLowerCase().split('|');

    for (const term of searchTerms) {
        const regex = new RegExp(`${term}[:\\s-]*([^<]*?)(?=<br|<p|<\/h|###|$)`, 'i');
        const match = html.match(regex);
        if (match && match[1].trim()) {
            return match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        }
    }
    return '';
}

async function sync() {
    try {
        console.log('Fetching Insight XML...');
        const { data: xmlData } = await axios.get(XML_URL);
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlData);

        let offers = result.nokaut.offers.offer;
        if (!Array.isArray(offers)) offers = [offers];

        console.log(`Found ${offers.length} products. Mapping...`);

        const productsToInsert = offers.map(offer => {
            const name = offer.name || '';
            const description = offer.description || '';
            const tech = extractTechnicalData(name, description);

            const usage = extractFromDescription(description, 'Sposób użycia|Stosowanie|Usage|Zastosowanie');
            const inciMatch = description.match(/(?:\bINCI\b|Skład|Ingredients):?\s*([\s\S]*?)(?=<br|<p|<\/p|###|Tego tutaj nie znajdziesz|$)/i);
            const inci = inciMatch ? inciMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

            return {
                id: generateUUID(offer.id),
                name: name,
                price: parseFloat(offer.price),
                category: mapCategory(name, description),
                image_url: offer.image,
                affiliate_link: offer.url,
                brand: offer.producer || 'Insight',
                description: description,
                usage: usage,
                inci: inci,
                volume_ml: tech.volume,
                category_type: tech.catType,
                peh_ratio: tech.peh,
                updated_at: new Date().toISOString()
            };
        });

        console.log(`Upserting ${productsToInsert.length} products to "products_insight"...`);

        const chunkSize = 50;
        for (let i = 0; i < productsToInsert.length; i += chunkSize) {
            const chunk = productsToInsert.slice(i, i + chunkSize);
            const { error } = await supabase.from('products_insight').upsert(chunk, { onConflict: 'id' });
            if (error) {
                console.error(`Chunk error:`, error.message);
            }
        }

        console.log('Sync completed successfully!');

    } catch (error) {
        console.error('Sync failed:', error.message);
    }
}

sync();
