import Hero from "@/components/Hero";
import ClientsSection from "@/components/ClientsSection";
import WhoWeAre from "@/components/WhoWeAre";
import SA8000Section from "@/components/SA8000Section";
import CraftedInChina from "@/components/CraftedInChina";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ClientsSection />
      <WhoWeAre />
      <SA8000Section />
      <CraftedInChina />
      <FinalCTA />
    </div>
  );
}
