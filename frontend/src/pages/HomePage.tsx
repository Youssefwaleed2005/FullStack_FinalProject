import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedCoursesSection from "../components/FeaturedCoursesSection";
import CareerPathsSection from "../components/CareerPathsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import PartnersSection from "../components/PartnersSection";
import CtaSection from "../components/CtaSection";
function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedCoursesSection />
      <CareerPathsSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
    </div>
  );
}

export default HomePage;
