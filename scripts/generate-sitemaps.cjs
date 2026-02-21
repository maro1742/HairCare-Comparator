const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DOMAIN = 'https://wlosowa.pl';

const CATEGORIES = ['szampony', 'odzywki', 'maski', 'serum'];
const ATTRIBUTES = ['biotyna', 'keratyna', 'ceramidy', 'aloes', 'kofeina'];
const PROBLEMS = ['wypadanie', 'lupiez', 'przetluszczanie', 'suchosc', 'zniszczenie'];

function generateSitemapXml(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${DOMAIN}${url}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
}

async function generate() {
    console.log('Generating pSEO Ranking URLs...');
    const allUrls = [];

    // Category only
    CATEGORIES.forEach(c => allUrls.push(`/ranking/${c}`));

    // Category + Attribute
    CATEGORIES.forEach(c => {
        ATTRIBUTES.forEach(a => allUrls.push(`/ranking/${c}/${a}`));
    });

    // Category + Problem
    CATEGORIES.forEach(c => {
        PROBLEMS.forEach(p => allUrls.push(`/ranking/${c}/${p}`));
    });

    // Category + Attribute + Problem
    CATEGORIES.forEach(c => {
        ATTRIBUTES.forEach(a => {
            PROBLEMS.forEach(p => allUrls.push(`/ranking/${c}/${a}/${p}`));
        });
    });

    console.log(`Generated ${allUrls.length} total URLs.`);

    // Split into chunks if > 50,000 (not the case here yet, but for scalability)
    const chunkSize = 5000;
    const sitemaps = [];

    for (let i = 0; i < allUrls.length; i += chunkSize) {
        const chunk = allUrls.slice(i, i + chunkSize);
        const filename = `sitemap-pseo-${Math.floor(i / chunkSize) + 1}.xml`;
        fs.writeFileSync(`./public/${filename}`, generateSitemapXml(chunk));
        sitemaps.push(filename);
        console.log(`Created ${filename}`);
    }

    // Generate Sitemap Index
    let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemaps.forEach(s => {
        indexXml += '  <sitemap>\n';
        indexXml += `    <loc>${DOMAIN}/${s}</loc>\n`;
        indexXml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        indexXml += '  </sitemap>\n';
    });

    indexXml += '</sitemapindex>';
    fs.writeFileSync('./public/sitemap-index.xml', indexXml);
    console.log('Created sitemap-index.xml');
}

generate();
