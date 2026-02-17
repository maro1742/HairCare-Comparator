const axios = require('axios');
const xml2js = require('xml2js');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const XML_URL = 'https://service.weben1.com/xml/42a7e637-65e5-445a-b617-3c2e82540346.xml';
const FALLBACK_LOGO = 'https://dsddeluxe.com/img/logo.png';

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

function mapCategory(name, description) {
    const text = (name + ' ' + description).toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    return 'other';
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

    let contentStart = html.indexOf('>', startIndex);
    if (contentStart === -1 || contentStart > startIndex + titleLength + 20) {
        contentStart = startIndex + titleLength;
    } else {
        contentStart += 1;
    }

    const nextHeaderRegex = /(?:###|<h[1-6][^>]*>|<strong[^>]*>\s*(?:Jak|Sposób|Co|Odkryj|Działanie|Rezultat|Składniki|Skład|Wskazania|Dla|UWAGA|Protip|INCI|Ingredients)|<b[^>]*>\s*(?:Jak|Sposób|Co|Odkryj|Działanie|Rezultat|Składniki|Skład|Wskazania|INCI|Ingredients))/i;
    const rest = html.substring(contentStart);
    const nextMatch = rest.match(nextHeaderRegex);

    let contentEnd = nextMatch ? nextMatch.index : rest.length;
    let content = rest.substring(0, contentEnd);

    return content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/^[:\s-]+/, '').trim();
}

async function sync() {
    try {
        console.log('Fetching DSD Deluxe XML from:', XML_URL);
        const { data: xmlData } = await axios.get(XML_URL);

        console.log('Parsing XML...');
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlData);

        // Standard Nokaut/WebePartners structure check
        let offers = [];
        if (result.nokaut && result.nokaut.offers && result.nokaut.offers.offer) {
            offers = Array.isArray(result.nokaut.offers.offer) ? result.nokaut.offers.offer : [result.nokaut.offers.offer];
        } else {
            console.error('Unexpected XML structure. Root keys:', Object.keys(result));
            return;
        }

        console.log(`Found ${offers.length} products. Processing...`);

        const productsToInsert = [];

        for (const offer of offers) {
            const name = offer.name || '';
            const description = offer.description || '';

            // Basic filtering to ensure we only get hair products if the feed is mixed
            const category = mapCategory(name, description);
            if (category === 'other' && !name.toLowerCase().includes('dsd')) continue;

            const price = parseFloat(offer.price.replace(',', '.'));

            // Image extraction strategy:
            // 1. Try standard gift <image> tag
            // 2. Try to find <img> in description
            // 3. Fallback to official logo
            let imageUrl = offer.image || '';
            if (!imageUrl || imageUrl.includes('placeholder')) {
                const imgMatch = description.match(/<img[^>]+src="([^">]+)"/i);
                if (imgMatch) {
                    imageUrl = imgMatch[1];
                }
            }
            if (!imageUrl) {
                imageUrl = FALLBACK_LOGO;
            }

            // Extraction patterns
            const usage = extractFromDescription(description, 'Jak aplikować|Jak stosować|Sposób użycia|Stosowanie|Usage|Aplikacja') ||
                extractFromDescription(description, 'Jak używać');

            const cosmeticFunction = extractFromDescription(description, 'Działanie|Rezultaty|Funkcja|Action|Właściwości') ||
                extractFromDescription(description, 'Dlaczego warto');

            const ingredientCats = extractFromDescription(description, 'Składniki aktywne|Active ingredients|W składzie');

            const inciMatch = description.match(/(?:INCI|Skład \(INCI\)|Skład|Ingredients):?\s*<\/strong>[:\s-]*([\s\S]*?)(?=<br|<p|<\/p|###|$)/i) ||
                description.match(/(?:INCI|Skład \(INCI\)|Skład|Ingredients):?\s*<\/h[1-6]>[:\s-]*([\s\S]*?)(?=<br|<p|<\/p|###|$)/i) ||
                description.match(/(?:INCI|Skład \(INCI\)|Skład|Ingredients):?[:\s-]*([\s\S]*?)(?=<br|<p|<\/p|###|$)/i);
            const inci = inciMatch ? inciMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

            productsToInsert.push({
                id: generateUUID(offer.id || name),
                name: name,
                price: price,
                category: category === 'other' ? 'Suche' : category, // Default for DSD if unknown
                image_url: imageUrl,
                affiliate_link: offer.url,
                brand: offer.producer || 'DSD de Luxe',
                description: description,
                cosmetic_function: cosmeticFunction,
                usage: usage,
                ingredient_categories: ingredientCats,
                inci: inci
            });
        }

        console.log(`Mapped ${productsToInsert.length} DSD products. Inserting into Supabase table "products_dsd_deluxe"...`);

        const { data, error } = await supabase
            .from('products_dsd_deluxe')
            .upsert(productsToInsert, { onConflict: 'id' });

        if (error) {
            console.error('Error inserting into Supabase:', error.message);
        } else {
            console.log('Successfully synchronized DSD Deluxe products!');
        }

    } catch (error) {
        console.error('Sync failed:', error.message);
    }
}

sync();
