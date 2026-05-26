export const initialStories = [
  { id: 1, user: 'Tu historia', avatar: 'https://i.pravatar.cc/150?u=yo', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800', isMine: true },
  { id: 2, user: 'Andrés', avatar: 'https://i.pravatar.cc/150?u=andres', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800' },
  { id: 3, user: 'María Rosa', avatar: 'https://i.pravatar.cc/150?u=maria', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800' },
  { id: 4, user: 'Noticias', avatar: 'https://i.pravatar.cc/150?u=news', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800' }
];

export const initialMessages = [
  { role: 'ai', text: 'Hola, soy AngelGuard. Su red social está lista y protegida. Puede tocar, deslizar y explorar sin miedo a romper nada. ¿En qué le ayudo?' }
];

export const initialPostsFeed = [
  { 
    id: 1, 
    user: 'Su Familia', 
    avatar: 'https://i.pravatar.cc/150?u=familia', 
    image: '/1000047523.jpg', 
    likes: 15, 
    hasLiked: false,
    isSaved: false, 
    caption: '¡Qué hermoso recuerdo! Compartiendo juntos un momento inolvidable.',
    comentarios: []
  }
];

export const initialPostsVideos = [
  { id: 101, user: 'Cocinera Juana', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', likes: 500, hasLiked: false, desc: 'Preparando una rica sopa para el invierno.' },
  { id: 102, user: 'Jardinería Fácil', image: 'https://images.unsplash.com/photo-1416879598555-5205ff4b2284?w=800', likes: 340, hasLiked: false, desc: 'Mis geranios floreciendo en primavera 🌸' },
  { id: 103, user: 'Perritos Tiernos', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800', likes: 1250, hasLiked: false, desc: 'Firulais aprendiendo un nuevo truco 🐶' },
  { id: 104, user: 'Tejidos y Lanas', image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800', likes: 890, hasLiked: false, desc: 'Terminando esta bufanda calientita para mi nieto.' }
];

export const initialChats = [
  {
    id: 201, user: 'Andrés (Su Nieto)', avatar: 'https://i.pravatar.cc/150?u=andres', unread: true,
    mensajes: [
      { de: 'Andrés', texto: '¡Hola abuelo! ¿Vendrás a almorzar mañana?' }
    ]
  },
  {
    id: 202, user: 'María Rosa', avatar: 'https://i.pravatar.cc/150?u=maria', unread: false,
    mensajes: [
      { de: 'María Rosa', texto: 'Te envié la receta de la torta de chocolate por aquí.' },
      { de: 'Usted', texto: 'Gracias María, intentaré hacerla el fin de semana.' },
      { de: 'María Rosa', texto: '¡Me avisas cómo te queda y me mandas foto!' }
    ]
  },
  {
    id: 203, user: 'Junta de Vecinos', avatar: 'https://i.pravatar.cc/150?u=junta', unread: false,
    mensajes: [
      { de: 'Junta de Vecinos', texto: 'Recuerde que el bingo solidario es este sábado a las 17:00 hrs.' }
    ]
  }
];