import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { FeatureList } from "@/components/FeatureList";
import { SignupForm } from "@/components/SignupForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <FeatureList />
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
}
