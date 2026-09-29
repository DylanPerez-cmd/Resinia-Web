'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const TABS = [
  ['productos', 'Productos'], ['categorias', 'Categorías'], ['trabajos', 'Trabajos realizados'],
  ['testimonios', 'Opiniones'], ['ajustes', 'Textos y contacto'],
];

export default function AdminShell({ children }) {
  const [sesion, setSesion] = useState(undefined);
  const [tab, setTab] = useState('productos');
  const [email, setEmail] = useState(''); const [pass, setPass] = useState('');
  const [error, setError] = useState(''); const [cargando, setCargando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSesion(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const entrar = async (e) => {
    e.preventDefault(); setError(''); setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setCargando(false);
    if (error) setError('Correo o contraseña incorrectos.');
  };

  if (sesion === undefined) return <div className="grid min-h-screen place-items-center text-tinta/60">Cargando…</div>;

  if (!sesion) {
    return (
      <div className="grid min-h-screen place-items-center bg-fondo px-4">
        <form onSubmit={entrar} className="panel w-full max-w-sm">
          <h1 className="font-serif text-2xl font-semibold">Panel de administración</h1>
          <p className="mt-1 text-sm text-tinta/60">Solo el administrador de la tienda puede entrar aquí.</p>
          <label className="mt-5 block text-sm font-medium">Correo
            <input className="input mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-medium">Contraseña
            <input className="input mt-1" type="password" required value={pass} onChange={(e) => setPass(e.target.value)} />
          </label>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button className="btn btn-primary mt-5 w-full" disabled={cargando}>{cargando ? 'Entrando…' : 'Entrar'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fondo">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-tinta/10 bg-white px-4 py-3">
        <p className="font-serif text-lg font-semibold">Panel de la tienda</p>
        <div className="flex items-center gap-3 text-sm">
          <a href="/" target="_blank" rel="noopener noreferrer" className="hover:text-ambar">Ver sitio ↗</a>
          <button onClick={() => supabase.auth.signOut()} className="btn btn-soft !py-1.5">Cerrar sesión</button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} className={`rounded-full px-4 py-2 text-sm font-medium ${tab === v ? 'bg-tinta text-white' : 'bg-white border border-tinta/15'}`}>{l}</button>
          ))}
        </div>
        {children(tab)}
      </div>
    </div>
  );
}
