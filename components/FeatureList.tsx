const features = [
  {
    icon: "🔄",
    title: "Automatic consolidation",
    description:
      "Birthdays scattered across contacts, calendars, and social apps land in one place — no manual syncing.",
  },
  {
    icon: "⏰",
    title: "Timely reminders",
    description:
      "Get nudged with enough lead time to actually plan something, not a same-day scramble.",
  },
  {
    icon: "🎯",
    title: "One place for everyone",
    description:
      "Friends, family, and partner — every important date, tracked without the manual work.",
  },
];

export function FeatureList() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
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
