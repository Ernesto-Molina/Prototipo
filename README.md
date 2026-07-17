# Prototipo de Instagram para Adultos Mayores (con AngelGuard)

Este proyecto es un prototipo de alta fidelidad de la aplicación Instagram, diseñado específicamente como un entorno de práctica seguro y amigable para adultos mayores. El objetivo principal es permitirles familiarizarse con las funciones de una red social moderna sin el miedo a cometer errores, publicar contenido no deseado o interactuar con desconocidos.

La característica central es **AngelGuard**, un asistente virtual integrado que guía al usuario a través de voz y texto, explicando cada función y ofreciendo ayuda contextual en todo momento.

## ✨ Características Principales

-   **Simulación de Interfaz de Instagram:** Recreación detallada de las vistas principales:
    -   **Inicio:** Feed de publicaciones con likes, comentarios y la opción de guardar.
    -   **Stories:** Visualización de historias temporales.
    -   **Mensajes Privados:** Bandeja de entrada y chats individuales con capacidad de enviar texto y fotos.
    -   **Perfil:** Vista del perfil personal, galería de fotos publicadas y la opción de cambiar la foto de perfil.
    -   **Explorar/Buscar:** Sección para descubrir nuevo contenido.
-   **Asistente Virtual "AngelGuard":**
    -   **Guía Proactiva:** Ofrece explicaciones automáticas al entrar en nuevas secciones.
    -   **Ayuda por Voz:** Los usuarios pueden hacer preguntas al asistente usando el micrófono.
    -   **Dictado de Mensajes:** Permite escribir mensajes y comentarios usando la voz.
    -   **Confirmaciones de Seguridad:** Antes de enviar un mensaje o publicar, el asistente pide una confirmación para evitar acciones accidentales.
-   **Entorno 100% Seguro:**
    -   Todos los datos son de prueba y no hay conexión a internet real (excepto para el asistente).
    -   Las acciones como "publicar" o "enviar" son simuladas y solo afectan la vista local.
    -   Protección contra acciones accidentales, como borrar texto con la tecla de retroceso fuera de un campo de texto.

## 🛠️ Tecnologías Utilizadas

-   **Frontend:** [React](https://react.dev/) con [Vite](https://vitejs.dev/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para un diseño rápido y responsivo.
-   **Asistente IA:** [Groq API](https://groq.com/) para respuestas rápidas del asistente.
-   **Voz a Texto y Texto a Voz:** APIs nativas del navegador (Web Speech API).
-   **Gestor de Paquetes:** [pnpm](https://pnpm.io/)

## 🚀 Cómo ejecutar el proyecto

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    ```
2.  **Instalar dependencias:** (Asegúrate de tener `pnpm` instalado: `npm install -g pnpm`)
    ```bash
    pnpm install
    ```
3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    pnpm run dev
    ```
4.  Abre tu navegador y ve a `http://localhost:5173` (o la URL que indique la terminal).
