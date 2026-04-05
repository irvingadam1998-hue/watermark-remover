export type Lang = "en" | "es";

const en = {
  nav: {
    home: "Home", rotate: "Rotate", trim: "Trim",
    mute: "Remove Audio", about: "About", privacy: "Privacy", contact: "Contact",
  },
  status: "Local · No uploads",
  footer: { copy: "Unmarkify © 2025", tech: "FFmpeg.wasm · No servers · No limits" },

  // Sidebar / steps
  sidebar: {
    tagline1: "Remove watermarks", tagline2: "from ", tagline3: "your videos.",
    sub: "Processed in your browser. No servers, no limits.",
    privacy: "🔒 100% Private",
    privacyDesc: "Your video never leaves your device.",
  },
  steps: [
    { label: "Upload video", hint: "MP4, MOV, AVI, MKV, WebM" },
    { label: "Mark region", hint: "Draw over the watermark" },
    { label: "Download", hint: "Clean video without watermark" },
  ],

  // Landing hero
  hero: {
    tag: "Free tool",
    h1a: "Remove any", h1b: "watermark", h1c: "in seconds.",
    p: "Mark the exact area, choose the effect and download your clean video. No registration, no cost, no limits.",
    badges: ["⚡ In your browser", "🔒 No uploads", "🎯 3 effects"],
  },
  drop: {
    title: "Drag your video here",
    sub: "or click to select a file",
  },
  features: [
    { title: "Multi-thread", desc: "FFmpeg.wasm with Web Workers" },
    { title: "Pixel perfect", desc: "Mark the exact area to remove" },
    { title: "3 effects", desc: "Remove, blur or pixelate" },
  ],

  // How it works
  hiw: {
    label: "Process", title: "How it works",
    sub: "Four simple steps, no registration, no waiting.",
    steps: [
      { n: "01", icon: "🎬", title: "Upload your video", desc: "Drag any video from your device. Formats MP4, MOV, AVI, MKV and WebM." },
      { n: "02", icon: "✏️", title: "Mark the area", desc: "Activate 'Mark area', pause the video and draw a rectangle over the watermark." },
      { n: "03", icon: "🎨", title: "Choose the effect", desc: "Remove, blur or pixelate the marked area." },
      { n: "04", icon: "✅", title: "Download clean", desc: "FFmpeg processes in your browser and you can download instantly." },
    ],
  },

  // Tools section
  tools: {
    label: "Tools", title: "All tools",
    sub: "Video processing directly in your browser, no installation required.",
    list: [
      { title: "Remove watermark", desc: "Remove, blur or pixelate logos and marks in your videos.", active: true },
      { title: "Rotate video", desc: "Rotate 90°, 180° or flip your video horizontally/vertically.", active: false },
      { title: "Trim video", desc: "Select the exact segment you want to keep.", active: false },
      { title: "Remove audio", desc: "Remove the audio track without re-encoding the video.", active: false },
    ],
  },

  // FAQ
  faq: {
    label: "FAQ", title: "Frequently asked questions",
    items: [
      { q: "What formats are supported?", a: "MP4, MOV, AVI, MKV and WebM. The result is always exported as MP4 (H.264), compatible with any device." },
      { q: "Is there a file size limit?", a: "No. The only limit is your device's RAM. Works with videos of several GB without problems." },
      { q: "Is my video uploaded to any server?", a: "No. Everything runs in your browser using FFmpeg.wasm. Your video never leaves the device." },
      { q: "Which mode should I use?", a: "Remove reconstructs the background (ideal for static logos). Blur and Pixelate visually hide the area. Try all three." },
      { q: "Why does processing take so long?", a: "FFmpeg runs in the browser, which is slower than native. Use 'Fast' to reduce processing time." },
      { q: "What is CRF?", a: "Constant Rate Factor: 18 = maximum quality (large file), 28 = more compression. 23 is a good balance." },
    ],
  },

  // Editor
  editor: {
    play: "▶ Play", draw: "✏ Mark area", clear: "✕ Clear",
    process: "⚡ Process", change: "↩ Change",
    effect: "Effect:", speed: "Speed:", quality: "Quality:",
    high: "High", low: "Low",
    hint: "💡 Pause the video and drag to mark the watermark area",
    loading: "⏳ Loading…", processing: "⚡ Processing…",
    modes: [{ label: "Remove" }, { label: "Blur" }, { label: "Pixelate" }],
    presets: [{ label: "Fast" }, { label: "Normal" }, { label: "Better" }, { label: "Max" }],
    loadingFFmpeg: "Loading FFmpeg…",
    processingVideo: "Processing video…",
  },

  // Result
  result: {
    title: "Result", ready: "✓ READY", newVideo: "New video",
    download: "Download video without watermark",
    stats: { time: "Time", original: "Original", result: "Result", reduction: "Reduction" },
  },

  // Region selector info panel
  region: {
    info: "Information",
    rows: ["Resolution", "Orientation", "Marked areas"],
    portrait: "Vertical (9:16)",
    none: "None", zone: "area", zones: "areas",
    howTo: "How to mark",
    howToSteps: ["Activate 'Mark area'", "Pause the video", "Drag over the watermark"],
    modeActive: "Draw mode active",
    modePlay: "Playback mode active",
  },

  // About page
  about: {
    tag: "About", h1: "What is Unmarkify?",
    intro: "Unmarkify is a free, open-source tool to remove, blur or pixelate watermarks from videos, directly in your browser, without servers and without limits.",
    sections: [
      { title: "How does it work?", content: "Unmarkify uses FFmpeg.wasm, a WebAssembly build of FFmpeg. This allows running the same video processing engine used by professionals, but inside your browser. All processing happens locally on your device." },
      { title: "Why is it 100% private?", content: "Your video never leaves your device. There are no servers that receive your files, no database where they're stored, no employees who can view them. Unmarkify is a static web app that runs entirely on the client." },
      { title: "Is it free?", content: "Yes, completely. No paid plans, no usage limits, no registration required. Unmarkify is and will remain free." },
      { title: "What tools does it include?", content: "In addition to removing watermarks (with three effects: remove, blur and pixelate), Unmarkify includes tools to rotate videos, trim them and remove audio." },
    ],
    stack: "Tech stack",
    stackItems: [
      { name: "FFmpeg.wasm", desc: "Video processing engine" },
      { name: "Next.js", desc: "React framework" },
      { name: "TypeScript", desc: "Static typing" },
      { name: "WebAssembly", desc: "Native browser execution" },
    ],
  },

  // Privacy page
  privacy: {
    tag: "Legal", h1: "Privacy Policy", updated: "Last updated: January 2025",
    highlightTitle: "Summary: total privacy",
    highlightBody: "Unmarkify collects no data, uploads no files, uses no tracking cookies and has no analytics. Your activity on this site is completely private.",
    sections: [
      { icon: "🔒", title: "No data collection", body: "Unmarkify collects no personal data. No registration forms, no behavior analysis, no user identifiers. You are completely anonymous." },
      { icon: "📁", title: "Your files never leave your device", body: "All video processing happens in your browser using FFmpeg.wasm (WebAssembly). Your videos are not uploaded to any server. Ever." },
      { icon: "🍪", title: "No tracking cookies", body: "We don't use tracking cookies, tracking pixels or any third-party trackers. Any cookies used are exclusively for technical functionality." },
      { icon: "📊", title: "No analytics", body: "We don't use Google Analytics, Meta Pixel or any third-party analytics service. We have no way to know who uses Unmarkify." },
      { icon: "🌐", title: "External resources", body: "FFmpeg files are served locally from the same server (not from third-party CDNs). The only external connection is the initial site load." },
      { icon: "📝", title: "Changes to this policy", body: "If we change anything in this privacy policy in the future, we will clearly indicate it on this page." },
    ],
  },

  // Contact page
  contact: {
    tag: "Contact", h1: "Have a question?",
    intro: "Write to us to report a bug, suggest a feature or just say hi.",
    options: [
      { icon: "🐛", title: "Report a bug", desc: "Something isn't working as expected. Tell us what happened and how to reproduce it.", label: "Send report", subject: "Bug%20Report" },
      { icon: "💡", title: "Suggest a feature", desc: "Have an idea that would make Unmarkify more useful? We love hearing suggestions.", label: "Send suggestion", subject: "Suggestion" },
      { icon: "❓", title: "General question", desc: "Any other question about Unmarkify, privacy or how the tool works.", label: "Write to us", subject: "" },
    ],
    responseLabel: "Response time:", responseVal: "We try to respond within 48 hours on business days.",
    langLabel: "Languages:", langVal: "We respond in Spanish and English.",
    noteLabel: "Note:", noteVal: "We don't store your videos and can't access them. If you have a technical issue, describe the video type without sending us the file.",
  },

  // Rotate page
  rotate: {
    tag: "Tool", h1: "Rotate video",
    desc: "Rotate or flip your video without re-encoding the audio. Fast and lossless for audio quality.",
    uploadTitle: "Upload your video to rotate", uploadSub: "Drag or click to select",
    rotationType: "Rotation type",
    rotations: [
      { label: "90° right" }, { label: "90° left" }, { label: "180°" },
      { label: "Flip horizontal" }, { label: "Flip vertical" },
    ],
    process: "⚡ Apply rotation", loading: "⏳ Loading FFmpeg…",
    processing: "⚡ Processing…", download: "Download rotated video",
  },

  // Trim page
  trim: {
    tag: "Tool", h1: "Trim video",
    desc: "Select the start and end of the clip you want to keep. Done without re-encoding, so it's almost instant.",
    uploadTitle: "Upload your video to trim", uploadSub: "Drag or click to select",
    start: "Start", duration: "Clip duration", end: "End",
    startPoint: "Start point", endPoint: "End point",
    hint: "💡 Move the sliders and the video will jump to that position so you can preview the cut.",
    process: "✂️ Trim video", loading: "⏳ Loading FFmpeg…",
    processing: "⚡ Trimming…", download: "Download trimmed video",
    noRange: "Select a valid range",
  },

  // Mute page
  mute: {
    tag: "Tool", h1: "Remove audio",
    desc: "Remove the audio track from your video. The video is not re-encoded, so the process is almost instant and without visual quality loss.",
    uploadTitle: "Upload your video to mute", uploadSub: "Drag or click to select",
    cards: [
      { icon: "🎵", label: "Original audio", value: "Will be removed", color: "#dc2626" },
      { icon: "🎬", label: "Video", value: "Unchanged", color: "#16a34a" },
      { icon: "⚡", label: "Speed", value: "Instant", color: "var(--ink)" },
      { icon: "📁", label: "Size", value: "Smaller", color: "#16a34a" },
    ],
    process: "🔇 Remove audio", loading: "⏳ Loading FFmpeg…",
    processing: "⚡ Processing…", download: "Download video without audio",
    removing: "Removing audio…",
  },
};

