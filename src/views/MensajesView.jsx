import React, { useEffect, useRef, useState } from 'react';
import { IconBack, IconPlus, IconPhone, IconVideo, IconMic, IconPencil } from '../components/Icons';
import { useAngel } from '../context/AngelContext.jsx';

export default function MensajesView({ chatActivo, setChatActivo, navegarA, chats, setChats, abrirChat, textoMensaje, setTextoMensaje, prepararEnvio }) {
  const { llamarAlAngel } = useAngel();
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDictating, setIsDictating] = useState(false);
  const dictationRef = useRef(null);
  const [msgOptions, setMsgOptions] = useState(null);

  useEffect(() => {
    if (chatActivo) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [chatActivo?.mensajes]);

  const manejarSubidaFoto = (e) => {
    const file = e.target.files[0];
    if (file && chatActivo) {
      const imageUrl = URL.createObjectURL(file);
      // Creamos un mensaje que en vez de texto tiene una imagen
      const nuevoMsj = { de: 'Usted', texto: '', imagen: imageUrl };
      setChats(prev => prev.map(c => c.id === chatActivo.id ? {...c, mensajes: [...c.mensajes, nuevoMsj]} : c));
      setChatActivo(prev => ({...prev, mensajes: [...prev.mensajes, nuevoMsj]}));
      llamarAlAngel(`¡Qué bonita foto! Se ha enviado correctamente a ${chatActivo.user}.`);
      e.target.value = ''; // Limpiamos para poder enviar la misma foto luego si quiere
    }
  };

  const toggleDictado = () => {
    if (isDictating) {
      dictationRef.current?.stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      llamarAlAngel("Lo siento, su navegador actual no soporta el micrófono. Puede seguir usando el teclado.");
      return;
    }
    const recognition = new SpeechRecognition();
    dictationRef.current = recognition;
    recognition.lang = 'es-ES';
    recognition.interimResults = true;
    const isAndroid = /Android/i.test(navigator.userAgent);
    recognition.continuous = !isAndroid;

    let baseText = textoMensaje ? textoMensaje + " " : ""; // Guarda lo que ya estaba escrito

    recognition.onstart = () => { setIsDictating(true); if(navigator.vibrate) navigator.vibrate(100); };
    recognition.onresult = (e) => {
      let final = '';
      let interim = '';
      if (isAndroid) {
         let last = e.results[e.results.length - 1];
         if(last.isFinal) final = last[0].transcript;
         else interim = last[0].transcript;
      } else {
         for (let i = 0; i < e.results.length; i++) {
           if (e.results[i].isFinal) final += e.results[i][0].transcript;
           else interim += e.results[i][0].transcript;
         }
      }
      setTextoMensaje(baseText + final + interim);
    };
    recognition.onend = () => setIsDictating(false);
    recognition.onerror = () => setIsDictating(false);
    try { recognition.start(); } catch (e) {}
  };

  const anularEnvio = (index) => {
    setChats(prev => prev.map(c => c.id === chatActivo.id ? { ...c, mensajes: c.mensajes.filter((_, i) => i !== index) } : c));
    setChatActivo(prev => ({ ...prev, mensajes: prev.mensajes.filter((_, i) => i !== index) }));
    setMsgOptions(null);
    llamarAlAngel("Envío anulado con éxito. El mensaje ha sido borrado de la conversación y la otra persona ya no podrá verlo.");
  };

  return (
    <div className="w-full flex flex-col min-h-[85vh] bg-white">
      {/* VISTA 1: BANDEJA DE ENTRADA */}
      {!chatActivo ? (
        <>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-20">
            <div className="w-1/3 flex justify-start">
              <button onClick={() => navegarA('inicio')} className="active:scale-95 transition-transform"><IconBack /></button>
            </div>
            <div className="w-1/3 flex justify-center">
              <span className="font-bold text-xl text-gray-900 truncate">Usted</span>
            </div>
            <div className="w-1/3 flex justify-end">
              <button onClick={() => llamarAlAngel("Este botón con un lápiz sirve para escribirle un mensaje a alguien nuevo.")} className="active:scale-95 transition-transform"><IconPencil /></button>
            </div>
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
               <div key={i} className={`flex flex-col ${m.de === 'Usted' ? 'items-end' : 'items-start'} mb-4 relative`}>
                 
                 {/* Opciones de Anular envío para mensajes del usuario */}
                 {m.de === 'Usted' && (m.sharedItem || m.imagen) && (
                   <button onClick={() => setMsgOptions(i)} className="mb-1 text-gray-400 hover:text-gray-700 px-2 flex gap-1 cursor-pointer">
                     <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                     <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                     <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                   </button>
                 )}

                 <div className={`max-w-[75%] p-3 rounded-2xl text-base sm:text-lg overflow-hidden ${m.de === 'Usted' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-black rounded-bl-none'}`}>
                   {m.texto && <p>{m.texto}</p>}
                   {m.imagen && <img src={m.imagen} alt="Foto enviada" className={`w-full max-w-[220px] h-auto rounded-lg object-cover shadow-sm ${m.texto ? 'mt-2' : ''}`} />}
                   {m.sharedItem && (
                     <div className="mt-2 bg-white/20 rounded-xl p-2 cursor-pointer active:scale-95 transition-transform" onClick={() => llamarAlAngel("Esta es la publicación que usted compartió.")}>
                       <img src={m.sharedItem.image} className="w-full max-w-[220px] h-auto aspect-square object-cover rounded-lg shadow-sm" alt="Publicación compartida" />
                       <p className="text-sm font-semibold mt-2 truncate">@{m.sharedItem.user}</p>
                     </div>
                   )}
                 </div>

                 {msgOptions === i && (
                   <div className="absolute top-8 right-0 bg-white shadow-xl border border-gray-200 rounded-xl p-2 z-30 w-40 animate-in fade-in zoom-in-95">
                     <button onClick={() => anularEnvio(i)} className="w-full text-left px-3 py-2 text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors">Anular envío</button>
                     <button onClick={() => setMsgOptions(null)} className="w-full text-left px-3 py-2 text-gray-700 font-bold hover:bg-gray-50 rounded-lg mt-1 transition-colors">Cancelar</button>
                   </div>
                 )}
               </div>
             ))}
             <div ref={chatEndRef} />
          </div>

          {/* Caja de Texto Inferior */}
          <div className="p-3 border-t border-gray-200 sticky bottom-0 bg-white flex items-center gap-3">
             <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm hover:bg-blue-600 transition-colors active:scale-95"><IconPlus /></button>
             <input type="file" accept="image/*" ref={fileInputRef} onChange={manejarSubidaFoto} className="hidden" />
             <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex items-center shadow-inner">
               <input id="chat-message-input" name="chatMessageInput" aria-label="Escribir un mensaje privado" value={textoMensaje} onChange={e=>setTextoMensaje(e.target.value)} className="bg-transparent outline-none w-full text-base sm:text-lg text-gray-900 caret-black cursor-text" placeholder="Mensaje..." autoComplete="off" />
               {textoMensaje.trim() || isDictating ? (
                 <div className="flex items-center gap-2">
                   {isDictating && <span className="text-red-500 text-xs font-bold animate-pulse">Grabando...</span>}
                   <button onClick={() => { if(isDictating) dictationRef.current?.stop(); if(textoMensaje.trim()) prepararEnvio(chatActivo.id, 'privado'); }} className="text-blue-600 font-bold text-lg ml-2">Enviar</button>
                 </div>
               ) : (
                 <button onClick={toggleDictado} className="text-gray-500 ml-2 hover:text-blue-500 transition-colors"><IconMic /></button>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}