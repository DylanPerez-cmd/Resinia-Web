'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ESTADOS, precio } from '@/lib/data';
import { ImagenesMultiples } from './ImageField';

const VACIO = { id: null, nombre: '', descripcion: '', caracteristicas: '', precio: '', categoria_id: '', imagenes: [], colores: '', personalizacion: '', tiempo_elaboracion: '', estado: 'disponible', destacado: false };
const aArr = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);

export default function PanelProductos() {
  const [items, setItems] = useState([]); const [cats, setCats] = useState([]);
  const [f, setF] = useState(VACIO); const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('productos').select('*, categorias(nombre)').order('created_at', { ascending: false }),
      supabase.from('categorias').select('*').order('orden'),
    ]);
    setItems(p || []); setCats(c || []);
  };
  useEffect(() => { cargar(); }, []);

  const editar = (p) => setF({
    ...VACIO, ...p, precio: p.precio ?? '', categoria_id: p.categoria_id || '',
    caracteristicas: (p.caracteristicas || []).join(', '), colores: (p.colores || []).join(', '), personalizacion: (p.personalizacion || []).join(', '),
  });

  const guardar = async (e) => {
    e.preventDefault(); setGuardando(true);
    const payload = {
      nombre: f.nombre, descripcion: f.descripcion, precio: f.precio === '' ? null : Number(f.precio),
      categoria_id: f.categoria_id || null, imagenes: f.imagenes, colores: aArr(f.colores),
      caracteristicas: aArr(f.caracteristicas), personalizacion: aArr(f.personalizacion),
      tiempo_elaboracion: f.tiempo_elaboracion, estado: f.estado, destacado: f.destacado,
    };
    const q = f.id ? supabase.from('productos').update(payload).eq('id', f.id) : supabase.from('productos').insert(payload);
    const { error } = await q;
    setGuardando(false);
    if (error) return alert('No se pudo guardar: ' + error.message);
    setF(VACIO); cargar();
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    await supabase.from('productos').delete().eq('id', id); cargar();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="panel">
        <h2 className="font-semibold">{f.id ? 'Editar producto' : 'Agregar producto'}</h2>
        <form onSubmit={guardar} className="mt-4 grid gap-3">
          <label className="text-sm font-medium">Nombre<input className="input mt-1" required value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></label>
          <label className="text-sm font-medium">Descripción<textarea className="input mt-1" rows={3} value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium">Precio (Lempiras)<input className="input mt-1" type="number" step="0.01" value={f.precio} onChange={(e) => setF({ ...f, precio: e.target.value })} placeholder="Vacío = consultar" /></label>
            <label className="text-sm font-medium">Categoría
              <select className="input mt-1" value={f.categoria_id} onChange={(e) => setF({ ...f, categoria_id: e.target.value })}>
                <option value="">Sin categoría</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium">Estado
              <select className="input mt-1" value={f.estado} onChange={(e) => setF({ ...f, estado: e.target.value })}>
                {Object.entries(ESTADOS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">Tiempo de elaboración<input className="input mt-1" value={f.tiempo_elaboracion} onChange={(e) => setF({ ...f, tiempo_elaboracion: e.target.value })} placeholder="Ej. 3 a 5 días" /></label>
          </div>
          <label className="text-sm font-medium">Colores disponibles (separados por coma)<input className="input mt-1" value={f.colores} onChange={(e) => setF({ ...f, colores: e.target.value })} placeholder="Rosa, Dorado, Transparente" /></label>
          <label className="text-sm font-medium">Opciones de personalización (separadas por coma)<input className="input mt-1" value={f.personalizacion} onChange={(e) => setF({ ...f, personalizacion: e.target.value })} placeholder="Nombre, Foto, Código QR" /></label>
          <label className="text-sm font-medium">Características (separadas por coma)<input className="input mt-1" value={f.caracteristicas} onChange={(e) => setF({ ...f, caracteristicas: e.target.value })} /></label>
          <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={f.destacado} onChange={(e) => setF({ ...f, destacado: e.target.checked })} /> Producto destacado</label>
          <div>
            <p className="mb-1 text-sm font-medium">Fotografías</p>
            <ImagenesMultiples valores={f.imagenes} onChange={(v) => setF({ ...f, imagenes: v })} />
          </div>
          <div className="mt-2 flex gap-2">
            <button className="btn btn-primary" disabled={guardando}>{guardando ? 'Guardando…' : f.id ? 'Guardar cambios' : 'Agregar producto'}</button>
            {f.id && <button type="button" className="btn btn-soft" onClick={() => setF(VACIO)}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="panel flex items-center gap-3">
            <img src={p.imagenes?.[0] || '/logo.svg'} alt="" className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex-1 text-sm">
              <p className="font-semibold">{p.nombre} {p.destacado && '⭐'}</p>
              <p className="text-tinta/60">{p.categorias?.nombre || 'Sin categoría'} · {precio(p.precio)} · {ESTADOS[p.estado]}</p>
            </div>
            <button onClick={() => editar(p)} className="btn btn-soft !px-3 !py-1.5 text-xs">Editar</button>
            <button onClick={() => eliminar(p.id)} className="btn btn-soft !px-3 !py-1.5 text-xs">Eliminar</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-tinta/60">Aún no hay productos. Agrega el primero desde el formulario.</p>}
      </div>
    </div>
  );
}
