'use client';
import { useState } from 'react';

export default function ProductGallery({ imagenes, nombre }) {
  const [i, setI] = useState(0);
  if (!imagenes?.length) return <div className="arco grid aspect-[4/5] place-items-center bg-agua text-6xl">🌸</div>;
  return (
    <div>
      <div className="arco aspect-[4/5] overflow-hidden bg-agua">
        <img src={imagenes[i]} alt={`${nombre}, foto ${i + 1}`} className="h-full w-full object-cover" />
      </div>
      {imagenes.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {imagenes.map((u, j) => (
            <button key={u + j} onClick={() => setI(j)} aria-label={`Ver foto ${j + 1}`} className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${j === i ? 'border-ambar' : 'border-transparent'}`}>
              <img src={u} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
