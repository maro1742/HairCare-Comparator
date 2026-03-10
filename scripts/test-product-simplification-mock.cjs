// Script do mockowania pobierania uproszczonego produktu do testow renderowania
require('dotenv').config({ path: '/Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runMock() {
    const jsonResult = {
      benefits: [
        "💧 **Intensywne nawilżenie:** Idealny dla włosów suchych i łamliwych.",
        "✨ **Zdrowy blask i miękkość:** Przywraca jedwabistą gładkość i sprężystość.",
        "🌿 **Delikatne oczyszczanie:** Skutecznie usuwa zanieczyszczenia bez obciążania."
      ],
      key_ingredients: [
        "Sodium Coco-Sulfate — Mocny detergent (Oczyszczanie)",
        "Cocamidopropyl Betaine — Łagodny detergent (Oczyszczanie)",
        "Glycerin / Betaine — Humektanty (Nawilżanie)",
        "Panthenol — Nawilżacz (Wzmocnienie)",
        "Olea Europaea Fruit Extract — Emolient (Odżywienie z oliwek)",
        "Vitis Vinifera Fruit Extract — Antyoksydant (Ochrona z winogron)",
        "Polyquaternium-10 — Kondycjoner (Wygładzenie)"
      ]
    };

    const { error } = await supabase
        .from('products_natura')
        .update({ simplified_data: jsonResult })
        .eq('name', 'Barwa Sunny Greece Szampon Nawilżający 380 ml');
        
    if (error) {
         console.error(`DB Update Error:`, error.message);
    } else {
         console.log(`✅ Success mock update for Barwa Sunny Greece`);
    }
}
runMock();
