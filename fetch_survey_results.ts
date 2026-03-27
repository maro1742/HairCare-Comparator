import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchResults() {
  const { data, error } = await supabase
    .from('survey_results')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching survey results:', error);
    return;
  }

  console.log('Survey Results:');
  const formattedData = data.map(r => ({
    id: r.id.substring(0, 8) + '...',
    created_at: r.created_at,
    answers: r.answers.map((a: any) => `${a.questionId}: ${a.answer ? 'YES' : 'NO'}`).join(', ')
  }));
  console.table(formattedData);
}

fetchResults();
