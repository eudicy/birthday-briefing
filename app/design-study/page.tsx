import Link from "next/link";
import { Footer } from "@/components/Footer";

type MockBirthday = { name: string; date: string };

const today: MockBirthday[] = [{ name: "Anna Keller", date: "Jul 14" }];
const thisWeek: MockBirthday[] = [
  { name: "Markus Lehner", date: "Jul 16" },
  { name: "Sophie Braun", date: "Jul 18" },
];
const nextWeek: MockBirthday[] = [
  { name: "Jonas Weber", date: "Jul 22" },
  { name: "Lea Fischer", date: "Jul 25" },
  { name: "Mia Hoffmann", date: "Jul 27" },
];

const groups: { label: string; entries: MockBirthday[] }[] = [
  { label: "Today", entries: today },
  { label: "This Week", entries: thisWeek },
  { label: "Next Week", entries: nextWeek },
];

export default function DesignStudyPage() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
          <Link
            href="/"
            className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>

          <div className="mx-auto w-full max-w-[380px] rounded-[2.5rem] border-8 border-foreground/10 bg-card p-3 shadow-xl">
            <div className="rounded-[1.75rem] bg-background p-6 space-y-6">
              <h1 className="text-xl font-bold">Upcoming Birthdays</h1>

              {groups
                .filter((group) => group.entries.length > 0)
                .map((group) => (
                  <section key={group.label} className="space-y-2">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {group.label}
                    </h2>
                    <ul className="space-y-1">
                      {group.entries.map((entry) => (
                        <li
                          key={`${entry.name}-${entry.date}`}
                          className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                        >
                          <span className="font-medium">{entry.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {entry.date}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
