-- Supabase Schema for Parallel Foods ERP/MRP

-- 0) Multi-tenant Foundation
CREATE TABLE organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE org_members (
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (org_id, user_id)
);

-- 1) Products, SKUs, packaging
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE skus (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    net_weight_g NUMERIC NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE packaging_components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    default_uom TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE sku_packaging_bom (
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    sku_id UUID REFERENCES skus(id) ON DELETE CASCADE,
    packaging_component_id UUID REFERENCES packaging_components(id) ON DELETE CASCADE,
    qty_per_unit NUMERIC NOT NULL,
    scrap_rate NUMERIC DEFAULT 0,
    PRIMARY KEY (sku_id, packaging_component_id)
);

CREATE TABLE packaging_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    packaging_component_id UUID REFERENCES packaging_components(id) ON DELETE CASCADE,
    effective_date DATE NOT NULL,
    unit_cost NUMERIC NOT NULL,
    cost_uom TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2) Ingredients + recipe/BOM
CREATE TABLE ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    default_uom TEXT NOT NULL,
    allergen_flags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE ingredient_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    effective_date DATE NOT NULL,
    unit_cost NUMERIC NOT NULL,
    cost_uom TEXT NOT NULL,
    source TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    yield_g NUMERIC NOT NULL,
    loss_rate NUMERIC DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE recipe_lines (
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    qty_g NUMERIC NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id)
);

-- 3) Channels, pricing, and fee models
CREATE TABLE channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    channel_type TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE price_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    effective_start DATE NOT NULL,
    effective_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE sku_prices (
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    price_list_id UUID REFERENCES price_lists(id) ON DELETE CASCADE,
    sku_id UUID REFERENCES skus(id) ON DELETE CASCADE,
    list_price NUMERIC NOT NULL,
    PRIMARY KEY (price_list_id, sku_id)
);

CREATE TABLE fee_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    percent_of_revenue NUMERIC DEFAULT 0,
    per_order_fee NUMERIC DEFAULT 0,
    per_unit_fee NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE channel_fee_models (
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    fee_model_id UUID REFERENCES fee_models(id) ON DELETE CASCADE,
    PRIMARY KEY (channel_id, fee_model_id)
);

-- 4) Production runs + samples
CREATE TABLE production_runs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    run_date DATE NOT NULL,
    run_type TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE run_outputs (
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    run_id UUID REFERENCES production_runs(id) ON DELETE CASCADE,
    sku_id UUID REFERENCES skus(id) ON DELETE CASCADE,
    units_produced NUMERIC NOT NULL,
    units_scrapped NUMERIC DEFAULT 0,
    PRIMARY KEY (run_id, sku_id)
);

-- 5) Expenses + allocations
CREATE TABLE expense_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    classification TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id) ON DELETE CASCADE,
    incurred_date DATE NOT NULL,
    amount NUMERIC NOT NULL,
    vendor TEXT,
    recurrence TEXT NOT NULL,
    allocatable BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE allocation_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id) ON DELETE CASCADE,
    allocate_to TEXT NOT NULL,
    method TEXT NOT NULL,
    driver TEXT,
    effective_start DATE NOT NULL,
    effective_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6) Contracts
CREATE TABLE contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    contract_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE co_packer_rate_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    sku_id UUID REFERENCES skus(id) ON DELETE CASCADE,
    setup_fee NUMERIC DEFAULT 0,
    per_unit_fee NUMERIC DEFAULT 0,
    per_batch_fee NUMERIC DEFAULT 0,
    minimum_run_units NUMERIC DEFAULT 0,
    pass_through_pct NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Enablement
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE sku_packaging_bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE sku_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_fee_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE run_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_packer_rate_cards ENABLE ROW LEVEL SECURITY;

