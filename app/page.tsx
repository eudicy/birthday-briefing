import { HeroSection } from "@/components/HeroSection";
import { SignupForm } from "@/components/SignupForm";
import { FeatureList } from "@/components/FeatureList";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
        <HeroSection />
        <SignupForm />
        <FeatureList />
      </main>
      <Footer />
    </div>
  );
}
