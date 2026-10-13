import { BadgeCheck, FileCheck2, FileText, Landmark } from "lucide-react";

export const services = [
  {
    title: "Ciudadanía española",
    description: "Te acompañamos en cada etapa de tu expediente de nacionalidad española.",
    icon: Landmark,
    needs: [
      "Documentación personal (DNI, pasaporte, actas).",
      "Certificados y partidas según cada caso.",
      "Otros documentos que puedan requerirse.",
    ],
    steps: [
      "Analizamos tu situación y te indicamos la documentación.",
      "Preparamos y presentamos el expediente.",
      "Realizamos el seguimiento hasta la resolución.",
    ],
    notes: [
      "Los plazos pueden variar según cada caso.",
      "No garantizamos la obtención de la nacionalidad, ya que es una decisión final del organismo competente.",
      "Te mantendremos informado en todo momento.",
    ],
  },
  {
    title: "Apostillado de documentos",
    description: "Gestionamos apostillas para partidas, títulos, certificados y más.",
    icon: FileCheck2,
    needs: [
      "Partidas de nacimiento, matrimonio o defunción.",
      "Títulos y certificados educativos.",
      "Documentos emitidos por autoridades públicas.",
    ],
    steps: [
      "Revisamos los documentos y confirmamos el tipo de apostilla.",
      "Coordinamos la presentación ante la autoridad competente.",
      "Te entregamos los documentos apostillados.",
    ],
    notes: [
      "Cada país tiene requisitos específicos.",
      "Algunos documentos requieren traducción posterior.",
      "Los tiempos dependen del organismo emisor.",
    ],
  },
  {
    title: "Traducciones y legalizaciones",
    description: "Traducciones oficiales y legalizaciones para presentar tus documentos.",
    icon: FileText,
    needs: [
      "Documentos redactados en idioma extranjero.",
      "Certificados y títulos académicos.",
      "Escrituras y demás documentos legales.",
    ],
    steps: [
      "Evaluamos el documento y el tipo de traducción requerida.",
      "Coordinamos la traducción con traductor público.",
      "Realizamos la legalización o apostilla final.",
    ],
    notes: [
      "Las traducciones oficiales las realiza un traductor público matriculado.",
      "Indicá el destino del documento para el formato correcto.",
      "Los tiempos varían según la extensión del documento.",
    ],
  },
  {
    title: "Otros trámites",
    description: "Contanos qué necesitás y te orientamos con tu gestión documental.",
    icon: BadgeCheck,
    needs: [
      "Documentación personal o familiar.",
      "Certificados, partidas o copias.",
      "Cualquier otro requerimiento documental.",
    ],
    steps: [
      "Nos contás qué necesitás.",
      "Evaluamos el camino más simple para tu gestión.",
      "Acompañamos el trámite de principio a fin.",
    ],
    notes: [
      "Cada gestión se organiza de forma personalizada.",
      "Te indicamos con claridad qué se puede hacer y qué no.",
      "Siempre vas a saber en qué etapa está tu trámite.",
    ],
  },
] as const;
