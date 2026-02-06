import { PostData } from "./apiClient";
import { parseDate } from "@internationalized/date";


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


// {
//     _id?: string;
//     shortCode: string;
//     caption?: string;
//     url?: string;
//     displayUrl?: string;
//     images?: string[];
//     ownerUsername: string;
//     ownerFullName?: string;
//     ownerProfilePicUrl?: string;
//     timestamp?: string;
//     createdAt?: string;
//     updatedAt?: string;
//     dates?: DateValue[];
//     isDraft?: boolean;
// }
export const randomEvents: PostData[] = [
  {
    _id: "dino-taller-crochet-2026-01-19",
    shortCode: "dino-taller-crochet-2026-01-19",
    caption: `🦕✨ Dino Taller de Crochet ✨🧶

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
    dates: [parseDate("2026-01-19")],
    displayUrl: '/aracne/dinosaurio.png',
    images: ['/aracne/dinosaurio.png'],
    ownerUsername: "aracne_crochet_gto",
    ownerFullName: "Aracne Crochet🧶",
    ownerProfilePicUrl: "/logos/aracnelogo.png",
  },
  {
    _id: "taller-amigurumis-niebla-cafe-2026-01-10",
    shortCode: "taller-amigurumis-niebla-cafe-2026-01-10",
    caption: `🧶✨ Taller de Amigurumis en De la Niebla Café ✨🧶

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
    dates: [parseDate("2026-01-10")],
    displayUrl: '/aracne/taller.png',
    images: ['/aracne/taller.png'],
    ownerUsername: "aracne_crochet_gto",
    ownerFullName: "Aracne Crochet🧶",
    ownerProfilePicUrl: "/logos/aracnelogo.png",
  },
  {
    _id: "el-brutalista-2026-01-15",
    shortCode: "el-brutalista-2026-01-15",
    caption: "🎬 Cine en Casa Cuévano · 💰 $30",
    dates: [parseDate("2026-01-15")],
    displayUrl: `/cuevano/brutalista.png`,
    ownerUsername: "casacuevano",
    ownerFullName: "Casa Cuévano",
    ownerProfilePicUrl: "logos/cuevano.png",
  },
  {
    _id: "exposicion-arte-contemporaneo-2026-01-17",
    shortCode: "exposicion-arte-contemporaneo-2026-01-17",  
    caption: `🏺 Manos y Memoria
Cerámica viva en Casa Cuévano
📅 Sáb 17 · 🕙 10:00 a.m. – 2:30 p.m.
💰 $980 · 👥 Cupo limitado
🤝 A Mano en un Hornito`,
    dates: [parseDate("2026-01-17")],
    displayUrl: `/cuevano/ceramica.png`,
    ownerUsername: "casacuevano",
    ownerFullName: "Casa Cuévano",
    ownerProfilePicUrl: "logos/cuevano.png",
  },
  {
    _id: "ternurin-ropita-2026-01-30",
    shortCode: "ternurin-ropita-2026-01-30",  
    caption: `Ven a hacerle ropita a tu #ternurin / #chafarin de la mano de lx maestrx @mermaid_motel_r este viernes 30 de enero en @mylovelystoremx
Cupo limitado, Aparta tu lugar! 👗`,
    dates: parseDate("2026-01-30") ? [parseDate("2026-01-30")] : [],
    displayUrl: `/mylovely/ternurin.png`,
    ownerUsername: "mylovelystoremx",
    ownerFullName: "My Lovely Store",
    ownerProfilePicUrl: "logos/mylovely.png",
  },
//   {
//     id: "taller-actualizate-2026-01-15",
//     title: "",
//     description: `TALLER ACTUALÍZA-TE este 2026✨
// Taller de #collage sobre un calendario en @mylovelystoremx jueves 15 de enero de 4 a 7 pm
// Cupo limitado, costo del taller $80 incluye materiales ✂️`,
//     date: "2026-01-15",
//     hour: "16:00",
//     image: `/mylovely/actualizate.png`,
//     username: "mylovelystoremx",
//     type:"event",
//     user: {
//       name: "My Lovely Store",
//       username: "mylovelystoremx",
//       avatarUrl: "logos/mylovely.png",
//       location: "Guanajuato, México",
//       socialLinks: {
//         instagram: "https://instagram.com/mylovelystoremx",
//       }
//     }
//   },
//   {
//     id: "ritmos-latinos-2026-01-13",
//     title: "",
//     description: `Clases matutinas de ritmos latinos 🔥

// 🗓️ A partir del martes 13 de enero
// 🕐 Los martes y jueves 10:30 am a 12 pm
// 💵 $500 mensuales

// Mándanos un mensajito para agendar una clase muestra sin costo ✨

// ¡ Baila, disfruta y aprende los pasos básicos de salsa, bachata, merengue y más en un ambiente divertido !

// Imparte Dayana Pérez
// Maestra cubana, con Licenciatura en instructor de artes y Maestría en Desarrollo Docente. Cuenta con 18 años de experiencia en la docencia y vida artística.`,
//     date: "2026-01-13",
//     hour: "10:30",
//     isRecurrent: true,
//     type: "event",
//     image: `Telpochcalli/ritmos.png`,
//     username: "telpochcalligto",
//     user: {
//       name: "Telpochcalli",
//       username: "telpochcalligto",
//       avatarUrl: "telpochcalli/ritmos.png",
//       location: "Guanajuato, México",
//       socialLinks: {
//         instagram: "https://instagram.com/telpochcalligto",
//       }
//     }
//   },
//   {
//     id: "agenda-cultural-casa-cuevano-2026-01",
//     title: "",
//     description: `✨ Agenda cultural · Enero en Casa Cuévano ✨

// Enero continúa en Casa Cuévano con una programación que cruza arte, cine, literatura, música, oficios y comunidad 💛

// Aquí te compartimos lo que sucede este mes 👇

// ⸻
// 🃏📖 Taller de Poesía Arcana
// Tarot, lenguaje poético y simbolismo
// 📅 Mar 20 y 27 (ene) · 3 y 10 (feb) · 🕔 5:00 p.m.
// 💰 $500 · 🎓 Estudiantes $250 · 👥 Cupo limitado
// 🤝 Narrativa Arcana + Verónica Taltos
// @narrativa_arcana @veronicaposadavj

// ⸻
// 🎬 Cine en Casa Cuévano · 💰 $30
// 🎥 El brutalista — Jue 15 · 6 pm
// 🎥 Una batalla tras otra — Mar 20 · 7 pm
// 🎥 Amores materialistas — Mié 21 · 8 pm
// 🎥 Frankenstein — Lun 26 · 7 pm
// 🎥 Soy Frankelda — Mié 28 · 8 pm

// ⸻
// 🎶 Dueto Cantares
// Música folklórica mexicana
// 📅 Vie 16 · 🕖 7:00 p.m.
// 💛 Cooperación voluntaria
// @enelram.mar

// ⸻
// 🏺 Manos y Memoria
// Cerámica viva en Casa Cuévano
// 📅 Sáb 17 · 🕙 10:00 a.m. – 2:30 p.m.
// 💰 $980 · 👥 Cupo limitado
// 🤝 A Mano en un Hornito
// @amanoenunhornito @sofiamaassg

// ⸻
// 🧶 Taller de tejido
// Amigurumis de dinosaurios
// 📅 Lunes del 19 de enero al 2 de marzo · 🕔 5:00 p.m.
// 💰 $500 (no incluye materiales)
// 🤝 Aracne Crochet
// @aracne_crochet_gto
// `,
//     date: "2026-01-15",
//     hour: "18:00",
//     image: `/cuevano/calendario.png`,
//     username: "casacuevano",
//     type: "calendar",
//     user: {
//       name: "Casa Cuévano",
//       username: "casacuevano",
//       avatarUrl: "logos/cuevano.png",
//       location: "Guanajuato, México",
//       bio: "Fomentando la lectura y el conocimiento en la comunidad.",
//       socialLinks: {
//         instagram: "https://instagram.com/casacuevano",
//       }
//     }
//   }
];
  