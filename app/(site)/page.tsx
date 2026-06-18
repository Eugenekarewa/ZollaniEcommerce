import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import ServicesOverview from '@/components/home/ServicesOverview';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import Industries from '@/components/home/Industries';
import FoundationImpact from '@/components/home/FoundationImpact';
import Testimonials from '@/components/home/Testimonials';
import StorePromo from '@/components/home/StorePromo';
import ContactCTA from '@/components/home/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesOverview />
      <WhyChooseUs />
      <FeaturedProjects />
      <Industries />
      <FoundationImpact />
      <Testimonials />
      <StorePromo />
      <ContactCTA />
    </>
  );
}
