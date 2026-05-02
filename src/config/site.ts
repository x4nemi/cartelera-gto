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
      label: "Publicar",
      href: "/creacion",
    },
    // {
    //   label: "Acerca",
    //   href: "/acerca",
    // },
    {
      label: "Preguntas frecuentes",
      href: "/faq",
    }
  ],
  links: {
    sponsor: "https://www.paypal.com/donate/?hosted_button_id=C42HWJ5ZQW3WN",
  },
};