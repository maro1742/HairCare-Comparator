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

function extractFromDescription(html, sectionTitle) {
    if (!html) return '';

    const lowerHtml = html.toLowerCase();
    const searchTerms = sectionTitle.toLowerCase().split('|');

    let startIndex = -1;
    let titleLength = 0;

    for (const term of searchTerms) {
        const idx = lowerHtml.indexOf(term);
        if (idx !== -1) {
            startIndex = idx;
            titleLength = term.length;
            break;
        }
    }

    if (startIndex === -1) return '';

    // Find the end of the header tag (e.g., </strong>, </h3>, </b>, or ###)
    let contentStart = html.indexOf('>', startIndex);
    if (contentStart === -1 || contentStart > startIndex + titleLength + 20) {
        contentStart = startIndex + titleLength;
    } else {
        contentStart += 1;
    }

    // Find the next likely header or the end of a major block
    // We look for ### or <h[1-6] or <strong> or <b> that looks like a header (contains one of the typical section start words)
    const nextHeaderRegex = /(?:###|<h[1-6][^>]*>|<strong[^>]*>\s*(?:Jak|Sposób|Co|Odkryj|Działanie|Rezultat|Składniki|Skład|Wskazania|Dla|UWAGA|Protip|INCI|Ingredients)|<b[^>]*>\s*(?:Jak|Sposób|Co|Odkryj|Działanie|Rezultat|Składniki|Skład|Wskazania|INCI|Ingredients))/i;
    const rest = html.substring(contentStart);
    const nextMatch = rest.match(nextHeaderRegex);

    let contentEnd = nextMatch ? nextMatch.index : rest.length;
    let content = rest.substring(0, contentEnd);

    // Clean up content: remove HTML, normalize space, remove leading punctuation
    return content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/^[:\s-]+/, '').trim();
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
            const name = offer.name;
            const description = offer.description;
            const shopCategory = offer.shopcategory || '';

            if (!shopCategory.toLowerCase().includes('włosy') && !name.toLowerCase().includes('włosów')) {
                continue;
            }

            const category = mapCategory(name, description);
            if (category === 'other') continue;

            const price = parseFloat(offer.price.replace(',', '.'));

            // Extraction patterns
            const usage = extractFromDescription(description, 'Jak mnie stosować|Sposób użycia|Stosowanie|Aplikacja|Usage') ||
                extractFromDescription(description, 'Jak używać');

            const cosmeticFunction = extractFromDescription(description, 'Co mogę Ci zaoferować|Działanie|Jak działa|Właściwości') ||
                extractFromDescription(description, 'Dlaczego warto');

            const ingredientCats = extractFromDescription(description, 'Odkryj moje wnętrze|Składniki aktywne|W moim składzie znajdziesz');

            const inciMatch = description.match(/(?:\bINCI\b|Skład \(INCI\)|Skład|Ingredients):?\s*<\/strong>[:\s-]*([\s\S]*?)(?=<br|<p|<\/p|###|$)/i) ||
                description.match(/(?:\bINCI\b|Skład \(INCI\)|Skład|Ingredients):?\s*<\/h[1-6]>[:\s-]*([\s\S]*?)(?=<br|<p|<\/p|###|$)/i) ||
                description.match(/(?:\bINCI\b|Skład \(INCI\)|Skład|Ingredients):?[:\s-]*([\s\S]*?)(?=<br|<p|<\/p|###|$)/i);

            let inci = inciMatch ? inciMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

            // Post-process INCI to remove headers and validate content
            if (inci && (inci.toLowerCase().startsWith('nikon') || inci.toLowerCase().startsWith('nikom'))) {
                inci = ''; // Filter out false positives like "Składnikom..."
            }

            if (productsToInsert.length < 3) {
                console.log(`Debug extraction for "${name}":`);
                console.log(`  Usage: ${usage.substring(0, 50)}...`);
                console.log(`  Function: ${cosmeticFunction.substring(0, 50)}...`);
                console.log(`  INCI: ${inci.substring(0, 50)}...`);
            }

            productsToInsert.push({
                id: generateUUID(offer.id),
                name: name,
                price: price,
                category: category,
                image_url: offer.image,
                affiliate_link: offer.url,
                brand: offer.producer || 'Bielenda',
                description: description,
                // New premium fields
                cosmetic_function: cosmeticFunction,
                usage: usage,
                ingredient_categories: ingredientCats,
                inci: inci
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
