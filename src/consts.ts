// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import type { Businesses } from "./types/Businesses";
import type { Project } from "./types/Project";
import type { Tool } from "./types/Tool";

export const SITE_TITLE = 'cristotodev';
export const SITE_DESCRIPTION = 'Backend, JavaScript, TypeScript, Node';

export const BUSINESSES: Array<Businesses> = [{
    name: "DarePlanet",
    url: "https://dareplanet.com/es/",
    imageUrl: "https://res.cloudinary.com/cristotodev/image/upload/v1716970321/cristotodev/businesses/dareplanet_w23rul.webp",
    image: {
        width: 200,
        height: 35,
    },
}, {
    name: "MasMovil",
    url: "https://www.masmovil.es/",
    imageUrl: "https://res.cloudinary.com/cristotodev/image/upload/v1716970322/cristotodev/businesses/masmovil_p1jm0v.webp",
    image: {
        width: 164,
        height: 35,
    },
}, {
    name: "Devoteam",
    url: "https://es.devoteam.com/",
    imageUrl: "https://res.cloudinary.com/cristotodev/image/upload/v1716970321/cristotodev/businesses/devoteam_bt7uvc.webp",
    image: {
        width: 164,
        height: 35,
    },
}, {
    name: "Atecresa",
    url: "https://atecresa.com/",
    imageUrl: "https://res.cloudinary.com/cristotodev/image/upload/v1716970320/cristotodev/businesses/atecresa_jrj6gw.webp",
    image: {
        width: 164,
        height: 35,
    },
}, {
    name: "MasOrange",
    url: "https://masorange.es/",
    imageUrl: "https://res.cloudinary.com/cristotodev/image/upload/v1716970323/cristotodev/businesses/masorange_e6oulo.webp",
    image: {
        width: 164,
        height: 35,
    },
}];


export const TOOLS: Array<Tool> = [{
    id: "typescript",
    name: "Typescript",
}, {
    id: "javascript",
    name: "Javascript",
}, {
    id: "nestjs",
    name: "NestJS",
}, {
    id: "sql",
    name: "Sql",
}, {
    id: "nosql",
    name: "NoSQL",
}, {
    id: "k8s",
    name: "K8s",
}, {
    id: "elastic",
    name: "Elastic",
}, {
    id: "rabbitmq",
    name: "RabbitMQ",
}, {
    id: "openshift",
    name: "Openshift",
}, {
    id: "vue",
    name: "Vue",
}, {
    id: "react",
    name: "React",
}, {
    id: "astro",
    name: "Astro",
}];

export const PROJECTS: Array<Project> = [{
    id: "document-analyzer",
    description: `Document Analyzer es una herramienta que permite subir documentos y extraer información relevante mediante el uso de Ollama en local. Diseñado para simplificar el análisis de documentos mediante conversaciones inteligentes.`,
    title: "Document Analyzer",
    url: "https://github.com/cristotodev/Document-Analyzer",
    img: "https://res.cloudinary.com/cristotodev/image/upload/v1718794351/cristotodev/blog/document-analyzer_yomasg.webp",
    tags: [{
        name: "typescript",
        bgColorHex: "#46e3f5",
        fontColorHex: '#ffffff'
    }, {
        name: "astro",
        bgColorHex: "#8f0595",
        fontColorHex: '#ffffff'
    }, {
        name: "ollama",
        bgColorHex: "#D3D3D3",
        fontColorHex: '#000000'
    },{
        name: "react",
        bgColorHex: "#173db5",
        fontColorHex: '#ffffff'
    }]
}];