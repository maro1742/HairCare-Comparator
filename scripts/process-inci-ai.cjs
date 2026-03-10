const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Brak kluczy Supabase w pliku .env!');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// Tabele do przeanalizowania
const TABLES = [
    'products_bielenda',
    'products_dsd_deluxe',
    'products_insight',
    'products_natura',
    'products_webepartners'
];

async function processInciWithGemini(inci) {
    if (!ai) {
        console.error("Brak klucza API Gemini (ai is null)");
        return null;
    }
    if (!inci || inci.length < 10) {
        console.error(`INCI zbyt krotkie lub null: ${inci}`);
        return null;
    }

    try {
        const prompt = `
Jesteś bardzo doświadczonym trychologiem, chemikiem kosmetycznym (kosmetologiem) i specjalistą od analizy składów INCI kosmetyków do włosów.
Przeanalizuj uważnie poniższy skład INCI produktu i zwróć odpowiedź w formacie JSON bez znaczników markdown.

Zwróć dokładnie taki schemat JSON:
{
  "has_silicones": boolean,
  "has_sulfates": boolean,
  "is_cg_approved": boolean,
  "has_proteins": boolean,
  "has_humectants": boolean,
  "has_emollients": boolean,
  "peh_balance": string (np. "E", "PE", "EH", "PEH", "H", "P"),
  "key_ingredients": array of strings (wymień 3-5 najważniejszych aktywnych składników/ekstraktów)
}

Reguły dla Ciebie:
- has_silicones: true jeśli widzisz Dimethicone, Amodimethicone, Cyclopentasiloxane, itp. (Pamiętaj o lotnych i zmywalnych silikonach - wszystko to silikony).
- has_sulfates: true jeśli widzisz Sodium Laureth Sulfate (SLES), Sodium Lauryl Sulfate (SLS), Ammonium Lauryl Sulfate itp. Zwykłe łagodne detergenty (np. Cocamidopropyl Betaine, Coco-Glucoside) to NIE są siarczany.
- is_cg_approved: true jeśli skład NIE zawiera 'złych' alkoholi (np. Alcohol Denat., Isopropyl Alcohol), silikonów nierozpuszczalnych w wodzie, wosków i mocnych detergentów (sulfates).
- has_proteins: true jeśli zawiera hydrolizowane białka, keratynę, jedwab, owies, pszenicę (np. Hydrolyzed Keratin, Hydrolyzed Wheat Protein, Amino Acids).
- has_humectants: true jeśli zawiera np. Glycerin, Panthenol, Hyaluronic Acid, Aloe, Propylene Glycol, Miód.
- has_emollients: true jeśli zawiera oleje, masła, alkohole tłuszczowe (np. Cetearyl Alcohol, Cetyl Alcohol), lanolinę, silikony.
- peh_balance: Wywnioskuj na podstawie pierwszych pozycji w składzie (po wodzie). Często odżywki są 'E', 'PE', lub 'PEH'.

Skład INCI do analizy:
${inci}
        `;

        let retryCount = 0;
        let response = null;

        while (retryCount < 5) {
            try {
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        temperature: 0.1,
                        responseMimeType: "application/json",
                    }
                });
                break;
            } catch (err) {
                if (err.status === 503 || err.status === 429) {
                    retryCount++;
                    const waitTime = (retryCount * 5000) + Math.floor(Math.random() * 2000);
                    console.warn(`⏳ Gemini zajęty (Status ${err.status}). Ponowna próba ${retryCount}/5 za ${waitTime / 1000}s...`);
                    await new Promise(res => setTimeout(res, waitTime));
                } else {
                    console.error("Nieznany błąd AI:", err);
                    throw err;
                }
            }
        }

        if (!response) {
            console.error("Brak odpowiedzi po 5 próbach (!response)");
            return null;
        }

        try {
            return JSON.parse(response.text);
        } catch (jsonErr) {
            console.error("Błąd parsowania JSON odpowiedzi:", response.text);
            return null;
        }
    } catch (e) {
        console.error("❌ Błąd przetwarzania INCI w Gemini:", e.message);
        return null; // Zwracamy null zeby ewentualnie sprobowac jeszcze raz na innym przelocie
    }
}

async function getEmbedding(text) {
    if (!ai || !text || text.length < 5) return null;
    try {
        let retryCount = 0;
        while (retryCount < 5) {
            try {
                const result = await ai.models.embedContent({
                    model: 'gemini-embedding-001',
                    contents: text,
                });
                return result.embeddings[0].values;
            } catch (err) {
                if (err.status === 503 || err.status === 429) {
                    retryCount++;
                    const waitTime = (retryCount * 2000) + Math.floor(Math.random() * 1000);
                    console.warn(`⏳ Gemini Embedding zajęty (Status ${err.status}). Próba ${retryCount}/5...`);
                    await new Promise(res => setTimeout(res, waitTime));
                } else {
                    throw err;
                }
            }
        }
        return null;
    } catch (e) {
        console.error("❌ Błąd wektoryzacji INCI w Gemini:", e.message);
        return null;
    }
}

