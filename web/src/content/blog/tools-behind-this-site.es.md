---
title: "Qué hay detrás de este sitio - explicado con sencillez"
date: '2026-08-10'
excerpt: "Qué hace funcionar este sitio en silencio - por qué está construido con herramientas libres, cómo se preparan las fuentes hebreas, y por qué el trabajo ocurre en tu dispositivo, no en el nuestro"
---

A menudo nos preguntan qué hace funcionar un sitio como este en silencio - así que esta es la respuesta, en lenguaje sencillo, sin jerga técnica.

---

## La versión corta

Si solo recuerdas una cosa, que sea esta:

> **Todo el sitio funciona en tu propio dispositivo. No hay ningún servidor que recopile tu información, ni seguimiento, ni recopilación oculta de datos.**

En resumen:

- El sitio está construido con herramientas libres y de código abierto.
- La hoja de memoria que creas se convierte en PDF **en tu propio dispositivo** - nunca se envía a ningún lugar para ser procesada.
- Las fuentes hebreas provienen del Open Siddur Project (opensiddur.org/help/fonts), una colección gratuita de fuentes pensadas para textos de oración y estudio. Las revisamos y ajustamos nosotros mismos antes de que lleguen al sitio.
- Aunque estamos ubicados en Israel, donde la ley europea de privacidad (RGPD) no se aplica a nosotros - construimos el sitio para respetar esos mismos principios de privacidad en todas partes.

---

## De qué está hecho el sitio

Un sitio web es, en realidad, una simple colección de archivos que tu navegador lee y te muestra. Estas son las partes principales de las que está hecho nuestro sitio, sin demasiada jerga.

### La página que ves

El asistente, la vista previa, los botones - todo lo que ves y en lo que haces clic está construido con herramientas libres y de código abierto, de modo que la página te responde al instante: cuando escribes o haces clic, el cambio aparece en pantalla de inmediato, sin recargar la página.

### El diseño

Los colores, los espaciados y la cuidadosa disposición de la hoja de memoria fueron diseñados con esmero, para que la página se vea limpia y ordenada - tanto en pantalla como en papel, después de imprimir.

### Los idiomas

El sitio está disponible en **hebreo, inglés, francés y español**. El hebreo se muestra de derecha a izquierda, como corresponde.

### Instalable y funciona sin conexión

Puedes "instalar" el sitio en tu teléfono o computadora, como una pequeña aplicación, y puede funcionar incluso sin conexión a internet. Después de tu primera visita, se guarda discretamente en tu dispositivo, para estar disponible incluso sin red.

---

## Las fuentes - letras hebreas como deben ser

El hebreo es la lengua de los textos sagrados judíos, y tiene particularidades - los signos de vocalización (nikud) y los signos de cantilación (teamim) - que una fuente debe saber mostrar correctamente:

- Los **signos de vocalización** encima y debajo de las letras.
- Los **signos de cantilación** usados en la lectura de la Torá.
- Letras que deben verse hermosas en cualquier tamaño - en pantalla y en papel.

Las fuentes comunes suelen fallar en esto.

### De dónde vienen las fuentes

Las fuentes que usamos provienen del **Open Siddur Project** - una colección libre y abierta de fuentes hebreas diseñadas especialmente para la oración, la liturgia y el estudio (opensiddur.org/help/fonts). Las fuentes del proyecto son de uso libre bajo licencias abiertas (principalmente la licencia SIL Open Font License), lo que significa que cualquiera puede usarlas sin pagar.

### La preparación de las fuentes

Las fuentes no llegan listas para usarse. Nosotros las procesamos con antelación - por ejemplo, asegurándonos de que cada letra y cada signo de vocalización tenga exactamente la forma correcta, incluida su versión en negrita. Así, cuando se crea el PDF, se sabe exactamente qué letra mostrar - sin adivinar, sin recurrir a una forma que no encaje bien.

Este procesamiento ocurre **antes** de que el sitio salga en línea, en nuestro propio taller. Estas fuentes ya preparadas son las que se te envían junto con el resto de los archivos del sitio - el sitio no descarga fuentes de ningún servicio externo mientras lo usas.

### El resultado

El sitio ofrece **22 familias de fuentes hebreas** para la hoja de memoria - desde los estilos tradicionales de los libros de oración impresos, pasando por fuentes modernas y claras, hasta una fuente especial para personas con dificultades de lectura.

---

## Cómo se crea el PDF

Crear el PDF es la parte más interesante.

### La forma habitual: un servidor hace el trabajo

La forma habitual de crear un PDF en un sitio web es enviar el documento a otra computadora - un **servidor** - que crea el PDF y lo devuelve. Esto tiene dos problemas:

1. **Privacidad** - tu documento sale de tu dispositivo.
2. **Costo** - cuando muchas personas crean PDF, el servidor tiene que hacer mucho trabajo.

