'use client';
import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

async function subir(file) {
  const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
  const { error } = await supabase.storage.from('imagenes').upload(nombre, file, { cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from('imagenes').getPublicUrl(nombre).data.publicUrl;
}

export function ImagenUnica({ valor, onChange }) {
  const ref = useRef(); const [subiendo, setSubiendo] = useState(false);
  const cambiar = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setSubiendo(true);
    try { onChange(await subir(f)); } catch { alert('No se pudo subir la imagen.'); }
    setSubiendo(false); e.target.value = '';
  };
  return (
    <div className="flex items-center gap-3">
      {valor && <img src={valor} alt="" className="h-16 w-16 rounded-lg object-cover" />}
      <div className="flex gap-2">
        <button type="button" onClick={() => ref.current?.click()} className="btn btn-soft !py-1.5 !px-3 text-xs" disabled={subiendo}>{subiendo ? 'Subiendo…' : valor ? 'Cambiar foto' : 'Subir foto'}</button>
        {valor && <button type="button" onClick={() => onChange('')} className="btn btn-soft !py-1.5 !px-3 text-xs">Quitar</button>}
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={cambiar} />
    </div>
  );
}

export function ImagenesMultiples({ valores = [], onChange }) {
  const ref = useRef(); const [subiendo, setSubiendo] = useState(false);
  const agregar = async (e) => {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    setSubiendo(true);
    try { const nuevas = await Promise.all(files.map(subir)); onChange([...valores, ...nuevas]); } catch { alert('No se pudieron subir algunas imágenes.'); }
    setSubiendo(false); e.target.value = '';
  };
  const quitar = (i) => onChange(valores.filter((_, j) => j !== i));
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {valores.map((u, i) => (
          <div key={u + i} className="relative">
            <img src={u} alt="" className="h-20 w-20 rounded-lg object-cover" />
            <button type="button" onClick={() => quitar(i)} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-tinta text-xs text-white">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => ref.current?.click()} className="grid h-20 w-20 place-items-center rounded-lg border-2 border-dashed border-tinta/30 text-xs text-tinta/60" disabled={subiendo}>{subiendo ? '…' : '+ Foto'}</button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={agregar} />
    </div>
  );
}
