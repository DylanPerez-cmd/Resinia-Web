import Titulo from '@/components/Titulo';
import CatalogClient from '@/components/CatalogClient';
import { getAjustes, getCategorias, getProductos } from '@/lib/data';

export const metadata = { title: 'Catálogo' };

export default async function Catalogo({ searchParams }) {
  const [a, cats, prods] = await Promise.all([getAjustes(), getCategorias(), getProductos()]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Titulo sub="Busca, filtra por categoría, precio o disponibilidad y pide por WhatsApp.">Catálogo</Titulo>
      <CatalogClient productos={prods} categorias={cats} wa={a.whatsapp} catInicial={searchParams?.cat || ''} />
    </div>
  );
}
