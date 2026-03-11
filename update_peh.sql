UPDATE products_bielenda
SET peh_balance =
    CASE
        WHEN name ILIKE '%keratyn%' OR name ILIKE '%jedwab%' OR name ILIKE '%peptyd%' OR name ILIKE '%kolagen%' OR name ILIKE '%pszenic%' OR name ILIKE '%owies%' OR name ILIKE '%soj%' OR name ILIKE '%mlek%' OR name ILIKE '%ryż%'
          OR description ILIKE '%keratin%' OR description ILIKE '%silk%' OR description ILIKE '%protein%' OR description ILIKE '%collagen%' OR description ILIKE '%elastin%' OR description ILIKE '%wheat%' OR description ILIKE '%soy%' OR description ILIKE '%oat%' OR description ILIKE '%amino acid%' OR description ILIKE '%milk%'
        THEN 'P'
        ELSE ''
    END
    ||
    CASE
        WHEN name ILIKE '%olej%' OR name ILIKE '%masło%' OR name ILIKE '%wosk%' OR name ILIKE '%lanolina%'
          OR description ILIKE '%oil%' OR description ILIKE '%butter%' OR description ILIKE '%stearyl%' OR description ILIKE '%cetyl%' OR description ILIKE '%cetearyl%' OR description ILIKE '%lanolin%' OR description ILIKE '%wax%' OR description ILIKE '%squalane%' OR description ILIKE '%dimethicone%' OR description ILIKE '%cyclopentasiloxane%' OR description ILIKE '%caprylic%' OR description ILIKE '%isopropyl myristate%'
        THEN 'E'
        ELSE ''
    END
    ||
    CASE
        WHEN name ILIKE '%gliceryn%' OR name ILIKE '%aloes%' OR name ILIKE '%kwas hialuronow%' OR name ILIKE '%mocznik%' OR name ILIKE '%miód%' OR name ILIKE '%alantoin%' OR name ILIKE '%pantenol%'
          OR description ILIKE '%glycerin%' OR description ILIKE '%panthenol%' OR description ILIKE '%aloe%' OR description ILIKE '%hyaluronic%' OR description ILIKE '%urea%' OR description ILIKE '%propylene glycol%' OR description ILIKE '%honey%' OR description ILIKE '%allantoin%' OR description ILIKE '%sorbitol%' OR description ILIKE '%sodium pca%' OR description ILIKE '%lactic acid%'
        THEN 'H'
        ELSE ''
    END;

UPDATE products_dsd_deluxe
SET peh_balance =
    CASE
        WHEN name ILIKE '%keratyn%' OR name ILIKE '%jedwab%' OR name ILIKE '%peptyd%' OR name ILIKE '%kolagen%' OR name ILIKE '%pszenic%' OR name ILIKE '%owies%' OR name ILIKE '%soj%' OR name ILIKE '%mlek%' OR name ILIKE '%ryż%'
          OR description ILIKE '%keratin%' OR description ILIKE '%silk%' OR description ILIKE '%protein%' OR description ILIKE '%collagen%' OR description ILIKE '%elastin%' OR description ILIKE '%wheat%' OR description ILIKE '%soy%' OR description ILIKE '%oat%' OR description ILIKE '%amino acid%' OR description ILIKE '%milk%'
        THEN 'P'
        ELSE ''
    END
    ||
    CASE
        WHEN name ILIKE '%olej%' OR name ILIKE '%masło%' OR name ILIKE '%wosk%' OR name ILIKE '%lanolina%'
          OR description ILIKE '%oil%' OR description ILIKE '%butter%' OR description ILIKE '%stearyl%' OR description ILIKE '%cetyl%' OR description ILIKE '%cetearyl%' OR description ILIKE '%lanolin%' OR description ILIKE '%wax%' OR description ILIKE '%squalane%' OR description ILIKE '%dimethicone%' OR description ILIKE '%cyclopentasiloxane%' OR description ILIKE '%caprylic%' OR description ILIKE '%isopropyl myristate%'
        THEN 'E'
        ELSE ''
    END
    ||
    CASE
        WHEN name ILIKE '%gliceryn%' OR name ILIKE '%aloes%' OR name ILIKE '%kwas hialuronow%' OR name ILIKE '%mocznik%' OR name ILIKE '%miód%' OR name ILIKE '%alantoin%' OR name ILIKE '%pantenol%'
          OR description ILIKE '%glycerin%' OR description ILIKE '%panthenol%' OR description ILIKE '%aloe%' OR description ILIKE '%hyaluronic%' OR description ILIKE '%urea%' OR description ILIKE '%propylene glycol%' OR description ILIKE '%honey%' OR description ILIKE '%allantoin%' OR description ILIKE '%sorbitol%' OR description ILIKE '%sodium pca%' OR description ILIKE '%lactic acid%'
        THEN 'H'
        ELSE ''
    END;

