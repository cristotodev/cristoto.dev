---
title: "Tu propio GitHub Copilot con Ollama"
description: "Descubre mi experiencia configurando y utilizando una alternativa gratuita a GitHub Copilot en VSCode con Ollama. Aprende a integrar potentes Modelos de Lenguaje Grande (LLM) en tu propio entorno de desarrollo."
publishDate: "30 Jun 2024"
tags: ["ollama", "vscode", "ia"]
---

Como desarrollador de software, una de las herramientas más utilizadas hoy en día es [GitHub Copilot](https://github.com/features/copilot), junto con ChatGPT. Por eso, la idea de tener mi propio "GitHub Copilot" local sin depender de un servicio externo era algo que tenía que probar.

## ¿Qué es Ollama y como usarlo? 

Ollama es una herramienta de inteligencia artificial que te permite configurar y ejecutar Modelos de Lenguaje Grande (LLM) fácilmente en tu propio pc. Con Ollama, puedes usar modelos realmente potentes como Mistral, Llama 2 o Gemma, e incluso crear tus propios modelos personalizados. Funciona en macOS, Linux y Windows, por lo que prácticamente cualquiera puede usarlo. Si no quieres instalarlo en tu máquina, también tienen una imagen de Docker disponible.

Para instalar Ollama, sigue las instrucciones en su [sitio web](https://ollama.com/) o en su [imagen de Docker](https://hub.docker.com/r/ollama/ollama).

Una vez instalado, casi tienes tu propio ChatGPT en tu máquina, pero aún necesitas un modelo con el cual trabajar. El modelo actúa como el "cerebro" que utilizarás. En la página web de Ollama encontrarás varios modelos que puedes usar dependiendo de tus necesidades. Para este proyecto, he usado: codellama y stable-code.

Para ejecutar Ollama, debes especificar un LLM. Con el siguiente comando, levantarás Ollama usando "codellama" como LLM:

``` bash
ollama run codellama
```
Esto descargará el modelo en tu máquina y lo ejecutará para que ya puedas hacerle preguntas desde la terminal.

<video controls autoplay src="https://res.cloudinary.com/cristotodev/video/upload/v1717160415/cristotodev/blog/ollama-run-codellama_soesve.mp4"></video>

>Para continuar con la configuración, no es necesario que Ollama esté corriendo en la terminal, ya que la extensión de VSCode lo hará automáticamente.

## Integrar Ollama en VSCode

Hay varias extensiones de VSCode que te permiten integrar Ollama, como [Continue](https://docs.continue.dev/intro), [Code GPT](https://marketplace.visualstudio.com/items?itemName=DanielSanMedium.dscodegpt), [LlamaCode](https://github.com/ex3ndr/llama-coder), etc. En mi caso, he probado con Code GPT, ya que tiene integración con otros servicios como OpenAI, Azure, Google, etc.

Una vez instalada la extensión de Code GPT, puedes elegir qué servicio correr y con qué modelo. Si usas alternativas como OpenAI, te pedirá tu token para realizar las consultas mediante su API. Nosotros seleccionaremos Ollama para que use nuestro servicio local, el cual también tiene una [API REST propia](https://github.com/ollama/ollama/blob/main/docs/api.md) que puedes usar en tus proyectos si lo deseas.

<video controls autoplay src="https://res.cloudinary.com/cristotodev/video/upload/v1717160751/cristotodev/blog/execute-codegpt-ollama_mitsyi.mp4"></video>

## Conclusión

Después de probar varias extensiones, en términos de funcionalidad, son muy parecidas. La principal diferencia es que algunas te permiten conectarte con servicios externos, no únicamente con Ollama. Donde realmente está la diferencia es en el modelo de lenguaje (LLM) que utilices.

Con stable-code, las respuestas eran rápidas pero muchas veces incorrectas o desactualizadas. Con codellama obtuve mejores resultados en general, pero a costa de un gran consumo de recursos de mi máquina, ya que es un LLM mucho más pesado y requiere más procesamiento.

Como proyecto, es interesante, pero para usarlo en mi día a día no lo veo viable. Ejecutar un LLM con buenas respuestas requiere una alta demanda de recursos, los cuales necesito para mi trabajo.

Pienso que con el tiempo surgirán nuevos modelos que mejorarán su calidad y consumirán muchos menos recursos. Pero, por el momento, no he encontrado ninguno que se acerque a lo que ofrece GitHub Copilot.

En resumen, para mi uso personal, seguiré usando GitHub Copilot.