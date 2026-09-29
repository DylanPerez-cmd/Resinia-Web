'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ImagenUnica } from './ImageField';

const VACIO = { nombre: '', comentario: '', calificacion: 5, foto: '', visible: true };

export default function PanelTestimonios() {
  const [items, setItems] = useState([]); const [f, setF] = useState(VACIO);
  const cargar = async () => { const { data } = await supabase.from('testimonios').select('*').order('created_at', { ascending: false }); setItems(data || []); };
  useEffect(() => { cargar(); }, []);

  const agregar = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('testimonios').insert(f);
    if (error) return alert('No se pudo guardar: ' + error.message);
    setF(VACIO); cargar();
  };
  const alternarVisible = async (t) => { await supabase.from('testimonios').update({ visible: !t.visible }).eq('id', t.id); cargar(); };
  const eliminar = async (id) => { await supabase.from('testimonios').delete().eq('id', id); cargar(); };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={agregar} className="panel h-fit">
        <h2 className="font-semibold">Agregar opinión</h2>
        <label className="mt-3 block text-sm font-medium">Nombre del cliente<input className="input mt-1" required value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></label>
        <label className="mt-3 block text-sm font-medium">Comentario<textarea className="input mt-1" rows={3} required value={f.comentario} onChange={(e) => setF({ ...f, comentario: e.target.value })} /></label>
        <label className="mt-3 block text-sm font-medium">Calificación
          <select className="input mt-1" value={f.calificacion} onChange={(e) => setF({ ...f, calificacion: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} estrellas</option>)}
          </select>
        </label>
        <div className="mt-3"><p className="mb-1 text-sm font-medium">Fotografía (opcional)</p><ImagenUnica valor={f.foto} onChange={(v) => setF({ ...f, foto: v })} /></div>
        <button className="btn btn-primary mt-4">Agregar opinión</button>
      </form>
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="panel flex items-start gap-3">
            {t.foto && <img src={t.foto} alt="" className="h-10 w-10 rounded-full object-cover" />}
            <div className="flex-1 text-sm">
              <p className="font-semibold">{t.nombre} · {'★'.repeat(t.calificacion)}</p>
              <p className="text-tinta/70">{t.comentario}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <button onClick={() => alternarVisible(t)} className="btn btn-soft !px-3 !py-1 text-xs">{t.visible ? 'Ocultar' : 'Mostrar'}</button>
              <button onClick={() => eliminar(t.id)} className="btn btn-soft !px-3 !py-1 text-xs">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
