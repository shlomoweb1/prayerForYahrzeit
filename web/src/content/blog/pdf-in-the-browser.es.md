---
title: "¿Cómo se puede crear un PDF directamente en el navegador?"
date: '2026-08-10'
excerpt: "Cada hoja conmemorativa se convierte en un PDF, pero lo interesante es cómo. Sin servidor, sin capturas de pantalla: un motor de maquetación real, compilado a WebAssembly, reconstruye el documento directamente en tu navegador, incluidas las vocales hebreas."
---

Crear un PDF suena sencillo.

Tenemos un documento en una página web, y queremos convertirlo en un archivo PDF que podamos guardar, enviar e imprimir.

Pero en cuanto queremos que el resultado sea **preciso y coherente**, especialmente con el hebreo y sus signos diacríticos (el nikud), las cosas se vuelven mucho más interesantes.

---

## En lugar de enviar el documento a un servidor

La forma habitual de crear un PDF es que un sitio web envíe el documento a un **servidor**.

Un servidor es simplemente otro ordenador que realiza el trabajo para el sitio web.

El proceso se vería más o menos así:

**Tu ordenador → Sitio web → Servidor → Creación del PDF → De vuelta a tu ordenador**

Esto funciona, pero significa que otro ordenador tiene que hacer el trabajo.

Si 1.000 usuarios están creando PDF, el servidor tiene que gestionar 1.000 tareas de generación de PDF.

Hay otro enfoque posible:

**Dejar que el propio ordenador o dispositivo del usuario haga el trabajo.**

Entonces el proceso pasa a ser:

**Tu ordenador → Navegador → Creación del PDF**

El documento no necesita enviarse a ningún otro lugar solo para convertirlo en PDF.

---

## ¿Cómo puede un navegador hacer esto?

Aquí es donde entra una tecnología llamada **WebAssembly**, o **Wasm**.

Sin entrar en demasiados detalles técnicos, WebAssembly es una forma de ejecutar dentro del navegador software capaz de realizar operaciones complejas de manera muy eficiente.

En lugar de que el navegador solo muestre un sitio web, también puede ejecutar un motor completo encargado de crear un PDF.

Esto es lo que hace que la idea sea especialmente interesante:

> **El PDF puede crearse directamente dentro del navegador, en el propio ordenador del usuario.**

El trabajo no tiene que pasar por un servidor.

---

## Pero crear un PDF no es simplemente tomar una captura de pantalla

Aquí está uno de los retos más importantes.

Es tentador pensar:

> «Ya tengo la página en la pantalla. Simplemente guarda lo que veo como PDF.»

Pero eso no es lo que queremos.

Si simplemente convertimos la pantalla en una imagen, obtenemos una **fotografía del documento**, no un documento real.

El texto deja de ser realmente texto.

Es solo un conjunto de píxeles.

Y al ampliarlo o imprimirlo, quedamos limitados por la calidad de esa imagen.

Por eso necesitamos otro enfoque.

---

## El navegador tiene que reconstruir el documento

Una página web contiene muchas cosas:

texto, títulos, imágenes, tablas, espaciados, márgenes y más.

El navegador tiene que decidir dónde va cada cosa.

Necesita saber:

* Dónde empieza una línea de texto.
* Cuándo el texto debe pasar a la siguiente línea.
* Dónde debe colocarse una imagen.
* Cuánto espacio ocupa el texto.
* Dónde termina una página y dónde empieza otra.
* Cómo se posicionan los distintos elementos unos respecto a otros.

Este proceso se llama **maquetación** (layout).

Y el software encargado de tomar estas decisiones se llama **motor de maquetación** (Layout Engine).

---

## ¿Qué hace un motor de maquetación?

En lugar de tomar una foto de la página, un motor de maquetación observa **lo que el documento dice que debería ser**.

Por ejemplo:

> El título va aquí.
> El texto va debajo.
> La imagen va al lado.
> Esta línea es demasiado larga, así que parte de ella debe pasar a la siguiente línea.

El motor calcula entonces todas esas posiciones.

Esto es exactamente lo que necesitamos al crear un PDF.

No una foto de la página.

**Un documento reconstruido.**

---

## ¿Y qué pasa con las fuentes?

Ahora tenemos otro problema.

Supongamos que el documento usa una fuente concreta.

Si esa fuente existe en el ordenador, todo va bien.

Pero ¿qué pasa si no existe?

El navegador puede usar otra fuente en su lugar.

Esto se llama **Font Fallback** (fuente de respaldo).

En términos simples:

> «La fuente que pediste no está disponible, así que probaré con otra.»

Eso suele ser algo bueno para un sitio web.

Si falta una fuente concreta, es mucho mejor mostrar la página con otra fuente que mostrar caracteres faltantes.

Pero cuando se crea un PDF que debe verse **exactamente igual en todas partes**, esto puede convertirse en un problema.

---

## ¿Qué es una Web Font?

Un sitio web puede traer consigo la fuente que necesita.

Una fuente que proporciona el propio sitio web se llama **Web Font**.

En lugar de decirle al ordenador:

> «Usa una fuente que ya tengas instalada.»

El sitio web dice:

> «Aquí tienes la fuente que quiero que uses.»

Esto le da al sitio web mucho más control sobre el aspecto de su texto.

Pero aún hay que asegurarse de que el PDF final no dependa de lo que resulte estar instalado en el ordenador donde se abre o se imprime el PDF.

---

