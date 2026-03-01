import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CallToAction />
      <Footer />
    </>
  );
}
