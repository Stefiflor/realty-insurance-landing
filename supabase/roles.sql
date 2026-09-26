-- =============================================================================
-- Roles del panel de administración
--
-- Corré esto DESPUÉS de schema.sql (una sola vez). Agrega la distinción entre
-- administrador y colaborador que schema.sql todavía no tenía: hasta ahora
-- cualquier usuario autenticado podía publicar y borrar propiedades.
-- =============================================================================

create type staff_role as enum ('admin', 'colaborador');

-- Un perfil por usuario de auth.users, con su rol dentro del estudio.
create table profiles (
  id        uuid primary key references auth.users (id) on delete cascade,
  role      staff_role not null default 'colaborador',
  full_name text not null default '',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "cada quien ve su propio perfil"
  on profiles for select
  to authenticated
  using (id = auth.uid());

-- Cuando se crea un usuario nuevo (Authentication > Users > Add user), este
-- trigger le arma el perfil solo, con el rol más restrictivo por defecto.
-- Subirlo a "admin" es la instrucción de más abajo.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- `security definer` para que se pueda usar dentro de las políticas de otras
-- tablas sin que la RLS de `profiles` se vuelva un problema circular.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- --- se reemplaza la política demasiado permisiva de schema.sql --------------

drop policy if exists "el estudio administra propiedades" on properties;

create policy "el estudio crea propiedades"
  on properties for insert
  to authenticated
  with check (is_admin() or state <> 'publicado');

create policy "el estudio edita propiedades"
  on properties for update
  to authenticated
  using (true)
  with check (is_admin() or state <> 'publicado');

create policy "sólo un administrador borra propiedades"
  on properties for delete
  to authenticated
  using (is_admin());

-- =============================================================================
-- Último paso: convertir a Matías en administrador.
--
-- 1. Creá su usuario en Authentication > Users > Add user (con el mail y
--    contraseña que va a usar para entrar a /admin).
-- 2. Corré sólo esta parte.
-- =============================================================================

update profiles set role = 'admin'
where id = (select id from auth.users where email = 'estudioinmob.md@gmail.com');