## ¿Qué pasa cuando falta un carácter?

Esto nos lleva a algo que quizá recuerden muy bien quienes usaron ordenadores en la década de 1990.

A veces, en lugar de un carácter, aparecía:

**□**

Un pequeño cuadrado.

Para alguien que creció con ordenadores modernos, esto puede parecer extraño.

Pero ese cuadrado simplemente significa:

> «Hay un carácter aquí, pero no tengo la forma necesaria para dibujarlo.»

La forma de un carácter dentro de una fuente se llama **Glifo** (Glyph).

---

## Entonces, ¿qué es un Glifo?

Una forma sencilla de pensar en un Glifo es:

**El dibujo de un carácter.**

Por ejemplo, el carácter dice:

> «Esta es la letra A.»

El Glifo es la forma real que usa la fuente para dibujar la letra A.

Fuentes distintas tienen Glifos distintos.

Por eso la misma letra puede verse muy diferente en distintas fuentes.

El Glifo es, en esencia, la información que el ordenador necesita para saber **cómo dibujar el carácter**.

---

## ¿Por qué no simplemente convertir el texto en una imagen?

Porque entonces perderíamos una de las ventajas más importantes del texto real.

Si convertimos la palabra:

**Hola**

en una imagen, el ordenador ya no sabe que se trata de la palabra «Hola».

Solo ve píxeles.

En cambio, al trabajar con los Glifos de la fuente, podemos conservar las formas reales de los caracteres.

Esto permite que el texto se mantenga nítido al ampliarlo o imprimirlo.

Y lo más importante:

**no tenemos que depender de que el ordenador o la impresora de destino tengan instalada exactamente la misma fuente.**

La información necesaria para dibujar el texto puede formar parte del propio documento.

---

## Y luego está el hebreo

El hebreo ya tiene algunos requisitos particulares.

Pero en cuanto añadimos el **nikud** (los signos vocálicos), las cosas se complican todavía más.

Por ejemplo:

**שָׁלוֹם**

Los pequeños signos que aparecen encima y debajo de las letras no son simples imágenes pequeñas.

Son parte del texto.

El sistema necesita saber:

* Qué signo está presente.
* A qué letra pertenece.
* Dónde exactamente debe colocarse.
* Cómo interactúa con la fuente.
* Qué ocurre cuando cambia la fuente.

Aquí es donde el manejo correcto de los Glifos y las fuentes se vuelve especialmente importante.

---

## Una fuente es mucho más que "dibujos de letras"

Una forma útil de pensar en una fuente es como una gran colección de formas.

Contiene las formas de las letras, los números, la puntuación y muchos otros caracteres.

Cuando queremos mostrar texto, hay que encontrar la forma correcta para cada carácter y colocarla en la posición correcta.

Con el nikud hebreo hay todavía más trabajo.

Los signos del nikud deben colocarse en relación con las letras a las que pertenecen.

Así que no basta con saber:

> «Aquí hay un kamatz.»

También hay que saber:

> «¿Dónde exactamente debe colocarse este kamatz respecto a la letra?»

---

## La extensión del motor de PDF para el hebreo y el nikud

El motor de PDF que usamos se llama **Folio**. Comenzó como un proyecto de código abierto, y hemos construido nuestra propia versión sobre él, extendiéndola especialmente para las necesidades de los documentos en hebreo.

En particular:

**el nikud, las fuentes, el Font Fallback y los Glifos.**

El objetivo no es simplemente que el hebreo se vea bien en el navegador.

El objetivo es que el texto permanezca preciso y coherente cuando la página se convierte en PDF.

---

## El resultado que queremos

En definitiva, queremos esto:

**Creas un PDF en tu ordenador**

↓

**Se lo envías a otra persona**

↓

**Esa persona lo abre en otro ordenador**

↓

**Lo imprime en otra impresora**

Y el resultado sigue siendo el mismo.

Esa persona no debería necesitar instalar la fuente original.

No deberíamos tener que depender de lo que haya, por casualidad, en su ordenador.

No deberíamos tener que convertir el texto en una imagen.

Y el PDF no debería necesitar crearse en un servidor remoto.

---

## Uniéndolo todo

La idea completa se puede resumir así:

### HTML

El documento que queremos convertir en PDF.

↓

### Motor de maquetación

Calcula dónde debe ir cada cosa.

↓

### Web Fonts

Proporcionan las fuentes que el documento necesita.

↓

### Glifos

Proporcionan las formas precisas de las letras y los caracteres.

↓

### PDF

Guarda el resultado como un documento independiente que se puede abrir e imprimir.

Y todo esto puede ocurrir:

**directamente dentro del navegador, mediante WebAssembly.**

---

## Entonces, ¿qué tiene de especial este enfoque?

No se trata simplemente de poder "descargar un PDF".

Lo interesante es **cómo** se crea el PDF.

En lugar de fotografiar lo que muestra el navegador, reconstruimos el documento.

En lugar de depender de las fuentes instaladas en el ordenador, podemos proporcionar la información que el documento necesita.

En lugar de convertir el texto en una imagen, trabajamos con las formas reales de los caracteres.

Y en lugar de enviar el documento a un servidor para que haga el trabajo, todo el proceso puede ocurrir dentro del navegador.

Al añadir a esto un soporte correcto para el hebreo y el nikud, se puede llegar a un resultado en el que:

> **El PDF creado en el navegador sigue siendo un documento real, nítido y coherente, desde la pantalla hasta la impresora.**
