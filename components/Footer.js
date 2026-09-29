import Link from 'next/link';
import { waLink } from '@/lib/data';

export default function Footer({ a }) {
  const redes = [['WhatsApp', waLink(a.whatsapp, 'Hola, me gustaría información sobre sus productos.')], ['Instagram', a.instagram], ['Facebook', a.facebook], ['TikTok', a.tiktok]].filter(([, u]) => u);
  return (
    <footer className="mt-24 bg-tinta text-white/85">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-white">{a.nombre}</p>
          <p className="mt-2 max-w-xs text-sm">{a.footer_texto}</p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-white">Explora</p>
          <ul className="space-y-1">
            <li><Link href="/catalogo" className="hover:text-ambar">Catálogo</Link></li>
            <li><Link href="/#trabajos" className="hover:text-ambar">Trabajos realizados</Link></li>
            <li><Link href="/#pedido" className="hover:text-ambar">Hacer pedido</Link></li>
            <li><Link href="/#faq" className="hover:text-ambar">Preguntas frecuentes</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-white">Síguenos</p>
          <div className="flex flex-wrap gap-2">
            {redes.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-4 py-1.5 hover:bg-white hover:text-tinta">{n}</a>)}
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">© {new Date().getFullYear()} {a.nombre}. Todos los derechos reservados.</p>
    </footer>
  );
}
