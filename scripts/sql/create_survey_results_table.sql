-- Tworzenie tabeli dla wyników ankiety
CREATE TABLE IF NOT EXISTS survey_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    answers JSONB NOT NULL
);

-- Włączenie RLS
ALTER TABLE survey_results ENABLE ROW LEVEL SECURITY;

-- Polityka pozwalająca każdemu (nawet niezalogowanemu) na dodawanie rekordów
CREATE POLICY "Allow anonymous inserts to survey_results" 
ON survey_results FOR INSERT 
TO anon 
WITH CHECK (true);

-- Komentarz do tabeli
COMMENT ON TABLE survey_results IS 'Przechowuje wyniki ankiet użytkowników dotyczących nawyków pielęgnacyjnych.';
