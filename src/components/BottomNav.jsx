import React from 'react';
import { IconHome, IconSearch, IconPlane, IconReels, IconProfile } from './Icons';
import { useAngel } from '../context/AngelContext.jsx';

export default function BottomNav({ seccionActual, navegarA, chats }) {
  const { llamarAlAngel } = useAngel();
  const tieneNotificaciones = chats?.some(c => c.unread);

  return (
    <nav className="fixed bottom-0 w-full max-w-xl bg-white border-t border-gray-200 flex justify-around items-center p-3 z-40 text-gray-900">
      <button onClick={() => navegarA('inicio')} className="p-2 transition-transform active:scale-90"><IconHome active={seccionActual === 'inicio'} /></button>
      <button onClick={() => navegarA('videos')} className="p-2 transition-transform active:scale-90"><IconReels active={seccionActual === 'videos'} /></button>
      <button onClick={() => navegarA('mensajes')} className="p-2 transition-transform active:scale-90 relative">
        <IconPlane active={seccionActual === 'mensajes'} />
        {tieneNotificaciones && <div className="absolute top-1.5 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>}
      </button>
      <button onClick={() => navegarA('buscar')} className="p-2 transition-transform active:scale-90"><IconSearch active={seccionActual === 'buscar'} /></button>
      <button onClick={() => navegarA('perfil')} className="p-2 transition-transform active:scale-90"><IconProfile active={seccionActual === 'perfil'} /></button>
    </nav>
  );
}