async function runWorker() {
    console.log("=========================================");
    console.log("🤖 Rozpoczynam AI Worker analizy INCI + Wektoryzacji");
    console.log("=========================================\n");

    if (!ai) {
        console.error('Brak GEMINI_API_KEY! Proces Worker zakończony.');
        return;
    }

    for (const table of TABLES) {
        let hasMore = true;

        while (hasMore) {
            console.log(`\nSzukam produktów wymagających AI w tabeli: ${table}`);

            // Pobieramy produkty które NIE mają INCI jsona ALBO NIE mają wektora
            const { data: products, error } = await supabase
                .from(table)
                .select('id, name, inci, has_silicones, embedding')
                .not('inci', 'is', null)       // Musi mieć jakiś skład
                .neq('inci', '')                 // Nie pusty string
                .or('has_silicones.is.null,embedding.is.null') // Brakuje JSONA lub Wektora
                .limit(50);                      // Batch = 50 

            if (error) {
                console.error(`Błąd pobierania baz danych ${table}:`, error.message);
                hasMore = false;
                continue;
            }

            if (!products || products.length === 0) {
                console.log(`✅ Wszystkie produkty z INCI w ${table} są już pomyślnie przetworzone i wektoryzowane.`);
                hasMore = false;
                continue;
            }

            console.log(`Pobrano paczkę (${table}): ${products.length} produktów.`);

            for (let i = 0; i < products.length; i++) {
                const p = products[i];
                console.log(`[${i + 1}/${products.length}] Analiza/Wektoryzacja: ${p.name.substring(0, 50)}...`);

                let aiData = null;
                let embeddingData = null;

                // 1. Jeśli brakuje JSONA INCI to go pobieramy
                if (p.has_silicones === null) {
                    aiData = await processInciWithGemini(p.inci);
                    
                    if (!aiData) {
                        if (!p.inci || p.inci.trim().length < 10) {
                            console.log("⚠️ INCI za krótkie lub puste. Oznaczam jako pominięte (false).");
                            aiData = {
                                has_silicones: false,
                                has_sulfates: false,
                                is_cg_approved: false,
                                has_proteins: false,
                                has_humectants: false,
                                has_emollients: false,
                                peh_balance: "Brak",
                                key_ingredients: []
                            };
                        } else {
                            console.log("🛑 API Gemini JSON nie odpowiedziało. Czekam 60 sekund przejściowo!");
                            await new Promise(res => setTimeout(res, 60000));
                            continue; // Przerwij iteracje, spróbuj in that product next loop!
                        }
                    }
                }

                // 2. Jeśli brakuje Wektora to go pobieramy
                if (p.embedding === null) {
                    const textToEmbed = `Nazwa: ${p.name}\nINCI: ${p.inci}`;
                    embeddingData = await getEmbedding(textToEmbed);
                    
                    if (!embeddingData) {
                        console.log("🛑 API Gemini Wektor nie odpowiedziało. Czekam 60s przejściowo!");
                        await new Promise(res => setTimeout(res, 60000));
                        continue;
                    }
                }

                // 3. Budujemy co chcemy zaktualizować
                let updatePayload = {};
                if (aiData) {
                    updatePayload = {
                        has_silicones: aiData.has_silicones,
                        has_sulfates: aiData.has_sulfates,
                        is_cg_approved: aiData.is_cg_approved,
                        has_proteins: aiData.has_proteins,
                        has_humectants: aiData.has_humectants,
                        has_emollients: aiData.has_emollients,
                        peh_balance: aiData.peh_balance,
                        key_ingredients: aiData.key_ingredients
                    };
                }
                if (embeddingData) {
                    updatePayload.embedding = embeddingData;
                }

                if (Object.keys(updatePayload).length > 0) {
                    const { error: updateError } = await supabase
                        .from(table)
                        .update(updatePayload)
                        .eq('id', p.id);

                    if (updateError) {
                        console.error("❌ Błąd zapisu do Supabase:", updateError.message);
                    } else {
                        console.log("✅ Zapisano tagi/wektor do bazy.");
                    }
                }

                // UWAGA: Limit darmowego API Gemini to przeważnie 15 zapytań na minutę.
                // Przy ew. 2 requestach do tego samego projektu, czekamy po prostu nieco dłużej (min. 5000ms).
                await new Promise(res => setTimeout(res, 5200));
            }
        }
    }

    console.log("\n✅ Ai Worker zakończył swoją pracę.");
}

runWorker();
