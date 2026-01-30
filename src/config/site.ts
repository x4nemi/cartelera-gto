import { EventCardProps } from "@/components/interfaces";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cartelera Cuévano",
  description: "Busca y descubre eventos en Guanajuato capital.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    // {
    //   label: "¿Cómo crear eventos?",
    //   href: "/creacion",
    // },
    {
      label: "Publicar",
      href: "/publicar",
    }
  ],
  links: {
    sponsor: "https://www.paypal.com/donate/?hosted_button_id=C42HWJ5ZQW3WN",
  },
};

/*
Scenarios of users:
1. The user has an Instagram account, a place to host the event, facebook page, whatsapp, and website.
*/

export const randomEvents: EventCardProps[] = [
  {
    id: "dino-taller-crochet-2026-01-19",
    title: "🦕✨ Dino Taller de Crochet ✨🧶",
    description: `🦕✨ Dino Taller de Crochet ✨🧶

¿Te imaginas tejer tu propio dinosaurio punto a punto?
Este taller está pensado para crear con calma, aprender y disfrutar del proceso, sin importar si estás empezando o si ya sabes lo básico.

📅 Inicia: 19 de enero
🗓 Lunes
⏰ 5:00 a 7:00 pm
⏳ Duración: 7 semanas
📍 Centro Cultural Casa Cuévano
(Campanero 6, 2º piso) @casacuevano

💰 Costo: $500 por el taller completo
🧶 Materiales no incluidos

Durante el taller aprenderás las bases necesarias para desarrollar tu amigurumi de dinosaurio de principio a fin, en un ambiente relajado y creativo 🌿

📩 Inscripciones abiertas
WhatsApp: 417 177 5592

Tejer también puede ser una forma de volver a jugar 🦖💫`,
    date: "2026-01-19",
    hour: "17:00",
    image: '/aracne/dinosaurio.png',
    username: "aracne_crochet_gto",
    type: "workshop",
    user: {
      name: "Aracne Crochet🧶",
      username: "aracne_crochet_gto",
      avatarUrl: "/logos/aracnelogo.png",
      location: "Guanajuato, México",
      bio: "Espacio cultural dedicado a promover el arte y la música en Guanajuato.",
      socialLinks: {
        instagram: "https://instagram.com/aracne_crochet_gto"
      }
    }
  },
  {
    id: "taller-amigurumis-niebla-cafe-2026-01-10",
    title: "🦕✨ Dino Taller de Crochet ✨🧶",
    description: `🧶✨ Taller de Amigurumis en De la Niebla Café ✨🧶

Si siempre has querido aprender a tejer amigurumis (o retomar el crochet con calma), este taller es para ti 🤍
Un espacio para crear, aprender y pasar un rato bonito entre café y estambres.

📅 Sábados y domingos
⏰ 12:00 a 14:00 hrs
📍 De la Niebla Café
Sangre de Cristo #9 Int. 1, Zona Centro, Guanajuato

💰 Costo mensual: $350
☕ + consumo mínimo de $50

No necesitas experiencia previa, vamos paso a paso y a tu ritmo 🧵
Ideal para principiantes y para quienes quieren seguir practicando.

📩 Inscripciones e informes por DM o WhatsApp
417 177 5592

Te esperamos para tejer juntxs 🕷️🖤`,
    date: "2026-01-10",
    hour: "12:00",
    image: '/aracne/taller.png',
    username: "aracne_crochet_gto",
    isRecurrent: true,
    type: "workshop",
    user: {
      name: "Aracne Crochet🧶",
      username: "aracne_crochet_gto",
      avatarUrl: "/logos/aracnelogo.png",
      location: "Guanajuato, México",
      bio: "Espacio cultural dedicado a promover el arte y la música en Guanajuato.",
      socialLinks: {
        instagram: "https://instagram.com/aracne_crochet_gto",
        whatsapp: "https://wa.me/524171775592",
      }
    }
  },
  {
    id: "el-brutalista-2026-01-15",
    title: "El Brutalista",
    description: "🎬 Cine en Casa Cuévano · 💰 $30",
    date: "2026-01-15",
    hour: "10:00",
    image: `/cuevano/brutalista.png`,
    username: "casacuevano",
    type:"event",
    user: {
      name: "Casa Cuévano",
      username: "casacuevano",
      avatarUrl: "logos/cuevano.png",
      location: "Guanajuato, México",
      bio: "Fomentando la lectura y el conocimiento en la comunidad.",
      socialLinks: {
        instagram: "https://instagram.com/casacuevano",
      }
    }
  },
  {
    id: "exposicion-arte-contemporaneo-2026-01-17",
    title: "Exposición de Arte Contemporáneo",
    description: `🏺 Manos y Memoria
Cerámica viva en Casa Cuévano
📅 Sáb 17 · 🕙 10:00 a.m. – 2:30 p.m.
💰 $980 · 👥 Cupo limitado
🤝 A Mano en un Hornito`,
    date: "2026-01-17",
    hour: "10:00",
    image: `/cuevano/ceramica.png`,
    username: "casacuevano",
    user: {
      name: "Casa Cuévano",
      username: "casacuevano",
      avatarUrl: "logos/cuevano.png",
      location: "Guanajuato, México",
      bio: "Fomentando la lectura y el conocimiento en la comunidad.",
      socialLinks: {
        instagram: "https://instagram.com/casacuevano",
      }
    }
  },
  {
    id: "ternurin-ropita-2026-01-30",
    title: "",
    description: `Ven a hacerle ropita a tu #ternurin / #chafarin de la mano de lx maestrx @mermaid_motel_r este viernes 30 de enero en @mylovelystoremx
Cupo limitado, Aparta tu lugar! 👗`,
    date: "2026-01-30",
    hour: "",
    image: `/mylovely/ternurin.png`,
    username: "mylovelystoremx",
    type: "event",
    user: {
      name: "My Lovely Store",
      username: "mylovelystoremx",
      avatarUrl: "logos/mylovely.png",
      location: "Guanajuato, México",
      socialLinks: {
        instagram: "https://instagram.com/mylovelystoremx",
      }
    }
  },
  {
    id: "taller-actualizate-2026-01-15",
    title: "",
    description: `TALLER ACTUALÍZA-TE este 2026✨
Taller de #collage sobre un calendario en @mylovelystoremx jueves 15 de enero de 4 a 7 pm
Cupo limitado, costo del taller $80 incluye materiales ✂️`,
    date: "2026-01-15",
    hour: "16:00",
    image: `/mylovely/actualizate.png`,
    username: "mylovelystoremx",
    type:"event",
    user: {
      name: "My Lovely Store",
      username: "mylovelystoremx",
      avatarUrl: "logos/mylovely.png",
      location: "Guanajuato, México",
      socialLinks: {
        instagram: "https://instagram.com/mylovelystoremx",
      }
    }
  },
  {
    id: "ritmos-latinos-2026-01-13",
    title: "",
    description: `Clases matutinas de ritmos latinos 🔥

🗓️ A partir del martes 13 de enero
🕐 Los martes y jueves 10:30 am a 12 pm
💵 $500 mensuales

Mándanos un mensajito para agendar una clase muestra sin costo ✨

¡ Baila, disfruta y aprende los pasos básicos de salsa, bachata, merengue y más en un ambiente divertido !

Imparte Dayana Pérez
Maestra cubana, con Licenciatura en instructor de artes y Maestría en Desarrollo Docente. Cuenta con 18 años de experiencia en la docencia y vida artística.`,
    date: "2026-01-13",
    hour: "10:30",
    isRecurrent: true,
    type: "event",
    image: `Telpochcalli/ritmos.png`,
    username: "telpochcalligto",
    user: {
      name: "Telpochcalli",
      username: "telpochcalligto",
      avatarUrl: "telpochcalli/ritmos.png",
      location: "Guanajuato, México",
      socialLinks: {
        instagram: "https://instagram.com/telpochcalligto",
      }
    }
  },
  {
    id: "agenda-cultural-casa-cuevano-2026-01",
    title: "",
    description: `✨ Agenda cultural · Enero en Casa Cuévano ✨

Enero continúa en Casa Cuévano con una programación que cruza arte, cine, literatura, música, oficios y comunidad 💛

Aquí te compartimos lo que sucede este mes 👇

⸻
🃏📖 Taller de Poesía Arcana
Tarot, lenguaje poético y simbolismo
📅 Mar 20 y 27 (ene) · 3 y 10 (feb) · 🕔 5:00 p.m.
💰 $500 · 🎓 Estudiantes $250 · 👥 Cupo limitado
🤝 Narrativa Arcana + Verónica Taltos
@narrativa_arcana @veronicaposadavj

⸻
🎬 Cine en Casa Cuévano · 💰 $30
🎥 El brutalista — Jue 15 · 6 pm
🎥 Una batalla tras otra — Mar 20 · 7 pm
🎥 Amores materialistas — Mié 21 · 8 pm
🎥 Frankenstein — Lun 26 · 7 pm
🎥 Soy Frankelda — Mié 28 · 8 pm

⸻
🎶 Dueto Cantares
Música folklórica mexicana
📅 Vie 16 · 🕖 7:00 p.m.
💛 Cooperación voluntaria
@enelram.mar

⸻
🏺 Manos y Memoria
Cerámica viva en Casa Cuévano
📅 Sáb 17 · 🕙 10:00 a.m. – 2:30 p.m.
💰 $980 · 👥 Cupo limitado
🤝 A Mano en un Hornito
@amanoenunhornito @sofiamaassg

⸻
🧶 Taller de tejido
Amigurumis de dinosaurios
📅 Lunes del 19 de enero al 2 de marzo · 🕔 5:00 p.m.
💰 $500 (no incluye materiales)
🤝 Aracne Crochet
@aracne_crochet_gto
`,
    date: "2026-01-15",
    hour: "18:00",
    image: `/cuevano/calendario.png`,
    username: "casacuevano",
    type: "calendar",
    user: {
      name: "Casa Cuévano",
      username: "casacuevano",
      avatarUrl: "logos/cuevano.png",
      location: "Guanajuato, México",
      bio: "Fomentando la lectura y el conocimiento en la comunidad.",
      socialLinks: {
        instagram: "https://instagram.com/casacuevano",
      }
    }
  }
];