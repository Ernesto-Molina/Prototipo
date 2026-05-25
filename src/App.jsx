import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { initialStories, initialMessages, initialPostsFeed, initialPostsVideos, initialChats } from './data/mockData';
import { useAngelGuard } from './hooks/useAngelGuard';
import { consultarAngelGuard } from './services/groqService';
import { reproducirVoz } from './utils/speech';
import InicioView from './views/InicioView';
import VideosView from './views/VideosView';
import MensajesView from './views/MensajesView';
import { AngelContext } from './context/AngelContext.jsx';

export default function App() {
  const [seccionActual, setSeccionActual] = useState('inicio');
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [textoMensaje, setTextoMensaje] = useState('');
  
  const [activeStory, setActiveStory] = useState(null);
  const stories = initialStories;

  const [messages, setMessages] = useState(initialMessages);

  const [postsFeed, setPostsFeed] = useState(initialPostsFeed);

  const [postsVideos, setPostsVideos] = useState(initialPostsVideos);

  // ==========================================
  // ESTADOS Y DATOS PARA MENSAJES (DM)
  // ==========================================
  const [chatActivo, setChatActivo] = useState(null); // Si es null, muestra la bandeja de entrada
  const [chats, setChats] = useState(initialChats);

  const [mensajePendiente, setMensajePendiente] = useState(null);
  const chatEndRef = useRef(null);

  const hablarVoz = (texto) => {
    reproducirVoz(texto, isMuted);
  };

  const llamarAlAngel = (texto) => {
    setIsChatVisible(true);
    setMessages(prev => [...prev, { role: 'ai', text: texto }]);
    hablarVoz(texto);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // ==========================================
  // INTERCEPTOR GLOBAL DE TECLADO (Soft-Delete preventivo)
  // ==========================================
  useEffect(() => {
    const interceptarRetroceso = (e) => {
      if (e.key === 'Backspace' && document.activeElement.tagName.toLowerCase() !== 'input') {
        e.preventDefault(); // Bloquea la navegación hacia atrás o borrado accidental del navegador
        llamarAlAngel("Ha presionado la tecla de borrar. Como medida de seguridad, hemos bloqueado esta acción para evitar que elimine información por accidente. Aquí nada se borra sin su permiso.");
      }
    };
    window.addEventListener('keydown', interceptarRetroceso);
    return () => window.removeEventListener('keydown', interceptarRetroceso);
  }, [isMuted]); // Se actualiza si cambia el estado del silencio

  // Integración del Hook de AngelGuard
  const { resetClickCount } = useAngelGuard(isChatVisible, activeStory, llamarAlAngel);

  const enviarCariño = (id, tipo) => {
    if (tipo === 'feed') {
      setPostsFeed(prev => prev.map(p => p.id === id ? { ...p, hasLiked: !p.hasLiked, likes: p.hasLiked ? p.likes - 1 : p.likes + 1 } : p));
    } else {
      setPostsVideos(prev => prev.map(p => p.id === id ? { ...p, hasLiked: !p.hasLiked, likes: p.hasLiked ? p.likes - 1 : p.likes + 1 } : p));
    }
  };

  const toggleGuardar = (id) => {
    setPostsFeed(prev => prev.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));
  };

  const prepararEnvio = (id, tipo) => {
    setMensajePendiente({ id, text: textoMensaje, tipo });
    const duda = tipo === 'privado' 
      ? `Usted va a enviarle un mensaje a ${chatActivo?.user}. ¿Desea enviarlo ahora?`
      : `Usted escribió: "${textoMensaje}". ¿Desea publicarlo en la foto?`;
    llamarAlAngel(duda);
    setTextoMensaje('');
  };

  const navegarA = (seccion) => {
    setSeccionActual(seccion);
    if (seccion === 'videos') llamarAlAngel("Ahora está en Reels, son videos cortos. Para ver el siguiente, solo deslice su dedo hacia arriba en la pantalla.");
    if (seccion === 'mensajes') {
      setChatActivo(null); // Al entrar a mensajes, siempre abrir la bandeja de entrada
      llamarAlAngel("Este es su buzón de mensajes. Toque el nombre de la persona con la que desea conversar.");
    }
    if (seccion === 'inicio') llamarAlAngel("Ha vuelto al inicio. Aquí verá las fotos nuevas de las personas que usted sigue.");
  };

  const abrirChat = (chat) => {
    setChatActivo(chat);
    // Marcar como leído
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: false } : c));
    llamarAlAngel(`Ahora está en un chat privado con ${chat.user}. Solo ustedes dos pueden ver estos mensajes. Escriba abajo para responderle.`);
  };

  const preguntarIA = async () => {
    if (!inputText.trim()) return;
    const duda = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: duda }]);
    setIsThinking(true);
    try {
      const respuesta = await consultarAngelGuard(duda);
      setIsThinking(false);
      setMessages(prev => [...prev, { role: 'ai', text: respuesta }]);
      hablarVoz(respuesta);
    } catch (e) { setIsThinking(false); }
  };

  return (
    <AngelContext.Provider value={{ llamarAlAngel }}>
    <div className="min-h-screen bg-white sm:bg-gray-50 flex flex-col items-center font-sans select-none relative">
      
      <style>{`
        @keyframes heartBurst {
          0% { transform: scale(0); opacity: 1; }
          15% { transform: scale(1.2); opacity: 1; }
          30% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1); opacity: 0; }
        }
        .anim-corazon { animation: heartBurst 1.2s ease-out forwards; }
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* PANTALLA DE BIENVENIDA */}
      {mostrarBienvenida && (
        <div className="fixed inset-0 z-[200] bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border-4 border-blue-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.4)] border-4 border-white">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-blue-900 mb-4 leading-tight">
              Bienvenido a su espacio de práctica de Instagram.
            </h1>
            <p className="text-xl text-gray-700 font-medium mb-10 leading-relaxed">
              Aquí <strong className="text-blue-800">no puede romper nada</strong>. Aprete el botón azul para comenzar.
            </p>
            <button 
              onClick={() => {
                setMostrarBienvenida(false);
                llamarAlAngel("¡Hola! Qué gusto verle. Su red social está lista y protegida. Recuerde que si tiene alguna duda, solo toque mi botón azul en la esquina.");
              }}
              className="w-full bg-blue-600 text-white font-bold text-xl py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 hover:bg-blue-700"
            >
              Empezar a explorar
            </button>
          </div>
        </div>
      )}

      {/* CABECERA PRINCIPAL (Oculta si estamos dentro de un chat privado) */}
      {!(seccionActual === 'mensajes' && chatActivo) && (
        <Header navegarA={navegarA} chats={chats} />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="w-full max-w-xl bg-white flex flex-col pb-20">
        
        {seccionActual === 'inicio' && (
          <InicioView 
            stories={stories} activeStory={activeStory} setActiveStory={setActiveStory} 
            postsFeed={postsFeed} toggleGuardar={toggleGuardar} 
            enviarCariño={enviarCariño} textoMensaje={textoMensaje} setTextoMensaje={setTextoMensaje} 
            prepararEnvio={prepararEnvio} 
          />
        )}

        {seccionActual === 'videos' && (
          <VideosView 
            postsVideos={postsVideos} enviarCariño={enviarCariño} 
          />
        )}

        {seccionActual === 'mensajes' && (
          <MensajesView 
            chatActivo={chatActivo} setChatActivo={setChatActivo} navegarA={navegarA} 
            chats={chats} abrirChat={abrirChat} 
            textoMensaje={textoMensaje} setTextoMensaje={setTextoMensaje} prepararEnvio={prepararEnvio} 
          />
        )}

      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR (Oculta en el Chat Privado para simular vista completa) */}
      {!(seccionActual === 'mensajes' && chatActivo) && (
        <BottomNav seccionActual={seccionActual} navegarA={navegarA} />
      )}

      {/* BOTÓN DE AYUDA (EL SALVAVIDAS SIEMPRE VISIBLE) */}
      <button 
        onClick={() => llamarAlAngel("¡Aquí estoy! No tenga miedo, dígame en qué puedo ayudarle hoy.")} 
        className={`fixed right-4 sm:right-8 w-16 sm:w-20 h-16 sm:h-20 bg-blue-600 text-white rounded-full shadow-2xl border-4 border-white flex flex-col items-center justify-center animate-pulse z-50 transition-all hover:scale-110 ${
          (seccionActual === 'mensajes' && chatActivo) ? 'bottom-24' : 'bottom-20 sm:bottom-24'
        }`}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      </button>

      {/* VENTANA DEL ÁNGEL GUARDIÁN */}
      {isChatVisible && (
        <div className="fixed bottom-4 left-4 right-4 md:inset-auto md:bottom-5 md:right-5 md:w-[450px] bg-white rounded-3xl md:rounded-[40px] shadow-[0_0_200px_rgba(0,0,0,0.7)] border-8 border-blue-600 flex flex-col z-[100] overflow-hidden max-h-[70vh] md:max-h-[85vh] animate-in slide-in-from-bottom duration-300">
          <header className="bg-blue-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
            <span className="font-black text-lg tracking-wide flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              ANGELGUARD
            </span>
            <div className="flex gap-4 items-center">
              <button onClick={() => { setIsMuted(!isMuted); hablarVoz(isMuted ? "Voz activada" : ""); }} className="text-2xl">{isMuted ? '🔇' : '🔊'}</button>
              <button onClick={() => { setIsChatVisible(false); resetClickCount(); }} className="bg-white text-blue-800 px-4 py-2 rounded-xl font-bold text-sm shadow-md active:bg-gray-200">OCULTAR</button>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-base font-medium leading-snug border shadow-sm ${m.role === 'user' ? 'bg-blue-100 border-blue-200 text-blue-900 rounded-tr-none' : 'bg-white border-blue-600 text-gray-800 rounded-tl-none'}`}>{m.text}</div>
              </div>
            ))}
            {isThinking && <div className="p-4 italic text-gray-400 animate-pulse text-base font-bold">AngelGuard está pensando...</div>}
            <div ref={chatEndRef} />
          </div>

          <footer className="p-4 bg-white border-t-2 border-gray-100 shrink-0">
            {mensajePendiente ? (
              <div className="flex flex-col gap-3">
                <button onClick={() => {
                  if(mensajePendiente.tipo === 'privado' && chatActivo) {
                    setChats(prev => prev.map(c => c.id === chatActivo.id ? {...c, mensajes: [...c.mensajes, { de: 'Usted', texto: mensajePendiente.text }]} : c));
                  }
                  setMensajePendiente(null); 
                  llamarAlAngel("¡Excelente trabajo! Su mensaje ha sido enviado correctamente."); 
                }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-base transition-all">SÍ, ESTOY SEGURO</button>
                <button onClick={() => { setMensajePendiente(null); llamarAlAngel("Deshecho exitosamente. Lo hemos borrado por seguridad, nada se envió."); }} className="w-full border-2 border-red-500 text-red-600 font-bold py-3 rounded-xl text-base hover:bg-red-50 transition-all">NO, BORRAR Y VOLVER</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none focus:border-blue-500" placeholder="Escriba su duda aquí..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && preguntarIA()} />
                <button onClick={preguntarIA} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-base hover:bg-blue-700 transition-all">PREGUNTAR AHORA</button>
              </div>
            )}
          </footer>
        </div>
      )}
    </div>
    </AngelContext.Provider>
  );
}