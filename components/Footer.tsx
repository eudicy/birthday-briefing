export function Footer() {
  return (
    <footer className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Birthday Briefing</p>
      <div className="flex gap-4">
        <a href="mailto:hello@birthdaybriefing.app" className="hover:text-foreground transition-colors">
          Contact
        </a>
      </div>
    </footer>
  );
}
