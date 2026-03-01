-- Seed script for testing the ERP schema calculations

DO $$
DECLARE
    v_org_id UUID := gen_random_uuid();
    v_product_id UUID := gen_random_uuid();
    v_sku_id UUID := gen_random_uuid();
    
    v_supplier_ing_id UUID := gen_random_uuid();
    v_supplier_pkg_id UUID := gen_random_uuid();
    v_ingredient_1 UUID := gen_random_uuid();
    v_ingredient_2 UUID := gen_random_uuid();
    
    v_pkg_jar UUID := gen_random_uuid();
    v_pkg_lid UUID := gen_random_uuid();
    v_pkg_label UUID := gen_random_uuid();
    
    v_recipe_id UUID := gen_random_uuid();
    
    v_channel_fw UUID := gen_random_uuid();
    v_channel_dtc UUID := gen_random_uuid();
    
    v_price_list_fw UUID := gen_random_uuid();
    v_price_list_dtc UUID := gen_random_uuid();
    
    v_fee_dtc UUID := gen_random_uuid();
    v_fee_fw UUID := gen_random_uuid();
BEGIN
    -- 1. Organization
    INSERT INTO organizations (id, name) VALUES (v_org_id, 'Parallel Foods Testing');
    
    -- 2. Product & SKU
    INSERT INTO products (id, org_id, name) VALUES (v_product_id, v_org_id, 'Gochujang Mole Blend');
    INSERT INTO skus (id, org_id, product_id, name, net_weight_g) VALUES (v_sku_id, v_org_id, v_product_id, '2oz jar', 56.7);
    
    -- 3. Suppliers
    INSERT INTO suppliers (id, org_id, name) VALUES (v_supplier_ing_id, v_org_id, 'Global Spice Co');
    INSERT INTO suppliers (id, org_id, name) VALUES (v_supplier_pkg_id, v_org_id, 'GlassPack Inc');
    
    -- 4. Ingredients & Prices
    INSERT INTO ingredients (id, org_id, name, supplier_id, default_uom) VALUES (v_ingredient_1, v_org_id, 'Gochugaru Paste', v_supplier_ing_id, 'kg');
    INSERT INTO ingredient_prices (org_id, ingredient_id, effective_date, unit_cost, cost_uom) VALUES (v_org_id, v_ingredient_1, '2026-01-01', 0.015, 'g'); -- $15/kg
    
    INSERT INTO ingredients (id, org_id, name, supplier_id, default_uom) VALUES (v_ingredient_2, v_org_id, 'Cocoa Powder', v_supplier_ing_id, 'kg');
    INSERT INTO ingredient_prices (org_id, ingredient_id, effective_date, unit_cost, cost_uom) VALUES (v_org_id, v_ingredient_2, '2026-01-01', 0.008, 'g'); -- $8/kg
    
    -- 5. Recipe & Lines (Recipe yields 100g)
    INSERT INTO recipes (id, org_id, product_id, version, yield_g) VALUES (v_recipe_id, v_org_id, v_product_id, 1, 100);
    INSERT INTO recipe_lines (org_id, recipe_id, ingredient_id, qty_g) VALUES (v_org_id, v_recipe_id, v_ingredient_1, 60); -- 60g paste
    INSERT INTO recipe_lines (org_id, recipe_id, ingredient_id, qty_g) VALUES (v_org_id, v_recipe_id, v_ingredient_2, 40); -- 40g cocoa
    
    -- 6. Packaging & Prices
    INSERT INTO packaging_components (id, org_id, name, supplier_id, default_uom) VALUES (v_pkg_jar, v_org_id, '2oz Glass Jar', v_supplier_pkg_id, 'unit');
    INSERT INTO packaging_prices (org_id, packaging_component_id, effective_date, unit_cost, cost_uom) VALUES (v_org_id, v_pkg_jar, '2026-01-01', 0.45, 'unit');
    
    INSERT INTO packaging_components (id, org_id, name, supplier_id, default_uom) VALUES (v_pkg_lid, v_org_id, 'Black Metal Lid', v_supplier_pkg_id, 'unit');
    INSERT INTO packaging_prices (org_id, packaging_component_id, effective_date, unit_cost, cost_uom) VALUES (v_org_id, v_pkg_lid, '2026-01-01', 0.15, 'unit');
    
    INSERT INTO packaging_components (id, org_id, name, supplier_id, default_uom) VALUES (v_pkg_label, v_org_id, 'Wrap Label', v_supplier_pkg_id, 'unit');
    INSERT INTO packaging_prices (org_id, packaging_component_id, effective_date, unit_cost, cost_uom) VALUES (v_org_id, v_pkg_label, '2026-01-01', 0.20, 'unit');
    
    -- SKU BOM
    INSERT INTO sku_packaging_bom (org_id, sku_id, packaging_component_id, qty_per_unit) VALUES (v_org_id, v_sku_id, v_pkg_jar, 1);
    INSERT INTO sku_packaging_bom (org_id, sku_id, packaging_component_id, qty_per_unit) VALUES (v_org_id, v_sku_id, v_pkg_lid, 1);
    INSERT INTO sku_packaging_bom (org_id, sku_id, packaging_component_id, qty_per_unit) VALUES (v_org_id, v_sku_id, v_pkg_label, 1);
    
    -- 7. Channels & Fees
    INSERT INTO channels (id, org_id, name, channel_type) VALUES (v_channel_fw, v_org_id, 'Farmers Market', 'direct');
    INSERT INTO channels (id, org_id, name, channel_type) VALUES (v_channel_dtc, v_org_id, 'DTC Online', 'direct');
    
    INSERT INTO fee_models (id, org_id, name, percent_of_revenue, per_order_fee, per_unit_fee) VALUES (v_fee_fw, v_org_id, 'Square POS', 2.6, 0.10, 0);
    INSERT INTO channel_fee_models (org_id, channel_id, fee_model_id) VALUES (v_org_id, v_channel_fw, v_fee_fw);
    
    INSERT INTO fee_models (id, org_id, name, percent_of_revenue, per_order_fee, per_unit_fee) VALUES (v_fee_dtc, v_org_id, 'Shopify Payments', 2.9, 0.30, 0);
    INSERT INTO channel_fee_models (org_id, channel_id, fee_model_id) VALUES (v_org_id, v_channel_dtc, v_fee_dtc);
    
    -- 8. Prices
    INSERT INTO price_lists (id, org_id, channel_id, effective_start) VALUES (v_price_list_fw, v_org_id, v_channel_fw, '2026-01-01');
    INSERT INTO sku_prices (org_id, price_list_id, sku_id, list_price) VALUES (v_org_id, v_price_list_fw, v_sku_id, 12.00);
    
    INSERT INTO price_lists (id, org_id, channel_id, effective_start) VALUES (v_price_list_dtc, v_org_id, v_channel_dtc, '2026-01-01');
    INSERT INTO sku_prices (org_id, price_list_id, sku_id, list_price) VALUES (v_org_id, v_price_list_dtc, v_sku_id, 10.00);
END $$;
