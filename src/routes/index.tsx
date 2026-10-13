import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  FileSignature,
  FileText,
  Info,
  Instagram,
  Mail,
  Menu,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import heroDesk from "@/assets/hero-desk.webp";
import heroDesk800 from "@/assets/hero-desk-800.webp";
import processDesk from "@/assets/process-desk.webp";
import logoAsset from "@/assets/logo.webp";
import inquiryDesk from "@/assets/inquiry-desk.webp";
import { services } from "@/data/services";
import { fieldOrder, inquirySchema, type FieldName } from "@/lib/inquiry";
import {
  companyEmail,
  instagramUrl,
  siteName,
  siteTagline,
  siteUrl,
  whatsappDisplay,
  whatsappNumber,
  whatsappUrl,
} from "@/lib/site";

const pageTitle = `${siteName} | Ciudadanía española y trámites consulares`;
const pageDescription =
  "Asesoramiento en ciudadanía española, apostillado, traducciones y legalizaciones de documentos. Consultanos por tu trámite.";
const ogImage = `${siteUrl}/og-image.jpg`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteName,
  url: `${siteUrl}/`,
  image: ogImage,
  description: pageDescription,
  email: companyEmail,
  telephone: `+${whatsappNumber}`,
  sameAs: [instagramUrl],
  availableLanguage: "es",
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: service.title, description: service.description },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: "description", content: pageDescription },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: pageDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteUrl}/` },
      { property: "og:site_name", content: siteName },
      { property: "og:locale", content: "es_AR" },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: `${siteName}: ciudadanía española y trámites documentales`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: pageTitle },
      { name: "twitter:description", content: pageDescription },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: `${siteUrl}/` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: Index,
});

function scrollToSection(id: string) {
  // scrollIntoView ignora la preferencia de movimiento reducido del CSS, por eso se consulta acá.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

type FieldProps = {
  label: string;
  name: FieldName;
  error?: string | undefined;
  required?: boolean;
  wide?: boolean;
  children: ReactNode;
};

function Field({ label, name, error, required = true, wide = false, children }: FieldProps) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label className="block text-sm font-semibold">
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {children}
      </label>
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 text-xs font-medium text-[color:var(--error-on-dark)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const invalidStyle =
  "aria-invalid:border-[color:var(--error-on-dark)] aria-invalid:ring-1 aria-invalid:ring-[color:var(--error-on-dark)]";
const inputClass = `mt-2 h-12 rounded-none border-primary-foreground/35 bg-background text-foreground ${invalidStyle}`;
const selectClass = `mt-2 h-12 w-full rounded-none border border-primary-foreground/35 bg-background px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring md:text-sm ${invalidStyle}`;
const textareaClass = `mt-2 w-full rounded-none border border-primary-foreground/35 bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring md:text-sm ${invalidStyle}`;

function Index() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [detailService, setDetailService] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("inicio");
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches || !("IntersectionObserver" in window)) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>([
      "header > div",
      "#inicio .max-w-\\[560px\\] > *",
      "#tramites .section-label", "#tramites h2", "#tramites article",
      "section[aria-labelledby='process-title'] .text-center > .section-label",
      "#process-title", "section[aria-labelledby='process-title'] .relative.flex",
      "#nosotros .max-w-xl > *", "#nosotros [aria-label='Por qué elegirnos'] > *",
      "#consulta .mx-auto > div > *", "#consulta form label", "#consulta form > .mt-5",
      "footer > div > *",
    ].join(",")));
    const reveal = (element: Element) => {
      element.classList.remove("reveal-pending");
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { threshold: 0.08 });
    elements.forEach((element) => {
      const siblingIndex = element.parentElement ? Array.from(element.parentElement.children).indexOf(element) : 0;
      element.dataset["motionStep"] = String(Math.min(siblingIndex, 3));
      element.classList.add("section-reveal", "reveal-pending");
      observer.observe(element);
    });
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const pending = event.target.closest(".reveal-pending");
      if (pending) reveal(pending);
    };
    const revealAll = () => { if (motionPreference.matches) elements.forEach(reveal); };
    document.addEventListener("focusin", revealFocused);
    motionPreference.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", revealFocused);
      motionPreference.removeEventListener("change", revealAll);
      elements.forEach((element) => {
        element.classList.remove("section-reveal", "reveal-pending");
        delete element.dataset["motionStep"];
      });
    };
  }, []);

  // Resalta en el menú la sección que se está viendo.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const ids = ["inicio", "tramites", "nosotros", "consulta"];
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        const current = ids.find((id) => visible.has(id));
        if (current) setActiveSection(current);
      },
      { rootMargin: "-30% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  // Cierra los menús con Escape y el desplegable de trámites al hacer clic afuera.
  useEffect(() => {
    if (!servicesOpen && !mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [servicesOpen, mobileOpen]);

  function chooseService(service: string) {
    setSelectedService(service);
    setMobileOpen(false);
    setServicesOpen(false);
    scrollToSection("consulta");
  }

  function openDetail(service: string) {
    setMobileOpen(false);
    setServicesOpen(false);
    setDetailService(service);
  }

  function clearFieldError(name: string) {
    setFieldErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name as FieldName];
      return next;
    });
  }

  function invalidProps(name: FieldName) {
    return fieldErrors[name]
      ? ({ "aria-invalid": true, "aria-describedby": `${name}-error` } as const)
      : ({} as const);
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
      const errors: Partial<Record<FieldName, string>> = {};
      for (const [key, messages] of Object.entries(result.error.flatten().fieldErrors)) {
        const first = messages?.[0];
        if (first) errors[key as FieldName] = first;
      }
      setFieldErrors(errors);
      setError("Revisá los campos marcados antes de continuar.");
      const firstInvalid = fieldOrder.find((key) => errors[key]);
      if (firstInvalid) form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setError("");
    setFieldErrors({});
    setConfirmationOpen(true);
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

  const navItemActive = "text-primary-foreground underline underline-offset-[10px]";

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary"
      >
        Saltar al contenido
      </a>
      <header className="relative z-20 bg-primary text-primary-foreground">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 md:h-22 md:px-10">
          <a
            href="#inicio"
            className="flex min-w-0 items-center gap-3"
            aria-label={`${siteName}, ir al inicio`}
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full md:size-[4.75rem]">
              <img
                src={logoAsset}
                alt={`Logo de ${siteName}`}
                width={192}
                height={192}
                className="size-full object-cover"
              />
            </div>
            <span className="min-w-0 leading-none">
              <strong className="block truncate font-display text-xl font-semibold md:text-2xl">
                {siteName}
              </strong>
              <small className="mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] opacity-80">
                {siteTagline}
              </small>
            </span>
          </a>
          <nav className="hidden items-center gap-9 text-sm md:flex" aria-label="Navegación principal">
            <a
              className="pb-1"
              href="#inicio"
              aria-current={activeSection === "inicio" ? "true" : undefined}
            >
              Inicio
            </a>
            <div
              ref={servicesRef}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setServicesOpen(false);
                }
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground ${activeSection === "tramites" ? navItemActive : ""}`}
                onClick={() => setServicesOpen(!servicesOpen)}
                aria-expanded={servicesOpen}
                aria-controls="menu-tramites"
              >
                Trámites <ChevronDown className="size-3" />
              </Button>
              {servicesOpen && (
                <ul
                  id="menu-tramites"
                  className="absolute right-0 top-full w-64 border border-border bg-card py-2 text-foreground shadow-lg"
                >
                  {services.map((service) => (
                    <li key={service.title}>
                      <Button
                        variant="ghost"
                        className="h-auto w-full justify-start rounded-none px-4 py-3 text-left text-sm whitespace-normal"
                        onClick={() => openDetail(service.title)}
                      >
                        {service.title}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <a
              className="pb-1 hover:opacity-70"
              href="#nosotros"
              aria-current={activeSection === "nosotros" ? "true" : undefined}
            >
              Sobre nosotros
            </a>
            <a
              className="pb-1 hover:opacity-70"
              href="#consulta"
              aria-current={activeSection === "consulta" ? "true" : undefined}
            >
              Contacto
            </a>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground md:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            aria-controls="menu-movil"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {mobileOpen && (
          <nav
            id="menu-movil"
            className="absolute left-0 right-0 top-full border-t border-primary-foreground/20 bg-primary px-5 pb-5 text-sm shadow-lg md:hidden"
            aria-label="Navegación móvil"
          >
            <a
              className="block border-b border-primary-foreground/20 py-4"
              href="#inicio"
              onClick={() => setMobileOpen(false)}
            >
              Inicio
            </a>
            <div className="py-3 text-xs font-bold uppercase tracking-widest opacity-80">
              Tipos de trámite
            </div>
            {services.map((service) => (
              <Button
                key={service.title}
                variant="ghost"
                className="block h-auto w-full rounded-none px-0 py-2 text-left text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                onClick={() => openDetail(service.title)}
              >
                {service.title}
              </Button>
            ))}
            <a
              className="block border-t border-primary-foreground/20 py-4"
              href="#nosotros"
              onClick={() => setMobileOpen(false)}
            >
              Sobre nosotros
            </a>
            <a className="block" href="#consulta" onClick={() => setMobileOpen(false)}>
              Contacto
            </a>
          </nav>
        )}
      </header>

      <main id="contenido" tabIndex={-1}>
        <section
          id="inicio"
          className="relative isolate flex min-h-[540px] items-center overflow-hidden md:min-h-[570px]"
        >
          <img
            src={heroDesk}
            srcSet={`${heroDesk800} 800w, ${heroDesk} 1578w`}
            sizes="100vw"
            alt=""
            width={1578}
            height={996}
            fetchPriority="high"
            decoding="async"
            className="hero-image absolute inset-0 -z-20 size-full object-cover"
          />
          <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
          <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
            <div className="max-w-[560px]">
              <div className="section-label mb-7 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" /> TU GESTIÓN, EN BUENAS MANOS
              </div>
              <h1 className="font-display text-5xl font-semibold leading-[1.04] md:text-7xl">
                Ciudadanía española
                <br />y documentación
              </h1>
              <p className="mt-7 max-w-[450px] text-[15px] leading-[1.75] md:text-base">
                Te acompañamos en cada paso para que tu trámite sea más simple, rápido y seguro. Nos
                especializamos en la gestión de ciudadanía española y en la tramitación de
                documentos.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 h-12 rounded-none px-7 text-xs font-semibold uppercase tracking-wider"
              >
                <a href="#consulta">
                  Solicitá asesoramiento <ArrowRight className="ml-3" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="tramites" className="bg-background py-17 md:py-21">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="section-label flex items-center gap-3">
              <span className="h-px w-8 bg-primary" /> NUESTROS SERVICIOS
            </div>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Tus trámites, en buenas manos
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="relative flex min-h-[225px] cursor-pointer flex-col border border-border bg-card p-6 transition-colors hover:bg-secondary/60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary"
                >
                  <service.icon size={36} strokeWidth={1.2} aria-hidden="true" />
                  <h3 className="mt-5 font-display text-2xl font-semibold leading-tight">
                    <button
                      type="button"
                      data-card-trigger
                      aria-haspopup="dialog"
                      onClick={() => setDetailService(service.title)}
                      className="cursor-pointer text-left after:absolute after:inset-0 after:content-['']"
                    >
                      {service.title}
                      <span className="sr-only">: ver detalle</span>
                    </button>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed">{service.description}</p>
                  <span className="mt-auto flex justify-end pt-4" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="relative isolate overflow-hidden bg-secondary py-16 md:py-20"
          aria-labelledby="process-title"
        >
          <img
            src={processDesk}
            alt=""
            loading="lazy"
            decoding="async"
            width={800}
            height={533}
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div className="process-shade absolute inset-0 -z-10" />
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="text-center">
              <div className="section-label">¿CÓMO FUNCIONA?</div>
              <h2
                id="process-title"
                className="mt-2 font-display text-4xl font-semibold md:text-5xl"
              >
                Es muy simple
              </h2>
            </div>
            <div className="mt-10 grid gap-9 text-center sm:grid-cols-2 md:grid-cols-4 md:gap-6">
              {[
                {
                  number: "1",
                  icon: FileSignature,
                  title: "Completás el formulario",
                  text: "Ingresás tus datos y el tipo de trámite que necesitás.",
                },
                {
                  number: "2",
                  icon: Mail,
                  title: "Nos contactamos",
                  text: "Te respondemos por correo con los próximos pasos y requisitos.",
                },
                {
                  number: "3",
                  icon: Settings,
                  title: "Gestionamos tu trámite",
                  text: "Te acompañamos durante el proceso y nos ocupamos de la gestión correspondiente.",
                },
                {
                  number: "4",
                  icon: ShieldCheck,
                  title: "Recibís la confirmación",
                  text: "Te mantenemos informado en cada etapa hasta la finalización de tu gestión.",
                },
              ].map((step) => (
                <div key={step.number} className="relative flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-primary font-display text-xl text-primary-foreground">
                      {step.number}
                    </span>
                    <step.icon size={30} strokeWidth={1.3} className="shrink-0" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[220px] text-sm leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="nosotros" className="bg-background py-14 md:py-18" aria-labelledby="about-title">
          <div className="mx-auto grid max-w-7xl items-center gap-9 px-6 md:grid-cols-[1.2fr_1fr] md:gap-16 md:px-10">
            <div className="max-w-xl">
              <div className="section-label flex items-center gap-3">
                <span className="h-px w-6 bg-primary" /> SOBRE NOSOTROS
              </div>
              <h2 id="about-title" className="mt-3 font-display text-4xl font-semibold md:text-5xl">
                Somos JM
              </h2>
              <p className="mt-4 text-sm leading-relaxed md:text-base">
                Somos Joaquin y Maite, creamos {siteName} con el propósito de brindar
                acompañamiento claro, responsable y personalizado a todos aquellos que necesiten
                realizar trámites relacionados con la ciudadanía española y documentación.
              </p>
              <p className="mt-4 text-sm leading-relaxed md:text-base">
                Buscamos que cada persona pueda entender el trámite a realizar, conocer qué necesita
                durante el proceso y contar con nosotros durante todo el procedimiento.
              </p>
            </div>
            <div
              className="space-y-7 border border-border/60 p-6 md:p-8"
              aria-label="Por qué elegirnos"
            >
              {[
                { icon: ShieldCheck, title: "Trámites seguros", text: "Tu documentación en buenas manos." },
                { icon: Clock3, title: "Atención personalizada", text: "Te asesoramos en todo el proceso." },
                { icon: FileText, title: "Experiencia y seriedad", text: "Gestión eficiente y confiable." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-5">
                  <item.icon size={34} strokeWidth={1.3} className="shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-xl font-bold leading-tight">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="consulta"
          className="relative isolate scroll-mt-4 overflow-hidden bg-primary py-12 text-primary-foreground md:py-14"
        >
          <img
            src={inquiryDesk}
            alt=""
            loading="lazy"
            decoding="async"
            width={1536}
            height={768}
            className="absolute inset-0 -z-20 size-full object-cover object-bottom"
          />
          <div className="inquiry-shade absolute inset-0 -z-10" />
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[0.85fr_1.65fr] md:gap-14 md:px-10">
            <div>
              <div className="section-label flex items-center gap-3">
                <span className="h-px w-6 bg-gold" /> ¿TENÉS UNA CONSULTA?
              </div>
              <h2 className="mt-3 font-display text-4xl font-semibold">Contanos tu consulta</h2>
              <p className="mt-3 text-sm opacity-90">Te contactaremos a la brevedad.</p>
            </div>
            <form
              onSubmit={submitInquiry}
              onInput={(event) => {
                const target = event.target as HTMLInputElement;
                if (target.name) clearFieldError(target.name);
              }}
              className="min-w-0 text-left"
              noValidate
            >
              <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                <Field label="Nombre" name="name" error={fieldErrors.name}>
                  <Input
                    name="name"
                    autoComplete="given-name"
                    required
                    maxLength={100}
                    className={inputClass}
                    placeholder="Tu nombre"
                    {...invalidProps("name")}
                  />
                </Field>
                <Field label="Apellido" name="surname" error={fieldErrors.surname}>
                  <Input
                    name="surname"
                    autoComplete="family-name"
                    required
                    maxLength={100}
                    className={inputClass}
                    placeholder="Tu apellido"
                    {...invalidProps("surname")}
                  />
                </Field>
                <Field label="Correo electrónico" name="email" error={fieldErrors.email}>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    className={inputClass}
                    placeholder="tu@correo.com"
                    {...invalidProps("email")}
                  />
                </Field>
                <Field label="Número telefónico" name="phone" error={fieldErrors.phone}>
                  <Input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={30}
                    className={inputClass}
                    placeholder="+54 11 1234 5678"
                    {...invalidProps("phone")}
                  />
                </Field>
                <Field label="Tipo de trámite" name="service" error={fieldErrors.service} wide>
                  <select
                    name="service"
                    required
                    value={selectedService}
                    onChange={(event) => setSelectedService(event.target.value)}
                    className={selectClass}
                    {...invalidProps("service")}
                  >
                    <option value="">Seleccioná un trámite</option>
                    {services.map((service) => (
                      <option key={service.title} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Mensaje (opcional)"
                  name="message"
                  error={fieldErrors.message}
                  required={false}
                  wide
                >
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={2000}
                    placeholder="Contanos más sobre tu consulta o si hay datos que debamos tener en cuenta."
                    className={textareaClass}
                    {...invalidProps("message")}
                  />
                </Field>
              </div>
              {error && (
                <p role="alert" className="mt-4 text-sm font-medium text-[color:var(--error-on-dark)]">
                  {error}
                </p>
              )}
              <div className="mt-5 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
                <p className="max-w-sm text-xs leading-relaxed opacity-90">
                  Los campos con * son obligatorios. Al continuar, se abrirá Gmail con la consulta
                  preparada. Revisá y enviá el mensaje desde ahí.
                </p>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="h-12 w-full shrink-0 rounded-sm px-6 text-xs font-semibold uppercase lg:w-auto"
                >
                  Preparar consulta <ArrowRight />
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Button asChild variant="ghost" size="icon" className="whatsapp-button">
        <a
          className="whatsapp-floating"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp (se abre en una pestaña nueva)"
          title="WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width={30} height={30} aria-hidden="true">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.95L0 24l6.25-1.64a11.9 11.9 0 0 0 5.8 1.48h.01C18.65 23.84 24 18.48 24 11.9c0-3.19-1.24-6.18-3.48-8.42ZM12.06 21.83a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.85 9.85 0 0 1-1.51-5.27c0-5.47 4.45-9.92 9.92-9.92a9.85 9.85 0 0 1 7.01 2.91 9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.92-9.97 9.92Zm5.44-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.09 4.49.71.3 1.26.48 1.69.62.71.22 1.35.19 1.86.11.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
          </svg>
        </a>
      </Button>
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="inquiry-confirmation w-[calc(100%-2rem)] max-w-lg rounded-lg border-primary-foreground/20 bg-primary p-7 text-primary-foreground sm:p-10">
          <Mail className="size-10 text-gold" strokeWidth={1.3} aria-hidden="true" />
          <DialogTitle className="font-display text-3xl font-semibold tracking-normal">
            ¡Tu consulta está preparada!
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 text-sm leading-relaxed text-primary-foreground/90">
              <p>Hola, gracias por comunicarte con {siteName}.</p>
              <p>
                Preparamos tu consulta en Gmail. Para que la recibamos, revisá y enviá el correo
                desde ahí.
              </p>
              <p>Cuando lo recibamos, vamos a revisarlo para indicarte los próximos pasos.</p>
              <p className="font-semibold text-gold">{siteName}</p>
            </div>
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="gold" className="mt-2 justify-self-start">
              Entendido <ArrowRight />
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <Dialog
        open={detailService !== null}
        onOpenChange={(open) => {
          if (!open) setDetailService(null);
        }}
      >
        {(() => {
          const service = services.find((item) => item.title === detailService);
          if (!service) return null;
          return (
            <DialogContent className="max-h-[88vh] w-[calc(100%-2rem)] max-w-3xl gap-0 overflow-y-auto rounded-lg p-0">
              <div className="flex items-start gap-4 border-b border-border p-6 pr-12 md:p-7">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary">
                  <service.icon size={28} strokeWidth={1.3} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <DialogTitle className="font-display text-3xl font-semibold leading-tight">
                    {service.title}
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 text-sm leading-relaxed">
                    {service.description}
                  </DialogDescription>
                </div>
              </div>
              <div className="grid gap-7 p-6 md:grid-cols-[1.5fr_1fr] md:p-7">
                <div className="space-y-7">
                  <section>
                    <h3 className="section-label flex items-center gap-2 text-primary">
                      <FileText size={15} strokeWidth={1.6} aria-hidden="true" /> ¿Qué necesitás?
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                      {service.needs.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span
                            className="mt-[7px] size-1.5 shrink-0 rounded-full bg-gold"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3 className="section-label flex items-center gap-2 text-primary">
                      <Settings size={15} strokeWidth={1.6} aria-hidden="true" /> ¿Cómo funciona?
                    </h3>
                    <ol className="mt-3 space-y-2.5">
                      {service.steps.map((step, index) => (
                        <li key={step} className="flex items-start gap-3 text-sm leading-relaxed">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </section>
                  <section>
                    <h3 className="section-label flex items-center gap-2 text-primary">
                      <Info size={15} strokeWidth={1.6} aria-hidden="true" /> Información importante
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {service.notes.map((note) => (
                        <li key={note} className="flex gap-2.5">
                          <span
                            className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary/40"
                            aria-hidden="true"
                          />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
                <aside className="flex h-fit flex-col gap-5 self-start bg-secondary p-5">
                  <div>
                    <h3 className="section-label text-primary">¿Te interesa este trámite?</h3>
                    <p className="mt-2 text-sm leading-relaxed">
                      Podés consultarnos para recibir más información o iniciar tu caso.
                    </p>
                    <DialogClose asChild>
                      <Button
                        variant="gold"
                        className="mt-4 h-11 w-full justify-center rounded-sm text-xs font-semibold uppercase tracking-wider"
                        onClick={() => chooseService(service.title)}
                      >
                        Consultar por este trámite <ArrowRight />
                      </Button>
                    </DialogClose>
                  </div>
                  <div className="flex items-start gap-3 border-t border-border pt-4">
                    <ShieldCheck
                      size={24}
                      strokeWidth={1.4}
                      className="shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold leading-snug">
                        Tu documentación está segura
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Manejamos tu información con confidencialidad y responsabilidad.
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </DialogContent>
          );
        })()}
      </Dialog>
      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-primary-foreground/25 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="space-y-1.5 text-sm">
            <p className="text-xs">
              © {new Date().getFullYear()} {siteName}
            </p>
            <p>
              <a className="underline-offset-4 hover:underline" href={`mailto:${companyEmail}`}>
                {companyEmail}
              </a>
            </p>
            <p>
              <a
                className="underline-offset-4 hover:underline"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {whatsappDisplay}
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              className="inline-flex size-14 items-center justify-center border border-primary-foreground/30 text-primary-foreground transition-colors hover:border-gold hover:text-gold"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Instagram (se abre en una pestaña nueva)"
              title="Instagram"
            >
              <Instagram size={30} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a
              className="inline-flex size-14 items-center justify-center border border-primary-foreground/30 text-primary-foreground transition-colors hover:border-gold hover:text-gold"
              href={`mailto:${companyEmail}`}
              aria-label="Enviar correo"
              title="Correo"
            >
              <Mail size={30} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
