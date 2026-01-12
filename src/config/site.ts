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
    {
      label: "¿Cómo crear eventos?",
      href: "/creacion",
    },
    {
      label: "Publicar",
      href: "/publicar",
    }
  ],
  links: {
    sponsor: "https://patreon.com/jrgarciadev",
  },
};

/*
Scenarios of users:
1. The user has an Instagram account, a place to host the event, facebook page, whatsapp, and website.
*/

export const randomEvents: EventCardProps[] = [
  {
    title: "Concierto de Rock en el Teatro Juárez",
    date: "2025-11-25",
    hour: "20:00",
    image: '/bordado.jpg',
    username: "rockfan123",
  },
  {
    title: "Feria del Libro Guanajuato 2025",
    date: "2025-11-28",
    hour: "10:00",
    image: `/nocherock.jpg`,
    username: "booklover",
  },
  {
    title: "Exposición de Arte Contemporáneo",
    date: "2026-01-23",
    hour: "18:00",
    image: `/patronaje.jpg`,
    username: "artenthusiast",
  },
];