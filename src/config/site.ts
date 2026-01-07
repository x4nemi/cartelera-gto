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

export const randomEvents: EventCardProps[] = [
  {
    title: "Concierto de Rock en el Teatro Juárez",
    date: "2025-11-25",
    hour: "20:00",
    location: "Teatro Juárez",
    description: "Disfruta de una noche llena de energía con las mejores bandas de rock locales e internacionales.",
    image: '/bordado.jpg',
  },
  {
    title: "Feria del Libro Guanajuato 2025",
    date: "2025-11-28",
    hour: "10:00",
    location: "Centro de Convenciones",
    description: "Explora una amplia variedad de libros, participa en charlas con autores y disfruta de actividades culturales.",
    image: `/nocherock.jpg`,
  },
  {
    title: "Exposición de Arte Contemporáneo",
    date: "2026-01-23",
    hour: "18:00",
    location: "Museo de Arte Moderno",
    description: "Sumérgete en el mundo del arte contemporáneo con obras de artistas emergentes y consagrados.",
    image: `/patronaje.jpg`,
  },
  {
    title: "Concierto de Rock en el Teatro Juárez",
    date: "2025-11-25",
    hour: "20:00",
    location: "Teatro Juárez",
    description: "Disfruta de una noche llena de energía con las mejores bandas de rock locales e internacionales.",
    image: '/bordado.jpg',
  },
  {
    title: "Feria del Libro Guanajuato 2025",
    date: "2025-11-28",
    hour: "10:00",
    location: "Centro de Convenciones",
    description: "Explora una amplia variedad de libros, participa en charlas con autores y disfruta de actividades culturales.",
    image: `/nocherock.jpg`,
  },
  {
    title: "Exposición de Arte Contemporáneo",
    date: "2026-01-23",
    hour: "18:00",
    location: "Museo de Arte Moderno",
    description: "Sumérgete en el mundo del arte contemporáneo con obras de artistas emergentes y consagrados.",
    image: `/patronaje.jpg`,
  },
  {
    title: "Concierto de Rock en el Teatro Juárez",
    date: "2025-11-25",
    hour: "20:00",
    location: "Teatro Juárez",
    description: "Disfruta de una noche llena de energía con las mejores bandas de rock locales e internacionales.",
    image: '/bordado.jpg',
  },
  {
    title: "Feria del Libro Guanajuato 2025",
    date: "2025-11-28",
    hour: "10:00",
    location: "Centro de Convenciones",
    description: "Explora una amplia variedad de libros, participa en charlas con autores y disfruta de actividades culturales.",
    image: `/nocherock.jpg`,
  },
  {
    title: "Exposición de Arte Contemporáneo",
    date: "2026-01-23",
    hour: "18:00",
    location: "Museo de Arte Moderno",
    description: "Sumérgete en el mundo del arte contemporáneo con obras de artistas emergentes y consagrados.",
    image: `/patronaje.jpg`,
  },
  {
    title: "Concierto de Rock en el Teatro Juárez",
    date: "2025-11-25",
    hour: "20:00",
    location: "Teatro Juárez",
    description: "Disfruta de una noche llena de energía con las mejores bandas de rock locales e internacionales.",
    image: '/bordado.jpg',
  },
  {
    title: "Feria del Libro Guanajuato 2025",
    date: "2025-11-28",
    hour: "10:00",
    location: "Centro de Convenciones",
    description: "Explora una amplia variedad de libros, participa en charlas con autores y disfruta de actividades culturales.",
    image: `/nocherock.jpg`,
  },
  {
    title: "Exposición de Arte Contemporáneo",
    date: "2026-01-23",
    hour: "18:00",
    location: "Museo de Arte Moderno",
    description: "Sumérgete en el mundo del arte contemporáneo con obras de artistas emergentes y consagrados.",
    image: `/patronaje.jpg`,
  },
];