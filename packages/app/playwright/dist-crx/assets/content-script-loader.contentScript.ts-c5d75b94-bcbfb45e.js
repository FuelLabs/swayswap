(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/contentScript.ts-c5d75b94.js")
    );
  })().catch(console.error);

})();
