import React, { useState } from 'react';
import { IconHeart, IconComment, IconPlane, IconBookmark } from './Icons';
import { useAngel } from '../context/AngelContext.jsx';

const FotoSocial = ({ post, onEnviarCariño, textoMensaje, setTextoMensaje, onEnviarMensaje, onGuardar }) => {
  const { llamarAlAngel } = useAngel();
  const [animarCorazon, setAnimarCorazon] = useState(false);

  const manejarDobleClic = (e) => {
    e.stopPropagation();
    if(!post.hasLiked) onEnviarCariño(post.id, 'feed');
    setAnimarCorazon(true);
    setTimeout(() => setAnimarCorazon(false), 1200);
  };

  return (
    <div className="bg-white border-b border-gray-200 mb-6 w-full max-w-xl">
      <div className="p-4 flex items-center gap-3">
        <img src={post.avatar} className="w-10 h-10 rounded-full border border-gray-300 object-cover" alt="Persona" />
        <span className="font-semibold text-base text-gray-900">{post.user}</span>
        <button 
          className="ml-auto text-gray-800 font-bold tracking-widest pb-2" 
          aria-label="Más opciones"
          onClick={(e) => { e.stopPropagation(); llamarAlAngel("Estos tres puntos sirven para ver más opciones sobre esta foto."); }}>
          ...
        </button>
      </div>
      
      <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        <img 
          src={post.image} 
          className="w-full h-full object-cover" 
          alt="Foto"
          onDoubleClick={manejarDobleClic} 
        />
        {animarCorazon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <IconHeart filled={true} className="w-32 h-32 text-white/90 anim-corazon drop-shadow-2xl" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4 text-gray-800">
          <div className="flex gap-4 sm:gap-5">
            <button aria-label={post.hasLiked ? "Quitar me gusta" : "Dar me gusta"} onClick={(e) => { e.stopPropagation(); onEnviarCariño(post.id, 'feed'); }}>
              <IconHeart filled={post.hasLiked} />
            </button>
            <button aria-label="Escribir comentario" onClick={(e) => { e.stopPropagation(); llamarAlAngel("Este dibujo de burbuja es para escribir un comentario público en la foto."); }}>
              <IconComment />
            </button>
            <button aria-label="Compartir foto" onClick={(e) => { e.stopPropagation(); llamarAlAngel("Este avión de papel sirve para enviarle esta foto a otro amigo por mensaje privado."); }}>
              <IconPlane />
            </button>
          </div>
          <button aria-label={post.isSaved ? "Quitar de guardados" : "Guardar foto"} onClick={(e) => { e.stopPropagation(); onGuardar(post.id); llamarAlAngel("Si toca esta cinta, la foto se guardará en su álbum personal secreto para que la vea cuando quiera. No se perderá."); }}>
            <IconBookmark saved={post.isSaved} />
          </button>
        </div>

        <p className="font-semibold text-base mb-2">{post.likes} Me gusta</p>
        <p className="text-base leading-relaxed"><span className="font-semibold mr-2">{post.user}</span>{post.caption}</p>
        
        {/* LISTA DE COMENTARIOS */}
        {post.comentarios && post.comentarios.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {post.comentarios.map((c, i) => (
              <p key={i} className="text-base text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm transition-all animate-in fade-in">
                <span className="font-bold text-blue-900 mr-2">{c.de}:</span>{c.texto}
              </p>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <input 
            id={`comment-input-${post.id}`}
            name={`commentInput-${post.id}`}
            aria-label="Escribir un comentario en la publicación"
            className="w-full text-base p-3 border-b-2 border-gray-200 outline-none focus:border-blue-400 bg-transparent placeholder-gray-500" 
            placeholder="Agrega un comentario..." 
            value={textoMensaje} 
            onChange={(e) => setTextoMensaje(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          {textoMensaje.trim() && (
            <button 
              className="font-bold py-2 rounded-lg text-white text-base shadow-sm transition-all bg-blue-500 hover:bg-blue-600"
              onClick={(e) => { e.stopPropagation(); onEnviarMensaje(post.id, 'feed'); }}
            >
              Publicar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FotoSocial;