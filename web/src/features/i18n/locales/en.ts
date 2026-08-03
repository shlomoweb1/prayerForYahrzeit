import { he } from './he'

export const en = {
  common: {
    brand: 'Yizkor',
    tagline: 'Printable memorial sheet',
    skipLink: 'Skip to content',
    nav: {
      home: 'Home',
      wizard: 'Create sheet',
      accessibility: 'Accessibility',
    },
    footer: {
      accessibility: 'Accessibility statement',
      rights: 'All rights reserved',
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
      'Enter a name and the site builds a beautifully designed memorial sheet with psalms, kaddish and mishnayot — for printing or sharing.',
    ctaStart: 'Get started',
    howItWorksTitle: 'How it works',
    featureItems: {

      simple: 'Seven simple steps to create your sheet',

      preview: 'Millimetre-accurate live preview',

      pdf: 'High-quality PDF output — entirely in the browser',

      share: 'Settings are kept in the URL, ready to share',

    },
  },
  wizard: {
    title: 'Yahrzeit sheet wizard',
    stepIndicator: 'Step {{current}} of {{total}}',
    scaffoldNote: 'The {{feature}} editor will be built in phase 3 of development.',
    steps: {
      '1': {
        title: 'Sheet purpose',
        description: 'Is the sheet for printing, sharing, or both?',
      },
      '2': {
        title: 'Gender',
        description: 'Choose: son (ben) or daughter (bat).',
      },
      '3': {
        title: 'Nusach',
        description: 'Choose the prayer rite: Ashkenaz or Sefard.',
      },
      '4': {
        title: 'Deceased name',
        description: 'Enter the Hebrew name, as it will appear at the top of the sheet.',
      },
      '5': {
        title: 'Father\'s name',
        description: 'Enter the father\'s (or mother\'s) name used to identify the deceased.',
      },
      '6': {
        title: 'Split editor',
        description: 'Choose which sections appear and how they are distributed across pages.',
      },
      '7': {
        title: 'Review and download',
        description: 'Review the preview, then print, download or share.',
      },
    },
    labels: {
      target: 'Sheet purpose',
      paper: 'Paper size',
      gender: 'Gender',
      nusach: 'Nusach',
      name: 'Deceased name',
      parent: 'Father\'s name',
      font: 'Font',
      nikud: 'Vowel points',
      deco: 'Decorations',
      acrostic: 'Acrostic',
      blessing: '30-day blessing (אשר יצר אתכם בדין)',
      sections: 'Sheet sections',
      settings: 'Settings',
      dialog: 'Dialog',
    },
    sections: {
      psalms: 'Fixed psalms (לג טז יז עב צא קד קל)',
      neshama: 'Letters of the name + psalm 119',
      kaddish: 'Kaddish Yatom',
      mishnayot: 'Mishnayot of the name',
      hashkava: 'Kaddish Derabanan + Hashkava',
      closing: 'Closing prayers',
    },
    actions: {
      print: 'Print',
      download: 'Download PDF',
      downloading: 'Rendering…',
      share: 'Share',
      save: 'Save to account',
    },
    placeholders: {
      name: 'e.g. Moshe ben Avraham',
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
        male: 'Son (ben)',
        female: 'Daughter (bat)',
      },
      nusach: {
        ashkenaz: 'Ashkenaz',
        sefard: 'Sefard',
      },
      acrostic: {
        both: 'Deceased and parent names',
        name: 'Deceased name only',
        parent: 'Parent name only',
        none: 'No acrostic',
      },
    },
    errors: {
      render: 'PDF render failed: {{message}}',
    },
    dialog: {
      share: 'Share',
      print: 'Print',
      settings: 'Settings',
      scaffoldNote: 'This action will be completed in a later phase of development.',
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

      srMatrix: 'Some professional tests (NVDA, JAWS, VoiceOver, TalkBack) have not yet been fully performed.',

    },
    feedbackTitle: 'Feedback',
    feedbackBody: 'We would love to hear about accessibility issues you encounter. Contact us at:',
  },
} satisfies typeof he
