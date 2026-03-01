import ShopClient from '@/components/ShopClient';
import { createClient } from '@/utils/supabase/server';
import { MOCK_PRODUCTS } from '@/data/products';

export default async function Shop() {
    const supabase = await createClient();

    // Try fetching products from Supabase
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

    // Fallback to mock data if there's no DB connection or no products yet
    const displayProducts = products && products.length > 0 ? products : MOCK_PRODUCTS;

    return (
        <section id="shop" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif text-foreground mb-4">The Collection</h2>
                    <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
                        Our meticulously crafted seasoning blends. Not fusion, but a celebration of parallel origins.
                    </p>
                </div>

                <ShopClient products={displayProducts} />
            </div>
        </section>
    );
}
