(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL('assets/contentScript.ts-ef93dd00.js')
    );
  })().catch(console.error);
})();
