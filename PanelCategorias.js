'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const slugificar = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function PanelCategorias() {
  const [items, setItems] = useState([]); const [nombre, setNombre] = useState('');
  const cargar = async () => { const { data } = await supabase.from('categorias').select('*').order('orden'); setItems(data || []); };
  useEffect(() => { cargar(); }, []);

  const agregar = async (e) => {
    e.preventDefault(); if (!nombre.trim()) return;
    const { error } = await supabase.from('categorias').insert({ nombre: nombre.trim(), slug: slugificar(nombre), orden: items.length });
    if (error) return alert('No se pudo agregar: ' + error.message);
    setNombre(''); cargar();
  };
  const renombrar = async (c, valor) => { await supabase.from('categorias').update({ nombre: valor, slug: slugificar(valor) }).eq('id', c.id); cargar(); };
  const eliminar = async (id) => { if (!confirm('¿Eliminar esta categoría? Los productos quedarán sin categoría.')) return; await supabase.from('categorias').delete().eq('id', id); cargar(); };

  return (
    <div className="panel max-w-xl">
      <h2 className="font-semibold">Categorías</h2>
      <form onSubmit={agregar} className="mt-3 flex gap-2">
        <input className="input" placeholder="Nueva categoría" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <button className="btn btn-primary shrink-0">Agregar</button>
      </form>
      <ul className="mt-4 space-y-2">
        {items.map((c) => (
          <li key={c.id} className="flex items-center gap-2">
            <input className="input" defaultValue={c.nombre} onBlur={(e) => e.target.value !== c.nombre && renombrar(c, e.target.value)} />
            <button onClick={() => eliminar(c.id)} className="btn btn-soft !px-3 !py-1.5 text-xs shrink-0">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
