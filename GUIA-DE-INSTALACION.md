# Guía de instalación — Tienda de resina

Esta guía está escrita para alguien que **no programa**. Sigue los pasos en orden.
No necesitas tocar el código para nada de esto.

Vas a usar 3 servicios gratuitos:
- **Supabase**: guarda tus productos, fotos y tu usuario de administrador.
- **GitHub**: guarda el código del proyecto.
- **Netlify**: publica la página en internet, gratis.

---

## 1. Crear tu base de datos en Supabase

1. Entra a **supabase.com** y crea una cuenta (puedes usar tu correo de Google).
2. Clic en **New project**. Ponle un nombre (ej. "tienda-resina") y una contraseña de base de datos (guárdala, no la necesitas después pero es buena práctica).
3. Espera 1-2 minutos a que el proyecto se cree.
4. En el menú de la izquierda, entra a **SQL Editor** → **New query**.
5. Abre el archivo `supabase/schema.sql` de este proyecto, copia **todo** su contenido y pégalo ahí.
6. **Antes de darle "Run"**: busca en el texto la línea que dice
   `select lower(coalesce(auth.jwt() ->> 'email', '')) = lower('CAMBIA_ESTE_CORREO@gmail.com')`
   y cambia `CAMBIA_ESTE_CORREO@gmail.com` por el correo que **tú** vas a usar para entrar al panel de administración.
7. Clic en **Run**. Debe decir "Success". Esto crea todas las tablas, las categorías iniciales, la carpeta de fotos y las reglas de seguridad (solo tú puedes editar, cualquiera puede ver el catálogo).
8. Ve a **Authentication** → **Users** → **Add user** → **Create new user**. Escribe el mismo correo del paso 6 y una contraseña segura. Marca "Auto Confirm User". Esta es tu cuenta para entrar al panel `/admin`.
9. Ve a **Project Settings** (ícono de engranaje) → **API**. Ahí vas a ver:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una clave larga)

   Copia esos dos valores, los vas a necesitar en el paso 3.

---

## 2. Subir el proyecto a GitHub

1. Entra a **github.com** y crea una cuenta si no tienes.
2. Clic en **New repository**. Ponle un nombre (ej. `tienda-resina`) y déjalo en **Private** o **Public**, como prefieras. Clic en **Create repository**.
3. En la página que aparece, busca la opción **uploading an existing file** (subir archivo existente).
4. Arrastra **todos los archivos y carpetas** de este proyecto (excepto la carpeta `node_modules` si existiera) a esa página y confirma la subida ("Commit changes").

*(Si en algún momento usas Claude Code o la terminal, también puedes hacerlo con `git init`, `git add .`, `git commit`, `git push`, pero no es necesario.)*

---

## 3. Publicar el sitio en Netlify (gratis)

1. Entra a **netlify.com** y crea una cuenta (puedes entrar directamente con tu cuenta de GitHub).
2. Clic en **Add new site** → **Import an existing project** → **Deploy with GitHub**.
3. Autoriza a Netlify y elige el repositorio que subiste (`tienda-resina`).
4. Netlify detecta que es un proyecto Next.js automáticamente. No cambies nada en "Build settings".
5. Antes de darle "Deploy", clic en **Add environment variables** y agrega estas tres (con los valores que copiaste en el paso 1.9):
   - `NEXT_PUBLIC_SUPABASE_URL` → tu Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → tu anon public key
   - `NEXT_PUBLIC_SITE_URL` → lo dejas vacío por ahora, lo completas en el paso 7
6. Clic en **Deploy site**. Espera 1-3 minutos.
7. Cuando termine, Netlify te da un enlace como `https://tienda-resina-abc123.netlify.app`. Ese es tu sitio público.
   - Ve a **Site settings** → **Environment variables**, edita `NEXT_PUBLIC_SITE_URL` y pon ese mismo enlace.
   - Ve a **Deploys** y clic en **Trigger deploy** → **Deploy site** para que tome el cambio.
   - (Opcional) En **Site settings** → **Domain management** puedes cambiar el nombre del enlace por uno más bonito, o conectar un dominio propio si compras uno.

**Tu enlace público** queda así: `https://TU-SITIO.netlify.app`
**Tu panel privado** queda en: `https://TU-SITIO.netlify.app/admin`

---

## 4. Entrar al panel de administración

1. Abre `https://TU-SITIO.netlify.app/admin`
2. Entra con el correo y contraseña que creaste en el paso 1.8.
3. Ya estás dentro. Nadie más puede entrar sin ese correo y contraseña — cualquier otra persona que visite `/admin` solo verá la pantalla de inicio de sesión, y aunque intente adivinar, las reglas de seguridad de la base de datos (que configuraste en el paso 1.7) bloquean cualquier cambio que no venga de tu cuenta.

---

## 5. Cómo administrar tu tienda (sin tocar código)

Todo esto se hace desde el panel `/admin`:

- **Agregar un producto**: pestaña "Productos" → llena el formulario de la izquierda (nombre, precio, categoría, colores, etc.) → sube las fotos con el botón "+ Foto" → "Agregar producto".
- **Editar un producto**: en la lista de la derecha, clic en "Editar", cambia lo que quieras, "Guardar cambios".
- **Cambiar o quitar fotografías**: dentro del formulario del producto, pasa el mouse sobre una foto y clic en la ✕ para quitarla, o "+ Foto" para agregar más.
- **Cambiar precios**: edita el producto y cambia el campo "Precio".
- **Marcar como agotado / por encargo**: edita el producto, cambia "Estado".
- **Destacar un producto** (aparece primero en la portada): marca la casilla "Producto destacado".
- **Agregar o renombrar categorías**: pestaña "Categorías".
- **Subir fotos a "Trabajos realizados"**: pestaña "Trabajos realizados".
- **Agregar opiniones de clientes**: pestaña "Opiniones".
- **Cambiar el número de WhatsApp, Instagram, Facebook, TikTok, textos de la página principal, preguntas frecuentes, el logo o el título que aparece en Google**: pestaña "Textos y contacto" → "Guardar todos los cambios".

Todos los cambios se ven reflejados en el sitio público en menos de un minuto, sin que tengas que volver a publicar nada.

---

## 6. Cómo hacer una copia de seguridad

En Supabase: **Project Settings** → **Database** → **Backups** (los proyectos gratuitos guardan respaldos automáticos varios días atrás).
Para una copia manual: **SQL Editor** → puedes exportar tus tablas con `Table Editor` → selecciona una tabla → botón **Export** → **Export as CSV**, y guardarlo en tu computadora. Repite con cada tabla (`productos`, `categorias`, `trabajos`, `testimonios`, `ajustes`) cuando quieras respaldar.

---

## Notas importantes

- Todo funciona con planes **gratuitos**: Supabase (base de datos + fotos + usuarios), Netlify (hosting) y GitHub (código). No hay tarjeta de crédito de por medio para empezar.
- Las contraseñas y claves nunca están escritas dentro del código: viven en las "Environment variables" de Netlify, tal como pediste.
- Los visitantes normales solo pueden **ver** el catálogo. Solo tu cuenta (la del paso 1.6 y 1.8) puede crear, editar o eliminar cosas — esto lo garantiza Supabase, no el sitio web en sí, así que aunque alguien conozca la dirección `/admin`, sin tu contraseña no puede entrar ni modificar nada.
- No hay pagos en línea: cada pedido se cierra por WhatsApp, como pediste.
- Si alguna vez quieres agregar pagos en línea, dominio propio, o notificaciones automáticas, se puede añadir después sin rehacer el proyecto.
