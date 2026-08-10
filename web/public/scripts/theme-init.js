;(function () {
  var KEY = 'izkor:theme:v1'
  var THEMES = ['dusk', 'parchment', 'stone']
  var MODES = ['light', 'dark']
  var state = { theme: 'dusk', mode: 'dark' }
  try {
    var stored = JSON.parse(window.localStorage.getItem(KEY) || 'null')
    if (stored && typeof stored === 'object') {
      if (THEMES.indexOf(stored.theme) !== -1) state.theme = stored.theme
      if (MODES.indexOf(stored.mode) !== -1) state.mode = stored.mode
    }
  } catch {
    state = { theme: 'dusk', mode: 'dark' }
  }
  var root = document.documentElement
  root.dataset.theme = state.theme
  root.dataset.themeMode = state.mode
  root.style.colorScheme = state.mode
})()
