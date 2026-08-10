# Las herramientas detrás de este sitio — explicadas con sencillez

Esta página explica, en lenguaje sencillo, qué herramientas y tecnologías usamos para construir y hacer funcionar este sitio web.

No hace falta ningún conocimiento técnico para leerla. Cada término se explica la primera vez que aparece.

---

## La versión corta

Si tienes que recordar una sola cosa, que sea esta:

> **Todo el sitio funciona en tu propio navegador, en tu propio dispositivo. No hay ningún servidor que recoja tu información, ni seguimiento, ni recopilación oculta de datos.**

En resumen:

- El sitio está construido con herramientas gratuitas y de código abierto.
- La hoja de recordación que creas se convierte en PDF **en tu propio ordenador** — nunca se envía a ningún sitio para ser procesada.
- Las fuentes hebreas provienen del **Open Siddur Project** (opensiddur.org/help/fonts), una colección gratuita de fuentes hebreas creadas para la oración y el estudio. Nosotros las preparamos con nuestras propias herramientas internas de conversión.
- Aunque estamos en Israel — donde la ley europea de protección de datos (GDPR) no se aplica — hemos construido el sitio para ser respetuoso con la privacidad de todos y aplicar los mismos principios en todas partes.

---

## De qué está hecho el sitio

Un sitio web es un conjunto de archivos que tu navegador lee y muestra. Nuestro sitio está formado por estas partes principales.

### La página en sí — React

La página interactiva que ves — el asistente, la vista previa, los botones — está construida con una herramienta gratuita y de código abierto llamada **React**.

Piensa en React como un director de escena: decide qué mostrar, cuándo mostrarlo y cómo reaccionar cuando haces clic o escribes.

### El preparador — Vite

Antes de que un sitio pueda mostrarse, sus archivos deben prepararse, organizarse y optimizarse.

La herramienta que hace esto se llama **Vite**. También es la herramienta que usamos durante el desarrollo: cuando cambiamos algo, el cambio aparece en nuestro navegador al instante.

### El estilo — Tailwind

El aspecto del sitio — los colores, los espacios, los tamaños, la cuidada disposición de la hoja de recordación — se diseña con una herramienta llamada **Tailwind**.

### Los idiomas — i18next

El sitio está disponible en **hebreo, inglés, francés y español**.

El sistema que gestiona las traducciones se llama **i18next** (el "i18n" es la abreviatura de "internacionalización"). El hebreo se muestra de derecha a izquierda, como corresponde.

### Instalable y sin conexión — PWA

El sitio puede "instalarse" en tu teléfono u ordenador, como una pequeña aplicación, y puede funcionar incluso sin conexión a internet.

Esto es posible gracias a una tecnología llamada **PWA** (Progressive Web App — aplicación web progresiva). Una vez que has visitado el sitio, se guarda silenciosamente en tu dispositivo para estar ahí cuando lo necesites.

---

## Las fuentes — letras hebreas bien hechas

Los textos hebreos de oración y de recordación tienen necesidades especiales:

- Los **signos de vocalización** (nikud) encima y debajo de las letras.
- Los **signos de cantilación** (teamim) usados en la lectura bíblica.
- Letras que deben verse hermosas en cualquier tamaño, tanto en pantalla como en papel.

Las fuentes de ordenador normales a menudo fallan en esto.

### De dónde vienen las fuentes

Las fuentes que usamos provienen del **Open Siddur Project** — una colección gratuita y abierta de fuentes hebreas, diseñadas especialmente para la oración, la liturgia y el estudio (opensiddur.org/help/fonts).

Las fuentes del proyecto son de uso libre bajo licencias abiertas (principalmente la SIL Open Font License), lo que significa que cualquiera puede usarlas sin pagar.

### La preparación de las fuentes — nuestras herramientas internas

Las fuentes no llegan listas para usar. Hay que revisarlas, convertirlas y organizarlas antes de colocarlas en el sitio.

Para ello usamos nuestras propias herramientas de preparación internas, construidas alrededor de dos utilidades conocidas de código abierto: **FontForge** y **FontTools** (la "navaja suiza" del mundo de las fuentes).

Esto ocurre **antes** de que el sitio salga a internet, en nuestro propio taller. El sitio en sí nunca descarga fuentes de ningún servicio externo — están almacenadas en nuestro propio servidor.

### El resultado

El sitio ofrece **22 familias de fuentes hebreas** para la hoja de recordación — desde los estilos tradicionales de los sidurim impresos, pasando por fuentes modernas y claras, hasta una fuente especial para personas con dificultades de lectura.

---

## El motor de PDF — Folio

La creación del PDF es la parte más interesante.

### La forma habitual: un servidor hace el trabajo

La forma habitual de crear un PDF en un sitio web es enviar el documento a otro ordenador — un **servidor** — que crea el PDF y lo devuelve.

Esto tiene dos problemas:

1. **Privacidad** — tu documento sale de tu dispositivo.
2. **Costo** — cuando mucha gente crea PDF, el servidor tiene que hacer mucho trabajo.

### Nuestra forma: tu propio dispositivo hace el trabajo

Nosotros lo hacemos de otra manera. El PDF se crea **dentro de tu propio navegador, en tu propio dispositivo**.

