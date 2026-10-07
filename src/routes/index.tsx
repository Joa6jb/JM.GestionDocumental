import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, BadgeCheck, ChevronDown, Clock3, FileCheck2, FileSignature, FileText, Instagram, Landmark, Mail, Menu, Settings, ShieldCheck, X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoAsset from "@/assets/logo.png";
import inquiryDesk from "@/assets/inquiry-desk.jpg";

const companyEmail = "j.m.gestiondocumental@gmail.com";
const instagramUrl = "https://www.instagram.com/joaquinfrnz/";
const whatsappUrl = "https://wa.me/5491144005923";
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
  message: z.string().trim().max(2000).optional(),
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
      phone: fields.get("phone"), service: selectedService, message: fields.get("message"),
    });
    if (!result.success) {
      setError("Revisá los datos e indicá el tipo de trámite antes de continuar.");
      return;
    }
    setError("");
    const { name, surname, email, phone, service, message } = result.data;
    const subject = `Consulta por ${service} — ${name} ${surname}`;
    const body = `Hola, quiero consultar por un trámite.\n\nNombre: ${name}\nApellido: ${surname}\nCorreo: ${email}\nTeléfono: ${phone}\nTipo de trámite: ${service}${message ? `\n\nMensaje:\n${message}` : ""}\n`;
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(body);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(companyEmail)}&su=${s}&body=${b}`;
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isAndroid) {
      // Opens the Gmail app with the draft; Chrome falls back to Gmail web if the app isn't installed.
      window.location.href = `intent:${companyEmail}?subject=${s}&body=${b}#Intent;scheme=mailto;package=com.google.android.gm;S.browser_fallback_url=${encodeURIComponent(gmailUrl)};end`;
      return;
    }
    if (isIOS) {
      let left = false;
      const onHide = () => { if (document.hidden) left = true; };
      document.addEventListener("visibilitychange", onHide);
      window.location.href = `googlegmail://co?to=${encodeURIComponent(companyEmail)}&subject=${s}&body=${b}`;
      window.setTimeout(() => {
        document.removeEventListener("visibilitychange", onHide);
        if (!left && !document.hidden) window.location.href = gmailUrl;
      }, 1500);
      return;
    }
    window.open(gmailUrl, "_blank", "noopener");
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="relative z-20 bg-primary text-primary-foreground">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 md:h-22 md:px-10">
          <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Gestoria de Documentacion, ir al inicio">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full md:size-[4.75rem]">
              <img src={logoAsset} alt="Logo de Gestoria de Documentacion" className="size-full object-cover" />
            </div>
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
            <div className="mt-10 grid gap-9 text-center sm:grid-cols-2 md:grid-cols-4 md:gap-6">
              {[{ number: "1", icon: FileSignature, title: "Completás el formulario", text: "Ingresás tus datos y el tipo de trámite que necesitás." }, { number: "2", icon: Mail, title: "Nos contactamos", text: "Te respondemos por correo con los próximos pasos y requisitos." }, { number: "3", icon: Settings, title: "Gestionamos tu trámite", text: "Te acompañamos durante el proceso y nos ocupamos de la gestion correspondiente." }, { number: "4", icon: ShieldCheck, title: "Recibís la confirmación", text: "Te mantenemos informado en cada etapa hasta la finalización de tu gestión." }].map((step) => <div key={step.number} className="relative flex flex-col items-center"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-primary font-display text-xl text-primary-foreground">{step.number}</span><step.icon size={30} strokeWidth={1.3} className="shrink-0" /></div><h3 className="mt-4 text-sm font-bold">{step.title}</h3><p className="mt-2 max-w-[220px] text-sm leading-relaxed">{step.text}</p></div>)}
            </div>
          </div>
        </section>

        <section id="nosotros" className="bg-background py-14 md:py-18" aria-labelledby="about-title">
          <div className="mx-auto grid max-w-7xl items-center gap-9 px-6 md:grid-cols-[1.2fr_1fr] md:gap-16 md:px-10">
            <div className="max-w-xl">
              <div className="section-label flex items-center gap-3"><span className="h-px w-6 bg-primary" /> SOBRE NOSOTROS</div>
              <h2 id="about-title" className="mt-3 font-display text-4xl font-semibold md:text-5xl">Somos JM</h2>
              <p className="mt-4 text-sm leading-relaxed md:text-base">Somos Joaquin y Maite, creamos JM Gestion Documental con el propósito de brindar acompañamiento claro, responsable y personalizado a todos aquellos que necesiten realizar trámites relacionados con la ciudadanía española y documentación.</p>
              <p className="mt-4 text-sm leading-relaxed md:text-base">Buscamos que cada persona pueda entender el trámite a realizar, conocer qué necesita durante el proceso y contar con nosotros durante todo el procedimiento.</p>
            </div>
            <div className="space-y-7 border border-border/60 p-6 md:p-8" aria-label="Por qué elegirnos">
              {[{ icon: ShieldCheck, title: "Trámites seguros", text: "Tu documentación en buenas manos." }, { icon: Clock3, title: "Atención personalizada", text: "Te asesoramos en todo el proceso." }, { icon: FileText, title: "Experiencia y seriedad", text: "Gestión eficiente y confiable." }].map((item) => <div key={item.title} className="flex items-start gap-5"><item.icon size={34} strokeWidth={1.3} className="shrink-0" /><div><h3 className="font-display text-xl font-bold leading-tight">{item.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p></div></div>)}
            </div>
          </div>
        </section>

        <section id="consulta" className="relative isolate scroll-mt-4 overflow-hidden bg-primary py-12 text-primary-foreground md:py-14">
          <img src={inquiryDesk} alt="" loading="lazy" width={1536} height={768} className="absolute inset-0 -z-20 size-full object-cover object-bottom" />
          <div className="inquiry-shade absolute inset-0 -z-10" />
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[0.85fr_1.65fr] md:gap-14 md:px-10">
            <div>
              <div className="section-label flex items-center gap-3"><span className="h-px w-6 bg-gold" /> ¿TENÉS UNA CONSULTA?</div>
              <h2 className="mt-3 font-display text-4xl font-semibold">Completá el formulario</h2>
              <p className="mt-3 text-sm opacity-90">Te contactaremos a la brevedad.</p>
            </div>
            <form onSubmit={submitInquiry} className="min-w-0 text-left" noValidate>
              <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold">Nombre <Input name="name" autoComplete="given-name" required maxLength={100} className="mt-2 h-12 rounded-none border-primary-foreground/35 bg-background text-foreground" placeholder="Tu nombre" /></label>
                <label className="block text-xs font-semibold">Apellido <Input name="surname" autoComplete="family-name" required maxLength={100} className="mt-2 h-12 rounded-none border-primary-foreground/35 bg-background text-foreground" placeholder="Tu apellido" /></label>
                <label className="block text-xs font-semibold">Correo electrónico <Input name="email" type="email" autoComplete="email" required maxLength={255} className="mt-2 h-12 rounded-none border-primary-foreground/35 bg-background text-foreground" placeholder="tu@correo.com" /></label>
                <label className="block text-xs font-semibold">Número telefónico <Input name="phone" type="tel" autoComplete="tel" required maxLength={30} className="mt-2 h-12 rounded-none border-primary-foreground/35 bg-background text-foreground" placeholder="+54 11 1234 5678" /></label>
                <label className="block text-xs font-semibold sm:col-span-2">Tipo de trámite <select name="service" required value={selectedService} onChange={(event) => setSelectedService(event.target.value)} className="mt-2 h-12 w-full rounded-none border border-primary-foreground/35 bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"><option value="">Seleccioná un trámite</option>{services.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}</select></label>
                <label className="block text-xs font-semibold sm:col-span-2">Mensaje (opcional) <textarea name="message" rows={3} maxLength={2000} placeholder="Contanos más sobre tu consulta o si hay datos que debamos tener en cuenta." className="mt-2 w-full rounded-none border border-primary-foreground/35 bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" /></label>
              </div>
              {error && <p role="alert" className="mt-4 text-sm text-primary-foreground">{error}</p>}
              <div className="mt-5 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between"><p className="max-w-sm text-xs leading-relaxed opacity-90">Al continuar, se abrirá Gmail con la consulta preparada. Revisá y enviá el mensaje desde allí.</p><Button type="submit" variant="gold" size="lg" className="h-12 w-full shrink-0 rounded-sm px-6 text-xs font-semibold uppercase lg:w-auto">Preparar consulta <ArrowRight /></Button></div>
            </form>
          </div>
        </section>
      </main>
      <footer className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-primary-foreground/25 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-10"><span className="text-xs">© {new Date().getFullYear()} Gestoria de Documentacion</span><div className="flex items-center gap-4"><a className="inline-flex size-14 items-center justify-center border border-primary-foreground/30 text-primary-foreground transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" width={30} height={30} aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.95L0 24l6.25-1.64a11.9 11.9 0 0 0 5.8 1.48h.01C18.65 23.84 24 18.48 24 11.9c0-3.19-1.24-6.18-3.48-8.42ZM12.06 21.83a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.85 9.85 0 0 1-1.51-5.27c0-5.47 4.45-9.92 9.92-9.92a9.85 9.85 0 0 1 7.01 2.91 9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.92-9.97 9.92Zm5.44-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.09 4.49.71.3 1.26.48 1.69.62.71.22 1.35.19 1.86.11.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" /></svg></a><a className="inline-flex size-14 items-center justify-center border border-primary-foreground/30 text-primary-foreground transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Abrir Instagram" title="Instagram"><Instagram size={30} strokeWidth={1.5} aria-hidden="true" /></a><a className="inline-flex size-14 items-center justify-center border border-primary-foreground/30 text-primary-foreground transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href={`mailto:${companyEmail}`} aria-label="Enviar correo" title="Correo"><Mail size={30} strokeWidth={1.5} aria-hidden="true" /></a></div></div></footer>
    </div>
  );
}
