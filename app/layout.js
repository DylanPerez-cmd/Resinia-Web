import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAjustes, waLink } from '@/lib/data';
import { SITE } from '@/lib/site';

export const revalidate = 30;

export async function generateMetadata() {
  const a = await getAjustes();
  return {
    metadataBase: new URL(SITE),
    title: { default: a.seo_titulo, template: `%s | ${a.nombre}` },
    description: a.seo_descripcion,
    keywords: a.seo_keywords,
    openGraph: {
      title: a.seo_titulo, description: a.seo_descripcion, type: 'website', locale: 'es_HN', siteName: a.nombre,
      ...(a.og_imagen ? { images: [a.og_imagen] } : {}),
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function RootLayout({ children }) {
  const a = await getAjustes();
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Figtree:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <Header a={a} />
        <main>{children}</main>
        <Footer a={a} />
        <a href={waLink(a.whatsapp, 'Hola, me gustaría información sobre sus productos personalizados.')} target="_blank" rel="noopener noreferrer" className="btn btn-wa fixed bottom-4 right-4 z-50 shadow-lg" aria-label="Escribir por WhatsApp">WhatsApp</a>
      </body>
    </html>
  );
}