Esto es posible gracias a una tecnología llamada **WebAssembly** (abreviado Wasm) — una forma de que los navegadores ejecuten programas complejos rápidamente, dentro de la propia página.

Escribimos nuestro propio motor de PDF en un lenguaje de programación llamado **Go**, y luego lo compilamos en un archivo que tu navegador puede ejecutar: un módulo WebAssembly de unos 20 MB que enviamos junto con el sitio.

El motor se llama **Folio**. Comenzó como un proyecto de código abierto, y nosotros construimos nuestra propia versión, ampliándola especialmente para las necesidades de los documentos hebreos: texto de derecha a izquierda, nikud y fuentes precisas en el PDF final.

Así que cuando pulsas "Descargar PDF":

> **Tu dispositivo → Tu navegador → Se crea el PDF → El PDF está en tu dispositivo.**

Nada se envía a ningún servidor. El documento nunca sale de tu ordenador.

### ¿Por qué tanto esfuerzo?

Porque nos importa que el resultado sea **bonito y preciso** — lo que ves en la pantalla debe ser exactamente lo que aparecerá en el papel, incluso en hebreo, incluso con nikud, incluso en una impresora que nunca ha oído hablar de nuestras fuentes.

---

## Privacidad — qué pasa con tu información

Esto es importante, así que seamos muy claros.

### Lo que NO tenemos

El sitio no tiene:

- **Ningún servidor** que recopile tu información.
- **Ninguna base de datos** que guarde tus hojas.
- **Ninguna cuenta** que tengas que crear.
- **Ningún seguimiento** de tus visitas.
- **Ninguna cookie** que te observe.
- **Ninguna publicidad**, ni venta de datos.

Los datos de recordación que escribes — el nombre, la fecha, la configuración — nunca se envían a ningún sitio. Viven solo en tu navegador, en la dirección web de la página, y desaparecen cuando cierras la pestaña.

### Las dos pequeñas excepciones

Para ser totalmente honestos, hay dos pequeños momentos en los que tu dispositivo habla con el mundo exterior:

1. **El tamaño del papel** — cuando entras al asistente por primera vez, el sitio hace una única y breve petición a un servicio público gratuito para adivinar qué tamaño de papel es común en tu país (Carta o A4). Solo interviene la ubicación aproximada (el país), y si la petición falla, el sitio simplemente elige A4.

2. **El formulario de contacto** — en la página "Acerca de" hay un formulario de contacto. Si lo usas, solo envía el mensaje y el correo electrónico que **tú** escribiste. Nada más.

Eso es todo. Todo lo demás — las fuentes, los textos, el motor de PDF — se carga desde nuestro propio sitio y se procesa en tu dispositivo.

### GDPR — por qué nos importa, aunque no estemos obligados

La ley europea de protección de datos, el **GDPR**, se aplica a las organizaciones de la Unión Europea. Nosotros estamos en Israel, así que la ley no se aplica a nosotros.

Pero la privacidad no es algo que se haga porque una ley lo diga. Hemos construido el sitio para que incluso un auditor europeo estricto no encuentre nada que objetar:

> **Datos mínimos. Procesamiento local. Sin seguimiento. Transparencia total.**

Así nos gusta trabajar: ser amables con todos y respetar las reglas de cada uno, vivan donde vivan.

---

## Qué ocurre dónde — un mapa simple

Aquí está todo el recorrido de una hoja de recordación:

**Escribes los datos** (en el asistente)
↓
**La hoja se compone** (en tu navegador)
↓
**Las fuentes se incrustan** (desde nuestro servidor, dentro del documento)
↓
**Se crea el PDF** (con Folio, dentro de tu navegador, en tu dispositivo)
↓
**Lo descargas** (el archivo nunca fue a ningún otro sitio)

---

## El taller — las herramientas con las que construimos el sitio

Para los curiosos, este es el "banco de trabajo" con el que construimos y revisamos el sitio. Todo es gratuito y de código abierto:

- **Go** — el lenguaje de programación en el que está escrito el motor de PDF.
- **Node.js** — la herramienta que ejecuta los scripts de preparación, incluidas las herramientas de fuentes.
- **FontForge y FontTools** — nuestras herramientas internas de preparación de fuentes (revisión, conversión y organización de las fuentes hebreas).
- **TypeScript** — una versión cuidadosa de JavaScript, el lenguaje de los navegadores; nos ayuda a detectar errores antes de que el sitio salga a internet.
- **Playwright** — un robot que abre el sitio automáticamente y lo prueba, página por página, en navegadores reales, con cada cambio.
- **Lighthouse y axe** — inspectores automáticos que comprueban la calidad del sitio: velocidad, accesibilidad para personas con discapacidad y buenas prácticas.
- **GitHub** — el lugar donde guardamos y gestionamos el código fuente del sitio, visible para todos.

---

## En una frase

Hemos construido un sitio con herramientas gratuitas y de código abierto, donde todo ocurre en tu propio dispositivo: tu hoja de recordación se crea, se diseña con hermosas fuentes hebreas libres y se convierte en PDF — todo en tu navegador, todo en privado, sin servidor, sin seguimiento y sin recopilación de datos.

Si tienes alguna pregunta sobre cualquier cosa de esta página, usa el formulario de contacto de la página "Acerca de" — estaremos encantados de responderte.