### Nuestra forma: tu propio dispositivo hace el trabajo

Nosotros lo hacemos de otra manera. El PDF se crea **dentro de tu propio navegador, en tu propio dispositivo**, gracias a una tecnología integrada en los navegadores modernos que les permite ejecutar software complejo rápidamente, sin salir a la red.

Escribimos nuestro propio motor de creación de PDF, y lo preparamos para que tu navegador pueda ejecutarlo directamente - un archivo de unos 20 megabytes, que enviamos junto con el resto del sitio.

Este motor se llama **Folio**. Comenzó como un proyecto abierto, y construimos nuestra propia versión sobre él, extendiéndolo especialmente para las necesidades de los documentos hebreos: texto de derecha a izquierda, signos de vocalización, y fuentes precisas en el PDF final.

Así que cuando presionas "Descargar PDF":

> **Tu dispositivo → Tu navegador → El PDF se crea → El PDF se guarda en tu dispositivo.**

Nada se envía a ningún servidor. El documento nunca sale de tu computadora.

### Por qué nos tomamos esta molestia

Porque nos importa que el resultado sea **hermoso y preciso** - lo que ves en pantalla debe ser exactamente lo que aparece en papel, incluso en hebreo, incluso con vocalización, incluso en una impresora que nunca antes se topó con nuestras fuentes.

---

## Privacidad - qué pasa con tu información

Esto es importante, así que seamos muy claros.

### Lo que no tenemos

El sitio no tiene:

- **Ningún servidor** que recopile tu información.
- **Ninguna base de datos** que almacene tus hojas.
- **Ninguna cuenta** que debas crear.
- **Ningún seguimiento** de tus visitas.
- **Ninguna cookie** que te espíe.
- **Ninguna venta de datos** a terceros.

Los detalles de la memoria que escribes - el nombre, la fecha, los ajustes - nunca se envían a ningún lugar. Viven solo en tu propio navegador, y desaparecen cuando cierras la pestaña.

### Las dos pequeñas excepciones

Para ser completamente honestos, hay dos pequeños momentos en los que tu dispositivo se comunica con el mundo exterior:

1. **El tamaño del papel** - en cuanto entras al asistente, el sitio hace una única solicitud breve a un servicio público gratuito para adivinar cuál es el tamaño de papel común en tu país (Carta o A4), a partir de tu dirección IP. Solo se involucra tu ubicación aproximada (el país), y si la solicitud falla, el sitio simplemente elige A4. Esta elección se muestra, y puedes cambiarla, en el último paso del asistente, junto con el resto de los ajustes de formato de la hoja.

2. **El formulario de contacto** - la página "Acerca de" tiene un formulario de contacto. Si lo usas, el mensaje y la dirección de correo **que tú** escribiste pasan por un servicio externo de confianza que nos los entrega por correo electrónico. No se envía nada más.

Eso es todo. Todo lo demás - las fuentes, los textos, la creación del PDF - se carga desde nuestro propio sitio y se procesa en tu dispositivo.

### RGPD - por qué nos importa aunque no estemos obligados

La ley europea de privacidad, el **RGPD**, se aplica a organizaciones de la Unión Europea. Nosotros estamos en Israel, así que la ley no se aplica formalmente a nosotros.

Pero la privacidad no es algo que se hace solo porque una ley lo diga. Construimos el sitio para que incluso un auditor europeo estricto no encuentre nada que objetar:

> **Datos mínimos. Procesamiento en tu propio dispositivo. Sin seguimiento. Transparencia total.**

Así es como nos gusta trabajar - ser amigables con todos, y respetar la privacidad de cada quien, donde sea que viva.

---

## Qué pasa dónde - un mapa sencillo

Aquí está el recorrido completo de una hoja de memoria:

**Escribes los detalles** (en el asistente)
↓
**La hoja se ordena** (en tu navegador)
↓
**Las fuentes se incorporan** (desde los archivos del sitio, al documento)
↓
**El PDF se crea** (dentro de tu navegador, en tu dispositivo)
↓
**Lo descargas** (el archivo nunca fue a ningún otro lugar)

---

## Para los curiosos

Revisamos el sitio regularmente - su velocidad, su accesibilidad para personas con discapacidades, y su correcto funcionamiento - para mantener una calidad alta.

---

## En una frase

Construimos un sitio con herramientas libres y de código abierto, donde todo ocurre en tu propio dispositivo: tu hoja de memoria se crea, se da formato con hermosas fuentes hebreas gratuitas, y se convierte en PDF - todo en tu navegador, todo en privado, sin servidor, sin seguimiento y sin recopilación de datos.

Si tienes alguna pregunta sobre el contenido de esta página, con gusto te respondemos - a través del formulario de contacto en la página "Acerca de".
