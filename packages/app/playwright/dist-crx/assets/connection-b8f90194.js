import {
  u as xa,
  m as Ie,
  e as Yn,
  v as Ia,
  x as ka,
  d as mn,
  k as gn,
  Q as Ca,
  K as wn,
  p as Oa,
  y as Ra,
  i as hr,
} from './index-82809ee4.js';
import { M as Dt, a as Da } from './config-12781290.js';
function q(e) {
  return function (n, r) {
    return `/${
      e
        .match(/[^/]+/g)
        ?.map((o) => n?.[o.replace(':', '')] || o)
        .join('/') ?? ''
    }${Or(r)}`;
  };
}
function Or(e) {
  const t = new URLSearchParams(e).toString();
  return t.length ? `?${t}` : '';
}
function Lo(e, t) {
  const { href: n } = new URL(e, 'https://fuel.network/');
  return `${n}${Or(t)}`;
}
var qn = ((e) => ((e.signup = '/index.html'), (e.popup = '/popup.html'), e))(qn || {});
const Ka = {
    index: q('/'),
    wallet: q('/wallet'),
    faucet: q('/wallet/faucet'),
    receive: q('/wallet/receive'),
    signUp: q('/sign-up'),
    signUpWelcome: q('/sign-up/welcome'),
    signUpCreateWallet: q('/sign-up/create-wallet'),
    signUpRecoverWallet: q('/sign-up/recover-wallet'),
    signUpWalletCreated: q('/sign-up/wallet-created'),
    networks: q('/networks'),
    networkUpdate: q('/networks/update/:id'),
    networkAdd: q('/networks/add'),
    request: q('/request'),
    requestConnection: q('/request/connection'),
    requestTransaction: q('/request/transaction'),
    requestMessage: q('/request/message'),
    requestAddAsset: q('/request/asset'),
    txs: q('/transactions'),
    tx: q('/transactions/view/:txId'),
    settings: q('/settings'),
    settingsRevealPassphrase: q('/settings/reveal-passphrase'),
    settingsChangePassword: q('/settings/change-password'),
    settingsConnectedApps: q('/settings/connected-apps'),
    send: q('/send'),
    sendConfirm: q('/send/confirm'),
    accounts: q('/accounts'),
    accountAdd: q('/accounts/add'),
    logout: q('/accounts/logout'),
    assets: q('/assets'),
    assetsEdit: q('/assets/edit/:id'),
    assetsAdd: q('/assets/add'),
  },
  {
    VITE_MNEMONIC_WORDS: Uo,
    VITE_FUEL_PROVIDER_URL: Vo,
    VITE_FAUCET_RECAPTCHA_KEY: Wo,
    VITE_FUEL_FAUCET_URL: Ho,
    VITE_ADDR_OWNER: $o,
    VITE_CRX: Yo,
    NODE_ENV: qo,
  } = {
    VITE_FUEL_PROVIDER_URL: 'http://localhost:4000/graphql',
    VITE_FUEL_FAUCET_URL: 'http://localhost:4040/',
    VITE_MNEMONIC_WORDS: '12',
    VITE_FAUCET_RECAPTCHA_KEY: '',
    VITE_APP_VERSION: '0.0.1',
    BASE_URL: '/',
    MODE: 'production',
    DEV: !1,
    PROD: !0,
  },
  Go = 3,
  zo = 16,
  Xo = 350,
  Qo = 600,
  Jo = 30,
  Pa = typeof chrome < 'u' && typeof chrome.runtime < 'u',
  Zo = 'isLogged',
  es = Pa && globalThis.location.pathname === qn.popup,
  ts = () => chrome.runtime.getURL(`${qn.signup}#${Ka.signUpWelcome()}`);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var H =
  function () {
    return (
      (H =
        Object.assign ||
        function (t) {
          for (var n, r = 1, a = arguments.length; r < a; r++) {
            n = arguments[r];
            for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
          }
          return t;
        }),
      H.apply(this, arguments)
    );
  };
function _n(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, a = t.length, i; r < a; r++)
      (i || !(r in t)) && (i || (i = Array.prototype.slice.call(t, 0, r)), (i[r] = t[r]));
  return e.concat(i || Array.prototype.slice.call(t));
}
var Q =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
      ? self
      : typeof window < 'u'
      ? window
      : global,
  te = Object.keys,
  ie = Array.isArray;
typeof Promise < 'u' && !Q.Promise && (Q.Promise = Promise);
function ue(e, t) {
  return (
    typeof t != 'object' ||
      te(t).forEach(function (n) {
        e[n] = t[n];
      }),
    e
  );
}
var gt = Object.getPrototypeOf,
  Ma = {}.hasOwnProperty;
function ve(e, t) {
  return Ma.call(e, t);
}
function at(e, t) {
  typeof t == 'function' && (t = t(gt(e))),
    (typeof Reflect > 'u' ? te : Reflect.ownKeys)(t).forEach(function (n) {
      Re(e, n, t[n]);
    });
}
var Rr = Object.defineProperty;
function Re(e, t, n, r) {
  Rr(
    e,
    t,
    ue(
      n && ve(n, 'get') && typeof n.get == 'function'
        ? { get: n.get, set: n.set, configurable: !0 }
        : { value: n, configurable: !0, writable: !0 },
      r
    )
  );
}
function it(e) {
  return {
    from: function (t) {
      return (
        (e.prototype = Object.create(t.prototype)),
        Re(e.prototype, 'constructor', e),
        { extend: at.bind(null, e.prototype) }
      );
    },
  };
}
var Ba = Object.getOwnPropertyDescriptor;
function Gn(e, t) {
  var n = Ba(e, t),
    r;
  return n || ((r = gt(e)) && Gn(r, t));
}
var Na = [].slice;
function tn(e, t, n) {
  return Na.call(e, t, n);
}
function Dr(e, t) {
  return t(e);
}
function ht(e) {
  if (!e) throw new Error('Assertion Failed');
}
function Kr(e) {
  Q.setImmediate ? setImmediate(e) : setTimeout(e, 0);
}
function Pr(e, t) {
  return e.reduce(function (n, r, a) {
    var i = t(r, a);
    return i && (n[i[0]] = i[1]), n;
  }, {});
}
function Fa(e, t, n) {
  try {
    e.apply(null, n);
  } catch (r) {
    t && t(r);
  }
}
function Oe(e, t) {
  if (ve(e, t)) return e[t];
  if (!t) return e;
  if (typeof t != 'string') {
    for (var n = [], r = 0, a = t.length; r < a; ++r) {
      var i = Oe(e, t[r]);
      n.push(i);
    }
    return n;
  }
  var o = t.indexOf('.');
  if (o !== -1) {
    var s = e[t.substr(0, o)];
    return s === void 0 ? void 0 : Oe(s, t.substr(o + 1));
  }
}
function ge(e, t, n) {
  if (!(!e || t === void 0) && !('isFrozen' in Object && Object.isFrozen(e)))
    if (typeof t != 'string' && 'length' in t) {
      ht(typeof n != 'string' && 'length' in n);
      for (var r = 0, a = t.length; r < a; ++r) ge(e, t[r], n[r]);
    } else {
      var i = t.indexOf('.');
      if (i !== -1) {
        var o = t.substr(0, i),
          s = t.substr(i + 1);
        if (s === '')
          n === void 0 ? (ie(e) && !isNaN(parseInt(o)) ? e.splice(o, 1) : delete e[o]) : (e[o] = n);
        else {
          var u = e[o];
          (!u || !ve(e, o)) && (u = e[o] = {}), ge(u, s, n);
        }
      } else
        n === void 0 ? (ie(e) && !isNaN(parseInt(t)) ? e.splice(t, 1) : delete e[t]) : (e[t] = n);
    }
}
function ja(e, t) {
  typeof t == 'string'
    ? ge(e, t, void 0)
    : 'length' in t &&
      [].map.call(t, function (n) {
        ge(e, n, void 0);
      });
}
function Mr(e) {
  var t = {};
  for (var n in e) ve(e, n) && (t[n] = e[n]);
  return t;
}
var La = [].concat;
function Br(e) {
  return La.apply([], e);
}
var Nr =
    'Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey'
      .split(',')
      .concat(
        Br(
          [8, 16, 32, 64].map(function (e) {
            return ['Int', 'Uint', 'Float'].map(function (t) {
              return t + e + 'Array';
            });
          })
        )
      )
      .filter(function (e) {
        return Q[e];
      }),
  Ua = Nr.map(function (e) {
    return Q[e];
  });
Pr(Nr, function (e) {
  return [e, !0];
});
var Be = null;
function Tt(e) {
  Be = typeof WeakMap < 'u' && new WeakMap();
  var t = bn(e);
  return (Be = null), t;
}
function bn(e) {
  if (!e || typeof e != 'object') return e;
  var t = Be && Be.get(e);
  if (t) return t;
  if (ie(e)) {
    (t = []), Be && Be.set(e, t);
    for (var n = 0, r = e.length; n < r; ++n) t.push(bn(e[n]));
  } else if (Ua.indexOf(e.constructor) >= 0) t = e;
  else {
    var a = gt(e);
    (t = a === Object.prototype ? {} : Object.create(a)), Be && Be.set(e, t);
    for (var i in e) ve(e, i) && (t[i] = bn(e[i]));
  }
  return t;
}
var Va = {}.toString;
function En(e) {
  return Va.call(e).slice(8, -1);
}
var An = typeof Symbol < 'u' ? Symbol.iterator : '@@iterator',
  Wa =
    typeof An == 'symbol'
      ? function (e) {
          var t;
          return e != null && (t = e[An]) && t.apply(e);
        }
      : function () {
          return null;
        },
  nt = {};
function ke(e) {
  var t, n, r, a;
  if (arguments.length === 1) {
    if (ie(e)) return e.slice();
    if (this === nt && typeof e == 'string') return [e];
    if ((a = Wa(e))) {
      for (n = []; (r = a.next()), !r.done; ) n.push(r.value);
      return n;
    }
    if (e == null) return [e];
    if (((t = e.length), typeof t == 'number')) {
      for (n = new Array(t); t--; ) n[t] = e[t];
      return n;
    }
    return [e];
  }
  for (t = arguments.length, n = new Array(t); t--; ) n[t] = arguments[t];
  return n;
}
var zn =
    typeof Symbol < 'u'
      ? function (e) {
          return e[Symbol.toStringTag] === 'AsyncFunction';
        }
      : function () {
          return !1;
        },
  Ee = typeof location < 'u' && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function Fr(e, t) {
  (Ee = e), (jr = t);
}
var jr = function () {
    return !0;
  },
  Ha = !new Error('').stack;
function Je() {
  if (Ha)
    try {
      throw (Je.arguments, new Error());
    } catch (e) {
      return e;
    }
  return new Error();
}
function Sn(e, t) {
  var n = e.stack;
  return n
    ? ((t = t || 0),
      n.indexOf(e.name) === 0 &&
        (t += (e.name + e.message).split(`
`).length),
      n
        .split(
          `
`
        )
        .slice(t)
        .filter(jr)
        .map(function (r) {
          return (
            `
` + r
          );
        })
        .join(''))
    : '';
}
var $a = [
    'Modify',
    'Bulk',
    'OpenFailed',
    'VersionChange',
    'Schema',
    'Upgrade',
    'InvalidTable',
    'MissingAPI',
    'NoSuchDatabase',
    'InvalidArgument',
    'SubTransaction',
    'Unsupported',
    'Internal',
    'DatabaseClosed',
    'PrematureCommit',
    'ForeignAwait',
  ],
  Lr = [
    'Unknown',
    'Constraint',
    'Data',
    'TransactionInactive',
    'ReadOnly',
    'Version',
    'NotFound',
    'InvalidState',
    'InvalidAccess',
    'Abort',
    'Timeout',
    'QuotaExceeded',
    'Syntax',
    'DataClone',
  ],
  Xn = $a.concat(Lr),
  Ya = {
    VersionChanged: 'Database version changed by other database connection',
    DatabaseClosed: 'Database has been closed',
    Abort: 'Transaction aborted',
    TransactionInactive: 'Transaction has already completed or failed',
    MissingAPI: 'IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb',
  };
function ot(e, t) {
  (this._e = Je()), (this.name = e), (this.message = t);
}
it(ot)
  .from(Error)
  .extend({
    stack: {
      get: function () {
        return this._stack || (this._stack = this.name + ': ' + this.message + Sn(this._e, 2));
      },
    },
    toString: function () {
      return this.name + ': ' + this.message;
    },
  });
function Ur(e, t) {
  return (
    e +
    '. Errors: ' +
    Object.keys(t)
      .map(function (n) {
        return t[n].toString();
      })
      .filter(function (n, r, a) {
        return a.indexOf(n) === r;
      }).join(`
`)
  );
}
function Yt(e, t, n, r) {
  (this._e = Je()),
    (this.failures = t),
    (this.failedKeys = r),
    (this.successCount = n),
    (this.message = Ur(e, t));
}
it(Yt).from(ot);
function pt(e, t) {
  (this._e = Je()),
    (this.name = 'BulkError'),
    (this.failures = Object.keys(t).map(function (n) {
      return t[n];
    })),
    (this.failuresByPos = t),
    (this.message = Ur(e, t));
}
it(pt).from(ot);
var Qn = Xn.reduce(function (e, t) {
    return (e[t] = t + 'Error'), e;
  }, {}),
  qa = ot,
  N = Xn.reduce(function (e, t) {
    var n = t + 'Error';
    function r(a, i) {
      (this._e = Je()),
        (this.name = n),
        a
          ? typeof a == 'string'
            ? ((this.message =
                '' +
                a +
                (i
                  ? `
 ` + i
                  : '')),
              (this.inner = i || null))
            : typeof a == 'object' && ((this.message = a.name + ' ' + a.message), (this.inner = a))
          : ((this.message = Ya[t] || n), (this.inner = null));
    }
    return it(r).from(qa), (e[t] = r), e;
  }, {});
N.Syntax = SyntaxError;
N.Type = TypeError;
N.Range = RangeError;
var vr = Lr.reduce(function (e, t) {
  return (e[t + 'Error'] = N[t]), e;
}, {});
function Ga(e, t) {
  if (
    !e ||
    e instanceof ot ||
    e instanceof TypeError ||
    e instanceof SyntaxError ||
    !e.name ||
    !vr[e.name]
  )
    return e;
  var n = new vr[e.name](t || e.message, e);
  return (
    'stack' in e &&
      Re(n, 'stack', {
        get: function () {
          return this.inner.stack;
        },
      }),
    n
  );
}
var nn = Xn.reduce(function (e, t) {
  return ['Syntax', 'Type', 'Range'].indexOf(t) === -1 && (e[t + 'Error'] = N[t]), e;
}, {});
nn.ModifyError = Yt;
nn.DexieError = ot;
nn.BulkError = pt;
function G() {}
function xt(e) {
  return e;
}
function za(e, t) {
  return e == null || e === xt
    ? t
    : function (n) {
        return t(e(n));
      };
}
function Xe(e, t) {
  return function () {
    e.apply(this, arguments), t.apply(this, arguments);
  };
}
function Xa(e, t) {
  return e === G
    ? t
    : function () {
        var n = e.apply(this, arguments);
        n !== void 0 && (arguments[0] = n);
        var r = this.onsuccess,
          a = this.onerror;
        (this.onsuccess = null), (this.onerror = null);
        var i = t.apply(this, arguments);
        return (
          r && (this.onsuccess = this.onsuccess ? Xe(r, this.onsuccess) : r),
          a && (this.onerror = this.onerror ? Xe(a, this.onerror) : a),
          i !== void 0 ? i : n
        );
      };
}
function Qa(e, t) {
  return e === G
    ? t
    : function () {
        e.apply(this, arguments);
        var n = this.onsuccess,
          r = this.onerror;
        (this.onsuccess = this.onerror = null),
          t.apply(this, arguments),
          n && (this.onsuccess = this.onsuccess ? Xe(n, this.onsuccess) : n),
          r && (this.onerror = this.onerror ? Xe(r, this.onerror) : r);
      };
}
function Ja(e, t) {
  return e === G
    ? t
    : function (n) {
        var r = e.apply(this, arguments);
        ue(n, r);
        var a = this.onsuccess,
          i = this.onerror;
        (this.onsuccess = null), (this.onerror = null);
        var o = t.apply(this, arguments);
        return (
          a && (this.onsuccess = this.onsuccess ? Xe(a, this.onsuccess) : a),
          i && (this.onerror = this.onerror ? Xe(i, this.onerror) : i),
          r === void 0 ? (o === void 0 ? void 0 : o) : ue(r, o)
        );
      };
}
function Za(e, t) {
  return e === G
    ? t
    : function () {
        return t.apply(this, arguments) === !1 ? !1 : e.apply(this, arguments);
      };
}
function Jn(e, t) {
  return e === G
    ? t
    : function () {
        var n = e.apply(this, arguments);
        if (n && typeof n.then == 'function') {
          for (var r = this, a = arguments.length, i = new Array(a); a--; ) i[a] = arguments[a];
          return n.then(function () {
            return t.apply(r, i);
          });
        }
        return t.apply(this, arguments);
      };
}
var wt = {},
  ei = 100,
  ti = 20,
  Vr = 100,
  Zn =
    typeof Promise > 'u'
      ? []
      : (function () {
          var e = Promise.resolve();
          if (typeof crypto > 'u' || !crypto.subtle) return [e, gt(e), e];
          var t = crypto.subtle.digest('SHA-512', new Uint8Array([0]));
          return [t, gt(t), e];
        })(),
  Tn = Zn[0],
  qt = Zn[1],
  xn = Zn[2],
  Wr = qt && qt.then,
  jt = Tn && Tn.constructor,
  er = !!xn,
  In = !1,
  ni = xn
    ? function () {
        xn.then(Kt);
      }
    : Q.setImmediate
    ? setImmediate.bind(null, Kt)
    : Q.MutationObserver
    ? function () {
        var e = document.createElement('div');
        new MutationObserver(function () {
          Kt(), (e = null);
        }).observe(e, { attributes: !0 }),
          e.setAttribute('i', '1');
      }
    : function () {
        setTimeout(Kt, 0);
      },
  _t = function (e, t) {
    vt.push([e, t]), Gt && (ni(), (Gt = !1));
  },
  kn = !0,
  Gt = !0,
  Ge = [],
  Lt = [],
  Cn = null,
  On = xt,
  rt = {
    id: 'global',
    global: !0,
    ref: 0,
    unhandleds: [],
    onunhandled: mr,
    pgp: !1,
    env: {},
    finalize: function () {
      this.unhandleds.forEach(function (e) {
        try {
          mr(e[0], e[1]);
        } catch {}
      });
    },
  },
  P = rt,
  vt = [],
  ze = 0,
  Ut = [];
function O(e) {
  if (typeof this != 'object') throw new TypeError('Promises must be constructed via new');
  (this._listeners = []), (this.onuncatched = G), (this._lib = !1);
  var t = (this._PSD = P);
  if (
    (Ee && ((this._stackHolder = Je()), (this._prev = null), (this._numPrev = 0)),
    typeof e != 'function')
  ) {
    if (e !== wt) throw new TypeError('Not a function');
    (this._state = arguments[1]),
      (this._value = arguments[2]),
      this._state === !1 && Dn(this, this._value);
    return;
  }
  (this._state = null), (this._value = null), ++t.ref, $r(this, e);
}
var Rn = {
  get: function () {
    var e = P,
      t = zt;
    function n(r, a) {
      var i = this,
        o = !e.global && (e !== P || t !== zt),
        s = o && !De(),
        u = new O(function (c, d) {
          tr(i, new Hr(Qt(r, e, o, s), Qt(a, e, o, s), c, d, e));
        });
      return Ee && Gr(u, this), u;
    }
    return (n.prototype = wt), n;
  },
  set: function (e) {
    Re(
      this,
      'then',
      e && e.prototype === wt
        ? Rn
        : {
            get: function () {
              return e;
            },
            set: Rn.set,
          }
    );
  },
};
at(O.prototype, {
  then: Rn,
  _then: function (e, t) {
    tr(this, new Hr(null, null, e, t, P));
  },
  catch: function (e) {
    if (arguments.length === 1) return this.then(null, e);
    var t = arguments[0],
      n = arguments[1];
    return typeof t == 'function'
      ? this.then(null, function (r) {
          return r instanceof t ? n(r) : Vt(r);
        })
      : this.then(null, function (r) {
          return r && r.name === t ? n(r) : Vt(r);
        });
  },
  finally: function (e) {
    return this.then(
      function (t) {
        return e(), t;
      },
      function (t) {
        return e(), Vt(t);
      }
    );
  },
  stack: {
    get: function () {
      if (this._stack) return this._stack;
      try {
        In = !0;
        var e = qr(this, [], ti),
          t = e.join(`
From previous: `);
        return this._state !== null && (this._stack = t), t;
      } finally {
        In = !1;
      }
    },
  },
  timeout: function (e, t) {
    var n = this;
    return e < 1 / 0
      ? new O(function (r, a) {
          var i = setTimeout(function () {
            return a(new N.Timeout(t));
          }, e);
          n.then(r, a).finally(clearTimeout.bind(null, i));
        })
      : this;
  },
});
typeof Symbol < 'u' && Symbol.toStringTag && Re(O.prototype, Symbol.toStringTag, 'Dexie.Promise');
rt.env = zr();
function Hr(e, t, n, r, a) {
  (this.onFulfilled = typeof e == 'function' ? e : null),
    (this.onRejected = typeof t == 'function' ? t : null),
    (this.resolve = n),
    (this.reject = r),
    (this.psd = a);
}
at(O, {
  all: function () {
    var e = ke.apply(null, arguments).map(Xt);
    return new O(function (t, n) {
      e.length === 0 && t([]);
      var r = e.length;
      e.forEach(function (a, i) {
        return O.resolve(a).then(function (o) {
          (e[i] = o), --r || t(e);
        }, n);
      });
    });
  },
  resolve: function (e) {
    if (e instanceof O) return e;
    if (e && typeof e.then == 'function')
      return new O(function (n, r) {
        e.then(n, r);
      });
    var t = new O(wt, !0, e);
    return Gr(t, Cn), t;
  },
  reject: Vt,
  race: function () {
    var e = ke.apply(null, arguments).map(Xt);
    return new O(function (t, n) {
      e.map(function (r) {
        return O.resolve(r).then(t, n);
      });
    });
  },
  PSD: {
    get: function () {
      return P;
    },
    set: function (e) {
      return (P = e);
    },
  },
  totalEchoes: {
    get: function () {
      return zt;
    },
  },
  newPSD: je,
  usePSD: ut,
  scheduler: {
    get: function () {
      return _t;
    },
    set: function (e) {
      _t = e;
    },
  },
  rejectionMapper: {
    get: function () {
      return On;
    },
    set: function (e) {
      On = e;
    },
  },
  follow: function (e, t) {
    return new O(function (n, r) {
      return je(
        function (a, i) {
          var o = P;
          (o.unhandleds = []),
            (o.onunhandled = i),
            (o.finalize = Xe(function () {
              var s = this;
              ai(function () {
                s.unhandleds.length === 0 ? a() : i(s.unhandleds[0]);
              });
            }, o.finalize)),
            e();
        },
        t,
        n,
        r
      );
    });
  },
});
jt &&
  (jt.allSettled &&
    Re(O, 'allSettled', function () {
      var e = ke.apply(null, arguments).map(Xt);
      return new O(function (t) {
        e.length === 0 && t([]);
        var n = e.length,
          r = new Array(n);
        e.forEach(function (a, i) {
          return O.resolve(a)
            .then(
              function (o) {
                return (r[i] = { status: 'fulfilled', value: o });
              },
              function (o) {
                return (r[i] = { status: 'rejected', reason: o });
              }
            )
            .then(function () {
              return --n || t(r);
            });
        });
      });
    }),
  jt.any &&
    typeof AggregateError < 'u' &&
    Re(O, 'any', function () {
      var e = ke.apply(null, arguments).map(Xt);
      return new O(function (t, n) {
        e.length === 0 && n(new AggregateError([]));
        var r = e.length,
          a = new Array(r);
        e.forEach(function (i, o) {
          return O.resolve(i).then(
            function (s) {
              return t(s);
            },
            function (s) {
              (a[o] = s), --r || n(new AggregateError(a));
            }
          );
        });
      });
    }));
