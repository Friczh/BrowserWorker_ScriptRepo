// ==BWScript==
// @name            BW Smoke Test
// @match           *://example.com/*
// @run-at          document-idle
// @grant           bw.dom, bw.storage, bw.tabs
// @inject          isolated
// @source          github:Friczh/BrowserWorker/smoke-test.user.js
// ==/BWScript==

(async () => {
  const log = (...args) => console.log('[BW_SMOKE]', ...args);

  try {
    const tabId = await bw.tabs.current();
    log('tabs.current ok:', tabId);

    const all = await bw.tabs.list();
    log('tabs.list ok:', all.length, 'tabs');
  } catch (e) {
    log('tabs FAILED:', e.message);
  }

  try {
    await bw.storage.set('smoke', { hits: (await bw.storage.get('smoke'))?.hits + 1 || 1 });
    const back = await bw.storage.get('smoke');
    log('storage roundtrip ok:', JSON.stringify(back));
  } catch (e) {
    log('storage FAILED:', e.message);
  }

  try {
    const h1 = await bw.dom.waitFor('h1', 3000);
    log('dom.waitFor ok:', h1.textContent);

    const originalText = h1.textContent;
    await bw.dom.type('h1', 'BW_SMOKE_WAS_HERE'); // h1 isn't an input, exercises the "no setter" fallback path in bw.dom.type
    log('dom.type attempted (h1 is not an input — checking it did not throw)');

    document.title = 'BW_SMOKE_TITLE_CHECK';
    log('direct DOM access confirmed working, document.title now:', document.title);
  } catch (e) {
    log('dom FAILED:', e.message);
  }

  log('DONE');
})();
