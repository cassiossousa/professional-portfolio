import ExperienceCard from "@/components/ExperienceCard";

export default function Experience() {
  const jobs = [
    {
      company: "F1rst Digital Services - Santander",
      role: "Senior Software Engineer",
      period: "Sep 2023 - Aug 2025",
      description:
        "Technical reference in squad supporting architecture decisions and evolution of corporate services.",
    },
    {
      company: "Galena Educação",
      role: "Specialist Software Engineer",
      period: "Apr 2022 - Mar 2023",
      description:
        "Technical owner of SaaS employability platform used by 7000+ students.",
    },
    {
      company: "Lemon Energia",
      role: "Senior Software Engineer",
      period: "Feb 2021 - Apr 2022",
      description:
        "Redesign of corporate design system and reusable components.",
    },
    {
      company: "Loggi",
      role: "Senior Software Engineer",
      period: "Jun 2019 - Feb 2021",
      description:
        "Development of logistics SaaS platform serving ~2M monthly users.",
    },
    {
      company: "Geekie",
      role: "Software Engineer",
      period: "Jan 2017 - Apr 2019",
      description:
        "Development of educational platforms used by students nationwide.",
    },
  ];

  return (
    <section className="container">
      <h1>Professional Experience</h1>

      {jobs.map((job) => (
        <ExperienceCard key={job.company} {...job} />
      ))}
    </section>
  );
}
