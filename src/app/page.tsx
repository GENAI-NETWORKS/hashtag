import { DesktopHomeUI } from '@/components/home/DesktopHomeUI';
import { MobileHomeUI } from '@/components/home/MobileHomeUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hashtag Custom Prints | T-Shirts, Mugs, Notebooks',
  description: 'Salem\'s leading custom printing service. High-quality custom t-shirts, personalized mugs, photo notebooks, and corporate gifting.',
};

export default function HomePage() {
  return (
    <>

      <div className="block lg:hidden">
        <MobileHomeUI />
      </div>
      <div className="hidden lg:block">
        <DesktopHomeUI />
      </div>
    </>
  );
}
