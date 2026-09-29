import { supabase } from './supabase';

export const ESTADOS = { disponible: 'Disponible', agotado: 'Agotado', encargo: 'Por encargo' };

export const DEFAULTS = {
  nombre: 'Resina Artesanal',
  eslogan: 'Recuerdos de resina hechos a mano, con tu historia adentro',
  hero_texto: 'Llaveros, dijes, imanes y recuerdos personalizados con flores secas, fotografías, letras y colores a tu gusto.',
  logo: '', hero_imagen: '', og_imagen: '',
  whatsapp: '50400000000', instagram: '', facebook: '', tiktok: '',
  personalizado_titulo: 'Cada pieza se hace para ti',
  personalizado_texto: 'Elige el color, las letras, la fotografía o las flores que quieras conservar. Te mostramos cómo va quedando antes de terminar tu pedido.',
  pasos: 'Elige un producto del catálogo\nEscríbenos por WhatsApp con tu idea\nConfirmamos diseño, precio y tiempo de entrega\nElaboramos tu pedido a mano\nRecibe o recoge tu producto',
  faq: '¿Cuánto tarda un pedido? :: Depende del producto. Cada ficha indica el tiempo aproximado.\n¿Puedo pedir un diseño propio? :: Sí. Cuéntanos tu idea por WhatsApp y la cotizamos.\n¿Cómo se paga? :: Coordinamos el pago contigo por WhatsApp al confirmar el pedido.\n¿Hacen envíos? :: Sí, consúltanos tu ciudad por WhatsApp.',
  footer_texto: 'Productos de resina personalizados, hechos a mano.',
  seo_titulo: 'Resina Artesanal | Llaveros y recuerdos personalizados',
  seo_descripcion: 'Catálogo de llaveros, dijes, imanes y recuerdos de resina personalizados, hechos a mano. Pide por WhatsApp.',
  seo_keywords: 'resina, llaveros personalizados, recuerdos, aretes de resina, flores secas, Honduras',
};

export const lineas = (t) => (t || '').split('\n').map((s) => s.trim()).filter(Boolean);
export const precio = (n) => (n == null || n === '' ? 'Consultar precio' : `L ${Number(n).toLocaleString('es-HN')}`);
export const waLink = (num, msg) => `https://wa.me/${String(num || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;

async function lista(q) {
  try { const { data } = await q; return data || []; } catch { return []; }
}
export async function getAjustes() {
  const rows = await lista(supabase.from('ajustes').select('*'));
  const o = { ...DEFAULTS };
  rows.forEach((r) => { if (r.valor != null && r.valor !== '') o[r.clave] = r.valor; });
  return o;
}
export const getCategorias = () => lista(supabase.from('categorias').select('*').order('orden'));
export const getProductos = () => lista(supabase.from('productos').select('*, categorias(nombre,slug)').order('created_at', { ascending: false }));
export const getTrabajos = () => lista(supabase.from('trabajos').select('*').order('created_at', { ascending: false }));
export const getTestimonios = () => lista(supabase.from('testimonios').select('*').eq('visible', true).order('created_at', { ascending: false }));
export async function getProducto(id) {
  try {
    const { data } = await supabase.from('productos').select('*, categorias(nombre,slug)').eq('id', id).maybeSingle();
    return data;
  } catch { return null; }
}
