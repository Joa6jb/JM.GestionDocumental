# JM Gestión Documental

Sitio web de **JM Gestión Documental**: gestoría de ciudadanía española, apostillado, traducciones y legalizaciones.

- Producción: https://jm-gestion-documental.web.app
- Stack: TanStack Start (React 19) + Vite + Tailwind CSS 4 + componentes Radix/shadcn
- Hosting: Firebase Hosting (proyecto `jm-gestion-documental`), con deploy automático al hacer push a `main`

## Comandos

```bash
npm ci               # instalar dependencias (el CI usa npm y package-lock.json)
npm run dev          # servidor de desarrollo
npm run build        # compila y prerenderiza en .output/public
npm run preview      # previsualiza el build
npm run typecheck    # revisa los tipos de TypeScript
npm run lint         # ESLint + Prettier
```

## Dónde editar cada cosa

| Qué | Archivo |
| --- | --- |
| Nombre del sitio, dominio, email, WhatsApp, Instagram | `src/lib/site.ts` |
| Servicios (textos, requisitos, pasos, notas) | `src/data/services.ts` |
| Validación y mensajes de error del formulario | `src/lib/inquiry.ts` |
| Página principal | `src/routes/index.tsx` |
| Título, metadatos y fuentes globales | `src/routes/__root.tsx` |
| Colores y estilos globales | `src/styles.css` |
| Página 404, robots y sitemap | `public/` |
| Cabeceras y caché de Firebase | `firebase.json` |

## Formulario de consulta

El formulario **no usa un servidor**: valida los datos y abre un borrador de correo (Gmail) dirigido a `companyEmail`, que la persona revisa y envía desde su propia cuenta.

## Imágenes

Usar WebP, con el ancho que se muestra en pantalla (y su versión ×2 como máximo). El hero (`hero-desk.webp`) es lo primero que se ve, así que debe mantenerse liviano (hoy ~110 KB).

## Si cambia el dominio

Actualizar `siteUrl` en `src/lib/site.ts`, la URL de `public/sitemap.xml` y la línea `Sitemap:` de `public/robots.txt`.
