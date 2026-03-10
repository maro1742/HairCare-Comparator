const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini API
// You'll need to set GEMINI_API_KEY in your .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runGeminiTest() {
    console.log('--- Rozpoczynamy test Gemini na produkcie z innej bazy afiliacyjnej (DSD deLuxe) ---');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ BŁĄD: Brak klucza GEMINI_API_KEY w pliku .env.');
        console.log('Utwórz klucz w Google AI Studio (aistudio.google.com) i dodaj: GEMINI_API_KEY=twoj_klucz do .env');
        return;
    }

    try {
        // Pobieramy 1 produkt np. z bazy Insight który na pewno ma skomplikowany skład INCI (np. szampon lub balsam)
        const { data: products, error } = await supabase
            .from('products_insight')
            .select('id, name, inci, description')
            .not('inci', 'is', null)
            .limit(10);

        if (error) throw error;

        // Szukamy produktu z najdłuższym INCI żeby było co analizować
        const product = products.reduce((prev, current) =>
            (current.inci.length > (prev.inci || '').length) ? current : prev
            , {});

        if (!product || !product.inci) {
            console.log('Nie znaleziono odpowiedniego produktu z INCI w bazie insight.');
            return;
        }

        console.log(`\n🔹 WYBRANY PRODUKT: ${product.name}`);
        console.log(`ID: ${product.id}`);
        console.log(`\n🔹 ORYGINALNE INCI:\n${product.inci}\n`);

        console.log('Zadaję pytanie do Gemini (gemini-2.5-flash)... proszę czekać...');

        // Prompt do modelu
        const prompt = `
Jesteś bardzo doświadczonym trychologiem, chemikiem kosmetycznym (kosmetologiem) i specjalistą od analizy składów INCI kosmetyków do włosów.
Przeanalizuj uważnie poniższy skład INCI produktu i zwróć odpowiedź w czystym formacie JSON bez znaczników markdown.

Zwróć dokładnie taki schemat JSON:
{
  "has_silicones": boolean,
  "has_sulfates": boolean,
  "is_cg_approved": boolean,
  "has_proteins": boolean,
  "has_humectants": boolean,
  "has_emollients": boolean,
  "peh_balance": string (np. "E", "PE", "EH", "PEH", "H", "P"),
  "key_ingredients": array of strings (wymień 3-5 najważniejszych aktywnych składników/ekstraktów w języku polskim)
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
${product.inci}
    `;

        // Wywołanie Gemini API używając JSON schema w nowym SDK GoogleGenAI
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1,
                responseMimeType: "application/json",
            }
        });

        const resultText = response.text;
        console.log('✅ Otrzymano odpowiedź z Gemini!');

        // Formatowanie JSON do pięknego wyświetlenia
        const jsonResult = JSON.parse(resultText);
        console.log('\n🔹 EKSTRAKCJA CECH (GEMINI JSON):');
        console.dir(jsonResult, { depth: null, colors: true });

        console.log('\nWyobraź sobie, że teraz aktualizujemy ten produkt w Supabase:');
        console.log(`supabase.from('products_dsd_deluxe').update({ filters: \n${JSON.stringify(jsonResult, null, 2)}\n }).eq('id', '${product.id}')`);
        console.log('Pozwoli to na bezbłędne filtrowanie po twardych cechach w aplikacji!');

    } catch (error) {
        console.error('Wystąpił błąd:', error.message || error);
        if (error.status === 429) {
            console.log('Zbyt wiele zapytań do API (lub limit per minute).');
        }
    }
}

runGeminiTest();
