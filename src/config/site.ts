export type SiteConfig = typeof siteConfig;

export const PUBLIC_DOMAIN = "https://cartelera-gto.com";
export const PORTAL_DOMAIN = "https://portal.cartelera-gto.com";

/** Absolute URL to a published event on the public domain. */
export const eventPublicUrl = (shortCode: string): string =>
  `${PUBLIC_DOMAIN}/evento/${encodeURIComponent(shortCode)}`;

/** Absolute URL to the business portal landing. */
export const portalHomeUrl = (): string => `${PORTAL_DOMAIN}/`;

/** Absolute URL to a public profile (read-only) on the public domain. */
export const publicProfileUrl = (username: string): string =>
  `${PUBLIC_DOMAIN}/${encodeURIComponent(username)}`;

export const siteConfig = {
  name: "Cartelera GTO",
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