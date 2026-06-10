import React from 'react';
import { useAngel } from '../context/AngelContext.jsx';
import { IconSearch } from '../components/Icons';

export default function BuscarView() {
  const { llamarAlAngel } = useAngel();
  
  // Generamos una cuadrícula de imágenes variadas (mascotas, paisajes, comida)
  const exploreImages = [
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1555685812-4b943f1cb6ed?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=300&q=80",
  ];

  return (
    <div className="w-full bg-white min-h-[85vh] flex flex-col">
      {/* Barra de Búsqueda Falsa */}
      <div className="p-3 sticky top-0 bg-white z-10 border-b border-gray-100">
        <div 
          className="w-full bg-gray-100 text-gray-500 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-colors active:bg-gray-200"
          onClick={() => llamarAlAngel("Esta es la barra de búsqueda. En la aplicación real, si toca aquí y escribe una palabra como 'gatos' o 'recetas', le mostraría fotos sobre ese tema.")}
        >
          <IconSearch />
          <span className="text-base font-medium">Buscar</span>
        </div>
      </div>

      {/* Cuadrícula de Explorar */}
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1 flex-1 bg-white pb-20">
        {exploreImages.map((img, index) => (
          <div key={index} className="aspect-square bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => llamarAlAngel("Esta es una foto pública de alguien que usted no conoce. Instagram se la muestra porque cree que le podría parecer interesante descubrir cosas nuevas.")}>
            <img src={img} className="w-full h-full object-cover" alt="Explorar" />
          </div>
        ))}
      </div>
    </div>
  );
}