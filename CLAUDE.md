# MD Estudio Inmobiliario

Sitio público y panel de gestión para MD Estudio Inmobiliario (Matías Dip).
El estudio ofrece **ventas, alquileres, terrenos y seguros**, y la web existe
para mostrar todo eso junto y **que lo contacten por WhatsApp**.

No hay un negocio principal: la home es una puerta de entrada, no un catálogo.

---

## Cómo arrancar

```bash
npm install
cp .env.example .env.local   # completá las variables (o dejalas vacías)
npm run dev
```

Sin variables de entorno el sitio **igual funciona**: la capa de datos cae a las
fixtures de `src/lib/db/fixtures.ts`. Eso es a propósito — se puede trabajar el
diseño sin tocar Supabase.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| **`npm run check`** | **Tipos + lint + build. Corrélo antes de pushear.** |
| `npm run build` | Build de producción |
| `npm run typecheck` | Sólo los tipos |
| `npm run lint` | Sólo ESLint |

**`npm run build` no corre ESLint, pero Vercel sí lo evalúa.** Ya pasó una vez:
el build local daba verde y el despliegue fallaba. Por eso existe
`npm run check`, que corre los tres en orden y falla en el primero que rompa.

---

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** en modo estricto
- **Tailwind v4** — configuración en CSS, sin `tailwind.config.js`
- **Supabase** — Postgres, auth del panel y storage de imágenes

---

## Mapa del proyecto

```
design/                      El canvas de diseño (ver "Diseño" abajo)
supabase/schema.sql          Esquema de la base + políticas RLS
src/
  proxy.ts                   Detecta idioma del navegador y redirige a /es|/en|/pt
  app/
    globals.css              TOKENS DE DISEÑO. Empezá por acá.
    layout.tsx               Fuentes, tema, metadataBase
    [locale]/layout.tsx      Metadata por idioma (canonical + hreflang)
    [locale]/page.tsx        La landing: trae los datos y ensambla las secciones
  components/
    sections/                Secciones de la landing, en orden de aparición
    property/                Tarjeta y fila de propiedad
    layout/                  Header, footer, botón flotante, selector de idioma
    ui/                      Primitivos: Button, Badge, Card, Icon, Logo…
    theme/                   Claro/oscuro
  lib/
    domain/types.ts          TIPOS DEL NEGOCIO. La otra cosa por la que empezar.
    domain/format.ts         Precios, superficies, ubicaciones
    domain/whatsapp.ts       Armado de enlaces de contacto
    db/                      Acceso a datos (Supabase + fixtures)
    i18n/                    Diccionarios ES / EN / PT
    hooks/                   Hooks compartidos
```

### Los filtros viven en la URL

El listado (`/[locale]/propiedades`) guarda su estado en la barra de
direcciones, no en React: `?operacion=alquiler&ciudad=CABA&seguro=1`.

Es a propósito. Una búsqueda así se puede pasar por WhatsApp, guardar en
favoritos y deshacer con el botón de atrás — cosas que la gente espera de un
buscador de propiedades y que un `useState` rompe. Además la página se
renderiza ya filtrada en el servidor: no hay parpadeo de carga.

La traducción entre URL y objeto vive en `src/lib/domain/filters.ts`. Los
nombres de los parámetros están en español y **cambiarlos invalida los enlaces
ya compartidos**. Todo valor que no se reconoce se descarta en silencio: la URL
la escribe cualquiera y no puede romper la página.

### Cómo fluyen los datos en la landing

`[locale]/page.tsx` es un Server Component: trae de la base las destacadas de
**las cuatro operaciones a la vez** y se las pasa ya agrupadas a
`<PropertyShowcase>`. Por eso cambiar de pestaña en el buscador es instantáneo
— no hay consulta al servidor, sólo un cambio de estado.

`<PropertyShowcase>` es el único componente cliente grande, porque el buscador y
la grilla comparten la operación elegida. El resto de las secciones son de
servidor.

