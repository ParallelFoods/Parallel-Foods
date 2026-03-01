import Hero from '@/components/Hero';
import Shop from '@/components/Shop';
import Story from '@/components/Story';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Shop />
      <Story />
    </div>
  );
}
