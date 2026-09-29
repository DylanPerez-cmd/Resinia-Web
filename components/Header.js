'use client';
import Link from 'next/link';
import { useState } from 'react';

const LINKS = [['Catálogo', '/catalogo'], ['Trabajos realizados', '/#trabajos'], ['Cómo pedir', '/#como-pedir'], ['Opiniones', '/#opiniones'], ['Preguntas', '/#faq']];

export default function Header({ a }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-tinta/10 bg-fondo/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <img src={a.logo || '/logo.svg'} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-serif text-xl font-semibold">{a.nombre}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {LINKS.map(([t, h]) => <Link key={h} href={h} className="hover:text-ambar">{t}</Link>)}
          <Link href="/#pedido" className="btn btn-primary !py-2">Hacer pedido</Link>
        </nav>
        <button className="text-2xl md:hidden" onClick={() => setAbierto(!abierto)} aria-label="Abrir menú">{abierto ? '✕' : '☰'}</button>
      </div>
      {abierto && (
        <nav className="flex flex-col gap-3 px-4 pb-4 text-sm md:hidden">
          {LINKS.map(([t, h]) => <Link key={h} href={h} onClick={() => setAbierto(false)}>{t}</Link>)}
          <Link href="/#pedido" onClick={() => setAbierto(false)} className="btn btn-primary">Hacer pedido</Link>
        </nav>
      )}
    </header>
  );
}
