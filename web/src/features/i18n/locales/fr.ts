import { he } from './he'

export const fr = {
  common: {
    brand: 'Tefila La-Neshama',
    tagline: 'Feuilles de prière commémoratives pour le cimetière',
    siyata: {
      he: 'ב׳ס״ד',
      en: "B'siyata D'shmaya",
    },
    skipLink: 'Aller au contenu',
    tocTitle: 'Sur cette page',
    nav: {
      home: 'Accueil',
      wizard: 'Créer une feuille',
      accessibility: 'Accessibilité',
      blog: 'Blog',
      about: 'À propos',
    },
    footer: {
      accessibility: 'Déclaration d’accessibilité',
      rights: 'Tous droits réservés',
      prayers: 'Prières',
      categories: {
        yizkor: 'Yizkor',
        kaddish: 'Kaddish',
        psalms: 'Psaumes',
        mishnayot: 'Mishnayot',
        hashkava: 'Hachkava',
      },
    },
    cta: {
      create: 'Créer une prière',
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
      'Saisissez un nom et le site crée une belle feuille de prière ornée de psaumes, de kaddish et de mishnayot — à imprimer, à apporter au cimetière et à réciter à la mémoire d’un proche.',
    ctaStart: 'Commencer',
    ctaLookInside: 'Voir un exemple',
    howItWorksTitle: 'Une prière imprimable, prête pour le cimetière',
    howItWorksIntro:
      'En quelques minutes, créez une belle feuille de prière à imprimer et à apporter au cimetière — pour la réciter près de la tombe et honorer la mémoire de votre proche.',
    memorialTitle: 'Honneur à travers les générations',
    memorialText:
      'Chaque feuille est composée avec une précision d’imprimerie, dans un format qui honore la tradition — et vous permet de partager le souvenir avec toute la famille.',
    heroPick: 'Fond :',
    featureItems: {
      simple: 'Nom hébraïque, genre et rite de prière — la feuille se compose d’elle-même',

      preview:
        'Chaque ligne est composée avec une précision d’imprimerie, telle qu’elle sera imprimée',

      pdf: 'Un PDF soigné, à imprimer chez soi ou chez un imprimeur — prêt pour le cimetière',

      share: 'Envoyez la même prière à vos proches, pour qu’ils la récitent aussi',
    },
    featureTitles: {
      simple: 'Quelques détails simples',
      preview: 'Voyez la feuille',
      pdf: 'Imprimez-la',
      share: 'Partagez en famille',
    },
  },
  theme: {
    open: 'Thème',
    dialogTitle: 'Thème et design',
    dialogDescription: 'Choisissez l’ambiance de la page : couleurs, luminosité et image de fond.',
    themeGroup: 'Thème',
    themes: {
      dusk: 'Crépuscule — lumière de bougie',
      parchment: 'Parchemin — papier ancien',
      stone: 'Pierre — Mont des Oliviers',
    },
    mode: {
      light: 'Mode clair',
      dark: 'Mode sombre',
    },
    toggleHint: 'cliquer pour changer',
    heroGroup: 'Image de fond',
    heroAuto: 'Automatique',
    heroRandom: 'Aléatoire',
    heroImages: {
      candleDusk: 'Bougie du chabbat au couchant',
      marbleParchment: 'Marbre parchemin',
      tombstoneOlives: 'Stèle et oliviers',
    },
  },
  wizard: {
    title: 'Assistant de feuille commémorative',
    stepIndicator: 'Étape {{current}} sur {{total}}',
    scaffoldNote: 'L’éditeur de {{feature}} sera construit à la phase 3 du développement.',
    steps: {
      '1': {
        title: 'Genre',
        description: 'Choisissez le genre du défunt : masculin ou féminin.',
      },
      '2': {
        title: 'Noussah',
        description: 'Choisissez le rite de prière : ashkénaze ou séfarade (Mizrahi).',
      },
      '3': {
        title: 'Nom',
        description:
          'Saisissez le nom hébreu et le nom du père, tels qu’ils apparaîtront en haut de la feuille.',
      },
      '4': {
        title: 'Date du décès',
        description:
          'Saisissez la date hébraïque du décès, ou choisissez la date grégorienne et nous calculerons la date hébraïque pour vous.',
      },
      '5': {
        title: 'Modifier et télécharger',
        description:
          'Choisissez les sections à afficher et leur répartition entre les pages, puis prévisualisez, imprimez, téléchargez ou partagez.',
      },
    },
    tabs: {
      editor: 'Éditeur',
      preview: 'Aperçu',
    },
    labels: {
      paper: 'Format du papier',
      gender: 'Genre',
      edah: 'Communauté',
      nusachAshkenaz: 'Noussah',
      name_male: 'Nom du défunt',
      name_female: 'Nom de la défunte',
      parent: 'Nom du père',
      namePreview: 'Aperçu',
      lineage: 'Lignage',
      font: 'Police',
      nikud: 'Points voyelles',
      deco: 'Décorations',
      acrostic: 'Acrostiche',
      blessing: 'Bénédiction des 30 jours (אשר יצר אתכם בדין)',
      hashkavaVariant: 'Texte de la Hashkava',
      elMalehPhrase: 'Formulation de "בעבור"',
      kaddishResponseLabel: 'Étiquette de la réponse de l\'assemblée',
      kaddishAdvanced: 'Réglages avancés du kaddish',
      sections: 'Sections de la feuille',
      settings: 'Réglages',
      dialog: 'Dialogue',
      settingsMode: 'Mode de configuration',
      lineDensity: 'Densité des lignes',
      fontBsd: 'בס"ד (en haut à droite)',
      fontSheetTitle: 'Titre de la feuille',
      fontNameLine: 'Ligne du nom',
      fontSectionTitle: 'Titres de section',
      fontPsalmBadge: 'Badge de psaume',
      fontPsalmText: 'Texte des psaumes',
      fontLetterBadge: 'Badge de lettre',
      fontLetterText: 'Texte des lettres',
      fontKaddishMourner: 'Kaddish — endeuillés',
      fontKaddishCongregation: 'Kaddish — assemblée',
      fontMishnahBadge: 'Badge de mishna',
      fontMishnahText: 'Texte des mishnayot',
      fontBlessingText: 'Bénédiction',
      fontElMalehText: 'El Malei Rahamim',
      fontHashkavaText: 'Hashkava',
      fontClosingDryBones: 'Clôture — ossements desséchés',
      fontClosingAvHaRachamim: 'Clôture — Av HaRahamim',
      fontClosingParting: "Clôture — prière d'adieu",
    },
    groups: {
      design: 'Mise en page',
      content: 'Contenu de la feuille',
      sections: 'Sections de la feuille',
      fontHeader: 'En-tête de la feuille',
      fontPsalms: 'Psaumes',
      fontLetters: 'Lettres acrostiches',
      fontKaddish: 'Kaddish',
      fontMishnayot: 'Mishnayot',
      fontPrayers: 'Bénédiction et clôture',
    },
    sections: {
      psalms: 'Psaumes fixes (לג טז יז עב צא קד קל)',
      neshama: 'Lettres du nom + Psaume 119',
      kaddish: 'Kaddish Yatom',
      mishnayot: 'Mishnayot du nom',
      hashkava: 'Hashkava',
      closing: 'Prière de clôture',
    },
    actions: {
      print: 'Imprimer',
      download: 'Télécharger le PDF',
      downloading: 'Rendu en cours…',
      save: 'Enregistrer au compte',
      settings: 'Paramètres',
      hideSettings: 'Masquer les paramètres',
      showSettings: 'Afficher les paramètres',
    },
    fallback: {
      pdfPreviewUnsupported:
        'L’aperçu du PDF n’est pas pris en charge par ce navigateur, mais le fichier est prêt.',
    },
    placeholders: {
      name_male: 'ex. : Moshé David',
      name_female: 'ex. : Sarah Rivka',
      parent: 'ex. : Avraham',
    },
    options: {
      paper: {
        a4: 'A4',
        letter: 'Lettre',
      },
      gender: {
        male: 'Masculin',
        female: 'Féminin',
      },
      edah: {
        ashkenaz: 'Ashkénaze',
        mizrahi: 'Séfarade (Mizrahi)',
      },
      nusachAshkenaz: {
        ashkenaz: 'Noussah Ashkenaz',
        sefard: 'Noussah Sefarad',
      },
      acrostic: {
        both: 'Noms du défunt et du père',
        name: 'Nom du défunt uniquement',
        parent: 'Nom du père uniquement',
        none: 'Sans acrostiche',
      },
      lineage: {
        kohen: 'Cohen',
        levi: 'Lévi',
        none: 'Israël',
      },
      hashkavaVariant: {
        elMaleh: 'El Malei Rahamim',
        traditional: 'Hashkava traditionnelle (texte long)',
        both: 'Les deux',
      },
      elMalehPhrase: {
        charity: 'De la tsédaka a été donnée',
        psalms: 'Nous prions pour l\'élévation de son âme',
      },
      kaddishResponseLabel: {
        congregation: 'Assemblée',
        responders: 'Répondants',
        none: 'Sans étiquette',
      },
      settingsMode: {
        simple: 'Simple',
        advanced: 'Avancé',
      },
      lineDensity: {
        tidy: 'Compacte',
        normal: 'Normale',
        loose: 'Aérée',
      },
    },
    hints: {
      name_male: 'Vous pouvez aussi ajouter un second prénom, ex. : Moshé David.',
      name_female: 'Vous pouvez aussi ajouter un second prénom, ex. : Sarah Rivka.',
      paper: {
        a4: 'Le format standard en Israël, en Europe et dans la majorité du monde.',
        letter: 'Le format standard aux États-Unis et au Canada.',
      },
      gender: {
        male: 'Adapte le texte de la feuille à la forme masculine.',
        female: 'Adapte le texte de la feuille à la forme féminine.',
      },
      edah: {
        ashkenaz: 'Communautés ashkénazes, avec un choix de noussah ensuite.',
        mizrahi: 'Le texte de prière utilisé dans les communautés séfarades et mizrahi.',
      },
      nusachAshkenaz: {
        ashkenaz: 'Le texte de prière utilisé dans les communautés ashkénazes.',
        sefard: 'Le texte de prière hassidique, utilisé dans les communautés noussah Sefarad (ashkénazes-hassidiques).',
      },
      lineage: {
        kohen: 'Ajoute le titre « HaCohen » avant ז״ל.',
        levi: 'Ajoute le titre « HaLévi » avant ז״ל.',
        none: 'Aucun titre de lignage ajouté.',
      },
    },
    paperDimensions: {
      a4: '210 × 297 mm',
      letter: '215,9 × 279,4 mm',
    },
    deathDate: {
      instructions:
        'Touchez le jour du décès sur le calendrier ci-dessous — la date hébraïque est indiquée chaque jour.',
      dateSelected: 'Vous avez sélectionné le {{hebrew}} ({{gregorian}}, calendrier civil).',
      sunsetQuestion: 'Le décès a-t-il eu lieu avant ou après le coucher du soleil (la tombée de la nuit) ?',
      pickAnotherDay: 'Retour au calendrier',
      before: 'Avant le coucher du soleil',
      beforeHint: 'La date hébraïque affichée est correcte telle quelle.',
      after: 'Après le coucher du soleil (tombée de la nuit)',
      afterHint: 'Le jour juif commence à la tombée de la nuit, la date hébraïque avance donc d’un jour.',
      unsure: 'Je ne suis pas sûr(e)',
      unsureHint: 'Nous utiliserons la date hébraïque de ce jour — vous pourrez toujours la corriger plus tard.',
      confirmedLabel: 'Date hébraïque du décès',
      nextStepHint: 'Étape suivante : une feuille de prière hébraïque personnalisée sera générée automatiquement pour vous sous forme de PDF imprimable.',
      continueToSheet: 'Continuer vers la feuille de prière',
      change: 'Choisir une autre date',
      skip: 'Passer — je n’ai pas encore cette information',
      editMonthYear: 'Choisir un autre mois ou une autre année',
      chooseMonth: 'Mois',
      chooseYear: 'Année',
      earlierYears: 'Années précédentes',
      laterYears: 'Années suivantes',
      switchToGregorian: 'Calendrier grégorien',
      switchToHebrew: 'Calendrier hébraïque',
    },
    dialog: {
      print: 'Imprimer',
      settings: 'Paramètres',
      kaddish: 'Réglages avancés du kaddish',
      kaddishDescription: 'Choisissez comment la réponse de l\'assemblée est imprimée dans le kaddish.',
      scaffoldNote:
        'Cette boîte de dialogue sera achevée dans une phase ultérieure du développement.',
      saveNote: 'L’enregistrement au compte sera disponible dans une version future.',
      printDescription: 'L’impression passe par la boîte de dialogue d’impression du navigateur.',
    },
  },
  a11y: {
    open: 'Accessibilité',
    widgetTitle: 'Préférences d’accessibilité',
    widgetDescription:
      'Les préférences sont enregistrées sur cet appareil et s’appliquent à tout le site.',
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
      widget:
        'Widget de préférences d’accessibilité (Reg-35) — ouvrir avec Alt+A depuis n’importe quelle page',

      keyboard: 'Navigation complète au clavier, y compris l’accès direct au contenu',

      languages:
        'Hébreu de droite à gauche (RTL) et anglais, espagnol et français de gauche à droite',

      scaling: 'Redimensionnement du texte jusqu’à 150 % sans casser la mise en page (unités rem)',

      contrast: 'Contraste des couleurs conforme aux exigences',

      nomouse: 'Toutes les fonctions sont utilisables sans souris',
    },
    limitationsTitle: 'Limitations connues',
    limitationsItems: {
      pdf: 'La prise en charge des lecteurs d’écran dans les fichiers PDF générés est en cours de test et devrait être achevée à la phase 7 — la version actuelle propose une vue HTML accessible en alternative.',

      srMatrix:
        'Certains tests professionnels (NVDA, JAWS, VoiceOver, TalkBack) n’ont pas encore été entièrement réalisés.',
    },
    feedbackTitle: 'Retours',
    feedbackBody:
      'Nous serions ravis de connaître les problèmes d’accessibilité rencontrés. Écrivez-nous à :',
  },
  aboutPage: {
    title: 'À propos',
    photoAlt: 'Un portrait de Shlomo',
    contact: {
      title: 'Contact',
      description:
        'Vous cherchez quelqu’un pour construire un système, un site ou un projet ? Écrivez-moi quelques lignes et je vous répondrai.',
      emailLabel: 'Votre e-mail',
      emailPlaceholder: 'Comment vous joindre',
      messageLabel: 'Message',
      messagePlaceholder: 'Parlez-moi du projet…',
      send: 'Envoyer',
      sending: 'Envoi…',
      success: 'Message envoyé. Je vous répondrai bientôt.',
      error: 'L’envoi a échoué. Réessayez dans un instant.',
      subject: 'Nouveau message depuis la page À propos',
    },
  },
  blog: {
    title: 'Blog',
    tagline: 'Notes de l’atelier — comment ce site est construit',
  },
} satisfies typeof he
