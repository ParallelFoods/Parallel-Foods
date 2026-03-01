'use client';

import { motion } from 'framer-motion';

export default function Story() {
    return (
        <section id="story" className="bg-foreground text-background py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20 md:mb-32"
                >
                    <span className="uppercase tracking-widest text-accent font-semibold text-sm mb-4 block">Our Heritage</span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                        Two Continents.<br />
                        <span className="italic text-primary">One Parallel Story.</span>
                    </h2>
                    <div className="w-24 h-1 bg-accent mx-auto mt-8"></div>
                </motion.div>

                {/* Split Section 1: Korea */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-32 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 md:order-1"
                    >
                        <h3 className="text-3xl font-serif text-primary mb-6">Deep Roots of Korea</h3>
                        <p className="text-lg text-background/80 font-light leading-relaxed mb-6">
                            In Korea, flavor is built on time. It is the patience of fermentation, the slow aging of jang (sauces), and the sharp, bright clarity of ingredients harvested from both mountains and sea.
                        </p>
                        <p className="text-lg text-background/80 font-light leading-relaxed">
                            Our blends harness this umami depth—grounding every dish in centuries of culinary wisdom and balance.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="order-1 md:order-2 aspect-[4/5] rounded-sm relative overflow-hidden shadow-2xl"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                            style={{ backgroundImage: 'url("/images/story-korea.png")' }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 z-20 text-xs tracking-widest uppercase text-white/70 font-medium">Seoul, South Korea</div>
                    </motion.div>
                </div>

                {/* Split Section 2: Mexico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-32 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="aspect-[4/5] rounded-sm relative overflow-hidden shadow-2xl"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                            style={{ backgroundImage: 'url("/images/story-mexico.png")' }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 right-6 z-20 text-xs tracking-widest uppercase text-white/70 font-medium text-right">Oaxaca, Mexico</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h3 className="text-3xl font-serif text-accent mb-6">Vibrant Soul of Mexico</h3>
                        <p className="text-lg text-background/80 font-light leading-relaxed mb-6">
                            Mexico brings fire, citrus, and complexity. It is the ritual of roasting chilies until they blister, the crush of fresh herbs, and the smoke that lingers in the air.
                        </p>
                        <p className="text-lg text-background/80 font-light leading-relaxed">
                            We capture this spirited intensity—layered upon the rich canvas of our Korean foundation.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mt-20"
                >
                    <p className="text-xl md:text-2xl font-serif mb-8 max-w-2xl mx-auto italic text-primary/80">
                        "We don't mix traditions. We invite them to sit at the same table."
                    </p>
                    <a
                        href="#shop"
                        className="inline-block border border-accent text-accent px-10 py-4 rounded-full text-lg font-medium hover:bg-accent hover:text-white transition-all duration-300"
                    >
                        Taste the Parallel
                    </a>
                </motion.div>

            </div>
        </section>
    );
}
