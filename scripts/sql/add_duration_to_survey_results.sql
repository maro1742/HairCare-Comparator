-- Dodanie kolumny duration_seconds do tabeli survey_results
ALTER TABLE survey_results 
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- Komentarz do kolumny
COMMENT ON COLUMN survey_results.duration_seconds IS 'Czas wypełniania ankiety w sekundach.';
