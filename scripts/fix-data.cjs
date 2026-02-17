const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixJohnFriedaMask() {
    const inci = "Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Dimethicone, Cetyl Esters, Dipropylene Glycol, Citrus Limon Peel Oil, Phenyl Trimethicone, Parfum, Isopropyl Palmitate, Propylene Glycol, Panthenol, Quaternium-80, Dimethicone PEG-8 Meadowfoamate, Disodium EDTA, Stearoxypropyl Dimethylamine, C14-28 Isoalkyl Acid, Glycine, Glycerin, Bis-Methoxypropylamido Isodocosane, Succinic Acid, C14-28 Alkyl Acid, Hydrolyzed Keratin, Stearyl Alcohol, Sodium Hydroxide, Vitis Vinifera Juice Extract, Chamomilla Recutita Flower Extract, Citrus Limon Fruit Extract, Helianthus Annuus Extract, Alcohol, PEG-40 Hydrogenated Castor Oil, Tocopherol, Vitis Vinifera Seed Extract, Benzoic Acid, Methylchloroisothiazolinone, Phenoxyethanol, Methylisothiazolinone, Potassium Sorbate, Diazolidinyl Urea, Methylparaben, Propylparaben, Citral, Limonene, CI 19140.";

    console.log('Patching John Frieda Maska Rozjaśniająca...');

    // Find ID first to be safe
    const { data: products, error: findError } = await supabase
        .from('products_bielenda')
        .select('id, name')
        .ilike('name', '%John Frieda%')
        .ilike('name', '%rozjaśniaja%');

    if (findError) {
        console.error('Error finding product:', findError);
        return;
    }

    if (!products || products.length === 0) {
        console.log('Product not found in products_bielenda table.');
        return;
    }

    for (const p of products) {
        console.log(`Updating ${p.name} (ID: ${p.id})...`);
        const { error: updateError } = await supabase
            .from('products_bielenda')
            .update({ inci: inci })
            .eq('id', p.id);

        if (updateError) {
            console.error(`Error updating product ${p.id}:`, updateError);
        } else {
            console.log(`Successfully updated ${p.name}`);
        }
    }
}

fixJohnFriedaMask();
