import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-serif text-4xl font-semibold">No encontramos esa página</h1>
      <p className="mt-3 text-tinta/70">Puede que el producto ya no esté disponible.</p>
      <Link href="/catalogo" className="btn btn-primary mt-6">Ver el catálogo</Link>
    </div>
  );
}
