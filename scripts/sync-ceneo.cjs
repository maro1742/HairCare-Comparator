const axios = require('axios');
const xml2js = require('xml2js');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();
const { getPorosityFromText } = require('../src/utils/porosityScanner.ts');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// REPLACE THIS WITH YOUR CENEO XML URL
const XML_URL = process.env.CENEO_XML_URL || '';

if (!SUPABASE_URL || (!SUPABASE_ANON_KEY && !SUPABASE_SERVICE_ROLE_KEY)) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);

const ALLOWED_BRANDS = [
    'Davines', 'Kevin Murphy', 'Joico', 'Authentic Beauty Concept',
    'Kerastase', 'Loreal', 'Matrix', 'Vichy', 'Pharmaceris', 'Radical',
    'Anwen', 'OnlyBio', 'Hair of the day', 'Vis Plantis', 'Farmona',
    'Biolage', 'Wella', 'Schwarzkopf', 'Redken', 'Olaplex', 'K18',
    'Goldwell', 'Londa', 'Milk Shake', 'Moroccanoil', 'Nioxin',
    'Phyto', 'Revlon', 'Sebastian', 'Tigi', 'Alfaparf'
];

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

// Reusing existing categorization logic (keywords only for consistency)
function mapCategory(name) {
    const nameLower = name.toLowerCase();

    // Technical priority
    if (nameLower.includes('rozjaśniacz') || nameLower.includes('rozjaśniaj') || nameLower.includes('farba') || nameLower.includes('trwała ondulacja') || nameLower.includes('utleniacz') || nameLower.includes('aktywator') || nameLower.includes('developer')) {
        return 'other';
    }

    if (nameLower.includes('szampon') || nameLower.includes('shampoo') || nameLower.includes('wash')) return 'Szampony';
    if (nameLower.includes('odżywka') || nameLower.includes('conditioner')) return 'Suche'; // Mapping to DB categories
    if (nameLower.includes('maska') || nameLower.includes('mask')) return 'Suche';
    if (nameLower.includes('wcierka') || nameLower.includes('tonik') || nameLower.includes('tonic')) return 'Wypadanie';
    if (nameLower.includes('łupież') || nameLower.includes('dandruff')) return 'Łupież';

    return 'other';
}

function extractTechnicalData(name, description) {
    const text = (name + ' ' + description).toLowerCase();

    // 1. Volume
    const volumeMatch = (name + ' ' + description).match(/(\d+)\s*(ml|l|g)/i);
    const volume = volumeMatch ? parseInt(volumeMatch[1]) : null;

    // 2. Porosity
    const porosity = getPorosityFromText(name, description);

    // 3. Category Type
    let catType = null;
    if (text.includes('szampon') || text.includes('kąpiel')) catType = 'shampoo';
    else if (text.includes('odżywka')) catType = 'conditioner';
    else if (text.includes('maska')) catType = 'mask';
    else if (text.includes('serum')) catType = 'serum';

    // 4. Season
    let season = 'all';
    if (text.includes('zima')) season = 'winter';
    else if (text.includes('lato') || text.includes('filtr uv') || text.includes('spf')) season = 'summer';
    else if (text.includes('wiosna') || text.includes('jesień')) season = 'spring_fall';

    // 5. PEH (Quick guessing)
    let peh = null;
    if (text.includes('protein')) peh = '70,20,10';
    else if (text.includes('emolient')) peh = '10,80,10';
    else if (text.includes('humektant')) peh = '10,20,70';

    return { volume, porosity, catType, season, peh };
}

async function sync() {
    if (!XML_URL) {
        console.error('Please provide CENEO_XML_URL in .env or script.');
        return;
    }

    try {
        console.log('Fetching Ceneo XML from:', XML_URL);
        const { data: xmlData } = await axios.get(XML_URL);

        console.log('Parsing XML...');
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlData);

        // Ceneo XML often uses <offers><o> or similar structure
        let offers = [];
        if (result.offers && result.offers.o) {
            offers = Array.isArray(result.offers.o) ? result.offers.o : [result.offers.o];
        } else if (result.nokaut) { // Sometimes it's a Nokaut-style feed
            offers = Array.isArray(result.nokaut.offers.offer) ? result.nokaut.offers.offer : [result.nokaut.offers.offer];
        }

        console.log(`Found ${offers.length} products. Filtering...`);

        const productsToInsert = [];

        for (const offer of offers) {
            const name = offer.name || (offer.$ && offer.$.name) || '';
            const brand = offer.producer || (offer.$ && offer.$.producer) || 'Unknown';
            const price = parseFloat(offer.price || (offer.$ && offer.$.price) || '0');
            const url = offer.url || (offer.$ && offer.$.url) || '';
            const image = offer.image || (offer.$ && offer.$.image) || '';
            const description = offer.desc || offer.description || '';

            // 1. Brand filtering
            const isAllowedBrand = ALLOWED_BRANDS.some(b => brand.toLowerCase().includes(b.toLowerCase()));
            if (!isAllowedBrand) continue;

            // 2. Haircare only filtering
            const nameLower = name.toLowerCase();
            const isHairProduct = nameLower.includes('włos') ||
                nameLower.includes('szampon') ||
                nameLower.includes('odżywka') ||
                nameLower.includes('maska') ||
                nameLower.includes('serum') ||
                nameLower.includes('olejek') ||
                nameLower.includes('wcierka');

            if (!isHairProduct) continue;

            productsToInsert.push({
                id: generateUUID(offer.id || name),
                name: name,
                price: price,
                category: mapCategory(name),
                image_url: image,
                affiliate_link: url,
                brand: brand,
                description: description,
                updated_at: new Date().toISOString(),
                // New technical comparison fields
                volume_ml: extractTechnicalData(name, description).volume,
                hair_porosity: extractTechnicalData(name, description).porosity,
                category_type: extractTechnicalData(name, description).catType,
                peh_ratio: extractTechnicalData(name, description).peh,
                recommended_season: extractTechnicalData(name, description).season
            });
        }

        console.log(`Matched ${productsToInsert.length} products. Inserting into "products_ceneo"...`);

        for (let i = 0; i < productsToInsert.length; i += 100) {
            const chunk = productsToInsert.slice(i, i + 100);
            const { error } = await supabase
                .from('products_ceneo')
                .upsert(chunk, { onConflict: 'id' });

            if (error) console.error('Error:', error.message);
        }

        console.log('Success!');

    } catch (error) {
        console.error('Sync failed:', error.message);
    }
}

sync();
