import {
  W as w,
  a as T,
  T as U,
  w as E,
  u as k,
  m as R,
  A as v,
  C as a,
  P as d,
  N as C,
  e as M,
  B as N,
  f as P,
  V as j,
} from './connection-b8f90194.js';
import { M as r, P as S, B as g, C as m, V as y } from './config-12781290.js';
import { d as L, k as _, e as x } from './index-82809ee4.js';
async function O() {
  let n = 0,
    e = 0;
  try {
    const { top: t = 0, left: s = 0, width: o = 0 } = await chrome.windows.getLastFocused();
    (e = t), (n = s + (o - w));
  } catch {
    const { screenX: s, screenY: o, outerWidth: c } = window;
    (e = Math.max(o, 0)), (n = Math.max(s + (c - w), 0));
  }
  return { left: n, top: e };
}
async function D(n) {
  n && chrome.tabs.remove(n).catch(() => {});
}
async function V(n) {
  if (!n?.windowId || !n?.tabId) return !1;
  try {
    if (await chrome.windows.get(n.windowId))
      return (
        await chrome.tabs.update(n.tabId, { selected: !0 }),
        await chrome.windows.update(n.windowId, { focused: !0 }),
        !0
      );
  } catch {}
  return !1;
}
async function W(n) {
  const { left: e, top: t } = await O();
  return (
    await chrome.windows.create({ type: 'popup', url: n, width: w, height: T + U, left: e, top: t })
  )?.id;
}
function $(n) {
  return n?.tab?.id;
}
let h;
const B = new Uint8Array(16);
function H() {
  if (
    !h &&
    ((h = typeof crypto < 'u' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)), !h)
  )
    throw new Error(
      'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'
    );
  return h(B);
}
const i = [];
for (let n = 0; n < 256; ++n) i.push((n + 256).toString(16).slice(1));
function F(n, e = 0) {
  return (
    i[n[e + 0]] +
    i[n[e + 1]] +
    i[n[e + 2]] +
    i[n[e + 3]] +
    '-' +
    i[n[e + 4]] +
    i[n[e + 5]] +
    '-' +
    i[n[e + 6]] +
    i[n[e + 7]] +
    '-' +
    i[n[e + 8]] +
    i[n[e + 9]] +
    '-' +
    i[n[e + 10]] +
    i[n[e + 11]] +
    i[n[e + 12]] +
    i[n[e + 13]] +
    i[n[e + 14]] +
    i[n[e + 15]]
  ).toLowerCase();
}
const K = typeof crypto < 'u' && crypto.randomUUID && crypto.randomUUID.bind(crypto),
  I = { randomUUID: K };
