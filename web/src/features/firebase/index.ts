export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export interface FirebaseStub {
  config: FirebaseConfig | null
  initialized: boolean
}

function readConfig(): FirebaseConfig | null {
  const env = import.meta.env
  const config: FirebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY as string,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: env.VITE_FIREBASE_APP_ID as string,
  }
  const missing = Object.entries(config).some(([, value]) => !value)
  return missing ? null : config
}

let instance: FirebaseStub | null = null

export function initFirebase(): FirebaseStub {
  if (instance) {
    return instance
  }
  const config = readConfig()
  instance = {
    config,
    initialized: config !== null,
  }
  return instance
}

export function getFirebase(): FirebaseStub {
  if (!instance) {
    return initFirebase()
  }
  return instance
}

export function isFirebaseAvailable(): boolean {
  return getFirebase().initialized
}
