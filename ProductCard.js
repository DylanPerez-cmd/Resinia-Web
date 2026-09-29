import Link from 'next/link';
import { ESTADOS, precio, waLink } from '@/lib/data';

export default function ProductCard({ p, wa }) {
  const img = p.imagenes?.[0];
  const msg = `Hola, estoy interesado/a en el producto ${p.nombre}. Me gustaría solicitar información para personalizarlo.`;
  return (
    <article className="group flex flex-col">
      <Link href={`/producto/${p.id}`} className="block">
        <div className="arco relative aspect-[4/5] overflow-hidden bg-agua">
          {img
            ? <img src={img} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            : <div className="grid h-full place-items-center text-5xl">🌸</div>}
          <span className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold ${p.estado === 'agotado' ? 'bg-tinta text-white' : 'bg-white text-tinta'}`}>{ESTADOS[p.estado]}</span>
        </div>
        <div className="px-1 pt-3">
          <p className="text-xs text-tinta/60">{p.categorias?.nombre || 'Personalizado'}</p>
          <h3 className="font-serif text-xl font-semibold leading-snug">{p.nombre}</h3>
          <p className="mt-0.5 font-semibold text-ambar">{precio(p.precio)}</p>
        </div>
      </Link>
      <a href={waLink(wa, msg)} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-3 !py-2">Pedir por WhatsApp</a>
    </article>
  );
}
