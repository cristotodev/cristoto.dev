// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import type { Businesses } from "./types/Businesses";
import type { Project } from "./types/Project";
import type { Tool } from "./types/Tool";

export const SITE_TITLE = 'cristotodev';
export const SITE_DESCRIPTION = 'Backend, JavaScript, TypeScript, Node';

export const BUSINESSES: Array<Businesses> = [{
    id: "dareplanet",
    name: "DarePlanet",
    url: "https://dareplanet.com/es/",
    image: {
        width: 200,
        height: 35,
    },
}, {
    id: "masmovil",
    name: "MasMovil",
    url: "https://www.masmovil.es/",
    image: {
        width: 164,
        height: 35,
    },
}, {
    id: "devoteam",
    name: "Devoteam",
    url: "https://es.devoteam.com/",
    image: {
        width: 164,
        height: 35,
    },
}, {
    id: "atecresa",
    name: "Atecresa",
    url: "https://atecresa.com/",
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
    id: "astro",
    name: "Astro",
}];

export const PROJECTS: Array<Project> = [{
    id: "speed",
    description: `Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.`,
    title: "Prueba titulo",
    url: "https://google.es",
    tags: [{
        name: "javascript",
        bgColorHex: "#FFFF00",
        fontColorHex: '#000000'
    }, {
        name: "astro",
        bgColorHex: "#50d71e",
        fontColorHex: '#000000'
    }]
}, {
    id: "speed",
    description: `Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.`,
    title: "Prueba titulo",
    url: "https://google.es",
    tags: [{
        name: "javascript",
        bgColorHex: "#F0DB4F",
        fontColorHex: '#000000'
    }, {
        name: "astro",
        bgColorHex: "#002D62",
        fontColorHex: '#FFFFFF'
    }]
}, {
    id: "speed",
    description: `Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto`,
    title: "Prueba titulo",
    url: "https://google.es",
    tags: [{
        name: "javascript",
        bgColorHex: "#F0DB4F",
        fontColorHex: '#000000'
    }, {
        name: "astro",
        bgColorHex: "#002D62",
        fontColorHex: '#000000'
    }]
}, {
    id: "speed",
    description: `Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto`,
    title: "Prueba titulo",
    url: "https://google.es",
    tags: [{
        name: "javascript",
        bgColorHex: "#F0DB4F",
        fontColorHex: '#000000'
    }, {
        name: "astro",
        bgColorHex: "#002D62",
        fontColorHex: '#000000'
    }]
}, {
    id: "speed",
    description: `Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto`,
    title: "Prueba titulo",
    url: "https://google.es",
    tags: [{
        name: "javascript",
        bgColorHex: "#F0DB4F",
        fontColorHex: '#000000'
    }, {
        name: "astro",
        bgColorHex: "#002D62",
        fontColorHex: '#000000'
    }]
}];