import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

export function HeroSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        Never miss a{" "}
        <AnimatedGradientText className="font-semibold">
          birthday
        </AnimatedGradientText>{" "}
        again
      </h1>
      <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
        Birthday Briefing consolidates every birthday scattered across your
        contacts and apps, then sends timely reminders with enough lead time
        to act.
      </p>
      <div className="mt-8">
        <a
          href="#signup"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Get early access
        </a>
      </div>
    </section>
  );
}
