import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
	// Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
	author: "Cristo Manuel Estévez Hernández",
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: "es-ES",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	// Used as the default description meta property and webmanifest description
	description: "Blog especializado en desarrollo de software: tutoriales de SQL, DevOps con Podman y Traefik, workflows con Temporal. Contenido técnico en español para desarrolladores.",
	// HTML lang property, found in src/layouts/Base.astro L:18 & astro.config.ts L:48
	lang: "es-ES",
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: "es_ES",
	// Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
	title: "Cristotodev",
};

// Used to generate links in both the Header & Footer.
export const menuLinks: { path: string; title: string }[] = [
	{
		path: "/",
		title: "Inicio",
	},
	{
		path: "/services/",
		title: "Servicios",
	},
	{
		path: "/about/",
		title: "Sobre Mi",
	},
	{
		path: "/posts/",
		title: "Blog",
	},
	{
		path: "/books/",
		title: "Libros",
	},
	{
		path: "/contact/",
		title: "Contacto",
	},
];

export const PHONE_NUMBER = "638743887";