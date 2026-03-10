const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: '/Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Using a small batch approach to prevent rate limiting
const BATCH_SIZE = 5;
const DELAY_MS = 3000;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function processProduct(product, tableName) {
    if (!product.description || product.description.length < 50) {
        console.log(`Skipping ${product.id} : ${product.name} - description too short`);
        return null;
    }
    
    // Check if we already processed it (assuming we add a column simplified_data of type JSONB)
    if (product.simplified_data) {
        console.log(`Skipping ${product.id} : ${product.name} - already processed`);
        return null;
    }

    const prompt = `
Działaj jako UI/UX Content Designer dla sklepu z kosmetykami do włosów.
Twoim zadaniem jest radykalne uproszczenie treści (opis i skład) karty dla następującego produktu: ${product.name}

CEL: Skrócenie czasu zapoznania się z produktem o 50%.

Wytyczne dla OPISU:
- Skróć opis do maksymalnie 3-4 najbardziej przykuwających uwagę korzyści.
- Skup się na efektach wizualnych i typie włosów (np. "Dla wysokoporowatych", "Efekt tafli").
- Usuń przymiotniki marketingowe, zostaw konkrety.
- Do każdej korzyści dodaj na początku odpowiednią ikonkę Emoji.

Wytyczne dla INCI:
- Z pełnego składu INCI wybierz tylko i wyłącznie 5-8 najważniejszych, prawdziwie aktywnych składników.
- Zastosuj format: [Nazwa INCI] — [Krótka funkcja: np. Emolient, Humektant, Protein, Nawilżacz, Mocny detergent, Łagodny detergent].
- Całkowicie usuń długie opisy pochodzenia składników.

Zwróć odpowiedź w CZYSTYM FORMACIE JSON bez żadnych dodatkowych znaczników markdown, według poniższego schematu:

{
  "benefits": [
    "💧 **Dla suchych i łamliwych:** Intensywne nawilżenie bez obciążenia.",
    "✨ **Odbudowa:** Ekstrakty z oliwek przywracają jedwabistą gładkość."
  ],
  "key_ingredients": [
    "Ammonium Lauryl Sulfate — Mocny detergent (Oczyszczanie)",
    "Betaine — Humektant (Nawilżanie)",
    "Olea Europaea Fruit Extract — Emolient (Odżywienie)"
  ]
}

Pamiętaj o formacie JSON.

Opis produktu do analizy (UWAGA - spacje mogą być "sklejone", zignoruj to pod kątem logiki):
${product.description}

Skład INCI do wyodrębnienia bazy:
${product.inci || 'Brak w kolumnie INCI, poszukaj w opisie.'}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
            }
        });

        const resultText = response.text;
        const jsonResult = JSON.parse(resultText);
        
        // Update to supabase
        const { error } = await supabase
            .from(tableName)
            .update({ simplified_data: jsonResult })
            .eq('id', product.id);
            
        if (error) {
             console.error(`DB Update Error for ${product.id} :`, error.message);
        } else {
             console.log(`✅ Success for ${product.name}`);
        }
        return jsonResult;
        
    } catch (error) {
        console.error(`Gemini Error for ${product.name}:`, error.message || error);
        return null;
    }
}

async function run() {
    console.log('--- Rozpoczynamy upraszczanie bazy produktów ---');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ BŁĄD: Brak klucza GEMINI_API_KEY w pliku .env.');
        return;
    }
    
    // First, let's create the column if it doesn't exist via raw SQL if possible, 
    // or we just rely on users making it later/us skipping if fails.
    console.log("Aby to zadziałało, musisz upewnić się, że w każdej tabeli istnieje kolumna: simplified_data (typ JSONB)\n");

    const tablesToProcess = ['products_natura', 'products_bielenda', 'products_dsd_deluxe', 'products_insight', 'products_notino', 'products_ceneo'];
    
    for (const table of tablesToProcess) {
        console.log(`\n\nPrzetwarzanie tabeli: ${table}`);
        
        // Fetch products
        const { data: products, error } = await supabase
            .from(table)
            .select('id, name, description, inci, simplified_data')
            .is('simplified_data', null)
            // Limit just for safety
            .limit(1000);
            
        if (error || !products) {
            console.log(`Pominięto ${table} (brak dostępu lub nie istnieje)`);
            continue;
        }
        
        console.log(`Znaleziono ${products.length} produktów do uproszczenia w ${table}`);
        
        for (let i = 0; i < products.length; i++) {
            await processProduct(products[i], table);
            await delay(DELAY_MS); // Be nice to Gemini API
        }
    }
    
    console.log("Gotowe.");
}

run();
