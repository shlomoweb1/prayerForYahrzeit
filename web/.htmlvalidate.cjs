// Validates the prerendered dist/**/*.html output (see scripts/prerender.mjs)
// for real structural/SEO issues - not as a style linter for React/Vite's
// generated markup. The disabled rules below all fire on markup this app
// doesn't hand-author (Vite's injected preload/PWA tags, inline styles from
// third-party UI libraries, Radix's div[role] instead of <section>), so they
// would just be permanent noise rather than something actionable here.
module.exports = {
  extends: ['html-validate:recommended'],
  rules: {
    // Google truncates titles well past this anyway - useful to know about,
    // not worth hard-failing a longer localized title over.
    'long-title': 'warn',
    'no-inline-style': 'off',
    'attribute-empty-style': 'off',
    'no-implicit-button-type': 'off',
    'attribute-boolean-style': 'off',
    'no-trailing-whitespace': 'off',
    'prefer-native-element': 'off',
    // vite-plugin-pwa's injected registerSW script id contains a colon,
    // which is valid HTML5 but stricter than this rule allows.
    'valid-id': 'off',
  },
}
