import { he } from './he'

export const fr = {
  common: {
    brand: 'Yizkor',
    tagline: 'Feuille commémorative imprimable',
    skipLink: 'Aller au contenu',
    nav: {
      home: 'Accueil',
      wizard: 'Créer une feuille',
      accessibility: 'Accessibilité',
    },
    footer: {
      accessibility: 'Déclaration d’accessibilité',
      rights: 'Tous droits réservés',
    },
    localeNames: {
      he: 'עברית',
      en: 'English',
      es: 'Español',
      fr: 'Français',
    },
    close: 'Fermer',
    cancel: 'Annuler',
    next: 'Suivant',
    previous: 'Précédent',
    startOver: 'Recommencer',
    loading: 'Chargement…',
    notFound: {
      title: 'Page introuvable',
      description: 'L’adresse demandée n’existe pas.',
      backHome: 'Retour à l’accueil',
    },
  },
  landing: {
    title: 'Créez une feuille commémorative imprimable',
    subtitle:
      'Saisissez un nom et le site crée une feuille commémorative ornée de psaumes, de kaddish et de mishnayot — à imprimer ou à partager.',
    ctaStart: 'Commencer',
    howItWorksTitle: 'Comment ça marche',
    featureItems: {

      simple: 'Sept étapes simples pour créer votre feuille',

      preview: 'Aperçu précis au millimètre',

      pdf: 'PDF de haute qualité — entièrement dans le navigateur',

      share: 'Les réglages sont conservés dans l’URL, prêts à partager',

    },
  },
  wizard: {
    title: 'Assistant de feuille commémorative',
    stepIndicator: 'Étape {{current}} sur {{total}}',
    scaffoldNote: 'L’éditeur de {{feature}} sera construit à la phase 3 du développement.',
    steps: {
      '1': {
        title: 'But de la feuille',
        description: 'La feuille est-elle destinée à l’impression, au partage, ou aux deux ?',
      },
      '2': {
        title: 'Genre',
        description: 'Choisissez : fils (ben) ou fille (bat).',
      },
      '3': {
        title: 'Noussah',
        description: 'Choisissez le rite de prière : ashkénaze ou séfarade.',
      },
      '4': {
        title: 'Nom du défunt',
        description: 'Saisissez le nom hébreu, tel qu’il apparaîtra en haut de la feuille.',
      },
      '5': {
        title: 'Nom du père',
        description: 'Saisissez le nom du père (ou de la mère) servant à identifier le défunt.',
      },
      '6': {
        title: 'Éditeur de répartition',
        description: 'Choisissez les sections à afficher et leur répartition entre les pages.',
      },
      '7': {
        title: 'Vérification et téléchargement',
        description: 'Consultez l’aperçu, puis imprimez, téléchargez ou partagez.',
      },
    },
    labels: {
      target: 'Usage de la feuille',
      paper: 'Format du papier',
      gender: 'Genre',
      nusach: 'Nusach',
      name: 'Nom du défunt',
      parent: 'Nom du père',
      font: 'Police',
      nikud: 'Points voyelles',
      deco: 'Décorations',
      acrostic: 'Acrostiche',
      blessing: 'Bénédiction des 30 jours (אשר יצר אתכם בדין)',
      sections: 'Sections de la feuille',
      settings: 'Réglages',
      dialog: 'Dialogue',
    },
    sections: {
      psalms: 'Psaumes fixes (לג טז יז עב צא קד קל)',
      neshama: 'Lettres du nom + Psaume 119',
      kaddish: 'Kaddish Yatom',
      mishnayot: 'Mishnayot du nom',
      hashkava: 'Kaddish Derabanan + Hashkava',
      closing: 'Prière de clôture',
    },
    actions: {
      print: 'Imprimer',
      download: 'Télécharger le PDF',
      downloading: 'Rendu en cours…',
      share: 'Partager',
      save: 'Enregistrer au compte',
    },
    placeholders: {
      name: 'ex. : Moshé ben Avraham',
      parent: 'ex. : Avraham',
    },
    options: {
      target: {
        print: 'Imprimer',
        share: 'Partager',
        both: 'Imprimer et partager',
      },
      paper: {
        a4: 'A4',
        letter: 'Lettre',
      },
      gender: {
        male: 'Fils (ben)',
        female: 'Fille (bat)',
      },
      nusach: {
        ashkenaz: 'Ashkénaze',
        sefard: 'Séfarade',
      },
      acrostic: {
        both: 'Noms du défunt et du père',
        name: 'Nom du défunt uniquement',
        parent: 'Nom du père uniquement',
        none: 'Sans acrostiche',
      },
    },
    errors: {
      render: 'PDF render failed: {{message}}',
    },
    dialog: {
      share: 'Partager',
      print: 'Imprimer',
      settings: 'Paramètres',
      scaffoldNote: 'Cette action sera achevée dans une phase ultérieure du développement.',
    },
  },
  a11y: {
    open: 'Accessibilité',
    widgetTitle: 'Préférences d’accessibilité',
    widgetDescription: 'Les préférences sont enregistrées sur cet appareil et s’appliquent à tout le site.',
    textSize: 'Taille du texte',
    textSizeValue: '{{size}}%',
    applied: 'Préférence appliquée',
    reset: 'Réinitialiser toutes les préférences',
    toggles: {
      contrast: 'Contraste élevé',
      mono: 'Inverser et monochrome',
      lineSpacing: 'Espacement des lignes augmenté',
      wordSpacing: 'Espacement des mots augmenté',
      letterSpacing: 'Espacement des lettres augmenté',
      readableFont: 'Police lisible',
      highlightLinks: 'Surligner les liens',
      highlightHeadings: 'Surligner les titres',
      largeCursor: 'Grand curseur',
      stopAnimations: 'Arrêter les animations',
    },
  },
  accessibilityPage: {
    title: 'Déclaration d’accessibilité',
    updatedAt: 'Date de la déclaration',
    lastAudit: 'Dernier audit d’accessibilité',
    conformanceTitle: 'Conformité',
    conformanceBody:
      'Ce site vise à respecter les exigences de la norme israélienne IS 5568, fondée sur WCAG 2.0 niveau AA, conformément à la loi israélienne sur l’égalité des droits des personnes handicapées (1998).',
    featuresTitle: 'Fonctionnalités offertes',
    featuresItems: {

      widget: 'Widget de préférences d’accessibilité (Reg-35) — ouvrir avec Alt+A depuis n’importe quelle page',

      keyboard: 'Navigation complète au clavier, y compris l’accès direct au contenu',

      languages: 'Hébreu de droite à gauche (RTL) et anglais, espagnol et français de gauche à droite',

      scaling: 'Redimensionnement du texte jusqu’à 150 % sans casser la mise en page (unités rem)',

      contrast: 'Contraste des couleurs conforme aux exigences',

      nomouse: 'Toutes les fonctions sont utilisables sans souris',

    },
    limitationsTitle: 'Limitations connues',
    limitationsItems: {

      pdf: 'La prise en charge des lecteurs d’écran dans les fichiers PDF générés est en cours de test et devrait être achevée à la phase 7 — la version actuelle propose une vue HTML accessible en alternative.',

      srMatrix: 'Certains tests professionnels (NVDA, JAWS, VoiceOver, TalkBack) n’ont pas encore été entièrement réalisés.',

    },
    feedbackTitle: 'Retours',
    feedbackBody: 'Nous serions ravis de connaître les problèmes d’accessibilité rencontrés. Écrivez-nous à :',
  },
} satisfies typeof he
