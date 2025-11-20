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
      label: "Creación",
      href: "/docs",
    },
    {
      label: "FAQ",
      href: "/pricing",
    }
  ],
  links: {
    sponsor: "https://patreon.com/jrgarciadev",
  },
};

export const randomEvents: EventCardProps[] = [
  {
    title: "Concierto de Rock en el Teatro Juárez",
    date: "2023-11-15",
    hour: "20:00",
    location: "Teatro Juárez",
    description: "Disfruta de una noche llena de energía con las mejores bandas de rock locales e internacionales.",
    image: 'https://picsum.photos/200/300?random=1.jpg',
  },
  {
    title: "Feria del Libro Guanajuato 2023",
    date: "2023-12-01",
    hour: "10:00",
    location: "Centro de Convenciones",
    description: "Explora una amplia variedad de libros, participa en charlas con autores y disfruta de actividades culturales.",
    image: 'https://picsum.photos/500/300?random=2.jpg',
  },
  {
    title: "Exposición de Arte Contemporáneo",
    date: "2023-11-20",
    hour: "18:00",
    location: "Museo de Arte Moderno",
    description: "Sumérgete en el mundo del arte contemporáneo con obras de artistas emergentes y consagrados.",
    image: 'https://picsum.photos/500/300?random=3.jpg',
  },
];