function $r(e, t) {
  try {
    t(function (n) {
      if (e._state === null) {
        if (n === e) throw new TypeError('A promise cannot be resolved with itself.');
        var r = e._lib && It();
        n && typeof n.then == 'function'
          ? $r(e, function (a, i) {
              n instanceof O ? n._then(a, i) : n.then(a, i);
            })
          : ((e._state = !0), (e._value = n), Yr(e)),
          r && kt();
      }
    }, Dn.bind(null, e));
  } catch (n) {
    Dn(e, n);
  }
}
function Dn(e, t) {
  if ((Lt.push(t), e._state === null)) {
    var n = e._lib && It();
    (t = On(t)),
      (e._state = !1),
      (e._value = t),
      Ee &&
        t !== null &&
        typeof t == 'object' &&
        !t._promise &&
        Fa(function () {
          var r = Gn(t, 'stack');
          (t._promise = e),
            Re(t, 'stack', {
              get: function () {
                return In ? r && (r.get ? r.get.apply(t) : r.value) : e.stack;
              },
            });
        }),
      ii(e),
      Yr(e),
      n && kt();
  }
}
function Yr(e) {
  var t = e._listeners;
  e._listeners = [];
  for (var n = 0, r = t.length; n < r; ++n) tr(e, t[n]);
  var a = e._PSD;
  --a.ref || a.finalize(),
    ze === 0 &&
      (++ze,
      _t(function () {
        --ze === 0 && nr();
      }, []));
}
function tr(e, t) {
  if (e._state === null) {
    e._listeners.push(t);
    return;
  }
  var n = e._state ? t.onFulfilled : t.onRejected;
  if (n === null) return (e._state ? t.resolve : t.reject)(e._value);
  ++t.psd.ref, ++ze, _t(ri, [n, e, t]);
}
function ri(e, t, n) {
  try {
    Cn = t;
    var r,
      a = t._value;
    t._state ? (r = e(a)) : (Lt.length && (Lt = []), (r = e(a)), Lt.indexOf(a) === -1 && oi(t)),
      n.resolve(r);
  } catch (i) {
    n.reject(i);
  } finally {
    (Cn = null), --ze === 0 && nr(), --n.psd.ref || n.psd.finalize();
  }
}
function qr(e, t, n) {
  if (t.length === n) return t;
  var r = '';
  if (e._state === !1) {
    var a = e._value,
      i,
      o;
    a != null
      ? ((i = a.name || 'Error'), (o = a.message || a), (r = Sn(a, 0)))
      : ((i = a), (o = '')),
      t.push(i + (o ? ': ' + o : '') + r);
  }
  return (
    Ee &&
      ((r = Sn(e._stackHolder, 2)),
      r && t.indexOf(r) === -1 && t.push(r),
      e._prev && qr(e._prev, t, n)),
    t
  );
}
function Gr(e, t) {
  var n = t ? t._numPrev + 1 : 0;
  n < ei && ((e._prev = t), (e._numPrev = n));
}
function Kt() {
  It() && kt();
}
function It() {
  var e = kn;
  return (kn = !1), (Gt = !1), e;
}
function kt() {
  var e, t, n;
  do
    for (; vt.length > 0; )
      for (e = vt, vt = [], n = e.length, t = 0; t < n; ++t) {
        var r = e[t];
        r[0].apply(null, r[1]);
      }
  while (vt.length > 0);
  (kn = !0), (Gt = !0);
}
function nr() {
  var e = Ge;
  (Ge = []),
    e.forEach(function (r) {
      r._PSD.onunhandled.call(null, r._value, r);
    });
  for (var t = Ut.slice(0), n = t.length; n; ) t[--n]();
}
function ai(e) {
  function t() {
    e(), Ut.splice(Ut.indexOf(t), 1);
  }
  Ut.push(t),
    ++ze,
    _t(function () {
      --ze === 0 && nr();
    }, []);
}
function ii(e) {
  Ge.some(function (t) {
    return t._value === e._value;
  }) || Ge.push(e);
}
function oi(e) {
  for (var t = Ge.length; t; )
    if (Ge[--t]._value === e._value) {
      Ge.splice(t, 1);
      return;
    }
}
function Vt(e) {
  return new O(wt, !1, e);
}
function Z(e, t) {
  var n = P;
  return function () {
    var r = It(),
      a = P;
    try {
      return Le(n, !0), e.apply(this, arguments);
    } catch (i) {
      t && t(i);
    } finally {
      Le(a, !1), r && kt();
    }
  };
}
var ae = { awaits: 0, echoes: 0, id: 0 },
  si = 0,
  Wt = [],
  cn = 0,
  zt = 0,
  ui = 0;
function je(e, t, n, r) {
  var a = P,
    i = Object.create(a);
  (i.parent = a), (i.ref = 0), (i.global = !1), (i.id = ++ui);
  var o = rt.env;
  (i.env = er
    ? {
        Promise: O,
        PromiseProp: { value: O, configurable: !0, writable: !0 },
        all: O.all,
        race: O.race,
        allSettled: O.allSettled,
        any: O.any,
        resolve: O.resolve,
        reject: O.reject,
        nthen: pr(o.nthen, i),
        gthen: pr(o.gthen, i),
      }
    : {}),
    t && ue(i, t),
    ++a.ref,
    (i.finalize = function () {
      --this.parent.ref || this.parent.finalize();
    });
  var s = ut(i, e, n, r);
  return i.ref === 0 && i.finalize(), s;
}
function st() {
  return ae.id || (ae.id = ++si), ++ae.awaits, (ae.echoes += Vr), ae.id;
}
function De() {
  return ae.awaits ? (--ae.awaits === 0 && (ae.id = 0), (ae.echoes = ae.awaits * Vr), !0) : !1;
}
('' + Wr).indexOf('[native code]') === -1 && (st = De = G);
function Xt(e) {
  return ae.echoes && e && e.constructor === jt
    ? (st(),
      e.then(
        function (t) {
          return De(), t;
        },
        function (t) {
          return De(), ne(t);
        }
      ))
    : e;
}
function ci(e) {
  ++zt, (!ae.echoes || --ae.echoes === 0) && (ae.echoes = ae.id = 0), Wt.push(P), Le(e, !0);
}
function li() {
  var e = Wt[Wt.length - 1];
  Wt.pop(), Le(e, !1);
}
function Le(e, t) {
  var n = P;
  if (
    ((t ? ae.echoes && (!cn++ || e !== P) : cn && (!--cn || e !== P)) &&
      Xr(t ? ci.bind(null, e) : li),
    e !== P && ((P = e), n === rt && (rt.env = zr()), er))
  ) {
    var r = rt.env.Promise,
      a = e.env;
    (qt.then = a.nthen),
      (r.prototype.then = a.gthen),
      (n.global || e.global) &&
        (Object.defineProperty(Q, 'Promise', a.PromiseProp),
        (r.all = a.all),
        (r.race = a.race),
        (r.resolve = a.resolve),
        (r.reject = a.reject),
        a.allSettled && (r.allSettled = a.allSettled),
        a.any && (r.any = a.any));
  }
}
function zr() {
  var e = Q.Promise;
  return er
    ? {
        Promise: e,
        PromiseProp: Object.getOwnPropertyDescriptor(Q, 'Promise'),
        all: e.all,
        race: e.race,
        allSettled: e.allSettled,
        any: e.any,
        resolve: e.resolve,
        reject: e.reject,
        nthen: qt.then,
        gthen: e.prototype.then,
      }
    : {};
}
function ut(e, t, n, r, a) {
  var i = P;
  try {
    return Le(e, !0), t(n, r, a);
  } finally {
    Le(i, !1);
  }
}
function Xr(e) {
  Wr.call(Tn, e);
}
function Qt(e, t, n, r) {
  return typeof e != 'function'
    ? e
    : function () {
        var a = P;
        n && st(), Le(t, !0);
        try {
          return e.apply(this, arguments);
        } finally {
          Le(a, !1), r && Xr(De);
        }
      };
}
function pr(e, t) {
  return function (n, r) {
    return e.call(this, Qt(n, t), Qt(r, t));
  };
}
var yr = 'unhandledrejection';
function mr(e, t) {
  var n;
  try {
    n = t.onuncatched(e);
  } catch {}
  if (n !== !1)
    try {
      var r,
        a = { promise: t, reason: e };
      if (
        (Q.document && document.createEvent
          ? ((r = document.createEvent('Event')), r.initEvent(yr, !0, !0), ue(r, a))
          : Q.CustomEvent && ((r = new CustomEvent(yr, { detail: a })), ue(r, a)),
        r &&
          Q.dispatchEvent &&
          (dispatchEvent(r), !Q.PromiseRejectionEvent && Q.onunhandledrejection))
      )
        try {
          Q.onunhandledrejection(r);
        } catch {}
      Ee && r && !r.defaultPrevented && console.warn('Unhandled rejection: ' + (e.stack || e));
    } catch {}
}
var ne = O.reject;
function Kn(e, t, n, r) {
  if (!e.idbdb || (!e._state.openComplete && !P.letThrough && !e._vip)) {
    if (e._state.openComplete) return ne(new N.DatabaseClosed(e._state.dbOpenError));
    if (!e._state.isBeingOpened) {
      if (!e._options.autoOpen) return ne(new N.DatabaseClosed());
      e.open().catch(G);
    }
    return e._state.dbReadyPromise.then(function () {
      return Kn(e, t, n, r);
    });
  } else {
    var a = e._createTransaction(t, n, e._dbSchema);
    try {
      a.create(), (e._state.PR1398_maxLoop = 3);
    } catch (i) {
      return i.name === Qn.InvalidState && e.isOpen() && --e._state.PR1398_maxLoop > 0
        ? (console.warn('Dexie: Need to reopen db'),
          e._close(),
          e.open().then(function () {
            return Kn(e, t, n, r);
          }))
        : ne(i);
    }
    return a
      ._promise(t, function (i, o) {
        return je(function () {
          return (P.trans = a), r(i, o, a);
        });
      })
      .then(function (i) {
        return a._completion.then(function () {
          return i;
        });
      });
  }
}
var gr = '3.2.3',
  qe = String.fromCharCode(65535),
  Pn = -1 / 0,
  Ae =
    'Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.',
  Qr = 'String expected.',
  yt = [],
  rn = typeof navigator < 'u' && /(MSIE|Trident|Edge)/.test(navigator.userAgent),
  fi = rn,
  di = rn,
  Jr = function (e) {
    return !/(dexie\.js|dexie\.min\.js)/.test(e);
  },
  an = '__dbnames',
  ln = 'readonly',
  fn = 'readwrite';
function Qe(e, t) {
  return e
    ? t
      ? function () {
          return e.apply(this, arguments) && t.apply(this, arguments);
        }
      : e
    : t;
}
var Zr = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
function Pt(e) {
  return typeof e == 'string' && !/\./.test(e)
    ? function (t) {
        return t[e] === void 0 && e in t && ((t = Tt(t)), delete t[e]), t;
      }
    : function (t) {
        return t;
      };
}
var hi = (function () {
  function e() {}
  return (
    (e.prototype._trans = function (t, n, r) {
      var a = this._tx || P.trans,
        i = this.name;
      function o(u, c, d) {
        if (!d.schema[i]) throw new N.NotFound('Table ' + i + ' not part of transaction');
        return n(d.idbtrans, d);
      }
      var s = It();
      try {
        return a && a.db === this.db
          ? a === P.trans
            ? a._promise(t, o, r)
            : je(
                function () {
                  return a._promise(t, o, r);
                },
                { trans: a, transless: P.transless || P }
              )
          : Kn(this.db, t, [this.name], o);
      } finally {
        s && kt();
      }
    }),
    (e.prototype.get = function (t, n) {
      var r = this;
      return t && t.constructor === Object
        ? this.where(t).first(n)
        : this._trans('readonly', function (a) {
            return r.core.get({ trans: a, key: t }).then(function (i) {
              return r.hook.reading.fire(i);
            });
          }).then(n);
    }),
    (e.prototype.where = function (t) {
      if (typeof t == 'string') return new this.db.WhereClause(this, t);
      if (ie(t)) return new this.db.WhereClause(this, '[' + t.join('+') + ']');
      var n = te(t);
      if (n.length === 1) return this.where(n[0]).equals(t[n[0]]);
      var r = this.schema.indexes.concat(this.schema.primKey).filter(function (d) {
        return (
          d.compound &&
          n.every(function (l) {
            return d.keyPath.indexOf(l) >= 0;
          }) &&
          d.keyPath.every(function (l) {
            return n.indexOf(l) >= 0;
          })
        );
      })[0];
      if (r && this.db._maxKey !== qe)
        return this.where(r.name).equals(
          r.keyPath.map(function (d) {
            return t[d];
          })
        );
      !r &&
        Ee &&
        console.warn(
          'The query ' +
            JSON.stringify(t) +
            ' on ' +
            this.name +
            ' would benefit of a ' +
            ('compound index [' + n.join('+') + ']')
        );
      var a = this.schema.idxByName,
        i = this.db._deps.indexedDB;
      function o(d, l) {
        try {
          return i.cmp(d, l) === 0;
        } catch {
          return !1;
        }
      }
      var s = n.reduce(
          function (d, l) {
            var h = d[0],
              _ = d[1],
              y = a[l],
              v = t[l];
            return [
              h || y,
              h || !y
                ? Qe(
                    _,
                    y && y.multi
                      ? function (g) {
                          var E = Oe(g, l);
                          return (
                            ie(E) &&
                            E.some(function (A) {
                              return o(v, A);
                            })
                          );
                        }
                      : function (g) {
                          return o(v, Oe(g, l));
                        }
                  )
                : _,
            ];
          },
          [null, null]
        ),
        u = s[0],
        c = s[1];
      return u
        ? this.where(u.name).equals(t[u.keyPath]).filter(c)
        : r
        ? this.filter(c)
        : this.where(n).equals('');
    }),
    (e.prototype.filter = function (t) {
      return this.toCollection().and(t);
    }),
    (e.prototype.count = function (t) {
      return this.toCollection().count(t);
    }),
    (e.prototype.offset = function (t) {
      return this.toCollection().offset(t);
    }),
    (e.prototype.limit = function (t) {
      return this.toCollection().limit(t);
    }),
    (e.prototype.each = function (t) {
      return this.toCollection().each(t);
    }),
    (e.prototype.toArray = function (t) {
      return this.toCollection().toArray(t);
    }),
    (e.prototype.toCollection = function () {
      return new this.db.Collection(new this.db.WhereClause(this));
    }),
    (e.prototype.orderBy = function (t) {
      return new this.db.Collection(
        new this.db.WhereClause(this, ie(t) ? '[' + t.join('+') + ']' : t)
      );
    }),
    (e.prototype.reverse = function () {
      return this.toCollection().reverse();
    }),
    (e.prototype.mapToClass = function (t) {
      this.schema.mappedClass = t;
      var n = function (r) {
        if (!r) return r;
        var a = Object.create(t.prototype);
        for (var i in r)
          if (ve(r, i))
            try {
              a[i] = r[i];
            } catch {}
        return a;
      };
      return (
        this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook),
        (this.schema.readHook = n),
        this.hook('reading', n),
        t
      );
    }),
    (e.prototype.defineClass = function () {
      function t(n) {
        ue(this, n);
      }
      return this.mapToClass(t);
    }),
    (e.prototype.add = function (t, n) {
      var r = this,
        a = this.schema.primKey,
        i = a.auto,
        o = a.keyPath,
        s = t;
      return (
        o && i && (s = Pt(o)(t)),
        this._trans('readwrite', function (u) {
          return r.core.mutate({
            trans: u,
            type: 'add',
            keys: n != null ? [n] : null,
            values: [s],
          });
        })
          .then(function (u) {
            return u.numFailures ? O.reject(u.failures[0]) : u.lastResult;
          })
          .then(function (u) {
            if (o)
              try {
                ge(t, o, u);
              } catch {}
            return u;
          })
      );
    }),
    (e.prototype.update = function (t, n) {
      if (typeof t == 'object' && !ie(t)) {
        var r = Oe(t, this.schema.primKey.keyPath);
        if (r === void 0)
          return ne(new N.InvalidArgument('Given object does not contain its primary key'));
        try {
          typeof n != 'function'
            ? te(n).forEach(function (a) {
                ge(t, a, n[a]);
              })
            : n(t, { value: t, primKey: r });
        } catch {}
        return this.where(':id').equals(r).modify(n);
      } else return this.where(':id').equals(t).modify(n);
    }),
    (e.prototype.put = function (t, n) {
      var r = this,
        a = this.schema.primKey,
        i = a.auto,
        o = a.keyPath,
        s = t;
      return (
        o && i && (s = Pt(o)(t)),
        this._trans('readwrite', function (u) {
          return r.core.mutate({
            trans: u,
            type: 'put',
            values: [s],
            keys: n != null ? [n] : null,
          });
        })
          .then(function (u) {
            return u.numFailures ? O.reject(u.failures[0]) : u.lastResult;
          })
          .then(function (u) {
            if (o)
              try {
                ge(t, o, u);
              } catch {}
            return u;
          })
      );
    }),
    (e.prototype.delete = function (t) {
      var n = this;
      return this._trans('readwrite', function (r) {
        return n.core.mutate({ trans: r, type: 'delete', keys: [t] });
      }).then(function (r) {
        return r.numFailures ? O.reject(r.failures[0]) : void 0;
      });
    }),
    (e.prototype.clear = function () {
      var t = this;
      return this._trans('readwrite', function (n) {
        return t.core.mutate({ trans: n, type: 'deleteRange', range: Zr });
      }).then(function (n) {
        return n.numFailures ? O.reject(n.failures[0]) : void 0;
      });
    }),
    (e.prototype.bulkGet = function (t) {
      var n = this;
      return this._trans('readonly', function (r) {
        return n.core.getMany({ keys: t, trans: r }).then(function (a) {
          return a.map(function (i) {
            return n.hook.reading.fire(i);
          });
        });
      });
    }),
    (e.prototype.bulkAdd = function (t, n, r) {
      var a = this,
        i = Array.isArray(n) ? n : void 0;
      r = r || (i ? void 0 : n);
      var o = r ? r.allKeys : void 0;
      return this._trans('readwrite', function (s) {
        var u = a.schema.primKey,
          c = u.auto,
          d = u.keyPath;
        if (d && i)
          throw new N.InvalidArgument(
            'bulkAdd(): keys argument invalid on tables with inbound keys'
          );
        if (i && i.length !== t.length)
          throw new N.InvalidArgument('Arguments objects and keys must have the same length');
        var l = t.length,
          h = d && c ? t.map(Pt(d)) : t;
        return a.core
          .mutate({ trans: s, type: 'add', keys: i, values: h, wantResults: o })
          .then(function (_) {
            var y = _.numFailures,
              v = _.results,
              g = _.lastResult,
              E = _.failures,
              A = o ? v : g;
            if (y === 0) return A;
            throw new pt(a.name + '.bulkAdd(): ' + y + ' of ' + l + ' operations failed', E);
          });
      });
    }),
    (e.prototype.bulkPut = function (t, n, r) {
      var a = this,
        i = Array.isArray(n) ? n : void 0;
      r = r || (i ? void 0 : n);
      var o = r ? r.allKeys : void 0;
      return this._trans('readwrite', function (s) {
        var u = a.schema.primKey,
          c = u.auto,
          d = u.keyPath;
        if (d && i)
          throw new N.InvalidArgument(
            'bulkPut(): keys argument invalid on tables with inbound keys'
          );
        if (i && i.length !== t.length)
          throw new N.InvalidArgument('Arguments objects and keys must have the same length');
        var l = t.length,
          h = d && c ? t.map(Pt(d)) : t;
        return a.core
          .mutate({ trans: s, type: 'put', keys: i, values: h, wantResults: o })
          .then(function (_) {
            var y = _.numFailures,
              v = _.results,
              g = _.lastResult,
              E = _.failures,
              A = o ? v : g;
            if (y === 0) return A;
            throw new pt(a.name + '.bulkPut(): ' + y + ' of ' + l + ' operations failed', E);
          });
      });
    }),
    (e.prototype.bulkDelete = function (t) {
      var n = this,
        r = t.length;
      return this._trans('readwrite', function (a) {
        return n.core.mutate({ trans: a, type: 'delete', keys: t });
      }).then(function (a) {
        var i = a.numFailures,
          o = a.lastResult,
          s = a.failures;
        if (i === 0) return o;
        throw new pt(n.name + '.bulkDelete(): ' + i + ' of ' + r + ' operations failed', s);
      });
    }),
    e
  );
})();
function Ct(e) {
  var t = {},
    n = function (s, u) {
      if (u) {
        for (var c = arguments.length, d = new Array(c - 1); --c; ) d[c - 1] = arguments[c];
        return t[s].subscribe.apply(null, d), e;
      } else if (typeof s == 'string') return t[s];
    };
  n.addEventType = i;
  for (var r = 1, a = arguments.length; r < a; ++r) i(arguments[r]);
  return n;
  function i(s, u, c) {
    if (typeof s == 'object') return o(s);
    u || (u = Za), c || (c = G);
    var d = {
      subscribers: [],
      fire: c,
      subscribe: function (l) {
        d.subscribers.indexOf(l) === -1 && (d.subscribers.push(l), (d.fire = u(d.fire, l)));
      },
      unsubscribe: function (l) {
        (d.subscribers = d.subscribers.filter(function (h) {
          return h !== l;
        })),
          (d.fire = d.subscribers.reduce(u, c));
      },
    };
    return (t[s] = n[s] = d), d;
  }
  function o(s) {
    te(s).forEach(function (u) {
      var c = s[u];
      if (ie(c)) i(u, s[u][0], s[u][1]);
      else if (c === 'asap')
        var d = i(u, xt, function () {
          for (var h = arguments.length, _ = new Array(h); h--; ) _[h] = arguments[h];
          d.subscribers.forEach(function (y) {
            Kr(function () {
              y.apply(null, _);
            });
          });
        });
      else throw new N.InvalidArgument('Invalid event config');
    });
  }
}
function Ot(e, t) {
  return it(t).from({ prototype: e }), t;
}
function vi(e) {
  return Ot(hi.prototype, function (n, r, a) {
    (this.db = e),
      (this._tx = a),
      (this.name = n),
      (this.schema = r),
      (this.hook = e._allTables[n]
        ? e._allTables[n].hook
        : Ct(null, { creating: [Xa, G], reading: [za, xt], updating: [Ja, G], deleting: [Qa, G] }));
  });
}
function et(e, t) {
  return !(e.filter || e.algorithm || e.or) && (t ? e.justLimit : !e.replayFilter);
}
function dn(e, t) {
  e.filter = Qe(e.filter, t);
}
function hn(e, t, n) {
  var r = e.replayFilter;
  (e.replayFilter = r
    ? function () {
        return Qe(r(), t());
      }
    : t),
    (e.justLimit = n && !r);
}
function pi(e, t) {
  e.isMatch = Qe(e.isMatch, t);
}
function Ht(e, t) {
  if (e.isPrimKey) return t.primaryKey;
  var n = t.getIndexByKeyPath(e.index);
  if (!n)
    throw new N.Schema('KeyPath ' + e.index + ' on object store ' + t.name + ' is not indexed');
  return n;
}
function wr(e, t, n) {
  var r = Ht(e, t.schema);
  return t.openCursor({
    trans: n,
    values: !e.keysOnly,
    reverse: e.dir === 'prev',
    unique: !!e.unique,
    query: { index: r, range: e.range },
  });
}
function Mt(e, t, n, r) {
  var a = e.replayFilter ? Qe(e.filter, e.replayFilter()) : e.filter;
  if (e.or) {
    var i = {},
      o = function (s, u, c) {
        if (
          !a ||
          a(
            u,
            c,
            function (h) {
              return u.stop(h);
            },
            function (h) {
              return u.fail(h);
            }
          )
        ) {
          var d = u.primaryKey,
            l = '' + d;
          l === '[object ArrayBuffer]' && (l = '' + new Uint8Array(d)),
            ve(i, l) || ((i[l] = !0), t(s, u, c));
        }
      };
    return Promise.all([
      e.or._iterate(o, n),
      _r(wr(e, r, n), e.algorithm, o, !e.keysOnly && e.valueMapper),
    ]);
  } else return _r(wr(e, r, n), Qe(e.algorithm, a), t, !e.keysOnly && e.valueMapper);
}
function _r(e, t, n, r) {
  var a = r
      ? function (o, s, u) {
          return n(r(o), s, u);
        }
      : n,
    i = Z(a);
  return e.then(function (o) {
    if (o)
      return o.start(function () {
        var s = function () {
          return o.continue();
        };
        (!t ||
          t(
            o,
            function (u) {
              return (s = u);
            },
            function (u) {
              o.stop(u), (s = G);
            },
            function (u) {
              o.fail(u), (s = G);
            }
          )) &&
          i(o.value, o, function (u) {
            return (s = u);
          }),
          s();
      });
  });
}
function se(e, t) {
  try {
    var n = br(e),
      r = br(t);
    if (n !== r)
      return n === 'Array'
        ? 1
        : r === 'Array'
        ? -1
        : n === 'binary'
        ? 1
        : r === 'binary'
        ? -1
        : n === 'string'
        ? 1
        : r === 'string'
        ? -1
        : n === 'Date'
        ? 1
        : r !== 'Date'
        ? NaN
        : -1;
    switch (n) {
      case 'number':
      case 'Date':
      case 'string':
        return e > t ? 1 : e < t ? -1 : 0;
      case 'binary':
        return mi(Er(e), Er(t));
      case 'Array':
        return yi(e, t);
    }
  } catch {}
  return NaN;
}
function yi(e, t) {
  for (var n = e.length, r = t.length, a = n < r ? n : r, i = 0; i < a; ++i) {
    var o = se(e[i], t[i]);
    if (o !== 0) return o;
  }
  return n === r ? 0 : n < r ? -1 : 1;
}
function mi(e, t) {
  for (var n = e.length, r = t.length, a = n < r ? n : r, i = 0; i < a; ++i)
    if (e[i] !== t[i]) return e[i] < t[i] ? -1 : 1;
  return n === r ? 0 : n < r ? -1 : 1;
}
function br(e) {
  var t = typeof e;
  if (t !== 'object') return t;
  if (ArrayBuffer.isView(e)) return 'binary';
  var n = En(e);
  return n === 'ArrayBuffer' ? 'binary' : n;
}
function Er(e) {
  return e instanceof Uint8Array
    ? e
    : ArrayBuffer.isView(e)
    ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
    : new Uint8Array(e);
}
var gi = (function () {
    function e() {}
    return (
      (e.prototype._read = function (t, n) {
        var r = this._ctx;
        return r.error
          ? r.table._trans(null, ne.bind(null, r.error))
          : r.table._trans('readonly', t).then(n);
      }),
      (e.prototype._write = function (t) {
        var n = this._ctx;
        return n.error
          ? n.table._trans(null, ne.bind(null, n.error))
          : n.table._trans('readwrite', t, 'locked');
      }),
      (e.prototype._addAlgorithm = function (t) {
        var n = this._ctx;
        n.algorithm = Qe(n.algorithm, t);
      }),
      (e.prototype._iterate = function (t, n) {
        return Mt(this._ctx, t, n, this._ctx.table.core);
      }),
      (e.prototype.clone = function (t) {
        var n = Object.create(this.constructor.prototype),
          r = Object.create(this._ctx);
        return t && ue(r, t), (n._ctx = r), n;
      }),
      (e.prototype.raw = function () {
        return (this._ctx.valueMapper = null), this;
      }),
      (e.prototype.each = function (t) {
        var n = this._ctx;
        return this._read(function (r) {
          return Mt(n, t, r, n.table.core);
        });
      }),
      (e.prototype.count = function (t) {
        var n = this;
        return this._read(function (r) {
          var a = n._ctx,
            i = a.table.core;
          if (et(a, !0))
            return i
              .count({ trans: r, query: { index: Ht(a, i.schema), range: a.range } })
              .then(function (s) {
                return Math.min(s, a.limit);
              });
          var o = 0;
          return Mt(
            a,
            function () {
              return ++o, !1;
            },
            r,
            i
          ).then(function () {
            return o;
          });
        }).then(t);
      }),
      (e.prototype.sortBy = function (t, n) {
        var r = t.split('.').reverse(),
          a = r[0],
          i = r.length - 1;
        function o(c, d) {
          return d ? o(c[r[d]], d - 1) : c[a];
        }
        var s = this._ctx.dir === 'next' ? 1 : -1;
        function u(c, d) {
          var l = o(c, i),
            h = o(d, i);
          return l < h ? -s : l > h ? s : 0;
        }
        return this.toArray(function (c) {
          return c.sort(u);
        }).then(n);
      }),
      (e.prototype.toArray = function (t) {
        var n = this;
        return this._read(function (r) {
          var a = n._ctx;
          if (a.dir === 'next' && et(a, !0) && a.limit > 0) {
            var i = a.valueMapper,
              o = Ht(a, a.table.core.schema);
            return a.table.core
              .query({ trans: r, limit: a.limit, values: !0, query: { index: o, range: a.range } })
              .then(function (u) {
                var c = u.result;
                return i ? c.map(i) : c;
              });
          } else {
            var s = [];
            return Mt(
              a,
              function (u) {
                return s.push(u);
              },
              r,
              a.table.core
            ).then(function () {
              return s;
            });
          }
        }, t);
      }),
      (e.prototype.offset = function (t) {
        var n = this._ctx;
        return t <= 0
          ? this
          : ((n.offset += t),
            et(n)
              ? hn(n, function () {
                  var r = t;
                  return function (a, i) {
                    return r === 0
                      ? !0
                      : r === 1
                      ? (--r, !1)
                      : (i(function () {
                          a.advance(r), (r = 0);
                        }),
                        !1);
                  };
                })
              : hn(n, function () {
                  var r = t;
                  return function () {
                    return --r < 0;
                  };
                }),
            this);
      }),
      (e.prototype.limit = function (t) {
        return (
          (this._ctx.limit = Math.min(this._ctx.limit, t)),
          hn(
            this._ctx,
            function () {
              var n = t;
              return function (r, a, i) {
                return --n <= 0 && a(i), n >= 0;
              };
            },
            !0
          ),
          this
        );
      }),
      (e.prototype.until = function (t, n) {
        return (
          dn(this._ctx, function (r, a, i) {
            return t(r.value) ? (a(i), n) : !0;
          }),
          this
        );
      }),
      (e.prototype.first = function (t) {
        return this.limit(1)
          .toArray(function (n) {
            return n[0];
          })
          .then(t);
      }),
      (e.prototype.last = function (t) {
        return this.reverse().first(t);
      }),
      (e.prototype.filter = function (t) {
        return (
          dn(this._ctx, function (n) {
            return t(n.value);
          }),
          pi(this._ctx, t),
          this
        );
      }),
      (e.prototype.and = function (t) {
        return this.filter(t);
      }),
      (e.prototype.or = function (t) {
        return new this.db.WhereClause(this._ctx.table, t, this);
      }),
      (e.prototype.reverse = function () {
        return (
          (this._ctx.dir = this._ctx.dir === 'prev' ? 'next' : 'prev'),
          this._ondirectionchange && this._ondirectionchange(this._ctx.dir),
          this
        );
      }),
      (e.prototype.desc = function () {
        return this.reverse();
      }),
      (e.prototype.eachKey = function (t) {
        var n = this._ctx;
        return (
          (n.keysOnly = !n.isMatch),
          this.each(function (r, a) {
            t(a.key, a);
          })
        );
      }),
      (e.prototype.eachUniqueKey = function (t) {
        return (this._ctx.unique = 'unique'), this.eachKey(t);
      }),
      (e.prototype.eachPrimaryKey = function (t) {
        var n = this._ctx;
        return (
          (n.keysOnly = !n.isMatch),
          this.each(function (r, a) {
            t(a.primaryKey, a);
          })
        );
      }),
      (e.prototype.keys = function (t) {
        var n = this._ctx;
        n.keysOnly = !n.isMatch;
        var r = [];
        return this.each(function (a, i) {
          r.push(i.key);
        })
          .then(function () {
            return r;
          })
          .then(t);
      }),
      (e.prototype.primaryKeys = function (t) {
        var n = this._ctx;
        if (n.dir === 'next' && et(n, !0) && n.limit > 0)
          return this._read(function (a) {
            var i = Ht(n, n.table.core.schema);
            return n.table.core.query({
              trans: a,
              values: !1,
              limit: n.limit,
              query: { index: i, range: n.range },
            });
          })
            .then(function (a) {
              var i = a.result;
              return i;
            })
            .then(t);
        n.keysOnly = !n.isMatch;
        var r = [];
        return this.each(function (a, i) {
          r.push(i.primaryKey);
        })
          .then(function () {
            return r;
          })
          .then(t);
      }),
      (e.prototype.uniqueKeys = function (t) {
        return (this._ctx.unique = 'unique'), this.keys(t);
      }),
      (e.prototype.firstKey = function (t) {
        return this.limit(1)
          .keys(function (n) {
            return n[0];
          })
          .then(t);
      }),
      (e.prototype.lastKey = function (t) {
        return this.reverse().firstKey(t);
      }),
      (e.prototype.distinct = function () {
        var t = this._ctx,
          n = t.index && t.table.schema.idxByName[t.index];
        if (!n || !n.multi) return this;
        var r = {};
        return (
          dn(this._ctx, function (a) {
            var i = a.primaryKey.toString(),
              o = ve(r, i);
            return (r[i] = !0), !o;
          }),
          this
        );
      }),
      (e.prototype.modify = function (t) {
        var n = this,
          r = this._ctx;
        return this._write(function (a) {
          var i;
          if (typeof t == 'function') i = t;
          else {
            var o = te(t),
              s = o.length;
            i = function (E) {
              for (var A = !1, w = 0; w < s; ++w) {
                var b = o[w],
                  m = t[b];
                Oe(E, b) !== m && (ge(E, b, m), (A = !0));
              }
              return A;
            };
          }
          var u = r.table.core,
            c = u.schema.primaryKey,
            d = c.outbound,
            l = c.extractKey,
            h = n.db._options.modifyChunkSize || 200,
            _ = [],
            y = 0,
            v = [],
            g = function (E, A) {
              var w = A.failures,
                b = A.numFailures;
              y += E - b;
              for (var m = 0, S = te(w); m < S.length; m++) {
                var D = S[m];
                _.push(w[D]);
              }
            };
          return n
            .clone()
            .primaryKeys()
            .then(function (E) {
              var A = function (w) {
                var b = Math.min(h, E.length - w);
                return u
                  .getMany({ trans: a, keys: E.slice(w, w + b), cache: 'immutable' })
                  .then(function (m) {
                    for (var S = [], D = [], T = d ? [] : null, x = [], k = 0; k < b; ++k) {
                      var M = m[k],
                        L = { value: Tt(M), primKey: E[w + k] };
                      i.call(L, L.value, L) !== !1 &&
                        (L.value == null
                          ? x.push(E[w + k])
                          : !d && se(l(M), l(L.value)) !== 0
                          ? (x.push(E[w + k]), S.push(L.value))
                          : (D.push(L.value), d && T.push(E[w + k])));
                    }
                    var j = et(r) &&
                      r.limit === 1 / 0 &&
                      (typeof t != 'function' || t === vn) && { index: r.index, range: r.range };
                    return Promise.resolve(
                      S.length > 0 &&
                        u.mutate({ trans: a, type: 'add', values: S }).then(function (J) {
                          for (var K in J.failures) x.splice(parseInt(K), 1);
                          g(S.length, J);
                        })
                    )
                      .then(function () {
                        return (
                          (D.length > 0 || (j && typeof t == 'object')) &&
                          u
                            .mutate({
                              trans: a,
                              type: 'put',
                              keys: T,
                              values: D,
                              criteria: j,
                              changeSpec: typeof t != 'function' && t,
                            })
                            .then(function (J) {
                              return g(D.length, J);
                            })
                        );
                      })
                      .then(function () {
                        return (
                          (x.length > 0 || (j && t === vn)) &&
                          u
                            .mutate({ trans: a, type: 'delete', keys: x, criteria: j })
                            .then(function (J) {
                              return g(x.length, J);
                            })
                        );
                      })
                      .then(function () {
                        return E.length > w + b && A(w + h);
                      });
                  });
              };
              return A(0).then(function () {
                if (_.length > 0) throw new Yt('Error modifying one or more objects', _, y, v);
                return E.length;
              });
            });
        });
      }),
      (e.prototype.delete = function () {
        var t = this._ctx,
          n = t.range;
        return et(t) && ((t.isPrimKey && !di) || n.type === 3)
          ? this._write(function (r) {
              var a = t.table.core.schema.primaryKey,
                i = n;
              return t.table.core
                .count({ trans: r, query: { index: a, range: i } })
                .then(function (o) {
                  return t.table.core
                    .mutate({ trans: r, type: 'deleteRange', range: i })
                    .then(function (s) {
                      var u = s.failures;
                      s.lastResult, s.results;
                      var c = s.numFailures;
                      if (c)
                        throw new Yt(
                          'Could not delete some values',
                          Object.keys(u).map(function (d) {
                            return u[d];
                          }),
                          o - c
                        );
                      return o - c;
                    });
                });
            })
          : this.modify(vn);
      }),
      e
    );
  })(),
  vn = function (e, t) {
    return (t.value = null);
  };
