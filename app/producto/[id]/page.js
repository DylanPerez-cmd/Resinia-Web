import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import { ESTADOS, getAjustes, getProducto, getProductos, precio, waLink } from '@/lib/data';

export const revalidate = 30;

export async function generateMetadata({ params }) {
  const p = await getProducto(params.id);
  if (!p) return { title: 'Producto no encontrado' };
  return {
    title: p.nombre,
    description: (p.descripcion || '').slice(0, 160),
    openGraph: { title: p.nombre, description: (p.descripcion || '').slice(0, 160), ...(p.imagenes?.[0] ? { images: [p.imagenes[0]] } : {}) },
  };
}

export default async function Producto({ params }) {
  const [p, a] = await Promise.all([getProducto(params.id), getAjustes()]);
  if (!p) notFound();
  const todos = await getProductos();
  const relacionados = todos.filter((x) => x.id !== p.id && x.categoria_id && x.categoria_id === p.categoria_id).slice(0, 4);
  const msg = `Hola, estoy interesado/a en el producto ${p.nombre}. Me gustaría solicitar información para personalizarlo.`;
  const json = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.descripcion || p.nombre, image: p.imagenes,
    ...(p.precio != null ? { offers: { '@type': 'Offer', priceCurrency: 'HNL', price: p.precio, availability: p.estado === 'agotado' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' } } : {}),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
      <nav className="mb-6 text-sm text-tinta/70"><Link href="/catalogo" className="hover:text-ambar">Catálogo</Link> / {p.nombre}</nav>
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery imagenes={p.imagenes} nombre={p.nombre} />
        <div>
          {p.categorias && <Link href={`/catalogo?cat=${p.categorias.slug}`} className="text-sm text-ambar hover:underline">{p.categorias.nombre}</Link>}
          <h1 className="mt-1 font-serif text-4xl font-semibold">{p.nombre}</h1>
          <p className="mt-2 text-2xl font-semibold text-ambar">{precio(p.precio)}</p>
          <p className="mt-1 text-sm">{ESTADOS[p.estado]}{p.tiempo_elaboracion ? `. Tiempo de elaboración: ${p.tiempo_elaboracion}` : ''}</p>
          {p.descripcion && <p className="mt-5 whitespace-pre-line text-tinta/85">{p.descripcion}</p>}
          {p.caracteristicas?.length > 0 && (
            <div className="mt-6"><h2 className="font-semibold">Características</h2><ul className="mt-1 list-disc pl-5 text-sm">{p.caracteristicas.map((c) => <li key={c}>{c}</li>)}</ul></div>
          )}
          {p.colores?.length > 0 && (
            <div className="mt-6"><h2 className="font-semibold">Colores disponibles</h2><div className="mt-2 flex flex-wrap gap-2">{p.colores.map((c) => <span key={c} className="rounded-full bg-white px-3 py-1 text-sm border border-tinta/15">{c}</span>)}</div></div>
          )}
          {p.personalizacion?.length > 0 && (
            <div className="mt-6"><h2 className="font-semibold">Opciones de personalización</h2><ul className="mt-1 list-disc pl-5 text-sm">{p.personalizacion.map((c) => <li key={c}>{c}</li>)}</ul></div>
          )}
          <a href={waLink(a.whatsapp, msg)} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-8 w-full md:w-auto">Solicitar por WhatsApp</a>
        </div>
      </div>
      {relacionados.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-serif text-3xl font-semibold">Productos relacionados</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">{relacionados.map((r) => <ProductCard key={r.id} p={r} wa={a.whatsapp} />)}</div>
        </section>
      )}
    </div>
  );
}
