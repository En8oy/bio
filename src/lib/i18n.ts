export type Lang = "en" | "es";

export type LocalizedText = { en: string; es: string };
export type LocalizedList = { en: string[]; es: string[] };

export function t(value: LocalizedText | string | null | undefined, lang: Lang): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.en ?? "";
}

export function tList(value: LocalizedList | string[] | null | undefined, lang: Lang): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value[lang] ?? value.en ?? [];
}

export function getStoredLang(): Lang {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem("lang") as Lang) || "en";
}

export function onLangChange(callback: (lang: Lang) => void): () => void {
  const handler = (e: Event) => callback((e as CustomEvent).detail.lang);
  window.addEventListener("lang-change", handler);
  return () => window.removeEventListener("lang-change", handler);
}

export const UI_STRINGS: Record<string, LocalizedText> = {
  profile: { en: "Profile", es: "Perfil" },
  jumpToSection: { en: "Jump to section", es: "Ir a sección" },
  summary: { en: "Summary", es: "Resumen" },
  experience: { en: "Experience", es: "Experiencia" },
  projects: { en: "Personal Projects", es: "Proyectos Personales" },
  education: { en: "Education", es: "Educación" },
  skills: { en: "Skills", es: "Habilidades" },
  languages: { en: "Languages", es: "Idiomas" },
  contact: { en: "Contact", es: "Contacto" },
  downloadCv: { en: "Download CV", es: "Descargar CV" },
  present: { en: "Present", es: "Presente" },
  courses: { en: "Relevant Courses", es: "Cursos Relevantes" },
};
