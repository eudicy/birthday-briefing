import Link from "next/link";

export function Footer() {
  return (
    <footer className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Birthday Briefing</p>
      <div className="flex items-center gap-4">
        <Link
          href="/design-study"
          className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-foreground hover:bg-muted transition-colors"
        >
          View Design Study
        </Link>
        <Link href="/imprint" className="hover:text-foreground transition-colors">
          Imprint
        </Link>
        <a href="mailto:hello@birthdaybriefing.app" className="hover:text-foreground transition-colors">
          Contact
        </a>
      </div>
    </footer>
  );
}
