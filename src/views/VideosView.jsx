import React, { useEffect, useRef } from 'react';
import { IconHeart, IconComment, IconPlane } from '../components/Icons';
import { useAngel } from '../context/AngelContext.jsx';

// --- Componente para un solo video (Reel) ---
const VideoPost = ({ post, onEnviarCariño }) => {
    const { llamarAlAngel } = useAngel();

    return (
        // Cada video ocupa toda la altura de la pantalla y se alinea al inicio del "snap"
        <div className="relative w-full h-screen snap-start flex-shrink-0 bg-black flex items-center justify-center">
            {/* Imagen de fondo del video */}
            <img src={post.image} className="w-full h-full object-cover" alt={post.desc} />

            {/* Capa de información superpuesta en la parte inferior */}
            <div className="absolute bottom-0 left-0 w-full p-5 pb-24 text-white bg-gradient-to-t from-black/60 to-transparent">
                <p className="font-bold text-lg mb-1">{post.user}</p>
                <p className="text-base">{post.desc}</p>
            </div>

            {/* Botones de acción a la derecha */}
            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-6 text-white">
                <button onClick={() => onEnviarCariño(post.id, 'videos')} className="flex flex-col items-center gap-1">
                    <IconHeart filled={post.hasLiked} className="w-9 h-9 drop-shadow-lg" />
                    <span className="font-semibold text-sm drop-shadow-lg">{post.likes}</span>
                </button>
                <button onClick={() => llamarAlAngel("Este botón con una burbuja es para escribir un comentario en el video.")} className="flex flex-col items-center gap-1">
                    <IconComment className="w-9 h-9 drop-shadow-lg" />
                </button>
                <button onClick={() => llamarAlAngel("Este avión de papel sirve para compartir este video con un amigo.")} className="flex flex-col items-center gap-1">
                    <IconPlane className="w-9 h-9 drop-shadow-lg" />
                </button>
            </div>
        </div>
    );
};

// --- Contenedor principal de la vista de Videos/Reels ---
export default function VideosView({ postsVideos, enviarCariño }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const manejarTeclado = (e) => {
      if (!containerRef.current) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        containerRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        containerRef.current.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', manejarTeclado);
    return () => window.removeEventListener('keydown', manejarTeclado);
  }, []);

  return (
    // Contenedor que ocupa toda la pantalla, permite scroll vertical y fuerza el "snap"
    <div ref={containerRef} className="w-full h-screen overflow-y-auto snap-y snap-mandatory hide-scroll">
      {postsVideos.map(post => (
        <VideoPost key={post.id} post={post} onEnviarCariño={enviarCariño} />
      ))}
    </div>
  );
}
