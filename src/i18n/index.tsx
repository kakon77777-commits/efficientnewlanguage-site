import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'zh';

const STORAGE_KEY = 'eml.lang';
/** Regions where Traditional Chinese is the natural default. */
const ZH_REGIONS = new Set(['TW', 'HK', 'MO']);

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** True until IP/region auto-detection has resolved (or was skipped). */
  detecting: boolean;
}

const LangContext = createContext<LangState | null>(null);

function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'en' || v === 'zh' ? v : null;
  } catch {
    return null;
  }
}

/**
 * Auto-detect the visitor's language. English is the primary default; visitors in
 * Traditional-Chinese regions (by IP geolocation) get zh-Hant, with the browser
 * language as a fallback when the geo lookup is unavailable. A manual choice is
 * always remembered and overrides detection.
 */
async function detectLang(signal: AbortSignal): Promise<Lang> {
  // Primary: Cloudflare edge country via the same-origin /api/geo endpoint (see
  // public/_worker.js → request.cf.country). No external geo-IP service, no rate
  // limit. Falls back to the browser language when the endpoint isn't available
  // (e.g. local dev / non-Cloudflare hosting).
  try {
    const res = await fetch('/api/geo', { signal });
    if (res.ok) {
      const { country } = (await res.json()) as { country?: string };
      if (country && ZH_REGIONS.has(country)) return 'zh';
      if (country) return 'en'; // a known non-zh region → English
    }
  } catch {
    /* geo endpoint unavailable — fall back to the browser language */
  }
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const initial = storedLang();
  const [lang, setLangState] = useState<Lang>(initial ?? 'en');
  const [detecting, setDetecting] = useState(initial === null);

  useEffect(() => {
    if (initial !== null) return; // explicit choice already made
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 2500);
    detectLang(ctrl.signal)
      .then((l) => setLangState(l))
      .finally(() => {
        window.clearTimeout(timer);
        setDetecting(false);
      });
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    setDetecting(false);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable — choice holds for this session only */
    }
  };

  return <LangContext.Provider value={{ lang, setLang, detecting }}>{children}</LangContext.Provider>;
}

export function useLang(): LangState {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within I18nProvider');
  return ctx;
}
