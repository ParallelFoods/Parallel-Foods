'use client';

import { useState } from 'react';
import { ShoppingBag, Plus } from 'lucide-react';

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    origin: string;
    image_url: string;
};

export default function ShopClient({ products }: { products: Product[] }) {
    const [addedIds, setAddedIds] = useState<string[]>([]);
    const [cartCount, setCartCount] = useState(0);

    const handleAddToCart = (id: string) => {
        setCartCount(prev => prev + 1);
        setAddedIds(prev => [...prev, id]);
        setTimeout(() => {
            setAddedIds(prev => prev.filter(item => item !== id));
        }, 2000);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50 transform hover:-translate-y-2 flex flex-col"
                    >
                        <div className="aspect-square bg-primary/10 relative overflow-hidden flex items-center justify-center p-8">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent opacity-80 group-hover:scale-110 transition-transform duration-700 blur-sm"></div>
                            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground uppercase tracking-widest">
                                {product.origin.split(' / ')[0]} <span className="opacity-50">/</span> {product.origin.split(' / ')[1]}
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-serif text-foreground">{product.name}</h3>
                                <span className="text-lg font-medium text-primary">${product.price}</span>
                            </div>

                            <p className="text-foreground/60 leading-relaxed mb-8 flex-grow">
                                {product.description}
                            </p>

                            <button
                                onClick={() => handleAddToCart(product.id)}
                                className={`w-full py-4 rounded-full flex items-center justify-center space-x-2 transition-all duration-300 font-medium ${addedIds.includes(product.id)
                                        ? 'bg-accent/20 text-accent border border-accent/20'
                                        : 'bg-primary text-white hover:bg-accent hover:shadow-lg'
                                    }`}
                            >
                                {addedIds.includes(product.id) ? (
                                    <span>Added to Cart</span>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        <span>Add to Order</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Cart Indicator */}
            <div className={`fixed bottom-8 right-8 bg-foreground text-background shadow-2xl rounded-full p-4 flex items-center space-x-4 transition-all duration-500 z-50 ${cartCount > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="relative">
                    <ShoppingBag size={24} />
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cartCount}
                    </span>
                </div>
                <div className="font-medium px-2">View Cart</div>
            </div>
        </>
    );
}
