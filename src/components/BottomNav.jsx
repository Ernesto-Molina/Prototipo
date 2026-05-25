import React from 'react';
import { IconHome, IconSearch, IconPlus, IconReels, IconProfile } from './Icons';
import { useAngel } from '../context/AngelContext.jsx';

export default function BottomNav({ seccionActual, navegarA }) {
  const { llamarAlAngel } = useAngel();
  return (
    <nav className="fixed bottom-0 w-full max-w-xl bg-white border-t border-gray-200 flex justify-around items-center p-3 z-40 text-gray-900">
      <button onClick={() => navegarA('inicio')} className="p-2 transition-transform active:scale-90"><IconHome active={seccionActual === 'inicio'} /></button>
      <button onClick={() => llamarAlAngel("Este dibujo de lupa sirve para buscar fotos de familiares, amigos o noticias.")} className="p-2 transition-transform active:scale-90"><IconSearch /></button>
      <button onClick={() => llamarAlAngel("Este cuadrado con un 'más' en medio es el botón principal para subir una foto desde la cámara de su teléfono.")} className="p-2 transition-transform active:scale-90"><IconPlus /></button>
      <button onClick={() => navegarA('videos')} className="p-2 transition-transform active:scale-90"><IconReels active={seccionActual === 'videos'} /></button>
      <button onClick={() => llamarAlAngel("Aquí entrará a su perfil personal. Es donde viven todas las fotos que usted ha guardado y publicado.")} className="p-2 transition-transform active:scale-90"><IconProfile /></button>
    </nav>
  );
}