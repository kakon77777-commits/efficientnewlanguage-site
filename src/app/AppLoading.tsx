function storedLang(): 'en' | 'zh' {
  try {
    return localStorage.getItem('eml.lang') === 'zh' ? 'zh' : 'en';
  } catch {
    return 'en';
  }
}

/** Visible Suspense fallback — replaces the old bare-background div that made a
 *  slow chunk load indistinguishable from a fully broken page. */
export function AppLoading() {
  const zh = storedLang() === 'zh';
  return (
    <main className="grid min-h-screen place-items-center bg-base text-fg">
      <section className="max-w-md px-6 text-center">
        <div className="font-mono text-sm text-symbol">EML</div>
        <h1 className="mt-3 text-lg font-semibold">{zh ? '正在載入介面…' : 'Loading the interface…'}</h1>
        <p className="mt-2 text-sm text-muted">
          {zh
            ? '若畫面長時間沒有完成，請重新載入。'
            : "If this doesn't finish in a few seconds, try reloading."}
        </p>
      </section>
    </main>
  );
}
