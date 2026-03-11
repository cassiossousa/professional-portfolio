import { getDictionary } from "@/lib/i18n";

export default async function Home() {
  const dict = await getDictionary("en");

  return (
    <section className="container">
      <h1>{dict.hero.title}</h1>

      <p>{dict.hero.description}</p>

      <div className="links">
        <a href="https://github.com/cassiossousa" aria-label="GitHub profile">
          GitHub
        </a>

        <a
          href="https://linkedin.com/in/cassiossousa"
          aria-label="LinkedIn profile"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
