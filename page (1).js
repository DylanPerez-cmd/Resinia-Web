import Link from 'next/link';
import Titulo from '@/components/Titulo';
import ProductCard from '@/components/ProductCard';
import OrderForm from '@/components/OrderForm';
import { getAjustes, getCategorias, getProductos, getTrabajos, getTestimonios, lineas } from '@/lib/data';

export const revalidate = 30;

export default async function Inicio() {
  const [a, cats, prods, trabajos, opiniones] = await Promise.all([getAjustes(), getCategorias(), getProductos(), getTrabajos(), getTestimonios()]);
  const destacados = prods.filter((p) => p.destacado);
  const vitrina = (destacados.length ? destacados : prods).slice(0, 8);
  const pasos = lineas(a.pasos);
  const faqs = lineas(a.faq).map((l) => l.split('::').map((s) => s.trim()));

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="entrar">
          <p className="font-serif text-lg text-ambar">{a.nombre}</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight md:text-6xl">{a.eslogan}</h1>
          <p className="mt-5 max-w-md text-tinta/75">{a.hero_texto}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalogo" className="btn btn-primary">Ver productos</Link>
            <Link href="/#pedido" className="btn btn-soft">Hacer pedido</Link>
          </div>
        </div>
        <div className="entrar-2 mx-auto w-full max-w-sm">
          <div className="arco aspect-[4/5] overflow-hidden bg-gradient-to-b from-agua via-petalo to-lila/60 shadow-xl">
            {a.hero_imagen
              ? <img src={a.hero_imagen} alt={a.nombre} className="h-full w-full object-cover" />
              : <div className="grid h-full place-items-center text-8xl">🌸</div>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Titulo sub="Piezas listas para pedir o personalizar.">{destacados.length ? 'Productos destacados' : 'Nuestros productos'}</Titulo>
        {vitrina.length === 0
          ? <p className="text-tinta/70">Pronto tendremos productos aquí. Mientras tanto, escríbenos por WhatsApp y cuéntanos qué necesitas.</p>
          : <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">{vitrina.map((p) => <ProductCard key={p.id} p={p} wa={a.whatsapp} />)}</div>}
        <div className="mt-10"><Link href="/catalogo" className="btn btn-soft">Ver todo el catálogo</Link></div>
      </section>

      <section className="bg-tinta py-16 text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-semibold md:text-4xl">{a.personalizado_titulo}</h2>
          <p className="mt-4 text-lg text-white/80">{a.personalizado_texto}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <Titulo>Categorías</Titulo>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => <Link key={c.id} href={`/catalogo?cat=${c.slug}`} className="rounded-full border border-tinta/25 bg-white px-4 py-2 text-sm hover:bg-tinta hover:text-white">{c.nombre}</Link>)}
        </div>
      </section>

      <section id="trabajos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <Titulo sub="Piezas que ya hicimos para nuestros clientes.">Trabajos realizados</Titulo>
        {trabajos.length === 0
          ? <p className="text-tinta/70">Pronto compartiremos aquí nuestros trabajos.</p>
          : <div className="columns-2 gap-3 md:columns-4">{trabajos.map((t) => <img key={t.id} src={t.imagen} alt={t.titulo || 'Trabajo realizado'} loading="lazy" className="mb-3 w-full rounded-xl" />)}</div>}
      </section>

      <section id="como-pedir" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-12">
        <Titulo>Cómo hacer tu pedido</Titulo>
        <ol className="space-y-4">
          {pasos.map((p, i) => (
            <li key={i} className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ambar font-semibold text-white">{i + 1}</span><span className="pt-1">{p}</span></li>
          ))}
        </ol>
      </section>

      <section id="pedido" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-12">
        <Titulo sub="Llena el formulario y se abrirá WhatsApp con tu mensaje listo para enviar.">Hacer pedido</Titulo>
        <OrderForm productos={prods} wa={a.whatsapp} />
      </section>

      {opiniones.length > 0 && (
        <section id="opiniones" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
          <Titulo>Lo que dicen nuestros clientes</Titulo>
          <div className="grid gap-4 md:grid-cols-3">
            {opiniones.map((o) => (
              <figure key={o.id} className="panel">
                <div className="text-ambar" aria-label={`${o.calificacion} de 5 estrellas`}>{'★'.repeat(o.calificacion)}{'☆'.repeat(5 - o.calificacion)}</div>
                <blockquote className="mt-2 text-sm">{o.comentario}</blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-sm font-semibold">
                  {o.foto && <img src={o.foto} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />}
                  {o.nombre}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-12">
        <Titulo>Preguntas frecuentes</Titulo>
        <div className="space-y-3">
          {faqs.map(([q, r], i) => (
            <details key={i} className="panel">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-2 text-sm text-tinta/80">{r}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