UPDATE products_natura
SET peh_balance =
    CASE
        WHEN name ILIKE '%keratyn%' OR name ILIKE '%jedwab%' OR name ILIKE '%peptyd%' OR name ILIKE '%kolagen%' OR name ILIKE '%pszenic%' OR name ILIKE '%owies%' OR name ILIKE '%soj%' OR name ILIKE '%mlek%' OR name ILIKE '%ryż%'
          OR description ILIKE '%keratin%' OR description ILIKE '%silk%' OR description ILIKE '%protein%' OR description ILIKE '%collagen%' OR description ILIKE '%elastin%' OR description ILIKE '%wheat%' OR description ILIKE '%soy%' OR description ILIKE '%oat%' OR description ILIKE '%amino acid%' OR description ILIKE '%milk%'
        THEN 'P'
        ELSE ''
    END
    ||
    CASE
        WHEN name ILIKE '%olej%' OR name ILIKE '%masło%' OR name ILIKE '%wosk%' OR name ILIKE '%lanolina%'
          OR description ILIKE '%oil%' OR description ILIKE '%butter%' OR description ILIKE '%stearyl%' OR description ILIKE '%cetyl%' OR description ILIKE '%cetearyl%' OR description ILIKE '%lanolin%' OR description ILIKE '%wax%' OR description ILIKE '%squalane%' OR description ILIKE '%dimethicone%' OR description ILIKE '%cyclopentasiloxane%' OR description ILIKE '%caprylic%' OR description ILIKE '%isopropyl myristate%'
        THEN 'E'
        ELSE ''
    END
    ||
    CASE
        WHEN name ILIKE '%gliceryn%' OR name ILIKE '%aloes%' OR name ILIKE '%kwas hialuronow%' OR name ILIKE '%mocznik%' OR name ILIKE '%miód%' OR name ILIKE '%alantoin%' OR name ILIKE '%pantenol%'
          OR description ILIKE '%glycerin%' OR description ILIKE '%panthenol%' OR description ILIKE '%aloe%' OR description ILIKE '%hyaluronic%' OR description ILIKE '%urea%' OR description ILIKE '%propylene glycol%' OR description ILIKE '%honey%' OR description ILIKE '%allantoin%' OR description ILIKE '%sorbitol%' OR description ILIKE '%sodium pca%' OR description ILIKE '%lactic acid%'
        THEN 'H'
        ELSE ''
    END;

UPDATE products_insight
SET peh_balance =
    CASE
        WHEN name ILIKE '%keratyn%' OR name ILIKE '%jedwab%' OR name ILIKE '%peptyd%' OR name ILIKE '%kolagen%' OR name ILIKE '%pszenic%' OR name ILIKE '%owies%' OR name ILIKE '%soj%' OR name ILIKE '%mlek%' OR name ILIKE '%ryż%'
          OR description ILIKE '%keratin%' OR description ILIKE '%silk%' OR description ILIKE '%protein%' OR description ILIKE '%collagen%' OR description ILIKE '%elastin%' OR description ILIKE '%wheat%' OR description ILIKE '%soy%' OR description ILIKE '%oat%' OR description ILIKE '%amino acid%' OR description ILIKE '%milk%'
        THEN 'P'
        ELSE ''
    END
    ||
    CASE
        WHEN name ILIKE '%olej%' OR name ILIKE '%masło%' OR name ILIKE '%wosk%' OR name ILIKE '%lanolina%'
          OR description ILIKE '%oil%' OR description ILIKE '%butter%' OR description ILIKE '%stearyl%' OR description ILIKE '%cetyl%' OR description ILIKE '%cetearyl%' OR description ILIKE '%lanolin%' OR description ILIKE '%wax%' OR description ILIKE '%squalane%' OR description ILIKE '%dimethicone%' OR description ILIKE '%cyclopentasiloxane%' OR description ILIKE '%caprylic%' OR description ILIKE '%isopropyl myristate%'
        THEN 'E'
        ELSE ''
    END
    ||
    CASE
        WHEN name ILIKE '%gliceryn%' OR name ILIKE '%aloes%' OR name ILIKE '%kwas hialuronow%' OR name ILIKE '%mocznik%' OR name ILIKE '%miód%' OR name ILIKE '%alantoin%' OR name ILIKE '%pantenol%'
          OR description ILIKE '%glycerin%' OR description ILIKE '%panthenol%' OR description ILIKE '%aloe%' OR description ILIKE '%hyaluronic%' OR description ILIKE '%urea%' OR description ILIKE '%propylene glycol%' OR description ILIKE '%honey%' OR description ILIKE '%allantoin%' OR description ILIKE '%sorbitol%' OR description ILIKE '%sodium pca%' OR description ILIKE '%lactic acid%'
        THEN 'H'
        ELSE ''
    END;
