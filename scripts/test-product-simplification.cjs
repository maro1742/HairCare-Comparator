const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: '/Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runGeminiTest() {
    console.log('--- Rozpoczynamy test Gemini dla Barwa Sunny Greece ---');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ BŁĄD: Brak klucza GEMINI_API_KEY w pliku .env.');
        return;
    }

    try {
        const { data: products, error } = await supabase
            .from('products_natura')
            .select('*')
            .ilike('name', '%Barwa Sunny Greece%')
            .limit(1);

        if (error) throw error;

        const product = products[0];

        if (!product) {
            console.log('Nie znaleziono produktu Barwa Sunny Greece.');
            return;
        }

        console.log(`\n🔹 WYBRANY PRODUKT: ${product.name}`);

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
- Z pełnego składu INCI wybierz tylko i wyłącznie 5-8 najważniejszych, prawdziwie aktywnych składników (omijając konserwanty, wodę, kompozycje zapachowe, jeśli to nie one są gwoździem programu. Chyba, że np. mocny detergent jest bardzo ważny dla klasyfikacji).
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

Opis produktu do analizy:
${product.description}

Skład INCI do ewentualnej poprawki (jeśli występuje powyżej w opisie, wywnioskuj z niego):
${product.inci || 'Brak w kolumnie INCI, poszukaj w opisie.'}
`;

        console.log('Zadaję pytanie do Gemini (gemini-2.5-flash)... proszę czekać...');

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

        console.log('\n✅ WYGENEROWANY WYNIK Z GEMINI:\n');
        console.log(JSON.stringify(jsonResult, null, 2));

        console.log('\n\n--- JAK TO BĘDZIE WYGLĄDAĆ W HTML NA STRONIE ---\n');

        const html = `
<div class="product-simplified-card">
  <!-- OPIS PRODUKTU -->
  <div class="product-benefits">
    <h3>Korzyści</h3>
    <ul>
${jsonResult.benefits.map(b => `      <li>${b}</li>`).join('\n')}
    </ul>
  </div>

  <!-- ANALIZA INCI -->
  <div class="product-inci-analysis">
    <h3>Kluczowe składniki aktywne</h3>
    <ul>
${jsonResult.key_ingredients.map(i => `      <li><strong>${i.split('—')[0].trim()}</strong> — ${i.split('—')[1]?.trim() || ''}</li>`).join('\n')}
    </ul>
  </div>
</div>
        `;
        console.log(html.trim());

    } catch (error) {
        console.error('Wystąpił błąd:', error.message || error);
    }
}

runGeminiTest();
