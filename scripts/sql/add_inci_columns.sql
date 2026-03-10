
ALTER TABLE products_bielenda 
  ADD COLUMN has_silicones boolean, 
  ADD COLUMN has_sulfates boolean, 
  ADD COLUMN is_cg_approved boolean, 
  ADD COLUMN has_proteins boolean, 
  ADD COLUMN has_humectants boolean, 
  ADD COLUMN has_emollients boolean, 
  ADD COLUMN peh_balance text, 
  ADD COLUMN key_ingredients jsonb;

ALTER TABLE products_dsd_deluxe 
  ADD COLUMN has_silicones boolean, 
  ADD COLUMN has_sulfates boolean, 
  ADD COLUMN is_cg_approved boolean, 
  ADD COLUMN has_proteins boolean, 
  ADD COLUMN has_humectants boolean, 
  ADD COLUMN has_emollients boolean, 
  ADD COLUMN peh_balance text, 
  ADD COLUMN key_ingredients jsonb;

ALTER TABLE products_insight 
  ADD COLUMN has_silicones boolean, 
  ADD COLUMN has_sulfates boolean, 
  ADD COLUMN is_cg_approved boolean, 
  ADD COLUMN has_proteins boolean, 
  ADD COLUMN has_humectants boolean, 
  ADD COLUMN has_emollients boolean, 
  ADD COLUMN peh_balance text, 
  ADD COLUMN key_ingredients jsonb;

ALTER TABLE products_natura 
  ADD COLUMN has_silicones boolean, 
  ADD COLUMN has_sulfates boolean, 
  ADD COLUMN is_cg_approved boolean, 
  ADD COLUMN has_proteins boolean, 
  ADD COLUMN has_humectants boolean, 
  ADD COLUMN has_emollients boolean, 
  ADD COLUMN peh_balance text, 
  ADD COLUMN key_ingredients jsonb;

ALTER TABLE products_webepartners 
  ADD COLUMN has_silicones boolean, 
  ADD COLUMN has_sulfates boolean, 
  ADD COLUMN is_cg_approved boolean, 
  ADD COLUMN has_proteins boolean, 
  ADD COLUMN has_humectants boolean, 
  ADD COLUMN has_emollients boolean, 
  ADD COLUMN peh_balance text, 
  ADD COLUMN key_ingredients jsonb;

ALTER TABLE products 
  ADD COLUMN has_silicones boolean, 
  ADD COLUMN has_sulfates boolean, 
  ADD COLUMN is_cg_approved boolean, 
  ADD COLUMN has_proteins boolean, 
  ADD COLUMN has_humectants boolean, 
  ADD COLUMN has_emollients boolean, 
  ADD COLUMN peh_balance text, 
  ADD COLUMN key_ingredients jsonb;

