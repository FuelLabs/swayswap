(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/contentScript.ts-e188c0b1.js")
    );
  })().catch(console.error);

})();