function wi(e) {
  return Ot(gi.prototype, function (n, r) {
    this.db = e;
    var a = Zr,
      i = null;
    if (r)
      try {
        a = r();
      } catch (c) {
        i = c;
      }
    var o = n._ctx,
      s = o.table,
      u = s.hook.reading.fire;
    this._ctx = {
      table: s,
      index: o.index,
      isPrimKey: !o.index || (s.schema.primKey.keyPath && o.index === s.schema.primKey.name),
      range: a,
      keysOnly: !1,
      dir: 'next',
      unique: '',
      algorithm: null,
      filter: null,
      replayFilter: null,
      justLimit: !0,
      isMatch: null,
      offset: 0,
      limit: 1 / 0,
      error: i,
      or: o.or,
      valueMapper: u !== xt ? u : null,
    };
  });
}
function _i(e, t) {
  return e < t ? -1 : e === t ? 0 : 1;
}
function bi(e, t) {
  return e > t ? -1 : e === t ? 0 : 1;
}
function he(e, t, n) {
  var r = e instanceof ta ? new e.Collection(e) : e;
  return (r._ctx.error = n ? new n(t) : new TypeError(t)), r;
}
function tt(e) {
  return new e.Collection(e, function () {
    return ea('');
  }).limit(0);
}
function Ei(e) {
  return e === 'next'
    ? function (t) {
        return t.toUpperCase();
      }
    : function (t) {
        return t.toLowerCase();
      };
}
function Ai(e) {
  return e === 'next'
    ? function (t) {
        return t.toLowerCase();
      }
    : function (t) {
        return t.toUpperCase();
      };
}
function Si(e, t, n, r, a, i) {
  for (var o = Math.min(e.length, r.length), s = -1, u = 0; u < o; ++u) {
    var c = t[u];
    if (c !== r[u])
      return a(e[u], n[u]) < 0
        ? e.substr(0, u) + n[u] + n.substr(u + 1)
        : a(e[u], r[u]) < 0
        ? e.substr(0, u) + r[u] + n.substr(u + 1)
        : s >= 0
        ? e.substr(0, s) + t[s] + n.substr(s + 1)
        : null;
    a(e[u], c) < 0 && (s = u);
  }
  return o < r.length && i === 'next'
    ? e + n.substr(e.length)
    : o < e.length && i === 'prev'
    ? e.substr(0, n.length)
    : s < 0
    ? null
    : e.substr(0, s) + r[s] + n.substr(s + 1);
}
function Bt(e, t, n, r) {
  var a,
    i,
    o,
    s,
    u,
    c,
    d,
    l = n.length;
  if (
    !n.every(function (v) {
      return typeof v == 'string';
    })
  )
    return he(e, Qr);
  function h(v) {
    (a = Ei(v)), (i = Ai(v)), (o = v === 'next' ? _i : bi);
    var g = n
      .map(function (E) {
        return { lower: i(E), upper: a(E) };
      })
      .sort(function (E, A) {
        return o(E.lower, A.lower);
      });
    (s = g.map(function (E) {
      return E.upper;
    })),
      (u = g.map(function (E) {
        return E.lower;
      })),
      (c = v),
      (d = v === 'next' ? '' : r);
  }
  h('next');
  var _ = new e.Collection(e, function () {
    return Ke(s[0], u[l - 1] + r);
  });
  _._ondirectionchange = function (v) {
    h(v);
  };
  var y = 0;
  return (
    _._addAlgorithm(function (v, g, E) {
      var A = v.key;
      if (typeof A != 'string') return !1;
      var w = i(A);
      if (t(w, u, y)) return !0;
      for (var b = null, m = y; m < l; ++m) {
        var S = Si(A, w, s[m], u[m], o, c);
        S === null && b === null ? (y = m + 1) : (b === null || o(b, S) > 0) && (b = S);
      }
      return (
        g(
          b !== null
            ? function () {
                v.continue(b + d);
              }
            : E
        ),
        !1
      );
    }),
    _
  );
}
function Ke(e, t, n, r) {
  return { type: 2, lower: e, upper: t, lowerOpen: n, upperOpen: r };
}
function ea(e) {
  return { type: 1, lower: e, upper: e };
}
var ta = (function () {
  function e() {}
  return (
    Object.defineProperty(e.prototype, 'Collection', {
      get: function () {
        return this._ctx.table.db.Collection;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (e.prototype.between = function (t, n, r, a) {
      (r = r !== !1), (a = a === !0);
      try {
        return this._cmp(t, n) > 0 || (this._cmp(t, n) === 0 && (r || a) && !(r && a))
          ? tt(this)
          : new this.Collection(this, function () {
              return Ke(t, n, !r, !a);
            });
      } catch {
        return he(this, Ae);
      }
    }),
    (e.prototype.equals = function (t) {
      return t == null
        ? he(this, Ae)
        : new this.Collection(this, function () {
            return ea(t);
          });
    }),
    (e.prototype.above = function (t) {
      return t == null
        ? he(this, Ae)
        : new this.Collection(this, function () {
            return Ke(t, void 0, !0);
          });
    }),
    (e.prototype.aboveOrEqual = function (t) {
      return t == null
        ? he(this, Ae)
        : new this.Collection(this, function () {
            return Ke(t, void 0, !1);
          });
    }),
    (e.prototype.below = function (t) {
      return t == null
        ? he(this, Ae)
        : new this.Collection(this, function () {
            return Ke(void 0, t, !1, !0);
          });
    }),
    (e.prototype.belowOrEqual = function (t) {
      return t == null
        ? he(this, Ae)
        : new this.Collection(this, function () {
            return Ke(void 0, t);
          });
    }),
    (e.prototype.startsWith = function (t) {
      return typeof t != 'string' ? he(this, Qr) : this.between(t, t + qe, !0, !0);
    }),
    (e.prototype.startsWithIgnoreCase = function (t) {
      return t === ''
        ? this.startsWith(t)
        : Bt(
            this,
            function (n, r) {
              return n.indexOf(r[0]) === 0;
            },
            [t],
            qe
          );
    }),
    (e.prototype.equalsIgnoreCase = function (t) {
      return Bt(
        this,
        function (n, r) {
          return n === r[0];
        },
        [t],
        ''
      );
    }),
    (e.prototype.anyOfIgnoreCase = function () {
      var t = ke.apply(nt, arguments);
      return t.length === 0
        ? tt(this)
        : Bt(
            this,
            function (n, r) {
              return r.indexOf(n) !== -1;
            },
            t,
            ''
          );
    }),
    (e.prototype.startsWithAnyOfIgnoreCase = function () {
      var t = ke.apply(nt, arguments);
      return t.length === 0
        ? tt(this)
        : Bt(
            this,
            function (n, r) {
              return r.some(function (a) {
                return n.indexOf(a) === 0;
              });
            },
            t,
            qe
          );
    }),
    (e.prototype.anyOf = function () {
      var t = this,
        n = ke.apply(nt, arguments),
        r = this._cmp;
      try {
        n.sort(r);
      } catch {
        return he(this, Ae);
      }
      if (n.length === 0) return tt(this);
      var a = new this.Collection(this, function () {
        return Ke(n[0], n[n.length - 1]);
      });
      a._ondirectionchange = function (o) {
        (r = o === 'next' ? t._ascending : t._descending), n.sort(r);
      };
      var i = 0;
      return (
        a._addAlgorithm(function (o, s, u) {
          for (var c = o.key; r(c, n[i]) > 0; ) if ((++i, i === n.length)) return s(u), !1;
          return r(c, n[i]) === 0
            ? !0
            : (s(function () {
                o.continue(n[i]);
              }),
              !1);
        }),
        a
      );
    }),
    (e.prototype.notEqual = function (t) {
      return this.inAnyRange(
        [
          [Pn, t],
          [t, this.db._maxKey],
        ],
        { includeLowers: !1, includeUppers: !1 }
      );
    }),
    (e.prototype.noneOf = function () {
      var t = ke.apply(nt, arguments);
      if (t.length === 0) return new this.Collection(this);
      try {
        t.sort(this._ascending);
      } catch {
        return he(this, Ae);
      }
      var n = t.reduce(function (r, a) {
        return r ? r.concat([[r[r.length - 1][1], a]]) : [[Pn, a]];
      }, null);
      return (
        n.push([t[t.length - 1], this.db._maxKey]),
        this.inAnyRange(n, { includeLowers: !1, includeUppers: !1 })
      );
    }),
    (e.prototype.inAnyRange = function (t, n) {
      var r = this,
        a = this._cmp,
        i = this._ascending,
        o = this._descending,
        s = this._min,
        u = this._max;
      if (t.length === 0) return tt(this);
      if (
        !t.every(function (m) {
          return m[0] !== void 0 && m[1] !== void 0 && i(m[0], m[1]) <= 0;
        })
      )
        return he(
          this,
          'First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower',
          N.InvalidArgument
        );
      var c = !n || n.includeLowers !== !1,
        d = n && n.includeUppers === !0;
      function l(m, S) {
        for (var D = 0, T = m.length; D < T; ++D) {
          var x = m[D];
          if (a(S[0], x[1]) < 0 && a(S[1], x[0]) > 0) {
            (x[0] = s(x[0], S[0])), (x[1] = u(x[1], S[1]));
            break;
          }
        }
        return D === T && m.push(S), m;
      }
      var h = i;
      function _(m, S) {
        return h(m[0], S[0]);
      }
      var y;
      try {
        (y = t.reduce(l, [])), y.sort(_);
      } catch {
        return he(this, Ae);
      }
      var v = 0,
        g = d
          ? function (m) {
              return i(m, y[v][1]) > 0;
            }
          : function (m) {
              return i(m, y[v][1]) >= 0;
            },
        E = c
          ? function (m) {
              return o(m, y[v][0]) > 0;
            }
          : function (m) {
              return o(m, y[v][0]) >= 0;
            };
      function A(m) {
        return !g(m) && !E(m);
      }
      var w = g,
        b = new this.Collection(this, function () {
          return Ke(y[0][0], y[y.length - 1][1], !c, !d);
        });
      return (
        (b._ondirectionchange = function (m) {
          m === 'next' ? ((w = g), (h = i)) : ((w = E), (h = o)), y.sort(_);
        }),
        b._addAlgorithm(function (m, S, D) {
          for (var T = m.key; w(T); ) if ((++v, v === y.length)) return S(D), !1;
          return A(T)
            ? !0
            : (r._cmp(T, y[v][1]) === 0 ||
                r._cmp(T, y[v][0]) === 0 ||
                S(function () {
                  h === i ? m.continue(y[v][0]) : m.continue(y[v][1]);
                }),
              !1);
        }),
        b
      );
    }),
    (e.prototype.startsWithAnyOf = function () {
      var t = ke.apply(nt, arguments);
      return t.every(function (n) {
        return typeof n == 'string';
      })
        ? t.length === 0
          ? tt(this)
          : this.inAnyRange(
              t.map(function (n) {
                return [n, n + qe];
              })
            )
        : he(this, 'startsWithAnyOf() only works with strings');
    }),
    e
  );
})();
function Ti(e) {
  return Ot(ta.prototype, function (n, r, a) {
    (this.db = e), (this._ctx = { table: n, index: r === ':id' ? null : r, or: a });
    var i = e._deps.indexedDB;
    if (!i) throw new N.MissingAPI();
    (this._cmp = this._ascending = i.cmp.bind(i)),
      (this._descending = function (o, s) {
        return i.cmp(s, o);
      }),
      (this._max = function (o, s) {
        return i.cmp(o, s) > 0 ? o : s;
      }),
      (this._min = function (o, s) {
        return i.cmp(o, s) < 0 ? o : s;
      }),
      (this._IDBKeyRange = e._deps.IDBKeyRange);
  });
}
function be(e) {
  return Z(function (t) {
    return bt(t), e(t.target.error), !1;
  });
}
function bt(e) {
  e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault();
}
var Et = 'storagemutated',
  Fe = 'x-storagemutated-1',
  Ue = Ct(null, Et),
  xi = (function () {
    function e() {}
    return (
      (e.prototype._lock = function () {
        return (
          ht(!P.global),
          ++this._reculock,
          this._reculock === 1 && !P.global && (P.lockOwnerFor = this),
          this
        );
      }),
      (e.prototype._unlock = function () {
        if ((ht(!P.global), --this._reculock === 0))
          for (
            P.global || (P.lockOwnerFor = null);
            this._blockedFuncs.length > 0 && !this._locked();

          ) {
            var t = this._blockedFuncs.shift();
            try {
              ut(t[1], t[0]);
            } catch {}
          }
        return this;
      }),
      (e.prototype._locked = function () {
        return this._reculock && P.lockOwnerFor !== this;
      }),
      (e.prototype.create = function (t) {
        var n = this;
        if (!this.mode) return this;
        var r = this.db.idbdb,
          a = this.db._state.dbOpenError;
        if ((ht(!this.idbtrans), !t && !r))
          switch (a && a.name) {
            case 'DatabaseClosedError':
              throw new N.DatabaseClosed(a);
            case 'MissingAPIError':
              throw new N.MissingAPI(a.message, a);
            default:
              throw new N.OpenFailed(a);
          }
        if (!this.active) throw new N.TransactionInactive();
        return (
          ht(this._completion._state === null),
          (t = this.idbtrans =
            t ||
            (this.db.core
              ? this.db.core.transaction(this.storeNames, this.mode, {
                  durability: this.chromeTransactionDurability,
                })
              : r.transaction(this.storeNames, this.mode, {
                  durability: this.chromeTransactionDurability,
                }))),
          (t.onerror = Z(function (i) {
            bt(i), n._reject(t.error);
          })),
          (t.onabort = Z(function (i) {
            bt(i),
              n.active && n._reject(new N.Abort(t.error)),
              (n.active = !1),
              n.on('abort').fire(i);
          })),
          (t.oncomplete = Z(function () {
            (n.active = !1),
              n._resolve(),
              'mutatedParts' in t && Ue.storagemutated.fire(t.mutatedParts);
          })),
          this
        );
      }),
      (e.prototype._promise = function (t, n, r) {
        var a = this;
        if (t === 'readwrite' && this.mode !== 'readwrite')
          return ne(new N.ReadOnly('Transaction is readonly'));
        if (!this.active) return ne(new N.TransactionInactive());
        if (this._locked())
          return new O(function (o, s) {
            a._blockedFuncs.push([
              function () {
                a._promise(t, n, r).then(o, s);
              },
              P,
            ]);
          });
        if (r)
          return je(function () {
            var o = new O(function (s, u) {
              a._lock();
              var c = n(s, u, a);
              c && c.then && c.then(s, u);
            });
            return (
              o.finally(function () {
                return a._unlock();
              }),
              (o._lib = !0),
              o
            );
          });
        var i = new O(function (o, s) {
          var u = n(o, s, a);
          u && u.then && u.then(o, s);
        });
        return (i._lib = !0), i;
      }),
      (e.prototype._root = function () {
        return this.parent ? this.parent._root() : this;
      }),
      (e.prototype.waitFor = function (t) {
        var n = this._root(),
          r = O.resolve(t);
        if (n._waitingFor)
          n._waitingFor = n._waitingFor.then(function () {
            return r;
          });
        else {
          (n._waitingFor = r), (n._waitingQueue = []);
          var a = n.idbtrans.objectStore(n.storeNames[0]);
          (function o() {
            for (++n._spinCount; n._waitingQueue.length; ) n._waitingQueue.shift()();
            n._waitingFor && (a.get(-1 / 0).onsuccess = o);
          })();
        }
        var i = n._waitingFor;
        return new O(function (o, s) {
          r.then(
            function (u) {
              return n._waitingQueue.push(Z(o.bind(null, u)));
            },
            function (u) {
              return n._waitingQueue.push(Z(s.bind(null, u)));
            }
          ).finally(function () {
            n._waitingFor === i && (n._waitingFor = null);
          });
        });
      }),
      (e.prototype.abort = function () {
        this.active &&
          ((this.active = !1), this.idbtrans && this.idbtrans.abort(), this._reject(new N.Abort()));
      }),
      (e.prototype.table = function (t) {
        var n = this._memoizedTables || (this._memoizedTables = {});
        if (ve(n, t)) return n[t];
        var r = this.schema[t];
        if (!r) throw new N.NotFound('Table ' + t + ' not part of transaction');
        var a = new this.db.Table(t, r, this);
        return (a.core = this.db.core.table(t)), (n[t] = a), a;
      }),
      e
    );
  })();
function Ii(e) {
  return Ot(xi.prototype, function (n, r, a, i, o) {
    var s = this;
    (this.db = e),
      (this.mode = n),
      (this.storeNames = r),
      (this.schema = a),
      (this.chromeTransactionDurability = i),
      (this.idbtrans = null),
      (this.on = Ct(this, 'complete', 'error', 'abort')),
      (this.parent = o || null),
      (this.active = !0),
      (this._reculock = 0),
      (this._blockedFuncs = []),
      (this._resolve = null),
      (this._reject = null),
      (this._waitingFor = null),
      (this._waitingQueue = null),
      (this._spinCount = 0),
      (this._completion = new O(function (u, c) {
        (s._resolve = u), (s._reject = c);
      })),
      this._completion.then(
        function () {
          (s.active = !1), s.on.complete.fire();
        },
        function (u) {
          var c = s.active;
          return (
            (s.active = !1),
            s.on.error.fire(u),
            s.parent ? s.parent._reject(u) : c && s.idbtrans && s.idbtrans.abort(),
            ne(u)
          );
        }
      );
  });
}
function Mn(e, t, n, r, a, i, o) {
  return {
    name: e,
    keyPath: t,
    unique: n,
    multi: r,
    auto: a,
    compound: i,
    src: (n && !o ? '&' : '') + (r ? '*' : '') + (a ? '++' : '') + na(t),
  };
}
function na(e) {
  return typeof e == 'string' ? e : e ? '[' + [].join.call(e, '+') + ']' : '';
}
function ra(e, t, n) {
  return {
    name: e,
    primKey: t,
    indexes: n,
    mappedClass: null,
    idxByName: Pr(n, function (r) {
      return [r.name, r];
    }),
  };
}
function ki(e) {
  return e.length === 1 ? e[0] : e;
}
var At = function (e) {
  try {
    return (
      e.only([[]]),
      (At = function () {
        return [[]];
      }),
      [[]]
    );
  } catch {
    return (
      (At = function () {
        return qe;
      }),
      qe
    );
  }
};
function Bn(e) {
  return e == null
    ? function () {}
    : typeof e == 'string'
    ? Ci(e)
    : function (t) {
        return Oe(t, e);
      };
}
function Ci(e) {
  var t = e.split('.');
  return t.length === 1
    ? function (n) {
        return n[e];
      }
    : function (n) {
        return Oe(n, e);
      };
}
function Ar(e) {
  return [].slice.call(e);
}
var Oi = 0;
function mt(e) {
  return e == null ? ':id' : typeof e == 'string' ? e : '[' + e.join('+') + ']';
}
function Ri(e, t, n) {
  function r(l, h) {
    var _ = Ar(l.objectStoreNames);
    return {
      schema: {
        name: l.name,
        tables: _.map(function (y) {
          return h.objectStore(y);
        }).map(function (y) {
          var v = y.keyPath,
            g = y.autoIncrement,
            E = ie(v),
            A = v == null,
            w = {},
            b = {
              name: y.name,
              primaryKey: {
                name: null,
                isPrimaryKey: !0,
                outbound: A,
                compound: E,
                keyPath: v,
                autoIncrement: g,
                unique: !0,
                extractKey: Bn(v),
              },
              indexes: Ar(y.indexNames)
                .map(function (m) {
                  return y.index(m);
                })
                .map(function (m) {
                  var S = m.name,
                    D = m.unique,
                    T = m.multiEntry,
                    x = m.keyPath,
                    k = ie(x),
                    M = {
                      name: S,
                      compound: k,
                      keyPath: x,
                      unique: D,
                      multiEntry: T,
                      extractKey: Bn(x),
                    };
                  return (w[mt(x)] = M), M;
                }),
              getIndexByKeyPath: function (m) {
                return w[mt(m)];
              },
            };
          return (w[':id'] = b.primaryKey), v != null && (w[mt(v)] = b.primaryKey), b;
        }),
      },
      hasGetAll:
        _.length > 0 &&
        'getAll' in h.objectStore(_[0]) &&
        !(
          typeof navigator < 'u' &&
          /Safari/.test(navigator.userAgent) &&
          !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
          [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604
        ),
    };
  }
  function a(l) {
    if (l.type === 3) return null;
    if (l.type === 4) throw new Error('Cannot convert never type to IDBKeyRange');
    var h = l.lower,
      _ = l.upper,
      y = l.lowerOpen,
      v = l.upperOpen,
      g =
        h === void 0
          ? _ === void 0
            ? null
            : t.upperBound(_, !!v)
          : _ === void 0
          ? t.lowerBound(h, !!y)
          : t.bound(h, _, !!y, !!v);
    return g;
  }
  function i(l) {
    var h = l.name;
    function _(g) {
      var E = g.trans,
        A = g.type,
        w = g.keys,
        b = g.values,
        m = g.range;
      return new Promise(function (S, D) {
        S = Z(S);
        var T = E.objectStore(h),
          x = T.keyPath == null,
          k = A === 'put' || A === 'add';
        if (!k && A !== 'delete' && A !== 'deleteRange')
          throw new Error('Invalid operation type: ' + A);
        var M = (w || b || { length: 1 }).length;
        if (w && b && w.length !== b.length)
          throw new Error('Given keys array must have same length as given values array.');
        if (M === 0) return S({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
        var L,
          j = [],
          J = [],
          K = 0,
          Y = function (pe) {
            ++K, bt(pe);
          };
        if (A === 'deleteRange') {
          if (m.type === 4)
            return S({ numFailures: K, failures: J, results: [], lastResult: void 0 });
          m.type === 3 ? j.push((L = T.clear())) : j.push((L = T.delete(a(m))));
        } else {
          var oe = k ? (x ? [b, w] : [b, null]) : [w, null],
            de = oe[0],
            re = oe[1];
          if (k)
            for (var ce = 0; ce < M; ++ce)
              j.push((L = re && re[ce] !== void 0 ? T[A](de[ce], re[ce]) : T[A](de[ce]))),
                (L.onerror = Y);
          else for (var ce = 0; ce < M; ++ce) j.push((L = T[A](de[ce]))), (L.onerror = Y);
        }
        var ye = function (pe) {
          var Ve = pe.target.result;
          j.forEach(function (le, Ze) {
            return le.error != null && (J[Ze] = le.error);
          }),
            S({
              numFailures: K,
              failures: J,
              results:
                A === 'delete'
                  ? w
                  : j.map(function (le) {
                      return le.result;
                    }),
              lastResult: Ve,
            });
        };
        (L.onerror = function (pe) {
          Y(pe), ye(pe);
        }),
          (L.onsuccess = ye);
      });
    }
    function y(g) {
      var E = g.trans,
        A = g.values,
        w = g.query,
        b = g.reverse,
        m = g.unique;
      return new Promise(function (S, D) {
        S = Z(S);
        var T = w.index,
          x = w.range,
          k = E.objectStore(h),
          M = T.isPrimaryKey ? k : k.index(T.name),
          L = b ? (m ? 'prevunique' : 'prev') : m ? 'nextunique' : 'next',
          j = A || !('openKeyCursor' in M) ? M.openCursor(a(x), L) : M.openKeyCursor(a(x), L);
        (j.onerror = be(D)),
          (j.onsuccess = Z(function (J) {
            var K = j.result;
            if (!K) {
              S(null);
              return;
            }
            (K.___id = ++Oi), (K.done = !1);
            var Y = K.continue.bind(K),
              oe = K.continuePrimaryKey;
            oe && (oe = oe.bind(K));
            var de = K.advance.bind(K),
              re = function () {
                throw new Error('Cursor not started');
              },
              ce = function () {
                throw new Error('Cursor not stopped');
              };
            (K.trans = E),
              (K.stop = K.continue = K.continuePrimaryKey = K.advance = re),
              (K.fail = Z(D)),
              (K.next = function () {
                var ye = this,
                  pe = 1;
                return this.start(function () {
                  return pe-- ? ye.continue() : ye.stop();
                }).then(function () {
                  return ye;
                });
              }),
              (K.start = function (ye) {
                var pe = new Promise(function (le, Ze) {
                    (le = Z(le)),
                      (j.onerror = be(Ze)),
                      (K.fail = Ze),
                      (K.stop = function (on) {
                        (K.stop = K.continue = K.continuePrimaryKey = K.advance = ce), le(on);
                      });
                  }),
                  Ve = function () {
                    if (j.result)
                      try {
                        ye();
                      } catch (le) {
                        K.fail(le);
                      }
                    else
                      (K.done = !0),
                        (K.start = function () {
                          throw new Error('Cursor behind last entry');
                        }),
                        K.stop();
                  };
                return (
                  (j.onsuccess = Z(function (le) {
                    (j.onsuccess = Ve), Ve();
                  })),
                  (K.continue = Y),
                  (K.continuePrimaryKey = oe),
                  (K.advance = de),
                  Ve(),
                  pe
                );
              }),
              S(K);
          }, D));
      });
    }
    function v(g) {
      return function (E) {
        return new Promise(function (A, w) {
          A = Z(A);
          var b = E.trans,
            m = E.values,
            S = E.limit,
            D = E.query,
            T = S === 1 / 0 ? void 0 : S,
            x = D.index,
            k = D.range,
            M = b.objectStore(h),
            L = x.isPrimaryKey ? M : M.index(x.name),
            j = a(k);
          if (S === 0) return A({ result: [] });
          if (g) {
            var J = m ? L.getAll(j, T) : L.getAllKeys(j, T);
            (J.onsuccess = function (de) {
              return A({ result: de.target.result });
            }),
              (J.onerror = be(w));
          } else {
            var K = 0,
              Y = m || !('openKeyCursor' in L) ? L.openCursor(j) : L.openKeyCursor(j),
              oe = [];
            (Y.onsuccess = function (de) {
              var re = Y.result;
              if (!re) return A({ result: oe });
              if ((oe.push(m ? re.value : re.primaryKey), ++K === S)) return A({ result: oe });
              re.continue();
            }),
              (Y.onerror = be(w));
          }
        });
      };
    }
    return {
      name: h,
      schema: l,
      mutate: _,
      getMany: function (g) {
        var E = g.trans,
          A = g.keys;
        return new Promise(function (w, b) {
          w = Z(w);
          for (
            var m = E.objectStore(h),
              S = A.length,
              D = new Array(S),
              T = 0,
              x = 0,
              k,
              M = function (K) {
                var Y = K.target;
                (D[Y._pos] = Y.result) != null, ++x === T && w(D);
              },
              L = be(b),
              j = 0;
            j < S;
            ++j
          ) {
            var J = A[j];
            J != null && ((k = m.get(A[j])), (k._pos = j), (k.onsuccess = M), (k.onerror = L), ++T);
          }
          T === 0 && w(D);
        });
      },
      get: function (g) {
        var E = g.trans,
          A = g.key;
        return new Promise(function (w, b) {
          w = Z(w);
          var m = E.objectStore(h),
            S = m.get(A);
          (S.onsuccess = function (D) {
            return w(D.target.result);
          }),
            (S.onerror = be(b));
        });
      },
      query: v(u),
      openCursor: y,
      count: function (g) {
        var E = g.query,
          A = g.trans,
          w = E.index,
          b = E.range;
        return new Promise(function (m, S) {
          var D = A.objectStore(h),
            T = w.isPrimaryKey ? D : D.index(w.name),
            x = a(b),
            k = x ? T.count(x) : T.count();
          (k.onsuccess = Z(function (M) {
            return m(M.target.result);
          })),
            (k.onerror = be(S));
        });
      },
    };
  }
  var o = r(e, n),
    s = o.schema,
    u = o.hasGetAll,
    c = s.tables.map(function (l) {
      return i(l);
    }),
    d = {};
  return (
    c.forEach(function (l) {
      return (d[l.name] = l);
    }),
    {
      stack: 'dbcore',
      transaction: e.transaction.bind(e),
      table: function (l) {
        var h = d[l];
        if (!h) throw new Error("Table '" + l + "' not found");
        return d[l];
      },
      MIN_KEY: -1 / 0,
      MAX_KEY: At(t),
      schema: s,
    }
  );
}
function Di(e, t) {
  return t.reduce(function (n, r) {
    var a = r.create;
    return H(H({}, n), a(n));
  }, e);
}
function Ki(e, t, n, r) {
  var a = n.IDBKeyRange;
  n.indexedDB;
  var i = Di(Ri(t, a, r), e.dbcore);
  return { dbcore: i };
}
function rr(e, t) {
  var n = e._novip,
    r = t.db,
    a = Ki(n._middlewares, r, n._deps, t);
  (n.core = a.dbcore),
    n.tables.forEach(function (i) {
      var o = i.name;
      n.core.schema.tables.some(function (s) {
        return s.name === o;
      }) && ((i.core = n.core.table(o)), n[o] instanceof n.Table && (n[o].core = i.core));
    });
}
function Jt(e, t, n, r) {
  var a = e._novip;
  n.forEach(function (i) {
    var o = r[i];
    t.forEach(function (s) {
      var u = Gn(s, i);
      (!u || ('value' in u && u.value === void 0)) &&
        (s === a.Transaction.prototype || s instanceof a.Transaction
          ? Re(s, i, {
              get: function () {
                return this.table(i);
              },
              set: function (c) {
                Rr(this, i, { value: c, writable: !0, configurable: !0, enumerable: !0 });
              },
            })
          : (s[i] = new a.Table(i, o)));
    });
  });
}
function Nn(e, t) {
  var n = e._novip;
  t.forEach(function (r) {
    for (var a in r) r[a] instanceof n.Table && delete r[a];
  });
}
function Pi(e, t) {
  return e._cfg.version - t._cfg.version;
}
function Mi(e, t, n, r) {
  var a = e._dbSchema,
    i = e._createTransaction('readwrite', e._storeNames, a);
  i.create(n), i._completion.catch(r);
  var o = i._reject.bind(i),
    s = P.transless || P;
  je(function () {
    (P.trans = i),
      (P.transless = s),
      t === 0
        ? (te(a).forEach(function (u) {
            ar(n, u, a[u].primKey, a[u].indexes);
          }),
          rr(e, n),
          O.follow(function () {
            return e.on.populate.fire(i);
          }).catch(o))
        : Bi(e, t, i, n).catch(o);
  });
}
function Bi(e, t, n, r) {
  var a = e._novip,
    i = [],
    o = a._versions,
    s = (a._dbSchema = ir(a, a.idbdb, r)),
    u = !1,
    c = o.filter(function (l) {
      return l._cfg.version >= t;
    });
  c.forEach(function (l) {
    i.push(function () {
      var h = s,
        _ = l._cfg.dbschema;
      jn(a, h, r), jn(a, _, r), (s = a._dbSchema = _);
      var y = aa(h, _);
      y.add.forEach(function (b) {
        ar(r, b[0], b[1].primKey, b[1].indexes);
      }),
        y.change.forEach(function (b) {
          if (b.recreate) throw new N.Upgrade('Not yet support for changing primary key');
          var m = r.objectStore(b.name);
          b.add.forEach(function (S) {
            return Fn(m, S);
          }),
            b.change.forEach(function (S) {
              m.deleteIndex(S.name), Fn(m, S);
            }),
            b.del.forEach(function (S) {
              return m.deleteIndex(S);
            });
        });
      var v = l._cfg.contentUpgrade;
      if (v && l._cfg.version > t) {
        rr(a, r), (n._memoizedTables = {}), (u = !0);
        var g = Mr(_);
        y.del.forEach(function (b) {
          g[b] = h[b];
        }),
          Nn(a, [a.Transaction.prototype]),
          Jt(a, [a.Transaction.prototype], te(g), g),
          (n.schema = g);
        var E = zn(v);
        E && st();
        var A,
          w = O.follow(function () {
            if (((A = v(n)), A && E)) {
              var b = De.bind(null, null);
              A.then(b, b);
            }
          });
        return A && typeof A.then == 'function'
          ? O.resolve(A)
          : w.then(function () {
              return A;
            });
      }
    }),
      i.push(function (h) {
        if (!u || !fi) {
          var _ = l._cfg.dbschema;
          Fi(_, h);
        }
        Nn(a, [a.Transaction.prototype]),
          Jt(a, [a.Transaction.prototype], a._storeNames, a._dbSchema),
          (n.schema = a._dbSchema);
      });
  });
  function d() {
    return i.length ? O.resolve(i.shift()(n.idbtrans)).then(d) : O.resolve();
  }
  return d().then(function () {
    Ni(s, r);
  });
}
function aa(e, t) {
  var n = { del: [], add: [], change: [] },
    r;
  for (r in e) t[r] || n.del.push(r);
  for (r in t) {
    var a = e[r],
      i = t[r];
    if (!a) n.add.push([r, i]);
    else {
      var o = { name: r, def: i, recreate: !1, del: [], add: [], change: [] };
      if (
        '' + (a.primKey.keyPath || '') != '' + (i.primKey.keyPath || '') ||
        (a.primKey.auto !== i.primKey.auto && !rn)
      )
        (o.recreate = !0), n.change.push(o);
      else {
        var s = a.idxByName,
          u = i.idxByName,
          c = void 0;
        for (c in s) u[c] || o.del.push(c);
        for (c in u) {
          var d = s[c],
            l = u[c];
          d ? d.src !== l.src && o.change.push(l) : o.add.push(l);
        }
        (o.del.length > 0 || o.add.length > 0 || o.change.length > 0) && n.change.push(o);
      }
    }
  }
  return n;
}
function ar(e, t, n, r) {
  var a = e.db.createObjectStore(
    t,
    n.keyPath ? { keyPath: n.keyPath, autoIncrement: n.auto } : { autoIncrement: n.auto }
  );
  return (
    r.forEach(function (i) {
      return Fn(a, i);
    }),
    a
  );
}
function Ni(e, t) {
  te(e).forEach(function (n) {
    t.db.objectStoreNames.contains(n) || ar(t, n, e[n].primKey, e[n].indexes);
  });
}
function Fi(e, t) {
  [].slice.call(t.db.objectStoreNames).forEach(function (n) {
    return e[n] == null && t.db.deleteObjectStore(n);
  });
}
function Fn(e, t) {
  e.createIndex(t.name, t.keyPath, { unique: t.unique, multiEntry: t.multi });
}
function ir(e, t, n) {
  var r = {},
    a = tn(t.objectStoreNames, 0);
  return (
    a.forEach(function (i) {
      for (
        var o = n.objectStore(i),
          s = o.keyPath,
          u = Mn(na(s), s || '', !1, !1, !!o.autoIncrement, s && typeof s != 'string', !0),
          c = [],
          d = 0;
        d < o.indexNames.length;
        ++d
      ) {
        var l = o.index(o.indexNames[d]);
        s = l.keyPath;
        var h = Mn(l.name, s, !!l.unique, !!l.multiEntry, !1, s && typeof s != 'string', !1);
        c.push(h);
      }
      r[i] = ra(i, u, c);
    }),
    r
  );
}
function ji(e, t, n) {
  var r = e._novip;
  r.verno = t.version / 10;
  var a = (r._dbSchema = ir(r, t, n));
  (r._storeNames = tn(t.objectStoreNames, 0)), Jt(r, [r._allTables], te(a), a);
}
function Li(e, t) {
  var n = ir(e, e.idbdb, t),
    r = aa(n, e._dbSchema);
  return !(
    r.add.length ||
    r.change.some(function (a) {
      return a.add.length || a.change.length;
    })
  );
}
function jn(e, t, n) {
  for (var r = e._novip, a = n.db.objectStoreNames, i = 0; i < a.length; ++i) {
    var o = a[i],
      s = n.objectStore(o);
    r._hasGetAll = 'getAll' in s;
    for (var u = 0; u < s.indexNames.length; ++u) {
      var c = s.indexNames[u],
        d = s.index(c).keyPath,
        l = typeof d == 'string' ? d : '[' + tn(d).join('+') + ']';
      if (t[o]) {
        var h = t[o].idxByName[l];
        h && ((h.name = c), delete t[o].idxByName[l], (t[o].idxByName[c] = h));
      }
    }
  }
  typeof navigator < 'u' &&
    /Safari/.test(navigator.userAgent) &&
    !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
    Q.WorkerGlobalScope &&
    Q instanceof Q.WorkerGlobalScope &&
    [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 &&
    (r._hasGetAll = !1);
}
function Ui(e) {
  return e.split(',').map(function (t, n) {
    t = t.trim();
    var r = t.replace(/([&*]|\+\+)/g, ''),
      a = /^\[/.test(r) ? r.match(/^\[(.*)\]$/)[1].split('+') : r;
    return Mn(r, a || null, /\&/.test(t), /\*/.test(t), /\+\+/.test(t), ie(a), n === 0);
  });
}
var Vi = (function () {
  function e() {}
  return (
    (e.prototype._parseStoresSpec = function (t, n) {
      te(t).forEach(function (r) {
        if (t[r] !== null) {
          var a = Ui(t[r]),
            i = a.shift();
          if (i.multi) throw new N.Schema('Primary key cannot be multi-valued');
          a.forEach(function (o) {
            if (o.auto) throw new N.Schema('Only primary key can be marked as autoIncrement (++)');
            if (!o.keyPath)
              throw new N.Schema('Index must have a name and cannot be an empty string');
          }),
            (n[r] = ra(r, i, a));
        }
      });
    }),
    (e.prototype.stores = function (t) {
      var n = this.db;
      this._cfg.storesSource = this._cfg.storesSource ? ue(this._cfg.storesSource, t) : t;
      var r = n._versions,
        a = {},
        i = {};
      return (
        r.forEach(function (o) {
          ue(a, o._cfg.storesSource), (i = o._cfg.dbschema = {}), o._parseStoresSpec(a, i);
        }),
        (n._dbSchema = i),
        Nn(n, [n._allTables, n, n.Transaction.prototype]),
        Jt(n, [n._allTables, n, n.Transaction.prototype, this._cfg.tables], te(i), i),
        (n._storeNames = te(i)),
        this
      );
    }),
    (e.prototype.upgrade = function (t) {
      return (this._cfg.contentUpgrade = Jn(this._cfg.contentUpgrade || G, t)), this;
    }),
    e
  );
})();
function Wi(e) {
  return Ot(Vi.prototype, function (n) {
    (this.db = e),
      (this._cfg = {
        version: n,
        storesSource: null,
        dbschema: {},
        tables: {},
        contentUpgrade: null,
      });
  });
}
function or(e, t) {
  var n = e._dbNamesDB;
  return (
    n ||
      ((n = e._dbNamesDB = new V(an, { addons: [], indexedDB: e, IDBKeyRange: t })),
      n.version(1).stores({ dbnames: 'name' })),
    n.table('dbnames')
  );
}
function sr(e) {
  return e && typeof e.databases == 'function';
}
function Hi(e) {
  var t = e.indexedDB,
    n = e.IDBKeyRange;
  return sr(t)
    ? Promise.resolve(t.databases()).then(function (r) {
        return r
          .map(function (a) {
            return a.name;
          })
          .filter(function (a) {
            return a !== an;
          });
      })
    : or(t, n).toCollection().primaryKeys();
}
function $i(e, t) {
  var n = e.indexedDB,
    r = e.IDBKeyRange;
  !sr(n) && t !== an && or(n, r).put({ name: t }).catch(G);
}
function Yi(e, t) {
  var n = e.indexedDB,
    r = e.IDBKeyRange;
  !sr(n) && t !== an && or(n, r).delete(t).catch(G);
}
function Ln(e) {
  return je(function () {
    return (P.letThrough = !0), e();
  });
}
function qi() {
  var e =
    !navigator.userAgentData &&
    /Safari\//.test(navigator.userAgent) &&
    !/Chrom(e|ium)\//.test(navigator.userAgent);
  if (!e || !indexedDB.databases) return Promise.resolve();
  var t;
  return new Promise(function (n) {
    var r = function () {
      return indexedDB.databases().finally(n);
    };
    (t = setInterval(r, 100)), r();
  }).finally(function () {
    return clearInterval(t);
  });
}
function Gi(e) {
  var t = e._state,
    n = e._deps.indexedDB;
  if (t.isBeingOpened || e.idbdb)
    return t.dbReadyPromise.then(function () {
      return t.dbOpenError ? ne(t.dbOpenError) : e;
    });
  Ee && (t.openCanceller._stackHolder = Je()),
    (t.isBeingOpened = !0),
    (t.dbOpenError = null),
    (t.openComplete = !1);
  var r = t.openCanceller;
  function a() {
    if (t.openCanceller !== r) throw new N.DatabaseClosed('db.open() was cancelled');
  }
  var i = t.dbReadyResolve,
    o = null,
    s = !1;
  return O.race([
    r,
    (typeof navigator > 'u' ? O.resolve() : qi()).then(function () {
      return new O(function (u, c) {
        if ((a(), !n)) throw new N.MissingAPI();
        var d = e.name,
          l = t.autoSchema ? n.open(d) : n.open(d, Math.round(e.verno * 10));
        if (!l) throw new N.MissingAPI();
        (l.onerror = be(c)),
          (l.onblocked = Z(e._fireOnBlocked)),
          (l.onupgradeneeded = Z(function (h) {
            if (((o = l.transaction), t.autoSchema && !e._options.allowEmptyDB)) {
              (l.onerror = bt), o.abort(), l.result.close();
              var _ = n.deleteDatabase(d);
              _.onsuccess = _.onerror = Z(function () {
                c(new N.NoSuchDatabase('Database ' + d + ' doesnt exist'));
              });
            } else {
              o.onerror = be(c);
              var y = h.oldVersion > Math.pow(2, 62) ? 0 : h.oldVersion;
              (s = y < 1), (e._novip.idbdb = l.result), Mi(e, y / 10, o, c);
            }
          }, c)),
          (l.onsuccess = Z(function () {
            o = null;
            var h = (e._novip.idbdb = l.result),
              _ = tn(h.objectStoreNames);
            if (_.length > 0)
              try {
                var y = h.transaction(ki(_), 'readonly');
                t.autoSchema
                  ? ji(e, h, y)
                  : (jn(e, e._dbSchema, y),
                    Li(e, y) ||
                      console.warn(
                        'Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.'
                      )),
                  rr(e, y);
              } catch {}
            yt.push(e),
              (h.onversionchange = Z(function (v) {
                (t.vcFired = !0), e.on('versionchange').fire(v);
              })),
              (h.onclose = Z(function (v) {
                e.on('close').fire(v);
              })),
              s && $i(e._deps, d),
              u();
          }, c));
      });
    }),
  ])
    .then(function () {
      return (
        a(),
        (t.onReadyBeingFired = []),
        O.resolve(
          Ln(function () {
            return e.on.ready.fire(e.vip);
          })
        ).then(function u() {
          if (t.onReadyBeingFired.length > 0) {
            var c = t.onReadyBeingFired.reduce(Jn, G);
            return (
              (t.onReadyBeingFired = []),
              O.resolve(
                Ln(function () {
                  return c(e.vip);
                })
              ).then(u)
            );
          }
        })
      );
    })
    .finally(function () {
      (t.onReadyBeingFired = null), (t.isBeingOpened = !1);
    })
    .then(function () {
      return e;
    })
    .catch(function (u) {
      t.dbOpenError = u;
      try {
        o && o.abort();
      } catch {}
      return r === t.openCanceller && e._close(), ne(u);
    })
    .finally(function () {
      (t.openComplete = !0), i();
    });
}
function Un(e) {
  var t = function (o) {
      return e.next(o);
    },
    n = function (o) {
      return e.throw(o);
    },
    r = i(t),
    a = i(n);
  function i(o) {
    return function (s) {
      var u = o(s),
        c = u.value;
      return u.done
        ? c
        : !c || typeof c.then != 'function'
        ? ie(c)
          ? Promise.all(c).then(r, a)
          : r(c)
        : c.then(r, a);
    };
  }
  return i(t)();
}
function zi(e, t, n) {
  var r = arguments.length;
  if (r < 2) throw new N.InvalidArgument('Too few arguments');
  for (var a = new Array(r - 1); --r; ) a[r - 1] = arguments[r];
  n = a.pop();
  var i = Br(a);
  return [e, i, n];
}
function ia(e, t, n, r, a) {
  return O.resolve().then(function () {
    var i = P.transless || P,
      o = e._createTransaction(t, n, e._dbSchema, r),
      s = { trans: o, transless: i };
    if (r) o.idbtrans = r.idbtrans;
    else
      try {
        o.create(), (e._state.PR1398_maxLoop = 3);
      } catch (l) {
        return l.name === Qn.InvalidState && e.isOpen() && --e._state.PR1398_maxLoop > 0
          ? (console.warn('Dexie: Need to reopen db'),
            e._close(),
            e.open().then(function () {
              return ia(e, t, n, null, a);
            }))
          : ne(l);
      }
    var u = zn(a);
    u && st();
    var c,
      d = O.follow(function () {
        if (((c = a.call(o, o)), c))
          if (u) {
            var l = De.bind(null, null);
            c.then(l, l);
          } else typeof c.next == 'function' && typeof c.throw == 'function' && (c = Un(c));
      }, s);
    return (
      c && typeof c.then == 'function'
        ? O.resolve(c).then(function (l) {
            return o.active
              ? l
              : ne(
                  new N.PrematureCommit(
                    'Transaction committed too early. See http://bit.ly/2kdckMn'
                  )
                );
          })
        : d.then(function () {
            return c;
          })
    )
      .then(function (l) {
        return (
          r && o._resolve(),
          o._completion.then(function () {
            return l;
          })
        );
      })
      .catch(function (l) {
        return o._reject(l), ne(l);
      });
  });
}
function Nt(e, t, n) {
  for (var r = ie(e) ? e.slice() : [e], a = 0; a < n; ++a) r.push(t);
  return r;
}
function Xi(e) {
  return H(H({}, e), {
    table: function (t) {
      var n = e.table(t),
        r = n.schema,
        a = {},
        i = [];
      function o(v, g, E) {
        var A = mt(v),
          w = (a[A] = a[A] || []),
          b = v == null ? 0 : typeof v == 'string' ? 1 : v.length,
          m = g > 0,
          S = H(H({}, E), {
            isVirtual: m,
            keyTail: g,
            keyLength: b,
            extractKey: Bn(v),
            unique: !m && E.unique,
          });
        if ((w.push(S), S.isPrimaryKey || i.push(S), b > 1)) {
          var D = b === 2 ? v[0] : v.slice(0, b - 1);
          o(D, g + 1, E);
        }
        return (
          w.sort(function (T, x) {
            return T.keyTail - x.keyTail;
          }),
          S
        );
      }
      var s = o(r.primaryKey.keyPath, 0, r.primaryKey);
      a[':id'] = [s];
      for (var u = 0, c = r.indexes; u < c.length; u++) {
        var d = c[u];
        o(d.keyPath, 0, d);
      }
      function l(v) {
        var g = a[mt(v)];
        return g && g[0];
      }
      function h(v, g) {
        return {
          type: v.type === 1 ? 2 : v.type,
          lower: Nt(v.lower, v.lowerOpen ? e.MAX_KEY : e.MIN_KEY, g),
          lowerOpen: !0,
          upper: Nt(v.upper, v.upperOpen ? e.MIN_KEY : e.MAX_KEY, g),
          upperOpen: !0,
        };
      }
      function _(v) {
        var g = v.query.index;
        return g.isVirtual
          ? H(H({}, v), { query: { index: g, range: h(v.query.range, g.keyTail) } })
          : v;
      }
      var y = H(H({}, n), {
        schema: H(H({}, r), { primaryKey: s, indexes: i, getIndexByKeyPath: l }),
        count: function (v) {
          return n.count(_(v));
        },
        query: function (v) {
          return n.query(_(v));
        },
        openCursor: function (v) {
          var g = v.query.index,
            E = g.keyTail,
            A = g.isVirtual,
            w = g.keyLength;
          if (!A) return n.openCursor(v);
          function b(m) {
            function S(T) {
              T != null
                ? m.continue(Nt(T, v.reverse ? e.MAX_KEY : e.MIN_KEY, E))
                : v.unique
                ? m.continue(m.key.slice(0, w).concat(v.reverse ? e.MIN_KEY : e.MAX_KEY, E))
                : m.continue();
            }
            var D = Object.create(m, {
              continue: { value: S },
              continuePrimaryKey: {
                value: function (T, x) {
                  m.continuePrimaryKey(Nt(T, e.MAX_KEY, E), x);
                },
              },
              primaryKey: {
                get: function () {
                  return m.primaryKey;
                },
              },
              key: {
                get: function () {
                  var T = m.key;
                  return w === 1 ? T[0] : T.slice(0, w);
                },
              },
              value: {
                get: function () {
                  return m.value;
                },
              },
            });
            return D;
          }
          return n.openCursor(_(v)).then(function (m) {
            return m && b(m);
          });
        },
      });
      return y;
    },
  });
}
var Qi = { stack: 'dbcore', name: 'VirtualIndexMiddleware', level: 1, create: Xi };
function ur(e, t, n, r) {
  return (
    (n = n || {}),
    (r = r || ''),
    te(e).forEach(function (a) {
      if (!ve(t, a)) n[r + a] = void 0;
      else {
        var i = e[a],
          o = t[a];
        if (typeof i == 'object' && typeof o == 'object' && i && o) {
          var s = En(i),
            u = En(o);
          s !== u
            ? (n[r + a] = t[a])
            : s === 'Object'
            ? ur(i, o, n, r + a + '.')
            : i !== o && (n[r + a] = t[a]);
        } else i !== o && (n[r + a] = t[a]);
      }
    }),
    te(t).forEach(function (a) {
      ve(e, a) || (n[r + a] = t[a]);
    }),
    n
  );
}
function Ji(e, t) {
  return t.type === 'delete' ? t.keys : t.keys || t.values.map(e.extractKey);
}
var Zi = {
  stack: 'dbcore',
  name: 'HooksMiddleware',
  level: 2,
  create: function (e) {
    return H(H({}, e), {
      table: function (t) {
        var n = e.table(t),
          r = n.schema.primaryKey,
          a = H(H({}, n), {
            mutate: function (i) {
              var o = P.trans,
                s = o.table(t).hook,
                u = s.deleting,
                c = s.creating,
                d = s.updating;
              switch (i.type) {
                case 'add':
                  if (c.fire === G) break;
                  return o._promise(
                    'readwrite',
                    function () {
                      return l(i);
                    },
                    !0
                  );
                case 'put':
                  if (c.fire === G && d.fire === G) break;
                  return o._promise(
                    'readwrite',
                    function () {
                      return l(i);
                    },
                    !0
                  );
                case 'delete':
                  if (u.fire === G) break;
                  return o._promise(
                    'readwrite',
                    function () {
                      return l(i);
                    },
                    !0
                  );
                case 'deleteRange':
                  if (u.fire === G) break;
                  return o._promise(
                    'readwrite',
                    function () {
                      return h(i);
                    },
                    !0
                  );
              }
              return n.mutate(i);
              function l(y) {
                var v = P.trans,
                  g = y.keys || Ji(r, y);
                if (!g) throw new Error('Keys missing');
                return (
                  (y = y.type === 'add' || y.type === 'put' ? H(H({}, y), { keys: g }) : H({}, y)),
                  y.type !== 'delete' && (y.values = _n([], y.values, !0)),
                  y.keys && (y.keys = _n([], y.keys, !0)),
                  eo(n, y, g).then(function (E) {
                    var A = g.map(function (w, b) {
                      var m = E[b],
                        S = { onerror: null, onsuccess: null };
                      if (y.type === 'delete') u.fire.call(S, w, m, v);
                      else if (y.type === 'add' || m === void 0) {
                        var D = c.fire.call(S, w, y.values[b], v);
                        w == null &&
                          D != null &&
                          ((w = D), (y.keys[b] = w), r.outbound || ge(y.values[b], r.keyPath, w));
                      } else {
                        var T = ur(m, y.values[b]),
                          x = d.fire.call(S, T, w, m, v);
                        if (x) {
                          var k = y.values[b];
                          Object.keys(x).forEach(function (M) {
                            ve(k, M) ? (k[M] = x[M]) : ge(k, M, x[M]);
                          });
                        }
                      }
                      return S;
                    });
                    return n
                      .mutate(y)
                      .then(function (w) {
                        for (
                          var b = w.failures,
                            m = w.results,
                            S = w.numFailures,
                            D = w.lastResult,
                            T = 0;
                          T < g.length;
                          ++T
                        ) {
                          var x = m ? m[T] : g[T],
                            k = A[T];
                          x == null
                            ? k.onerror && k.onerror(b[T])
                            : k.onsuccess &&
                              k.onsuccess(y.type === 'put' && E[T] ? y.values[T] : x);
                        }
                        return { failures: b, results: m, numFailures: S, lastResult: D };
                      })
                      .catch(function (w) {
                        return (
                          A.forEach(function (b) {
                            return b.onerror && b.onerror(w);
                          }),
                          Promise.reject(w)
                        );
                      });
                  })
                );
              }
              function h(y) {
                return _(y.trans, y.range, 1e4);
              }
              function _(y, v, g) {
                return n
                  .query({ trans: y, values: !1, query: { index: r, range: v }, limit: g })
                  .then(function (E) {
                    var A = E.result;
                    return l({ type: 'delete', keys: A, trans: y }).then(function (w) {
                      return w.numFailures > 0
                        ? Promise.reject(w.failures[0])
                        : A.length < g
                        ? { failures: [], numFailures: 0, lastResult: void 0 }
                        : _(y, H(H({}, v), { lower: A[A.length - 1], lowerOpen: !0 }), g);
                    });
                  });
              }
            },
          });
        return a;
      },
    });
  },
};
function eo(e, t, n) {
  return t.type === 'add'
    ? Promise.resolve([])
    : e.getMany({ trans: t.trans, keys: n, cache: 'immutable' });
}
function oa(e, t, n) {
  try {
    if (!t || t.keys.length < e.length) return null;
    for (var r = [], a = 0, i = 0; a < t.keys.length && i < e.length; ++a)
      se(t.keys[a], e[i]) === 0 && (r.push(n ? Tt(t.values[a]) : t.values[a]), ++i);
    return r.length === e.length ? r : null;
  } catch {
    return null;
  }
}
var to = {
    stack: 'dbcore',
    level: -1,
    create: function (e) {
      return {
        table: function (t) {
          var n = e.table(t);
          return H(H({}, n), {
            getMany: function (r) {
              if (!r.cache) return n.getMany(r);
              var a = oa(r.keys, r.trans._cache, r.cache === 'clone');
              return a
                ? O.resolve(a)
                : n.getMany(r).then(function (i) {
                    return (
                      (r.trans._cache = { keys: r.keys, values: r.cache === 'clone' ? Tt(i) : i }),
                      i
                    );
                  });
            },
            mutate: function (r) {
              return r.type !== 'add' && (r.trans._cache = null), n.mutate(r);
            },
          });
        },
      };
    },
  },
  pn;
function cr(e) {
  return !('from' in e);
}
var xe = function (e, t) {
  if (this)
    ue(this, arguments.length ? { d: 1, from: e, to: arguments.length > 1 ? t : e } : { d: 0 });
  else {
    var n = new xe();
    return e && 'd' in e && ue(n, e), n;
  }
};
at(
  xe.prototype,
  ((pn = {
    add: function (e) {
      return Zt(this, e), this;
    },
    addKey: function (e) {
      return St(this, e, e), this;
    },
    addKeys: function (e) {
      var t = this;
      return (
        e.forEach(function (n) {
          return St(t, n, n);
        }),
        this
      );
    },
  }),
  (pn[An] = function () {
    return Vn(this);
  }),
  pn)
);
function St(e, t, n) {
  var r = se(t, n);
  if (!isNaN(r)) {
    if (r > 0) throw RangeError();
    if (cr(e)) return ue(e, { from: t, to: n, d: 1 });
    var a = e.l,
      i = e.r;
    if (se(n, e.from) < 0)
      return a ? St(a, t, n) : (e.l = { from: t, to: n, d: 1, l: null, r: null }), Sr(e);
    if (se(t, e.to) > 0)
      return i ? St(i, t, n) : (e.r = { from: t, to: n, d: 1, l: null, r: null }), Sr(e);
    se(t, e.from) < 0 && ((e.from = t), (e.l = null), (e.d = i ? i.d + 1 : 1)),
      se(n, e.to) > 0 && ((e.to = n), (e.r = null), (e.d = e.l ? e.l.d + 1 : 1));
    var o = !e.r;
    a && !e.l && Zt(e, a), i && o && Zt(e, i);
  }
}
function Zt(e, t) {
  function n(r, a) {
    var i = a.from,
      o = a.to,
      s = a.l,
      u = a.r;
    St(r, i, o), s && n(r, s), u && n(r, u);
  }
  cr(t) || n(e, t);
}
function no(e, t) {
  var n = Vn(t),
    r = n.next();
  if (r.done) return !1;
  for (var a = r.value, i = Vn(e), o = i.next(a.from), s = o.value; !r.done && !o.done; ) {
    if (se(s.from, a.to) <= 0 && se(s.to, a.from) >= 0) return !0;
    se(a.from, s.from) < 0 ? (a = (r = n.next(s.from)).value) : (s = (o = i.next(a.from)).value);
  }
  return !1;
}
function Vn(e) {
  var t = cr(e) ? null : { s: 0, n: e };
  return {
    next: function (n) {
      for (var r = arguments.length > 0; t; )
        switch (t.s) {
          case 0:
            if (((t.s = 1), r))
              for (; t.n.l && se(n, t.n.from) < 0; ) t = { up: t, n: t.n.l, s: 1 };
            else for (; t.n.l; ) t = { up: t, n: t.n.l, s: 1 };
          case 1:
            if (((t.s = 2), !r || se(n, t.n.to) <= 0)) return { value: t.n, done: !1 };
          case 2:
            if (t.n.r) {
              (t.s = 3), (t = { up: t, n: t.n.r, s: 0 });
              continue;
            }
          case 3:
            t = t.up;
        }
      return { done: !0 };
    },
  };
}
function Sr(e) {
  var t,
    n,
    r =
      (((t = e.r) === null || t === void 0 ? void 0 : t.d) || 0) -
      (((n = e.l) === null || n === void 0 ? void 0 : n.d) || 0),
    a = r > 1 ? 'r' : r < -1 ? 'l' : '';
  if (a) {
    var i = a === 'r' ? 'l' : 'r',
      o = H({}, e),
      s = e[a];
    (e.from = s.from), (e.to = s.to), (e[a] = s[a]), (o[a] = s[i]), (e[i] = o), (o.d = Tr(o));
  }
  e.d = Tr(e);
}
function Tr(e) {
  var t = e.r,
    n = e.l;
  return (t ? (n ? Math.max(t.d, n.d) : t.d) : n ? n.d : 0) + 1;
}
var ro = {
  stack: 'dbcore',
  level: 0,
  create: function (e) {
    var t = e.schema.name,
      n = new xe(e.MIN_KEY, e.MAX_KEY);
    return H(H({}, e), {
      table: function (r) {
        var a = e.table(r),
          i = a.schema,
          o = i.primaryKey,
          s = o.extractKey,
          u = o.outbound,
          c = H(H({}, a), {
            mutate: function (h) {
              var _ = h.trans,
                y = _.mutatedParts || (_.mutatedParts = {}),
                v = function (D) {
                  var T = 'idb://' + t + '/' + r + '/' + D;
                  return y[T] || (y[T] = new xe());
                },
                g = v(''),
                E = v(':dels'),
                A = h.type,
                w =
                  h.type === 'deleteRange'
                    ? [h.range]
                    : h.type === 'delete'
                    ? [h.keys]
                    : h.values.length < 50
                    ? [[], h.values]
                    : [],
                b = w[0],
                m = w[1],
                S = h.trans._cache;
              return a.mutate(h).then(function (D) {
                if (ie(b)) {
                  A !== 'delete' && (b = D.results), g.addKeys(b);
                  var T = oa(b, S);
                  !T && A !== 'add' && E.addKeys(b), (T || m) && ao(v, i, T, m);
                } else if (b) {
                  var x = { from: b.lower, to: b.upper };
                  E.add(x), g.add(x);
                } else
                  g.add(n),
                    E.add(n),
                    i.indexes.forEach(function (k) {
                      return v(k.name).add(n);
                    });
                return D;
              });
            },
          }),
          d = function (h) {
            var _,
              y,
              v = h.query,
              g = v.index,
              E = v.range;
            return [
              g,
              new xe(
                (_ = E.lower) !== null && _ !== void 0 ? _ : e.MIN_KEY,
                (y = E.upper) !== null && y !== void 0 ? y : e.MAX_KEY
              ),
            ];
          },
          l = {
            get: function (h) {
              return [o, new xe(h.key)];
            },
            getMany: function (h) {
              return [o, new xe().addKeys(h.keys)];
            },
            count: d,
            query: d,
            openCursor: d,
          };
        return (
          te(l).forEach(function (h) {
            c[h] = function (_) {
              var y = P.subscr;
              if (y) {
                var v = function (S) {
                    var D = 'idb://' + t + '/' + r + '/' + S;
                    return y[D] || (y[D] = new xe());
                  },
                  g = v(''),
                  E = v(':dels'),
                  A = l[h](_),
                  w = A[0],
                  b = A[1];
                if ((v(w.name || '').add(b), !w.isPrimaryKey))
                  if (h === 'count') E.add(n);
                  else {
                    var m = h === 'query' && u && _.values && a.query(H(H({}, _), { values: !1 }));
                    return a[h].apply(this, arguments).then(function (S) {
                      if (h === 'query') {
                        if (u && _.values)
                          return m.then(function (k) {
                            var M = k.result;
                            return g.addKeys(M), S;
                          });
                        var D = _.values ? S.result.map(s) : S.result;
                        _.values ? g.addKeys(D) : E.addKeys(D);
                      } else if (h === 'openCursor') {
                        var T = S,
                          x = _.values;
                        return (
                          T &&
                          Object.create(T, {
                            key: {
                              get: function () {
                                return E.addKey(T.primaryKey), T.key;
                              },
                            },
                            primaryKey: {
                              get: function () {
                                var k = T.primaryKey;
                                return E.addKey(k), k;
                              },
                            },
                            value: {
                              get: function () {
                                return x && g.addKey(T.primaryKey), T.value;
                              },
                            },
                          })
                        );
                      }
                      return S;
                    });
                  }
              }
              return a[h].apply(this, arguments);
            };
          }),
          c
        );
      },
    });
  },
};
function ao(e, t, n, r) {
  function a(i) {
    var o = e(i.name || '');
    function s(c) {
      return c != null ? i.extractKey(c) : null;
    }
    var u = function (c) {
      return i.multiEntry && ie(c)
        ? c.forEach(function (d) {
            return o.addKey(d);
          })
        : o.addKey(c);
    };
    (n || r).forEach(function (c, d) {
      var l = n && s(n[d]),
        h = r && s(r[d]);
      se(l, h) !== 0 && (l != null && u(l), h != null && u(h));
    });
  }
  t.indexes.forEach(a);
}
var V = (function () {
    function e(t, n) {
      var r = this;
      (this._middlewares = {}), (this.verno = 0);
      var a = e.dependencies;
      (this._options = n =
        H(
          { addons: e.addons, autoOpen: !0, indexedDB: a.indexedDB, IDBKeyRange: a.IDBKeyRange },
          n
        )),
        (this._deps = { indexedDB: n.indexedDB, IDBKeyRange: n.IDBKeyRange });
      var i = n.addons;
      (this._dbSchema = {}),
        (this._versions = []),
        (this._storeNames = []),
        (this._allTables = {}),
        (this.idbdb = null),
        (this._novip = this);
      var o = {
        dbOpenError: null,
        isBeingOpened: !1,
        onReadyBeingFired: null,
        openComplete: !1,
        dbReadyResolve: G,
        dbReadyPromise: null,
        cancelOpen: G,
        openCanceller: null,
        autoSchema: !0,
        PR1398_maxLoop: 3,
      };
      (o.dbReadyPromise = new O(function (s) {
        o.dbReadyResolve = s;
      })),
        (o.openCanceller = new O(function (s, u) {
          o.cancelOpen = u;
        })),
        (this._state = o),
        (this.name = t),
        (this.on = Ct(this, 'populate', 'blocked', 'versionchange', 'close', { ready: [Jn, G] })),
        (this.on.ready.subscribe = Dr(this.on.ready.subscribe, function (s) {
          return function (u, c) {
            e.vip(function () {
              var d = r._state;
              if (d.openComplete) d.dbOpenError || O.resolve().then(u), c && s(u);
              else if (d.onReadyBeingFired) d.onReadyBeingFired.push(u), c && s(u);
              else {
                s(u);
                var l = r;
                c ||
                  s(function h() {
                    l.on.ready.unsubscribe(u), l.on.ready.unsubscribe(h);
                  });
              }
            });
          };
        })),
        (this.Collection = wi(this)),
        (this.Table = vi(this)),
        (this.Transaction = Ii(this)),
        (this.Version = Wi(this)),
        (this.WhereClause = Ti(this)),
        this.on('versionchange', function (s) {
          s.newVersion > 0
            ? console.warn(
                "Another connection wants to upgrade database '" +
                  r.name +
                  "'. Closing db now to resume the upgrade."
              )
            : console.warn(
                "Another connection wants to delete database '" +
                  r.name +
                  "'. Closing db now to resume the delete request."
              ),
            r.close();
        }),
        this.on('blocked', function (s) {
          !s.newVersion || s.newVersion < s.oldVersion
            ? console.warn("Dexie.delete('" + r.name + "') was blocked")
            : console.warn(
                "Upgrade '" +
                  r.name +
                  "' blocked by other connection holding version " +
                  s.oldVersion / 10
              );
        }),
        (this._maxKey = At(n.IDBKeyRange)),
        (this._createTransaction = function (s, u, c, d) {
          return new r.Transaction(s, u, c, r._options.chromeTransactionDurability, d);
        }),
        (this._fireOnBlocked = function (s) {
          r.on('blocked').fire(s),
            yt
              .filter(function (u) {
                return u.name === r.name && u !== r && !u._state.vcFired;
              })
              .map(function (u) {
                return u.on('versionchange').fire(s);
              });
        }),
        this.use(Qi),
        this.use(Zi),
        this.use(ro),
        this.use(to),
        (this.vip = Object.create(this, { _vip: { value: !0 } })),
        i.forEach(function (s) {
          return s(r);
        });
    }
    return (
      (e.prototype.version = function (t) {
        if (isNaN(t) || t < 0.1) throw new N.Type('Given version is not a positive number');
        if (((t = Math.round(t * 10) / 10), this.idbdb || this._state.isBeingOpened))
          throw new N.Schema('Cannot add version when database is open');
        this.verno = Math.max(this.verno, t);
        var n = this._versions,
          r = n.filter(function (a) {
            return a._cfg.version === t;
          })[0];
        return (
          r ||
          ((r = new this.Version(t)),
          n.push(r),
          n.sort(Pi),
          r.stores({}),
          (this._state.autoSchema = !1),
          r)
        );
      }),
      (e.prototype._whenReady = function (t) {
        var n = this;
        return this.idbdb && (this._state.openComplete || P.letThrough || this._vip)
          ? t()
          : new O(function (r, a) {
              if (n._state.openComplete) return a(new N.DatabaseClosed(n._state.dbOpenError));
              if (!n._state.isBeingOpened) {
                if (!n._options.autoOpen) {
                  a(new N.DatabaseClosed());
                  return;
                }
                n.open().catch(G);
              }
              n._state.dbReadyPromise.then(r, a);
            }).then(t);
      }),
      (e.prototype.use = function (t) {
        var n = t.stack,
          r = t.create,
          a = t.level,
          i = t.name;
        i && this.unuse({ stack: n, name: i });
        var o = this._middlewares[n] || (this._middlewares[n] = []);
        return (
          o.push({ stack: n, create: r, level: a ?? 10, name: i }),
          o.sort(function (s, u) {
            return s.level - u.level;
          }),
          this
        );
      }),
      (e.prototype.unuse = function (t) {
        var n = t.stack,
          r = t.name,
          a = t.create;
        return (
          n &&
            this._middlewares[n] &&
            (this._middlewares[n] = this._middlewares[n].filter(function (i) {
              return a ? i.create !== a : r ? i.name !== r : !1;
            })),
          this
        );
      }),
      (e.prototype.open = function () {
        return Gi(this);
      }),
      (e.prototype._close = function () {
        var t = this._state,
          n = yt.indexOf(this);
        if ((n >= 0 && yt.splice(n, 1), this.idbdb)) {
          try {
            this.idbdb.close();
          } catch {}
          this._novip.idbdb = null;
        }
        (t.dbReadyPromise = new O(function (r) {
          t.dbReadyResolve = r;
        })),
          (t.openCanceller = new O(function (r, a) {
            t.cancelOpen = a;
          }));
      }),
      (e.prototype.close = function () {
        this._close();
        var t = this._state;
        (this._options.autoOpen = !1),
          (t.dbOpenError = new N.DatabaseClosed()),
          t.isBeingOpened && t.cancelOpen(t.dbOpenError);
      }),
      (e.prototype.delete = function () {
        var t = this,
          n = arguments.length > 0,
          r = this._state;
        return new O(function (a, i) {
          var o = function () {
            t.close();
            var s = t._deps.indexedDB.deleteDatabase(t.name);
            (s.onsuccess = Z(function () {
              Yi(t._deps, t.name), a();
            })),
              (s.onerror = be(i)),
              (s.onblocked = t._fireOnBlocked);
          };
          if (n) throw new N.InvalidArgument('Arguments not allowed in db.delete()');
          r.isBeingOpened ? r.dbReadyPromise.then(o) : o();
        });
      }),
      (e.prototype.backendDB = function () {
        return this.idbdb;
      }),
      (e.prototype.isOpen = function () {
        return this.idbdb !== null;
      }),
      (e.prototype.hasBeenClosed = function () {
        var t = this._state.dbOpenError;
        return t && t.name === 'DatabaseClosed';
      }),
      (e.prototype.hasFailed = function () {
        return this._state.dbOpenError !== null;
      }),
      (e.prototype.dynamicallyOpened = function () {
        return this._state.autoSchema;
      }),
      Object.defineProperty(e.prototype, 'tables', {
        get: function () {
          var t = this;
          return te(this._allTables).map(function (n) {
            return t._allTables[n];
          });
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e.prototype.transaction = function () {
        var t = zi.apply(this, arguments);
        return this._transaction.apply(this, t);
      }),
      (e.prototype._transaction = function (t, n, r) {
        var a = this,
          i = P.trans;
        (!i || i.db !== this || t.indexOf('!') !== -1) && (i = null);
        var o = t.indexOf('?') !== -1;
        t = t.replace('!', '').replace('?', '');
        var s, u;
        try {
          if (
            ((u = n.map(function (d) {
              var l = d instanceof a.Table ? d.name : d;
              if (typeof l != 'string')
                throw new TypeError(
                  'Invalid table argument to Dexie.transaction(). Only Table or String are allowed'
                );
              return l;
            })),
            t == 'r' || t === ln)
          )
            s = ln;
          else if (t == 'rw' || t == fn) s = fn;
          else throw new N.InvalidArgument('Invalid transaction mode: ' + t);
          if (i) {
            if (i.mode === ln && s === fn)
              if (o) i = null;
              else
                throw new N.SubTransaction(
                  'Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY'
                );
            i &&
              u.forEach(function (d) {
                if (i && i.storeNames.indexOf(d) === -1)
                  if (o) i = null;
                  else
                    throw new N.SubTransaction(
                      'Table ' + d + ' not included in parent transaction.'
                    );
              }),
              o && i && !i.active && (i = null);
          }
        } catch (d) {
          return i
            ? i._promise(null, function (l, h) {
                h(d);
              })
            : ne(d);
        }
        var c = ia.bind(null, this, s, u, i, r);
        return i
          ? i._promise(s, c, 'lock')
          : P.trans
          ? ut(P.transless, function () {
              return a._whenReady(c);
            })
          : this._whenReady(c);
      }),
      (e.prototype.table = function (t) {
        if (!ve(this._allTables, t)) throw new N.InvalidTable('Table ' + t + ' does not exist');
        return this._allTables[t];
      }),
      e
    );
  })(),
  io = typeof Symbol < 'u' && 'observable' in Symbol ? Symbol.observable : '@@observable',
  oo = (function () {
    function e(t) {
      this._subscribe = t;
    }
    return (
      (e.prototype.subscribe = function (t, n, r) {
        return this._subscribe(
          !t || typeof t == 'function' ? { next: t, error: n, complete: r } : t
        );
      }),
      (e.prototype[io] = function () {
        return this;
      }),
      e
    );
  })();
function sa(e, t) {
  return (
    te(t).forEach(function (n) {
      var r = e[n] || (e[n] = new xe());
      Zt(r, t[n]);
    }),
    e
  );
}
function so(e) {
  return new oo(function (t) {
    var n = zn(e);
    function r(_) {
      n && st();
      var y = function () {
          return je(e, { subscr: _, trans: null });
        },
        v = P.trans ? ut(P.transless, y) : y();
      return n && v.then(De, De), v;
    }
    var a = !1,
      i = {},
      o = {},
      s = {
        get closed() {
          return a;
        },
        unsubscribe: function () {
          (a = !0), Ue.storagemutated.unsubscribe(l);
        },
      };
    t.start && t.start(s);
    var u = !1,
      c = !1;
    function d() {
      return te(o).some(function (_) {
        return i[_] && no(i[_], o[_]);
      });
    }
    var l = function (_) {
        sa(i, _), d() && h();
      },
      h = function () {
        if (!(u || a)) {
          i = {};
          var _ = {},
            y = r(_);
          c || (Ue(Et, l), (c = !0)),
            (u = !0),
            Promise.resolve(y).then(
              function (v) {
                (u = !1), !a && (d() ? h() : ((i = {}), (o = _), t.next && t.next(v)));
              },
              function (v) {
                (u = !1), t.error && t.error(v), s.unsubscribe();
              }
            );
        }
      };
    return h(), s;
  });
}
var Wn;
try {
  Wn = {
    indexedDB: Q.indexedDB || Q.mozIndexedDB || Q.webkitIndexedDB || Q.msIndexedDB,
    IDBKeyRange: Q.IDBKeyRange || Q.webkitIDBKeyRange,
  };
} catch {
  Wn = { indexedDB: null, IDBKeyRange: null };
}
var $e = V;
at(
  $e,
  H(H({}, nn), {
    delete: function (e) {
      var t = new $e(e, { addons: [] });
      return t.delete();
    },
    exists: function (e) {
      return new $e(e, { addons: [] })
        .open()
        .then(function (t) {
          return t.close(), !0;
        })
        .catch('NoSuchDatabaseError', function () {
          return !1;
        });
    },
    getDatabaseNames: function (e) {
      try {
        return Hi($e.dependencies).then(e);
      } catch {
        return ne(new N.MissingAPI());
      }
    },
    defineClass: function () {
      function e(t) {
        ue(this, t);
      }
      return e;
    },
    ignoreTransaction: function (e) {
      return P.trans ? ut(P.transless, e) : e();
    },
    vip: Ln,
    async: function (e) {
      return function () {
        try {
          var t = Un(e.apply(this, arguments));
          return !t || typeof t.then != 'function' ? O.resolve(t) : t;
        } catch (n) {
          return ne(n);
        }
      };
    },
    spawn: function (e, t, n) {
      try {
        var r = Un(e.apply(n, t || []));
        return !r || typeof r.then != 'function' ? O.resolve(r) : r;
      } catch (a) {
        return ne(a);
      }
    },
    currentTransaction: {
      get: function () {
        return P.trans || null;
      },
    },
    waitFor: function (e, t) {
      var n = O.resolve(typeof e == 'function' ? $e.ignoreTransaction(e) : e).timeout(t || 6e4);
      return P.trans ? P.trans.waitFor(n) : n;
    },
    Promise: O,
    debug: {
      get: function () {
        return Ee;
      },
      set: function (e) {
        Fr(
          e,
          e === 'dexie'
            ? function () {
                return !0;
              }
            : Jr
        );
      },
    },
    derive: it,
    extend: ue,
    props: at,
    override: Dr,
    Events: Ct,
    on: Ue,
    liveQuery: so,
    extendObservabilitySet: sa,
    getByKeyPath: Oe,
    setByKeyPath: ge,
    delByKeyPath: ja,
    shallowClone: Mr,
    deepClone: Tt,
    getObjectDiff: ur,
    cmp: se,
    asap: Kr,
    minKey: Pn,
    addons: [],
    connections: yt,
    errnames: Qn,
    dependencies: Wn,
    semVer: gr,
    version: gr
      .split('.')
      .map(function (e) {
        return parseInt(e);
      })
      .reduce(function (e, t, n) {
        return e + t / Math.pow(10, n * 2);
      }),
  })
);
$e.maxKey = At($e.dependencies.IDBKeyRange);
typeof dispatchEvent < 'u' &&
  typeof addEventListener < 'u' &&
  (Ue(Et, function (e) {
    if (!Ce) {
      var t;
      rn
        ? ((t = document.createEvent('CustomEvent')), t.initCustomEvent(Fe, !0, !0, e))
        : (t = new CustomEvent(Fe, { detail: e })),
        (Ce = !0),
        dispatchEvent(t),
        (Ce = !1);
    }
  }),
  addEventListener(Fe, function (e) {
    var t = e.detail;
    Ce || en(t);
  }));
function en(e) {
  var t = Ce;
  try {
    (Ce = !0), Ue.storagemutated.fire(e);
  } finally {
    Ce = t;
  }
}
var Ce = !1;
if (typeof BroadcastChannel < 'u') {
  var Ft = new BroadcastChannel(Fe);
  typeof Ft.unref == 'function' && Ft.unref(),
    Ue(Et, function (e) {
      Ce || Ft.postMessage(e);
    }),
    (Ft.onmessage = function (e) {
      e.data && en(e.data);
    });
} else if (typeof self < 'u' && typeof navigator < 'u') {
  Ue(Et, function (e) {
    try {
      Ce ||
        (typeof localStorage < 'u' &&
          localStorage.setItem(Fe, JSON.stringify({ trig: Math.random(), changedParts: e })),
        typeof self.clients == 'object' &&
          _n([], self.clients.matchAll({ includeUncontrolled: !0 }), !0).forEach(function (t) {
            return t.postMessage({ type: Fe, changedParts: e });
          }));
    } catch {}
  }),
    typeof addEventListener < 'u' &&
      addEventListener('storage', function (e) {
        if (e.key === Fe) {
          var t = JSON.parse(e.newValue);
          t && en(t.changedParts);
        }
      });
  var xr = self.document && navigator.serviceWorker;
  xr && xr.addEventListener('message', uo);
}
function uo(e) {
  var t = e.data;
  t && t.type === Fe && en(t.changedParts);
}
O.rejectionMapper = Ga;
Fr(Ee, Jr);
function ua() {}
function co(e, t) {
  return e === ua
    ? t
    : function () {
        var n = e.apply(this, arguments);
        if (n && typeof n.then == 'function') {
          var r = this,
            a = arguments;
          return n.then(function () {
            return t.apply(r, a);
          });
        }
        return t.apply(this, arguments);
      };
}
function lo() {
  var e = Date.now(),
    t = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (n) {
      var r = (e + Math.random() * 16) % 16 | 0;
      return (e = Math.floor(e / 16)), (n === 'x' ? r : (r & 7) | 8).toString(16);
    });
  return t;
}
function fo(e, t) {
  return function (r) {
    return function (a, i, o, s) {
      if (e.dynamicallyOpened()) return r.apply(this, arguments);
      var u = !1;
      a === 'readwrite' &&
        i.some(function (d) {
          return o[d] && o[d].observable;
        }) &&
        ((u = !0), (i = i.slice(0)), i.indexOf('_changes') === -1 && i.push('_changes'));
      var c = r.call(this, a, i, o, s);
      return (
        u &&
          ((c._lastWrittenRevision = 0),
          c.on('complete', function () {
            if (c._lastWrittenRevision)
              if (!s)
                t.timeoutHandle && clearTimeout(t.timeoutHandle),
                  (t.timeoutHandle = setTimeout(function () {
                    delete t.timeoutHandle, t(c._lastWrittenRevision);
                  }, 25));
              else {
                var d = (function l(h) {
                  return h.parent ? l(h.parent) : h;
                })(s);
                d._lastWrittenRevision = Math.max(
                  c._lastWrittenRevision,
                  d.lastWrittenRevision || 0
                );
              }
          }),
          c.parent && c.parent.source && (c.source = c.parent.source)),
        c
      );
    };
  };
}
function ho(e, t, n) {
  return function (a) {
    t.latestRevision[e.name] < a &&
      ((t.latestRevision[e.name] = a),
      V.ignoreTransaction(function () {
        t.on('latestRevisionIncremented').fire(e.name, a);
      }),
      n && n.setItem('Dexie.Observable/latestRevision/' + e.name, a));
  };
}
var vo = 1,
  po = 2,
  yo = 3;
function mo(e, t) {
  return function (r, a, i) {
    var o = void 0;
    r === void 0 &&
      t.schema.primKey.uuid &&
      ((r = o = V.Observable.createUUID()),
      t.schema.primKey.keyPath && V.setByKeyPath(a, t.schema.primKey.keyPath, r));
    var s = {
        source: i.source || null,
        table: t.name,
        key: r === void 0 ? null : r,
        type: vo,
        obj: a,
      },
      u = e._changes.add(s).then(function (c) {
        return (i._lastWrittenRevision = Math.max(i._lastWrittenRevision, c)), c;
      });
    return (
      (this.onsuccess = function (c) {
        r != c &&
          u._then(function () {
            (s.key = c), e._changes.put(s);
          });
      }),
      (this.onerror = function () {
        u._then(function (c) {
          e._changes.delete(c);
        });
      }),
      o
    );
  };
}
function go(e, t) {
  return function (r, a, i, o) {
    var s = {},
      u = !1,
      c = V.deepClone(i);
    for (var d in r) {
      var l = r[d];
      if (typeof l > 'u') V.delByKeyPath(c, d), (s[d] = null), (u = !0);
      else {
        var h = V.getByKeyPath(i, d);
        l !== h &&
          JSON.stringify(l) !== JSON.stringify(h) &&
          (V.setByKeyPath(c, d, l), (s[d] = l), (u = !0));
      }
    }
    if (u) {
      var _ = { source: o.source || null, table: t, key: a, type: po, mods: s, oldObj: i, obj: c },
        y = e._changes.add(_);
      (this.onsuccess = function () {
        y._then(function (v) {
          o._lastWrittenRevision = Math.max(o._lastWrittenRevision, v);
        });
      }),
        (this.onerror = function () {
          y._then(function (v) {
            e._changes.delete(v);
          });
        });
    }
  };
}
function wo(e, t) {
  return function (r, a, i) {
    var o = e._changes
      .add({ source: i.source || null, table: t, key: r, type: yo, oldObj: a })
      .then(function (s) {
        return (i._lastWrittenRevision = Math.max(i._lastWrittenRevision, s)), s;
      })
      .catch(function (s) {
        console.log(a), console.log(s.stack);
      });
    this.onerror = function () {
      o._then(function (s) {
        e._changes.delete(s);
      });
    };
  };
}
function _o(e) {
  return function (n) {
    if (!n.hook._observing) {
      n.hook._observing = !0;
      var r = n.name;
      n.hook('creating').subscribe(mo(e, n)),
        n.hook('updating').subscribe(go(e, r)),
        n.hook('deleting').subscribe(wo(e, r));
    }
  };
}
function bo(e) {
  return function (n) {
    if (n.key && n.key.indexOf('Dexie.Observable/') === 0) {
      var r = n.key.split('/'),
        a = r[1],
        i = r[2];
      if (a === 'latestRevision') {
        var o = parseInt(n.newValue, 10);
        !isNaN(o) &&
          o > e.latestRevision[i] &&
          ((e.latestRevision[i] = o),
          V.ignoreTransaction(function () {
            e.on('latestRevisionIncremented').fire(i, o);
          }));
      } else if (a.indexOf('deadnode:') === 0) {
        var s = parseInt(a.split(':')[1], 10);
        n.newValue && e.on.suicideNurseCall.fire(i, s);
      } else a === 'intercomm' && n.newValue && e.on.intercomm.fire(i);
    }
  };
}
function Eo(e, t, n) {
  return function (a) {
    return function () {
      return (
        Object.keys(e._allTables).forEach(function (i) {
          var o = e._allTables[i];
          o.schema.observable && n(o), o.name === '_syncNodes' && o.mapToClass(t);
        }),
        a.apply(this, arguments)
      );
    };
  };
}
var ft = V.Promise;
function Ao(e, t, n, r, a) {
  var i = {};
  (e.observable.sendMessage = function (c, d, l, h) {
    if (((h = h || {}), !r.node))
      return h.wantReply ? ft.reject(new V.DatabaseClosedError()) : ft.resolve();
    var _ = { message: d, destinationNode: l, sender: r.node.id, type: c };
    return (
      V.extend(_, h),
      V.ignoreTransaction(function () {
        var y = ['_intercomm'];
        h.wantReply && y.push('_syncNodes');
        var v = e
          .transaction('rw', y, function () {
            return h.wantReply
              ? e._syncNodes
                  .where('id')
                  .equals(l)
                  .count(function (g) {
                    return g
                      ? e._intercomm.add(_)
                      : e._syncNodes
                          .where('isMaster')
                          .above(0)
                          .first(function (E) {
                            return (_.destinationNode = E.id), e._intercomm.add(_);
                          });
                  })
              : e._intercomm.add(_);
          })
          .then(function (g) {
            var E = null;
            return (
              h.wantReply &&
                (E = new ft(function (A, w) {
                  i[g.toString()] = { resolve: A, reject: w };
                })),
              a && a.setItem('Dexie.Observable/intercomm/' + e.name, g.toString()),
              t.on.intercomm.fire(e.name),
              E
            );
          });
        if (h.wantReply) return v;
        v.catch(function () {});
      })
    );
  }),
    (e.observable.broadcastMessage = function (c, d, l) {
      if (r.node) {
        var h = r.node.id;
        V.ignoreTransaction(function () {
          e._syncNodes
            .toArray(function (_) {
              return ft.all(
                _.filter(function (y) {
                  return y.type === 'local' && (l || y.id !== h);
                }).map(function (y) {
                  return e.observable.sendMessage(c, d, y.id);
                })
              );
            })
            .catch(function () {});
        });
      }
    });
  function o() {
    return r.node
      ? V.ignoreTransaction(function () {
          return e.transaction('rw', '_intercomm', function () {
            return e._intercomm.where({ destinationNode: r.node.id }).toArray(function (c) {
              return (
                c.forEach(function (d) {
                  return s(d);
                }),
                e._intercomm
                  .where('id')
                  .anyOf(
                    c.map(function (d) {
                      return d.id;
                    })
                  )
                  .delete()
              );
            });
          });
        })
      : ft.reject(new V.DatabaseClosedError());
  }
  function s(c) {
    if (c.type === 'response') {
      var d = i[c.requestId.toString()];
      d &&
        (c.isFailure ? d.reject(c.message.error) : d.resolve(c.message.result),
        delete i[c.requestId.toString()]);
    } else
      (c.resolve = function (l) {
        e.observable.sendMessage('response', { result: l }, c.sender, { requestId: c.id });
      }),
        (c.reject = function (l) {
          e.observable.sendMessage('response', { error: l.toString() }, c.sender, {
            isFailure: !0,
            requestId: c.id,
          });
        }),
        e.on.message.fire(c);
  }
  function u(c) {
    c === e.name && o().catch('DatabaseClosedError', function () {});
  }
  return { onIntercomm: u, consumeIntercommMessages: o };
}
function So(e) {
  return function (t, n) {
    (t._changes = '++rev'),
      (t._syncNodes = '++id,myRevision,lastHeartBeat,&url,isMaster,type,status'),
      (t._intercomm = '++id,destinationNode'),
      (t._uncommittedChanges = '++id,node'),
      e.call(this, t, n),
      Object.keys(n).forEach(function (r) {
        var a = n[r];
        a.primKey.name.indexOf('$$') === 0 &&
          ((a.primKey.uuid = !0),
          (a.primKey.name = a.primKey.name.substr(2)),
          (a.primKey.keyPath = a.primKey.keyPath.substr(2)));
      }),
      Object.keys(n).forEach(function (r) {
        r.indexOf('_') !== 0 && r.indexOf('$') !== 0 && (n[r].observable = !0);
      });
  };
}
function ca(e) {
  var t = 100;
  V.ignoreTransaction(function () {
    return e._syncNodes
      .orderBy('myRevision')
      .first(function (n) {
        return e._changes.where('rev').below(n.myRevision).limit(t).primaryKeys();
      })
      .then(function (n) {
        if (n.length !== 0)
          return e._changes.bulkDelete(n).then(function () {
            n.length === t &&
              setTimeout(function () {
                return e.isOpen() && ca(e);
              }, 500);
          });
      });
  }).catch(function () {});
}
var Ne = self,
  To = V.defineClass({
    rev: Number,
    source: String,
    table: String,
    key: Object,
    type: Number,
    obj: Object,
    mods: Object,
    oldObj: Object,
  }),
  dt = V.override,
  Ir = V.Promise,
  kr = !1;
function U(e) {
  if (!/^(3|4)\./.test(V.version)) throw new Error('Missing dexie version 3.x or 4.x');
  if (e.observable) {
    if (e.observable.version !== '{version}') throw new Error('Mixed versions of dexie-observable');
    return;
  }
  var t = 2e4,
    n = 2e4,
    r = 500,
    a = t - 5e3,
    i = U.localStorageImpl,
    o = V.defineClass({
      myRevision: Number,
      type: String,
      lastHeartBeat: Number,
      deleteTimeStamp: Number,
      url: String,
      isMaster: Number,
      syncProtocol: String,
      syncContext: null,
      syncOptions: Object,
      connected: !1,
      status: Number,
      appliedRemoteRevision: null,
      remoteBaseRevisions: [{ local: Number, remote: null }],
      dbUploadState: {
        tablesToUpload: [String],
        currentTable: String,
        currentKey: null,
        localBaseRevision: Number,
      },
    });
  (e.observable = { version: '{version}' }), (e.observable.SyncNode = o);
  var s = ho(e, U, i),
    u = fo(e, s),
    c = _o(e),
    d = Eo(e, o, c),
    l = { node: null },
    h = Ao(e, U, o, l, i),
    _ = h.onIntercomm,
    y = h.consumeIntercommMessages;
  Object.defineProperty(e, '_localSyncNode', {
    get: function () {
      return l.node;
    },
  });
  var v = null,
    g = null;
  V.fake &&
    (e.version(1).stores({
      _syncNodes: '++id,myRevision,lastHeartBeat',
      _changes: '++rev',
      _intercomm: '++id,destinationNode',
      _uncommittedChanges: '++id,node',
    }),
    e._syncNodes.mapToClass(o),
    e._changes.mapToClass(To),
    (l.node = new o({
      myRevision: 0,
      type: 'local',
      lastHeartBeat: Date.now(),
      deleteTimeStamp: null,
    }))),
    (e.Version.prototype._parseStoresSpec = dt(e.Version.prototype._parseStoresSpec, So)),
    e.on.addEventType({ changes: 'asap', cleanup: [co, ua], message: 'asap' }),
    (e._createTransaction = dt(e._createTransaction, u)),
    (U.latestRevision[e.name] = U.latestRevision[e.name] || 0),
    (e.open = dt(e.open, d)),
    (e.close = dt(e.close, function (x) {
      return function () {
        return e.dynamicallyOpened()
          ? x.apply(this, arguments)
          : (s.timeoutHandle && (clearTimeout(s.timeoutHandle), delete s.timeoutHandle),
            U.on('latestRevisionIncremented').unsubscribe(A),
            U.on('suicideNurseCall').unsubscribe(T),
            U.on('intercomm').unsubscribe(_),
            U.on('beforeunload').unsubscribe(D),
            l.node &&
              l.node.id &&
              (U.on.suicideNurseCall.fire(e.name, l.node.id),
              i &&
                i.setItem(
                  'Dexie.Observable/deadnode:' + l.node.id.toString() + '/' + e.name,
                  'dead'
                ),
              (l.node.deleteTimeStamp = 1),
              (l.node.lastHeartBeat = 0),
              e._syncNodes.put(l.node),
              (l.node = null)),
            v && clearTimeout(v),
            (v = null),
            g && clearTimeout(g),
            (g = null),
            x.apply(this, arguments));
      };
    })),
    (e.delete = dt(e.delete, function (x) {
      return function () {
        return x.apply(this, arguments).then(function (k) {
          return (U.latestRevision[e.name] = 0), k;
        });
      };
    })),
    e.on(
      'ready',
      function () {
        return e.dynamicallyOpened()
          ? e
          : e
              .table('_changes')
              .orderBy('rev')
              .last(function (k) {
                var M = k ? k.rev : 0;
                return (
                  (l.node = new o({
                    myRevision: M,
                    type: 'local',
                    lastHeartBeat: Date.now(),
                    deleteTimeStamp: null,
                    isMaster: 0,
                  })),
                  U.latestRevision[e.name] < M &&
                    ((U.latestRevision[e.name] = M),
                    V.ignoreTransaction(function () {
                      U.on.latestRevisionIncremented.fire(M);
                    })),
                  e._syncNodes
                    .put(l.node)
                    .then(
                      V.ignoreTransaction(function () {
                        var L = 1;
                        return e._syncNodes
                          .orderBy('isMaster')
                          .reverse()
                          .modify(function (j) {
                            j.isMaster &&
                              (j.lastHeartBeat < Date.now() - t ? (j.isMaster = 0) : (L = 0)),
                              l.node && j.id === l.node.id && (j.isMaster = l.node.isMaster = L);
                          });
                      })
                    )
                    .then(function () {
                      U.on('latestRevisionIncremented', A),
                        U.on('beforeunload', D),
                        U.on('suicideNurseCall', T),
                        U.on('intercomm', _),
                        (v = setTimeout(m, r)),
                        (g = setTimeout(b, a));
                    })
                    .then(function () {
                      S();
                    })
                );
              });
      },
      !0
    );
  var E = 0;
  function A(x, k) {
    if (x === e.name) {
      if (E >= k) return;
      (E = k),
        V.vip(function () {
          w().catch('DatabaseClosedError', function () {});
        });
    }
  }
  function w(x, k, M) {
    if (!k && w.ongoingOperation) return w.ongoingOperation;
    var L = !1,
      j = l.node;
    if (!j) return Ir.reject(new V.DatabaseClosedError());
    var J = 1e3,
      K = e._changes
        .where('rev')
        .above(j.myRevision)
        .limit(J)
        .toArray(function (Y) {
          if (Y.length > 0) {
            var oe = Y[Y.length - 1];
            (L = Y.length === J), e.on('changes').fire(Y, L), (j.myRevision = oe.rev);
          } else M && e.on('changes').fire([], !1);
          var de = !1;
          return e._syncNodes
            .where(':id')
            .equals(j.id)
            .modify(function (re) {
              (de = !0),
                (re.lastHeartBeat = Date.now()),
                (re.deleteTimeStamp = null),
                (re.myRevision = Math.max(re.myRevision, j.myRevision));
            })
            .then(function () {
              return de;
            });
        })
        .then(function (Y) {
          if (!Y)
            throw kr
              ? new Error('Browser is shutting down')
              : (e.close(),
                console.error('Out of sync'),
                Ne.location && Ne.location.reload(!0),
                new Error('Out of sync'));
          if (L || U.latestRevision[e.name] > j.myRevision)
            return w(U.latestRevision[e.name], (k || 0) + 1, L);
        })
        .finally(function () {
          delete w.ongoingOperation;
        });
    return k || (w.ongoingOperation = K), K;
  }
  function b() {
    g = null;
    var x = l.node && l.node.id;
    x &&
      e
        .transaction('rw!', e._syncNodes, function () {
          e._syncNodes.where({ id: x }).first(function (k) {
            if (!k) {
              e.isOpen() && e.close();
              return;
            }
            return (k.lastHeartBeat = Date.now()), (k.deleteTimeStamp = null), e._syncNodes.put(k);
          });
        })
        .catch('DatabaseClosedError', function () {})
        .finally(function () {
          l.node && l.node.id === x && e.isOpen() && (g = setTimeout(b, a));
        });
  }
  function m() {
    v = null;
    var x = l.node && l.node.id;
    x &&
      V.vip(function () {
        w(U.latestRevision[e.name])
          .then(S)
          .then(y)
          .catch('DatabaseClosedError', function () {})
          .finally(function () {
            l.node && l.node.id === x && e.isOpen() && (v = setTimeout(m, r));
          });
      });
  }
  function S() {
    var x = l.node;
    return x
      ? e.transaction('rw', '_syncNodes', '_changes', '_intercomm', function () {
          var k = !1;
          e._syncNodes
            .where('lastHeartBeat')
            .below(Date.now() - t)
            .filter(function (M) {
              return M.type === 'local';
            })
            .modify(function (M) {
              M.deleteTimeStamp && M.deleteTimeStamp < Date.now()
                ? (delete this.value,
                  i && i.removeItem('Dexie.Observable/deadnode:' + M.id + '/' + e.name),
                  M.isMaster && (e._syncNodes.update(x, { isMaster: 1 }), (k = !0)),
                  e._intercomm.where({ destinationNode: M.id }).modify(function (L) {
                    L.wantReply ? (L.destinationNode = x.id) : delete this.value;
                  }))
                : M.deleteTimeStamp || (M.deleteTimeStamp = Date.now() + n);
            })
            .then(function () {
              return U.deleteOldChanges(e), e.on('cleanup').fire(k);
            });
        })
      : Ir.reject(new V.DatabaseClosedError());
  }
  function D() {
    l.node &&
      ((kr = !0),
      (l.node.deleteTimeStamp = 1),
      (l.node.lastHeartBeat = 0),
      e._syncNodes.put(l.node),
      (U.wereTheOneDying = !0),
      i && i.setItem('Dexie.Observable/deadnode:' + l.node.id.toString() + '/' + e.name, 'dead'));
  }
  function T(x, k) {
    x === e.name &&
      !U.wereTheOneDying &&
      V.vip(function () {
        e._syncNodes.update(k, { deleteTimeStamp: 1, lastHeartBeat: 0 }).then(S);
      });
  }
}
U.version = '{version}';
U.latestRevision = {};
U.on = V.Events(null, 'latestRevisionIncremented', 'suicideNurseCall', 'intercomm', 'beforeunload');
U.createUUID = lo;
U.deleteOldChanges = ca;
U._onStorage = bo(U);
U._onBeforeUnload = function () {
  U.on.beforeunload.fire();
};
try {
  U.localStorageImpl = Ne.localStorage;
} catch {}
Ne?.addEventListener &&
  (Ne.addEventListener('storage', U._onStorage),
  Ne.addEventListener('beforeunload', U._onBeforeUnload));
if (V.Observable) {
  if (V.Observable.version !== '{version}') throw new Error('Mixed versions of dexie-observable');
} else (V.Observable = U), V.addons.push(U);
V.Observable;
class xo extends V {
  constructor() {
    super('FuelDB'),
      this.version(9).stores({
        vaults: 'key',
        accounts: '&address, &name',
        networks: '&id, &url, &name',
        connections: 'origin',
        transactions: '&id',
        assets: '&assetId, &name, $symbol',
      });
  }
  async clear() {
    await Promise.all([
      this.vaults.clear(),
      this.accounts.clear(),
      this.transactions.clear(),
      this.connections.clear(),
      this.networks.clear(),
    ]);
  }
}
const p = new xo();
function ns(e) {
  return Array.isArray(e) ? e : e?.split(' ');
}
function rs(e) {
  return Array.isArray(e) ? e.join(' ') : e || '';
}
const as = (e = 13) => Math.random().toString(16).slice(2).slice(0, e);
var la = {};
(function (e) {
  Object.defineProperty(e, '__esModule', { value: !0 });
  /*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */ e.__assign =
    function () {
      return (
        (e.__assign =
          Object.assign ||
          function (o) {
            for (var s, u = 1, c = arguments.length; u < c; u++) {
              s = arguments[u];
              for (var d in s) Object.prototype.hasOwnProperty.call(s, d) && (o[d] = s[d]);
            }
            return o;
          }),
        e.__assign.apply(this, arguments)
      );
    };
  function t(i, o) {
    var s = {};
    for (var u in i)
      Object.prototype.hasOwnProperty.call(i, u) && o.indexOf(u) < 0 && (s[u] = i[u]);
    if (i != null && typeof Object.getOwnPropertySymbols == 'function')
      for (var c = 0, u = Object.getOwnPropertySymbols(i); c < u.length; c++)
        o.indexOf(u[c]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(i, u[c]) &&
          (s[u[c]] = i[u[c]]);
    return s;
  }
  function n(i) {
    var o = typeof Symbol == 'function' && Symbol.iterator,
      s = o && i[o],
      u = 0;
    if (s) return s.call(i);
    if (i && typeof i.length == 'number')
      return {
        next: function () {
          return i && u >= i.length && (i = void 0), { value: i && i[u++], done: !i };
        },
      };
    throw new TypeError(o ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
  }
  function r(i, o) {
    var s = typeof Symbol == 'function' && i[Symbol.iterator];
    if (!s) return i;
    var u = s.call(i),
      c,
      d = [],
      l;
    try {
      for (; (o === void 0 || o-- > 0) && !(c = u.next()).done; ) d.push(c.value);
    } catch (h) {
      l = { error: h };
    } finally {
      try {
        c && !c.done && (s = u.return) && s.call(u);
      } finally {
        if (l) throw l.error;
      }
    }
    return d;
  }
  function a(i, o, s) {
    if (s || arguments.length === 2)
      for (var u = 0, c = o.length, d; u < c; u++)
        (d || !(u in o)) && (d || (d = Array.prototype.slice.call(o, 0, u)), (d[u] = o[u]));
    return i.concat(d || Array.prototype.slice.call(o));
  }
  (e.__read = r), (e.__rest = t), (e.__spreadArray = a), (e.__values = n);
})(la);
var lr = (e, t, n) => {
    if (!t.has(e)) throw TypeError('Cannot ' + n);
  },
  X = (e, t, n) => (lr(e, t, 'read from private field'), n ? n.call(e) : t.get(e)),
  Ye = (e, t, n) => {
    if (t.has(e)) throw TypeError('Cannot add the same private member more than once');
    t instanceof WeakSet ? t.add(e) : t.set(e, n);
  },
  me = (e, t, n, r) => (lr(e, t, 'write to private field'), r ? r.call(e, n) : t.set(e, n), n),
  Cr = (e, t, n) => (lr(e, t, 'access private method'), n),
  Io = class {
    constructor() {
      this.storage = new Map();
    }
    async getItem(e) {
      return this.storage.get(e);
    }
    async setItem(e, t) {
      this.storage.set(e, t);
    }
    async removeItem(e) {
      this.storage.delete(e);
    }
    async clear() {
      return this.storage.clear();
    }
  },
  ko = Io,
  We,
  fa = class {
    constructor(e) {
      Ye(this, We, void 0),
        (this.pathKey = '{}'),
        (this.rootPath = `m/44'/1179993420'/${this.pathKey}'/0/0`),
        (this.numberOfAccounts = 0),
        me(this, We, e.secret || xa.generate()),
        (this.rootPath = e.rootPath || this.rootPath),
        (this.numberOfAccounts = e.numberOfAccounts || 1);
    }
    getDerivePath(e) {
      return this.rootPath.includes(this.pathKey)
        ? this.rootPath.replace(this.pathKey, String(e))
        : `${this.rootPath}/${e}`;
    }
    serialize() {
      return {
        secret: X(this, We),
        rootPath: this.rootPath,
        numberOfAccounts: this.numberOfAccounts,
      };
    }
    getAccounts() {
      let e = [],
        t = 0;
      do {
        let n = Ie.fromMnemonic(X(this, We), this.getDerivePath(t));
        e.push({ publicKey: n.publicKey, address: n.address }), (t += 1);
      } while (t < this.numberOfAccounts);
      return e;
    }
    addAccount() {
      this.numberOfAccounts += 1;
      let e = Ie.fromMnemonic(X(this, We), this.getDerivePath(this.numberOfAccounts - 1));
      return { publicKey: e.publicKey, address: e.address };
    }
    exportAccount(e) {
      let t = 0;
      do {
        let n = Ie.fromMnemonic(X(this, We), this.getDerivePath(t));
        if (n.address.equals(e)) return n.privateKey;
        t += 1;
      } while (t < this.numberOfAccounts);
      throw new Error('Account not found');
    }
    getWallet(e) {
      let t = this.exportAccount(e);
      return Ie.fromPrivateKey(t);
    }
  };
(We = new WeakMap()), (fa.type = 'mnemonic');
var Pe,
  da = class {
    constructor(e) {
      Ye(this, Pe, []),
        e.secret
          ? me(this, Pe, [e.secret])
          : me(this, Pe, e.accounts || [Ie.generate().privateKey]);
    }
    serialize() {
      return { accounts: X(this, Pe) };
    }
    getPublicAccount(e) {
      let t = Ie.fromPrivateKey(e);
      return { address: t.address, publicKey: t.publicKey };
    }
    getAccounts() {
      return X(this, Pe).map(this.getPublicAccount);
    }
    addAccount() {
      let e = Ie.generate();
      return X(this, Pe).push(e.privateKey), this.getPublicAccount(e.privateKey);
    }
    exportAccount(e) {
      let t = X(this, Pe).find((n) => Ie.fromPrivateKey(n).address.equals(e));
      if (!t) throw new Error('Address not found');
      return t;
    }
    getWallet(e) {
      let t = this.exportAccount(e);
      return Ie.fromPrivateKey(t);
    }
  };
(Pe = new WeakMap()), (da.type = 'privateKey');
var Se = {
  invalid_vault_type: 'Invalid VaultType',
  address_not_found: 'Address not found',
  vault_not_found: 'Vault not found',
  wallet_not_unlocked: 'Wallet is locked',
  passphrase_not_match: "Passphrase didn't match",
};
function Te(e, t) {
  if (!e) throw new Error(t);
}
var fe,
  He,
  _e,
  Hn,
  ha,
  $n,
  va,
  pa = class extends Yn.EventEmitter {
    constructor(e) {
      super(),
        Ye(this, Hn),
        Ye(this, $n),
        (this.storage = new ko()),
        (this.STORAGE_KEY = 'WalletManager'),
        Ye(this, fe, []),
        Ye(this, He, ''),
        Ye(this, _e, !0),
        (this.storage = e?.storage || this.storage);
    }
    get isLocked() {
      return X(this, _e);
    }
    exportVault(e) {
      Te(!X(this, _e), Se.wallet_not_unlocked);
      let t = X(this, fe).find((n, r) => r === e);
      return Te(t, Se.vault_not_found), t.vault.serialize();
    }
    getVaults() {
      return X(this, fe).map((e, t) => ({ title: e.title, type: e.type, vaultId: t }));
    }
    getAccounts() {
      return X(this, fe).flatMap((e, t) =>
        e.vault.getAccounts().map((n) => ({ ...n, vaultId: t }))
      );
    }
    getWallet(e) {
      let t = X(this, fe).find((n) => n.vault.getAccounts().find((r) => r.address.equals(e)));
      return Te(t, Se.address_not_found), t.vault.getWallet(e);
    }
    exportPrivateKey(e) {
      Te(!X(this, _e), Se.wallet_not_unlocked);
      let t = X(this, fe).find((n) => n.vault.getAccounts().find((r) => r.address.equals(e)));
      return Te(t, Se.address_not_found), t.vault.exportAccount(e);
    }
    async addAccount(e) {
      await this.loadState();
      let t = X(this, fe)[e?.vaultId || 0];
      await Te(t, Se.vault_not_found);
      let n = t.vault.addAccount();
      return await this.saveState(), n;
    }
    async removeVault(e) {
      X(this, fe).splice(e, 1), await this.saveState();
    }
    async addVault(e) {
      await this.loadState();
      let t = this.getVaultClass(e.type),
        n = new t(e);
      me(this, fe, X(this, fe).concat({ title: e.title, type: e.type, vault: n })),
        await this.saveState();
    }
    async lock() {
      me(this, _e, !0), me(this, fe, []), me(this, He, ''), this.emit('lock');
    }
    async unlock(e) {
      me(this, He, e), me(this, _e, !1);
      try {
        await this.loadState(), this.emit('unlock');
      } catch (t) {
        throw (await this.lock(), t);
      }
    }
    async updatePassphrase(e, t) {
      let n = X(this, _e);
      await this.unlock(e),
        me(this, He, t),
        await this.saveState(),
        await this.loadState(),
        n && (await this.lock());
    }
    async loadState() {
      await Te(!X(this, _e), Se.wallet_not_unlocked);
      let e = await this.storage.getItem(this.STORAGE_KEY);
      if (e) {
        let t = await Ia(X(this, He), JSON.parse(e));
        me(this, fe, Cr(this, $n, va).call(this, t.vaults));
      }
    }
    async saveState() {
      await Te(!X(this, _e), Se.wallet_not_unlocked);
      let e = await ka(X(this, He), { vaults: Cr(this, Hn, ha).call(this, X(this, fe)) });
      await this.storage.setItem(this.STORAGE_KEY, JSON.stringify(e)), this.emit('update');
    }
    getVaultClass(e) {
      let t = pa.Vaults.find((n) => n.type === e);
      return Te(t, Se.invalid_vault_type), t;
    }
  },
  ya = pa;
(fe = new WeakMap()),
  (He = new WeakMap()),
  (_e = new WeakMap()),
  (Hn = new WeakSet()),
  (ha = function (e) {
    return e.map(({ title: t, type: n, vault: r }) => ({ title: t, type: n, data: r.serialize() }));
  }),
  ($n = new WeakSet()),
  (va = function (e) {
    return e.map(({ title: t, type: n, data: r }) => {
      let a = this.getVaultClass(n);
      return { title: t, type: n, vault: new a(r) };
    });
  }),
  (ya.Vaults = [fa, da]);
class Co {
  async getItem(t) {
    return p.transaction('r', p.vaults, async () => (await p.vaults.get({ key: t }))?.data);
  }
  async setItem(t, n) {
    await p.transaction('rw', p.vaults, p.accounts, async () => {
      await p.vaults.put({ key: t, data: n });
    });
  }
  async removeItem(t) {
    await p.transaction('rw', p.vaults, p.accounts, async () => {
      await p.vaults.where({ key: t }).delete();
    });
  }
  async clear() {
    await p.transaction('rw', p.vaults, p.accounts, async () => {
      await p.vaults.clear(), await p.accounts.clear();
    });
  }
}
const ma = class extends Yn {
  constructor() {
    super();
    const e = new Co(),
      t = new ya({ storage: e });
    (this.manager = t), (this.server = new mn.JSONRPCServer()), this.setupMethods();
  }
  setupMethods() {
    ma.methods.forEach((e) => {
      if (!this[e]) throw new Error('Method not exists!');
      this.server.addMethod(e, this[e].bind(this));
    });
  }
  async createVault({ type: e, secret: t }) {
    await this.manager.addVault({ type: e, secret: t });
    const n = await this.manager.getAccounts()[0];
    return { address: n.address.toString(), publicKey: n.publicKey, vaultId: n.vaultId || 0 };
  }
  async isLocked() {
    return this.manager.isLocked;
  }
  async unlock({ password: e }) {
    await this.manager.unlock(e);
  }
  async lock() {
    await this.manager.lock();
  }
  async addAccount({ vaultId: e }) {
    const t = await this.manager.addAccount({ vaultId: e });
    return { address: t.address.toString(), publicKey: t.publicKey, vaultId: t.vaultId || 0 };
  }
  async getAccounts() {
    return (await this.manager.getAccounts()).map((t) => ({
      address: t.address.toString(),
      publicKey: t.publicKey,
      vaultId: t.vaultId || 0,
    }));
  }
  async signTransaction({ transaction: e, address: t }) {
    const n = await this.manager.getWallet(gn.fromString(t)),
      r = Ca(JSON.parse(e));
    return await n.signTransaction(r);
  }
  async signMessage({ message: e, address: t }) {
    return (await this.manager.getWallet(gn.fromString(t))).signMessage(e);
  }
  async changePassword({ currentPassword: e, password: t }) {
    await this.manager.updatePassphrase(e, t);
  }
  async exportVault({ vaultId: e, password: t }) {
    return await this.manager.unlock(t), (await this.manager.exportVault(e)).secret || '';
  }
};
let Oo = ma;
Oo.methods = [
  'isLocked',
  'unlock',
  'createVault',
  'getAccounts',
  'addAccount',
  'signMessage',
  'signTransaction',
  'changePassword',
  'exportVault',
  'lock',
];
var ga = {},
  ct = {};
Object.defineProperty(ct, '__esModule', { value: !0 });
var Ro = '.',
  Do = {},
  Ko = 'xstate.guard',
  Po = '';
ct.DEFAULT_GUARD_TYPE = Ko;
ct.EMPTY_ACTIVITY_MAP = Do;
ct.STATE_DELIMITER = Ro;
ct.TARGETLESS_KEY = Po;
var fr = {};
Object.defineProperty(fr, '__esModule', { value: !0 });
var Mo = !0;
fr.IS_PRODUCTION = Mo;
(function (e) {
  Object.defineProperty(e, '__esModule', { value: !0 });
  var t = la,
    n = ct,
    r = fr,
    a;
  function i(f) {
    return Object.keys(f);
  }
  function o(f, I, R) {
    R === void 0 && (R = n.STATE_DELIMITER);
    var C = l(f, R),
      B = l(I, R);
    return Y(B)
      ? Y(C)
        ? B === C
        : !1
      : Y(C)
      ? C in B
      : Object.keys(C).every(function (F) {
          return F in B ? o(C[F], B[F]) : !1;
        });
  }
  function s(f) {
    try {
      return Y(f) || typeof f == 'number' ? ''.concat(f) : f.type;
    } catch {
      throw new Error('Events must be strings or objects with a string event.type property.');
    }
  }
  function u(f) {
    try {
      return Y(f) || typeof f == 'number' ? ''.concat(f) : K(f) ? f.name : f.type;
    } catch {
      throw new Error('Actions must be strings or objects with a string action.type property.');
    }
  }
  function c(f, I) {
    try {
      return J(f) ? f : f.toString().split(I);
    } catch {
      throw new Error("'".concat(f, "' is not a valid state path."));
    }
  }
  function d(f) {
    return typeof f == 'object' && 'value' in f && 'context' in f && 'event' in f && '_event' in f;
  }
  function l(f, I) {
    if (d(f)) return f.value;
    if (J(f)) return h(f);
    if (typeof f != 'string') return f;
    var R = c(f, I);
    return h(R);
  }
  function h(f) {
    if (f.length === 1) return f[0];
    for (var I = {}, R = I, C = 0; C < f.length - 1; C++)
      C === f.length - 2 ? (R[f[C]] = f[C + 1]) : ((R[f[C]] = {}), (R = R[f[C]]));
    return I;
  }
  function _(f, I) {
    for (var R = {}, C = Object.keys(f), B = 0; B < C.length; B++) {
      var F = C[B];
      R[F] = I(f[F], F, f, B);
    }
    return R;
  }
  function y(f, I, R) {
    var C,
      B,
      F = {};
    try {
      for (var $ = t.__values(Object.keys(f)), W = $.next(); !W.done; W = $.next()) {
        var z = W.value,
          ee = f[z];
        R(ee) && (F[z] = I(ee, z, f));
      }
    } catch (we) {
      C = { error: we };
    } finally {
      try {
        W && !W.done && (B = $.return) && B.call($);
      } finally {
        if (C) throw C.error;
      }
    }
    return F;
  }
  var v = function (f) {
    return function (I) {
      var R,
        C,
        B = I;
      try {
        for (var F = t.__values(f), $ = F.next(); !$.done; $ = F.next()) {
          var W = $.value;
          B = B[W];
        }
      } catch (z) {
        R = { error: z };
      } finally {
        try {
          $ && !$.done && (C = F.return) && C.call(F);
        } finally {
          if (R) throw R.error;
        }
      }
      return B;
    };
  };
  function g(f, I) {
    return function (R) {
      var C,
        B,
        F = R;
      try {
        for (var $ = t.__values(f), W = $.next(); !W.done; W = $.next()) {
          var z = W.value;
          F = F[I][z];
        }
      } catch (ee) {
        C = { error: ee };
      } finally {
        try {
          W && !W.done && (B = $.return) && B.call($);
        } finally {
          if (C) throw C.error;
        }
      }
      return F;
    };
  }
  function E(f) {
    if (!f) return [[]];
    if (Y(f)) return [[f]];
    var I = w(
      Object.keys(f).map(function (R) {
        var C = f[R];
        return typeof C != 'string' && (!C || !Object.keys(C).length)
          ? [[R]]
          : E(f[R]).map(function (B) {
              return [R].concat(B);
            });
      })
    );
    return I;
  }
  function A(f) {
    var I,
      R,
      C = {};
    if (f && f.length === 1 && f[0].length === 1) return f[0][0];
    try {
      for (var B = t.__values(f), F = B.next(); !F.done; F = B.next())
        for (var $ = F.value, W = C, z = 0; z < $.length; z++) {
          var ee = $[z];
          if (z === $.length - 2) {
            W[ee] = $[z + 1];
            break;
          }
          (W[ee] = W[ee] || {}), (W = W[ee]);
        }
    } catch (we) {
      I = { error: we };
    } finally {
      try {
        F && !F.done && (R = B.return) && R.call(B);
      } finally {
        if (I) throw I.error;
      }
    }
    return C;
  }
  function w(f) {
    var I;
    return (I = []).concat.apply(I, t.__spreadArray([], t.__read(f), !1));
  }
  function b(f) {
    return J(f) ? f : [f];
  }
  function m(f) {
    return f === void 0 ? [] : b(f);
  }
  function S(f, I, R) {
    var C, B;
    if (K(f)) return f(I, R.data);
    var F = {};
    try {
      for (var $ = t.__values(Object.keys(f)), W = $.next(); !W.done; W = $.next()) {
        var z = W.value,
          ee = f[z];
        K(ee) ? (F[z] = ee(I, R.data)) : (F[z] = ee);
      }
    } catch (we) {
      C = { error: we };
    } finally {
      try {
        W && !W.done && (B = $.return) && B.call($);
      } finally {
        if (C) throw C.error;
      }
    }
    return F;
  }
  function D(f) {
    return /^(done|error)\./.test(f);
  }
  function T(f) {
    return !!(f instanceof Promise || (f !== null && (K(f) || typeof f == 'object') && K(f.then)));
  }
  function x(f) {
    return (
      f !== null && typeof f == 'object' && 'transition' in f && typeof f.transition == 'function'
    );
  }
  function k(f, I) {
    var R,
      C,
      B = t.__read([[], []], 2),
      F = B[0],
      $ = B[1];
    try {
      for (var W = t.__values(f), z = W.next(); !z.done; z = W.next()) {
        var ee = z.value;
        I(ee) ? F.push(ee) : $.push(ee);
      }
    } catch (we) {
      R = { error: we };
    } finally {
      try {
        z && !z.done && (C = W.return) && C.call(W);
      } finally {
        if (R) throw R.error;
      }
    }
    return [F, $];
  }
  function M(f, I) {
    return _(f.states, function (R, C) {
      if (R) {
        var B = (Y(I) ? void 0 : I[C]) || (R ? R.current : void 0);
        if (B) return { current: B, states: M(R, B) };
      }
    });
  }
  function L(f, I) {
    return { current: I, states: M(f, I) };
  }
  function j(f, I, R, C) {
    r.IS_PRODUCTION || e.warn(!!f, 'Attempting to update undefined context');
    var B =
      f &&
      R.reduce(function (F, $) {
        var W,
          z,
          ee = $.assignment,
          we = { state: C, action: $, _event: I },
          sn = {};
        if (K(ee)) sn = ee(F, I.data, we);
        else
          try {
            for (var Rt = t.__values(Object.keys(ee)), lt = Rt.next(); !lt.done; lt = Rt.next()) {
              var dr = lt.value,
                un = ee[dr];
              sn[dr] = K(un) ? un(F, I.data, we) : un;
            }
          } catch (Ta) {
            W = { error: Ta };
          } finally {
            try {
              lt && !lt.done && (z = Rt.return) && z.call(Rt);
            } finally {
              if (W) throw W.error;
            }
          }
        return Object.assign({}, F, sn);
      }, f);
    return B;
  }
  (e.warn = function () {}),
    r.IS_PRODUCTION ||
      (e.warn = function (f, I) {
        var R = f instanceof Error ? f : void 0;
        if (!(!R && f) && console !== void 0) {
          var C = ['Warning: '.concat(I)];
          R && C.push(R), console.warn.apply(console, C);
        }
      });
  function J(f) {
    return Array.isArray(f);
  }
  function K(f) {
    return typeof f == 'function';
  }
  function Y(f) {
    return typeof f == 'string';
  }
  function oe(f, I) {
    if (f)
      return Y(f)
        ? { type: n.DEFAULT_GUARD_TYPE, name: f, predicate: I ? I[f] : void 0 }
        : K(f)
        ? { type: n.DEFAULT_GUARD_TYPE, name: f.name, predicate: f }
        : f;
  }
  function de(f) {
    try {
      return 'subscribe' in f && K(f.subscribe);
    } catch {
      return !1;
    }
  }
  var re = (function () {
      return (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
    })(),
    ce =
      ((a = {}),
      (a[re] = function () {
        return this;
      }),
      (a[Symbol.observable] = function () {
        return this;
      }),
      a);
  function ye(f) {
    return !!f && '__xstatenode' in f;
  }
  function pe(f) {
    return !!f && typeof f.send == 'function';
  }
  var Ve = (function () {
    var f = 0;
    return function () {
      return f++, f.toString(16);
    };
  })();
  function le(f, I) {
    return Y(f) || typeof f == 'number' ? t.__assign({ type: f }, I) : f;
  }
  function Ze(f, I) {
    if (!Y(f) && '$$type' in f && f.$$type === 'scxml') return f;
    var R = le(f);
    return t.__assign({ name: R.type, data: R, $$type: 'scxml', type: 'external' }, I);
  }
  function on(f, I) {
    var R = b(I).map(function (C) {
      return typeof C > 'u' || typeof C == 'string' || ye(C)
        ? { target: C, event: f }
        : t.__assign(t.__assign({}, C), { event: f });
    });
    return R;
  }
  function wa(f) {
    if (!(f === void 0 || f === n.TARGETLESS_KEY)) return m(f);
  }
  function _a(f, I, R) {
    if (!r.IS_PRODUCTION) {
      var C = f.stack ? " Stacktrace was '".concat(f.stack, "'") : '';
      if (f === I)
        console.error(
          "Missing onError handler for invocation '"
            .concat(R, "', error was '")
            .concat(f, "'.")
            .concat(C)
        );
      else {
        var B = I.stack ? " Stacktrace was '".concat(I.stack, "'") : '';
        console.error(
          "Missing onError handler and/or unhandled exception/promise rejection for invocation '".concat(
            R,
            "'. "
          ) +
            "Original error: '"
              .concat(f, "'. ")
              .concat(C, " Current error is '")
              .concat(I, "'.")
              .concat(B)
        );
      }
    }
  }
  function ba(f, I, R, C, B) {
    var F = f.options.guards,
      $ = { state: B, cond: I, _event: C };
    if (I.type === n.DEFAULT_GUARD_TYPE) return (F?.[I.name] || I.predicate)(R, C.data, $);
    var W = F?.[I.type];
    if (!W)
      throw new Error(
        "Guard '".concat(I.type, "' is not implemented on machine '").concat(f.id, "'.")
      );
    return W(R, C.data, $);
  }
  function Ea(f) {
    return typeof f == 'string' ? { type: f } : f;
  }
  function Aa(f, I, R) {
    var C = function () {},
      B = typeof f == 'object',
      F = B ? f : null;
    return {
      next: ((B ? f.next : f) || C).bind(F),
      error: ((B ? f.error : I) || C).bind(F),
      complete: ((B ? f.complete : R) || C).bind(F),
    };
  }
  function Sa(f, I) {
    return ''.concat(f, ':invocation[').concat(I, ']');
  }
  (e.createInvokeId = Sa),
    (e.evaluateGuard = ba),
    (e.flatten = w),
    (e.getActionType = u),
    (e.getEventType = s),
    (e.interopSymbols = ce),
    (e.isActor = pe),
    (e.isArray = J),
    (e.isBehavior = x),
    (e.isBuiltInEvent = D),
    (e.isFunction = K),
    (e.isMachine = ye),
    (e.isObservable = de),
    (e.isPromiseLike = T),
    (e.isStateLike = d),
    (e.isString = Y),
    (e.keys = i),
    (e.mapContext = S),
    (e.mapFilterValues = y),
    (e.mapValues = _),
    (e.matchesState = o),
    (e.nestedPath = g),
    (e.normalizeTarget = wa),
    (e.partition = k),
    (e.path = v),
    (e.pathToStateValue = h),
    (e.pathsToStateValue = A),
    (e.reportUnhandledExceptionOnInvocation = _a),
    (e.symbolObservable = re),
    (e.toArray = m),
    (e.toArrayStrict = b),
    (e.toEventObject = le),
    (e.toGuard = oe),
    (e.toInvokeSource = Ea),
    (e.toObserver = Aa),
    (e.toSCXMLEvent = Ze),
    (e.toStatePath = c),
    (e.toStatePaths = E),
    (e.toStateValue = l),
    (e.toTransitionConfigArray = on),
    (e.uniqueId = Ve),
    (e.updateContext = j),
    (e.updateHistoryStates = M),
    (e.updateHistoryValue = L);
})(ga);
class Me {
  static getNetworks() {
    return p.transaction('r', p.networks, async () => p.networks.toArray());
  }
  static getNetwork(t) {
    return p.transaction('r', p.networks, async () => p.networks.get({ id: t.id }));
  }
  static addNetwork(t) {
    return p.transaction('rw', p.networks, async () => {
      const n = await p.networks.count(),
        r = await p.networks.add({
          ...t.data,
          ...(n === 0 && { isSelected: !0 }),
          id: ga.uniqueId(),
        });
      return p.networks.get(r);
    });
  }
  static updateNetwork(t) {
    if (!t.data) throw new Error('Network.data undefined');
    if (!t.id) throw new Error('Network.id undefined');
    return p.transaction(
      'rw',
      p.networks,
      async () => (await p.networks.update(t.id, t.data), p.networks.get(t.id))
    );
  }
  static removeNetwork(t) {
    return p.transaction('rw', p.networks, async () => {
      const n = (await Me.getNetworks()) || [];
      if (n.length === 1) throw new Error('You need to stay with at least one network');
      const r = await Me.getNetwork(t);
      if (r?.isSelected) {
        const a = n.filter((i) => i.id !== t.id)[0];
        await Me.selectNetwork({ id: a.id });
      }
      return await p.networks.where(t).delete(), r?.id;
    });
  }
  static getSelectedNetwork() {
    return p.transaction('r', p.networks, async () =>
      (await p.networks.toArray()).find((t) => t.isSelected)
    );
  }
  static selectNetwork(t) {
    return p.transaction('rw', p.networks, async () => {
      const n = await p.networks.filter((r) => Boolean(r.isSelected)).first();
      return (
        n?.id && (await Me.updateNetwork({ id: n.id, data: { isSelected: !1 } })),
        await Me.updateNetwork({ id: t.id, data: { isSelected: !0 } }),
        p.networks.get(t.id)
      );
    });
  }
  static async addDefaultNetworks() {
    const t = 'http://localhost:4000/graphql',
      n = await Me.getChainInfo({ providerUrl: t }).catch(() => ({ name: 'Localhost' }));
    return Me.addNetwork({ data: { name: n.name, url: t } });
  }
  static clearNetworks() {
    return p.transaction('rw', p.networks, async () => p.networks.clear());
  }
  static async getChainInfo(t) {
    return new wn(t.providerUrl).getChain();
  }
  static async getNodeInfo(t) {
    return new wn(t.providerUrl).getNodeInfo();
  }
}
function Bo(e) {
  const t = typeof e == 'string' ? e : e.assetId;
  return Oa === Ra(t);
}
class $t {
  static async addAccount(t) {
    return p.transaction('rw', p.accounts, async () => {
      const n = await p.accounts.count(),
        r = { ...t.data, isCurrent: n === 0, isHidden: !!t.data.isHidden };
      return await p.accounts.add(r), p.accounts.get({ address: t.data.address });
    });
  }
  static async getAccounts() {
    return p.transaction('r', p.accounts, async () => p.accounts.toCollection().sortBy('name'));
  }
  static async clearAccounts() {
    return p.transaction('rw', p.accounts, async () => p.accounts.clear());
  }
  static async fetchAccount(t) {
    const { address: n } = t,
      r = await p.transaction('r', p.accounts, async () => p.accounts.get({ address: n }));
    if (!r) throw new Error(`Account not found! ${n}`);
    return r;
  }
  static async fetchBalance(t) {
    if (!t.account) throw new Error('Account not defined');
    if (!t.providerUrl) throw new Error('Invalid Provider URL');
    const { account: n, providerUrl: r } = t;
    try {
      const a = await No(r, n.publicKey),
        o = a.find(Bo)?.amount;
      return (
        (await $t.setBalance({
          data: {
            address: n.address || '',
            balance: hr(o || 0).toString(),
            balanceSymbol: 'ETH',
            balances: a.map((u) => ({ ...u, amount: u.amount.toString() })),
          },
        })) ?? n
      );
    } catch {
      return (
        (await $t.setBalance({
          data: {
            address: n.address || '',
            balance: hr(0).toString(),
            balanceSymbol: 'ETH',
            balances: [],
          },
        })) ?? n
      );
    }
  }
  static async setBalance(t) {
    if (p.isOpen())
      return p.transaction('rw!', p.accounts, async () => {
        const { address: n, ...r } = t.data;
        return await p.accounts.update(n, r), p.accounts.get({ address: t.data.address });
      });
  }
  static async hideAccount(t) {
    if (p.isOpen())
      return p.transaction('rw!', p.accounts, async () => {
        const { address: n, ...r } = t.data;
        return await p.accounts.update(n, r), p.accounts.get({ address: t.data.address });
      });
  }
  static toMap(t) {
    return t.reduce((n, r) => ({ ...n, [r.address]: r }), {});
  }
  static fromMap(t) {
    return Object.values(t || {});
  }
  static getCurrentAccount() {
    return p.transaction('r', p.accounts, async () =>
      (await p.accounts.toArray()).find((t) => t.isCurrent)
    );
  }
  static setCurrentAccount(t) {
    return p.transaction(
      'rw',
      p.accounts,
      async () => (
        await p.accounts.filter((n) => !!n.isCurrent).modify({ isCurrent: !1 }),
        await p.accounts.update(t.address, { isCurrent: !0 }),
        p.accounts.get(t.address)
      )
    );
  }
  static updateAccount(t) {
    if (!t.data) throw new Error('Account.data undefined');
    if (!t.address) throw new Error('Account.address undefined');
    return p.transaction(
      'rw',
      p.accounts,
      async () => (await p.accounts.update(t.address, t.data), p.accounts.get(t.address))
    );
  }
  static async checkAccountNameExists(t = '') {
    const n = await $t.getAccounts();
    return this.filterByName(n, t).length > 0;
  }
  static filterByName(t, n = '') {
    return t.filter((r) => r.name.toLowerCase().includes(n.toLowerCase()));
  }
}
async function No(e, t = '0x00') {
  const n = new wn(e),
    r = gn.fromPublicKey(t);
  return await n.getBalances(r);
}
class is {
  static async upsertAsset(t) {
    return p.transaction('rw!', p.assets, async () => {
      const { assetId: n, ...r } = t.data;
      return (
        (await p.assets.get({ assetId: n }))
          ? await p.assets.update(n, r)
          : await p.assets.add(t.data),
        p.assets.get({ assetId: n })
      );
    });
  }
  static async addAsset(t) {
    return p.transaction(
      'rw',
      p.assets,
      async () => (await p.assets.add(t.data), p.assets.get({ assetId: t.data.assetId }))
    );
  }
  static async removeAsset({ assetId: t }) {
    return p.transaction('rw', p.assets, async () => (await p.assets.delete(t), !0));
  }
  static async getAsset(t) {
    return p.transaction('r', p.assets, async () => p.assets.get({ assetId: t }));
  }
  static async clearAssets() {
    return p.transaction('rw', p.assets, async () => p.assets.clear());
  }
  static async getAssets() {
    return p.transaction('r', p.assets, async () => p.assets.toArray());
  }
}
class os extends Yn {
  constructor() {
    super(),
      (this.onCommunicationMessage = (t) => {
        switch (t.type) {
          case Dt.response:
            this.onResponse(t);
            break;
          case Dt.request:
            this.onRequest(t);
            break;
          case Dt.event:
            this.onEvent(t);
            break;
          case Dt.uiEvent:
            this.onUIEvent(t);
            break;
        }
      }),
      this.setMaxListeners(Da),
      (this.client = new mn.JSONRPCClient(this.sendRequest.bind(this))),
      (this.server = new mn.JSONRPCServer());
  }
  externalMethods(t) {
    t.forEach((n) => {
      let r = n;
      n.name && (r = n.name), this.server.addMethod(r, this[r].bind(this));
    });
  }
  async sendRequest(t) {
    throw new Error('Send request not implemented');
  }
  sendResponse(t, n) {
    throw new Error('Send response not implemented');
  }
  onEvent(t) {
    t.events.forEach((n) => {
      this.emit(n.event, ...n.params);
    });
  }
  onResponse(t) {
    this.client.receive(t.response);
  }
  onRequest(t) {
    this.server.receive(t.request).then((n) => {
      this.sendResponse(n, t);
    });
  }
  onUIEvent(t) {}
}
class ss {
  static async addConnection(t) {
    return p.transaction(
      'rw',
      p.connections,
      async () => (await p.connections.add(t.data), p.connections.get({ origin: t.data.origin }))
    );
  }
  static async removeConnection({ origin: t }) {
    return p.transaction('rw', p.connections, async () => {
      const n = await p.connections.get({ origin: t });
      return await p.connections.delete(t), n;
    });
  }
  static async getConnection(t) {
    return p.transaction('r', p.connections, async () => p.connections.get({ origin: t }));
  }
  static async clearConnections() {
    return p.transaction('rw', p.connections, async () => p.connections.clear());
  }
  static async getConnections() {
    return p.transaction('r', p.connections, async () => p.connections.toArray());
  }
  static getConnectedAccounts(t, n) {
    return (t?.accounts || []).map((a) => n.find((i) => i.address === a));
  }
  static async removeAccountFrom(t) {
    const { origin: n, account: r } = t;
    return p.transaction('rw', p.connections, async () => {
      const a = await p.connections.get({ origin: n });
      return a && ((a.accounts = a.accounts.filter((i) => i !== r)), await p.connections.put(a)), a;
    });
  }
  static async addAccountTo(t) {
    const { origin: n, account: r } = t;
    return p.transaction('rw', p.connections, async () => {
      const a = await p.connections.get({ origin: n });
      return a && ((a.accounts = a.accounts.concat(r)), await p.connections.put(a)), a;
    });
  }
  static filterByOrigin(t, n = '') {
    return n.length ? t.filter(yn(n)) : null;
  }
  static findByOrigin(t, n = '') {
    return t.find(yn(n));
  }
  static excludeByOrigin(t, n = '') {
    return n.length ? t.filter((r) => !yn(n)(r)) : t;
  }
}
function yn(e) {
  return (t) => t.origin.toLowerCase().includes(e.toLowerCase() || '');
}
export {
  $t as A,
  os as B,
  ss as C,
  Pa as I,
  Go as M,
  Me as N,
  Ka as P,
  Jo as T,
  Oo as V,
  Xo as W,
  la as _,
  Qo as a,
  Zo as b,
  Wo as c,
  Ho as d,
  is as e,
  p as f,
  es as g,
  rs as h,
  Bo as i,
  Uo as j,
  ns as k,
  zo as l,
  qn as m,
  Lo as s,
  as as u,
  ts as w,
};
