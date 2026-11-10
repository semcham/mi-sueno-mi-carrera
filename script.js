/* =========================================================
   Mi Sueño, Mi Carrera — Lógica del login y del test
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Datos ---------- */
  const CATEGORIES = {
    tech:     { tag: 'Tech & Código',    short: 'Tech',      icon: 'laptop_mac',  careersIcon: 'code',             careers: 'Software, IA, Ciberseguridad',                  color: '#6366f1', area: 'Innovación Tecnológica',     list: ['Ingeniería de Software', 'Ciencia de Datos e IA', 'Ciberseguridad', 'Ingeniería Mecatrónica'] },
    creative: { tag: 'Diseño & Arte',    short: 'Creativo',  icon: 'palette',     careersIcon: 'brush',            careers: 'Animación, Medios, Moda',                       color: '#e11d74', area: 'Creatividad y Comunicación', list: ['Diseño Gráfico y UX', 'Comunicación Audiovisual', 'Arquitectura', 'Animación Digital'] },
    health:   { tag: 'Salud & Vida',     short: 'Salud',     icon: 'vital_signs', careersIcon: 'medical_services', careers: 'Medicina, Psicología, Biotecnología',           color: '#0ea5e9', area: 'Salud y Bienestar',          list: ['Medicina Humana', 'Psicología', 'Enfermería', 'Nutrición'] },
    nature:   { tag: 'Bio & Planeta',    short: 'Ciencia',   icon: 'eco',         careersIcon: 'science',          careers: 'Veterinaria, Ecología, Química',                color: '#16a34a', area: 'Ciencia y Medio Ambiente',   list: ['Ingeniería Ambiental', 'Biología', 'Medicina Veterinaria', 'Ingeniería Química'] },
    social:   { tag: 'Liderazgo & Ley',  short: 'Líder',     icon: 'balance',     careersIcon: 'campaign',         careers: 'Derecho, Relaciones Internacionales, Política', color: '#8b5cf6', area: 'Liderazgo y Sociedad',       list: ['Derecho', 'Ciencia Política', 'Relaciones Internacionales', 'Educación'] },
    business: { tag: 'Negocios & Datos', short: 'Negocios',  icon: 'trending_up', careersIcon: 'query_stats',      careers: 'Emprendimiento, Economía, Marketing',           color: '#f59e0b', area: 'Negocios y Gestión',         list: ['Administración de Empresas', 'Economía', 'Marketing', 'Contabilidad y Finanzas'] }
  };
  const ORDER = ['tech', 'creative', 'health', 'nature', 'social', 'business'];
  const ADVANCE_DELAY = 450; // ms antes de pasar sola a la siguiente pregunta

  /* =========================================================
     TEST RIASEC (modelo de John Holland)
     6 tipos de personalidad vocacional. Cada afirmación suma
     puntos a un tipo: 3 = me encanta … 0 = no es para mí.
     ========================================================= */
  const TYPES = {
    R: { area: 'Realista',     nick: 'Manos a la obra',      qu: 'Ruraq',    short: 'Realista',     icon: 'construction',   color: '#f97316',
         desc: 'Te gusta lo práctico: construir, reparar, usar herramientas y trabajar al aire libre o con máquinas.' },
    I: { area: 'Investigador', nick: 'Mente curiosa',        qu: 'Maskaq',   short: 'Investigador', icon: 'science',        color: '#0ea5e9',
         desc: 'Te mueve la curiosidad: observar, analizar, experimentar y entender por qué pasan las cosas.' },
    A: { area: 'Artístico',    nick: 'Alma creativa',        qu: 'Kamariq',  short: 'Artístico',    icon: 'palette',        color: '#ec4899',
         desc: 'Te expresas creando: arte, diseño, música, escritura o ideas originales con libertad.' },
    S: { area: 'Social',       nick: 'Corazón que ayuda',    qu: 'Yanapaq',  short: 'Social',       icon: 'diversity_3',    color: '#22c55e',
         desc: 'Disfrutas ayudar, enseñar, cuidar y acompañar a otras personas.' },
    E: { area: 'Emprendedor',  nick: 'Líder que impulsa',    qu: 'Pusaq',    short: 'Emprendedor',  icon: 'rocket_launch',  color: '#f59e0b',
         desc: 'Te gusta liderar, convencer, tomar decisiones y hacer crecer proyectos o negocios.' },
    C: { area: 'Convencional', nick: 'Organizador/a experto/a', qu: 'Allichaq', short: 'Organizador', icon: 'fact_check',   color: '#6366f1',
         desc: 'Eres ordenado/a y preciso/a: te va bien con datos, cálculos, procesos y planificación.' }
  };
  const TYPE_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'];

  // Escala de respuesta (valor = puntos)
  const LIKERT = [
    { value: 3, emoji: '😍', es: '¡Me encanta!',   qu: '¡Anchatam munani!', key: '1' },
    { value: 2, emoji: '🙂', es: 'Me gusta',       qu: 'Munanim',           key: '2' },
    { value: 1, emoji: '😐', es: 'Más o menos',    qu: 'Pisillatam',        key: '3' },
    { value: 0, emoji: '🙁', es: 'No es para mí',  qu: 'Manam munanichu',   key: '4' }
  ];

  // 5 bloques (fases) de 6 afirmaciones: una de cada tipo
  const BLOCKS = [
    { es: 'Lo que disfrutas',      qu: 'Kusikuyniykuna',    lead: '¿Cuánto disfrutas…',        leadQu: '¿Kayta ruraspa kusikunkichu…' },
    { es: 'Lo que sabes hacer',    qu: 'Atiyniykuna',       lead: '¿Qué tan bien se te da…',   leadQu: '¿Allintachu atinki…' },
    { es: 'Materias y temas',      qu: 'Yachaykuna',        lead: '¿Cuánto te atraen…',        leadQu: '¿Kaykunata yachayta munankichu…' },
    { es: 'Dónde trabajarías',     qu: 'Llamkana wasikuna', lead: '¿Te gustaría…',             leadQu: '¿Munawaqchu…' },
    { es: 'Tus sueños',            qu: 'Musquyniykuna',     lead: '¿Qué tanto sueñas con…',    leadQu: '¿Kaytachu musqunki…' }
  ];

  const QUESTIONS = [
    // Bloque 1
    { t: 'R', es: 'Armar, reparar o construir cosas con tus manos?', qu: 'makiykiwan imakunatapas hatarichiy, allichay?' },
    { t: 'I', es: 'Investigar por qué ocurren las cosas (en la naturaleza, el cuerpo o la tecnología)?', qu: 'imaraykum imapas pasan chayta maskay (pachamamapi, ukhunchikpi utaq tecnologíapi)?' },
    { t: 'A', es: 'Dibujar, pintar, escribir historias, hacer música o editar videos?', qu: 'siqiy, llimpiy, willakuykunata qillqay, takiy utaq videokunata allichay?' },
    { t: 'S', es: 'Ayudar a tus compañeros cuando tienen un problema o no entienden un tema?', qu: 'masiykikunata yanapay, sasachakuyniyuq kaptinku utaq mana entiendeptinku?' },
    { t: 'E', es: 'Organizar a un grupo y convencerlo de hacer un proyecto?', qu: 'huk huñuta kamachiy, huk ruranapaq yuyaychaspa?' },
    { t: 'C', es: 'Ordenar información, hacer listas, cuadros o llevar cuentas?', qu: 'willakuykunata allichay, listakunata, cuadrokunata ruray utaq yupaykunata apay?' },
    // Bloque 2
    { t: 'I', es: 'resolver problemas de matemática, ciencias o lógica?', qu: 'matemáticapi, cienciapi utaq lógicapi sasachakuykunata allichay?' },
    { t: 'S', es: 'escuchar a las personas y hacer que se sientan comprendidas?', qu: 'runakunata uyariy, paykuna entiendesqa kanankupaq?' },
    { t: 'R', es: 'usar herramientas, máquinas o aparatos con facilidad?', qu: 'herramientakunata, máquinakunata utaq aparatokunata facilllata llamkachiy?' },
    { t: 'E', es: 'hablar en público y defender tus ideas?', qu: 'achka runakunapa ñawpaqninpi rimay, yuyayniykikunata harkaspa?' },
    { t: 'A', es: 'imaginar ideas originales que a otros no se les ocurren?', qu: 'manaraq pipa yuyasqan musuq yuyaykunata yuyaykuy?' },
    { t: 'C', es: 'ser ordenado/a, puntual y cuidadoso/a con los detalles?', qu: 'allin kamachisqa, puntual, imakunatapas allinta qawaq kay?' },
    // Bloque 3
    { t: 'A', es: 'los cursos de arte, música, literatura o comunicación?', qu: 'arte, música, literatura utaq comunicación yachaykuna?' },
    { t: 'E', es: 'los temas de negocios, ventas o cómo crecen las empresas?', qu: 'negociokuna, rantikuykuna, empresakuna imaynam wiñanku chay yachaykuna?' },
    { t: 'I', es: 'los experimentos de laboratorio y los cursos de ciencias?', qu: 'laboratoriopi experimentokuna, ciencia yachaykuna?' },
    { t: 'C', es: 'los cursos donde hay que calcular, clasificar o seguir pasos exactos?', qu: 'yupanapaq, rakinapaq utaq allin pasokunata qatinapaq yachaykuna?' },
    { t: 'R', es: 'el trabajo de campo, la agricultura, la mecánica o la construcción?', qu: 'chakrapi llamkay, mecánica utaq wasi hatarichiy?' },
    { t: 'S', es: 'los temas sobre salud, educación o problemas de tu comunidad?', qu: 'hampiymanta, yachachiymanta utaq llaqtapa sasachakuyninkunamanta yachaykuna?' },
    // Bloque 4
    { t: 'S', es: 'trabajar en un colegio, un hospital o con la comunidad?', qu: 'yachaywasipi, hampina wasipi utaq ayllukunawan llamkayta?' },
    { t: 'C', es: 'trabajar en una oficina organizada, con tareas claras?', qu: 'allin kamachisqa oficinapi, chiqap llamkaykunawan llamkayta?' },
    { t: 'E', es: 'trabajar en una empresa dinámica, con metas y decisiones importantes?', qu: 'kuyurikuq empresapi, metakunawan, hatun decisionkunawan llamkayta?' },
    { t: 'R', es: 'trabajar al aire libre, en el campo, en una obra o en un taller?', qu: 'hawapi, chakrapi, obrapi utaq tallerpi llamkayta?' },
    { t: 'A', es: 'trabajar en un estudio creativo, con libertad para experimentar?', qu: 'kamariq estudiopi, musuq yuyaykunata qispisqa pruebaspa llamkayta?' },
    { t: 'I', es: 'trabajar en un laboratorio o un centro de investigación?', qu: 'laboratoriopi utaq investigación centropi llamkayta?' },
    // Bloque 5
    { t: 'E', es: 'tener tu propio negocio o dirigir un equipo grande?', qu: 'kikiykipa negocioykita kapuyta utaq hatun equipota kamachiyta?' },
    { t: 'R', es: 'construir algo real que se pueda tocar: un puente, una máquina, una cosecha?', qu: 'llamiyta atikuq imatapas hatarichiyta: chaka, máquina, cosecha?' },
    { t: 'C', es: 'ser la persona de confianza que lleva el control de las cuentas o los datos?', qu: 'yupaykunata utaq datokunata apaq confianza runa kayta?' },
    { t: 'I', es: 'descubrir algo nuevo o inventar una solución científica?', qu: 'musuq imatapas tariyta utaq ciencia allichayta inventayta?' },
    { t: 'S', es: 'mejorar la vida de las personas que más lo necesitan?', qu: 'aswan necesitaq runakunapa kawsayninta allinchayta?' },
    { t: 'A', es: 'que tu arte o tus ideas sean vistos y disfrutados por mucha gente?', qu: 'arteyki utaq yuyayniykikuna achka runakunapa qawasqan, kusikusqan kananta?' }
  ];
  const TOTAL = QUESTIONS.length;
  const PER_BLOCK = 6;
  const KEYS = { users: 'msmc_users', session: 'msmc_session' };

  // Código Holland de cada carrera (tipos más afines, en orden de importancia)
  const HOLLAND = {
    'Ingeniería de Software': 'IRC', 'Ciencia de Datos e Inteligencia Artificial': 'ICR', 'Ingeniería Mecatrónica': 'RIC',
    'Diseño Gráfico y UX': 'AEI', 'Arquitectura': 'AIR', 'Comunicación Audiovisual': 'AES',
    'Medicina Humana': 'ISR', 'Psicología': 'SIA', 'Enfermería': 'SIR',
    'Ingeniería Ambiental': 'IRS', 'Medicina Veterinaria': 'IRS', 'Biología': 'IRA',
    'Derecho': 'ESI', 'Educación': 'SAE', 'Ciencia Política': 'ESI',
    'Administración de Empresas': 'ECS', 'Economía': 'ICE', 'Contabilidad y Finanzas': 'CEI',
    'Ingeniería de Sistemas': 'ICR', 'Ingeniería Civil': 'RIC', 'Ingeniería Industrial': 'IEC', 'Técnico en Computación e Informática': 'RCI',
    'Animación Digital': 'ARI', 'Ciencias de la Comunicación': 'AES', 'Gastronomía': 'ARE',
    'Obstetricia': 'SIR', 'Odontología': 'ISR', 'Farmacia y Bioquímica': 'ICS', 'Nutrición': 'SIC', 'Técnico en Enfermería': 'SRC',
    'Agronomía': 'RIE', 'Ingeniería de Minas': 'RIE', 'Ingeniería Química': 'IRC', 'Ingeniería Agroindustrial': 'RIE',
    'Relaciones Internacionales': 'ESA', 'Trabajo Social': 'SEA', 'Antropología': 'IAS',
    'Marketing': 'EAC', 'Turismo y Hotelería': 'ESA'
  };

  /* =========================================================
     IDIOMA: Español / Runasimi (quechua chanka)
     Traducción inicial: conviene revisarla con un hablante nativo.
     ========================================================= */
  const QU = {
    'nav.inicio': 'Qallariy', 'nav.test': 'Test', 'nav.carreras': 'Carrerakuna', 'nav.becas': 'Becakuna', 'nav.guia': 'Pusaq',
    'nav.resultados': 'Lluqsiyniykuna', 'nav.calendario': 'Fechakuna',
    'auth.h1a': 'Hamuq pachaykita', 'auth.h1b': 'kanchachiq carrerata tariy',
    'auth.p': '30 tapukuykunawan test, munasqaykikunata, atiyniykikunata tarinaykipaq.',
    'auth.hello': '¡Allinllachu kachkanki! 👋', 'auth.sub': 'Yaykuy test vocacionalniykita qatinaykipaq.',
    'auth.login': 'Yaykuy', 'auth.register': 'Musuq cuenta', 'auth.guest': 'Invitado hina yaykuy',
    'test.select': '· Qamman aswan rikchakuqta akllay', 'test.trust': 'Sunquykita uyariy', 'test.auto': 'Kikillanmanta qatiqman',
    'test.prev': 'Ñawpaq tapukuy', 'test.next': 'Qatiq tapukuy', 'test.finish': 'Lluqsiyniykunata qaway',
    'test.hint.idle': 'Qamman aswan rikchakuqta akllay', 'test.hint.ok': '¡Allinmi! Qatiqman riyta atinki', 'test.hint.adv': '¡Allinmi! Qatiqman pasachkanchik…',
    'test.hint.last': '¡Listoñam! Lluqsiyniykita qawachkanchik…', 'test.hint.warn': 'Ñawpaqta huk kaqta akllay',
    'test.counter': 'Tapukuy {i} / {n}', 'test.done': '% tukusqa', 'test.save': 'Waqaychay', 'test.map': 'Testpa mapan: 30 puriykuna',
    'test.listen': 'Uyariy', 'test.phase': 'Fase',
    'side.tip': '¡Mana manchakuspa! Manam kanchu allin utaq mana allin kutichiykuna.',
    'side.compass': 'Brújulayki', 'side.compass.sub': 'Sapa kutichiywan musuqyachikun.',
    'res.kicker': 'Perfil vocacionalniyki', 'res.map': 'Munasqaykikunapa mapan', 'res.pick': 'Aswan munasqayki carrerata akllay',
    'res.share': 'Waqaychay hinaspa willay', 'res.match': 'kaqllam',
    'lang.note': 'Runasimipi: test, menú, lluqsiykuna. Carrerakunapa willakuyninmi kastellano simipi kachkan.'
  };
  let lang = (function () { try { return localStorage.getItem('msmc_lang') === 'qu' ? 'qu' : 'es'; } catch (e) { return 'es'; } })();
  function t(key, es, vars) {
    let s = lang === 'qu' && QU[key] ? QU[key] : es;
    if (vars) Object.keys(vars).forEach((k) => { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }


  /* =========================================================
     ⚙️ CONFIGURACIÓN — NÚMEROS DE WHATSAPP
     Código de país (51 = Perú) + número, sin "+", espacios ni guiones.
     La Línea 1 es la principal: la usan todos los botones por defecto.
     ========================================================= */
  const CONFIG = {
    whatsappNumbers: [
      { number: '51963829376', label: 'Línea 1' },
      { number: '51916753676', label: 'Línea 2' }
    ],

    /* =========================================================
       ⚙️ REDES SOCIALES PARA CONTACTO
       Escribe tu NOMBRE DE USUARIO de cada red (o pega el enlace
       de tu perfil, también funciona).
         Facebook  → el nombre de tu página, ej.: misuenomicarrera
         Instagram → tu usuario sin @, ej.: misuenomicarrera
         TikTok    → tu usuario sin @, ej.: misuenomicarrera
       Si dejas una red vacía (''), ese botón no se muestra.
       ========================================================= */
    social: {
      facebook:  'florcithalh',
      instagram: 'florcithalh',
      tiktok:    'florcithalh'
    },

    /* =========================================================
       ⚙️ GOOGLE SHEETS — para recibir los resultados de tus
       estudiantes, las citas y usar el Panel del tutor.
       Pega aquí la URL de tu Apps Script (termina en /exec).
       Las instrucciones están al final de este archivo.
       Si lo dejas vacío (''), la página funciona igual, pero
       los datos solo quedan en el celular de cada estudiante.
       ========================================================= */
    sheetsUrl: '',

    /* =========================================================
       ⚙️ CITAS DE ORIENTACIÓN
       ========================================================= */
    citas: {
      horas: ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00', '18:00'],
      diasNoDisponibles: [0],          // 0 = domingo, 6 = sábado
      modalidades: ['Virtual (videollamada)', 'Por WhatsApp', 'Presencial']
    },

    /* =========================================================
       ⚙️ DIRECCIÓN PÚBLICA DE LA PÁGINA (para el código QR)
       Cuando la publiques (por ejemplo en Netlify), pega aquí el
       enlace, ej.: 'https://misuenomicarrera.netlify.app'
       ========================================================= */
    siteUrl: '',

    /* =========================================================
       ⚙️ FECHAS IMPORTANTES (calendario)
       Formato de fecha: 'AAAA-MM-DD'. Si aún no hay fecha, deja ''.
       tipo: 'admision' | 'beca' | 'feria' | 'otro'
       Las fechas que ya pasaron se ocultan solas.
       ========================================================= */
    calendario: [
      { fecha: '2026-11-22', tipo: 'beca', titulo: 'Beca 18-2027: examen nacional de preselección',
        detalle: 'Solo para quienes se inscribieron y cumplen los requisitos.', url: 'https://www.pronabec.gob.pe/beca-18/' },
      { fecha: '', tipo: 'admision', titulo: 'Admisión UNSCH 2027',
        detalle: 'Revisa el cronograma, las vacantes y los requisitos en la web oficial de admisión.', url: 'https://admision.unsch.edu.pe' },
      { fecha: '', tipo: 'feria', titulo: 'Feria vocacional en tu colegio',
        detalle: 'Escríbeme si quieres que lleve el test y la orientación a tu colegio.', url: '' },
      { fecha: '2026-10-25', tipo: 'admision', titulo: 'Examen de admisión UNMSM 2027-I (Medicina Humana)',
        detalle: 'Ciudad Universitaria, Lima.', url: 'https://www.unmsm.edu.pe' }
    ],

    /* =========================================================
       ⚙️ CUENTAS EN LA NUBE (opcional, con Firebase)
       Permite entrar desde cualquier celular y recuperar la
       contraseña por correo. Instrucciones al final del archivo.
       Mientras sea null, las cuentas se guardan en el navegador.
       ========================================================= */
    firebase: null
    /* Ejemplo:
    firebase: {
      apiKey: 'AIza...',
      authDomain: 'tu-proyecto.firebaseapp.com',
      projectId: 'tu-proyecto',
      appId: '1:123:web:abc'
    } */
  };

  // Cómo se abre el chat de cada red
  const SOCIAL_NETWORKS = {
    facebook: {
      label: 'Messenger', app: 'Facebook Messenger',
      chat: (u) => 'https://m.me/' + u,
      svg: '<path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V9c0-.6.4-1 1-1z"/>'
    },
    instagram: {
      label: 'Instagram', app: 'Instagram',
      chat: (u) => 'https://ig.me/m/' + u,
      svg: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3"/>'
    },
    tiktok: {
      // TikTok no permite abrir un chat directo con un enlace: se abre el perfil y desde ahí se pulsa "Mensaje".
      label: 'TikTok', app: 'TikTok', profileOnly: true,
      chat: (u) => 'https://www.tiktok.com/@' + u,
      svg: '<path d="M16.5 3c.4 2.3 1.9 3.8 4 4v3.2c-1.5 0-2.9-.4-4-1.1V15a6 6 0 1 1-6-6v3.3a2.7 2.7 0 1 0 2.7 2.7V3h3.3z"/>'
    }
  };

  const FILTER_LABELS = { tech: 'Tecnología', creative: 'Arte y diseño', health: 'Salud', nature: 'Ciencia y ambiente', social: 'Sociedad y leyes', business: 'Negocios' };

  const CAREERS = [
    { name: 'Ingeniería de Software', cat: 'tech', icon: 'code', years: '5 años',
      desc: 'Diseña, desarrolla y mantiene aplicaciones, sistemas y plataformas digitales que usan millones de personas.',
      skills: ['Lógica', 'Programación', 'Trabajo en equipo'],
      courses: ['Algoritmos y estructuras de datos', 'Bases de datos', 'Desarrollo web y móvil', 'Ingeniería de requisitos'],
      jobs: ['Empresas de tecnología', 'Bancos y fintech', 'Startups y trabajo remoto'] },
    { name: 'Ciencia de Datos e Inteligencia Artificial', cat: 'tech', icon: 'smart_toy', years: '5 años',
      desc: 'Analiza grandes volúmenes de datos y crea modelos que aprenden para ayudar a tomar mejores decisiones.',
      skills: ['Matemática', 'Estadística', 'Curiosidad'],
      courses: ['Estadística y probabilidad', 'Aprendizaje automático', 'Programación en Python', 'Visualización de datos'],
      jobs: ['Empresas tecnológicas', 'Salud e investigación', 'Retail y finanzas'] },
    { name: 'Ingeniería Mecatrónica', cat: 'tech', icon: 'precision_manufacturing', years: '5 años',
      desc: 'Integra mecánica, electrónica e informática para crear robots y sistemas automatizados.',
      skills: ['Física', 'Creatividad técnica', 'Resolución de problemas'],
      courses: ['Electrónica', 'Robótica', 'Control automático', 'Diseño mecánico'],
      jobs: ['Industria y manufactura', 'Minería y energía', 'Automatización'] },

    { name: 'Diseño Gráfico y UX', cat: 'creative', icon: 'design_services', years: '4 a 5 años',
      desc: 'Comunica ideas a través de imágenes, marcas, tipografía y experiencias digitales fáciles de usar.',
      skills: ['Creatividad', 'Sensibilidad visual', 'Comunicación'],
      courses: ['Teoría del color', 'Tipografía', 'Diseño UX/UI', 'Branding e identidad'],
      jobs: ['Agencias de publicidad', 'Estudios de diseño', 'Trabajo independiente'] },
    { name: 'Arquitectura', cat: 'creative', icon: 'architecture', years: '5 años',
      desc: 'Proyecta espacios y edificaciones funcionales, seguras y estéticas que mejoran la vida de las personas.',
      skills: ['Dibujo', 'Visión espacial', 'Sensibilidad social'],
      courses: ['Diseño arquitectónico', 'Urbanismo', 'Estructuras', 'Modelado 3D'],
      jobs: ['Estudios de arquitectura', 'Constructoras e inmobiliarias', 'Gobiernos locales'] },
    { name: 'Comunicación Audiovisual', cat: 'creative', icon: 'movie', years: '5 años',
      desc: 'Crea contenidos para cine, televisión, radio y plataformas digitales que informan y emocionan.',
      skills: ['Narrativa', 'Creatividad', 'Manejo de cámara'],
      courses: ['Guion', 'Fotografía', 'Edición y montaje', 'Producción audiovisual'],
      jobs: ['Productoras', 'Medios digitales', 'Marketing de contenidos'] },

    { name: 'Medicina Humana', cat: 'health', icon: 'stethoscope', years: '7 años',
      desc: 'Previene, diagnostica y trata enfermedades para cuidar la salud y la vida de las personas.',
      skills: ['Vocación de servicio', 'Constancia', 'Análisis'],
      courses: ['Anatomía', 'Fisiología', 'Farmacología', 'Internado clínico'],
      jobs: ['Hospitales y clínicas', 'Centros de salud', 'Investigación médica'] },
    { name: 'Psicología', cat: 'health', icon: 'psychology', years: '5 años',
      desc: 'Estudia la mente y el comportamiento humano para promover el bienestar emocional.',
      skills: ['Empatía', 'Escucha activa', 'Observación'],
      courses: ['Psicología del desarrollo', 'Evaluación psicológica', 'Neurociencias', 'Psicoterapia'],
      jobs: ['Consultorios y clínicas', 'Colegios', 'Recursos humanos'] },
    { name: 'Enfermería', cat: 'health', icon: 'medical_services', years: '5 años',
      desc: 'Brinda cuidado integral a pacientes y lidera acciones de prevención en la comunidad.',
      skills: ['Responsabilidad', 'Empatía', 'Trabajo bajo presión'],
      courses: ['Cuidados de enfermería', 'Salud pública', 'Farmacología', 'Prácticas hospitalarias'],
      jobs: ['Hospitales', 'Centros de salud', 'Salud comunitaria'] },

    { name: 'Ingeniería Ambiental', cat: 'nature', icon: 'eco', years: '5 años',
      desc: 'Protege los recursos naturales y diseña soluciones frente a la contaminación y el cambio climático.',
      skills: ['Pensamiento científico', 'Compromiso ambiental', 'Trabajo de campo'],
      courses: ['Química ambiental', 'Gestión de residuos', 'Evaluación de impacto ambiental', 'Tratamiento de aguas'],
      jobs: ['Consultoras ambientales', 'Minería y energía', 'Entidades públicas'] },
    { name: 'Medicina Veterinaria', cat: 'nature', icon: 'pets', years: '5 a 6 años',
      desc: 'Cuida la salud de los animales y contribuye a la seguridad alimentaria y la salud pública.',
      skills: ['Amor por los animales', 'Paciencia', 'Precisión'],
      courses: ['Anatomía animal', 'Zootecnia', 'Cirugía', 'Sanidad animal'],
      jobs: ['Clínicas veterinarias', 'Producción ganadera', 'Conservación de fauna'] },
    { name: 'Biología', cat: 'nature', icon: 'biotech', years: '5 años',
      desc: 'Investiga los seres vivos, desde las células hasta los ecosistemas, para entender y proteger la vida.',
      skills: ['Curiosidad', 'Método científico', 'Observación'],
      courses: ['Genética', 'Ecología', 'Microbiología', 'Biología molecular'],
      jobs: ['Laboratorios', 'Áreas naturales protegidas', 'Docencia e investigación'] },

    { name: 'Derecho', cat: 'social', icon: 'gavel', years: '6 años',
      desc: 'Defiende derechos, asesora a personas y empresas, y resuelve conflictos aplicando las leyes.',
      skills: ['Argumentación', 'Lectura crítica', 'Ética'],
      courses: ['Derecho constitucional', 'Derecho civil', 'Derecho penal', 'Litigación oral'],
      jobs: ['Estudios jurídicos', 'Poder Judicial y Fiscalía', 'Empresas'] },
    { name: 'Educación', cat: 'social', icon: 'school', years: '5 años',
      desc: 'Forma a niños, jóvenes y adultos, y diseña experiencias de aprendizaje que transforman vidas.',
      skills: ['Paciencia', 'Comunicación', 'Liderazgo'],
      courses: ['Didáctica', 'Psicología educativa', 'Evaluación del aprendizaje', 'Práctica docente'],
      jobs: ['Colegios', 'Institutos y academias', 'Proyectos educativos'] },
    { name: 'Ciencia Política', cat: 'social', icon: 'account_balance', years: '5 años',
      desc: 'Analiza el poder, las instituciones y las políticas públicas para mejorar la sociedad.',
      skills: ['Pensamiento crítico', 'Debate', 'Análisis social'],
      courses: ['Teoría política', 'Políticas públicas', 'Relaciones internacionales', 'Métodos de investigación'],
      jobs: ['Instituciones públicas', 'ONG y organismos internacionales', 'Consultoría'] },

    { name: 'Administración de Empresas', cat: 'business', icon: 'business_center', years: '5 años',
      desc: 'Planifica, organiza y dirige organizaciones para que crezcan de forma sostenible.',
      skills: ['Liderazgo', 'Organización', 'Toma de decisiones'],
      courses: ['Gestión estratégica', 'Finanzas', 'Marketing', 'Gestión del talento'],
      jobs: ['Empresas privadas', 'Emprendimiento propio', 'Sector público'] },
    { name: 'Economía', cat: 'business', icon: 'monitoring', years: '5 años',
      desc: 'Estudia cómo se producen y distribuyen los recursos para orientar decisiones de empresas y países.',
      skills: ['Matemática', 'Análisis', 'Visión global'],
      courses: ['Microeconomía', 'Macroeconomía', 'Econometría', 'Economía del desarrollo'],
      jobs: ['Bancos y financieras', 'Entidades públicas', 'Consultoras'] },
    { name: 'Contabilidad y Finanzas', cat: 'business', icon: 'calculate', years: '5 años',
      desc: 'Registra, analiza y controla la información financiera para que las organizaciones decidan bien.',
      skills: ['Precisión', 'Orden', 'Ética'],
      courses: ['Contabilidad financiera', 'Tributación', 'Auditoría', 'Finanzas corporativas'],
      jobs: ['Empresas', 'Estudios contables', 'Auditoría'] },

    /* ---- Más carreras ---- */
    { name: 'Ingeniería de Sistemas', cat: 'tech', icon: 'dns', years: '5 años',
      desc: 'Diseña y gestiona sistemas informáticos, redes y soluciones tecnológicas para empresas e instituciones.',
      skills: ['Lógica', 'Organización', 'Resolución de problemas'],
      courses: ['Programación', 'Redes y comunicaciones', 'Sistemas de información', 'Gestión de proyectos TI'],
      jobs: ['Áreas de TI de empresas', 'Entidades públicas', 'Consultoras tecnológicas'] },
    { name: 'Ingeniería Civil', cat: 'tech', icon: 'foundation', years: '5 años',
      desc: 'Diseña y construye carreteras, puentes, edificios, represas y obras que conectan y desarrollan a las ciudades.',
      skills: ['Matemática', 'Física', 'Liderazgo en obra'],
      courses: ['Resistencia de materiales', 'Concreto armado', 'Hidráulica', 'Topografía'],
      jobs: ['Constructoras', 'Municipios y gobiernos regionales', 'Supervisión de obras'] },
    { name: 'Ingeniería Industrial', cat: 'tech', icon: 'factory', years: '5 años',
      desc: 'Mejora procesos de producción y servicios para que las empresas sean más eficientes, seguras y competitivas.',
      skills: ['Análisis', 'Organización', 'Liderazgo'],
      courses: ['Investigación de operaciones', 'Gestión de la producción', 'Logística', 'Seguridad industrial'],
      jobs: ['Industrias y fábricas', 'Logística y retail', 'Consultoría de procesos'] },
    { name: 'Técnico en Computación e Informática', cat: 'tech', icon: 'computer', years: '3 años', level: 'tecnica',
      desc: 'Carrera técnica para dar soporte, mantener equipos, crear programas sencillos y administrar redes.',
      skills: ['Práctica', 'Curiosidad tecnológica', 'Atención al detalle'],
      courses: ['Ensamblaje y mantenimiento', 'Ofimática', 'Programación básica', 'Redes'],
      jobs: ['Soporte técnico', 'Cabinas y centros de cómputo', 'Emprendimiento propio'] },

    { name: 'Animación Digital', cat: 'creative', icon: 'animation', years: '4 a 5 años',
      desc: 'Da vida a personajes y mundos en 2D y 3D para películas, videojuegos, publicidad y redes sociales.',
      skills: ['Dibujo', 'Paciencia', 'Narrativa visual'],
      courses: ['Dibujo y anatomía', 'Animación 2D', 'Modelado y animación 3D', 'Postproducción'],
      jobs: ['Estudios de animación', 'Videojuegos', 'Agencias y trabajo independiente'] },
    { name: 'Ciencias de la Comunicación', cat: 'creative', icon: 'campaign', years: '5 años',
      desc: 'Forma periodistas, comunicadores y creadores de contenido para medios, instituciones y plataformas digitales.',
      skills: ['Redacción', 'Expresión oral', 'Creatividad'],
      courses: ['Periodismo', 'Comunicación digital', 'Producción radial y audiovisual', 'Comunicación organizacional'],
      jobs: ['Medios de comunicación', 'Oficinas de imagen institucional', 'Redes sociales y marketing'] },
    { name: 'Gastronomía', cat: 'creative', icon: 'restaurant', years: '3 a 5 años',
      desc: 'Combina arte, técnica e identidad cultural para crear platos y dirigir cocinas y emprendimientos gastronómicos.',
      skills: ['Creatividad', 'Disciplina', 'Trabajo en equipo'],
      courses: ['Técnicas culinarias', 'Cocina peruana', 'Pastelería', 'Gestión de restaurantes'],
      jobs: ['Restaurantes y hoteles', 'Emprendimiento propio', 'Industria alimentaria'] },

    { name: 'Obstetricia', cat: 'health', icon: 'pregnant_woman', years: '5 años',
      desc: 'Acompaña a la mujer y a la familia durante el embarazo, el parto y la salud sexual y reproductiva.',
      skills: ['Empatía', 'Responsabilidad', 'Calma ante emergencias'],
      courses: ['Anatomía y fisiología', 'Atención del parto', 'Salud sexual y reproductiva', 'Prácticas hospitalarias'],
      jobs: ['Hospitales y centros de salud', 'Programas de salud materna', 'Consultorios'] },
    { name: 'Odontología', cat: 'health', icon: 'dentistry', years: '5 a 6 años',
      desc: 'Previene y trata las enfermedades de la boca y los dientes para mejorar la salud y la sonrisa de las personas.',
      skills: ['Precisión manual', 'Paciencia', 'Trato amable'],
      courses: ['Anatomía dental', 'Operatoria dental', 'Ortodoncia', 'Clínica integral'],
      jobs: ['Consultorio propio', 'Clínicas', 'Centros de salud'] },
    { name: 'Farmacia y Bioquímica', cat: 'health', icon: 'medication', years: '5 años',
      desc: 'Estudia los medicamentos: cómo se elaboran, cómo actúan y cómo usarlos de forma segura.',
      skills: ['Química', 'Rigurosidad', 'Ética'],
      courses: ['Química orgánica', 'Farmacología', 'Tecnología farmacéutica', 'Análisis clínicos'],
      jobs: ['Farmacias y boticas', 'Laboratorios', 'Hospitales'] },
    { name: 'Nutrición', cat: 'health', icon: 'nutrition', years: '5 años',
      desc: 'Promueve la buena alimentación para prevenir enfermedades y mejorar la calidad de vida.',
      skills: ['Empatía', 'Ciencia', 'Comunicación'],
      courses: ['Bioquímica', 'Nutrición clínica', 'Nutrición pública', 'Tecnología de alimentos'],
      jobs: ['Hospitales y clínicas', 'Programas sociales', 'Deporte y empresas de alimentos'] },
    { name: 'Técnico en Enfermería', cat: 'health', icon: 'health_and_safety', years: '3 años', level: 'tecnica',
      desc: 'Carrera técnica para apoyar el cuidado de pacientes junto al equipo de salud.',
      skills: ['Vocación de servicio', 'Responsabilidad', 'Trabajo en equipo'],
      courses: ['Primeros auxilios', 'Técnicas de enfermería', 'Salud comunitaria', 'Prácticas'],
      jobs: ['Hospitales', 'Postas y centros de salud', 'Clínicas'] },

    { name: 'Agronomía', cat: 'nature', icon: 'agriculture', years: '5 años',
      desc: 'Mejora la producción de cultivos de forma sostenible para alimentar al país y cuidar los suelos.',
      skills: ['Trabajo de campo', 'Biología', 'Amor por la tierra'],
      courses: ['Fitotecnia', 'Suelos y fertilidad', 'Sanidad vegetal', 'Riego'],
      jobs: ['Agroexportadoras', 'Proyectos agrarios', 'Emprendimiento rural'] },
    { name: 'Ingeniería de Minas', cat: 'nature', icon: 'landscape', years: '5 años',
      desc: 'Planifica y dirige la extracción responsable de minerales, cuidando la seguridad y el ambiente.',
      skills: ['Matemática', 'Resistencia', 'Liderazgo'],
      courses: ['Geología', 'Perforación y voladura', 'Seguridad minera', 'Planeamiento de minas'],
      jobs: ['Empresas mineras', 'Consultoras', 'Fiscalización del Estado'] },
    { name: 'Ingeniería Química', cat: 'nature', icon: 'science', years: '5 años',
      desc: 'Transforma materias primas en productos útiles como alimentos, medicinas, combustibles y materiales.',
      skills: ['Química', 'Matemática', 'Análisis'],
      courses: ['Fisicoquímica', 'Operaciones unitarias', 'Procesos industriales', 'Control de calidad'],
      jobs: ['Industria alimentaria y minera', 'Laboratorios', 'Plantas de producción'] },
    { name: 'Ingeniería Agroindustrial', cat: 'nature', icon: 'inventory_2', years: '5 años',
      desc: 'Convierte productos del campo en alimentos y productos con valor agregado para el mercado.',
      skills: ['Química', 'Innovación', 'Organización'],
      courses: ['Tecnología de alimentos', 'Procesos agroindustriales', 'Control de calidad', 'Gestión de plantas'],
      jobs: ['Agroindustrias', 'Exportadoras', 'Emprendimiento propio'] },

    { name: 'Relaciones Internacionales', cat: 'social', icon: 'public', years: '5 años',
      desc: 'Analiza la relación entre países y organismos internacionales en política, comercio y cooperación.',
      skills: ['Idiomas', 'Negociación', 'Visión global'],
      courses: ['Política internacional', 'Derecho internacional', 'Comercio exterior', 'Diplomacia'],
      jobs: ['Cancillería y embajadas', 'Organismos internacionales', 'Empresas exportadoras'] },
    { name: 'Trabajo Social', cat: 'social', icon: 'volunteer_activism', years: '5 años',
      desc: 'Acompaña a personas, familias y comunidades para mejorar su bienestar y defender sus derechos.',
      skills: ['Empatía', 'Compromiso social', 'Comunicación'],
      courses: ['Intervención familiar', 'Políticas sociales', 'Desarrollo comunitario', 'Gestión de proyectos sociales'],
      jobs: ['Municipios y programas sociales', 'Hospitales y colegios', 'ONG'] },
    { name: 'Antropología', cat: 'social', icon: 'diversity_3', years: '5 años',
      desc: 'Estudia las culturas, costumbres e identidades de los pueblos para comprender la diversidad humana.',
      skills: ['Observación', 'Escucha', 'Curiosidad cultural'],
      courses: ['Antropología social', 'Etnografía', 'Cultura andina y amazónica', 'Métodos de investigación'],
      jobs: ['Proyectos de desarrollo', 'Museos y cultura', 'Investigación y ONG'] },

    { name: 'Marketing', cat: 'business', icon: 'ads_click', years: '4 a 5 años',
      desc: 'Crea estrategias para que las marcas conecten con las personas y sus productos se vendan.',
      skills: ['Creatividad', 'Análisis', 'Comunicación'],
      courses: ['Investigación de mercados', 'Marketing digital', 'Comportamiento del consumidor', 'Branding'],
      jobs: ['Empresas y marcas', 'Agencias digitales', 'Emprendimiento'] },
    { name: 'Turismo y Hotelería', cat: 'business', icon: 'luggage', years: '4 a 5 años',
      desc: 'Gestiona hoteles, viajes y experiencias turísticas que muestran la riqueza cultural del Perú.',
      skills: ['Idiomas', 'Trato con personas', 'Organización'],
      courses: ['Gestión hotelera', 'Patrimonio turístico', 'Guiado turístico', 'Inglés'],
      jobs: ['Hoteles y agencias de viaje', 'Operadores turísticos', 'Emprendimiento propio'] }
  ];

  /* =========================================================
     UNIVERSIDADES (referencial — verifica siempre en la web oficial)
     "offers" = nombres exactos de las carreras de arriba.
     ========================================================= */
  const UNIVERSITIES = [
    { name: 'Universidad Nacional de San Cristóbal de Huamanga (UNSCH)', short: 'UNSCH', city: 'Ayacucho', type: 'Pública', url: 'https://www.unsch.edu.pe',
      offers: ['Agronomía', 'Educación', 'Administración de Empresas', 'Contabilidad y Finanzas', 'Economía', 'Antropología', 'Trabajo Social', 'Derecho',
        'Enfermería', 'Ingeniería de Minas', 'Ingeniería Civil', 'Ingeniería Química', 'Obstetricia', 'Farmacia y Bioquímica', 'Ingeniería Agroindustrial',
        'Ciencias de la Comunicación', 'Medicina Veterinaria', 'Ingeniería de Sistemas', 'Medicina Humana'] },
    { name: 'Universidad Nacional Mayor de San Marcos (UNMSM)', short: 'San Marcos', city: 'Lima', type: 'Pública', url: 'https://www.unmsm.edu.pe',
      offers: ['Medicina Humana', 'Enfermería', 'Obstetricia', 'Nutrición', 'Odontología', 'Farmacia y Bioquímica', 'Psicología', 'Derecho', 'Educación',
        'Economía', 'Administración de Empresas', 'Contabilidad y Finanzas', 'Ingeniería de Software', 'Ingeniería de Sistemas', 'Ingeniería Civil',
        'Ingeniería de Minas', 'Ingeniería Química', 'Ingeniería Industrial', 'Ingeniería Ambiental', 'Biología', 'Medicina Veterinaria', 'Ciencia Política',
        'Ciencias de la Comunicación', 'Trabajo Social', 'Antropología', 'Turismo y Hotelería'] },
    { name: 'Universidad Nacional de Ingeniería (UNI)', short: 'UNI', city: 'Lima', type: 'Pública', url: 'https://www.uni.edu.pe',
      offers: ['Ingeniería Civil', 'Ingeniería de Minas', 'Ingeniería Química', 'Ingeniería de Sistemas', 'Ingeniería Mecatrónica', 'Ingeniería Industrial',
        'Ingeniería Ambiental', 'Arquitectura', 'Ingeniería de Software', 'Ciencia de Datos e Inteligencia Artificial'] },
    { name: 'Universidad Nacional Agraria La Molina (UNALM)', short: 'La Molina', city: 'Lima', type: 'Pública', url: 'https://www.lamolina.edu.pe',
      offers: ['Agronomía', 'Ingeniería Ambiental', 'Biología', 'Economía', 'Ingeniería Agroindustrial'] },
    { name: 'Pontificia Universidad Católica del Perú (PUCP)', short: 'PUCP', city: 'Lima', type: 'Privada', url: 'https://www.pucp.edu.pe',
      offers: ['Derecho', 'Psicología', 'Arquitectura', 'Comunicación Audiovisual', 'Diseño Gráfico y UX', 'Economía', 'Ingeniería de Software',
        'Ingeniería Mecatrónica', 'Ingeniería Civil', 'Ingeniería de Minas', 'Ingeniería Industrial', 'Ingeniería Ambiental', 'Ciencia Política',
        'Educación', 'Contabilidad y Finanzas', 'Antropología', 'Gastronomía'] },
    { name: 'Universidad Peruana Cayetano Heredia (UPCH)', short: 'Cayetano Heredia', city: 'Lima', type: 'Privada', url: 'https://www.cayetano.edu.pe',
      offers: ['Medicina Humana', 'Enfermería', 'Odontología', 'Psicología', 'Biología', 'Medicina Veterinaria', 'Farmacia y Bioquímica', 'Nutrición'] }
  ];

  // Reto de 2 minutos por área (se puede personalizar por carrera en CHALLENGES)
  const AREA_CHALLENGES = {
    tech: 'Piensa en una app que usas a diario. Escribe 3 cosas que mejorarías y cómo funcionaría cada una. ¿Te entusiasmó imaginarlo?',
    creative: 'Toma 3 fotos con tu celular de un mismo objeto desde ángulos distintos y elige la que mejor "cuenta una historia". ¿Disfrutaste el proceso?',
    health: 'Pregunta a alguien de tu familia cómo se siente hoy y escúchale 2 minutos sin interrumpir. ¿Te nació ayudar o aconsejar?',
    nature: 'Sal a observar una planta, un insecto o el cielo durante 2 minutos y anota 3 preguntas que te surjan. ¿Te dio curiosidad investigar?',
    social: 'Elige un problema de tu barrio o colegio y escribe en 3 líneas cómo convencerías a la gente de solucionarlo. ¿Te gustó argumentar?',
    business: 'Imagina que vendes un producto en tu colegio: ¿qué venderías, a qué precio y cómo lo promocionarías? ¿Te emocionó la idea?'
  };
  const CHALLENGES = {
    'Medicina Humana': 'Busca cómo funciona el corazón en un video corto y explícaselo a alguien con tus palabras. ¿Te fascinó entenderlo?',
    'Psicología': 'Recuerda una vez que alguien te pidió consejo. ¿Qué hiciste para que se sintiera mejor? Escribe 3 cosas que harías distinto.',
    'Derecho': 'Lee una noticia de hoy y escribe un argumento a favor y otro en contra. ¿Disfrutaste defender ambos lados?',
    'Arquitectura': 'Dibuja en una hoja el plano de tu casa ideal visto desde arriba. ¿Se te pasó el tiempo volando?',
    'Ingeniería de Software': 'Escribe los pasos exactos para preparar tu desayuno, como si se los explicaras a un robot. ¿Te divirtió ser tan preciso/a?',
    'Ingeniería Civil': 'Construye un puente con 10 hojas de papel entre dos libros y prueba cuántas monedas soporta. ¿Quisiste mejorarlo?',
    'Gastronomía': 'Prepara algo sencillo con lo que haya en tu cocina y preséntalo como en un restaurante. ¿Lo disfrutaste?',
    'Educación': 'Explica a un niño o niña algo que sepas bien (un juego, una suma, una palabra en quechua). ¿Te gustó enseñar?',
    'Medicina Veterinaria': 'Observa a una mascota o animal 2 minutos y anota cómo sabes si está tranquilo o estresado.',
    'Marketing': 'Elige tu marca favorita y escribe por qué te atrae: colores, mensaje, redes. ¿Te dio ideas para crear la tuya?'
  };

  // Historias ilustrativas (nombres de ejemplo). Reemplázalas por testimonios reales con permiso.
  const TESTIMONIALS = [
    { name: 'Valeria', role: 'Hoy estudia Psicología', cat: 'health', text: 'Pensaba que tenía que estudiar lo mismo que mis padres. El test me ayudó a ver que lo mío era escuchar y acompañar a otras personas.' },
    { name: 'Diego', role: 'Hoy estudia Ing. Mecatrónica', cat: 'tech', text: 'Siempre me gustó desarmar cosas y entender cómo funcionan. Descubrí que eso tenía nombre y una carrera completa.' },
    { name: 'Camila', role: 'Hoy estudia Arquitectura', cat: 'creative', text: 'Dudaba entre Arte y Arquitectura. Comparar los cursos y el campo laboral de cada una me dio la claridad que necesitaba.' },
    { name: 'Renzo', role: 'Hoy estudia Economía', cat: 'business', text: 'Me gustaban los números, pero también ayudar a mi comunidad. Entendí que la Economía une las dos cosas.' },
    { name: 'Lucía', role: 'Madre de familia', cat: 'social', text: 'La guía para padres me enseñó a acompañar a mi hija sin presionarla. Ahora conversamos con más confianza sobre su futuro.' },
    { name: 'Mateo', role: 'Hoy estudia Ing. Ambiental', cat: 'nature', text: 'Hablar mis resultados con una orientadora me ayudó a unir mi amor por la naturaleza con una carrera con futuro.' }
  ];

  /* ---------- Utilidades ---------- */
  const $ = (id) => document.getElementById(id);
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* almacenamiento no disponible */ }
      if (typeof onStoreChange === 'function') onStoreChange(key);
    },
    remove(key) { try { localStorage.removeItem(key); } catch (e) { /* noop */ } }
  };
  const session = {
    get() {
      try {
        const raw = localStorage.getItem(KEYS.session) || sessionStorage.getItem(KEYS.session);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },
    set(user, remember) {
      try {
        this.clear();
        (remember ? localStorage : sessionStorage).setItem(KEYS.session, JSON.stringify(user));
      } catch (e) { /* noop */ }
    },
    clear() {
      try { localStorage.removeItem(KEYS.session); sessionStorage.removeItem(KEYS.session); } catch (e) { /* noop */ }
    }
  };
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  async function hashPassword(text) {
    try {
      if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) { /* se usa el respaldo */ }
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    return 'x' + (h >>> 0).toString(16);
  }

  let toastTimer;
  function toast(message, icon) {
    const t = $('toast');
    t.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true"></span><span></span>';
    t.firstChild.textContent = icon || 'info';
    t.lastChild.textContent = message;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3400);
  }

  /* =========================================================
     LOGIN / REGISTRO
     ========================================================= */
  let currentUser = null;

  function setFieldError(input, message) {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.toggle('invalid', !!message);
    field.classList.remove('valid');
    const err = field.querySelector('.field-error');
    if (err) err.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
  function clearErrors(form) {
    form.querySelectorAll('input').forEach((i) => setFieldError(i, ''));
    form.querySelectorAll('.field').forEach((f) => f.classList.remove('valid'));
  }
  function showAlert(message, type) {
    const a = $('auth-alert');
    if (!message) { a.hidden = true; return; }
    a.className = 'auth-alert' + (type === 'success' ? ' success' : '');
    a.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true"></span><span></span>';
    a.firstChild.textContent = type === 'success' ? 'check_circle' : 'error';
    a.lastChild.textContent = message;
    a.hidden = false;
  }
  function setLoading(button, loading) {
    if (loading) {
      button.dataset.original = button.innerHTML;
      button.innerHTML = '<span class="spinner" aria-hidden="true"></span> Un momento...';
      button.disabled = true;
    } else if (button.dataset.original) {
      button.innerHTML = button.dataset.original;
      button.disabled = false;
    }
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function switchTab(mode) {
    const isLogin = mode === 'login';
    $('tab-login').setAttribute('aria-selected', String(isLogin));
    $('tab-register').setAttribute('aria-selected', String(!isLogin));
    $('login-form').hidden = !isLogin;
    $('register-form').hidden = isLogin;
    $('auth-title').textContent = isLogin ? t('auth.hello', '¡Hola de nuevo! 👋') : (lang === 'qu' ? 'Musuq cuentaykita ruray ✨' : 'Crea tu cuenta ✨');
    $('auth-subtitle').textContent = isLogin ? t('auth.sub', 'Ingresa para continuar tu test vocacional.') : (lang === 'qu' ? 'Mana qullqiyuqmi, huk minutollapi.' : 'Es gratis y solo toma un minuto.');
    showAlert('');
    const first = (isLogin ? $('login-email') : $('reg-name'));
    if (first) first.focus();
  }

  function passwordStrength(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length < 6) score = Math.min(score, 1);
    return Math.max(score, 1);
  }
  const STRENGTH_TEXT = ['Usa letras, números y un símbolo', 'Débil', 'Aceptable', 'Buena', '¡Muy segura!'];

  async function handleLogin(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailEl = $('login-email');
    const passEl = $('login-password');
    clearErrors(form);
    showAlert('');

    const email = emailEl.value.trim().toLowerCase();
    const pass = passEl.value;
    let ok = true;
    if (!EMAIL_RE.test(email)) { setFieldError(emailEl, 'Escribe un correo válido.'); ok = false; }
    if (!pass) { setFieldError(passEl, 'Escribe tu contraseña.'); ok = false; }
    if (!ok) { form.querySelector('.invalid input').focus(); return; }

    const btn = form.querySelector('button[type="submit"]');
    setLoading(btn, true);
    if (cloud.enabled) {
      try {
        const cred = await cloud.auth.signInWithEmailAndPassword(email, pass);
        const profile = await cloudPull(cred.user, email);
        setLoading(btn, false);
        const u = { name: profile.name || cred.user.displayName || email.split('@')[0], email: email, cloud: true };
        session.set(u, $('remember-me').checked);
        form.reset(); $('remember-me').checked = true;
        enterApp(u, '¡Bienvenido/a de nuevo, ' + u.name + '!');
      } catch (err) {
        setLoading(btn, false);
        showAlert(cloudError(err));
      }
      return;
    }
    await wait(500);
    const users = store.get(KEYS.users, {});
    const user = users[email];
    if (!user) {
      setLoading(btn, false);
      showAlert('No encontramos una cuenta con ese correo. Pulsa “Crear cuenta” para registrarte.');
      return;
    }
    if (user.pass !== await hashPassword(pass)) {
      setLoading(btn, false);
      setFieldError(passEl, 'La contraseña no es correcta.');
      passEl.focus();
      return;
    }
    setLoading(btn, false);
    const sessionUser = { name: user.name, email: user.email };
    session.set(sessionUser, $('remember-me').checked);
    form.reset();
    $('remember-me').checked = true;
    enterApp(sessionUser, '¡Bienvenido/a de nuevo, ' + user.name + '!');
  }

  async function handleRegister(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const nameEl = $('reg-name'), emailEl = $('reg-email'), passEl = $('reg-password'), confEl = $('reg-confirm'), termsEl = $('reg-terms');
    clearErrors(form);
    showAlert('');

    const name = nameEl.value.trim().replace(/\s+/g, ' ');
    const email = emailEl.value.trim().toLowerCase();
    const pass = passEl.value;
    const users = store.get(KEYS.users, {});
    let ok = true;
    if (name.length < 2) { setFieldError(nameEl, 'Escribe tu nombre (mínimo 2 letras).'); ok = false; }
    if (!EMAIL_RE.test(email)) { setFieldError(emailEl, 'Escribe un correo válido.'); ok = false; }
    else if (!cloud.enabled && users[email]) { setFieldError(emailEl, 'Ya existe una cuenta con este correo. Inicia sesión.'); ok = false; }
    if (pass.length < 6) { setFieldError(passEl, 'La contraseña debe tener al menos 6 caracteres.'); ok = false; }
    if (confEl.value !== pass || !confEl.value) { setFieldError(confEl, 'Las contraseñas no coinciden.'); ok = false; }
    if (!termsEl.checked) { setFieldError(termsEl, 'Debes aceptar la política de privacidad para continuar.'); ok = false; }
    if (!ok) { const bad = form.querySelector('.invalid input'); if (bad) bad.focus(); return; }

    const btn = form.querySelector('button[type="submit"]');
    setLoading(btn, true);
    const schoolCodeCloud = $('reg-school').value.trim().toUpperCase().slice(0, 30);
    if (cloud.enabled) {
      try {
        const cred = await cloud.auth.createUserWithEmailAndPassword(email, pass);
        try { await cred.user.updateProfile({ displayName: name }); } catch (e2) { /* noop */ }
        await cloud.db.collection('usuarios').doc(cred.user.uid).set({ name: name, email: email, created: Date.now(), data: {} }, { merge: true });
        cloud.uid = cred.user.uid;
        if (schoolCodeCloud) store.set('msmc_school_' + email, schoolCodeCloud);
        setLoading(btn, false);
        form.reset(); updateStrength();
        const u = { name: name, email: email, cloud: true };
        session.set(u, true);
        enterApp(u, '¡Cuenta creada! Bienvenido/a, ' + name + ' 🎉');
      } catch (err) {
        setLoading(btn, false);
        if (err && err.code === 'auth/email-already-in-use') setFieldError(emailEl, 'Ya existe una cuenta con este correo. Inicia sesión.');
        else showAlert(cloudError(err));
      }
      return;
    }
    users[email] = { name: name, email: email, pass: await hashPassword(pass), created: Date.now() };
    store.set(KEYS.users, users);
    const schoolCode = $('reg-school').value.trim().toUpperCase().slice(0, 30);
    if (schoolCode) store.set('msmc_school_' + email, schoolCode);
    await wait(600);
    setLoading(btn, false);
    form.reset();
    updateStrength();
    const sessionUser = { name: name, email: email };
    session.set(sessionUser, true);
    enterApp(sessionUser, '¡Cuenta creada! Bienvenido/a, ' + name + ' 🎉');
  }

  function updateStrength() {
    const pw = $('reg-password').value;
    const level = passwordStrength(pw);
    $('strength').dataset.level = String(level);
    $('strength-label').textContent = STRENGTH_TEXT[level];
  }

  function initAuth() {
    $('tab-login').addEventListener('click', () => switchTab('login'));
    $('tab-register').addEventListener('click', () => switchTab('register'));
    $('login-form').addEventListener('submit', handleLogin);
    $('register-form').addEventListener('submit', handleRegister);
    $('reg-password').addEventListener('input', updateStrength);

    // Validación en vivo al salir de cada campo
    ['login-email', 'reg-email'].forEach((id) => {
      $(id).addEventListener('blur', (e) => {
        const v = e.target.value.trim();
        if (v && !EMAIL_RE.test(v)) setFieldError(e.target, 'Escribe un correo válido.');
        else if (v) { setFieldError(e.target, ''); e.target.closest('.field').classList.add('valid'); }
      });
    });
    $('reg-confirm').addEventListener('input', (e) => {
      const match = e.target.value && e.target.value === $('reg-password').value;
      e.target.closest('.field').classList.toggle('valid', !!match);
      if (match) setFieldError(e.target, '');
      if (match) e.target.closest('.field').classList.add('valid');
    });
    document.querySelectorAll('#login-form input, #register-form input').forEach((input) => {
      input.addEventListener('input', () => {
        if (input.closest('.field') && input.closest('.field').classList.contains('invalid')) setFieldError(input, '');
      });
    });

    // Mostrar / ocultar contraseña
    document.querySelectorAll('.toggle-pass').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = $(btn.dataset.target);
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.firstElementChild.textContent = show ? 'visibility_off' : 'visibility';
        btn.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
      });
    });

    $('forgot-btn').addEventListener('click', async () => {
      if (!cloud.enabled) {
        toast('Recuperar contraseña por correo requiere activar las cuentas en la nube. Escríbeme por WhatsApp y te ayudo.', 'mail');
        return;
      }
      const emailEl = $('login-email');
      const email = emailEl.value.trim().toLowerCase();
      if (!EMAIL_RE.test(email)) { setFieldError(emailEl, 'Escribe tu correo y vuelve a tocar "¿Olvidaste tu contraseña?".'); emailEl.focus(); return; }
      try {
        await cloud.auth.sendPasswordResetEmail(email);
        showAlert('Te enviamos un correo a ' + email + ' para crear una nueva contraseña. Revisa también la carpeta de spam.', 'success');
      } catch (err) { showAlert(cloudError(err)); }
    });

    $('guest-btn').addEventListener('click', () => {
      const guest = { name: 'Invitado', email: 'invitado', guest: true };
      session.set(guest, false);
      enterApp(guest, 'Entraste como invitado. Crea una cuenta para guardar tu progreso en este equipo.');
    });
  }

  function enterApp(user, message) {
    currentUser = user;
    $('auth-screen').hidden = true;
    $('app').hidden = false;
    $('user-name').textContent = user.name;
    $('user-avatar').textContent = (user.name || '?').charAt(0).toUpperCase();
    loadProgress();
    loadChoice();
    renderQuestion(false);
    lastRecommended = undefined;
    refreshRecommendations();
    renderChosen();
    renderSchoolChip();
    renderPlan();
    window.scrollTo(0, 0);
    updateActiveNav();
    if (message) toast(message, 'waving_hand');
  }

  function logout() {
    saveProgress();
    cloudPushNow();
    if (cloud.enabled) { try { cloud.auth.signOut(); } catch (e) { /* noop */ } cloud.uid = null; }
    session.clear();
    currentUser = null;
    chosenCareer = null;
    clearTimeout(advanceTimer);
    closeModal(true);
    toggleMenu(false);
    $('app').hidden = true;
    $('auth-screen').hidden = false;
    switchTab('login');
    window.scrollTo(0, 0);
    toast('Cerraste sesión. ¡Tu progreso quedó guardado!', 'logout');
  }

  /* =========================================================
     TEST VOCACIONAL
     ========================================================= */
  let state = freshState();
  let autoAdvance = store.get('msmc_auto_advance', true) !== false;
  let advanceTimer;

  const isAnswered = (a) => a !== null && a !== undefined;
  function freshState() { return { v: 2, current: 0, answers: new Array(TOTAL).fill(null), completed: false }; }
  function progressKey() { return 'msmc_progress_' + (currentUser ? currentUser.email : 'invitado'); }
  function saveProgress() { if (currentUser) store.set(progressKey(), state); }
  function loadProgress() {
    const saved = store.get(progressKey(), null);
    // v: 2 = test RIASEC. Un progreso del test anterior se descarta.
    if (saved && saved.v === 2 && Array.isArray(saved.answers) && saved.answers.length === TOTAL) {
      state = {
        v: 2,
        current: Math.min(Math.max(0, Number(saved.current) || 0), TOTAL - 1),
        answers: saved.answers.map((a) => ([0, 1, 2, 3].indexOf(a) !== -1 ? a : null)),
        completed: !!saved.completed
      };
    } else {
      state = freshState();
    }
  }

  const answeredCount = () => state.answers.filter(isAnswered).length;
  const firstUnanswered = () => { const i = state.answers.findIndex((a) => !isAnswered(a)); return i === -1 ? TOTAL : i; };

  function renderQuestion(animate) {
    clearTimeout(advanceTimer);
    stopSpeaking();
    const i = state.current;
    const q = QUESTIONS[i];
    const block = BLOCKS[Math.floor(i / PER_BLOCK)];

    $('q-eyebrow').textContent = lang === 'qu' ? block.qu : block.es;
    $('question-title').innerHTML = '<small class="q-lead"></small><span class="q-text"></span>';
    $('question-title').querySelector('.q-lead').textContent = lang === 'qu' ? block.leadQu : block.lead;
    const qt = lang === 'qu' ? q.qu : q.es;
    $('question-title').querySelector('.q-text').textContent = qt.charAt(0).toUpperCase() + qt.slice(1);
    $('q-description').textContent = lang === 'qu'
      ? 'Ama allin kutichiytachu maskay: imaynam kanki chayta kutichiy.'
      : 'No hay respuestas buenas ni malas: responde según cómo eres tú.';

    const card = $('prompt-card');
    if (animate) { card.classList.remove('animate'); void card.offsetWidth; card.classList.add('animate'); }

    const grid = $('answers-grid');
    grid.classList.remove('advancing');
    grid.querySelectorAll('.answer-card').forEach((n) => n.remove());
    LIKERT.forEach((opt, k) => {
      const label = document.createElement('label');
      label.className = 'answer-card likert-card likert-' + opt.value;
      label.style.animationDelay = (k * 35) + 'ms';
      label.innerHTML =
        '<input type="radio" name="likert" value="' + opt.value + '" aria-keyshortcuts="' + opt.key + '">' +
        '<span class="likert-emoji" aria-hidden="true">' + opt.emoji + '</span>' +
        '<span class="likert-text"></span>' +
        '<span class="answer-key" aria-hidden="true">' + opt.key + '</span>';
      label.querySelector('.likert-text').textContent = lang === 'qu' ? opt.qu : opt.es;
      const input = label.querySelector('input');
      if (state.answers[i] === opt.value) { input.checked = true; label.classList.add('selected'); label.style.animation = 'none'; }
      grid.appendChild(label);
    });

    $('prev-btn').disabled = i === 0;
    $('back-btn').disabled = i === 0;
    const last = i === TOTAL - 1;
    $('next-label').textContent = last ? t('test.finish', 'Ver mis resultados') : t('test.next', 'Siguiente pregunta');
    $('next-icon').textContent = last ? 'celebration' : 'arrow_forward';
    setHint(isAnswered(state.answers[i]) ? 'ok' : 'idle');

    updateStatus();
    renderMap();
    updateCompass();
  }

  function setHint(mode) {
    const hint = $('nav-hint');
    const icon = hint.firstElementChild;
    const text = hint.lastElementChild;
    const last = state.current === TOTAL - 1;
    hint.classList.remove('ok', 'warn');
    if (mode === 'advancing') {
      hint.classList.add('ok');
      icon.textContent = 'check_circle';
      text.textContent = last ? t('test.hint.last', '¡Listo! Preparando tus resultados…') : t('test.hint.adv', '¡Anotado! Pasando a la siguiente…');
    } else if (mode === 'ok') {
      hint.classList.add('ok');
      icon.textContent = 'check_circle';
      text.textContent = last ? t('test.hint.last', '¡Todo listo para ver tu resultado!') : t('test.hint.ok', '¡Anotado! Puedes avanzar');
    } else if (mode === 'warn') {
      void hint.offsetWidth;
      hint.classList.add('warn');
      icon.textContent = 'touch_app';
      text.textContent = t('test.hint.warn', 'Primero toca una opción');
    } else {
      icon.textContent = 'touch_app';
      text.textContent = t('test.hint.idle', 'Toca la opción que más vaya contigo');
    }
  }

  function updateStatus() {
    const i = state.current;
    const done = answeredCount();
    const pct = Math.round((done / TOTAL) * 100);
    const remaining = TOTAL - done;
    const minutes = Math.max(1, Math.ceil((remaining * 10) / 60));

    $('q-counter').textContent = t('test.counter', 'Pregunta {i} de {n}', { i: i + 1, n: TOTAL });
    $('progress-label').textContent = pct + t('test.done', '% completado');
    $('progress-fill').style.width = pct + '%';
    $('progress-track').setAttribute('aria-valuenow', String(pct));
    $('time-left').textContent = remaining === 0
      ? (lang === 'qu' ? '¡Llapan tapukuykunatam kutichirqanki!' : '¡Completaste todas las preguntas!')
      : (lang === 'qu' ? 'Puchuq pacha: ' + minutes + ' minuto hina' : 'Tiempo estimado restante: unos ' + minutes + (minutes === 1 ? ' minuto' : ' minutos'));

    const currentPhase = Math.floor(i / PER_BLOCK);
    document.querySelectorAll('#phase-grid .phase').forEach((el) => {
      const p = Number(el.dataset.phase);
      const phaseDone = state.answers.slice(p * PER_BLOCK, p * PER_BLOCK + PER_BLOCK).every(isAnswered);
      el.classList.toggle('active-phase', p === currentPhase);
      el.classList.toggle('done-phase', phaseDone && p !== currentPhase);
      el.querySelector('.phase-number').textContent = phaseDone && p !== currentPhase ? '✓' : String(p + 1);
      el.querySelector('b').textContent = t('test.phase', 'Fase') + ' ' + (p + 1) +
        (p === currentPhase ? (lang === 'qu' ? ' · Kunan' : ' · En curso') : phaseDone ? (lang === 'qu' ? ' · Tukusqa' : ' · Completada') : '');
      el.querySelector(':scope > div > span').textContent = lang === 'qu' ? BLOCKS[p].qu : BLOCKS[p].es;
    });

    const cta = $('header-cta');
    cta.textContent = state.completed ? '🎯 Ver resultados' : done > 0 ? '✨ Continuar test' : '✨ Iniciar Test';
  }

  function renderMap() {
    const grid = $('map-grid');
    grid.innerHTML = '';
    const limit = firstUnanswered();
    for (let k = 0; k < TOTAL; k++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.index = String(k);
      const answered = isAnswered(state.answers[k]);
      if (k === state.current) {
        b.className = 'map-current';
        b.setAttribute('aria-current', 'step');
        b.textContent = String(k + 1);
        b.setAttribute('aria-label', 'Pregunta ' + (k + 1) + ', actual');
      } else if (answered) {
        b.className = 'map-done';
        b.textContent = '✓';
        b.setAttribute('aria-label', 'Pregunta ' + (k + 1) + ', respondida');
      } else {
        b.textContent = String(k + 1);
        b.setAttribute('aria-label', 'Pregunta ' + (k + 1) + ', pendiente');
      }
      b.disabled = !(answered || k <= limit);
      grid.appendChild(b);
    }
  }

  /* ---------- Puntuación RIASEC ---------- */
  // pct = afinidad (0–100) con cada tipo según las respuestas dadas a ese tipo.
  // share = parte del total (para el gráfico circular, suma 100).
  function computeScores() {
    const sum = {}, max = {};
    TYPE_ORDER.forEach((k) => { sum[k] = 0; max[k] = 0; });
    state.answers.forEach((a, idx) => {
      if (!isAnswered(a)) return;
      const tp = QUESTIONS[idx].t;
      sum[tp] += a; max[tp] += 3;
    });
    const total = answeredCount();
    const grand = TYPE_ORDER.reduce((s, k) => s + sum[k], 0);
    const list = TYPE_ORDER.map((k) => ({
      key: k,
      count: sum[k],
      pct: max[k] ? Math.round((sum[k] / max[k]) * 100) : 0,
      share: grand ? (sum[k] / grand) * 100 : 0
    }));
    list.sort((a, b) => b.pct - a.pct || b.count - a.count || TYPE_ORDER.indexOf(a.key) - TYPE_ORDER.indexOf(b.key));
    return { total: total, list: list, code: list.filter((r) => r.count > 0).slice(0, 3).map((r) => r.key).join('') };
  }

  // Compatibilidad de una carrera con el perfil (0–100)
  function matchScore(career, scores) {
    const code = HOLLAND[career.name];
    if (!code) return 0;
    const sc = scores || computeScores();
    const pct = {};
    sc.list.forEach((r) => { pct[r.key] = r.pct; });
    const weights = [3, 2, 1];
    let num = 0, den = 0;
    code.split('').forEach((tp, i) => { num += weights[i] * (pct[tp] || 0); den += weights[i]; });
    return Math.round(num / den);
  }
  function rankedCareers() {
    const sc = computeScores();
    return CAREERS.map((c) => ({ c: c, score: matchScore(c, sc) })).sort((a, b) => b.score - a.score);
  }

  function updateCompass() {
    const { total, list, code } = computeScores();
    const chart = $('interest-chart');
    const legend = $('legend-list');
    $('compass-phase').textContent = t('test.phase', 'Fase') + ' ' + (Math.floor(state.current / PER_BLOCK) + 1);
    legend.innerHTML = '';

    if (!total || !list.some((r) => r.count > 0)) {
      chart.style.background = '';
      $('chart-main').textContent = '¡Empieza!';
      $('chart-sub').textContent = 'a responder';
      $('chart-note').textContent = total ? 'Sigue respondiendo para ver tu perfil.' : 'Aún no hay respuestas. Tu brújula aparecerá aquí.';
      chart.setAttribute('aria-label', 'Todavía no hay respuestas');
      return;
    }

    let acc = 0;
    const stops = list.filter((r) => r.count > 0).map((r) => {
      const start = acc; acc += r.share;
      return TYPES[r.key].color + ' ' + start.toFixed(2) + '% ' + acc.toFixed(2) + '%';
    });
    chart.style.background = 'conic-gradient(' + stops.join(', ') + ')';

    $('chart-main').textContent = code;
    $('chart-sub').textContent = TYPES[list[0].key].short;
    chart.setAttribute('aria-label', 'Tu código: ' + code + '. ' + list.map((r) => TYPES[r.key].area + ' ' + r.pct + '%').join(', '));

    list.filter((r) => r.count > 0).slice(0, 4).forEach((r) => legend.appendChild(legendRow(TYPES[r.key].color, TYPES[r.key].area, r.pct)));
    $('chart-note').textContent = 'Afinidad con cada tipo · ' + total + ' de ' + TOTAL + ' respuestas.';
  }

  function legendRow(color, label, pct) {
    const row = document.createElement('div');
    row.innerHTML = '<span><i class="legend-dot"></i><span></span></span><strong></strong>';
    row.querySelector('.legend-dot').style.background = color;
    row.querySelector('span > span').textContent = label;
    row.querySelector('strong').textContent = pct + '%';
    return row;
  }

  /* ---------- Acciones del test ---------- */
  let autosaveTimer;
  function flashAutosave() {
    const a = $('autosave');
    a.classList.add('flash');
    a.lastChild.textContent = ' Guardado';
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => { a.classList.remove('flash'); a.lastChild.textContent = ' Autoguardado'; }, 1400);
  }

  function selectAnswer(value) {
    clearTimeout(advanceTimer);
    value = Number(value);
    state.answers[state.current] = value;
    if (answeredCount() < TOTAL) state.completed = false;
    document.querySelectorAll('#answers-grid .answer-card').forEach((card) => {
      const isIt = Number(card.querySelector('input').value) === value;
      card.classList.toggle('selected', isIt);
      if (isIt) { card.style.animation = ''; card.style.animationDelay = '0ms'; }
    });
    saveProgress();
    flashAutosave();
    updateStatus();
    renderMap();
    updateCompass();
    refreshRecommendations();

    const at = state.current;
    const last = at === TOTAL - 1;
    if (autoAdvance && (!last || firstUnanswered() === TOTAL)) {
      setHint('advancing');
      $('answers-grid').classList.add('advancing');
      advanceTimer = setTimeout(() => {
        $('answers-grid').classList.remove('advancing');
        if (state.current !== at || !isAnswered(state.answers[at])) return;
        next();
      }, last ? ADVANCE_DELAY + 300 : ADVANCE_DELAY);
    } else {
      setHint('ok');
    }
  }

  function goTo(index) {
    if (index < 0 || index >= TOTAL || index === state.current) return;
    state.current = index;
    saveProgress();
    renderQuestion(true);
    const top = $('prompt-card').getBoundingClientRect().top;
    if (top < 70 || top > window.innerHeight * 0.6) {
      $('prompt-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (autoSpeak) speakQuestion();
  }

  function next() {
    if (!isAnswered(state.answers[state.current])) { setHint('warn'); return; }
    if (state.current < TOTAL - 1) {
      goTo(state.current + 1);
      return;
    }
    const missing = firstUnanswered();
    if (missing < TOTAL) {
      toast('Te falta responder la pregunta ' + (missing + 1) + '.', 'priority_high');
      goTo(missing);
      return;
    }
    state.completed = true;
    saveProgress();
    updateStatus();
    renderChosen();
    setHint('ok');
    planAuto('test');
    showResults();
  }

  function prev() { if (state.current > 0) goTo(state.current - 1); }

  function saveAndPause() {
    const btn = $('save-pause-btn');
    if (btn.dataset.busy) return;
    btn.dataset.busy = '1';
    const original = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined spin" aria-hidden="true">sync</span><span>Guardando...</span>';
    saveProgress();
    setTimeout(() => {
      btn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">check_circle</span><span>¡Guardado!</span>';
      toast(currentUser && currentUser.guest
        ? 'Progreso guardado en este navegador. Puedes volver cuando quieras.'
        : 'Progreso guardado. Al volver a iniciar sesión, continuarás aquí.', 'cloud_done');
      setTimeout(() => { btn.innerHTML = original; delete btn.dataset.busy; }, 2200);
    }, 700);
  }

  // Atajos de teclado: 1–4 (o A–D) eligen una opción
  function handleShortcut(e) {
    if ($('app').hidden || openModalEl || e.ctrlKey || e.metaKey || e.altKey) return;
    const tg = e.target;
    if (tg && (tg.isContentEditable || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT' ||
      (tg.tagName === 'INPUT' && tg.type !== 'radio' && tg.type !== 'checkbox'))) return;
    const k = (e.key || '').toLowerCase();
    let idx = ['a', 'b', 'c', 'd'].indexOf(k);
    if (idx === -1 && /^[1-4]$/.test(k)) idx = Number(k) - 1;
    if (idx === -1) return;
    const area = $('test').getBoundingClientRect();
    if (area.bottom < 80 || area.top > window.innerHeight - 80) return; // el test no está a la vista
    const input = $('answers-grid').querySelectorAll('input')[idx];
    if (!input) return;
    e.preventDefault();
    input.checked = true;
    input.focus({ preventScroll: true });
    selectAnswer(input.value);
  }

  /* ---------- Lectura en voz alta ---------- */
  let autoSpeak = false;
  const canSpeak = () => 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  function stopSpeaking() { try { if (canSpeak()) window.speechSynthesis.cancel(); } catch (e) { /* noop */ } }
  function speakQuestion() {
    if (!canSpeak()) { toast('Tu navegador no permite la lectura en voz alta.', 'volume_off'); return; }
    if (lang === 'qu') { toast('La lectura en voz alta solo está disponible en español.', 'volume_off'); return; }
    stopSpeaking();
    const q = QUESTIONS[state.current];
    const block = BLOCKS[Math.floor(state.current / PER_BLOCK)];
    const text = block.lead + ' ' + q.es + '. Opciones: ' + LIKERT.map((o, i) => (i + 1) + ', ' + o.es).join('. ');
    const u = new SpeechSynthesisUtterance(text.replace(/[¿?¡!…]/g, ' '));
    u.lang = 'es-PE';
    const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    const v = voices.find((x) => /^es[-_](PE|419|MX|US)/i.test(x.lang)) || voices.find((x) => /^es/i.test(x.lang));
    if (v) u.voice = v;
    u.rate = 0.95;
    const btn = $('speak-btn');
    if (btn) { btn.classList.add('speaking'); u.onend = u.onerror = () => btn.classList.remove('speaking'); }
    window.speechSynthesis.speak(u);
  }

  /* ---------- Resultados + elegir carrera ---------- */
  let lastFocus = null;
  function showResults() {
    const sc = computeScores();
    const { list, code } = sc;
    const top = TYPES[list[0].key];
    const name = displayName();
    const ranked = rankedCareers();
    const suggestions = ranked.slice(0, 8);

    const body = $('results-body');
    body.innerHTML =
      '<div class="result-hero">' +
        '<div class="holland-code" aria-hidden="true"></div>' +
        '<p class="result-kicker">' + escapeHtml(t('res.kicker', 'Tu perfil vocacional')) + ' · código Holland</p>' +
        '<h2 id="results-title"></h2>' +
        '<p id="results-sub"></p>' +
      '</div>' +
      '<div class="type-cards" id="type-cards"></div>' +
      '<h3>' + escapeHtml(t('res.map', 'Tu afinidad con cada tipo')) + '</h3>' +
      '<div class="result-bars" id="result-bars"></div>' +
      '<h3>' + escapeHtml(t('res.pick', 'Último paso: elige la carrera que más te atrae')) + '</h3>' +
      '<p class="pick-intro">Ordenadas por compatibilidad con tu perfil. Toca una para seleccionarla; usa <span class="material-symbols-outlined small-icon" aria-hidden="true">info</span> para ver sus detalles.</p>' +
      '<div class="career-pick" id="career-pick" role="radiogroup" aria-label="Carreras sugeridas"></div>' +
      '<div class="modal-actions"><button type="button" class="primary-button choose-main" id="choose-btn" data-action="choose" disabled>' +
        '<span class="material-symbols-outlined" aria-hidden="true">favorite</span> <span id="choose-label">Selecciona una carrera</span></button></div>' +
      '<h3>' + escapeHtml(t('res.share', 'Guarda y comparte tu resultado')) + '</h3>' +
      '<div class="share-grid">' +
        '<button type="button" class="share-tile" data-action="pdf"><span class="material-symbols-outlined" aria-hidden="true">picture_as_pdf</span><b>Descargar informe</b><small>PDF para tus padres o tutor</small></button>' +
        '<button type="button" class="share-tile" data-action="share-image"><span class="material-symbols-outlined" aria-hidden="true">ios_share</span><b>Compartir en redes</b><small>Imagen para tu historia</small></button>' +
        '<button type="button" class="share-tile" data-action="cita"><span class="material-symbols-outlined" aria-hidden="true">event_available</span><b>Agendar cita</b><small>Orientación personalizada</small></button>' +
      '</div>' +
      (CONFIG.sheetsUrl ? '<label class="check consent"><input type="checkbox" id="share-consent" checked> Compartir mis resultados con mi orientadora para recibir seguimiento (ver <a href="#privacidad" data-action="privacy">privacidad</a>)</label>' : '') +
      '<div class="modal-actions" style="margin-top:.75rem">' +
        '<a href="#carreras" class="secondary-button" data-action="close-to" data-target="carreras"><span class="material-symbols-outlined" aria-hidden="true">school</span> Ver todas las carreras</a>' +
        '<button type="button" class="wa-button" data-whatsapp="resultados"><span class="material-symbols-outlined" aria-hidden="true">chat</span> Conversar por WhatsApp</button>' +
      '</div>' +
      '<div class="modal-actions" style="margin-top:.75rem">' +
        '<button type="button" class="secondary-button" data-action="restart"><span class="material-symbols-outlined" aria-hidden="true">restart_alt</span> Repetir test</button>' +
        '<button type="button" class="secondary-button" data-action="close"><span class="material-symbols-outlined" aria-hidden="true">visibility</span> Revisar respuestas</button>' +
      '</div>' +
      '<p class="result-note">Test basado en el modelo RIASEC de John Holland. Es orientativo: conversa tu resultado con tu orientadora, tu tutor/a o tu familia.</p>';

    // Código Holland en letras grandes
    const codeBox = body.querySelector('.holland-code');
    code.split('').forEach((k) => {
      const l = document.createElement('span');
      l.textContent = k;
      l.style.background = TYPES[k].color;
      codeBox.appendChild(l);
    });
    $('results-title').textContent = code.split('').map((k) => TYPES[k].area).join(' · ');
    $('results-sub').textContent = (name ? '¡Felicidades, ' + name + '! ' : '¡Felicidades! ') +
      'Tu tipo principal es ' + top.area + ' (' + top.nick.toLowerCase() + '). ' + top.desc;

    // Tarjetas de los 3 tipos principales
    const cards = $('type-cards');
    code.split('').forEach((k, i) => {
      const tp = TYPES[k];
      const el = document.createElement('div');
      el.className = 'type-card';
      el.style.setProperty('--c', tp.color);
      el.innerHTML = '<span class="type-rank">' + (i + 1) + '</span><span class="material-symbols-outlined" aria-hidden="true">' + tp.icon + '</span><b></b><small></small>';
      el.querySelector('b').textContent = tp.area + (lang === 'qu' ? ' · ' + tp.qu : '');
      el.querySelector('small').textContent = tp.nick;
      cards.appendChild(el);
    });

    const bars = $('result-bars');
    list.forEach((r) => {
      const tp = TYPES[r.key];
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.style.setProperty('--c', tp.color);
      row.innerHTML = '<span></span><strong></strong><div class="bar"><i style="width:0"></i></div>';
      row.firstChild.textContent = r.key + ' · ' + tp.area;
      row.children[1].textContent = r.pct + '%';
      bars.appendChild(row);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        row.querySelector('i').style.transition = 'width .8s cubic-bezier(.2,.8,.2,1)';
        row.querySelector('i').style.width = r.pct + '%';
      }));
    });

    const pick = $('career-pick');
    suggestions.forEach((item) => {
      const c = item.c;
      const cat = CATEGORIES[c.cat];
      const index = CAREERS.indexOf(c);
      const opt = document.createElement('label');
      opt.className = 'career-option';
      opt.style.setProperty('--c', cat.color);
      opt.innerHTML =
        '<input type="radio" name="career_pick" value="' + index + '">' +
        '<span class="career-icon"><span class="material-symbols-outlined" aria-hidden="true">' + c.icon + '</span></span>' +
        '<span class="career-option-text"><b></b><small></small><span class="match-tag"></span></span>' +
        '<button type="button" class="option-info" data-career-detail="' + index + '" title="Ver detalles"><span class="material-symbols-outlined" aria-hidden="true">info</span></button>' +
        '<span class="checkmark" aria-hidden="true">✓</span>';
      opt.querySelector('b').textContent = c.name;
      opt.querySelector('small').textContent = c.years + ' · ' + (HOLLAND[c.name] || '') + ' · ' + c.jobs[0];
      opt.querySelector('.match-tag').textContent = item.score + '% ' + (lang === 'qu' ? t('res.match', 'compatible') : 'compatible');
      opt.querySelector('.option-info').setAttribute('aria-label', 'Ver detalles de ' + c.name);
      pick.appendChild(opt);
    });

    function syncPick() {
      const checked = pick.querySelector('input:checked');
      pick.querySelectorAll('.career-option').forEach((o) => o.classList.toggle('selected', o.querySelector('input').checked));
      const btn = $('choose-btn');
      if (!checked) { btn.disabled = true; $('choose-label').textContent = 'Selecciona una carrera'; return; }
      const c = CAREERS[Number(checked.value)];
      const already = c.name === chosenCareer;
      btn.disabled = already;
      $('choose-label').textContent = already ? '✓ Ya es tu carrera elegida' : 'Elegir ' + c.name;
    }
    pick.addEventListener('change', syncPick);
    const prevIdx = CAREERS.findIndex((c) => c.name === chosenCareer);
    const prevInput = pick.querySelector('input[value="' + prevIdx + '"]');
    if (prevInput) prevInput.checked = true;
    syncPick();

    const consent = $('share-consent');
    if (consent) {
      consent.checked = store.get(consentKey(), true) !== false;
      consent.addEventListener('change', () => {
        store.set(consentKey(), consent.checked);
        if (consent.checked) syncToSheets('resultado', true);
      });
    }
    syncToSheets('resultado');

    openModal('results-modal');
  }

  let openModalEl = null;
  function openModal(id) {
    if (openModalEl) closeModal(true);
    lastFocus = document.activeElement;
    openModalEl = $(id);
    openModalEl.hidden = false;
    document.body.classList.add('modal-open');
    openModalEl.querySelector('.modal').scrollTop = 0;
    document.body.style.overflow = 'hidden';
    const closeBtn = openModalEl.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }
  function closeModal(silent) {
    if (!openModalEl) return false;
    openModalEl.hidden = true;
    openModalEl = null;
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    if (!silent && lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    return true;
  }
  const closeResults = () => closeModal();

  function restart() {
    if (!window.confirm('¿Quieres borrar tus respuestas y empezar de nuevo?')) return;
    state = freshState();
    saveProgress();
    closeResults();
    renderQuestion(true);
    refreshRecommendations();
    renderChosen();
    $('test').scrollIntoView({ behavior: 'smooth' });
    toast('¡Nuevo comienzo! Responde con sinceridad.', 'restart_alt');
  }

  /* =========================================================
     CARRERA ELEGIDA
     ========================================================= */
  let chosenCareer = null;
  function choiceKey() { return 'msmc_choice_' + (currentUser ? currentUser.email : 'invitado'); }
  function loadChoice() {
    const n = store.get(choiceKey(), null);
    chosenCareer = CAREERS.some((c) => c.name === n) ? n : null;
  }
  function chooseCareer(name, opts) {
    chosenCareer = name;
    if (currentUser) store.set(choiceKey(), name);
    renderChosen();
    renderCareers();
    if (state.completed) syncToSheets('carrera');
    planAuto('carrera');
    if (!opts || !opts.silent) toast('¡Elegiste ' + name + '! Quedó guardada en tu perfil.', 'favorite');
  }
  function clearChoice() {
    chosenCareer = null;
    store.remove(choiceKey());
    renderChosen();
    renderCareers();
    toast('Quitaste tu elección. Puedes elegir otra cuando quieras.', 'heart_broken');
  }

  function renderChosen() {
    const box = $('chosen-card');
    if (!box) return;
    const idx = CAREERS.findIndex((c) => c.name === chosenCareer);
    box.classList.toggle('has-choice', idx !== -1);
    if (idx === -1) {
      box.style.removeProperty('--c');
      box.innerHTML =
        '<div class="sidebar-heading"><h2>Tu carrera elegida</h2></div>' +
        '<p class="muted">Aún no eliges. Al terminar el test podrás seleccionar una de las carreras sugeridas, o tocar ♥ en cualquier carrera del catálogo.</p>' +
        '<a href="#carreras" class="soft-button"><span class="material-symbols-outlined" aria-hidden="true">travel_explore</span> Explorar carreras</a>';
      return;
    }
    const c = CAREERS[idx];
    const cat = CATEGORIES[c.cat];
    box.style.setProperty('--c', cat.color);
    box.innerHTML =
      '<div class="sidebar-heading"><h2>Tu carrera elegida</h2><span class="saved-badge"><span class="material-symbols-outlined small-icon" aria-hidden="true">check</span> Guardada</span></div>' +
      '<div class="chosen-body"><span class="career-icon" style="--c:' + cat.color + '"><span class="material-symbols-outlined" aria-hidden="true">' + c.icon + '</span></span>' +
      '<div><b></b><small></small></div></div>' +
      '<div class="chosen-actions"><button type="button" class="secondary-button" data-career-detail="' + idx + '">Ver detalles</button>' +
      '<button type="button" class="wa-mini" data-whatsapp="career" aria-label="Consultar por WhatsApp" title="Consultar por WhatsApp"><span class="material-symbols-outlined" aria-hidden="true">chat</span></button></div>' +
      (state.completed
        ? '<div class="chosen-tools"><button type="button" class="soft-button" data-action="pdf"><span class="material-symbols-outlined" aria-hidden="true">picture_as_pdf</span> Informe PDF</button>' +
          '<button type="button" class="soft-button" data-action="share-image"><span class="material-symbols-outlined" aria-hidden="true">ios_share</span> Compartir</button></div>'
        : '') +
      '<button type="button" class="link-button" data-chosen-clear>Cambiar o quitar mi elección</button>';
    box.querySelector('b').textContent = c.name;
    box.querySelector('small').textContent = cat.area + ' · ' + c.years;
    box.querySelector('[data-whatsapp]').dataset.career = c.name;
  }

  function initChosen() {
    $('chosen-card').addEventListener('click', (e) => {
      const d = e.target.closest('[data-career-detail]');
      if (d) { showCareer(Number(d.dataset.careerDetail)); return; }
      if (e.target.closest('[data-chosen-clear]')) {
        clearChoice();
        $('carreras').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* =========================================================
     WHATSAPP
     ========================================================= */
  function topArea() {
    const { total, list, code } = computeScores();
    return total >= 6 && code ? TYPES[list[0].key].area + ' (código ' + code + ')' : null;
  }

  function buildMessage(topic, extra) {
    const name = currentUser && !currentUser.guest ? currentUser.name : '';
    const hello = 'Hola' + (name ? ', soy ' + name : '') + '. ';
    const area = topArea();
    const done = answeredCount();
    const topics = {
      orientacion: 'Me gustaría recibir orientación vocacional personalizada.',
      resultados: area
        ? 'Terminé el test vocacional y mi área principal fue "' + area + '". Me gustaría conversar sobre mis resultados.'
        : 'Me gustaría conversar sobre mis resultados del test vocacional.',
      carreras: 'Quisiera recibir información sobre carreras.',
      padres: 'Soy padre/madre de familia y quisiera orientación para acompañar a mi hijo/a en su elección de carrera.',
      test: 'Tengo una duda sobre el test vocacional (voy en la pregunta ' + (state.current + 1) + ' de ' + TOTAL + ').',
      career: 'Me interesa la carrera de ' + extra + ' y quisiera más información.',
      becas: 'Quisiera ayuda para postular a una beca (Beca 18 u otra) y saber si cumplo los requisitos.',
      datos: 'Quisiera ejercer mis derechos sobre mis datos personales (ver, corregir o borrar mi información).'
    };
    let msg = hello + (topics[topic] || topics.orientacion);
    if (topic !== 'resultados' && area && done >= 8) msg += ' (Mi resultado en el test: ' + area + ').';
    if (chosenCareer && topic !== 'career' && topic !== 'padres') msg += ' La carrera que elegí es ' + chosenCareer + '.';
    if (topic === 'custom') msg = extra + (name ? '\n— ' + name : '');
    return msg;
  }

  // Línea elegida en el chat (0 = Línea 1). Se recuerda en este navegador.
  let waLine = Number(store.get('msmc_wa_line', 0)) || 0;
  if (!CONFIG.whatsappNumbers[waLine]) waLine = 0;

  function openWhatsApp(message, line) {
    const idx = typeof line === 'number' && CONFIG.whatsappNumbers[line] ? line : waLine;
    const entry = CONFIG.whatsappNumbers[idx];
    if (!entry || !/^\d{8,15}$/.test(entry.number)) {
      toast('Falta configurar el número de WhatsApp en script.js (CONFIG.whatsappNumbers).', 'settings');
      return;
    }
    const url = 'https://wa.me/' + entry.number + '?text=' + encodeURIComponent(message);
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
    toggleWaPanel(false);
  }

  function setWaLine(idx) {
    waLine = idx;
    store.set('msmc_wa_line', idx);
    document.querySelectorAll('#wa-lines button').forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.line) === idx)));
  }

  function formatPhone(num) {
    const n = String(num).replace(/\D/g, '');
    if (n.startsWith('51') && n.length === 11) return '+51 ' + n.slice(2, 5) + ' ' + n.slice(5, 8) + ' ' + n.slice(8);
    return '+' + n;
  }

  function toggleWaPanel(force) {
    const panel = $('wa-panel');
    const open = typeof force === 'boolean' ? force : panel.hidden;
    panel.hidden = !open;
    $('wa-fab').setAttribute('aria-expanded', String(open));
    if (open) {
      const name = currentUser && !currentUser.guest ? currentUser.name : '';
      $('wa-greeting').textContent = '¡Hola' + (name ? ' ' + name : '') + '! 👋 ¿En qué te puedo ayudar? Elige un tema o escribe tu mensaje.';
      $('wa-input').focus();
    }
  }

  function initWhatsApp() {
    document.querySelectorAll('[data-wa-number]').forEach((el) => {
      const entry = CONFIG.whatsappNumbers[Number(el.dataset.waNumber) || 0];
      if (entry) el.textContent = formatPhone(entry.number);
    });

    // Selector de línea dentro del chat
    const lines = $('wa-lines');
    if (CONFIG.whatsappNumbers.length > 1) {
      CONFIG.whatsappNumbers.forEach((entry, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'radio');
        b.dataset.line = String(i);
        b.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">call</span><span><b></b><small></small></span>';
        b.querySelector('b').textContent = entry.label;
        b.querySelector('small').textContent = formatPhone(entry.number);
        b.addEventListener('click', () => setWaLine(i));
        lines.appendChild(b);
      });
      setWaLine(waLine);
    } else {
      lines.hidden = true;
    }

    // Cualquier botón con data-whatsapp="tema" abre WhatsApp con un mensaje listo
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-whatsapp]');
      if (!btn) return;
      e.preventDefault();
      const line = btn.dataset.waLine !== undefined ? Number(btn.dataset.waLine) : undefined;
      openWhatsApp(buildMessage(btn.dataset.whatsapp, btn.dataset.career), line);
    });

    $('wa-fab').addEventListener('click', () => toggleWaPanel());
    $('wa-close').addEventListener('click', () => { toggleWaPanel(false); $('wa-fab').focus(); });
    $('wa-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = $('wa-input').value.trim();
      if (!text) { $('wa-input').focus(); return; }
      $('wa-input').value = '';
      openWhatsApp(buildMessage('custom', text));
    });
    document.addEventListener('click', (e) => {
      if (!$('wa-panel').hidden && !e.target.closest('#wa-widget')) toggleWaPanel(false);
    });
  }

  /* =========================================================
     EXPLORAR CARRERAS
     ========================================================= */
  let careerFilter = 'all';
  let careerQuery = '';
  let lastRecommended = null;

  function normalize(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  // Recomendación: las 10 carreras más compatibles (desde 10 respuestas)
  function recommendedCat() {
    if (answeredCount() < 10) return null;
    const ranked = rankedCareers();
    const score = {};
    ranked.forEach((r) => { score[r.c.name] = r.score; });
    const top = ranked.slice(0, 10).map((r) => r.c.name);
    return { score: score, top: top, has: (name) => top.indexOf(name) !== -1, sig: top.join('|') };
  }

  function renderFilters() {
    const wrap = $('career-filters');
    const rec = recommendedCat();
    const filters = [{ key: 'all', label: 'Todas', icon: 'apps', color: 'var(--primary-container)' }];
    if (rec) filters.push({ key: 'rec', label: 'Afines a ti', icon: 'auto_awesome', cls: 'chip-rec' });
    filters.push({ key: 'ayacucho', label: 'En Ayacucho', icon: 'location_on', color: '#ff5a5f' });
    ORDER.forEach((k) => filters.push({ key: k, label: FILTER_LABELS[k], icon: CATEGORIES[k].icon, color: CATEGORIES[k].color }));
    filters.push({ key: 'tecnica', label: 'Técnicas', icon: 'construction', color: '#64748b' });
    if (careerFilter === 'rec' && !rec) careerFilter = 'all';

    wrap.innerHTML = '';
    filters.forEach((f) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.filter = f.key;
      if (f.cls) b.className = f.cls;
      if (f.color) b.style.setProperty('--c', f.color);
      b.setAttribute('aria-pressed', String(careerFilter === f.key));
      b.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">' + f.icon + '</span><span></span>';
      b.lastChild.textContent = f.label;
      wrap.appendChild(b);
    });
  }

  const PAGE_SIZE = 12;
  let careersShown = PAGE_SIZE;

  function universitiesFor(name) { return UNIVERSITIES.filter((u) => u.offers.indexOf(name) !== -1); }
  function challengeFor(c) { return CHALLENGES[c.name] || AREA_CHALLENGES[c.cat]; }
  function videoUrl(c) { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent('un día en la vida de ' + c.name + ' Perú'); }

  function renderCareers() {
    const rec = recommendedCat();
    const q = normalize(careerQuery.trim());
    const list = CAREERS.filter((c) => {
      if (careerFilter === 'rec' && !(rec && rec.has(c.name))) return false;
      if (careerFilter === 'ayacucho' && !universitiesFor(c.name).some((u) => u.city === 'Ayacucho')) return false;
      if (careerFilter === 'tecnica' && c.level !== 'tecnica') return false;
      if (ORDER.indexOf(careerFilter) !== -1 && c.cat !== careerFilter) return false;
      if (!q) return true;
      return normalize([c.name, c.desc, FILTER_LABELS[c.cat], c.skills.join(' '), c.jobs.join(' ')].join(' ')).includes(q);
    });
    // La carrera elegida va primero, luego las afines
    list.sort((a, b) => ((b.name === chosenCareer) - (a.name === chosenCareer)) || (rec ? rec.score[b.name] - rec.score[a.name] : 0));

    const grid = $('careers-grid');
    grid.innerHTML = '';
    const visible = list.slice(0, careersShown);
    visible.forEach((c, idx) => {
      const cat = CATEGORIES[c.cat];
      const index = CAREERS.indexOf(c);
      const isChosen = c.name === chosenCareer;
      const card = document.createElement('article');
      card.className = 'career-card' + (isChosen ? ' is-chosen' : '');
      card.style.setProperty('--c', cat.color);
      card.style.animationDelay = Math.min(idx % PAGE_SIZE, 8) * 35 + 'ms';
      const badge = isChosen
        ? '<span class="rec-badge choice-badge"><span class="material-symbols-outlined" aria-hidden="true" style="font-size:.9rem">favorite</span> Tu elección</span>'
        : rec && rec.has(c.name) ? '<span class="rec-badge"><span class="material-symbols-outlined" aria-hidden="true" style="font-size:.9rem">auto_awesome</span> ' + rec.score[c.name] + '% afín</span>' : '';
      const local = universitiesFor(c.name).some((u) => u.city === 'Ayacucho');
      card.innerHTML =
        badge +
        '<div class="career-top"><span class="career-icon"><span class="material-symbols-outlined" aria-hidden="true">' + c.icon + '</span></span>' +
        '<span class="career-area"></span></div>' +
        '<h3></h3><p class="career-desc"></p>' +
        '<div class="career-meta"><span><span class="material-symbols-outlined" aria-hidden="true">schedule</span><span class="m-years"></span></span>' +
        '<span><span class="material-symbols-outlined" aria-hidden="true">work</span><span class="m-job"></span></span>' +
        (c.level === 'tecnica' ? '<span class="level-tag">Técnica</span>' : '') +
        (local ? '<span class="local-tag"><span class="material-symbols-outlined" aria-hidden="true">location_on</span>En Ayacucho</span>' : '') + '</div>' +
        '<div class="skill-chips"></div>' +
        '<div class="career-actions"><button type="button" class="secondary-button" data-career-detail="' + index + '">Ver detalles</button>' +
        '<button type="button" class="choose-toggle compare-btn" data-compare="' + index + '"><span class="material-symbols-outlined" aria-hidden="true">compare_arrows</span></button>' +
        '<button type="button" class="choose-toggle" data-choose="' + index + '" aria-pressed="' + isChosen + '"><span class="material-symbols-outlined" aria-hidden="true">favorite</span></button>' +
        '<button type="button" class="wa-mini" data-whatsapp="career" aria-label="Consultar por WhatsApp" title="Consultar por WhatsApp"><span class="material-symbols-outlined" aria-hidden="true">chat</span></button></div>';
      card.querySelector('.career-area').textContent = FILTER_LABELS[c.cat];
      card.querySelector('h3').textContent = c.name;
      card.querySelector('.career-desc').textContent = c.desc;
      card.querySelector('.m-years').textContent = c.years;
      card.querySelector('.m-job').textContent = c.jobs[0];
      card.querySelector('[data-whatsapp]').dataset.career = c.name;
      const cmp = card.querySelector('[data-compare]');
      cmp.setAttribute('aria-label', 'Comparar ' + c.name + ' con otra carrera');
      cmp.title = 'Comparar con otra carrera';
      const chooseBtn = card.querySelector('[data-choose]');
      chooseBtn.setAttribute('aria-label', isChosen ? 'Quitar ' + c.name + ' como mi carrera' : 'Elegir ' + c.name + ' como mi carrera');
      chooseBtn.title = isChosen ? 'Tu carrera elegida' : 'Elegir esta carrera';
      const chips = card.querySelector('.skill-chips');
      c.skills.forEach((s) => { const sp = document.createElement('span'); sp.textContent = s; chips.appendChild(sp); });
      grid.appendChild(card);
    });

    const more = $('careers-more');
    const rest = list.length - visible.length;
    more.hidden = rest <= 0;
    if (rest > 0) more.lastElementChild.textContent = 'Ver ' + Math.min(rest, PAGE_SIZE) + ' carreras más (quedan ' + rest + ')';

    $('careers-empty').hidden = list.length > 0;
    $('careers-count').textContent = list.length
      ? list.length + (list.length === 1 ? ' carrera' : ' carreras') + (rec ? ' · ✨ = afín a tus respuestas' : '') + ' · ♥ para elegir · ⇄ para comparar'
      : '';
  }

  function refreshRecommendations() {
    const rec = recommendedCat();
    const sig = rec ? rec.sig : null;
    if (sig === lastRecommended) return;
    lastRecommended = sig;
    renderFilters();
    renderCareers();
  }

  function showCareer(index) {
    const c = CAREERS[index];
    if (!c) return;
    const cat = CATEGORIES[c.cat];
    const isChosen = c.name === chosenCareer;
    const unis = universitiesFor(c.name);
    const body = $('career-modal-body');
    body.style.setProperty('--c', cat.color);
    body.innerHTML =
      '<div class="career-detail-head"><span class="career-icon" style="--c:' + cat.color + '"><span class="material-symbols-outlined" aria-hidden="true">' + c.icon + '</span></span>' +
      '<div><span class="career-area" style="--c:' + cat.color + '"></span><h2 id="career-modal-title"></h2></div></div>' +
      '<p class="career-detail-desc"></p>' +
      '<div class="detail-stats"><div><small>Duración</small><strong class="d-years"></strong></div><div><small>Tipo</small><strong class="d-level"></strong></div><div><small>Perfil RIASEC</small><strong class="d-holland"></strong></div></div>' +
      '<div class="challenge-card"><span class="material-symbols-outlined" aria-hidden="true">timer</span><div><b>Reto de 2 minutos</b><p class="d-challenge"></p></div></div>' +
      '<h3>Perfil ideal</h3><div class="skill-chips d-skills" style="margin-top:.7rem"></div>' +
      '<h3>Cursos clave</h3><ul class="detail-list d-courses"></ul>' +
      '<h3>¿Dónde podrías trabajar?</h3><ul class="detail-list d-jobs"></ul>' +
      '<h3>¿Dónde estudiarla?</h3><div class="uni-list d-unis"></div>' +
      '<a class="salary-link" href="https://ponteencarrera.minedu.gob.pe" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined" aria-hidden="true">payments</span><span><b>¿Cuánto gana y qué tanta demanda tiene?</b><small>Consulta sueldos de egresados por carrera e institución en Ponte en Carrera (portal del Estado peruano)</small></span><span class="material-symbols-outlined" aria-hidden="true">open_in_new</span></a>' +
      '<a class="video-link" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined" aria-hidden="true">play_circle</span><span><b>Mírala en video</b><small>Videos de "un día en la vida" de esta profesión</small></span><span class="material-symbols-outlined" aria-hidden="true">open_in_new</span></a>' +
      '<div class="modal-actions"><button type="button" class="primary-button" data-action="choose-career" data-index="' + index + '"' + (isChosen ? ' disabled' : '') + '>' +
        '<span class="material-symbols-outlined" aria-hidden="true">favorite</span> ' + (isChosen ? 'Es tu carrera elegida' : 'Elegir esta carrera') + '</button>' +
        '<button type="button" class="secondary-button" data-compare="' + index + '"><span class="material-symbols-outlined" aria-hidden="true">compare_arrows</span> Comparar</button></div>' +
      '<div class="modal-actions" style="margin-top:.75rem"><button type="button" class="secondary-button" data-action="close">Seguir explorando</button>' +
      '<button type="button" class="wa-button" data-whatsapp="career"><span class="material-symbols-outlined" aria-hidden="true">chat</span> Consultar por WhatsApp</button></div>' +
      '<p class="result-note">Duración y universidades referenciales: confirma la oferta, vacantes y fechas en la web oficial de cada institución.</p>';
    body.querySelector('.career-area').textContent = FILTER_LABELS[c.cat];
    body.querySelector('h2').textContent = c.name;
    body.querySelector('.career-detail-desc').textContent = c.desc;
    body.querySelector('.d-years').textContent = c.years;
    body.querySelector('.d-level').textContent = c.level === 'tecnica' ? 'Carrera técnica' : 'Universitaria';
    const hc = HOLLAND[c.name] || '';
    body.querySelector('.d-holland').textContent = hc + (state.completed || answeredCount() >= 10 ? ' · ' + matchScore(c) + '% contigo' : '');
    body.querySelector('.d-holland').title = hc.split('').map((k) => TYPES[k].area).join(', ');
    body.querySelector('.d-challenge').textContent = challengeFor(c);
    body.querySelector('.video-link').href = videoUrl(c);
    body.querySelector('[data-whatsapp]').dataset.career = c.name;
    c.skills.forEach((s) => { const sp = document.createElement('span'); sp.textContent = s; body.querySelector('.d-skills').appendChild(sp); });
    const addItems = (sel, items, icon) => items.forEach((t) => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">' + icon + '</span><span></span>';
      li.lastChild.textContent = t;
      body.querySelector(sel).appendChild(li);
    });
    addItems('.d-courses', c.courses, 'menu_book');
    addItems('.d-jobs', c.jobs, 'work');

    const uniBox = body.querySelector('.d-unis');
    if (unis.length) {
      unis.slice().sort((a, b) => (b.city === 'Ayacucho') - (a.city === 'Ayacucho')).forEach((u) => {
        const a = document.createElement('a');
        a.className = 'uni-item';
        a.href = u.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">account_balance</span><span><b></b><small></small></span><span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>';
        a.querySelector('b').textContent = u.name;
        a.querySelector('small').textContent = u.type + ' · ' + u.city;
        if (u.city === 'Ayacucho') a.classList.add('is-local');
        uniBox.appendChild(a);
      });
    } else {
      uniBox.innerHTML = '<p class="muted"></p>';
      uniBox.firstChild.textContent = c.level === 'tecnica'
        ? 'Se estudia en institutos de educación superior (IES) licenciados por el Minedu. Consulta la lista de institutos de tu región.'
        : 'Aún no tenemos universidades registradas para esta carrera. Escríbeme y te ayudo a encontrar dónde estudiarla.';
    }
    const sunedu = document.createElement('a');
    sunedu.className = 'link-button uni-check';
    sunedu.target = '_blank'; sunedu.rel = 'noopener noreferrer';
    sunedu.href = c.level === 'tecnica' ? 'https://www.gob.pe/minedu' : 'https://www.gob.pe/sunedu';
    sunedu.textContent = c.level === 'tecnica' ? 'Verificar institutos licenciados (Minedu) ↗' : 'Verificar universidades licenciadas (SUNEDU) ↗';
    uniBox.appendChild(sunedu);

    openModal('career-modal');
  }

  /* ---------- Comparar dos carreras ---------- */
  function showCompare(aIndex, bIndex) {
    const a = CAREERS[aIndex] ? aIndex : 0;
    let b = CAREERS[bIndex] ? bIndex : -1;
    if (b === -1 || b === a) {
      const chosenIdx = CAREERS.findIndex((c) => c.name === chosenCareer);
      b = chosenIdx !== -1 && chosenIdx !== a ? chosenIdx
        : CAREERS.findIndex((c, i) => i !== a && c.cat === CAREERS[a].cat);
      if (b === -1) b = a === 0 ? 1 : 0;
    }
    const body = $('tool-body');
    const options = CAREERS.map((c, i) => ({ c: c, i: i }))
      .sort((x, y) => x.c.name.localeCompare(y.c.name, 'es'))
      .map((o) => '<option value="' + o.i + '">' + o.c.name.replace(/</g, '&lt;') + '</option>').join('');
    body.innerHTML =
      '<p class="result-kicker" style="text-align:center">Comparador</p>' +
      '<h2 id="tool-title" style="text-align:center">¿Cuál va más contigo?</h2>' +
      '<div class="compare-pickers">' +
        '<label><span class="sr-only">Primera carrera</span><select id="cmp-a">' + options + '</select></label>' +
        '<span class="vs">VS</span>' +
        '<label><span class="sr-only">Segunda carrera</span><select id="cmp-b">' + options + '</select></label>' +
      '</div>' +
      '<div class="compare-table" id="compare-table"></div>' +
      '<p class="result-note">Tip: elige la que más te emocione al leer los cursos, no solo la que "más conviene".</p>';
    $('cmp-a').value = String(a);
    $('cmp-b').value = String(b);
    const draw = () => renderCompare(Number($('cmp-a').value), Number($('cmp-b').value));
    $('cmp-a').addEventListener('change', draw);
    $('cmp-b').addEventListener('change', draw);
    draw();
    planAuto('comparar');
    openModal('tool-modal');
  }

  function renderCompare(ai, bi) {
    const pair = [CAREERS[ai], CAREERS[bi]];
    const table = $('compare-table');
    const uniText = (c) => {
      const u = universitiesFor(c.name);
      return u.length ? u.map((x) => x.short + (x.city === 'Ayacucho' ? ' 📍' : '')).join(', ') : (c.level === 'tecnica' ? 'Institutos (IES)' : 'Consultar');
    };
    const rows = [
      ['Área', (c) => CATEGORIES[c.cat].area],
      ['Duración', (c) => c.years],
      ['Tipo', (c) => (c.level === 'tecnica' ? 'Técnica' : 'Universitaria')],
      ['Perfil RIASEC', (c) => (HOLLAND[c.name] || '') + (answeredCount() >= 10 ? ' · ' + matchScore(c) + '% compatible contigo' : '')],
      ['De qué trata', (c) => c.desc],
      ['Habilidades', (c) => c.skills.join(' · ')],
      ['Cursos clave', (c) => c.courses.join(' · ')],
      ['Dónde trabajar', (c) => c.jobs.join(' · ')],
      ['Dónde estudiar', uniText]
    ];
    table.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'cmp-row cmp-head';
    head.innerHTML = '<span></span>';
    pair.forEach((c, k) => {
      const cell = document.createElement('div');
      cell.className = 'cmp-career';
      cell.style.setProperty('--c', CATEGORIES[c.cat].color);
      cell.innerHTML = '<span class="career-icon"><span class="material-symbols-outlined" aria-hidden="true">' + c.icon + '</span></span><b></b>' +
        '<button type="button" class="soft-button" data-action="choose-career" data-index="' + (k ? bi : ai) + '"><span class="material-symbols-outlined" aria-hidden="true">favorite</span> Elegir</button>';
      cell.querySelector('b').textContent = c.name;
      if (c.name === chosenCareer) { const btn = cell.querySelector('button'); btn.disabled = true; btn.lastChild.textContent = ' Tu elección'; }
      head.appendChild(cell);
    });
    table.appendChild(head);
    rows.forEach((r) => {
      const row = document.createElement('div');
      row.className = 'cmp-row';
      const label = document.createElement('span');
      label.className = 'cmp-label';
      label.textContent = r[0];
      row.appendChild(label);
      pair.forEach((c) => { const d = document.createElement('div'); d.textContent = r[1](c); d.dataset.label = r[0]; row.appendChild(d); });
      table.appendChild(row);
    });
  }

  function initCareers() {
    renderFilters();
    renderCareers();
    $('career-filters').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-filter]');
      if (!b) return;
      careerFilter = b.dataset.filter;
      careersShown = PAGE_SIZE;
      $('career-filters').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      renderCareers();
    });
    let t;
    $('career-search').addEventListener('input', (e) => {
      clearTimeout(t);
      t = setTimeout(() => { careerQuery = e.target.value; careersShown = PAGE_SIZE; renderCareers(); }, 150);
    });
    $('careers-more').addEventListener('click', () => { careersShown += PAGE_SIZE; renderCareers(); });
    $('careers-grid').addEventListener('click', (e) => {
      const b = e.target.closest('[data-career-detail]');
      if (b) { showCareer(Number(b.dataset.careerDetail)); return; }
      const ch = e.target.closest('[data-choose]');
      if (ch) {
        const c = CAREERS[Number(ch.dataset.choose)];
        if (!c) return;
        if (c.name === chosenCareer) clearChoice(); else chooseCareer(c.name);
      }
    });
  }

  /* =========================================================
     TESTIMONIOS
     ========================================================= */
  function initTestimonials() {
    const track = $('testimonial-track');
    const dots = $('testimonial-dots');
    TESTIMONIALS.forEach((t, i) => {
      const cat = CATEGORIES[t.cat];
      const card = document.createElement('figure');
      card.className = 'testimonial';
      card.style.setProperty('--c', cat.color);
      card.style.margin = '0';
      card.innerHTML =
        '<span class="testimonial-tag"></span><span class="quote-mark" aria-hidden="true">“</span><blockquote></blockquote>' +
        '<figcaption class="testimonial-author"><span class="avatar" aria-hidden="true"></span><div><strong></strong><span></span></div></figcaption>';
      card.querySelector('.testimonial-tag').textContent = cat.area;
      card.querySelector('blockquote').textContent = t.text;
      card.querySelector('.avatar').textContent = t.name.charAt(0);
      card.querySelector('strong').textContent = t.name;
      card.querySelector('figcaption div span').textContent = t.role;
      track.appendChild(card);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
      dot.addEventListener('click', () => scrollToCard(i));
      dots.appendChild(dot);
    });

    function cardWidth() {
      const first = track.firstElementChild;
      return first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 0;
    }
    function scrollToCard(i) { track.scrollTo({ left: i * cardWidth(), behavior: 'smooth' }); }
    function currentIndex() { const w = cardWidth(); return w ? Math.round(track.scrollLeft / w) : 0; }
    function updateDots() {
      const idx = currentIndex();
      dots.querySelectorAll('button').forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
    }
    $('t-prev').addEventListener('click', () => {
      const i = currentIndex();
      scrollToCard(i <= 0 ? TESTIMONIALS.length - 1 : i - 1);
    });
    $('t-next').addEventListener('click', () => {
      const i = currentIndex();
      const maxScroll = track.scrollWidth - track.clientWidth - 4;
      scrollToCard(track.scrollLeft >= maxScroll ? 0 : i + 1);
    });
    track.addEventListener('scroll', () => window.requestAnimationFrame(updateDots), { passive: true });
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); $('t-next').click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); $('t-prev').click(); }
    });
    updateDots();
  }

  /* =========================================================
     NAVEGACIÓN (sección activa + menú móvil)
     ========================================================= */
  function toggleMenu(force) {
    const nav = $('mobile-nav');
    const open = typeof force === 'boolean' ? force : nav.hidden;
    nav.hidden = !open;
    $('menu-btn').setAttribute('aria-expanded', String(open));
    $('menu-btn').firstElementChild.textContent = open ? 'close' : 'menu';
  }

  function updateActiveNav() {
    if ($('app').hidden) return;
    let current = 'inicio';
    ['test', 'carreras', 'becas', 'calendario', 'guia'].forEach((id) => {
      const el = $(id);
      if (el && el.getBoundingClientRect().top <= 140) current = id;
    });
    if (window.scrollY < 120) current = 'inicio';
    document.querySelectorAll('[data-nav]').forEach((a) => {
      if (a.dataset.nav === current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  // En celular, el botón flotante de WhatsApp se oculta mientras respondes el test
  function initFabWatch() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => document.body.classList.toggle('test-in-view', en.isIntersecting));
    }, { threshold: 0.15 });
    io.observe(document.querySelector('.navigation-card'));
  }

  function initNav() {
    initFabWatch();
    $('menu-btn').addEventListener('click', () => toggleMenu());
    $('mobile-nav').addEventListener('click', (e) => { if (e.target.closest('a, button')) toggleMenu(false); });
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => { updateActiveNav(); ticking = false; });
    }, { passive: true });
  }

  /* ---------- Eventos de la app ---------- */
  function initApp() {
    $('answers-grid').addEventListener('change', (e) => {
      if (e.target && e.target.name === 'likert') selectAnswer(e.target.value);
    });
    // Tocar de nuevo la opción ya elegida también avanza (útil al revisar respuestas)
    $('answers-grid').addEventListener('click', (e) => {
      const card = e.target.closest('.answer-card');
      if (!card || !autoAdvance || e.detail === 0) return;
      const input = card.querySelector('input');
      if (input.checked && state.answers[state.current] === Number(input.value) && e.target === input) {
        clearTimeout(advanceTimer);
        advanceTimer = setTimeout(next, 250);
      }
    });
    $('career-form').addEventListener('submit', (e) => { e.preventDefault(); clearTimeout(advanceTimer); next(); });
    $('prev-btn').addEventListener('click', prev);
    $('back-btn').addEventListener('click', prev);
    $('save-pause-btn').addEventListener('click', saveAndPause);
    $('logout-btn').addEventListener('click', logout);

    const auto = $('auto-advance');
    auto.checked = autoAdvance;
    auto.addEventListener('change', () => {
      autoAdvance = auto.checked;
      store.set('msmc_auto_advance', autoAdvance);
      clearTimeout(advanceTimer);
      $('answers-grid').classList.remove('advancing');
      setHint(isAnswered(state.answers[state.current]) ? 'ok' : 'idle');
      toast(autoAdvance ? 'Al tocar una opción pasarás sola a la siguiente pregunta.' : 'Ahora avanzas con el botón "Siguiente pregunta".', 'bolt');
    });

    document.addEventListener('keydown', handleShortcut);
    $('speak-btn').addEventListener('click', speakQuestion);

    $('map-grid').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b && !b.disabled) goTo(Number(b.dataset.index));
    });

    $('header-cta').addEventListener('click', (e) => {
      if (state.completed) { e.preventDefault(); showResults(); }
    });

    document.querySelectorAll('[data-results-link]').forEach((a) => {
      a.addEventListener('click', (e) => {
        if (state.completed) { e.preventDefault(); showResults(); }
        else if (answeredCount() === 0) toast('Responde algunas preguntas para ver tu brújula de intereses.', 'explore');
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) { closeModal(); return; }
        const info = e.target.closest('[data-career-detail]');
        if (info) { e.preventDefault(); showCareer(Number(info.dataset.careerDetail)); return; }
        const action = e.target.closest('[data-action]');
        if (!action) return;
        if (action.dataset.action === 'close') closeModal();
        if (action.dataset.action === 'restart') restart();
        if (action.dataset.action === 'choose') {
          const checked = $('career-pick') && $('career-pick').querySelector('input:checked');
          if (!checked) return;
          chooseCareer(CAREERS[Number(checked.value)].name);
          closeModal(true);
          $('chosen-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (action.dataset.action === 'choose-career') {
          const c = CAREERS[Number(action.dataset.index)];
          if (!c) return;
          chooseCareer(c.name);
          closeModal(true);
        }
        if (action.dataset.action === 'close-to') {
          e.preventDefault();
          closeModal(true);
          careerFilter = recommendedCat() ? 'rec' : 'all';
          renderFilters();
          renderCareers();
          $(action.dataset.target).scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (closeModal()) return;
      if (!$('wa-panel').hidden) { toggleWaPanel(false); $('wa-fab').focus(); return; }
      if (!$('mobile-nav').hidden) toggleMenu(false);
    });

    $('newsletter-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('email');
      if (!EMAIL_RE.test(input.value.trim())) { toast('Escribe un correo válido para recibir la guía.', 'error'); input.focus(); return; }
      input.value = '';
      toast('¡Listo! Te enviaremos la guía a tu correo.', 'mark_email_read');
    });
  }

  /* =========================================================
     REDES SOCIALES
     ========================================================= */
  // Acepta "usuario", "@usuario" o el enlace completo del perfil
  function socialHandle(value) {
    let v = String(value || '').trim();
    if (!v || /TU_(PAGINA|USUARIO)/.test(v)) return '';
    const id = v.match(/[?&]id=(\d+)/);
    if (id) return id[1];
    v = v.replace(/^https?:\/\/[^/]+\//i, '').replace(/^(m\/|messages\/t\/)/, '');
    v = v.split(/[/?#]/)[0].replace(/^@/, '');
    return /^[A-Za-z0-9._-]+$/.test(v) ? v : '';
  }

  function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, () => false);
    } catch (e) { /* respaldo */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return Promise.resolve(ok);
    } catch (e) { return Promise.resolve(false); }
  }

  function socialLinks() {
    return Object.keys(SOCIAL_NETWORKS)
      .map((id) => ({ id: id, user: socialHandle(CONFIG.social && CONFIG.social[id]) }))
      .filter((l) => l.user);
  }

  function initSocial() {
    const links = socialLinks();
    document.querySelectorAll('[data-social-text]').forEach((n) => { n.hidden = links.length === 0; });
    document.querySelectorAll('[data-social]').forEach((box) => {
      box.querySelectorAll('.social-btn').forEach((n) => n.remove());
      const wrap = box.closest('[data-social-wrap]') || box;
      wrap.hidden = links.length === 0;
      links.forEach((l) => {
        const net = SOCIAL_NETWORKS[l.id];
        const a = document.createElement('a');
        a.className = 'social-btn social-' + l.id;
        a.href = net.chat(l.user);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.dataset.socialNet = l.id;
        a.setAttribute('aria-label', 'Escríbenos por ' + net.app);
        a.title = 'Escríbenos por ' + net.app;
        a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' + net.svg + '</svg>' +
          (box.dataset.social === 'labels' ? '<span>' + net.label + '</span>' : '');
        box.appendChild(a);
      });
    });

    // Al tocar una red: se abre el chat y se copia un mensaje listo para pegar
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-social-net]');
      if (!a) return;
      const net = SOCIAL_NETWORKS[a.dataset.socialNet];
      const msg = buildMessage('orientacion');
      copyText(msg).then((ok) => {
        if (!ok) { toast('Abriendo ' + net.app + '… escríbenos tu consulta.', 'chat'); return; }
        toast(net.profileOnly
          ? 'Mensaje copiado. En TikTok pulsa "Mensaje" y pégalo.'
          : 'Mensaje copiado. Pégalo en el chat de ' + net.app + ' y envíalo.', 'content_paste');
      });
      if (typeof toggleWaPanel === 'function' && !$('wa-panel').hidden) toggleWaPanel(false);
    });
  }

  /* =========================================================
     DATOS DEL ESTUDIANTE (colegio, consentimiento)
     ========================================================= */
  const userId = () => (currentUser ? currentUser.email : 'invitado');
  function consentKey() { return 'msmc_consent_' + userId(); }
  function schoolKey() { return 'msmc_school_' + userId(); }
  function getSchool() { return String(store.get(schoolKey(), '') || ''); }
  function setSchool(code) { store.set(schoolKey(), String(code || '').trim().toUpperCase().slice(0, 30)); }
  function displayName() { return currentUser && !currentUser.guest ? currentUser.name : ''; }
  function escapeHtml(t) { return String(t).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }
  function todayText() { return new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }); }

  function resultSummary() {
    const { total, list } = computeScores();
    const used = list.filter((r) => r.count > 0);
    return {
      total: total,
      list: list,
      code: used.slice(0, 3).map((r) => r.key).join(''),
      area1: used[0] ? TYPES[used[0].key].area : '',
      area2: used[1] ? TYPES[used[1].key].area : '',
      detalle: used.map((r) => r.key + ' ' + TYPES[r.key].area + ' ' + r.pct + '%').join(', ')
    };
  }

  /* =========================================================
     GOOGLE SHEETS (resultados, citas y panel del tutor)
     ========================================================= */
  function syncToSheets(tipo, force, extra) {
    if (!CONFIG.sheetsUrl || !currentUser) return;
    if (tipo !== 'cita' && store.get(consentKey(), true) === false) return;
    const r = resultSummary();
    const payload = Object.assign({
      tipo: tipo,
      fecha: new Date().toISOString(),
      nombre: displayName() || 'Invitado',
      correo: currentUser.guest ? '' : currentUser.email,
      colegio: getSchool(),
      codigo: r.code, area1: r.area1, area2: r.area2, detalle: r.detalle,
      carrera: chosenCareer || ''
    }, extra || {});
    // Evita enviar dos veces lo mismo
    const sig = [tipo, payload.colegio, payload.codigo, payload.detalle, payload.carrera, extra ? JSON.stringify(extra) : ''].join('|');
    const sigKey = 'msmc_sent_' + userId() + '_' + tipo;
    if (!force && tipo !== 'cita' && store.get(sigKey, '') === sig) return;
    try {
      fetch(CONFIG.sheetsUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
        .then(() => store.set(sigKey, sig))
        .catch(() => { /* sin conexión: se reintenta la próxima vez */ });
    } catch (e) { /* noop */ }
  }

  /* =========================================================
     INFORME PDF
     ========================================================= */
  function printReport() {
    if (!state.completed) { toast('Termina el test para generar tu informe.', 'info'); return; }
    const r = resultSummary();
    const c = CAREERS.find((x) => x.name === chosenCareer);
    const sugg = rankedCareers().slice(0, 6).map((x) => x.c.name + ' (' + x.score + '%)');
    const name = displayName();
    const school = getSchool();
    const unis = c ? universitiesFor(c.name) : [];
    const contacts = CONFIG.whatsappNumbers.map((w) => formatPhone(w.number)).join(' · ');
    const social = socialLinks().map((l) => SOCIAL_NETWORKS[l.id].label + ' @' + l.user).join(' · ');

    const bars = r.list.map((x) => {
      const tp = TYPES[x.key];
      return '<div class="pr-bar"><span>' + x.key + ' · ' + escapeHtml(tp.area) + '</span><div><i style="width:' + x.pct + '%;background:' + tp.color + '"></i></div><b>' + x.pct + '%</b></div>';
    }).join('');
    const typeText = r.code.split('').map((k) => '<p><b>' + k + ' · ' + escapeHtml(TYPES[k].area) + ':</b> ' + escapeHtml(TYPES[k].desc) + '</p>').join('');

    const box = $('print-report');
    box.innerHTML =
      '<header class="pr-head"><div><h1>Informe de orientación vocacional</h1><p>Mi Sueño, Mi Carrera · ' + escapeHtml(todayText()) + '</p></div>' +
        '<svg class="pr-logo" aria-hidden="true"><use href="#logo-mark"/></svg></header>' +
      '<section class="pr-who"><div><small>Estudiante</small><b>' + escapeHtml(name || 'Estudiante') + '</b></div>' +
        (school ? '<div><small>Colegio / salón</small><b>' + escapeHtml(school) + '</b></div>' : '') +
        '<div><small>Preguntas respondidas</small><b>' + r.total + ' de ' + TOTAL + '</b></div></section>' +
      '<section class="pr-main"><small>Perfil vocacional · código Holland (RIASEC)</small><h2>' + escapeHtml(r.code) + ' — ' + escapeHtml(r.code.split('').map((k) => TYPES[k].area).join(' · ')) + '</h2>' + typeText + '</section>' +
      '<h3>Afinidad con cada tipo</h3><div class="pr-bars">' + bars + '</div>' +
      (c
        ? '<h3>Carrera elegida</h3><div class="pr-career"><h4>' + escapeHtml(c.name) + '</h4><p>' + escapeHtml(c.desc) + '</p>' +
          '<p><b>Duración:</b> ' + escapeHtml(c.years) + ' · <b>Tipo:</b> ' + (c.level === 'tecnica' ? 'Técnica' : 'Universitaria') + '</p>' +
          '<p><b>Cursos clave:</b> ' + escapeHtml(c.courses.join(', ')) + '</p>' +
          '<p><b>Campo laboral:</b> ' + escapeHtml(c.jobs.join(', ')) + '</p>' +
          (unis.length ? '<p><b>Dónde estudiarla:</b> ' + escapeHtml(unis.map((u) => u.name + ' (' + u.city + ')').join('; ')) + '</p>' : '') + '</div>'
        : '') +
      '<h3>Carreras más compatibles con tu perfil</h3><p>' + escapeHtml(sugg.join(' · ')) + '</p>' +
      '<h3>Próximos pasos</h3><ol class="pr-steps">' +
        '<li>Conversa este informe con tu familia y tu tutor/a.</li>' +
        '<li>Revisa los cursos y el campo laboral de 2 o 3 carreras afines.</li>' +
        '<li>Averigua requisitos de admisión y becas (por ejemplo, Beca 18 de Pronabec).</li>' +
        '<li>Agenda una cita de orientación para resolver tus dudas.</li></ol>' +
      '<footer class="pr-foot"><p>Test basado en el modelo RIASEC de John Holland. Este informe es orientativo y no reemplaza una evaluación profesional.</p>' +
        '<p>Contacto: WhatsApp ' + escapeHtml(contacts) + (social ? ' · ' + escapeHtml(social) : '') + '</p>' +
        '<p>Elaborado por: Naylea Luana Conde Quispe y Rosmery Lapa Huyhua</p></footer>';

    toast('En la ventana de impresión elige "Guardar como PDF".', 'picture_as_pdf');
    setTimeout(() => window.print(), 350);
  }

  /* =========================================================
     IMAGEN PARA COMPARTIR EN REDES (historia 1080×1920)
     ========================================================= */
  function wrapText(ctx, text, maxWidth) {
    const words = String(text).split(' ');
    const lines = [];
    let line = '';
    words.forEach((w) => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  async function makeShareImage() {
    const W = 1080, H = 1920;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) { /* noop */ }
    const F = '"Plus Jakarta Sans", "Inter", system-ui, sans-serif';

    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#ff5a5f'); g.addColorStop(0.5, '#7c3aed'); g.addColorStop(1, '#06b6d4');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.10)';
    [[920, 180, 260], [120, 1500, 220], [980, 1650, 140]].forEach((cc) => { ctx.beginPath(); ctx.arc(cc[0], cc[1], cc[2], 0, Math.PI * 2); ctx.fill(); });

    const r = resultSummary();
    const top = TYPES[r.list[0].key];
    const name = displayName();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.font = '800 44px ' + F;
    ctx.fillText('Mi Sueño, ', 90, 150);
    const w1 = ctx.measureText('Mi Sueño, ').width;
    ctx.fillStyle = '#fde68a'; ctx.fillText('Mi Carrera', 90 + w1, 150);
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '700 26px ' + F;
    ctx.fillText('TEST VOCACIONAL', 90, 196);

    ctx.fillStyle = '#fff'; ctx.font = '600 46px ' + F;
    ctx.fillText(name ? name + ', mi perfil vocacional es' : 'Mi perfil vocacional es', 90, 380);
    // Código Holland en fichas de colores
    const code = r.code || r.list[0].key;
    let x0 = 90;
    code.split('').forEach((k) => {
      roundRect(ctx, x0, 420, 190, 190, 44); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.fillStyle = TYPES[k].color; ctx.font = '800 130px ' + F; ctx.textAlign = 'center';
      ctx.fillText(k, x0 + 95, 562);
      x0 += 215;
    });
    ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = '800 64px ' + F;
    const lines = wrapText(ctx, code.split('').map((k) => TYPES[k].area).join(' · '), W - 180);
    lines.forEach((ln, i) => ctx.fillText(ln, 90, 700 + i * 76));
    let y = 700 + lines.length * 76 + 20;

    // Barras top 3 (la caja se ajusta a cuántos tipos hay)
    const topAreas = r.list.filter((x) => x.count > 0).slice(0, 3);
    roundRect(ctx, 70, y, W - 140, 80 + topAreas.length * 130, 48); ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fill();
    y += 90;
    topAreas.forEach((x) => {
      const tp = TYPES[x.key];
      ctx.fillStyle = '#fff'; ctx.font = '700 38px ' + F; ctx.textAlign = 'left';
      ctx.fillText(tp.area + ' · ' + tp.nick, 120, y);
      ctx.textAlign = 'right'; ctx.fillText(x.pct + '%', W - 120, y); ctx.textAlign = 'left';
      roundRect(ctx, 120, y + 24, W - 240, 30, 15); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill();
      roundRect(ctx, 120, y + 24, Math.max(30, (W - 240) * x.pct / 100), 30, 15); ctx.fillStyle = '#fff'; ctx.fill();
      y += 130;
    });
    y += 120;

    // Carrera elegida
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '700 34px ' + F;
    ctx.fillText(chosenCareer ? 'LA CARRERA QUE ELEGÍ' : 'ESTOY EXPLORANDO', 90, y);
    ctx.fillStyle = '#fde68a'; ctx.font = '800 72px ' + F;
    wrapText(ctx, chosenCareer || (rankedCareers()[0] ? rankedCareers()[0].c.name + '…' : top.area), W - 180).slice(0, 3).forEach((ln, i) => ctx.fillText(ln, 90, y + 90 + i * 84));

    // Pie
    roundRect(ctx, 70, H - 300, W - 140, 200, 40); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = '#1c1d33'; ctx.textAlign = 'center'; ctx.font = '800 46px ' + F;
    ctx.fillText('¿Y tú? ¡Haz el test! 🚀', W / 2, H - 205);
    const handle = socialLinks()[0];
    ctx.fillStyle = '#7c3aed'; ctx.font = '700 38px ' + F;
    ctx.fillText(handle ? 'Sígueme en @' + handle.user : 'Mi Sueño, Mi Carrera', W / 2, H - 145);
    return new Promise((resolve) => cv.toBlob((b) => resolve(b), 'image/png'));
  }

  async function shareResult() {
    if (answeredCount() < 3) { toast('Responde el test para crear tu imagen.', 'info'); return; }
    toast('Creando tu imagen…', 'auto_awesome');
    const blob = await makeShareImage();
    if (!blob) { toast('No se pudo crear la imagen en este navegador.', 'error'); return; }
    const url = URL.createObjectURL(blob);
    const file = new File([blob], 'mi-resultado-vocacional.png', { type: 'image/png' });
    const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
    const handle = socialLinks()[0];
    const body = $('tool-body');
    body.innerHTML =
      '<p class="result-kicker" style="text-align:center">Compartir en redes</p>' +
      '<h2 id="tool-title" style="text-align:center">¡Tu imagen está lista! 🎉</h2>' +
      '<img class="share-preview" alt="Vista previa de tu resultado para compartir">' +
      '<p class="pick-intro" style="text-align:center">Súbela a tu historia de Instagram, TikTok o Facebook' + (handle ? ' y etiqueta a <b>@' + escapeHtml(handle.user) + '</b>' : '') + '.</p>' +
      '<div class="modal-actions">' +
        (canShare ? '<button type="button" class="primary-button" id="share-native"><span class="material-symbols-outlined" aria-hidden="true">ios_share</span> Compartir</button>' : '') +
        '<a class="' + (canShare ? 'secondary-button' : 'primary-button') + '" id="share-download" download="mi-resultado-vocacional.png"><span class="material-symbols-outlined" aria-hidden="true">download</span> Descargar imagen</a>' +
      '</div>';
    body.querySelector('.share-preview').src = url;
    $('share-download').href = url;
    if (canShare) {
      $('share-native').addEventListener('click', () => {
        navigator.share({ files: [file], title: 'Mi resultado vocacional', text: '¡Descubrí mi área vocacional! ¿Y tú?' }).catch(() => { /* cancelado */ });
      });
    }
    openModal('tool-modal');
  }

  /* =========================================================
     AGENDAR CITA
     ========================================================= */
  function isoDate(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function showCita() {
    const cfg = CONFIG.citas;
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    while (cfg.diasNoDisponibles.indexOf(tomorrow.getDay()) !== -1) tomorrow.setDate(tomorrow.getDate() + 1);
    const max = new Date(); max.setDate(max.getDate() + 60);
    const body = $('tool-body');
    body.innerHTML =
      '<div class="tool-head"><span class="tool-icon material-symbols-outlined" aria-hidden="true">event_available</span>' +
        '<div><p class="result-kicker">Orientación personalizada</p><h2 id="tool-title">Agenda tu cita</h2></div></div>' +
      '<p class="pick-intro">Elige el día y la hora que prefieras. Te confirmaré por WhatsApp.</p>' +
      '<form id="cita-form" class="tool-form" novalidate>' +
        '<div class="form-row"><label>Nombre<input id="cita-name" required autocomplete="name"></label>' +
        '<label>Celular (WhatsApp)<input id="cita-phone" type="tel" inputmode="tel" required placeholder="9XX XXX XXX" autocomplete="tel"></label></div>' +
        '<div class="form-row"><label>Fecha<input id="cita-date" type="date" required min="' + isoDate(tomorrow) + '" max="' + isoDate(max) + '" value="' + isoDate(tomorrow) + '"></label>' +
        '<label>Modalidad<select id="cita-mode">' + cfg.modalidades.map((m) => '<option>' + escapeHtml(m) + '</option>').join('') + '</select></label></div>' +
        '<fieldset class="hour-grid"><legend>Hora</legend>' +
          cfg.horas.map((h, i) => '<label><input type="radio" name="cita-hour" value="' + h + '"' + (i === 0 ? ' checked' : '') + '><span>' + h + '</span></label>').join('') +
        '</fieldset>' +
        '<label>¿Quién solicita la cita?<select id="cita-who"><option>Estudiante</option><option>Padre / madre de familia</option><option>Tutor/a o docente</option></select></label>' +
        '<label>¿De qué quieres conversar? <small>(opcional)</small><textarea id="cita-topic" rows="2" placeholder="Ej.: dudo entre dos carreras, quiero saber de becas…"></textarea></label>' +
        '<p class="field-error" id="cita-error" aria-live="polite"></p>' +
        '<button type="submit" class="wa-button block"><span class="material-symbols-outlined" aria-hidden="true">send</span> Solicitar cita por WhatsApp</button>' +
      '</form>';
    $('cita-name').value = displayName();
    $('cita-phone').value = store.get('msmc_phone_' + userId(), '') || '';
    $('cita-form').addEventListener('submit', submitCita);
    openModal('tool-modal');
  }

  function submitCita(e) {
    e.preventDefault();
    const err = $('cita-error');
    const name = $('cita-name').value.trim();
    const phone = $('cita-phone').value.replace(/[^\d+]/g, '');
    const date = $('cita-date').value;
    const hourEl = document.querySelector('input[name="cita-hour"]:checked');
    err.textContent = '';
    if (name.length < 2) { err.textContent = 'Escribe tu nombre.'; $('cita-name').focus(); return; }
    if (phone.replace(/\D/g, '').length < 9) { err.textContent = 'Escribe un número de celular válido (9 dígitos).'; $('cita-phone').focus(); return; }
    if (!date) { err.textContent = 'Elige una fecha.'; return; }
    const d = new Date(date + 'T12:00:00');
    if (CONFIG.citas.diasNoDisponibles.indexOf(d.getDay()) !== -1) { err.textContent = 'Ese día no hay atención. Elige otra fecha.'; $('cita-date').focus(); return; }
    if (date < $('cita-date').min) { err.textContent = 'Elige una fecha a partir de mañana.'; return; }
    store.set('msmc_phone_' + userId(), phone);
    const fecha = d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
    const r = resultSummary();
    const topic = $('cita-topic').value.trim();
    const msg = 'Hola, soy ' + name + '. Quisiera agendar una cita de orientación vocacional:\n' +
      '📅 Fecha: ' + fecha + '\n🕒 Hora: ' + hourEl.value + '\n💻 Modalidad: ' + $('cita-mode').value +
      '\n👤 Solicita: ' + $('cita-who').value + '\n📱 Celular: ' + phone +
      (getSchool() ? '\n🏫 Colegio: ' + getSchool() : '') +
      (r.area1 && r.total >= 8 ? '\n🧭 Mi área en el test: ' + r.area1 : '') +
      (chosenCareer ? '\n🎓 Carrera elegida: ' + chosenCareer : '') +
      (topic ? '\n💬 Tema: ' + topic : '');
    syncToSheets('cita', true, { citaFecha: date, citaHora: hourEl.value, modalidad: $('cita-mode').value, celular: phone, solicita: $('cita-who').value, tema: topic, nombre: name });
    closeModal(true);
    planAuto('cita');
    openWhatsApp(msg);
    toast('¡Listo! Envía el mensaje en WhatsApp para confirmar tu cita.', 'event_available');
  }

  /* =========================================================
     CÓDIGO DE COLEGIO + PANEL DEL TUTOR
     ========================================================= */
  function showSchool() {
    const body = $('tool-body');
    body.innerHTML =
      '<div class="tool-head"><span class="tool-icon material-symbols-outlined" aria-hidden="true">school</span>' +
        '<div><p class="result-kicker">Mi colegio</p><h2 id="tool-title">Código de tu colegio o salón</h2></div></div>' +
      '<p class="pick-intro">Si tu tutor/a te dio un código (por ejemplo <b>IE-MARISCAL-5B</b>), escríbelo aquí para que pueda ver el resumen de tu salón.</p>' +
      '<form id="school-form" class="tool-form" novalidate><label>Código<input id="school-code" maxlength="30" placeholder="Ej.: IE-MARISCAL-5B" autocomplete="off"></label>' +
      '<button type="submit" class="primary-button block">Guardar código</button></form>';
    $('school-code').value = getSchool();
    $('school-form').addEventListener('submit', (e) => {
      e.preventDefault();
      setSchool($('school-code').value);
      renderSchoolChip();
      if (state.completed) syncToSheets('resultado', true);
      closeModal(true);
      toast(getSchool() ? 'Código guardado: ' + getSchool() : 'Quitaste el código de colegio.', 'school');
    });
    openModal('tool-modal');
  }

  function renderSchoolChip() {
    const el = $('school-chip');
    if (!el) return;
    const code = getSchool();
    el.lastElementChild.textContent = code ? code : 'Agregar código de colegio';
    el.classList.toggle('has-code', !!code);
  }

  let panelRows = [];
  function showTutorPanel() {
    const body = $('tool-body');
    if (!CONFIG.sheetsUrl) {
      body.innerHTML =
        '<div class="tool-head"><span class="tool-icon material-symbols-outlined" aria-hidden="true">monitoring</span>' +
          '<div><p class="result-kicker">Panel del tutor</p><h2 id="tool-title">Falta conectar Google Sheets</h2></div></div>' +
        '<p class="pick-intro">Para ver los resultados de tus estudiantes desde cualquier equipo, conecta la página a una hoja de Google Sheets. ' +
        'Las instrucciones están al final del archivo <b>script.js</b> (sección "CONECTAR GOOGLE SHEETS") y solo toman unos minutos.</p>' +
        '<ol class="pr-steps"><li>Crea una hoja de cálculo en Google Sheets.</li><li>Pega el código de Apps Script que está en script.js.</li>' +
        '<li>Publícalo como "Aplicación web" y copia la URL.</li><li>Pégala en <b>CONFIG.sheetsUrl</b>.</li></ol>';
      openModal('tool-modal');
      return;
    }
    body.innerHTML =
      '<div class="tool-head"><span class="tool-icon material-symbols-outlined" aria-hidden="true">monitoring</span>' +
        '<div><p class="result-kicker">Panel del tutor</p><h2 id="tool-title">Resultados de tus estudiantes</h2></div></div>' +
      '<form id="panel-form" class="tool-form" novalidate><div class="form-row">' +
        '<label>Código de colegio <small>(vacío = todos)</small><input id="panel-code" placeholder="Ej.: IE-MARISCAL-5B" autocomplete="off"></label>' +
        '<label>Clave del tutor<input id="panel-key" type="password" required autocomplete="current-password"></label></div>' +
        '<p class="field-error" id="panel-error" aria-live="polite"></p>' +
        '<button type="submit" class="primary-button block"><span class="material-symbols-outlined" aria-hidden="true">search</span> Ver resultados</button></form>' +
      '<div id="panel-out"></div>';
    $('panel-code').value = store.get('msmc_panel_code', '') || '';
    $('panel-form').addEventListener('submit', loadPanel);
    openModal('tool-modal');
  }

  async function loadPanel(e) {
    e.preventDefault();
    const code = $('panel-code').value.trim().toUpperCase();
    const key = $('panel-key').value;
    const err = $('panel-error');
    const btn = e.currentTarget.querySelector('button[type="submit"]');
    err.textContent = '';
    if (!key) { err.textContent = 'Escribe la clave del tutor.'; return; }
    store.set('msmc_panel_code', code);
    setLoading(btn, true);
    try {
      const url = CONFIG.sheetsUrl + (CONFIG.sheetsUrl.indexOf('?') === -1 ? '?' : '&') +
        'action=panel&code=' + encodeURIComponent(code) + '&key=' + encodeURIComponent(key);
      const res = await fetch(url);
      const data = await res.json();
      setLoading(btn, false);
      if (!data.ok) { err.textContent = data.error || 'Clave incorrecta.'; return; }
      panelRows = data.rows || [];
      renderPanel(code);
    } catch (ex) {
      setLoading(btn, false);
      err.textContent = 'No se pudo conectar con Google Sheets. Revisa la URL y que el script esté publicado para "Cualquier persona".';
    }
  }

  function renderPanel(code) {
    const out = $('panel-out');
    // Último registro de cada estudiante (resultados)
    const latest = {};
    panelRows.filter((r) => r.tipo !== 'cita').forEach((r) => { latest[(r.correo || r.nombre || '').toLowerCase()] = r; });
    const students = Object.keys(latest).map((k) => latest[k]);
    const citas = panelRows.filter((r) => r.tipo === 'cita');
    if (!students.length && !citas.length) {
      out.innerHTML = '<p class="muted" style="margin-top:1rem">Aún no hay registros' + (code ? ' para el código ' + escapeHtml(code) : '') + '.</p>';
      return;
    }
    const count = (field) => {
      const m = {};
      students.forEach((s) => { if (s[field]) m[s[field]] = (m[s[field]] || 0) + 1; });
      return Object.keys(m).map((k) => [k, m[k]]).sort((a, b) => b[1] - a[1]);
    };
    const areas = count('area1');
    const careers = count('carrera').slice(0, 6);
    const colorOf = (area) => { const k = TYPE_ORDER.find((o) => TYPES[o].area === area); return k ? TYPES[k].color : '#7c3aed'; };
    out.innerHTML =
      '<div class="panel-stats"><div><b>' + students.length + '</b><small>estudiantes</small></div>' +
        '<div><b>' + students.filter((s) => s.carrera).length + '</b><small>eligieron carrera</small></div>' +
        '<div><b>' + citas.length + '</b><small>citas solicitadas</small></div></div>' +
      '<h3>Tipo principal (RIASEC)</h3><div class="result-bars">' +
        areas.map((a) => '<div class="bar-row" style="--c:' + colorOf(a[0]) + '"><span>' + escapeHtml(a[0]) + '</span><strong>' + a[1] + '</strong><div class="bar"><i style="width:' + Math.round(a[1] / students.length * 100) + '%"></i></div></div>').join('') +
      '</div>' +
      (careers.length ? '<h3>Carreras más elegidas</h3><ol class="pr-steps">' + careers.map((c) => '<li>' + escapeHtml(c[0]) + ' <small>(' + c[1] + ')</small></li>').join('') + '</ol>' : '') +
      '<h3>Estudiantes</h3><div class="panel-table"><table><thead><tr><th>Nombre</th><th>Colegio</th><th>Código</th><th>Tipo principal</th><th>Carrera</th><th>Fecha</th></tr></thead><tbody>' +
        students.map((s) => '<tr><td>' + escapeHtml(s.nombre || '') + '</td><td>' + escapeHtml(s.colegio || '') + '</td><td><b>' + escapeHtml(s.codigo || '') + '</b></td><td>' + escapeHtml(s.area1 || '') + '</td><td>' + escapeHtml(s.carrera || '—') + '</td><td>' + escapeHtml(String(s.fecha || '').slice(0, 10)) + '</td></tr>').join('') +
      '</tbody></table></div>' +
      (citas.length ? '<h3>Citas</h3><div class="panel-table"><table><thead><tr><th>Nombre</th><th>Fecha cita</th><th>Hora</th><th>Modalidad</th><th>Celular</th></tr></thead><tbody>' +
        citas.map((s) => '<tr><td>' + escapeHtml(s.nombre || '') + '</td><td>' + escapeHtml(s.citaFecha || '') + '</td><td>' + escapeHtml(s.citaHora || '') + '</td><td>' + escapeHtml(s.modalidad || '') + '</td><td>' + escapeHtml(s.celular || '') + '</td></tr>').join('') +
        '</tbody></table></div>' : '') +
      '<div class="modal-actions"><button type="button" class="secondary-button" id="panel-csv"><span class="material-symbols-outlined" aria-hidden="true">download</span> Descargar Excel (CSV)</button></div>';
    $('panel-csv').addEventListener('click', () => {
      const cols = ['fecha', 'tipo', 'nombre', 'correo', 'colegio', 'codigo', 'area1', 'area2', 'detalle', 'carrera', 'citaFecha', 'citaHora', 'modalidad', 'celular', 'tema', 'historia', 'autoriza'];
      const csv = [cols.join(';')].concat(panelRows.map((r) => cols.map((c) => '"' + String(r[c] == null ? '' : r[c]).replace(/"/g, '""') + '"').join(';'))).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
      a.download = 'resultados-' + (code || 'todos') + '.csv';
      document.body.appendChild(a); a.click(); a.remove();
    });
  }

  /* =========================================================
     MODO OSCURO
     ========================================================= */
  function currentTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('[data-action="theme"]').forEach((b) => {
      const icon = b.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = t === 'dark' ? 'light_mode' : 'dark_mode';
      b.setAttribute('aria-label', t === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
      b.title = b.getAttribute('aria-label');
      const label = b.querySelector('.theme-label');
      if (label) label.textContent = t === 'dark' ? 'Modo claro' : 'Modo oscuro';
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#12142b' : '#7c3aed');
  }
  function toggleTheme() {
    const t = currentTheme() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('msmc_theme', t); } catch (e) { /* noop */ }
    applyTheme(t);
  }

  /* =========================================================
     INSTALAR EN EL CELULAR
     ========================================================= */
  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; });

  function setupAppIcon() {
    // Genera el ícono de la app (para "Agregar a pantalla de inicio") a partir del favicon
    const fav = document.querySelector('link[rel="icon"]');
    if (!fav) return;
    const img = new Image();
    img.onload = () => {
      try {
        const make = (size) => { const cv = document.createElement('canvas'); cv.width = cv.height = size; cv.getContext('2d').drawImage(img, 0, 0, size, size); return cv.toDataURL('image/png'); };
        const touch = document.createElement('link');
        touch.rel = 'apple-touch-icon'; touch.href = make(180);
        document.head.appendChild(touch);
        if (location.protocol.indexOf('http') === 0) {
          const manifest = {
            name: 'Mi Sueño, Mi Carrera', short_name: 'Mi Carrera', start_url: location.href.split('#')[0],
            display: 'standalone', background_color: '#f7f8ff', theme_color: '#7c3aed',
            icons: [{ src: make(192), sizes: '192x192', type: 'image/png' }, { src: make(512), sizes: '512x512', type: 'image/png' }]
          };
          const link = document.createElement('link');
          link.rel = 'manifest';
          link.href = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' }));
          document.head.appendChild(link);
        }
      } catch (e) { /* noop */ }
    };
    img.src = fav.href;
  }

  function showInstall() {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.finally(() => { installPrompt = null; });
      return;
    }
    const ua = navigator.userAgent || '';
    const ios = /iPhone|iPad|iPod/i.test(ua);
    const body = $('tool-body');
    body.innerHTML =
      '<div class="tool-head"><span class="tool-icon material-symbols-outlined" aria-hidden="true">install_mobile</span>' +
        '<div><p class="result-kicker">Tenla a un toque</p><h2 id="tool-title">Instala la página en tu celular</h2></div></div>' +
      '<div class="install-steps">' +
        '<div class="' + (ios ? '' : 'is-current') + '"><b><span class="material-symbols-outlined" aria-hidden="true">android</span> Android (Chrome)</b>' +
          '<ol><li>Toca el menú <b>⋮</b> arriba a la derecha.</li><li>Elige <b>"Agregar a la pantalla principal"</b> o <b>"Instalar app"</b>.</li><li>Confirma con <b>Agregar</b>.</li></ol></div>' +
        '<div class="' + (ios ? 'is-current' : '') + '"><b><span class="material-symbols-outlined" aria-hidden="true">phone_iphone</span> iPhone (Safari)</b>' +
          '<ol><li>Toca el botón <b>Compartir</b> (cuadrado con flecha).</li><li>Elige <b>"Agregar a inicio"</b>.</li><li>Toca <b>Agregar</b>.</li></ol></div>' +
      '</div>' +
      '<p class="result-note">Aparecerá el ícono de Mi Sueño, Mi Carrera en tu pantalla, como una app.</p>';
    openModal('tool-modal');
  }

  /* =========================================================
     ACCIONES GLOBALES (botones con data-action / data-compare)
     ========================================================= */
  function initFeatures() {
    applyTheme(currentTheme());
    setupAppIcon();
    document.addEventListener('click', (e) => {
      const cmp = e.target.closest('[data-compare]');
      if (cmp) { e.preventDefault(); showCompare(Number(cmp.dataset.compare)); return; }
      const a = e.target.closest('[data-action]');
      if (!a) return;
      const act = a.dataset.action;
      const handlers = { pdf: printReport, 'share-image': shareResult, cita: showCita, theme: toggleTheme, install: showInstall, tutor: showTutorPanel, school: showSchool, lang: toggleLang, story: showStory, privacy: showPrivacy, qr: showQr };
      if (!handlers[act]) return;
      e.preventDefault();
      if (!$('mobile-nav').hidden) toggleMenu(false);
      if (!$('wa-panel').hidden) toggleWaPanel(false);
      handlers[act]();
    });
  }

  /* =========================================================
     IDIOMA (Español / Runasimi)
     ========================================================= */
  function applyLang(silent) {
    document.documentElement.lang = lang === 'qu' ? 'qu' : 'es';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (el.dataset.es === undefined) el.dataset.es = el.textContent;
      const key = el.dataset.i18n;
      el.textContent = lang === 'qu' && QU[key] ? QU[key] : el.dataset.es;
    });
    document.querySelectorAll('.lang-label').forEach((el) => { el.textContent = lang === 'qu' ? 'Español' : 'Runasimi'; });
    document.querySelectorAll('.lang-code').forEach((el) => { el.textContent = lang === 'qu' ? 'ES' : 'QU'; });
    document.querySelectorAll('[data-action="lang"]').forEach((b) => b.setAttribute('aria-label', lang === 'qu' ? 'Cambiar a español' : 'Cambiar a quechua (Runasimi)'));
    const speak = $('speak-btn');
    if (speak) speak.hidden = lang === 'qu' || !canSpeak();
    if (!$('auth-screen').hidden) switchTab($('tab-register').getAttribute('aria-selected') === 'true' ? 'register' : 'login');
    if (currentUser) { renderQuestion(false); renderPlan(); }
    if (!silent && lang === 'qu') toast('Runasimipi: test, menú hinaspa lluqsiykuna. (Traducción inicial en revisión.)', 'translate');
  }
  function toggleLang() {
    lang = lang === 'qu' ? 'es' : 'qu';
    try { localStorage.setItem('msmc_lang', lang); } catch (e) { /* noop */ }
    applyLang(false);
  }

  /* =========================================================
     MI PLAN DE ACCIÓN
     ========================================================= */
  const PLAN = [
    { id: 'test',        es: 'Hacer el test vocacional',                    qu: 'Test vocacionalta ruray',             go: '#test',       auto: true },
    { id: 'carrera',     es: 'Elegir una carrera que me atraiga',           qu: 'Munasqay carrerata akllay',            go: '#carreras',   auto: true },
    { id: 'comparar',    es: 'Comparar 2 o 3 carreras',                     qu: '2 utaq 3 carrerakunata tupachiy',      go: '#carreras',   auto: true },
    { id: 'familia',     es: 'Conversar mis resultados con mi familia',      qu: 'Ayllüywan lluqsiyniykunata rimay',     go: 'pdf' },
    { id: 'universidad', es: 'Revisar universidades y requisitos de admisión', qu: 'Universidadkunata, requisitokunata qaway', go: '#carreras' },
    { id: 'becas',       es: 'Averiguar si puedo postular a una beca',      qu: 'Becaman postulayta atisqayta yachay',  go: '#becas' },
    { id: 'visita',      es: 'Visitar una universidad o feria vocacional',  qu: 'Universidadta utaq feriata watukuy',   go: '#calendario' },
    { id: 'cita',        es: 'Tener una cita de orientación',               qu: 'Orientación citata ruray',             go: 'cita',        auto: true }
  ];
  function planKey() { return 'msmc_plan_' + userId(); }
  function getPlan() { return store.get(planKey(), {}) || {}; }
  function planAuto(id) {
    if (!currentUser) return;
    const p = getPlan();
    if (p[id]) return;
    p[id] = Date.now();
    store.set(planKey(), p);
    renderPlan();
  }
  function renderPlan() {
    const list = $('plan-list');
    if (!list || !currentUser) return;
    const p = getPlan();
    if (state.completed && !p.test) { p.test = Date.now(); store.set(planKey(), p); }
    if (chosenCareer && !p.carrera) { p.carrera = Date.now(); store.set(planKey(), p); }
    list.innerHTML = '';
    let done = 0;
    PLAN.forEach((it) => {
      const isDone = !!p[it.id];
      if (isDone) done++;
      const li = document.createElement('li');
      li.className = isDone ? 'is-done' : '';
      li.innerHTML = '<label><input type="checkbox" data-plan="' + it.id + '"' + (isDone ? ' checked' : '') + '><span class="plan-check" aria-hidden="true">✓</span><span class="plan-text"></span></label>' +
        (isDone ? '' : '<button type="button" class="plan-go" data-plan-go="' + it.go + '" aria-label="Ir"><span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></button>');
      li.querySelector('.plan-text').textContent = lang === 'qu' ? it.qu : it.es;
      list.appendChild(li);
    });
    $('plan-badge').textContent = done + '/' + PLAN.length;
    $('plan-fill').style.width = Math.round(done / PLAN.length * 100) + '%';
    $('plan-title').textContent = lang === 'qu' ? 'Ruranay plan' : (done === PLAN.length ? '¡Plan completado! 🎉' : 'Mi plan de acción');
  }
  function initPlan() {
    const tg = $('plan-toggle');
    tg.addEventListener('click', () => {
      const open = !$('plan-card').classList.contains('open');
      $('plan-card').classList.toggle('open', open);
      tg.setAttribute('aria-expanded', String(open));
    });
    // En pantallas grandes, los detalles de becas aparecen abiertos
    if (window.matchMedia('(min-width: 641px)').matches) {
      document.querySelectorAll('[data-open-desktop]').forEach((d) => { d.open = true; });
    }
    $('plan-list').addEventListener('change', (e) => {
      const id = e.target.dataset.plan;
      if (!id) return;
      const p = getPlan();
      if (e.target.checked) p[id] = Date.now(); else delete p[id];
      store.set(planKey(), p);
      renderPlan();
      if (e.target.checked && Object.keys(p).length === PLAN.length) toast('¡Completaste tu plan de acción! Estás listo/a para decidir. 🎉', 'celebration');
    });
    $('plan-list').addEventListener('click', (e) => {
      const go = e.target.closest('[data-plan-go]');
      if (!go) return;
      const target = go.dataset.planGo;
      if (target === 'pdf') { state.completed ? printReport() : toast('Primero termina el test.', 'info'); return; }
      if (target === 'cita') { showCita(); return; }
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* =========================================================
     CALENDARIO DE FECHAS IMPORTANTES
     ========================================================= */
  const CAL_TYPES = {
    admision: { label: 'Admisión', icon: 'school', color: '#7c3aed' },
    beca:     { label: 'Beca',     icon: 'workspace_premium', color: '#f59e0b' },
    feria:    { label: 'Feria',    icon: 'festival', color: '#06b6d4' },
    otro:     { label: 'Fecha',    icon: 'event', color: '#ff5a5f' }
  };
  let showPastDates = false;
  function parseDay(str) { return str ? new Date(str + 'T12:00:00') : null; }
  function daysUntil(d) { const t0 = new Date(); t0.setHours(12, 0, 0, 0); return Math.round((d - t0) / 86400000); }
  function renderCalendar() {
    const box = $('cal-list');
    if (!box) return;
    const items = (CONFIG.calendario || []).map((ev, i) => Object.assign({ i: i, d: parseDay(ev.fecha) }, ev));
    const upcoming = items.filter((ev) => !ev.d || daysUntil(ev.d) >= 0)
      .sort((a, b) => (a.d ? a.d.getTime() : Infinity) - (b.d ? b.d.getTime() : Infinity));
    const past = items.filter((ev) => ev.d && daysUntil(ev.d) < 0).sort((a, b) => b.d - a.d);
    box.innerHTML = '';
    const draw = (ev, isPast) => {
      const tp = CAL_TYPES[ev.tipo] || CAL_TYPES.otro;
      const card = document.createElement('article');
      card.className = 'cal-card' + (isPast ? ' is-past' : '');
      card.style.setProperty('--c', tp.color);
      const left = ev.d ? daysUntil(ev.d) : null;
      const when = !ev.d ? 'Fecha por confirmar' : isPast ? 'Ya pasó' : left === 0 ? '¡Es hoy!' : left === 1 ? '¡Es mañana!' : 'Faltan ' + left + ' días';
      card.innerHTML =
        '<div class="cal-date">' + (ev.d
          ? '<b>' + ev.d.getDate() + '</b><span>' + ev.d.toLocaleDateString('es-PE', { month: 'short' }).replace('.', '') + '</span><small>' + ev.d.getFullYear() + '</small>'
          : '<span class="material-symbols-outlined" aria-hidden="true">event_upcoming</span><small>Por confirmar</small>') + '</div>' +
        '<div class="cal-body"><span class="cal-tag"><span class="material-symbols-outlined" aria-hidden="true">' + tp.icon + '</span>' + tp.label + '</span>' +
          '<h3></h3><p></p><span class="cal-when' + (left !== null && left >= 0 && left <= 7 ? ' soon' : '') + '">' + when + '</span></div>' +
        '<div class="cal-actions"></div>';
      card.querySelector('h3').textContent = ev.titulo;
      card.querySelector('p').textContent = ev.detalle || '';
      const actions = card.querySelector('.cal-actions');
      if (ev.d && !isPast) {
        const g = document.createElement('a');
        g.className = 'soft-button'; g.target = '_blank'; g.rel = 'noopener noreferrer';
        const ymd = ev.fecha.replace(/-/g, '');
        const nextDay = new Date(ev.d.getTime() + 86400000);
        const ymd2 = nextDay.getFullYear() + String(nextDay.getMonth() + 1).padStart(2, '0') + String(nextDay.getDate()).padStart(2, '0');
        g.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(ev.titulo) +
          '&dates=' + ymd + '/' + ymd2 + '&details=' + encodeURIComponent((ev.detalle || '') + (ev.url ? '\n' + ev.url : ''));
        g.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">calendar_add_on</span> Google Calendar';
        actions.appendChild(g);
        const ics = document.createElement('button');
        ics.type = 'button'; ics.className = 'soft-button'; ics.dataset.ics = String(ev.i);
        ics.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">download</span> Celular (.ics)';
        actions.appendChild(ics);
      }
      if (ev.url) {
        const a = document.createElement('a');
        a.className = 'link-button'; a.href = ev.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.textContent = 'Web oficial ↗';
        actions.appendChild(a);
      } else if (!isPast) {
        const w = document.createElement('button');
        w.type = 'button'; w.className = 'link-button'; w.dataset.whatsapp = 'orientacion';
        w.textContent = 'Escríbeme ↗';
        actions.appendChild(w);
      }
      box.appendChild(card);
    };
    upcoming.forEach((ev) => draw(ev, false));
    if (!upcoming.length) box.innerHTML = '<p class="muted" style="text-align:center">No hay fechas próximas registradas por ahora.</p>';
    if (past.length) {
      const tg = document.createElement('button');
      tg.type = 'button'; tg.className = 'secondary-button cal-past-toggle'; tg.id = 'cal-past';
      tg.textContent = showPastDates ? 'Ocultar fechas pasadas' : 'Ver fechas pasadas (' + past.length + ')';
      box.appendChild(tg);
      if (showPastDates) past.forEach((ev) => draw(ev, true));
    }
  }
  function downloadIcs(i) {
    const ev = CONFIG.calendario[i];
    if (!ev || !ev.fecha) return;
    const d = parseDay(ev.fecha);
    const n = new Date(d.getTime() + 86400000);
    const f = (x) => x.getFullYear() + String(x.getMonth() + 1).padStart(2, '0') + String(x.getDate()).padStart(2, '0');
    const esc = (x) => String(x || '').replace(/[,;\\]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mi Sueno Mi Carrera//ES', 'BEGIN:VEVENT',
      'UID:msmc-' + i + '-' + ev.fecha + '@misuenomicarrera', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
      'DTSTART;VALUE=DATE:' + f(d), 'DTEND;VALUE=DATE:' + f(n), 'SUMMARY:' + esc(ev.titulo), 'DESCRIPTION:' + esc((ev.detalle || '') + (ev.url ? ' ' + ev.url : '')),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(ev.titulo), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'fecha-' + ev.fecha + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    toast('Ábrelo para agregarlo a tu calendario. Te recordará un día antes.', 'event');
  }
  function initCalendar() {
    renderCalendar();
    $('cal-list').addEventListener('click', (e) => {
      const ics = e.target.closest('[data-ics]');
      if (ics) { downloadIcs(Number(ics.dataset.ics)); return; }
      if (e.target.closest('#cal-past')) { showPastDates = !showPastDates; renderCalendar(); }
    });
  }

  /* =========================================================
     COMPARTE TU HISTORIA (testimonios reales)
     ========================================================= */
  function showStory() {
    const body = $('tool-body');
    body.innerHTML =
      '<div class="tool-head"><span class="tool-icon material-symbols-outlined" aria-hidden="true">auto_stories</span>' +
        '<div><p class="result-kicker">Testimonios</p><h2 id="tool-title">Comparte tu historia</h2></div></div>' +
      '<p class="pick-intro">Cuéntanos cómo elegiste tu carrera. Revisaremos tu historia antes de publicarla y solo usaremos tu nombre si nos das permiso.</p>' +
      '<form id="story-form" class="tool-form" novalidate>' +
        '<div class="form-row"><label>Tu nombre<input id="story-name" required autocomplete="given-name"></label>' +
        '<label>¿Qué estudias o estudiarás?<input id="story-career" list="story-careers" required placeholder="Ej.: Enfermería en la UNSCH"></label></div>' +
        '<datalist id="story-careers">' + CAREERS.map((c) => '<option value="' + escapeHtml(c.name) + '">').join('') + '</datalist>' +
        '<label>Tu historia <small>(máx. 400 caracteres)</small><textarea id="story-text" rows="4" maxlength="400" required placeholder="¿Qué dudas tenías? ¿Qué te ayudó a decidir?"></textarea></label>' +
        '<label class="check"><input type="checkbox" id="story-ok"> <span>Autorizo publicar mi historia con mi nombre. Si soy menor de edad, tengo el permiso de mi padre, madre o apoderado.</span></label>' +
        '<p class="field-error" id="story-error" aria-live="polite"></p>' +
        '<button type="submit" class="primary-button block"><span class="material-symbols-outlined" aria-hidden="true">send</span> Enviar mi historia</button>' +
      '</form>';
    $('story-name').value = displayName();
    if (chosenCareer) $('story-career').value = chosenCareer;
    $('story-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('story-name').value.trim(), career = $('story-career').value.trim(), text = $('story-text').value.trim();
      const err = $('story-error');
      err.textContent = '';
      if (name.length < 2 || career.length < 3) { err.textContent = 'Completa tu nombre y tu carrera.'; return; }
      if (text.length < 30) { err.textContent = 'Cuéntanos un poco más (al menos 30 caracteres).'; $('story-text').focus(); return; }
      if (!$('story-ok').checked) { err.textContent = 'Necesitamos tu autorización para publicar la historia.'; return; }
      syncToSheets('testimonio', true, { nombre: name, carrera: career, historia: text, autoriza: 'Sí' });
      closeModal(true);
      openWhatsApp('Hola, soy ' + name + ' y quiero compartir mi historia para Mi Sueño, Mi Carrera:\n🎓 ' + career + '\n💬 "' + text + '"\n✅ Autorizo publicarla con mi nombre.');
      toast('¡Gracias por compartir tu historia! 💜', 'favorite');
    });
    openModal('tool-modal');
  }

  /* =========================================================
     PRIVACIDAD Y DATOS PERSONALES
     ========================================================= */
  function showPrivacy() {
    const body = $('tool-body');
    const where = [
      '<li><b>En tu navegador:</b> tu cuenta de prueba, tus respuestas, tu carrera elegida y tu plan se guardan en este equipo.</li>',
      CONFIG.sheetsUrl ? '<li><b>Con tu orientadora (Google Sheets):</b> si marcas la casilla de compartir, se envían tu nombre, correo, código de colegio, resultado y carrera elegida. También las citas e historias que envíes.</li>' : '',
      CONFIG.firebase ? '<li><b>En la nube (Firebase de Google):</b> tu cuenta y tu progreso, para que entres desde cualquier dispositivo. La contraseña nunca la vemos.</li>' : ''
    ].join('');
    body.innerHTML =
      '<div class="tool-head"><span class="tool-icon material-symbols-outlined" aria-hidden="true">shield_person</span>' +
        '<div><p class="result-kicker">Ley N.° 29733 de Protección de Datos Personales</p><h2 id="tool-title">Tu privacidad</h2></div></div>' +
      '<div class="privacy-text">' +
        '<h3>¿Qué datos usamos y para qué?</h3><p>Solo los necesarios para darte orientación vocacional: tu nombre, tu correo (si creas cuenta), tus respuestas del test, la carrera que elijas y, si lo pides, tu celular para una cita. No los vendemos ni los usamos para publicidad.</p>' +
        '<h3>¿Dónde se guardan?</h3><ul>' + where + '</ul>' +
        '<h3>Menores de edad</h3><p>Si tienes menos de 14 años, necesitas la autorización de tu padre, madre o apoderado para crear una cuenta o enviar tus datos. Si tienes entre 14 y 17 años, te recomendamos revisar tus resultados en familia.</p>' +
        '<h3>Tus derechos</h3><p>Puedes pedir en cualquier momento ver, corregir o borrar tus datos (derechos de acceso, rectificación, cancelación y oposición). Escríbenos por WhatsApp y lo hacemos.</p>' +
        '<h3>Borrar tus datos de este equipo</h3><p>Este botón elimina tu progreso, tu elección y tu plan guardados en este navegador.</p>' +
      '</div>' +
      '<div class="modal-actions">' +
        '<button type="button" class="secondary-button" id="wipe-data"' + (currentUser ? '' : ' disabled') + '><span class="material-symbols-outlined" aria-hidden="true">delete</span> Borrar mis datos de este equipo</button>' +
        '<button type="button" class="wa-button" data-whatsapp="datos"><span class="material-symbols-outlined" aria-hidden="true">chat</span> Solicitar por WhatsApp</button>' +
      '</div>' +
      '<p class="result-note">Responsable: Mi Sueño, Mi Carrera · contacto por WhatsApp ' + escapeHtml(CONFIG.whatsappNumbers.map((w) => formatPhone(w.number)).join(' / ')) + '</p>';
    const wipe = $('wipe-data');
    if (wipe) wipe.addEventListener('click', () => {
      if (!currentUser || !window.confirm('¿Seguro? Se borrarán tus respuestas, tu carrera elegida y tu plan de este equipo.')) return;
      const id = userId();
      ['msmc_progress_', 'msmc_choice_', 'msmc_school_', 'msmc_plan_', 'msmc_consent_', 'msmc_phone_'].forEach((k) => store.remove(k + id));
      try { Object.keys(localStorage).filter((k) => k.indexOf('msmc_sent_' + id) === 0).forEach((k) => localStorage.removeItem(k)); } catch (e) { /* noop */ }
      if (!currentUser.guest && !currentUser.cloud) {
        const users = store.get(KEYS.users, {});
        delete users[id];
        store.set(KEYS.users, users);
      }
      closeModal(true);
      logout();
      toast('Tus datos se borraron de este equipo.', 'delete');
    });
    openModal('tool-modal');
  }

  /* =========================================================
     CÓDIGO QR Y AFICHE
     ========================================================= */
  function publicUrl() {
    if (CONFIG.siteUrl) return CONFIG.siteUrl;
    if (/^https?:/.test(location.protocol)) return location.href.split('#')[0];
    return '';
  }
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const sc = document.createElement('script');
      sc.src = src; sc.async = true; sc.onload = resolve; sc.onerror = reject;
      document.head.appendChild(sc);
    });
  }
  async function getQr(text) {
    if (typeof window.qrcode !== 'function') {
      try { await loadScript('https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js'); }
      catch (e) { await loadScript('https://unpkg.com/qrcode-generator@1.4.4/qrcode.js'); }
    }
    const qr = window.qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    return qr;
  }
  function drawQr(ctx, qr, x, y, size) {
    const n = qr.getModuleCount();
    const cell = size / n;
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#1c1d33';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(Math.floor(x + c * cell), Math.floor(y + r * cell), Math.ceil(cell), Math.ceil(cell));
  }
  async function showQr() {
    const url = publicUrl();
    const body = $('tool-body');
    if (!url) {
      body.innerHTML =
        '<div class="tool-head"><span class="tool-icon material-symbols-outlined" aria-hidden="true">qr_code_2</span>' +
          '<div><p class="result-kicker">Código QR y afiche</p><h2 id="tool-title">Primero publica tu página</h2></div></div>' +
        '<p class="pick-intro">Estás abriendo la página desde tu computadora, así que todavía no tiene una dirección en internet para el QR. Publícala gratis en 2 minutos:</p>' +
        '<ol class="pr-steps"><li>Entra a <a class="link-button" href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer">app.netlify.com/drop</a>.</li>' +
        '<li>Arrastra la carpeta con tus 3 archivos (index.html, style.css y script.js).</li>' +
        '<li>Netlify te dará un enlace (puedes cambiarle el nombre, por ejemplo <b>misuenomicarrera.netlify.app</b>).</li>' +
        '<li>Pega ese enlace en <b>CONFIG.siteUrl</b> en script.js y vuelve a subir la carpeta.</li></ol>' +
        '<p class="result-note">Abre la página publicada y toca otra vez "Código QR": ya podrás descargar el QR y el afiche.</p>';
      openModal('tool-modal');
      return;
    }
    body.innerHTML =
      '<div class="tool-head"><span class="tool-icon material-symbols-outlined" aria-hidden="true">qr_code_2</span>' +
        '<div><p class="result-kicker">Comparte la página</p><h2 id="tool-title">Código QR y afiche</h2></div></div>' +
      '<p class="pick-intro">Imprímelo para tu colegio, ferias vocacionales o súbelo a tus redes.</p>' +
      '<div class="qr-box"><canvas id="qr-canvas" width="480" height="480" aria-label="Código QR de la página"></canvas><p class="qr-url"></p></div>' +
      '<div class="modal-actions">' +
        '<button type="button" class="primary-button" id="qr-poster"><span class="material-symbols-outlined" aria-hidden="true">image</span> Descargar afiche</button>' +
        '<button type="button" class="secondary-button" id="qr-png"><span class="material-symbols-outlined" aria-hidden="true">download</span> Descargar solo el QR</button>' +
        '<button type="button" class="secondary-button" id="qr-copy"><span class="material-symbols-outlined" aria-hidden="true">content_copy</span> Copiar enlace</button>' +
      '</div>';
    body.querySelector('.qr-url').textContent = url;
    openModal('tool-modal');
    let qr;
    try { qr = await getQr(url); } catch (e) {
      body.querySelector('.qr-box').innerHTML = '<p class="muted">No se pudo crear el QR (revisa tu conexión a internet).</p>';
      return;
    }
    const cv = $('qr-canvas');
    const qctx = cv.getContext('2d');
    qctx.fillStyle = '#fff'; qctx.fillRect(0, 0, cv.width, cv.height);
    drawQr(qctx, qr, 40, 40, 400);
    const dl = (canvas, name) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png'); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
    };
    $('qr-png').addEventListener('click', () => dl(cv, 'qr-mi-sueno-mi-carrera.png'));
    $('qr-copy').addEventListener('click', () => copyText(url).then((ok) => toast(ok ? 'Enlace copiado.' : url, 'content_copy')));
    $('qr-poster').addEventListener('click', async () => {
      const W = 1240, H = 1754;
      const pc = document.createElement('canvas'); pc.width = W; pc.height = H;
      const ctx = pc.getContext('2d');
      try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) { /* noop */ }
      const F = '"Plus Jakarta Sans", "Inter", system-ui, sans-serif';
      ctx.fillStyle = '#f7f8ff'; ctx.fillRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, W, 640);
      g.addColorStop(0, '#ff5a5f'); g.addColorStop(0.5, '#7c3aed'); g.addColorStop(1, '#06b6d4');
      ctx.fillStyle = g; roundRect(ctx, 0, -60, W, 700, 80); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = '800 58px ' + F; ctx.fillText('Mi Sueño, Mi Carrera', W / 2, 140);
      ctx.font = '800 92px ' + F; ctx.fillText('¿No sabes qué', W / 2, 300); ctx.fillText('estudiar? 🤔', W / 2, 405);
      ctx.font = '600 44px ' + F; ctx.fillText('Haz GRATIS tu test vocacional en 5 minutos', W / 2, 520);
      ctx.fillStyle = '#fff'; roundRect(ctx, W / 2 - 330, 640, 660, 660, 48); ctx.fill();
      ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 10; roundRect(ctx, W / 2 - 330, 640, 660, 660, 48); ctx.stroke();
      drawQr(ctx, qr, W / 2 - 290, 680, 580);
      ctx.fillStyle = '#1c1d33'; ctx.font = '800 48px ' + F; ctx.fillText('Escanea con tu celular 📱', W / 2, 1390);
      ctx.fillStyle = '#5b3fd6'; ctx.font = '600 32px ' + F; ctx.fillText(url.replace(/^https?:\/\//, '').replace(/\/$/, ''), W / 2, 1445);
      ctx.fillStyle = '#5d6078'; ctx.font = '500 32px ' + F;
      ctx.fillText('✓ Test RIASEC  ✓ 39 carreras  ✓ Becas  ✓ Español y Runasimi', W / 2, 1530);
      const handle = socialLinks()[0];
      ctx.fillStyle = '#1c1d33'; ctx.font = '700 34px ' + F;
      ctx.fillText('WhatsApp ' + formatPhone(CONFIG.whatsappNumbers[0].number) + (handle ? '  ·  @' + handle.user : ''), W / 2, 1610);
      ctx.fillStyle = '#8a8ea8'; ctx.font = '500 26px ' + F;
      ctx.fillText('Elaborado por Naylea Luana Conde Quispe y Rosmery Lapa Huyhua', W / 2, 1690);
      dl(pc, 'afiche-mi-sueno-mi-carrera.png');
      toast('Afiche descargado (tamaño A4, listo para imprimir).', 'image');
    });
  }

  /* =========================================================
     CUENTAS EN LA NUBE (Firebase, opcional)
     ========================================================= */
  const cloud = { enabled: false, auth: null, db: null, uid: null, timer: null };
  const CLOUD_KEYS = ['msmc_progress_', 'msmc_choice_', 'msmc_school_', 'msmc_plan_', 'msmc_consent_', 'msmc_phone_'];
  async function initCloud() {
    const cfg = CONFIG.firebase;
    if (!cfg || !cfg.apiKey) return;
    try {
      if (!window.firebase) {
        const v = 'https://www.gstatic.com/firebasejs/10.12.2/';
        await loadScript(v + 'firebase-app-compat.js');
        await Promise.all([loadScript(v + 'firebase-auth-compat.js'), loadScript(v + 'firebase-firestore-compat.js')]);
      }
      if (!window.firebase.apps || !window.firebase.apps.length) window.firebase.initializeApp(cfg);
      cloud.auth = window.firebase.auth();
      cloud.db = window.firebase.firestore();
      cloud.enabled = true;
      const note = $('auth-mode-note');
      if (note) note.textContent = '☁️ Tu cuenta se guarda en la nube: entra desde cualquier celular o computadora.';
      cloud.auth.onAuthStateChanged((u) => { cloud.uid = u ? u.uid : null; });
    } catch (e) {
      cloud.enabled = false;
      const note = $('auth-mode-note');
      if (note) note.textContent = 'Sin conexión con la nube: las cuentas se guardan en este navegador.';
    }
  }
  async function cloudPull(user, email) {
    cloud.uid = user.uid;
    const snap = await cloud.db.collection('usuarios').doc(user.uid).get();
    const doc = snap.exists ? snap.data() : {};
    const data = doc.data || {};
    CLOUD_KEYS.forEach((k) => {
      const short = k.replace('msmc_', '').replace('_', '');
      if (data[short] !== undefined && data[short] !== null) {
        try { localStorage.setItem(k + email, JSON.stringify(data[short])); } catch (e) { /* noop */ }
      }
    });
    return doc;
  }
  function cloudPushNow() {
    if (!cloud.enabled || !cloud.uid || !currentUser || !currentUser.cloud) return;
    clearTimeout(cloud.timer);
    const data = {};
    CLOUD_KEYS.forEach((k) => { data[k.replace('msmc_', '').replace('_', '')] = store.get(k + currentUser.email, null); });
    try {
      cloud.db.collection('usuarios').doc(cloud.uid).set({ name: currentUser.name, email: currentUser.email, updated: Date.now(), data: data }, { merge: true })
        .catch(() => { /* se reintenta en el próximo cambio */ });
    } catch (e) { /* noop */ }
  }
  function onStoreChange(key) {
    if (!cloud.enabled || !currentUser || !currentUser.cloud) return;
    if (!CLOUD_KEYS.some((k) => key === k + currentUser.email)) return;
    clearTimeout(cloud.timer);
    cloud.timer = setTimeout(cloudPushNow, 1500);
  }
  function cloudError(err) {
    const code = err && err.code || '';
    const map = {
      'auth/invalid-credential': 'Correo o contraseña incorrectos.',
      'auth/wrong-password': 'La contraseña no es correcta.',
      'auth/user-not-found': 'No encontramos una cuenta con ese correo. Pulsa “Crear cuenta”.',
      'auth/invalid-email': 'Escribe un correo válido.',
      'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres).',
      'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos y vuelve a intentar.',
      'auth/network-request-failed': 'Sin conexión a internet. Revisa tu red e intenta otra vez.'
    };
    return map[code] || 'No se pudo completar. Intenta otra vez en un momento.';
  }

  /* ---------- Inicio ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initFeatures();
    initCloud();
    initSocial();
    initAuth();
    initPlan();
    initCalendar();
    initApp();
    initWhatsApp();
    initCareers();
    initChosen();
    initTestimonials();
    initNav();
    renderChosen();
    applyLang(true);
    const saved = session.get();
    if (saved && saved.email) enterApp(saved);
    else { $('auth-screen').hidden = false; $('app').hidden = true; }
  });
})();

/* =====================================================================
   📊 CONECTAR GOOGLE SHEETS (opcional, 5 minutos)
   ---------------------------------------------------------------------
   Sirve para: recibir los resultados de cada estudiante, las citas
   solicitadas y usar el "Panel del tutor" desde cualquier equipo.

   1. Entra a https://sheets.google.com y crea una hoja nueva
      (por ejemplo: "Mi Sueño Mi Carrera - Resultados").
   2. Menú Extensiones → Apps Script. Borra lo que haya y pega TODO el
      código que está entre las líneas ------ de abajo.
   3. Cambia CLAVE_TUTOR por una clave que solo tú conozcas.
   4. Guarda (ícono de disquete) → botón "Implementar" → "Nueva
      implementación" → tipo "Aplicación web":
        · Ejecutar como: Yo
        · Quién tiene acceso: Cualquier persona
      Acepta los permisos que te pida Google.
   5. Copia la "URL de la aplicación web" (termina en /exec) y pégala
      arriba, en CONFIG.sheetsUrl, entre las comillas.

   ------------------------------------------------------------------
   const CLAVE_TUTOR = 'cambia-esta-clave';
   const COLS = ['fecha','tipo','nombre','correo','colegio','codigo','area1',
                 'area2','detalle','carrera','citaFecha','citaHora','modalidad',
                 'celular','solicita','tema','historia','autoriza'];

   function hoja() {
     const ss = SpreadsheetApp.getActiveSpreadsheet();
     let sh = ss.getSheetByName('Registros');
     if (!sh) { sh = ss.insertSheet('Registros'); sh.appendRow(COLS); sh.setFrozenRows(1); }
     return sh;
   }

   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     hoja().appendRow(COLS.map(function (c) { return d[c] || ''; }));
     return ContentService.createTextOutput('ok');
   }

   function doGet(e) {
     const p = e.parameter || {};
     const out = function (obj) {
       return ContentService.createTextOutput(JSON.stringify(obj))
         .setMimeType(ContentService.MimeType.JSON);
     };
     if (p.action !== 'panel') return out({ ok: true });
     if (p.key !== CLAVE_TUTOR) return out({ ok: false, error: 'Clave incorrecta.' });
     const values = hoja().getDataRange().getValues();
     const head = values.shift();
     const code = String(p.code || '').toUpperCase();
     const rows = values.map(function (r) {
       const o = {}; head.forEach(function (h, i) { o[h] = r[i] instanceof Date ? r[i].toISOString() : r[i]; }); return o;
     }).filter(function (o) { return !code || String(o.colegio).toUpperCase() === code; });
     return out({ ok: true, rows: rows });
   }
   ------------------------------------------------------------------
   Si más adelante cambias el código, vuelve a "Implementar →
   Gestionar implementaciones → Editar → Nueva versión".
   ===================================================================== */

/* =====================================================================
   ☁️ ACTIVAR CUENTAS EN LA NUBE CON FIREBASE (opcional, 10 minutos)
   ---------------------------------------------------------------------
   Sirve para: que cada estudiante entre a su cuenta desde cualquier
   celular o computadora, y pueda recuperar su contraseña por correo.

   1. Entra a https://console.firebase.google.com con tu cuenta Google
      y crea un proyecto (por ejemplo "mi-sueno-mi-carrera").
   2. Compilación → Authentication → Comenzar → activa
      "Correo electrónico/contraseña".
   3. Compilación → Firestore Database → Crear base de datos
      (ubicación: southamerica-east1) → modo producción.
   4. En Firestore → Reglas, pega esto y publica:

        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /usuarios/{uid} {
              allow read, write: if request.auth != null && request.auth.uid == uid;
            }
          }
        }

   5. Configuración del proyecto (⚙️) → Tus apps → ícono </> (Web) →
      registra la app y copia los datos de "firebaseConfig".
   6. Pégalos arriba en CONFIG.firebase (apiKey, authDomain, projectId,
      appId). Listo: el registro, el inicio de sesión y "¿Olvidaste tu
      contraseña?" usarán la nube.
   7. Authentication → Configuración → Dominios autorizados: agrega el
      dominio donde publicaste la página (ej.: misuenomicarrera.netlify.app).

   Nota: las cuentas creadas antes en un navegador no pasan solas a la
   nube; cada estudiante debe crear su cuenta de nuevo una vez.
   ===================================================================== */
