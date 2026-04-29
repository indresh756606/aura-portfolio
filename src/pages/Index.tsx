import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { cn } from "@/lib/utils";
import { defaultPortfolio, safeJson, starterPortfolio, templateCopy, uid, type Certificate, type Education, type Experience, type Level, type PortfolioState, type Project, type Skill, type Template } from "@/lib/portfolio";
import { ArrowRight, BarChart3, BriefcaseBusiness, Check, Eye, FileDown, Github, GraduationCap, LayoutDashboard, Link as LinkIcon, Loader2, Lock, LogOut, Mail, Menu, Moon, Palette, Plus, Rocket, Settings, Share2, Shield, Sparkles, Star, Sun, Trash2, UserRound, Wand2, X } from "lucide-react";

type Section = "overview" | "personal" | "projects" | "experience" | "skills" | "certificates" | "education" | "additional" | "social" | "preview" | "settings";

const authSchema = z.object({ email: z.string().trim().email(), password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/) });
const signupSchema = authSchema.extend({ fullName: z.string().trim().min(2), confirmPassword: z.string().min(8) }).refine((v) => v.password === v.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] });

export default function Index() {
  return <LandingPage />;
}

export function LandingPage() {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(circle at ${mouseX}% ${mouseY}%, hsl(var(--secondary) / 0.24), transparent 30%)`;
  const features = ["Secure Cloud accounts", "No-code portfolio editor", "Dynamic templates", "Resume PDF export", "Analytics-ready sharing", "AI-style copy tools"];

  return (
    <div className="premium-scroll min-h-screen bg-background text-foreground">
      <motion.section className="hero-canvas relative overflow-hidden" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mouseX.set(((e.clientX - r.left) / r.width) * 100); mouseY.set(((e.clientY - r.top) / r.height) * 100); }}>
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-primary-foreground sm:px-8">
          <Link to="/" className="flex items-center gap-3 font-display text-lg font-extrabold"><span className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-button"><Sparkles className="h-5 w-5" /></span>Portfolia</Link>
          <div className="hidden items-center gap-7 text-sm font-semibold text-primary-foreground/80 md:flex"><a href="#features">Features</a><a href="#templates">Templates</a><a href="#testimonials">Stories</a></div>
          <div className="flex gap-2"><Button asChild variant="glass"><Link to="/login">Login</Link></Button><Button asChild variant="premium"><Link to="/signup">Create Account</Link></Button></div>
        </nav>
        <div className="relative mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-primary-foreground">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-4 py-2 text-sm font-semibold backdrop-blur"><Shield className="h-4 w-4" />Secure portfolio builder for modern professionals</div>
            <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">Build Your Professional Portfolio in Minutes</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/75">Create an account, add your career story once, and generate a beautiful responsive portfolio with premium templates, analytics, sharing, and resume export.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg" variant="premium"><Link to="/signup">Create Account <ArrowRight className="h-4 w-4" /></Link></Button><Button asChild size="lg" variant="glass"><Link to="/login">Login</Link></Button></div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-primary-foreground/80"><Metric value="4" label="templates" /><Metric value="12+" label="sections" /><Metric value="PDF" label="export" /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }} className="glass-panel animate-float rounded-[2rem] p-4">
            <PortfolioPreview portfolio={starterPortfolio} compact />
          </motion.div>
        </div>
      </motion.section>

      <SectionBlock id="features" eyebrow="Features" title="Everything your personal brand needs, in one premium workspace.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{features.map((feature, i) => <motion.div key={feature} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="glass-panel rounded-3xl p-6"><Check className="mb-5 h-6 w-6 text-primary" /><h3 className="font-display text-lg font-bold">{feature}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Polished interactions, clean data flows, and responsive layouts tuned for mobile, tablet, and desktop.</p></motion.div>)}</div>
      </SectionBlock>

      <SectionBlock eyebrow="How it works" title="From signup to live portfolio in three focused steps.">
        <div className="grid gap-5 md:grid-cols-3">{["Create a secure account", "Fill guided dashboard sections", "Publish and share your portfolio"].map((step, i) => <div key={step} className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-premium)]"><span className="text-4xl font-black text-primary/25">0{i + 1}</span><h3 className="mt-5 font-display text-xl font-bold">{step}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Designed to remove friction while keeping your content structured and reusable.</p></div>)}</div>
      </SectionBlock>

      <SectionBlock id="templates" eyebrow="Templates Preview" title="Choose the tone that matches your profession.">
        <div className="grid gap-4 md:grid-cols-4">{Object.entries(templateCopy).map(([key, t]) => <div key={key} className="group rounded-3xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"><div className="mb-5 h-36 rounded-2xl soft-gradient p-4"><div className="h-3 w-20 rounded-full bg-primary/50" /><div className="mt-8 h-4 w-28 rounded-full bg-foreground/15" /><div className="mt-3 h-4 w-20 rounded-full bg-foreground/10" /></div><h3 className="font-display font-bold">{t.name}</h3><p className="mt-2 text-sm text-muted-foreground">{t.tone}</p></div>)}</div>
      </SectionBlock>

      <SectionBlock id="testimonials" eyebrow="Testimonials" title="Built for people who want credibility without the design grind.">
        <div className="grid gap-4 md:grid-cols-3">{["My portfolio finally looks like the work I do.", "The dashboard is fast, focused, and client-ready.", "PDF export and share links made applications painless."].map((quote) => <div key={quote} className="glass-panel rounded-3xl p-6"><div className="mb-4 flex gap-1 text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div><p className="font-display text-lg font-semibold">“{quote}”</p><p className="mt-4 text-sm text-muted-foreground">Verified portfolio creator</p></div>)}</div>
      </SectionBlock>
      <footer className="border-t border-border px-5 py-10 text-center text-sm text-muted-foreground">© 2026 Portfolia. Premium portfolio builder powered by Lovable Cloud.</footer>
    </div>
  );
}

function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", remember: true });
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const parsed = mode === "signup" ? signupSchema.safeParse(form) : authSchema.safeParse(form);
    if (!parsed.success) { toast.error(mode === "signup" ? "Check your name, email, and strong password requirements." : "Enter a valid email and password."); setBusy(false); return; }
    const result = mode === "signup"
      ? await supabase.auth.signUp({ email: form.email, password: form.password, options: { emailRedirectTo: window.location.origin + "/dashboard", data: { full_name: form.fullName } } })
      : await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    setBusy(false);
    if (result.error) { toast.error(result.error.message); return; }
    toast.success(mode === "signup" ? "Account created. Check your email to verify your account." : "Welcome back — redirecting to dashboard.");
    if (mode === "login") navigate("/dashboard");
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) toast.error(result.error.message || "Google sign-in failed");
  };

  return <div className="hero-canvas flex min-h-screen items-center justify-center px-5 py-10"><div className="glass-panel w-full max-w-md rounded-[2rem] p-6 sm:p-8"><Link to="/" className="mb-8 flex items-center gap-3 font-display text-xl font-extrabold text-primary-foreground"><span className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-button"><Sparkles /></span>Portfolia</Link><h1 className="font-display text-3xl font-extrabold text-primary-foreground">{mode === "signup" ? "Create your account" : "Login securely"}</h1><p className="mt-2 text-sm text-primary-foreground/70">{mode === "signup" ? "Start building your premium portfolio workspace." : "Access your dashboard and portfolio editor."}</p><form onSubmit={submit} className="mt-7 space-y-4">{mode === "signup" && <Field label="Full Name"><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Alex Morgan" /></Field>}<Field label="Email ID"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></Field><Field label="Password"><div className="relative"><Input type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-muted-foreground">{show ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}</button></div></Field>{mode === "signup" && <Field label="Confirm Password"><Input type={show ? "text" : "password"} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></Field>}{mode === "login" && <div className="flex items-center justify-between text-sm text-primary-foreground/75"><label className="flex items-center gap-2"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />Remember me</label><button type="button" onClick={() => toast.info("Password reset emails can be enabled from the auth settings next.")}>Forgot password?</button></div>}<Button type="submit" variant="premium" className="w-full" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}{mode === "signup" ? "Create Account" : "Login"}</Button></form><Button variant="glass" className="mt-3 w-full" onClick={google}><Mail className="h-4 w-4" />Continue with Google</Button><p className="mt-6 text-center text-sm text-primary-foreground/70">{mode === "signup" ? "Already have an account? " : "New here? "}<Link className="font-semibold text-primary-foreground" to={mode === "signup" ? "/login" : "/signup"}>{mode === "signup" ? "Login" : "Create Account"}</Link></p></div></div>;
}

export const LoginPage = () => <AuthPage mode="login" />;
export const SignupPage = () => <AuthPage mode="signup" />;

export function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState<Section>("overview");
  const [portfolio, setPortfolio] = useState<PortfolioState>(defaultPortfolio);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => { document.documentElement.classList.toggle("dark", portfolio.theme_mode === "dark"); }, [portfolio.theme_mode]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!user) return;
    supabase.from("portfolios").select("*").eq("user_id", user.id).maybeSingle().then(async ({ data, error }) => {
      if (error) toast.error(error.message);
      if (!data) {
        const created = await supabase.from("portfolios").insert({ user_id: user.id, personal: { email: user.email || "" }, slug: user.id.replace(/-/g, "").slice(0, 12) }).select("*").single();
        data = created.data;
      }
      if (data) setPortfolio(fromRow(data));
      setFetching(false);
    });
  }, [user, loading, navigate]);

  if (loading || fetching) return <DashboardShell active={active} setActive={setActive} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu}><div className="grid gap-5 md:grid-cols-2"><Skeleton className="h-48 rounded-3xl" /><Skeleton className="h-48 rounded-3xl" /><Skeleton className="h-96 rounded-3xl md:col-span-2" /></div></DashboardShell>;
  if (!user) return null;

  const save = async () => {
    setSaving(true);
    const payload = toPayload(portfolio, user.id);
    const { error, data } = await supabase.from("portfolios").upsert(payload, { onConflict: "user_id" }).select("*").single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setPortfolio(fromRow(data));
    toast.success("Portfolio saved to your secure workspace.");
  };
  const signOut = async () => { await supabase.auth.signOut(); toast.success("Logged out"); navigate("/"); };
  const publish = async () => { const next = { ...portfolio, is_published: !portfolio.is_published }; setPortfolio(next); await supabase.from("portfolios").update({ is_published: next.is_published }).eq("user_id", user.id); toast.success(next.is_published ? "Portfolio published" : "Portfolio unpublished"); };
  const generateBio = () => { const bio = `${portfolio.personal.title || "Professional"} ${portfolio.personal.fullName ? portfolio.personal.fullName : ""} with strengths in ${portfolio.skills.slice(0, 3).map((s) => s.name).join(", ") || "strategy, delivery, and collaboration"}. Known for turning complex ideas into polished, measurable work across ${portfolio.projects.length || "multiple"} standout projects.`; setPortfolio({ ...portfolio, generated_bio: bio }); toast.success("Bio improved with AI-style polish."); };
  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    buildDeedyResumePdf(doc, portfolio);
    const fileName = `${(portfolio.personal.fullName || "portfolio").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio"}-deedy-resume.pdf`;
    doc.save(fileName);
    toast.success("Deedy-style resume PDF downloaded.");
  };
  const share = async () => { const url = `${window.location.origin}/p/${portfolio.slug || user.id.replace(/-/g, "").slice(0, 12)}`; await navigator.clipboard.writeText(url); toast.success("Share link copied."); };

  return <DashboardShell active={active} setActive={setActive} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} signOut={signOut}>
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><p className="text-sm font-semibold text-primary">Portfolio Builder Dashboard</p><h1 className="font-display text-3xl font-extrabold sm:text-4xl">Craft, publish, and measure your portfolio.</h1></div><div className="flex flex-wrap gap-2"><Button variant="glass" onClick={() => setPortfolio({ ...portfolio, theme_mode: portfolio.theme_mode === "dark" ? "light" : "dark" })}>{portfolio.theme_mode === "dark" ? <Sun /> : <Moon />}Theme</Button><Button variant="glass" onClick={share}><Share2 />Share</Button><Button variant="glass" onClick={downloadPdf}><FileDown />Resume PDF</Button><Button variant="premium" onClick={save} disabled={saving}>{saving && <Loader2 className="animate-spin" />}Save</Button></div></div>
    {active === "overview" && <Overview portfolio={portfolio} publish={publish} setActive={setActive} generateBio={generateBio} />}
    {active === "personal" && <PersonalEditor portfolio={portfolio} setPortfolio={setPortfolio} />}
    {active === "projects" && <ListEditor title="Projects" items={portfolio.projects} add={() => setPortfolio({ ...portfolio, projects: [...portfolio.projects, { id: uid(), title: "", client: "", technologies: "", description: "", startDate: "", endDate: "", demoLink: "", githubLink: "", imageUrl: "" }] })} render={(item, update, remove) => <ProjectForm item={item} update={update} remove={remove} />} setItems={(projects) => setPortfolio({ ...portfolio, projects })} />}
    {active === "experience" && <ListEditor title="Experience" items={portfolio.experiences} add={() => setPortfolio({ ...portfolio, experiences: [...portfolio.experiences, { id: uid(), company: "", startDate: "", endDate: "", designation: "", responsibilities: "", location: "" }] })} render={(item, update, remove) => <ExperienceForm item={item} update={update} remove={remove} />} setItems={(experiences) => setPortfolio({ ...portfolio, experiences })} />}
    {active === "skills" && <ListEditor title="Skills" items={portfolio.skills} add={() => setPortfolio({ ...portfolio, skills: [...portfolio.skills, { id: uid(), name: "", level: "Intermediate", category: "Frontend" }] })} render={(item, update, remove) => <SkillForm item={item} update={update} remove={remove} />} setItems={(skills) => setPortfolio({ ...portfolio, skills })} />}
    {active === "certificates" && <ListEditor title="Certificates" items={portfolio.certificates} add={() => setPortfolio({ ...portfolio, certificates: [...portfolio.certificates, { id: uid(), institute: "", course: "", startDate: "", endDate: "", technologies: "", url: "" }] })} render={(item, update, remove) => <CertificateForm item={item} update={update} remove={remove} />} setItems={(certificates) => setPortfolio({ ...portfolio, certificates })} />}
    {active === "education" && <ListEditor title="Education" items={portfolio.education} add={() => setPortfolio({ ...portfolio, education: [...portfolio.education, { id: uid(), course: "", university: "", trade: "", startYear: "", endYear: "", grade: "" }] })} render={(item, update, remove) => <EducationForm item={item} update={update} remove={remove} />} setItems={(education) => setPortfolio({ ...portfolio, education })} />}
    {active === "additional" && <AdditionalEditor portfolio={portfolio} setPortfolio={setPortfolio} />}
    {active === "social" && <SocialEditor portfolio={portfolio} setPortfolio={setPortfolio} />}
    {active === "preview" && <PortfolioPreview portfolio={portfolio} />}
    {active === "settings" && <SettingsEditor portfolio={portfolio} setPortfolio={setPortfolio} publish={publish} />}
  </DashboardShell>;
}

