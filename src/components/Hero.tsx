export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary/10">
            {/* Premium background image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url("/images/hero-bg.png")' }}
            >
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
                <span className="uppercase tracking-widest text-accent font-semibold text-sm mb-4">Origin meets Origin</span>
                <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                    Unlock Unparallel <br />
                    <span className="text-primary italic font-serif">Flavor</span>
                </h1>
                <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl font-light">
                    Premium seasoning blends telling the story of authentic culinary heritage from Korea to Mexico.
                </p>
                <a
                    href="#shop"
                    className="bg-primary text-background px-8 py-4 rounded-full text-lg font-medium hover:bg-accent transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                    Explore Collection
                </a>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
                <span className="text-sm text-foreground/60 mb-2 uppercase tracking-wide">Scroll to Shop</span>
                <div className="w-[1px] h-12 bg-foreground/30"></div>
            </div>
        </section>
    );
}
