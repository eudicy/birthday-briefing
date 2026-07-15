const features = [
  {
    icon: "🔄",
    title: "Automatic consolidation",
    description:
      "Birthday Briefing automatically consolidates all birthday information into one place — no manual synchronization.",
  },
  {
    icon: "⏰",
    title: "Timely reminders",
    description:
      "Sends timely reminders with enough lead time to act — the right nudge at the right time.",
  },
  {
    icon: "📞",
    title: "Reach out in one tap",
    description:
      "When it's someone's birthday, jump straight to calling or messaging them — no digging for their number.",
  },
];

export function FeatureList() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-center">
        Birthday Briefing has you covered
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="text-center sm:text-left">
            <div className="text-3xl">{feature.icon}</div>
            <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
