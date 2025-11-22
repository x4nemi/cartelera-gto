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
    date: "2025-11-25",
    hour: "20:00",
    location: "Teatro Juárez",
    description: "Disfruta de una noche llena de energía con las mejores bandas de rock locales e internacionales.",
    image: 'https://scontent-dfw5-1.cdninstagram.com/v/t51.82787-15/565142638_18528542554051318_5423690568639717922_n.webp?_nc_cat=111&ig_cache_key=Mzc0Mjg3OTgyMjEyMjE2Njk3Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=vEMJxCYz5_IQ7kNvwEcXwpK&_nc_oc=AdlhiKThD2kLMgO5vO7C0HA3d2fKx32-Io2HA0s3am8hSUahmeVwyktX2COWZsrVgOny1UIRqeu6FD_jl_n5ckp6&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-dfw5-1.cdninstagram.com&_nc_gid=77cSDYloQaECNP1mSBnWwg&oh=00_Afjw-FYpljX6QKhyCDC1cettsCx2e_4zokSJJXUEwWbogg&oe=6925A133',
  },
  {
    title: "Feria del Libro Guanajuato 2025",
    date: "2025-11-28",
    hour: "10:00",
    location: "Centro de Convenciones",
    description: "Explora una amplia variedad de libros, participa en charlas con autores y disfruta de actividades culturales.",
    image: 'https://scontent-dfw5-1.cdninstagram.com/v/t51.82787-15/567108366_18066373430363496_9022364156518313622_n.webp?_nc_cat=103&ig_cache_key=Mzc0NTU1ODU0NDMxODU4NTE1OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTM1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=_7MUJqTPnRgQ7kNvwHfriBV&_nc_oc=AdkceNh-x_QdLh0mvBKIZ-NBzY0NUl5fRQW-OS_jpGBUOLTq-L8tRxTUZpUEIc-kMKXAAH6cXkwWk3q2xxhU_EZ6&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-dfw5-1.cdninstagram.com&_nc_gid=77cSDYloQaECNP1mSBnWwg&oh=00_Afiz8RUU0e-IY6ddluvSrwJfhgwkC1AT6inW4CFlBu-PLQ&oe=69259B63',
  },
  {
    title: "Exposición de Arte Contemporáneo",
    date: "2026-01-23",
    hour: "18:00",
    location: "Museo de Arte Moderno",
    description: "Sumérgete en el mundo del arte contemporáneo con obras de artistas emergentes y consagrados.",
    image: 'https://scontent-dfw5-1.cdninstagram.com/v/t51.82787-15/567006472_17866483839492882_5005756523024697292_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzc2Mzk0Mjc1OTA5MTU2NDg4Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=LREM56sQzpkQ7kNvwFJdRZ6&_nc_oc=AdmhI-H0QlWhnGALWMrrqk3N8gKNkY6BCYXpdG3INiFulpEgNTqhFFyqdc_oHxZjyuNuxhtevoEL2mqYPKx5EKtr&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-dfw5-1.cdninstagram.com&_nc_gid=BcJtnb30m9Or4mAAF_bhyg&oh=00_AfgkIaZdv3-Xct_TYW_Snatqw0MvVfcNpNXwqX1Q9kINfg&oe=69257AE6',
  },
];