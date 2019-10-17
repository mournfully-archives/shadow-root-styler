'use strict';

(() => {
  const GENERAL_BAND = chrome.runtime.id;
  const PRIVATE_BAND = chrome.runtime.id + Math.random().toString(36).slice(1);

  // kick out an orphaned content script
  window.dispatchEvent(new Event(GENERAL_BAND));
  window.addEventListener(GENERAL_BAND, orphanize);

  chrome.runtime.sendMessage(1, ([code, theme]) => {
    document.documentElement.appendChild(
      Object.assign(document.createElement('script'), {
        textContent: `
          document.currentScript.remove();
          (${code})('${PRIVATE_BAND}')`,
      }));
    dispatchEvent(new CustomEvent(PRIVATE_BAND, {detail: theme}));
  });

  function orphanize() {
    try {
      // if the API succeeds it means someone tried to kick us out so we'll ignore it
      chrome.i18n.getUILanguage();
      return;
    } catch (e) {}
    window.removeEventListener(GENERAL_BAND, orphanize);
    window.dispatchEvent(new CustomEvent(PRIVATE_BAND, {detail: {selfDestruct: true}}));
  }
})();