export function PublicPortfolioPage() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { supabase.from("portfolios").select("*").eq("slug", slug || "").eq("is_published", true).maybeSingle().then(({ data }) => { if (data) setPortfolio(fromRow(data)); setLoading(false); }); }, [slug]);
  if (loading) return <div className="min-h-screen bg-background p-8"><Skeleton className="mx-auto h-[80vh] max-w-6xl rounded-3xl" /></div>;
  if (!portfolio) return <NotAvailable />;
  return <div className={cn("min-h-screen p-4 sm:p-8", portfolio.theme_mode === "dark" && "dark")}><PortfolioPreview portfolio={portfolio} /></div>;
}

function DashboardShell({ children, active, setActive, signOut, mobileMenu, setMobileMenu }: { children: React.ReactNode; active: Section; setActive: (s: Section) => void; signOut?: () => void; mobileMenu: boolean; setMobileMenu: (v: boolean) => void }) {
  return <div className="min-h-screen bg-background"><button onClick={() => setMobileMenu(true)} className="fixed left-4 top-4 z-40 rounded-xl border border-border bg-card p-3 shadow-lg lg:hidden"><Menu /></button><aside className={cn("fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card/90 p-4 backdrop-blur-xl transition-transform lg:translate-x-0", mobileMenu ? "translate-x-0" : "-translate-x-full")}><div className="mb-8 flex items-center justify-between"><Link to="/" className="flex items-center gap-3 font-display text-xl font-extrabold"><span className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-button text-primary-foreground"><Sparkles /></span>Portfolia</Link><button className="lg:hidden" onClick={() => setMobileMenu(false)}><X /></button></div><nav className="space-y-1">{navItems.map((item) => <button key={item.key} onClick={() => { setActive(item.key); setMobileMenu(false); }} className={cn("flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition", active === item.key ? "gradient-button text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><item.icon className="h-4 w-4" />{item.label}</button>)}</nav><Button variant="glass" className="mt-6 w-full justify-start" onClick={signOut}><LogOut />Logout</Button></aside><main className="px-5 py-20 lg:ml-72 lg:px-8 lg:py-8"><div className="mx-auto max-w-7xl">{children}</div></main></div>;
}

