export const he = {
  common: {
    brand: 'יזכור',
    tagline: 'דף זיכרון להדפסה',
    skipLink: 'דלג לתוכן',
    nav: {
      home: 'בית',
      wizard: 'יצירת דף',
      accessibility: 'נגישות',
    },
    footer: {
      accessibility: 'הצהרת נגישות',
      rights: 'כל הזכויות שמורות',
    },
    localeNames: {
      he: 'עברית',
      en: 'English',
      es: 'Español',
      fr: 'Français',
    },
    close: 'סגירה',
    cancel: 'ביטול',
    next: 'הבא',
    previous: 'הקודם',
    startOver: 'התחל מחדש',
    loading: 'טוען…',
    notFound: {
      title: 'הדף לא נמצא',
      description: 'הכתובת שביקשת אינה קיימת.',
      backHome: 'חזרה לדף הבית',
    },
  },
  landing: {
    title: 'יצירת דף יזכור להדפסה',
    subtitle:
      'הזינו שם של יקיר והאתר יבנה עבורכם דף יזכור מעוצב עם תהילים, קדיש ומשניות — להדפסה או לשיתוף.',
    ctaStart: 'התחילו כאן',
    howItWorksTitle: 'איך זה עובד',
    featureItems: {

      simple: 'שבעה שלבים פשוטים ליצירת הדף',

      preview: 'תצוגה מקדימה מדויקת במילימטרים',

      pdf: 'פלט PDF איכותי להדפסה — כולו בדפדפן',

      share: 'ההגדרות נשמרות בכתובת האתר, אפשר לשתף',

    },
  },
  wizard: {
    title: 'אשף יצירת דף יזכור',
    stepIndicator: 'שלב {{current}} מתוך {{total}}',
    scaffoldNote: 'עורך ה{{feature}} ייבנה בשלב 3 של הפיתוח.',
    steps: {
      '1': {
        title: 'מטרת הדף',
        description: 'האם הדף מיועד להדפסה, לשיתוף, או לשניהם?',
      },
      '2': {
        title: 'מגדר',
        description: 'בחרו את מגדר הנפטר: זכר או נקבה.',
      },
      '3': {
        title: 'נוסח',
        description: 'בחרו את נוסח התפילה: אשכנז או בני עדות המזרח.',
      },
      '4': {
        title: 'שם',
        description: 'הזינו את השם העברי ואת שם האב, כפי שיוצגו בראש הדף.',
      },
      '5': {
        title: 'עריכת החלוקה',
        description: 'בחרו אילו חלקים יופיעו בדף וכיצד לחלקם בין העמודים.',
      },
      '6': {
        title: 'סיכום והורדה',
        description: 'עיינו בתצוגה המקדימה והדפיסו, הורידו או שתפו.',
      },
    },
    labels: {
      target: 'מטרת הדף',
      paper: 'גודל נייר',
      gender: 'מגדר',
      nusach: 'נוסח',
      name_male: 'שם הנפטר',
      name_female: 'שם המנוחה',
      parent: 'שם האב',
      namePreview: 'תצוגה מקדימה',
      lineage: 'ייחוס',
      font: 'גופן',
      nikud: 'ניקוד',
      deco: 'קישוטים',
      acrostic: 'אקרוסטיכון',
      blessing: 'ברכת שלושים יום (אשר יצר אתכם בדין)',
      sections: 'חלקי הדף',
      settings: 'הגדרות',
      dialog: 'חלון',
    },
    sections: {
      psalms: 'מזמורים קבועים (לג טז יז עב צא קד קל)',
      neshama: 'אותיות השם + מזמור קי״ט',
      kaddish: 'קדיש יתום',
      mishnayot: 'משניות של השם',
      hashkava: 'קדיש דרבנן + השכבה',
      closing: 'סיום התפילה',
    },
    actions: {
      print: 'הדפסה',
      download: 'הורדת PDF',
      downloading: 'מרנדר…',
      share: 'שיתוף',
      save: 'שמירה לחשבון',
      copyLink: 'העתקת קישור',
      whatsapp: 'וואטסאפ',
    },
    toasts: {
      linkCopied: 'הקישור הועתק',
      shareSuccess: 'דף היזכור שותף',
      shareFailed: 'השיתוף נכשל',
    },
    fallback: {
      shareUnsupported:
        'שיתוף קבצים אינו נתמך בדפדפן זה — הקובץ הורד והקישור הועתק ללוח.',
    },
    placeholders: {
      name_male: 'לדוגמה: משה דוד',
      name_female: 'לדוגמה: שרה רבקה',
      parent: 'לדוגמה: אברהם',
    },
    options: {
      target: {
        print: 'הדפסה',
        share: 'שיתוף',
        both: 'הדפסה ושיתוף',
      },
      paper: {
        a4: 'A4',
        letter: 'Letter',
      },
      gender: {
        male: 'זכר',
        female: 'נקבה',
      },
      nusach: {
        ashkenaz: 'אשכנז',
        sefard: 'בני עדות המזרח',
      },
      acrostic: {
        both: 'שם הנפטר ושם האב',
        name: 'שם הנפטר בלבד',
        parent: 'שם האב בלבד',
        none: 'ללא אקרוסטיכון',
      },
      lineage: {
        kohen: 'כהן',
        levi: 'לוי',
        none: 'ישראל',
      },
    },
    hints: {
      name_male: 'אפשר להוסיף גם שם פרטי נוסף, למשל: משה דוד.',
      name_female: 'אפשר להוסיף גם שם פרטי נוסף, למשל: שרה רבקה.',
      target: {
        print: 'קובץ PDF מוכן להדפסה, בפריסה למדפסת ביתית או לבית דפוס.',
        share: 'קובץ לשיתוף, שנשלח בקישור, בוואטסאפ או במייל.',
        both: 'גם קובץ מוכן להדפסה וגם גרסה לשיתוף.',
      },
      paper: {
        a4: 'הגודל הסטנדרטי בישראל, באירופה ובמרבית העולם.',
        letter: 'הגודל הסטנדרטי בארה״ב ובקנדה.',
      },
      gender: {
        male: 'הנוסח בדף יתאים לזכר.',
        female: 'הנוסח בדף יתאים לנקבה.',
      },
      nusach: {
        ashkenaz: 'נוסח התפילה המקובל בקהילות אשכנז.',
        sefard: 'נוסח התפילה המקובל בקרב בני עדות המזרח.',
      },
      lineage: {
        kohen: 'מוסיף את התואר "הכהן" לפני ז״ל.',
        levi: 'מוסיף את התואר "הלוי" לפני ז״ל.',
        none: 'ללא תוספת ייחוס.',
      },
    },
    paperDimensions: {
      a4: '210 × 297 מ״מ',
      letter: '215.9 × 279.4 מ״מ',
    },
    errors: {
      render: 'PDF render failed: {{message}}',
    },
    dialog: {
      share: 'שיתוף',
      print: 'הדפסה',
      settings: 'הגדרות',
      scaffoldNote: 'חלון זה יושלם בשלב מאוחר יותר של הפיתוח.',
      saveNote: 'שמירה לחשבון תהיה זמינה בגרסה עתידית.',
      shareDescription: 'שתפו את דף היזכור כקובץ PDF, או העתיקו קישור להגדרות הדף.',
      printDescription: 'ההדפסה מתבצעת דרך תיבת הדו־שיח של הדפדפן.',
    },
  },
  a11y: {
    open: 'נגישות',
    widgetTitle: 'העדפות נגישות',
    widgetDescription: 'ההעדפות נשמרות במכשיר זה ומוחלות בכל האתר.',
    textSize: 'גודל טקסט',
    textSizeValue: '{{size}}%',
    applied: 'ההעדפה הוחלה',
    reset: 'איפוס כל ההעדפות',
    toggles: {
      contrast: 'ניגודיות גבוהה',
      mono: 'הפוך ומונוכרום',
      lineSpacing: 'ריווח שורות מוגדל',
      wordSpacing: 'ריווח מילים מוגדל',
      letterSpacing: 'ריווח אותיות מוגדל',
      readableFont: 'גופן קריא',
      highlightLinks: 'הדגשת קישורים',
      highlightHeadings: 'הדגשת כותרות',
      largeCursor: 'סמן עכבר גדול',
      stopAnimations: 'עצירת אנימציות',
    },
  },
  accessibilityPage: {
    title: 'הצהרת נגישות',
    updatedAt: 'מועד הצהרה',
    lastAudit: 'בדיקת נגישות אחרונה',
    conformanceTitle: 'התאמה לתקן',
    conformanceBody:
      'אתר זה שואף לעמוד בדרישות תקן ישראלי ת״י 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ״ח–1998.',
    featuresTitle: 'מה כלול באתר',
    featuresItems: {

      widget: 'וידג׳ט העדפות נגישות (Reg-35) — פתיחה בקיצור Alt+A מכל עמוד',

      keyboard: 'ניווט מלא במקלדת, כולל דילוג לתוכן',

      languages: 'עבודה מלאה בעברית מימין לשמאל (RTL) ובאנגלית, ספרדית וצרפתית משמאל לימין',

      scaling: 'שינוי גודל טקסט עד 150% ללא שבירת עיצוב (יחידות rem)',

      contrast: 'ניגודיות צבעים העומדת בדרישות',

      nomouse: 'כל הפונקציונליות זמינה ללא עכבר',

    },
    limitationsTitle: 'מגבלות ידועות',
    limitationsItems: {

      pdf: 'תמיכה בקוראי מסך בקובצי ה-PDF הנוצרים נמצאת בבדיקות ומתוכננת להשלמה בשלב 7 — הגרסה הנוכחית כוללת דף HTML נגיש כתחליף.',

      srMatrix: 'חלק מהמבחנים המקצועיים (NVDA, JAWS, VoiceOver, TalkBack) טרם בוצעו במלואם.',

    },
    feedbackTitle: 'משוב ופניות',
    feedbackBody: 'נשמח לשמוע על בעיות נגישות שנתקלתם בהן. ניתן לפנות אלינו בכתובת:',
  },
}
