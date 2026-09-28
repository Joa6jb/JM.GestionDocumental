import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, BadgeCheck, ChevronDown, Clock3, FileCheck2, FileText, Globe2, Instagram, Landmark, Mail, Menu, ShieldCheck, X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const companyEmail = "joaquinfernandezds@gmail.com";
const instagramUrl = "https://www.instagram.com/joaquinfrnz/";
const services = [
  { title: "Ciudadanía española", description: "Te acompañamos en cada etapa de tu expediente de nacionalidad española.", icon: Landmark },
  { title: "Apostillado de documentos", description: "Gestionamos apostillas para partidas, títulos, certificados y más.", icon: FileCheck2 },
  { title: "Traducciones y legalizaciones", description: "Traducciones oficiales y legalizaciones para presentar tus documentos.", icon: FileText },
  { title: "Otros trámites", description: "Contanos qué necesitás y te orientamos con tu gestión documental.", icon: BadgeCheck },
] as const;

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  surname: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30).regex(/^[+\d\s().-]+$/),
  service: z.enum(["Ciudadanía española", "Apostillado de documentos", "Traducciones y legalizaciones", "Otros trámites"]),
});

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Gestoria de Documentacion | Ciudadanía española y trámites consulares" },
    { name: "description", content: "Asesoramiento en ciudadanía española, apostillado, traducciones y legalizaciones de documentos. Consultanos por tu trámite." },
    { property: "og:title", content: "Gestoria de Documentacion | Trámites consulares" },
    { property: "og:description", content: "Gestión de ciudadanía española, apostillas y documentos con atención personalizada." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [error, setError] = useState("");

  function chooseService(service: string) {
    setSelectedService(service);
    setMobileOpen(false);
    setServicesOpen(false);
    document.getElementById("consulta")?.scrollIntoView({ behavior: "smooth" });
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const result = inquirySchema.safeParse({
      name: fields.get("name"), surname: fields.get("surname"), email: fields.get("email"),
      phone: fields.get("phone"), service: selectedService,
    });
    if (!result.success) {
      setError("Revisá los datos e indicá el tipo de trámite antes de continuar.");
      return;
    }
    setError("");
    const { name, surname, email, phone, service } = result.data;
    const subject = `Consulta por ${service} — ${name} ${surname}`;
    const body = `Hola, quiero consultar por un trámite.\n\nNombre: ${name}\nApellido: ${surname}\nCorreo: ${email}\nTeléfono: ${phone}\nTipo de trámite: ${service}\n`;
    window.location.href = `mailto:${companyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="relative z-20 bg-primary text-primary-foreground">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 md:h-22 md:px-10">
          <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Gestoria de Documentacion, ir al inicio">
            <div className="grid size-10 shrink-0 place-items-center border border-primary-foreground/45 rounded-full md:size-12"><Landmark className="size-6 md:size-7" strokeWidth={1.25} /></div>
            <span className="min-w-0 leading-none"><strong className="block truncate font-display text-xl font-semibold md:text-2xl">Gestoria de Documentacion</strong><small className="mt-1 block text-[9px] font-medium uppercase tracking-[0.22em] opacity-75 md:text-[10px]">Gestión documental</small></span>
          </a>
          <nav className="hidden items-center gap-9 text-sm md:flex" aria-label="Navegación principal">
            <a className="border-b border-primary-foreground pb-1" href="#inicio">Inicio</a>
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setServicesOpen(!servicesOpen)} aria-expanded={servicesOpen} aria-haspopup="menu">Trámites <ChevronDown className="size-3" /></Button>
              {servicesOpen && <div className="absolute right-0 top-full w-64 border border-border bg-card py-2 text-foreground shadow-lg" role="menu">{services.map((service) => <Button key={service.title} variant="ghost" className="h-auto w-full justify-start rounded-none px-4 py-3 text-left text-sm whitespace-normal" onClick={() => chooseService(service.title)} role="menuitem">{service.title}</Button>)}</div>}
            </div>
            <a className="hover:opacity-70" href="#nosotros">Sobre nosotros</a>
            <a className="hover:opacity-70" href="#consulta">Contacto</a>
          </nav>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground md:hidden" aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</Button>
        </div>
        {mobileOpen && <nav className="absolute left-0 right-0 top-full border-t border-primary-foreground/20 bg-primary px-5 pb-5 text-sm shadow-lg md:hidden" aria-label="Navegación móvil">
          <a className="block border-b border-primary-foreground/20 py-4" href="#inicio" onClick={() => setMobileOpen(false)}>Inicio</a>
          <div className="py-3 text-xs font-bold uppercase tracking-widest opacity-60">Tipos de trámite</div>
          {services.map((service) => <Button key={service.title} variant="ghost" className="block h-auto w-full rounded-none px-0 py-2 text-left text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => chooseService(service.title)}>{service.title}</Button>)}
          <a className="block border-t border-primary-foreground/20 py-4" href="#nosotros" onClick={() => setMobileOpen(false)}>Sobre nosotros</a><a className="block" href="#consulta" onClick={() => setMobileOpen(false)}>Contacto</a>
        </nav>}
      </header>

      <main>
        <section id="inicio" className="hero-photo flex min-h-[540px] items-center md:min-h-[570px]">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
            <div className="max-w-[560px]">
              <div className="section-label mb-7 flex items-center gap-3"><span className="h-px w-8 bg-primary" /> TU GESTIÓN, EN BUENAS MANOS</div>
              <h1 className="font-display text-[clamp(2.7rem,4.5vw,4.5rem)] font-semibold leading-[0.98]">Trámites consulares<br />y apostillados de documentos</h1>
              <p className="mt-7 max-w-[450px] text-[15px] leading-[1.75] md:text-base">Te acompañamos en cada paso para que tu trámite sea más simple, rápido y seguro. Nos especializamos en la gestión de ciudadanía española y en la tramitación de documentos.</p>
              <Button asChild size="lg" className="mt-8 h-12 rounded-none px-7 text-xs font-semibold uppercase tracking-wider"><a href="#consulta">Solicitá asesoramiento <ArrowRight className="ml-3" /></a></Button>
            </div>
          </div>
        </section>

        <section id="nosotros" className="bg-secondary py-9 md:py-11" aria-label="Por qué elegirnos">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 md:grid-cols-4 md:px-10">
            {[{ icon: ShieldCheck, title: "Trámites seguros", text: "Tu documentación en buenas manos." }, { icon: Clock3, title: "Atención personalizada", text: "Te asesoramos en todo el proceso." }, { icon: FileText, title: "Experiencia y seriedad", text: "Gestión eficiente y confiable." }].map((item) => <div key={item.title} className="flex flex-col items-center border-r border-border px-3 text-center last:border-r-0 md:px-7"><item.icon size={34} strokeWidth={1.3} /><h2 className="mt-3 text-[11px] font-bold uppercase md:text-xs">{item.title}</h2><p className="mt-1.5 max-w-[185px] text-xs leading-relaxed md:text-sm">{item.text}</p></div>)}
          </div>
        </section>

        <section id="tramites" className="bg-background py-17 md:py-21">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="section-label flex items-center gap-3"><span className="h-px w-8 bg-primary" /> NUESTROS SERVICIOS</div>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">¿Qué podemos gestionar por vos?</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => <article key={service.title} className="flex min-h-[225px] flex-col border border-border bg-card p-6 transition-colors hover:bg-secondary/60"><service.icon size={36} strokeWidth={1.2} /><h3 className="mt-5 text-sm font-bold">{service.title}</h3><p className="mt-2 text-sm leading-relaxed">{service.description}</p><Button variant="ghost" size="icon" className="mt-auto self-end" onClick={() => chooseService(service.title)} aria-label={`Consultar por ${service.title}`} title={`Consultar por ${service.title}`}><ArrowRight /></Button></article>)}
            </div>
          </div>
        </section>

        <section className="paper-photo bg-secondary py-16 md:py-20" aria-labelledby="process-title">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="text-center"><div className="section-label">¿CÓMO FUNCIONA?</div><h2 id="process-title" className="mt-2 font-display text-4xl font-semibold md:text-5xl">Es muy simple</h2></div>
            <div className="mt-10 grid gap-9 text-center md:grid-cols-3 md:gap-12">
              {[{ number: "1", title: "Completás el formulario", text: "Ingresás tus datos y el tipo de trámite que necesitás." }, { number: "2", title: "Nos contactamos", text: "Te respondemos por correo con los próximos pasos y requisitos." }, { number: "3", title: "Gestionamos tu trámite", text: "Nos encargamos de todo, desde la solicitud hasta la entrega." }].map((step) => <div key={step.number} className="relative flex flex-col items-center"><span className="grid size-9 place-items-center rounded-full bg-primary font-display text-xl text-primary-foreground">{step.number}</span><h3 className="mt-4 text-sm font-bold">{step.title}</h3><p className="mt-2 max-w-[220px] text-sm leading-relaxed">{step.text}</p></div>)}
            </div>
          </div>
        </section>

        <section id="consulta" className="scroll-mt-4 bg-primary py-16 text-primary-foreground md:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Mail size={30} strokeWidth={1.3} className="mx-auto" />
            <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">¿Tenés alguna consulta?</h2>
            <p className="mt-2 text-sm opacity-80">Contanos qué trámite necesitás y nos ponemos en contacto.</p>
            <form onSubmit={submitInquiry} className="mt-9 text-left" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-xs font-semibold">Nombre <Input name="name" autoComplete="given-name" required maxLength={100} className="mt-2 h-12 rounded-none border-primary-foreground/35 bg-background text-foreground" placeholder="Tu nombre" /></label>
                <label className="block text-xs font-semibold">Apellido <Input name="surname" autoComplete="family-name" required maxLength={100} className="mt-2 h-12 rounded-none border-primary-foreground/35 bg-background text-foreground" placeholder="Tu apellido" /></label>
                <label className="block text-xs font-semibold">Correo electrónico <Input name="email" type="email" autoComplete="email" required maxLength={255} className="mt-2 h-12 rounded-none border-primary-foreground/35 bg-background text-foreground" placeholder="tu@correo.com" /></label>
                <label className="block text-xs font-semibold">Número telefónico <Input name="phone" type="tel" autoComplete="tel" required maxLength={30} className="mt-2 h-12 rounded-none border-primary-foreground/35 bg-background text-foreground" placeholder="+54 11 1234 5678" /></label>
                <label className="block text-xs font-semibold sm:col-span-2">Tipo de trámite <select name="service" required value={selectedService} onChange={(event) => setSelectedService(event.target.value)} className="mt-2 h-12 w-full rounded-none border border-primary-foreground/35 bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"><option value="">Seleccioná un trámite</option>{services.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}</select></label>
              </div>
              {error && <p role="alert" className="mt-4 text-sm text-primary-foreground">{error}</p>}
              <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-sm text-xs leading-relaxed opacity-75">Al continuar, se abrirá tu correo con la consulta preparada. Revisá y enviá el mensaje desde allí.</p><Button type="submit" variant="secondary" size="lg" className="h-12 w-full shrink-0 rounded-none px-6 text-xs font-semibold uppercase tracking-wider sm:w-auto">Preparar consulta <ArrowRight /></Button></div>
            </form>
          </div>
        </section>
      </main>
      <footer className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-primary-foreground/25 px-6 py-6 text-xs md:flex-row md:items-center md:justify-between md:px-10"><span>© {new Date().getFullYear()} Gestoria de Documentacion</span><div className="flex flex-wrap gap-6"><a className="inline-flex items-center gap-2 hover:underline" href={`mailto:${companyEmail}`}><Mail size={15} /> {companyEmail}</a><a className="inline-flex items-center gap-2 hover:underline" href={instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={15} /> Instagram</a></div></div></footer>
    </div>
  );
}
