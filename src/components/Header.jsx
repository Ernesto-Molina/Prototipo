import React from 'react';
import { IconHeart, IconPlane } from './Icons';
import { useAngel } from '../context/AngelContext.jsx';

export default function Header({ navegarA, chats }) {
  const { llamarAlAngel } = useAngel();
  const unreadCount = chats.some(c => c.unread);
  
  return (
    <header className="w-full max-w-xl bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
      <span className="text-2xl font-black italic font-serif text-gray-900 cursor-pointer" onClick={() => navegarA('inicio')}>Instagram</span>
      <div className="flex gap-5 text-gray-900 items-center">
        <button onClick={(e) => { e.stopPropagation(); llamarAlAngel("En este corazón verá a quién le han gustado sus fotos."); }}><IconHeart filled={false} /></button>
        <button onClick={(e) => { e.stopPropagation(); navegarA('mensajes'); }} className="relative">
          <IconPlane />
          {unreadCount && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}
        </button>
      </div>
    </header>
  );
}