---

## Las seis reglas que importan

### 1. Los colores viven en `globals.css`, en ningún otro lado

Todo color, sombra y curva de animación es un token CSS. En los componentes se
usan como utilidades de Tailwind: `bg-surface`, `text-dim`, `border-hair`,
`shadow-lg`.

```tsx
<div className="bg-surface text-dim border-hair" />   // ✅
<div className="bg-white text-gray-500 border-gray-200" />  // ❌
```

Si falta un color, **agregalo primero como token** en `:root` y en `.dark`, y
recién después usalo. Un color inventado en un componente rompe el modo oscuro
en silencio.

**Paleta de marca** (`feature/alt-design`, 09/2026 — variante cálida sobre el
mismo sistema de tokens; el logo del cliente cambió a "M" carbón + "D" en
degradé naranja/ámbar con un tajo cruzándola):

| Token | Hex | Uso |
| --- | --- | --- |
| `--brand` (naranja MD) | `#f36b21` | Color principal. A diferencia del petróleo de la variante anterior, el naranja tiene luminosidad de sobra para leerse igual en `.dark` — no necesita aclararse por tema. |
| `--brand-strong` (naranja oscuro) | `#d95316` | Hover de botones/enlaces sólidos. |
| `--brand-light` (ámbar) | `#f5a623` | Acento secundario, gradiente del "en un solo lugar" del Hero. |
| `--accent` (petróleo complementario) | `#29474b` | **Sólo detalles**: bloques chicos detrás de las costuras del collage, líneas. En `.dark` pasa a `#82979d` (glaciar) para no perderse contra el fondo oscuro. |
| `--sage` (azul glaciar) | `#82979d` | Complementario, uso puntual. |
| `--band` / `--hero-bg` (marfil cálido) | `#f7f3eb` | Fondo alterno de sección (nunca blanco puro ahí). |
| `--input` (arena clara) | `#eee7dd` | Superficies de formulario. |
| `--hair` / `--hair-strong` (bordes cálidos) | `#dcd5ca` | Bordes — tibios, no grises fríos. |
| `--text-dim` (texto secundario) | `#6f706f` | Cuerpo de texto que no es el principal. |
| `--whatsapp` | `#25d366` | **Exclusivo** de acciones de WhatsApp. Nunca color general de la interfaz. |

No inventes un naranja/verde genérico "por las dudas": si necesitás un tono
nuevo, sale de esta paleta o se agrega acá primero.

### 2. Los componentes no hablan con Supabase

Toda lectura pasa por `src/lib/db/properties.ts`. Los componentes llaman a
`listFeatured()`, `getPropertyBySlug()`, etc. y reciben tipos de dominio.

La traducción entre columnas de Postgres y objetos de dominio vive en
`src/lib/db/mappers.ts`. Si renombrás una columna, ese es el único archivo que
toca — más el `schema.sql`.

### 3. El español es el idioma de referencia

`src/lib/i18n/dictionaries.ts` deriva el tipo `Dictionary` del diccionario
español. Agregar una clave en `es` **rompe el typecheck** hasta que la traduzcas
en `en` y `pt`. Eso es deliberado: no se despliega con textos sin traducir.

Nunca escribas texto visible directo en un componente. Todo sale del diccionario.

**Cuidado con los enums:** los valores de `Operation`, `PropertyKind` y demás
están en español porque son datos, no interfaz. Nunca los muestres crudos —
pasalos por el diccionario (`t.properties.kinds[property.kind]`). Si no, un
visitante inglés ve "DEPARTAMENTO".

### 4. WhatsApp es el único canal de contacto

No hay formulario y no lo agregues sin que lo pida el cliente. Cada botón de
contacto abre un chat con mensaje precargado (`src/lib/domain/whatsapp.ts`), y
desde una ficha de propiedad el mensaje incluye el código para que el estudio
sepa de cuál se trata.

