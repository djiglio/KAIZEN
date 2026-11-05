/* ============================================================
 firebase-config.js — Configurazione Firebase per KAIZEN RPG
 ============================================================ */

export const FIREBASE_CONFIG_STORAGE_KEY = "kaizenFirebaseConfigCustom";

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAPQCfry6riCkswoMx4TQFIcwOixI0w6P4",
  authDomain: "kaizen-rpg-68262.firebaseapp.com",
  projectId: "kaizen-rpg-68262",
  storageBucket: "kaizen-rpg-68262.firebasestorage.app",
  messagingSenderId: "622640199065",
  appId: "1:622640199065:web:796f2d6e463c4296078f08"
};

export function getFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Configurazione Firebase personalizzata non valida, uso predefinita.", e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function hasCustomFirebaseConfig() {
  return !!localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
}

export function setCustomFirebaseConfig(jsonOrObject) {
  const obj = typeof jsonOrObject === "string" ? JSON.parse(jsonOrObject) : jsonOrObject;
  if (!obj || !obj.apiKey || !obj.projectId) {
    throw new Error("Configurazione non valida: apiKey e projectId sono obbligatori.");
  }
  localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(obj));
  return obj;
}

export function resetFirebaseConfig() {
  localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
}