const navItems: { key: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Dashboard Overview", icon: LayoutDashboard }, { key: "personal", label: "Personal Details", icon: UserRound }, { key: "projects", label: "Projects", icon: Rocket }, { key: "experience", label: "Experience", icon: BriefcaseBusiness }, { key: "skills", label: "Skills", icon: BarChart3 }, { key: "certificates", label: "Certificates", icon: Shield }, { key: "education", label: "Education", icon: GraduationCap }, { key: "additional", label: "Additional Info", icon: Sparkles }, { key: "social", label: "Social Links", icon: LinkIcon }, { key: "preview", label: "Portfolio Preview", icon: Eye }, { key: "settings", label: "Settings", icon: Settings }
];

function Overview({ portfolio, publish, setActive, generateBio }: { portfolio: PortfolioState; publish: () => void; setActive: (s: Section) => void; generateBio: () => void }) {
  const completion = Math.round(([portfolio.personal.fullName, portfolio.personal.title, portfolio.personal.about, portfolio.projects.length, portfolio.skills.length, portfolio.experiences.length, portfolio.education.length, portfolio.social_links.linkedin || portfolio.social_links.github].filter(Boolean).length / 8) * 100);
  return <div className="grid gap-5 lg:grid-cols-3"><div className="glass-panel rounded-3xl p-6 lg:col-span-2"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-2xl font-bold">Portfolio readiness</h2><p className="mt-2 text-muted-foreground">Complete the core sections and publish your shareable page.</p></div><div className="text-5xl font-black text-primary">{completion}%</div></div><div className="mt-6 h-3 rounded-full bg-muted"><div className="h-full rounded-full gradient-button" style={{ width: `${completion}%` }} /></div><div className="mt-6 flex flex-wrap gap-3"><Button variant="premium" onClick={() => setActive("personal")}>Continue editing <ArrowRight /></Button><Button variant="glass" onClick={publish}>{portfolio.is_published ? "Unpublish" : "Publish portfolio"}</Button><Button variant="glass" onClick={generateBio}><Wand2 />AI Bio Generator</Button></div></div><div className="glass-panel rounded-3xl p-6"><h2 className="font-display text-2xl font-bold">Analytics</h2><div className="mt-5 grid grid-cols-2 gap-3"><Metric value={String(portfolio.analytics?.views || 0)} label="views" /><Metric value={String(portfolio.analytics?.shares || 0)} label="shares" /></div><p className="mt-5 text-sm text-muted-foreground">Views counter and domain-ready sharing are structured for production tracking.</p></div><div className="lg:col-span-3"><PortfolioPreview portfolio={portfolio} compact /></div></div>;
}

