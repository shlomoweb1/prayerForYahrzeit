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
        title: 'But de la feuille',
        description: 'La feuille est-elle destinée à l’impression, au partage, ou aux deux ?',
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
      target: 'Usage de la feuille',
      paper: 'Format du papier',
      gender: 'Genre',
      nusach: 'Nusach',
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
      sections: 'Sections de la feuille',
      settings: 'Réglages',
      dialog: 'Dialogue',
      editorMode: "Mode d'édition",
      lineDensity: 'Densité des lignes',
      fontTitle: 'Police du titre',
      fontHeading: 'Police des titres de section',
      fontBody: 'Police du corps de texte',
    },
    groups: {
      design: 'Mise en page',
      content: 'Contenu de la feuille',
      sections: 'Sections de la feuille',
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
      share: 'Partager',
      save: 'Enregistrer au compte',
      copyLink: 'Copier le lien',
      whatsapp: 'WhatsApp',
      settings: 'Paramètres',
      hideSettings: 'Masquer les paramètres',
      showSettings: 'Afficher les paramètres',
    },
    toasts: {
      linkCopied: 'Lien copié',
      shareSuccess: 'Feuille commémorative partagée',
      shareFailed: 'Échec du partage',
    },
    fallback: {
      shareUnsupported:
        'Le partage de fichiers n’est pas pris en charge par ce navigateur — le fichier a été téléchargé et un lien a été copié.',
      pdfPreviewUnsupported: 'L’aperçu du PDF n’est pas pris en charge par ce navigateur, mais le fichier est prêt.',
    },
    placeholders: {
      name_male: 'ex. : Moshé David',
      name_female: 'ex. : Sarah Rivka',
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
        male: 'Masculin',
        female: 'Féminin',
      },
      nusach: {
        ashkenaz: 'Ashkénaze',
        sefard: 'Séfarade (Mizrahi)',
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
      editorMode: {
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
      target: {
        print: 'Un PDF prêt à imprimer, adapté à une imprimante personnelle ou professionnelle.',
        share: 'Un fichier à partager par lien, WhatsApp ou e-mail.',
        both: 'Un fichier prêt à imprimer, ainsi qu\'une version à partager.',
      },
      paper: {
        a4: 'Le format standard en Israël, en Europe et dans la majorité du monde.',
        letter: 'Le format standard aux États-Unis et au Canada.',
      },
      gender: {
        male: 'Adapte le texte de la feuille à la forme masculine.',
        female: 'Adapte le texte de la feuille à la forme féminine.',
      },
      nusach: {
        ashkenaz: 'Le texte de prière utilisé dans les communautés ashkénazes.',
        sefard: 'Le texte de prière utilisé dans les communautés séfarades et mizrahi.',
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
    errors: {
      render: 'Échec du rendu PDF : {{message}}',
    },
    dialog: {
      share: 'Partager',
      print: 'Imprimer',
      settings: 'Paramètres',
      scaffoldNote: 'Cette boîte de dialogue sera achevée dans une phase ultérieure du développement.',
      saveNote: 'L’enregistrement au compte sera disponible dans une version future.',
      shareDescription:
        'Partagez la feuille commémorative en PDF, ou copiez un lien vers les réglages de la feuille.',
      printDescription: 'L’impression passe par la boîte de dialogue d’impression du navigateur.',
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
