-- =====================================================================
-- BASE DE DATOS DE LA TIENDA DE RESINA
-- Pégalo completo en Supabase > SQL Editor > New query > Run.
-- ANTES DE EJECUTAR: cambia CAMBIA_ESTE_CORREO@gmail.com (línea de es_admin)
-- por el correo con el que vas a entrar al panel.
-- =====================================================================

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  caracteristicas text[] not null default '{}',
  precio numeric(10,2),
  categoria_id uuid references categorias(id) on delete set null,
  imagenes text[] not null default '{}',
  colores text[] not null default '{}',
  personalizacion text[] not null default '{}',
  tiempo_elaboracion text,
  estado text not null default 'disponible' check (estado in ('disponible','agotado','encargo')),
  destacado boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists trabajos (
  id uuid primary key default gen_random_uuid(),
  titulo text,
  imagen text not null,
  created_at timestamptz not null default now()
);

create table if not exists testimonios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  comentario text not null,
  calificacion int not null default 5 check (calificacion between 1 and 5),
  foto text,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ajustes (
  clave text primary key,
  valor text
);

-- ---------- SEGURIDAD ----------
-- Solo el correo del administrador puede escribir. Cualquiera puede leer el catálogo.
create or replace function public.es_admin() returns boolean
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = lower('CAMBIA_ESTE_CORREO@gmail.com')
$$;

do $$
declare t text;
begin
  foreach t in array array['categorias','productos','trabajos','testimonios','ajustes'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "escribe solo admin" on %I', t);
    execute format('create policy "escribe solo admin" on %I for all to authenticated using (public.es_admin()) with check (public.es_admin())', t);
  end loop;
  foreach t in array array['categorias','productos','trabajos','ajustes'] loop
    execute format('drop policy if exists "lectura publica" on %I', t);
    execute format('create policy "lectura publica" on %I for select using (true)', t);
  end loop;
end $$;

drop policy if exists "lectura publica" on testimonios;
create policy "lectura publica" on testimonios for select using (visible = true);

-- ---------- FOTOGRAFÍAS (Storage) ----------
insert into storage.buckets (id, name, public) values ('imagenes', 'imagenes', true)
on conflict (id) do nothing;

drop policy if exists "imagenes lectura" on storage.objects;
drop policy if exists "imagenes admin inserta" on storage.objects;
drop policy if exists "imagenes admin actualiza" on storage.objects;
drop policy if exists "imagenes admin borra" on storage.objects;
create policy "imagenes lectura" on storage.objects for select using (bucket_id = 'imagenes');
create policy "imagenes admin inserta" on storage.objects for insert to authenticated with check (bucket_id = 'imagenes' and public.es_admin());
create policy "imagenes admin actualiza" on storage.objects for update to authenticated using (bucket_id = 'imagenes' and public.es_admin());
create policy "imagenes admin borra" on storage.objects for delete to authenticated using (bucket_id = 'imagenes' and public.es_admin());

-- ---------- CATEGORÍAS INICIALES (las puedes editar desde el panel) ----------
insert into categorias (nombre, slug, orden)
select n,
       trim(both '-' from regexp_replace(lower(translate(n, 'áéíóúñÁÉÍÓÚ', 'aeiounAEIOU')), '[^a-z0-9]+', '-', 'g')),
       o
from unnest(array[
  'Llaveros con letras','Llaveros con fotografías','Llaveros con códigos QR','Llaveros con nombres',
  'Llaveros con flores secas','Llaveros para parejas','Llaveros para graduación','Llaveros empresariales',
  'Llaveros para mascotas','Placas para mascotas','Separadores de libros','Imanes personalizados',
  'Aretes de resina','Dijes','Recuerdos para cumpleaños','Recuerdos para bodas',
  'Recuerdos para baby shower','Recuerdos para graduaciones','Productos personalizados'
]) with ordinality as t(n, o)
on conflict (slug) do nothing;
