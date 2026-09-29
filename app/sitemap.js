import { getProductos } from '@/lib/data';
import { SITE } from '@/lib/site';
export const revalidate = 3600;
export default async function sitemap() {
  const ps = await getProductos();
  return [{ url: SITE }, { url: `${SITE}/catalogo` }, ...ps.map((p) => ({ url: `${SITE}/producto/${p.id}`, lastModified: p.created_at }))];
}
