-- Supabase Schema for Parallel Foods

-- Drop existing tables if needed (useful during active dev)
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS customers;
-- DROP TABLE IF EXISTS products;

-- 1. Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  origin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Customers Table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Data for Products
INSERT INTO products (name, description, price, origin, image_url) VALUES 
('Chili Smoke', 'A deeply aromatic blend of smoked Mexican chilies and savory Korean aromatics. Perfect for fire-roasted meats or rich stews.', 14.99, 'Oaxaca, MX / Jeolla, KR', '/images/chili-smoke.jpg'),
('Sweet Beans', 'Rich, fermented Korean soy sweetness intertwined with notes of Mexican vanilla beans. An unexpected glaze for pork or sweet pastries.', 12.99, 'Seoul, KR / Veracruz, MX', '/images/sweet-beans.jpg'),
('Salty Fruit', 'Bright citrus from the Mexican coast paired with sun-dried Korean sea salt. Elevates fresh ceviche or a summer fruit salad.', 11.99, 'Colima, MX / Shinan, KR', '/images/salty-fruit.jpg');
