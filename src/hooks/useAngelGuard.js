import { useEffect, useRef } from 'react';

export function useAngelGuard(isChatVisible, activeStory, llamarAlAngel) {
  const clickCountRef = useRef(0);
  const inactivityTimerRef = useRef(null);

  useEffect(() => {
    const reiniciarReloj = () => {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        if (!isChatVisible && !activeStory) llamarAlAngel("He notado que lleva un momento sin interactuar. ¿Necesita que le explique para qué sirve algún botón en la pantalla?");
      }, 30000);
    };

    const detectarEstrés = (e) => {
      reiniciarReloj();
      if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('img') && !e.target.closest('.chat-row')) {
        if (navigator.vibrate) navigator.vibrate(50); 
        clickCountRef.current++;
        if (clickCountRef.current >= 4) {
          llamarAlAngel("Parece que está intentando presionar algo y no funciona. Respire con calma y dígame qué necesita hacer, yo lo guiaré paso a paso.");
          clickCountRef.current = 0;
        }
      } else {
        clickCountRef.current = 0;
      }
    };

    window.addEventListener('click', detectarEstrés);
    window.addEventListener('mousemove', reiniciarReloj);
    return () => {
      window.removeEventListener('click', detectarEstrés);
      window.removeEventListener('mousemove', reiniciarReloj);
    };
  }, [isChatVisible, activeStory, llamarAlAngel]);

  return { resetClickCount: () => { clickCountRef.current = 0; } };
}