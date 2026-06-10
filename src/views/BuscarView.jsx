import React, { useState } from 'react';
import { useAngel } from '../context/AngelContext.jsx';
import { IconSearch, IconHeart } from '../components/Icons';

export default function BuscarView({ preguntarIA }) {
  const { llamarAlAngel } = useAngel();
  const [busqueda, setBusqueda] = useState('');
  const [corazonesAnimados, setCorazonesAnimados] = useState({});
  
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

  const manejarDobleClic = (index) => {
    setCorazonesAnimados(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setCorazonesAnimados(prev => ({ ...prev, [index]: false }));
    }, 1200);
    llamarAlAngel("¡Le ha dado 'Me gusta' a esta foto! Dar doble toque rápido con el dedo es un atajo muy común en Instagram.");
  };

  return (
    <div className="w-full bg-white min-h-[85vh] flex flex-col">
      {/* Barra de Búsqueda Real */}
      <div className="p-3 sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="w-full bg-gray-100 text-gray-900 px-3 py-1 rounded-xl flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <span className="text-gray-500"><IconSearch /></span>
          <input 
            type="text" 
            className="w-full bg-transparent outline-none py-1.5 text-base font-medium placeholder-gray-500 caret-black" 
            placeholder="Buscar..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && busqueda.trim()) {
                if (preguntarIA) {
                  preguntarIA("Quiero buscar fotos de: " + busqueda.trim());
                }
                setBusqueda('');
              }
            }}
            onClick={() => {
              if (!busqueda) llamarAlAngel("Escriba lo que desea buscar y presione la tecla 'Enter' en su teclado.");
            }}
          />
        </div>
      </div>

      {/* Cuadrícula de Explorar */}
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1 flex-1 bg-white pb-20">
        {exploreImages.map((img, index) => (
          <div key={index} className="relative aspect-square bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => llamarAlAngel("Esta es una foto pública de alguien que usted no conoce. Puede hacerle doble clic para darle 'Me gusta'.")}>
            <img src={img} className="w-full h-full object-cover select-none" alt="Explorar" onDoubleClick={() => manejarDobleClic(index)} />
            {corazonesAnimados[index] && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <IconHeart filled={true} className="w-16 h-16 sm:w-20 sm:h-20 text-white/90 anim-corazon drop-shadow-2xl" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}