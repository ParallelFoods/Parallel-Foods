import type { Metadata } from 'next';
import { Montserrat, Lora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ParallelBackground from '@/components/ParallelBackground';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Parallel Foods | Authentic Seasoning Blends',
  description: 'Premium seasoning blends bridging the culinary heritage of Korea and Mexico.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.variable} ${lora.variable} font-sans antialiased min-h-screen flex flex-col relative bg-background text-foreground`}>
        <ParallelBackground />
        <Navbar />
        <main className="flex-grow z-10 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
