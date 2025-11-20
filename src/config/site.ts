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
