import { he } from './he'

export const es = {
  common: {
    brand: 'Yizkor',
    tagline: 'Hoja conmemorativa imprimible',
    skipLink: 'Saltar al contenido',
    nav: {
      home: 'Inicio',
      wizard: 'Crear hoja',
      accessibility: 'Accesibilidad',
    },
    footer: {
      accessibility: 'Declaración de accesibilidad',
      rights: 'Todos los derechos reservados',
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
      'Introduce un nombre y el sitio creará una hoja conmemorativa con salmos, kadish y mishnayot — para imprimir o compartir.',
    ctaStart: 'Empezar',
    howItWorksTitle: 'Cómo funciona',
    featureItems: {

      simple: 'Siete pasos sencillos para crear tu hoja',

      preview: 'Vista previa precisa al milímetro',

      pdf: 'PDF de alta calidad — totalmente en el navegador',

      share: 'La configuración se guarda en la URL, lista para compartir',

    },
  },
  wizard: {
    title: 'Asistente de hoja conmemorativa',
    stepIndicator: 'Paso {{current}} de {{total}}',
    scaffoldNote: 'El editor de {{feature}} se construirá en la fase 3 del desarrollo.',
    steps: {
      '1': {
        title: 'Finalidad de la hoja',
        description: '¿La hoja es para imprimir, compartir o ambos?',
      },
      '2': {
        title: 'Género',
        description: 'Elija: hijo (ben) o hija (bat).',
      },
      '3': {
        title: 'Nusaj',
        description: 'Elija el rito de oración: askenazí o sefardí.',
      },
      '4': {
        title: 'Nombre del difunto',
        description: 'Introduzca el nombre hebreo, tal como aparecerá en la parte superior de la hoja.',
      },
      '5': {
        title: 'Nombre del padre',
        description: 'Introduzca el nombre del padre (o de la madre) para identificar al difunto.',
      },
      '6': {
        title: 'Editor de distribución',
        description: 'Elija qué secciones aparecen y cómo se distribuyen entre las páginas.',
      },
      '7': {
        title: 'Revisión y descarga',
        description: 'Revise la vista previa y luego imprima, descargue o comparta.',
      },
    },
    labels: {
      target: 'Propósito de la hoja',
      paper: 'Tamaño de papel',
      gender: 'Género',
      nusach: 'Nusaj',
      name: 'Nombre del difunto',
      parent: 'Nombre del padre',
      font: 'Fuente',
      nikud: 'Puntos vocales',
      deco: 'Decoraciones',
      acrostic: 'Acróstico',
      blessing: 'Bendición de 30 días (אשר יצר אתכם בדין)',
      sections: 'Secciones de la hoja',
      settings: 'Ajustes',
      dialog: 'Diálogo',
    },
    sections: {
      psalms: 'Salmos fijos (לג טז יז עב צא קד קל)',
      neshama: 'Letras del nombre + Salmo 119',
      kaddish: 'Kadish Yatom',
      mishnayot: 'Mishnaiot del nombre',
      hashkava: 'Kadish Derabanán + Hashkavá',
      closing: 'Oraciones de cierre',
    },
    actions: {
      print: 'Imprimir',
      download: 'Descargar PDF',
      downloading: 'Renderizando…',
      share: 'Compartir',
      save: 'Guardar en la cuenta',
      copyLink: 'Copiar enlace',
      whatsapp: 'WhatsApp',
    },
    toasts: {
      linkCopied: 'Enlace copiado',
      shareSuccess: 'Hoja conmemorativa compartida',
      shareFailed: 'Error al compartir',
    },
    fallback: {
      shareUnsupported:
        'Compartir archivos no es compatible con este navegador — el archivo se ha descargado y se ha copiado un enlace.',
    },
    placeholders: {
      name: 'p. ej. Moshé ben Avraham',
      parent: 'p. ej. Avraham',
    },
    options: {
      target: {
        print: 'Imprimir',
        share: 'Compartir',
        both: 'Imprimir y compartir',
      },
      paper: {
        a4: 'A4',
        letter: 'Carta',
      },
      gender: {
        male: 'Hijo (ben)',
        female: 'Hija (bat)',
      },
      nusach: {
        ashkenaz: 'Askenazí',
        sefard: 'Sefardí',
      },
      acrostic: {
        both: 'Nombres del difunto y del padre',
        name: 'Solo el nombre del difunto',
        parent: 'Solo el nombre del padre',
        none: 'Sin acróstico',
      },
    },
    errors: {
      render: 'Error al generar el PDF: {{message}}',
    },
    dialog: {
      share: 'Compartir',
      print: 'Imprimir',
      settings: 'Ajustes',
      scaffoldNote: 'Este diálogo se completará en una fase posterior del desarrollo.',
      saveNote: 'Guardar en la cuenta estará disponible en una versión futura.',
      shareDescription:
        'Comparta la hoja conmemorativa como archivo PDF, o copie un enlace a los ajustes de la hoja.',
      printDescription: 'La impresión se realiza mediante el diálogo de impresión del navegador.',
    },
  },
  a11y: {
    open: 'Accesibilidad',
    widgetTitle: 'Preferencias de accesibilidad',
    widgetDescription: 'Las preferencias se guardan en este dispositivo y se aplican en todo el sitio.',
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

      widget: 'Widget de preferencias de accesibilidad (Reg-35) — abrir con Alt+A desde cualquier página',

      keyboard: 'Navegación completa por teclado, incluido saltar al contenido',

      languages: 'Hebreo de derecha a izquierda (RTL) e inglés, español y francés de izquierda a derecha',

      scaling: 'Escalado de texto hasta el 150 % sin romper el diseño (unidades rem)',

      contrast: 'Contraste de colores que cumple los requisitos',

      nomouse: 'Toda la funcionalidad disponible sin ratón',

    },
    limitationsTitle: 'Limitaciones conocidas',
    limitationsItems: {

      pdf: 'El soporte de lectores de pantalla en los archivos PDF generados está en fase de prueba y está previsto que se complete en la fase 7 — la versión actual incluye una vista HTML accesible como alternativa.',

      srMatrix: 'Algunas pruebas profesionales (NVDA, JAWS, VoiceOver, TalkBack) aún no se han realizado por completo.',

    },
    feedbackTitle: 'Comentarios',
    feedbackBody: 'Nos encantaría conocer los problemas de accesibilidad que encuentre. Escríbanos a:',
  },
} satisfies typeof he
