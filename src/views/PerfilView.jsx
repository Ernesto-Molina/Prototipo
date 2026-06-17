import React, { useState } from 'react';
import { useAngel } from '../context/AngelContext.jsx';
import { IconBookmark, IconMenu, IconPlus, IconTrash } from '../components/Icons';

export default function PerfilView({ misPosts, guardados, onSubirFotoClick, onEliminarFoto, miAvatar, onCambiarAvatarClick }) {
  const { llamarAlAngel } = useAngel();
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' o 'saved'
  
  const [postToDelete, setPostToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState('Usted');
  const [bio, setBio] = useState('Aprendiendo a usar Instagram con la ayuda de AngelGuard 😇');
  const [tempNombre, setTempNombre] = useState('');
  const [tempBio, setTempBio] = useState('');

  // Estados para la lista de contactos
  const [listaVisible, setListaVisible] = useState(false);
  const [tipoLista, setTipoLista] = useState(''); // 'Seguidores' o 'Seguidos'
  const [settingsVisible, setSettingsVisible] = useState(false);

  const seguidoresFalsos = [
    { nombre: 'María Rosa', avatar: 'https://i.pravatar.cc/150?u=maria' },
    { nombre: 'Andrés (Nieto)', avatar: 'https://i.pravatar.cc/150?u=andres' },
    { nombre: 'Junta de Vecinos', avatar: 'https://i.pravatar.cc/150?u=junta' },
    { nombre: 'Carmen', avatar: 'https://i.pravatar.cc/150?u=carmen' },
    { nombre: 'Dr. López', avatar: 'https://i.pravatar.cc/150?u=lopez' },
    { nombre: 'Club de Tejido', avatar: 'https://i.pravatar.cc/150?u=tejido' }
  ];

  const seguidosFalsos = [
    { nombre: 'Andrés (Nieto)', avatar: 'https://i.pravatar.cc/150?u=andres' },
    { nombre: 'Noticias Locales', avatar: 'https://i.pravatar.cc/150?u=noticias' },
    { nombre: 'Recetas de la Abuela', avatar: 'https://i.pravatar.cc/150?u=recetas' },
    { nombre: 'Jardinería Fácil', avatar: 'https://i.pravatar.cc/150?u=jardin' },
    { nombre: 'María Rosa', avatar: 'https://i.pravatar.cc/150?u=maria' },
    { nombre: 'Salud y Bienestar', avatar: 'https://i.pravatar.cc/150?u=salud' }
  ];

  return (
    <div className="w-full bg-white min-h-[85vh]">
      {/* Barra superior del perfil (Reemplaza a la cabecera principal) */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-30">
        <div className="w-1/3 flex justify-start">
          <button onClick={onSubirFotoClick} className="text-gray-900 transition-transform active:scale-90" aria-label="Subir foto">
            <IconPlus />
          </button>
        </div>
        <div className="w-1/3 flex justify-center">
          <span className="font-bold text-xl flex items-center gap-1 text-gray-900 truncate">
            {nombre}
          </span>
        </div>
        <div className="w-1/3 flex justify-end">
          <button onClick={() => { setSettingsVisible(true); llamarAlAngel("Este es el menú de configuraciones. Aquí se controla la privacidad de su cuenta, qué personas pueden ver sus cosas y sus notificaciones."); }} className="text-gray-900 transition-transform active:scale-90">
            <IconMenu />
          </button>
        </div>
      </div>

      {/* Encabezado del Perfil */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-6 mb-4">
          <img 
            src={miAvatar} 
            alt="Mi Perfil" 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200 p-0.5 cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity"
            onClick={() => {
              onCambiarAvatarClick();
              llamarAlAngel("Ha tocado su foto de perfil. Ahora puede elegir una nueva foto de su galería para reemplazarla.");
            }}
          />
          <div className="flex flex-1 justify-between text-center">
            <div>
              <p className="font-bold text-xl text-gray-900">{misPosts.length}</p>
              <p className="text-sm text-gray-800">Publicaciones</p>
            </div>
            <div className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => {
              setTipoLista('Seguidores');
              setListaVisible(true);
              llamarAlAngel("Esta es la lista de personas que ven sus fotos. Ellos son sus seguidores.");
            }}>
              <p className="font-bold text-xl text-gray-900">12</p>
              <p className="text-sm text-gray-800">Seguidores</p>
            </div>
            <div className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => {
              setTipoLista('Seguidos');
              setListaVisible(true);
              llamarAlAngel("Esta es la lista de las personas a las que usted sigue para ver sus fotos en el inicio.");
            }}>
              <p className="font-bold text-xl text-gray-900">18</p>
              <p className="text-sm text-gray-800">Seguidos</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="font-bold text-base text-gray-900">{nombre}</p>
          <p className="text-base text-gray-800 leading-snug">{bio}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => {
            setTempNombre(nombre);
            setTempBio(bio);
            setIsEditing(true);
            llamarAlAngel("Ha abierto la edición de perfil. Toque la caja que dice 'Nombre' o 'Presentación' para borrar y escribir algo nuevo usando su teclado. Al terminar presione Guardar.");
          }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-1.5 rounded-lg text-sm transition-colors">
            Editar perfil
          </button>
          <button onClick={() => llamarAlAngel("Con este botón puede enviarle su perfil a un amigo por mensaje para que comience a seguirlo.")} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-1.5 rounded-lg text-sm transition-colors">
            Compartir perfil
          </button>
        </div>
      </div>

      {/* Pestañas de Cuadrícula */}
      <div className="flex justify-center border-b border-gray-200">
        <div 
          className={`w-1/2 py-3 flex justify-center cursor-pointer transition-colors ${activeTab === 'grid' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
          onClick={() => setActiveTab('grid')}
        >
           <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </div>
        <div 
          className={`w-1/2 py-3 flex justify-center cursor-pointer transition-colors ${activeTab === 'saved' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
          onClick={() => {
            setActiveTab('saved');
            llamarAlAngel("Esta es su colección privada. Aquí aparecen todas las fotos que guardó tocando el ícono de la cinta en el inicio.");
          }}
        >
           <IconBookmark saved={activeTab === 'saved'} />
        </div>
      </div>

      {/* CONTENIDO 1: MIS FOTOS */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
          {misPosts.length > 0 ? (
            misPosts.map(post => (
              <div key={post.id} className="relative aspect-square bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => llamarAlAngel("Esta es una de las fotos que usted ha subido. ¡Se ve genial en su muro!")}>
                <img src={post.image} alt="Publicación" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setPostToDelete(post);
                    llamarAlAngel("¿Está seguro de que desea eliminar esta foto? Si lo hace, desaparecerá de su perfil y nadie más podrá verla.");
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/40 text-white rounded-full hover:bg-red-500 transition-colors active:scale-95 shadow-sm"
                  aria-label="Eliminar foto"
                >
                  <IconTrash className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-16 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 border-2 border-gray-900 rounded-full flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Aún no hay fotos</h3>
              <p className="text-gray-600 text-base">Toque el botón <span className="font-bold">(+)</span> en la esquina de arriba para subir su primera foto y verla aquí.</p>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO 2: FOTOS GUARDADAS */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
          {guardados.length > 0 ? (
            guardados.map(post => (
              <div key={post.id} className="aspect-square bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => llamarAlAngel("Esta es una foto que guardó de " + post.user + ". Es su colección privada.")}>
                <img src={post.image} alt="Publicación Guardada" className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="col-span-3 py-16 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 border-2 border-gray-900 rounded-full flex items-center justify-center mb-4">
                <IconBookmark saved={false} />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Aún no ha guardado nada</h3>
              <p className="text-gray-600 text-base">Cuando vea una foto que le guste en el inicio, toque la <span className="font-bold">cinta</span> debajo de ella para guardarla aquí.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE EDITAR PERFIL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <span className="font-bold text-lg text-gray-900">Editar perfil</span>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-900 font-bold text-xl px-2">✕</button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col items-center mb-2">
                <img src={miAvatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border border-gray-200 mb-2" />
                <span className="text-blue-500 font-semibold text-sm cursor-pointer" onClick={() => { setIsEditing(false); onCambiarAvatarClick(); llamarAlAngel("Seleccione la nueva foto que desea usar."); }}>Cambiar foto de perfil</span>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Nombre</label>
                <input value={tempNombre} onChange={e => setTempNombre(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 text-gray-900 focus:border-blue-500 outline-none caret-black" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Presentación</label>
                <textarea value={tempBio} onChange={e => setTempBio(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 text-gray-900 focus:border-blue-500 outline-none resize-none h-24 caret-black" />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex gap-3">
              <button onClick={() => {
                setIsEditing(false);
                llamarAlAngel("Ha cancelado la edición. Su perfil sigue exactamente como estaba antes.");
              }} className="flex-1 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl active:bg-gray-200 transition-colors">Cancelar</button>
              
              <button onClick={() => {
                setNombre(tempNombre);
                setBio(tempBio);
                setIsEditing(false);
                llamarAlAngel("¡Fantástico! Ha guardado los cambios correctamente. Mire su perfil para ver su nuevo nombre y presentación.");
              }} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl active:bg-blue-700 transition-colors">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE LISTA DE SEGUIDORES/SEGUIDOS */}
      {listaVisible && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 max-h-[70vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
              <span className="font-bold text-lg text-gray-900">{tipoLista}</span>
              <button onClick={() => setListaVisible(false)} className="text-gray-500 hover:text-gray-900 font-bold text-xl px-2">✕</button>
            </div>
            
            <div className="overflow-y-auto p-2">
              {(tipoLista === 'Seguidores' ? seguidoresFalsos : seguidosFalsos).map((persona, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors" onClick={() => llamarAlAngel(`Este es el perfil de ${persona.nombre}. En la aplicación real, si toca aquí iría a ver sus fotos.`)}>
                  <img src={persona.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-200" alt={persona.nombre} />
                  <span className="font-semibold text-gray-900 text-base">{persona.nombre}</span>
                  <button className="ml-auto bg-gray-200 text-gray-900 text-sm font-bold py-1.5 px-4 rounded-lg">Ver</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIGURACIONES (MENÚ HAMBURGUESA) */}
      {settingsVisible && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95">
            <div className="flex justify-center p-3">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-center items-center relative">
              <span className="font-bold text-lg text-gray-900">Configuración y actividad</span>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh] p-2">
              <div className="p-4 flex items-center gap-4 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors" onClick={() => llamarAlAngel("Aquí podría ver cuánto tiempo pasa en la aplicación o recuperar fotos eliminadas recientemente.")}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span className="font-semibold text-gray-900 text-base">Tu actividad</span>
              </div>
              <div className="p-4 flex items-center gap-4 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors" onClick={() => llamarAlAngel("En este apartado puede decidir si su cuenta es pública para todo el mundo, o privada solo para sus amigos conocidos.")}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span className="font-semibold text-gray-900 text-base">Privacidad de la cuenta</span>
              </div>
              <div className="p-4 flex items-center gap-4 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors" onClick={() => llamarAlAngel("Aquí encontraría la lista de las personas que usted ha bloqueado para que no puedan ver su perfil ni molestarle.")}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                <span className="font-semibold text-gray-900 text-base">Cuentas bloqueadas</span>
              </div>
              <div className="p-4 mt-2 mb-4 border-t border-gray-200">
                <button onClick={() => { setSettingsVisible(false); llamarAlAngel("Ha cerrado el menú de configuraciones de forma segura."); }} className="w-full mt-2 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Cerrar menú
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR FOTO */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <IconTrash className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">¿Eliminar foto?</h3>
            <p className="text-gray-600 text-base mb-6">Esta acción no se puede deshacer. La foto desaparecerá de su perfil para siempre.</p>
            
            <div className="flex flex-col gap-3 w-full">
              <button onClick={() => {
                onEliminarFoto(postToDelete.id);
                setPostToDelete(null);
                llamarAlAngel("La foto ha sido eliminada correctamente de su perfil.");
              }} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl active:bg-red-700 transition-colors">
                Sí, eliminar foto
              </button>
              <button onClick={() => {
                setPostToDelete(null);
                llamarAlAngel("No se preocupe, la foto está a salvo. Hemos cancelado la eliminación.");
              }} className="w-full py-3 bg-gray-100 text-gray-900 font-bold rounded-xl active:bg-gray-200 transition-colors">
                No, conservar foto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
