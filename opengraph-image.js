import { ImageResponse } from 'next/og';
import { getAjustes } from '@/lib/data';

export const alt = 'Productos de resina personalizados';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 300;

export default async function Image() {
  const a = await getAjustes();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: 'linear-gradient(135deg,#1E3A38,#2f5c57)', color: 'white' }}>
        <div style={{ fontSize: 84, fontWeight: 700 }}>{a.nombre}</div>
        <div style={{ fontSize: 38, marginTop: 24, color: '#CFE5DF' }}>{a.eslogan}</div>
      </div>
    ),
    size
  );
}
