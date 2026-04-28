import { motion } from "framer-motion";
import { Award, BriefcaseBusiness, GraduationCap, Mail, MapPin, Sparkles } from "lucide-react";
import { levelValue, type PortfolioState, templateCopy } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export function PortfolioPreview({ portfolio, compact = false }: { portfolio: PortfolioState; compact?: boolean }) {
  const p = portfolio.personal;
  const profilePhotoUrl = toDisplayImageUrl(p.photoUrl);
  const visual = {
    developer: "from-primary/20 via-secondary/10 to-accent/20",
    corporate: "from-secondary/20 via-background to-primary/10",
    creative: "from-accent/25 via-primary/10 to-secondary/20",
    minimal: "from-muted via-background to-muted",
  }[portfolio.template];

  return (
    <article className={cn("overflow-hidden rounded-[1.75rem] border border-border/70 bg-card text-card-foreground shadow-[var(--shadow-premium)]", compact ? "scale-[0.98]" : "")}> 
      <section className={cn("relative px-6 py-8 sm:px-10 sm:py-12 bg-gradient-to-br", visual)}>
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--foreground)/0.18)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative grid gap-8 md:grid-cols-[1fr_220px] md:items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {templateCopy[portfolio.template].name}
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold tracking-normal sm:text-5xl">{p.fullName || "Your Name"}</h1>
            <p className="mt-3 text-lg font-semibold text-primary">{p.title || "Professional title"}</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{portfolio.generated_bio || p.about || "A crisp professional bio will appear here as you complete your profile."}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              {(p.city || p.country) && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{[p.city, p.country].filter(Boolean).join(", ")}</span>}
              {p.email && <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{p.email}</span>}
            </div>
          </motion.div>
          <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-[2rem] border border-border/70 bg-background/70 text-5xl font-black text-primary shadow-[var(--shadow-glow)] backdrop-blur md:h-52 md:w-52">
            {profilePhotoUrl ? <img src={profilePhotoUrl} alt={`${p.fullName || "Profile"} portrait`} className="h-full w-full rounded-[2rem] object-cover" loading="lazy" referrerPolicy="no-referrer" /> : (p.fullName || "PB").split(" ").map((x) => x[0]).join("").slice(0, 2)}
          </div>
        </div>
      </section>

      <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
        <main className="space-y-10 p-6 sm:p-10">
          <section>
            <h2 className="font-display text-2xl font-bold">Selected Projects</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {(portfolio.projects.length ? portfolio.projects : []).map((project) => (
                <div key={project.id} className="group rounded-2xl border border-border/70 bg-background/70 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]">
                  <div className="mb-4 flex h-28 items-center justify-center overflow-hidden rounded-xl soft-gradient text-sm font-semibold text-primary">
                    {toDisplayImageUrl(project.imageUrl) ? <img src={toDisplayImageUrl(project.imageUrl)} alt={`${project.title || "Portfolio"} project`} className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" /> : project.client || "Project"}
                  </div>
                  <h3 className="font-display text-lg font-bold">{project.title || "Project title"}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.description || "Project description"}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{project.technologies}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">Experience Timeline</h2>
            <div className="mt-5 space-y-4 border-l border-border pl-5">
              {portfolio.experiences.map((item) => (
                <div key={item.id} className="relative rounded-2xl bg-muted/50 p-5">
                  <span className="absolute -left-[1.72rem] top-6 h-3 w-3 rounded-full bg-primary shadow-[var(--shadow-glow)]" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display font-bold">{item.designation}</h3>
                    <span className="text-xs font-semibold text-muted-foreground">{item.startDate} — {item.endDate}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-primary">{item.company} · {item.location}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.responsibilities}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-8 border-t border-border bg-muted/35 p-6 sm:p-10 lg:border-l lg:border-t-0">
          <section>
            <h2 className="font-display text-xl font-bold">Skills</h2>
            <div className="mt-5 space-y-4">
              {portfolio.skills.map((skill) => (
                <div key={skill.id}>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold">{skill.name}</span><span className="text-muted-foreground">{skill.level}</span></div>
                  <div className="h-2 rounded-full bg-background"><div className="h-full rounded-full gradient-button" style={{ width: `${levelValue(skill.level)}%` }} /></div>
                </div>
              ))}
            </div>
          </section>
          <Info title="Certificates" icon={<Award className="h-4 w-4" />} items={portfolio.certificates.map((c) => `${c.course} · ${c.institute}`)} />
          <Info title="Education" icon={<GraduationCap className="h-4 w-4" />} items={portfolio.education.map((e) => `${e.course} · ${e.university}`)} />
          <Info title="Contact" icon={<BriefcaseBusiness className="h-4 w-4" />} items={[p.email, p.phone, portfolio.social_links.linkedin, portfolio.social_links.github].filter(Boolean)} />
        </aside>
      </div>
    </article>
  );
}

function Info({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  if (!items.length) return null;
  return <section><h2 className="flex items-center gap-2 font-display text-xl font-bold">{icon}{title}</h2><div className="mt-4 space-y-2">{items.map((item) => <p key={item} className="rounded-xl bg-background/80 px-3 py-2 text-sm text-muted-foreground">{item}</p>)}</div></section>;
}
