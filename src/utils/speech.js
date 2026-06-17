let vocesDisponibles = [];

// El navegador tarda unos milisegundos en cargar las voces, así que las pre-cargamos y actualizamos aquí
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  vocesDisponibles = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    vocesDisponibles = window.speechSynthesis.getVoices();
  };
}

export const reproducirVoz = (texto, isMuted) => {
  if (isMuted || !texto.trim() || !('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();
  const locucion = new SpeechSynthesisUtterance(texto);
  
  vocesDisponibles = window.speechSynthesis.getVoices();
  let vocesEspañol = vocesDisponibles.filter(voz => voz.lang.startsWith('es'));

  // 1. Eliminar voces masculinas
  const nombresMasculinos = ['tomas', 'pablo', 'raul', 'jorge', 'carlos', 'diego', 'masculino', 'male'];
  let vocesSinHombres = vocesEspañol.filter(voz => !nombresMasculinos.some(m => voz.name.toLowerCase().includes(m)));
  if (vocesSinHombres.length > 0) vocesEspañol = vocesSinHombres;

  const vocesFemeninas = ['sabina', 'francisca', 'monica', 'paulina', 'victoria', 'helena', 'laura', 'dalia', 'elena', 'abril', 'mia', 'lucia', 'karen', 'ximena'];

  // 2. ORDEN DE PRIORIDAD CORRECTO
  let vozElegida = 
    vocesEspañol.find(v => v.name.includes('Natural') && v.name.includes('es-')) || // 1. Edge Premium
    vocesEspañol.find(v => v.name.includes('Francisca') || v.name.includes('Sabina')) || // 2. Nativas Windows (Francisca es de Chile)
    vocesEspañol.find(v => v.name.includes('Monica') || v.name.includes('Paulina') || v.name.includes('Victoria')) || // 3. Nativas Apple
    vocesEspañol.find(v => vocesFemeninas.some(nombre => v.name.toLowerCase().includes(nombre))) || // 4. Otras nativas
    vocesEspañol.find(v => v.name.includes('Google español') || v.name.includes('Google Spanish')) || // 5. Chrome Voz Latina Real
    vocesEspañol[0];

  if (vozElegida) locucion.voice = vozElegida;
  locucion.lang = vozElegida ? vozElegida.lang : 'es-ES';
  locucion.rate = 0.95;
  locucion.pitch = 1.05;
  window.speechSynthesis.speak(locucion);
};