-- =============================================================================
-- MD Estudio Inmobiliario — esquema de base
--
-- Correlo en el SQL editor de Supabase, o con `supabase db push` si usás la CLI.
-- Los enums replican las uniones de `src/lib/domain/types.ts`: si cambiás uno,
-- cambiá el otro en el mismo commit.
-- =============================================================================

-- --- enums -------------------------------------------------------------------

create type operation as enum ('venta', 'alquiler', 'terreno', 'temporario');

create type property_kind as enum (
  'casa', 'departamento', 'ph', 'estudio',
  'lote', 'campo', 'cabana', 'local', 'oficina'
);

create type listing_state as enum ('publicado', 'revision', 'borrador', 'pausado');

create type currency as enum ('ARS', 'USD');

create type price_period as enum ('unico', 'mes', 'noche');

create type insurance_kind as enum (
  'hogar', 'garantia', 'responsabilidad', 'construccion',
  'vida', 'ahorro', 'asistencia'
);

create type enquiry_intent as enum ('comprar', 'alquilar', 'terreno', 'seguro', 'tasar');

create type site_locale as enum ('es', 'en', 'pt');

-- --- productos de seguro -----------------------------------------------------

create table insurance_products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  kind        insurance_kind not null,
  name        text not null,
  description text not null,
  -- Línea corta en versalitas que acompaña al producto, ej. "APROBACIÓN EN 48 H".
  detail      text not null,
  -- Aseguradoras con las que se cotiza este producto.
  carriers    text[] not null default '{}',
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- --- propiedades -------------------------------------------------------------

create table properties (
  id          uuid primary key default gen_random_uuid(),
  -- Código visible al cliente, ej. "MD-1042".
  code        text not null unique,
  slug        text not null unique,
  title       text not null,
  description text not null default '',

  operation   operation not null,
  kind        property_kind not null,
  state       listing_state not null default 'borrador',

  price_amount   numeric(14, 2) not null,
  price_currency currency not null,
  price_period   price_period not null,

  neighbourhood text not null default '',
  city          text not null,
  province      text not null,
  lat           double precision,
  lng           double precision,

  -- Cifras de la ficha. Nulas cuando no aplican al tipo de propiedad:
  -- un lote no tiene ambientes, un monoambiente no tiene superficie de terreno.
  rooms         smallint,
  bedrooms      smallint,
  bathrooms     smallint,
  covered_area  numeric(10, 2),
  total_area    numeric(12, 2),
  area_unit     text check (area_unit in ('m2', 'ha')),
  floor         smallint,
  has_parking   boolean not null default false,
  -- Rasgos sueltos que se listan tal cual: "Pileta", "Terraza", "Wi-Fi".
  highlights    text[] not null default '{}',

  -- El diferencial del estudio: qué cobertura acompaña a esta operación.
  insurance_product_id uuid references insurance_products (id) on delete set null,

  featured   boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- El público filtra por operación sobre avisos publicados: ese es el índice
-- que más se usa.
create index properties_public_idx on properties (state, operation, created_at desc);
create index properties_featured_idx on properties (featured) where state = 'publicado';
create index properties_city_idx on properties (city);

-- --- imágenes ----------------------------------------------------------------

create table property_images (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties (id) on delete cascade,
  -- Ruta dentro del bucket de storage, no una URL absoluta: la URL pública se
  -- arma al leer, así el bucket puede cambiar sin migrar datos.
  path        text not null,
  alt         text not null default '',
  -- 0 es la portada.
  position    smallint not null default 0,
  created_at  timestamptz not null default now()
);

create index property_images_property_idx on property_images (property_id, position);

-- --- consultas ---------------------------------------------------------------

-- Todo el contacto sale por WhatsApp, así que esto registra el clic y su
-- contexto: sirve para saber qué propiedades generan consultas, no para
-- almacenar la conversación.
create table enquiries (
  id          uuid primary key default gen_random_uuid(),
  intent      enquiry_intent not null,
  property_id uuid references properties (id) on delete set null,
  locale      site_locale not null default 'es',
  created_at  timestamptz not null default now()
);

create index enquiries_property_idx on enquiries (property_id, created_at desc);

-- --- updated_at automático ---------------------------------------------------

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_touch_updated_at
  before update on properties
  for each row execute function touch_updated_at();

-- =============================================================================
-- Row Level Security
--
-- Regla general: el público sólo ve avisos publicados; escribir requiere estar
-- autenticado (el panel de administración). Las consultas las puede crear
-- cualquiera, pero sólo el estudio puede leerlas.
-- =============================================================================

alter table properties          enable row level security;
alter table property_images     enable row level security;
alter table insurance_products  enable row level security;
alter table enquiries           enable row level security;

-- Propiedades: lectura pública sólo de lo publicado.
create policy "propiedades publicadas son públicas"
  on properties for select
  using (state = 'publicado');

create policy "el estudio ve todas las propiedades"
  on properties for select
  to authenticated
  using (true);

create policy "el estudio administra propiedades"
  on properties for all
  to authenticated
  using (true)
  with check (true);

-- Imágenes: visibles si su propiedad lo es.
create policy "imágenes de propiedades publicadas son públicas"
  on property_images for select
  using (
    exists (
      select 1 from properties p
      where p.id = property_images.property_id
        and p.state = 'publicado'
    )
  );

create policy "el estudio administra imágenes"
  on property_images for all
  to authenticated
  using (true)
  with check (true);

-- Seguros: el catálogo es público.
create policy "los productos de seguro son públicos"
  on insurance_products for select
  using (true);

create policy "el estudio administra los seguros"
  on insurance_products for all
  to authenticated
  using (true)
  with check (true);

-- Consultas: cualquiera registra una, sólo el estudio las lee.
create policy "cualquiera registra una consulta"
  on enquiries for insert
  with check (true);

create policy "el estudio lee las consultas"
  on enquiries for select
  to authenticated
  using (true);

-- =============================================================================
-- Storage: fotos de las propiedades
--
-- El bucket es público de lectura porque las fotos se muestran en avisos
-- públicos. Subir y borrar requiere estar autenticado (el panel).
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

create policy "las fotos de propiedades son públicas"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "el estudio sube fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

create policy "el estudio actualiza fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-images');

create policy "el estudio borra fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images');
