'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
                    PARALLEL FOODS
                </Link>
                <div className="hidden md:flex space-x-8 text-foreground/80 font-medium">
                    <Link href="#shop" className="hover:text-primary transition-colors">Shop</Link>
                    <Link href="#story" className="hover:text-primary transition-colors">Our Story</Link>
                </div>
                <div>
                    <button className="flex items-center space-x-2 bg-primary text-white px-5 py-2.5 rounded-full hover:bg-accent transition-colors font-medium">
                        <span>Cart</span>
                        <span className="bg-white text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
