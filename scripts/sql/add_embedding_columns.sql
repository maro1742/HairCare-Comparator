
-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Add embedding columns to all tables 
ALTER TABLE products_bielenda ADD COLUMN IF NOT EXISTS embedding vector(768);
ALTER TABLE products_dsd_deluxe ADD COLUMN IF NOT EXISTS embedding vector(768);
ALTER TABLE products_insight ADD COLUMN IF NOT EXISTS embedding vector(768);
ALTER TABLE products_natura ADD COLUMN IF NOT EXISTS embedding vector(768);
ALTER TABLE products_webepartners ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create a function to search for products
create or replace function match_products (
  query_embedding vector(768),
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
  -- Combine all tables that have the embedding column
  with all_products as (
    select id, name, brand, 'products_bielenda' as table_source, embedding from products_bielenda where embedding is not null
    union all
    select id, name, brand, 'products_dsd_deluxe' as table_source, embedding from products_dsd_deluxe where embedding is not null
    union all
    select id, name, brand, 'products_insight' as table_source, embedding from products_insight where embedding is not null
    union all
    select id, name, brand, 'products_natura' as table_source, embedding from products_natura where embedding is not null
    -- skip products_webepartners if it doesn't exist yet, but included for completeness
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

