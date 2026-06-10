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
import BuscarView from './views/BuscarView';
import PerfilView from './views/PerfilView';
import { AngelContext } from './context/AngelContext.jsx';
import { IconMic } from './components/Icons';

export default function App() {
  const [seccionActual, setSeccionActual] = useState('inicio');
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [textoMensaje, setTextoMensaje] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [textoEscuchado, setTextoEscuchado] = useState('');
  const [textoInterino, setTextoInterino] = useState('');
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const fileInputRef = useRef(null);
  
  const [activeStory, setActiveStory] = useState(null);
  const [stories, setStories] = useState(initialStories);

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
    if (activeStory) {
      setStories(prev => prev.map(s => s.id === activeStory.id ? { ...s, isViewed: true } : s));
    }
  }, [activeStory]);

  useEffect(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages, isThinking]);

  // ==========================================
  // INTERCEPTOR GLOBAL DE TECLADO (Soft-Delete preventivo)
  // ==========================================
  useEffect(() => {
    const interceptarRetroceso = (e) => {
      if (e.key === 'Backspace' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
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

  const prepararEnvio = (id, tipo, textoOpcional = null) => {
    const textoFinal = textoOpcional !== null ? textoOpcional : textoMensaje;
    setMensajePendiente({ id, text: textoFinal, tipo });
    const duda = tipo === 'privado' 
      ? `Usted va a enviarle un mensaje a ${chatActivo?.user}. ¿Desea enviarlo ahora?`
      : `Usted escribió: "${textoFinal}". ¿Desea publicarlo en la foto?`;
    llamarAlAngel(duda);
    if (!textoOpcional) setTextoMensaje('');
  };

  const navegarA = (seccion) => {
    setSeccionActual(seccion);
    if (seccion === 'videos') llamarAlAngel("Ahora está en la sección de videos cortos. Para ver el siguiente, solo deslice su dedo hacia arriba en la pantalla o use las flechas del teclado.");
    if (seccion === 'mensajes') {
      setChatActivo(null); // Al entrar a mensajes, siempre abrir la bandeja de entrada
      llamarAlAngel("Este es su buzón de mensajes. Toque el nombre de la persona con la que desea conversar.");
    }
    if (seccion === 'inicio') llamarAlAngel("Ha vuelto al inicio. Aquí verá las fotos nuevas de las personas que usted sigue.");
    if (seccion === 'perfil') llamarAlAngel("Este es su perfil personal. Aquí viven todas las fotos que usted ha publicado, como si fuera su álbum de recuerdos.");
    if (seccion === 'buscar') llamarAlAngel("Ha entrado a la sección de Explorar. Aquí puede descubrir fotos de personas de todo el mundo que comparten sus mismos gustos.");
  };

  const abrirChat = (chat) => {
    setChatActivo(chat);
    // Marcar como leído
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: false } : c));
    llamarAlAngel(`Ahora está en un chat privado con ${chat.user}. Solo ustedes dos pueden ver estos mensajes. Escriba abajo para responderle.`);
  };

  const triggerSubirFoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const manejarSubidaFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const nuevoPost = { id: Date.now(), user: 'Usted', avatar: 'https://i.pravatar.cc/150?u=yo', image: imageUrl, likes: 0, hasLiked: false, isSaved: false, caption: ' ¡Miren mi nueva foto!', comentarios: [] };
      setPostsFeed(prev => [nuevoPost, ...prev]);
      setSeccionActual('inicio');
      llamarAlAngel("¡Felicidades! Su foto se ha publicado correctamente y sus familiares ya pueden verla en el inicio.");
      // Limpiamos el input para permitir subir la misma foto otra vez si quiere
      e.target.value = '';
    }
  };

  const iniciarEscucha = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      llamarAlAngel("Lo siento, su navegador actual no soporta el reconocimiento de voz. Puede seguir usando el teclado.");
      return;
    }

    // Cambiamos la pantalla INMEDIATAMENTE al tocar el botón
    setIsListening(true);
    setTextoEscuchado('Conectando micrófono...');

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'es-ES';
    recognition.interimResults = true; // Permite ver el texto en tiempo real
    const isAndroid = /Android/i.test(navigator.userAgent);
    recognition.continuous = !isAndroid; // En PC se mantiene abierto, en móvil usa el ciclo nativo para evitar duplicación

    recognition.onstart = () => {
      setTextoEscuchado(''); // Limpiamos la pantalla
      setTextoInterino(''); // Limpiamos el texto fantasma
      transcriptRef.current = ''; // Limpiamos la memoria de la frase
      // Hacer vibrar el dispositivo físico (en teléfonos/tablets compatibles)
      if (navigator.vibrate) {
        navigator.vibrate(200); // Vibra durante 200 milisegundos
      }
      // Reproducir pitido corto (beep) de inicio
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime); // Tono agradable (800Hz)
        gain.gain.setValueAtTime(0.1, ctx.currentTime); // Volumen suave (10%)
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15); // Duración muy corta (0.15 segundos)
      } catch(e) {}
    };
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        // Corrección definitiva para móviles: Android ya envía la frase completa acumulada en el último resultado
        let ultimoResultado = event.results[event.results.length - 1];
        if (ultimoResultado.isFinal) {
          finalTranscript = ultimoResultado[0].transcript;
        } else {
          interimTranscript = ultimoResultado[0].transcript;
        }
      } else {
        // En PC, los resultados se envían en pedazos, por lo que los sumamos con seguridad
        for (let i = 0; i < event.results.length; ++i) {
          let chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += chunk;
          } else {
            interimTranscript += chunk;
          }
        }
      }
      
      transcriptRef.current = finalTranscript + interimTranscript; // Guardamos en memoria
      setTextoEscuchado(finalTranscript); // Mostramos el texto sólido (seguro)
      setTextoInterino(interimTranscript); // Mostramos el texto en vivo (fantasma)
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        llamarAlAngel("El navegador bloqueó el micrófono. Por favor, busque un ícono de micrófono bloqueado en la barra de arriba (donde va la dirección web) y dele a 'Permitir'.");
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      // Reproducir pitido corto (beep) de fin
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime); // Tono más grave (400Hz) para indicar fin
        gain.gain.setValueAtTime(0.1, ctx.currentTime); // Volumen suave (10%)
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch(e) {}
      
      // Enviar a la IA todo lo que se haya escuchado al finalizar
      if (transcriptRef.current.trim()) {
        preguntarIA(transcriptRef.current.trim());
      }
    };

    try {
      recognition.start();
    } catch (e) {
      // Evita errores si el usuario toca el botón dos veces muy rápido
    }
  };

  const preguntarIA = async (textoVoz) => {
    const duda = typeof textoVoz === 'string' ? textoVoz : inputText.trim();
    if (!duda) return;
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
        
        @keyframes soundWave {
          0%, 100% { height: 6px; }
          50% { height: 20px; }
        }
        .wave-bar {
          width: 4px;
          background-color: currentColor;
          border-radius: 2px;
          animation: soundWave 1s ease-in-out infinite;
        }
        .wave-delay-1 { animation-delay: 0.0s; }
        .wave-delay-2 { animation-delay: 0.2s; }
        .wave-delay-3 { animation-delay: 0.4s; }
        .wave-delay-4 { animation-delay: 0.6s; }
        
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        .dot-anim {
          width: 8px;
          height: 8px;
          background-color: #2563eb;
          border-radius: 50%;
          animation: typingDot 1.4s infinite ease-in-out both;
        }
        .dot-delay-1 { animation-delay: -0.32s; }
        .dot-delay-2 { animation-delay: -0.16s; }
        
        @keyframes vibrateEffect {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-2px) rotate(-2deg); }
          40%, 80% { transform: translateX(2px) rotate(2deg); }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .anim-record { animation: vibrateEffect 0.3s ease-in-out, glowPulse 1.5s infinite; }
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

      {/* CABECERA PRINCIPAL (Solo se muestra en el Inicio) */}
      {seccionActual === 'inicio' && (
        <Header navegarA={navegarA} chats={chats} onSubirFotoClick={triggerSubirFoto} />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="w-full max-w-xl bg-white flex flex-col pb-20">
        
        {seccionActual === 'inicio' && (
          <InicioView 
            stories={stories} activeStory={activeStory} setActiveStory={setActiveStory} 
            postsFeed={postsFeed} toggleGuardar={toggleGuardar} enviarCariño={enviarCariño} 
            prepararEnvio={prepararEnvio} 
          />
        )}

        {seccionActual === 'videos' && (
          <VideosView 
            postsVideos={postsVideos} enviarCariño={enviarCariño} onSubirFotoClick={triggerSubirFoto}
          />
        )}

        {seccionActual === 'mensajes' && (
          <MensajesView 
            chatActivo={chatActivo} setChatActivo={setChatActivo} navegarA={navegarA} 
            chats={chats} setChats={setChats} abrirChat={abrirChat} 
            textoMensaje={textoMensaje} setTextoMensaje={setTextoMensaje} prepararEnvio={prepararEnvio} 
          />
        )}

        {seccionActual === 'perfil' && (
          <PerfilView 
            misPosts={postsFeed.filter(p => p.user === 'Usted')} 
            guardados={postsFeed.filter(p => p.isSaved)}
            onSubirFotoClick={triggerSubirFoto}
          />
        )}

        {seccionActual === 'buscar' && (
          <BuscarView />
        )}

      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR (Oculta en Chat Privado para simular vista completa) */}
      {!(seccionActual === 'mensajes' && chatActivo) && (
        <>
          <BottomNav seccionActual={seccionActual} navegarA={navegarA} chats={chats} />
          <input type="file" accept="image/*" ref={fileInputRef} onChange={manejarSubidaFoto} className="hidden" aria-hidden="true" />
        </>
      )}

      {/* BOTÓN DE AYUDA (EL SALVAVIDAS SIEMPRE VISIBLE) */}
      <button 
        onClick={() => llamarAlAngel("¡Aquí estoy! No tenga miedo, dígame en qué puedo ayudarle hoy.")} 
        className={`fixed right-4 sm:right-8 w-16 sm:w-20 h-16 sm:h-20 bg-blue-600 text-white rounded-full shadow-2xl border-4 border-white flex flex-col items-center justify-center animate-pulse z-50 transition-all hover:scale-110 ${
          (seccionActual === 'mensajes' && chatActivo) ? 'bottom-4' : 'bottom-20 sm:bottom-24'
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
            <div className="flex gap-3 sm:gap-4 items-center">
              <button onClick={() => { setIsMuted(!isMuted); hablarVoz(isMuted ? "Voz activada" : ""); }} className="text-2xl">{isMuted ? '🔇' : '🔊'}</button>
              <button onClick={() => { setIsChatVisible(false); resetClickCount(); }} className="bg-white text-blue-800 px-4 py-2 rounded-xl font-bold text-sm shadow-md active:bg-gray-200">OCULTAR</button>
            </div>
          </header>
          
          {/* SI ESTÁ ESCUCHANDO: MOSTRAR INTERFAZ TIPO GOOGLE ASSISTANT */}
          {isListening ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-white animate-in fade-in duration-300 z-10 w-full overflow-hidden">
              <span className="text-gray-500 font-bold text-xl sm:text-2xl mb-4 shrink-0">Escuchando...</span>
              
              {/* CAJA DE TEXTO CON SCROLL PARA EVITAR QUE EL BOTÓN DESAPAREZCA */}
              <div className="w-full flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center mb-6 hide-scroll">
                <p className="text-3xl sm:text-4xl font-black text-center leading-tight w-full max-w-sm">
                  {textoEscuchado || textoInterino ? (
                    <>
                      <span className="text-blue-900">{textoEscuchado}</span>
                      <span className="text-blue-400 opacity-60 transition-all duration-75">{textoInterino}</span>
                      <span className="animate-pulse text-blue-500 ml-1">|</span>
                    </>
                  ) : (
                    <span className="text-gray-400">Hable ahora... <span className="animate-pulse text-blue-500 ml-1">|</span></span>
                  )}
                </p>
              </div>

              <button 
                onClick={() => recognitionRef.current && recognitionRef.current.stop()}
                className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-red-500 text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.5)] anim-record active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-center gap-2.5 h-12">
                  <div className="wave-bar wave-delay-1" style={{width: '6px'}}></div>
                  <div className="wave-bar wave-delay-2" style={{width: '6px'}}></div>
                  <div className="wave-bar wave-delay-3" style={{width: '6px'}}></div>
                  <div className="wave-bar wave-delay-4" style={{width: '6px'}}></div>
                </div>
              </button>
              <p className="mt-6 text-gray-500 font-medium text-base sm:text-lg text-center px-4 shrink-0">Hable a su ritmo.<br/>Toque el botón rojo cuando termine.</p>
            </div>
          ) : (
          /* SI NO ESTÁ ESCUCHANDO: MOSTRAR EL CHAT NORMAL */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-base font-medium leading-snug border shadow-sm ${m.role === 'user' ? 'bg-blue-100 border-blue-200 text-blue-900 rounded-tr-none' : 'bg-white border-blue-600 text-gray-800 rounded-tl-none'}`}>{m.text}</div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl border shadow-sm bg-white border-blue-600 rounded-tl-none flex gap-1.5 items-center h-14">
                  <div className="dot-anim dot-delay-1"></div>
                  <div className="dot-anim dot-delay-2"></div>
                  <div className="dot-anim"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          )}

          {/* OCULTAR EL PIE DE PÁGINA MIENTRAS SE HABLA PARA DAR MÁS ESPACIO */}
          {!isListening && (
          <footer className="p-4 bg-white border-t-2 border-gray-100 shrink-0 animate-in slide-in-from-bottom duration-200">
            {mensajePendiente ? (
              <div className="flex flex-col gap-3">
                <button onClick={() => {
                  if(mensajePendiente.tipo === 'privado' && chatActivo) {
                    const nuevoMsj = { de: 'Usted', texto: mensajePendiente.text };
                    setChats(prev => prev.map(c => c.id === chatActivo.id ? {...c, mensajes: [...c.mensajes, nuevoMsj]} : c));
                    setChatActivo(prev => ({...prev, mensajes: [...prev.mensajes, nuevoMsj]}));
                  } else if (mensajePendiente.tipo === 'feed') {
                    const nuevoComentario = { de: 'Usted', texto: mensajePendiente.text };
                    setPostsFeed(prev => prev.map(p => p.id === mensajePendiente.id ? {...p, comentarios: [...(p.comentarios || []), nuevoComentario]} : p));
                  }
                  setMensajePendiente(null); 
                  setIsChatVisible(false); // Ocultamos el ángel al instante para que vean la pantalla
                  hablarVoz("¡Excelente trabajo! Su mensaje ha sido publicado y ya puede verlo en la pantalla.");
                  setMessages(prev => [...prev, { role: 'ai', text: "¡Excelente trabajo! Su mensaje ha sido publicado y ya puede verlo en la pantalla." }]);
                }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-base transition-all">SÍ, ESTOY SEGURO</button>
                <button onClick={() => { setMensajePendiente(null); llamarAlAngel("Deshecho exitosamente. Lo hemos borrado por seguridad, nada se envió."); }} className="w-full border-2 border-red-500 text-red-600 font-bold py-3 rounded-xl text-base hover:bg-red-50 transition-all">NO, BORRAR Y VOLVER</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input id="angel-chat-input" name="angelChatInput" aria-label="Escriba su duda para el asistente" className="w-full p-3 border-2 border-gray-200 rounded-xl text-base text-gray-900 caret-black cursor-text outline-none focus:border-blue-500" placeholder="Escriba su duda aquí..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && preguntarIA()} autoComplete="off" />
                  <button 
                    onClick={iniciarEscucha} 
                    aria-label="Hablar por micrófono"
                    title="Hablar con AngelGuard"
                    className={`w-14 flex-shrink-0 flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white rounded-full anim-record' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-200 rounded-xl shadow-sm'}`}
                  >
                    {isListening ? (
                      <div className="flex items-center justify-center gap-1 w-6 h-6">
                        <div className="wave-bar wave-delay-1"></div>
                        <div className="wave-bar wave-delay-2"></div>
                        <div className="wave-bar wave-delay-3"></div>
                        <div className="wave-bar wave-delay-4"></div>
                      </div>
                    ) : (
                      <IconMic />
                    )}
                  </button>
                </div>
                <button onClick={() => preguntarIA()} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-base hover:bg-blue-700 transition-all">PREGUNTAR AHORA</button>
              </div>
            )}
          </footer>
          )}
        </div>
      )}
    </div>
    </AngelContext.Provider>
  );
}