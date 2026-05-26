import React, { useEffect, useRef } from 'react';
import { IconBack, IconPlus, IconPhone, IconVideo, IconMic } from '../components/Icons';
import { useAngel } from '../context/AngelContext.jsx';

export default function MensajesView({ chatActivo, setChatActivo, navegarA, chats, abrirChat, textoMensaje, setTextoMensaje, prepararEnvio }) {
  const { llamarAlAngel } = useAngel();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatActivo) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [chatActivo?.mensajes]);

  return (
    <div className="w-full flex flex-col min-h-[85vh] bg-white">
      {/* VISTA 1: BANDEJA DE ENTRADA */}
      {!chatActivo ? (
        <>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
            <div className="flex items-center gap-4">
              <button onClick={() => navegarA('inicio')}><IconBack /></button>
              <span className="font-bold text-xl">Usted</span>
            </div>
            <button onClick={() => llamarAlAngel("Este botón con un lápiz sirve para escribirle un mensaje a alguien nuevo.")}><IconPlus /></button>
          </div>
          
          <div className="p-4 flex items-center justify-between">
             <span className="font-semibold text-lg">Mensajes</span>
             <span className="text-blue-500 font-semibold text-base cursor-pointer">Solicitudes</span>
          </div>

          <div className="flex flex-col">
            {chats.map(c => (
              <div key={c.id} onClick={() => abrirChat(c)} className="chat-row flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer">
                <img src={c.avatar} className="w-16 h-16 rounded-full object-cover border border-gray-200" alt={c.user} />
                <div className="flex-1 overflow-hidden">
                  <p className={`text-lg truncate ${c.unread ? 'font-bold text-black' : 'text-gray-900'}`}>{c.user}</p>
                  <p className={`text-base truncate ${c.unread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                    {c.mensajes[c.mensajes.length - 1].texto}
                  </p>
                </div>
                {c.unread && <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0"></div>}
              </div>
            ))}
          </div>
        </>
      ) : (
        /* VISTA 2: DENTRO DE UN CHAT ESPECÍFICO */
        <div className="flex flex-col flex-1 pb-16">
          <div className="p-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 bg-white z-20 shadow-sm">
            <button onClick={() => setChatActivo(null)}><IconBack /></button>
            <img src={chatActivo.avatar} className="w-10 h-10 rounded-full object-cover" alt={chatActivo.user} />
            <span className="font-bold text-lg flex-1 truncate">{chatActivo.user}</span>
            <button onClick={() => llamarAlAngel("Este teléfono sirve para hacer una llamada de voz, como en WhatsApp. ¡Inténtelo cuando se sienta seguro!")}><IconPhone /></button>
            <button onClick={() => llamarAlAngel("Esta cámara de video sirve para hacer una videollamada y ver a la otra persona en la pantalla.")}><IconVideo /></button>
          </div>
          
          {/* Historial del Chat */}
          <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
             <div className="flex flex-col items-center mb-6 mt-4">
                <img src={chatActivo.avatar} className="w-24 h-24 rounded-full mb-3 object-cover" alt={chatActivo.user} />
                <span className="font-bold text-xl">{chatActivo.user}</span>
                <span className="text-gray-500 text-sm">Instagram</span>
             </div>
             {chatActivo.mensajes.map((m, i) => (
               <div key={i} className={`max-w-[75%] p-3 rounded-2xl text-base sm:text-lg ${m.de === 'Usted' ? 'bg-blue-500 text-white self-end rounded-br-none' : 'bg-gray-100 text-black self-start rounded-bl-none'}`}>
                 {m.texto}
               </div>
             ))}
             <div ref={chatEndRef} />
          </div>

          {/* Caja de Texto Inferior */}
          <div className="p-3 border-t border-gray-200 sticky bottom-0 bg-white flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"><IconPlus /></div>
             <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex items-center shadow-inner">
               <input id="chat-message-input" name="chatMessageInput" aria-label="Escribir un mensaje privado" value={textoMensaje} onChange={e=>setTextoMensaje(e.target.value)} className="bg-transparent outline-none w-full text-base sm:text-lg" placeholder="Mensaje..." autoComplete="off" />
               {textoMensaje.trim() ? (
                 <button onClick={() => prepararEnvio(chatActivo.id, 'privado')} className="text-blue-600 font-bold text-lg ml-2">Enviar</button>
               ) : (
                 <button onClick={() => llamarAlAngel("Este dibujo de micrófono sirve para enviar un mensaje de voz hablado. Si lo mantiene presionado, graba su voz, y al soltarlo se envía a la otra persona.")} className="text-gray-500 ml-2 hover:text-blue-500 transition-colors"><IconMic /></button>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}