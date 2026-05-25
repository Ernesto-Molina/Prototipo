let vocesDisponibles = [];

// El navegador tarda unos milisegundos en cargar las voces, así que las pre-cargamos y actualizamos aquí
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  vocesDisponibles = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    vocesDisponibles = window.speechSynthesis.getVoices();
  };
}

export const reproducirVoz = (texto, isMuted) => {
  if (isMuted || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const locucion = new SpeechSynthesisUtterance(texto);
  
  // Forzamos la recarga de voces por si el navegador las estaba ocultando
  vocesDisponibles = window.speechSynthesis.getVoices();
 
  // Filtramos solo las voces que sean en español
  const vocesEspañol = vocesDisponibles.filter(voz => voz.lang.startsWith('es'));
 
  // Orden de preferencia estricto para encontrar la voz más humana posible
  let vozElegida = 
    vocesEspañol.find(v => v.name.includes('Sabina')) || // La mejor nativa de Windows
    vocesEspañol.find(v => v.name.includes('Google español de Estados Unidos')) || // Muy buena en Chrome
    vocesEspañol.find(v => v.name.includes('Google español')) || // Buena en Android
    vocesEspañol.find(v => v.name.includes('Elena') || v.name.includes('Dalia')) ||
    vocesEspañol.find(v => v.name.includes('Natural')) || // Premium de Edge
    vocesEspañol.find(v => v.name.includes('Microsoft')) || 
    vocesEspañol[0]; // Si nada funciona, la primera en español que encuentre

  if (vozElegida) locucion.voice = vozElegida;

  locucion.lang = locucion.voice ? locucion.voice.lang : 'es-ES';
  locucion.rate = 0.95; // Un poco más lento para que sea más clara y natural
  locucion.pitch = 1;
  window.speechSynthesis.speak(locucion);
};