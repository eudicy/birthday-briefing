import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function DesignStudyTodayPage() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
          <Link
            href="/design-study"
            className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Upcoming Birthdays
          </Link>

          <div className="mx-auto w-full max-w-[380px] rounded-[2.5rem] border-8 border-foreground/10 bg-card p-3 shadow-xl">
            <div className="rounded-[1.75rem] bg-background p-6 space-y-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                  AK
                </div>
                <h1 className="text-xl font-bold">Anna Keller</h1>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  🎉 Today
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-primary px-4 py-4 text-base font-semibold text-primary-foreground shadow-sm"
                >
                  Call
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-primary px-4 py-4 text-base font-semibold text-primary-foreground shadow-sm"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
