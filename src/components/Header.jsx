import React, { useState } from 'react';
import { IconPlus, IconHeart } from './Icons';
import { useAngel } from '../context/AngelContext.jsx';

export default function Header({ navegarA, chats, onSubirFotoClick }) {
  const { llamarAlAngel } = useAngel();
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  
  // Opcional: si quieres que el corazón también muestre si hay notificaciones
  const tieneNotificaciones = chats?.some(c => c.unread);

  return (
    <header className="sticky top-0 w-full max-w-xl bg-white border-b border-gray-200 p-3 flex items-center justify-between z-30">
      
      {/* 1. Izquierda: Botón de Subir Foto (+) */}
      <div className="w-1/3 flex justify-start">
        <button 
          onClick={onSubirFotoClick} 
          className="p-2 transition-transform active:scale-90"
          aria-label="Crear nueva publicación"
          title="Subir una foto nueva"
        >
          <IconPlus />
        </button>
      </div>

      {/* 2. Centro: Logo de Instagram */}
      <div className="w-1/3 flex justify-center">
        <span className="text-2xl font-bold text-gray-900 tracking-wide">Instagram</span>
      </div>

      {/* 3. Derecha: Corazón (Notificaciones) */}
      <div className="w-1/3 flex justify-end items-center relative">
        <button 
          onClick={() => {
            setMostrarNotificaciones(!mostrarNotificaciones);
            if (!mostrarNotificaciones) {
              llamarAlAngel("Estas son sus notificaciones. Aquí puede ver a quién le gustaron sus fotos o quién le ha dejado un comentario.");
            }
          }} 
          className="p-2 transition-transform active:scale-90 relative"
          aria-label="Ver notificaciones"
        >
          <IconHeart />
          {tieneNotificaciones && (
            <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
          )}
        </button>

        {/* MENÚ DESPLEGABLE DE NOTIFICACIONES */}
        {mostrarNotificaciones && (
          <div className="absolute top-full mt-2 right-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-gray-100 font-bold text-lg text-gray-900">Notificaciones</div>
            
            <div className="p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50" onClick={() => llamarAlAngel("A María Rosa le encantó la foto que subió. Darle a 'Me gusta' es una forma de demostrar cariño.")}>
              <img src="https://i.pravatar.cc/150?u=maria" alt="María Rosa" className="w-10 h-10 rounded-full object-cover" />
              <p className="text-sm text-gray-800 leading-snug"><span className="font-bold">María Rosa</span> le dio "Me gusta" a tu foto.</p>
            </div>
            
            <div className="p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50" onClick={() => llamarAlAngel("Su nieto Andrés le ha dejado un comentario. Puede ir al inicio para responderle.")}>
              <img src="https://i.pravatar.cc/150?u=andres" alt="Andrés" className="w-10 h-10 rounded-full object-cover" />
              <p className="text-sm text-gray-800 leading-snug"><span className="font-bold">Andrés</span> comentó: "¡Qué linda foto!"</p>
            </div>
            
            <div className="p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => llamarAlAngel("La Junta de Vecinos ahora puede ver las fotos que usted comparta.")}>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">J</div>
              <p className="text-sm text-gray-800 leading-snug"><span className="font-bold">Junta de Vecinos</span> comenzó a seguirte.</p>
            </div>
          </div>
        )}
      </div>
      
    </header>
  );
}
