import './index-82809ee4.js';
import { R as a, B as s, M as r, b as d, C as c, E as h, c as g } from './config-12781290.js';
class o {
  constructor() {
    (this.onDisconnect = () => {
      clearInterval(this._tryReconect),
        (this._tryReconect = setInterval(() => {
          console.debug('[FUEL WALLET] reconnecting!');
          try {
            (this.connection = this.connect()),
              console.debug('[FUEL WALLET] reconnected!'),
              clearInterval(this._tryReconect);
          } catch (e) {
            e.message === 'Extension context invalidated.' &&
              (clearInterval(this._tryReconect),
              console.debug('[FUEL WALLET] context invalidated!'));
          }
        }, a));
    }),
      (this.keepAlive = () => {
        try {
          this.connection.postMessage({ target: s, type: r.ping }), setTimeout(this.keepAlive, d);
        } catch {
          this.onDisconnect();
        }
      }),
      (this.onMessageFromExtension = (e) => {
        e.target === c && this.postMessage(e);
      }),
      (this.onMessageFromWindow = (e) => {
        const { data: n, origin: i } = Object.freeze(e);
        i === window.location.origin &&
          n.target === c &&
          this.connection.postMessage({ ...n, target: s });
      }),
      (this.connection = this.connect()),
      window.addEventListener(h, this.onMessageFromWindow),
      this.keepAlive();
  }
  connect() {
    const e = chrome.runtime.connect(chrome.runtime.id, { name: s });
    return (
      e.onMessage.addListener(this.onMessageFromExtension),
      e.onDisconnect.addListener(this.onDisconnect),
      e
    );
  }
  static start() {
    return new o();
  }
  postMessage(e) {
    const n = { ...e, target: g };
    window.postMessage(n, window.location.origin);
  }
}
const l = '/assets/pageScript-4ea64135.js';
o.start();
async function E() {
  const t = document.createElement('script');
  (t.src = chrome.runtime.getURL(l)),
    (t.type = 'module'),
    (t.onload = () => {
      t.remove();
    }),
    (document.head || document.documentElement).appendChild(t);
}
E();