Si `NEXT_PUBLIC_WHATSAPP_PHONE` está vacío, `whatsappLink()` devuelve `null`.
Manejá ese caso: un enlace roto es peor que ningún enlace.

### 5. Móvil primero, siempre

**La mayoría entra desde el celular.** Nada se considera terminado si no
funciona a 360px de ancho.

Escribí el estilo base para móvil y agregá breakpoints hacia arriba, nunca al
revés:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />  // ✅
<div className="grid grid-cols-3 max-lg:grid-cols-1" />              // ❌
```

Los breakpoints que usa el proyecto:

| | Ancho | Qué cambia |
| --- | --- | --- |
| (base) | 0+ | Una columna, menú hamburguesa, padding `px-6` |
| `sm` | 640px | Dos columnas en tarjetas, filas horizontales |
| `md` | 768px | Padding `px-10` |
| `lg` | 1024px | Nav de escritorio, layouts de dos columnas, `px-14` |
| `xl` | 1280px | Cuatro columnas en servicios, medidas del canvas |

Reglas concretas:

- **Tipografía grande con `clamp()`**, no con saltos por breakpoint. Los títulos
  ya lo hacen: escalan con el viewport y nunca quedan gigantes ni diminutos.
- **11px es el piso** de tamaño de texto. La única excepción es la bajada del
  logo, que es decorativa.
- **44px de alto mínimo** en cualquier cosa que se toque. Si el diseño pide algo
  más chico, ampliá el área con `py-2.5 -my-2.5`: crece el toque, no el espacio.
- **Ningún desborde horizontal.** `body` tiene `overflow-x: hidden` como red de
  seguridad, pero eso tapa el síntoma — si algo se sale, arreglá la causa.
- **Lo decorativo se oculta antes que lo útil.** La imagen del hero y el
  contador "04 / SERVICIOS" desaparecen en móvil; el copy y los botones nunca.

Para verificarlo hay un script en el scratchpad que mide desbordes, tamaños de
texto y áreas táctiles con Chrome headless en 360/390/768/1440px. Si no está,
abrí las devtools en 360px: alcanza.

### 6. El movimiento es discreto, nunca el protagonista

Desde el rebranding de 09/2026 la marca es editorial y cálida, no "tech": se
sacaron a propósito los degradés mesh animados del fondo, el halo que seguía al
cursor (`usePointerGlow`), el shimmer de los botones y la línea de escaneo del
Hero — leían como glassmorphism/neón, lo opuesto al pedido del cliente.

Lo que queda en `globals.css` como `@utility` (`animate-rise`, `animate-mask-up`,
`animate-line-x`, `animate-marquee`, `animate-pulse-ring`) es intencional: una
entrada suave al cargar la página, nada continuo ni llamativo. Antes de sumar
una animación nueva, preguntate si hace falta — la regla del cliente fue
explícita: "evitá animaciones innecesarias".

Todo respeta `prefers-reduced-motion`: hay una regla global que corta las
animaciones para quien lo pidió. **No rompas eso.**

---

## Modelo de datos

Cuatro tablas (`supabase/schema.sql`):

- **`properties`** — el aviso. `state` controla la visibilidad: sólo
  `publicado` es público, vía RLS.
- **`property_images`** — guarda **rutas** de storage, no URLs. La URL pública
  se arma en `mappers.ts`, así mover el bucket no obliga a migrar filas.
- **`insurance_products`** — el catálogo de coberturas.
- **`enquiries`** — registra el clic a WhatsApp con su intención y desde qué
  propiedad salió. Sirve para saber qué avisos generan consultas.

Los enums de Postgres replican las uniones de `src/lib/domain/types.ts`.
**Si cambiás uno, cambiá el otro en el mismo commit.**

### Cómo conectar Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com) (plan gratuito).
2. En el **SQL Editor**, pegar y correr `supabase/schema.sql` — crea tablas,
   políticas de seguridad y el bucket de fotos.
3. Opcional: correr `supabase/seed.sql` para cargar propiedades de ejemplo y ver
   el sitio andando con la base.
4. En **Project Settings → API**, copiar `Project URL` y la clave `anon public`
   a `.env.local` (partiendo de `.env.example`).
5. Reiniciar `npm run dev`.

Sin esos pasos el sitio funciona igual, con las fixtures.

### Datos de muestra

Tanto las fixtures como `seed.sql` son **inventadas** (propiedades, precios,
zonas). Antes de producción hay que cargar las reales y borrar las de ejemplo:

```sql
delete from properties where code like 'MD-%';
```

---

## Diseño

**El canvas en `design/` (y el link de abajo) quedó desactualizado tras el
rebranding de 09/2026** — muestra la paleta teal/oscura vieja, no la identidad
petróleo/marfil actual. Sirve para ver el panel de administración (todavía no
tocado por el rebrand) y la estructura general, pero **no** para colores,
tipografía de marca ni el hero: para eso, la fuente de verdad es el sitio
actual (`npm run dev`) y esta guía.

**https://claude.ai/code/artifact/5e719e23-9efc-47ad-9731-864f8ab11fc0**

Los archivos `.dc.html` son el formato del editor de diseño, no código de la
app. No los importes.

### Assets de marca

Provistos por el cliente, en `public/`, tal cual (no recrear ni recolorear):

- `public/team/logo.png` — isotipo "MD" (versión carbón + naranja/ámbar). Ya
  recortado a su bounding box real con fondo transparente. `LogoMark`/`Logo`
  en `src/components/ui/Logo.tsx` lo consumen con `next/image`; no lleva el
  nombre del estudio adentro, por eso el wordmark "MD ESTUDIO INMOBILIARIO"
  sigue viviendo aparte, al lado. Tiene ruido/artefactos chicos de compresión
  visibles de cerca — es el archivo tal cual lo entregó el cliente, no tocar.
- `public/hero/{casa,terreno,alquiler,firma}.png` — las cuatro fotos sueltas
  del collage del Hero (casa patagónica, vista de Ushuaia, habitación,
  documentación). A diferencia de la variante anterior, **no** están
  compuestas en una sola imagen: `Hero.tsx` arma el collage con CSS real
  (`clip-path` para el corte diagonal, `filter: drop-shadow` para la sombra
  por foto — un `box-shadow` no sigue el recorte). Si cambiás el layout del
  collage, es en `Hero.tsx`, no en las imágenes.
- `public/team/matias-dip.jpg` — foto de Matías para "Estudio", a color
  (no blanco y negro), recortada de cintura para arriba.

### Tipografía

| Familia | Para qué | Clase |
| --- | --- | --- |
| Sora | Todo el texto | `font-sans` (default) |
| Instrument Serif itálica | Sólo el acento del hero | `font-display` |
| JetBrains Mono | Etiquetas técnicas, códigos, cifras | `font-mono` |

Instrument Serif es **sólo para el hero**. Si aparece en otro lado, es un error.

### Íconos

Todos en `src/components/ui/Icon.tsx`: SVG de trazo, grilla de 24, grosor 1.7,
heredan `currentColor`. **Nada de emoji.** Si falta uno, dibujalo ahí siguiendo
el mismo estilo.

La única excepción es `WhatsappGlyph`: es una marca registrada y va reproducida
como es, con relleno.

---

## Pendientes

Hecho:

- [x] Base, design system y capa de datos
- [x] Detección de idioma y rutas `/es`, `/en`, `/pt`
- [x] Landing completa: hero, marquesina, buscador, propiedades, servicios,
      coberturas, contacto, footer
- [x] Responsive de 360px a escritorio, con menú hamburguesa
- [x] Ficha de propiedad con galería, cobertura asociada, similares,
      metadata propia y datos estructurados para buscadores
- [x] Página 404 propia
- [x] Listado con filtros por operación, tipo, ciudad, precio y seguro,
      con las búsquedas compartibles por URL
- [x] `sitemap.xml` y `robots.txt`
- [x] Buscador de la home conectado al catálogo (los cuatro campos)
- [x] Botón de compartir en la ficha
- [x] Sección "Estudio" con la bio real de Matías, sus matrículas y foto
- [x] Rebranding completo (09/2026): paleta petróleo/marfil/arena, logo e
      imagen de portada reales del cliente, tipografía sin abusar del mono,
      se sacaron los efectos "tech" (mesh, halo cursor, shimmer, 3D tilt)
- [x] `feature/alt-design`: segunda variante visual sobre la misma base —
      paleta carbón/naranja/ámbar, logo nuevo, collage del Hero armado con
      las 4 fotos sueltas del cliente en vez de una imagen compuesta

Falta:

- [ ] **Conectar Supabase** — el schema y los datos de ejemplo están listos
      en `supabase/`; falta crear el proyecto y cargar las claves.
      **Bloquea el panel**: sin base no hay nada que guardar.
- [ ] **Panel de administración** (ver abajo)
- [ ] Paginación del listado (hoy trae hasta 60 y alcanza; con cientos de
      propiedades hará falta)
- [ ] Registrar las consultas en la tabla `enquiries` al hacer clic en WhatsApp
- [ ] Mapa real en la ficha (hoy hay un marcador; falta cargar coordenadas)
- [ ] Optimizar las fotos de propiedades con `next/image` cuando haya fotos
      reales (hoy se usa `<img>` porque el host de Supabase Storage debe
      declararse en `next.config.ts`; la foto del Hero y la de "Estudio" ya
      usan `next/image` porque son estáticas, no vienen de Supabase)

### El panel, ya definido con el cliente

Decisiones tomadas, para que quien lo construya no tenga que volver a preguntar:

- **Roles diferenciados**: un administrador que puede todo, y colaboradores que
  cargan propiedades pero no publican ni borran. El estado `publicado` es el
  que separa un permiso del otro.
- **Alcance completo**: propiedades con fotos, catálogo de seguros y sus
  asignaciones, y la vista de consultas recibidas por WhatsApp con la propiedad
  de la que salieron.
- Vive bajo `/admin`, fuera de `[locale]`: es interno y va sólo en español.
  `robots.txt` ya lo excluye de los buscadores.
- Las políticas RLS de `supabase/schema.sql` hoy dan permiso total a cualquier
  usuario autenticado. **Hay que afinarlas para los dos roles** antes de dar
  acceso a un colaborador.
- [ ] Reemplazar el placeholder `[TU NÚMERO]` cuando Matías pase el número de
      WhatsApp (la matrícula del footer ya está cargada)
- [ ] Términos y privacidad — el footer los enlaza, falta el texto legal

---

## Convenciones

- **Comentarios en español**, como el resto del proyecto.
- Comentá el **porqué**, no el qué. Si el código explica el qué, no lo repitas.
- **Nunca un placeholder entre corchetes visible en la interfaz** (`[TU
  NÚMERO]`, `[FOTO]`, `[MATRÍCULA]`...). Si falta un dato real: (a) si el
  elemento puede omitirse sin romper el layout, no lo renderices (ver
  `displayPhone()` en `Contact.tsx`), o (b) si tiene que ocupar un espacio,
  usá un texto de espera sin corchetes ("Fotos próximamente"). El corchete
  vive como mucho en un comentario del código, nunca en un string que se
  muestra.
- `npm run check` tiene que pasar antes de pushear.
- **Nombres de rama siempre en inglés** (ej. `fix/mobile-nav-overflow`,
  `feature/admin-panel`), aunque el resto del proyecto esté en español.
