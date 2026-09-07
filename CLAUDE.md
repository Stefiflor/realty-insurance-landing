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
| `npm run build` | Build de producción |
| `npm run typecheck` | `tsc --noEmit` — corrélo antes de cada commit |
| `npm run lint` | ESLint |

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

El teal `#3e8e96` sale del logo del estudio. No lo cambies.

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

### 6. El movimiento es parte del diseño, no decoración

Las animaciones (mesh del hero, revelados por máscara, halo que sigue al cursor,
marquesina) están definidas en `globals.css` como `@utility`. Usalas desde ahí.

Todo respeta `prefers-reduced-motion`: hay una regla global que corta las
animaciones para quien lo pidió, y `usePointerGlow` directamente no se monta.
**No rompas eso.**

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

El canvas de referencia está en `design/` y se abre acá:

**https://claude.ai/code/artifact/5e719e23-9efc-47ad-9731-864f8ab11fc0**

Tiene la landing y el panel completos, con los valores exactos de color,
tipografía y espaciado. **Cuando dudes de una medida, mirá el canvas** — es la
fuente de verdad visual, no tu criterio.

Los archivos `.dc.html` son el formato del editor de diseño, no código de la
app. No los importes.

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

Falta:

- [ ] **Conectar Supabase** — el schema y los datos de ejemplo están listos
      en `supabase/`; falta crear el proyecto y cargar las claves
- [ ] Paginación del listado (hoy trae hasta 60 y alcanza; con cientos de
      propiedades hará falta)
- [ ] Los tres campos del buscador de la home son maqueta: sólo la operación
      viaja al listado. Falta conectar ubicación, tipo y presupuesto.
- [ ] Panel: login, tabla de propiedades, alta/edición, directorio de seguros
- [ ] Registrar las consultas en la tabla `enquiries` al hacer clic en WhatsApp
- [ ] Mapa real en la ficha (hoy hay un marcador; falta cargar coordenadas)
- [ ] `sitemap.xml` y `robots.txt`
- [ ] Reemplazar los placeholders: `[TU NÚMERO]`, `[MATRÍCULA]`
- [ ] Sección "Estudio" — el nav ya la enlaza, falta decidir el contenido
- [ ] Términos y privacidad — el footer los enlaza, falta el texto legal

### Decisiones abiertas con el cliente

- Si suma una sección "Nosotros" con foto y trayectoria de Matías.
- Qué matrícula profesional corresponde mostrar en el footer.

---

## Convenciones

- **Comentarios en español**, como el resto del proyecto.
- Comentá el **porqué**, no el qué. Si el código explica el qué, no lo repitas.
- Los textos entre `[CORCHETES]` son placeholders esperando dato real del
  cliente. No los inventes: si falta un dato, dejalo entre corchetes.
- `npm run typecheck` tiene que pasar antes de commitear.
