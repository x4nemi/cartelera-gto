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
    user: {
      name: "Casa Cuevano",
      username: "casacuevano",
      avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      location: "Guanajuato, México",
      bio: "Espacio cultural dedicado a promover el arte y la música en Guanajuato.",
      socialLinks: {
        instagram: "https://instagram.com/casacuevano",
        facebook: "https://facebook.com/casacuevano",
        whatsapp: "https://wa.me/5212345678900",
        website: "https://casacuevano.com",
      }
    }
  },
  {
    title: "Feria del Libro Guanajuato 2025",
    date: "2025-11-28",
    hour: "10:00",
    image: `/nocherock.jpg`,
    username: "booklover",
    user: {
      name: "Biblioteca Central",
      username: "bibliotecacentral",
      avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      location: "Guanajuato, México",
      bio: "Fomentando la lectura y el conocimiento en la comunidad.",
      socialLinks: {
        instagram: "https://instagram.com/bibliotecacentral",
        facebook: "https://facebook.com/bibliotecacentral",
        website: "https://bibliotecacentral.gob.mx",
      }
    }
  },
  {
    title: "Exposición de Arte Contemporáneo",
    date: "2026-01-23",
    hour: "18:00",
    image: `/patronaje.jpg`,
    username: "artenthusiast",
    user: {
      name: "Galería de Arte Moderno",
      username: "galeriamoderno",
      avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      // location: "Guanajuato, México",
      bio: "Exhibiendo lo mejor del arte contemporáneo local e internacional.",
      socialLinks: {
        instagram: "https://instagram.com/galeriamoderno",
        facebook: "https://facebook.com/galeriamoderno",
        whatsapp: "https://wa.me/5210987654321",
      }
    }
  },
];