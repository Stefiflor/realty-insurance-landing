# MD Estudio Inmobiliario

Sitio de propiedades y seguros para MD Estudio Inmobiliario (Matías Dip).
Ventas, alquileres, terrenos y seguros, con contacto por WhatsApp.

Next.js 16 · TypeScript · Tailwind v4 · Supabase

> **Para trabajar en el código, leé [`CLAUDE.md`](./CLAUDE.md)** — tiene el mapa
> del proyecto, las reglas que hay que respetar y las decisiones ya tomadas.

---

## Arrancar

```bash
npm install
npm run dev
```

Abrí http://localhost:3000 — te redirige a `/es` según el idioma del navegador.

**No hace falta configurar nada para empezar.** Sin variables de entorno el
sitio usa datos de muestra (`src/lib/db/fixtures.ts`), así que se puede trabajar
el diseño sin base de datos.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run typecheck` | Verifica tipos — corrélo antes de commitear |
| `npm run lint` | ESLint |

### Si el servidor se rompe

Turbopack a veces deja el caché en mal estado y todas las páginas devuelven
error 500. Se arregla así:

```bash
rm -rf .next
npm run dev
```

---

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá lo que necesites. Todas son
opcionales: sin ellas el sitio funciona con datos de muestra y los botones de
WhatsApp quedan inertes.

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Base de datos |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Base de datos |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Número del estudio, formato `5491123456789` |
| `NEXT_PUBLIC_SITE_URL` | Dominio público, para los canonical y el sitemap |

`.env.local` está en `.gitignore`. **Nunca subas claves al repositorio** — si
hay que compartirlas, mandalas por otro canal.

---

## Conectar Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com) (plan gratuito).
2. En **SQL Editor**, correr `supabase/schema.sql` — crea las tablas, las
   políticas de seguridad y el bucket de fotos.
3. Opcional: correr `supabase/seed.sql` para cargar propiedades de ejemplo.
4. En **Project Settings → API**, copiar `Project URL` y la clave `anon public`
   a `.env.local`.
5. Reiniciar `npm run dev`.

---

## Desplegar en Vercel

1. Entrar a [vercel.com](https://vercel.com) e iniciar sesión con GitHub.
2. **Add New → Project** y elegir este repositorio.
3. Vercel detecta Next.js solo: no hay que tocar la configuración del build.
4. En **Environment Variables**, cargar las que correspondan (ver arriba).
   Se puede desplegar sin ninguna: sale con datos de muestra.
5. **Deploy**.

Cada push a la rama principal despliega a producción; cada push a otra rama
genera una URL de vista previa para revisar antes de mezclar.

Una vez que haya dominio, poner `NEXT_PUBLIC_SITE_URL` con la dirección
definitiva: de eso dependen el `sitemap.xml` y las etiquetas que le dicen a
Google cuál es la versión oficial de cada página.

---

## Estructura

```
design/              Maqueta visual de referencia
supabase/            schema.sql y seed.sql
src/
  app/               Rutas (App Router) y tokens de diseño en globals.css
  components/        Secciones, primitivos de UI, tema
  lib/               Dominio, acceso a datos, traducciones
```
