import { Footer } from "@/components/Footer";

export default function ImprintPage() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
          <h1 className="text-3xl font-bold">Imprint (Impressum)</h1>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Information pursuant to § 5 TMG (Angaben gemäß § 5 TMG)
            </h2>
            <p>
              Stefan Boos
              <br />
              Pappelweg 28
              <br />
              51503 Rösrath
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Contact (Kontakt)</h2>
            <p>Email: webmaster@boos.systems</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">
              Liability for Content (Haftung für Inhalte)
            </h3>
            <p>
              As a service provider (Diensteanbieter), we are responsible for our
              own content on these pages under general law in accordance with §
              7 (1) TMG (Telemediengesetz). However, pursuant to §§ 8 to 10 TMG,
              we as a service provider are not obligated to monitor transmitted
              or stored third-party information, or to investigate circumstances
              that indicate illegal activity.
            </p>
            <p>
              Obligations to remove or block the use of information under
              general law remain unaffected by this. However, liability in this
              regard is only possible from the point in time at which a concrete
              infringement of the law becomes known. Upon becoming aware of such
              infringements, we will remove this content immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">
              Liability for Links (Haftung für Links)
            </h3>
            <p>
              Our offering contains links to external third-party websites over
              whose content we have no influence. We therefore cannot assume any
              liability for this third-party content. The respective provider or
              operator of the linked pages is always responsible for their
              content. The linked pages were checked for possible legal
              violations at the time of linking; no illegal content was
              identifiable at the time of linking.
            </p>
            <p>
              However, permanent monitoring of the content of the linked pages
              is not reasonable without concrete evidence of a legal violation.
              Upon becoming aware of legal violations, we will remove such links
              immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Copyright (Urheberrecht)</h3>
            <p>
              The content and works on these pages created by the site
              operators are subject to German copyright law (Urheberrecht).
              Reproduction, editing, distribution, and any kind of use outside
              the limits of copyright require the written consent of the
              respective author or creator. Downloads and copies of this page
              are permitted only for private, non-commercial use.
            </p>
            <p>
              Insofar as the content on this page was not created by the
              operator, the copyrights of third parties are respected. In
              particular, third-party content is marked as such. Should you
              nevertheless become aware of a copyright infringement, please
              notify us accordingly. Upon becoming aware of legal violations, we
              will remove such content immediately.
            </p>
            <p>
              Source (Quelle):{" "}
              <a
                href="https://www.e-recht24.de"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                eRecht24
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
