/**
 * WebAssembly feature detection for the Folio PDF pipeline.
 *
 * The Folio worker loads a ~16MB WASM binary — on old/partial polyfills the
 * `typeof WebAssembly` check alone can pass while actual instantiation still
 * fails, so this also runs `WebAssembly.validate()` against the minimal
 * valid module header (the standard MDN feature-detection pattern). When
 * this returns false, step 5 must fall back to the live HTML editor-preview
 * instead of attempting a Folio render.
 */
const WASM_MAGIC_HEADER = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00])

export function supportsWasm(): boolean {
  if (typeof WebAssembly !== 'object' || typeof WebAssembly.instantiate !== 'function') {
    return false
  }
  try {
    return WebAssembly.validate(WASM_MAGIC_HEADER)
  } catch {
    return false
  }
}
