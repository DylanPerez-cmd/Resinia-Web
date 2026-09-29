'use client';
import { useState } from 'react';
import { waLink } from '@/lib/data';

export default function OrderForm({ productos, wa }) {
  const [f, setF] = useState({ producto: '', nombre: '', color: '', tipo: 'Nombre', texto: '', obs: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const elegido = productos.find((p) => p.nombre === f.producto);

  const enviar = (e) => {
    e.preventDefault();
    const msg = [
      'Hola, quiero hacer un pedido.',
      `Producto: ${f.producto}`,
      `Mi nombre: ${f.nombre}`,
      f.color && `Color: ${f.color}`,
      f.texto && `Personalización (${f.tipo}): ${f.texto}`,
      f.obs && `Observaciones: ${f.obs}`,
    ].filter(Boolean).join('\n');
    window.open(waLink(wa, msg), '_blank', 'noopener');
  };

  return (
    <form onSubmit={enviar} className="panel grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium md:col-span-2">Producto
        <input className="input mt-1" list="lista-productos" required value={f.producto} onChange={set('producto')} placeholder="Elige uno de la lista o escribe lo que buscas" />
        <datalist id="lista-productos">{productos.map((p) => <option key={p.id} value={p.nombre} />)}</datalist>
      </label>
      <label className="text-sm font-medium">Tu nombre
        <input className="input mt-1" required value={f.nombre} onChange={set('nombre')} />
      </label>
      <label className="text-sm font-medium">Color
        <input className="input mt-1" list="lista-colores" value={f.color} onChange={set('color')} placeholder="Ej. rosa con dorado" />
        <datalist id="lista-colores">{(elegido?.colores || []).map((c) => <option key={c} value={c} />)}</datalist>
      </label>
      <label className="text-sm font-medium">Tipo de personalización
        <select className="input mt-1" value={f.tipo} onChange={set('tipo')}>
          {['Nombre', 'Letra', 'Fotografía', 'Código QR', 'Otro'].map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium">Letra, nombre o texto que quieres colocar
        <input className="input mt-1" value={f.texto} onChange={set('texto')} />
      </label>
      <label className="text-sm font-medium md:col-span-2">Observaciones
        <textarea className="input mt-1" rows={3} value={f.obs} onChange={set('obs')} placeholder="Para cuándo lo necesitas, ideas de diseño, etc." />
      </label>
      <button className="btn btn-wa md:col-span-2">Enviar pedido por WhatsApp</button>
    </form>
  );
}
