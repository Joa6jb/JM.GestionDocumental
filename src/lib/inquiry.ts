import { z } from "zod";

export type FieldName = "name" | "surname" | "email" | "phone" | "service" | "message";

// Orden en el que aparecen los campos: se usa para enfocar el primero con error.
export const fieldOrder: FieldName[] = ["name", "surname", "email", "phone", "service", "message"];

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Ingresá tu nombre.").max(100, "El nombre es demasiado largo."),
  surname: z
    .string()
    .trim()
    .min(1, "Ingresá tu apellido.")
    .max(100, "El apellido es demasiado largo."),
  email: z
    .string()
    .trim()
    .min(1, "Ingresá tu correo electrónico.")
    .email("Revisá el correo: debe tener el formato tu@correo.com.")
    .max(255, "El correo es demasiado largo."),
  phone: z
    .string()
    .trim()
    .min(6, "Ingresá un teléfono de contacto.")
    .max(30, "El teléfono es demasiado largo.")
    .regex(/^[+\d\s().-]+$/, "Usá solo números, espacios y los símbolos + ( ) - ."),
  service: z.enum(
    ["Ciudadanía española", "Apostillado de documentos", "Traducciones y legalizaciones", "Otros trámites"],
    { errorMap: () => ({ message: "Elegí el tipo de trámite." }) },
  ),
  message: z.string().trim().max(2000, "El mensaje puede tener hasta 2000 caracteres.").optional(),
});
