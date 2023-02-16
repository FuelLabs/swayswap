import {
  k as c,
  Q as d,
  P as l,
  K as h,
  z as v,
  V as i,
  y as p,
  e as w,
  d as o,
} from './index-82809ee4.js';
var a = {
    accounts: 'accounts',
    currentAccount: 'currentAccount',
    connection: 'connection',
    network: 'network',
    assets: 'assets',
  },
  g = 'Fuel',
  f = 'FuelContentScript',
  E = 'message',
  y = 30,
  m = class extends w {
    constructor() {
      super(),
        (this.onCommunicationMessage = (e) => {
          switch (e.type) {
            case 'response':
              this.onResponse(e);
              break;
            case 'request':
              this.onRequest(e);
              break;
            case 'event':
              this.onEvent(e);
              break;
            case 'uiEvent':
              this.onUIEvent(e);
              break;
          }
        }),
        this.setMaxListeners(y),
        (this.client = new o.JSONRPCClient(this.sendRequest.bind(this))),
        (this.server = new o.JSONRPCServer());
    }
    externalMethods(e) {
      e.forEach((t) => {
        let n = t;
        t.name && (n = t.name), this.server.addMethod(n, this[n].bind(this));
      });
    }
    async sendRequest(e) {
      throw new Error('Send request not implemented');
    }
    sendResponse(e, t) {
      throw new Error('Send response not implemented');
    }
    onEvent(e) {
      e.events.forEach((t) => {
        this.emit(t.event, ...t.params);
      });
    }
    onResponse(e) {
      this.client.receive(e.response);
    }
    onRequest(e) {
      this.server.receive(e.request).then((t) => {
        this.sendResponse(t, e);
      });
    }
    onUIEvent(e) {}
  },
  q = class extends m {
    constructor() {
      super(),
        (this.onMessage = (e) => {
          const t = Object.freeze(e);
          if (!this.acceptMessage(t)) return;
          const { data: n } = t;
          this.onCommunicationMessage(n);
        }),
        window.addEventListener(E, this.onMessage.bind(this));
    }
    acceptMessage(e) {
      return !0;
    }
    postMessage(e, t) {
      window.postMessage(e, t || window.origin);
    }
  };
function M(e) {
  const t = e.inputs?.map((n) => {
    switch (n.type) {
      case i.Message:
        return n.recipient;
      case i.Coin:
        return n.owner;
      default:
        return;
    }
  })[0];
  if (!t) throw new Error('No possible signer found!');
  return c.fromB256(p(t)).toString();
}
var C = class extends q {
    acceptMessage(e) {
      const { data: t } = e;
      return e.origin === window.origin && t.target === g;
    }
    async sendRequest(e) {
      e && this.postMessage({ type: 'request', target: f, request: e });
    }
    async ping() {
      return this.client.timeout(1e3).request('ping', {});
    }
    async network() {
      return this.client.request('network', {});
    }
    async isConnected() {
      return this.client.request('isConnected', {});
    }
    async connect() {
      return this.client.request('connect', {});
    }
    async disconnect() {
      return this.client.request('disconnect', {});
    }
    async accounts() {
      return this.client.request('accounts', {});
    }
    async currentAccount() {
      return this.client.request('currentAccount', {});
    }
    async signMessage(e, t) {
      if (!t.trim()) throw new Error('Message is required');
      return this.client.request('signMessage', { address: e, message: t });
    }
    async sendTransaction(e, t, n) {
      if (!e) throw new Error('Transaction is required');
      const r = d(e),
        u = n || e.signer || M(r);
      return this.client.request('sendTransaction', {
        address: u,
        provider: t,
        transaction: JSON.stringify(r),
      });
    }
    async assets() {
      return this.client.request('assets', {});
    }
    async addAsset(e) {
      return this.client.request('addAsset', { asset: e });
    }
    on(e, t) {
      return super.on(e, t);
    }
  },
  S = class extends l {
    constructor(e, t) {
      super(e, t), (this.provider = t);
    }
    async signMessage(e) {
      return this.provider.walletConnection.signMessage(this.address.toString(), e);
    }
    async sendTransaction(e) {
      return this.provider.sendTransaction({ ...e, signer: this.address.toString() });
    }
  },
  b = class extends h {
    constructor(e, t) {
      super(e), (this.walletConnection = t);
    }
    async sendTransaction(e) {
      const t = await this.walletConnection.sendTransaction(e, { url: this.url });
      return new v(t, this);
    }
  },
  s = {},
  R = class extends C {
    constructor() {
      super(...arguments),
        (this.utils = {
          createAddress: (e) => (
            console.warn('Do not use this method! It will be removed in the next release.'),
            c.fromString(e)
          ),
        }),
        (this.events = a);
    }
    async getProvider() {
      const e = await this.network();
      if (s.provider) return s.provider;
      const t = new b(e.url, this);
      return (
        (s.provider = t),
        this.on(a.network, async (n) => {
          s.provider?.connect(n.url);
        }),
        s.provider
      );
    }
    async getWallet(e) {
      const t = await this.getProvider();
      return new S(e, t);
    }
  },
  T = (e) =>
    new Proxy(e, {
      get(t, n) {
        return t[n];
      },
      set(t, n, r) {
        return Object.hasOwn(t, n) && ['_eventsCount', '_events'].includes(n)
          ? ((t[n] = r), !0)
          : !1;
      },
      defineProperty(t, n) {
        return Object.hasOwn(t, n) ? t[n] : !1;
      },
      deleteProperty() {
        return !1;
      },
    });
function P(e) {
  const t = T(new R());
  if (
    (Object.defineProperty(e, 'fuel', { value: t, writable: !1, enumerable: !0, configurable: !0 }),
    typeof document < 'u')
  ) {
    const n = new CustomEvent('FuelLoaded', { detail: t });
    document.dispatchEvent(n);
  }
}
P(window);