const es: typeof en = {
  nav: {
    home: "Inicio", rotate: "Rotar", trim: "Recortar",
    mute: "Quitar audio", about: "Acerca de", privacy: "Privacidad", contact: "Contacto",
  },
  status: "Local · Sin uploads",
  footer: { copy: "Unmarkify © 2025", tech: "FFmpeg.wasm · Sin servidores · Sin límites" },

  sidebar: {
    tagline1: "Elimina marcas de", tagline2: "agua de ", tagline3: "tus videos.",
    sub: "Procesado en tu navegador. Sin servidores, sin límites.",
    privacy: "🔒 100% Privado",
    privacyDesc: "Tu video nunca sale de tu dispositivo.",
  },
  steps: [
    { label: "Subir video", hint: "MP4, MOV, AVI, MKV, WebM" },
    { label: "Marcar región", hint: "Dibuja sobre la marca de agua" },
    { label: "Descargar", hint: "Video listo sin marca de agua" },
  ],

  hero: {
    tag: "Herramienta gratuita",
    h1a: "Quita cualquier", h1b: "marca de agua", h1c: "en segundos.",
    p: "Selecciona la zona exacta, elige el efecto y descarga tu video limpio. Sin registro, sin costo, sin límites.",
    badges: ["⚡ En tu navegador", "🔒 Sin uploads", "🎯 3 efectos"],
  },
  drop: {
    title: "Arrastra tu video aquí",
    sub: "o haz clic para seleccionar un archivo",
  },
  features: [
    { title: "Multi-thread", desc: "FFmpeg.wasm con Web Workers" },
    { title: "Pixel perfect", desc: "Dibuja la región exacta a eliminar" },
    { title: "3 efectos", desc: "Eliminar, difuminar o pixelar" },
  ],

  hiw: {
    label: "Proceso", title: "Cómo funciona",
    sub: "Cuatro pasos simples, sin registro, sin esperas.",
    steps: [
      { n: "01", icon: "🎬", title: "Sube tu video", desc: "Arrastra cualquier video desde tu dispositivo. Formatos MP4, MOV, AVI, MKV y WebM." },
      { n: "02", icon: "✏️", title: "Marca la zona", desc: "Activa 'Marcar zona', pausa el video y dibuja un rectángulo sobre la marca de agua." },
      { n: "03", icon: "🎨", title: "Elige el efecto", desc: "Selecciona Eliminar, Difuminar o Pixelar y ajusta la calidad a tu gusto." },
      { n: "04", icon: "✅", title: "Descarga limpio", desc: "FFmpeg procesa en tu navegador y puedes descargarlo al instante." },
    ],
  },

  tools: {
    label: "Herramientas", title: "Todas las herramientas",
    sub: "Procesamiento de video directamente en tu navegador, sin instalar nada.",
    list: [
      { title: "Quitar marca de agua", desc: "Elimina, difumina o pixela logos y marcas en tus videos.", active: true },
      { title: "Rotar video", desc: "Rota 90°, 180° o refleja tu video horizontal/verticalmente.", active: false },
      { title: "Recortar video", desc: "Selecciona el segmento exacto que quieres conservar.", active: false },
      { title: "Quitar audio", desc: "Elimina la pista de audio sin re-encodear el video.", active: false },
    ],
  },

  faq: {
    label: "FAQ", title: "Preguntas frecuentes",
    items: [
      { q: "¿Qué formatos soporta?", a: "MP4, MOV, AVI, MKV y WebM. El resultado se exporta siempre en MP4 (H.264), compatible con cualquier dispositivo." },
      { q: "¿Hay límite de tamaño?", a: "No. El único límite es la RAM de tu dispositivo. Funciona con videos de varios GB sin problema." },
      { q: "¿Mi video se sube a algún servidor?", a: "No. Todo ocurre en tu navegador con FFmpeg.wasm. Tu video nunca sale del dispositivo." },
      { q: "¿Cuál modo debo usar?", a: "Eliminar reconstruye el fondo (ideal para logos fijos). Difuminar y Pixelar ocultan la zona visualmente. Prueba los tres." },
      { q: "¿Por qué tarda en procesar?", a: "FFmpeg corre en el navegador, es más lento que nativo. Usa 'Rápido' para reducir el tiempo." },
      { q: "¿Qué es el CRF?", a: "Constant Rate Factor: 18 = máxima calidad (archivo grande), 28 = más compresión. 23 es el balance ideal." },
    ],
  },

  editor: {
    play: "▶ Reproducir", draw: "✏ Marcar zona", clear: "✕ Limpiar",
    process: "⚡ Procesar", change: "↩ Cambiar",
    effect: "Efecto:", speed: "Velocidad:", quality: "Calidad:",
    high: "Alta", low: "Baja",
    hint: "💡 Pausa el video y arrastra para marcar la zona con marca de agua",
    loading: "⏳ Cargando…", processing: "⚡ Procesando…",
    modes: [{ label: "Eliminar" }, { label: "Difuminar" }, { label: "Pixelar" }],
    presets: [{ label: "Rápido" }, { label: "Normal" }, { label: "Mejor" }, { label: "Máx" }],
    loadingFFmpeg: "Cargando FFmpeg…",
    processingVideo: "Procesando video…",
  },

  result: {
    title: "Resultado", ready: "✓ LISTO", newVideo: "Nuevo video",
    download: "Descargar video sin marca de agua",
    stats: { time: "Tiempo", original: "Original", result: "Resultado", reduction: "Reducción" },
  },

  region: {
    info: "Información",
    rows: ["Resolución", "Orientación", "Zonas marcadas"],
    portrait: "Vertical (9:16)",
    none: "Ninguna", zone: "zona", zones: "zonas",
    howTo: "Cómo marcar",
    howToSteps: ["Activa 'Marcar zona'", "Pausa el video", "Arrastra sobre la marca de agua"],
    modeActive: "Modo marcado activo",
    modePlay: "Modo reproducción activo",
  },

  about: {
    tag: "Acerca de", h1: "¿Qué es Unmarkify?",
    intro: "Unmarkify es una herramienta gratuita y de código abierto para eliminar, difuminar o pixelar marcas de agua de videos, directamente en tu navegador, sin servidores y sin límites.",
    sections: [
      { title: "¿Cómo funciona?", content: "Unmarkify usa FFmpeg.wasm, una compilación de FFmpeg para WebAssembly. Esto permite ejecutar el mismo motor de procesamiento de video que usan profesionales, pero dentro de tu navegador. Todo el procesamiento ocurre localmente en tu dispositivo." },
      { title: "¿Por qué es 100% privado?", content: "Tu video nunca sale de tu dispositivo. No hay servidores que reciban tus archivos, no hay base de datos donde se almacenen, no hay empleados que puedan verlos. Unmarkify es una aplicación web estática que corre completamente en el cliente." },
      { title: "¿Es gratuito?", content: "Sí, completamente. No hay planes de pago, no hay límites de uso, no hay registro requerido. Unmarkify es y seguirá siendo gratuito." },
      { title: "¿Qué herramientas incluye?", content: "Además de quitar marcas de agua (con tres efectos: eliminar, difuminar y pixelar), Unmarkify incluye herramientas para rotar videos, recortarlos y eliminar el audio." },
    ],
    stack: "Stack tecnológico",
    stackItems: [
      { name: "FFmpeg.wasm", desc: "Motor de procesamiento de video" },
      { name: "Next.js", desc: "Framework de React" },
      { name: "TypeScript", desc: "Tipado estático" },
      { name: "WebAssembly", desc: "Ejecución nativa en navegador" },
    ],
  },

  privacy: {
    tag: "Legal", h1: "Política de privacidad", updated: "Última actualización: Enero 2025",
    highlightTitle: "Resumen: privacidad total",
    highlightBody: "Unmarkify no recopila datos, no sube archivos, no usa cookies de rastreo y no tiene analytics. Tu actividad en este sitio es completamente privada.",
    sections: [
      { icon: "🔒", title: "Sin recopilación de datos", body: "Unmarkify no recopila ningún dato personal. No hay formularios de registro, no hay análisis de comportamiento, no hay identificadores de usuario. Eres completamente anónimo." },
      { icon: "📁", title: "Tus archivos nunca salen de tu dispositivo", body: "Todo el procesamiento de video ocurre en tu navegador usando FFmpeg.wasm. Tus videos no se suben a ningún servidor. Nunca." },
      { icon: "🍪", title: "Sin cookies de rastreo", body: "No usamos cookies de seguimiento, pixels de seguimiento ni ningún tipo de rastreador de terceros." },
      { icon: "📊", title: "Sin analytics", body: "No usamos Google Analytics, Meta Pixel, ni ningún servicio de analítica de terceros." },
      { icon: "🌐", title: "Recursos externos", body: "Los archivos de FFmpeg se sirven localmente desde el mismo servidor, no desde CDNs de terceros." },
      { icon: "📝", title: "Cambios en esta política", body: "Si en el futuro cambiamos algo en esta política de privacidad, lo indicaremos claramente en esta página." },
    ],
  },

  contact: {
    tag: "Contacto", h1: "¿Tienes alguna pregunta?",
    intro: "Puedes escribirnos para reportar un bug, sugerir una función o simplemente saludar.",
    options: [
      { icon: "🐛", title: "Reportar un bug", desc: "Algo no funciona como esperabas. Cuéntanos qué pasó y cómo reproducirlo.", label: "Enviar reporte", subject: "Bug%20Report" },
      { icon: "💡", title: "Sugerir una función", desc: "¿Tienes una idea que haría Unmarkify más útil? Nos encanta escuchar sugerencias.", label: "Enviar sugerencia", subject: "Sugerencia" },
      { icon: "❓", title: "Pregunta general", desc: "Cualquier otra consulta sobre Unmarkify, privacidad o cómo funciona la herramienta.", label: "Escribirnos", subject: "" },
    ],
    responseLabel: "Tiempo de respuesta:", responseVal: "Intentamos responder dentro de 48 horas en días hábiles.",
    langLabel: "Idiomas:", langVal: "Atendemos en español e inglés.",
    noteLabel: "Nota:", noteVal: "No almacenamos tus videos ni podemos acceder a ellos. Si tienes un problema técnico, describe el tipo de video sin enviarnos el archivo.",
  },

  rotate: {
    tag: "Herramienta", h1: "Rotar video",
    desc: "Rota o refleja tu video sin re-encodear el audio. Rápido y sin pérdida de calidad de audio.",
    uploadTitle: "Sube tu video para rotar", uploadSub: "Arrastra o haz clic para seleccionar",
    rotationType: "Tipo de rotación",
    rotations: [
      { label: "90° derecha" }, { label: "90° izquierda" }, { label: "180°" },
      { label: "Espejo horizontal" }, { label: "Espejo vertical" },
    ],
    process: "⚡ Aplicar rotación", loading: "⏳ Cargando FFmpeg…",
    processing: "⚡ Procesando…", download: "Descargar video rotado",
  },

  trim: {
    tag: "Herramienta", h1: "Recortar video",
    desc: "Selecciona el inicio y fin del clip que quieres conservar. Se hace sin re-encodear, por lo que es casi instantáneo.",
    uploadTitle: "Sube tu video para recortar", uploadSub: "Arrastra o haz clic para seleccionar",
    start: "Inicio", duration: "Duración del clip", end: "Fin",
    startPoint: "Punto de inicio", endPoint: "Punto de fin",
    hint: "💡 Mueve los sliders y el video saltará a esa posición para que puedas previsualizar el corte.",
    process: "✂️ Recortar video", loading: "⏳ Cargando FFmpeg…",
    processing: "⚡ Recortando…", download: "Descargar video recortado",
    noRange: "Selecciona un rango válido",
  },

  mute: {
    tag: "Herramienta", h1: "Quitar audio",
    desc: "Elimina la pista de audio de tu video. El video no se re-encodea, así que el proceso es casi instantáneo y sin pérdida de calidad visual.",
    uploadTitle: "Sube tu video para silenciar", uploadSub: "Arrastra o haz clic para seleccionar",
    cards: [
      { icon: "🎵", label: "Audio original", value: "Se eliminará", color: "#dc2626" },
      { icon: "🎬", label: "Video", value: "Sin cambios", color: "#16a34a" },
      { icon: "⚡", label: "Velocidad", value: "Instantáneo", color: "var(--ink)" },
      { icon: "📁", label: "Tamaño", value: "Menor", color: "#16a34a" },
    ],
    process: "🔇 Quitar audio", loading: "⏳ Cargando FFmpeg…",
    processing: "⚡ Procesando…", download: "Descargar video sin audio",
    removing: "Eliminando audio…",
  },
};

export const translations = { en, es };
export type Translations = typeof en;