-- Base RLS Policy per table (Assuming a simplified approach for now: any member of the org can select)
-- (We will refine these policies to restrict inserts/updates to owners and editors later, or per user setup)
CREATE OR REPLACE FUNCTION user_in_org(user_org_id UUID) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM org_members WHERE org_id = user_org_id AND user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7) Unit Economics View
-- This view aggregates costs per SKU and Channel.
-- Note: This is a simplified aggregated view. In a real scenario, we might need complex joins 
-- to get latest prices for ingredients and packaging. For this blueprint, we use lateral joins 
-- or subqueries to fetch the latest active prices.

CREATE OR REPLACE VIEW unit_economics_view AS
WITH latest_ingredient_prices AS (
    SELECT ingredient_id, unit_cost
    FROM (
        SELECT ingredient_id, unit_cost, 
               ROW_NUMBER() OVER(PARTITION BY ingredient_id ORDER BY effective_date DESC) as rn
        FROM ingredient_prices
    ) ip WHERE rn = 1
),
latest_packaging_prices AS (
    SELECT packaging_component_id, unit_cost
    FROM (
        SELECT packaging_component_id, unit_cost, 
               ROW_NUMBER() OVER(PARTITION BY packaging_component_id ORDER BY effective_date DESC) as rn
        FROM packaging_prices
    ) pp WHERE rn = 1
),
recipe_costs AS (
    SELECT 
        r.product_id,
        SUM(rl.qty_g * COALESCE(lip.unit_cost, 0)) as total_ingredient_cost
    FROM recipes r
    JOIN recipe_lines rl ON r.id = rl.recipe_id
    LEFT JOIN latest_ingredient_prices lip ON rl.ingredient_id = lip.ingredient_id
    WHERE r.active = true
    GROUP BY r.product_id
),
packaging_costs AS (
    SELECT 
        spb.sku_id,
        SUM(spb.qty_per_unit * COALESCE(lpp.unit_cost, 0)) as total_packaging_cost
    FROM sku_packaging_bom spb
    LEFT JOIN latest_packaging_prices lpp ON spb.packaging_component_id = lpp.packaging_component_id
    GROUP BY spb.sku_id
)
SELECT 
    s.org_id,
    s.id as sku_id,
    c.id as channel_id,
    sp.list_price as selling_price,
    COALESCE(rc.total_ingredient_cost, 0) as ingredient_cost_per_unit,
    COALESCE(pc.total_packaging_cost, 0) as packaging_cost_per_unit,
    -- Simple channel fees (percent of revenue + per unit)
    COALESCE((fm.percent_of_revenue / 100) * sp.list_price + fm.per_unit_fee, 0) as fees_per_unit,
    
    (COALESCE(rc.total_ingredient_cost, 0) + COALESCE(pc.total_packaging_cost, 0)) as total_cogs_per_unit,
    
    -- Gross Margin = Price - COGS - Fees
    (sp.list_price - (COALESCE(rc.total_ingredient_cost, 0) + COALESCE(pc.total_packaging_cost, 0) + COALESCE((fm.percent_of_revenue / 100) * sp.list_price + fm.per_unit_fee, 0))) as gross_margin_per_unit,
    
    -- Gross Margin %
    CASE WHEN sp.list_price > 0 THEN 
        ((sp.list_price - (COALESCE(rc.total_ingredient_cost, 0) + COALESCE(pc.total_packaging_cost, 0) + COALESCE((fm.percent_of_revenue / 100) * sp.list_price + fm.per_unit_fee, 0))) / sp.list_price) * 100
    ELSE 0 END as gross_margin_pct

FROM skus s
JOIN sku_prices sp ON s.id = sp.sku_id
JOIN price_lists pl ON sp.price_list_id = pl.id
JOIN channels c ON pl.channel_id = c.id
LEFT JOIN channel_fee_models cfm ON c.id = cfm.channel_id
LEFT JOIN fee_models fm ON cfm.fee_model_id = fm.id
LEFT JOIN recipe_costs rc ON s.product_id = rc.product_id
LEFT JOIN packaging_costs pc ON s.id = pc.sku_id
WHERE pl.effective_start <= CURRENT_DATE 
  AND (pl.effective_end IS NULL OR pl.effective_end >= CURRENT_DATE);

