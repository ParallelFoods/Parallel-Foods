import ShopClient from '@/components/ShopClient';
import { createClient } from '@/utils/supabase/server';
import { MOCK_PRODUCTS } from '@/data/products';

export default async function Shop() {
    let displayProducts = MOCK_PRODUCTS;

    try {
        const supabase = await createClient();
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: true });

        if (products && products.length > 0) {
            displayProducts = products;
        }
    } catch (error) {
        console.warn('Supabase not connected or missing env vars, falling back to mock data.');
    }

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
