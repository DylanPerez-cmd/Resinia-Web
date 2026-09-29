'use client';
import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { ESTADOS } from '@/lib/data';

const RANGOS = [['', 'Cualquier precio'], ['0-100', 'Hasta L 100'], ['100-250', 'L 100 a L 250'], ['250-500', 'L 250 a L 500'], ['500-9999999', 'Más de L 500']];

export default function CatalogClient({ productos, categorias, wa, catInicial = '' }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(catInicial);
  const [est, setEst] = useState('');
  const [rango, setRango] = useState('');

  const lista = useMemo(() => productos.filter((p) => {
    const texto = `${p.nombre} ${p.descripcion || ''}`.toLowerCase();
    if (q && !texto.includes(q.toLowerCase())) return false;
    if (cat && p.categorias?.slug !== cat) return false;
    if (est && p.estado !== est) return false;
    if (rango) {
      const [mn, mx] = rango.split('-').map(Number);
      const pr = Number(p.precio || 0);
      if (pr < mn || pr > mx) return false;
    }
    return true;
  }), [productos, q, cat, est, rango]);

  return (
    <div>
      <div className="panel mb-8 grid gap-3 md:grid-cols-4">
        <input className="input md:col-span-4" placeholder="Buscar producto por nombre o descripción" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => <option key={c.id} value={c.slug}>{c.nombre}</option>)}
        </select>
        <select className="input" value={rango} onChange={(e) => setRango(e.target.value)}>
          {RANGOS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="input" value={est} onChange={(e) => setEst(e.target.value)}>
          <option value="">Toda disponibilidad</option>
          {Object.entries(ESTADOS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button className="btn btn-soft !py-2" onClick={() => { setQ(''); setCat(''); setEst(''); setRango(''); }}>Limpiar filtros</button>
      </div>
      {lista.length === 0
        ? <p className="py-16 text-center text-tinta/70">No encontramos productos con esos filtros. Prueba quitando alguno o escríbenos por WhatsApp para pedir tu diseño.</p>
        : <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{lista.map((p) => <ProductCard key={p.id} p={p} wa={wa} />)}</div>}
    </div>
  );
}
