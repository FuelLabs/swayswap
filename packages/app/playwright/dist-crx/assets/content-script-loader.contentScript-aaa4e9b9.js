(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/contentScript.ts-d787f703.js")
    );
  })().catch(console.error);

})();
