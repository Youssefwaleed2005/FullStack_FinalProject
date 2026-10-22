import Reveal from "@/components/fun/Reveal";
import CareerPathsSection from "@/components/home/CareerPathsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CtaSection from "@/components/home/CtaSection";
import FeaturedCoursesSection from "@/components/home/FeaturedCoursesSection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PartnersSection from "@/components/home/PartnersSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

// Each section slides in the first time it scrolls into view
function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <Reveal>
        <CategoriesSection />
      </Reveal>
      <Reveal>
        <FeaturedCoursesSection />
      </Reveal>
      <Reveal>
        <HowItWorksSection />
      </Reveal>
      <Reveal>
        <CareerPathsSection />
      </Reveal>
      <Reveal>
        <TestimonialsSection />
      </Reveal>
      <Reveal>
        <PartnersSection />
      </Reveal>
      <Reveal>
        <CtaSection />
      </Reveal>
    </>
  );
}

export default HomePage;
