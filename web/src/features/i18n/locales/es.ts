import { he } from './he'

export const es = {
  common: {
    brand: 'Tefila La-Neshama',
    tagline: 'Hojas de oración conmemorativas para el cementerio',
    siyata: {
      he: 'ב׳ס״ד',
      en: "B'siyata D'shmaya",
    },
    skipLink: 'Saltar al contenido',
    nav: {
      home: 'Inicio',
      wizard: 'Crear hoja',
      accessibility: 'Accesibilidad',
      about: 'Acerca de',
    },
    footer: {
      accessibility: 'Declaración de accesibilidad',
      rights: 'Todos los derechos reservados',
      prayers: 'Oraciones',
      categories: {
        yizkor: 'Yizkor',
        kaddish: 'Kadish',
        psalms: 'Salmos',
        mishnayot: 'Mishná',
        hashkava: 'Hashkavá',
      },
    },
    cta: {
      create: 'Crear oración',
    },
    localeNames: {
      he: 'עברית',
      en: 'English',
      es: 'Español',
      fr: 'Français',
    },
    close: 'Cerrar',
    cancel: 'Cancelar',
    next: 'Siguiente',
    previous: 'Anterior',
    startOver: 'Empezar de nuevo',
    loading: 'Cargando…',
    notFound: {
      title: 'Página no encontrada',
      description: 'La dirección solicitada no existe.',
      backHome: 'Volver al inicio',
    },
  },
  landing: {
    title: 'Crea una hoja conmemorativa imprimible',
    subtitle:
      'Introduce un nombre y el sitio creará una hermosa hoja de oración con salmos, kadish y mishnayot — para imprimir, llevar al cementerio y recitar en memoria de un ser querido.',
    ctaStart: 'Empezar',
    ctaLookInside: 'Ver un ejemplo',
    howItWorksTitle: 'Una oración imprimible, lista para el cementerio',
    howItWorksIntro:
      'En unos minutos crearás una hermosa hoja de oración para imprimir y llevar al cementerio — para recitarla junto a la tumba y honrar la memoria de tu ser querido.',
    memorialTitle: 'Honor a través de las generaciones',
    memorialText:
      'Cada hoja se compone con precisión de imprenta, en un formato que honra la tradición — y te permite compartir el recuerdo con toda la familia.',
    heroPick: 'Fondo:',
    featureItems: {
      simple: 'Nombre hebreo, género y rito de oración — la hoja se compone sola',

      preview: 'Cada línea está compuesta con precisión de imprenta, tal como se imprimirá',

      pdf: 'Un PDF pulido, para imprimir en casa o en una imprenta — listo para el cementerio',

      share: 'Envía la misma oración a tus allegados, para que también la reciten',
    },
    featureTitles: {
      simple: 'Unos datos sencillos',
      preview: 'Mira la hoja',
      pdf: 'Imprímela',
      share: 'Compártela en familia',
    },
  },
  theme: {
    open: 'Tema',
    dialogTitle: 'Tema y diseño',
    dialogDescription: 'Elige el ambiente de la página: colores, luminosidad e imagen de fondo.',
    themeGroup: 'Tema',
    themes: {
      dusk: 'Crepúsculo — luz de vela',
      parchment: 'Pergamino — papel antiguo',
      stone: 'Piedra — Monte de los Olivos',
    },
    mode: {
      light: 'Modo claro',
      dark: 'Modo oscuro',
    },
    toggleHint: 'clic para cambiar',
    heroGroup: 'Imagen de fondo',
    heroAuto: 'Automático',
    heroRandom: 'Aleatorio',
    heroImages: {
      candleDusk: 'Vela de Shabat al atardecer',
      marbleParchment: 'Mármol pergamino',
      tombstoneOlives: 'Lápida y olivos',
    },
  },
  wizard: {
    title: 'Asistente de hoja conmemorativa',
    stepIndicator: 'Paso {{current}} de {{total}}',
    scaffoldNote: 'El editor de {{feature}} se construirá en la fase 3 del desarrollo.',
    steps: {
      '1': {
        title: 'Género',
        description: 'Elija el género del difunto: masculino o femenino.',
      },
      '2': {
        title: 'Nusaj',
        description: 'Elija el rito de oración: askenazí o sefardí (mizrají).',
      },
      '3': {
        title: 'Nombre',
        description:
          'Introduzca el nombre hebreo y el nombre del padre, tal como aparecerán en la parte superior de la hoja.',
      },
      '4': {
        title: 'Fecha de fallecimiento',
        description:
          'Introduzca la fecha hebrea del fallecimiento, o elija la fecha gregoriana y calcularemos la fecha hebrea por usted.',
      },
      '5': {
        title: 'Editar y descargar',
        description:
          'Elija qué secciones aparecen y cómo se distribuyen entre las páginas, luego previsualice, imprima, descargue o comparta.',
      },
    },
    tabs: {
      editor: 'Editor',
      preview: 'Vista previa',
    },
    labels: {
      paper: 'Tamaño de papel',
      gender: 'Género',
      edah: 'Comunidad',
      nusachAshkenaz: 'Nusaj',
      name_male: 'Nombre del difunto',
      name_female: 'Nombre de la difunta',
      parent: 'Nombre del padre',
      namePreview: 'Vista previa',
      lineage: 'Linaje',
      font: 'Fuente',
      nikud: 'Puntos vocales',
      deco: 'Decoraciones',
      acrostic: 'Acróstico',
      blessing: 'Bendición de 30 días (אשר יצר אתכם בדין)',
      hashkavaVariant: 'Texto de Hashkavá',
      elMalehPhrase: 'Redacción de "בעבור"',
      kaddishResponseLabel: 'Etiqueta de respuesta de la congregación',
      kaddishAdvanced: 'Ajustes avanzados del kaddish',
      sections: 'Secciones de la hoja',
      settings: 'Ajustes',
      dialog: 'Diálogo',
      settingsMode: 'Modo de configuración',
      lineDensity: 'Densidad de línea',
      fontBsd: 'בס"ד (arriba a la derecha)',
      fontSheetTitle: 'Título de la hoja',
      fontNameLine: 'Línea del nombre',
      fontSectionTitle: 'Títulos de sección',
      fontPsalmBadge: 'Insignia del salmo',
      fontPsalmText: 'Texto de los salmos',
      fontLetterBadge: 'Insignia de letra',
      fontLetterText: 'Texto de las letras',
      fontKaddishMourner: 'Kadish — dolientes',
      fontKaddishCongregation: 'Kadish — congregación',
      fontMishnahBadge: 'Insignia de mishná',
      fontMishnahText: 'Texto de las mishnayot',
      fontBlessingText: 'Bendición',
      fontElMalehText: 'El Malei Rajamim',
      fontHashkavaText: 'Hashkavá',
      fontClosingDryBones: 'Cierre — huesos secos',
      fontClosingAvHaRachamim: 'Cierre — Av HaRajamim',
      fontClosingParting: 'Cierre — oración de despedida',
    },
    groups: {
      design: 'Diseño y maquetación',
      content: 'Contenido de la hoja',
      sections: 'Secciones de la hoja',
      fontHeader: 'Encabezado de la hoja',
      fontPsalms: 'Salmos',
      fontLetters: 'Letras acrósticas',
      fontKaddish: 'Kadish',
      fontMishnayot: 'Mishnayot',
      fontPrayers: 'Bendición y cierre',
    },
    sections: {
      psalms: 'Salmos fijos (לג טז יז עב צא קד קל)',
      neshama: 'Letras del nombre + Salmo 119',
      kaddish: 'Kadish Yatom',
      mishnayot: 'Mishnaiot del nombre',
      hashkava: 'Hashkavá',
      closing: 'Oraciones de cierre',
    },
    actions: {
      print: 'Imprimir',
      download: 'Descargar PDF',
      downloading: 'Renderizando…',
      save: 'Guardar en la cuenta',
      settings: 'Ajustes',
      hideSettings: 'Ocultar ajustes',
      showSettings: 'Mostrar ajustes',
    },
    fallback: {
      pdfPreviewUnsupported:
        'La vista previa de PDF no es compatible con este navegador, pero el archivo está listo.',
    },
    placeholders: {
      name_male: 'p. ej. Moshé David',
      name_female: 'p. ej. Sara Rivka',
      parent: 'p. ej. Avraham',
    },
    options: {
      paper: {
        a4: 'A4',
        letter: 'Carta',
      },
      gender: {
        male: 'Masculino',
        female: 'Femenino',
      },
      edah: {
        ashkenaz: 'Askenazí',
        mizrahi: 'Sefardí (mizrají)',
      },
      nusachAshkenaz: {
        ashkenaz: 'Nusaj Askenaz',
        sefard: 'Nusaj Sefard',
      },
      acrostic: {
        both: 'Nombres del difunto y del padre',
        name: 'Solo el nombre del difunto',
        parent: 'Solo el nombre del padre',
        none: 'Sin acróstico',
      },
      lineage: {
        kohen: 'Cohen',
        levi: 'Leví',
        none: 'Israel',
      },
      hashkavaVariant: {
        elMaleh: 'El Malei Rajamim',
        traditional: 'Hashkavá tradicional (texto largo)',
        both: 'Ambos',
      },
      elMalehPhrase: {
        charity: 'Se donó caridad',
        psalms: 'Oramos por la elevación de su alma',
      },
      kaddishResponseLabel: {
        congregation: 'Congregación',
        responders: 'Quienes responden',
        none: 'Sin etiqueta',
      },
      settingsMode: {
        simple: 'Simple',
        advanced: 'Avanzado',
      },
      lineDensity: {
        tidy: 'Compacta',
        normal: 'Normal',
        loose: 'Amplia',
      },
    },
    hints: {
      name_male: 'También puede añadir un segundo nombre, p. ej. Moshé David.',
      name_female: 'También puede añadir un segundo nombre, p. ej. Sara Rivka.',
      paper: {
        a4: 'El tamaño estándar en Israel, Europa y la mayor parte del mundo.',
        letter: 'El tamaño estándar en Estados Unidos y Canadá.',
      },
      gender: {
        male: 'Ajusta el texto de la hoja a la forma masculina.',
        female: 'Ajusta el texto de la hoja a la forma femenina.',
      },
      edah: {
        ashkenaz: 'Comunidades askenazíes, con una elección de nusaj a continuación.',
        mizrahi: 'El texto de oración usado en las comunidades sefardíes y mizrajíes.',
      },
      nusachAshkenaz: {
        ashkenaz: 'El texto de oración usado en las comunidades askenazíes.',
        sefard: 'El texto de oración jasídico, usado en las comunidades Nusaj Sefard (askenazíes-jasídicas).',
      },
      lineage: {
        kohen: 'Añade el título "HaCohen" antes de ז״ל.',
        levi: 'Añade el título "HaLeví" antes de ז״ל.',
        none: 'Sin título de linaje adicional.',
      },
    },
    paperDimensions: {
      a4: '210 × 297 mm',
      letter: '215.9 × 279.4 mm',
    },
    deathDate: {
      instructions:
        'Toque el día del fallecimiento en el calendario de abajo: la fecha hebrea se muestra cada día.',
      dateSelected: 'Ha seleccionado el {{hebrew}} ({{gregorian}}, calendario civil).',
      sunsetQuestion: '¿El fallecimiento ocurrió antes o después de la puesta de sol (anochecer)?',
      pickAnotherDay: 'Volver al calendario',
      before: 'Antes de la puesta de sol',
      beforeHint: 'La fecha hebrea mostrada es correcta tal como está.',
      after: 'Después de la puesta de sol (anochecer)',
      afterHint: 'El día judío comienza al anochecer, por lo que la fecha hebrea avanza un día.',
      unsure: 'No estoy seguro/a',
      unsureHint: 'Usaremos la fecha hebrea de ese día — siempre puede corregirlo más adelante.',
      confirmedLabel: 'Fecha hebrea de fallecimiento',
      nextStepHint: 'Siguiente: se generará automáticamente una hoja de oración en hebreo personalizada como PDF para imprimir.',
      continueToSheet: 'Continuar a la hoja de oración',
      change: 'Elegir otra fecha',
      skip: 'Omitir — aún no tengo este dato',
      editMonthYear: 'Elegir otro mes o año',
      chooseMonth: 'Mes',
      chooseYear: 'Año',
      earlierYears: 'Años anteriores',
      laterYears: 'Años posteriores',
      switchToGregorian: 'Calendario gregoriano',
      switchToHebrew: 'Calendario hebreo',
    },
    dialog: {
      print: 'Imprimir',
      settings: 'Ajustes',
      kaddish: 'Ajustes avanzados del kaddish',
      kaddishDescription: 'Elija cómo se imprime la respuesta de la congregación en el kaddish.',
      scaffoldNote: 'Este diálogo se completará en una fase posterior del desarrollo.',
      saveNote: 'Guardar en la cuenta estará disponible en una versión futura.',
      printDescription: 'La impresión se realiza mediante el diálogo de impresión del navegador.',
    },
  },
  a11y: {
    open: 'Accesibilidad',
    widgetTitle: 'Preferencias de accesibilidad',
    widgetDescription:
      'Las preferencias se guardan en este dispositivo y se aplican en todo el sitio.',
    textSize: 'Tamaño del texto',
    textSizeValue: '{{size}}%',
    applied: 'Preferencia aplicada',
    reset: 'Restablecer todas las preferencias',
    toggles: {
      contrast: 'Alto contraste',
      mono: 'Invertir y monocromo',
      lineSpacing: 'Más espacio entre líneas',
      wordSpacing: 'Más espacio entre palabras',
      letterSpacing: 'Más espacio entre letras',
      readableFont: 'Tipografía legible',
      highlightLinks: 'Resaltar enlaces',
      highlightHeadings: 'Resaltar títulos',
      largeCursor: 'Cursor grande',
      stopAnimations: 'Detener animaciones',
    },
  },
  accessibilityPage: {
    title: 'Declaración de accesibilidad',
    updatedAt: 'Fecha de la declaración',
    lastAudit: 'Última auditoría de accesibilidad',
    conformanceTitle: 'Conformidad',
    conformanceBody:
      'Este sitio pretende cumplir los requisitos de la norma israelí IS 5568, basada en WCAG 2.0 nivel AA, según la Ley de Igualdad de Derechos de las Personas con Discapacidad, 1998.',
    featuresTitle: 'Funciones ofrecidas',
    featuresItems: {
      widget:
        'Widget de preferencias de accesibilidad (Reg-35) — abrir con Alt+A desde cualquier página',

      keyboard: 'Navegación completa por teclado, incluido saltar al contenido',

      languages:
        'Hebreo de derecha a izquierda (RTL) e inglés, español y francés de izquierda a derecha',

      scaling: 'Escalado de texto hasta el 150 % sin romper el diseño (unidades rem)',

      contrast: 'Contraste de colores que cumple los requisitos',

      nomouse: 'Toda la funcionalidad disponible sin ratón',
    },
    limitationsTitle: 'Limitaciones conocidas',
    limitationsItems: {
      pdf: 'El soporte de lectores de pantalla en los archivos PDF generados está en fase de prueba y está previsto que se complete en la fase 7 — la versión actual incluye una vista HTML accesible como alternativa.',

      srMatrix:
        'Algunas pruebas profesionales (NVDA, JAWS, VoiceOver, TalkBack) aún no se han realizado por completo.',
    },
    feedbackTitle: 'Comentarios',
    feedbackBody:
      'Nos encantaría conocer los problemas de accesibilidad que encuentre. Escríbanos a:',
  },
  aboutPage: {
    title: 'Acerca de',
    photoAlt: 'Un retrato de Shlomo',
    contact: {
      title: 'Contacto',
      description:
        '¿Busca a alguien que construya un sistema, un sitio web o un proyecto? Escríbame unas líneas y le responderé.',
      emailLabel: 'Su correo electrónico',
      emailPlaceholder: 'Cómo puedo ponerme en contacto',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Cuénteme sobre el proyecto…',
      send: 'Enviar',
      sending: 'Enviando…',
      success: 'Mensaje enviado. Le responderé pronto.',
      error: 'No se pudo enviar. Inténtelo de nuevo en un momento.',
      subject: 'Nuevo mensaje de la página Acerca de',
    },
  },
} satisfies typeof he
