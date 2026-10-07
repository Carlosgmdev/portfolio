export type Locale = 'en' | 'es';
export const home = (lang: Locale) => (lang === 'en' ? '/' : '/es/');
export const workUrl = (lang: Locale, slug: string) =>
  `${home(lang)}work/${slug}/`;
export const profile = {
  email: 'm_ccg@outlook.com',
  linkedin: 'https://www.linkedin.com/in/carlos-mart%C3%ADnez-a35595261/',
  article: {
    en: 'https://medium.com/@crlsgivnni/implementing-hexagonal-architecture-in-react-a-complete-practical-guide-8de9bdea1948',
    es: 'https://medium.com/@crlsgivnni/implementando-arquitectura-hexagonal-en-react-una-gu%C3%ADa-pr%C3%A1ctica-completa-b231ccb44aba',
  },
};
export const copy = {
  en: {
    nav: ['Work', 'Experience', 'About', 'Contact'],
    resume: 'Download CV',
    skip: 'Skip to content',
    menu: 'Toggle navigation',
    role: 'Full-stack developer',
    location: 'Based in León, Mexico',
    hero1: 'Complex systems.',
    hero2: 'Clear experiences.',
    intro:
      'I’m Carlos Martínez. I build web and mobile applications that bring clarity to complex workflows — from the interface to the architecture behind it.',
    viewWork: 'Explore my work',
    contact: 'Let’s talk',
    scroll: 'SCROLL TO EXPLORE',
    system: 'THE THINKING BEHIND THE BUILD',
    concept: 'Conceptual architecture',
    selected: 'Selected work',
    workIntro: 'Real problems. Thoughtful engineering.',
    workDescription:
      'A selection of the products I’ve contributed to, and the decisions behind them.',
    readCase: 'Explore case study',
    experience: 'Experience',
    experienceTitle: 'Building with purpose.\nGrowing with every project.',
    current: 'Present',
    about: 'A little about me',
    aboutTitle: 'Curious by nature.\nIntentional by design.',
    aboutText:
      'I’m a full-stack developer based in León, Guanajuato. My work connects thoughtful interfaces with the systems that make them useful: APIs, relational data, permissions and automated testing.',
    aboutText2:
      'I enjoy understanding how a business works, breaking down its complexity and turning it into maintainable software. I use AI-assisted workflows for implementation, documentation and QA, with human judgment guiding architecture, security and quality.',
    education: 'Computer Systems Engineering',
    university: 'UVEG · January 2026 · GPA 94/100',
    languages: 'Spanish · Native / English · B1',
    toolkit: 'Tools I build with',
    writing: 'Notes from the craft',
    articleTitle: 'Hexagonal architecture,\nthrough a React lens.',
    articleDescription:
      'A practical guide to separating concerns and building a more maintainable frontend.',
    articleLink: 'Read on Medium',
    contactEyebrow: 'Have something in mind?',
    contactTitle: 'Let’s build\nsomething meaningful.',
    contactDescription:
      'For opportunities, interesting challenges, or a good conversation about software.',
    footer: 'Designed with intention. Built with Astro.',
    top: 'Back to top',
    back: 'All projects',
    overview: 'The context',
    contribution: 'My contribution',
    decisions: 'Engineering decisions',
    stack: 'Technology stack',
    next: 'Next case study',
    company: 'Company',
    period: 'Period',
    projectRole: 'Role',
    architecture: 'A look at the system',
    architectureNote:
      'A conceptual view of the technologies and responsibilities described in this case study.',
    capabilities: 'What I worked on',
  },
  es: {
    nav: ['Proyectos', 'Experiencia', 'Sobre mí', 'Contacto'],
    resume: 'Descargar CV',
    skip: 'Ir al contenido',
    menu: 'Abrir o cerrar navegación',
    role: 'Desarrollador full-stack',
    location: 'Desde León, México',
    hero1: 'Sistemas complejos.',
    hero2: 'Experiencias claras.',
    intro:
      'Soy Carlos Martínez. Desarrollo aplicaciones web y móviles que dan claridad a procesos complejos: desde la interfaz hasta la arquitectura que las sostiene.',
    viewWork: 'Explorar proyectos',
    contact: 'Hablemos',
    scroll: 'SIGUE EXPLORANDO',
    system: 'LAS IDEAS DETRÁS DEL DESARROLLO',
    concept: 'Arquitectura conceptual',
    selected: 'Proyectos destacados',
    workIntro: 'Problemas reales. Ingeniería con intención.',
    workDescription:
      'Una selección de los productos en los que he contribuido y las decisiones detrás de ellos.',
    readCase: 'Explorar proyecto',
    experience: 'Experiencia',
    experienceTitle: 'Construir con propósito.\nCrecer con cada proyecto.',
    current: 'Actualidad',
    about: 'Un poco sobre mí',
    aboutTitle: 'Curioso por naturaleza.\nIntencional por diseño.',
    aboutText:
      'Soy desarrollador full-stack en León, Guanajuato. Mi trabajo conecta interfaces cuidadas con los sistemas que las hacen útiles: APIs, datos relacionales, permisos y pruebas automatizadas.',
    aboutText2:
      'Disfruto entender cómo funciona un negocio, descomponer su complejidad y convertirla en software mantenible. Uso flujos asistidos por IA para implementación, documentación y QA, con criterio humano sobre arquitectura, seguridad y calidad.',
    education: 'Ingeniería en Sistemas Computacionales',
    university: 'UVEG · Enero 2026 · Promedio 9.4',
    languages: 'Español · Nativo / Inglés · B1',
    toolkit: 'Herramientas con las que construyo',
    writing: 'Ideas desde la práctica',
    articleTitle: 'Arquitectura hexagonal,\ndesde la perspectiva de React.',
    articleDescription:
      'Una guía práctica para separar responsabilidades y construir un frontend más mantenible.',
    articleLink: 'Leer en Medium',
    contactEyebrow: '¿Tienes algo en mente?',
    contactTitle: 'Construyamos\nalgo que importe.',
    contactDescription:
      'Para oportunidades, retos interesantes o una buena conversación sobre software.',
    footer: 'Diseñado con intención. Hecho con Astro.',
    top: 'Volver arriba',
    back: 'Todos los proyectos',
    overview: 'El contexto',
    contribution: 'Mi contribución',
    decisions: 'Decisiones de ingeniería',
    stack: 'Tecnologías',
    next: 'Siguiente proyecto',
    company: 'Empresa',
    period: 'Periodo',
    projectRole: 'Rol',
    architecture: 'Una mirada al sistema',
    architectureNote:
      'Vista conceptual de las tecnologías y responsabilidades descritas en este caso.',
    capabilities: 'En qué trabajé',
  },
} satisfies Record<Locale, Record<string, string | string[]>>;
interface ProjectText {
  category: string;
  title: string;
  summary: string;
  context: string;
  contribution: string;
  decisions: { title: string; text: string }[];
  capabilities: string[];
}
export interface Project {
  slug: string;
  name: string;
  number: string;
  company: string;
  period: Record<Locale, string>;
  tags: string[];
  layers: string[];
  en: ProjectText;
  es: ProjectText;
}
export const projects: Project[] = [
  {
    slug: 'zenit',
    name: 'ZÉNIT',
    number: '01',
    company: 'Sistemas Premium',
    period: { en: 'June 2025 — Present', es: 'Junio 2025 — Actualidad' },
    tags: ['React', 'TypeScript', 'Fastify', 'PostgreSQL'],
    layers: [
      'React · TypeScript',
      'Fastify · Permissions',
      'Prisma · PostgreSQL',
      'Redis · BullMQ · S3',
    ],
    en: {
      category: 'LOGISTICS PLATFORM',
      title: 'Making complex operations\nfeel connected.',
      summary:
        'A modular logistics platform connecting shipments, documents, permissions and operational workflows.',
      context:
        'Logistics brings together many moving parts: shipments, catalogs, documents, users and integrations. ZÉNIT brings these responsibilities into a modular platform with a shared foundation.',
      contribution:
        'I develop frontend and backend modules in a TypeScript monorepo, working across catalogs, users, roles, shipments, document records, notifications and integrations. My work also includes resource-scoped authorization, asynchronous processes and automated quality workflows.',
      decisions: [
        {
          title: 'Boundaries that keep modules focused',
          text: 'Separate domain logic, API, persistence and frontend responsibilities so that individual modules can evolve within the shared platform.',
        },
        {
          title: 'Permissions across the application',
          text: 'Apply permissions and resource scope to endpoints, routes and interface actions, keeping authorization consistent across layers.',
        },
        {
          title: 'Asynchronous work and quality checks',
          text: 'Participate in Redis/BullMQ processing, S3-compatible storage and migration reviews. Use Codex-assisted workflows for implementation, documentation, security review and E2E testing.',
        },
      ],
      capabilities: [
        'Catalog and shipment modules',
        'Document records and notifications',
        'Users, roles and resource permissions',
        'Integrations and asynchronous processing',
      ],
    },
    es: {
      category: 'PLATAFORMA LOGÍSTICA',
      title: 'Conectar la complejidad\nde cada operación.',
      summary:
        'Una plataforma logística modular que conecta embarques, documentos, permisos y procesos operativos.',
      context:
        'La logística reúne muchas piezas: embarques, catálogos, documentos, usuarios e integraciones. ZÉNIT conecta estas responsabilidades en una plataforma modular con una base compartida.',
      contribution:
        'Desarrollo módulos frontend y backend en un monorepo TypeScript: catálogos, usuarios, roles, embarques, expedientes documentales, notificaciones e integraciones. También trabajo en autorización por recurso, procesos asíncronos y flujos de calidad automatizados.',
      decisions: [
        {
          title: 'Límites claros entre módulos',
          text: 'Separar dominio, API, persistencia y frontend para que cada módulo pueda evolucionar dentro de la plataforma compartida.',
        },
        {
          title: 'Permisos en toda la aplicación',
          text: 'Aplicar permisos y alcance por recurso en endpoints, rutas y acciones de interfaz, manteniendo la autorización consistente entre capas.',
        },
        {
          title: 'Procesamiento asíncrono y calidad',
          text: 'Participar en procesos con Redis/BullMQ, almacenamiento compatible con S3 y revisión de migraciones. Integrar flujos con Codex para implementación, documentación, revisión de seguridad y pruebas E2E.',
        },
      ],
      capabilities: [
        'Módulos de catálogos y embarques',
        'Expedientes y notificaciones',
        'Usuarios, roles y permisos por recurso',
        'Integraciones y procesos asíncronos',
      ],
    },
  },
  {
    slug: 'driveka',
    name: 'Driveka',
    number: '02',
    company: 'Sistemas Premium',
    period: {
      en: 'Within my role since June 2025',
      es: 'Dentro de mi puesto desde junio 2025',
    },
    tags: ['Next.js', 'Express', 'SQL Server', 'React'],
    layers: [
      'Next.js · React CRM',
      'Express · Domain',
      'SQL Server',
      'Payments · Inventory',
    ],
    en: {
      category: 'AUTOMOTIVE PLATFORM & CRM',
      title: 'From finding a vehicle\nto managing the business.',
      summary:
        'An automotive platform and CRM connecting vehicle discovery, payments and day-to-day sales operations.',
      context:
        'Vehicle discovery and sales management have different needs. Driveka combines a public-facing automotive platform with a CRM for managing users, sales, inventory and access.',
      contribution:
        'I developed the web platform with Next.js, TypeScript, Express and SQL Server, including payments, advanced vehicle search and user profiles. I also built a React CRM with Material UI and Zustand.',
      decisions: [
        {
          title: 'A domain that stands on its own',
          text: 'Use hexagonal architecture and dependency injection in the backend to decouple domain logic and facilitate testing.',
        },
        {
          title: 'Interfaces shaped by their users',
          text: 'Build vehicle discovery and profiles in Next.js, and operational management in a React CRM with Material UI and Zustand.',
        },
        {
          title: 'Connected commercial workflows',
          text: 'Implement payments and advanced search in the platform, alongside user, inventory, sales and access management in the CRM.',
        },
      ],
      capabilities: [
        'Advanced vehicle search',
        'Payments and user profiles',
        'Sales and inventory administration',
        'CRM user and access management',
      ],
    },
    es: {
      category: 'PLATAFORMA AUTOMOTRIZ Y CRM',
      title: 'De encontrar un vehículo\na gestionar el negocio.',
      summary:
        'Una plataforma automotriz y un CRM que conectan búsqueda de vehículos, pagos y operación comercial.',
      context:
        'La búsqueda de vehículos y la gestión comercial tienen necesidades distintas. Driveka reúne una plataforma automotriz y un CRM para administrar usuarios, ventas, inventario y acceso.',
      contribution:
        'Desarrollé la plataforma con Next.js, TypeScript, Express y SQL Server, incluyendo pagos, búsqueda avanzada de vehículos y perfiles de usuario. También construí un CRM con React, Material UI y Zustand.',
      decisions: [
        {
          title: 'Un dominio independiente',
          text: 'Usar arquitectura hexagonal e inyección de dependencias en el backend para desacoplar la lógica de dominio y facilitar las pruebas.',
        },
        {
          title: 'Interfaces según sus usuarios',
          text: 'Construir búsqueda y perfiles con Next.js, y la gestión operativa en un CRM con React, Material UI y Zustand.',
        },
        {
          title: 'Procesos comerciales conectados',
          text: 'Implementar pagos y búsqueda avanzada en la plataforma, junto con administración de usuarios, inventario, ventas y acceso en el CRM.',
        },
      ],
      capabilities: [
        'Búsqueda avanzada de vehículos',
        'Pagos y perfiles de usuario',
        'Administración de ventas e inventario',
        'Gestión de usuarios y acceso en CRM',
      ],
    },
  },
  {
    slug: 'visitapp',
    name: 'Visitapp',
    number: '03',
    company: 'Visitapp',
    period: { en: 'October 2023 — July 2024', es: 'Octubre 2023 — Julio 2024' },
    tags: ['React Native', 'Elixir', 'GraphQL', 'AWS'],
    layers: [
      'React · React Native',
      'Phoenix · GraphQL',
      'Ecto · PostgreSQL',
      'Python · Rekognition',
    ],
    en: {
      category: 'WEB & MOBILE APPLICATIONS',
      title: 'Connecting people,\nplaces and services.',
      summary:
        'Web and mobile solutions for visitor management and corporate housing, backed by multi-tenant services.',
      context:
        'Visitor management and corporate housing require information to move between people, devices and organizations. My work at Visitapp covered web and mobile interfaces and the services behind them.',
      contribution:
        'I built with React, React Native and TypeScript, developed multi-tenant services in Elixir/Phoenix, and integrated facial verification with Python and Amazon Rekognition. I also worked with GraphQL, camera capture and metrics visualization.',
      decisions: [
        {
          title: 'Web and mobile experiences',
          text: 'Use React and React Native for the application interfaces, with Apollo Client to consume GraphQL APIs and camera capture for relevant workflows.',
        },
        {
          title: 'Services for multiple organizations',
          text: 'Build multi-tenant services with Elixir, Phoenix, Ecto and PostgreSQL, oriented toward concurrent information processing.',
        },
        {
          title: 'Specialized integrations',
          text: 'Integrate facial verification through Python and Amazon Rekognition, AWS S3 and EC2 for storage and deployment, and ApexCharts for metrics.',
        },
      ],
      capabilities: [
        'Visitor management',
        'Corporate housing workflows',
        'Facial verification integration',
        'Camera capture and metrics visualization',
      ],
    },
    es: {
      category: 'APLICACIONES WEB Y MÓVILES',
      title: 'Conectar personas,\nespacios y servicios.',
      summary:
        'Soluciones web y móviles para visitantes y vivienda corporativa, respaldadas por servicios multiempresa.',
      context:
        'La gestión de visitantes y vivienda corporativa requiere conectar información entre personas, dispositivos y organizaciones. Mi trabajo en Visitapp abarcó interfaces web y móviles y los servicios que las sostienen.',
      contribution:
        'Desarrollé con React, React Native y TypeScript, construí servicios multiempresa con Elixir/Phoenix e integré verificación facial con Python y Amazon Rekognition. También trabajé con GraphQL, captura de cámara y visualización de métricas.',
      decisions: [
        {
          title: 'Experiencias web y móviles',
          text: 'Usar React y React Native para las interfaces, Apollo Client para consumir APIs GraphQL y captura mediante cámara en los procesos correspondientes.',
        },
        {
          title: 'Servicios para varias organizaciones',
          text: 'Construir servicios multiempresa con Elixir, Phoenix, Ecto y PostgreSQL, orientados al procesamiento concurrente de información.',
        },
        {
          title: 'Integraciones especializadas',
          text: 'Integrar verificación facial con Python y Amazon Rekognition, AWS S3 y EC2 para almacenamiento y despliegue, y ApexCharts para métricas.',
        },
      ],
      capabilities: [
        'Gestión de visitantes',
        'Procesos de vivienda corporativa',
        'Integración de verificación facial',
        'Captura de cámara y visualización de métricas',
      ],
    },
  },
];
export const experience = {
  en: [
    {
      company: 'Sistemas Premium',
      date: 'JUN 2025 — PRESENT',
      mode: 'On-site',
      text: 'Modular logistics at ZÉNIT. Automotive commerce and CRM at Driveka. Working across interfaces, APIs, data and application architecture.',
      tags: ['TypeScript', 'React', 'Node.js'],
    },
    {
      company: 'Castores',
      date: 'JUL 2024 — JUN 2025',
      mode: 'Hybrid',
      text: 'HR and payroll-related modules, data-intensive Angular interfaces, optimized SQL queries and automated XLSX, CSV and PDF workflows.',
      tags: ['Angular', 'Express', 'MySQL'],
    },
    {
      company: 'Visitapp',
      date: 'OCT 2023 — JUL 2024',
      mode: 'Hybrid',
      text: 'Web and mobile applications for visitor management and corporate housing, with multi-tenant services and facial verification integrations.',
      tags: ['React Native', 'Elixir', 'AWS'],
    },
  ],
  es: [
    {
      company: 'Sistemas Premium',
      date: 'JUN 2025 — ACTUALIDAD',
      mode: 'Presencial',
      text: 'Logística modular en ZÉNIT. Plataforma automotriz y CRM en Driveka. Desarrollo de interfaces, APIs, datos y arquitectura de aplicaciones.',
      tags: ['TypeScript', 'React', 'Node.js'],
    },
    {
      company: 'Castores',
      date: 'JUL 2024 — JUN 2025',
      mode: 'Híbrido',
      text: 'Módulos de Recursos Humanos y procesos de nómina, interfaces Angular con grandes volúmenes de datos, SQL optimizado y automatización de XLSX, CSV y PDF.',
      tags: ['Angular', 'Express', 'MySQL'],
    },
    {
      company: 'Visitapp',
      date: 'OCT 2023 — JUL 2024',
      mode: 'Híbrido',
      text: 'Aplicaciones web y móviles para visitantes y vivienda corporativa, servicios multiempresa e integraciones de verificación facial.',
      tags: ['React Native', 'Elixir', 'AWS'],
    },
  ],
};

