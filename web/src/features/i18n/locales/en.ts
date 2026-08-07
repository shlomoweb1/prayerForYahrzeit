import { he } from './he'

export const en = {
  common: {
    brand: 'Tefila La-Neshama',
    tagline: 'Memorial prayer sheets for the cemetery',
    bsd: "B'siyata D'shmaya",
    skipLink: 'Skip to content',
    nav: {
      home: 'Home',
      wizard: 'Create sheet',
      accessibility: 'Accessibility',
    },
    footer: {
      accessibility: 'Accessibility statement',
      rights: 'All rights reserved',
      prayers: 'Prayers',
      categories: {
        yizkor: 'Yizkor',
        kaddish: 'Kaddish',
        psalms: 'Psalms',
        mishnayot: 'Mishnayot',
        hashkava: 'Hashkava',
      },
    },
    cta: {
      create: 'Create Prayer',
    },
    localeNames: {
      he: 'עברית',
      en: 'English',
      es: 'Español',
      fr: 'Français',
    },
    close: 'Close',
    cancel: 'Cancel',
    next: 'Next',
    previous: 'Previous',
    startOver: 'Start over',
    loading: 'Loading…',
    notFound: {
      title: 'Page not found',
      description: 'The address you requested does not exist.',
      backHome: 'Back to home',
    },
  },
  landing: {
    title: 'Create a printable yahrzeit sheet',
    subtitle:
      'Enter a name and the site builds a beautifully designed memorial prayer sheet with psalms, kaddish and mishnayot — to print, bring to the graveside, and recite in memory of a loved one.',
    ctaStart: 'Get started',
    ctaLookInside: 'See an example',
    howItWorksTitle: 'A printable prayer, ready for the graveside',
    howItWorksIntro:
      'In a few minutes you can create a beautiful prayer sheet to print and bring to the cemetery — to recite by the grave and honour your loved one’s memory.',
    memorialTitle: 'Honour across generations',
    memorialText:
      'Every sheet is set with print-house precision, in a format that honours tradition — and lets you share the memory with the whole family.',
    heroPick: 'Background:',
    featureItems: {
      simple: 'Hebrew name, gender and prayer rite — the sheet builds itself',

      preview: 'Every line is set with print-house precision, exactly as it will print',

      pdf: 'A polished PDF to print at home or at a print shop — ready for the cemetery',

      share: 'Send the same prayer to relatives, so they can recite it too',
    },
    featureTitles: {
      simple: 'A few simple details',
      preview: 'See the sheet',
      pdf: 'Print it',
      share: 'Share with family',
    },
  },
  theme: {
    open: 'Theme',
    dialogTitle: 'Theme and design',
    dialogDescription: 'Choose the mood of the page: colours, brightness and background image.',
    themeGroup: 'Theme',
    themes: {
      dusk: 'Dusk — candlelight',
      parchment: 'Parchment — antique paper',
      stone: 'Stone — Mount of Olives',
    },
    mode: {
      light: 'Light mode',
      dark: 'Dark mode',
    },
    toggleHint: 'click to switch',
    heroGroup: 'Background image',
    heroAuto: 'Automatic',
    heroRandom: 'Random',
    heroImages: {
      candleDusk: 'Shabbat candle at sunset',
      marbleParchment: 'Parchment marble',
      tombstoneOlives: 'Tombstone and olive trees',
    },
  },
  wizard: {
    title: 'Yahrzeit sheet wizard',
    stepIndicator: 'Step {{current}} of {{total}}',
    scaffoldNote: 'The {{feature}} editor will be built in phase 3 of development.',
    steps: {
      '1': {
        title: 'Gender',
        description: "Choose the deceased's gender: male or female.",
      },
      '2': {
        title: 'Nusach',
        description: 'Choose the prayer rite: Ashkenaz or Sephardic (Mizrahi).',
      },
      '3': {
        title: 'Name',
        description:
          "Enter the Hebrew name and the father's name, as they will appear at the top of the sheet.",
      },
      '4': {
        title: 'Sheet purpose',
        description: 'Is the sheet for printing, sharing, or both?',
      },
      '5': {
        title: 'Edit and download',
        description:
          'Choose which sections appear and how they are distributed across pages, then preview, print, download or share.',
      },
    },
    tabs: {
      editor: 'Editor',
      preview: 'Preview',
    },
    labels: {
      target: 'Sheet purpose',
      paper: 'Paper size',
      gender: 'Gender',
      nusach: 'Nusach',
      name_male: 'Deceased name',
      name_female: 'Deceased name',
      parent: "Father's name",
      namePreview: 'Preview',
      lineage: 'Lineage',
      font: 'Font',
      nikud: 'Vowel points',
      deco: 'Decorations',
      acrostic: 'Acrostic',
      blessing: '30-day blessing (אשר יצר אתכם בדין)',
      hashkavaVariant: 'Hashkava text',
      sections: 'Sheet sections',
      settings: 'Settings',
      dialog: 'Dialog',
      editorMode: 'Editor mode',
      lineDensity: 'Line density',
      fontTitle: 'Title font',
      fontHeading: 'Heading font',
      fontBody: 'Body text font',
    },
    groups: {
      design: 'Design & layout',
      content: 'Page content',
      sections: 'Sheet sections',
    },
    sections: {
      psalms: 'Fixed psalms (לג טז יז עב צא קד קל)',
      neshama: 'Letters of the name + psalm 119',
      kaddish: 'Kaddish Yatom',
      mishnayot: 'Mishnayot of the name',
      hashkava: 'Hashkava',
      closing: 'Closing prayers',
    },
    actions: {
      print: 'Print',
      download: 'Download PDF',
      downloading: 'Rendering…',
      share: 'Share',
      save: 'Save to account',
      copyLink: 'Copy link',
      whatsapp: 'WhatsApp',
      settings: 'Settings',
      hideSettings: 'Hide settings',
      showSettings: 'Show settings',
    },
    toasts: {
      linkCopied: 'Link copied',
      shareSuccess: 'Memorial sheet shared',
      shareFailed: 'Sharing failed',
    },
    fallback: {
      shareUnsupported:
        'File sharing is not supported in this browser — the file was downloaded and a link was copied.',
      pdfPreviewUnsupported: 'PDF preview isn’t supported in this browser, but the file is ready.',
    },
    placeholders: {
      name_male: 'e.g. Moshe David',
      name_female: 'e.g. Sarah Rivka',
      parent: 'e.g. Avraham',
    },
    options: {
      target: {
        print: 'Print',
        share: 'Share',
        both: 'Print and share',
      },
      paper: {
        a4: 'A4',
        letter: 'Letter',
      },
      gender: {
        male: 'Male',
        female: 'Female',
      },
      nusach: {
        ashkenaz: 'Ashkenaz',
        sefard: 'Sephardic (Mizrahi)',
      },
      acrostic: {
        both: 'Deceased and parent names',
        name: 'Deceased name only',
        parent: 'Parent name only',
        none: 'No acrostic',
      },
      lineage: {
        kohen: 'Kohen',
        levi: 'Levi',
        none: 'Yisrael',
      },
      hashkavaVariant: {
        elMaleh: 'El Malei Rachamim',
        traditional: 'Traditional Hashkava (long text)',
        both: 'Both',
      },
      editorMode: {
        simple: 'Simple',
        advanced: 'Advanced',
      },
      lineDensity: {
        tidy: 'Tidy',
        normal: 'Normal',
        loose: 'Loose',
      },
    },
    hints: {
      name_male: 'You can add a second given name too, e.g. Moshe David.',
      name_female: 'You can add a second given name too, e.g. Sarah Rivka.',
      target: {
        print: 'A print-ready PDF, laid out for a home or shop printer.',
        share: 'A shareable file, sent by link, WhatsApp or email.',
        both: 'A print-ready file, plus a shareable version.',
      },
      paper: {
        a4: 'The standard size across Israel, Europe and most of the world.',
        letter: 'The standard size in the US and Canada.',
      },
      gender: {
        male: "Matches the sheet's wording to the male form.",
        female: "Matches the sheet's wording to the female form.",
      },
      nusach: {
        ashkenaz: 'The prayer text used in Ashkenazi communities.',
        sefard: 'The prayer text used in Sephardic and Mizrahi communities.',
      },
      lineage: {
        kohen: 'Adds the title "HaKohen" before ז״ל.',
        levi: 'Adds the title "HaLevi" before ז״ל.',
        none: 'No lineage title added.',
      },
    },
    paperDimensions: {
      a4: '210 × 297 mm',
      letter: '215.9 × 279.4 mm',
    },
    errors: {
      render: 'PDF render failed: {{message}}',
    },
    dialog: {
      share: 'Share',
      print: 'Print',
      settings: 'Settings',
      scaffoldNote: 'This dialog will be completed in a later phase of development.',
      saveNote: 'Saving to an account will be available in a future release.',
      shareDescription:
        'Share the memorial sheet as a PDF file, or copy a link to the sheet settings.',
      printDescription: 'Printing happens through the browser print dialog.',
    },
  },
  a11y: {
    open: 'Accessibility',
    widgetTitle: 'Accessibility preferences',
    widgetDescription: 'Preferences are stored on this device and apply across the site.',
    textSize: 'Text size',
    textSizeValue: '{{size}}%',
    applied: 'Preference applied',
    reset: 'Reset all preferences',
    toggles: {
      contrast: 'High contrast',
      mono: 'Invert and monochrome',
      lineSpacing: 'Increased line spacing',
      wordSpacing: 'Increased word spacing',
      letterSpacing: 'Increased letter spacing',
      readableFont: 'Readable font',
      highlightLinks: 'Highlight links',
      highlightHeadings: 'Highlight headings',
      largeCursor: 'Large cursor',
      stopAnimations: 'Stop animations',
    },
  },
  accessibilityPage: {
    title: 'Accessibility statement',
    updatedAt: 'Statement date',
    lastAudit: 'Last accessibility audit',
    conformanceTitle: 'Conformance',
    conformanceBody:
      'This site aims to meet the requirements of Israeli Standard IS 5568, based on WCAG 2.0 Level AA, under the Equal Rights for Persons with Disabilities Law, 1998.',
    featuresTitle: 'Features provided',
    featuresItems: {
      widget: 'Accessibility preferences widget (Reg-35) — open with Alt+A from any page',

      keyboard: 'Full keyboard navigation, including skip-to-content',

      languages: 'Full right-to-left (RTL) Hebrew and left-to-right English, Spanish and French',

      scaling: 'Text scaling up to 150% without breaking the layout (rem units)',

      contrast: 'Colour contrast meeting requirements',

      nomouse: 'All functionality available without a mouse',
    },
    limitationsTitle: 'Known limitations',
    limitationsItems: {
      pdf: 'Screen-reader support in generated PDF files is being tested and is planned to be completed in phase 7 — the current version includes an accessible HTML view as a fallback.',

      srMatrix:
        'Some professional tests (NVDA, JAWS, VoiceOver, TalkBack) have not yet been fully performed.',
    },
    feedbackTitle: 'Feedback',
    feedbackBody: 'We would love to hear about accessibility issues you encounter. Contact us at:',
  },
} satisfies typeof he
