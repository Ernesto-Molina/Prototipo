import React from 'react';
import { IconHeart, IconComment, IconPlane } from '../components/Icons';
import { useAngel } from '../context/AngelContext.jsx';

export default function VideosView({ postsVideos, enviarCariño }) {
  const { llamarAlAngel } = useAngel();
  return (
    <div className="bg-black w-full min-h-screen">
      {postsVideos.map(v => (
        <div key={v.id} className="w-full h-[calc(100vh-130px)] relative flex flex-col border-b border-gray-800">
          <img src={v.image} className="w-full h-full object-cover opacity-90" alt="Video" />
          <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black text-white flex justify-between items-end">
            <div>
              <p className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="w-10 h-10 bg-gray-500 rounded-full overflow-hidden border border-white block"><img src={v.image} className="w-full h-full object-cover" alt={v.user} /></span>
                {v.user}
              </p>
              <p className="text-base text-gray-200 w-4/5">{v.desc}</p>
            </div>
            <div className="flex flex-col gap-6 items-center pb-4">
              <button onClick={(e) => { e.stopPropagation(); enviarCariño(v.id, 'video'); }} className="flex flex-col items-center gap-1">
                <IconHeart filled={v.hasLiked} className="w-8 h-8" />
                <span className="text-xs font-semibold">{v.likes}</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); llamarAlAngel("Aquí puede dejar un mensaje escrito para el creador del video."); }}>
                <IconComment />
              </button>
              <button onClick={(e) => { e.stopPropagation(); llamarAlAngel("Este avión le permite enviarle el video a su nieto."); }}>
                <IconPlane />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}