function z(n, e, t) {
  if (I.randomUUID && !e && !n) return I.randomUUID();
  n = n || {};
  const s = n.random || (n.rng || H)();
  if (((s[6] = (s[6] & 15) | 64), (s[8] = (s[8] & 63) | 128), e)) {
    t = t || 0;
    for (let o = 0; o < 16; ++o) e[t + o] = s[o];
    return e;
  }
  return F(s);
}
function G() {
  return z();
}
const J = '/assets/content-script-loader.contentScript-aaa4e9b9.js';
async function X() {
  chrome.tabs.query({ url: '<all_urls>' }, (n) => {
    n.forEach((e) => {
      e.id &&
        chrome.scripting
          .executeScript({
            target: { tabId: e.id, allFrames: !0 },
            files: [J],
            injectImmediately: !0,
          })
          .catch(() => {});
    });
  });
}
chrome.runtime.onInstalled.addListener((n) => {
  n.reason === chrome.runtime.OnInstalledReason.INSTALL && (chrome.tabs.create({ url: E() }), X());
});
chrome.alarms.create('KeepAwake', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((n) => {
  n.name === 'KeepAwake' && console.debug('[FUEL WALLET] KeepAwake signal');
});
function Y() {
  const n = {};
  return (
    (n.promise = new Promise((e, t) => {
      (n.reject = t), (n.resolve = e);
    })),
    n
  );
}
const q = new Map(),
  l = class {
    constructor(n) {
      (this.session = null),
        (this.tabId = null),
        (this.windowId = null),
        (this.rejectAllRequests = (e) => {
          e === this.eventId &&
            (D(this.tabId),
            this.client.rejectAllPendingRequests('Request cancelled without explicity response!'));
        }),
        (this.sendRequest = async (e) => {
          if (this.eventId)
            this.communicationProtocol.postMessage({
              type: r.request,
              target: S,
              id: this.eventId,
              request: e,
            });
          else throw new Error('UI not connected!');
        }),
        (this.onResponse = (e) => {
          e.id === this.eventId && e.response && this.client.receive(e.response);
        }),
        (this.onUIEvent = (e) => {
          if (this.session === e.session && e.ready) {
            const t = $(e.sender);
            (this.tabId = t), (this.eventId = e.id), this.openingPromise.resolve(this);
          }
        }),
        (this.communicationProtocol = n),
        (this.openingPromise = Y()),
        (this.client = new L.JSONRPCClient(this.sendRequest)),
        this.setupUIListeners(),
        this.setTimeout();
    }
    setTimeout(n = 5e3) {
      setTimeout(() => {
        this.openingPromise.reject(new Error('PopUp not opened!'));
      }, n);
    }
    setupUIListeners() {
      this.communicationProtocol.once(r.uiEvent, this.onUIEvent),
        this.communicationProtocol.on(r.response, this.onResponse),
        this.communicationProtocol.on(r.removeConnection, this.rejectAllRequests);
    }
    static async getCurrent(n) {
      const e = q.get(n);
      return e && (await V({ tabId: e.tabId, windowId: e.windowId })) ? e : null;
    }
    async requestConnection(n) {
      return this.client.request('requestConnection', n);
    }
    async signMessage(n) {
      return this.client.request('signMessage', n);
    }
    async sendTransaction(n) {
      return this.client.request('sendTransaction', n);
    }
    async addAsset(n) {
      return this.client.request('addAsset', n);
    }
  };
let u = l;
u.create = async (n, e, t) => {
  const s = k(4),
    o = new l(t);
  q.set(n, o);
  const c = await W(`${R.popup}?s=${s}#${e}`);
  return (o.session = s), (o.windowId = c), o;
};
u.open = async (n, e, t) => {
  let s = await l.getCurrent(n);
  return s || (s = await l.create(n, e, t)), s.openingPromise.promise;
};
class b {
  constructor(e) {
    (this.communicationProtocol = e),
      (this.server = new L.JSONRPCServer()),
      this.server.applyMiddleware(this.connectionMiddlware.bind(this)),
      this.setupListeners(),
      this.externalMethods([
        this.ping,
        this.isConnected,
        this.accounts,
        this.connect,
        this.network,
        this.disconnect,
        this.signMessage,
        this.sendTransaction,
        this.currentAccount,
        this.addAsset,
        this.assets,
      ]);
  }
  static start(e) {
    return new b(e);
  }
  setupListeners() {
    this.communicationProtocol.on(r.request, async (e) => {
      if (e.target !== g) return;
      const t = e.sender.origin,
        s = await this.server.receive(e.request, { origin: t });
      s &&
        this.communicationProtocol.postMessage({
          id: e.id,
          type: r.response,
          target: m,
          response: s,
        });
    });
  }
  externalMethods(e) {
    e.forEach((t) => {
      let s = t;
      t.name && (s = t.name), this.server.addMethod(s, this[s].bind(this));
    });
  }
  async requireAccounts() {
    if ((await v.getAccounts()).length === 0)
      throw new Error('Unable to establish a connection. No accounts found');
  }
  async requireAccountConnecton(e, t) {
    if (!e) throw new Error('connection not found');
    if (!e.accounts.includes(_.fromString(t || '0x00').toString()))
      throw new Error('address is not authorized for this connection.');
  }
  async requireConnection(e) {
    if (!((e?.accounts || []).length > 0))
      throw new Error(
        'Connection not established. Please call connect() first to request a connection'
      );
  }
  async connectionMiddlware(e, t, s) {
    if (t.method === 'ping') return e(t, { origin: s.origin });
    const o = await a.getConnection(s.origin);
    return (
      ['connect', 'isConnected'].includes(t.method)
        ? await this.requireAccounts()
        : await this.requireConnection(o),
      e(t, { connection: o, origin: s.origin })
    );
  }
  async sendEvent(e, t, s) {
    this.communicationProtocol.broadcast(e, {
      target: m,
      type: r.event,
      events: [{ event: t, params: s }],
    });
  }
  async ping() {
    return !0;
  }
  async isConnected(e, t) {
    return !!t.connection;
  }
  async connect(e, t) {
    const s = t.origin;
    let o = await a.getConnection(s);
    return (
      o ||
        (o = await (
          await u.open(s, d.requestConnection(), this.communicationProtocol)
        ).requestConnection({ origin: s })),
      o && this.sendEvent(s, 'connection', [!!o]),
      !!o
    );
  }
  async disconnect(e, t) {
    const s = t.origin;
    return s
      ? (await a.removeConnection({ origin: s }), this.sendEvent(s, 'connection', [!1]), !0)
      : !1;
  }
  async accounts(e, t) {
    const s = t.origin;
    return s ? (await a.getConnection(s))?.accounts || [] : [];
  }
  async signMessage(e, t) {
    const s = t.origin;
    return (
      await this.requireAccountConnecton(t.connection, e.address),
      await (
        await u.open(s, d.requestMessage(), this.communicationProtocol)
      ).signMessage({ ...e, origin: s })
    );
  }
  async sendTransaction(e, t) {
    await this.requireAccountConnecton(t.connection, e.address);
    const s = t.origin;
    if ((await C.getSelectedNetwork())?.url !== e.provider.url)
      throw new Error(
        [
          `${e.provider.url} is different from the user current network!`,
          'Request the user to add the new network. fuel.addNetwork([...]).',
        ].join(`
`)
      );
    return await (
      await u.open(s, d.requestTransaction(), this.communicationProtocol)
    ).sendTransaction({ ...e, origin: s });
  }
  async currentAccount(e, t) {
    const s = await v.getCurrentAccount();
    return await this.requireAccountConnecton(t.connection, s?.address), s?.address;
  }
  async network() {
    return { url: (await C.getSelectedNetwork())?.url };
  }
  async assets(e) {
    return (await M.getAssets()) || [];
  }
  async addAsset(e, t) {
    const s = t.origin;
    return await (
      await u.open(s, d.requestAddAsset(), this.communicationProtocol)
    ).addAsset({ ...e, origin: s });
  }
}
class Q extends N {
  constructor() {
    super(),
      (this.removePort = (e) => {
        const t = this.ports.get(e);
        t &&
          (t.onMessage.removeListener(this.onMessage),
          this.ports.delete(e),
          this.emit(r.removeConnection, e));
      }),
      (this.postMessage = (e) => {
        const t = this.ports.get(e.id);
        t && t.postMessage(e);
      }),
      (this.broadcast = (e, t) => {
        const s = Array.isArray(e) ? e : [e];
        this.ports.forEach((o) => {
          s.includes(o.sender?.origin || '') && o.postMessage(t);
        });
      }),
      (this.getPortId = (e) => {
        for (const [t, s] of this.ports.entries()) if (s === e) return t;
        return null;
      }),
      (this.onMessage = (e, t) => {
        if (
          t.sender?.id !== chrome.runtime.id ||
          ![y, g].includes(e.target) ||
          !Object.keys(r).includes(e.type)
        )
          return;
        const o = this.getPortId(t);
        this.emit(e.type, Object.freeze({ ...e, id: o, sender: t.sender }));
      }),
      (this.ports = new Map());
  }
  addConnection(e) {
    const t = G();
    this.ports.set(t, e), this.setupListeners(t);
  }
  setupListeners(e) {
    const t = this.ports.get(e);
    t &&
      !t.onMessage.hasListener(this.onMessage) &&
      (t.onMessage.addListener(this.onMessage),
      t.onDisconnect.addListener(() => this.removePort(e)));
  }
  on(e, t) {
    return super.on(e, t);
  }
  destroy() {
    this.ports.forEach((e) => e.disconnect()), this.ports.clear();
  }
}
class Z extends x {
  constructor() {
    super(), this.setupListeners();
  }
  setupListeners() {
    P.on('changes', (e) => {
      e.forEach((t) => {
        switch (t.type) {
          case 1:
            super.emit(`${t.table}:create`, t);
            break;
          case 2:
            super.emit(`${t.table}:update`, t);
            break;
          case 3:
            super.emit(`${t.table}:delete`, t);
            break;
        }
      });
    }),
      P.open();
  }
  on(e, t) {
    return super.on(e, t);
  }
}
class f {
  constructor(e) {
    (this.communicationProtocol = e),
      (this.databaseObservable = new Z()),
      this.setupApplicationWatcher();
  }
  static start(e) {
    return new f(e);
  }
  createEvents(e) {
    return { target: m, type: r.event, events: e };
  }
  setupApplicationWatcher() {
    this.databaseObservable.on('networks:update', async (e) => {
      if (!e.obj.isSelected) return;
      const s = (await a.getConnections()).map((o) => o.origin);
      this.communicationProtocol.broadcast(
        s,
        this.createEvents([{ event: 'network', params: [{ id: e.obj.id, url: e.obj.url }] }])
      );
    }),
      this.databaseObservable.on('accounts:update', async (e) => {
        if (!e.obj.isCurrent) return;
        const t = e.obj,
          o = (await a.getConnections())
            .filter((c) => c.accounts.includes(t?.address || ''))
            .map((c) => c.origin);
        this.communicationProtocol.broadcast(
          o,
          this.createEvents([{ event: 'currentAccount', params: [e.obj.address] }])
        );
      }),
      this.databaseObservable.on('assets:update', (e) => e.obj.isCustom && this.broadcastAssets()),
      this.databaseObservable.on('assets:delete', () => this.broadcastAssets()),
      this.databaseObservable.on('assets:create', () => this.broadcastAssets());
  }
  async broadcastAssets() {
    const t = (await a.getConnections()).map((o) => o.origin),
      s = await M.getAssets();
    this.communicationProtocol.broadcast(t, this.createEvents([{ event: 'assets', params: [s] }]));
  }
}
class A {
  constructor(e) {
    (this.communicationProtocol = e),
      (this.vault = new j()),
      this.setupListeners(),
      this.setupAutoClose();
  }
  async setupAutoClose() {
    this.vault.manager.on('unlock', () => {
      chrome.alarms.create('VaultAutoClose', { delayInMinutes: 15 }),
        chrome.alarms.onAlarm.addListener((e) => {
          e.name === 'VaultAutoClose' && this.vault.manager.lock();
        });
    });
  }
  static start(e) {
    return new A(e);
  }
  setupListeners() {
    this.communicationProtocol.on(r.request, async (e) => {
      if (
        !e.sender?.origin?.includes(chrome.runtime.id) ||
        e.sender?.id !== chrome.runtime.id ||
        e.target !== y
      )
        return;
      const t = await this.vault.server.receive(e.request);
      t &&
        this.communicationProtocol.postMessage({
          id: e.id,
          type: r.response,
          target: S,
          response: t,
        });
    });
  }
}
const p = new Q();
b.start(p);
A.start(p);
f.start(p);
chrome.runtime.onConnect.addListener((n) => {
  if (n.sender?.id !== chrome.runtime.id) {
    n.disconnect();
    return;
  }
  [g, y].includes(n.name) && p.addConnection(n);
});
