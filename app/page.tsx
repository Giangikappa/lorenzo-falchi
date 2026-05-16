import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import About from "@/components/home/About";
import LeadGen from "@/components/home/LeadGen";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <About />
        <LeadGen />
      </main>
      <Footer />
    </>
  );
}