function PersonalEditor({ portfolio, setPortfolio }: EditorProps) {
  const p = portfolio.personal;
  const set = (key: keyof typeof p, value: string) => setPortfolio({ ...portfolio, personal: { ...p, [key]: value } });
  return <Panel title="Personal Details"><div className="grid gap-4 md:grid-cols-2"><TextField label="Full Name" value={p.fullName} onChange={(v) => set("fullName", v)} /><TextField label="Professional Title" value={p.title} onChange={(v) => set("title", v)} /><TextField label="Profile Photo URL" value={p.photoUrl} onChange={(v) => set("photoUrl", v)} /><TextField label="Email" value={p.email} onChange={(v) => set("email", v)} /><TextField label="Phone Number" value={p.phone} onChange={(v) => set("phone", v)} /><TextField label="Address" value={p.address} onChange={(v) => set("address", v)} /><TextField label="City" value={p.city} onChange={(v) => set("city", v)} /><TextField label="Country" value={p.country} onChange={(v) => set("country", v)} /><div className="md:col-span-2"><Field label="About Me"><Textarea value={p.about} onChange={(e) => set("about", e.target.value)} rows={5} /></Field></div></div></Panel>;
}

type EditorProps = { portfolio: PortfolioState; setPortfolio: (p: PortfolioState) => void };
function AdditionalEditor({ portfolio, setPortfolio }: EditorProps) { const a = portfolio.additional; return <Panel title="Additional Information"><div className="grid gap-4 md:grid-cols-3">{(["languages", "hobbies", "interests"] as const).map((k) => <TextField key={k} label={k.replace(/^./, (c) => c.toUpperCase())} value={a[k]} onChange={(v) => setPortfolio({ ...portfolio, additional: { ...a, [k]: v } })} />)}</div></Panel>; }
function SocialEditor({ portfolio, setPortfolio }: EditorProps) { const s = portfolio.social_links; return <Panel title="Social Media Links"><div className="grid gap-4 md:grid-cols-2">{Object.keys(s).map((k) => <TextField key={k} label={k === "twitter" ? "Twitter / X" : k === "dribbble" ? "Dribbble / Behance" : k.replace(/^./, (c) => c.toUpperCase())} value={s[k as keyof typeof s]} onChange={(v) => setPortfolio({ ...portfolio, social_links: { ...s, [k]: v } })} />)}</div></Panel>; }
function SettingsEditor({ portfolio, setPortfolio, publish }: EditorProps & { publish: () => void }) { return <Panel title="Settings"><div className="grid gap-5 md:grid-cols-2"><Field label="Template"><Select value={portfolio.template} onValueChange={(v: Template) => setPortfolio({ ...portfolio, template: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(templateCopy).map(([key, t]) => <SelectItem value={key} key={key}>{t.name}</SelectItem>)}</SelectContent></Select></Field><Field label="Slug"><Input value={portfolio.slug || ""} onChange={(e) => setPortfolio({ ...portfolio, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} /></Field><div className="flex items-center justify-between rounded-2xl border border-border p-4"><div><p className="font-semibold">Published</p><p className="text-sm text-muted-foreground">Make your portfolio visible by share link.</p></div><Switch checked={portfolio.is_published} onCheckedChange={publish} /></div></div></Panel>; }

function ListEditor<T extends { id: string }>({ title, items, setItems, add, render }: { title: string; items: T[]; setItems: (items: T[]) => void; add: () => void; render: (item: T, update: (patch: Partial<T>) => void, remove: () => void) => React.ReactNode }) { return <Panel title={title} action={<Button variant="premium" onClick={add}><Plus />Add</Button>}><div className="space-y-4">{items.length === 0 && <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">No {title.toLowerCase()} yet. Add your first entry.</div>}{items.map((item) => render(item, (patch) => setItems(items.map((i) => i.id === item.id ? { ...i, ...patch } : i)), () => setItems(items.filter((i) => i.id !== item.id))))}</div></Panel>; }
function ProjectForm({ item, update, remove }: FormProps<Project>) { return <FormCard remove={remove}><div className="grid gap-4 md:grid-cols-2"><TextField label="Project Title" value={item.title} onChange={(v) => update({ title: v })} /><TextField label="Company / Job / Client Name" value={item.client} onChange={(v) => update({ client: v })} /><TextField label="Technologies / Skills Used" value={item.technologies} onChange={(v) => update({ technologies: v })} /><TextField label="Upload Project Image URL" value={item.imageUrl} onChange={(v) => update({ imageUrl: v })} /><TextField label="Start Date" value={item.startDate} onChange={(v) => update({ startDate: v })} /><TextField label="End Date" value={item.endDate} onChange={(v) => update({ endDate: v })} /><TextField label="Live Demo Link" value={item.demoLink} onChange={(v) => update({ demoLink: v })} /><TextField label="GitHub Link" value={item.githubLink} onChange={(v) => update({ githubLink: v })} /><div className="md:col-span-2"><Field label="Project Description"><Textarea value={item.description} onChange={(e) => update({ description: e.target.value })} /></Field></div></div></FormCard>; }
function ExperienceForm({ item, update, remove }: FormProps<Experience>) { return <FormCard remove={remove}><div className="grid gap-4 md:grid-cols-2"><TextField label="Company Name" value={item.company} onChange={(v) => update({ company: v })} /><TextField label="Designation" value={item.designation} onChange={(v) => update({ designation: v })} /><TextField label="Start Date" value={item.startDate} onChange={(v) => update({ startDate: v })} /><TextField label="End Date" value={item.endDate} onChange={(v) => update({ endDate: v })} /><TextField label="Location" value={item.location} onChange={(v) => update({ location: v })} /><div className="md:col-span-2"><Field label="Roles & Responsibilities"><Textarea value={item.responsibilities} onChange={(e) => update({ responsibilities: e.target.value })} /></Field></div></div></FormCard>; }
function SkillForm({ item, update, remove }: FormProps<Skill>) { return <FormCard remove={remove}><div className="grid gap-4 md:grid-cols-3"><TextField label="Skill Name" value={item.name} onChange={(v) => update({ name: v })} /><Field label="Level"><Select value={item.level} onValueChange={(v: Level) => update({ level: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Beginner", "Intermediate", "Advanced"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></Field><Field label="Category"><Select value={item.category} onValueChange={(v: Skill["category"]) => update({ category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Frontend", "Backend", "Design", "Tools"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></Field></div></FormCard>; }
function CertificateForm({ item, update, remove }: FormProps<Certificate>) { return <FormCard remove={remove}><div className="grid gap-4 md:grid-cols-2"><TextField label="Institute Name" value={item.institute} onChange={(v) => update({ institute: v })} /><TextField label="Course Name" value={item.course} onChange={(v) => update({ course: v })} /><TextField label="Course Start Date" value={item.startDate} onChange={(v) => update({ startDate: v })} /><TextField label="Course End Date" value={item.endDate} onChange={(v) => update({ endDate: v })} /><TextField label="Technologies Learned" value={item.technologies} onChange={(v) => update({ technologies: v })} /><TextField label="Certificate URL / Upload Certificate" value={item.url} onChange={(v) => update({ url: v })} /></div></FormCard>; }
function EducationForm({ item, update, remove }: FormProps<Education>) { return <FormCard remove={remove}><div className="grid gap-4 md:grid-cols-2"><TextField label="Course Name" value={item.course} onChange={(v) => update({ course: v })} /><TextField label="University Name" value={item.university} onChange={(v) => update({ university: v })} /><TextField label="Trade" value={item.trade} onChange={(v) => update({ trade: v })} /><TextField label="Start Year" value={item.startYear} onChange={(v) => update({ startYear: v })} /><TextField label="End Year" value={item.endYear} onChange={(v) => update({ endYear: v })} /><TextField label="Grade / Percentage" value={item.grade} onChange={(v) => update({ grade: v })} /></div></FormCard>; }

type FormProps<T> = { item: T; update: (patch: Partial<T>) => void; remove: () => void };
function FormCard({ children, remove }: { children: React.ReactNode; remove: () => void }) { return <div className="rounded-3xl border border-border bg-background/70 p-5"><div className="mb-4 flex justify-end"><Button variant="glass" size="sm" onClick={remove}><Trash2 />Delete</Button></div>{children}</div>; }
function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) { return <section className="glass-panel rounded-[2rem] p-5 sm:p-7"><div className="mb-6 flex items-center justify-between gap-4"><h2 className="font-display text-2xl font-extrabold">{title}</h2>{action}</div>{children}</section>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-sm font-semibold text-muted-foreground">{label}</Label>{children}</div>; }
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <Field label={label}><Input value={value} onChange={(e) => onChange(e.target.value)} /></Field>; }
function Metric({ value, label }: { value: string; label: string }) { return <div className="rounded-2xl border border-border/70 bg-background/20 p-4"><div className="font-display text-2xl font-extrabold">{value}</div><div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</div></div>; }
function SectionBlock({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) { return <section id={id} className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p><h2 className="mb-10 max-w-3xl font-display text-3xl font-extrabold sm:text-5xl">{title}</h2>{children}</section>; }

function buildDeedyResumePdf(doc: jsPDF, portfolio: PortfolioState) {
  const page = { width: 612, height: 792, margin: 44, bottom: 748 };
  const contentWidth = page.width - page.margin * 2;
  const text = (value?: string | null) => (value || "").trim();
  const muted = () => doc.setTextColor(92, 99, 112);
  const ink = () => doc.setTextColor(24, 29, 38);
  const accent = () => doc.setTextColor(40, 92, 190);
  const line = (x1: number, y: number, x2: number) => { doc.setDrawColor(214, 219, 229); doc.line(x1, y, x2, y); };
  const fit = (content: string, width: number) => doc.splitTextToSize(content, width) as string[];
  const addPageIfNeeded = (y: number, needed: number) => { if (y + needed <= page.bottom) return y; doc.addPage(); drawHeader(false); return 112; };
  const drawHeader = (firstPage = true) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, page.width, page.height, "F");
    ink(); doc.setFont("helvetica", "bold"); doc.setFontSize(firstPage ? 25 : 16); doc.text(text(portfolio.personal.fullName) || "Your Name", page.width / 2, firstPage ? 50 : 44, { align: "center" });
    muted(); doc.setFont("helvetica", "normal"); doc.setFontSize(firstPage ? 10 : 8.5); doc.text(text(portfolio.personal.title) || "Professional Portfolio", page.width / 2, firstPage ? 68 : 59, { align: "center" });
    line(page.margin, firstPage ? 94 : 78, page.width - page.margin);
  };
  const section = (title: string, y: number) => { y = addPageIfNeeded(y, 30); accent(); doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.text(title.toUpperCase(), page.margin, y); line(page.margin, y + 6, page.width - page.margin); return y + 22; };
  const paragraph = (content: string, y: number, size = 9.3, leading = 12) => { if (!content) return y; const lines = fit(content, contentWidth); y = addPageIfNeeded(y, lines.length * leading + 6); muted(); doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.text(lines, page.margin, y); return y + lines.length * leading + 6; };
  const item = (title: string, meta: string, body: string, y: number) => {
    if (!title && !body && !meta) return y;
    const titleLines = fit(title || "Untitled", contentWidth);
    const metaLines = meta ? fit(meta.toUpperCase(), contentWidth) : [];
    const bodyLines = body ? fit(body, contentWidth) : [];
    y = addPageIfNeeded(y, titleLines.length * 13 + metaLines.length * 10 + bodyLines.length * 11 + 14);
    ink(); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(titleLines, page.margin, y); y += titleLines.length * 13;
    if (metaLines.length) { accent(); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text(metaLines, page.margin, y); y += metaLines.length * 10 + 2; }
    if (bodyLines.length) { muted(); doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text(bodyLines, page.margin, y); y += bodyLines.length * 11; }
    return y + 10;
  };

  drawHeader();
  const contact = [portfolio.personal.email, portfolio.personal.phone, [portfolio.personal.city, portfolio.personal.country].filter(Boolean).join(", "), portfolio.social_links.linkedin, portfolio.social_links.github, portfolio.social_links.portfolio].map(text).filter(Boolean).join("  |  ");
  muted(); doc.setFontSize(8.4); doc.text(fit(contact, 520), page.width / 2, 84, { align: "center" });

  let y = 122;
  y = section("Profile", y);
  y = paragraph(text(portfolio.generated_bio) || text(portfolio.personal.about), y) + 4;
  y = section("Experience", y);
  portfolio.experiences.forEach((e) => { y = item(e.designation, [e.company, e.location, [e.startDate, e.endDate].filter(Boolean).join(" - ")].filter(Boolean).join(" | "), e.responsibilities, y); });
  y = section("Projects", y);
  portfolio.projects.forEach((p) => { y = item(p.title, [p.client, p.technologies, [p.startDate, p.endDate].filter(Boolean).join(" - ")].filter(Boolean).join(" | "), p.description, y); });
  y = section("Skills", y);
  Object.entries(portfolio.skills.reduce<Record<string, string[]>>((groups, skill) => ({ ...groups, [skill.category]: [...(groups[skill.category] || []), skill.name] }), {})).forEach(([category, skills]) => { y = item(category, "", skills.filter(Boolean).join(", "), y); });
  y = section("Education", y);
  portfolio.education.forEach((e) => { y = item(e.course, [e.university, e.trade, [e.startYear, e.endYear].filter(Boolean).join(" - "), e.grade].filter(Boolean).join(" | "), "", y); });
  y = section("Certificates", y);
  portfolio.certificates.forEach((c) => { y = item(c.course, [c.institute, [c.startDate, c.endDate].filter(Boolean).join(" - ")].filter(Boolean).join(" | "), c.technologies, y); });
  const extra = [portfolio.additional.languages && `Languages: ${portfolio.additional.languages}`, portfolio.additional.interests && `Interests: ${portfolio.additional.interests}`].filter(Boolean).join("\n");
  if (extra) { y = section("Additional", y); paragraph(extra, y, 8.8, 11); }
}
function NotAvailable() { return <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center"><div><h1 className="font-display text-4xl font-extrabold">Portfolio unavailable</h1><p className="mt-3 text-muted-foreground">This portfolio is private or the link is incorrect.</p><Button asChild className="mt-6" variant="premium"><Link to="/">Go home</Link></Button></div></div>; }

function fromRow(row: any): PortfolioState { return { id: row.id, slug: row.slug, is_published: row.is_published, template: (row.template || "developer") as Template, theme_mode: row.theme_mode || "dark", personal: { ...defaultPortfolio.personal, ...safeJson(row.personal, {}) }, projects: safeJson(row.projects, []), experiences: safeJson(row.experiences, []), skills: safeJson(row.skills, []), certificates: safeJson(row.certificates, []), education: safeJson(row.education, []), additional: { ...defaultPortfolio.additional, ...safeJson(row.additional, {}) }, social_links: { ...defaultPortfolio.social_links, ...safeJson(row.social_links, {}) }, generated_bio: row.generated_bio, analytics: safeJson(row.analytics, { views: 0, shares: 0 }) }; }
function toPayload(p: PortfolioState, userId: string) { return { user_id: userId, slug: p.slug || userId.replace(/-/g, "").slice(0, 12), is_published: p.is_published, template: p.template, theme_mode: p.theme_mode, personal: p.personal as any, projects: p.projects as any, experiences: p.experiences as any, skills: p.skills as any, certificates: p.certificates as any, education: p.education as any, additional: p.additional as any, social_links: p.social_links as any, generated_bio: p.generated_bio, analytics: p.analytics as any }; }
