'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ImagenUnica } from './ImageField';

export default function PanelGaleria() {
  const [items, setItems] = useState([]); const [titulo, setTitulo] = useState(''); const [imagen, setImagen] = useState('');
  const cargar = async () => { const { data } = await supabase.from('trabajos').select('*').order('created_at', { ascending: false }); setItems(data || []); };
  useEffect(() => { cargar(); }, []);

  const agregar = async (e) => {
    e.preventDefault(); if (!imagen) return alert('Sube una fotografía primero.');
    const { error } = await supabase.from('trabajos').insert({ titulo, imagen });
    if (error) return alert('No se pudo guardar: ' + error.message);
    setTitulo(''); setImagen(''); cargar();
  };
  const eliminar = async (id) => { await supabase.from('trabajos').delete().eq('id', id); cargar(); };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={agregar} className="panel h-fit">
        <h2 className="font-semibold">Agregar trabajo realizado</h2>
        <label className="mt-3 block text-sm font-medium">Título (opcional)<input className="input mt-1" value={titulo} onChange={(e) => setTitulo(e.target.value)} /></label>
        <div className="mt-3"><ImagenUnica valor={imagen} onChange={setImagen} /></div>
        <button className="btn btn-primary mt-4">Agregar a la galería</button>
      </form>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((t) => (
          <div key={t.id} className="relative">
            <img src={t.imagen} alt={t.titulo || ''} className="aspect-square w-full rounded-lg object-cover" />
            <button onClick={() => eliminar(t.id)} className="absolute right-1.5 top-1.5 rounded-full bg-tinta/90 px-2 py-0.5 text-xs text-white">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
