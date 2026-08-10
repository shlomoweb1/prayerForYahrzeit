;(function () {
  var LOCALE_KEY = 'izkor:locale:v1'
  var LOCALES = ['he', 'en', 'es', 'fr']
  var locale = 'he'
  var hasPref = false
  try {
    var storedLocale = window.localStorage.getItem(LOCALE_KEY)
    hasPref = storedLocale !== null
    if (LOCALES.indexOf(storedLocale) !== -1) locale = storedLocale
  } catch {
    locale = 'he'
  }
  var root = document.documentElement
  root.lang = locale
  root.dir = locale === 'he' ? 'rtl' : 'ltr'
  // First visit (no stored preference): route the browser to the /en
  // form when its language is not Hebrew, so non-Hebrew readers land on
  // English content. The locale-neutral wizard is skipped.
  if (locale === 'he' && !hasPref) {
    var pathname = window.location.pathname
    var prefixed = pathname === '/en' || pathname.indexOf('/en/') === 0
    var neutral = pathname === '/wizard' || pathname.indexOf('/wizard/') === 0
    var lang = (navigator.language || 'he').toLowerCase()
    var hebrew = lang === 'he' || lang.indexOf('he-') === 0
    if (!prefixed && !neutral && !hebrew) {
      window.location.replace(
        '/en' + pathname + window.location.search + window.location.hash,
      )
      return
    }
  }
  var KEY = 'izkor:a11y:v1'
  var classes = []
  var stored
  try {
    stored = JSON.parse(window.localStorage.getItem(KEY) || 'null')
  } catch {
    stored = null
  }
  if (stored && typeof stored === 'object') {
    if (stored.contrast) classes.push('a11y-contrast')
    if (stored.mono) classes.push('a11y-mono')
    if (stored.textSize === 125 || stored.textSize === 150) {
      classes.push('a11y-text-' + stored.textSize)
    }
    if (stored.lineSpacing) classes.push('a11y-line-spacing')
    if (stored.wordSpacing) classes.push('a11y-word-spacing')
    if (stored.letterSpacing) classes.push('a11y-letter-spacing')
    if (stored.readableFont) classes.push('a11y-readable-font')
    if (stored.highlightLinks) classes.push('a11y-highlight-links')
    if (stored.highlightHeadings) classes.push('a11y-highlight-headings')
    if (stored.largeCursor) classes.push('a11y-large-cursor')
    if (stored.stopAnimations) classes.push('a11y-stop-animations')
  }
  if (classes.length > 0) {
    document.documentElement.classList.add.apply(
      document.documentElement.classList,
      classes,
    )
  }
})()
