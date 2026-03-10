const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    acc[match[1].trim()] = match[2].trim().replace(/^["'](.*)["']$/, '$1');
  }
  return acc;
}, {});

const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = [
  'products_bielenda',
  'products_dsd_deluxe',
  'products_insight',
  'products_natura',
  'products_webepartners'
];

async function check() {
  let totalAll = 0;
  let processedAll = 0;

  for (const table of TABLES) {
    const { count: total, error: err1 } = await supabase.from(table).select('id', { count: 'exact' });
    const { count: processed, error: err2 } = await supabase.from(table).select('id', { count: 'exact' }).not('key_ingredients', 'is', null);
    
    if (err1 || err2) {
      console.error(`Error in table ${table}:`, err1 || err2);
      continue;
    }
    
    totalAll += (total || 0);
    processedAll += (processed || 0);
  }
  
  console.log(`Total products: ${totalAll}`);
  console.log(`Processed products: ${processedAll}`);
  console.log(`Remaining products: ${totalAll - processedAll}`);
  
  const progress = totalAll > 0 ? ((processedAll / totalAll) * 100).toFixed(1) : 0;
  console.log(`Progress: ${progress}%`);
}

check();