export const edition = {
  en: {
    light: 'Switch to light theme',
    dark: 'Switch to dark theme',
    heroNote: 'ENGINEERED IN MOTION',
    heroHeadline: 'Thoughtful code.\nConsidered experiences.',
    heroSub:
      'Full-stack developer building at the intersection of interfaces, architecture and real-world problems.',
    processLabel: 'HOW I THINK',
    processTitle: 'Good experiences.\nSolid foundations.',
    processIntro:
      'The interface is only the beginning. I connect the layers that turn a product into a system.',
    layers: [
      {
        title: 'Interface',
        subtitle: 'Make complexity feel clear.',
        text: 'Thoughtful web and mobile interfaces, shaped around the people using them.',
        tools: 'REACT / TYPESCRIPT / REACT NATIVE',
      },
      {
        title: 'Logic',
        subtitle: 'Give every part a purpose.',
        text: 'Modular domains, well-defined APIs and permissions applied across the application.',
        tools: 'NODE.JS / FASTIFY / ELIXIR',
      },
      {
        title: 'Data',
        subtitle: 'Build on a strong foundation.',
        text: 'Relational modeling, asynchronous processes and automated checks that support the product.',
        tools: 'POSTGRESQL / REDIS / PLAYWRIGHT',
      },
    ],
    workTitle: 'Selected\ncontributions.',
    aboutHeading: 'A developer.\nA systems thinker.',
    contactTitle: 'LET’S BUILD\nWHAT’S NEXT.',
    concept: 'Conceptual illustration',
    caseLabel: 'CASE STUDY',
    workCount: 'THREE PROJECTS / ONE APPROACH',
    identity: 'Software with intention.',
    approach: 'Interfaces. Architecture. Everything in between.',
  },
  es: {
    light: 'Cambiar al tema claro',
    dark: 'Cambiar al tema oscuro',
    heroNote: 'INGENIERÍA EN MOVIMIENTO',
    heroHeadline: 'Código con intención.\nExperiencias cuidadas.',
    heroSub:
      'Desarrollador full-stack en la intersección de interfaces, arquitectura y problemas reales.',
    processLabel: 'CÓMO PIENSO',
    processTitle: 'Buenas experiencias.\nBases sólidas.',
    processIntro:
      'La interfaz es solo el principio. Conecto las capas que convierten un producto en un sistema.',
    layers: [
      {
        title: 'Interfaz',
        subtitle: 'Dar claridad a la complejidad.',
        text: 'Interfaces web y móviles diseñadas alrededor de las personas que las usan.',
        tools: 'REACT / TYPESCRIPT / REACT NATIVE',
      },
      {
        title: 'Lógica',
        subtitle: 'Dar un propósito a cada parte.',
        text: 'Dominios modulares, APIs bien definidas y permisos aplicados en toda la aplicación.',
        tools: 'NODE.JS / FASTIFY / ELIXIR',
      },
      {
        title: 'Datos',
        subtitle: 'Construir sobre una base firme.',
        text: 'Modelado relacional, procesos asíncronos y pruebas automatizadas que sostienen el producto.',
        tools: 'POSTGRESQL / REDIS / PLAYWRIGHT',
      },
    ],
    workTitle: 'Contribuciones\nseleccionadas.',
    aboutHeading: 'Desarrollador.\nVisión de sistemas.',
    contactTitle: 'CONSTRUYAMOS\nLO QUE SIGUE.',
    concept: 'Ilustración conceptual',
    caseLabel: 'CASO DE ESTUDIO',
    workCount: 'TRES PROYECTOS / UN ENFOQUE',
    identity: 'Software con intención.',
    approach: 'Interfaces. Arquitectura. Todo lo que las conecta.',
  },
};
