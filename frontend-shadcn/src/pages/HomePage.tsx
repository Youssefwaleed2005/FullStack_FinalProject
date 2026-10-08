import CareerPathsSection from "@/components/home/CareerPathsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CtaSection from "@/components/home/CtaSection";
import FeaturedCoursesSection from "@/components/home/FeaturedCoursesSection";
import HeroSection from "@/components/home/HeroSection";
import PartnersSection from "@/components/home/PartnersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedCoursesSection />
      <CareerPathsSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
    </>
  );
}

export default HomePage;
