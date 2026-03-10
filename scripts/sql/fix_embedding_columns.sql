-- 1. Usuwamy stare kolumny wektorowe
ALTER TABLE products_bielenda DROP COLUMN IF EXISTS embedding;
ALTER TABLE products_dsd_deluxe DROP COLUMN IF EXISTS embedding;
ALTER TABLE products_insight DROP COLUMN IF EXISTS embedding;
ALTER TABLE products_natura DROP COLUMN IF EXISTS embedding;

-- 2. Dodajemy nowe kolumny wektorowe z poprawnym wymiarem (3072)
ALTER TABLE products_bielenda ADD COLUMN IF NOT EXISTS embedding vector(3072);
ALTER TABLE products_dsd_deluxe ADD COLUMN IF NOT EXISTS embedding vector(3072);
ALTER TABLE products_insight ADD COLUMN IF NOT EXISTS embedding vector(3072);
ALTER TABLE products_natura ADD COLUMN IF NOT EXISTS embedding vector(3072);

-- 3. Akutalizujemy funkcję szukania do wymiaru (3072)
create or replace function match_products (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  brand text,
  table_source text,
  similarity float
)
language sql stable
as $$
  -- Ograniczamy widok tylko do produktów które mają wygenerowane wektory
  with all_products as (
    select id, name, brand, 'products_bielenda' as table_source, embedding from products_bielenda where embedding is not null
    union all
    select id, name, brand, 'products_dsd_deluxe' as table_source, embedding from products_dsd_deluxe where embedding is not null
    union all
    select id, name, brand, 'products_insight' as table_source, embedding from products_insight where embedding is not null
    union all
    select id, name, brand, 'products_natura' as table_source, embedding from products_natura where embedding is not null
  )
  select
    id,
    name,
    brand,
    table_source,
    1 - (embedding <=> query_embedding) as similarity
  from all_products
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
