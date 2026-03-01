'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallelBackground() {
    const { scrollYProgress } = useScroll();

    // Create parallel parallax effects for multiple lines
    const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
    const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
    const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '130%']);
    const y4 = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
            <svg
                width="100%"
                height="200%"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Left diagonal parallel lines */}
                <motion.g style={{ y: y1 }} className="origin-center rotate-12">
                    <line x1="-10%" y1="-50%" x2="40%" y2="150%" stroke="url(#lineGrad)" strokeWidth="1.5" />
                    <line x1="-5%" y1="-50%" x2="45%" y2="150%" stroke="url(#lineGrad)" strokeWidth="3" />
                    <line x1="0%" y1="-50%" x2="50%" y2="150%" stroke="url(#lineGrad)" strokeWidth="1" />
                </motion.g>

                {/* Wavy parallel lines bridging the center */}
                <motion.g style={{ y: y2 }}>
                    <path
                        d="M -200 200 Q 200 400 600 200 T 1400 200"
                        stroke="var(--accent)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.3"
                    />
                    <path
                        d="M -200 230 Q 200 430 600 230 T 1400 230"
                        stroke="var(--accent)"
                        strokeWidth="4"
                        fill="none"
                        opacity="0.2"
                    />
                    <path
                        d="M -200 260 Q 200 460 600 260 T 1400 260"
                        stroke="var(--accent)"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.4"
                    />
                </motion.g>

                {/* Right diagonal parallel lines */}
                <motion.g style={{ y: y3 }} className="origin-center -rotate-[15deg] opacity-60">
                    <line x1="70%" y1="-50%" x2="110%" y2="150%" stroke="url(#lineGrad)" strokeWidth="2" />
                    <line x1="73%" y1="-50%" x2="113%" y2="150%" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="75%" y1="-50%" x2="115%" y2="150%" stroke="url(#lineGrad)" strokeWidth="4" />
                </motion.g>

                {/* Extra intersecting horizon lines like the logo bottom lines */}
                <motion.g style={{ y: y4 }}>
                    <path
                        d="M -200 800 Q 400 900 800 800 T 1800 800"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        fill="none"
                        opacity="0.2"
                    />
                    <path
                        d="M -200 830 Q 400 930 800 830 T 1800 830"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.3"
                    />
                </motion.g>

            </svg>
        </div>
    );
}
