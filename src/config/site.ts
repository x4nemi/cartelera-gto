import { PostData } from "./apiClient";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cartelera Cuévano",
  description: "Busca y descubre eventos en Guanajuato capital.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Publicar evento",
      href: "/creacion",
    },
    {
      label: "Acerca",
      href: "/acerca",
    },
    {
      label: "Preguntas frecuentes",
      href: "/faq",
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
    dates: ["2026-02-27", "2026-03-06"],
    displayUrl: 'https://cartelerasa.blob.core.windows.net/images/1771897892372-DUb-SOZiTc__image_1.jpg',
    images: ["https://cartelerasa.blob.core.windows.net/images/1771897892372-DUb-SOZiTc__image_1.jpg"],
    ownerUsername: "aracne_crochet_gto",
    ownerFullName: "Aracne Crochet🧶",
    ownerProfilePicUrl: "https://cartelerasa.blob.core.windows.net/images/1771895353042-escarola.gto_profile.jpg",
    type: "workshop",
  },
]