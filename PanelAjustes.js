'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DEFAULTS } from '@/lib/data';
import { ImagenUnica } from './ImageField';

const CAMPOS = [
  ['Identidad', [['nombre', 'Nombre del emprendimiento', 'input'], ['eslogan', 'Frase principal / eslogan', 'input'], ['hero_texto', 'Texto debajo del eslogan', 'textarea']]],
  ['Contacto y redes', [['whatsapp', 'Número de WhatsApp (con código de país, solo números)', 'input'], ['instagram', 'Enlace de Instagram', 'input'], ['facebook', 'Enlace de Facebook', 'input'], ['tiktok', 'Enlace de TikTok', 'input']]],
  ['Sección "personalizado"', [['personalizado_titulo', 'Título', 'input'], ['personalizado_texto', 'Texto', 'textarea']]],
  ['Cómo pedir y preguntas frecuentes', [['pasos', 'Pasos para pedir (uno por línea)', 'textarea'], ['faq', 'Preguntas frecuentes (una por línea, formato: Pregunta :: Respuesta)', 'textarea']]],
  ['Pie de página', [['footer_texto', 'Texto del pie de página', 'textarea']]],
  ['SEO (cómo aparece en Google y al compartir)', [['seo_titulo', 'Título para buscadores', 'input'], ['seo_descripcion', 'Descripción para buscadores', 'textarea'], ['seo_keywords', 'Palabras clave separadas por coma', 'input']]],
];

export default function PanelAjustes() {
  const [v, setV] = useState(DEFAULTS); const [guardando, setGuardando] = useState(false); const [ok, setOk] = useState(false);

  useEffect(() => { (async () => {
    const { data } = await supabase.from('ajustes').select('*');
    const o = { ...DEFAULTS }; (data || []).forEach((r) => { if (r.valor != null) o[r.clave] = r.valor; });
    setV(o);
  })(); }, []);

  const guardarTodo = async (e) => {
    e.preventDefault(); setGuardando(true); setOk(false);
    const filas = Object.entries(v).map(([clave, valor]) => ({ clave, valor: String(valor ?? '') }));
    const { error } = await supabase.from('ajustes').upsert(filas, { onConflict: 'clave' });
    setGuardando(false);
    if (error) return alert('No se pudo guardar: ' + error.message);
    setOk(true); setTimeout(() => setOk(false), 2500);
  };

  return (
    <form onSubmit={guardarTodo} className="max-w-2xl space-y-6">
      <div className="panel">
        <p className="mb-2 text-sm font-medium">Logo</p>
        <ImagenUnica valor={v.logo} onChange={(u) => setV({ ...v, logo: u })} />
      </div>
      <div className="panel">
        <p className="mb-2 text-sm font-medium">Foto principal (portada)</p>
        <ImagenUnica valor={v.hero_imagen} onChange={(u) => setV({ ...v, hero_imagen: u })} />
      </div>
      <div className="panel">
        <p className="mb-2 text-sm font-medium">Imagen al compartir el sitio (redes sociales)</p>
        <ImagenUnica valor={v.og_imagen} onChange={(u) => setV({ ...v, og_imagen: u })} />
      </div>
      {CAMPOS.map(([grupo, campos]) => (
        <div key={grupo} className="panel">
          <h2 className="font-semibold">{grupo}</h2>
          <div className="mt-3 space-y-3">
            {campos.map(([clave, etiqueta, tipo]) => (
              <label key={clave} className="block text-sm font-medium">{etiqueta}
                {tipo === 'textarea'
                  ? <textarea className="input mt-1" rows={3} value={v[clave] || ''} onChange={(e) => setV({ ...v, [clave]: e.target.value })} />
                  : <input className="input mt-1" value={v[clave] || ''} onChange={(e) => setV({ ...v, [clave]: e.target.value })} />}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-primary" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar todos los cambios'}</button>
      {ok && <span className="ml-3 text-sm text-green-700">Cambios guardados.</span>}
    </form>
  );
}
