import React from 'react';
import FotoSocial from '../components/FotoSocial';
import { IconClose } from '../components/Icons';
import { useAngel } from '../context/AngelContext.jsx';

export default function InicioView({ stories, activeStory, setActiveStory, postsFeed, toggleGuardar, enviarCariño, textoMensaje, setTextoMensaje, prepararEnvio }) {
  const { llamarAlAngel } = useAngel();
  return (
    <>
      {/* MODAL DE HISTORIA ACTIVA */}
      {activeStory && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent absolute top-0 w-full">
             <div className="flex items-center gap-3 text-white">
                <img src={activeStory.avatar} className="w-10 h-10 rounded-full object-cover border border-white" alt="Avatar" />
                <span className="font-semibold text-base">{activeStory.user}</span>
                <span className="text-gray-300 text-sm opacity-80">2h</span>
             </div>
             <button onClick={() => { setActiveStory(null); llamarAlAngel("Muy bien, cerró la historia de forma segura."); }} className="text-white p-2">
                <IconClose />
             </button>
          </div>
          <img src={activeStory.image} className="w-full h-full object-cover" alt="Historia" />
        </div>
      )}

      {/* BARRA DE HISTORIAS */}
      <div className="flex gap-4 p-4 border-b border-gray-200 overflow-x-auto hide-scroll">
        {stories.map(s => (
          <div key={s.id} className="flex flex-col items-center gap-1 cursor-pointer min-w-[72px]" onClick={(e) => { e.stopPropagation(); setActiveStory(s); llamarAlAngel("Las historias en la aplicación real desaparecen en 15 segundos, lo que da mucho susto. Pero aquí, esta historia se quedará abierta todo el tiempo que necesite. Presione la X arriba a la derecha cuando quiera cerrarla."); }}>
            <div className={`w-[70px] h-[70px] rounded-full p-[3px] ${s.isMine ? 'border-2 border-gray-300' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600'}`}>
              <img src={s.avatar} className="w-full h-full rounded-full border-2 border-white object-cover bg-white" alt={s.user} />
            </div>
            <span className="text-xs text-gray-800 truncate w-full text-center">{s.user}</span>
          </div>
        ))}
      </div>

      {/* FEED DE FOTOS */}
      <div className="bg-gray-50 pt-2">
        {postsFeed.map(p => (
          <FotoSocial key={p.id} post={p} onGuardar={toggleGuardar} onEnviarCariño={enviarCariño} textoMensaje={textoMensaje} setTextoMensaje={setTextoMensaje} onEnviarMensaje={prepararEnvio} />
        ))}
      </div>
    </>
  );
}