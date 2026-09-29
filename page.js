'use client';
import AdminShell from '@/components/admin/AdminShell';
import PanelProductos from '@/components/admin/PanelProductos';
import PanelCategorias from '@/components/admin/PanelCategorias';
import PanelGaleria from '@/components/admin/PanelGaleria';
import PanelTestimonios from '@/components/admin/PanelTestimonios';
import PanelAjustes from '@/components/admin/PanelAjustes';

export default function AdminPage() {
  return (
    <AdminShell>
      {(tab) => {
        if (tab === 'productos') return <PanelProductos />;
        if (tab === 'categorias') return <PanelCategorias />;
        if (tab === 'trabajos') return <PanelGaleria />;
        if (tab === 'testimonios') return <PanelTestimonios />;
        return <PanelAjustes />;
      }}
    </AdminShell>
  );
}
