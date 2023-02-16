var se =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
    ? window
    : typeof global < 'u'
    ? global
    : typeof self < 'u'
    ? self
    : {};
function Mh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, 'default') ? t.default : t;
}
function Ku(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if (typeof e == 'function') {
    var r = function n() {
      if (this instanceof n) {
        var i = [null];
        i.push.apply(i, arguments);
        var a = Function.bind.apply(e, i);
        return new a();
      }
      return e.apply(this, arguments);
    };
    r.prototype = e.prototype;
  } else r = {};
  return (
    Object.defineProperty(r, '__esModule', { value: !0 }),
    Object.keys(t).forEach(function (n) {
      var i = Object.getOwnPropertyDescriptor(t, n);
      Object.defineProperty(
        r,
        n,
        i.get
          ? i
          : {
              enumerable: !0,
              get: function () {
                return t[n];
              },
            }
      );
    }),
    r
  );
}
const Ah = 'logger/5.7.0';
let wf = !1,
  Ef = !1;
const Za = { debug: 1, default: 2, info: 2, warning: 3, error: 4, off: 5 };
let xf = Za.default,
  po = null;
function Oh() {
  try {
    const t = [];
    if (
      (['NFD', 'NFC', 'NFKD', 'NFKC'].forEach((e) => {
        try {
          if ('test'.normalize(e) !== 'test') throw new Error('bad normalize');
        } catch {
          t.push(e);
        }
      }),
      t.length)
    )
      throw new Error('missing ' + t.join(', '));
    if (String.fromCharCode(233).normalize('NFD') !== String.fromCharCode(101, 769))
      throw new Error('broken implementation');
  } catch (t) {
    return t.message;
  }
  return null;
}
const _f = Oh();
var Uo;
(function (t) {
  (t.DEBUG = 'DEBUG'),
    (t.INFO = 'INFO'),
    (t.WARNING = 'WARNING'),
    (t.ERROR = 'ERROR'),
    (t.OFF = 'OFF');
})(Uo || (Uo = {}));
var Or;
(function (t) {
  (t.UNKNOWN_ERROR = 'UNKNOWN_ERROR'),
    (t.NOT_IMPLEMENTED = 'NOT_IMPLEMENTED'),
    (t.UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION'),
    (t.NETWORK_ERROR = 'NETWORK_ERROR'),
    (t.SERVER_ERROR = 'SERVER_ERROR'),
    (t.TIMEOUT = 'TIMEOUT'),
    (t.BUFFER_OVERRUN = 'BUFFER_OVERRUN'),
    (t.NUMERIC_FAULT = 'NUMERIC_FAULT'),
    (t.MISSING_NEW = 'MISSING_NEW'),
    (t.INVALID_ARGUMENT = 'INVALID_ARGUMENT'),
    (t.MISSING_ARGUMENT = 'MISSING_ARGUMENT'),
    (t.UNEXPECTED_ARGUMENT = 'UNEXPECTED_ARGUMENT'),
    (t.CALL_EXCEPTION = 'CALL_EXCEPTION'),
    (t.INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS'),
    (t.NONCE_EXPIRED = 'NONCE_EXPIRED'),
    (t.REPLACEMENT_UNDERPRICED = 'REPLACEMENT_UNDERPRICED'),
    (t.UNPREDICTABLE_GAS_LIMIT = 'UNPREDICTABLE_GAS_LIMIT'),
    (t.TRANSACTION_REPLACED = 'TRANSACTION_REPLACED'),
    (t.ACTION_REJECTED = 'ACTION_REJECTED');
})(Or || (Or = {}));
const Tf = '0123456789abcdef';
class Le {
  constructor(e) {
    Object.defineProperty(this, 'version', { enumerable: !0, value: e, writable: !1 });
  }
  _log(e, r) {
    const n = e.toLowerCase();
    Za[n] == null && this.throwArgumentError('invalid log level name', 'logLevel', e),
      !(xf > Za[n]) && console.log.apply(console, r);
  }
  debug(...e) {
    this._log(Le.levels.DEBUG, e);
  }
  info(...e) {
    this._log(Le.levels.INFO, e);
  }
  warn(...e) {
    this._log(Le.levels.WARNING, e);
  }
  makeError(e, r, n) {
    if (Ef) return this.makeError('censored error', r, {});
    r || (r = Le.errors.UNKNOWN_ERROR), n || (n = {});
    const i = [];
    Object.keys(n).forEach((h) => {
      const m = n[h];
      try {
        if (m instanceof Uint8Array) {
          let w = '';
          for (let x = 0; x < m.length; x++) (w += Tf[m[x] >> 4]), (w += Tf[m[x] & 15]);
          i.push(h + '=Uint8Array(0x' + w + ')');
        } else i.push(h + '=' + JSON.stringify(m));
      } catch {
        i.push(h + '=' + JSON.stringify(n[h].toString()));
      }
    }),
      i.push(`code=${r}`),
      i.push(`version=${this.version}`);
    const a = e;
    let o = '';
    switch (r) {
      case Or.NUMERIC_FAULT: {
        o = 'NUMERIC_FAULT';
        const h = e;
        switch (h) {
          case 'overflow':
          case 'underflow':
          case 'division-by-zero':
            o += '-' + h;
            break;
          case 'negative-power':
          case 'negative-width':
            o += '-unsupported';
            break;
          case 'unbound-bitwise-result':
            o += '-unbound-result';
            break;
        }
        break;
      }
      case Or.CALL_EXCEPTION:
      case Or.INSUFFICIENT_FUNDS:
      case Or.MISSING_NEW:
      case Or.NONCE_EXPIRED:
      case Or.REPLACEMENT_UNDERPRICED:
      case Or.TRANSACTION_REPLACED:
      case Or.UNPREDICTABLE_GAS_LIMIT:
        o = r;
        break;
    }
    o && (e += ' [ See: https://links.ethers.org/v5-errors-' + o + ' ]'),
      i.length && (e += ' (' + i.join(', ') + ')');
    const c = new Error(e);
    return (
      (c.reason = a),
      (c.code = r),
      Object.keys(n).forEach(function (h) {
        c[h] = n[h];
      }),
      c
    );
  }
  throwError(e, r, n) {
    throw this.makeError(e, r, n);
  }
  throwArgumentError(e, r, n) {
    return this.throwError(e, Le.errors.INVALID_ARGUMENT, { argument: r, value: n });
  }
  assert(e, r, n, i) {
    e || this.throwError(r, n, i);
  }
  assertArgument(e, r, n, i) {
    e || this.throwArgumentError(r, n, i);
  }
  checkNormalize(e) {
    _f &&
      this.throwError(
        'platform missing String.prototype.normalize',
        Le.errors.UNSUPPORTED_OPERATION,
        { operation: 'String.prototype.normalize', form: _f }
      );
  }
  checkSafeUint53(e, r) {
    typeof e == 'number' &&
      (r == null && (r = 'value not safe'),
      (e < 0 || e >= 9007199254740991) &&
        this.throwError(r, Le.errors.NUMERIC_FAULT, {
          operation: 'checkSafeInteger',
          fault: 'out-of-safe-range',
          value: e,
        }),
      e % 1 &&
        this.throwError(r, Le.errors.NUMERIC_FAULT, {
          operation: 'checkSafeInteger',
          fault: 'non-integer',
          value: e,
        }));
  }
  checkArgumentCount(e, r, n) {
    n ? (n = ': ' + n) : (n = ''),
      e < r &&
        this.throwError('missing argument' + n, Le.errors.MISSING_ARGUMENT, {
          count: e,
          expectedCount: r,
        }),
      e > r &&
        this.throwError('too many arguments' + n, Le.errors.UNEXPECTED_ARGUMENT, {
          count: e,
          expectedCount: r,
        });
  }
  checkNew(e, r) {
    (e === Object || e == null) &&
      this.throwError('missing new', Le.errors.MISSING_NEW, { name: r.name });
  }
  checkAbstract(e, r) {
    e === r
      ? this.throwError(
          'cannot instantiate abstract class ' +
            JSON.stringify(r.name) +
            ' directly; use a sub-class',
          Le.errors.UNSUPPORTED_OPERATION,
          { name: e.name, operation: 'new' }
        )
      : (e === Object || e == null) &&
        this.throwError('missing new', Le.errors.MISSING_NEW, { name: r.name });
  }
  static globalLogger() {
    return po || (po = new Le(Ah)), po;
  }
  static setCensorship(e, r) {
    if (
      (!e &&
        r &&
        this.globalLogger().throwError(
          'cannot permanently disable censorship',
          Le.errors.UNSUPPORTED_OPERATION,
          { operation: 'setCensorship' }
        ),
      wf)
    ) {
      if (!e) return;
      this.globalLogger().throwError(
        'error censorship permanent',
        Le.errors.UNSUPPORTED_OPERATION,
        { operation: 'setCensorship' }
      );
    }
    (Ef = !!e), (wf = !!r);
  }
  static setLogLevel(e) {
    const r = Za[e.toLowerCase()];
    if (r == null) {
      Le.globalLogger().warn('invalid log level - ' + e);
      return;
    }
    xf = r;
  }
  static from(e) {
    return new Le(e);
  }
}
Le.errors = Or;
Le.levels = Uo;
const Rh = 'bytes/5.7.0',
  jn = new Le(Rh);
function Qu(t) {
  return !!t.toHexString;
}
function ta(t) {
  return (
    t.slice ||
      (t.slice = function () {
        const e = Array.prototype.slice.call(arguments);
        return ta(new Uint8Array(Array.prototype.slice.apply(t, e)));
      }),
    t
  );
}
function If(t) {
  return typeof t == 'number' && t == t && t % 1 === 0;
}
function Yu(t) {
  if (t == null) return !1;
  if (t.constructor === Uint8Array) return !0;
  if (typeof t == 'string' || !If(t.length) || t.length < 0) return !1;
  for (let e = 0; e < t.length; e++) {
    const r = t[e];
    if (!If(r) || r < 0 || r >= 256) return !1;
  }
  return !0;
}
function Y(t, e) {
  if ((e || (e = {}), typeof t == 'number')) {
    jn.checkSafeUint53(t, 'invalid arrayify value');
    const r = [];
    for (; t; ) r.unshift(t & 255), (t = parseInt(String(t / 256)));
    return r.length === 0 && r.push(0), ta(new Uint8Array(r));
  }
  if (
    (e.allowMissingPrefix && typeof t == 'string' && t.substring(0, 2) !== '0x' && (t = '0x' + t),
    Qu(t) && (t = t.toHexString()),
    sc(t))
  ) {
    let r = t.substring(2);
    r.length % 2 &&
      (e.hexPad === 'left'
        ? (r = '0' + r)
        : e.hexPad === 'right'
        ? (r += '0')
        : jn.throwArgumentError('hex data is odd-length', 'value', t));
    const n = [];
    for (let i = 0; i < r.length; i += 2) n.push(parseInt(r.substring(i, i + 2), 16));
    return ta(new Uint8Array(n));
  }
  return Yu(t)
    ? ta(new Uint8Array(t))
    : jn.throwArgumentError('invalid arrayify value', 'value', t);
}
function de(t) {
  const e = t.map((i) => Y(i)),
    r = e.reduce((i, a) => i + a.length, 0),
    n = new Uint8Array(r);
  return e.reduce((i, a) => (n.set(a, i), i + a.length), 0), ta(n);
}
function sc(t, e) {
  return !(typeof t != 'string' || !t.match(/^0x[0-9A-Fa-f]*$/) || (e && t.length !== 2 + 2 * e));
}
const mo = '0123456789abcdef';
function ee(t, e) {
  if ((e || (e = {}), typeof t == 'number')) {
    jn.checkSafeUint53(t, 'invalid hexlify value');
    let r = '';
    for (; t; ) (r = mo[t & 15] + r), (t = Math.floor(t / 16));
    return r.length ? (r.length % 2 && (r = '0' + r), '0x' + r) : '0x00';
  }
  if (typeof t == 'bigint') return (t = t.toString(16)), t.length % 2 ? '0x0' + t : '0x' + t;
  if (
    (e.allowMissingPrefix && typeof t == 'string' && t.substring(0, 2) !== '0x' && (t = '0x' + t),
    Qu(t))
  )
    return t.toHexString();
  if (sc(t))
    return (
      t.length % 2 &&
        (e.hexPad === 'left'
          ? (t = '0x0' + t.substring(2))
          : e.hexPad === 'right'
          ? (t += '0')
          : jn.throwArgumentError('hex data is odd-length', 'value', t)),
      t.toLowerCase()
    );
  if (Yu(t)) {
    let r = '0x';
    for (let n = 0; n < t.length; n++) {
      let i = t[n];
      r += mo[(i & 240) >> 4] + mo[i & 15];
    }
    return r;
  }
  return jn.throwArgumentError('invalid hexlify value', 'value', t);
}
function oc(t, e, r) {
  return (
    typeof t != 'string'
      ? (t = ee(t))
      : (!sc(t) || t.length % 2) && jn.throwArgumentError('invalid hexData', 'value', t),
    (e = 2 + 2 * e),
    r != null ? '0x' + t.substring(e, 2 + 2 * r) : '0x' + t.substring(e)
  );
}
function vo(t) {
  if (t !== void 0) {
    let e = t.toString();
    if (e !== 'true') return e;
  }
  return '0.0.0';
}
function Dh() {
  return { FUELS: vo('0.30.0'), FUEL_CORE: vo('0.15.1'), FORC: vo('0.32.2') };
}
var Yn = Dh(),
  oi = {},
  $h = {
    get exports() {
      return oi;
    },
    set exports(t) {
      oi = t;
    },
  };
const kh = {},
  Ch = Object.freeze(
    Object.defineProperty({ __proto__: null, default: kh }, Symbol.toStringTag, { value: 'Module' })
  ),
  cc = Ku(Ch);
(function (t) {
  (function (e, r) {
    function n(l, s) {
      if (!l) throw new Error(s || 'Assertion failed');
    }
    function i(l, s) {
      l.super_ = s;
      var f = function () {};
      (f.prototype = s.prototype), (l.prototype = new f()), (l.prototype.constructor = l);
    }
    function a(l, s, f) {
      if (a.isBN(l)) return l;
      (this.negative = 0),
        (this.words = null),
        (this.length = 0),
        (this.red = null),
        l !== null &&
          ((s === 'le' || s === 'be') && ((f = s), (s = 10)),
          this._init(l || 0, s || 10, f || 'be'));
    }
    typeof e == 'object' ? (e.exports = a) : (r.BN = a), (a.BN = a), (a.wordSize = 26);
    var o;
    try {
      typeof window < 'u' && typeof window.Buffer < 'u' ? (o = window.Buffer) : (o = cc.Buffer);
    } catch {}
    (a.isBN = function (s) {
      return s instanceof a
        ? !0
        : s !== null &&
            typeof s == 'object' &&
            s.constructor.wordSize === a.wordSize &&
            Array.isArray(s.words);
    }),
      (a.max = function (s, f) {
        return s.cmp(f) > 0 ? s : f;
      }),
      (a.min = function (s, f) {
        return s.cmp(f) < 0 ? s : f;
      }),
      (a.prototype._init = function (s, f, v) {
        if (typeof s == 'number') return this._initNumber(s, f, v);
        if (typeof s == 'object') return this._initArray(s, f, v);
        f === 'hex' && (f = 16),
          n(f === (f | 0) && f >= 2 && f <= 36),
          (s = s.toString().replace(/\s+/g, ''));
        var y = 0;
        s[0] === '-' && (y++, (this.negative = 1)),
          y < s.length &&
            (f === 16
              ? this._parseHex(s, y, v)
              : (this._parseBase(s, f, y), v === 'le' && this._initArray(this.toArray(), f, v)));
      }),
      (a.prototype._initNumber = function (s, f, v) {
        s < 0 && ((this.negative = 1), (s = -s)),
          s < 67108864
            ? ((this.words = [s & 67108863]), (this.length = 1))
            : s < 4503599627370496
            ? ((this.words = [s & 67108863, (s / 67108864) & 67108863]), (this.length = 2))
            : (n(s < 9007199254740992),
              (this.words = [s & 67108863, (s / 67108864) & 67108863, 1]),
              (this.length = 3)),
          v === 'le' && this._initArray(this.toArray(), f, v);
      }),
      (a.prototype._initArray = function (s, f, v) {
        if ((n(typeof s.length == 'number'), s.length <= 0))
          return (this.words = [0]), (this.length = 1), this;
        (this.length = Math.ceil(s.length / 3)), (this.words = new Array(this.length));
        for (var y = 0; y < this.length; y++) this.words[y] = 0;
        var E,
          g,
          u = 0;
        if (v === 'be')
          for (y = s.length - 1, E = 0; y >= 0; y -= 3)
            (g = s[y] | (s[y - 1] << 8) | (s[y - 2] << 16)),
              (this.words[E] |= (g << u) & 67108863),
              (this.words[E + 1] = (g >>> (26 - u)) & 67108863),
              (u += 24),
              u >= 26 && ((u -= 26), E++);
        else if (v === 'le')
          for (y = 0, E = 0; y < s.length; y += 3)
            (g = s[y] | (s[y + 1] << 8) | (s[y + 2] << 16)),
              (this.words[E] |= (g << u) & 67108863),
              (this.words[E + 1] = (g >>> (26 - u)) & 67108863),
              (u += 24),
              u >= 26 && ((u -= 26), E++);
        return this._strip();
      });
    function c(l, s) {
      var f = l.charCodeAt(s);
      if (f >= 48 && f <= 57) return f - 48;
      if (f >= 65 && f <= 70) return f - 55;
      if (f >= 97 && f <= 102) return f - 87;
      n(!1, 'Invalid character in ' + l);
    }
    function h(l, s, f) {
      var v = c(l, f);
      return f - 1 >= s && (v |= c(l, f - 1) << 4), v;
    }
    a.prototype._parseHex = function (s, f, v) {
      (this.length = Math.ceil((s.length - f) / 6)), (this.words = new Array(this.length));
      for (var y = 0; y < this.length; y++) this.words[y] = 0;
      var E = 0,
        g = 0,
        u;
      if (v === 'be')
        for (y = s.length - 1; y >= f; y -= 2)
          (u = h(s, f, y) << E),
            (this.words[g] |= u & 67108863),
            E >= 18 ? ((E -= 18), (g += 1), (this.words[g] |= u >>> 26)) : (E += 8);
      else {
        var b = s.length - f;
        for (y = b % 2 === 0 ? f + 1 : f; y < s.length; y += 2)
          (u = h(s, f, y) << E),
            (this.words[g] |= u & 67108863),
            E >= 18 ? ((E -= 18), (g += 1), (this.words[g] |= u >>> 26)) : (E += 8);
      }
      this._strip();
    };
    function m(l, s, f, v) {
      for (var y = 0, E = 0, g = Math.min(l.length, f), u = s; u < g; u++) {
        var b = l.charCodeAt(u) - 48;
        (y *= v),
          b >= 49 ? (E = b - 49 + 10) : b >= 17 ? (E = b - 17 + 10) : (E = b),
          n(b >= 0 && E < v, 'Invalid character'),
          (y += E);
      }
      return y;
    }
    (a.prototype._parseBase = function (s, f, v) {
      (this.words = [0]), (this.length = 1);
      for (var y = 0, E = 1; E <= 67108863; E *= f) y++;
      y--, (E = (E / f) | 0);
      for (var g = s.length - v, u = g % y, b = Math.min(g, g - u) + v, d = 0, _ = v; _ < b; _ += y)
        (d = m(s, _, _ + y, f)),
          this.imuln(E),
          this.words[0] + d < 67108864 ? (this.words[0] += d) : this._iaddn(d);
      if (u !== 0) {
        var O = 1;
        for (d = m(s, _, s.length, f), _ = 0; _ < u; _++) O *= f;
        this.imuln(O), this.words[0] + d < 67108864 ? (this.words[0] += d) : this._iaddn(d);
      }
      this._strip();
    }),
      (a.prototype.copy = function (s) {
        s.words = new Array(this.length);
        for (var f = 0; f < this.length; f++) s.words[f] = this.words[f];
        (s.length = this.length), (s.negative = this.negative), (s.red = this.red);
      });
    function w(l, s) {
      (l.words = s.words), (l.length = s.length), (l.negative = s.negative), (l.red = s.red);
    }
    if (
      ((a.prototype._move = function (s) {
        w(s, this);
      }),
      (a.prototype.clone = function () {
        var s = new a(null);
        return this.copy(s), s;
      }),
      (a.prototype._expand = function (s) {
        for (; this.length < s; ) this.words[this.length++] = 0;
        return this;
      }),
      (a.prototype._strip = function () {
        for (; this.length > 1 && this.words[this.length - 1] === 0; ) this.length--;
        return this._normSign();
      }),
      (a.prototype._normSign = function () {
        return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
      }),
      typeof Symbol < 'u' && typeof Symbol.for == 'function')
    )
      try {
        a.prototype[Symbol.for('nodejs.util.inspect.custom')] = x;
      } catch {
        a.prototype.inspect = x;
      }
    else a.prototype.inspect = x;
    function x() {
      return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
    }
    var T = [
        '',
        '0',
        '00',
        '000',
        '0000',
        '00000',
        '000000',
        '0000000',
        '00000000',
        '000000000',
        '0000000000',
        '00000000000',
        '000000000000',
        '0000000000000',
        '00000000000000',
        '000000000000000',
        '0000000000000000',
        '00000000000000000',
        '000000000000000000',
        '0000000000000000000',
        '00000000000000000000',
        '000000000000000000000',
        '0000000000000000000000',
        '00000000000000000000000',
        '000000000000000000000000',
        '0000000000000000000000000',
      ],
      I = [
        0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5,
      ],
      M = [
        0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7,
        19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881,
        64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
        243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176,
      ];
    (a.prototype.toString = function (s, f) {
      (s = s || 10), (f = f | 0 || 1);
      var v;
      if (s === 16 || s === 'hex') {
        v = '';
        for (var y = 0, E = 0, g = 0; g < this.length; g++) {
          var u = this.words[g],
            b = (((u << y) | E) & 16777215).toString(16);
          (E = (u >>> (24 - y)) & 16777215),
            (y += 2),
            y >= 26 && ((y -= 26), g--),
            E !== 0 || g !== this.length - 1 ? (v = T[6 - b.length] + b + v) : (v = b + v);
        }
        for (E !== 0 && (v = E.toString(16) + v); v.length % f !== 0; ) v = '0' + v;
        return this.negative !== 0 && (v = '-' + v), v;
      }
      if (s === (s | 0) && s >= 2 && s <= 36) {
        var d = I[s],
          _ = M[s];
        v = '';
        var O = this.clone();
        for (O.negative = 0; !O.isZero(); ) {
          var D = O.modrn(_).toString(s);
          (O = O.idivn(_)), O.isZero() ? (v = D + v) : (v = T[d - D.length] + D + v);
        }
        for (this.isZero() && (v = '0' + v); v.length % f !== 0; ) v = '0' + v;
        return this.negative !== 0 && (v = '-' + v), v;
      }
      n(!1, 'Base should be between 2 and 36');
    }),
      (a.prototype.toNumber = function () {
        var s = this.words[0];
        return (
          this.length === 2
            ? (s += this.words[1] * 67108864)
            : this.length === 3 && this.words[2] === 1
            ? (s += 4503599627370496 + this.words[1] * 67108864)
            : this.length > 2 && n(!1, 'Number can only safely store up to 53 bits'),
          this.negative !== 0 ? -s : s
        );
      }),
      (a.prototype.toJSON = function () {
        return this.toString(16, 2);
      }),
      o &&
        (a.prototype.toBuffer = function (s, f) {
          return this.toArrayLike(o, s, f);
        }),
      (a.prototype.toArray = function (s, f) {
        return this.toArrayLike(Array, s, f);
      });
    var k = function (s, f) {
      return s.allocUnsafe ? s.allocUnsafe(f) : new s(f);
    };
    (a.prototype.toArrayLike = function (s, f, v) {
      this._strip();
      var y = this.byteLength(),
        E = v || Math.max(1, y);
      n(y <= E, 'byte array longer than desired length'), n(E > 0, 'Requested array length <= 0');
      var g = k(s, E),
        u = f === 'le' ? 'LE' : 'BE';
      return this['_toArrayLike' + u](g, y), g;
    }),
      (a.prototype._toArrayLikeLE = function (s, f) {
        for (var v = 0, y = 0, E = 0, g = 0; E < this.length; E++) {
          var u = (this.words[E] << g) | y;
          (s[v++] = u & 255),
            v < s.length && (s[v++] = (u >> 8) & 255),
            v < s.length && (s[v++] = (u >> 16) & 255),
            g === 6
              ? (v < s.length && (s[v++] = (u >> 24) & 255), (y = 0), (g = 0))
              : ((y = u >>> 24), (g += 2));
        }
        if (v < s.length) for (s[v++] = y; v < s.length; ) s[v++] = 0;
      }),
      (a.prototype._toArrayLikeBE = function (s, f) {
        for (var v = s.length - 1, y = 0, E = 0, g = 0; E < this.length; E++) {
          var u = (this.words[E] << g) | y;
          (s[v--] = u & 255),
            v >= 0 && (s[v--] = (u >> 8) & 255),
            v >= 0 && (s[v--] = (u >> 16) & 255),
            g === 6
              ? (v >= 0 && (s[v--] = (u >> 24) & 255), (y = 0), (g = 0))
              : ((y = u >>> 24), (g += 2));
        }
        if (v >= 0) for (s[v--] = y; v >= 0; ) s[v--] = 0;
      }),
      Math.clz32
        ? (a.prototype._countBits = function (s) {
            return 32 - Math.clz32(s);
          })
        : (a.prototype._countBits = function (s) {
            var f = s,
              v = 0;
            return (
              f >= 4096 && ((v += 13), (f >>>= 13)),
              f >= 64 && ((v += 7), (f >>>= 7)),
              f >= 8 && ((v += 4), (f >>>= 4)),
              f >= 2 && ((v += 2), (f >>>= 2)),
              v + f
            );
          }),
      (a.prototype._zeroBits = function (s) {
        if (s === 0) return 26;
        var f = s,
          v = 0;
        return (
          f & 8191 || ((v += 13), (f >>>= 13)),
          f & 127 || ((v += 7), (f >>>= 7)),
          f & 15 || ((v += 4), (f >>>= 4)),
          f & 3 || ((v += 2), (f >>>= 2)),
          f & 1 || v++,
          v
        );
      }),
      (a.prototype.bitLength = function () {
        var s = this.words[this.length - 1],
          f = this._countBits(s);
        return (this.length - 1) * 26 + f;
      });
    function F(l) {
      for (var s = new Array(l.bitLength()), f = 0; f < s.length; f++) {
        var v = (f / 26) | 0,
          y = f % 26;
        s[f] = (l.words[v] >>> y) & 1;
      }
      return s;
    }
    (a.prototype.zeroBits = function () {
      if (this.isZero()) return 0;
      for (var s = 0, f = 0; f < this.length; f++) {
        var v = this._zeroBits(this.words[f]);
        if (((s += v), v !== 26)) break;
      }
      return s;
    }),
      (a.prototype.byteLength = function () {
        return Math.ceil(this.bitLength() / 8);
      }),
      (a.prototype.toTwos = function (s) {
        return this.negative !== 0 ? this.abs().inotn(s).iaddn(1) : this.clone();
      }),
      (a.prototype.fromTwos = function (s) {
        return this.testn(s - 1) ? this.notn(s).iaddn(1).ineg() : this.clone();
      }),
      (a.prototype.isNeg = function () {
        return this.negative !== 0;
      }),
      (a.prototype.neg = function () {
        return this.clone().ineg();
      }),
      (a.prototype.ineg = function () {
        return this.isZero() || (this.negative ^= 1), this;
      }),
      (a.prototype.iuor = function (s) {
        for (; this.length < s.length; ) this.words[this.length++] = 0;
        for (var f = 0; f < s.length; f++) this.words[f] = this.words[f] | s.words[f];
        return this._strip();
      }),
      (a.prototype.ior = function (s) {
        return n((this.negative | s.negative) === 0), this.iuor(s);
      }),
      (a.prototype.or = function (s) {
        return this.length > s.length ? this.clone().ior(s) : s.clone().ior(this);
      }),
      (a.prototype.uor = function (s) {
        return this.length > s.length ? this.clone().iuor(s) : s.clone().iuor(this);
      }),
      (a.prototype.iuand = function (s) {
        var f;
        this.length > s.length ? (f = s) : (f = this);
        for (var v = 0; v < f.length; v++) this.words[v] = this.words[v] & s.words[v];
        return (this.length = f.length), this._strip();
      }),
      (a.prototype.iand = function (s) {
        return n((this.negative | s.negative) === 0), this.iuand(s);
      }),
      (a.prototype.and = function (s) {
        return this.length > s.length ? this.clone().iand(s) : s.clone().iand(this);
      }),
      (a.prototype.uand = function (s) {
        return this.length > s.length ? this.clone().iuand(s) : s.clone().iuand(this);
      }),
      (a.prototype.iuxor = function (s) {
        var f, v;
        this.length > s.length ? ((f = this), (v = s)) : ((f = s), (v = this));
        for (var y = 0; y < v.length; y++) this.words[y] = f.words[y] ^ v.words[y];
        if (this !== f) for (; y < f.length; y++) this.words[y] = f.words[y];
        return (this.length = f.length), this._strip();
      }),
      (a.prototype.ixor = function (s) {
        return n((this.negative | s.negative) === 0), this.iuxor(s);
      }),
      (a.prototype.xor = function (s) {
        return this.length > s.length ? this.clone().ixor(s) : s.clone().ixor(this);
      }),
      (a.prototype.uxor = function (s) {
        return this.length > s.length ? this.clone().iuxor(s) : s.clone().iuxor(this);
      }),
      (a.prototype.inotn = function (s) {
        n(typeof s == 'number' && s >= 0);
        var f = Math.ceil(s / 26) | 0,
          v = s % 26;
        this._expand(f), v > 0 && f--;
        for (var y = 0; y < f; y++) this.words[y] = ~this.words[y] & 67108863;
        return v > 0 && (this.words[y] = ~this.words[y] & (67108863 >> (26 - v))), this._strip();
      }),
      (a.prototype.notn = function (s) {
        return this.clone().inotn(s);
      }),
      (a.prototype.setn = function (s, f) {
        n(typeof s == 'number' && s >= 0);
        var v = (s / 26) | 0,
          y = s % 26;
        return (
          this._expand(v + 1),
          f
            ? (this.words[v] = this.words[v] | (1 << y))
            : (this.words[v] = this.words[v] & ~(1 << y)),
          this._strip()
        );
      }),
      (a.prototype.iadd = function (s) {
        var f;
        if (this.negative !== 0 && s.negative === 0)
          return (this.negative = 0), (f = this.isub(s)), (this.negative ^= 1), this._normSign();
        if (this.negative === 0 && s.negative !== 0)
          return (s.negative = 0), (f = this.isub(s)), (s.negative = 1), f._normSign();
        var v, y;
        this.length > s.length ? ((v = this), (y = s)) : ((v = s), (y = this));
        for (var E = 0, g = 0; g < y.length; g++)
          (f = (v.words[g] | 0) + (y.words[g] | 0) + E),
            (this.words[g] = f & 67108863),
            (E = f >>> 26);
        for (; E !== 0 && g < v.length; g++)
          (f = (v.words[g] | 0) + E), (this.words[g] = f & 67108863), (E = f >>> 26);
        if (((this.length = v.length), E !== 0)) (this.words[this.length] = E), this.length++;
        else if (v !== this) for (; g < v.length; g++) this.words[g] = v.words[g];
        return this;
      }),
      (a.prototype.add = function (s) {
        var f;
        return s.negative !== 0 && this.negative === 0
          ? ((s.negative = 0), (f = this.sub(s)), (s.negative ^= 1), f)
          : s.negative === 0 && this.negative !== 0
          ? ((this.negative = 0), (f = s.sub(this)), (this.negative = 1), f)
          : this.length > s.length
          ? this.clone().iadd(s)
          : s.clone().iadd(this);
      }),
      (a.prototype.isub = function (s) {
        if (s.negative !== 0) {
          s.negative = 0;
          var f = this.iadd(s);
          return (s.negative = 1), f._normSign();
        } else if (this.negative !== 0)
          return (this.negative = 0), this.iadd(s), (this.negative = 1), this._normSign();
        var v = this.cmp(s);
        if (v === 0) return (this.negative = 0), (this.length = 1), (this.words[0] = 0), this;
        var y, E;
        v > 0 ? ((y = this), (E = s)) : ((y = s), (E = this));
        for (var g = 0, u = 0; u < E.length; u++)
          (f = (y.words[u] | 0) - (E.words[u] | 0) + g),
            (g = f >> 26),
            (this.words[u] = f & 67108863);
        for (; g !== 0 && u < y.length; u++)
          (f = (y.words[u] | 0) + g), (g = f >> 26), (this.words[u] = f & 67108863);
        if (g === 0 && u < y.length && y !== this)
          for (; u < y.length; u++) this.words[u] = y.words[u];
        return (
          (this.length = Math.max(this.length, u)), y !== this && (this.negative = 1), this._strip()
        );
      }),
      (a.prototype.sub = function (s) {
        return this.clone().isub(s);
      });
    function j(l, s, f) {
      f.negative = s.negative ^ l.negative;
      var v = (l.length + s.length) | 0;
      (f.length = v), (v = (v - 1) | 0);
      var y = l.words[0] | 0,
        E = s.words[0] | 0,
        g = y * E,
        u = g & 67108863,
        b = (g / 67108864) | 0;
      f.words[0] = u;
      for (var d = 1; d < v; d++) {
        for (
          var _ = b >>> 26,
            O = b & 67108863,
            D = Math.min(d, s.length - 1),
            $ = Math.max(0, d - l.length + 1);
          $ <= D;
          $++
        ) {
          var z = (d - $) | 0;
          (y = l.words[z] | 0),
            (E = s.words[$] | 0),
            (g = y * E + O),
            (_ += (g / 67108864) | 0),
            (O = g & 67108863);
        }
        (f.words[d] = O | 0), (b = _ | 0);
      }
      return b !== 0 ? (f.words[d] = b | 0) : f.length--, f._strip();
    }
    var Z = function (s, f, v) {
      var y = s.words,
        E = f.words,
        g = v.words,
        u = 0,
        b,
        d,
        _,
        O = y[0] | 0,
        D = O & 8191,
        $ = O >>> 13,
        z = y[1] | 0,
        H = z & 8191,
        K = z >>> 13,
        le = y[2] | 0,
        oe = le & 8191,
        te = le >>> 13,
        Re = y[3] | 0,
        xe = Re & 8191,
        he = Re >>> 13,
        qe = y[4] | 0,
        Ve = qe & 8191,
        fe = qe >>> 13,
        He = y[5] | 0,
        Ge = He & 8191,
        ve = He >>> 13,
        rt = y[6] | 0,
        nt = rt & 8191,
        pe = rt >>> 13,
        Ke = y[7] | 0,
        dt = Ke & 8191,
        ye = Ke >>> 13,
        it = y[8] | 0,
        at = it & 8191,
        _e = it >>> 13,
        lt = y[9] | 0,
        ht = lt & 8191,
        Te = lt >>> 13,
        st = E[0] | 0,
        pt = st & 8191,
        Ie = st >>> 13,
        Ze = E[1] | 0,
        We = Ze & 8191,
        ge = Ze >>> 13,
        et = E[2] | 0,
        tt = et & 8191,
        be = et >>> 13,
        mt = E[3] | 0,
        vt = mt & 8191,
        Ne = mt >>> 13,
        bt = E[4] | 0,
        gt = bt & 8191,
        we = bt >>> 13,
        ot = E[5] | 0,
        je = ot & 8191,
        Se = ot >>> 13,
        yt = E[6] | 0,
        wt = yt & 8191,
        Me = yt >>> 13,
        Et = E[7] | 0,
        Be = Et & 8191,
        Ae = Et >>> 13,
        xt = E[8] | 0,
        _t = xt & 8191,
        Oe = xt >>> 13,
        Tt = E[9] | 0,
        ze = Tt & 8191,
        ct = Tt >>> 13;
      (v.negative = s.negative ^ f.negative),
        (v.length = 19),
        (b = Math.imul(D, pt)),
        (d = Math.imul(D, Ie)),
        (d = (d + Math.imul($, pt)) | 0),
        (_ = Math.imul($, Ie));
      var en = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (en >>> 26)) | 0),
        (en &= 67108863),
        (b = Math.imul(H, pt)),
        (d = Math.imul(H, Ie)),
        (d = (d + Math.imul(K, pt)) | 0),
        (_ = Math.imul(K, Ie)),
        (b = (b + Math.imul(D, We)) | 0),
        (d = (d + Math.imul(D, ge)) | 0),
        (d = (d + Math.imul($, We)) | 0),
        (_ = (_ + Math.imul($, ge)) | 0);
      var tn = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (tn >>> 26)) | 0),
        (tn &= 67108863),
        (b = Math.imul(oe, pt)),
        (d = Math.imul(oe, Ie)),
        (d = (d + Math.imul(te, pt)) | 0),
        (_ = Math.imul(te, Ie)),
        (b = (b + Math.imul(H, We)) | 0),
        (d = (d + Math.imul(H, ge)) | 0),
        (d = (d + Math.imul(K, We)) | 0),
        (_ = (_ + Math.imul(K, ge)) | 0),
        (b = (b + Math.imul(D, tt)) | 0),
        (d = (d + Math.imul(D, be)) | 0),
        (d = (d + Math.imul($, tt)) | 0),
        (_ = (_ + Math.imul($, be)) | 0);
      var rn = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (rn >>> 26)) | 0),
        (rn &= 67108863),
        (b = Math.imul(xe, pt)),
        (d = Math.imul(xe, Ie)),
        (d = (d + Math.imul(he, pt)) | 0),
        (_ = Math.imul(he, Ie)),
        (b = (b + Math.imul(oe, We)) | 0),
        (d = (d + Math.imul(oe, ge)) | 0),
        (d = (d + Math.imul(te, We)) | 0),
        (_ = (_ + Math.imul(te, ge)) | 0),
        (b = (b + Math.imul(H, tt)) | 0),
        (d = (d + Math.imul(H, be)) | 0),
        (d = (d + Math.imul(K, tt)) | 0),
        (_ = (_ + Math.imul(K, be)) | 0),
        (b = (b + Math.imul(D, vt)) | 0),
        (d = (d + Math.imul(D, Ne)) | 0),
        (d = (d + Math.imul($, vt)) | 0),
        (_ = (_ + Math.imul($, Ne)) | 0);
      var nn = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (nn >>> 26)) | 0),
        (nn &= 67108863),
        (b = Math.imul(Ve, pt)),
        (d = Math.imul(Ve, Ie)),
        (d = (d + Math.imul(fe, pt)) | 0),
        (_ = Math.imul(fe, Ie)),
        (b = (b + Math.imul(xe, We)) | 0),
        (d = (d + Math.imul(xe, ge)) | 0),
        (d = (d + Math.imul(he, We)) | 0),
        (_ = (_ + Math.imul(he, ge)) | 0),
        (b = (b + Math.imul(oe, tt)) | 0),
        (d = (d + Math.imul(oe, be)) | 0),
        (d = (d + Math.imul(te, tt)) | 0),
        (_ = (_ + Math.imul(te, be)) | 0),
        (b = (b + Math.imul(H, vt)) | 0),
        (d = (d + Math.imul(H, Ne)) | 0),
        (d = (d + Math.imul(K, vt)) | 0),
        (_ = (_ + Math.imul(K, Ne)) | 0),
        (b = (b + Math.imul(D, gt)) | 0),
        (d = (d + Math.imul(D, we)) | 0),
        (d = (d + Math.imul($, gt)) | 0),
        (_ = (_ + Math.imul($, we)) | 0);
      var er = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (er >>> 26)) | 0),
        (er &= 67108863),
        (b = Math.imul(Ge, pt)),
        (d = Math.imul(Ge, Ie)),
        (d = (d + Math.imul(ve, pt)) | 0),
        (_ = Math.imul(ve, Ie)),
        (b = (b + Math.imul(Ve, We)) | 0),
        (d = (d + Math.imul(Ve, ge)) | 0),
        (d = (d + Math.imul(fe, We)) | 0),
        (_ = (_ + Math.imul(fe, ge)) | 0),
        (b = (b + Math.imul(xe, tt)) | 0),
        (d = (d + Math.imul(xe, be)) | 0),
        (d = (d + Math.imul(he, tt)) | 0),
        (_ = (_ + Math.imul(he, be)) | 0),
        (b = (b + Math.imul(oe, vt)) | 0),
        (d = (d + Math.imul(oe, Ne)) | 0),
        (d = (d + Math.imul(te, vt)) | 0),
        (_ = (_ + Math.imul(te, Ne)) | 0),
        (b = (b + Math.imul(H, gt)) | 0),
        (d = (d + Math.imul(H, we)) | 0),
        (d = (d + Math.imul(K, gt)) | 0),
        (_ = (_ + Math.imul(K, we)) | 0),
        (b = (b + Math.imul(D, je)) | 0),
        (d = (d + Math.imul(D, Se)) | 0),
        (d = (d + Math.imul($, je)) | 0),
        (_ = (_ + Math.imul($, Se)) | 0);
      var an = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (an >>> 26)) | 0),
        (an &= 67108863),
        (b = Math.imul(nt, pt)),
        (d = Math.imul(nt, Ie)),
        (d = (d + Math.imul(pe, pt)) | 0),
        (_ = Math.imul(pe, Ie)),
        (b = (b + Math.imul(Ge, We)) | 0),
        (d = (d + Math.imul(Ge, ge)) | 0),
        (d = (d + Math.imul(ve, We)) | 0),
        (_ = (_ + Math.imul(ve, ge)) | 0),
        (b = (b + Math.imul(Ve, tt)) | 0),
        (d = (d + Math.imul(Ve, be)) | 0),
        (d = (d + Math.imul(fe, tt)) | 0),
        (_ = (_ + Math.imul(fe, be)) | 0),
        (b = (b + Math.imul(xe, vt)) | 0),
        (d = (d + Math.imul(xe, Ne)) | 0),
        (d = (d + Math.imul(he, vt)) | 0),
        (_ = (_ + Math.imul(he, Ne)) | 0),
        (b = (b + Math.imul(oe, gt)) | 0),
        (d = (d + Math.imul(oe, we)) | 0),
        (d = (d + Math.imul(te, gt)) | 0),
        (_ = (_ + Math.imul(te, we)) | 0),
        (b = (b + Math.imul(H, je)) | 0),
        (d = (d + Math.imul(H, Se)) | 0),
        (d = (d + Math.imul(K, je)) | 0),
        (_ = (_ + Math.imul(K, Se)) | 0),
        (b = (b + Math.imul(D, wt)) | 0),
        (d = (d + Math.imul(D, Me)) | 0),
        (d = (d + Math.imul($, wt)) | 0),
        (_ = (_ + Math.imul($, Me)) | 0);
      var sn = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (sn >>> 26)) | 0),
        (sn &= 67108863),
        (b = Math.imul(dt, pt)),
        (d = Math.imul(dt, Ie)),
        (d = (d + Math.imul(ye, pt)) | 0),
        (_ = Math.imul(ye, Ie)),
        (b = (b + Math.imul(nt, We)) | 0),
        (d = (d + Math.imul(nt, ge)) | 0),
        (d = (d + Math.imul(pe, We)) | 0),
        (_ = (_ + Math.imul(pe, ge)) | 0),
        (b = (b + Math.imul(Ge, tt)) | 0),
        (d = (d + Math.imul(Ge, be)) | 0),
        (d = (d + Math.imul(ve, tt)) | 0),
        (_ = (_ + Math.imul(ve, be)) | 0),
        (b = (b + Math.imul(Ve, vt)) | 0),
        (d = (d + Math.imul(Ve, Ne)) | 0),
        (d = (d + Math.imul(fe, vt)) | 0),
        (_ = (_ + Math.imul(fe, Ne)) | 0),
        (b = (b + Math.imul(xe, gt)) | 0),
        (d = (d + Math.imul(xe, we)) | 0),
        (d = (d + Math.imul(he, gt)) | 0),
        (_ = (_ + Math.imul(he, we)) | 0),
        (b = (b + Math.imul(oe, je)) | 0),
        (d = (d + Math.imul(oe, Se)) | 0),
        (d = (d + Math.imul(te, je)) | 0),
        (_ = (_ + Math.imul(te, Se)) | 0),
        (b = (b + Math.imul(H, wt)) | 0),
        (d = (d + Math.imul(H, Me)) | 0),
        (d = (d + Math.imul(K, wt)) | 0),
        (_ = (_ + Math.imul(K, Me)) | 0),
        (b = (b + Math.imul(D, Be)) | 0),
        (d = (d + Math.imul(D, Ae)) | 0),
        (d = (d + Math.imul($, Be)) | 0),
        (_ = (_ + Math.imul($, Ae)) | 0);
      var on = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (on >>> 26)) | 0),
        (on &= 67108863),
        (b = Math.imul(at, pt)),
        (d = Math.imul(at, Ie)),
        (d = (d + Math.imul(_e, pt)) | 0),
        (_ = Math.imul(_e, Ie)),
        (b = (b + Math.imul(dt, We)) | 0),
        (d = (d + Math.imul(dt, ge)) | 0),
        (d = (d + Math.imul(ye, We)) | 0),
        (_ = (_ + Math.imul(ye, ge)) | 0),
        (b = (b + Math.imul(nt, tt)) | 0),
        (d = (d + Math.imul(nt, be)) | 0),
        (d = (d + Math.imul(pe, tt)) | 0),
        (_ = (_ + Math.imul(pe, be)) | 0),
        (b = (b + Math.imul(Ge, vt)) | 0),
        (d = (d + Math.imul(Ge, Ne)) | 0),
        (d = (d + Math.imul(ve, vt)) | 0),
        (_ = (_ + Math.imul(ve, Ne)) | 0),
        (b = (b + Math.imul(Ve, gt)) | 0),
        (d = (d + Math.imul(Ve, we)) | 0),
        (d = (d + Math.imul(fe, gt)) | 0),
        (_ = (_ + Math.imul(fe, we)) | 0),
        (b = (b + Math.imul(xe, je)) | 0),
        (d = (d + Math.imul(xe, Se)) | 0),
        (d = (d + Math.imul(he, je)) | 0),
        (_ = (_ + Math.imul(he, Se)) | 0),
        (b = (b + Math.imul(oe, wt)) | 0),
        (d = (d + Math.imul(oe, Me)) | 0),
        (d = (d + Math.imul(te, wt)) | 0),
        (_ = (_ + Math.imul(te, Me)) | 0),
        (b = (b + Math.imul(H, Be)) | 0),
        (d = (d + Math.imul(H, Ae)) | 0),
        (d = (d + Math.imul(K, Be)) | 0),
        (_ = (_ + Math.imul(K, Ae)) | 0),
        (b = (b + Math.imul(D, _t)) | 0),
        (d = (d + Math.imul(D, Oe)) | 0),
        (d = (d + Math.imul($, _t)) | 0),
        (_ = (_ + Math.imul($, Oe)) | 0);
      var cn = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (cn >>> 26)) | 0),
        (cn &= 67108863),
        (b = Math.imul(ht, pt)),
        (d = Math.imul(ht, Ie)),
        (d = (d + Math.imul(Te, pt)) | 0),
        (_ = Math.imul(Te, Ie)),
        (b = (b + Math.imul(at, We)) | 0),
        (d = (d + Math.imul(at, ge)) | 0),
        (d = (d + Math.imul(_e, We)) | 0),
        (_ = (_ + Math.imul(_e, ge)) | 0),
        (b = (b + Math.imul(dt, tt)) | 0),
        (d = (d + Math.imul(dt, be)) | 0),
        (d = (d + Math.imul(ye, tt)) | 0),
        (_ = (_ + Math.imul(ye, be)) | 0),
        (b = (b + Math.imul(nt, vt)) | 0),
        (d = (d + Math.imul(nt, Ne)) | 0),
        (d = (d + Math.imul(pe, vt)) | 0),
        (_ = (_ + Math.imul(pe, Ne)) | 0),
        (b = (b + Math.imul(Ge, gt)) | 0),
        (d = (d + Math.imul(Ge, we)) | 0),
        (d = (d + Math.imul(ve, gt)) | 0),
        (_ = (_ + Math.imul(ve, we)) | 0),
        (b = (b + Math.imul(Ve, je)) | 0),
        (d = (d + Math.imul(Ve, Se)) | 0),
        (d = (d + Math.imul(fe, je)) | 0),
        (_ = (_ + Math.imul(fe, Se)) | 0),
        (b = (b + Math.imul(xe, wt)) | 0),
        (d = (d + Math.imul(xe, Me)) | 0),
        (d = (d + Math.imul(he, wt)) | 0),
        (_ = (_ + Math.imul(he, Me)) | 0),
        (b = (b + Math.imul(oe, Be)) | 0),
        (d = (d + Math.imul(oe, Ae)) | 0),
        (d = (d + Math.imul(te, Be)) | 0),
        (_ = (_ + Math.imul(te, Ae)) | 0),
        (b = (b + Math.imul(H, _t)) | 0),
        (d = (d + Math.imul(H, Oe)) | 0),
        (d = (d + Math.imul(K, _t)) | 0),
        (_ = (_ + Math.imul(K, Oe)) | 0),
        (b = (b + Math.imul(D, ze)) | 0),
        (d = (d + Math.imul(D, ct)) | 0),
        (d = (d + Math.imul($, ze)) | 0),
        (_ = (_ + Math.imul($, ct)) | 0);
      var fn = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (fn >>> 26)) | 0),
        (fn &= 67108863),
        (b = Math.imul(ht, We)),
        (d = Math.imul(ht, ge)),
        (d = (d + Math.imul(Te, We)) | 0),
        (_ = Math.imul(Te, ge)),
        (b = (b + Math.imul(at, tt)) | 0),
        (d = (d + Math.imul(at, be)) | 0),
        (d = (d + Math.imul(_e, tt)) | 0),
        (_ = (_ + Math.imul(_e, be)) | 0),
        (b = (b + Math.imul(dt, vt)) | 0),
        (d = (d + Math.imul(dt, Ne)) | 0),
        (d = (d + Math.imul(ye, vt)) | 0),
        (_ = (_ + Math.imul(ye, Ne)) | 0),
        (b = (b + Math.imul(nt, gt)) | 0),
        (d = (d + Math.imul(nt, we)) | 0),
        (d = (d + Math.imul(pe, gt)) | 0),
        (_ = (_ + Math.imul(pe, we)) | 0),
        (b = (b + Math.imul(Ge, je)) | 0),
        (d = (d + Math.imul(Ge, Se)) | 0),
        (d = (d + Math.imul(ve, je)) | 0),
        (_ = (_ + Math.imul(ve, Se)) | 0),
        (b = (b + Math.imul(Ve, wt)) | 0),
        (d = (d + Math.imul(Ve, Me)) | 0),
        (d = (d + Math.imul(fe, wt)) | 0),
        (_ = (_ + Math.imul(fe, Me)) | 0),
        (b = (b + Math.imul(xe, Be)) | 0),
        (d = (d + Math.imul(xe, Ae)) | 0),
        (d = (d + Math.imul(he, Be)) | 0),
        (_ = (_ + Math.imul(he, Ae)) | 0),
        (b = (b + Math.imul(oe, _t)) | 0),
        (d = (d + Math.imul(oe, Oe)) | 0),
        (d = (d + Math.imul(te, _t)) | 0),
        (_ = (_ + Math.imul(te, Oe)) | 0),
        (b = (b + Math.imul(H, ze)) | 0),
        (d = (d + Math.imul(H, ct)) | 0),
        (d = (d + Math.imul(K, ze)) | 0),
        (_ = (_ + Math.imul(K, ct)) | 0);
      var un = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (un >>> 26)) | 0),
        (un &= 67108863),
        (b = Math.imul(ht, tt)),
        (d = Math.imul(ht, be)),
        (d = (d + Math.imul(Te, tt)) | 0),
        (_ = Math.imul(Te, be)),
        (b = (b + Math.imul(at, vt)) | 0),
        (d = (d + Math.imul(at, Ne)) | 0),
        (d = (d + Math.imul(_e, vt)) | 0),
        (_ = (_ + Math.imul(_e, Ne)) | 0),
        (b = (b + Math.imul(dt, gt)) | 0),
        (d = (d + Math.imul(dt, we)) | 0),
        (d = (d + Math.imul(ye, gt)) | 0),
        (_ = (_ + Math.imul(ye, we)) | 0),
        (b = (b + Math.imul(nt, je)) | 0),
        (d = (d + Math.imul(nt, Se)) | 0),
        (d = (d + Math.imul(pe, je)) | 0),
        (_ = (_ + Math.imul(pe, Se)) | 0),
        (b = (b + Math.imul(Ge, wt)) | 0),
        (d = (d + Math.imul(Ge, Me)) | 0),
        (d = (d + Math.imul(ve, wt)) | 0),
        (_ = (_ + Math.imul(ve, Me)) | 0),
        (b = (b + Math.imul(Ve, Be)) | 0),
        (d = (d + Math.imul(Ve, Ae)) | 0),
        (d = (d + Math.imul(fe, Be)) | 0),
        (_ = (_ + Math.imul(fe, Ae)) | 0),
        (b = (b + Math.imul(xe, _t)) | 0),
        (d = (d + Math.imul(xe, Oe)) | 0),
        (d = (d + Math.imul(he, _t)) | 0),
        (_ = (_ + Math.imul(he, Oe)) | 0),
        (b = (b + Math.imul(oe, ze)) | 0),
        (d = (d + Math.imul(oe, ct)) | 0),
        (d = (d + Math.imul(te, ze)) | 0),
        (_ = (_ + Math.imul(te, ct)) | 0);
      var Lr = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (Lr >>> 26)) | 0),
        (Lr &= 67108863),
        (b = Math.imul(ht, vt)),
        (d = Math.imul(ht, Ne)),
        (d = (d + Math.imul(Te, vt)) | 0),
        (_ = Math.imul(Te, Ne)),
        (b = (b + Math.imul(at, gt)) | 0),
        (d = (d + Math.imul(at, we)) | 0),
        (d = (d + Math.imul(_e, gt)) | 0),
        (_ = (_ + Math.imul(_e, we)) | 0),
        (b = (b + Math.imul(dt, je)) | 0),
        (d = (d + Math.imul(dt, Se)) | 0),
        (d = (d + Math.imul(ye, je)) | 0),
        (_ = (_ + Math.imul(ye, Se)) | 0),
        (b = (b + Math.imul(nt, wt)) | 0),
        (d = (d + Math.imul(nt, Me)) | 0),
        (d = (d + Math.imul(pe, wt)) | 0),
        (_ = (_ + Math.imul(pe, Me)) | 0),
        (b = (b + Math.imul(Ge, Be)) | 0),
        (d = (d + Math.imul(Ge, Ae)) | 0),
        (d = (d + Math.imul(ve, Be)) | 0),
        (_ = (_ + Math.imul(ve, Ae)) | 0),
        (b = (b + Math.imul(Ve, _t)) | 0),
        (d = (d + Math.imul(Ve, Oe)) | 0),
        (d = (d + Math.imul(fe, _t)) | 0),
        (_ = (_ + Math.imul(fe, Oe)) | 0),
        (b = (b + Math.imul(xe, ze)) | 0),
        (d = (d + Math.imul(xe, ct)) | 0),
        (d = (d + Math.imul(he, ze)) | 0),
        (_ = (_ + Math.imul(he, ct)) | 0);
      var vr = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (vr >>> 26)) | 0),
        (vr &= 67108863),
        (b = Math.imul(ht, gt)),
        (d = Math.imul(ht, we)),
        (d = (d + Math.imul(Te, gt)) | 0),
        (_ = Math.imul(Te, we)),
        (b = (b + Math.imul(at, je)) | 0),
        (d = (d + Math.imul(at, Se)) | 0),
        (d = (d + Math.imul(_e, je)) | 0),
        (_ = (_ + Math.imul(_e, Se)) | 0),
        (b = (b + Math.imul(dt, wt)) | 0),
        (d = (d + Math.imul(dt, Me)) | 0),
        (d = (d + Math.imul(ye, wt)) | 0),
        (_ = (_ + Math.imul(ye, Me)) | 0),
        (b = (b + Math.imul(nt, Be)) | 0),
        (d = (d + Math.imul(nt, Ae)) | 0),
        (d = (d + Math.imul(pe, Be)) | 0),
        (_ = (_ + Math.imul(pe, Ae)) | 0),
        (b = (b + Math.imul(Ge, _t)) | 0),
        (d = (d + Math.imul(Ge, Oe)) | 0),
        (d = (d + Math.imul(ve, _t)) | 0),
        (_ = (_ + Math.imul(ve, Oe)) | 0),
        (b = (b + Math.imul(Ve, ze)) | 0),
        (d = (d + Math.imul(Ve, ct)) | 0),
        (d = (d + Math.imul(fe, ze)) | 0),
        (_ = (_ + Math.imul(fe, ct)) | 0);
      var dn = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (dn >>> 26)) | 0),
        (dn &= 67108863),
        (b = Math.imul(ht, je)),
        (d = Math.imul(ht, Se)),
        (d = (d + Math.imul(Te, je)) | 0),
        (_ = Math.imul(Te, Se)),
        (b = (b + Math.imul(at, wt)) | 0),
        (d = (d + Math.imul(at, Me)) | 0),
        (d = (d + Math.imul(_e, wt)) | 0),
        (_ = (_ + Math.imul(_e, Me)) | 0),
        (b = (b + Math.imul(dt, Be)) | 0),
        (d = (d + Math.imul(dt, Ae)) | 0),
        (d = (d + Math.imul(ye, Be)) | 0),
        (_ = (_ + Math.imul(ye, Ae)) | 0),
        (b = (b + Math.imul(nt, _t)) | 0),
        (d = (d + Math.imul(nt, Oe)) | 0),
        (d = (d + Math.imul(pe, _t)) | 0),
        (_ = (_ + Math.imul(pe, Oe)) | 0),
        (b = (b + Math.imul(Ge, ze)) | 0),
        (d = (d + Math.imul(Ge, ct)) | 0),
        (d = (d + Math.imul(ve, ze)) | 0),
        (_ = (_ + Math.imul(ve, ct)) | 0);
      var Sr = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (Sr >>> 26)) | 0),
        (Sr &= 67108863),
        (b = Math.imul(ht, wt)),
        (d = Math.imul(ht, Me)),
        (d = (d + Math.imul(Te, wt)) | 0),
        (_ = Math.imul(Te, Me)),
        (b = (b + Math.imul(at, Be)) | 0),
        (d = (d + Math.imul(at, Ae)) | 0),
        (d = (d + Math.imul(_e, Be)) | 0),
        (_ = (_ + Math.imul(_e, Ae)) | 0),
        (b = (b + Math.imul(dt, _t)) | 0),
        (d = (d + Math.imul(dt, Oe)) | 0),
        (d = (d + Math.imul(ye, _t)) | 0),
        (_ = (_ + Math.imul(ye, Oe)) | 0),
        (b = (b + Math.imul(nt, ze)) | 0),
        (d = (d + Math.imul(nt, ct)) | 0),
        (d = (d + Math.imul(pe, ze)) | 0),
        (_ = (_ + Math.imul(pe, ct)) | 0);
      var ln = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (ln >>> 26)) | 0),
        (ln &= 67108863),
        (b = Math.imul(ht, Be)),
        (d = Math.imul(ht, Ae)),
        (d = (d + Math.imul(Te, Be)) | 0),
        (_ = Math.imul(Te, Ae)),
        (b = (b + Math.imul(at, _t)) | 0),
        (d = (d + Math.imul(at, Oe)) | 0),
        (d = (d + Math.imul(_e, _t)) | 0),
        (_ = (_ + Math.imul(_e, Oe)) | 0),
        (b = (b + Math.imul(dt, ze)) | 0),
        (d = (d + Math.imul(dt, ct)) | 0),
        (d = (d + Math.imul(ye, ze)) | 0),
        (_ = (_ + Math.imul(ye, ct)) | 0);
      var hn = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (hn >>> 26)) | 0),
        (hn &= 67108863),
        (b = Math.imul(ht, _t)),
        (d = Math.imul(ht, Oe)),
        (d = (d + Math.imul(Te, _t)) | 0),
        (_ = Math.imul(Te, Oe)),
        (b = (b + Math.imul(at, ze)) | 0),
        (d = (d + Math.imul(at, ct)) | 0),
        (d = (d + Math.imul(_e, ze)) | 0),
        (_ = (_ + Math.imul(_e, ct)) | 0);
      var zi = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      (u = (((_ + (d >>> 13)) | 0) + (zi >>> 26)) | 0),
        (zi &= 67108863),
        (b = Math.imul(ht, ze)),
        (d = Math.imul(ht, ct)),
        (d = (d + Math.imul(Te, ze)) | 0),
        (_ = Math.imul(Te, ct));
      var Gi = (((u + b) | 0) + ((d & 8191) << 13)) | 0;
      return (
        (u = (((_ + (d >>> 13)) | 0) + (Gi >>> 26)) | 0),
        (Gi &= 67108863),
        (g[0] = en),
        (g[1] = tn),
        (g[2] = rn),
        (g[3] = nn),
        (g[4] = er),
        (g[5] = an),
        (g[6] = sn),
        (g[7] = on),
        (g[8] = cn),
        (g[9] = fn),
        (g[10] = un),
        (g[11] = Lr),
        (g[12] = vr),
        (g[13] = dn),
        (g[14] = Sr),
        (g[15] = ln),
        (g[16] = hn),
        (g[17] = zi),
        (g[18] = Gi),
        u !== 0 && ((g[19] = u), v.length++),
        v
      );
    };
    Math.imul || (Z = j);
    function me(l, s, f) {
      (f.negative = s.negative ^ l.negative), (f.length = l.length + s.length);
      for (var v = 0, y = 0, E = 0; E < f.length - 1; E++) {
        var g = y;
        y = 0;
        for (
          var u = v & 67108863, b = Math.min(E, s.length - 1), d = Math.max(0, E - l.length + 1);
          d <= b;
          d++
        ) {
          var _ = E - d,
            O = l.words[_] | 0,
            D = s.words[d] | 0,
            $ = O * D,
            z = $ & 67108863;
          (g = (g + (($ / 67108864) | 0)) | 0),
            (z = (z + u) | 0),
            (u = z & 67108863),
            (g = (g + (z >>> 26)) | 0),
            (y += g >>> 26),
            (g &= 67108863);
        }
        (f.words[E] = u), (v = g), (g = y);
      }
      return v !== 0 ? (f.words[E] = v) : f.length--, f._strip();
    }
    function ue(l, s, f) {
      return me(l, s, f);
    }
    (a.prototype.mulTo = function (s, f) {
      var v,
        y = this.length + s.length;
      return (
        this.length === 10 && s.length === 10
          ? (v = Z(this, s, f))
          : y < 63
          ? (v = j(this, s, f))
          : y < 1024
          ? (v = me(this, s, f))
          : (v = ue(this, s, f)),
        v
      );
    }),
      (a.prototype.mul = function (s) {
        var f = new a(null);
        return (f.words = new Array(this.length + s.length)), this.mulTo(s, f);
      }),
      (a.prototype.mulf = function (s) {
        var f = new a(null);
        return (f.words = new Array(this.length + s.length)), ue(this, s, f);
      }),
      (a.prototype.imul = function (s) {
        return this.clone().mulTo(s, this);
      }),
      (a.prototype.imuln = function (s) {
        var f = s < 0;
        f && (s = -s), n(typeof s == 'number'), n(s < 67108864);
        for (var v = 0, y = 0; y < this.length; y++) {
          var E = (this.words[y] | 0) * s,
            g = (E & 67108863) + (v & 67108863);
          (v >>= 26), (v += (E / 67108864) | 0), (v += g >>> 26), (this.words[y] = g & 67108863);
        }
        return v !== 0 && ((this.words[y] = v), this.length++), f ? this.ineg() : this;
      }),
      (a.prototype.muln = function (s) {
        return this.clone().imuln(s);
      }),
      (a.prototype.sqr = function () {
        return this.mul(this);
      }),
      (a.prototype.isqr = function () {
        return this.imul(this.clone());
      }),
      (a.prototype.pow = function (s) {
        var f = F(s);
        if (f.length === 0) return new a(1);
        for (var v = this, y = 0; y < f.length && f[y] === 0; y++, v = v.sqr());
        if (++y < f.length)
          for (var E = v.sqr(); y < f.length; y++, E = E.sqr()) f[y] !== 0 && (v = v.mul(E));
        return v;
      }),
      (a.prototype.iushln = function (s) {
        n(typeof s == 'number' && s >= 0);
        var f = s % 26,
          v = (s - f) / 26,
          y = (67108863 >>> (26 - f)) << (26 - f),
          E;
        if (f !== 0) {
          var g = 0;
          for (E = 0; E < this.length; E++) {
            var u = this.words[E] & y,
              b = ((this.words[E] | 0) - u) << f;
            (this.words[E] = b | g), (g = u >>> (26 - f));
          }
          g && ((this.words[E] = g), this.length++);
        }
        if (v !== 0) {
          for (E = this.length - 1; E >= 0; E--) this.words[E + v] = this.words[E];
          for (E = 0; E < v; E++) this.words[E] = 0;
          this.length += v;
        }
        return this._strip();
      }),
      (a.prototype.ishln = function (s) {
        return n(this.negative === 0), this.iushln(s);
      }),
      (a.prototype.iushrn = function (s, f, v) {
        n(typeof s == 'number' && s >= 0);
        var y;
        f ? (y = (f - (f % 26)) / 26) : (y = 0);
        var E = s % 26,
          g = Math.min((s - E) / 26, this.length),
          u = 67108863 ^ ((67108863 >>> E) << E),
          b = v;
        if (((y -= g), (y = Math.max(0, y)), b)) {
          for (var d = 0; d < g; d++) b.words[d] = this.words[d];
          b.length = g;
        }
        if (g !== 0)
          if (this.length > g)
            for (this.length -= g, d = 0; d < this.length; d++) this.words[d] = this.words[d + g];
          else (this.words[0] = 0), (this.length = 1);
        var _ = 0;
        for (d = this.length - 1; d >= 0 && (_ !== 0 || d >= y); d--) {
          var O = this.words[d] | 0;
          (this.words[d] = (_ << (26 - E)) | (O >>> E)), (_ = O & u);
        }
        return (
          b && _ !== 0 && (b.words[b.length++] = _),
          this.length === 0 && ((this.words[0] = 0), (this.length = 1)),
          this._strip()
        );
      }),
      (a.prototype.ishrn = function (s, f, v) {
        return n(this.negative === 0), this.iushrn(s, f, v);
      }),
      (a.prototype.shln = function (s) {
        return this.clone().ishln(s);
      }),
      (a.prototype.ushln = function (s) {
        return this.clone().iushln(s);
      }),
      (a.prototype.shrn = function (s) {
        return this.clone().ishrn(s);
      }),
      (a.prototype.ushrn = function (s) {
        return this.clone().iushrn(s);
      }),
      (a.prototype.testn = function (s) {
        n(typeof s == 'number' && s >= 0);
        var f = s % 26,
          v = (s - f) / 26,
          y = 1 << f;
        if (this.length <= v) return !1;
        var E = this.words[v];
        return !!(E & y);
      }),
      (a.prototype.imaskn = function (s) {
        n(typeof s == 'number' && s >= 0);
        var f = s % 26,
          v = (s - f) / 26;
        if ((n(this.negative === 0, 'imaskn works only with positive numbers'), this.length <= v))
          return this;
        if ((f !== 0 && v++, (this.length = Math.min(v, this.length)), f !== 0)) {
          var y = 67108863 ^ ((67108863 >>> f) << f);
          this.words[this.length - 1] &= y;
        }
        return this._strip();
      }),
      (a.prototype.maskn = function (s) {
        return this.clone().imaskn(s);
      }),
      (a.prototype.iaddn = function (s) {
        return (
          n(typeof s == 'number'),
          n(s < 67108864),
          s < 0
            ? this.isubn(-s)
            : this.negative !== 0
            ? this.length === 1 && (this.words[0] | 0) <= s
              ? ((this.words[0] = s - (this.words[0] | 0)), (this.negative = 0), this)
              : ((this.negative = 0), this.isubn(s), (this.negative = 1), this)
            : this._iaddn(s)
        );
      }),
      (a.prototype._iaddn = function (s) {
        this.words[0] += s;
        for (var f = 0; f < this.length && this.words[f] >= 67108864; f++)
          (this.words[f] -= 67108864),
            f === this.length - 1 ? (this.words[f + 1] = 1) : this.words[f + 1]++;
        return (this.length = Math.max(this.length, f + 1)), this;
      }),
      (a.prototype.isubn = function (s) {
        if ((n(typeof s == 'number'), n(s < 67108864), s < 0)) return this.iaddn(-s);
        if (this.negative !== 0)
          return (this.negative = 0), this.iaddn(s), (this.negative = 1), this;
        if (((this.words[0] -= s), this.length === 1 && this.words[0] < 0))
          (this.words[0] = -this.words[0]), (this.negative = 1);
        else
          for (var f = 0; f < this.length && this.words[f] < 0; f++)
            (this.words[f] += 67108864), (this.words[f + 1] -= 1);
        return this._strip();
      }),
      (a.prototype.addn = function (s) {
        return this.clone().iaddn(s);
      }),
      (a.prototype.subn = function (s) {
        return this.clone().isubn(s);
      }),
      (a.prototype.iabs = function () {
        return (this.negative = 0), this;
      }),
      (a.prototype.abs = function () {
        return this.clone().iabs();
      }),
      (a.prototype._ishlnsubmul = function (s, f, v) {
        var y = s.length + v,
          E;
        this._expand(y);
        var g,
          u = 0;
        for (E = 0; E < s.length; E++) {
          g = (this.words[E + v] | 0) + u;
          var b = (s.words[E] | 0) * f;
          (g -= b & 67108863),
            (u = (g >> 26) - ((b / 67108864) | 0)),
            (this.words[E + v] = g & 67108863);
        }
        for (; E < this.length - v; E++)
          (g = (this.words[E + v] | 0) + u), (u = g >> 26), (this.words[E + v] = g & 67108863);
        if (u === 0) return this._strip();
        for (n(u === -1), u = 0, E = 0; E < this.length; E++)
          (g = -(this.words[E] | 0) + u), (u = g >> 26), (this.words[E] = g & 67108863);
        return (this.negative = 1), this._strip();
      }),
      (a.prototype._wordDiv = function (s, f) {
        var v = this.length - s.length,
          y = this.clone(),
          E = s,
          g = E.words[E.length - 1] | 0,
          u = this._countBits(g);
        (v = 26 - u), v !== 0 && ((E = E.ushln(v)), y.iushln(v), (g = E.words[E.length - 1] | 0));
        var b = y.length - E.length,
          d;
        if (f !== 'mod') {
          (d = new a(null)), (d.length = b + 1), (d.words = new Array(d.length));
          for (var _ = 0; _ < d.length; _++) d.words[_] = 0;
        }
        var O = y.clone()._ishlnsubmul(E, 1, b);
        O.negative === 0 && ((y = O), d && (d.words[b] = 1));
        for (var D = b - 1; D >= 0; D--) {
          var $ = (y.words[E.length + D] | 0) * 67108864 + (y.words[E.length + D - 1] | 0);
          for ($ = Math.min(($ / g) | 0, 67108863), y._ishlnsubmul(E, $, D); y.negative !== 0; )
            $--, (y.negative = 0), y._ishlnsubmul(E, 1, D), y.isZero() || (y.negative ^= 1);
          d && (d.words[D] = $);
        }
        return (
          d && d._strip(),
          y._strip(),
          f !== 'div' && v !== 0 && y.iushrn(v),
          { div: d || null, mod: y }
        );
      }),
      (a.prototype.divmod = function (s, f, v) {
        if ((n(!s.isZero()), this.isZero())) return { div: new a(0), mod: new a(0) };
        var y, E, g;
        return this.negative !== 0 && s.negative === 0
          ? ((g = this.neg().divmod(s, f)),
            f !== 'mod' && (y = g.div.neg()),
            f !== 'div' && ((E = g.mod.neg()), v && E.negative !== 0 && E.iadd(s)),
            { div: y, mod: E })
          : this.negative === 0 && s.negative !== 0
          ? ((g = this.divmod(s.neg(), f)),
            f !== 'mod' && (y = g.div.neg()),
            { div: y, mod: g.mod })
          : this.negative & s.negative
          ? ((g = this.neg().divmod(s.neg(), f)),
            f !== 'div' && ((E = g.mod.neg()), v && E.negative !== 0 && E.isub(s)),
            { div: g.div, mod: E })
          : s.length > this.length || this.cmp(s) < 0
          ? { div: new a(0), mod: this }
          : s.length === 1
          ? f === 'div'
            ? { div: this.divn(s.words[0]), mod: null }
            : f === 'mod'
            ? { div: null, mod: new a(this.modrn(s.words[0])) }
            : { div: this.divn(s.words[0]), mod: new a(this.modrn(s.words[0])) }
          : this._wordDiv(s, f);
      }),
      (a.prototype.div = function (s) {
        return this.divmod(s, 'div', !1).div;
      }),
      (a.prototype.mod = function (s) {
        return this.divmod(s, 'mod', !1).mod;
      }),
      (a.prototype.umod = function (s) {
        return this.divmod(s, 'mod', !0).mod;
      }),
      (a.prototype.divRound = function (s) {
        var f = this.divmod(s);
        if (f.mod.isZero()) return f.div;
        var v = f.div.negative !== 0 ? f.mod.isub(s) : f.mod,
          y = s.ushrn(1),
          E = s.andln(1),
          g = v.cmp(y);
        return g < 0 || (E === 1 && g === 0)
          ? f.div
          : f.div.negative !== 0
          ? f.div.isubn(1)
          : f.div.iaddn(1);
      }),
      (a.prototype.modrn = function (s) {
        var f = s < 0;
        f && (s = -s), n(s <= 67108863);
        for (var v = (1 << 26) % s, y = 0, E = this.length - 1; E >= 0; E--)
          y = (v * y + (this.words[E] | 0)) % s;
        return f ? -y : y;
      }),
      (a.prototype.modn = function (s) {
        return this.modrn(s);
      }),
      (a.prototype.idivn = function (s) {
        var f = s < 0;
        f && (s = -s), n(s <= 67108863);
        for (var v = 0, y = this.length - 1; y >= 0; y--) {
          var E = (this.words[y] | 0) + v * 67108864;
          (this.words[y] = (E / s) | 0), (v = E % s);
        }
        return this._strip(), f ? this.ineg() : this;
      }),
      (a.prototype.divn = function (s) {
        return this.clone().idivn(s);
      }),
      (a.prototype.egcd = function (s) {
        n(s.negative === 0), n(!s.isZero());
        var f = this,
          v = s.clone();
        f.negative !== 0 ? (f = f.umod(s)) : (f = f.clone());
        for (
          var y = new a(1), E = new a(0), g = new a(0), u = new a(1), b = 0;
          f.isEven() && v.isEven();

        )
          f.iushrn(1), v.iushrn(1), ++b;
        for (var d = v.clone(), _ = f.clone(); !f.isZero(); ) {
          for (var O = 0, D = 1; !(f.words[0] & D) && O < 26; ++O, D <<= 1);
          if (O > 0)
            for (f.iushrn(O); O-- > 0; )
              (y.isOdd() || E.isOdd()) && (y.iadd(d), E.isub(_)), y.iushrn(1), E.iushrn(1);
          for (var $ = 0, z = 1; !(v.words[0] & z) && $ < 26; ++$, z <<= 1);
          if ($ > 0)
            for (v.iushrn($); $-- > 0; )
              (g.isOdd() || u.isOdd()) && (g.iadd(d), u.isub(_)), g.iushrn(1), u.iushrn(1);
          f.cmp(v) >= 0 ? (f.isub(v), y.isub(g), E.isub(u)) : (v.isub(f), g.isub(y), u.isub(E));
        }
        return { a: g, b: u, gcd: v.iushln(b) };
      }),
      (a.prototype._invmp = function (s) {
        n(s.negative === 0), n(!s.isZero());
        var f = this,
          v = s.clone();
        f.negative !== 0 ? (f = f.umod(s)) : (f = f.clone());
        for (var y = new a(1), E = new a(0), g = v.clone(); f.cmpn(1) > 0 && v.cmpn(1) > 0; ) {
          for (var u = 0, b = 1; !(f.words[0] & b) && u < 26; ++u, b <<= 1);
          if (u > 0) for (f.iushrn(u); u-- > 0; ) y.isOdd() && y.iadd(g), y.iushrn(1);
          for (var d = 0, _ = 1; !(v.words[0] & _) && d < 26; ++d, _ <<= 1);
          if (d > 0) for (v.iushrn(d); d-- > 0; ) E.isOdd() && E.iadd(g), E.iushrn(1);
          f.cmp(v) >= 0 ? (f.isub(v), y.isub(E)) : (v.isub(f), E.isub(y));
        }
        var O;
        return f.cmpn(1) === 0 ? (O = y) : (O = E), O.cmpn(0) < 0 && O.iadd(s), O;
      }),
      (a.prototype.gcd = function (s) {
        if (this.isZero()) return s.abs();
        if (s.isZero()) return this.abs();
        var f = this.clone(),
          v = s.clone();
        (f.negative = 0), (v.negative = 0);
        for (var y = 0; f.isEven() && v.isEven(); y++) f.iushrn(1), v.iushrn(1);
        do {
          for (; f.isEven(); ) f.iushrn(1);
          for (; v.isEven(); ) v.iushrn(1);
          var E = f.cmp(v);
          if (E < 0) {
            var g = f;
            (f = v), (v = g);
          } else if (E === 0 || v.cmpn(1) === 0) break;
          f.isub(v);
        } while (!0);
        return v.iushln(y);
      }),
      (a.prototype.invm = function (s) {
        return this.egcd(s).a.umod(s);
      }),
      (a.prototype.isEven = function () {
        return (this.words[0] & 1) === 0;
      }),
      (a.prototype.isOdd = function () {
        return (this.words[0] & 1) === 1;
      }),
      (a.prototype.andln = function (s) {
        return this.words[0] & s;
      }),
      (a.prototype.bincn = function (s) {
        n(typeof s == 'number');
        var f = s % 26,
          v = (s - f) / 26,
          y = 1 << f;
        if (this.length <= v) return this._expand(v + 1), (this.words[v] |= y), this;
        for (var E = y, g = v; E !== 0 && g < this.length; g++) {
          var u = this.words[g] | 0;
          (u += E), (E = u >>> 26), (u &= 67108863), (this.words[g] = u);
        }
        return E !== 0 && ((this.words[g] = E), this.length++), this;
      }),
      (a.prototype.isZero = function () {
        return this.length === 1 && this.words[0] === 0;
      }),
      (a.prototype.cmpn = function (s) {
        var f = s < 0;
        if (this.negative !== 0 && !f) return -1;
        if (this.negative === 0 && f) return 1;
        this._strip();
        var v;
        if (this.length > 1) v = 1;
        else {
          f && (s = -s), n(s <= 67108863, 'Number is too big');
          var y = this.words[0] | 0;
          v = y === s ? 0 : y < s ? -1 : 1;
        }
        return this.negative !== 0 ? -v | 0 : v;
      }),
      (a.prototype.cmp = function (s) {
        if (this.negative !== 0 && s.negative === 0) return -1;
        if (this.negative === 0 && s.negative !== 0) return 1;
        var f = this.ucmp(s);
        return this.negative !== 0 ? -f | 0 : f;
      }),
      (a.prototype.ucmp = function (s) {
        if (this.length > s.length) return 1;
        if (this.length < s.length) return -1;
        for (var f = 0, v = this.length - 1; v >= 0; v--) {
          var y = this.words[v] | 0,
            E = s.words[v] | 0;
          if (y !== E) {
            y < E ? (f = -1) : y > E && (f = 1);
            break;
          }
        }
        return f;
      }),
      (a.prototype.gtn = function (s) {
        return this.cmpn(s) === 1;
      }),
      (a.prototype.gt = function (s) {
        return this.cmp(s) === 1;
      }),
      (a.prototype.gten = function (s) {
        return this.cmpn(s) >= 0;
      }),
      (a.prototype.gte = function (s) {
        return this.cmp(s) >= 0;
      }),
      (a.prototype.ltn = function (s) {
        return this.cmpn(s) === -1;
      }),
      (a.prototype.lt = function (s) {
        return this.cmp(s) === -1;
      }),
      (a.prototype.lten = function (s) {
        return this.cmpn(s) <= 0;
      }),
      (a.prototype.lte = function (s) {
        return this.cmp(s) <= 0;
      }),
      (a.prototype.eqn = function (s) {
        return this.cmpn(s) === 0;
      }),
      (a.prototype.eq = function (s) {
        return this.cmp(s) === 0;
      }),
      (a.red = function (s) {
        return new N(s);
      }),
      (a.prototype.toRed = function (s) {
        return (
          n(!this.red, 'Already a number in reduction context'),
          n(this.negative === 0, 'red works only with positives'),
          s.convertTo(this)._forceRed(s)
        );
      }),
      (a.prototype.fromRed = function () {
        return (
          n(this.red, 'fromRed works only with numbers in reduction context'),
          this.red.convertFrom(this)
        );
      }),
      (a.prototype._forceRed = function (s) {
        return (this.red = s), this;
      }),
      (a.prototype.forceRed = function (s) {
        return n(!this.red, 'Already a number in reduction context'), this._forceRed(s);
      }),
      (a.prototype.redAdd = function (s) {
        return n(this.red, 'redAdd works only with red numbers'), this.red.add(this, s);
      }),
      (a.prototype.redIAdd = function (s) {
        return n(this.red, 'redIAdd works only with red numbers'), this.red.iadd(this, s);
      }),
      (a.prototype.redSub = function (s) {
        return n(this.red, 'redSub works only with red numbers'), this.red.sub(this, s);
      }),
      (a.prototype.redISub = function (s) {
        return n(this.red, 'redISub works only with red numbers'), this.red.isub(this, s);
      }),
      (a.prototype.redShl = function (s) {
        return n(this.red, 'redShl works only with red numbers'), this.red.shl(this, s);
      }),
      (a.prototype.redMul = function (s) {
        return (
          n(this.red, 'redMul works only with red numbers'),
          this.red._verify2(this, s),
          this.red.mul(this, s)
        );
      }),
      (a.prototype.redIMul = function (s) {
        return (
          n(this.red, 'redMul works only with red numbers'),
          this.red._verify2(this, s),
          this.red.imul(this, s)
        );
      }),
      (a.prototype.redSqr = function () {
        return (
          n(this.red, 'redSqr works only with red numbers'),
          this.red._verify1(this),
          this.red.sqr(this)
        );
      }),
      (a.prototype.redISqr = function () {
        return (
          n(this.red, 'redISqr works only with red numbers'),
          this.red._verify1(this),
          this.red.isqr(this)
        );
      }),
      (a.prototype.redSqrt = function () {
        return (
          n(this.red, 'redSqrt works only with red numbers'),
          this.red._verify1(this),
          this.red.sqrt(this)
        );
      }),
      (a.prototype.redInvm = function () {
        return (
          n(this.red, 'redInvm works only with red numbers'),
          this.red._verify1(this),
          this.red.invm(this)
        );
      }),
      (a.prototype.redNeg = function () {
        return (
          n(this.red, 'redNeg works only with red numbers'),
          this.red._verify1(this),
          this.red.neg(this)
        );
      }),
      (a.prototype.redPow = function (s) {
        return (
          n(this.red && !s.red, 'redPow(normalNum)'), this.red._verify1(this), this.red.pow(this, s)
        );
      });
    var X = { k256: null, p224: null, p192: null, p25519: null };
    function J(l, s) {
      (this.name = l),
        (this.p = new a(s, 16)),
        (this.n = this.p.bitLength()),
        (this.k = new a(1).iushln(this.n).isub(this.p)),
        (this.tmp = this._tmp());
    }
    (J.prototype._tmp = function () {
      var s = new a(null);
      return (s.words = new Array(Math.ceil(this.n / 13))), s;
    }),
      (J.prototype.ireduce = function (s) {
        var f = s,
          v;
        do
          this.split(f, this.tmp), (f = this.imulK(f)), (f = f.iadd(this.tmp)), (v = f.bitLength());
        while (v > this.n);
        var y = v < this.n ? -1 : f.ucmp(this.p);
        return (
          y === 0
            ? ((f.words[0] = 0), (f.length = 1))
            : y > 0
            ? f.isub(this.p)
            : f.strip !== void 0
            ? f.strip()
            : f._strip(),
          f
        );
      }),
      (J.prototype.split = function (s, f) {
        s.iushrn(this.n, 0, f);
      }),
      (J.prototype.imulK = function (s) {
        return s.imul(this.k);
      });
    function Q() {
      J.call(
        this,
        'k256',
        'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f'
      );
    }
    i(Q, J),
      (Q.prototype.split = function (s, f) {
        for (var v = 4194303, y = Math.min(s.length, 9), E = 0; E < y; E++) f.words[E] = s.words[E];
        if (((f.length = y), s.length <= 9)) {
          (s.words[0] = 0), (s.length = 1);
          return;
        }
        var g = s.words[9];
        for (f.words[f.length++] = g & v, E = 10; E < s.length; E++) {
          var u = s.words[E] | 0;
          (s.words[E - 10] = ((u & v) << 4) | (g >>> 22)), (g = u);
        }
        (g >>>= 22),
          (s.words[E - 10] = g),
          g === 0 && s.length > 10 ? (s.length -= 10) : (s.length -= 9);
      }),
      (Q.prototype.imulK = function (s) {
        (s.words[s.length] = 0), (s.words[s.length + 1] = 0), (s.length += 2);
        for (var f = 0, v = 0; v < s.length; v++) {
          var y = s.words[v] | 0;
          (f += y * 977), (s.words[v] = f & 67108863), (f = y * 64 + ((f / 67108864) | 0));
        }
        return (
          s.words[s.length - 1] === 0 && (s.length--, s.words[s.length - 1] === 0 && s.length--), s
        );
      });
    function re() {
      J.call(this, 'p224', 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
    }
    i(re, J);
    function R() {
      J.call(this, 'p192', 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
    }
    i(R, J);
    function q() {
      J.call(this, '25519', '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
    }
    i(q, J),
      (q.prototype.imulK = function (s) {
        for (var f = 0, v = 0; v < s.length; v++) {
          var y = (s.words[v] | 0) * 19 + f,
            E = y & 67108863;
          (y >>>= 26), (s.words[v] = E), (f = y);
        }
        return f !== 0 && (s.words[s.length++] = f), s;
      }),
      (a._prime = function (s) {
        if (X[s]) return X[s];
        var f;
        if (s === 'k256') f = new Q();
        else if (s === 'p224') f = new re();
        else if (s === 'p192') f = new R();
        else if (s === 'p25519') f = new q();
        else throw new Error('Unknown prime ' + s);
        return (X[s] = f), f;
      });
    function N(l) {
      if (typeof l == 'string') {
        var s = a._prime(l);
        (this.m = s.p), (this.prime = s);
      } else n(l.gtn(1), 'modulus must be greater than 1'), (this.m = l), (this.prime = null);
    }
    (N.prototype._verify1 = function (s) {
      n(s.negative === 0, 'red works only with positives'),
        n(s.red, 'red works only with red numbers');
    }),
      (N.prototype._verify2 = function (s, f) {
        n((s.negative | f.negative) === 0, 'red works only with positives'),
          n(s.red && s.red === f.red, 'red works only with red numbers');
      }),
      (N.prototype.imod = function (s) {
        return this.prime
          ? this.prime.ireduce(s)._forceRed(this)
          : (w(s, s.umod(this.m)._forceRed(this)), s);
      }),
      (N.prototype.neg = function (s) {
        return s.isZero() ? s.clone() : this.m.sub(s)._forceRed(this);
      }),
      (N.prototype.add = function (s, f) {
        this._verify2(s, f);
        var v = s.add(f);
        return v.cmp(this.m) >= 0 && v.isub(this.m), v._forceRed(this);
      }),
      (N.prototype.iadd = function (s, f) {
        this._verify2(s, f);
        var v = s.iadd(f);
        return v.cmp(this.m) >= 0 && v.isub(this.m), v;
      }),
      (N.prototype.sub = function (s, f) {
        this._verify2(s, f);
        var v = s.sub(f);
        return v.cmpn(0) < 0 && v.iadd(this.m), v._forceRed(this);
      }),
      (N.prototype.isub = function (s, f) {
        this._verify2(s, f);
        var v = s.isub(f);
        return v.cmpn(0) < 0 && v.iadd(this.m), v;
      }),
      (N.prototype.shl = function (s, f) {
        return this._verify1(s), this.imod(s.ushln(f));
      }),
      (N.prototype.imul = function (s, f) {
        return this._verify2(s, f), this.imod(s.imul(f));
      }),
      (N.prototype.mul = function (s, f) {
        return this._verify2(s, f), this.imod(s.mul(f));
      }),
      (N.prototype.isqr = function (s) {
        return this.imul(s, s.clone());
      }),
      (N.prototype.sqr = function (s) {
        return this.mul(s, s);
      }),
      (N.prototype.sqrt = function (s) {
        if (s.isZero()) return s.clone();
        var f = this.m.andln(3);
        if ((n(f % 2 === 1), f === 3)) {
          var v = this.m.add(new a(1)).iushrn(2);
          return this.pow(s, v);
        }
        for (var y = this.m.subn(1), E = 0; !y.isZero() && y.andln(1) === 0; ) E++, y.iushrn(1);
        n(!y.isZero());
        var g = new a(1).toRed(this),
          u = g.redNeg(),
          b = this.m.subn(1).iushrn(1),
          d = this.m.bitLength();
        for (d = new a(2 * d * d).toRed(this); this.pow(d, b).cmp(u) !== 0; ) d.redIAdd(u);
        for (
          var _ = this.pow(d, y), O = this.pow(s, y.addn(1).iushrn(1)), D = this.pow(s, y), $ = E;
          D.cmp(g) !== 0;

        ) {
          for (var z = D, H = 0; z.cmp(g) !== 0; H++) z = z.redSqr();
          n(H < $);
          var K = this.pow(_, new a(1).iushln($ - H - 1));
          (O = O.redMul(K)), (_ = K.redSqr()), (D = D.redMul(_)), ($ = H);
        }
        return O;
      }),
      (N.prototype.invm = function (s) {
        var f = s._invmp(this.m);
        return f.negative !== 0 ? ((f.negative = 0), this.imod(f).redNeg()) : this.imod(f);
      }),
      (N.prototype.pow = function (s, f) {
        if (f.isZero()) return new a(1).toRed(this);
        if (f.cmpn(1) === 0) return s.clone();
        var v = 4,
          y = new Array(1 << v);
        (y[0] = new a(1).toRed(this)), (y[1] = s);
        for (var E = 2; E < y.length; E++) y[E] = this.mul(y[E - 1], s);
        var g = y[0],
          u = 0,
          b = 0,
          d = f.bitLength() % 26;
        for (d === 0 && (d = 26), E = f.length - 1; E >= 0; E--) {
          for (var _ = f.words[E], O = d - 1; O >= 0; O--) {
            var D = (_ >> O) & 1;
            if ((g !== y[0] && (g = this.sqr(g)), D === 0 && u === 0)) {
              b = 0;
              continue;
            }
            (u <<= 1),
              (u |= D),
              b++,
              !(b !== v && (E !== 0 || O !== 0)) && ((g = this.mul(g, y[u])), (b = 0), (u = 0));
          }
          d = 26;
        }
        return g;
      }),
      (N.prototype.convertTo = function (s) {
        var f = s.umod(this.m);
        return f === s ? f.clone() : f;
      }),
      (N.prototype.convertFrom = function (s) {
        var f = s.clone();
        return (f.red = null), f;
      }),
      (a.mont = function (s) {
        return new p(s);
      });
    function p(l) {
      N.call(this, l),
        (this.shift = this.m.bitLength()),
        this.shift % 26 !== 0 && (this.shift += 26 - (this.shift % 26)),
        (this.r = new a(1).iushln(this.shift)),
        (this.r2 = this.imod(this.r.sqr())),
        (this.rinv = this.r._invmp(this.m)),
        (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
        (this.minv = this.minv.umod(this.r)),
        (this.minv = this.r.sub(this.minv));
    }
    i(p, N),
      (p.prototype.convertTo = function (s) {
        return this.imod(s.ushln(this.shift));
      }),
      (p.prototype.convertFrom = function (s) {
        var f = this.imod(s.mul(this.rinv));
        return (f.red = null), f;
      }),
      (p.prototype.imul = function (s, f) {
        if (s.isZero() || f.isZero()) return (s.words[0] = 0), (s.length = 1), s;
        var v = s.imul(f),
          y = v.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
          E = v.isub(y).iushrn(this.shift),
          g = E;
        return (
          E.cmp(this.m) >= 0 ? (g = E.isub(this.m)) : E.cmpn(0) < 0 && (g = E.iadd(this.m)),
          g._forceRed(this)
        );
      }),
      (p.prototype.mul = function (s, f) {
        if (s.isZero() || f.isZero()) return new a(0)._forceRed(this);
        var v = s.mul(f),
          y = v.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
          E = v.isub(y).iushrn(this.shift),
          g = E;
        return (
          E.cmp(this.m) >= 0 ? (g = E.isub(this.m)) : E.cmpn(0) < 0 && (g = E.iadd(this.m)),
          g._forceRed(this)
        );
      }),
      (p.prototype.invm = function (s) {
        var f = this.imod(s._invmp(this.m).mul(this.r2));
        return f._forceRed(this);
      });
  })(t, se);
})($h);
function Ph(t, e) {
  let { precision: r = 9, minPrecision: n = 3 } = e || {},
    [i = '0', a = '0'] = String(t || '0.0').split('.'),
    o = /(\d)(?=(\d{3})+\b)/g,
    c = i.replace(o, '$1,'),
    h = a.slice(0, r);
  if (n < r) {
    let w = h.match(/.*[1-9]{1}/),
      x = w?.[0].length || 0,
      T = Math.max(n, x);
    h = h.slice(0, T);
  }
  let m = h ? `.${h}` : '';
  return `${c}${m}`;
}
var qt = class extends oi {
    constructor(e, r, n) {
      if (qt.isBN(e)) {
        super(e.toArray(), r, n);
        return;
      }
      if (typeof e == 'string' && e.slice(0, 2) === '0x') {
        super(e.substring(2), r || 'hex', n);
        return;
      }
      let i = e ?? 0;
      super(i, r, n);
    }
    toString(e, r) {
      let n = super.toString(e, r);
      return e === 16 || e === 'hex' ? `0x${n}` : n;
    }
    toHex(e) {
      let r = (e || 0) * 2;
      if (this.isNeg()) throw new Error('cannot convert negative value to hex');
      if (e && this.byteLength() > e) throw new Error(`value ${this} exceeds bytes ${e}`);
      return this.toString(16, r);
    }
    toBytes(e) {
      if (this.isNeg()) throw new Error('cannot convert negative value to Bytes');
      return Uint8Array.from(this.toArray(void 0, e));
    }
    toJSON() {
      return this.toString(16);
    }
    valueOf() {
      return this.toString();
    }
    format(e) {
      let { units: r = 9, precision: n = 9, minPrecision: i = 3 } = e || {},
        a = this.formatUnits(r),
        o = Ph(a, { precision: n, minPrecision: i });
      if (!parseFloat(o)) {
        let [, c = '0'] = a.split('.'),
          h = c.match(/[1-9]/);
        if (h && h.index && h.index + 1 > n) {
          let [m = '0'] = o.split('.');
          return `${m}.${c.slice(0, h.index + 1)}`;
        }
      }
      return o;
    }
    formatUnits(e = 9) {
      let r = this.toString().slice(0, e * -1),
        n = this.toString().slice(e * -1),
        i = n.length,
        a = Array.from({ length: e - i })
          .fill('0')
          .join('');
      return `${r ? `${r}.` : '0.'}${a}${n}`;
    }
    add(e) {
      return this.caller(e, 'add');
    }
    pow(e) {
      return this.caller(e, 'pow');
    }
    sub(e) {
      return this.caller(e, 'sub');
    }
    div(e) {
      return this.caller(e, 'div');
    }
    mul(e) {
      return this.caller(e, 'mul');
    }
    mod(e) {
      return this.caller(e, 'mod');
    }
    divRound(e) {
      return this.caller(e, 'divRound');
    }
    lt(e) {
      return this.caller(e, 'lt');
    }
    lte(e) {
      return this.caller(e, 'lte');
    }
    gt(e) {
      return this.caller(e, 'gt');
    }
    gte(e) {
      return this.caller(e, 'gte');
    }
    eq(e) {
      return this.caller(e, 'eq');
    }
    cmp(e) {
      return this.caller(e, 'cmp');
    }
    sqr() {
      return new qt(super.sqr().toArray());
    }
    neg() {
      return new qt(super.neg().toArray());
    }
    abs() {
      return new qt(super.abs().toArray());
    }
    toTwos(e) {
      return new qt(super.toTwos(e).toArray());
    }
    fromTwos(e) {
      return new qt(super.fromTwos(e).toArray());
    }
    caller(e, r) {
      let n = super[r](new qt(e));
      return qt.isBN(n) ? new qt(n.toArray()) : n;
    }
    clone() {
      return new qt(this.toArray());
    }
    mulTo(e, r) {
      let n = new oi(this.toArray()).mulTo(e, r);
      return new qt(n.toArray());
    }
    egcd(e) {
      let { a: r, b: n, gcd: i } = new oi(this.toArray()).egcd(e);
      return { a: new qt(r.toArray()), b: new qt(n.toArray()), gcd: new qt(i.toArray()) };
    }
    divmod(e, r, n) {
      let { div: i, mod: a } = new oi(this.toArray()).divmod(new qt(e), r, n);
      return { div: new qt(i?.toArray()), mod: new qt(a?.toArray()) };
    }
  },
  G = (t, e, r) => new qt(t, e, r);
G.parseUnits = (t, e = 9) => {
  let r = t === '.' ? '0.' : t,
    [n = '0', i = '0'] = r.split('.'),
    a = i.length;
  if (a > e) throw new Error("Decimal can't be bigger than the units");
  let o = Array.from({ length: e }).fill('0');
  o.splice(0, a, i);
  let c = `${n.replaceAll(',', '')}${o.join('')}`;
  return G(c);
};
function Fr(t) {
  return G(t).toNumber();
}
function fc(t, e) {
  return G(t).toHex(e);
}
function zr(t, e) {
  return G(t).toBytes(e);
}
function Lh(...t) {
  return t.reduce((e, r) => (G(r).gt(e) ? G(r) : e), G(0));
}
function Fh(...t) {
  return G(Math.ceil(t.reduce((e, r) => G(e).mul(r), G(1)).toNumber()));
}
const Uh = 'strings/5.7.0',
  Xu = new Le(Uh);
var cs;
(function (t) {
  (t.current = ''), (t.NFC = 'NFC'), (t.NFD = 'NFD'), (t.NFKC = 'NFKC'), (t.NFKD = 'NFKD');
})(cs || (cs = {}));
var or;
(function (t) {
  (t.UNEXPECTED_CONTINUE = 'unexpected continuation byte'),
    (t.BAD_PREFIX = 'bad codepoint prefix'),
    (t.OVERRUN = 'string overrun'),
    (t.MISSING_CONTINUE = 'missing continuation byte'),
    (t.OUT_OF_RANGE = 'out of UTF-8 range'),
    (t.UTF16_SURROGATE = 'UTF-16 surrogate'),
    (t.OVERLONG = 'overlong representation');
})(or || (or = {}));
function qh(t, e, r, n, i) {
  return Xu.throwArgumentError(`invalid codepoint at offset ${e}; ${t}`, 'bytes', r);
}
function Zu(t, e, r, n, i) {
  if (t === or.BAD_PREFIX || t === or.UNEXPECTED_CONTINUE) {
    let a = 0;
    for (let o = e + 1; o < r.length && r[o] >> 6 === 2; o++) a++;
    return a;
  }
  return t === or.OVERRUN ? r.length - e - 1 : 0;
}
function Bh(t, e, r, n, i) {
  return t === or.OVERLONG ? (n.push(i), 0) : (n.push(65533), Zu(t, e, r));
}
const Vh = Object.freeze({ error: qh, ignore: Zu, replace: Bh });
function jh(t, e) {
  e == null && (e = Vh.error), (t = Y(t));
  const r = [];
  let n = 0;
  for (; n < t.length; ) {
    const i = t[n++];
    if (!(i >> 7)) {
      r.push(i);
      continue;
    }
    let a = null,
      o = null;
    if ((i & 224) === 192) (a = 1), (o = 127);
    else if ((i & 240) === 224) (a = 2), (o = 2047);
    else if ((i & 248) === 240) (a = 3), (o = 65535);
    else {
      (i & 192) === 128
        ? (n += e(or.UNEXPECTED_CONTINUE, n - 1, t, r))
        : (n += e(or.BAD_PREFIX, n - 1, t, r));
      continue;
    }
    if (n - 1 + a >= t.length) {
      n += e(or.OVERRUN, n - 1, t, r);
      continue;
    }
    let c = i & ((1 << (8 - a - 1)) - 1);
    for (let h = 0; h < a; h++) {
      let m = t[n];
      if ((m & 192) != 128) {
        (n += e(or.MISSING_CONTINUE, n, t, r)), (c = null);
        break;
      }
      (c = (c << 6) | (m & 63)), n++;
    }
    if (c !== null) {
      if (c > 1114111) {
        n += e(or.OUT_OF_RANGE, n - 1 - a, t, r, c);
        continue;
      }
      if (c >= 55296 && c <= 57343) {
        n += e(or.UTF16_SURROGATE, n - 1 - a, t, r, c);
        continue;
      }
      if (c <= o) {
        n += e(or.OVERLONG, n - 1 - a, t, r, c);
        continue;
      }
      r.push(c);
    }
  }
  return r;
}
function zh(t, e = cs.current) {
  e != cs.current && (Xu.checkNormalize(), (t = t.normalize(e)));
  let r = [];
  for (let n = 0; n < t.length; n++) {
    const i = t.charCodeAt(n);
    if (i < 128) r.push(i);
    else if (i < 2048) r.push((i >> 6) | 192), r.push((i & 63) | 128);
    else if ((i & 64512) == 55296) {
      n++;
      const a = t.charCodeAt(n);
      if (n >= t.length || (a & 64512) !== 56320) throw new Error('invalid utf-8 string');
      const o = 65536 + ((i & 1023) << 10) + (a & 1023);
      r.push((o >> 18) | 240),
        r.push(((o >> 12) & 63) | 128),
        r.push(((o >> 6) & 63) | 128),
        r.push((o & 63) | 128);
    } else r.push((i >> 12) | 224), r.push(((i >> 6) & 63) | 128), r.push((i & 63) | 128);
  }
  return Y(r);
}
function Gh(t) {
  return t
    .map((e) =>
      e <= 65535
        ? String.fromCharCode(e)
        : ((e -= 65536), String.fromCharCode(((e >> 10) & 1023) + 55296, (e & 1023) + 56320))
    )
    .join('');
}
function Jh(t, e) {
  return Gh(jh(t, e));
}
const Hh = 'properties/5.7.0';
globalThis && globalThis.__awaiter;
new Le(Hh);
function Ua(t, e, r) {
  Object.defineProperty(t, e, { enumerable: !0, value: r, writable: !1 });
}
var On = {},
  Pe = {},
  Xn = ed;
function ed(t, e) {
  if (!t) throw new Error(e || 'Assertion failed');
}
ed.equal = function (e, r, n) {
  if (e != r) throw new Error(n || 'Assertion failed: ' + e + ' != ' + r);
};
var bi = {},
  Nf = {
    get exports() {
      return bi;
    },
    set exports(t) {
      bi = t;
    },
  };
typeof Object.create == 'function'
  ? (Nf.exports = function (e, r) {
      r &&
        ((e.super_ = r),
        (e.prototype = Object.create(r.prototype, {
          constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
        })));
    })
  : (Nf.exports = function (e, r) {
      if (r) {
        e.super_ = r;
        var n = function () {};
        (n.prototype = r.prototype), (e.prototype = new n()), (e.prototype.constructor = e);
      }
    });
var Wh = Xn,
  Kh = bi;
Pe.inherits = Kh;
function Qh(t, e) {
  return (t.charCodeAt(e) & 64512) !== 55296 || e < 0 || e + 1 >= t.length
    ? !1
    : (t.charCodeAt(e + 1) & 64512) === 56320;
}
function Yh(t, e) {
  if (Array.isArray(t)) return t.slice();
  if (!t) return [];
  var r = [];
  if (typeof t == 'string')
    if (e) {
      if (e === 'hex')
        for (
          t = t.replace(/[^a-z0-9]+/gi, ''), t.length % 2 !== 0 && (t = '0' + t), i = 0;
          i < t.length;
          i += 2
        )
          r.push(parseInt(t[i] + t[i + 1], 16));
    } else
      for (var n = 0, i = 0; i < t.length; i++) {
        var a = t.charCodeAt(i);
        a < 128
          ? (r[n++] = a)
          : a < 2048
          ? ((r[n++] = (a >> 6) | 192), (r[n++] = (a & 63) | 128))
          : Qh(t, i)
          ? ((a = 65536 + ((a & 1023) << 10) + (t.charCodeAt(++i) & 1023)),
            (r[n++] = (a >> 18) | 240),
            (r[n++] = ((a >> 12) & 63) | 128),
            (r[n++] = ((a >> 6) & 63) | 128),
            (r[n++] = (a & 63) | 128))
          : ((r[n++] = (a >> 12) | 224),
            (r[n++] = ((a >> 6) & 63) | 128),
            (r[n++] = (a & 63) | 128));
      }
  else for (i = 0; i < t.length; i++) r[i] = t[i] | 0;
  return r;
}
Pe.toArray = Yh;
function Xh(t) {
  for (var e = '', r = 0; r < t.length; r++) e += rd(t[r].toString(16));
  return e;
}
Pe.toHex = Xh;
function td(t) {
  var e = (t >>> 24) | ((t >>> 8) & 65280) | ((t << 8) & 16711680) | ((t & 255) << 24);
  return e >>> 0;
}
Pe.htonl = td;
function Zh(t, e) {
  for (var r = '', n = 0; n < t.length; n++) {
    var i = t[n];
    e === 'little' && (i = td(i)), (r += nd(i.toString(16)));
  }
  return r;
}
Pe.toHex32 = Zh;
function rd(t) {
  return t.length === 1 ? '0' + t : t;
}
Pe.zero2 = rd;
function nd(t) {
  return t.length === 7
    ? '0' + t
    : t.length === 6
    ? '00' + t
    : t.length === 5
    ? '000' + t
    : t.length === 4
    ? '0000' + t
    : t.length === 3
    ? '00000' + t
    : t.length === 2
    ? '000000' + t
    : t.length === 1
    ? '0000000' + t
    : t;
}
Pe.zero8 = nd;
function ep(t, e, r, n) {
  var i = r - e;
  Wh(i % 4 === 0);
  for (var a = new Array(i / 4), o = 0, c = e; o < a.length; o++, c += 4) {
    var h;
    n === 'big'
      ? (h = (t[c] << 24) | (t[c + 1] << 16) | (t[c + 2] << 8) | t[c + 3])
      : (h = (t[c + 3] << 24) | (t[c + 2] << 16) | (t[c + 1] << 8) | t[c]),
      (a[o] = h >>> 0);
  }
  return a;
}
Pe.join32 = ep;
function tp(t, e) {
  for (var r = new Array(t.length * 4), n = 0, i = 0; n < t.length; n++, i += 4) {
    var a = t[n];
    e === 'big'
      ? ((r[i] = a >>> 24),
        (r[i + 1] = (a >>> 16) & 255),
        (r[i + 2] = (a >>> 8) & 255),
        (r[i + 3] = a & 255))
      : ((r[i + 3] = a >>> 24),
        (r[i + 2] = (a >>> 16) & 255),
        (r[i + 1] = (a >>> 8) & 255),
        (r[i] = a & 255));
  }
  return r;
}
Pe.split32 = tp;
function rp(t, e) {
  return (t >>> e) | (t << (32 - e));
}
Pe.rotr32 = rp;
function np(t, e) {
  return (t << e) | (t >>> (32 - e));
}
Pe.rotl32 = np;
function ip(t, e) {
  return (t + e) >>> 0;
}
Pe.sum32 = ip;
function ap(t, e, r) {
  return (t + e + r) >>> 0;
}
Pe.sum32_3 = ap;
function sp(t, e, r, n) {
  return (t + e + r + n) >>> 0;
}
Pe.sum32_4 = sp;
function op(t, e, r, n, i) {
  return (t + e + r + n + i) >>> 0;
}
Pe.sum32_5 = op;
function cp(t, e, r, n) {
  var i = t[e],
    a = t[e + 1],
    o = (n + a) >>> 0,
    c = (o < n ? 1 : 0) + r + i;
  (t[e] = c >>> 0), (t[e + 1] = o);
}
Pe.sum64 = cp;
function fp(t, e, r, n) {
  var i = (e + n) >>> 0,
    a = (i < e ? 1 : 0) + t + r;
  return a >>> 0;
}
Pe.sum64_hi = fp;
function up(t, e, r, n) {
  var i = e + n;
  return i >>> 0;
}
Pe.sum64_lo = up;
function dp(t, e, r, n, i, a, o, c) {
  var h = 0,
    m = e;
  (m = (m + n) >>> 0),
    (h += m < e ? 1 : 0),
    (m = (m + a) >>> 0),
    (h += m < a ? 1 : 0),
    (m = (m + c) >>> 0),
    (h += m < c ? 1 : 0);
  var w = t + r + i + o + h;
  return w >>> 0;
}
Pe.sum64_4_hi = dp;
function lp(t, e, r, n, i, a, o, c) {
  var h = e + n + a + c;
  return h >>> 0;
}
Pe.sum64_4_lo = lp;
function hp(t, e, r, n, i, a, o, c, h, m) {
  var w = 0,
    x = e;
  (x = (x + n) >>> 0),
    (w += x < e ? 1 : 0),
    (x = (x + a) >>> 0),
    (w += x < a ? 1 : 0),
    (x = (x + c) >>> 0),
    (w += x < c ? 1 : 0),
    (x = (x + m) >>> 0),
    (w += x < m ? 1 : 0);
  var T = t + r + i + o + h + w;
  return T >>> 0;
}
Pe.sum64_5_hi = hp;
function pp(t, e, r, n, i, a, o, c, h, m) {
  var w = e + n + a + c + m;
  return w >>> 0;
}
Pe.sum64_5_lo = pp;
function mp(t, e, r) {
  var n = (e << (32 - r)) | (t >>> r);
  return n >>> 0;
}
Pe.rotr64_hi = mp;
function vp(t, e, r) {
  var n = (t << (32 - r)) | (e >>> r);
  return n >>> 0;
}
Pe.rotr64_lo = vp;
function bp(t, e, r) {
  return t >>> r;
}
Pe.shr64_hi = bp;
function gp(t, e, r) {
  var n = (t << (32 - r)) | (e >>> r);
  return n >>> 0;
}
Pe.shr64_lo = gp;
var ki = {},
  Sf = Pe,
  yp = Xn;
function $s() {
  (this.pending = null),
    (this.pendingTotal = 0),
    (this.blockSize = this.constructor.blockSize),
    (this.outSize = this.constructor.outSize),
    (this.hmacStrength = this.constructor.hmacStrength),
    (this.padLength = this.constructor.padLength / 8),
    (this.endian = 'big'),
    (this._delta8 = this.blockSize / 8),
    (this._delta32 = this.blockSize / 32);
}
ki.BlockHash = $s;
$s.prototype.update = function (e, r) {
  if (
    ((e = Sf.toArray(e, r)),
    this.pending ? (this.pending = this.pending.concat(e)) : (this.pending = e),
    (this.pendingTotal += e.length),
    this.pending.length >= this._delta8)
  ) {
    e = this.pending;
    var n = e.length % this._delta8;
    (this.pending = e.slice(e.length - n, e.length)),
      this.pending.length === 0 && (this.pending = null),
      (e = Sf.join32(e, 0, e.length - n, this.endian));
    for (var i = 0; i < e.length; i += this._delta32) this._update(e, i, i + this._delta32);
  }
  return this;
};
$s.prototype.digest = function (e) {
  return this.update(this._pad()), yp(this.pending === null), this._digest(e);
};
$s.prototype._pad = function () {
  var e = this.pendingTotal,
    r = this._delta8,
    n = r - ((e + this.padLength) % r),
    i = new Array(n + this.padLength);
  i[0] = 128;
  for (var a = 1; a < n; a++) i[a] = 0;
  if (((e <<= 3), this.endian === 'big')) {
    for (var o = 8; o < this.padLength; o++) i[a++] = 0;
    (i[a++] = 0),
      (i[a++] = 0),
      (i[a++] = 0),
      (i[a++] = 0),
      (i[a++] = (e >>> 24) & 255),
      (i[a++] = (e >>> 16) & 255),
      (i[a++] = (e >>> 8) & 255),
      (i[a++] = e & 255);
  } else
    for (
      i[a++] = e & 255,
        i[a++] = (e >>> 8) & 255,
        i[a++] = (e >>> 16) & 255,
        i[a++] = (e >>> 24) & 255,
        i[a++] = 0,
        i[a++] = 0,
        i[a++] = 0,
        i[a++] = 0,
        o = 8;
      o < this.padLength;
      o++
    )
      i[a++] = 0;
  return i;
};
var Ci = {},
  Xr = {},
  wp = Pe,
  qr = wp.rotr32;
function Ep(t, e, r, n) {
  if (t === 0) return id(e, r, n);
  if (t === 1 || t === 3) return sd(e, r, n);
  if (t === 2) return ad(e, r, n);
}
Xr.ft_1 = Ep;
function id(t, e, r) {
  return (t & e) ^ (~t & r);
}
Xr.ch32 = id;
function ad(t, e, r) {
  return (t & e) ^ (t & r) ^ (e & r);
}
Xr.maj32 = ad;
function sd(t, e, r) {
  return t ^ e ^ r;
}
Xr.p32 = sd;
function xp(t) {
  return qr(t, 2) ^ qr(t, 13) ^ qr(t, 22);
}
Xr.s0_256 = xp;
function _p(t) {
  return qr(t, 6) ^ qr(t, 11) ^ qr(t, 25);
}
Xr.s1_256 = _p;
function Tp(t) {
  return qr(t, 7) ^ qr(t, 18) ^ (t >>> 3);
}
Xr.g0_256 = Tp;
function Ip(t) {
  return qr(t, 17) ^ qr(t, 19) ^ (t >>> 10);
}
Xr.g1_256 = Ip;
var gi = Pe,
  Np = ki,
  Sp = Xr,
  bo = gi.rotl32,
  Ji = gi.sum32,
  Mp = gi.sum32_5,
  Ap = Sp.ft_1,
  od = Np.BlockHash,
  Op = [1518500249, 1859775393, 2400959708, 3395469782];
function Gr() {
  if (!(this instanceof Gr)) return new Gr();
  od.call(this),
    (this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]),
    (this.W = new Array(80));
}
gi.inherits(Gr, od);
var Rp = Gr;
Gr.blockSize = 512;
Gr.outSize = 160;
Gr.hmacStrength = 80;
Gr.padLength = 64;
Gr.prototype._update = function (e, r) {
  for (var n = this.W, i = 0; i < 16; i++) n[i] = e[r + i];
  for (; i < n.length; i++) n[i] = bo(n[i - 3] ^ n[i - 8] ^ n[i - 14] ^ n[i - 16], 1);
  var a = this.h[0],
    o = this.h[1],
    c = this.h[2],
    h = this.h[3],
    m = this.h[4];
  for (i = 0; i < n.length; i++) {
    var w = ~~(i / 20),
      x = Mp(bo(a, 5), Ap(w, o, c, h), m, n[i], Op[w]);
    (m = h), (h = c), (c = bo(o, 30)), (o = a), (a = x);
  }
  (this.h[0] = Ji(this.h[0], a)),
    (this.h[1] = Ji(this.h[1], o)),
    (this.h[2] = Ji(this.h[2], c)),
    (this.h[3] = Ji(this.h[3], h)),
    (this.h[4] = Ji(this.h[4], m));
};
Gr.prototype._digest = function (e) {
  return e === 'hex' ? gi.toHex32(this.h, 'big') : gi.split32(this.h, 'big');
};
var yi = Pe,
  Dp = ki,
  Pi = Xr,
  $p = Xn,
  Mr = yi.sum32,
  kp = yi.sum32_4,
  Cp = yi.sum32_5,
  Pp = Pi.ch32,
  Lp = Pi.maj32,
  Fp = Pi.s0_256,
  Up = Pi.s1_256,
  qp = Pi.g0_256,
  Bp = Pi.g1_256,
  cd = Dp.BlockHash,
  Vp = [
    1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221,
    3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
    3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
    2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
    666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
    2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
    430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
    1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298,
  ];
function Jr() {
  if (!(this instanceof Jr)) return new Jr();
  cd.call(this),
    (this.h = [
      1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225,
    ]),
    (this.k = Vp),
    (this.W = new Array(64));
}
yi.inherits(Jr, cd);
var fd = Jr;
Jr.blockSize = 512;
Jr.outSize = 256;
Jr.hmacStrength = 192;
Jr.padLength = 64;
Jr.prototype._update = function (e, r) {
  for (var n = this.W, i = 0; i < 16; i++) n[i] = e[r + i];
  for (; i < n.length; i++) n[i] = kp(Bp(n[i - 2]), n[i - 7], qp(n[i - 15]), n[i - 16]);
  var a = this.h[0],
    o = this.h[1],
    c = this.h[2],
    h = this.h[3],
    m = this.h[4],
    w = this.h[5],
    x = this.h[6],
    T = this.h[7];
  for ($p(this.k.length === n.length), i = 0; i < n.length; i++) {
    var I = Cp(T, Up(m), Pp(m, w, x), this.k[i], n[i]),
      M = Mr(Fp(a), Lp(a, o, c));
    (T = x), (x = w), (w = m), (m = Mr(h, I)), (h = c), (c = o), (o = a), (a = Mr(I, M));
  }
  (this.h[0] = Mr(this.h[0], a)),
    (this.h[1] = Mr(this.h[1], o)),
    (this.h[2] = Mr(this.h[2], c)),
    (this.h[3] = Mr(this.h[3], h)),
    (this.h[4] = Mr(this.h[4], m)),
    (this.h[5] = Mr(this.h[5], w)),
    (this.h[6] = Mr(this.h[6], x)),
    (this.h[7] = Mr(this.h[7], T));
};
Jr.prototype._digest = function (e) {
  return e === 'hex' ? yi.toHex32(this.h, 'big') : yi.split32(this.h, 'big');
};
var qo = Pe,
  ud = fd;
function bn() {
  if (!(this instanceof bn)) return new bn();
  ud.call(this),
    (this.h = [
      3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428,
    ]);
}
qo.inherits(bn, ud);
var jp = bn;
bn.blockSize = 512;
bn.outSize = 224;
bn.hmacStrength = 192;
bn.padLength = 64;
bn.prototype._digest = function (e) {
  return e === 'hex'
    ? qo.toHex32(this.h.slice(0, 7), 'big')
    : qo.split32(this.h.slice(0, 7), 'big');
};
var ir = Pe,
  zp = ki,
  Gp = Xn,
  Br = ir.rotr64_hi,
  Vr = ir.rotr64_lo,
  dd = ir.shr64_hi,
  ld = ir.shr64_lo,
  Tn = ir.sum64,
  go = ir.sum64_hi,
  yo = ir.sum64_lo,
  Jp = ir.sum64_4_hi,
  Hp = ir.sum64_4_lo,
  Wp = ir.sum64_5_hi,
  Kp = ir.sum64_5_lo,
  hd = zp.BlockHash,
  Qp = [
    1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548,
    961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560,
    3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994,
    1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868,
    3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933,
    770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837,
    2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956,
    3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936,
    666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823,
    1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627,
    2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008,
    3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720,
    430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280,
    958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899,
    1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044,
    2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427,
    3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992,
    116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315,
    685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676,
    1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591,
  ];
function kr() {
  if (!(this instanceof kr)) return new kr();
  hd.call(this),
    (this.h = [
      1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762,
      1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225,
      327033209,
    ]),
    (this.k = Qp),
    (this.W = new Array(160));
}
ir.inherits(kr, hd);
var pd = kr;
kr.blockSize = 1024;
kr.outSize = 512;
kr.hmacStrength = 192;
kr.padLength = 128;
kr.prototype._prepareBlock = function (e, r) {
  for (var n = this.W, i = 0; i < 32; i++) n[i] = e[r + i];
  for (; i < n.length; i += 2) {
    var a = om(n[i - 4], n[i - 3]),
      o = cm(n[i - 4], n[i - 3]),
      c = n[i - 14],
      h = n[i - 13],
      m = am(n[i - 30], n[i - 29]),
      w = sm(n[i - 30], n[i - 29]),
      x = n[i - 32],
      T = n[i - 31];
    (n[i] = Jp(a, o, c, h, m, w, x, T)), (n[i + 1] = Hp(a, o, c, h, m, w, x, T));
  }
};
kr.prototype._update = function (e, r) {
  this._prepareBlock(e, r);
  var n = this.W,
    i = this.h[0],
    a = this.h[1],
    o = this.h[2],
    c = this.h[3],
    h = this.h[4],
    m = this.h[5],
    w = this.h[6],
    x = this.h[7],
    T = this.h[8],
    I = this.h[9],
    M = this.h[10],
    k = this.h[11],
    F = this.h[12],
    j = this.h[13],
    Z = this.h[14],
    me = this.h[15];
  Gp(this.k.length === n.length);
  for (var ue = 0; ue < n.length; ue += 2) {
    var X = Z,
      J = me,
      Q = nm(T, I),
      re = im(T, I),
      R = Yp(T, I, M, k, F),
      q = Xp(T, I, M, k, F, j),
      N = this.k[ue],
      p = this.k[ue + 1],
      l = n[ue],
      s = n[ue + 1],
      f = Wp(X, J, Q, re, R, q, N, p, l, s),
      v = Kp(X, J, Q, re, R, q, N, p, l, s);
    (X = tm(i, a)), (J = rm(i, a)), (Q = Zp(i, a, o, c, h)), (re = em(i, a, o, c, h, m));
    var y = go(X, J, Q, re),
      E = yo(X, J, Q, re);
    (Z = F),
      (me = j),
      (F = M),
      (j = k),
      (M = T),
      (k = I),
      (T = go(w, x, f, v)),
      (I = yo(x, x, f, v)),
      (w = h),
      (x = m),
      (h = o),
      (m = c),
      (o = i),
      (c = a),
      (i = go(f, v, y, E)),
      (a = yo(f, v, y, E));
  }
  Tn(this.h, 0, i, a),
    Tn(this.h, 2, o, c),
    Tn(this.h, 4, h, m),
    Tn(this.h, 6, w, x),
    Tn(this.h, 8, T, I),
    Tn(this.h, 10, M, k),
    Tn(this.h, 12, F, j),
    Tn(this.h, 14, Z, me);
};
kr.prototype._digest = function (e) {
  return e === 'hex' ? ir.toHex32(this.h, 'big') : ir.split32(this.h, 'big');
};
function Yp(t, e, r, n, i) {
  var a = (t & r) ^ (~t & i);
  return a < 0 && (a += 4294967296), a;
}
function Xp(t, e, r, n, i, a) {
  var o = (e & n) ^ (~e & a);
  return o < 0 && (o += 4294967296), o;
}
function Zp(t, e, r, n, i) {
  var a = (t & r) ^ (t & i) ^ (r & i);
  return a < 0 && (a += 4294967296), a;
}
function em(t, e, r, n, i, a) {
  var o = (e & n) ^ (e & a) ^ (n & a);
  return o < 0 && (o += 4294967296), o;
}
function tm(t, e) {
  var r = Br(t, e, 28),
    n = Br(e, t, 2),
    i = Br(e, t, 7),
    a = r ^ n ^ i;
  return a < 0 && (a += 4294967296), a;
}
function rm(t, e) {
  var r = Vr(t, e, 28),
    n = Vr(e, t, 2),
    i = Vr(e, t, 7),
    a = r ^ n ^ i;
  return a < 0 && (a += 4294967296), a;
}
function nm(t, e) {
  var r = Br(t, e, 14),
    n = Br(t, e, 18),
    i = Br(e, t, 9),
    a = r ^ n ^ i;
  return a < 0 && (a += 4294967296), a;
}
function im(t, e) {
  var r = Vr(t, e, 14),
    n = Vr(t, e, 18),
    i = Vr(e, t, 9),
    a = r ^ n ^ i;
  return a < 0 && (a += 4294967296), a;
}
function am(t, e) {
  var r = Br(t, e, 1),
    n = Br(t, e, 8),
    i = dd(t, e, 7),
    a = r ^ n ^ i;
  return a < 0 && (a += 4294967296), a;
}
function sm(t, e) {
  var r = Vr(t, e, 1),
    n = Vr(t, e, 8),
    i = ld(t, e, 7),
    a = r ^ n ^ i;
  return a < 0 && (a += 4294967296), a;
}
function om(t, e) {
  var r = Br(t, e, 19),
    n = Br(e, t, 29),
    i = dd(t, e, 6),
    a = r ^ n ^ i;
  return a < 0 && (a += 4294967296), a;
}
function cm(t, e) {
  var r = Vr(t, e, 19),
    n = Vr(e, t, 29),
    i = ld(t, e, 6),
    a = r ^ n ^ i;
  return a < 0 && (a += 4294967296), a;
}
var Bo = Pe,
  md = pd;
function gn() {
  if (!(this instanceof gn)) return new gn();
  md.call(this),
    (this.h = [
      3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697,
      1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813,
      3204075428,
    ]);
}
Bo.inherits(gn, md);
var fm = gn;
gn.blockSize = 1024;
gn.outSize = 384;
gn.hmacStrength = 192;
gn.padLength = 128;
gn.prototype._digest = function (e) {
  return e === 'hex'
    ? Bo.toHex32(this.h.slice(0, 12), 'big')
    : Bo.split32(this.h.slice(0, 12), 'big');
};
Ci.sha1 = Rp;
Ci.sha224 = jp;
Ci.sha256 = fd;
Ci.sha384 = fm;
Ci.sha512 = pd;
var vd = {},
  Hn = Pe,
  um = ki,
  qa = Hn.rotl32,
  Mf = Hn.sum32,
  Hi = Hn.sum32_3,
  Af = Hn.sum32_4,
  bd = um.BlockHash;
function Hr() {
  if (!(this instanceof Hr)) return new Hr();
  bd.call(this),
    (this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]),
    (this.endian = 'little');
}
Hn.inherits(Hr, bd);
vd.ripemd160 = Hr;
Hr.blockSize = 512;
Hr.outSize = 160;
Hr.hmacStrength = 192;
Hr.padLength = 64;
Hr.prototype._update = function (e, r) {
  for (
    var n = this.h[0],
      i = this.h[1],
      a = this.h[2],
      o = this.h[3],
      c = this.h[4],
      h = n,
      m = i,
      w = a,
      x = o,
      T = c,
      I = 0;
    I < 80;
    I++
  ) {
    var M = Mf(qa(Af(n, Of(I, i, a, o), e[hm[I] + r], dm(I)), mm[I]), c);
    (n = c),
      (c = o),
      (o = qa(a, 10)),
      (a = i),
      (i = M),
      (M = Mf(qa(Af(h, Of(79 - I, m, w, x), e[pm[I] + r], lm(I)), vm[I]), T)),
      (h = T),
      (T = x),
      (x = qa(w, 10)),
      (w = m),
      (m = M);
  }
  (M = Hi(this.h[1], a, x)),
    (this.h[1] = Hi(this.h[2], o, T)),
    (this.h[2] = Hi(this.h[3], c, h)),
    (this.h[3] = Hi(this.h[4], n, m)),
    (this.h[4] = Hi(this.h[0], i, w)),
    (this.h[0] = M);
};
Hr.prototype._digest = function (e) {
  return e === 'hex' ? Hn.toHex32(this.h, 'little') : Hn.split32(this.h, 'little');
};
function Of(t, e, r, n) {
  return t <= 15
    ? e ^ r ^ n
    : t <= 31
    ? (e & r) | (~e & n)
    : t <= 47
    ? (e | ~r) ^ n
    : t <= 63
    ? (e & n) | (r & ~n)
    : e ^ (r | ~n);
}
function dm(t) {
  return t <= 15
    ? 0
    : t <= 31
    ? 1518500249
    : t <= 47
    ? 1859775393
    : t <= 63
    ? 2400959708
    : 2840853838;
}
function lm(t) {
  return t <= 15
    ? 1352829926
    : t <= 31
    ? 1548603684
    : t <= 47
    ? 1836072691
    : t <= 63
    ? 2053994217
    : 0;
}
var hm = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2,
    14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13,
    3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
  ],
  pm = [
    5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12,
    4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5,
    12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
  ],
  mm = [
    11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9,
    11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15,
    9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
  ],
  vm = [
    8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7,
    6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6,
    14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
  ],
  bm = Pe,
  gm = Xn;
function wi(t, e, r) {
  if (!(this instanceof wi)) return new wi(t, e, r);
  (this.Hash = t),
    (this.blockSize = t.blockSize / 8),
    (this.outSize = t.outSize / 8),
    (this.inner = null),
    (this.outer = null),
    this._init(bm.toArray(e, r));
}
var ym = wi;
wi.prototype._init = function (e) {
  e.length > this.blockSize && (e = new this.Hash().update(e).digest()),
    gm(e.length <= this.blockSize);
  for (var r = e.length; r < this.blockSize; r++) e.push(0);
  for (r = 0; r < e.length; r++) e[r] ^= 54;
  for (this.inner = new this.Hash().update(e), r = 0; r < e.length; r++) e[r] ^= 106;
  this.outer = new this.Hash().update(e);
};
wi.prototype.update = function (e, r) {
  return this.inner.update(e, r), this;
};
wi.prototype.digest = function (e) {
  return this.outer.update(this.inner.digest()), this.outer.digest(e);
};
(function (t) {
  var e = t;
  (e.utils = Pe),
    (e.common = ki),
    (e.sha = Ci),
    (e.ripemd = vd),
    (e.hmac = ym),
    (e.sha1 = e.sha.sha1),
    (e.sha256 = e.sha.sha256),
    (e.sha224 = e.sha.sha224),
    (e.sha384 = e.sha.sha384),
    (e.sha512 = e.sha.sha512),
    (e.ripemd160 = e.ripemd.ripemd160);
})(On);
var sa;
(function (t) {
  (t.sha256 = 'sha256'), (t.sha512 = 'sha512');
})(sa || (sa = {}));
const wm = 'sha2/5.7.0',
  Em = new Le(wm);
function xm(t) {
  return '0x' + On.ripemd160().update(Y(t)).digest('hex');
}
function Zt(t) {
  return '0x' + On.sha256().update(Y(t)).digest('hex');
}
function fs(t, e, r) {
  return (
    sa[t] ||
      Em.throwError('unsupported algorithm ' + t, Le.errors.UNSUPPORTED_OPERATION, {
        operation: 'hmac',
        algorithm: t,
      }),
    '0x' + On.hmac(On[t], Y(e)).update(Y(r)).digest('hex')
  );
}
var gd = (t, e, r) => {
    if (!e.has(t)) throw TypeError('Cannot ' + r);
  },
  ra = (t, e, r) => (gd(t, e, 'read from private field'), r ? r.call(t) : e.get(t)),
  Vo = (t, e, r) => {
    if (e.has(t)) throw TypeError('Cannot add the same private member more than once');
    e instanceof WeakSet ? e.add(t) : e.set(t, r);
  },
  jo = (t, e, r, n) => (gd(t, e, 'write to private field'), n ? n.call(t, r) : e.set(t, r), r),
  _m = new Le(Yn.FUELS),
  De = class {
    constructor(e, r, n) {
      (this.name = e), (this.type = r), (this.encodedLength = n);
    }
    throwError(e, r) {
      throw (_m.throwArgumentError(e, this.name, r), new Error('unreachable'));
    }
    setOffset(e) {
      this.offset = e;
    }
  },
  zt = class extends De {
    constructor(e, r) {
      super('array', `[${e.type}; ${r}]`, r * e.encodedLength), (this.coder = e), (this.length = r);
    }
    encode(e) {
      return (
        Array.isArray(e) || this.throwError('expected array value', e),
        this.length !== e.length && this.throwError('Types/values length mismatch', e),
        de(Array.from(e).map((r) => this.coder.encode(r)))
      );
    }
    decode(e, r) {
      let n = r;
      return [
        Array(this.length)
          .fill(0)
          .map(() => {
            let i;
            return ([i, n] = this.coder.decode(e, n)), i;
          }),
        n,
      ];
    }
  },
  W = class extends De {
    constructor() {
      super('b256', 'b256', 32);
    }
    encode(e) {
      let r;
      try {
        r = Y(e);
      } catch {
        this.throwError(`Invalid ${this.type}`, e);
      }
      return r.length !== 32 && this.throwError(`Invalid ${this.type}`, e), r;
    }
    decode(e, r) {
      let n = e.slice(r, r + 32);
      return (
        G(n).isZero() && (n = new Uint8Array(32)),
        n.length !== 32 && this.throwError('Invalid size for b256', n),
        [fc(n, 32), r + 32]
      );
    }
  },
  Tm = class extends De {
    constructor() {
      super('b512', 'b512', 64);
    }
    encode(e) {
      let r;
      try {
        r = Y(e);
      } catch {
        this.throwError(`Invalid ${this.type}`, e);
      }
      return r.length !== 64 && this.throwError(`Invalid ${this.type}`, e), r;
    }
    decode(e, r) {
      let n = e.slice(r, r + 64);
      return (
        G(n).isZero() && (n = new Uint8Array(64)),
        n.length !== 64 && this.throwError('Invalid size for b512', n),
        [fc(n, 64), r + 64]
      );
    }
  },
  Im = class extends De {
    constructor() {
      super('boolean', 'boolean', 8);
    }
    encode(e) {
      let r;
      try {
        r = zr(e ? 1 : 0);
      } catch {
        this.throwError('Invalid bool', e);
      }
      return r.length > 1 && this.throwError('Invalid bool', e), zr(r, 8);
    }
    decode(e, r) {
      let n = G(e.slice(r, r + 8));
      return n.isZero()
        ? [!1, r + 8]
        : (n.eq(G(1)) || this.throwError('Invalid boolean value', n), [!0, r + 8]);
    }
  },
  Nm = class extends De {
    constructor() {
      super('byte', 'byte', 8);
    }
    encode(e) {
      let r;
      try {
        r = zr(e, 1);
      } catch {
        this.throwError('Invalid Byte', e);
      }
      return zr(r, 8);
    }
    decode(e, r) {
      let n = e.slice(r, r + 8),
        i = G(n);
      return i.gt(G(255)) && this.throwError('Invalid Byte', i), [Number(i), r + 8];
    }
  },
  V = class extends De {
    constructor() {
      super('u64', 'u64', 8);
    }
    encode(e) {
      let r;
      try {
        r = zr(e, 8);
      } catch {
        this.throwError(`Invalid ${this.type}`, e);
      }
      return r;
    }
    decode(e, r) {
      let n = e.slice(r, r + 8);
      return (n = n.slice(0, 8)), [G(n), r + 8];
    }
  },
  es,
  Qi,
  yd = class extends De {
    constructor(e, r) {
      let n = new V(),
        i = Object.values(r).reduce((a, o) => Math.max(a, o.encodedLength), 0);
      super('enum', `enum ${e}`, n.encodedLength + i),
        Vo(this, es, void 0),
        Vo(this, Qi, void 0),
        (this.name = e),
        (this.coders = r),
        jo(this, es, n),
        jo(this, Qi, i);
    }
    encode(e) {
      let [r, ...n] = Object.keys(e);
      if (!r) throw new Error('A field for the case must be provided');
      if (n.length !== 0) throw new Error('Only one field must be provided');
      let i = this.coders[r],
        a = Object.keys(this.coders).indexOf(r),
        o = i.encode(e[r]),
        c = new Uint8Array(ra(this, Qi) - i.encodedLength);
      return de([ra(this, es).encode(a), c, o]);
    }
    decode(e, r) {
      let n = r,
        i;
      [i, n] = new V().decode(e, n);
      let a = Fr(i),
        o = Object.keys(this.coders)[a];
      if (!o) throw new Error(`Invalid caseIndex "${a}". Valid cases: ${Object.keys(this.coders)}`);
      let c = this.coders[o];
      return (n += ra(this, Qi) - c.encodedLength), ([i, n] = c.decode(e, n)), [{ [o]: i }, n];
    }
  };
(es = new WeakMap()), (Qi = new WeakMap());
var ie = class extends De {
    constructor(t) {
      switch ((super('number', t, 8), (this.baseType = t), t)) {
        case 'u8':
          this.length = 1;
          break;
        case 'u16':
          this.length = 2;
          break;
        case 'u32':
        default:
          this.length = 4;
          break;
      }
    }
    encode(t) {
      let e;
      try {
        e = zr(t);
      } catch {
        this.throwError(`Invalid ${this.baseType}`, t);
      }
      return (
        e.length > this.length && this.throwError(`Invalid ${this.baseType}. Too many bytes.`, t),
        zr(e, 8)
      );
    }
    decode(t, e) {
      let r = t.slice(e, e + 8);
      return (r = r.slice(8 - this.length, 8)), [Fr(r), e + 8];
    }
  },
  Yi,
  Sm = class extends De {
    constructor(e) {
      let r = (8 - e) % 8;
      (r = r < 0 ? r + 8 : r),
        super('string', `str[${e}]`, e + r),
        Vo(this, Yi, void 0),
        (this.length = e),
        jo(this, Yi, r);
    }
    encode(e) {
      let r = zh(e.slice(0, this.length)),
        n = new Uint8Array(ra(this, Yi));
      return de([r, n]);
    }
    decode(e, r) {
      let n = e.slice(r, r + this.length),
        i = Jh(n),
        a = ra(this, Yi);
      return [i, r + this.length + a];
    }
  };
Yi = new WeakMap();
var wd = class extends yd {
    encode(e) {
      return super.encode(this.toSwayOption(e));
    }
    toSwayOption(e) {
      return e !== void 0 ? { Some: e } : { None: [] };
    }
    decode(e, r) {
      let [n, i] = super.decode(e, r);
      return [this.toOption(n), i];
    }
    toOption(e) {
      if (e && 'Some' in e) return e.Some;
    }
  },
  ks = class extends De {
    constructor(e, r) {
      let n = Object.values(r).reduce((i, a) => i + a.encodedLength, 0);
      super('struct', `struct ${e}`, n), (this.name = e), (this.coders = r);
    }
    encode(e) {
      let r = Object.keys(this.coders).map((n) => {
        let i = this.coders[n],
          a = e[n];
        return (
          !(i instanceof wd) &&
            a == null &&
            this.throwError(`Invalid ${this.type}. Field "${n}" not present.`, e),
          i.encode(a)
        );
      });
      return de(r);
    }
    decode(e, r) {
      let n = r;
      return [
        Object.keys(this.coders).reduce((i, a) => {
          let o = this.coders[a],
            c;
          return ([c, n] = o.decode(e, n)), (i[a] = c), i;
        }, {}),
        n,
      ];
    }
  },
  wo = class extends De {
    constructor(e) {
      let r = e.reduce((n, i) => n + i.encodedLength, 0);
      super('tuple', `(${e.map((n) => n.type).join(', ')})`, r), (this.coders = e);
    }
    encode(e) {
      return (
        this.coders.length !== e.length &&
          this.throwError('Types/values length mismatch', { value: e }),
        de(this.coders.map((r, n) => r.encode(e[n])))
      );
    }
    decode(e, r) {
      let n = r;
      return [
        this.coders.map((i) => {
          let a;
          return ([a, n] = i.decode(e, n)), a;
        }),
        n,
      ];
    }
  },
  Ed = 'enum Option',
  Mm = 'struct Vec',
  Am = /str\[(?<length>[0-9]+)\]/,
  Om = /\[(?<item>[\w\s\\[\]]+);\s*(?<length>[0-9]+)\]/,
  Rm = /^struct (?<name>\w+)$/,
  Dm = /^enum (?<name>\w+)$/,
  $m = /^\((?<items>.*)\)$/,
  Eo = 8,
  km = 32,
  Cm = 32,
  Pm = 10240,
  Lm = 104,
  Fm = 3,
  ts = class extends De {
    constructor(e) {
      super('struct', 'struct Vec', 0), (this.coder = e);
    }
    static getBaseOffset() {
      return Fm * 8;
    }
    getEncodedVectorData(e) {
      Array.isArray(e) || this.throwError('expected array value', e);
      let r = Array.from(e).map((n) => this.coder.encode(n));
      return de(r);
    }
    encode(e) {
      Array.isArray(e) || this.throwError('expected array value', e);
      let r = [],
        n = this.offset || 0;
      return (
        r.push(new V().encode(n)),
        r.push(new V().encode(e.length)),
        r.push(new V().encode(e.length)),
        de(r)
      );
    }
    decode(e, r) {
      return this.throwError('unexpected Vec decode', 'not implemented'), [void 0, r];
    }
  };
function Rf(t) {
  return t.filter((e) => e?.type !== '()' && e !== '()');
}
function Um(t) {
  return t.some((e) => e?.type === Ed);
}
function qm(t, e, r = 0) {
  let n = [],
    i = t.map((c, h) => {
      if (!(c instanceof ts)) return { byteLength: c.encodedLength };
      let m = c.getEncodedVectorData(e[h]);
      return n.push(m), { vecByteLength: m.byteLength };
    }),
    a = n.length * ts.getBaseOffset() + r,
    o = t.map((c, h) =>
      c instanceof ts
        ? i.reduce(
            (m, w, x) =>
              'byteLength' in w
                ? m + w.byteLength
                : x === 0 && x === h
                ? a
                : x < h
                ? m + w.vecByteLength + a
                : m,
            0
          )
        : 0
    );
  return t.forEach((c, h) => c.setOffset(o[h])), n;
}
var Ba = new Le(Yn.FUELS),
  us = class {
    constructor() {
      Ba.checkNew(new.target, us);
    }
    getCoder(e) {
      var r, n, i, a, o, c;
      switch (e.type) {
        case 'u8':
        case 'u16':
        case 'u32':
          return new ie(e.type);
        case 'u64':
        case 'raw untyped ptr':
          return new V();
        case 'bool':
          return new Im();
        case 'byte':
          return new Nm();
        case 'b256':
          return new W();
        case 'b512':
          return new Tm();
      }
      let h = (r = Om.exec(e.type)) == null ? void 0 : r.groups;
      if (h) {
        let T = parseInt(h.length, 10),
          I = (n = e.components) == null ? void 0 : n[0];
        if (!I) throw new Error('Expected array type to have an item component');
        let M = this.getCoder(I);
        return new zt(M, T);
      }
      let m = (i = Am.exec(e.type)) == null ? void 0 : i.groups;
      if (m) {
        let T = parseInt(m.length, 10);
        return new Sm(T);
      }
      if (e.type === Mm && Array.isArray(e.typeArguments)) {
        let T = e.typeArguments[0];
        if (!T) throw new Error('Expected Vec type to have a type argument');
        let I = this.getCoder(T);
        return new ts(I);
      }
      let w = (a = Rm.exec(e.type)) == null ? void 0 : a.groups;
      if (w && Array.isArray(e.components)) {
        let T = e.components.reduce((I, M) => ((I[M.name] = this.getCoder(M)), I), {});
        return new ks(w.name, T);
      }
      let x = (o = Dm.exec(e.type)) == null ? void 0 : o.groups;
      if (x && Array.isArray(e.components)) {
        let T = e.components.reduce((I, M) => ((I[M.name] = this.getCoder(M)), I), {});
        return e.type === Ed ? new wd(x.name, T) : new yd(x.name, T);
      }
      if ((c = $m.exec(e.type)) != null && c.groups && Array.isArray(e.components)) {
        let T = e.components.map((I) => this.getCoder(I));
        return new wo(T);
      }
      return Ba.throwArgumentError('Invalid type', 'type', e.type);
    }
    encode(e, r, n = 0) {
      let i = Rf(e),
        a = r.slice();
      Array.isArray(r) &&
        i.length !== r.length &&
        (Um(e)
          ? ((a.length = e.length), a.fill(void 0, r.length))
          : Ba.throwError(
              'Types/values length mismatch during encode',
              Le.errors.INVALID_ARGUMENT,
              {
                count: { types: e.length, nonEmptyTypes: i.length, values: r.length },
                value: { types: e, nonEmptyTypes: i, values: r },
              }
            ));
      let o = i.map((m) => this.getCoder(m)),
        c = qm(o, a, n),
        h = new wo(o).encode(a);
      return de([h, de(c)]);
    }
    decode(e, r) {
      let n = Y(r),
        i = Rf(e),
        a = (w) => {
          w !== n.length &&
            Ba.throwError(
              'Types/values length mismatch during decode',
              Le.errors.INVALID_ARGUMENT,
              {
                count: { types: e.length, nonEmptyTypes: i.length, values: n.length },
                value: { types: e, nonEmptyTypes: i, values: n },
              }
            );
        };
      if (e.length === 0 || i.length === 0) {
        a(n.length ? 8 : 0);
        return;
      }
      let o = i.map((w) => this.getCoder(w)),
        c = new wo(o),
        [h, m] = c.decode(n, 0);
      return a(m), h;
    }
  };
new Le(Yn.FUELS);
var Bm = class {},
  Vm = class {},
  xd = class {};
function _d(t, e, r, n, i) {
  (t = Y(t)), (e = Y(e));
  let a,
    o = 1;
  const c = new Uint8Array(n),
    h = new Uint8Array(e.length + 4);
  h.set(e);
  let m, w;
  for (let x = 1; x <= o; x++) {
    (h[e.length] = (x >> 24) & 255),
      (h[e.length + 1] = (x >> 16) & 255),
      (h[e.length + 2] = (x >> 8) & 255),
      (h[e.length + 3] = x & 255);
    let T = Y(fs(i, t, h));
    a || ((a = T.length), (w = new Uint8Array(a)), (o = Math.ceil(n / a)), (m = n - (o - 1) * a)),
      w.set(T);
    for (let k = 1; k < r; k++) {
      T = Y(fs(i, t, T));
      for (let F = 0; F < a; F++) w[F] ^= T[F];
    }
    const I = (x - 1) * a,
      M = x === o ? m : a;
    c.set(Y(w).slice(0, M), I);
  }
  return ee(c);
}
var Df = ((t) =>
    typeof require < 'u'
      ? require
      : typeof Proxy < 'u'
      ? new Proxy(t, { get: (e, r) => (typeof require < 'u' ? require : e)[r] })
      : t)(function (t) {
    if (typeof require < 'u') return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + t + '" is not supported');
  }),
  ds,
  uc = 'Node';
typeof globalThis < 'u' && globalThis.crypto && ((ds = globalThis.crypto), (uc = 'Web'));
if (!ds && typeof Df == 'function')
  try {
    (ds = Df('crypto')), (uc = 'Node');
  } catch (t) {
    console.error('keystore expects a standard Web browser or Node environment.', t);
  }
var Rn = ds,
  ya = uc;
function vn(t, e = 'base64') {
  return ya === 'Node'
    ? Buffer.from(t, e)
    : e === 'utf-8'
    ? new TextEncoder().encode(t)
    : new Uint8Array(
        atob(t)
          .split('')
          .map((r) => r.charCodeAt(0))
      );
}
function li(t, e = 'base64') {
  return ya === 'Node'
    ? Buffer.from(t).toString(e)
    : btoa(String.fromCharCode.apply(null, new Uint8Array(t)));
}
function Cs(t, e) {
  let r = vn(String(t).normalize('NFKC'), 'utf-8'),
    n = _d(r, e, 1e5, 32, 'sha256');
  return Y(n);
}
var yn = (t) => (ya === 'Node' ? Rn.randomBytes(t) : Rn.getRandomValues(new Uint8Array(t))),
  Td = 'aes-256-ctr';
async function jm(t, e) {
  let r = yn(16),
    n = yn(32),
    i = Cs(t, n),
    a = Uint8Array.from(Buffer.from(JSON.stringify(e), 'utf-8')),
    o = Rn.createCipheriv(Td, i, r),
    c = o.update(a);
  return (c = Buffer.concat([c, o.final()])), { data: li(c), iv: li(r), salt: li(n) };
}
async function zm(t, e) {
  let r = vn(e.iv),
    n = vn(e.salt),
    i = Cs(t, n),
    a = vn(e.data),
    o = Rn.createDecipheriv(Td, i, r),
    c = o.update(a),
    h = Buffer.concat([c, o.final()]),
    m = Buffer.from(h).toString('utf-8');
  try {
    return JSON.parse(m);
  } catch {
    throw new Error('Invalid credentials');
  }
}
var Id = 'AES-CTR';
async function Gm(t, e) {
  let r = yn(16),
    n = yn(32),
    i = Cs(t, n),
    a = JSON.stringify(e),
    o = vn(a, 'utf-8'),
    c = { name: Id, counter: r, length: 64 },
    h = await Rn.subtle.importKey('raw', i, c, !1, ['encrypt']),
    m = await Rn.subtle.encrypt(c, h, o);
  return { data: li(m), iv: li(r), salt: li(n) };
}
async function Jm(t, e) {
  let r = vn(e.iv),
    n = vn(e.salt),
    i = Cs(t, n),
    a = vn(e.data),
    o = { name: Id, counter: r, length: 64 },
    c = await Rn.subtle.importKey('raw', i, o, !1, ['decrypt']),
    h = await Rn.subtle.decrypt(o, c, a),
    m = new TextDecoder().decode(h);
  try {
    return JSON.parse(m);
  } catch {
    throw new Error('Invalid credentials');
  }
}
async function X2(t, e) {
  return ya === 'Node' ? jm(t, e) : Gm(t, e);
}
async function Z2(t, e) {
  return ya === 'Node' ? zm(t, e) : Jm(t, e);
}
var oa = {};
Object.defineProperty(oa, '__esModule', { value: !0 });
var Ei = (oa.bech32m = oa.bech32 = void 0);
const ls = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
  Nd = {};
for (let t = 0; t < ls.length; t++) {
  const e = ls.charAt(t);
  Nd[e] = t;
}
function hi(t) {
  const e = t >> 25;
  return (
    ((t & 33554431) << 5) ^
    (-((e >> 0) & 1) & 996825010) ^
    (-((e >> 1) & 1) & 642813549) ^
    (-((e >> 2) & 1) & 513874426) ^
    (-((e >> 3) & 1) & 1027748829) ^
    (-((e >> 4) & 1) & 705979059)
  );
}
function $f(t) {
  let e = 1;
  for (let r = 0; r < t.length; ++r) {
    const n = t.charCodeAt(r);
    if (n < 33 || n > 126) return 'Invalid prefix (' + t + ')';
    e = hi(e) ^ (n >> 5);
  }
  e = hi(e);
  for (let r = 0; r < t.length; ++r) {
    const n = t.charCodeAt(r);
    e = hi(e) ^ (n & 31);
  }
  return e;
}
function dc(t, e, r, n) {
  let i = 0,
    a = 0;
  const o = (1 << r) - 1,
    c = [];
  for (let h = 0; h < t.length; ++h)
    for (i = (i << e) | t[h], a += e; a >= r; ) (a -= r), c.push((i >> a) & o);
  if (n) a > 0 && c.push((i << (r - a)) & o);
  else {
    if (a >= e) return 'Excess padding';
    if ((i << (r - a)) & o) return 'Non-zero padding';
  }
  return c;
}
function Hm(t) {
  return dc(t, 8, 5, !0);
}
function Wm(t) {
  const e = dc(t, 5, 8, !1);
  if (Array.isArray(e)) return e;
}
function Km(t) {
  const e = dc(t, 5, 8, !1);
  if (Array.isArray(e)) return e;
  throw new Error(e);
}
function Sd(t) {
  let e;
  t === 'bech32' ? (e = 1) : (e = 734539939);
  function r(o, c, h) {
    if (((h = h || 90), o.length + 7 + c.length > h)) throw new TypeError('Exceeds length limit');
    o = o.toLowerCase();
    let m = $f(o);
    if (typeof m == 'string') throw new Error(m);
    let w = o + '1';
    for (let x = 0; x < c.length; ++x) {
      const T = c[x];
      if (T >> 5) throw new Error('Non 5-bit word');
      (m = hi(m) ^ T), (w += ls.charAt(T));
    }
    for (let x = 0; x < 6; ++x) m = hi(m);
    m ^= e;
    for (let x = 0; x < 6; ++x) {
      const T = (m >> ((5 - x) * 5)) & 31;
      w += ls.charAt(T);
    }
    return w;
  }
  function n(o, c) {
    if (((c = c || 90), o.length < 8)) return o + ' too short';
    if (o.length > c) return 'Exceeds length limit';
    const h = o.toLowerCase(),
      m = o.toUpperCase();
    if (o !== h && o !== m) return 'Mixed-case string ' + o;
    o = h;
    const w = o.lastIndexOf('1');
    if (w === -1) return 'No separator character for ' + o;
    if (w === 0) return 'Missing prefix for ' + o;
    const x = o.slice(0, w),
      T = o.slice(w + 1);
    if (T.length < 6) return 'Data too short';
    let I = $f(x);
    if (typeof I == 'string') return I;
    const M = [];
    for (let k = 0; k < T.length; ++k) {
      const F = T.charAt(k),
        j = Nd[F];
      if (j === void 0) return 'Unknown character ' + F;
      (I = hi(I) ^ j), !(k + 6 >= T.length) && M.push(j);
    }
    return I !== e ? 'Invalid checksum for ' + o : { prefix: x, words: M };
  }
  function i(o, c) {
    const h = n(o, c);
    if (typeof h == 'object') return h;
  }
  function a(o, c) {
    const h = n(o, c);
    if (typeof h == 'object') return h;
    throw new Error(h);
  }
  return { decodeUnsafe: i, decode: a, encode: r, toWords: Hm, fromWordsUnsafe: Wm, fromWords: Km };
}
oa.bech32 = Sd('bech32');
Ei = oa.bech32m = Sd('bech32m');
var Qm = new Le(Yn.FUELS),
  hs = 'fuel';
function lc(t) {
  return Ei.decode(t);
}
function kf(t) {
  return Ei.encode(hs, Ei.toWords(Y(ee(t))));
}
function rs(t) {
  return typeof t == 'string' && t.indexOf(hs + 1) === 0 && lc(t).prefix === hs;
}
function Ym(t) {
  return (t.length === 66 || t.length === 64) && /(0x)?[0-9a-f]{64}$/i.test(t);
}
function Xm(t) {
  return (t.length === 130 || t.length === 128) && /(0x)?[0-9a-f]{128}$/i.test(t);
}
function Md(t) {
  return new Uint8Array(Ei.fromWords(lc(t).words));
}
function Zm(t) {
  return rs(t) || Qm.throwArgumentError('Invalid Bech32 Address', 'address', t), ee(Md(t));
}
function e1(t) {
  let { words: e } = lc(t);
  return Ei.encode(hs, e);
}
var ci = (t) => (t instanceof xd ? t.address : t instanceof Vm ? t.id : t),
  t1 = () => ee(yn(32)),
  Cf = new Le(Yn.FUELS),
  Ct = class extends Bm {
    constructor(e) {
      super(),
        Cf.checkNew(new.target, Ct),
        (this.bech32Address = e1(e)),
        rs(this.bech32Address) || Cf.throwArgumentError('Invalid Bech32 Address', 'address', e);
    }
    toAddress() {
      return this.bech32Address;
    }
    toB256() {
      return Zm(this.bech32Address);
    }
    toBytes() {
      return Md(this.bech32Address);
    }
    toHexString() {
      return this.toB256();
    }
    toString() {
      return this.bech32Address;
    }
    toJSON() {
      return this.toString();
    }
    valueOf() {
      return this.toString();
    }
    equals(e) {
      return this.bech32Address === e.bech32Address;
    }
    static fromPublicKey(e) {
      let r = Zt(e);
      return new Ct(kf(r));
    }
    static fromB256(e) {
      return new Ct(kf(e));
    }
    static fromRandom() {
      return this.fromB256(t1());
    }
    static fromString(e) {
      return rs(e) ? new Ct(e) : this.fromB256(e);
    }
    static fromAddressOrString(e) {
      return typeof e == 'string' ? this.fromString(e) : e;
    }
    static fromDynamicInput(e) {
      if (Xm(e)) return Ct.fromPublicKey(e);
      if (rs(e)) return new Ct(e);
      if (Ym(e)) return Ct.fromB256(e);
      throw new Error('Unknown address format: only Bech32, B256, or Public Key (512) supported');
    }
  },
  $t = '0x0000000000000000000000000000000000000000000000000000000000000000',
  yr = $t,
  ps = function () {
    return (
      (ps =
        Object.assign ||
        function (e) {
          for (var r, n = 1, i = arguments.length; n < i; n++) {
            r = arguments[n];
            for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a]);
          }
          return e;
        }),
      ps.apply(this, arguments)
    );
  };
function t5(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var i = 0, n = Object.getOwnPropertySymbols(t); i < n.length; i++)
      e.indexOf(n[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(t, n[i]) &&
        (r[n[i]] = t[n[i]]);
  return r;
}
function r5(t, e, r) {
  if (r || arguments.length === 2)
    for (var n = 0, i = e.length, a; n < i; n++)
      (a || !(n in e)) && (a || (a = Array.prototype.slice.call(e, 0, n)), (a[n] = e[n]));
  return t.concat(a || Array.prototype.slice.call(e));
}
const r1 = '16.6.0',
  n1 = Object.freeze({ major: 16, minor: 6, patch: 0, preReleaseTag: null });
function ke(t, e) {
  if (!Boolean(t)) throw new Error(e);
}
function dr(t) {
  return typeof t?.then == 'function';
}
function lr(t) {
  return typeof t == 'object' && t !== null;
}
function Rt(t, e) {
  if (!Boolean(t)) throw new Error(e ?? 'Unexpected invariant triggered.');
}
const i1 = /\r\n|[\n\r]/g;
function ms(t, e) {
  let r = 0,
    n = 1;
  for (const i of t.body.matchAll(i1)) {
    if ((typeof i.index == 'number' || Rt(!1), i.index >= e)) break;
    (r = i.index + i[0].length), (n += 1);
  }
  return { line: n, column: e + 1 - r };
}
function Ad(t) {
  return hc(t.source, ms(t.source, t.start));
}
function hc(t, e) {
  const r = t.locationOffset.column - 1,
    n = ''.padStart(r) + t.body,
    i = e.line - 1,
    a = t.locationOffset.line - 1,
    o = e.line + a,
    c = e.line === 1 ? r : 0,
    h = e.column + c,
    m = `${t.name}:${o}:${h}
`,
    w = n.split(/\r\n|[\n\r]/g),
    x = w[i];
  if (x.length > 120) {
    const T = Math.floor(h / 80),
      I = h % 80,
      M = [];
    for (let k = 0; k < x.length; k += 80) M.push(x.slice(k, k + 80));
    return (
      m +
      Pf([
        [`${o} |`, M[0]],
        ...M.slice(1, T + 1).map((k) => ['|', k]),
        ['|', '^'.padStart(I)],
        ['|', M[T + 1]],
      ])
    );
  }
  return (
    m +
    Pf([
      [`${o - 1} |`, w[i - 1]],
      [`${o} |`, x],
      ['|', '^'.padStart(h)],
      [`${o + 1} |`, w[i + 1]],
    ])
  );
}
function Pf(t) {
  const e = t.filter(([n, i]) => i !== void 0),
    r = Math.max(...e.map(([n]) => n.length));
  return e.map(([n, i]) => n.padStart(r) + (i ? ' ' + i : '')).join(`
`);
}
function a1(t) {
  const e = t[0];
  return e == null || 'kind' in e || 'length' in e
    ? { nodes: e, source: t[1], positions: t[2], path: t[3], originalError: t[4], extensions: t[5] }
    : e;
}
class P extends Error {
  constructor(e, ...r) {
    var n, i, a;
    const { nodes: o, source: c, positions: h, path: m, originalError: w, extensions: x } = a1(r);
    super(e),
      (this.name = 'GraphQLError'),
      (this.path = m ?? void 0),
      (this.originalError = w ?? void 0),
      (this.nodes = Lf(Array.isArray(o) ? o : o ? [o] : void 0));
    const T = Lf(
      (n = this.nodes) === null || n === void 0
        ? void 0
        : n.map((M) => M.loc).filter((M) => M != null)
    );
    (this.source = c ?? (T == null || (i = T[0]) === null || i === void 0 ? void 0 : i.source)),
      (this.positions = h ?? T?.map((M) => M.start)),
      (this.locations = h && c ? h.map((M) => ms(c, M)) : T?.map((M) => ms(M.source, M.start)));
    const I = lr(w?.extensions) ? w?.extensions : void 0;
    (this.extensions = (a = x ?? I) !== null && a !== void 0 ? a : Object.create(null)),
      Object.defineProperties(this, {
        message: { writable: !0, enumerable: !0 },
        name: { enumerable: !1 },
        nodes: { enumerable: !1 },
        source: { enumerable: !1 },
        positions: { enumerable: !1 },
        originalError: { enumerable: !1 },
      }),
      w != null && w.stack
        ? Object.defineProperty(this, 'stack', { value: w.stack, writable: !0, configurable: !0 })
        : Error.captureStackTrace
        ? Error.captureStackTrace(this, P)
        : Object.defineProperty(this, 'stack', {
            value: Error().stack,
            writable: !0,
            configurable: !0,
          });
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLError';
  }
  toString() {
    let e = this.message;
    if (this.nodes)
      for (const r of this.nodes)
        r.loc &&
          (e +=
            `

` + Ad(r.loc));
    else if (this.source && this.locations)
      for (const r of this.locations)
        e +=
          `

` + hc(this.source, r);
    return e;
  }
  toJSON() {
    const e = { message: this.message };
    return (
      this.locations != null && (e.locations = this.locations),
      this.path != null && (e.path = this.path),
      this.extensions != null &&
        Object.keys(this.extensions).length > 0 &&
        (e.extensions = this.extensions),
      e
    );
  }
}
function Lf(t) {
  return t === void 0 || t.length === 0 ? void 0 : t;
}
function s1(t) {
  return t.toString();
}
function o1(t) {
  return t.toJSON();
}
function Pt(t, e, r) {
  return new P(`Syntax Error: ${r}`, { source: t, positions: [e] });
}
class Od {
  constructor(e, r, n) {
    (this.start = e.start),
      (this.end = r.end),
      (this.startToken = e),
      (this.endToken = r),
      (this.source = n);
  }
  get [Symbol.toStringTag]() {
    return 'Location';
  }
  toJSON() {
    return { start: this.start, end: this.end };
  }
}
class pc {
  constructor(e, r, n, i, a, o) {
    (this.kind = e),
      (this.start = r),
      (this.end = n),
      (this.line = i),
      (this.column = a),
      (this.value = o),
      (this.prev = null),
      (this.next = null);
  }
  get [Symbol.toStringTag]() {
    return 'Token';
  }
  toJSON() {
    return { kind: this.kind, value: this.value, line: this.line, column: this.column };
  }
}
const Rd = {
    Name: [],
    Document: ['definitions'],
    OperationDefinition: ['name', 'variableDefinitions', 'directives', 'selectionSet'],
    VariableDefinition: ['variable', 'type', 'defaultValue', 'directives'],
    Variable: ['name'],
    SelectionSet: ['selections'],
    Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
    Argument: ['name', 'value'],
    FragmentSpread: ['name', 'directives'],
    InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
    FragmentDefinition: [
      'name',
      'variableDefinitions',
      'typeCondition',
      'directives',
      'selectionSet',
    ],
    IntValue: [],
    FloatValue: [],
    StringValue: [],
    BooleanValue: [],
    NullValue: [],
    EnumValue: [],
    ListValue: ['values'],
    ObjectValue: ['fields'],
    ObjectField: ['name', 'value'],
    Directive: ['name', 'arguments'],
    NamedType: ['name'],
    ListType: ['type'],
    NonNullType: ['type'],
    SchemaDefinition: ['description', 'directives', 'operationTypes'],
    OperationTypeDefinition: ['type'],
    ScalarTypeDefinition: ['description', 'name', 'directives'],
    ObjectTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
    FieldDefinition: ['description', 'name', 'arguments', 'type', 'directives'],
    InputValueDefinition: ['description', 'name', 'type', 'defaultValue', 'directives'],
    InterfaceTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
    UnionTypeDefinition: ['description', 'name', 'directives', 'types'],
    EnumTypeDefinition: ['description', 'name', 'directives', 'values'],
    EnumValueDefinition: ['description', 'name', 'directives'],
    InputObjectTypeDefinition: ['description', 'name', 'directives', 'fields'],
    DirectiveDefinition: ['description', 'name', 'arguments', 'locations'],
    SchemaExtension: ['directives', 'operationTypes'],
    ScalarTypeExtension: ['name', 'directives'],
    ObjectTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
    InterfaceTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
    UnionTypeExtension: ['name', 'directives', 'types'],
    EnumTypeExtension: ['name', 'directives', 'values'],
    InputObjectTypeExtension: ['name', 'directives', 'fields'],
  },
  c1 = new Set(Object.keys(Rd));
function zo(t) {
  const e = t?.kind;
  return typeof e == 'string' && c1.has(e);
}
var Lt;
(function (t) {
  (t.QUERY = 'query'), (t.MUTATION = 'mutation'), (t.SUBSCRIPTION = 'subscription');
})(Lt || (Lt = {}));
var ce;
(function (t) {
  (t.QUERY = 'QUERY'),
    (t.MUTATION = 'MUTATION'),
    (t.SUBSCRIPTION = 'SUBSCRIPTION'),
    (t.FIELD = 'FIELD'),
    (t.FRAGMENT_DEFINITION = 'FRAGMENT_DEFINITION'),
    (t.FRAGMENT_SPREAD = 'FRAGMENT_SPREAD'),
    (t.INLINE_FRAGMENT = 'INLINE_FRAGMENT'),
    (t.VARIABLE_DEFINITION = 'VARIABLE_DEFINITION'),
    (t.SCHEMA = 'SCHEMA'),
    (t.SCALAR = 'SCALAR'),
    (t.OBJECT = 'OBJECT'),
    (t.FIELD_DEFINITION = 'FIELD_DEFINITION'),
    (t.ARGUMENT_DEFINITION = 'ARGUMENT_DEFINITION'),
    (t.INTERFACE = 'INTERFACE'),
    (t.UNION = 'UNION'),
    (t.ENUM = 'ENUM'),
    (t.ENUM_VALUE = 'ENUM_VALUE'),
    (t.INPUT_OBJECT = 'INPUT_OBJECT'),
    (t.INPUT_FIELD_DEFINITION = 'INPUT_FIELD_DEFINITION');
})(ce || (ce = {}));
var A;
(function (t) {
  (t.NAME = 'Name'),
    (t.DOCUMENT = 'Document'),
    (t.OPERATION_DEFINITION = 'OperationDefinition'),
    (t.VARIABLE_DEFINITION = 'VariableDefinition'),
    (t.SELECTION_SET = 'SelectionSet'),
    (t.FIELD = 'Field'),
    (t.ARGUMENT = 'Argument'),
    (t.FRAGMENT_SPREAD = 'FragmentSpread'),
    (t.INLINE_FRAGMENT = 'InlineFragment'),
    (t.FRAGMENT_DEFINITION = 'FragmentDefinition'),
    (t.VARIABLE = 'Variable'),
    (t.INT = 'IntValue'),
    (t.FLOAT = 'FloatValue'),
    (t.STRING = 'StringValue'),
    (t.BOOLEAN = 'BooleanValue'),
    (t.NULL = 'NullValue'),
    (t.ENUM = 'EnumValue'),
    (t.LIST = 'ListValue'),
    (t.OBJECT = 'ObjectValue'),
    (t.OBJECT_FIELD = 'ObjectField'),
    (t.DIRECTIVE = 'Directive'),
    (t.NAMED_TYPE = 'NamedType'),
    (t.LIST_TYPE = 'ListType'),
    (t.NON_NULL_TYPE = 'NonNullType'),
    (t.SCHEMA_DEFINITION = 'SchemaDefinition'),
    (t.OPERATION_TYPE_DEFINITION = 'OperationTypeDefinition'),
    (t.SCALAR_TYPE_DEFINITION = 'ScalarTypeDefinition'),
    (t.OBJECT_TYPE_DEFINITION = 'ObjectTypeDefinition'),
    (t.FIELD_DEFINITION = 'FieldDefinition'),
    (t.INPUT_VALUE_DEFINITION = 'InputValueDefinition'),
    (t.INTERFACE_TYPE_DEFINITION = 'InterfaceTypeDefinition'),
    (t.UNION_TYPE_DEFINITION = 'UnionTypeDefinition'),
    (t.ENUM_TYPE_DEFINITION = 'EnumTypeDefinition'),
    (t.ENUM_VALUE_DEFINITION = 'EnumValueDefinition'),
    (t.INPUT_OBJECT_TYPE_DEFINITION = 'InputObjectTypeDefinition'),
    (t.DIRECTIVE_DEFINITION = 'DirectiveDefinition'),
    (t.SCHEMA_EXTENSION = 'SchemaExtension'),
    (t.SCALAR_TYPE_EXTENSION = 'ScalarTypeExtension'),
    (t.OBJECT_TYPE_EXTENSION = 'ObjectTypeExtension'),
    (t.INTERFACE_TYPE_EXTENSION = 'InterfaceTypeExtension'),
    (t.UNION_TYPE_EXTENSION = 'UnionTypeExtension'),
    (t.ENUM_TYPE_EXTENSION = 'EnumTypeExtension'),
    (t.INPUT_OBJECT_TYPE_EXTENSION = 'InputObjectTypeExtension');
})(A || (A = {}));
function Go(t) {
  return t === 9 || t === 32;
}
function ca(t) {
  return t >= 48 && t <= 57;
}
function Dd(t) {
  return (t >= 97 && t <= 122) || (t >= 65 && t <= 90);
}
function mc(t) {
  return Dd(t) || t === 95;
}
function $d(t) {
  return Dd(t) || ca(t) || t === 95;
}
function f1(t) {
  var e;
  let r = Number.MAX_SAFE_INTEGER,
    n = null,
    i = -1;
  for (let o = 0; o < t.length; ++o) {
    var a;
    const c = t[o],
      h = u1(c);
    h !== c.length &&
      ((n = (a = n) !== null && a !== void 0 ? a : o), (i = o), o !== 0 && h < r && (r = h));
  }
  return t
    .map((o, c) => (c === 0 ? o : o.slice(r)))
    .slice((e = n) !== null && e !== void 0 ? e : 0, i + 1);
}
function u1(t) {
  let e = 0;
  for (; e < t.length && Go(t.charCodeAt(e)); ) ++e;
  return e;
}
function d1(t) {
  if (t === '') return !0;
  let e = !0,
    r = !1,
    n = !0,
    i = !1;
  for (let a = 0; a < t.length; ++a)
    switch (t.codePointAt(a)) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 11:
      case 12:
      case 14:
      case 15:
        return !1;
      case 13:
        return !1;
      case 10:
        if (e && !i) return !1;
        (i = !0), (e = !0), (r = !1);
        break;
      case 9:
      case 32:
        r || (r = e);
        break;
      default:
        n && (n = r), (e = !1);
    }
  return !(e || (n && i));
}
function kd(t, e) {
  const r = t.replace(/"""/g, '\\"""'),
    n = r.split(/\r\n|[\n\r]/g),
    i = n.length === 1,
    a = n.length > 1 && n.slice(1).every((I) => I.length === 0 || Go(I.charCodeAt(0))),
    o = r.endsWith('\\"""'),
    c = t.endsWith('"') && !o,
    h = t.endsWith('\\'),
    m = c || h,
    w = !(e != null && e.minimize) && (!i || t.length > 70 || m || a || o);
  let x = '';
  const T = i && Go(t.charCodeAt(0));
  return (
    ((w && !T) || a) &&
      (x += `
`),
    (x += r),
    (w || m) &&
      (x += `
`),
    '"""' + x + '"""'
  );
}
var L;
(function (t) {
  (t.SOF = '<SOF>'),
    (t.EOF = '<EOF>'),
    (t.BANG = '!'),
    (t.DOLLAR = '$'),
    (t.AMP = '&'),
    (t.PAREN_L = '('),
    (t.PAREN_R = ')'),
    (t.SPREAD = '...'),
    (t.COLON = ':'),
    (t.EQUALS = '='),
    (t.AT = '@'),
    (t.BRACKET_L = '['),
    (t.BRACKET_R = ']'),
    (t.BRACE_L = '{'),
    (t.PIPE = '|'),
    (t.BRACE_R = '}'),
    (t.NAME = 'Name'),
    (t.INT = 'Int'),
    (t.FLOAT = 'Float'),
    (t.STRING = 'String'),
    (t.BLOCK_STRING = 'BlockString'),
    (t.COMMENT = 'Comment');
})(L || (L = {}));
class vc {
  constructor(e) {
    const r = new pc(L.SOF, 0, 0, 0, 0);
    (this.source = e),
      (this.lastToken = r),
      (this.token = r),
      (this.line = 1),
      (this.lineStart = 0);
  }
  get [Symbol.toStringTag]() {
    return 'Lexer';
  }
  advance() {
    return (this.lastToken = this.token), (this.token = this.lookahead());
  }
  lookahead() {
    let e = this.token;
    if (e.kind !== L.EOF)
      do
        if (e.next) e = e.next;
        else {
          const r = l1(this, e.end);
          (e.next = r), (r.prev = e), (e = r);
        }
      while (e.kind === L.COMMENT);
    return e;
  }
}
function Cd(t) {
  return (
    t === L.BANG ||
    t === L.DOLLAR ||
    t === L.AMP ||
    t === L.PAREN_L ||
    t === L.PAREN_R ||
    t === L.SPREAD ||
    t === L.COLON ||
    t === L.EQUALS ||
    t === L.AT ||
    t === L.BRACKET_L ||
    t === L.BRACKET_R ||
    t === L.BRACE_L ||
    t === L.PIPE ||
    t === L.BRACE_R
  );
}
function Li(t) {
  return (t >= 0 && t <= 55295) || (t >= 57344 && t <= 1114111);
}
function Ps(t, e) {
  return Pd(t.charCodeAt(e)) && Ld(t.charCodeAt(e + 1));
}
function Pd(t) {
  return t >= 55296 && t <= 56319;
}
function Ld(t) {
  return t >= 56320 && t <= 57343;
}
function Wn(t, e) {
  const r = t.source.body.codePointAt(e);
  if (r === void 0) return L.EOF;
  if (r >= 32 && r <= 126) {
    const n = String.fromCodePoint(r);
    return n === '"' ? `'"'` : `"${n}"`;
  }
  return 'U+' + r.toString(16).toUpperCase().padStart(4, '0');
}
function Dt(t, e, r, n, i) {
  const a = t.line,
    o = 1 + r - t.lineStart;
  return new pc(e, r, n, a, o, i);
}
function l1(t, e) {
  const r = t.source.body,
    n = r.length;
  let i = e;
  for (; i < n; ) {
    const a = r.charCodeAt(i);
    switch (a) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++i;
        continue;
      case 10:
        ++i, ++t.line, (t.lineStart = i);
        continue;
      case 13:
        r.charCodeAt(i + 1) === 10 ? (i += 2) : ++i, ++t.line, (t.lineStart = i);
        continue;
      case 35:
        return h1(t, i);
      case 33:
        return Dt(t, L.BANG, i, i + 1);
      case 36:
        return Dt(t, L.DOLLAR, i, i + 1);
      case 38:
        return Dt(t, L.AMP, i, i + 1);
      case 40:
        return Dt(t, L.PAREN_L, i, i + 1);
      case 41:
        return Dt(t, L.PAREN_R, i, i + 1);
      case 46:
        if (r.charCodeAt(i + 1) === 46 && r.charCodeAt(i + 2) === 46)
          return Dt(t, L.SPREAD, i, i + 3);
        break;
      case 58:
        return Dt(t, L.COLON, i, i + 1);
      case 61:
        return Dt(t, L.EQUALS, i, i + 1);
      case 64:
        return Dt(t, L.AT, i, i + 1);
      case 91:
        return Dt(t, L.BRACKET_L, i, i + 1);
      case 93:
        return Dt(t, L.BRACKET_R, i, i + 1);
      case 123:
        return Dt(t, L.BRACE_L, i, i + 1);
      case 124:
        return Dt(t, L.PIPE, i, i + 1);
      case 125:
        return Dt(t, L.BRACE_R, i, i + 1);
      case 34:
        return r.charCodeAt(i + 1) === 34 && r.charCodeAt(i + 2) === 34 ? y1(t, i) : m1(t, i);
    }
    if (ca(a) || a === 45) return p1(t, i, a);
    if (mc(a)) return w1(t, i);
    throw Pt(
      t.source,
      i,
      a === 39
        ? `Unexpected single quote character ('), did you mean to use a double quote (")?`
        : Li(a) || Ps(r, i)
        ? `Unexpected character: ${Wn(t, i)}.`
        : `Invalid character: ${Wn(t, i)}.`
    );
  }
  return Dt(t, L.EOF, n, n);
}
function h1(t, e) {
  const r = t.source.body,
    n = r.length;
  let i = e + 1;
  for (; i < n; ) {
    const a = r.charCodeAt(i);
    if (a === 10 || a === 13) break;
    if (Li(a)) ++i;
    else if (Ps(r, i)) i += 2;
    else break;
  }
  return Dt(t, L.COMMENT, e, i, r.slice(e + 1, i));
}
function p1(t, e, r) {
  const n = t.source.body;
  let i = e,
    a = r,
    o = !1;
  if ((a === 45 && (a = n.charCodeAt(++i)), a === 48)) {
    if (((a = n.charCodeAt(++i)), ca(a)))
      throw Pt(t.source, i, `Invalid number, unexpected digit after 0: ${Wn(t, i)}.`);
  } else (i = xo(t, i, a)), (a = n.charCodeAt(i));
  if (
    (a === 46 && ((o = !0), (a = n.charCodeAt(++i)), (i = xo(t, i, a)), (a = n.charCodeAt(i))),
    (a === 69 || a === 101) &&
      ((o = !0),
      (a = n.charCodeAt(++i)),
      (a === 43 || a === 45) && (a = n.charCodeAt(++i)),
      (i = xo(t, i, a)),
      (a = n.charCodeAt(i))),
    a === 46 || mc(a))
  )
    throw Pt(t.source, i, `Invalid number, expected digit but got: ${Wn(t, i)}.`);
  return Dt(t, o ? L.FLOAT : L.INT, e, i, n.slice(e, i));
}
function xo(t, e, r) {
  if (!ca(r)) throw Pt(t.source, e, `Invalid number, expected digit but got: ${Wn(t, e)}.`);
  const n = t.source.body;
  let i = e + 1;
  for (; ca(n.charCodeAt(i)); ) ++i;
  return i;
}
function m1(t, e) {
  const r = t.source.body,
    n = r.length;
  let i = e + 1,
    a = i,
    o = '';
  for (; i < n; ) {
    const c = r.charCodeAt(i);
    if (c === 34) return (o += r.slice(a, i)), Dt(t, L.STRING, e, i + 1, o);
    if (c === 92) {
      o += r.slice(a, i);
      const h =
        r.charCodeAt(i + 1) === 117
          ? r.charCodeAt(i + 2) === 123
            ? v1(t, i)
            : b1(t, i)
          : g1(t, i);
      (o += h.value), (i += h.size), (a = i);
      continue;
    }
    if (c === 10 || c === 13) break;
    if (Li(c)) ++i;
    else if (Ps(r, i)) i += 2;
    else throw Pt(t.source, i, `Invalid character within String: ${Wn(t, i)}.`);
  }
  throw Pt(t.source, i, 'Unterminated string.');
}
function v1(t, e) {
  const r = t.source.body;
  let n = 0,
    i = 3;
  for (; i < 12; ) {
    const a = r.charCodeAt(e + i++);
    if (a === 125) {
      if (i < 5 || !Li(n)) break;
      return { value: String.fromCodePoint(n), size: i };
    }
    if (((n = (n << 4) | Xi(a)), n < 0)) break;
  }
  throw Pt(t.source, e, `Invalid Unicode escape sequence: "${r.slice(e, e + i)}".`);
}
function b1(t, e) {
  const r = t.source.body,
    n = Ff(r, e + 2);
  if (Li(n)) return { value: String.fromCodePoint(n), size: 6 };
  if (Pd(n) && r.charCodeAt(e + 6) === 92 && r.charCodeAt(e + 7) === 117) {
    const i = Ff(r, e + 8);
    if (Ld(i)) return { value: String.fromCodePoint(n, i), size: 12 };
  }
  throw Pt(t.source, e, `Invalid Unicode escape sequence: "${r.slice(e, e + 6)}".`);
}
function Ff(t, e) {
  return (
    (Xi(t.charCodeAt(e)) << 12) |
    (Xi(t.charCodeAt(e + 1)) << 8) |
    (Xi(t.charCodeAt(e + 2)) << 4) |
    Xi(t.charCodeAt(e + 3))
  );
}
function Xi(t) {
  return t >= 48 && t <= 57
    ? t - 48
    : t >= 65 && t <= 70
    ? t - 55
    : t >= 97 && t <= 102
    ? t - 87
    : -1;
}
function g1(t, e) {
  const r = t.source.body;
  switch (r.charCodeAt(e + 1)) {
    case 34:
      return { value: '"', size: 2 };
    case 92:
      return { value: '\\', size: 2 };
    case 47:
      return { value: '/', size: 2 };
    case 98:
      return { value: '\b', size: 2 };
    case 102:
      return { value: '\f', size: 2 };
    case 110:
      return {
        value: `
`,
        size: 2,
      };
    case 114:
      return { value: '\r', size: 2 };
    case 116:
      return { value: '	', size: 2 };
  }
  throw Pt(t.source, e, `Invalid character escape sequence: "${r.slice(e, e + 2)}".`);
}
function y1(t, e) {
  const r = t.source.body,
    n = r.length;
  let i = t.lineStart,
    a = e + 3,
    o = a,
    c = '';
  const h = [];
  for (; a < n; ) {
    const m = r.charCodeAt(a);
    if (m === 34 && r.charCodeAt(a + 1) === 34 && r.charCodeAt(a + 2) === 34) {
      (c += r.slice(o, a)), h.push(c);
      const w = Dt(
        t,
        L.BLOCK_STRING,
        e,
        a + 3,
        f1(h).join(`
`)
      );
      return (t.line += h.length - 1), (t.lineStart = i), w;
    }
    if (
      m === 92 &&
      r.charCodeAt(a + 1) === 34 &&
      r.charCodeAt(a + 2) === 34 &&
      r.charCodeAt(a + 3) === 34
    ) {
      (c += r.slice(o, a)), (o = a + 1), (a += 4);
      continue;
    }
    if (m === 10 || m === 13) {
      (c += r.slice(o, a)),
        h.push(c),
        m === 13 && r.charCodeAt(a + 1) === 10 ? (a += 2) : ++a,
        (c = ''),
        (o = a),
        (i = a);
      continue;
    }
    if (Li(m)) ++a;
    else if (Ps(r, a)) a += 2;
    else throw Pt(t.source, a, `Invalid character within String: ${Wn(t, a)}.`);
  }
  throw Pt(t.source, a, 'Unterminated string.');
}
function w1(t, e) {
  const r = t.source.body,
    n = r.length;
  let i = e + 1;
  for (; i < n; ) {
    const a = r.charCodeAt(i);
    if ($d(a)) ++i;
    else break;
  }
  return Dt(t, L.NAME, e, i, r.slice(e, i));
}
const E1 = 10,
  Fd = 2;
function U(t) {
  return Ls(t, []);
}
function Ls(t, e) {
  switch (typeof t) {
    case 'string':
      return JSON.stringify(t);
    case 'function':
      return t.name ? `[function ${t.name}]` : '[function]';
    case 'object':
      return x1(t, e);
    default:
      return String(t);
  }
}
function x1(t, e) {
  if (t === null) return 'null';
  if (e.includes(t)) return '[Circular]';
  const r = [...e, t];
  if (_1(t)) {
    const n = t.toJSON();
    if (n !== t) return typeof n == 'string' ? n : Ls(n, r);
  } else if (Array.isArray(t)) return I1(t, r);
  return T1(t, r);
}
function _1(t) {
  return typeof t.toJSON == 'function';
}
function T1(t, e) {
  const r = Object.entries(t);
  return r.length === 0
    ? '{}'
    : e.length > Fd
    ? '[' + N1(t) + ']'
    : '{ ' + r.map(([i, a]) => i + ': ' + Ls(a, e)).join(', ') + ' }';
}
function I1(t, e) {
  if (t.length === 0) return '[]';
  if (e.length > Fd) return '[Array]';
  const r = Math.min(E1, t.length),
    n = t.length - r,
    i = [];
  for (let a = 0; a < r; ++a) i.push(Ls(t[a], e));
  return (
    n === 1 ? i.push('... 1 more item') : n > 1 && i.push(`... ${n} more items`),
    '[' + i.join(', ') + ']'
  );
}
function N1(t) {
  const e = Object.prototype.toString
    .call(t)
    .replace(/^\[object /, '')
    .replace(/]$/, '');
  if (e === 'Object' && typeof t.constructor == 'function') {
    const r = t.constructor.name;
    if (typeof r == 'string' && r !== '') return r;
  }
  return e;
}
const Pr = function (e, r) {
  return e instanceof r;
};
class Fs {
  constructor(e, r = 'GraphQL request', n = { line: 1, column: 1 }) {
    typeof e == 'string' || ke(!1, `Body must be a string. Received: ${U(e)}.`),
      (this.body = e),
      (this.name = r),
      (this.locationOffset = n),
      this.locationOffset.line > 0 ||
        ke(!1, 'line in locationOffset is 1-indexed and must be positive.'),
      this.locationOffset.column > 0 ||
        ke(!1, 'column in locationOffset is 1-indexed and must be positive.');
  }
  get [Symbol.toStringTag]() {
    return 'Source';
  }
}
function Ud(t) {
  return Pr(t, Fs);
}
function wa(t, e) {
  return new Us(t, e).parseDocument();
}
function qd(t, e) {
  const r = new Us(t, e);
  r.expectToken(L.SOF);
  const n = r.parseValueLiteral(!1);
  return r.expectToken(L.EOF), n;
}
function S1(t, e) {
  const r = new Us(t, e);
  r.expectToken(L.SOF);
  const n = r.parseConstValueLiteral();
  return r.expectToken(L.EOF), n;
}
function M1(t, e) {
  const r = new Us(t, e);
  r.expectToken(L.SOF);
  const n = r.parseTypeReference();
  return r.expectToken(L.EOF), n;
}
class Us {
  constructor(e, r = {}) {
    const n = Ud(e) ? e : new Fs(e);
    (this._lexer = new vc(n)), (this._options = r), (this._tokenCounter = 0);
  }
  parseName() {
    const e = this.expectToken(L.NAME);
    return this.node(e, { kind: A.NAME, value: e.value });
  }
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: A.DOCUMENT,
      definitions: this.many(L.SOF, this.parseDefinition, L.EOF),
    });
  }
  parseDefinition() {
    if (this.peek(L.BRACE_L)) return this.parseOperationDefinition();
    const e = this.peekDescription(),
      r = e ? this._lexer.lookahead() : this._lexer.token;
    if (r.kind === L.NAME) {
      switch (r.value) {
        case 'schema':
          return this.parseSchemaDefinition();
        case 'scalar':
          return this.parseScalarTypeDefinition();
        case 'type':
          return this.parseObjectTypeDefinition();
        case 'interface':
          return this.parseInterfaceTypeDefinition();
        case 'union':
          return this.parseUnionTypeDefinition();
        case 'enum':
          return this.parseEnumTypeDefinition();
        case 'input':
          return this.parseInputObjectTypeDefinition();
        case 'directive':
          return this.parseDirectiveDefinition();
      }
      if (e)
        throw Pt(
          this._lexer.source,
          this._lexer.token.start,
          'Unexpected description, descriptions are supported only on type definitions.'
        );
      switch (r.value) {
        case 'query':
        case 'mutation':
        case 'subscription':
          return this.parseOperationDefinition();
        case 'fragment':
          return this.parseFragmentDefinition();
        case 'extend':
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(r);
  }
  parseOperationDefinition() {
    const e = this._lexer.token;
    if (this.peek(L.BRACE_L))
      return this.node(e, {
        kind: A.OPERATION_DEFINITION,
        operation: Lt.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet(),
      });
    const r = this.parseOperationType();
    let n;
    return (
      this.peek(L.NAME) && (n = this.parseName()),
      this.node(e, {
        kind: A.OPERATION_DEFINITION,
        operation: r,
        name: n,
        variableDefinitions: this.parseVariableDefinitions(),
        directives: this.parseDirectives(!1),
        selectionSet: this.parseSelectionSet(),
      })
    );
  }
  parseOperationType() {
    const e = this.expectToken(L.NAME);
    switch (e.value) {
      case 'query':
        return Lt.QUERY;
      case 'mutation':
        return Lt.MUTATION;
      case 'subscription':
        return Lt.SUBSCRIPTION;
    }
    throw this.unexpected(e);
  }
  parseVariableDefinitions() {
    return this.optionalMany(L.PAREN_L, this.parseVariableDefinition, L.PAREN_R);
  }
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: A.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(L.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(L.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives(),
    });
  }
  parseVariable() {
    const e = this._lexer.token;
    return this.expectToken(L.DOLLAR), this.node(e, { kind: A.VARIABLE, name: this.parseName() });
  }
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: A.SELECTION_SET,
      selections: this.many(L.BRACE_L, this.parseSelection, L.BRACE_R),
    });
  }
  parseSelection() {
    return this.peek(L.SPREAD) ? this.parseFragment() : this.parseField();
  }
  parseField() {
    const e = this._lexer.token,
      r = this.parseName();
    let n, i;
    return (
      this.expectOptionalToken(L.COLON) ? ((n = r), (i = this.parseName())) : (i = r),
      this.node(e, {
        kind: A.FIELD,
        alias: n,
        name: i,
        arguments: this.parseArguments(!1),
        directives: this.parseDirectives(!1),
        selectionSet: this.peek(L.BRACE_L) ? this.parseSelectionSet() : void 0,
      })
    );
  }
  parseArguments(e) {
    const r = e ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(L.PAREN_L, r, L.PAREN_R);
  }
  parseArgument(e = !1) {
    const r = this._lexer.token,
      n = this.parseName();
    return (
      this.expectToken(L.COLON),
      this.node(r, { kind: A.ARGUMENT, name: n, value: this.parseValueLiteral(e) })
    );
  }
  parseConstArgument() {
    return this.parseArgument(!0);
  }
  parseFragment() {
    const e = this._lexer.token;
    this.expectToken(L.SPREAD);
    const r = this.expectOptionalKeyword('on');
    return !r && this.peek(L.NAME)
      ? this.node(e, {
          kind: A.FRAGMENT_SPREAD,
          name: this.parseFragmentName(),
          directives: this.parseDirectives(!1),
        })
      : this.node(e, {
          kind: A.INLINE_FRAGMENT,
          typeCondition: r ? this.parseNamedType() : void 0,
          directives: this.parseDirectives(!1),
          selectionSet: this.parseSelectionSet(),
        });
  }
  parseFragmentDefinition() {
    const e = this._lexer.token;
    return (
      this.expectKeyword('fragment'),
      this._options.allowLegacyFragmentVariables === !0
        ? this.node(e, {
            kind: A.FRAGMENT_DEFINITION,
            name: this.parseFragmentName(),
            variableDefinitions: this.parseVariableDefinitions(),
            typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
            directives: this.parseDirectives(!1),
            selectionSet: this.parseSelectionSet(),
          })
        : this.node(e, {
            kind: A.FRAGMENT_DEFINITION,
            name: this.parseFragmentName(),
            typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
            directives: this.parseDirectives(!1),
            selectionSet: this.parseSelectionSet(),
          })
    );
  }
  parseFragmentName() {
    if (this._lexer.token.value === 'on') throw this.unexpected();
    return this.parseName();
  }
  parseValueLiteral(e) {
    const r = this._lexer.token;
    switch (r.kind) {
      case L.BRACKET_L:
        return this.parseList(e);
      case L.BRACE_L:
        return this.parseObject(e);
      case L.INT:
        return this.advanceLexer(), this.node(r, { kind: A.INT, value: r.value });
      case L.FLOAT:
        return this.advanceLexer(), this.node(r, { kind: A.FLOAT, value: r.value });
      case L.STRING:
      case L.BLOCK_STRING:
        return this.parseStringLiteral();
      case L.NAME:
        switch ((this.advanceLexer(), r.value)) {
          case 'true':
            return this.node(r, { kind: A.BOOLEAN, value: !0 });
          case 'false':
            return this.node(r, { kind: A.BOOLEAN, value: !1 });
          case 'null':
            return this.node(r, { kind: A.NULL });
          default:
            return this.node(r, { kind: A.ENUM, value: r.value });
        }
      case L.DOLLAR:
        if (e)
          if ((this.expectToken(L.DOLLAR), this._lexer.token.kind === L.NAME)) {
            const n = this._lexer.token.value;
            throw Pt(this._lexer.source, r.start, `Unexpected variable "$${n}" in constant value.`);
          } else throw this.unexpected(r);
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(!0);
  }
  parseStringLiteral() {
    const e = this._lexer.token;
    return (
      this.advanceLexer(),
      this.node(e, { kind: A.STRING, value: e.value, block: e.kind === L.BLOCK_STRING })
    );
  }
  parseList(e) {
    const r = () => this.parseValueLiteral(e);
    return this.node(this._lexer.token, {
      kind: A.LIST,
      values: this.any(L.BRACKET_L, r, L.BRACKET_R),
    });
  }
  parseObject(e) {
    const r = () => this.parseObjectField(e);
    return this.node(this._lexer.token, {
      kind: A.OBJECT,
      fields: this.any(L.BRACE_L, r, L.BRACE_R),
    });
  }
  parseObjectField(e) {
    const r = this._lexer.token,
      n = this.parseName();
    return (
      this.expectToken(L.COLON),
      this.node(r, { kind: A.OBJECT_FIELD, name: n, value: this.parseValueLiteral(e) })
    );
  }
  parseDirectives(e) {
    const r = [];
    for (; this.peek(L.AT); ) r.push(this.parseDirective(e));
    return r;
  }
  parseConstDirectives() {
    return this.parseDirectives(!0);
  }
  parseDirective(e) {
    const r = this._lexer.token;
    return (
      this.expectToken(L.AT),
      this.node(r, { kind: A.DIRECTIVE, name: this.parseName(), arguments: this.parseArguments(e) })
    );
  }
  parseTypeReference() {
    const e = this._lexer.token;
    let r;
    if (this.expectOptionalToken(L.BRACKET_L)) {
      const n = this.parseTypeReference();
      this.expectToken(L.BRACKET_R), (r = this.node(e, { kind: A.LIST_TYPE, type: n }));
    } else r = this.parseNamedType();
    return this.expectOptionalToken(L.BANG) ? this.node(e, { kind: A.NON_NULL_TYPE, type: r }) : r;
  }
  parseNamedType() {
    return this.node(this._lexer.token, { kind: A.NAMED_TYPE, name: this.parseName() });
  }
  peekDescription() {
    return this.peek(L.STRING) || this.peek(L.BLOCK_STRING);
  }
  parseDescription() {
    if (this.peekDescription()) return this.parseStringLiteral();
  }
  parseSchemaDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription();
    this.expectKeyword('schema');
    const n = this.parseConstDirectives(),
      i = this.many(L.BRACE_L, this.parseOperationTypeDefinition, L.BRACE_R);
    return this.node(e, {
      kind: A.SCHEMA_DEFINITION,
      description: r,
      directives: n,
      operationTypes: i,
    });
  }
  parseOperationTypeDefinition() {
    const e = this._lexer.token,
      r = this.parseOperationType();
    this.expectToken(L.COLON);
    const n = this.parseNamedType();
    return this.node(e, { kind: A.OPERATION_TYPE_DEFINITION, operation: r, type: n });
  }
  parseScalarTypeDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription();
    this.expectKeyword('scalar');
    const n = this.parseName(),
      i = this.parseConstDirectives();
    return this.node(e, { kind: A.SCALAR_TYPE_DEFINITION, description: r, name: n, directives: i });
  }
  parseObjectTypeDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription();
    this.expectKeyword('type');
    const n = this.parseName(),
      i = this.parseImplementsInterfaces(),
      a = this.parseConstDirectives(),
      o = this.parseFieldsDefinition();
    return this.node(e, {
      kind: A.OBJECT_TYPE_DEFINITION,
      description: r,
      name: n,
      interfaces: i,
      directives: a,
      fields: o,
    });
  }
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword('implements')
      ? this.delimitedMany(L.AMP, this.parseNamedType)
      : [];
  }
  parseFieldsDefinition() {
    return this.optionalMany(L.BRACE_L, this.parseFieldDefinition, L.BRACE_R);
  }
  parseFieldDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription(),
      n = this.parseName(),
      i = this.parseArgumentDefs();
    this.expectToken(L.COLON);
    const a = this.parseTypeReference(),
      o = this.parseConstDirectives();
    return this.node(e, {
      kind: A.FIELD_DEFINITION,
      description: r,
      name: n,
      arguments: i,
      type: a,
      directives: o,
    });
  }
  parseArgumentDefs() {
    return this.optionalMany(L.PAREN_L, this.parseInputValueDef, L.PAREN_R);
  }
  parseInputValueDef() {
    const e = this._lexer.token,
      r = this.parseDescription(),
      n = this.parseName();
    this.expectToken(L.COLON);
    const i = this.parseTypeReference();
    let a;
    this.expectOptionalToken(L.EQUALS) && (a = this.parseConstValueLiteral());
    const o = this.parseConstDirectives();
    return this.node(e, {
      kind: A.INPUT_VALUE_DEFINITION,
      description: r,
      name: n,
      type: i,
      defaultValue: a,
      directives: o,
    });
  }
  parseInterfaceTypeDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription();
    this.expectKeyword('interface');
    const n = this.parseName(),
      i = this.parseImplementsInterfaces(),
      a = this.parseConstDirectives(),
      o = this.parseFieldsDefinition();
    return this.node(e, {
      kind: A.INTERFACE_TYPE_DEFINITION,
      description: r,
      name: n,
      interfaces: i,
      directives: a,
      fields: o,
    });
  }
  parseUnionTypeDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription();
    this.expectKeyword('union');
    const n = this.parseName(),
      i = this.parseConstDirectives(),
      a = this.parseUnionMemberTypes();
    return this.node(e, {
      kind: A.UNION_TYPE_DEFINITION,
      description: r,
      name: n,
      directives: i,
      types: a,
    });
  }
  parseUnionMemberTypes() {
    return this.expectOptionalToken(L.EQUALS)
      ? this.delimitedMany(L.PIPE, this.parseNamedType)
      : [];
  }
  parseEnumTypeDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription();
    this.expectKeyword('enum');
    const n = this.parseName(),
      i = this.parseConstDirectives(),
      a = this.parseEnumValuesDefinition();
    return this.node(e, {
      kind: A.ENUM_TYPE_DEFINITION,
      description: r,
      name: n,
      directives: i,
      values: a,
    });
  }
  parseEnumValuesDefinition() {
    return this.optionalMany(L.BRACE_L, this.parseEnumValueDefinition, L.BRACE_R);
  }
  parseEnumValueDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription(),
      n = this.parseEnumValueName(),
      i = this.parseConstDirectives();
    return this.node(e, { kind: A.ENUM_VALUE_DEFINITION, description: r, name: n, directives: i });
  }
  parseEnumValueName() {
    if (
      this._lexer.token.value === 'true' ||
      this._lexer.token.value === 'false' ||
      this._lexer.token.value === 'null'
    )
      throw Pt(
        this._lexer.source,
        this._lexer.token.start,
        `${Va(this._lexer.token)} is reserved and cannot be used for an enum value.`
      );
    return this.parseName();
  }
  parseInputObjectTypeDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription();
    this.expectKeyword('input');
    const n = this.parseName(),
      i = this.parseConstDirectives(),
      a = this.parseInputFieldsDefinition();
    return this.node(e, {
      kind: A.INPUT_OBJECT_TYPE_DEFINITION,
      description: r,
      name: n,
      directives: i,
      fields: a,
    });
  }
  parseInputFieldsDefinition() {
    return this.optionalMany(L.BRACE_L, this.parseInputValueDef, L.BRACE_R);
  }
  parseTypeSystemExtension() {
    const e = this._lexer.lookahead();
    if (e.kind === L.NAME)
      switch (e.value) {
        case 'schema':
          return this.parseSchemaExtension();
        case 'scalar':
          return this.parseScalarTypeExtension();
        case 'type':
          return this.parseObjectTypeExtension();
        case 'interface':
          return this.parseInterfaceTypeExtension();
        case 'union':
          return this.parseUnionTypeExtension();
        case 'enum':
          return this.parseEnumTypeExtension();
        case 'input':
          return this.parseInputObjectTypeExtension();
      }
    throw this.unexpected(e);
  }
  parseSchemaExtension() {
    const e = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('schema');
    const r = this.parseConstDirectives(),
      n = this.optionalMany(L.BRACE_L, this.parseOperationTypeDefinition, L.BRACE_R);
    if (r.length === 0 && n.length === 0) throw this.unexpected();
    return this.node(e, { kind: A.SCHEMA_EXTENSION, directives: r, operationTypes: n });
  }
  parseScalarTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('scalar');
    const r = this.parseName(),
      n = this.parseConstDirectives();
    if (n.length === 0) throw this.unexpected();
    return this.node(e, { kind: A.SCALAR_TYPE_EXTENSION, name: r, directives: n });
  }
  parseObjectTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('type');
    const r = this.parseName(),
      n = this.parseImplementsInterfaces(),
      i = this.parseConstDirectives(),
      a = this.parseFieldsDefinition();
    if (n.length === 0 && i.length === 0 && a.length === 0) throw this.unexpected();
    return this.node(e, {
      kind: A.OBJECT_TYPE_EXTENSION,
      name: r,
      interfaces: n,
      directives: i,
      fields: a,
    });
  }
  parseInterfaceTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('interface');
    const r = this.parseName(),
      n = this.parseImplementsInterfaces(),
      i = this.parseConstDirectives(),
      a = this.parseFieldsDefinition();
    if (n.length === 0 && i.length === 0 && a.length === 0) throw this.unexpected();
    return this.node(e, {
      kind: A.INTERFACE_TYPE_EXTENSION,
      name: r,
      interfaces: n,
      directives: i,
      fields: a,
    });
  }
  parseUnionTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('union');
    const r = this.parseName(),
      n = this.parseConstDirectives(),
      i = this.parseUnionMemberTypes();
    if (n.length === 0 && i.length === 0) throw this.unexpected();
    return this.node(e, { kind: A.UNION_TYPE_EXTENSION, name: r, directives: n, types: i });
  }
  parseEnumTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('enum');
    const r = this.parseName(),
      n = this.parseConstDirectives(),
      i = this.parseEnumValuesDefinition();
    if (n.length === 0 && i.length === 0) throw this.unexpected();
    return this.node(e, { kind: A.ENUM_TYPE_EXTENSION, name: r, directives: n, values: i });
  }
  parseInputObjectTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('input');
    const r = this.parseName(),
      n = this.parseConstDirectives(),
      i = this.parseInputFieldsDefinition();
    if (n.length === 0 && i.length === 0) throw this.unexpected();
    return this.node(e, { kind: A.INPUT_OBJECT_TYPE_EXTENSION, name: r, directives: n, fields: i });
  }
  parseDirectiveDefinition() {
    const e = this._lexer.token,
      r = this.parseDescription();
    this.expectKeyword('directive'), this.expectToken(L.AT);
    const n = this.parseName(),
      i = this.parseArgumentDefs(),
      a = this.expectOptionalKeyword('repeatable');
    this.expectKeyword('on');
    const o = this.parseDirectiveLocations();
    return this.node(e, {
      kind: A.DIRECTIVE_DEFINITION,
      description: r,
      name: n,
      arguments: i,
      repeatable: a,
      locations: o,
    });
  }
  parseDirectiveLocations() {
    return this.delimitedMany(L.PIPE, this.parseDirectiveLocation);
  }
  parseDirectiveLocation() {
    const e = this._lexer.token,
      r = this.parseName();
    if (Object.prototype.hasOwnProperty.call(ce, r.value)) return r;
    throw this.unexpected(e);
  }
  node(e, r) {
    return (
      this._options.noLocation !== !0 &&
        (r.loc = new Od(e, this._lexer.lastToken, this._lexer.source)),
      r
    );
  }
  peek(e) {
    return this._lexer.token.kind === e;
  }
  expectToken(e) {
    const r = this._lexer.token;
    if (r.kind === e) return this.advanceLexer(), r;
    throw Pt(this._lexer.source, r.start, `Expected ${Bd(e)}, found ${Va(r)}.`);
  }
  expectOptionalToken(e) {
    return this._lexer.token.kind === e ? (this.advanceLexer(), !0) : !1;
  }
  expectKeyword(e) {
    const r = this._lexer.token;
    if (r.kind === L.NAME && r.value === e) this.advanceLexer();
    else throw Pt(this._lexer.source, r.start, `Expected "${e}", found ${Va(r)}.`);
  }
  expectOptionalKeyword(e) {
    const r = this._lexer.token;
    return r.kind === L.NAME && r.value === e ? (this.advanceLexer(), !0) : !1;
  }
  unexpected(e) {
    const r = e ?? this._lexer.token;
    return Pt(this._lexer.source, r.start, `Unexpected ${Va(r)}.`);
  }
  any(e, r, n) {
    this.expectToken(e);
    const i = [];
    for (; !this.expectOptionalToken(n); ) i.push(r.call(this));
    return i;
  }
  optionalMany(e, r, n) {
    if (this.expectOptionalToken(e)) {
      const i = [];
      do i.push(r.call(this));
      while (!this.expectOptionalToken(n));
      return i;
    }
    return [];
  }
  many(e, r, n) {
    this.expectToken(e);
    const i = [];
    do i.push(r.call(this));
    while (!this.expectOptionalToken(n));
    return i;
  }
  delimitedMany(e, r) {
    this.expectOptionalToken(e);
    const n = [];
    do n.push(r.call(this));
    while (this.expectOptionalToken(e));
    return n;
  }
  advanceLexer() {
    const { maxTokens: e } = this._options,
      r = this._lexer.advance();
    if (e !== void 0 && r.kind !== L.EOF && (++this._tokenCounter, this._tokenCounter > e))
      throw Pt(
        this._lexer.source,
        r.start,
        `Document contains more that ${e} tokens. Parsing aborted.`
      );
  }
}
function Va(t) {
  const e = t.value;
  return Bd(t.kind) + (e != null ? ` "${e}"` : '');
}
function Bd(t) {
  return Cd(t) ? `"${t}"` : t;
}
const A1 = 5;
function wn(t, e) {
  const [r, n] = e ? [t, e] : [void 0, t];
  let i = ' Did you mean ';
  r && (i += r + ' ');
  const a = n.map((h) => `"${h}"`);
  switch (a.length) {
    case 0:
      return '';
    case 1:
      return i + a[0] + '?';
    case 2:
      return i + a[0] + ' or ' + a[1] + '?';
  }
  const o = a.slice(0, A1),
    c = o.pop();
  return i + o.join(', ') + ', or ' + c + '?';
}
function Uf(t) {
  return t;
}
function En(t, e) {
  const r = Object.create(null);
  for (const n of t) r[e(n)] = n;
  return r;
}
function Nn(t, e, r) {
  const n = Object.create(null);
  for (const i of t) n[e(i)] = r(i);
  return n;
}
function pn(t, e) {
  const r = Object.create(null);
  for (const n of Object.keys(t)) r[n] = e(t[n], n);
  return r;
}
function Ea(t, e) {
  let r = 0,
    n = 0;
  for (; r < t.length && n < e.length; ) {
    let i = t.charCodeAt(r),
      a = e.charCodeAt(n);
    if (ja(i) && ja(a)) {
      let o = 0;
      do ++r, (o = o * 10 + i - Jo), (i = t.charCodeAt(r));
      while (ja(i) && o > 0);
      let c = 0;
      do ++n, (c = c * 10 + a - Jo), (a = e.charCodeAt(n));
      while (ja(a) && c > 0);
      if (o < c) return -1;
      if (o > c) return 1;
    } else {
      if (i < a) return -1;
      if (i > a) return 1;
      ++r, ++n;
    }
  }
  return t.length - e.length;
}
const Jo = 48,
  O1 = 57;
function ja(t) {
  return !isNaN(t) && Jo <= t && t <= O1;
}
function kn(t, e) {
  const r = Object.create(null),
    n = new R1(t),
    i = Math.floor(t.length * 0.4) + 1;
  for (const a of e) {
    const o = n.measure(a, i);
    o !== void 0 && (r[a] = o);
  }
  return Object.keys(r).sort((a, o) => {
    const c = r[a] - r[o];
    return c !== 0 ? c : Ea(a, o);
  });
}
class R1 {
  constructor(e) {
    (this._input = e),
      (this._inputLowerCase = e.toLowerCase()),
      (this._inputArray = qf(this._inputLowerCase)),
      (this._rows = [
        new Array(e.length + 1).fill(0),
        new Array(e.length + 1).fill(0),
        new Array(e.length + 1).fill(0),
      ]);
  }
  measure(e, r) {
    if (this._input === e) return 0;
    const n = e.toLowerCase();
    if (this._inputLowerCase === n) return 1;
    let i = qf(n),
      a = this._inputArray;
    if (i.length < a.length) {
      const w = i;
      (i = a), (a = w);
    }
    const o = i.length,
      c = a.length;
    if (o - c > r) return;
    const h = this._rows;
    for (let w = 0; w <= c; w++) h[0][w] = w;
    for (let w = 1; w <= o; w++) {
      const x = h[(w - 1) % 3],
        T = h[w % 3];
      let I = (T[0] = w);
      for (let M = 1; M <= c; M++) {
        const k = i[w - 1] === a[M - 1] ? 0 : 1;
        let F = Math.min(x[M] + 1, T[M - 1] + 1, x[M - 1] + k);
        if (w > 1 && M > 1 && i[w - 1] === a[M - 2] && i[w - 2] === a[M - 1]) {
          const j = h[(w - 2) % 3][M - 2];
          F = Math.min(F, j + 1);
        }
        F < I && (I = F), (T[M] = F);
      }
      if (I > r) return;
    }
    const m = h[o % 3][c];
    return m <= r ? m : void 0;
  }
}
function qf(t) {
  const e = t.length,
    r = new Array(e);
  for (let n = 0; n < e; ++n) r[n] = t.charCodeAt(n);
  return r;
}
function Tr(t) {
  if (t == null) return Object.create(null);
  if (Object.getPrototypeOf(t) === null) return t;
  const e = Object.create(null);
  for (const [r, n] of Object.entries(t)) e[r] = n;
  return e;
}
function D1(t) {
  return `"${t.replace($1, k1)}"`;
}
const $1 = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function k1(t) {
  return C1[t.charCodeAt(0)];
}
const C1 = [
    '\\u0000',
    '\\u0001',
    '\\u0002',
    '\\u0003',
    '\\u0004',
    '\\u0005',
    '\\u0006',
    '\\u0007',
    '\\b',
    '\\t',
    '\\n',
    '\\u000B',
    '\\f',
    '\\r',
    '\\u000E',
    '\\u000F',
    '\\u0010',
    '\\u0011',
    '\\u0012',
    '\\u0013',
    '\\u0014',
    '\\u0015',
    '\\u0016',
    '\\u0017',
    '\\u0018',
    '\\u0019',
    '\\u001A',
    '\\u001B',
    '\\u001C',
    '\\u001D',
    '\\u001E',
    '\\u001F',
    '',
    '',
    '\\"',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '\\\\',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '\\u007F',
    '\\u0080',
    '\\u0081',
    '\\u0082',
    '\\u0083',
    '\\u0084',
    '\\u0085',
    '\\u0086',
    '\\u0087',
    '\\u0088',
    '\\u0089',
    '\\u008A',
    '\\u008B',
    '\\u008C',
    '\\u008D',
    '\\u008E',
    '\\u008F',
    '\\u0090',
    '\\u0091',
    '\\u0092',
    '\\u0093',
    '\\u0094',
    '\\u0095',
    '\\u0096',
    '\\u0097',
    '\\u0098',
    '\\u0099',
    '\\u009A',
    '\\u009B',
    '\\u009C',
    '\\u009D',
    '\\u009E',
    '\\u009F',
  ],
  fi = Object.freeze({});
function Fi(t, e, r = Rd) {
  const n = new Map();
  for (const j of Object.values(A)) n.set(j, xi(e, j));
  let i,
    a = Array.isArray(t),
    o = [t],
    c = -1,
    h = [],
    m = t,
    w,
    x;
  const T = [],
    I = [];
  do {
    c++;
    const j = c === o.length,
      Z = j && h.length !== 0;
    if (j) {
      if (((w = I.length === 0 ? void 0 : T[T.length - 1]), (m = x), (x = I.pop()), Z))
        if (a) {
          m = m.slice();
          let ue = 0;
          for (const [X, J] of h) {
            const Q = X - ue;
            J === null ? (m.splice(Q, 1), ue++) : (m[Q] = J);
          }
        } else {
          m = Object.defineProperties({}, Object.getOwnPropertyDescriptors(m));
          for (const [ue, X] of h) m[ue] = X;
        }
      (c = i.index), (o = i.keys), (h = i.edits), (a = i.inArray), (i = i.prev);
    } else if (x) {
      if (((w = a ? c : o[c]), (m = x[w]), m == null)) continue;
      T.push(w);
    }
    let me;
    if (!Array.isArray(m)) {
      var M, k;
      zo(m) || ke(!1, `Invalid AST Node: ${U(m)}.`);
      const ue = j
        ? (M = n.get(m.kind)) === null || M === void 0
          ? void 0
          : M.leave
        : (k = n.get(m.kind)) === null || k === void 0
        ? void 0
        : k.enter;
      if (((me = ue?.call(e, m, w, x, T, I)), me === fi)) break;
      if (me === !1) {
        if (!j) {
          T.pop();
          continue;
        }
      } else if (me !== void 0 && (h.push([w, me]), !j))
        if (zo(me)) m = me;
        else {
          T.pop();
          continue;
        }
    }
    if ((me === void 0 && Z && h.push([w, m]), j)) T.pop();
    else {
      var F;
      (i = { inArray: a, index: c, keys: o, edits: h, prev: i }),
        (a = Array.isArray(m)),
        (o = a ? m : (F = r[m.kind]) !== null && F !== void 0 ? F : []),
        (c = -1),
        (h = []),
        x && I.push(x),
        (x = m);
    }
  } while (i !== void 0);
  return h.length !== 0 ? h[h.length - 1][1] : t;
}
function bc(t) {
  const e = new Array(t.length).fill(null),
    r = Object.create(null);
  for (const n of Object.values(A)) {
    let i = !1;
    const a = new Array(t.length).fill(void 0),
      o = new Array(t.length).fill(void 0);
    for (let h = 0; h < t.length; ++h) {
      const { enter: m, leave: w } = xi(t[h], n);
      i || (i = m != null || w != null), (a[h] = m), (o[h] = w);
    }
    if (!i) continue;
    const c = {
      enter(...h) {
        const m = h[0];
        for (let x = 0; x < t.length; x++)
          if (e[x] === null) {
            var w;
            const T = (w = a[x]) === null || w === void 0 ? void 0 : w.apply(t[x], h);
            if (T === !1) e[x] = m;
            else if (T === fi) e[x] = fi;
            else if (T !== void 0) return T;
          }
      },
      leave(...h) {
        const m = h[0];
        for (let x = 0; x < t.length; x++)
          if (e[x] === null) {
            var w;
            const T = (w = o[x]) === null || w === void 0 ? void 0 : w.apply(t[x], h);
            if (T === fi) e[x] = fi;
            else if (T !== void 0 && T !== !1) return T;
          } else e[x] === m && (e[x] = null);
      },
    };
    r[n] = c;
  }
  return r;
}
function xi(t, e) {
  const r = t[e];
  return typeof r == 'object'
    ? r
    : typeof r == 'function'
    ? { enter: r, leave: void 0 }
    : { enter: t.enter, leave: t.leave };
}
function P1(t, e, r) {
  const { enter: n, leave: i } = xi(t, e);
  return r ? i : n;
}
function It(t) {
  return Fi(t, F1);
}
const L1 = 80,
  F1 = {
    Name: { leave: (t) => t.value },
    Variable: { leave: (t) => '$' + t.name },
    Document: {
      leave: (t) =>
        ne(
          t.definitions,
          `

`
        ),
    },
    OperationDefinition: {
      leave(t) {
        const e = Ce('(', ne(t.variableDefinitions, ', '), ')'),
          r = ne([t.operation, ne([t.name, e]), ne(t.directives, ' ')], ' ');
        return (r === 'query' ? '' : r + ' ') + t.selectionSet;
      },
    },
    VariableDefinition: {
      leave: ({ variable: t, type: e, defaultValue: r, directives: n }) =>
        t + ': ' + e + Ce(' = ', r) + Ce(' ', ne(n, ' ')),
    },
    SelectionSet: { leave: ({ selections: t }) => Ar(t) },
    Field: {
      leave({ alias: t, name: e, arguments: r, directives: n, selectionSet: i }) {
        const a = Ce('', t, ': ') + e;
        let o = a + Ce('(', ne(r, ', '), ')');
        return (
          o.length > L1 &&
            (o =
              a +
              Ce(
                `(
`,
                ns(
                  ne(
                    r,
                    `
`
                  )
                ),
                `
)`
              )),
          ne([o, ne(n, ' '), i], ' ')
        );
      },
    },
    Argument: { leave: ({ name: t, value: e }) => t + ': ' + e },
    FragmentSpread: { leave: ({ name: t, directives: e }) => '...' + t + Ce(' ', ne(e, ' ')) },
    InlineFragment: {
      leave: ({ typeCondition: t, directives: e, selectionSet: r }) =>
        ne(['...', Ce('on ', t), ne(e, ' '), r], ' '),
    },
    FragmentDefinition: {
      leave: ({
        name: t,
        typeCondition: e,
        variableDefinitions: r,
        directives: n,
        selectionSet: i,
      }) => `fragment ${t}${Ce('(', ne(r, ', '), ')')} on ${e} ${Ce('', ne(n, ' '), ' ')}` + i,
    },
    IntValue: { leave: ({ value: t }) => t },
    FloatValue: { leave: ({ value: t }) => t },
    StringValue: { leave: ({ value: t, block: e }) => (e ? kd(t) : D1(t)) },
    BooleanValue: { leave: ({ value: t }) => (t ? 'true' : 'false') },
    NullValue: { leave: () => 'null' },
    EnumValue: { leave: ({ value: t }) => t },
    ListValue: { leave: ({ values: t }) => '[' + ne(t, ', ') + ']' },
    ObjectValue: { leave: ({ fields: t }) => '{' + ne(t, ', ') + '}' },
    ObjectField: { leave: ({ name: t, value: e }) => t + ': ' + e },
    Directive: { leave: ({ name: t, arguments: e }) => '@' + t + Ce('(', ne(e, ', '), ')') },
    NamedType: { leave: ({ name: t }) => t },
    ListType: { leave: ({ type: t }) => '[' + t + ']' },
    NonNullType: { leave: ({ type: t }) => t + '!' },
    SchemaDefinition: {
      leave: ({ description: t, directives: e, operationTypes: r }) =>
        Ce(
          '',
          t,
          `
`
        ) + ne(['schema', ne(e, ' '), Ar(r)], ' '),
    },
    OperationTypeDefinition: { leave: ({ operation: t, type: e }) => t + ': ' + e },
    ScalarTypeDefinition: {
      leave: ({ description: t, name: e, directives: r }) =>
        Ce(
          '',
          t,
          `
`
        ) + ne(['scalar', e, ne(r, ' ')], ' '),
    },
    ObjectTypeDefinition: {
      leave: ({ description: t, name: e, interfaces: r, directives: n, fields: i }) =>
        Ce(
          '',
          t,
          `
`
        ) + ne(['type', e, Ce('implements ', ne(r, ' & ')), ne(n, ' '), Ar(i)], ' '),
    },
    FieldDefinition: {
      leave: ({ description: t, name: e, arguments: r, type: n, directives: i }) =>
        Ce(
          '',
          t,
          `
`
        ) +
        e +
        (Bf(r)
          ? Ce(
              `(
`,
              ns(
                ne(
                  r,
                  `
`
                )
              ),
              `
)`
            )
          : Ce('(', ne(r, ', '), ')')) +
        ': ' +
        n +
        Ce(' ', ne(i, ' ')),
    },
    InputValueDefinition: {
      leave: ({ description: t, name: e, type: r, defaultValue: n, directives: i }) =>
        Ce(
          '',
          t,
          `
`
        ) + ne([e + ': ' + r, Ce('= ', n), ne(i, ' ')], ' '),
    },
    InterfaceTypeDefinition: {
      leave: ({ description: t, name: e, interfaces: r, directives: n, fields: i }) =>
        Ce(
          '',
          t,
          `
`
        ) + ne(['interface', e, Ce('implements ', ne(r, ' & ')), ne(n, ' '), Ar(i)], ' '),
    },
    UnionTypeDefinition: {
      leave: ({ description: t, name: e, directives: r, types: n }) =>
        Ce(
          '',
          t,
          `
`
        ) + ne(['union', e, ne(r, ' '), Ce('= ', ne(n, ' | '))], ' '),
    },
    EnumTypeDefinition: {
      leave: ({ description: t, name: e, directives: r, values: n }) =>
        Ce(
          '',
          t,
          `
`
        ) + ne(['enum', e, ne(r, ' '), Ar(n)], ' '),
    },
    EnumValueDefinition: {
      leave: ({ description: t, name: e, directives: r }) =>
        Ce(
          '',
          t,
          `
`
        ) + ne([e, ne(r, ' ')], ' '),
    },
    InputObjectTypeDefinition: {
      leave: ({ description: t, name: e, directives: r, fields: n }) =>
        Ce(
          '',
          t,
          `
`
        ) + ne(['input', e, ne(r, ' '), Ar(n)], ' '),
    },
    DirectiveDefinition: {
      leave: ({ description: t, name: e, arguments: r, repeatable: n, locations: i }) =>
        Ce(
          '',
          t,
          `
`
        ) +
        'directive @' +
        e +
        (Bf(r)
          ? Ce(
              `(
`,
              ns(
                ne(
                  r,
                  `
`
                )
              ),
              `
)`
            )
          : Ce('(', ne(r, ', '), ')')) +
        (n ? ' repeatable' : '') +
        ' on ' +
        ne(i, ' | '),
    },
    SchemaExtension: {
      leave: ({ directives: t, operationTypes: e }) =>
        ne(['extend schema', ne(t, ' '), Ar(e)], ' '),
    },
    ScalarTypeExtension: {
      leave: ({ name: t, directives: e }) => ne(['extend scalar', t, ne(e, ' ')], ' '),
    },
    ObjectTypeExtension: {
      leave: ({ name: t, interfaces: e, directives: r, fields: n }) =>
        ne(['extend type', t, Ce('implements ', ne(e, ' & ')), ne(r, ' '), Ar(n)], ' '),
    },
    InterfaceTypeExtension: {
      leave: ({ name: t, interfaces: e, directives: r, fields: n }) =>
        ne(['extend interface', t, Ce('implements ', ne(e, ' & ')), ne(r, ' '), Ar(n)], ' '),
    },
    UnionTypeExtension: {
      leave: ({ name: t, directives: e, types: r }) =>
        ne(['extend union', t, ne(e, ' '), Ce('= ', ne(r, ' | '))], ' '),
    },
    EnumTypeExtension: {
      leave: ({ name: t, directives: e, values: r }) =>
        ne(['extend enum', t, ne(e, ' '), Ar(r)], ' '),
    },
    InputObjectTypeExtension: {
      leave: ({ name: t, directives: e, fields: r }) =>
        ne(['extend input', t, ne(e, ' '), Ar(r)], ' '),
    },
  };
function ne(t, e = '') {
  var r;
  return (r = t?.filter((n) => n).join(e)) !== null && r !== void 0 ? r : '';
}
function Ar(t) {
  return Ce(
    `{
`,
    ns(
      ne(
        t,
        `
`
      )
    ),
    `
}`
  );
}
function Ce(t, e, r = '') {
  return e != null && e !== '' ? t + e + r : '';
}
function ns(t) {
  return Ce(
    '  ',
    t.replace(
      /\n/g,
      `
  `
    )
  );
}
function Bf(t) {
  var e;
  return (e = t?.some((r) =>
    r.includes(`
`)
  )) !== null && e !== void 0
    ? e
    : !1;
}
function vs(t, e) {
  switch (t.kind) {
    case A.NULL:
      return null;
    case A.INT:
      return parseInt(t.value, 10);
    case A.FLOAT:
      return parseFloat(t.value);
    case A.STRING:
    case A.ENUM:
    case A.BOOLEAN:
      return t.value;
    case A.LIST:
      return t.values.map((r) => vs(r, e));
    case A.OBJECT:
      return Nn(
        t.fields,
        (r) => r.name.value,
        (r) => vs(r.value, e)
      );
    case A.VARIABLE:
      return e?.[t.name.value];
  }
}
function hr(t) {
  if (
    (t != null || ke(!1, 'Must provide name.'),
    typeof t == 'string' || ke(!1, 'Expected name to be a string.'),
    t.length === 0)
  )
    throw new P('Expected name to be a non-empty string.');
  for (let e = 1; e < t.length; ++e)
    if (!$d(t.charCodeAt(e)))
      throw new P(`Names must only contain [_a-zA-Z0-9] but "${t}" does not.`);
  if (!mc(t.charCodeAt(0))) throw new P(`Names must start with [_a-zA-Z] but "${t}" does not.`);
  return t;
}
function Vd(t) {
  if (t === 'true' || t === 'false' || t === 'null')
    throw new P(`Enum values cannot be named: ${t}`);
  return hr(t);
}
function xa(t) {
  return pr(t) || Ue(t) || Je(t) || Ft(t) || kt(t) || St(t) || Nt(t) || Ee(t);
}
function U1(t) {
  if (!xa(t)) throw new Error(`Expected ${U(t)} to be a GraphQL type.`);
  return t;
}
function pr(t) {
  return Pr(t, Qr);
}
function q1(t) {
  if (!pr(t)) throw new Error(`Expected ${U(t)} to be a GraphQL Scalar type.`);
  return t;
}
function Ue(t) {
  return Pr(t, Er);
}
function jd(t) {
  if (!Ue(t)) throw new Error(`Expected ${U(t)} to be a GraphQL Object type.`);
  return t;
}
function Je(t) {
  return Pr(t, _i);
}
function zd(t) {
  if (!Je(t)) throw new Error(`Expected ${U(t)} to be a GraphQL Interface type.`);
  return t;
}
function Ft(t) {
  return Pr(t, Ti);
}
function B1(t) {
  if (!Ft(t)) throw new Error(`Expected ${U(t)} to be a GraphQL Union type.`);
  return t;
}
function kt(t) {
  return Pr(t, Dn);
}
function V1(t) {
  if (!kt(t)) throw new Error(`Expected ${U(t)} to be a GraphQL Enum type.`);
  return t;
}
function St(t) {
  return Pr(t, Ii);
}
function j1(t) {
  if (!St(t)) throw new Error(`Expected ${U(t)} to be a GraphQL Input Object type.`);
  return t;
}
function Nt(t) {
  return Pr(t, Gt);
}
function z1(t) {
  if (!Nt(t)) throw new Error(`Expected ${U(t)} to be a GraphQL List type.`);
  return t;
}
function Ee(t) {
  return Pr(t, $e);
}
function G1(t) {
  if (!Ee(t)) throw new Error(`Expected ${U(t)} to be a GraphQL Non-Null type.`);
  return t;
}
function nr(t) {
  return pr(t) || kt(t) || St(t) || (_a(t) && nr(t.ofType));
}
function J1(t) {
  if (!nr(t)) throw new Error(`Expected ${U(t)} to be a GraphQL input type.`);
  return t;
}
function An(t) {
  return pr(t) || Ue(t) || Je(t) || Ft(t) || kt(t) || (_a(t) && An(t.ofType));
}
function H1(t) {
  if (!An(t)) throw new Error(`Expected ${U(t)} to be a GraphQL output type.`);
  return t;
}
function Wr(t) {
  return pr(t) || kt(t);
}
function W1(t) {
  if (!Wr(t)) throw new Error(`Expected ${U(t)} to be a GraphQL leaf type.`);
  return t;
}
function Kr(t) {
  return Ue(t) || Je(t) || Ft(t);
}
function K1(t) {
  if (!Kr(t)) throw new Error(`Expected ${U(t)} to be a GraphQL composite type.`);
  return t;
}
function jr(t) {
  return Je(t) || Ft(t);
}
function Q1(t) {
  if (!jr(t)) throw new Error(`Expected ${U(t)} to be a GraphQL abstract type.`);
  return t;
}
class Gt {
  constructor(e) {
    xa(e) || ke(!1, `Expected ${U(e)} to be a GraphQL type.`), (this.ofType = e);
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLList';
  }
  toString() {
    return '[' + String(this.ofType) + ']';
  }
  toJSON() {
    return this.toString();
  }
}
class $e {
  constructor(e) {
    gc(e) || ke(!1, `Expected ${U(e)} to be a GraphQL nullable type.`), (this.ofType = e);
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLNonNull';
  }
  toString() {
    return String(this.ofType) + '!';
  }
  toJSON() {
    return this.toString();
  }
}
function _a(t) {
  return Nt(t) || Ee(t);
}
function Y1(t) {
  if (!_a(t)) throw new Error(`Expected ${U(t)} to be a GraphQL wrapping type.`);
  return t;
}
function gc(t) {
  return xa(t) && !Ee(t);
}
function Gd(t) {
  if (!gc(t)) throw new Error(`Expected ${U(t)} to be a GraphQL nullable type.`);
  return t;
}
function yc(t) {
  if (t) return Ee(t) ? t.ofType : t;
}
function Ta(t) {
  return pr(t) || Ue(t) || Je(t) || Ft(t) || kt(t) || St(t);
}
function X1(t) {
  if (!Ta(t)) throw new Error(`Expected ${U(t)} to be a GraphQL named type.`);
  return t;
}
function Xt(t) {
  if (t) {
    let e = t;
    for (; _a(e); ) e = e.ofType;
    return e;
  }
}
function wc(t) {
  return typeof t == 'function' ? t() : t;
}
function Ec(t) {
  return typeof t == 'function' ? t() : t;
}
class Qr {
  constructor(e) {
    var r, n, i, a;
    const o = (r = e.parseValue) !== null && r !== void 0 ? r : Uf;
    (this.name = hr(e.name)),
      (this.description = e.description),
      (this.specifiedByURL = e.specifiedByURL),
      (this.serialize = (n = e.serialize) !== null && n !== void 0 ? n : Uf),
      (this.parseValue = o),
      (this.parseLiteral =
        (i = e.parseLiteral) !== null && i !== void 0 ? i : (c, h) => o(vs(c, h))),
      (this.extensions = Tr(e.extensions)),
      (this.astNode = e.astNode),
      (this.extensionASTNodes = (a = e.extensionASTNodes) !== null && a !== void 0 ? a : []),
      e.specifiedByURL == null ||
        typeof e.specifiedByURL == 'string' ||
        ke(
          !1,
          `${this.name} must provide "specifiedByURL" as a string, but got: ${U(e.specifiedByURL)}.`
        ),
      e.serialize == null ||
        typeof e.serialize == 'function' ||
        ke(
          !1,
          `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`
        ),
      e.parseLiteral &&
        ((typeof e.parseValue == 'function' && typeof e.parseLiteral == 'function') ||
          ke(!1, `${this.name} must provide both "parseValue" and "parseLiteral" functions.`));
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLScalarType';
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      specifiedByURL: this.specifiedByURL,
      serialize: this.serialize,
      parseValue: this.parseValue,
      parseLiteral: this.parseLiteral,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
class Er {
  constructor(e) {
    var r;
    (this.name = hr(e.name)),
      (this.description = e.description),
      (this.isTypeOf = e.isTypeOf),
      (this.extensions = Tr(e.extensions)),
      (this.astNode = e.astNode),
      (this.extensionASTNodes = (r = e.extensionASTNodes) !== null && r !== void 0 ? r : []),
      (this._fields = () => Hd(e)),
      (this._interfaces = () => Jd(e)),
      e.isTypeOf == null ||
        typeof e.isTypeOf == 'function' ||
        ke(!1, `${this.name} must provide "isTypeOf" as a function, but got: ${U(e.isTypeOf)}.`);
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLObjectType';
  }
  getFields() {
    return typeof this._fields == 'function' && (this._fields = this._fields()), this._fields;
  }
  getInterfaces() {
    return (
      typeof this._interfaces == 'function' && (this._interfaces = this._interfaces()),
      this._interfaces
    );
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: Kd(this.getFields()),
      isTypeOf: this.isTypeOf,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function Jd(t) {
  var e;
  const r = wc((e = t.interfaces) !== null && e !== void 0 ? e : []);
  return (
    Array.isArray(r) ||
      ke(!1, `${t.name} interfaces must be an Array or a function which returns an Array.`),
    r
  );
}
function Hd(t) {
  const e = Ec(t.fields);
  return (
    pi(e) ||
      ke(
        !1,
        `${t.name} fields must be an object with field names as keys or a function which returns such an object.`
      ),
    pn(e, (r, n) => {
      var i;
      pi(r) || ke(!1, `${t.name}.${n} field config must be an object.`),
        r.resolve == null ||
          typeof r.resolve == 'function' ||
          ke(
            !1,
            `${t.name}.${n} field resolver must be a function if provided, but got: ${U(
              r.resolve
            )}.`
          );
      const a = (i = r.args) !== null && i !== void 0 ? i : {};
      return (
        pi(a) || ke(!1, `${t.name}.${n} args must be an object with argument names as keys.`),
        {
          name: hr(n),
          description: r.description,
          type: r.type,
          args: Wd(a),
          resolve: r.resolve,
          subscribe: r.subscribe,
          deprecationReason: r.deprecationReason,
          extensions: Tr(r.extensions),
          astNode: r.astNode,
        }
      );
    })
  );
}
function Wd(t) {
  return Object.entries(t).map(([e, r]) => ({
    name: hr(e),
    description: r.description,
    type: r.type,
    defaultValue: r.defaultValue,
    deprecationReason: r.deprecationReason,
    extensions: Tr(r.extensions),
    astNode: r.astNode,
  }));
}
function pi(t) {
  return lr(t) && !Array.isArray(t);
}
function Kd(t) {
  return pn(t, (e) => ({
    description: e.description,
    type: e.type,
    args: Qd(e.args),
    resolve: e.resolve,
    subscribe: e.subscribe,
    deprecationReason: e.deprecationReason,
    extensions: e.extensions,
    astNode: e.astNode,
  }));
}
function Qd(t) {
  return Nn(
    t,
    (e) => e.name,
    (e) => ({
      description: e.description,
      type: e.type,
      defaultValue: e.defaultValue,
      deprecationReason: e.deprecationReason,
      extensions: e.extensions,
      astNode: e.astNode,
    })
  );
}
function Cn(t) {
  return Ee(t.type) && t.defaultValue === void 0;
}
class _i {
  constructor(e) {
    var r;
    (this.name = hr(e.name)),
      (this.description = e.description),
      (this.resolveType = e.resolveType),
      (this.extensions = Tr(e.extensions)),
      (this.astNode = e.astNode),
      (this.extensionASTNodes = (r = e.extensionASTNodes) !== null && r !== void 0 ? r : []),
      (this._fields = Hd.bind(void 0, e)),
      (this._interfaces = Jd.bind(void 0, e)),
      e.resolveType == null ||
        typeof e.resolveType == 'function' ||
        ke(
          !1,
          `${this.name} must provide "resolveType" as a function, but got: ${U(e.resolveType)}.`
        );
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLInterfaceType';
  }
  getFields() {
    return typeof this._fields == 'function' && (this._fields = this._fields()), this._fields;
  }
  getInterfaces() {
    return (
      typeof this._interfaces == 'function' && (this._interfaces = this._interfaces()),
      this._interfaces
    );
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: Kd(this.getFields()),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
class Ti {
  constructor(e) {
    var r;
    (this.name = hr(e.name)),
      (this.description = e.description),
      (this.resolveType = e.resolveType),
      (this.extensions = Tr(e.extensions)),
      (this.astNode = e.astNode),
      (this.extensionASTNodes = (r = e.extensionASTNodes) !== null && r !== void 0 ? r : []),
      (this._types = Z1.bind(void 0, e)),
      e.resolveType == null ||
        typeof e.resolveType == 'function' ||
        ke(
          !1,
          `${this.name} must provide "resolveType" as a function, but got: ${U(e.resolveType)}.`
        );
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLUnionType';
  }
  getTypes() {
    return typeof this._types == 'function' && (this._types = this._types()), this._types;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      types: this.getTypes(),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function Z1(t) {
  const e = wc(t.types);
  return (
    Array.isArray(e) ||
      ke(
        !1,
        `Must provide Array of types or a function which returns such an array for Union ${t.name}.`
      ),
    e
  );
}
class Dn {
  constructor(e) {
    var r;
    (this.name = hr(e.name)),
      (this.description = e.description),
      (this.extensions = Tr(e.extensions)),
      (this.astNode = e.astNode),
      (this.extensionASTNodes = (r = e.extensionASTNodes) !== null && r !== void 0 ? r : []),
      (this._values = ev(this.name, e.values)),
      (this._valueLookup = new Map(this._values.map((n) => [n.value, n]))),
      (this._nameLookup = En(this._values, (n) => n.name));
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLEnumType';
  }
  getValues() {
    return this._values;
  }
  getValue(e) {
    return this._nameLookup[e];
  }
  serialize(e) {
    const r = this._valueLookup.get(e);
    if (r === void 0) throw new P(`Enum "${this.name}" cannot represent value: ${U(e)}`);
    return r.name;
  }
  parseValue(e) {
    if (typeof e != 'string') {
      const n = U(e);
      throw new P(`Enum "${this.name}" cannot represent non-string value: ${n}.` + za(this, n));
    }
    const r = this.getValue(e);
    if (r == null) throw new P(`Value "${e}" does not exist in "${this.name}" enum.` + za(this, e));
    return r.value;
  }
  parseLiteral(e, r) {
    if (e.kind !== A.ENUM) {
      const i = It(e);
      throw new P(`Enum "${this.name}" cannot represent non-enum value: ${i}.` + za(this, i), {
        nodes: e,
      });
    }
    const n = this.getValue(e.value);
    if (n == null) {
      const i = It(e);
      throw new P(`Value "${i}" does not exist in "${this.name}" enum.` + za(this, i), {
        nodes: e,
      });
    }
    return n.value;
  }
  toConfig() {
    const e = Nn(
      this.getValues(),
      (r) => r.name,
      (r) => ({
        description: r.description,
        value: r.value,
        deprecationReason: r.deprecationReason,
        extensions: r.extensions,
        astNode: r.astNode,
      })
    );
    return {
      name: this.name,
      description: this.description,
      values: e,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function za(t, e) {
  const r = t.getValues().map((i) => i.name),
    n = kn(e, r);
  return wn('the enum value', n);
}
function ev(t, e) {
  return (
    pi(e) || ke(!1, `${t} values must be an object with value names as keys.`),
    Object.entries(e).map(
      ([r, n]) => (
        pi(n) ||
          ke(
            !1,
            `${t}.${r} must refer to an object with a "value" key representing an internal value but got: ${U(
              n
            )}.`
          ),
        {
          name: Vd(r),
          description: n.description,
          value: n.value !== void 0 ? n.value : r,
          deprecationReason: n.deprecationReason,
          extensions: Tr(n.extensions),
          astNode: n.astNode,
        }
      )
    )
  );
}
class Ii {
  constructor(e) {
    var r;
    (this.name = hr(e.name)),
      (this.description = e.description),
      (this.extensions = Tr(e.extensions)),
      (this.astNode = e.astNode),
      (this.extensionASTNodes = (r = e.extensionASTNodes) !== null && r !== void 0 ? r : []),
      (this._fields = tv.bind(void 0, e));
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLInputObjectType';
  }
  getFields() {
    return typeof this._fields == 'function' && (this._fields = this._fields()), this._fields;
  }
  toConfig() {
    const e = pn(this.getFields(), (r) => ({
      description: r.description,
      type: r.type,
      defaultValue: r.defaultValue,
      deprecationReason: r.deprecationReason,
      extensions: r.extensions,
      astNode: r.astNode,
    }));
    return {
      name: this.name,
      description: this.description,
      fields: e,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function tv(t) {
  const e = Ec(t.fields);
  return (
    pi(e) ||
      ke(
        !1,
        `${t.name} fields must be an object with field names as keys or a function which returns such an object.`
      ),
    pn(
      e,
      (r, n) => (
        !('resolve' in r) ||
          ke(
            !1,
            `${t.name}.${n} field has a resolve property, but Input Types cannot define resolvers.`
          ),
        {
          name: hr(n),
          description: r.description,
          type: r.type,
          defaultValue: r.defaultValue,
          deprecationReason: r.deprecationReason,
          extensions: Tr(r.extensions),
          astNode: r.astNode,
        }
      )
    )
  );
}
function qs(t) {
  return Ee(t.type) && t.defaultValue === void 0;
}
function bs(t, e) {
  return t === e ? !0 : (Ee(t) && Ee(e)) || (Nt(t) && Nt(e)) ? bs(t.ofType, e.ofType) : !1;
}
function zn(t, e, r) {
  return e === r
    ? !0
    : Ee(r)
    ? Ee(e)
      ? zn(t, e.ofType, r.ofType)
      : !1
    : Ee(e)
    ? zn(t, e.ofType, r)
    : Nt(r)
    ? Nt(e)
      ? zn(t, e.ofType, r.ofType)
      : !1
    : Nt(e)
    ? !1
    : jr(r) && (Je(e) || Ue(e)) && t.isSubType(r, e);
}
function Ho(t, e, r) {
  return e === r
    ? !0
    : jr(e)
    ? jr(r)
      ? t.getPossibleTypes(e).some((n) => t.isSubType(r, n))
      : t.isSubType(e, r)
    : jr(r)
    ? t.isSubType(r, e)
    : !1;
}
const is = 2147483647,
  as = -2147483648,
  Yd = new Qr({
    name: 'Int',
    description:
      'The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.',
    serialize(t) {
      const e = Na(t);
      if (typeof e == 'boolean') return e ? 1 : 0;
      let r = e;
      if (
        (typeof e == 'string' && e !== '' && (r = Number(e)),
        typeof r != 'number' || !Number.isInteger(r))
      )
        throw new P(`Int cannot represent non-integer value: ${U(e)}`);
      if (r > is || r < as)
        throw new P('Int cannot represent non 32-bit signed integer value: ' + U(e));
      return r;
    },
    parseValue(t) {
      if (typeof t != 'number' || !Number.isInteger(t))
        throw new P(`Int cannot represent non-integer value: ${U(t)}`);
      if (t > is || t < as)
        throw new P(`Int cannot represent non 32-bit signed integer value: ${t}`);
      return t;
    },
    parseLiteral(t) {
      if (t.kind !== A.INT)
        throw new P(`Int cannot represent non-integer value: ${It(t)}`, { nodes: t });
      const e = parseInt(t.value, 10);
      if (e > is || e < as)
        throw new P(`Int cannot represent non 32-bit signed integer value: ${t.value}`, {
          nodes: t,
        });
      return e;
    },
  }),
  Xd = new Qr({
    name: 'Float',
    description:
      'The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).',
    serialize(t) {
      const e = Na(t);
      if (typeof e == 'boolean') return e ? 1 : 0;
      let r = e;
      if (
        (typeof e == 'string' && e !== '' && (r = Number(e)),
        typeof r != 'number' || !Number.isFinite(r))
      )
        throw new P(`Float cannot represent non numeric value: ${U(e)}`);
      return r;
    },
    parseValue(t) {
      if (typeof t != 'number' || !Number.isFinite(t))
        throw new P(`Float cannot represent non numeric value: ${U(t)}`);
      return t;
    },
    parseLiteral(t) {
      if (t.kind !== A.FLOAT && t.kind !== A.INT)
        throw new P(`Float cannot represent non numeric value: ${It(t)}`, t);
      return parseFloat(t.value);
    },
  }),
  At = new Qr({
    name: 'String',
    description:
      'The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.',
    serialize(t) {
      const e = Na(t);
      if (typeof e == 'string') return e;
      if (typeof e == 'boolean') return e ? 'true' : 'false';
      if (typeof e == 'number' && Number.isFinite(e)) return e.toString();
      throw new P(`String cannot represent value: ${U(t)}`);
    },
    parseValue(t) {
      if (typeof t != 'string') throw new P(`String cannot represent a non string value: ${U(t)}`);
      return t;
    },
    parseLiteral(t) {
      if (t.kind !== A.STRING)
        throw new P(`String cannot represent a non string value: ${It(t)}`, { nodes: t });
      return t.value;
    },
  }),
  fr = new Qr({
    name: 'Boolean',
    description: 'The `Boolean` scalar type represents `true` or `false`.',
    serialize(t) {
      const e = Na(t);
      if (typeof e == 'boolean') return e;
      if (Number.isFinite(e)) return e !== 0;
      throw new P(`Boolean cannot represent a non boolean value: ${U(e)}`);
    },
    parseValue(t) {
      if (typeof t != 'boolean')
        throw new P(`Boolean cannot represent a non boolean value: ${U(t)}`);
      return t;
    },
    parseLiteral(t) {
      if (t.kind !== A.BOOLEAN)
        throw new P(`Boolean cannot represent a non boolean value: ${It(t)}`, { nodes: t });
      return t.value;
    },
  }),
  xc = new Qr({
    name: 'ID',
    description:
      'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
    serialize(t) {
      const e = Na(t);
      if (typeof e == 'string') return e;
      if (Number.isInteger(e)) return String(e);
      throw new P(`ID cannot represent value: ${U(t)}`);
    },
    parseValue(t) {
      if (typeof t == 'string') return t;
      if (typeof t == 'number' && Number.isInteger(t)) return t.toString();
      throw new P(`ID cannot represent value: ${U(t)}`);
    },
    parseLiteral(t) {
      if (t.kind !== A.STRING && t.kind !== A.INT)
        throw new P('ID cannot represent a non-string and non-integer value: ' + It(t), {
          nodes: t,
        });
      return t.value;
    },
  }),
  Ia = Object.freeze([At, Yd, Xd, fr, xc]);
function Bs(t) {
  return Ia.some(({ name: e }) => t.name === e);
}
function Na(t) {
  if (lr(t)) {
    if (typeof t.valueOf == 'function') {
      const e = t.valueOf();
      if (!lr(e)) return e;
    }
    if (typeof t.toJSON == 'function') return t.toJSON();
  }
  return t;
}
function Vs(t) {
  return Pr(t, Yr);
}
function rv(t) {
  if (!Vs(t)) throw new Error(`Expected ${U(t)} to be a GraphQL directive.`);
  return t;
}
class Yr {
  constructor(e) {
    var r, n;
    (this.name = hr(e.name)),
      (this.description = e.description),
      (this.locations = e.locations),
      (this.isRepeatable = (r = e.isRepeatable) !== null && r !== void 0 ? r : !1),
      (this.extensions = Tr(e.extensions)),
      (this.astNode = e.astNode),
      Array.isArray(e.locations) || ke(!1, `@${e.name} locations must be an Array.`);
    const i = (n = e.args) !== null && n !== void 0 ? n : {};
    (lr(i) && !Array.isArray(i)) ||
      ke(!1, `@${e.name} args must be an object with argument names as keys.`),
      (this.args = Wd(i));
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLDirective';
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      locations: this.locations,
      args: Qd(this.args),
      isRepeatable: this.isRepeatable,
      extensions: this.extensions,
      astNode: this.astNode,
    };
  }
  toString() {
    return '@' + this.name;
  }
  toJSON() {
    return this.toString();
  }
}
const _c = new Yr({
    name: 'include',
    description:
      'Directs the executor to include this field or fragment only when the `if` argument is true.',
    locations: [ce.FIELD, ce.FRAGMENT_SPREAD, ce.INLINE_FRAGMENT],
    args: { if: { type: new $e(fr), description: 'Included when true.' } },
  }),
  Tc = new Yr({
    name: 'skip',
    description:
      'Directs the executor to skip this field or fragment when the `if` argument is true.',
    locations: [ce.FIELD, ce.FRAGMENT_SPREAD, ce.INLINE_FRAGMENT],
    args: { if: { type: new $e(fr), description: 'Skipped when true.' } },
  }),
  Ic = 'No longer supported',
  js = new Yr({
    name: 'deprecated',
    description: 'Marks an element of a GraphQL schema as no longer supported.',
    locations: [
      ce.FIELD_DEFINITION,
      ce.ARGUMENT_DEFINITION,
      ce.INPUT_FIELD_DEFINITION,
      ce.ENUM_VALUE,
    ],
    args: {
      reason: {
        type: At,
        description:
          'Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).',
        defaultValue: Ic,
      },
    },
  }),
  Nc = new Yr({
    name: 'specifiedBy',
    description: 'Exposes a URL that specifies the behavior of this scalar.',
    locations: [ce.SCALAR],
    args: {
      url: { type: new $e(At), description: 'The URL that specifies the behavior of this scalar.' },
    },
  }),
  Pn = Object.freeze([_c, Tc, js, Nc]);
function Sc(t) {
  return Pn.some(({ name: e }) => e === t.name);
}
function Mc(t) {
  return typeof t == 'object' && typeof t?.[Symbol.iterator] == 'function';
}
function Sn(t, e) {
  if (Ee(e)) {
    const r = Sn(t, e.ofType);
    return r?.kind === A.NULL ? null : r;
  }
  if (t === null) return { kind: A.NULL };
  if (t === void 0) return null;
  if (Nt(e)) {
    const r = e.ofType;
    if (Mc(t)) {
      const n = [];
      for (const i of t) {
        const a = Sn(i, r);
        a != null && n.push(a);
      }
      return { kind: A.LIST, values: n };
    }
    return Sn(t, r);
  }
  if (St(e)) {
    if (!lr(t)) return null;
    const r = [];
    for (const n of Object.values(e.getFields())) {
      const i = Sn(t[n.name], n.type);
      i && r.push({ kind: A.OBJECT_FIELD, name: { kind: A.NAME, value: n.name }, value: i });
    }
    return { kind: A.OBJECT, fields: r };
  }
  if (Wr(e)) {
    const r = e.serialize(t);
    if (r == null) return null;
    if (typeof r == 'boolean') return { kind: A.BOOLEAN, value: r };
    if (typeof r == 'number' && Number.isFinite(r)) {
      const n = String(r);
      return Vf.test(n) ? { kind: A.INT, value: n } : { kind: A.FLOAT, value: n };
    }
    if (typeof r == 'string')
      return kt(e)
        ? { kind: A.ENUM, value: r }
        : e === xc && Vf.test(r)
        ? { kind: A.INT, value: r }
        : { kind: A.STRING, value: r };
    throw new TypeError(`Cannot convert value to AST: ${U(r)}.`);
  }
  Rt(!1, 'Unexpected input type: ' + U(e));
}
const Vf = /^-?(?:0|[1-9][0-9]*)$/,
  zs = new Er({
    name: '__Schema',
    description:
      'A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.',
    fields: () => ({
      description: { type: At, resolve: (t) => t.description },
      types: {
        description: 'A list of all types supported by this server.',
        type: new $e(new Gt(new $e(wr))),
        resolve(t) {
          return Object.values(t.getTypeMap());
        },
      },
      queryType: {
        description: 'The type that query operations will be rooted at.',
        type: new $e(wr),
        resolve: (t) => t.getQueryType(),
      },
      mutationType: {
        description:
          'If this server supports mutation, the type that mutation operations will be rooted at.',
        type: wr,
        resolve: (t) => t.getMutationType(),
      },
      subscriptionType: {
        description:
          'If this server support subscription, the type that subscription operations will be rooted at.',
        type: wr,
        resolve: (t) => t.getSubscriptionType(),
      },
      directives: {
        description: 'A list of all directives supported by this server.',
        type: new $e(new Gt(new $e(Ac))),
        resolve: (t) => t.getDirectives(),
      },
    }),
  }),
  Ac = new Er({
    name: '__Directive',
    description: `A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.

In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.`,
    fields: () => ({
      name: { type: new $e(At), resolve: (t) => t.name },
      description: { type: At, resolve: (t) => t.description },
      isRepeatable: { type: new $e(fr), resolve: (t) => t.isRepeatable },
      locations: { type: new $e(new Gt(new $e(Oc))), resolve: (t) => t.locations },
      args: {
        type: new $e(new Gt(new $e(Sa))),
        args: { includeDeprecated: { type: fr, defaultValue: !1 } },
        resolve(t, { includeDeprecated: e }) {
          return e ? t.args : t.args.filter((r) => r.deprecationReason == null);
        },
      },
    }),
  }),
  Oc = new Dn({
    name: '__DirectiveLocation',
    description:
      'A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.',
    values: {
      QUERY: { value: ce.QUERY, description: 'Location adjacent to a query operation.' },
      MUTATION: { value: ce.MUTATION, description: 'Location adjacent to a mutation operation.' },
      SUBSCRIPTION: {
        value: ce.SUBSCRIPTION,
        description: 'Location adjacent to a subscription operation.',
      },
      FIELD: { value: ce.FIELD, description: 'Location adjacent to a field.' },
      FRAGMENT_DEFINITION: {
        value: ce.FRAGMENT_DEFINITION,
        description: 'Location adjacent to a fragment definition.',
      },
      FRAGMENT_SPREAD: {
        value: ce.FRAGMENT_SPREAD,
        description: 'Location adjacent to a fragment spread.',
      },
      INLINE_FRAGMENT: {
        value: ce.INLINE_FRAGMENT,
        description: 'Location adjacent to an inline fragment.',
      },
      VARIABLE_DEFINITION: {
        value: ce.VARIABLE_DEFINITION,
        description: 'Location adjacent to a variable definition.',
      },
      SCHEMA: { value: ce.SCHEMA, description: 'Location adjacent to a schema definition.' },
      SCALAR: { value: ce.SCALAR, description: 'Location adjacent to a scalar definition.' },
      OBJECT: { value: ce.OBJECT, description: 'Location adjacent to an object type definition.' },
      FIELD_DEFINITION: {
        value: ce.FIELD_DEFINITION,
        description: 'Location adjacent to a field definition.',
      },
      ARGUMENT_DEFINITION: {
        value: ce.ARGUMENT_DEFINITION,
        description: 'Location adjacent to an argument definition.',
      },
      INTERFACE: {
        value: ce.INTERFACE,
        description: 'Location adjacent to an interface definition.',
      },
      UNION: { value: ce.UNION, description: 'Location adjacent to a union definition.' },
      ENUM: { value: ce.ENUM, description: 'Location adjacent to an enum definition.' },
      ENUM_VALUE: {
        value: ce.ENUM_VALUE,
        description: 'Location adjacent to an enum value definition.',
      },
      INPUT_OBJECT: {
        value: ce.INPUT_OBJECT,
        description: 'Location adjacent to an input object type definition.',
      },
      INPUT_FIELD_DEFINITION: {
        value: ce.INPUT_FIELD_DEFINITION,
        description: 'Location adjacent to an input object field definition.',
      },
    },
  }),
  wr = new Er({
    name: '__Type',
    description:
      'The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.',
    fields: () => ({
      kind: {
        type: new $e($c),
        resolve(t) {
          if (pr(t)) return Ye.SCALAR;
          if (Ue(t)) return Ye.OBJECT;
          if (Je(t)) return Ye.INTERFACE;
          if (Ft(t)) return Ye.UNION;
          if (kt(t)) return Ye.ENUM;
          if (St(t)) return Ye.INPUT_OBJECT;
          if (Nt(t)) return Ye.LIST;
          if (Ee(t)) return Ye.NON_NULL;
          Rt(!1, `Unexpected type: "${U(t)}".`);
        },
      },
      name: { type: At, resolve: (t) => ('name' in t ? t.name : void 0) },
      description: { type: At, resolve: (t) => ('description' in t ? t.description : void 0) },
      specifiedByURL: {
        type: At,
        resolve: (t) => ('specifiedByURL' in t ? t.specifiedByURL : void 0),
      },
      fields: {
        type: new Gt(new $e(Rc)),
        args: { includeDeprecated: { type: fr, defaultValue: !1 } },
        resolve(t, { includeDeprecated: e }) {
          if (Ue(t) || Je(t)) {
            const r = Object.values(t.getFields());
            return e ? r : r.filter((n) => n.deprecationReason == null);
          }
        },
      },
      interfaces: {
        type: new Gt(new $e(wr)),
        resolve(t) {
          if (Ue(t) || Je(t)) return t.getInterfaces();
        },
      },
      possibleTypes: {
        type: new Gt(new $e(wr)),
        resolve(t, e, r, { schema: n }) {
          if (jr(t)) return n.getPossibleTypes(t);
        },
      },
      enumValues: {
        type: new Gt(new $e(Dc)),
        args: { includeDeprecated: { type: fr, defaultValue: !1 } },
        resolve(t, { includeDeprecated: e }) {
          if (kt(t)) {
            const r = t.getValues();
            return e ? r : r.filter((n) => n.deprecationReason == null);
          }
        },
      },
      inputFields: {
        type: new Gt(new $e(Sa)),
        args: { includeDeprecated: { type: fr, defaultValue: !1 } },
        resolve(t, { includeDeprecated: e }) {
          if (St(t)) {
            const r = Object.values(t.getFields());
            return e ? r : r.filter((n) => n.deprecationReason == null);
          }
        },
      },
      ofType: { type: wr, resolve: (t) => ('ofType' in t ? t.ofType : void 0) },
    }),
  }),
  Rc = new Er({
    name: '__Field',
    description:
      'Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.',
    fields: () => ({
      name: { type: new $e(At), resolve: (t) => t.name },
      description: { type: At, resolve: (t) => t.description },
      args: {
        type: new $e(new Gt(new $e(Sa))),
        args: { includeDeprecated: { type: fr, defaultValue: !1 } },
        resolve(t, { includeDeprecated: e }) {
          return e ? t.args : t.args.filter((r) => r.deprecationReason == null);
        },
      },
      type: { type: new $e(wr), resolve: (t) => t.type },
      isDeprecated: { type: new $e(fr), resolve: (t) => t.deprecationReason != null },
      deprecationReason: { type: At, resolve: (t) => t.deprecationReason },
    }),
  }),
  Sa = new Er({
    name: '__InputValue',
    description:
      'Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.',
    fields: () => ({
      name: { type: new $e(At), resolve: (t) => t.name },
      description: { type: At, resolve: (t) => t.description },
      type: { type: new $e(wr), resolve: (t) => t.type },
      defaultValue: {
        type: At,
        description:
          'A GraphQL-formatted string representing the default value for this input value.',
        resolve(t) {
          const { type: e, defaultValue: r } = t,
            n = Sn(r, e);
          return n ? It(n) : null;
        },
      },
      isDeprecated: { type: new $e(fr), resolve: (t) => t.deprecationReason != null },
      deprecationReason: { type: At, resolve: (t) => t.deprecationReason },
    }),
  }),
  Dc = new Er({
    name: '__EnumValue',
    description:
      'One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.',
    fields: () => ({
      name: { type: new $e(At), resolve: (t) => t.name },
      description: { type: At, resolve: (t) => t.description },
      isDeprecated: { type: new $e(fr), resolve: (t) => t.deprecationReason != null },
      deprecationReason: { type: At, resolve: (t) => t.deprecationReason },
    }),
  });
var Ye;
(function (t) {
  (t.SCALAR = 'SCALAR'),
    (t.OBJECT = 'OBJECT'),
    (t.INTERFACE = 'INTERFACE'),
    (t.UNION = 'UNION'),
    (t.ENUM = 'ENUM'),
    (t.INPUT_OBJECT = 'INPUT_OBJECT'),
    (t.LIST = 'LIST'),
    (t.NON_NULL = 'NON_NULL');
})(Ye || (Ye = {}));
const $c = new Dn({
    name: '__TypeKind',
    description: 'An enum describing what kind of type a given `__Type` is.',
    values: {
      SCALAR: { value: Ye.SCALAR, description: 'Indicates this type is a scalar.' },
      OBJECT: {
        value: Ye.OBJECT,
        description:
          'Indicates this type is an object. `fields` and `interfaces` are valid fields.',
      },
      INTERFACE: {
        value: Ye.INTERFACE,
        description:
          'Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields.',
      },
      UNION: {
        value: Ye.UNION,
        description: 'Indicates this type is a union. `possibleTypes` is a valid field.',
      },
      ENUM: {
        value: Ye.ENUM,
        description: 'Indicates this type is an enum. `enumValues` is a valid field.',
      },
      INPUT_OBJECT: {
        value: Ye.INPUT_OBJECT,
        description: 'Indicates this type is an input object. `inputFields` is a valid field.',
      },
      LIST: {
        value: Ye.LIST,
        description: 'Indicates this type is a list. `ofType` is a valid field.',
      },
      NON_NULL: {
        value: Ye.NON_NULL,
        description: 'Indicates this type is a non-null. `ofType` is a valid field.',
      },
    },
  }),
  fa = {
    name: '__schema',
    type: new $e(zs),
    description: 'Access the current type schema of this server.',
    args: [],
    resolve: (t, e, r, { schema: n }) => n,
    deprecationReason: void 0,
    extensions: Object.create(null),
    astNode: void 0,
  },
  ua = {
    name: '__type',
    type: wr,
    description: 'Request the type information of a single type.',
    args: [
      {
        name: 'name',
        description: void 0,
        type: new $e(At),
        defaultValue: void 0,
        deprecationReason: void 0,
        extensions: Object.create(null),
        astNode: void 0,
      },
    ],
    resolve: (t, { name: e }, r, { schema: n }) => n.getType(e),
    deprecationReason: void 0,
    extensions: Object.create(null),
    astNode: void 0,
  },
  da = {
    name: '__typename',
    type: new $e(At),
    description: 'The name of the current Object type at runtime.',
    args: [],
    resolve: (t, e, r, { parentType: n }) => n.name,
    deprecationReason: void 0,
    extensions: Object.create(null),
    astNode: void 0,
  },
  Ma = Object.freeze([zs, Ac, Oc, wr, Rc, Sa, Dc, $c]);
function Zn(t) {
  return Ma.some(({ name: e }) => t.name === e);
}
function Zd(t) {
  return Pr(t, Ui);
}
function kc(t) {
  if (!Zd(t)) throw new Error(`Expected ${U(t)} to be a GraphQL schema.`);
  return t;
}
class Ui {
  constructor(e) {
    var r, n;
    (this.__validationErrors = e.assumeValid === !0 ? [] : void 0),
      lr(e) || ke(!1, 'Must provide configuration object.'),
      !e.types ||
        Array.isArray(e.types) ||
        ke(!1, `"types" must be Array if provided but got: ${U(e.types)}.`),
      !e.directives ||
        Array.isArray(e.directives) ||
        ke(!1, `"directives" must be Array if provided but got: ${U(e.directives)}.`),
      (this.description = e.description),
      (this.extensions = Tr(e.extensions)),
      (this.astNode = e.astNode),
      (this.extensionASTNodes = (r = e.extensionASTNodes) !== null && r !== void 0 ? r : []),
      (this._queryType = e.query),
      (this._mutationType = e.mutation),
      (this._subscriptionType = e.subscription),
      (this._directives = (n = e.directives) !== null && n !== void 0 ? n : Pn);
    const i = new Set(e.types);
    if (e.types != null) for (const a of e.types) i.delete(a), Rr(a, i);
    this._queryType != null && Rr(this._queryType, i),
      this._mutationType != null && Rr(this._mutationType, i),
      this._subscriptionType != null && Rr(this._subscriptionType, i);
    for (const a of this._directives) if (Vs(a)) for (const o of a.args) Rr(o.type, i);
    Rr(zs, i),
      (this._typeMap = Object.create(null)),
      (this._subTypeMap = Object.create(null)),
      (this._implementationsMap = Object.create(null));
    for (const a of i) {
      if (a == null) continue;
      const o = a.name;
      if (
        (o || ke(!1, 'One of the provided types for building the Schema is missing a name.'),
        this._typeMap[o] !== void 0)
      )
        throw new Error(
          `Schema must contain uniquely named types but contains multiple types named "${o}".`
        );
      if (((this._typeMap[o] = a), Je(a))) {
        for (const c of a.getInterfaces())
          if (Je(c)) {
            let h = this._implementationsMap[c.name];
            h === void 0 &&
              (h = this._implementationsMap[c.name] = { objects: [], interfaces: [] }),
              h.interfaces.push(a);
          }
      } else if (Ue(a)) {
        for (const c of a.getInterfaces())
          if (Je(c)) {
            let h = this._implementationsMap[c.name];
            h === void 0 &&
              (h = this._implementationsMap[c.name] = { objects: [], interfaces: [] }),
              h.objects.push(a);
          }
      }
    }
  }
  get [Symbol.toStringTag]() {
    return 'GraphQLSchema';
  }
  getQueryType() {
    return this._queryType;
  }
  getMutationType() {
    return this._mutationType;
  }
  getSubscriptionType() {
    return this._subscriptionType;
  }
  getRootType(e) {
    switch (e) {
      case Lt.QUERY:
        return this.getQueryType();
      case Lt.MUTATION:
        return this.getMutationType();
      case Lt.SUBSCRIPTION:
        return this.getSubscriptionType();
    }
  }
  getTypeMap() {
    return this._typeMap;
  }
  getType(e) {
    return this.getTypeMap()[e];
  }
  getPossibleTypes(e) {
    return Ft(e) ? e.getTypes() : this.getImplementations(e).objects;
  }
  getImplementations(e) {
    const r = this._implementationsMap[e.name];
    return r ?? { objects: [], interfaces: [] };
  }
  isSubType(e, r) {
    let n = this._subTypeMap[e.name];
    if (n === void 0) {
      if (((n = Object.create(null)), Ft(e))) for (const i of e.getTypes()) n[i.name] = !0;
      else {
        const i = this.getImplementations(e);
        for (const a of i.objects) n[a.name] = !0;
        for (const a of i.interfaces) n[a.name] = !0;
      }
      this._subTypeMap[e.name] = n;
    }
    return n[r.name] !== void 0;
  }
  getDirectives() {
    return this._directives;
  }
  getDirective(e) {
    return this.getDirectives().find((r) => r.name === e);
  }
  toConfig() {
    return {
      description: this.description,
      query: this.getQueryType(),
      mutation: this.getMutationType(),
      subscription: this.getSubscriptionType(),
      types: Object.values(this.getTypeMap()),
      directives: this.getDirectives(),
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
      assumeValid: this.__validationErrors !== void 0,
    };
  }
}
function Rr(t, e) {
  const r = Xt(t);
  if (!e.has(r)) {
    if ((e.add(r), Ft(r))) for (const n of r.getTypes()) Rr(n, e);
    else if (Ue(r) || Je(r)) {
      for (const n of r.getInterfaces()) Rr(n, e);
      for (const n of Object.values(r.getFields())) {
        Rr(n.type, e);
        for (const i of n.args) Rr(i.type, e);
      }
    } else if (St(r)) for (const n of Object.values(r.getFields())) Rr(n.type, e);
  }
  return e;
}
function Cc(t) {
  if ((kc(t), t.__validationErrors)) return t.__validationErrors;
  const e = new nv(t);
  iv(e), av(e), sv(e);
  const r = e.getErrors();
  return (t.__validationErrors = r), r;
}
function Pc(t) {
  const e = Cc(t);
  if (e.length !== 0)
    throw new Error(
      e.map((r) => r.message).join(`

`)
    );
}
class nv {
  constructor(e) {
    (this._errors = []), (this.schema = e);
  }
  reportError(e, r) {
    const n = Array.isArray(r) ? r.filter(Boolean) : r;
    this._errors.push(new P(e, { nodes: n }));
  }
  getErrors() {
    return this._errors;
  }
}
function iv(t) {
  const e = t.schema,
    r = e.getQueryType();
  if (!r) t.reportError('Query root type must be provided.', e.astNode);
  else if (!Ue(r)) {
    var n;
    t.reportError(
      `Query root type must be Object type, it cannot be ${U(r)}.`,
      (n = _o(e, Lt.QUERY)) !== null && n !== void 0 ? n : r.astNode
    );
  }
  const i = e.getMutationType();
  if (i && !Ue(i)) {
    var a;
    t.reportError(
      `Mutation root type must be Object type if provided, it cannot be ${U(i)}.`,
      (a = _o(e, Lt.MUTATION)) !== null && a !== void 0 ? a : i.astNode
    );
  }
  const o = e.getSubscriptionType();
  if (o && !Ue(o)) {
    var c;
    t.reportError(
      `Subscription root type must be Object type if provided, it cannot be ${U(o)}.`,
      (c = _o(e, Lt.SUBSCRIPTION)) !== null && c !== void 0 ? c : o.astNode
    );
  }
}
function _o(t, e) {
  var r;
  return (r = [t.astNode, ...t.extensionASTNodes]
    .flatMap((n) => {
      var i;
      return (i = n?.operationTypes) !== null && i !== void 0 ? i : [];
    })
    .find((n) => n.operation === e)) === null || r === void 0
    ? void 0
    : r.type;
}
function av(t) {
  for (const r of t.schema.getDirectives()) {
    if (!Vs(r)) {
      t.reportError(`Expected directive but got: ${U(r)}.`, r?.astNode);
      continue;
    }
    Kn(t, r);
    for (const n of r.args)
      if (
        (Kn(t, n),
        nr(n.type) ||
          t.reportError(
            `The type of @${r.name}(${n.name}:) must be Input Type but got: ${U(n.type)}.`,
            n.astNode
          ),
        Cn(n) && n.deprecationReason != null)
      ) {
        var e;
        t.reportError(`Required argument @${r.name}(${n.name}:) cannot be deprecated.`, [
          Lc(n.astNode),
          (e = n.astNode) === null || e === void 0 ? void 0 : e.type,
        ]);
      }
  }
}
function Kn(t, e) {
  e.name.startsWith('__') &&
    t.reportError(
      `Name "${e.name}" must not begin with "__", which is reserved by GraphQL introspection.`,
      e.astNode
    );
}
function sv(t) {
  const e = lv(t),
    r = t.schema.getTypeMap();
  for (const n of Object.values(r)) {
    if (!Ta(n)) {
      t.reportError(`Expected GraphQL named type but got: ${U(n)}.`, n.astNode);
      continue;
    }
    Zn(n) || Kn(t, n),
      Ue(n) || Je(n)
        ? (jf(t, n), zf(t, n))
        : Ft(n)
        ? fv(t, n)
        : kt(n)
        ? uv(t, n)
        : St(n) && (dv(t, n), e(n));
  }
}
function jf(t, e) {
  const r = Object.values(e.getFields());
  r.length === 0 &&
    t.reportError(`Type ${e.name} must define one or more fields.`, [
      e.astNode,
      ...e.extensionASTNodes,
    ]);
  for (const o of r) {
    if ((Kn(t, o), !An(o.type))) {
      var n;
      t.reportError(
        `The type of ${e.name}.${o.name} must be Output Type but got: ${U(o.type)}.`,
        (n = o.astNode) === null || n === void 0 ? void 0 : n.type
      );
    }
    for (const c of o.args) {
      const h = c.name;
      if ((Kn(t, c), !nr(c.type))) {
        var i;
        t.reportError(
          `The type of ${e.name}.${o.name}(${h}:) must be Input Type but got: ${U(c.type)}.`,
          (i = c.astNode) === null || i === void 0 ? void 0 : i.type
        );
      }
      if (Cn(c) && c.deprecationReason != null) {
        var a;
        t.reportError(`Required argument ${e.name}.${o.name}(${h}:) cannot be deprecated.`, [
          Lc(c.astNode),
          (a = c.astNode) === null || a === void 0 ? void 0 : a.type,
        ]);
      }
    }
  }
}
function zf(t, e) {
  const r = Object.create(null);
  for (const n of e.getInterfaces()) {
    if (!Je(n)) {
      t.reportError(
        `Type ${U(e)} must only implement Interface types, it cannot implement ${U(n)}.`,
        na(e, n)
      );
      continue;
    }
    if (e === n) {
      t.reportError(
        `Type ${e.name} cannot implement itself because it would create a circular reference.`,
        na(e, n)
      );
      continue;
    }
    if (r[n.name]) {
      t.reportError(`Type ${e.name} can only implement ${n.name} once.`, na(e, n));
      continue;
    }
    (r[n.name] = !0), cv(t, e, n), ov(t, e, n);
  }
}
function ov(t, e, r) {
  const n = e.getFields();
  for (const h of Object.values(r.getFields())) {
    const m = h.name,
      w = n[m];
    if (!w) {
      t.reportError(`Interface field ${r.name}.${m} expected but ${e.name} does not provide it.`, [
        h.astNode,
        e.astNode,
        ...e.extensionASTNodes,
      ]);
      continue;
    }
    if (!zn(t.schema, w.type, h.type)) {
      var i, a;
      t.reportError(
        `Interface field ${r.name}.${m} expects type ${U(h.type)} but ${e.name}.${m} is type ${U(
          w.type
        )}.`,
        [
          (i = h.astNode) === null || i === void 0 ? void 0 : i.type,
          (a = w.astNode) === null || a === void 0 ? void 0 : a.type,
        ]
      );
    }
    for (const x of h.args) {
      const T = x.name,
        I = w.args.find((M) => M.name === T);
      if (!I) {
        t.reportError(
          `Interface field argument ${r.name}.${m}(${T}:) expected but ${e.name}.${m} does not provide it.`,
          [x.astNode, w.astNode]
        );
        continue;
      }
      if (!bs(x.type, I.type)) {
        var o, c;
        t.reportError(
          `Interface field argument ${r.name}.${m}(${T}:) expects type ${U(x.type)} but ${
            e.name
          }.${m}(${T}:) is type ${U(I.type)}.`,
          [
            (o = x.astNode) === null || o === void 0 ? void 0 : o.type,
            (c = I.astNode) === null || c === void 0 ? void 0 : c.type,
          ]
        );
      }
    }
    for (const x of w.args) {
      const T = x.name;
      !h.args.find((M) => M.name === T) &&
        Cn(x) &&
        t.reportError(
          `Object field ${e.name}.${m} includes required argument ${T} that is missing from the Interface field ${r.name}.${m}.`,
          [x.astNode, h.astNode]
        );
    }
  }
}
function cv(t, e, r) {
  const n = e.getInterfaces();
  for (const i of r.getInterfaces())
    n.includes(i) ||
      t.reportError(
        i === e
          ? `Type ${e.name} cannot implement ${r.name} because it would create a circular reference.`
          : `Type ${e.name} must implement ${i.name} because it is implemented by ${r.name}.`,
        [...na(r, i), ...na(e, r)]
      );
}
function fv(t, e) {
  const r = e.getTypes();
  r.length === 0 &&
    t.reportError(`Union type ${e.name} must define one or more member types.`, [
      e.astNode,
      ...e.extensionASTNodes,
    ]);
  const n = Object.create(null);
  for (const i of r) {
    if (n[i.name]) {
      t.reportError(`Union type ${e.name} can only include type ${i.name} once.`, Gf(e, i.name));
      continue;
    }
    (n[i.name] = !0),
      Ue(i) ||
        t.reportError(
          `Union type ${e.name} can only include Object types, it cannot include ${U(i)}.`,
          Gf(e, String(i))
        );
  }
}
function uv(t, e) {
  const r = e.getValues();
  r.length === 0 &&
    t.reportError(`Enum type ${e.name} must define one or more values.`, [
      e.astNode,
      ...e.extensionASTNodes,
    ]);
  for (const n of r) Kn(t, n);
}
function dv(t, e) {
  const r = Object.values(e.getFields());
  r.length === 0 &&
    t.reportError(`Input Object type ${e.name} must define one or more fields.`, [
      e.astNode,
      ...e.extensionASTNodes,
    ]);
  for (const a of r) {
    if ((Kn(t, a), !nr(a.type))) {
      var n;
      t.reportError(
        `The type of ${e.name}.${a.name} must be Input Type but got: ${U(a.type)}.`,
        (n = a.astNode) === null || n === void 0 ? void 0 : n.type
      );
    }
    if (qs(a) && a.deprecationReason != null) {
      var i;
      t.reportError(`Required input field ${e.name}.${a.name} cannot be deprecated.`, [
        Lc(a.astNode),
        (i = a.astNode) === null || i === void 0 ? void 0 : i.type,
      ]);
    }
  }
}
function lv(t) {
  const e = Object.create(null),
    r = [],
    n = Object.create(null);
  return i;
  function i(a) {
    if (e[a.name]) return;
    (e[a.name] = !0), (n[a.name] = r.length);
    const o = Object.values(a.getFields());
    for (const c of o)
      if (Ee(c.type) && St(c.type.ofType)) {
        const h = c.type.ofType,
          m = n[h.name];
        if ((r.push(c), m === void 0)) i(h);
        else {
          const w = r.slice(m),
            x = w.map((T) => T.name).join('.');
          t.reportError(
            `Cannot reference Input Object "${h.name}" within itself through a series of non-null fields: "${x}".`,
            w.map((T) => T.astNode)
          );
        }
        r.pop();
      }
    n[a.name] = void 0;
  }
}
function na(t, e) {
  const { astNode: r, extensionASTNodes: n } = t;
  return (r != null ? [r, ...n] : n)
    .flatMap((a) => {
      var o;
      return (o = a.interfaces) !== null && o !== void 0 ? o : [];
    })
    .filter((a) => a.name.value === e.name);
}
function Gf(t, e) {
  const { astNode: r, extensionASTNodes: n } = t;
  return (r != null ? [r, ...n] : n)
    .flatMap((a) => {
      var o;
      return (o = a.types) !== null && o !== void 0 ? o : [];
    })
    .filter((a) => a.name.value === e);
}
function Lc(t) {
  var e;
  return t == null || (e = t.directives) === null || e === void 0
    ? void 0
    : e.find((r) => r.name.value === js.name);
}
function ar(t, e) {
  switch (e.kind) {
    case A.LIST_TYPE: {
      const r = ar(t, e.type);
      return r && new Gt(r);
    }
    case A.NON_NULL_TYPE: {
      const r = ar(t, e.type);
      return r && new $e(r);
    }
    case A.NAMED_TYPE:
      return t.getType(e.name.value);
  }
}
class Fc {
  constructor(e, r, n) {
    (this._schema = e),
      (this._typeStack = []),
      (this._parentTypeStack = []),
      (this._inputTypeStack = []),
      (this._fieldDefStack = []),
      (this._defaultValueStack = []),
      (this._directive = null),
      (this._argument = null),
      (this._enumValue = null),
      (this._getFieldDef = n ?? hv),
      r &&
        (nr(r) && this._inputTypeStack.push(r),
        Kr(r) && this._parentTypeStack.push(r),
        An(r) && this._typeStack.push(r));
  }
  get [Symbol.toStringTag]() {
    return 'TypeInfo';
  }
  getType() {
    if (this._typeStack.length > 0) return this._typeStack[this._typeStack.length - 1];
  }
  getParentType() {
    if (this._parentTypeStack.length > 0)
      return this._parentTypeStack[this._parentTypeStack.length - 1];
  }
  getInputType() {
    if (this._inputTypeStack.length > 0)
      return this._inputTypeStack[this._inputTypeStack.length - 1];
  }
  getParentInputType() {
    if (this._inputTypeStack.length > 1)
      return this._inputTypeStack[this._inputTypeStack.length - 2];
  }
  getFieldDef() {
    if (this._fieldDefStack.length > 0) return this._fieldDefStack[this._fieldDefStack.length - 1];
  }
  getDefaultValue() {
    if (this._defaultValueStack.length > 0)
      return this._defaultValueStack[this._defaultValueStack.length - 1];
  }
  getDirective() {
    return this._directive;
  }
  getArgument() {
    return this._argument;
  }
  getEnumValue() {
    return this._enumValue;
  }
  enter(e) {
    const r = this._schema;
    switch (e.kind) {
      case A.SELECTION_SET: {
        const i = Xt(this.getType());
        this._parentTypeStack.push(Kr(i) ? i : void 0);
        break;
      }
      case A.FIELD: {
        const i = this.getParentType();
        let a, o;
        i && ((a = this._getFieldDef(r, i, e)), a && (o = a.type)),
          this._fieldDefStack.push(a),
          this._typeStack.push(An(o) ? o : void 0);
        break;
      }
      case A.DIRECTIVE:
        this._directive = r.getDirective(e.name.value);
        break;
      case A.OPERATION_DEFINITION: {
        const i = r.getRootType(e.operation);
        this._typeStack.push(Ue(i) ? i : void 0);
        break;
      }
      case A.INLINE_FRAGMENT:
      case A.FRAGMENT_DEFINITION: {
        const i = e.typeCondition,
          a = i ? ar(r, i) : Xt(this.getType());
        this._typeStack.push(An(a) ? a : void 0);
        break;
      }
      case A.VARIABLE_DEFINITION: {
        const i = ar(r, e.type);
        this._inputTypeStack.push(nr(i) ? i : void 0);
        break;
      }
      case A.ARGUMENT: {
        var n;
        let i, a;
        const o = (n = this.getDirective()) !== null && n !== void 0 ? n : this.getFieldDef();
        o && ((i = o.args.find((c) => c.name === e.name.value)), i && (a = i.type)),
          (this._argument = i),
          this._defaultValueStack.push(i ? i.defaultValue : void 0),
          this._inputTypeStack.push(nr(a) ? a : void 0);
        break;
      }
      case A.LIST: {
        const i = yc(this.getInputType()),
          a = Nt(i) ? i.ofType : i;
        this._defaultValueStack.push(void 0), this._inputTypeStack.push(nr(a) ? a : void 0);
        break;
      }
      case A.OBJECT_FIELD: {
        const i = Xt(this.getInputType());
        let a, o;
        St(i) && ((o = i.getFields()[e.name.value]), o && (a = o.type)),
          this._defaultValueStack.push(o ? o.defaultValue : void 0),
          this._inputTypeStack.push(nr(a) ? a : void 0);
        break;
      }
      case A.ENUM: {
        const i = Xt(this.getInputType());
        let a;
        kt(i) && (a = i.getValue(e.value)), (this._enumValue = a);
        break;
      }
    }
  }
  leave(e) {
    switch (e.kind) {
      case A.SELECTION_SET:
        this._parentTypeStack.pop();
        break;
      case A.FIELD:
        this._fieldDefStack.pop(), this._typeStack.pop();
        break;
      case A.DIRECTIVE:
        this._directive = null;
        break;
      case A.OPERATION_DEFINITION:
      case A.INLINE_FRAGMENT:
      case A.FRAGMENT_DEFINITION:
        this._typeStack.pop();
        break;
      case A.VARIABLE_DEFINITION:
        this._inputTypeStack.pop();
        break;
      case A.ARGUMENT:
        (this._argument = null), this._defaultValueStack.pop(), this._inputTypeStack.pop();
        break;
      case A.LIST:
      case A.OBJECT_FIELD:
        this._defaultValueStack.pop(), this._inputTypeStack.pop();
        break;
      case A.ENUM:
        this._enumValue = null;
        break;
    }
  }
}
function hv(t, e, r) {
  const n = r.name.value;
  if (n === fa.name && t.getQueryType() === e) return fa;
  if (n === ua.name && t.getQueryType() === e) return ua;
  if (n === da.name && Kr(e)) return da;
  if (Ue(e) || Je(e)) return e.getFields()[n];
}
function Uc(t, e) {
  return {
    enter(...r) {
      const n = r[0];
      t.enter(n);
      const i = xi(e, n.kind).enter;
      if (i) {
        const a = i.apply(e, r);
        return a !== void 0 && (t.leave(n), zo(a) && t.enter(a)), a;
      }
    },
    leave(...r) {
      const n = r[0],
        i = xi(e, n.kind).leave;
      let a;
      return i && (a = i.apply(e, r)), t.leave(n), a;
    },
  };
}
function pv(t) {
  return qc(t) || Bc(t) || Vc(t);
}
function qc(t) {
  return t.kind === A.OPERATION_DEFINITION || t.kind === A.FRAGMENT_DEFINITION;
}
function mv(t) {
  return t.kind === A.FIELD || t.kind === A.FRAGMENT_SPREAD || t.kind === A.INLINE_FRAGMENT;
}
function e0(t) {
  return (
    t.kind === A.VARIABLE ||
    t.kind === A.INT ||
    t.kind === A.FLOAT ||
    t.kind === A.STRING ||
    t.kind === A.BOOLEAN ||
    t.kind === A.NULL ||
    t.kind === A.ENUM ||
    t.kind === A.LIST ||
    t.kind === A.OBJECT
  );
}
function Wo(t) {
  return (
    e0(t) &&
    (t.kind === A.LIST
      ? t.values.some(Wo)
      : t.kind === A.OBJECT
      ? t.fields.some((e) => Wo(e.value))
      : t.kind !== A.VARIABLE)
  );
}
function vv(t) {
  return t.kind === A.NAMED_TYPE || t.kind === A.LIST_TYPE || t.kind === A.NON_NULL_TYPE;
}
function Bc(t) {
  return t.kind === A.SCHEMA_DEFINITION || qi(t) || t.kind === A.DIRECTIVE_DEFINITION;
}
function qi(t) {
  return (
    t.kind === A.SCALAR_TYPE_DEFINITION ||
    t.kind === A.OBJECT_TYPE_DEFINITION ||
    t.kind === A.INTERFACE_TYPE_DEFINITION ||
    t.kind === A.UNION_TYPE_DEFINITION ||
    t.kind === A.ENUM_TYPE_DEFINITION ||
    t.kind === A.INPUT_OBJECT_TYPE_DEFINITION
  );
}
function Vc(t) {
  return t.kind === A.SCHEMA_EXTENSION || Gs(t);
}
function Gs(t) {
  return (
    t.kind === A.SCALAR_TYPE_EXTENSION ||
    t.kind === A.OBJECT_TYPE_EXTENSION ||
    t.kind === A.INTERFACE_TYPE_EXTENSION ||
    t.kind === A.UNION_TYPE_EXTENSION ||
    t.kind === A.ENUM_TYPE_EXTENSION ||
    t.kind === A.INPUT_OBJECT_TYPE_EXTENSION
  );
}
function t0(t) {
  return {
    Document(e) {
      for (const r of e.definitions)
        if (!qc(r)) {
          const n =
            r.kind === A.SCHEMA_DEFINITION || r.kind === A.SCHEMA_EXTENSION
              ? 'schema'
              : '"' + r.name.value + '"';
          t.reportError(new P(`The ${n} definition is not executable.`, { nodes: r }));
        }
      return !1;
    },
  };
}
function r0(t) {
  return {
    Field(e) {
      const r = t.getParentType();
      if (r && !t.getFieldDef()) {
        const i = t.getSchema(),
          a = e.name.value;
        let o = wn('to use an inline fragment on', bv(i, r, a));
        o === '' && (o = wn(gv(r, a))),
          t.reportError(new P(`Cannot query field "${a}" on type "${r.name}".` + o, { nodes: e }));
      }
    },
  };
}
function bv(t, e, r) {
  if (!jr(e)) return [];
  const n = new Set(),
    i = Object.create(null);
  for (const o of t.getPossibleTypes(e))
    if (o.getFields()[r]) {
      n.add(o), (i[o.name] = 1);
      for (const c of o.getInterfaces()) {
        var a;
        c.getFields()[r] &&
          (n.add(c), (i[c.name] = ((a = i[c.name]) !== null && a !== void 0 ? a : 0) + 1));
      }
    }
  return [...n]
    .sort((o, c) => {
      const h = i[c.name] - i[o.name];
      return h !== 0
        ? h
        : Je(o) && t.isSubType(o, c)
        ? -1
        : Je(c) && t.isSubType(c, o)
        ? 1
        : Ea(o.name, c.name);
    })
    .map((o) => o.name);
}
function gv(t, e) {
  if (Ue(t) || Je(t)) {
    const r = Object.keys(t.getFields());
    return kn(e, r);
  }
  return [];
}
function n0(t) {
  return {
    InlineFragment(e) {
      const r = e.typeCondition;
      if (r) {
        const n = ar(t.getSchema(), r);
        if (n && !Kr(n)) {
          const i = It(r);
          t.reportError(
            new P(`Fragment cannot condition on non composite type "${i}".`, { nodes: r })
          );
        }
      }
    },
    FragmentDefinition(e) {
      const r = ar(t.getSchema(), e.typeCondition);
      if (r && !Kr(r)) {
        const n = It(e.typeCondition);
        t.reportError(
          new P(`Fragment "${e.name.value}" cannot condition on non composite type "${n}".`, {
            nodes: e.typeCondition,
          })
        );
      }
    },
  };
}
function i0(t) {
  return {
    ...a0(t),
    Argument(e) {
      const r = t.getArgument(),
        n = t.getFieldDef(),
        i = t.getParentType();
      if (!r && n && i) {
        const a = e.name.value,
          o = n.args.map((h) => h.name),
          c = kn(a, o);
        t.reportError(
          new P(`Unknown argument "${a}" on field "${i.name}.${n.name}".` + wn(c), { nodes: e })
        );
      }
    },
  };
}
function a0(t) {
  const e = Object.create(null),
    r = t.getSchema(),
    n = r ? r.getDirectives() : Pn;
  for (const o of n) e[o.name] = o.args.map((c) => c.name);
  const i = t.getDocument().definitions;
  for (const o of i)
    if (o.kind === A.DIRECTIVE_DEFINITION) {
      var a;
      const c = (a = o.arguments) !== null && a !== void 0 ? a : [];
      e[o.name.value] = c.map((h) => h.name.value);
    }
  return {
    Directive(o) {
      const c = o.name.value,
        h = e[c];
      if (o.arguments && h)
        for (const m of o.arguments) {
          const w = m.name.value;
          if (!h.includes(w)) {
            const x = kn(w, h);
            t.reportError(
              new P(`Unknown argument "${w}" on directive "@${c}".` + wn(x), { nodes: m })
            );
          }
        }
      return !1;
    },
  };
}
function jc(t) {
  const e = Object.create(null),
    r = t.getSchema(),
    n = r ? r.getDirectives() : Pn;
  for (const a of n) e[a.name] = a.locations;
  const i = t.getDocument().definitions;
  for (const a of i)
    a.kind === A.DIRECTIVE_DEFINITION && (e[a.name.value] = a.locations.map((o) => o.value));
  return {
    Directive(a, o, c, h, m) {
      const w = a.name.value,
        x = e[w];
      if (!x) {
        t.reportError(new P(`Unknown directive "@${w}".`, { nodes: a }));
        return;
      }
      const T = yv(m);
      T &&
        !x.includes(T) &&
        t.reportError(new P(`Directive "@${w}" may not be used on ${T}.`, { nodes: a }));
    },
  };
}
function yv(t) {
  const e = t[t.length - 1];
  switch (('kind' in e || Rt(!1), e.kind)) {
    case A.OPERATION_DEFINITION:
      return wv(e.operation);
    case A.FIELD:
      return ce.FIELD;
    case A.FRAGMENT_SPREAD:
      return ce.FRAGMENT_SPREAD;
    case A.INLINE_FRAGMENT:
      return ce.INLINE_FRAGMENT;
    case A.FRAGMENT_DEFINITION:
      return ce.FRAGMENT_DEFINITION;
    case A.VARIABLE_DEFINITION:
      return ce.VARIABLE_DEFINITION;
    case A.SCHEMA_DEFINITION:
    case A.SCHEMA_EXTENSION:
      return ce.SCHEMA;
    case A.SCALAR_TYPE_DEFINITION:
    case A.SCALAR_TYPE_EXTENSION:
      return ce.SCALAR;
    case A.OBJECT_TYPE_DEFINITION:
    case A.OBJECT_TYPE_EXTENSION:
      return ce.OBJECT;
    case A.FIELD_DEFINITION:
      return ce.FIELD_DEFINITION;
    case A.INTERFACE_TYPE_DEFINITION:
    case A.INTERFACE_TYPE_EXTENSION:
      return ce.INTERFACE;
    case A.UNION_TYPE_DEFINITION:
    case A.UNION_TYPE_EXTENSION:
      return ce.UNION;
    case A.ENUM_TYPE_DEFINITION:
    case A.ENUM_TYPE_EXTENSION:
      return ce.ENUM;
    case A.ENUM_VALUE_DEFINITION:
      return ce.ENUM_VALUE;
    case A.INPUT_OBJECT_TYPE_DEFINITION:
    case A.INPUT_OBJECT_TYPE_EXTENSION:
      return ce.INPUT_OBJECT;
    case A.INPUT_VALUE_DEFINITION: {
      const r = t[t.length - 3];
      return (
        'kind' in r || Rt(!1),
        r.kind === A.INPUT_OBJECT_TYPE_DEFINITION
          ? ce.INPUT_FIELD_DEFINITION
          : ce.ARGUMENT_DEFINITION
      );
    }
    default:
      Rt(!1, 'Unexpected kind: ' + U(e.kind));
  }
}
function wv(t) {
  switch (t) {
    case Lt.QUERY:
      return ce.QUERY;
    case Lt.MUTATION:
      return ce.MUTATION;
    case Lt.SUBSCRIPTION:
      return ce.SUBSCRIPTION;
  }
}
function s0(t) {
  return {
    FragmentSpread(e) {
      const r = e.name.value;
      t.getFragment(r) || t.reportError(new P(`Unknown fragment "${r}".`, { nodes: e.name }));
    },
  };
}
function zc(t) {
  const e = t.getSchema(),
    r = e ? e.getTypeMap() : Object.create(null),
    n = Object.create(null);
  for (const a of t.getDocument().definitions) qi(a) && (n[a.name.value] = !0);
  const i = [...Object.keys(r), ...Object.keys(n)];
  return {
    NamedType(a, o, c, h, m) {
      const w = a.name.value;
      if (!r[w] && !n[w]) {
        var x;
        const T = (x = m[2]) !== null && x !== void 0 ? x : c,
          I = T != null && Ev(T);
        if (I && Jf.includes(w)) return;
        const M = kn(w, I ? Jf.concat(i) : i);
        t.reportError(new P(`Unknown type "${w}".` + wn(M), { nodes: a }));
      }
    },
  };
}
const Jf = [...Ia, ...Ma].map((t) => t.name);
function Ev(t) {
  return 'kind' in t && (Bc(t) || Vc(t));
}
function o0(t) {
  let e = 0;
  return {
    Document(r) {
      e = r.definitions.filter((n) => n.kind === A.OPERATION_DEFINITION).length;
    },
    OperationDefinition(r) {
      !r.name &&
        e > 1 &&
        t.reportError(
          new P('This anonymous operation must be the only defined operation.', { nodes: r })
        );
    },
  };
}
function c0(t) {
  var e, r, n;
  const i = t.getSchema(),
    a =
      (e =
        (r = (n = i?.astNode) !== null && n !== void 0 ? n : i?.getQueryType()) !== null &&
        r !== void 0
          ? r
          : i?.getMutationType()) !== null && e !== void 0
        ? e
        : i?.getSubscriptionType();
  let o = 0;
  return {
    SchemaDefinition(c) {
      if (a) {
        t.reportError(new P('Cannot define a new schema within a schema extension.', { nodes: c }));
        return;
      }
      o > 0 && t.reportError(new P('Must provide only one schema definition.', { nodes: c })), ++o;
    },
  };
}
function f0(t) {
  const e = Object.create(null),
    r = [],
    n = Object.create(null);
  return {
    OperationDefinition: () => !1,
    FragmentDefinition(a) {
      return i(a), !1;
    },
  };
  function i(a) {
    if (e[a.name.value]) return;
    const o = a.name.value;
    e[o] = !0;
    const c = t.getFragmentSpreads(a.selectionSet);
    if (c.length !== 0) {
      n[o] = r.length;
      for (const h of c) {
        const m = h.name.value,
          w = n[m];
        if ((r.push(h), w === void 0)) {
          const x = t.getFragment(m);
          x && i(x);
        } else {
          const x = r.slice(w),
            T = x
              .slice(0, -1)
              .map((I) => '"' + I.name.value + '"')
              .join(', ');
          t.reportError(
            new P(`Cannot spread fragment "${m}" within itself` + (T !== '' ? ` via ${T}.` : '.'), {
              nodes: x,
            })
          );
        }
        r.pop();
      }
      n[o] = void 0;
    }
  }
}
function u0(t) {
  let e = Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        e = Object.create(null);
      },
      leave(r) {
        const n = t.getRecursiveVariableUsages(r);
        for (const { node: i } of n) {
          const a = i.name.value;
          e[a] !== !0 &&
            t.reportError(
              new P(
                r.name
                  ? `Variable "$${a}" is not defined by operation "${r.name.value}".`
                  : `Variable "$${a}" is not defined.`,
                { nodes: [i, r] }
              )
            );
        }
      },
    },
    VariableDefinition(r) {
      e[r.variable.name.value] = !0;
    },
  };
}
function d0(t) {
  const e = [],
    r = [];
  return {
    OperationDefinition(n) {
      return e.push(n), !1;
    },
    FragmentDefinition(n) {
      return r.push(n), !1;
    },
    Document: {
      leave() {
        const n = Object.create(null);
        for (const i of e)
          for (const a of t.getRecursivelyReferencedFragments(i)) n[a.name.value] = !0;
        for (const i of r) {
          const a = i.name.value;
          n[a] !== !0 && t.reportError(new P(`Fragment "${a}" is never used.`, { nodes: i }));
        }
      },
    },
  };
}
function l0(t) {
  let e = [];
  return {
    OperationDefinition: {
      enter() {
        e = [];
      },
      leave(r) {
        const n = Object.create(null),
          i = t.getRecursiveVariableUsages(r);
        for (const { node: a } of i) n[a.name.value] = !0;
        for (const a of e) {
          const o = a.variable.name.value;
          n[o] !== !0 &&
            t.reportError(
              new P(
                r.name
                  ? `Variable "$${o}" is never used in operation "${r.name.value}".`
                  : `Variable "$${o}" is never used.`,
                { nodes: a }
              )
            );
        }
      },
    },
    VariableDefinition(r) {
      e.push(r);
    },
  };
}
function Js(t) {
  switch (t.kind) {
    case A.OBJECT:
      return { ...t, fields: xv(t.fields) };
    case A.LIST:
      return { ...t, values: t.values.map(Js) };
    case A.INT:
    case A.FLOAT:
    case A.STRING:
    case A.BOOLEAN:
    case A.NULL:
    case A.ENUM:
    case A.VARIABLE:
      return t;
  }
}
function xv(t) {
  return t
    .map((e) => ({ ...e, value: Js(e.value) }))
    .sort((e, r) => Ea(e.name.value, r.name.value));
}
function h0(t) {
  return Array.isArray(t)
    ? t.map(([e, r]) => `subfields "${e}" conflict because ` + h0(r)).join(' and ')
    : t;
}
function p0(t) {
  const e = new Sv(),
    r = new Map();
  return {
    SelectionSet(n) {
      const i = _v(t, r, e, t.getParentType(), n);
      for (const [[a, o], c, h] of i) {
        const m = h0(o);
        t.reportError(
          new P(
            `Fields "${a}" conflict because ${m}. Use different aliases on the fields to fetch both if this was intentional.`,
            { nodes: c.concat(h) }
          )
        );
      }
    },
  };
}
function _v(t, e, r, n, i) {
  const a = [],
    [o, c] = ws(t, e, n, i);
  if ((Iv(t, a, e, r, o), c.length !== 0))
    for (let h = 0; h < c.length; h++) {
      gs(t, a, e, r, !1, o, c[h]);
      for (let m = h + 1; m < c.length; m++) ys(t, a, e, r, !1, c[h], c[m]);
    }
  return a;
}
function gs(t, e, r, n, i, a, o) {
  const c = t.getFragment(o);
  if (!c) return;
  const [h, m] = Qo(t, r, c);
  if (a !== h) {
    Gc(t, e, r, n, i, a, h);
    for (const w of m) n.has(w, o, i) || (n.add(w, o, i), gs(t, e, r, n, i, a, w));
  }
}
function ys(t, e, r, n, i, a, o) {
  if (a === o || n.has(a, o, i)) return;
  n.add(a, o, i);
  const c = t.getFragment(a),
    h = t.getFragment(o);
  if (!c || !h) return;
  const [m, w] = Qo(t, r, c),
    [x, T] = Qo(t, r, h);
  Gc(t, e, r, n, i, m, x);
  for (const I of T) ys(t, e, r, n, i, a, I);
  for (const I of w) ys(t, e, r, n, i, I, o);
}
function Tv(t, e, r, n, i, a, o, c) {
  const h = [],
    [m, w] = ws(t, e, i, a),
    [x, T] = ws(t, e, o, c);
  Gc(t, h, e, r, n, m, x);
  for (const I of T) gs(t, h, e, r, n, m, I);
  for (const I of w) gs(t, h, e, r, n, x, I);
  for (const I of w) for (const M of T) ys(t, h, e, r, n, I, M);
  return h;
}
function Iv(t, e, r, n, i) {
  for (const [a, o] of Object.entries(i))
    if (o.length > 1)
      for (let c = 0; c < o.length; c++)
        for (let h = c + 1; h < o.length; h++) {
          const m = m0(t, r, n, !1, a, o[c], o[h]);
          m && e.push(m);
        }
}
function Gc(t, e, r, n, i, a, o) {
  for (const [c, h] of Object.entries(a)) {
    const m = o[c];
    if (m)
      for (const w of h)
        for (const x of m) {
          const T = m0(t, r, n, i, c, w, x);
          T && e.push(T);
        }
  }
}
function m0(t, e, r, n, i, a, o) {
  const [c, h, m] = a,
    [w, x, T] = o,
    I = n || (c !== w && Ue(c) && Ue(w));
  if (!I) {
    const Z = h.name.value,
      me = x.name.value;
    if (Z !== me) return [[i, `"${Z}" and "${me}" are different fields`], [h], [x]];
    if (Hf(h) !== Hf(x)) return [[i, 'they have differing arguments'], [h], [x]];
  }
  const M = m?.type,
    k = T?.type;
  if (M && k && Ko(M, k))
    return [[i, `they return conflicting types "${U(M)}" and "${U(k)}"`], [h], [x]];
  const F = h.selectionSet,
    j = x.selectionSet;
  if (F && j) {
    const Z = Tv(t, e, r, I, Xt(M), F, Xt(k), j);
    return Nv(Z, i, h, x);
  }
}
function Hf(t) {
  var e;
  const r = (e = t.arguments) !== null && e !== void 0 ? e : [],
    n = {
      kind: A.OBJECT,
      fields: r.map((i) => ({ kind: A.OBJECT_FIELD, name: i.name, value: i.value })),
    };
  return It(Js(n));
}
function Ko(t, e) {
  return Nt(t)
    ? Nt(e)
      ? Ko(t.ofType, e.ofType)
      : !0
    : Nt(e)
    ? !0
    : Ee(t)
    ? Ee(e)
      ? Ko(t.ofType, e.ofType)
      : !0
    : Ee(e)
    ? !0
    : Wr(t) || Wr(e)
    ? t !== e
    : !1;
}
function ws(t, e, r, n) {
  const i = e.get(n);
  if (i) return i;
  const a = Object.create(null),
    o = Object.create(null);
  v0(t, r, n, a, o);
  const c = [a, Object.keys(o)];
  return e.set(n, c), c;
}
function Qo(t, e, r) {
  const n = e.get(r.selectionSet);
  if (n) return n;
  const i = ar(t.getSchema(), r.typeCondition);
  return ws(t, e, i, r.selectionSet);
}
function v0(t, e, r, n, i) {
  for (const a of r.selections)
    switch (a.kind) {
      case A.FIELD: {
        const o = a.name.value;
        let c;
        (Ue(e) || Je(e)) && (c = e.getFields()[o]);
        const h = a.alias ? a.alias.value : o;
        n[h] || (n[h] = []), n[h].push([e, a, c]);
        break;
      }
      case A.FRAGMENT_SPREAD:
        i[a.name.value] = !0;
        break;
      case A.INLINE_FRAGMENT: {
        const o = a.typeCondition,
          c = o ? ar(t.getSchema(), o) : e;
        v0(t, c, a.selectionSet, n, i);
        break;
      }
    }
}
function Nv(t, e, r, n) {
  if (t.length > 0)
    return [
      [e, t.map(([i]) => i)],
      [r, ...t.map(([, i]) => i).flat()],
      [n, ...t.map(([, , i]) => i).flat()],
    ];
}
class Sv {
  constructor() {
    this._data = new Map();
  }
  has(e, r, n) {
    var i;
    const [a, o] = e < r ? [e, r] : [r, e],
      c = (i = this._data.get(a)) === null || i === void 0 ? void 0 : i.get(o);
    return c === void 0 ? !1 : n ? !0 : n === c;
  }
  add(e, r, n) {
    const [i, a] = e < r ? [e, r] : [r, e],
      o = this._data.get(i);
    o === void 0 ? this._data.set(i, new Map([[a, n]])) : o.set(a, n);
  }
}
function b0(t) {
  return {
    InlineFragment(e) {
      const r = t.getType(),
        n = t.getParentType();
      if (Kr(r) && Kr(n) && !Ho(t.getSchema(), r, n)) {
        const i = U(n),
          a = U(r);
        t.reportError(
          new P(
            `Fragment cannot be spread here as objects of type "${i}" can never be of type "${a}".`,
            { nodes: e }
          )
        );
      }
    },
    FragmentSpread(e) {
      const r = e.name.value,
        n = Mv(t, r),
        i = t.getParentType();
      if (n && i && !Ho(t.getSchema(), n, i)) {
        const a = U(i),
          o = U(n);
        t.reportError(
          new P(
            `Fragment "${r}" cannot be spread here as objects of type "${a}" can never be of type "${o}".`,
            { nodes: e }
          )
        );
      }
    },
  };
}
function Mv(t, e) {
  const r = t.getFragment(e);
  if (r) {
    const n = ar(t.getSchema(), r.typeCondition);
    if (Kr(n)) return n;
  }
}
function g0(t) {
  const e = t.getSchema(),
    r = Object.create(null);
  for (const i of t.getDocument().definitions) qi(i) && (r[i.name.value] = i);
  return {
    ScalarTypeExtension: n,
    ObjectTypeExtension: n,
    InterfaceTypeExtension: n,
    UnionTypeExtension: n,
    EnumTypeExtension: n,
    InputObjectTypeExtension: n,
  };
  function n(i) {
    const a = i.name.value,
      o = r[a],
      c = e?.getType(a);
    let h;
    if ((o ? (h = Av[o.kind]) : c && (h = Ov(c)), h)) {
      if (h !== i.kind) {
        const m = Rv(i.kind);
        t.reportError(new P(`Cannot extend non-${m} type "${a}".`, { nodes: o ? [o, i] : i }));
      }
    } else {
      const m = Object.keys({ ...r, ...e?.getTypeMap() }),
        w = kn(a, m);
      t.reportError(
        new P(`Cannot extend type "${a}" because it is not defined.` + wn(w), { nodes: i.name })
      );
    }
  }
}
const Av = {
  [A.SCALAR_TYPE_DEFINITION]: A.SCALAR_TYPE_EXTENSION,
  [A.OBJECT_TYPE_DEFINITION]: A.OBJECT_TYPE_EXTENSION,
  [A.INTERFACE_TYPE_DEFINITION]: A.INTERFACE_TYPE_EXTENSION,
  [A.UNION_TYPE_DEFINITION]: A.UNION_TYPE_EXTENSION,
  [A.ENUM_TYPE_DEFINITION]: A.ENUM_TYPE_EXTENSION,
  [A.INPUT_OBJECT_TYPE_DEFINITION]: A.INPUT_OBJECT_TYPE_EXTENSION,
};
function Ov(t) {
  if (pr(t)) return A.SCALAR_TYPE_EXTENSION;
  if (Ue(t)) return A.OBJECT_TYPE_EXTENSION;
  if (Je(t)) return A.INTERFACE_TYPE_EXTENSION;
  if (Ft(t)) return A.UNION_TYPE_EXTENSION;
  if (kt(t)) return A.ENUM_TYPE_EXTENSION;
  if (St(t)) return A.INPUT_OBJECT_TYPE_EXTENSION;
  Rt(!1, 'Unexpected type: ' + U(t));
}
function Rv(t) {
  switch (t) {
    case A.SCALAR_TYPE_EXTENSION:
      return 'scalar';
    case A.OBJECT_TYPE_EXTENSION:
      return 'object';
    case A.INTERFACE_TYPE_EXTENSION:
      return 'interface';
    case A.UNION_TYPE_EXTENSION:
      return 'union';
    case A.ENUM_TYPE_EXTENSION:
      return 'enum';
    case A.INPUT_OBJECT_TYPE_EXTENSION:
      return 'input object';
    default:
      Rt(!1, 'Unexpected kind: ' + U(t));
  }
}
function y0(t) {
  return {
    ...w0(t),
    Field: {
      leave(e) {
        var r;
        const n = t.getFieldDef();
        if (!n) return !1;
        const i = new Set(
          (r = e.arguments) === null || r === void 0 ? void 0 : r.map((a) => a.name.value)
        );
        for (const a of n.args)
          if (!i.has(a.name) && Cn(a)) {
            const o = U(a.type);
            t.reportError(
              new P(
                `Field "${n.name}" argument "${a.name}" of type "${o}" is required, but it was not provided.`,
                { nodes: e }
              )
            );
          }
      },
    },
  };
}
function w0(t) {
  var e;
  const r = Object.create(null),
    n = t.getSchema(),
    i = (e = n?.getDirectives()) !== null && e !== void 0 ? e : Pn;
  for (const c of i) r[c.name] = En(c.args.filter(Cn), (h) => h.name);
  const a = t.getDocument().definitions;
  for (const c of a)
    if (c.kind === A.DIRECTIVE_DEFINITION) {
      var o;
      const h = (o = c.arguments) !== null && o !== void 0 ? o : [];
      r[c.name.value] = En(h.filter(Dv), (m) => m.name.value);
    }
  return {
    Directive: {
      leave(c) {
        const h = c.name.value,
          m = r[h];
        if (m) {
          var w;
          const x = (w = c.arguments) !== null && w !== void 0 ? w : [],
            T = new Set(x.map((I) => I.name.value));
          for (const [I, M] of Object.entries(m))
            if (!T.has(I)) {
              const k = xa(M.type) ? U(M.type) : It(M.type);
              t.reportError(
                new P(
                  `Directive "@${h}" argument "${I}" of type "${k}" is required, but it was not provided.`,
                  { nodes: c }
                )
              );
            }
        }
      },
    },
  };
}
function Dv(t) {
  return t.type.kind === A.NON_NULL_TYPE && t.defaultValue == null;
}
function E0(t) {
  return {
    Field(e) {
      const r = t.getType(),
        n = e.selectionSet;
      if (r) {
        if (Wr(Xt(r))) {
          if (n) {
            const i = e.name.value,
              a = U(r);
            t.reportError(
              new P(`Field "${i}" must not have a selection since type "${a}" has no subfields.`, {
                nodes: n,
              })
            );
          }
        } else if (!n) {
          const i = e.name.value,
            a = U(r);
          t.reportError(
            new P(
              `Field "${i}" of type "${a}" must have a selection of subfields. Did you mean "${i} { ... }"?`,
              { nodes: e }
            )
          );
        }
      }
    },
  };
}
function x0(t) {
  return t.map((e) => (typeof e == 'number' ? '[' + e.toString() + ']' : '.' + e)).join('');
}
function Ni(t, e, r) {
  return { prev: t, key: e, typename: r };
}
function cr(t) {
  const e = [];
  let r = t;
  for (; r; ) e.push(r.key), (r = r.prev);
  return e.reverse();
}
function _0(t, e, r = $v) {
  return Zi(t, e, r, void 0);
}
function $v(t, e, r) {
  let n = 'Invalid value ' + U(e);
  throw (t.length > 0 && (n += ` at "value${x0(t)}"`), (r.message = n + ': ' + r.message), r);
}
function Zi(t, e, r, n) {
  if (Ee(e)) {
    if (t != null) return Zi(t, e.ofType, r, n);
    r(cr(n), t, new P(`Expected non-nullable type "${U(e)}" not to be null.`));
    return;
  }
  if (t == null) return null;
  if (Nt(e)) {
    const i = e.ofType;
    return Mc(t)
      ? Array.from(t, (a, o) => {
          const c = Ni(n, o, void 0);
          return Zi(a, i, r, c);
        })
      : [Zi(t, i, r, n)];
  }
  if (St(e)) {
    if (!lr(t)) {
      r(cr(n), t, new P(`Expected type "${e.name}" to be an object.`));
      return;
    }
    const i = {},
      a = e.getFields();
    for (const o of Object.values(a)) {
      const c = t[o.name];
      if (c === void 0) {
        if (o.defaultValue !== void 0) i[o.name] = o.defaultValue;
        else if (Ee(o.type)) {
          const h = U(o.type);
          r(cr(n), t, new P(`Field "${o.name}" of required type "${h}" was not provided.`));
        }
        continue;
      }
      i[o.name] = Zi(c, o.type, r, Ni(n, o.name, e.name));
    }
    for (const o of Object.keys(t))
      if (!a[o]) {
        const c = kn(o, Object.keys(e.getFields()));
        r(cr(n), t, new P(`Field "${o}" is not defined by type "${e.name}".` + wn(c)));
      }
    return i;
  }
  if (Wr(e)) {
    let i;
    try {
      i = e.parseValue(t);
    } catch (a) {
      a instanceof P
        ? r(cr(n), t, a)
        : r(cr(n), t, new P(`Expected type "${e.name}". ` + a.message, { originalError: a }));
      return;
    }
    return i === void 0 && r(cr(n), t, new P(`Expected type "${e.name}".`)), i;
  }
  Rt(!1, 'Unexpected input type: ' + U(e));
}
function Ur(t, e, r) {
  if (t) {
    if (t.kind === A.VARIABLE) {
      const n = t.name.value;
      if (r == null || r[n] === void 0) return;
      const i = r[n];
      return i === null && Ee(e) ? void 0 : i;
    }
    if (Ee(e)) return t.kind === A.NULL ? void 0 : Ur(t, e.ofType, r);
    if (t.kind === A.NULL) return null;
    if (Nt(e)) {
      const n = e.ofType;
      if (t.kind === A.LIST) {
        const a = [];
        for (const o of t.values)
          if (Wf(o, r)) {
            if (Ee(n)) return;
            a.push(null);
          } else {
            const c = Ur(o, n, r);
            if (c === void 0) return;
            a.push(c);
          }
        return a;
      }
      const i = Ur(t, n, r);
      return i === void 0 ? void 0 : [i];
    }
    if (St(e)) {
      if (t.kind !== A.OBJECT) return;
      const n = Object.create(null),
        i = En(t.fields, (a) => a.name.value);
      for (const a of Object.values(e.getFields())) {
        const o = i[a.name];
        if (!o || Wf(o.value, r)) {
          if (a.defaultValue !== void 0) n[a.name] = a.defaultValue;
          else if (Ee(a.type)) return;
          continue;
        }
        const c = Ur(o.value, a.type, r);
        if (c === void 0) return;
        n[a.name] = c;
      }
      return n;
    }
    if (Wr(e)) {
      let n;
      try {
        n = e.parseLiteral(t, r);
      } catch {
        return;
      }
      return n === void 0 ? void 0 : n;
    }
    Rt(!1, 'Unexpected input type: ' + U(e));
  }
}
function Wf(t, e) {
  return t.kind === A.VARIABLE && (e == null || e[t.name.value] === void 0);
}
function T0(t, e, r, n) {
  const i = [],
    a = n?.maxErrors;
  try {
    const o = kv(t, e, r, (c) => {
      if (a != null && i.length >= a)
        throw new P(
          'Too many errors processing variables, error limit reached. Execution aborted.'
        );
      i.push(c);
    });
    if (i.length === 0) return { coerced: o };
  } catch (o) {
    i.push(o);
  }
  return { errors: i };
}
function kv(t, e, r, n) {
  const i = {};
  for (const a of e) {
    const o = a.variable.name.value,
      c = ar(t, a.type);
    if (!nr(c)) {
      const m = It(a.type);
      n(
        new P(
          `Variable "$${o}" expected value of type "${m}" which cannot be used as an input type.`,
          { nodes: a.type }
        )
      );
      continue;
    }
    if (!I0(r, o)) {
      if (a.defaultValue) i[o] = Ur(a.defaultValue, c);
      else if (Ee(c)) {
        const m = U(c);
        n(new P(`Variable "$${o}" of required type "${m}" was not provided.`, { nodes: a }));
      }
      continue;
    }
    const h = r[o];
    if (h === null && Ee(c)) {
      const m = U(c);
      n(new P(`Variable "$${o}" of non-null type "${m}" must not be null.`, { nodes: a }));
      continue;
    }
    i[o] = _0(h, c, (m, w, x) => {
      let T = `Variable "$${o}" got invalid value ` + U(w);
      m.length > 0 && (T += ` at "${o}${x0(m)}"`),
        n(new P(T + '; ' + x.message, { nodes: a, originalError: x.originalError }));
    });
  }
  return i;
}
function Hs(t, e, r) {
  var n;
  const i = {},
    a = (n = e.arguments) !== null && n !== void 0 ? n : [],
    o = En(a, (c) => c.name.value);
  for (const c of t.args) {
    const h = c.name,
      m = c.type,
      w = o[h];
    if (!w) {
      if (c.defaultValue !== void 0) i[h] = c.defaultValue;
      else if (Ee(m))
        throw new P(`Argument "${h}" of required type "${U(m)}" was not provided.`, { nodes: e });
      continue;
    }
    const x = w.value;
    let T = x.kind === A.NULL;
    if (x.kind === A.VARIABLE) {
      const M = x.name.value;
      if (r == null || !I0(r, M)) {
        if (c.defaultValue !== void 0) i[h] = c.defaultValue;
        else if (Ee(m))
          throw new P(
            `Argument "${h}" of required type "${U(
              m
            )}" was provided the variable "$${M}" which was not provided a runtime value.`,
            { nodes: x }
          );
        continue;
      }
      T = r[M] == null;
    }
    if (T && Ee(m))
      throw new P(`Argument "${h}" of non-null type "${U(m)}" must not be null.`, { nodes: x });
    const I = Ur(x, m, r);
    if (I === void 0) throw new P(`Argument "${h}" has invalid value ${It(x)}.`, { nodes: x });
    i[h] = I;
  }
  return i;
}
function la(t, e, r) {
  var n;
  const i =
    (n = e.directives) === null || n === void 0 ? void 0 : n.find((a) => a.name.value === t.name);
  if (i) return Hs(t, i, r);
}
function I0(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
function Jc(t, e, r, n, i) {
  const a = new Map();
  return Es(t, e, r, n, i, a, new Set()), a;
}
function Cv(t, e, r, n, i) {
  const a = new Map(),
    o = new Set();
  for (const c of i) c.selectionSet && Es(t, e, r, n, c.selectionSet, a, o);
  return a;
}
function Es(t, e, r, n, i, a, o) {
  for (const c of i.selections)
    switch (c.kind) {
      case A.FIELD: {
        if (!To(r, c)) continue;
        const h = Pv(c),
          m = a.get(h);
        m !== void 0 ? m.push(c) : a.set(h, [c]);
        break;
      }
      case A.INLINE_FRAGMENT: {
        if (!To(r, c) || !Kf(t, c, n)) continue;
        Es(t, e, r, n, c.selectionSet, a, o);
        break;
      }
      case A.FRAGMENT_SPREAD: {
        const h = c.name.value;
        if (o.has(h) || !To(r, c)) continue;
        o.add(h);
        const m = e[h];
        if (!m || !Kf(t, m, n)) continue;
        Es(t, e, r, n, m.selectionSet, a, o);
        break;
      }
    }
}
function To(t, e) {
  const r = la(Tc, e, t);
  if (r?.if === !0) return !1;
  const n = la(_c, e, t);
  return n?.if !== !1;
}
function Kf(t, e, r) {
  const n = e.typeCondition;
  if (!n) return !0;
  const i = ar(t, n);
  return i === r ? !0 : jr(i) ? t.isSubType(i, r) : !1;
}
function Pv(t) {
  return t.alias ? t.alias.value : t.name.value;
}
function N0(t) {
  return {
    OperationDefinition(e) {
      if (e.operation === 'subscription') {
        const r = t.getSchema(),
          n = r.getSubscriptionType();
        if (n) {
          const i = e.name ? e.name.value : null,
            a = Object.create(null),
            o = t.getDocument(),
            c = Object.create(null);
          for (const m of o.definitions) m.kind === A.FRAGMENT_DEFINITION && (c[m.name.value] = m);
          const h = Jc(r, c, a, n, e.selectionSet);
          if (h.size > 1) {
            const x = [...h.values()].slice(1).flat();
            t.reportError(
              new P(
                i != null
                  ? `Subscription "${i}" must select only one top level field.`
                  : 'Anonymous Subscription must select only one top level field.',
                { nodes: x }
              )
            );
          }
          for (const m of h.values())
            m[0].name.value.startsWith('__') &&
              t.reportError(
                new P(
                  i != null
                    ? `Subscription "${i}" must not select an introspection top level field.`
                    : 'Anonymous Subscription must not select an introspection top level field.',
                  { nodes: m }
                )
              );
        }
      }
    },
  };
}
function Hc(t, e) {
  const r = new Map();
  for (const n of t) {
    const i = e(n),
      a = r.get(i);
    a === void 0 ? r.set(i, [n]) : a.push(n);
  }
  return r;
}
function S0(t) {
  return {
    DirectiveDefinition(n) {
      var i;
      const a = (i = n.arguments) !== null && i !== void 0 ? i : [];
      return r(`@${n.name.value}`, a);
    },
    InterfaceTypeDefinition: e,
    InterfaceTypeExtension: e,
    ObjectTypeDefinition: e,
    ObjectTypeExtension: e,
  };
  function e(n) {
    var i;
    const a = n.name.value,
      o = (i = n.fields) !== null && i !== void 0 ? i : [];
    for (const h of o) {
      var c;
      const m = h.name.value,
        w = (c = h.arguments) !== null && c !== void 0 ? c : [];
      r(`${a}.${m}`, w);
    }
    return !1;
  }
  function r(n, i) {
    const a = Hc(i, (o) => o.name.value);
    for (const [o, c] of a)
      c.length > 1 &&
        t.reportError(
          new P(`Argument "${n}(${o}:)" can only be defined once.`, { nodes: c.map((h) => h.name) })
        );
    return !1;
  }
}
function Wc(t) {
  return { Field: e, Directive: e };
  function e(r) {
    var n;
    const i = (n = r.arguments) !== null && n !== void 0 ? n : [],
      a = Hc(i, (o) => o.name.value);
    for (const [o, c] of a)
      c.length > 1 &&
        t.reportError(
          new P(`There can be only one argument named "${o}".`, { nodes: c.map((h) => h.name) })
        );
  }
}
function M0(t) {
  const e = Object.create(null),
    r = t.getSchema();
  return {
    DirectiveDefinition(n) {
      const i = n.name.value;
      if (r != null && r.getDirective(i)) {
        t.reportError(
          new P(`Directive "@${i}" already exists in the schema. It cannot be redefined.`, {
            nodes: n.name,
          })
        );
        return;
      }
      return (
        e[i]
          ? t.reportError(
              new P(`There can be only one directive named "@${i}".`, { nodes: [e[i], n.name] })
            )
          : (e[i] = n.name),
        !1
      );
    },
  };
}
function Kc(t) {
  const e = Object.create(null),
    r = t.getSchema(),
    n = r ? r.getDirectives() : Pn;
  for (const c of n) e[c.name] = !c.isRepeatable;
  const i = t.getDocument().definitions;
  for (const c of i) c.kind === A.DIRECTIVE_DEFINITION && (e[c.name.value] = !c.repeatable);
  const a = Object.create(null),
    o = Object.create(null);
  return {
    enter(c) {
      if (!('directives' in c) || !c.directives) return;
      let h;
      if (c.kind === A.SCHEMA_DEFINITION || c.kind === A.SCHEMA_EXTENSION) h = a;
      else if (qi(c) || Gs(c)) {
        const m = c.name.value;
        (h = o[m]), h === void 0 && (o[m] = h = Object.create(null));
      } else h = Object.create(null);
      for (const m of c.directives) {
        const w = m.name.value;
        e[w] &&
          (h[w]
            ? t.reportError(
                new P(`The directive "@${w}" can only be used once at this location.`, {
                  nodes: [h[w], m],
                })
              )
            : (h[w] = m));
      }
    },
  };
}
function A0(t) {
  const e = t.getSchema(),
    r = e ? e.getTypeMap() : Object.create(null),
    n = Object.create(null);
  return { EnumTypeDefinition: i, EnumTypeExtension: i };
  function i(a) {
    var o;
    const c = a.name.value;
    n[c] || (n[c] = Object.create(null));
    const h = (o = a.values) !== null && o !== void 0 ? o : [],
      m = n[c];
    for (const w of h) {
      const x = w.name.value,
        T = r[c];
      kt(T) && T.getValue(x)
        ? t.reportError(
            new P(
              `Enum value "${c}.${x}" already exists in the schema. It cannot also be defined in this type extension.`,
              { nodes: w.name }
            )
          )
        : m[x]
        ? t.reportError(
            new P(`Enum value "${c}.${x}" can only be defined once.`, { nodes: [m[x], w.name] })
          )
        : (m[x] = w.name);
    }
    return !1;
  }
}
function O0(t) {
  const e = t.getSchema(),
    r = e ? e.getTypeMap() : Object.create(null),
    n = Object.create(null);
  return {
    InputObjectTypeDefinition: i,
    InputObjectTypeExtension: i,
    InterfaceTypeDefinition: i,
    InterfaceTypeExtension: i,
    ObjectTypeDefinition: i,
    ObjectTypeExtension: i,
  };
  function i(a) {
    var o;
    const c = a.name.value;
    n[c] || (n[c] = Object.create(null));
    const h = (o = a.fields) !== null && o !== void 0 ? o : [],
      m = n[c];
    for (const w of h) {
      const x = w.name.value;
      Lv(r[c], x)
        ? t.reportError(
            new P(
              `Field "${c}.${x}" already exists in the schema. It cannot also be defined in this type extension.`,
              { nodes: w.name }
            )
          )
        : m[x]
        ? t.reportError(
            new P(`Field "${c}.${x}" can only be defined once.`, { nodes: [m[x], w.name] })
          )
        : (m[x] = w.name);
    }
    return !1;
  }
}
function Lv(t, e) {
  return Ue(t) || Je(t) || St(t) ? t.getFields()[e] != null : !1;
}
function R0(t) {
  const e = Object.create(null);
  return {
    OperationDefinition: () => !1,
    FragmentDefinition(r) {
      const n = r.name.value;
      return (
        e[n]
          ? t.reportError(
              new P(`There can be only one fragment named "${n}".`, { nodes: [e[n], r.name] })
            )
          : (e[n] = r.name),
        !1
      );
    },
  };
}
function Qc(t) {
  const e = [];
  let r = Object.create(null);
  return {
    ObjectValue: {
      enter() {
        e.push(r), (r = Object.create(null));
      },
      leave() {
        const n = e.pop();
        n || Rt(!1), (r = n);
      },
    },
    ObjectField(n) {
      const i = n.name.value;
      r[i]
        ? t.reportError(
            new P(`There can be only one input field named "${i}".`, { nodes: [r[i], n.name] })
          )
        : (r[i] = n.name);
    },
  };
}
function D0(t) {
  const e = Object.create(null);
  return {
    OperationDefinition(r) {
      const n = r.name;
      return (
        n &&
          (e[n.value]
            ? t.reportError(
                new P(`There can be only one operation named "${n.value}".`, {
                  nodes: [e[n.value], n],
                })
              )
            : (e[n.value] = n)),
        !1
      );
    },
    FragmentDefinition: () => !1,
  };
}
function $0(t) {
  const e = t.getSchema(),
    r = Object.create(null),
    n = e
      ? {
          query: e.getQueryType(),
          mutation: e.getMutationType(),
          subscription: e.getSubscriptionType(),
        }
      : {};
  return { SchemaDefinition: i, SchemaExtension: i };
  function i(a) {
    var o;
    const c = (o = a.operationTypes) !== null && o !== void 0 ? o : [];
    for (const h of c) {
      const m = h.operation,
        w = r[m];
      n[m]
        ? t.reportError(
            new P(`Type for ${m} already defined in the schema. It cannot be redefined.`, {
              nodes: h,
            })
          )
        : w
        ? t.reportError(new P(`There can be only one ${m} type in schema.`, { nodes: [w, h] }))
        : (r[m] = h);
    }
    return !1;
  }
}
function k0(t) {
  const e = Object.create(null),
    r = t.getSchema();
  return {
    ScalarTypeDefinition: n,
    ObjectTypeDefinition: n,
    InterfaceTypeDefinition: n,
    UnionTypeDefinition: n,
    EnumTypeDefinition: n,
    InputObjectTypeDefinition: n,
  };
  function n(i) {
    const a = i.name.value;
    if (r != null && r.getType(a)) {
      t.reportError(
        new P(
          `Type "${a}" already exists in the schema. It cannot also be defined in this type definition.`,
          { nodes: i.name }
        )
      );
      return;
    }
    return (
      e[a]
        ? t.reportError(
            new P(`There can be only one type named "${a}".`, { nodes: [e[a], i.name] })
          )
        : (e[a] = i.name),
      !1
    );
  }
}
function C0(t) {
  return {
    OperationDefinition(e) {
      var r;
      const n = (r = e.variableDefinitions) !== null && r !== void 0 ? r : [],
        i = Hc(n, (a) => a.variable.name.value);
      for (const [a, o] of i)
        o.length > 1 &&
          t.reportError(
            new P(`There can be only one variable named "$${a}".`, {
              nodes: o.map((c) => c.variable.name),
            })
          );
    },
  };
}
function P0(t) {
  return {
    ListValue(e) {
      const r = yc(t.getParentInputType());
      if (!Nt(r)) return qn(t, e), !1;
    },
    ObjectValue(e) {
      const r = Xt(t.getInputType());
      if (!St(r)) return qn(t, e), !1;
      const n = En(e.fields, (i) => i.name.value);
      for (const i of Object.values(r.getFields()))
        if (!n[i.name] && qs(i)) {
          const o = U(i.type);
          t.reportError(
            new P(`Field "${r.name}.${i.name}" of required type "${o}" was not provided.`, {
              nodes: e,
            })
          );
        }
    },
    ObjectField(e) {
      const r = Xt(t.getParentInputType());
      if (!t.getInputType() && St(r)) {
        const i = kn(e.name.value, Object.keys(r.getFields()));
        t.reportError(
          new P(`Field "${e.name.value}" is not defined by type "${r.name}".` + wn(i), { nodes: e })
        );
      }
    },
    NullValue(e) {
      const r = t.getInputType();
      Ee(r) &&
        t.reportError(new P(`Expected value of type "${U(r)}", found ${It(e)}.`, { nodes: e }));
    },
    EnumValue: (e) => qn(t, e),
    IntValue: (e) => qn(t, e),
    FloatValue: (e) => qn(t, e),
    StringValue: (e) => qn(t, e),
    BooleanValue: (e) => qn(t, e),
  };
}
function qn(t, e) {
  const r = t.getInputType();
  if (!r) return;
  const n = Xt(r);
  if (!Wr(n)) {
    const i = U(r);
    t.reportError(new P(`Expected value of type "${i}", found ${It(e)}.`, { nodes: e }));
    return;
  }
  try {
    if (n.parseLiteral(e, void 0) === void 0) {
      const a = U(r);
      t.reportError(new P(`Expected value of type "${a}", found ${It(e)}.`, { nodes: e }));
    }
  } catch (i) {
    const a = U(r);
    i instanceof P
      ? t.reportError(i)
      : t.reportError(
          new P(`Expected value of type "${a}", found ${It(e)}; ` + i.message, {
            nodes: e,
            originalError: i,
          })
        );
  }
}
function L0(t) {
  return {
    VariableDefinition(e) {
      const r = ar(t.getSchema(), e.type);
      if (r !== void 0 && !nr(r)) {
        const n = e.variable.name.value,
          i = It(e.type);
        t.reportError(
          new P(`Variable "$${n}" cannot be non-input type "${i}".`, { nodes: e.type })
        );
      }
    },
  };
}
function F0(t) {
  let e = Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        e = Object.create(null);
      },
      leave(r) {
        const n = t.getRecursiveVariableUsages(r);
        for (const { node: i, type: a, defaultValue: o } of n) {
          const c = i.name.value,
            h = e[c];
          if (h && a) {
            const m = t.getSchema(),
              w = ar(m, h.type);
            if (w && !Fv(m, w, h.defaultValue, a, o)) {
              const x = U(w),
                T = U(a);
              t.reportError(
                new P(`Variable "$${c}" of type "${x}" used in position expecting type "${T}".`, {
                  nodes: [h, i],
                })
              );
            }
          }
        }
      },
    },
    VariableDefinition(r) {
      e[r.variable.name.value] = r;
    },
  };
}
function Fv(t, e, r, n, i) {
  if (Ee(n) && !Ee(e)) {
    if (!(r != null && r.kind !== A.NULL) && !(i !== void 0)) return !1;
    const c = n.ofType;
    return zn(t, e, c);
  }
  return zn(t, e, n);
}
const U0 = Object.freeze([
    t0,
    D0,
    o0,
    N0,
    zc,
    n0,
    L0,
    E0,
    r0,
    R0,
    s0,
    d0,
    b0,
    f0,
    C0,
    u0,
    l0,
    jc,
    Kc,
    i0,
    Wc,
    P0,
    y0,
    F0,
    p0,
    Qc,
  ]),
  Uv = Object.freeze([c0, $0, k0, A0, O0, S0, M0, zc, jc, Kc, g0, a0, Wc, Qc, w0]);
class q0 {
  constructor(e, r) {
    (this._ast = e),
      (this._fragments = void 0),
      (this._fragmentSpreads = new Map()),
      (this._recursivelyReferencedFragments = new Map()),
      (this._onError = r);
  }
  get [Symbol.toStringTag]() {
    return 'ASTValidationContext';
  }
  reportError(e) {
    this._onError(e);
  }
  getDocument() {
    return this._ast;
  }
  getFragment(e) {
    let r;
    if (this._fragments) r = this._fragments;
    else {
      r = Object.create(null);
      for (const n of this.getDocument().definitions)
        n.kind === A.FRAGMENT_DEFINITION && (r[n.name.value] = n);
      this._fragments = r;
    }
    return r[e];
  }
  getFragmentSpreads(e) {
    let r = this._fragmentSpreads.get(e);
    if (!r) {
      r = [];
      const n = [e];
      let i;
      for (; (i = n.pop()); )
        for (const a of i.selections)
          a.kind === A.FRAGMENT_SPREAD ? r.push(a) : a.selectionSet && n.push(a.selectionSet);
      this._fragmentSpreads.set(e, r);
    }
    return r;
  }
  getRecursivelyReferencedFragments(e) {
    let r = this._recursivelyReferencedFragments.get(e);
    if (!r) {
      r = [];
      const n = Object.create(null),
        i = [e.selectionSet];
      let a;
      for (; (a = i.pop()); )
        for (const o of this.getFragmentSpreads(a)) {
          const c = o.name.value;
          if (n[c] !== !0) {
            n[c] = !0;
            const h = this.getFragment(c);
            h && (r.push(h), i.push(h.selectionSet));
          }
        }
      this._recursivelyReferencedFragments.set(e, r);
    }
    return r;
  }
}
class qv extends q0 {
  constructor(e, r, n) {
    super(e, n), (this._schema = r);
  }
  get [Symbol.toStringTag]() {
    return 'SDLValidationContext';
  }
  getSchema() {
    return this._schema;
  }
}
class B0 extends q0 {
  constructor(e, r, n, i) {
    super(r, i),
      (this._schema = e),
      (this._typeInfo = n),
      (this._variableUsages = new Map()),
      (this._recursiveVariableUsages = new Map());
  }
  get [Symbol.toStringTag]() {
    return 'ValidationContext';
  }
  getSchema() {
    return this._schema;
  }
  getVariableUsages(e) {
    let r = this._variableUsages.get(e);
    if (!r) {
      const n = [],
        i = new Fc(this._schema);
      Fi(
        e,
        Uc(i, {
          VariableDefinition: () => !1,
          Variable(a) {
            n.push({ node: a, type: i.getInputType(), defaultValue: i.getDefaultValue() });
          },
        })
      ),
        (r = n),
        this._variableUsages.set(e, r);
    }
    return r;
  }
  getRecursiveVariableUsages(e) {
    let r = this._recursiveVariableUsages.get(e);
    if (!r) {
      r = this.getVariableUsages(e);
      for (const n of this.getRecursivelyReferencedFragments(e))
        r = r.concat(this.getVariableUsages(n));
      this._recursiveVariableUsages.set(e, r);
    }
    return r;
  }
  getType() {
    return this._typeInfo.getType();
  }
  getParentType() {
    return this._typeInfo.getParentType();
  }
  getInputType() {
    return this._typeInfo.getInputType();
  }
  getParentInputType() {
    return this._typeInfo.getParentInputType();
  }
  getFieldDef() {
    return this._typeInfo.getFieldDef();
  }
  getDirective() {
    return this._typeInfo.getDirective();
  }
  getArgument() {
    return this._typeInfo.getArgument();
  }
  getEnumValue() {
    return this._typeInfo.getEnumValue();
  }
}
function V0(t, e, r = U0, n, i = new Fc(t)) {
  var a;
  const o = (a = n?.maxErrors) !== null && a !== void 0 ? a : 100;
  e || ke(!1, 'Must provide document.'), Pc(t);
  const c = Object.freeze({}),
    h = [],
    m = new B0(t, e, i, (x) => {
      if (h.length >= o)
        throw (
          (h.push(new P('Too many validation errors, error limit reached. Validation aborted.')), c)
        );
      h.push(x);
    }),
    w = bc(r.map((x) => x(m)));
  try {
    Fi(e, Uc(i, w));
  } catch (x) {
    if (x !== c) throw x;
  }
  return h;
}
function j0(t, e, r = Uv) {
  const n = [],
    i = new qv(t, e, (o) => {
      n.push(o);
    }),
    a = r.map((o) => o(i));
  return Fi(t, bc(a)), n;
}
function Bv(t) {
  const e = j0(t);
  if (e.length !== 0)
    throw new Error(
      e.map((r) => r.message).join(`

`)
    );
}
function Vv(t, e) {
  const r = j0(t, e);
  if (r.length !== 0)
    throw new Error(
      r.map((n) => n.message).join(`

`)
    );
}
function jv(t) {
  let e;
  return function (n, i, a) {
    e === void 0 && (e = new WeakMap());
    let o = e.get(n);
    o === void 0 && ((o = new WeakMap()), e.set(n, o));
    let c = o.get(i);
    c === void 0 && ((c = new WeakMap()), o.set(i, c));
    let h = c.get(a);
    return h === void 0 && ((h = t(n, i, a)), c.set(a, h)), h;
  };
}
function zv(t) {
  return Promise.all(Object.values(t)).then((e) => {
    const r = Object.create(null);
    for (const [n, i] of Object.keys(t).entries()) r[i] = e[n];
    return r;
  });
}
function Gv(t, e, r) {
  let n = r;
  for (const i of t) n = dr(n) ? n.then((a) => e(a, i)) : e(n, i);
  return n;
}
function Jv(t) {
  return t instanceof Error ? t : new Hv(t);
}
class Hv extends Error {
  constructor(e) {
    super('Unexpected error value: ' + U(e)),
      (this.name = 'NonErrorThrown'),
      (this.thrownValue = e);
  }
}
function Si(t, e, r) {
  var n;
  const i = Jv(t);
  return Wv(i)
    ? i
    : new P(i.message, {
        nodes: (n = i.nodes) !== null && n !== void 0 ? n : e,
        source: i.source,
        positions: i.positions,
        path: r,
        originalError: i,
      });
}
function Wv(t) {
  return Array.isArray(t.path);
}
const Kv = jv((t, e, r) => Cv(t.schema, t.fragments, t.variableValues, e, r));
function Ws(t) {
  arguments.length < 2 ||
    ke(
      !1,
      'graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead.'
    );
  const { schema: e, document: r, variableValues: n, rootValue: i } = t;
  G0(e, r, n);
  const a = J0(t);
  if (!('schema' in a)) return { errors: a };
  try {
    const { operation: o } = a,
      c = Qv(a, o, i);
    return dr(c)
      ? c.then(
          (h) => Ga(h, a.errors),
          (h) => (a.errors.push(h), Ga(null, a.errors))
        )
      : Ga(c, a.errors);
  } catch (o) {
    return a.errors.push(o), Ga(null, a.errors);
  }
}
function z0(t) {
  const e = Ws(t);
  if (dr(e)) throw new Error('GraphQL execution failed to complete synchronously.');
  return e;
}
function Ga(t, e) {
  return e.length === 0 ? { data: t } : { errors: e, data: t };
}
function G0(t, e, r) {
  e || ke(!1, 'Must provide document.'),
    Pc(t),
    r == null ||
      lr(r) ||
      ke(
        !1,
        'Variables must be provided as an Object where each property is a variable value. Perhaps look to see if an unparsed JSON string was provided.'
      );
}
function J0(t) {
  var e, r;
  const {
    schema: n,
    document: i,
    rootValue: a,
    contextValue: o,
    variableValues: c,
    operationName: h,
    fieldResolver: m,
    typeResolver: w,
    subscribeFieldResolver: x,
  } = t;
  let T;
  const I = Object.create(null);
  for (const F of i.definitions)
    switch (F.kind) {
      case A.OPERATION_DEFINITION:
        if (h == null) {
          if (T !== void 0)
            return [new P('Must provide operation name if query contains multiple operations.')];
          T = F;
        } else ((e = F.name) === null || e === void 0 ? void 0 : e.value) === h && (T = F);
        break;
      case A.FRAGMENT_DEFINITION:
        I[F.name.value] = F;
        break;
    }
  if (!T)
    return h != null
      ? [new P(`Unknown operation named "${h}".`)]
      : [new P('Must provide an operation.')];
  const M = (r = T.variableDefinitions) !== null && r !== void 0 ? r : [],
    k = T0(n, M, c ?? {}, { maxErrors: 50 });
  return k.errors
    ? k.errors
    : {
        schema: n,
        fragments: I,
        rootValue: a,
        contextValue: o,
        operation: T,
        variableValues: k.coerced,
        fieldResolver: m ?? Xo,
        typeResolver: w ?? K0,
        subscribeFieldResolver: x ?? Xo,
        errors: [],
      };
}
function Qv(t, e, r) {
  const n = t.schema.getRootType(e.operation);
  if (n == null)
    throw new P(`Schema is not configured to execute ${e.operation} operation.`, { nodes: e });
  const i = Jc(t.schema, t.fragments, t.variableValues, n, e.selectionSet),
    a = void 0;
  switch (e.operation) {
    case Lt.QUERY:
      return xs(t, n, r, a, i);
    case Lt.MUTATION:
      return Yv(t, n, r, a, i);
    case Lt.SUBSCRIPTION:
      return xs(t, n, r, a, i);
  }
}
function Yv(t, e, r, n, i) {
  return Gv(
    i.entries(),
    (a, [o, c]) => {
      const h = Ni(n, o, e.name),
        m = H0(t, e, r, c, h);
      return m === void 0 ? a : dr(m) ? m.then((w) => ((a[o] = w), a)) : ((a[o] = m), a);
    },
    Object.create(null)
  );
}
function xs(t, e, r, n, i) {
  const a = Object.create(null);
  let o = !1;
  for (const [c, h] of i.entries()) {
    const m = Ni(n, c, e.name),
      w = H0(t, e, r, h, m);
    w !== void 0 && ((a[c] = w), dr(w) && (o = !0));
  }
  return o ? zv(a) : a;
}
function H0(t, e, r, n, i) {
  var a;
  const o = Q0(t.schema, e, n[0]);
  if (!o) return;
  const c = o.type,
    h = (a = o.resolve) !== null && a !== void 0 ? a : t.fieldResolver,
    m = W0(t, o, n, e, i);
  try {
    const w = Hs(o, n[0], t.variableValues),
      x = t.contextValue,
      T = h(r, w, x, m);
    let I;
    return (
      dr(T) ? (I = T.then((M) => ha(t, c, n, m, i, M))) : (I = ha(t, c, n, m, i, T)),
      dr(I)
        ? I.then(void 0, (M) => {
            const k = Si(M, n, cr(i));
            return _s(k, c, t);
          })
        : I
    );
  } catch (w) {
    const x = Si(w, n, cr(i));
    return _s(x, c, t);
  }
}
function W0(t, e, r, n, i) {
  return {
    fieldName: e.name,
    fieldNodes: r,
    returnType: e.type,
    parentType: n,
    path: i,
    schema: t.schema,
    fragments: t.fragments,
    rootValue: t.rootValue,
    operation: t.operation,
    variableValues: t.variableValues,
  };
}
function _s(t, e, r) {
  if (Ee(e)) throw t;
  return r.errors.push(t), null;
}
function ha(t, e, r, n, i, a) {
  if (a instanceof Error) throw a;
  if (Ee(e)) {
    const o = ha(t, e.ofType, r, n, i, a);
    if (o === null)
      throw new Error(
        `Cannot return null for non-nullable field ${n.parentType.name}.${n.fieldName}.`
      );
    return o;
  }
  if (a == null) return null;
  if (Nt(e)) return Xv(t, e, r, n, i, a);
  if (Wr(e)) return Zv(e, a);
  if (jr(e)) return eb(t, e, r, n, i, a);
  if (Ue(e)) return Yo(t, e, r, n, i, a);
  Rt(!1, 'Cannot complete value of unexpected output type: ' + U(e));
}
function Xv(t, e, r, n, i, a) {
  if (!Mc(a))
    throw new P(
      `Expected Iterable, but did not find one for field "${n.parentType.name}.${n.fieldName}".`
    );
  const o = e.ofType;
  let c = !1;
  const h = Array.from(a, (m, w) => {
    const x = Ni(i, w, void 0);
    try {
      let T;
      return (
        dr(m) ? (T = m.then((I) => ha(t, o, r, n, x, I))) : (T = ha(t, o, r, n, x, m)),
        dr(T)
          ? ((c = !0),
            T.then(void 0, (I) => {
              const M = Si(I, r, cr(x));
              return _s(M, o, t);
            }))
          : T
      );
    } catch (T) {
      const I = Si(T, r, cr(x));
      return _s(I, o, t);
    }
  });
  return c ? Promise.all(h) : h;
}
function Zv(t, e) {
  const r = t.serialize(e);
  if (r == null)
    throw new Error(
      `Expected \`${U(t)}.serialize(${U(e)})\` to return non-nullable value, returned: ${U(r)}`
    );
  return r;
}
function eb(t, e, r, n, i, a) {
  var o;
  const c = (o = e.resolveType) !== null && o !== void 0 ? o : t.typeResolver,
    h = t.contextValue,
    m = c(a, h, n, e);
  return dr(m)
    ? m.then((w) => Yo(t, Qf(w, t, e, r, n, a), r, n, i, a))
    : Yo(t, Qf(m, t, e, r, n, a), r, n, i, a);
}
function Qf(t, e, r, n, i, a) {
  if (t == null)
    throw new P(
      `Abstract type "${r.name}" must resolve to an Object type at runtime for field "${i.parentType.name}.${i.fieldName}". Either the "${r.name}" type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.`,
      n
    );
  if (Ue(t))
    throw new P(
      'Support for returning GraphQLObjectType from resolveType was removed in graphql-js@16.0.0 please return type name instead.'
    );
  if (typeof t != 'string')
    throw new P(
      `Abstract type "${r.name}" must resolve to an Object type at runtime for field "${
        i.parentType.name
      }.${i.fieldName}" with value ${U(a)}, received "${U(t)}".`
    );
  const o = e.schema.getType(t);
  if (o == null)
    throw new P(
      `Abstract type "${r.name}" was resolved to a type "${t}" that does not exist inside the schema.`,
      { nodes: n }
    );
  if (!Ue(o))
    throw new P(`Abstract type "${r.name}" was resolved to a non-object type "${t}".`, {
      nodes: n,
    });
  if (!e.schema.isSubType(r, o))
    throw new P(`Runtime Object type "${o.name}" is not a possible type for "${r.name}".`, {
      nodes: n,
    });
  return o;
}
function Yo(t, e, r, n, i, a) {
  const o = Kv(t, e, r);
  if (e.isTypeOf) {
    const c = e.isTypeOf(a, t.contextValue, n);
    if (dr(c))
      return c.then((h) => {
        if (!h) throw Yf(e, a, r);
        return xs(t, e, a, i, o);
      });
    if (!c) throw Yf(e, a, r);
  }
  return xs(t, e, a, i, o);
}
function Yf(t, e, r) {
  return new P(`Expected value of type "${t.name}" but got: ${U(e)}.`, { nodes: r });
}
const K0 = function (t, e, r, n) {
    if (lr(t) && typeof t.__typename == 'string') return t.__typename;
    const i = r.schema.getPossibleTypes(n),
      a = [];
    for (let o = 0; o < i.length; o++) {
      const c = i[o];
      if (c.isTypeOf) {
        const h = c.isTypeOf(t, e, r);
        if (dr(h)) a[o] = h;
        else if (h) return c.name;
      }
    }
    if (a.length)
      return Promise.all(a).then((o) => {
        for (let c = 0; c < o.length; c++) if (o[c]) return i[c].name;
      });
  },
  Xo = function (t, e, r, n) {
    if (lr(t) || typeof t == 'function') {
      const i = t[n.fieldName];
      return typeof i == 'function' ? t[n.fieldName](e, r, n) : i;
    }
  };
function Q0(t, e, r) {
  const n = r.name.value;
  return n === fa.name && t.getQueryType() === e
    ? fa
    : n === ua.name && t.getQueryType() === e
    ? ua
    : n === da.name
    ? da
    : e.getFields()[n];
}
function tb(t) {
  return new Promise((e) => e(Y0(t)));
}
function rb(t) {
  const e = Y0(t);
  if (dr(e)) throw new Error('GraphQL execution failed to complete synchronously.');
  return e;
}
function Y0(t) {
  arguments.length < 2 ||
    ke(
      !1,
      'graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead.'
    );
  const {
      schema: e,
      source: r,
      rootValue: n,
      contextValue: i,
      variableValues: a,
      operationName: o,
      fieldResolver: c,
      typeResolver: h,
    } = t,
    m = Cc(e);
  if (m.length > 0) return { errors: m };
  let w;
  try {
    w = wa(r);
  } catch (T) {
    return { errors: [T] };
  }
  const x = V0(e, w);
  return x.length > 0
    ? { errors: x }
    : Ws({
        schema: e,
        document: w,
        rootValue: n,
        contextValue: i,
        variableValues: a,
        operationName: o,
        fieldResolver: c,
        typeResolver: h,
      });
}
function X0(t) {
  return typeof t?.[Symbol.asyncIterator] == 'function';
}
function nb(t, e) {
  const r = t[Symbol.asyncIterator]();
  async function n(i) {
    if (i.done) return i;
    try {
      return { value: await e(i.value), done: !1 };
    } catch (a) {
      if (typeof r.return == 'function')
        try {
          await r.return();
        } catch {}
      throw a;
    }
  }
  return {
    async next() {
      return n(await r.next());
    },
    async return() {
      return typeof r.return == 'function' ? n(await r.return()) : { value: void 0, done: !0 };
    },
    async throw(i) {
      if (typeof r.throw == 'function') return n(await r.throw(i));
      throw i;
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
async function ib(t) {
  arguments.length < 2 ||
    ke(
      !1,
      'graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead.'
    );
  const e = await Z0(t);
  return X0(e) ? nb(e, (n) => Ws({ ...t, rootValue: n })) : e;
}
function ab(t) {
  const e = t[0];
  return e && 'document' in e
    ? e
    : {
        schema: e,
        document: t[1],
        rootValue: t[2],
        contextValue: t[3],
        variableValues: t[4],
        operationName: t[5],
        subscribeFieldResolver: t[6],
      };
}
async function Z0(...t) {
  const e = ab(t),
    { schema: r, document: n, variableValues: i } = e;
  G0(r, n, i);
  const a = J0(e);
  if (!('schema' in a)) return { errors: a };
  try {
    const o = await sb(a);
    if (!X0(o))
      throw new Error(`Subscription field must return Async Iterable. Received: ${U(o)}.`);
    return o;
  } catch (o) {
    if (o instanceof P) return { errors: [o] };
    throw o;
  }
}
async function sb(t) {
  const { schema: e, fragments: r, operation: n, variableValues: i, rootValue: a } = t,
    o = e.getSubscriptionType();
  if (o == null)
    throw new P('Schema is not configured to execute subscription operation.', { nodes: n });
  const c = Jc(e, r, i, o, n.selectionSet),
    [h, m] = [...c.entries()][0],
    w = Q0(e, o, m[0]);
  if (!w) {
    const M = m[0].name.value;
    throw new P(`The subscription field "${M}" is not defined.`, { nodes: m });
  }
  const x = Ni(void 0, h, o.name),
    T = W0(t, w, m, o, x);
  try {
    var I;
    const M = Hs(w, m[0], i),
      k = t.contextValue,
      j = await ((I = w.subscribe) !== null && I !== void 0 ? I : t.subscribeFieldResolver)(
        a,
        M,
        k,
        T
      );
    if (j instanceof Error) throw j;
    return j;
  } catch (M) {
    throw Si(M, m, cr(x));
  }
}
function ob(t) {
  return {
    Field(e) {
      const r = t.getFieldDef(),
        n = r?.deprecationReason;
      if (r && n != null) {
        const i = t.getParentType();
        i != null || Rt(!1),
          t.reportError(new P(`The field ${i.name}.${r.name} is deprecated. ${n}`, { nodes: e }));
      }
    },
    Argument(e) {
      const r = t.getArgument(),
        n = r?.deprecationReason;
      if (r && n != null) {
        const i = t.getDirective();
        if (i != null)
          t.reportError(
            new P(`Directive "@${i.name}" argument "${r.name}" is deprecated. ${n}`, { nodes: e })
          );
        else {
          const a = t.getParentType(),
            o = t.getFieldDef();
          (a != null && o != null) || Rt(!1),
            t.reportError(
              new P(`Field "${a.name}.${o.name}" argument "${r.name}" is deprecated. ${n}`, {
                nodes: e,
              })
            );
        }
      }
    },
    ObjectField(e) {
      const r = Xt(t.getParentInputType());
      if (St(r)) {
        const n = r.getFields()[e.name.value],
          i = n?.deprecationReason;
        i != null &&
          t.reportError(
            new P(`The input field ${r.name}.${n.name} is deprecated. ${i}`, { nodes: e })
          );
      }
    },
    EnumValue(e) {
      const r = t.getEnumValue(),
        n = r?.deprecationReason;
      if (r && n != null) {
        const i = Xt(t.getInputType());
        i != null || Rt(!1),
          t.reportError(
            new P(`The enum value "${i.name}.${r.name}" is deprecated. ${n}`, { nodes: e })
          );
      }
    },
  };
}
function cb(t) {
  return {
    Field(e) {
      const r = Xt(t.getType());
      r &&
        Zn(r) &&
        t.reportError(
          new P(
            `GraphQL introspection has been disabled, but the requested query contained the field "${e.name.value}".`,
            { nodes: e }
          )
        );
    },
  };
}
function el(t) {
  const e = {
      descriptions: !0,
      specifiedByUrl: !1,
      directiveIsRepeatable: !1,
      schemaDescription: !1,
      inputValueDeprecation: !1,
      ...t,
    },
    r = e.descriptions ? 'description' : '',
    n = e.specifiedByUrl ? 'specifiedByURL' : '',
    i = e.directiveIsRepeatable ? 'isRepeatable' : '',
    a = e.schemaDescription ? r : '';
  function o(c) {
    return e.inputValueDeprecation ? c : '';
  }
  return `
    query IntrospectionQuery {
      __schema {
        ${a}
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          ...FullType
        }
        directives {
          name
          ${r}
          ${i}
          locations
          args${o('(includeDeprecated: true)')} {
            ...InputValue
          }
        }
      }
    }

    fragment FullType on __Type {
      kind
      name
      ${r}
      ${n}
      fields(includeDeprecated: true) {
        name
        ${r}
        args${o('(includeDeprecated: true)')} {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields${o('(includeDeprecated: true)')} {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        ${r}
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }

    fragment InputValue on __InputValue {
      name
      ${r}
      type { ...TypeRef }
      defaultValue
      ${o('isDeprecated')}
      ${o('deprecationReason')}
    }

    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}
function fb(t, e) {
  let r = null;
  for (const i of t.definitions)
    if (i.kind === A.OPERATION_DEFINITION) {
      var n;
      if (e == null) {
        if (r) return null;
        r = i;
      } else if (((n = i.name) === null || n === void 0 ? void 0 : n.value) === e) return i;
    }
  return r;
}
function ub(t, e) {
  if (e.operation === 'query') {
    const r = t.getQueryType();
    if (!r) throw new P('Schema does not define the required query root type.', { nodes: e });
    return r;
  }
  if (e.operation === 'mutation') {
    const r = t.getMutationType();
    if (!r) throw new P('Schema is not configured for mutations.', { nodes: e });
    return r;
  }
  if (e.operation === 'subscription') {
    const r = t.getSubscriptionType();
    if (!r) throw new P('Schema is not configured for subscriptions.', { nodes: e });
    return r;
  }
  throw new P('Can only have query, mutation and subscription operations.', { nodes: e });
}
function db(t, e) {
  const r = {
      specifiedByUrl: !0,
      directiveIsRepeatable: !0,
      schemaDescription: !0,
      inputValueDeprecation: !0,
      ...e,
    },
    n = wa(el(r)),
    i = z0({ schema: t, document: n });
  return (!i.errors && i.data) || Rt(!1), i.data;
}
function lb(t, e) {
  (lr(t) && lr(t.__schema)) ||
    ke(
      !1,
      `Invalid or incomplete introspection result. Ensure that you are passing "data" property of introspection response and no "errors" was returned alongside: ${U(
        t
      )}.`
    );
  const r = t.__schema,
    n = Nn(
      r.types,
      (R) => R.name,
      (R) => T(R)
    );
  for (const R of [...Ia, ...Ma]) n[R.name] && (n[R.name] = R);
  const i = r.queryType ? w(r.queryType) : null,
    a = r.mutationType ? w(r.mutationType) : null,
    o = r.subscriptionType ? w(r.subscriptionType) : null,
    c = r.directives ? r.directives.map(re) : [];
  return new Ui({
    description: r.description,
    query: i,
    mutation: a,
    subscription: o,
    types: Object.values(n),
    directives: c,
    assumeValid: e?.assumeValid,
  });
  function h(R) {
    if (R.kind === Ye.LIST) {
      const q = R.ofType;
      if (!q) throw new Error('Decorated type deeper than introspection query.');
      return new Gt(h(q));
    }
    if (R.kind === Ye.NON_NULL) {
      const q = R.ofType;
      if (!q) throw new Error('Decorated type deeper than introspection query.');
      const N = h(q);
      return new $e(Gd(N));
    }
    return m(R);
  }
  function m(R) {
    const q = R.name;
    if (!q) throw new Error(`Unknown type reference: ${U(R)}.`);
    const N = n[q];
    if (!N)
      throw new Error(
        `Invalid or incomplete schema, unknown type: ${q}. Ensure that a full introspection query is used in order to build a client schema.`
      );
    return N;
  }
  function w(R) {
    return jd(m(R));
  }
  function x(R) {
    return zd(m(R));
  }
  function T(R) {
    if (R != null && R.name != null && R.kind != null)
      switch (R.kind) {
        case Ye.SCALAR:
          return I(R);
        case Ye.OBJECT:
          return k(R);
        case Ye.INTERFACE:
          return F(R);
        case Ye.UNION:
          return j(R);
        case Ye.ENUM:
          return Z(R);
        case Ye.INPUT_OBJECT:
          return me(R);
      }
    const q = U(R);
    throw new Error(
      `Invalid or incomplete introspection result. Ensure that a full introspection query is used in order to build a client schema: ${q}.`
    );
  }
  function I(R) {
    return new Qr({ name: R.name, description: R.description, specifiedByURL: R.specifiedByURL });
  }
  function M(R) {
    if (R.interfaces === null && R.kind === Ye.INTERFACE) return [];
    if (!R.interfaces) {
      const q = U(R);
      throw new Error(`Introspection result missing interfaces: ${q}.`);
    }
    return R.interfaces.map(x);
  }
  function k(R) {
    return new Er({
      name: R.name,
      description: R.description,
      interfaces: () => M(R),
      fields: () => ue(R),
    });
  }
  function F(R) {
    return new _i({
      name: R.name,
      description: R.description,
      interfaces: () => M(R),
      fields: () => ue(R),
    });
  }
  function j(R) {
    if (!R.possibleTypes) {
      const q = U(R);
      throw new Error(`Introspection result missing possibleTypes: ${q}.`);
    }
    return new Ti({
      name: R.name,
      description: R.description,
      types: () => R.possibleTypes.map(w),
    });
  }
  function Z(R) {
    if (!R.enumValues) {
      const q = U(R);
      throw new Error(`Introspection result missing enumValues: ${q}.`);
    }
    return new Dn({
      name: R.name,
      description: R.description,
      values: Nn(
        R.enumValues,
        (q) => q.name,
        (q) => ({ description: q.description, deprecationReason: q.deprecationReason })
      ),
    });
  }
  function me(R) {
    if (!R.inputFields) {
      const q = U(R);
      throw new Error(`Introspection result missing inputFields: ${q}.`);
    }
    return new Ii({ name: R.name, description: R.description, fields: () => J(R.inputFields) });
  }
  function ue(R) {
    if (!R.fields) throw new Error(`Introspection result missing fields: ${U(R)}.`);
    return Nn(R.fields, (q) => q.name, X);
  }
  function X(R) {
    const q = h(R.type);
    if (!An(q)) {
      const N = U(q);
      throw new Error(`Introspection must provide output type for fields, but received: ${N}.`);
    }
    if (!R.args) {
      const N = U(R);
      throw new Error(`Introspection result missing field args: ${N}.`);
    }
    return {
      description: R.description,
      deprecationReason: R.deprecationReason,
      type: q,
      args: J(R.args),
    };
  }
  function J(R) {
    return Nn(R, (q) => q.name, Q);
  }
  function Q(R) {
    const q = h(R.type);
    if (!nr(q)) {
      const p = U(q);
      throw new Error(`Introspection must provide input type for arguments, but received: ${p}.`);
    }
    const N = R.defaultValue != null ? Ur(qd(R.defaultValue), q) : void 0;
    return {
      description: R.description,
      type: q,
      defaultValue: N,
      deprecationReason: R.deprecationReason,
    };
  }
  function re(R) {
    if (!R.args) {
      const q = U(R);
      throw new Error(`Introspection result missing directive args: ${q}.`);
    }
    if (!R.locations) {
      const q = U(R);
      throw new Error(`Introspection result missing directive locations: ${q}.`);
    }
    return new Yr({
      name: R.name,
      description: R.description,
      isRepeatable: R.isRepeatable,
      locations: R.locations.slice(),
      args: J(R.args),
    });
  }
}
function hb(t, e, r) {
  kc(t),
    (e != null && e.kind === A.DOCUMENT) || ke(!1, 'Must provide valid Document AST.'),
    r?.assumeValid !== !0 && r?.assumeValidSDL !== !0 && Vv(e, t);
  const n = t.toConfig(),
    i = tl(n, e, r);
  return n === i ? t : new Ui(i);
}
function tl(t, e, r) {
  var n, i, a, o;
  const c = [],
    h = Object.create(null),
    m = [];
  let w;
  const x = [];
  for (const d of e.definitions)
    if (d.kind === A.SCHEMA_DEFINITION) w = d;
    else if (d.kind === A.SCHEMA_EXTENSION) x.push(d);
    else if (qi(d)) c.push(d);
    else if (Gs(d)) {
      const _ = d.name.value,
        O = h[_];
      h[_] = O ? O.concat([d]) : [d];
    } else d.kind === A.DIRECTIVE_DEFINITION && m.push(d);
  if (
    Object.keys(h).length === 0 &&
    c.length === 0 &&
    m.length === 0 &&
    x.length === 0 &&
    w == null
  )
    return t;
  const T = Object.create(null);
  for (const d of t.types) T[d.name] = Z(d);
  for (const d of c) {
    var I;
    const _ = d.name.value;
    T[_] = (I = Xf[_]) !== null && I !== void 0 ? I : b(d);
  }
  const M = {
    query: t.query && F(t.query),
    mutation: t.mutation && F(t.mutation),
    subscription: t.subscription && F(t.subscription),
    ...(w && N([w])),
    ...N(x),
  };
  return {
    description:
      (n = w) === null || n === void 0 || (i = n.description) === null || i === void 0
        ? void 0
        : i.value,
    ...M,
    types: Object.values(T),
    directives: [...t.directives.map(j), ...m.map(s)],
    extensions: Object.create(null),
    astNode: (a = w) !== null && a !== void 0 ? a : t.astNode,
    extensionASTNodes: t.extensionASTNodes.concat(x),
    assumeValid: (o = r?.assumeValid) !== null && o !== void 0 ? o : !1,
  };
  function k(d) {
    return Nt(d) ? new Gt(k(d.ofType)) : Ee(d) ? new $e(k(d.ofType)) : F(d);
  }
  function F(d) {
    return T[d.name];
  }
  function j(d) {
    const _ = d.toConfig();
    return new Yr({ ..._, args: pn(_.args, q) });
  }
  function Z(d) {
    if (Zn(d) || Bs(d)) return d;
    if (pr(d)) return X(d);
    if (Ue(d)) return J(d);
    if (Je(d)) return Q(d);
    if (Ft(d)) return re(d);
    if (kt(d)) return ue(d);
    if (St(d)) return me(d);
    Rt(!1, 'Unexpected type: ' + U(d));
  }
  function me(d) {
    var _;
    const O = d.toConfig(),
      D = (_ = h[O.name]) !== null && _ !== void 0 ? _ : [];
    return new Ii({
      ...O,
      fields: () => ({ ...pn(O.fields, ($) => ({ ...$, type: k($.type) })), ...y(D) }),
      extensionASTNodes: O.extensionASTNodes.concat(D),
    });
  }
  function ue(d) {
    var _;
    const O = d.toConfig(),
      D = (_ = h[d.name]) !== null && _ !== void 0 ? _ : [];
    return new Dn({
      ...O,
      values: { ...O.values, ...E(D) },
      extensionASTNodes: O.extensionASTNodes.concat(D),
    });
  }
  function X(d) {
    var _;
    const O = d.toConfig(),
      D = (_ = h[O.name]) !== null && _ !== void 0 ? _ : [];
    let $ = O.specifiedByURL;
    for (const H of D) {
      var z;
      $ = (z = Zf(H)) !== null && z !== void 0 ? z : $;
    }
    return new Qr({ ...O, specifiedByURL: $, extensionASTNodes: O.extensionASTNodes.concat(D) });
  }
  function J(d) {
    var _;
    const O = d.toConfig(),
      D = (_ = h[O.name]) !== null && _ !== void 0 ? _ : [];
    return new Er({
      ...O,
      interfaces: () => [...d.getInterfaces().map(F), ...g(D)],
      fields: () => ({ ...pn(O.fields, R), ...f(D) }),
      extensionASTNodes: O.extensionASTNodes.concat(D),
    });
  }
  function Q(d) {
    var _;
    const O = d.toConfig(),
      D = (_ = h[O.name]) !== null && _ !== void 0 ? _ : [];
    return new _i({
      ...O,
      interfaces: () => [...d.getInterfaces().map(F), ...g(D)],
      fields: () => ({ ...pn(O.fields, R), ...f(D) }),
      extensionASTNodes: O.extensionASTNodes.concat(D),
    });
  }
  function re(d) {
    var _;
    const O = d.toConfig(),
      D = (_ = h[O.name]) !== null && _ !== void 0 ? _ : [];
    return new Ti({
      ...O,
      types: () => [...d.getTypes().map(F), ...u(D)],
      extensionASTNodes: O.extensionASTNodes.concat(D),
    });
  }
  function R(d) {
    return { ...d, type: k(d.type), args: d.args && pn(d.args, q) };
  }
  function q(d) {
    return { ...d, type: k(d.type) };
  }
  function N(d) {
    const _ = {};
    for (const D of d) {
      var O;
      const $ = (O = D.operationTypes) !== null && O !== void 0 ? O : [];
      for (const z of $) _[z.operation] = p(z.type);
    }
    return _;
  }
  function p(d) {
    var _;
    const O = d.name.value,
      D = (_ = Xf[O]) !== null && _ !== void 0 ? _ : T[O];
    if (D === void 0) throw new Error(`Unknown type: "${O}".`);
    return D;
  }
  function l(d) {
    return d.kind === A.LIST_TYPE
      ? new Gt(l(d.type))
      : d.kind === A.NON_NULL_TYPE
      ? new $e(l(d.type))
      : p(d);
  }
  function s(d) {
    var _;
    return new Yr({
      name: d.name.value,
      description: (_ = d.description) === null || _ === void 0 ? void 0 : _.value,
      locations: d.locations.map(({ value: O }) => O),
      isRepeatable: d.repeatable,
      args: v(d.arguments),
      astNode: d,
    });
  }
  function f(d) {
    const _ = Object.create(null);
    for (const $ of d) {
      var O;
      const z = (O = $.fields) !== null && O !== void 0 ? O : [];
      for (const H of z) {
        var D;
        _[H.name.value] = {
          type: l(H.type),
          description: (D = H.description) === null || D === void 0 ? void 0 : D.value,
          args: v(H.arguments),
          deprecationReason: Ja(H),
          astNode: H,
        };
      }
    }
    return _;
  }
  function v(d) {
    const _ = d ?? [],
      O = Object.create(null);
    for (const $ of _) {
      var D;
      const z = l($.type);
      O[$.name.value] = {
        type: z,
        description: (D = $.description) === null || D === void 0 ? void 0 : D.value,
        defaultValue: Ur($.defaultValue, z),
        deprecationReason: Ja($),
        astNode: $,
      };
    }
    return O;
  }
  function y(d) {
    const _ = Object.create(null);
    for (const $ of d) {
      var O;
      const z = (O = $.fields) !== null && O !== void 0 ? O : [];
      for (const H of z) {
        var D;
        const K = l(H.type);
        _[H.name.value] = {
          type: K,
          description: (D = H.description) === null || D === void 0 ? void 0 : D.value,
          defaultValue: Ur(H.defaultValue, K),
          deprecationReason: Ja(H),
          astNode: H,
        };
      }
    }
    return _;
  }
  function E(d) {
    const _ = Object.create(null);
    for (const $ of d) {
      var O;
      const z = (O = $.values) !== null && O !== void 0 ? O : [];
      for (const H of z) {
        var D;
        _[H.name.value] = {
          description: (D = H.description) === null || D === void 0 ? void 0 : D.value,
          deprecationReason: Ja(H),
          astNode: H,
        };
      }
    }
    return _;
  }
  function g(d) {
    return d.flatMap((_) => {
      var O, D;
      return (O = (D = _.interfaces) === null || D === void 0 ? void 0 : D.map(p)) !== null &&
        O !== void 0
        ? O
        : [];
    });
  }
  function u(d) {
    return d.flatMap((_) => {
      var O, D;
      return (O = (D = _.types) === null || D === void 0 ? void 0 : D.map(p)) !== null &&
        O !== void 0
        ? O
        : [];
    });
  }
  function b(d) {
    var _;
    const O = d.name.value,
      D = (_ = h[O]) !== null && _ !== void 0 ? _ : [];
    switch (d.kind) {
      case A.OBJECT_TYPE_DEFINITION: {
        var $;
        const te = [d, ...D];
        return new Er({
          name: O,
          description: ($ = d.description) === null || $ === void 0 ? void 0 : $.value,
          interfaces: () => g(te),
          fields: () => f(te),
          astNode: d,
          extensionASTNodes: D,
        });
      }
      case A.INTERFACE_TYPE_DEFINITION: {
        var z;
        const te = [d, ...D];
        return new _i({
          name: O,
          description: (z = d.description) === null || z === void 0 ? void 0 : z.value,
          interfaces: () => g(te),
          fields: () => f(te),
          astNode: d,
          extensionASTNodes: D,
        });
      }
      case A.ENUM_TYPE_DEFINITION: {
        var H;
        const te = [d, ...D];
        return new Dn({
          name: O,
          description: (H = d.description) === null || H === void 0 ? void 0 : H.value,
          values: E(te),
          astNode: d,
          extensionASTNodes: D,
        });
      }
      case A.UNION_TYPE_DEFINITION: {
        var K;
        const te = [d, ...D];
        return new Ti({
          name: O,
          description: (K = d.description) === null || K === void 0 ? void 0 : K.value,
          types: () => u(te),
          astNode: d,
          extensionASTNodes: D,
        });
      }
      case A.SCALAR_TYPE_DEFINITION: {
        var le;
        return new Qr({
          name: O,
          description: (le = d.description) === null || le === void 0 ? void 0 : le.value,
          specifiedByURL: Zf(d),
          astNode: d,
          extensionASTNodes: D,
        });
      }
      case A.INPUT_OBJECT_TYPE_DEFINITION: {
        var oe;
        const te = [d, ...D];
        return new Ii({
          name: O,
          description: (oe = d.description) === null || oe === void 0 ? void 0 : oe.value,
          fields: () => y(te),
          astNode: d,
          extensionASTNodes: D,
        });
      }
    }
  }
}
const Xf = En([...Ia, ...Ma], (t) => t.name);
function Ja(t) {
  const e = la(js, t);
  return e?.reason;
}
function Zf(t) {
  const e = la(Nc, t);
  return e?.url;
}
function rl(t, e) {
  (t != null && t.kind === A.DOCUMENT) || ke(!1, 'Must provide valid Document AST.'),
    e?.assumeValid !== !0 && e?.assumeValidSDL !== !0 && Bv(t);
  const n = tl(
    {
      description: void 0,
      types: [],
      directives: [],
      extensions: Object.create(null),
      extensionASTNodes: [],
      assumeValid: !1,
    },
    t,
    e
  );
  if (n.astNode == null)
    for (const a of n.types)
      switch (a.name) {
        case 'Query':
          n.query = a;
          break;
        case 'Mutation':
          n.mutation = a;
          break;
        case 'Subscription':
          n.subscription = a;
          break;
      }
  const i = [...n.directives, ...Pn.filter((a) => n.directives.every((o) => o.name !== a.name))];
  return new Ui({ ...n, directives: i });
}
function pb(t, e) {
  const r = wa(t, {
    noLocation: e?.noLocation,
    allowLegacyFragmentVariables: e?.allowLegacyFragmentVariables,
  });
  return rl(r, { assumeValidSDL: e?.assumeValidSDL, assumeValid: e?.assumeValid });
}
function mb(t) {
  const e = t.toConfig(),
    r = Nn(Io(e.types), (T) => T.name, x);
  return new Ui({
    ...e,
    types: Object.values(r),
    directives: Io(e.directives).map(o),
    query: a(e.query),
    mutation: a(e.mutation),
    subscription: a(e.subscription),
  });
  function n(T) {
    return Nt(T) ? new Gt(n(T.ofType)) : Ee(T) ? new $e(n(T.ofType)) : i(T);
  }
  function i(T) {
    return r[T.name];
  }
  function a(T) {
    return T && i(T);
  }
  function o(T) {
    const I = T.toConfig();
    return new Yr({ ...I, locations: nl(I.locations, (M) => M), args: c(I.args) });
  }
  function c(T) {
    return Ha(T, (I) => ({ ...I, type: n(I.type) }));
  }
  function h(T) {
    return Ha(T, (I) => ({ ...I, type: n(I.type), args: I.args && c(I.args) }));
  }
  function m(T) {
    return Ha(T, (I) => ({ ...I, type: n(I.type) }));
  }
  function w(T) {
    return Io(T).map(i);
  }
  function x(T) {
    if (pr(T) || Zn(T)) return T;
    if (Ue(T)) {
      const I = T.toConfig();
      return new Er({ ...I, interfaces: () => w(I.interfaces), fields: () => h(I.fields) });
    }
    if (Je(T)) {
      const I = T.toConfig();
      return new _i({ ...I, interfaces: () => w(I.interfaces), fields: () => h(I.fields) });
    }
    if (Ft(T)) {
      const I = T.toConfig();
      return new Ti({ ...I, types: () => w(I.types) });
    }
    if (kt(T)) {
      const I = T.toConfig();
      return new Dn({ ...I, values: Ha(I.values, (M) => M) });
    }
    if (St(T)) {
      const I = T.toConfig();
      return new Ii({ ...I, fields: () => m(I.fields) });
    }
    Rt(!1, 'Unexpected type: ' + U(T));
  }
}
function Ha(t, e) {
  const r = Object.create(null);
  for (const n of Object.keys(t).sort(Ea)) r[n] = e(t[n]);
  return r;
}
function Io(t) {
  return nl(t, (e) => e.name);
}
function nl(t, e) {
  return t.slice().sort((r, n) => {
    const i = e(r),
      a = e(n);
    return Ea(i, a);
  });
}
function vb(t) {
  return il(t, (e) => !Sc(e), gb);
}
function bb(t) {
  return il(t, Sc, Zn);
}
function gb(t) {
  return !Bs(t) && !Zn(t);
}
function il(t, e, r) {
  const n = t.getDirectives().filter(e),
    i = Object.values(t.getTypeMap()).filter(r);
  return [yb(t), ...n.map((a) => Sb(a)), ...i.map((a) => al(a))].filter(Boolean).join(`

`);
}
function yb(t) {
  if (t.description == null && wb(t)) return;
  const e = [],
    r = t.getQueryType();
  r && e.push(`  query: ${r.name}`);
  const n = t.getMutationType();
  n && e.push(`  mutation: ${n.name}`);
  const i = t.getSubscriptionType();
  return (
    i && e.push(`  subscription: ${i.name}`),
    xr(t) +
      `schema {
${e.join(`
`)}
}`
  );
}
function wb(t) {
  const e = t.getQueryType();
  if (e && e.name !== 'Query') return !1;
  const r = t.getMutationType();
  if (r && r.name !== 'Mutation') return !1;
  const n = t.getSubscriptionType();
  return !(n && n.name !== 'Subscription');
}
function al(t) {
  if (pr(t)) return Eb(t);
  if (Ue(t)) return xb(t);
  if (Je(t)) return _b(t);
  if (Ft(t)) return Tb(t);
  if (kt(t)) return Ib(t);
  if (St(t)) return Nb(t);
  Rt(!1, 'Unexpected type: ' + U(t));
}
function Eb(t) {
  return xr(t) + `scalar ${t.name}` + Mb(t);
}
function sl(t) {
  const e = t.getInterfaces();
  return e.length ? ' implements ' + e.map((r) => r.name).join(' & ') : '';
}
function xb(t) {
  return xr(t) + `type ${t.name}` + sl(t) + ol(t);
}
function _b(t) {
  return xr(t) + `interface ${t.name}` + sl(t) + ol(t);
}
function Tb(t) {
  const e = t.getTypes(),
    r = e.length ? ' = ' + e.join(' | ') : '';
  return xr(t) + 'union ' + t.name + r;
}
function Ib(t) {
  const e = t.getValues().map((r, n) => xr(r, '  ', !n) + '  ' + r.name + Xc(r.deprecationReason));
  return xr(t) + `enum ${t.name}` + Yc(e);
}
function Nb(t) {
  const e = Object.values(t.getFields()).map((r, n) => xr(r, '  ', !n) + '  ' + Zo(r));
  return xr(t) + `input ${t.name}` + Yc(e);
}
function ol(t) {
  const e = Object.values(t.getFields()).map(
    (r, n) =>
      xr(r, '  ', !n) +
      '  ' +
      r.name +
      cl(r.args, '  ') +
      ': ' +
      String(r.type) +
      Xc(r.deprecationReason)
  );
  return Yc(e);
}
function Yc(t) {
  return t.length !== 0
    ? ` {
` +
        t.join(`
`) +
        `
}`
    : '';
}
function cl(t, e = '') {
  return t.length === 0
    ? ''
    : t.every((r) => !r.description)
    ? '(' + t.map(Zo).join(', ') + ')'
    : `(
` +
      t.map((r, n) => xr(r, '  ' + e, !n) + '  ' + e + Zo(r)).join(`
`) +
      `
` +
      e +
      ')';
}
function Zo(t) {
  const e = Sn(t.defaultValue, t.type);
  let r = t.name + ': ' + String(t.type);
  return e && (r += ` = ${It(e)}`), r + Xc(t.deprecationReason);
}
function Sb(t) {
  return (
    xr(t) +
    'directive @' +
    t.name +
    cl(t.args) +
    (t.isRepeatable ? ' repeatable' : '') +
    ' on ' +
    t.locations.join(' | ')
  );
}
function Xc(t) {
  return t == null
    ? ''
    : t !== Ic
    ? ` @deprecated(reason: ${It({ kind: A.STRING, value: t })})`
    : ' @deprecated';
}
function Mb(t) {
  return t.specifiedByURL == null
    ? ''
    : ` @specifiedBy(url: ${It({ kind: A.STRING, value: t.specifiedByURL })})`;
}
function xr(t, e = '', r = !0) {
  const { description: n } = t;
  if (n == null) return '';
  const i = It({ kind: A.STRING, value: n, block: d1(n) });
  return (
    (e && !r
      ? `
` + e
      : e) +
    i.replace(
      /\n/g,
      `
` + e
    ) +
    `
`
  );
}
function Ab(t) {
  const e = [];
  for (const r of t) e.push(...r.definitions);
  return { kind: A.DOCUMENT, definitions: e };
}
function Ob(t) {
  const e = [],
    r = Object.create(null);
  for (const i of t.definitions)
    switch (i.kind) {
      case A.OPERATION_DEFINITION:
        e.push(i);
        break;
      case A.FRAGMENT_DEFINITION:
        r[i.name.value] = eu(i.selectionSet);
        break;
    }
  const n = Object.create(null);
  for (const i of e) {
    const a = new Set();
    for (const c of eu(i.selectionSet)) fl(a, r, c);
    const o = i.name ? i.name.value : '';
    n[o] = {
      kind: A.DOCUMENT,
      definitions: t.definitions.filter(
        (c) => c === i || (c.kind === A.FRAGMENT_DEFINITION && a.has(c.name.value))
      ),
    };
  }
  return n;
}
function fl(t, e, r) {
  if (!t.has(r)) {
    t.add(r);
    const n = e[r];
    if (n !== void 0) for (const i of n) fl(t, e, i);
  }
}
function eu(t) {
  const e = [];
  return (
    Fi(t, {
      FragmentSpread(r) {
        e.push(r.name.value);
      },
    }),
    e
  );
}
function Rb(t) {
  const e = Ud(t) ? t : new Fs(t),
    r = e.body,
    n = new vc(e);
  let i = '',
    a = !1;
  for (; n.advance().kind !== L.EOF; ) {
    const o = n.token,
      c = o.kind,
      h = !Cd(o.kind);
    a && (h || o.kind === L.SPREAD) && (i += ' ');
    const m = r.slice(o.start, o.end);
    c === L.BLOCK_STRING ? (i += kd(o.value, { minimize: !0 })) : (i += m), (a = h);
  }
  return i;
}
function Db(t) {
  const e = ul(t);
  if (e) throw e;
  return t;
}
function ul(t) {
  if ((typeof t == 'string' || ke(!1, 'Expected name to be a string.'), t.startsWith('__')))
    return new P(
      `Name "${t}" must not begin with "__", which is reserved by GraphQL introspection.`
    );
  try {
    hr(t);
  } catch (e) {
    return e;
  }
}
var Mt;
(function (t) {
  (t.TYPE_REMOVED = 'TYPE_REMOVED'),
    (t.TYPE_CHANGED_KIND = 'TYPE_CHANGED_KIND'),
    (t.TYPE_REMOVED_FROM_UNION = 'TYPE_REMOVED_FROM_UNION'),
    (t.VALUE_REMOVED_FROM_ENUM = 'VALUE_REMOVED_FROM_ENUM'),
    (t.REQUIRED_INPUT_FIELD_ADDED = 'REQUIRED_INPUT_FIELD_ADDED'),
    (t.IMPLEMENTED_INTERFACE_REMOVED = 'IMPLEMENTED_INTERFACE_REMOVED'),
    (t.FIELD_REMOVED = 'FIELD_REMOVED'),
    (t.FIELD_CHANGED_KIND = 'FIELD_CHANGED_KIND'),
    (t.REQUIRED_ARG_ADDED = 'REQUIRED_ARG_ADDED'),
    (t.ARG_REMOVED = 'ARG_REMOVED'),
    (t.ARG_CHANGED_KIND = 'ARG_CHANGED_KIND'),
    (t.DIRECTIVE_REMOVED = 'DIRECTIVE_REMOVED'),
    (t.DIRECTIVE_ARG_REMOVED = 'DIRECTIVE_ARG_REMOVED'),
    (t.REQUIRED_DIRECTIVE_ARG_ADDED = 'REQUIRED_DIRECTIVE_ARG_ADDED'),
    (t.DIRECTIVE_REPEATABLE_REMOVED = 'DIRECTIVE_REPEATABLE_REMOVED'),
    (t.DIRECTIVE_LOCATION_REMOVED = 'DIRECTIVE_LOCATION_REMOVED');
})(Mt || (Mt = {}));
var $r;
(function (t) {
  (t.VALUE_ADDED_TO_ENUM = 'VALUE_ADDED_TO_ENUM'),
    (t.TYPE_ADDED_TO_UNION = 'TYPE_ADDED_TO_UNION'),
    (t.OPTIONAL_INPUT_FIELD_ADDED = 'OPTIONAL_INPUT_FIELD_ADDED'),
    (t.OPTIONAL_ARG_ADDED = 'OPTIONAL_ARG_ADDED'),
    (t.IMPLEMENTED_INTERFACE_ADDED = 'IMPLEMENTED_INTERFACE_ADDED'),
    (t.ARG_DEFAULT_VALUE_CHANGE = 'ARG_DEFAULT_VALUE_CHANGE');
})($r || ($r = {}));
function $b(t, e) {
  return dl(t, e).filter((r) => r.type in Mt);
}
function kb(t, e) {
  return dl(t, e).filter((r) => r.type in $r);
}
function dl(t, e) {
  return [...Pb(t, e), ...Cb(t, e)];
}
function Cb(t, e) {
  const r = [],
    n = xn(t.getDirectives(), e.getDirectives());
  for (const i of n.removed)
    r.push({ type: Mt.DIRECTIVE_REMOVED, description: `${i.name} was removed.` });
  for (const [i, a] of n.persisted) {
    const o = xn(i.args, a.args);
    for (const c of o.added)
      Cn(c) &&
        r.push({
          type: Mt.REQUIRED_DIRECTIVE_ARG_ADDED,
          description: `A required arg ${c.name} on directive ${i.name} was added.`,
        });
    for (const c of o.removed)
      r.push({
        type: Mt.DIRECTIVE_ARG_REMOVED,
        description: `${c.name} was removed from ${i.name}.`,
      });
    i.isRepeatable &&
      !a.isRepeatable &&
      r.push({
        type: Mt.DIRECTIVE_REPEATABLE_REMOVED,
        description: `Repeatable flag was removed from ${i.name}.`,
      });
    for (const c of i.locations)
      a.locations.includes(c) ||
        r.push({
          type: Mt.DIRECTIVE_LOCATION_REMOVED,
          description: `${c} was removed from ${i.name}.`,
        });
  }
  return r;
}
function Pb(t, e) {
  const r = [],
    n = xn(Object.values(t.getTypeMap()), Object.values(e.getTypeMap()));
  for (const i of n.removed)
    r.push({
      type: Mt.TYPE_REMOVED,
      description: Bs(i)
        ? `Standard scalar ${i.name} was removed because it is not referenced anymore.`
        : `${i.name} was removed.`,
    });
  for (const [i, a] of n.persisted)
    kt(i) && kt(a)
      ? r.push(...Ub(i, a))
      : Ft(i) && Ft(a)
      ? r.push(...Fb(i, a))
      : St(i) && St(a)
      ? r.push(...Lb(i, a))
      : Ue(i) && Ue(a)
      ? r.push(...ru(i, a), ...tu(i, a))
      : Je(i) && Je(a)
      ? r.push(...ru(i, a), ...tu(i, a))
      : i.constructor !== a.constructor &&
        r.push({
          type: Mt.TYPE_CHANGED_KIND,
          description: `${i.name} changed from ${nu(i)} to ${nu(a)}.`,
        });
  return r;
}
function Lb(t, e) {
  const r = [],
    n = xn(Object.values(t.getFields()), Object.values(e.getFields()));
  for (const i of n.added)
    qs(i)
      ? r.push({
          type: Mt.REQUIRED_INPUT_FIELD_ADDED,
          description: `A required field ${i.name} on input type ${t.name} was added.`,
        })
      : r.push({
          type: $r.OPTIONAL_INPUT_FIELD_ADDED,
          description: `An optional field ${i.name} on input type ${t.name} was added.`,
        });
  for (const i of n.removed)
    r.push({ type: Mt.FIELD_REMOVED, description: `${t.name}.${i.name} was removed.` });
  for (const [i, a] of n.persisted)
    ia(i.type, a.type) ||
      r.push({
        type: Mt.FIELD_CHANGED_KIND,
        description: `${t.name}.${i.name} changed type from ${String(i.type)} to ${String(
          a.type
        )}.`,
      });
  return r;
}
function Fb(t, e) {
  const r = [],
    n = xn(t.getTypes(), e.getTypes());
  for (const i of n.added)
    r.push({
      type: $r.TYPE_ADDED_TO_UNION,
      description: `${i.name} was added to union type ${t.name}.`,
    });
  for (const i of n.removed)
    r.push({
      type: Mt.TYPE_REMOVED_FROM_UNION,
      description: `${i.name} was removed from union type ${t.name}.`,
    });
  return r;
}
function Ub(t, e) {
  const r = [],
    n = xn(t.getValues(), e.getValues());
  for (const i of n.added)
    r.push({
      type: $r.VALUE_ADDED_TO_ENUM,
      description: `${i.name} was added to enum type ${t.name}.`,
    });
  for (const i of n.removed)
    r.push({
      type: Mt.VALUE_REMOVED_FROM_ENUM,
      description: `${i.name} was removed from enum type ${t.name}.`,
    });
  return r;
}
function tu(t, e) {
  const r = [],
    n = xn(t.getInterfaces(), e.getInterfaces());
  for (const i of n.added)
    r.push({
      type: $r.IMPLEMENTED_INTERFACE_ADDED,
      description: `${i.name} added to interfaces implemented by ${t.name}.`,
    });
  for (const i of n.removed)
    r.push({
      type: Mt.IMPLEMENTED_INTERFACE_REMOVED,
      description: `${t.name} no longer implements interface ${i.name}.`,
    });
  return r;
}
function ru(t, e) {
  const r = [],
    n = xn(Object.values(t.getFields()), Object.values(e.getFields()));
  for (const i of n.removed)
    r.push({ type: Mt.FIELD_REMOVED, description: `${t.name}.${i.name} was removed.` });
  for (const [i, a] of n.persisted)
    r.push(...qb(t, i, a)),
      ea(i.type, a.type) ||
        r.push({
          type: Mt.FIELD_CHANGED_KIND,
          description: `${t.name}.${i.name} changed type from ${String(i.type)} to ${String(
            a.type
          )}.`,
        });
  return r;
}
function qb(t, e, r) {
  const n = [],
    i = xn(e.args, r.args);
  for (const a of i.removed)
    n.push({ type: Mt.ARG_REMOVED, description: `${t.name}.${e.name} arg ${a.name} was removed.` });
  for (const [a, o] of i.persisted)
    if (!ia(a.type, o.type))
      n.push({
        type: Mt.ARG_CHANGED_KIND,
        description: `${t.name}.${e.name} arg ${a.name} has changed type from ${String(
          a.type
        )} to ${String(o.type)}.`,
      });
    else if (a.defaultValue !== void 0)
      if (o.defaultValue === void 0)
        n.push({
          type: $r.ARG_DEFAULT_VALUE_CHANGE,
          description: `${t.name}.${e.name} arg ${a.name} defaultValue was removed.`,
        });
      else {
        const h = iu(a.defaultValue, a.type),
          m = iu(o.defaultValue, o.type);
        h !== m &&
          n.push({
            type: $r.ARG_DEFAULT_VALUE_CHANGE,
            description: `${t.name}.${e.name} arg ${a.name} has changed defaultValue from ${h} to ${m}.`,
          });
      }
  for (const a of i.added)
    Cn(a)
      ? n.push({
          type: Mt.REQUIRED_ARG_ADDED,
          description: `A required arg ${a.name} on ${t.name}.${e.name} was added.`,
        })
      : n.push({
          type: $r.OPTIONAL_ARG_ADDED,
          description: `An optional arg ${a.name} on ${t.name}.${e.name} was added.`,
        });
  return n;
}
function ea(t, e) {
  return Nt(t)
    ? (Nt(e) && ea(t.ofType, e.ofType)) || (Ee(e) && ea(t, e.ofType))
    : Ee(t)
    ? Ee(e) && ea(t.ofType, e.ofType)
    : (Ta(e) && t.name === e.name) || (Ee(e) && ea(t, e.ofType));
}
function ia(t, e) {
  return Nt(t)
    ? Nt(e) && ia(t.ofType, e.ofType)
    : Ee(t)
    ? (Ee(e) && ia(t.ofType, e.ofType)) || (!Ee(e) && ia(t.ofType, e))
    : Ta(e) && t.name === e.name;
}
function nu(t) {
  if (pr(t)) return 'a Scalar type';
  if (Ue(t)) return 'an Object type';
  if (Je(t)) return 'an Interface type';
  if (Ft(t)) return 'a Union type';
  if (kt(t)) return 'an Enum type';
  if (St(t)) return 'an Input type';
  Rt(!1, 'Unexpected type: ' + U(t));
}
function iu(t, e) {
  const r = Sn(t, e);
  return r != null || Rt(!1), It(Js(r));
}
function xn(t, e) {
  const r = [],
    n = [],
    i = [],
    a = En(t, ({ name: c }) => c),
    o = En(e, ({ name: c }) => c);
  for (const c of t) {
    const h = o[c.name];
    h === void 0 ? n.push(c) : i.push([c, h]);
  }
  for (const c of e) a[c.name] === void 0 && r.push(c);
  return { added: r, persisted: i, removed: n };
}
const Bb = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      BREAK: fi,
      get BreakingChangeType() {
        return Mt;
      },
      DEFAULT_DEPRECATION_REASON: Ic,
      get DangerousChangeType() {
        return $r;
      },
      get DirectiveLocation() {
        return ce;
      },
      ExecutableDefinitionsRule: t0,
      FieldsOnCorrectTypeRule: r0,
      FragmentsOnCompositeTypesRule: n0,
      GRAPHQL_MAX_INT: is,
      GRAPHQL_MIN_INT: as,
      GraphQLBoolean: fr,
      GraphQLDeprecatedDirective: js,
      GraphQLDirective: Yr,
      GraphQLEnumType: Dn,
      GraphQLError: P,
      GraphQLFloat: Xd,
      GraphQLID: xc,
      GraphQLIncludeDirective: _c,
      GraphQLInputObjectType: Ii,
      GraphQLInt: Yd,
      GraphQLInterfaceType: _i,
      GraphQLList: Gt,
      GraphQLNonNull: $e,
      GraphQLObjectType: Er,
      GraphQLScalarType: Qr,
      GraphQLSchema: Ui,
      GraphQLSkipDirective: Tc,
      GraphQLSpecifiedByDirective: Nc,
      GraphQLString: At,
      GraphQLUnionType: Ti,
      get Kind() {
        return A;
      },
      KnownArgumentNamesRule: i0,
      KnownDirectivesRule: jc,
      KnownFragmentNamesRule: s0,
      KnownTypeNamesRule: zc,
      Lexer: vc,
      Location: Od,
      LoneAnonymousOperationRule: o0,
      LoneSchemaDefinitionRule: c0,
      NoDeprecatedCustomRule: ob,
      NoFragmentCyclesRule: f0,
      NoSchemaIntrospectionCustomRule: cb,
      NoUndefinedVariablesRule: u0,
      NoUnusedFragmentsRule: d0,
      NoUnusedVariablesRule: l0,
      get OperationTypeNode() {
        return Lt;
      },
      OverlappingFieldsCanBeMergedRule: p0,
      PossibleFragmentSpreadsRule: b0,
      PossibleTypeExtensionsRule: g0,
      ProvidedRequiredArgumentsRule: y0,
      ScalarLeafsRule: E0,
      SchemaMetaFieldDef: fa,
      SingleFieldSubscriptionsRule: N0,
      Source: Fs,
      Token: pc,
      get TokenKind() {
        return L;
      },
      TypeInfo: Fc,
      get TypeKind() {
        return Ye;
      },
      TypeMetaFieldDef: ua,
      TypeNameMetaFieldDef: da,
      UniqueArgumentDefinitionNamesRule: S0,
      UniqueArgumentNamesRule: Wc,
      UniqueDirectiveNamesRule: M0,
      UniqueDirectivesPerLocationRule: Kc,
      UniqueEnumValueNamesRule: A0,
      UniqueFieldDefinitionNamesRule: O0,
      UniqueFragmentNamesRule: R0,
      UniqueInputFieldNamesRule: Qc,
      UniqueOperationNamesRule: D0,
      UniqueOperationTypesRule: $0,
      UniqueTypeNamesRule: k0,
      UniqueVariableNamesRule: C0,
      ValidationContext: B0,
      ValuesOfCorrectTypeRule: P0,
      VariablesAreInputTypesRule: L0,
      VariablesInAllowedPositionRule: F0,
      __Directive: Ac,
      __DirectiveLocation: Oc,
      __EnumValue: Dc,
      __Field: Rc,
      __InputValue: Sa,
      __Schema: zs,
      __Type: wr,
      __TypeKind: $c,
      assertAbstractType: Q1,
      assertCompositeType: K1,
      assertDirective: rv,
      assertEnumType: V1,
      assertEnumValueName: Vd,
      assertInputObjectType: j1,
      assertInputType: J1,
      assertInterfaceType: zd,
      assertLeafType: W1,
      assertListType: z1,
      assertName: hr,
      assertNamedType: X1,
      assertNonNullType: G1,
      assertNullableType: Gd,
      assertObjectType: jd,
      assertOutputType: H1,
      assertScalarType: q1,
      assertSchema: kc,
      assertType: U1,
      assertUnionType: B1,
      assertValidName: Db,
      assertValidSchema: Pc,
      assertWrappingType: Y1,
      astFromValue: Sn,
      buildASTSchema: rl,
      buildClientSchema: lb,
      buildSchema: pb,
      coerceInputValue: _0,
      concatAST: Ab,
      createSourceEventStream: Z0,
      defaultFieldResolver: Xo,
      defaultTypeResolver: K0,
      doTypesOverlap: Ho,
      execute: Ws,
      executeSync: z0,
      extendSchema: hb,
      findBreakingChanges: $b,
      findDangerousChanges: kb,
      formatError: o1,
      getArgumentValues: Hs,
      getDirectiveValues: la,
      getEnterLeaveForKind: xi,
      getIntrospectionQuery: el,
      getLocation: ms,
      getNamedType: Xt,
      getNullableType: yc,
      getOperationAST: fb,
      getOperationRootType: ub,
      getVariableValues: T0,
      getVisitFn: P1,
      graphql: tb,
      graphqlSync: rb,
      introspectionFromSchema: db,
      introspectionTypes: Ma,
      isAbstractType: jr,
      isCompositeType: Kr,
      isConstValueNode: Wo,
      isDefinitionNode: pv,
      isDirective: Vs,
      isEnumType: kt,
      isEqualType: bs,
      isExecutableDefinitionNode: qc,
      isInputObjectType: St,
      isInputType: nr,
      isInterfaceType: Je,
      isIntrospectionType: Zn,
      isLeafType: Wr,
      isListType: Nt,
      isNamedType: Ta,
      isNonNullType: Ee,
      isNullableType: gc,
      isObjectType: Ue,
      isOutputType: An,
      isRequiredArgument: Cn,
      isRequiredInputField: qs,
      isScalarType: pr,
      isSchema: Zd,
      isSelectionNode: mv,
      isSpecifiedDirective: Sc,
      isSpecifiedScalarType: Bs,
      isType: xa,
      isTypeDefinitionNode: qi,
      isTypeExtensionNode: Gs,
      isTypeNode: vv,
      isTypeSubTypeOf: zn,
      isTypeSystemDefinitionNode: Bc,
      isTypeSystemExtensionNode: Vc,
      isUnionType: Ft,
      isValidNameError: ul,
      isValueNode: e0,
      isWrappingType: _a,
      lexicographicSortSchema: mb,
      locatedError: Si,
      parse: wa,
      parseConstValue: S1,
      parseType: M1,
      parseValue: qd,
      print: It,
      printError: s1,
      printIntrospectionSchema: bb,
      printLocation: Ad,
      printSchema: vb,
      printSourceLocation: hc,
      printType: al,
      resolveObjMapThunk: Ec,
      resolveReadonlyArrayThunk: wc,
      responsePathAsArray: cr,
      separateOperations: Ob,
      specifiedDirectives: Pn,
      specifiedRules: U0,
      specifiedScalarTypes: Ia,
      stripIgnoredCharacters: Rb,
      subscribe: ib,
      syntaxError: Pt,
      typeFromAST: ar,
      validate: V0,
      validateSchema: Cc,
      valueFromAST: Ur,
      valueFromASTUntyped: vs,
      version: r1,
      versionInfo: n1,
      visit: Fi,
      visitInParallel: bc,
      visitWithTypeInfo: Uc,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
var ss = new Map(),
  ec = new Map(),
  ll = !0,
  Ts = !1;
function hl(t) {
  return t.replace(/[\s,]+/g, ' ').trim();
}
function Vb(t) {
  return hl(t.source.body.substring(t.start, t.end));
}
function jb(t) {
  var e = new Set(),
    r = [];
  return (
    t.definitions.forEach(function (n) {
      if (n.kind === 'FragmentDefinition') {
        var i = n.name.value,
          a = Vb(n.loc),
          o = ec.get(i);
        o && !o.has(a)
          ? ll &&
            console.warn(
              'Warning: fragment with name ' +
                i +
                ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`
            )
          : o || ec.set(i, (o = new Set())),
          o.add(a),
          e.has(a) || (e.add(a), r.push(n));
      } else r.push(n);
    }),
    ps(ps({}, t), { definitions: r })
  );
}
function zb(t) {
  var e = new Set(t.definitions);
  e.forEach(function (n) {
    n.loc && delete n.loc,
      Object.keys(n).forEach(function (i) {
        var a = n[i];
        a && typeof a == 'object' && e.add(a);
      });
  });
  var r = t.loc;
  return r && (delete r.startToken, delete r.endToken), t;
}
function Gb(t) {
  var e = hl(t);
  if (!ss.has(e)) {
    var r = wa(t, { experimentalFragmentVariables: Ts, allowLegacyFragmentVariables: Ts });
    if (!r || r.kind !== 'Document') throw new Error('Not a valid GraphQL document.');
    ss.set(e, zb(jb(r)));
  }
  return ss.get(e);
}
function Mi(t) {
  for (var e = [], r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
  typeof t == 'string' && (t = [t]);
  var n = t[0];
  return (
    e.forEach(function (i, a) {
      i && i.kind === 'Document' ? (n += i.loc.source.body) : (n += i), (n += t[a + 1]);
    }),
    Gb(n)
  );
}
function Jb() {
  ss.clear(), ec.clear();
}
function Hb() {
  ll = !1;
}
function Wb() {
  Ts = !0;
}
function Kb() {
  Ts = !1;
}
var Wi = {
  gql: Mi,
  resetCaches: Jb,
  disableFragmentWarnings: Hb,
  enableExperimentalFragmentVariables: Wb,
  disableExperimentalFragmentVariables: Kb,
};
(function (t) {
  (t.gql = Wi.gql),
    (t.resetCaches = Wi.resetCaches),
    (t.disableFragmentWarnings = Wi.disableFragmentWarnings),
    (t.enableExperimentalFragmentVariables = Wi.enableExperimentalFragmentVariables),
    (t.disableExperimentalFragmentVariables = Wi.disableExperimentalFragmentVariables);
})(Mi || (Mi = {}));
Mi.default = Mi;
const Fe = Mi;
var pl = (t, e, r) => {
    if (!e.has(t)) throw TypeError('Cannot ' + r);
  },
  Wa = (t, e, r) => (pl(t, e, 'read from private field'), r ? r.call(t) : e.get(t)),
  Qb = (t, e, r) => {
    if (e.has(t)) throw TypeError('Cannot add the same private member more than once');
    e instanceof WeakSet ? e.add(t) : e.set(t, r);
  },
  Yb = (t, e, r, n) => (pl(t, e, 'write to private field'), n ? n.call(t, r) : e.set(t, r), r),
  Vn,
  ft = class extends De {
    constructor(e) {
      let r = (8 - (e % 8)) % 8,
        n = e + r;
      super('ByteArray', `[u64; ${n / 4}]`, n),
        Qb(this, Vn, void 0),
        (this.length = e),
        Yb(this, Vn, r);
    }
    encode(e) {
      let r = [],
        n = Y(e);
      return r.push(n), Wa(this, Vn) && r.push(new Uint8Array(Wa(this, Vn))), de(r);
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = [ee(e.slice(i, i + this.length)), i + this.length];
      let a = n;
      return Wa(this, Vn) && ([n, i] = [null, i + Wa(this, Vn)]), [a, i];
    }
  };
Vn = new WeakMap();
var Ai = class extends ks {
    constructor() {
      super('TxPointer', { blockHeight: new ie('u32'), txIndex: new ie('u16') });
    }
  },
  Is = class extends ks {
    constructor() {
      super('UtxoId', { transactionId: new W(), outputIndex: new ie('u8') });
    }
  },
  Ht = ((t) => (
    (t[(t.Coin = 0)] = 'Coin'),
    (t[(t.Contract = 1)] = 'Contract'),
    (t[(t.Message = 2)] = 'Message'),
    t
  ))(Ht || {}),
  au = class extends De {
    constructor() {
      super('InputCoin', 'struct InputCoin', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new Is().encode(e.utxoID)),
        r.push(new W().encode(e.owner)),
        r.push(new V().encode(e.amount)),
        r.push(new W().encode(e.assetId)),
        r.push(new Ai().encode(e.txPointer)),
        r.push(new ie('u8').encode(e.witnessIndex)),
        r.push(new ie('u32').encode(e.maturity)),
        r.push(new ie('u16').encode(e.predicateLength)),
        r.push(new ie('u16').encode(e.predicateDataLength)),
        r.push(new ft(e.predicateLength).encode(e.predicate)),
        r.push(new ft(e.predicateDataLength).encode(e.predicateData)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new Is().decode(e, i);
      let a = n;
      [n, i] = new W().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      [n, i] = new W().decode(e, i);
      let h = n;
      [n, i] = new Ai().decode(e, i);
      let m = n;
      [n, i] = new ie('u8').decode(e, i);
      let w = Number(n);
      [n, i] = new ie('u32').decode(e, i);
      let x = n;
      [n, i] = new ie('u16').decode(e, i);
      let T = n;
      [n, i] = new ie('u16').decode(e, i);
      let I = n;
      [n, i] = new ft(T).decode(e, i);
      let M = n;
      return (
        ([n, i] = new ft(I).decode(e, i)),
        [
          {
            type: 0,
            utxoID: a,
            owner: o,
            amount: c,
            assetId: h,
            txPointer: m,
            witnessIndex: w,
            maturity: x,
            predicateLength: T,
            predicateDataLength: I,
            predicate: M,
            predicateData: n,
          },
          i,
        ]
      );
    }
  },
  su = class extends De {
    constructor() {
      super('InputContract', 'struct InputContract', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new Is().encode(e.utxoID)),
        r.push(new W().encode(e.balanceRoot)),
        r.push(new W().encode(e.stateRoot)),
        r.push(new Ai().encode(e.txPointer)),
        r.push(new W().encode(e.contractID)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new Is().decode(e, i);
      let a = n;
      [n, i] = new W().decode(e, i);
      let o = n;
      [n, i] = new W().decode(e, i);
      let c = n;
      [n, i] = new Ai().decode(e, i);
      let h = n;
      return (
        ([n, i] = new W().decode(e, i)),
        [{ type: 1, utxoID: a, balanceRoot: o, stateRoot: c, txPointer: h, contractID: n }, i]
      );
    }
  },
  pa = class extends De {
    constructor() {
      super('InputMessage', 'struct InputMessage', 0);
    }
    static getMessageId(e) {
      let r = [];
      return (
        r.push(new ft(32).encode(e.sender)),
        r.push(new ft(32).encode(e.recipient)),
        r.push(new V().encode(e.nonce)),
        r.push(new V().encode(e.amount)),
        r.push(new ft(e.dataLength).encode(e.data)),
        Zt(de(r))
      );
    }
    encode(e) {
      let r = [],
        n = new ft(e.dataLength).encode(e.data),
        i = pa.getMessageId(e);
      return (
        r.push(new ft(32).encode(i)),
        r.push(new ft(32).encode(e.sender)),
        r.push(new ft(32).encode(e.recipient)),
        r.push(new V().encode(e.amount)),
        r.push(new V().encode(e.nonce)),
        r.push(new ie('u8').encode(e.witnessIndex)),
        r.push(new ie('u16').encode(n.length)),
        r.push(new ie('u16').encode(e.predicateLength)),
        r.push(new ie('u16').encode(e.predicateDataLength)),
        r.push(n),
        r.push(new ft(e.predicateLength).encode(e.predicate)),
        r.push(new ft(e.predicateDataLength).encode(e.predicateData)),
        de(r)
      );
    }
    static decodeData(e) {
      let r = Y(e),
        n = r.length,
        [i] = new ft(n).decode(r, 0);
      return Y(i);
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new W().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      [n, i] = new V().decode(e, i);
      let h = n;
      [n, i] = new ie('u8').decode(e, i);
      let m = Number(n);
      [n, i] = new ie('u16').decode(e, i);
      let w = n;
      [n, i] = new ie('u16').decode(e, i);
      let x = n;
      [n, i] = new ie('u16').decode(e, i);
      let T = n;
      [n, i] = new ft(w).decode(e, i);
      let I = n;
      [n, i] = new ft(x).decode(e, i);
      let M = n;
      return (
        ([n, i] = new ft(T).decode(e, i)),
        [
          {
            type: 2,
            sender: a,
            recipient: o,
            amount: c,
            witnessIndex: m,
            nonce: h,
            data: I,
            dataLength: w,
            predicateLength: x,
            predicateDataLength: T,
            predicate: M,
            predicateData: n,
          },
          i,
        ]
      );
    }
  },
  Ns = class extends De {
    constructor() {
      super('Input', 'struct Input', 0);
    }
    encode(e) {
      let r = [];
      switch ((r.push(new ie('u8').encode(e.type)), e.type)) {
        case 0: {
          r.push(new au().encode(e));
          break;
        }
        case 1: {
          r.push(new su().encode(e));
          break;
        }
        case 2: {
          r.push(new pa().encode(e));
          break;
        }
        default:
          throw new Error('Invalid Input type');
      }
      return de(r);
    }
    decode(e, r) {
      let n,
        i = r;
      switch ((([n, i] = new ie('u8').decode(e, i)), n)) {
        case 0:
          return ([n, i] = new au().decode(e, i)), [n, i];
        case 1:
          return ([n, i] = new su().decode(e, i)), [n, i];
        case 2:
          return ([n, i] = new pa().decode(e, i)), [n, i];
        default:
          throw new Error('Invalid Input type');
      }
    }
  },
  Qe = ((t) => (
    (t[(t.Coin = 0)] = 'Coin'),
    (t[(t.Contract = 1)] = 'Contract'),
    (t[(t.Message = 2)] = 'Message'),
    (t[(t.Change = 3)] = 'Change'),
    (t[(t.Variable = 4)] = 'Variable'),
    (t[(t.ContractCreated = 5)] = 'ContractCreated'),
    t
  ))(Qe || {}),
  ou = class extends De {
    constructor() {
      super('OutputCoin', 'struct OutputCoin', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.to)),
        r.push(new V().encode(e.amount)),
        r.push(new W().encode(e.assetId)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      return ([n, i] = new W().decode(e, i)), [{ type: 0, to: a, amount: o, assetId: n }, i];
    }
  },
  cu = class extends De {
    constructor() {
      super('OutputContract', 'struct OutputContract', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new ie('u8').encode(e.inputIndex)),
        r.push(new W().encode(e.balanceRoot)),
        r.push(new W().encode(e.stateRoot)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new ie('u8').decode(e, i);
      let a = n;
      [n, i] = new W().decode(e, i);
      let o = n;
      return (
        ([n, i] = new W().decode(e, i)),
        [{ type: 1, inputIndex: a, balanceRoot: o, stateRoot: n }, i]
      );
    }
  },
  fu = class extends De {
    constructor() {
      super('OutputMessage', 'struct OutputMessage', 0);
    }
    encode(e) {
      let r = [];
      return r.push(new W().encode(e.recipient)), r.push(new V().encode(e.amount)), de(r);
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      return ([n, i] = new V().decode(e, i)), [{ type: 2, recipient: a, amount: n }, i];
    }
  },
  uu = class extends De {
    constructor() {
      super('OutputChange', 'struct OutputChange', 0);
    }
    encode(t) {
      let e = [];
      return (
        e.push(new W().encode(t.to)),
        e.push(new V().encode(t.amount)),
        e.push(new W().encode(t.assetId)),
        de(e)
      );
    }
    decode(t, e) {
      let r,
        n = e;
      [r, n] = new W().decode(t, n);
      let i = r;
      [r, n] = new V().decode(t, n);
      let a = r;
      return ([r, n] = new W().decode(t, n)), [{ type: 3, to: i, amount: a, assetId: r }, n];
    }
  },
  du = class extends De {
    constructor() {
      super('OutputVariable', 'struct OutputVariable', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.to)),
        r.push(new V().encode(e.amount)),
        r.push(new W().encode(e.assetId)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      return ([n, i] = new W().decode(e, i)), [{ type: 4, to: a, amount: o, assetId: n }, i];
    }
  },
  lu = class extends De {
    constructor() {
      super('OutputContractCreated', 'struct OutputContractCreated', 0);
    }
    encode(e) {
      let r = [];
      return r.push(new W().encode(e.contractId)), r.push(new W().encode(e.stateRoot)), de(r);
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      return ([n, i] = new W().decode(e, i)), [{ type: 5, contractId: a, stateRoot: n }, i];
    }
  },
  Oi = class extends De {
    constructor() {
      super('Output', ' struct Output', 0);
    }
    encode(e) {
      let r = [];
      switch ((r.push(new ie('u8').encode(e.type)), e.type)) {
        case 0: {
          r.push(new ou().encode(e));
          break;
        }
        case 1: {
          r.push(new cu().encode(e));
          break;
        }
        case 2: {
          r.push(new fu().encode(e));
          break;
        }
        case 3: {
          r.push(new uu().encode(e));
          break;
        }
        case 4: {
          r.push(new du().encode(e));
          break;
        }
        case 5: {
          r.push(new lu().encode(e));
          break;
        }
        default:
          throw new Error('Invalid Output type');
      }
      return de(r);
    }
    decode(e, r) {
      let n,
        i = r;
      switch ((([n, i] = new ie('u8').decode(e, i)), n)) {
        case 0:
          return ([n, i] = new ou().decode(e, i)), [n, i];
        case 1:
          return ([n, i] = new cu().decode(e, i)), [n, i];
        case 2:
          return ([n, i] = new fu().decode(e, i)), [n, i];
        case 3:
          return ([n, i] = new uu().decode(e, i)), [n, i];
        case 4:
          return ([n, i] = new du().decode(e, i)), [n, i];
        case 5:
          return ([n, i] = new lu().decode(e, i)), [n, i];
        default:
          throw new Error('Invalid Output type');
      }
    }
  },
  Wt = ((t) => (
    (t[(t.Call = 0)] = 'Call'),
    (t[(t.Return = 1)] = 'Return'),
    (t[(t.ReturnData = 2)] = 'ReturnData'),
    (t[(t.Panic = 3)] = 'Panic'),
    (t[(t.Revert = 4)] = 'Revert'),
    (t[(t.Log = 5)] = 'Log'),
    (t[(t.LogData = 6)] = 'LogData'),
    (t[(t.Transfer = 7)] = 'Transfer'),
    (t[(t.TransferOut = 8)] = 'TransferOut'),
    (t[(t.ScriptResult = 9)] = 'ScriptResult'),
    (t[(t.MessageOut = 10)] = 'MessageOut'),
    t
  ))(Wt || {}),
  hu = class extends De {
    constructor() {
      super('ReceiptCall', 'struct ReceiptCall', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.from)),
        r.push(new W().encode(e.to)),
        r.push(new V().encode(e.amount)),
        r.push(new W().encode(e.assetId)),
        r.push(new V().encode(e.gas)),
        r.push(new V().encode(e.param1)),
        r.push(new V().encode(e.param2)),
        r.push(new V().encode(e.pc)),
        r.push(new V().encode(e.is)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new W().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      [n, i] = new W().decode(e, i);
      let h = n;
      [n, i] = new V().decode(e, i);
      let m = n;
      [n, i] = new V().decode(e, i);
      let w = n;
      [n, i] = new V().decode(e, i);
      let x = n;
      [n, i] = new V().decode(e, i);
      let T = n;
      return (
        ([n, i] = new V().decode(e, i)),
        [
          {
            type: 0,
            from: a,
            to: o,
            amount: c,
            assetId: h,
            gas: m,
            param1: w,
            param2: x,
            pc: T,
            is: n,
          },
          i,
        ]
      );
    }
  },
  pu = class extends De {
    constructor() {
      super('ReceiptReturn', 'struct ReceiptReturn', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.id)),
        r.push(new V().encode(e.val)),
        r.push(new V().encode(e.pc)),
        r.push(new V().encode(e.is)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      return ([n, i] = new V().decode(e, i)), [{ type: 1, id: a, val: o, pc: c, is: n }, i];
    }
  },
  mu = class extends De {
    constructor() {
      super('ReceiptReturnData', 'struct ReceiptReturnData', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.id)),
        r.push(new V().encode(e.ptr)),
        r.push(new V().encode(e.len)),
        r.push(new W().encode(e.digest)),
        r.push(new V().encode(e.pc)),
        r.push(new V().encode(e.is)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      [n, i] = new W().decode(e, i);
      let h = n;
      [n, i] = new V().decode(e, i);
      let m = n;
      return (
        ([n, i] = new V().decode(e, i)),
        [{ type: 2, id: a, ptr: o, len: c, digest: h, pc: m, is: n }, i]
      );
    }
  },
  vu = class extends De {
    constructor() {
      super('ReceiptPanic', 'struct ReceiptPanic', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.id)),
        r.push(new V().encode(e.reason)),
        r.push(new V().encode(e.pc)),
        r.push(new V().encode(e.is)),
        r.push(new W().encode(e.contractId)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      [n, i] = new V().decode(e, i);
      let h = n;
      return (
        ([n, i] = new W().decode(e, i)),
        [{ type: 3, id: a, reason: o, pc: c, is: h, contractId: n }, i]
      );
    }
  },
  bu = class extends De {
    constructor() {
      super('ReceiptRevert', 'struct ReceiptRevert', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.id)),
        r.push(new V().encode(e.val)),
        r.push(new V().encode(e.pc)),
        r.push(new V().encode(e.is)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      return ([n, i] = new V().decode(e, i)), [{ type: 4, id: a, val: o, pc: c, is: n }, i];
    }
  },
  gu = class extends De {
    constructor() {
      super('ReceiptLog', 'struct ReceiptLog', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.id)),
        r.push(new V().encode(e.val0)),
        r.push(new V().encode(e.val1)),
        r.push(new V().encode(e.val2)),
        r.push(new V().encode(e.val3)),
        r.push(new V().encode(e.pc)),
        r.push(new V().encode(e.is)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      [n, i] = new V().decode(e, i);
      let h = n;
      [n, i] = new V().decode(e, i);
      let m = n;
      [n, i] = new V().decode(e, i);
      let w = n;
      return (
        ([n, i] = new V().decode(e, i)),
        [{ type: 5, id: a, val0: o, val1: c, val2: h, val3: m, pc: w, is: n }, i]
      );
    }
  },
  yu = class extends De {
    constructor() {
      super('ReceiptLogData', 'struct ReceiptLogData', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.id)),
        r.push(new V().encode(e.val0)),
        r.push(new V().encode(e.val1)),
        r.push(new V().encode(e.ptr)),
        r.push(new V().encode(e.len)),
        r.push(new W().encode(e.digest)),
        r.push(new V().encode(e.pc)),
        r.push(new V().encode(e.is)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      [n, i] = new V().decode(e, i);
      let h = n;
      [n, i] = new V().decode(e, i);
      let m = n;
      [n, i] = new W().decode(e, i);
      let w = n;
      [n, i] = new V().decode(e, i);
      let x = n;
      return (
        ([n, i] = new V().decode(e, i)),
        [{ type: 6, id: a, val0: o, val1: c, ptr: h, len: m, digest: w, pc: x, is: n }, i]
      );
    }
  },
  wu = class extends De {
    constructor() {
      super('ReceiptTransfer', 'struct ReceiptTransfer', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.from)),
        r.push(new W().encode(e.to)),
        r.push(new V().encode(e.amount)),
        r.push(new W().encode(e.assetId)),
        r.push(new V().encode(e.pc)),
        r.push(new V().encode(e.is)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new W().decode(e, i);
      let o = n;
      [n, i] = new V().decode(e, i);
      let c = n;
      [n, i] = new W().decode(e, i);
      let h = n;
      [n, i] = new V().decode(e, i);
      let m = n;
      return (
        ([n, i] = new V().decode(e, i)),
        [{ type: 7, from: a, to: o, amount: c, assetId: h, pc: m, is: n }, i]
      );
    }
  },
  Eu = class extends De {
    constructor() {
      super('ReceiptTransferOut', 'struct ReceiptTransferOut', 0);
    }
    encode(t) {
      let e = [];
      return (
        e.push(new W().encode(t.from)),
        e.push(new W().encode(t.to)),
        e.push(new V().encode(t.amount)),
        e.push(new W().encode(t.assetId)),
        e.push(new V().encode(t.pc)),
        e.push(new V().encode(t.is)),
        de(e)
      );
    }
    decode(t, e) {
      let r,
        n = e;
      [r, n] = new W().decode(t, n);
      let i = r;
      [r, n] = new W().decode(t, n);
      let a = r;
      [r, n] = new V().decode(t, n);
      let o = r;
      [r, n] = new W().decode(t, n);
      let c = r;
      [r, n] = new V().decode(t, n);
      let h = r;
      return (
        ([r, n] = new V().decode(t, n)),
        [{ type: 8, from: i, to: a, amount: o, assetId: c, pc: h, is: r }, n]
      );
    }
  },
  xu = class extends De {
    constructor() {
      super('ReceiptScriptResult', 'struct ReceiptScriptResult', 0);
    }
    encode(e) {
      let r = [];
      return r.push(new V().encode(e.result)), r.push(new V().encode(e.gasUsed)), de(r);
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new V().decode(e, i);
      let a = n;
      return ([n, i] = new V().decode(e, i)), [{ type: 9, result: a, gasUsed: n }, i];
    }
  },
  _u = class extends De {
    constructor() {
      super('ReceiptMessageOut', 'struct ReceiptMessageOut', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new W().encode(e.messageID)),
        r.push(new W().encode(e.sender)),
        r.push(new W().encode(e.recipient)),
        r.push(new V().encode(e.amount)),
        r.push(new W().encode(e.nonce)),
        r.push(new ie('u16').encode(e.data.length)),
        r.push(new W().encode(e.digest)),
        r.push(new ft(e.data.length).encode(e.data)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new W().decode(e, i);
      let a = n;
      [n, i] = new W().decode(e, i);
      let o = n;
      [n, i] = new W().decode(e, i);
      let c = n;
      [n, i] = new V().decode(e, i);
      let h = n;
      [n, i] = new W().decode(e, i);
      let m = n;
      [n, i] = new ie('u16').decode(e, i);
      let w = n;
      [n, i] = new W().decode(e, i);
      let x = n;
      [n, i] = new ft(w).decode(e, i);
      let T = Y(n);
      return [
        {
          type: 10,
          messageID: a,
          sender: o,
          recipient: c,
          amount: h,
          nonce: m,
          digest: x,
          data: T,
        },
        i,
      ];
    }
  },
  ml = class extends De {
    constructor() {
      super('Receipt', 'struct Receipt', 0);
    }
    encode(e) {
      let r = [];
      switch ((r.push(new ie('u8').encode(e.type)), e.type)) {
        case 0: {
          r.push(new hu().encode(e));
          break;
        }
        case 1: {
          r.push(new pu().encode(e));
          break;
        }
        case 2: {
          r.push(new mu().encode(e));
          break;
        }
        case 3: {
          r.push(new vu().encode(e));
          break;
        }
        case 4: {
          r.push(new bu().encode(e));
          break;
        }
        case 5: {
          r.push(new gu().encode(e));
          break;
        }
        case 6: {
          r.push(new yu().encode(e));
          break;
        }
        case 7: {
          r.push(new wu().encode(e));
          break;
        }
        case 8: {
          r.push(new Eu().encode(e));
          break;
        }
        case 9: {
          r.push(new xu().encode(e));
          break;
        }
        case 10: {
          r.push(new _u().encode(e));
          break;
        }
        default:
          throw new Error('Invalid Receipt type');
      }
      return de(r);
    }
    decode(e, r) {
      let n,
        i = r;
      switch ((([n, i] = new ie('u8').decode(e, i)), n)) {
        case 0:
          return ([n, i] = new hu().decode(e, i)), [n, i];
        case 1:
          return ([n, i] = new pu().decode(e, i)), [n, i];
        case 2:
          return ([n, i] = new mu().decode(e, i)), [n, i];
        case 3:
          return ([n, i] = new vu().decode(e, i)), [n, i];
        case 4:
          return ([n, i] = new bu().decode(e, i)), [n, i];
        case 5:
          return ([n, i] = new gu().decode(e, i)), [n, i];
        case 6:
          return ([n, i] = new yu().decode(e, i)), [n, i];
        case 7:
          return ([n, i] = new wu().decode(e, i)), [n, i];
        case 8:
          return ([n, i] = new Eu().decode(e, i)), [n, i];
        case 9:
          return ([n, i] = new xu().decode(e, i)), [n, i];
        case 10:
          return ([n, i] = new _u().decode(e, i)), [n, i];
        default:
          throw new Error('Invalid Receipt type');
      }
    }
  },
  Tu = class extends ks {
    constructor() {
      super('StorageSlot', { key: new W(), value: new W() });
    }
  },
  Ss = class extends De {
    constructor() {
      super('Witness', 'unknown', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new ie('u32').encode(e.dataLength)),
        r.push(new ft(e.dataLength).encode(e.data)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new ie('u32').decode(e, i);
      let a = n;
      return ([n, i] = new ft(a).decode(e, i)), [{ dataLength: a, data: n }, i];
    }
  },
  _n = ((t) => (
    (t[(t.Script = 0)] = 'Script'), (t[(t.Create = 1)] = 'Create'), (t[(t.Mint = 2)] = 'Mint'), t
  ))(_n || {}),
  Iu = class extends De {
    constructor() {
      super('TransactionScript', 'struct TransactionScript', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new V().encode(e.gasPrice)),
        r.push(new V().encode(e.gasLimit)),
        r.push(new ie('u32').encode(e.maturity)),
        r.push(new ie('u16').encode(e.scriptLength)),
        r.push(new ie('u16').encode(e.scriptDataLength)),
        r.push(new ie('u8').encode(e.inputsCount)),
        r.push(new ie('u8').encode(e.outputsCount)),
        r.push(new ie('u8').encode(e.witnessesCount)),
        r.push(new W().encode(e.receiptsRoot)),
        r.push(new ft(e.scriptLength).encode(e.script)),
        r.push(new ft(e.scriptDataLength).encode(e.scriptData)),
        r.push(new zt(new Ns(), e.inputsCount).encode(e.inputs)),
        r.push(new zt(new Oi(), e.outputsCount).encode(e.outputs)),
        r.push(new zt(new Ss(), e.witnessesCount).encode(e.witnesses)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new V().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      [n, i] = new ie('u32').decode(e, i);
      let c = n;
      [n, i] = new ie('u16').decode(e, i);
      let h = n;
      [n, i] = new ie('u16').decode(e, i);
      let m = n;
      [n, i] = new ie('u8').decode(e, i);
      let w = n;
      [n, i] = new ie('u8').decode(e, i);
      let x = n;
      [n, i] = new ie('u8').decode(e, i);
      let T = n;
      [n, i] = new W().decode(e, i);
      let I = n;
      [n, i] = new ft(h).decode(e, i);
      let M = n;
      [n, i] = new ft(m).decode(e, i);
      let k = n;
      [n, i] = new zt(new Ns(), w).decode(e, i);
      let F = n;
      [n, i] = new zt(new Oi(), x).decode(e, i);
      let j = n;
      return (
        ([n, i] = new zt(new Ss(), T).decode(e, i)),
        [
          {
            type: 0,
            gasPrice: a,
            gasLimit: o,
            maturity: c,
            scriptLength: h,
            scriptDataLength: m,
            inputsCount: w,
            outputsCount: x,
            witnessesCount: T,
            receiptsRoot: I,
            script: M,
            scriptData: k,
            inputs: F,
            outputs: j,
            witnesses: n,
          },
          i,
        ]
      );
    }
  },
  Nu = class extends De {
    constructor() {
      super('TransactionCreate', 'struct TransactionCreate', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new V().encode(e.gasPrice)),
        r.push(new V().encode(e.gasLimit)),
        r.push(new ie('u32').encode(e.maturity)),
        r.push(new ie('u16').encode(e.bytecodeLength)),
        r.push(new ie('u8').encode(e.bytecodeWitnessIndex)),
        r.push(new ie('u16').encode(e.storageSlotsCount)),
        r.push(new ie('u8').encode(e.inputsCount)),
        r.push(new ie('u8').encode(e.outputsCount)),
        r.push(new ie('u8').encode(e.witnessesCount)),
        r.push(new W().encode(e.salt)),
        r.push(new zt(new Tu(), e.storageSlotsCount).encode(e.storageSlots)),
        r.push(new zt(new Ns(), e.inputsCount).encode(e.inputs)),
        r.push(new zt(new Oi(), e.outputsCount).encode(e.outputs)),
        r.push(new zt(new Ss(), e.witnessesCount).encode(e.witnesses)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new V().decode(e, i);
      let a = n;
      [n, i] = new V().decode(e, i);
      let o = n;
      [n, i] = new ie('u32').decode(e, i);
      let c = n;
      [n, i] = new ie('u16').decode(e, i);
      let h = n;
      [n, i] = new ie('u8').decode(e, i);
      let m = n;
      [n, i] = new ie('u16').decode(e, i);
      let w = n;
      [n, i] = new ie('u8').decode(e, i);
      let x = n;
      [n, i] = new ie('u8').decode(e, i);
      let T = n;
      [n, i] = new ie('u8').decode(e, i);
      let I = n;
      [n, i] = new W().decode(e, i);
      let M = n;
      [n, i] = new zt(new Tu(), w).decode(e, i);
      let k = n;
      [n, i] = new zt(new Ns(), x).decode(e, i);
      let F = n;
      [n, i] = new zt(new Oi(), T).decode(e, i);
      let j = n;
      return (
        ([n, i] = new zt(new Ss(), I).decode(e, i)),
        [
          {
            type: 1,
            gasPrice: a,
            gasLimit: o,
            maturity: c,
            bytecodeLength: h,
            bytecodeWitnessIndex: m,
            storageSlotsCount: w,
            inputsCount: x,
            outputsCount: T,
            witnessesCount: I,
            salt: M,
            storageSlots: k,
            inputs: F,
            outputs: j,
            witnesses: n,
          },
          i,
        ]
      );
    }
  },
  Su = class extends De {
    constructor() {
      super('TransactionMint', 'struct TransactionMint', 0);
    }
    encode(e) {
      let r = [];
      return (
        r.push(new Ai().encode(e.txPointer)),
        r.push(new ie('u8').encode(e.outputsCount)),
        r.push(new zt(new Oi(), e.outputsCount).encode(e.outputs)),
        de(r)
      );
    }
    decode(e, r) {
      let n,
        i = r;
      [n, i] = new Ai().decode(e, i);
      let a = n;
      [n, i] = new ie('u8').decode(e, i);
      let o = n;
      return (
        ([n, i] = new zt(new Oi(), o).decode(e, i)),
        [{ type: 2, outputsCount: o, outputs: n, txPointer: a }, i]
      );
    }
  },
  ma = class extends De {
    constructor() {
      super('Transaction', 'struct Transaction', 0);
    }
    encode(e) {
      let r = [];
      switch ((r.push(new ie('u8').encode(e.type)), e.type)) {
        case 0: {
          r.push(new Iu().encode(e));
          break;
        }
        case 1: {
          r.push(new Nu().encode(e));
          break;
        }
        case 2: {
          r.push(new Su().encode(e));
          break;
        }
        default:
          throw new Error('Invalid Transaction type');
      }
      return de(r);
    }
    decode(e, r) {
      let n,
        i = r;
      switch ((([n, i] = new ie('u8').decode(e, i)), n)) {
        case 0:
          return ([n, i] = new Iu().decode(e, i)), [n, i];
        case 1:
          return ([n, i] = new Nu().decode(e, i)), [n, i];
        case 2:
          return ([n, i] = new Su().decode(e, i)), [n, i];
        default:
          throw new Error('Invalid Transaction type');
      }
    }
  },
  aa = G(1e8),
  vl = G(1e6),
  $5 = G(4),
  Xb = '0xffffffffffff0001',
  bl = {},
  va = {},
  Zb = {
    get exports() {
      return va;
    },
    set exports(t) {
      va = t;
    },
  };
(function (t, e) {
  var r = typeof self < 'u' ? self : se,
    n = (function () {
      function a() {
        (this.fetch = !1), (this.DOMException = r.DOMException);
      }
      return (a.prototype = r), new a();
    })();
  (function (a) {
    (function (o) {
      var c = {
        searchParams: 'URLSearchParams' in a,
        iterable: 'Symbol' in a && 'iterator' in Symbol,
        blob:
          'FileReader' in a &&
          'Blob' in a &&
          (function () {
            try {
              return new Blob(), !0;
            } catch {
              return !1;
            }
          })(),
        formData: 'FormData' in a,
        arrayBuffer: 'ArrayBuffer' in a,
      };
      function h(s) {
        return s && DataView.prototype.isPrototypeOf(s);
      }
      if (c.arrayBuffer)
        var m = [
            '[object Int8Array]',
            '[object Uint8Array]',
            '[object Uint8ClampedArray]',
            '[object Int16Array]',
            '[object Uint16Array]',
            '[object Int32Array]',
            '[object Uint32Array]',
            '[object Float32Array]',
            '[object Float64Array]',
          ],
          w =
            ArrayBuffer.isView ||
            function (s) {
              return s && m.indexOf(Object.prototype.toString.call(s)) > -1;
            };
      function x(s) {
        if ((typeof s != 'string' && (s = String(s)), /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(s)))
          throw new TypeError('Invalid character in header field name');
        return s.toLowerCase();
      }
      function T(s) {
        return typeof s != 'string' && (s = String(s)), s;
      }
      function I(s) {
        var f = {
          next: function () {
            var v = s.shift();
            return { done: v === void 0, value: v };
          },
        };
        return (
          c.iterable &&
            (f[Symbol.iterator] = function () {
              return f;
            }),
          f
        );
      }
      function M(s) {
        (this.map = {}),
          s instanceof M
            ? s.forEach(function (f, v) {
                this.append(v, f);
              }, this)
            : Array.isArray(s)
            ? s.forEach(function (f) {
                this.append(f[0], f[1]);
              }, this)
            : s &&
              Object.getOwnPropertyNames(s).forEach(function (f) {
                this.append(f, s[f]);
              }, this);
      }
      (M.prototype.append = function (s, f) {
        (s = x(s)), (f = T(f));
        var v = this.map[s];
        this.map[s] = v ? v + ', ' + f : f;
      }),
        (M.prototype.delete = function (s) {
          delete this.map[x(s)];
        }),
        (M.prototype.get = function (s) {
          return (s = x(s)), this.has(s) ? this.map[s] : null;
        }),
        (M.prototype.has = function (s) {
          return this.map.hasOwnProperty(x(s));
        }),
        (M.prototype.set = function (s, f) {
          this.map[x(s)] = T(f);
        }),
        (M.prototype.forEach = function (s, f) {
          for (var v in this.map) this.map.hasOwnProperty(v) && s.call(f, this.map[v], v, this);
        }),
        (M.prototype.keys = function () {
          var s = [];
          return (
            this.forEach(function (f, v) {
              s.push(v);
            }),
            I(s)
          );
        }),
        (M.prototype.values = function () {
          var s = [];
          return (
            this.forEach(function (f) {
              s.push(f);
            }),
            I(s)
          );
        }),
        (M.prototype.entries = function () {
          var s = [];
          return (
            this.forEach(function (f, v) {
              s.push([v, f]);
            }),
            I(s)
          );
        }),
        c.iterable && (M.prototype[Symbol.iterator] = M.prototype.entries);
      function k(s) {
        if (s.bodyUsed) return Promise.reject(new TypeError('Already read'));
        s.bodyUsed = !0;
      }
      function F(s) {
        return new Promise(function (f, v) {
          (s.onload = function () {
            f(s.result);
          }),
            (s.onerror = function () {
              v(s.error);
            });
        });
      }
      function j(s) {
        var f = new FileReader(),
          v = F(f);
        return f.readAsArrayBuffer(s), v;
      }
      function Z(s) {
        var f = new FileReader(),
          v = F(f);
        return f.readAsText(s), v;
      }
      function me(s) {
        for (var f = new Uint8Array(s), v = new Array(f.length), y = 0; y < f.length; y++)
          v[y] = String.fromCharCode(f[y]);
        return v.join('');
      }
      function ue(s) {
        if (s.slice) return s.slice(0);
        var f = new Uint8Array(s.byteLength);
        return f.set(new Uint8Array(s)), f.buffer;
      }
      function X() {
        return (
          (this.bodyUsed = !1),
          (this._initBody = function (s) {
            (this._bodyInit = s),
              s
                ? typeof s == 'string'
                  ? (this._bodyText = s)
                  : c.blob && Blob.prototype.isPrototypeOf(s)
                  ? (this._bodyBlob = s)
                  : c.formData && FormData.prototype.isPrototypeOf(s)
                  ? (this._bodyFormData = s)
                  : c.searchParams && URLSearchParams.prototype.isPrototypeOf(s)
                  ? (this._bodyText = s.toString())
                  : c.arrayBuffer && c.blob && h(s)
                  ? ((this._bodyArrayBuffer = ue(s.buffer)),
                    (this._bodyInit = new Blob([this._bodyArrayBuffer])))
                  : c.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(s) || w(s))
                  ? (this._bodyArrayBuffer = ue(s))
                  : (this._bodyText = s = Object.prototype.toString.call(s))
                : (this._bodyText = ''),
              this.headers.get('content-type') ||
                (typeof s == 'string'
                  ? this.headers.set('content-type', 'text/plain;charset=UTF-8')
                  : this._bodyBlob && this._bodyBlob.type
                  ? this.headers.set('content-type', this._bodyBlob.type)
                  : c.searchParams &&
                    URLSearchParams.prototype.isPrototypeOf(s) &&
                    this.headers.set(
                      'content-type',
                      'application/x-www-form-urlencoded;charset=UTF-8'
                    ));
          }),
          c.blob &&
            ((this.blob = function () {
              var s = k(this);
              if (s) return s;
              if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
              if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              if (this._bodyFormData) throw new Error('could not read FormData body as blob');
              return Promise.resolve(new Blob([this._bodyText]));
            }),
            (this.arrayBuffer = function () {
              return this._bodyArrayBuffer
                ? k(this) || Promise.resolve(this._bodyArrayBuffer)
                : this.blob().then(j);
            })),
          (this.text = function () {
            var s = k(this);
            if (s) return s;
            if (this._bodyBlob) return Z(this._bodyBlob);
            if (this._bodyArrayBuffer) return Promise.resolve(me(this._bodyArrayBuffer));
            if (this._bodyFormData) throw new Error('could not read FormData body as text');
            return Promise.resolve(this._bodyText);
          }),
          c.formData &&
            (this.formData = function () {
              return this.text().then(R);
            }),
          (this.json = function () {
            return this.text().then(JSON.parse);
          }),
          this
        );
      }
      var J = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
      function Q(s) {
        var f = s.toUpperCase();
        return J.indexOf(f) > -1 ? f : s;
      }
      function re(s, f) {
        f = f || {};
        var v = f.body;
        if (s instanceof re) {
          if (s.bodyUsed) throw new TypeError('Already read');
          (this.url = s.url),
            (this.credentials = s.credentials),
            f.headers || (this.headers = new M(s.headers)),
            (this.method = s.method),
            (this.mode = s.mode),
            (this.signal = s.signal),
            !v && s._bodyInit != null && ((v = s._bodyInit), (s.bodyUsed = !0));
        } else this.url = String(s);
        if (
          ((this.credentials = f.credentials || this.credentials || 'same-origin'),
          (f.headers || !this.headers) && (this.headers = new M(f.headers)),
          (this.method = Q(f.method || this.method || 'GET')),
          (this.mode = f.mode || this.mode || null),
          (this.signal = f.signal || this.signal),
          (this.referrer = null),
          (this.method === 'GET' || this.method === 'HEAD') && v)
        )
          throw new TypeError('Body not allowed for GET or HEAD requests');
        this._initBody(v);
      }
      re.prototype.clone = function () {
        return new re(this, { body: this._bodyInit });
      };
      function R(s) {
        var f = new FormData();
        return (
          s
            .trim()
            .split('&')
            .forEach(function (v) {
              if (v) {
                var y = v.split('='),
                  E = y.shift().replace(/\+/g, ' '),
                  g = y.join('=').replace(/\+/g, ' ');
                f.append(decodeURIComponent(E), decodeURIComponent(g));
              }
            }),
          f
        );
      }
      function q(s) {
        var f = new M(),
          v = s.replace(/\r?\n[\t ]+/g, ' ');
        return (
          v.split(/\r?\n/).forEach(function (y) {
            var E = y.split(':'),
              g = E.shift().trim();
            if (g) {
              var u = E.join(':').trim();
              f.append(g, u);
            }
          }),
          f
        );
      }
      X.call(re.prototype);
      function N(s, f) {
        f || (f = {}),
          (this.type = 'default'),
          (this.status = f.status === void 0 ? 200 : f.status),
          (this.ok = this.status >= 200 && this.status < 300),
          (this.statusText = 'statusText' in f ? f.statusText : 'OK'),
          (this.headers = new M(f.headers)),
          (this.url = f.url || ''),
          this._initBody(s);
      }
      X.call(N.prototype),
        (N.prototype.clone = function () {
          return new N(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new M(this.headers),
            url: this.url,
          });
        }),
        (N.error = function () {
          var s = new N(null, { status: 0, statusText: '' });
          return (s.type = 'error'), s;
        });
      var p = [301, 302, 303, 307, 308];
      (N.redirect = function (s, f) {
        if (p.indexOf(f) === -1) throw new RangeError('Invalid status code');
        return new N(null, { status: f, headers: { location: s } });
      }),
        (o.DOMException = a.DOMException);
      try {
        new o.DOMException();
      } catch {
        (o.DOMException = function (f, v) {
          (this.message = f), (this.name = v);
          var y = Error(f);
          this.stack = y.stack;
        }),
          (o.DOMException.prototype = Object.create(Error.prototype)),
          (o.DOMException.prototype.constructor = o.DOMException);
      }
      function l(s, f) {
        return new Promise(function (v, y) {
          var E = new re(s, f);
          if (E.signal && E.signal.aborted) return y(new o.DOMException('Aborted', 'AbortError'));
          var g = new XMLHttpRequest();
          function u() {
            g.abort();
          }
          (g.onload = function () {
            var b = {
              status: g.status,
              statusText: g.statusText,
              headers: q(g.getAllResponseHeaders() || ''),
            };
            b.url = 'responseURL' in g ? g.responseURL : b.headers.get('X-Request-URL');
            var d = 'response' in g ? g.response : g.responseText;
            v(new N(d, b));
          }),
            (g.onerror = function () {
              y(new TypeError('Network request failed'));
            }),
            (g.ontimeout = function () {
              y(new TypeError('Network request failed'));
            }),
            (g.onabort = function () {
              y(new o.DOMException('Aborted', 'AbortError'));
            }),
            g.open(E.method, E.url, !0),
            E.credentials === 'include'
              ? (g.withCredentials = !0)
              : E.credentials === 'omit' && (g.withCredentials = !1),
            'responseType' in g && c.blob && (g.responseType = 'blob'),
            E.headers.forEach(function (b, d) {
              g.setRequestHeader(d, b);
            }),
            E.signal &&
              (E.signal.addEventListener('abort', u),
              (g.onreadystatechange = function () {
                g.readyState === 4 && E.signal.removeEventListener('abort', u);
              })),
            g.send(typeof E._bodyInit > 'u' ? null : E._bodyInit);
        });
      }
      return (
        (l.polyfill = !0),
        a.fetch || ((a.fetch = l), (a.Headers = M), (a.Request = re), (a.Response = N)),
        (o.Headers = M),
        (o.Request = re),
        (o.Response = N),
        (o.fetch = l),
        Object.defineProperty(o, '__esModule', { value: !0 }),
        o
      );
    })({});
  })(n),
    (n.fetch.ponyfill = !0),
    delete n.fetch.polyfill;
  var i = n;
  (e = i.fetch),
    (e.default = i.fetch),
    (e.fetch = i.fetch),
    (e.Headers = i.Headers),
    (e.Request = i.Request),
    (e.Response = i.Response),
    (t.exports = e);
})(Zb, va);
const k5 = Mh(va);
var Zc = {},
  Ks = {},
  gl = function (e) {
    var r = e.uri,
      n = e.name,
      i = e.type;
    (this.uri = r), (this.name = n), (this.type = i);
  },
  eg = gl,
  yl = function (e) {
    return (
      (typeof File < 'u' && e instanceof File) ||
      (typeof Blob < 'u' && e instanceof Blob) ||
      e instanceof eg
    );
  },
  tg = yl,
  rg = function t(e, r, n) {
    r === void 0 && (r = ''), n === void 0 && (n = tg);
    var i,
      a = new Map();
    function o(w, x) {
      var T = a.get(x);
      T ? T.push.apply(T, w) : a.set(x, w);
    }
    if (n(e)) (i = null), o([r], e);
    else {
      var c = r ? r + '.' : '';
      if (typeof FileList < 'u' && e instanceof FileList)
        i = Array.prototype.map.call(e, function (w, x) {
          return o(['' + c + x], w), null;
        });
      else if (Array.isArray(e))
        i = e.map(function (w, x) {
          var T = t(w, '' + c + x, n);
          return T.files.forEach(o), T.clone;
        });
      else if (e && e.constructor === Object) {
        i = {};
        for (var h in e) {
          var m = t(e[h], '' + c + h, n);
          m.files.forEach(o), (i[h] = m.clone);
        }
      } else i = e;
    }
    return { clone: i, files: a };
  };
Ks.ReactNativeFile = gl;
Ks.extractFiles = rg;
Ks.isExtractableFile = yl;
var ng = typeof self == 'object' ? self.FormData : window.FormData,
  Aa = {};
Object.defineProperty(Aa, '__esModule', { value: !0 });
Aa.defaultJsonSerializer = void 0;
Aa.defaultJsonSerializer = { parse: JSON.parse, stringify: JSON.stringify };
var ig =
  (se && se.__importDefault) ||
  function (t) {
    return t && t.__esModule ? t : { default: t };
  };
Object.defineProperty(Zc, '__esModule', { value: !0 });
var wl = Ks,
  ag = ig(ng),
  sg = Aa,
  og = function (t) {
    return (
      (0, wl.isExtractableFile)(t) ||
      (t !== null && typeof t == 'object' && typeof t.pipe == 'function')
    );
  };
function cg(t, e, r, n) {
  n === void 0 && (n = sg.defaultJsonSerializer);
  var i = (0, wl.extractFiles)({ query: t, variables: e, operationName: r }, '', og),
    a = i.clone,
    o = i.files;
  if (o.size === 0) {
    if (!Array.isArray(t)) return n.stringify(a);
    if (typeof e < 'u' && !Array.isArray(e))
      throw new Error('Cannot create request body with given variable type, array expected');
    var c = t.reduce(function (T, I, M) {
      return T.push({ query: I, variables: e ? e[M] : void 0 }), T;
    }, []);
    return n.stringify(c);
  }
  var h = typeof FormData > 'u' ? ag.default : FormData,
    m = new h();
  m.append('operations', n.stringify(a));
  var w = {},
    x = 0;
  return (
    o.forEach(function (T) {
      w[++x] = T;
    }),
    m.append('map', n.stringify(w)),
    (x = 0),
    o.forEach(function (T, I) {
      m.append(''.concat(++x), I);
    }),
    m
  );
}
Zc.default = cg;
var rr = {};
Object.defineProperty(rr, '__esModule', { value: !0 });
rr.parseBatchRequestsExtendedArgs =
  rr.parseRawRequestExtendedArgs =
  rr.parseRequestExtendedArgs =
  rr.parseBatchRequestArgs =
  rr.parseRawRequestArgs =
  rr.parseRequestArgs =
    void 0;
function fg(t, e, r) {
  return t.document ? t : { document: t, variables: e, requestHeaders: r, signal: void 0 };
}
rr.parseRequestArgs = fg;
function ug(t, e, r) {
  return t.query ? t : { query: t, variables: e, requestHeaders: r, signal: void 0 };
}
rr.parseRawRequestArgs = ug;
function dg(t, e) {
  return t.documents ? t : { documents: t, requestHeaders: e, signal: void 0 };
}
rr.parseBatchRequestArgs = dg;
function lg(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++) r[n - 2] = arguments[n];
  var i = r[0],
    a = r[1];
  return t.document ? t : { url: t, document: e, variables: i, requestHeaders: a, signal: void 0 };
}
rr.parseRequestExtendedArgs = lg;
function hg(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++) r[n - 2] = arguments[n];
  var i = r[0],
    a = r[1];
  return t.query ? t : { url: t, query: e, variables: i, requestHeaders: a, signal: void 0 };
}
rr.parseRawRequestExtendedArgs = hg;
function pg(t, e, r) {
  return t.documents ? t : { url: t, documents: e, requestHeaders: r, signal: void 0 };
}
rr.parseBatchRequestsExtendedArgs = pg;
var Oa = {},
  mg =
    (se && se.__extends) ||
    (function () {
      var t = function (e, r) {
        return (
          (t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (n, i) {
                n.__proto__ = i;
              }) ||
            function (n, i) {
              for (var a in i) Object.prototype.hasOwnProperty.call(i, a) && (n[a] = i[a]);
            }),
          t(e, r)
        );
      };
      return function (e, r) {
        if (typeof r != 'function' && r !== null)
          throw new TypeError('Class extends value ' + String(r) + ' is not a constructor or null');
        t(e, r);
        function n() {
          this.constructor = e;
        }
        e.prototype = r === null ? Object.create(r) : ((n.prototype = r.prototype), new n());
      };
    })();
Object.defineProperty(Oa, '__esModule', { value: !0 });
Oa.ClientError = void 0;
var vg = (function (t) {
  mg(e, t);
  function e(r, n) {
    var i = this,
      a = ''.concat(e.extractMessage(r), ': ').concat(JSON.stringify({ response: r, request: n }));
    return (
      (i = t.call(this, a) || this),
      Object.setPrototypeOf(i, e.prototype),
      (i.response = r),
      (i.request = n),
      typeof Error.captureStackTrace == 'function' && Error.captureStackTrace(i, e),
      i
    );
  }
  return (
    (e.extractMessage = function (r) {
      try {
        return r.errors[0].message;
      } catch {
        return 'GraphQL Error (Code: '.concat(r.status, ')');
      }
    }),
    e
  );
})(Error);
Oa.ClientError = vg;
var Ri = {};
const bg = Ku(Bb);
Object.defineProperty(Ri, '__esModule', { value: !0 });
Ri.resolveRequestDocument = void 0;
var Mu = bg;
function Au(t) {
  var e,
    r = void 0,
    n = t.definitions.filter(function (i) {
      return i.kind === 'OperationDefinition';
    });
  return n.length === 1 && (r = (e = n[0].name) === null || e === void 0 ? void 0 : e.value), r;
}
function gg(t) {
  if (typeof t == 'string') {
    var e = void 0;
    try {
      var r = (0, Mu.parse)(t);
      e = Au(r);
    } catch {}
    return { query: t, operationName: e };
  }
  var n = Au(t);
  return { query: (0, Mu.print)(t), operationName: n };
}
Ri.resolveRequestDocument = gg;
var Ki = {},
  Ou;
function yg() {
  if (Ou) return Ki;
  Ou = 1;
  var t =
      (se && se.__assign) ||
      function () {
        return (
          (t =
            Object.assign ||
            function (X) {
              for (var J, Q = 1, re = arguments.length; Q < re; Q++) {
                J = arguments[Q];
                for (var R in J) Object.prototype.hasOwnProperty.call(J, R) && (X[R] = J[R]);
              }
              return X;
            }),
          t.apply(this, arguments)
        );
      },
    e =
      (se && se.__awaiter) ||
      function (X, J, Q, re) {
        function R(q) {
          return q instanceof Q
            ? q
            : new Q(function (N) {
                N(q);
              });
        }
        return new (Q || (Q = Promise))(function (q, N) {
          function p(f) {
            try {
              s(re.next(f));
            } catch (v) {
              N(v);
            }
          }
          function l(f) {
            try {
              s(re.throw(f));
            } catch (v) {
              N(v);
            }
          }
          function s(f) {
            f.done ? q(f.value) : R(f.value).then(p, l);
          }
          s((re = re.apply(X, J || [])).next());
        });
      },
    r =
      (se && se.__generator) ||
      function (X, J) {
        var Q = {
            label: 0,
            sent: function () {
              if (q[0] & 1) throw q[1];
              return q[1];
            },
            trys: [],
            ops: [],
          },
          re,
          R,
          q,
          N;
        return (
          (N = { next: p(0), throw: p(1), return: p(2) }),
          typeof Symbol == 'function' &&
            (N[Symbol.iterator] = function () {
              return this;
            }),
          N
        );
        function p(s) {
          return function (f) {
            return l([s, f]);
          };
        }
        function l(s) {
          if (re) throw new TypeError('Generator is already executing.');
          for (; Q; )
            try {
              if (
                ((re = 1),
                R &&
                  (q =
                    s[0] & 2
                      ? R.return
                      : s[0]
                      ? R.throw || ((q = R.return) && q.call(R), 0)
                      : R.next) &&
                  !(q = q.call(R, s[1])).done)
              )
                return q;
              switch (((R = 0), q && (s = [s[0] & 2, q.value]), s[0])) {
                case 0:
                case 1:
                  q = s;
                  break;
                case 4:
                  return Q.label++, { value: s[1], done: !1 };
                case 5:
                  Q.label++, (R = s[1]), (s = [0]);
                  continue;
                case 7:
                  (s = Q.ops.pop()), Q.trys.pop();
                  continue;
                default:
                  if (
                    ((q = Q.trys),
                    !(q = q.length > 0 && q[q.length - 1]) && (s[0] === 6 || s[0] === 2))
                  ) {
                    Q = 0;
                    continue;
                  }
                  if (s[0] === 3 && (!q || (s[1] > q[0] && s[1] < q[3]))) {
                    Q.label = s[1];
                    break;
                  }
                  if (s[0] === 6 && Q.label < q[1]) {
                    (Q.label = q[1]), (q = s);
                    break;
                  }
                  if (q && Q.label < q[2]) {
                    (Q.label = q[2]), Q.ops.push(s);
                    break;
                  }
                  q[2] && Q.ops.pop(), Q.trys.pop();
                  continue;
              }
              s = J.call(X, Q);
            } catch (f) {
              (s = [6, f]), (R = 0);
            } finally {
              re = q = 0;
            }
          if (s[0] & 5) throw s[1];
          return { value: s[0] ? s[1] : void 0, done: !0 };
        }
      };
  Object.defineProperty(Ki, '__esModule', { value: !0 }), (Ki.GraphQLWebSocketClient = void 0);
  var n = Oa,
    i = Ri,
    a = 'connection_init',
    o = 'connection_ack',
    c = 'ping',
    h = 'pong',
    m = 'subscribe',
    w = 'next',
    x = 'error',
    T = 'complete',
    I = (function () {
      function X(J, Q, re) {
        (this._type = J), (this._payload = Q), (this._id = re);
      }
      return (
        Object.defineProperty(X.prototype, 'type', {
          get: function () {
            return this._type;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(X.prototype, 'id', {
          get: function () {
            return this._id;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(X.prototype, 'payload', {
          get: function () {
            return this._payload;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(X.prototype, 'text', {
          get: function () {
            var J = { type: this.type };
            return (
              this.id != null && this.id != null && (J.id = this.id),
              this.payload != null && this.payload != null && (J.payload = this.payload),
              JSON.stringify(J)
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        (X.parse = function (J, Q) {
          var re = JSON.parse(J),
            R = re.type,
            q = re.payload,
            N = re.id;
          return new X(R, Q(q), N);
        }),
        X
      );
    })(),
    M = (function () {
      function X(J, Q) {
        var re = Q.onInit,
          R = Q.onAcknowledged,
          q = Q.onPing,
          N = Q.onPong,
          p = this;
        (this.socketState = { acknowledged: !1, lastRequestId: 0, subscriptions: {} }),
          (this.socket = J),
          (J.onopen = function (l) {
            return e(p, void 0, void 0, function () {
              var s, f, v, y;
              return r(this, function (E) {
                switch (E.label) {
                  case 0:
                    return (
                      (this.socketState.acknowledged = !1),
                      (this.socketState.subscriptions = {}),
                      (f = (s = J).send),
                      (v = F),
                      re ? [4, re()] : [3, 2]
                    );
                  case 1:
                    return (y = E.sent()), [3, 3];
                  case 2:
                    (y = null), (E.label = 3);
                  case 3:
                    return f.apply(s, [v.apply(void 0, [y]).text]), [2];
                }
              });
            });
          }),
          (J.onclose = function (l) {
            (p.socketState.acknowledged = !1), (p.socketState.subscriptions = {});
          }),
          (J.onerror = function (l) {
            console.error(l);
          }),
          (J.onmessage = function (l) {
            try {
              var s = k(l.data);
              switch (s.type) {
                case o: {
                  p.socketState.acknowledged
                    ? console.warn('Duplicate CONNECTION_ACK message ignored')
                    : ((p.socketState.acknowledged = !0), R && R(s.payload));
                  return;
                }
                case c: {
                  q
                    ? q(s.payload).then(function (g) {
                        return J.send(Z(g).text);
                      })
                    : J.send(Z(null).text);
                  return;
                }
                case h: {
                  N && N(s.payload);
                  return;
                }
              }
              if (
                !p.socketState.acknowledged ||
                s.id === void 0 ||
                s.id === null ||
                !p.socketState.subscriptions[s.id]
              )
                return;
              var f = p.socketState.subscriptions[s.id],
                v = f.query,
                y = f.variables,
                E = f.subscriber;
              switch (s.type) {
                case w: {
                  !s.payload.errors && s.payload.data && E.next && E.next(s.payload.data),
                    s.payload.errors &&
                      E.error &&
                      E.error(
                        new n.ClientError(t(t({}, s.payload), { status: 200 }), {
                          query: v,
                          variables: y,
                        })
                      );
                  return;
                }
                case x: {
                  E.error &&
                    E.error(
                      new n.ClientError(
                        { errors: s.payload, status: 200 },
                        { query: v, variables: y }
                      )
                    );
                  return;
                }
                case T: {
                  E.complete && E.complete(), delete p.socketState.subscriptions[s.id];
                  return;
                }
              }
            } catch (g) {
              console.error(g), J.close(1006);
            }
            J.close(4400, 'Unknown graphql-ws message.');
          });
      }
      return (
        (X.prototype.makeSubscribe = function (J, Q, re, R) {
          var q = this,
            N = (this.socketState.lastRequestId++).toString();
          return (
            (this.socketState.subscriptions[N] = { query: J, variables: R, subscriber: re }),
            this.socket.send(me(N, { query: J, operationName: Q, variables: R }).text),
            function () {
              q.socket.send(ue(N).text), delete q.socketState.subscriptions[N];
            }
          );
        }),
        (X.prototype.rawRequest = function (J, Q) {
          var re = this;
          return new Promise(function (R, q) {
            var N;
            re.rawSubscribe(
              J,
              {
                next: function (p, l) {
                  return (N = { data: p, extensions: l });
                },
                error: q,
                complete: function () {
                  return R(N);
                },
              },
              Q
            );
          });
        }),
        (X.prototype.request = function (J, Q) {
          var re = this;
          return new Promise(function (R, q) {
            var N;
            re.subscribe(
              J,
              {
                next: function (p) {
                  return (N = p);
                },
                error: q,
                complete: function () {
                  return R(N);
                },
              },
              Q
            );
          });
        }),
        (X.prototype.subscribe = function (J, Q, re) {
          var R = (0, i.resolveRequestDocument)(J),
            q = R.query,
            N = R.operationName;
          return this.makeSubscribe(q, N, Q, re);
        }),
        (X.prototype.rawSubscribe = function (J, Q, re) {
          return this.makeSubscribe(J, void 0, Q, re);
        }),
        (X.prototype.ping = function (J) {
          this.socket.send(j(J).text);
        }),
        (X.prototype.close = function () {
          this.socket.close(1e3);
        }),
        (X.PROTOCOL = 'graphql-transport-ws'),
        X
      );
    })();
  Ki.GraphQLWebSocketClient = M;
  function k(X, J) {
    J === void 0 &&
      (J = function (re) {
        return re;
      });
    var Q = I.parse(X, J);
    return Q;
  }
  function F(X) {
    return new I(a, X);
  }
  function j(X) {
    return new I(c, X, void 0);
  }
  function Z(X) {
    return new I(h, X, void 0);
  }
  function me(X, J) {
    return new I(m, J, X);
  }
  function ue(X) {
    return new I(T, void 0, X);
  }
  return Ki;
}
(function (t) {
  var e =
      (se && se.__assign) ||
      function () {
        return (
          (e =
            Object.assign ||
            function (y) {
              for (var E, g = 1, u = arguments.length; g < u; g++) {
                E = arguments[g];
                for (var b in E) Object.prototype.hasOwnProperty.call(E, b) && (y[b] = E[b]);
              }
              return y;
            }),
          e.apply(this, arguments)
        );
      },
    r =
      (se && se.__createBinding) ||
      (Object.create
        ? function (y, E, g, u) {
            u === void 0 && (u = g);
            var b = Object.getOwnPropertyDescriptor(E, g);
            (!b || ('get' in b ? !E.__esModule : b.writable || b.configurable)) &&
              (b = {
                enumerable: !0,
                get: function () {
                  return E[g];
                },
              }),
              Object.defineProperty(y, u, b);
          }
        : function (y, E, g, u) {
            u === void 0 && (u = g), (y[u] = E[g]);
          }),
    n =
      (se && se.__setModuleDefault) ||
      (Object.create
        ? function (y, E) {
            Object.defineProperty(y, 'default', { enumerable: !0, value: E });
          }
        : function (y, E) {
            y.default = E;
          }),
    i =
      (se && se.__importStar) ||
      function (y) {
        if (y && y.__esModule) return y;
        var E = {};
        if (y != null)
          for (var g in y)
            g !== 'default' && Object.prototype.hasOwnProperty.call(y, g) && r(E, y, g);
        return n(E, y), E;
      },
    a =
      (se && se.__awaiter) ||
      function (y, E, g, u) {
        function b(d) {
          return d instanceof g
            ? d
            : new g(function (_) {
                _(d);
              });
        }
        return new (g || (g = Promise))(function (d, _) {
          function O(z) {
            try {
              $(u.next(z));
            } catch (H) {
              _(H);
            }
          }
          function D(z) {
            try {
              $(u.throw(z));
            } catch (H) {
              _(H);
            }
          }
          function $(z) {
            z.done ? d(z.value) : b(z.value).then(O, D);
          }
          $((u = u.apply(y, E || [])).next());
        });
      },
    o =
      (se && se.__generator) ||
      function (y, E) {
        var g = {
            label: 0,
            sent: function () {
              if (d[0] & 1) throw d[1];
              return d[1];
            },
            trys: [],
            ops: [],
          },
          u,
          b,
          d,
          _;
        return (
          (_ = { next: O(0), throw: O(1), return: O(2) }),
          typeof Symbol == 'function' &&
            (_[Symbol.iterator] = function () {
              return this;
            }),
          _
        );
        function O($) {
          return function (z) {
            return D([$, z]);
          };
        }
        function D($) {
          if (u) throw new TypeError('Generator is already executing.');
          for (; g; )
            try {
              if (
                ((u = 1),
                b &&
                  (d =
                    $[0] & 2
                      ? b.return
                      : $[0]
                      ? b.throw || ((d = b.return) && d.call(b), 0)
                      : b.next) &&
                  !(d = d.call(b, $[1])).done)
              )
                return d;
              switch (((b = 0), d && ($ = [$[0] & 2, d.value]), $[0])) {
                case 0:
                case 1:
                  d = $;
                  break;
                case 4:
                  return g.label++, { value: $[1], done: !1 };
                case 5:
                  g.label++, (b = $[1]), ($ = [0]);
                  continue;
                case 7:
                  ($ = g.ops.pop()), g.trys.pop();
                  continue;
                default:
                  if (
                    ((d = g.trys),
                    !(d = d.length > 0 && d[d.length - 1]) && ($[0] === 6 || $[0] === 2))
                  ) {
                    g = 0;
                    continue;
                  }
                  if ($[0] === 3 && (!d || ($[1] > d[0] && $[1] < d[3]))) {
                    g.label = $[1];
                    break;
                  }
                  if ($[0] === 6 && g.label < d[1]) {
                    (g.label = d[1]), (d = $);
                    break;
                  }
                  if (d && g.label < d[2]) {
                    (g.label = d[2]), g.ops.push($);
                    break;
                  }
                  d[2] && g.ops.pop(), g.trys.pop();
                  continue;
              }
              $ = E.call(y, g);
            } catch (z) {
              ($ = [6, z]), (b = 0);
            } finally {
              u = d = 0;
            }
          if ($[0] & 5) throw $[1];
          return { value: $[0] ? $[1] : void 0, done: !0 };
        }
      },
    c =
      (se && se.__rest) ||
      function (y, E) {
        var g = {};
        for (var u in y)
          Object.prototype.hasOwnProperty.call(y, u) && E.indexOf(u) < 0 && (g[u] = y[u]);
        if (y != null && typeof Object.getOwnPropertySymbols == 'function')
          for (var b = 0, u = Object.getOwnPropertySymbols(y); b < u.length; b++)
            E.indexOf(u[b]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(y, u[b]) &&
              (g[u[b]] = y[u[b]]);
        return g;
      },
    h =
      (se && se.__spreadArray) ||
      function (y, E, g) {
        if (g || arguments.length === 2)
          for (var u = 0, b = E.length, d; u < b; u++)
            (d || !(u in E)) && (d || (d = Array.prototype.slice.call(E, 0, u)), (d[u] = E[u]));
        return y.concat(d || Array.prototype.slice.call(E));
      },
    m =
      (se && se.__importDefault) ||
      function (y) {
        return y && y.__esModule ? y : { default: y };
      };
  Object.defineProperty(t, '__esModule', { value: !0 }),
    (t.resolveRequestDocument =
      t.GraphQLWebSocketClient =
      t.gql =
      t.batchRequests =
      t.request =
      t.rawRequest =
      t.GraphQLClient =
      t.ClientError =
        void 0);
  var w = i(va),
    x = w,
    T = m(Zc),
    I = Aa,
    M = rr,
    k = Oa;
  Object.defineProperty(t, 'ClientError', {
    enumerable: !0,
    get: function () {
      return k.ClientError;
    },
  });
  var F = Ri,
    j = function (y) {
      var E = {};
      return (
        y &&
          ((typeof Headers < 'u' && y instanceof Headers) ||
          (x && x.Headers && y instanceof x.Headers)
            ? (E = s(y))
            : Array.isArray(y)
            ? y.forEach(function (g) {
                var u = g[0],
                  b = g[1];
                E[u] = b;
              })
            : (E = y)),
        E
      );
    },
    Z = function (y) {
      return y.replace(/([\s,]|#[^\n\r]+)+/g, ' ').trim();
    },
    me = function (y) {
      var E = y.query,
        g = y.variables,
        u = y.operationName,
        b = y.jsonSerializer;
      if (!Array.isArray(E)) {
        var d = ['query='.concat(encodeURIComponent(Z(E)))];
        return (
          g && d.push('variables='.concat(encodeURIComponent(b.stringify(g)))),
          u && d.push('operationName='.concat(encodeURIComponent(u))),
          d.join('&')
        );
      }
      if (typeof g < 'u' && !Array.isArray(g))
        throw new Error('Cannot create query with given variable type, array expected');
      var _ = E.reduce(function (O, D, $) {
        return O.push({ query: Z(D), variables: g ? b.stringify(g[$]) : void 0 }), O;
      }, []);
      return 'query='.concat(encodeURIComponent(b.stringify(_)));
    },
    ue = function (y) {
      var E = y.url,
        g = y.query,
        u = y.variables,
        b = y.operationName,
        d = y.headers,
        _ = y.fetch,
        O = y.fetchOptions,
        D = y.middleware;
      return a(void 0, void 0, void 0, function () {
        var $, z, H;
        return o(this, function (K) {
          switch (K.label) {
            case 0:
              return (
                ($ = (0, T.default)(g, u, b, O.jsonSerializer)),
                (z = e(
                  {
                    method: 'POST',
                    headers: e(
                      e({}, typeof $ == 'string' ? { 'Content-Type': 'application/json' } : {}),
                      d
                    ),
                    body: $,
                  },
                  O
                )),
                D
                  ? [4, Promise.resolve(D(e(e({}, z), { url: E, operationName: b, variables: u })))]
                  : [3, 2]
              );
            case 1:
              (H = K.sent()), (E = H.url), (z = c(H, ['url'])), (K.label = 2);
            case 2:
              return [4, _(E, z)];
            case 3:
              return [2, K.sent()];
          }
        });
      });
    },
    X = function (y) {
      var E = y.url,
        g = y.query,
        u = y.variables,
        b = y.operationName,
        d = y.headers,
        _ = y.fetch,
        O = y.fetchOptions,
        D = y.middleware;
      return a(void 0, void 0, void 0, function () {
        var $, z, H;
        return o(this, function (K) {
          switch (K.label) {
            case 0:
              return (
                ($ = me({
                  query: g,
                  variables: u,
                  operationName: b,
                  jsonSerializer: O.jsonSerializer,
                })),
                (z = e({ method: 'GET', headers: d }, O)),
                D
                  ? [4, Promise.resolve(D(e(e({}, z), { url: E, operationName: b, variables: u })))]
                  : [3, 2]
              );
            case 1:
              (H = K.sent()), (E = H.url), (z = c(H, ['url'])), (K.label = 2);
            case 2:
              return [4, _(''.concat(E, '?').concat($), z)];
            case 3:
              return [2, K.sent()];
          }
        });
      });
    },
    J = (function () {
      function y(E, g) {
        g === void 0 && (g = {}), (this.url = E), (this.options = g);
      }
      return (
        (y.prototype.rawRequest = function (E, g, u) {
          return a(this, void 0, void 0, function () {
            var b, d, _, O, D, $, z, H, K, le, oe, te;
            return o(this, function (Re) {
              return (
                (b = (0, M.parseRawRequestArgs)(E, g, u)),
                (d = this.options),
                (_ = d.headers),
                (O = d.fetch),
                (D = O === void 0 ? w.default : O),
                ($ = d.method),
                (z = $ === void 0 ? 'POST' : $),
                (H = d.requestMiddleware),
                (K = d.responseMiddleware),
                (le = c(d, [
                  'headers',
                  'fetch',
                  'method',
                  'requestMiddleware',
                  'responseMiddleware',
                ])),
                (oe = this.url),
                b.signal !== void 0 && (le.signal = b.signal),
                (te = (0, F.resolveRequestDocument)(b.query).operationName),
                [
                  2,
                  Q({
                    url: oe,
                    query: b.query,
                    variables: b.variables,
                    headers: e(e({}, j(p(_))), j(b.requestHeaders)),
                    operationName: te,
                    fetch: D,
                    method: z,
                    fetchOptions: le,
                    middleware: H,
                  })
                    .then(function (xe) {
                      return K && K(xe), xe;
                    })
                    .catch(function (xe) {
                      throw (K && K(xe), xe);
                    }),
                ]
              );
            });
          });
        }),
        (y.prototype.request = function (E) {
          for (var g = [], u = 1; u < arguments.length; u++) g[u - 1] = arguments[u];
          return a(this, void 0, void 0, function () {
            var b, d, _, O, D, $, z, H, K, le, oe, te, Re, xe, he, qe;
            return o(this, function (Ve) {
              return (
                (b = g[0]),
                (d = g[1]),
                (_ = (0, M.parseRequestArgs)(E, b, d)),
                (O = this.options),
                (D = O.headers),
                ($ = O.fetch),
                (z = $ === void 0 ? w.default : $),
                (H = O.method),
                (K = H === void 0 ? 'POST' : H),
                (le = O.requestMiddleware),
                (oe = O.responseMiddleware),
                (te = c(O, [
                  'headers',
                  'fetch',
                  'method',
                  'requestMiddleware',
                  'responseMiddleware',
                ])),
                (Re = this.url),
                _.signal !== void 0 && (te.signal = _.signal),
                (xe = (0, F.resolveRequestDocument)(_.document)),
                (he = xe.query),
                (qe = xe.operationName),
                [
                  2,
                  Q({
                    url: Re,
                    query: he,
                    variables: _.variables,
                    headers: e(e({}, j(p(D))), j(_.requestHeaders)),
                    operationName: qe,
                    fetch: z,
                    method: K,
                    fetchOptions: te,
                    middleware: le,
                  })
                    .then(function (fe) {
                      return oe && oe(fe), fe.data;
                    })
                    .catch(function (fe) {
                      throw (oe && oe(fe), fe);
                    }),
                ]
              );
            });
          });
        }),
        (y.prototype.batchRequests = function (E, g) {
          var u = (0, M.parseBatchRequestArgs)(E, g),
            b = this.options,
            d = b.headers,
            _ = b.fetch,
            O = _ === void 0 ? w.default : _,
            D = b.method,
            $ = D === void 0 ? 'POST' : D,
            z = b.requestMiddleware,
            H = b.responseMiddleware,
            K = c(b, ['headers', 'fetch', 'method', 'requestMiddleware', 'responseMiddleware']),
            le = this.url;
          u.signal !== void 0 && (K.signal = u.signal);
          var oe = u.documents.map(function (Re) {
              var xe = Re.document;
              return (0, F.resolveRequestDocument)(xe).query;
            }),
            te = u.documents.map(function (Re) {
              var xe = Re.variables;
              return xe;
            });
          return Q({
            url: le,
            query: oe,
            variables: te,
            headers: e(e({}, j(p(d))), j(u.requestHeaders)),
            operationName: void 0,
            fetch: O,
            method: $,
            fetchOptions: K,
            middleware: z,
          })
            .then(function (Re) {
              return H && H(Re), Re.data;
            })
            .catch(function (Re) {
              throw (H && H(Re), Re);
            });
        }),
        (y.prototype.setHeaders = function (E) {
          return (this.options.headers = E), this;
        }),
        (y.prototype.setHeader = function (E, g) {
          var u,
            b = this.options.headers;
          return b ? (b[E] = g) : (this.options.headers = ((u = {}), (u[E] = g), u)), this;
        }),
        (y.prototype.setEndpoint = function (E) {
          return (this.url = E), this;
        }),
        y
      );
    })();
  t.GraphQLClient = J;
  function Q(y) {
    var E = y.url,
      g = y.query,
      u = y.variables,
      b = y.headers,
      d = y.operationName,
      _ = y.fetch,
      O = y.method,
      D = O === void 0 ? 'POST' : O,
      $ = y.fetchOptions,
      z = y.middleware;
    return a(this, void 0, void 0, function () {
      var H, K, le, oe, te, Re, xe, he, qe, Ve, fe;
      return o(this, function (He) {
        switch (He.label) {
          case 0:
            return (
              (H = D.toUpperCase() === 'POST' ? ue : X),
              (K = Array.isArray(g)),
              [
                4,
                H({
                  url: E,
                  query: g,
                  variables: u,
                  operationName: d,
                  headers: b,
                  fetch: _,
                  fetchOptions: $,
                  middleware: z,
                }),
              ]
            );
          case 1:
            return (le = He.sent()), [4, N(le, $.jsonSerializer)];
          case 2:
            if (
              ((oe = He.sent()),
              (te =
                K && Array.isArray(oe)
                  ? !oe.some(function (Ge) {
                      var ve = Ge.data;
                      return !ve;
                    })
                  : !!oe.data),
              (Re = !oe.errors || $.errorPolicy === 'all' || $.errorPolicy === 'ignore'),
              le.ok && Re && te)
            )
              return (
                (xe = le.headers),
                (he = le.status),
                oe.errors,
                (qe = c(oe, ['errors'])),
                (Ve = $.errorPolicy === 'ignore' ? qe : oe),
                [2, e(e({}, K ? { data: Ve } : Ve), { headers: xe, status: he })]
              );
            throw (
              ((fe = typeof oe == 'string' ? { error: oe } : oe),
              new k.ClientError(e(e({}, fe), { status: le.status, headers: le.headers }), {
                query: g,
                variables: u,
              }))
            );
        }
      });
    });
  }
  function re(y, E) {
    for (var g = [], u = 2; u < arguments.length; u++) g[u - 2] = arguments[u];
    return a(this, void 0, void 0, function () {
      var b, d;
      return o(this, function (_) {
        return (
          (b = M.parseRawRequestExtendedArgs.apply(void 0, h([y, E], g, !1))),
          (d = new J(b.url)),
          [2, d.rawRequest(e({}, b))]
        );
      });
    });
  }
  t.rawRequest = re;
  function R(y, E) {
    for (var g = [], u = 2; u < arguments.length; u++) g[u - 2] = arguments[u];
    return a(this, void 0, void 0, function () {
      var b, d;
      return o(this, function (_) {
        return (
          (b = M.parseRequestExtendedArgs.apply(void 0, h([y, E], g, !1))),
          (d = new J(b.url)),
          [2, d.request(e({}, b))]
        );
      });
    });
  }
  t.request = R;
  function q(y, E, g) {
    return a(this, void 0, void 0, function () {
      var u, b;
      return o(this, function (d) {
        return (
          (u = (0, M.parseBatchRequestsExtendedArgs)(y, E, g)),
          (b = new J(u.url)),
          [2, b.batchRequests(e({}, u))]
        );
      });
    });
  }
  (t.batchRequests = q), (t.default = R);
  function N(y, E) {
    return (
      E === void 0 && (E = I.defaultJsonSerializer),
      a(this, void 0, void 0, function () {
        var g, u, b;
        return o(this, function (d) {
          switch (d.label) {
            case 0:
              return (
                y.headers.forEach(function (_, O) {
                  O.toLowerCase() === 'content-type' && (g = _);
                }),
                g &&
                (g.toLowerCase().startsWith('application/json') ||
                  g.toLowerCase().startsWith('application/graphql+json') ||
                  g.toLowerCase().startsWith('application/graphql-response+json'))
                  ? ((b = (u = E).parse), [4, y.text()])
                  : [3, 2]
              );
            case 1:
              return [2, b.apply(u, [d.sent()])];
            case 2:
              return [2, y.text()];
          }
        });
      })
    );
  }
  function p(y) {
    return typeof y == 'function' ? y() : y;
  }
  function l(y) {
    for (var E = [], g = 1; g < arguments.length; g++) E[g - 1] = arguments[g];
    return y.reduce(function (u, b, d) {
      return ''
        .concat(u)
        .concat(b)
        .concat(d in E ? E[d] : '');
    }, '');
  }
  t.gql = l;
  function s(y) {
    var E = {};
    return (
      y.forEach(function (g, u) {
        E[u] = g;
      }),
      E
    );
  }
  var f = yg();
  Object.defineProperty(t, 'GraphQLWebSocketClient', {
    enumerable: !0,
    get: function () {
      return f.GraphQLWebSocketClient;
    },
  });
  var v = Ri;
  Object.defineProperty(t, 'resolveRequestDocument', {
    enumerable: !0,
    get: function () {
      return v.resolveRequestDocument;
    },
  });
})(bl);
var Qn = {},
  wg = {
    get exports() {
      return Qn;
    },
    set exports(t) {
      Qn = t;
    },
  };
(function (t, e) {
  var r = 200,
    n = '__lodash_hash_undefined__',
    i = 9007199254740991,
    a = '[object Arguments]',
    o = '[object Array]',
    c = '[object Boolean]',
    h = '[object Date]',
    m = '[object Error]',
    w = '[object Function]',
    x = '[object GeneratorFunction]',
    T = '[object Map]',
    I = '[object Number]',
    M = '[object Object]',
    k = '[object Promise]',
    F = '[object RegExp]',
    j = '[object Set]',
    Z = '[object String]',
    me = '[object Symbol]',
    ue = '[object WeakMap]',
    X = '[object ArrayBuffer]',
    J = '[object DataView]',
    Q = '[object Float32Array]',
    re = '[object Float64Array]',
    R = '[object Int8Array]',
    q = '[object Int16Array]',
    N = '[object Int32Array]',
    p = '[object Uint8Array]',
    l = '[object Uint8ClampedArray]',
    s = '[object Uint16Array]',
    f = '[object Uint32Array]',
    v = /[\\^$.*+?()[\]{}|]/g,
    y = /\w*$/,
    E = /^\[object .+?Constructor\]$/,
    g = /^(?:0|[1-9]\d*)$/,
    u = {};
  (u[a] =
    u[o] =
    u[X] =
    u[J] =
    u[c] =
    u[h] =
    u[Q] =
    u[re] =
    u[R] =
    u[q] =
    u[N] =
    u[T] =
    u[I] =
    u[M] =
    u[F] =
    u[j] =
    u[Z] =
    u[me] =
    u[p] =
    u[l] =
    u[s] =
    u[f] =
      !0),
    (u[m] = u[w] = u[ue] = !1);
  var b = typeof se == 'object' && se && se.Object === Object && se,
    d = typeof self == 'object' && self && self.Object === Object && self,
    _ = b || d || Function('return this')(),
    O = e && !e.nodeType && e,
    D = O && !0 && t && !t.nodeType && t,
    $ = D && D.exports === O;
  function z(S, C) {
    return S.set(C[0], C[1]), S;
  }
  function H(S, C) {
    return S.add(C), S;
  }
  function K(S, C) {
    for (var B = -1, ae = S ? S.length : 0; ++B < ae && C(S[B], B, S) !== !1; );
    return S;
  }
  function le(S, C) {
    for (var B = -1, ae = C.length, Ut = S.length; ++B < ae; ) S[Ut + B] = C[B];
    return S;
  }
  function oe(S, C, B, ae) {
    var Ut = -1,
      Qt = S ? S.length : 0;
    for (ae && Qt && (B = S[++Ut]); ++Ut < Qt; ) B = C(B, S[Ut], Ut, S);
    return B;
  }
  function te(S, C) {
    for (var B = -1, ae = Array(S); ++B < S; ) ae[B] = C(B);
    return ae;
  }
  function Re(S, C) {
    return S?.[C];
  }
  function xe(S) {
    var C = !1;
    if (S != null && typeof S.toString != 'function')
      try {
        C = !!(S + '');
      } catch {}
    return C;
  }
  function he(S) {
    var C = -1,
      B = Array(S.size);
    return (
      S.forEach(function (ae, Ut) {
        B[++C] = [Ut, ae];
      }),
      B
    );
  }
  function qe(S, C) {
    return function (B) {
      return S(C(B));
    };
  }
  function Ve(S) {
    var C = -1,
      B = Array(S.size);
    return (
      S.forEach(function (ae) {
        B[++C] = ae;
      }),
      B
    );
  }
  var fe = Array.prototype,
    He = Function.prototype,
    Ge = Object.prototype,
    ve = _['__core-js_shared__'],
    rt = (function () {
      var S = /[^.]+$/.exec((ve && ve.keys && ve.keys.IE_PROTO) || '');
      return S ? 'Symbol(src)_1.' + S : '';
    })(),
    nt = He.toString,
    pe = Ge.hasOwnProperty,
    Ke = Ge.toString,
    dt = RegExp(
      '^' +
        nt
          .call(pe)
          .replace(v, '\\$&')
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
        '$'
    ),
    ye = $ ? _.Buffer : void 0,
    it = _.Symbol,
    at = _.Uint8Array,
    _e = qe(Object.getPrototypeOf, Object),
    lt = Object.create,
    ht = Ge.propertyIsEnumerable,
    Te = fe.splice,
    st = Object.getOwnPropertySymbols,
    pt = ye ? ye.isBuffer : void 0,
    Ie = qe(Object.keys, Object),
    Ze = ti(_, 'DataView'),
    We = ti(_, 'Map'),
    ge = ti(_, 'Promise'),
    et = ti(_, 'Set'),
    tt = ti(_, 'WeakMap'),
    be = ti(Object, 'create'),
    mt = Un(Ze),
    vt = Un(We),
    Ne = Un(ge),
    bt = Un(et),
    gt = Un(tt),
    we = it ? it.prototype : void 0,
    ot = we ? we.valueOf : void 0;
  function je(S) {
    var C = -1,
      B = S ? S.length : 0;
    for (this.clear(); ++C < B; ) {
      var ae = S[C];
      this.set(ae[0], ae[1]);
    }
  }
  function Se() {
    this.__data__ = be ? be(null) : {};
  }
  function yt(S) {
    return this.has(S) && delete this.__data__[S];
  }
  function wt(S) {
    var C = this.__data__;
    if (be) {
      var B = C[S];
      return B === n ? void 0 : B;
    }
    return pe.call(C, S) ? C[S] : void 0;
  }
  function Me(S) {
    var C = this.__data__;
    return be ? C[S] !== void 0 : pe.call(C, S);
  }
  function Et(S, C) {
    var B = this.__data__;
    return (B[S] = be && C === void 0 ? n : C), this;
  }
  (je.prototype.clear = Se),
    (je.prototype.delete = yt),
    (je.prototype.get = wt),
    (je.prototype.has = Me),
    (je.prototype.set = Et);
  function Be(S) {
    var C = -1,
      B = S ? S.length : 0;
    for (this.clear(); ++C < B; ) {
      var ae = S[C];
      this.set(ae[0], ae[1]);
    }
  }
  function Ae() {
    this.__data__ = [];
  }
  function xt(S) {
    var C = this.__data__,
      B = vr(C, S);
    if (B < 0) return !1;
    var ae = C.length - 1;
    return B == ae ? C.pop() : Te.call(C, B, 1), !0;
  }
  function _t(S) {
    var C = this.__data__,
      B = vr(C, S);
    return B < 0 ? void 0 : C[B][1];
  }
  function Oe(S) {
    return vr(this.__data__, S) > -1;
  }
  function Tt(S, C) {
    var B = this.__data__,
      ae = vr(B, S);
    return ae < 0 ? B.push([S, C]) : (B[ae][1] = C), this;
  }
  (Be.prototype.clear = Ae),
    (Be.prototype.delete = xt),
    (Be.prototype.get = _t),
    (Be.prototype.has = Oe),
    (Be.prototype.set = Tt);
  function ze(S) {
    var C = -1,
      B = S ? S.length : 0;
    for (this.clear(); ++C < B; ) {
      var ae = S[C];
      this.set(ae[0], ae[1]);
    }
  }
  function ct() {
    this.__data__ = { hash: new je(), map: new (We || Be)(), string: new je() };
  }
  function en(S) {
    return Pa(this, S).delete(S);
  }
  function tn(S) {
    return Pa(this, S).get(S);
  }
  function rn(S) {
    return Pa(this, S).has(S);
  }
  function nn(S, C) {
    return Pa(this, S).set(S, C), this;
  }
  (ze.prototype.clear = ct),
    (ze.prototype.delete = en),
    (ze.prototype.get = tn),
    (ze.prototype.has = rn),
    (ze.prototype.set = nn);
  function er(S) {
    this.__data__ = new Be(S);
  }
  function an() {
    this.__data__ = new Be();
  }
  function sn(S) {
    return this.__data__.delete(S);
  }
  function on(S) {
    return this.__data__.get(S);
  }
  function cn(S) {
    return this.__data__.has(S);
  }
  function fn(S, C) {
    var B = this.__data__;
    if (B instanceof Be) {
      var ae = B.__data__;
      if (!We || ae.length < r - 1) return ae.push([S, C]), this;
      B = this.__data__ = new ze(ae);
    }
    return B.set(S, C), this;
  }
  (er.prototype.clear = an),
    (er.prototype.delete = sn),
    (er.prototype.get = on),
    (er.prototype.has = cn),
    (er.prototype.set = fn);
  function un(S, C) {
    var B = uo(S) || Eh(S) ? te(S.length, String) : [],
      ae = B.length,
      Ut = !!ae;
    for (var Qt in S)
      (C || pe.call(S, Qt)) && !(Ut && (Qt == 'length' || bh(Qt, ae))) && B.push(Qt);
    return B;
  }
  function Lr(S, C, B) {
    var ae = S[C];
    (!(pe.call(S, C) && hf(ae, B)) || (B === void 0 && !(C in S))) && (S[C] = B);
  }
  function vr(S, C) {
    for (var B = S.length; B--; ) if (hf(S[B][0], C)) return B;
    return -1;
  }
  function dn(S, C) {
    return S && uf(C, lo(C), S);
  }
  function Sr(S, C, B, ae, Ut, Qt, br) {
    var tr;
    if ((ae && (tr = Qt ? ae(S, Ut, Qt, br) : ae(S)), tr !== void 0)) return tr;
    if (!La(S)) return S;
    var vf = uo(S);
    if (vf) {
      if (((tr = ph(S)), !C)) return dh(S, tr);
    } else {
      var ri = Fn(S),
        bf = ri == w || ri == x;
      if (_h(S)) return ih(S, C);
      if (ri == M || ri == a || (bf && !Qt)) {
        if (xe(S)) return Qt ? S : {};
        if (((tr = mh(bf ? {} : S)), !C)) return lh(S, dn(tr, S));
      } else {
        if (!u[ri]) return Qt ? S : {};
        tr = vh(S, ri, Sr, C);
      }
    }
    br || (br = new er());
    var gf = br.get(S);
    if (gf) return gf;
    if ((br.set(S, tr), !vf)) var yf = B ? hh(S) : lo(S);
    return (
      K(yf || S, function (ho, Fa) {
        yf && ((Fa = ho), (ho = S[Fa])), Lr(tr, Fa, Sr(ho, C, B, ae, Fa, S, br));
      }),
      tr
    );
  }
  function ln(S) {
    return La(S) ? lt(S) : {};
  }
  function hn(S, C, B) {
    var ae = C(S);
    return uo(S) ? ae : le(ae, B(S));
  }
  function zi(S) {
    return Ke.call(S);
  }
  function Gi(S) {
    if (!La(S) || yh(S)) return !1;
    var C = mf(S) || xe(S) ? dt : E;
    return C.test(Un(S));
  }
  function nh(S) {
    if (!lf(S)) return Ie(S);
    var C = [];
    for (var B in Object(S)) pe.call(S, B) && B != 'constructor' && C.push(B);
    return C;
  }
  function ih(S, C) {
    if (C) return S.slice();
    var B = new S.constructor(S.length);
    return S.copy(B), B;
  }
  function fo(S) {
    var C = new S.constructor(S.byteLength);
    return new at(C).set(new at(S)), C;
  }
  function ah(S, C) {
    var B = C ? fo(S.buffer) : S.buffer;
    return new S.constructor(B, S.byteOffset, S.byteLength);
  }
  function sh(S, C, B) {
    var ae = C ? B(he(S), !0) : he(S);
    return oe(ae, z, new S.constructor());
  }
  function oh(S) {
    var C = new S.constructor(S.source, y.exec(S));
    return (C.lastIndex = S.lastIndex), C;
  }
  function ch(S, C, B) {
    var ae = C ? B(Ve(S), !0) : Ve(S);
    return oe(ae, H, new S.constructor());
  }
  function fh(S) {
    return ot ? Object(ot.call(S)) : {};
  }
  function uh(S, C) {
    var B = C ? fo(S.buffer) : S.buffer;
    return new S.constructor(B, S.byteOffset, S.length);
  }
  function dh(S, C) {
    var B = -1,
      ae = S.length;
    for (C || (C = Array(ae)); ++B < ae; ) C[B] = S[B];
    return C;
  }
  function uf(S, C, B, ae) {
    B || (B = {});
    for (var Ut = -1, Qt = C.length; ++Ut < Qt; ) {
      var br = C[Ut],
        tr = ae ? ae(B[br], S[br], br, B, S) : void 0;
      Lr(B, br, tr === void 0 ? S[br] : tr);
    }
    return B;
  }
  function lh(S, C) {
    return uf(S, df(S), C);
  }
  function hh(S) {
    return hn(S, lo, df);
  }
  function Pa(S, C) {
    var B = S.__data__;
    return gh(C) ? B[typeof C == 'string' ? 'string' : 'hash'] : B.map;
  }
  function ti(S, C) {
    var B = Re(S, C);
    return Gi(B) ? B : void 0;
  }
  var df = st ? qe(st, Object) : Nh,
    Fn = zi;
  ((Ze && Fn(new Ze(new ArrayBuffer(1))) != J) ||
    (We && Fn(new We()) != T) ||
    (ge && Fn(ge.resolve()) != k) ||
    (et && Fn(new et()) != j) ||
    (tt && Fn(new tt()) != ue)) &&
    (Fn = function (S) {
      var C = Ke.call(S),
        B = C == M ? S.constructor : void 0,
        ae = B ? Un(B) : void 0;
      if (ae)
        switch (ae) {
          case mt:
            return J;
          case vt:
            return T;
          case Ne:
            return k;
          case bt:
            return j;
          case gt:
            return ue;
        }
      return C;
    });
  function ph(S) {
    var C = S.length,
      B = S.constructor(C);
    return (
      C &&
        typeof S[0] == 'string' &&
        pe.call(S, 'index') &&
        ((B.index = S.index), (B.input = S.input)),
      B
    );
  }
  function mh(S) {
    return typeof S.constructor == 'function' && !lf(S) ? ln(_e(S)) : {};
  }
  function vh(S, C, B, ae) {
    var Ut = S.constructor;
    switch (C) {
      case X:
        return fo(S);
      case c:
      case h:
        return new Ut(+S);
      case J:
        return ah(S, ae);
      case Q:
      case re:
      case R:
      case q:
      case N:
      case p:
      case l:
      case s:
      case f:
        return uh(S, ae);
      case T:
        return sh(S, ae, B);
      case I:
      case Z:
        return new Ut(S);
      case F:
        return oh(S);
      case j:
        return ch(S, ae, B);
      case me:
        return fh(S);
    }
  }
  function bh(S, C) {
    return (
      (C = C ?? i), !!C && (typeof S == 'number' || g.test(S)) && S > -1 && S % 1 == 0 && S < C
    );
  }
  function gh(S) {
    var C = typeof S;
    return C == 'string' || C == 'number' || C == 'symbol' || C == 'boolean'
      ? S !== '__proto__'
      : S === null;
  }
  function yh(S) {
    return !!rt && rt in S;
  }
  function lf(S) {
    var C = S && S.constructor,
      B = (typeof C == 'function' && C.prototype) || Ge;
    return S === B;
  }
  function Un(S) {
    if (S != null) {
      try {
        return nt.call(S);
      } catch {}
      try {
        return S + '';
      } catch {}
    }
    return '';
  }
  function wh(S) {
    return Sr(S, !0, !0);
  }
  function hf(S, C) {
    return S === C || (S !== S && C !== C);
  }
  function Eh(S) {
    return xh(S) && pe.call(S, 'callee') && (!ht.call(S, 'callee') || Ke.call(S) == a);
  }
  var uo = Array.isArray;
  function pf(S) {
    return S != null && Th(S.length) && !mf(S);
  }
  function xh(S) {
    return Ih(S) && pf(S);
  }
  var _h = pt || Sh;
  function mf(S) {
    var C = La(S) ? Ke.call(S) : '';
    return C == w || C == x;
  }
  function Th(S) {
    return typeof S == 'number' && S > -1 && S % 1 == 0 && S <= i;
  }
  function La(S) {
    var C = typeof S;
    return !!S && (C == 'object' || C == 'function');
  }
  function Ih(S) {
    return !!S && typeof S == 'object';
  }
  function lo(S) {
    return pf(S) ? un(S) : nh(S);
  }
  function Nh() {
    return [];
  }
  function Sh() {
    return !1;
  }
  t.exports = wh;
})(wg, Qn);
var El = (t) => {
    var e, r, n, i;
    let a, o, c;
    return (
      Array.isArray(t)
        ? ((o = t[0]), (a = (e = t[1]) != null ? e : yr), (c = (r = t[2]) != null ? r : void 0))
        : ((o = t.amount),
          (a = (n = t.assetId) != null ? n : yr),
          (c = (i = t.max) != null ? i : void 0)),
      { assetId: ee(a), amount: G(o), max: c ? G(c) : void 0 }
    );
  },
  Eg = ((t) => ((t.Spent = 'SPENT'), (t.Unspent = 'UNSPENT'), t))(Eg || {}),
  Ra = Fe`
  fragment transactionFragment on Transaction {
    id
    rawPayload
    gasPrice
    status {
      type: __typename
      ... on SubmittedStatus {
        time
      }
      ... on SuccessStatus {
        block {
          id
        }
        time
        programState {
          returnType
          data
        }
      }
      ... on FailureStatus {
        block {
          id
        }
        time
        reason
      }
    }
  }
`,
  xl = Fe`
  fragment receiptFragment on Receipt {
    data
    rawPayload
  }
`,
  ef = Fe`
  fragment coinFragment on Coin {
    utxoId
    owner
    amount
    assetId
    maturity
    status
    blockCreated
  }
`,
  _l = Fe`
  fragment messageFragment on Message {
    amount
    sender
    recipient
    data
    nonce
    daHeight
    fuelBlockSpend
  }
`,
  xg = Fe`
  fragment messageProofFragment on MessageProof {
    proofSet
    proofIndex
    sender
    recipient
    nonce
    amount
    data
    signature
    header {
      id
      daHeight
      transactionsCount
      outputMessagesCount
      transactionsRoot
      outputMessagesRoot
      height
      prevRoot
      time
      applicationHash
    }
  }
`,
  Tl = Fe`
  fragment balanceFragment on Balance {
    owner
    amount
    assetId
  }
`,
  _g = Fe`
  fragment consensusParametersFragment on ConsensusParameters {
    contractMaxSize
    maxInputs
    maxOutputs
    maxWitnesses
    maxGasPerTx
    maxScriptLength
    maxScriptDataLength
    maxStorageSlots
    maxPredicateLength
    maxPredicateDataLength
    gasPriceFactor
    gasPerByte
    maxMessageDataLength
  }
`,
  Qs = Fe`
  fragment blockFragment on Block {
    id
    header {
      height
      time
    }
    transactions {
      id
    }
  }
`,
  Tg = Fe`
  fragment chainInfoFragment on ChainInfo {
    name
    baseChainHeight
    peerCount
    consensusParameters {
      ...consensusParametersFragment
    }
    latestBlock {
      ...blockFragment
    }
  }
  ${_g}
  ${Qs}
`,
  Ig = Fe`
  fragment contractBalanceFragment on ContractBalance {
    contract
    amount
    assetId
  }
`,
  Ng = Fe`
  query getVersion {
    nodeInfo {
      nodeVersion
    }
  }
`,
  Sg = Fe`
  query getInfo {
    nodeInfo {
      nodeVersion
      minGasPrice
    }
  }
`,
  Mg = Fe`
  query getChain {
    chain {
      ...chainInfoFragment
    }
  }
  ${Tg}
`,
  Ag = Fe`
  query getTransaction($transactionId: TransactionId!) {
    transaction(id: $transactionId) {
      ...transactionFragment
    }
  }
  ${Ra}
`,
  Og = Fe`
  query getTransactionWithReceipts($transactionId: TransactionId!) {
    transaction(id: $transactionId) {
      ...transactionFragment
      receipts {
        ...receiptFragment
      }
    }
  }
  ${Ra}
  ${xl}
`,
  Rg = Fe`
  query getTransactions($after: String, $before: String, $first: Int, $last: Int) {
    transactions(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          ...transactionFragment
        }
      }
    }
  }
  ${Ra}
`,
  Dg = Fe`
  query getTransactionsByOwner(
    $owner: Address!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    transactionsByOwner(owner: $owner, after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          ...transactionFragment
        }
      }
    }
  }
  ${Ra}
`,
  $g = Fe`
  query getBlock($blockId: BlockId, $blockHeight: U64) {
    block(id: $blockId, height: $blockHeight) {
      ...blockFragment
    }
  }
  ${Qs}
`,
  kg = Fe`
  query getBlockWithTransactions($blockId: BlockId, $blockHeight: U64) {
    block(id: $blockId, height: $blockHeight) {
      ...blockFragment
      transactions {
        ...transactionFragment
      }
    }
  }
  ${Qs}
  ${Ra}
`,
  Cg = Fe`
  query getBlocks($after: String, $before: String, $first: Int, $last: Int) {
    blocks(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          ...blockFragment
        }
      }
    }
  }
  ${Qs}
`,
  Pg = Fe`
  query getCoin($coinId: UtxoId!) {
    coin(utxoId: $coinId) {
      ...coinFragment
    }
  }
  ${ef}
`,
  Lg = Fe`
  query getCoins(
    $filter: CoinFilterInput!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    coins(filter: $filter, after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          ...coinFragment
        }
      }
    }
  }
  ${ef}
`,
  Fg = Fe`
  query getResourcesToSpend(
    $owner: Address!
    $queryPerAsset: [SpendQueryElementInput!]!
    $excludedIds: ExcludeInput
  ) {
    resourcesToSpend(owner: $owner, queryPerAsset: $queryPerAsset, excludedIds: $excludedIds) {
      ...coinFragment
      ...messageFragment
    }
  }
  ${ef}
  ${_l}
`,
  Ug = Fe`
  query getContract($contractId: ContractId!) {
    contract(id: $contractId) {
      bytecode
      id
    }
  }
`,
  qg = Fe`
  query getContractBalance($contract: ContractId!, $asset: AssetId!) {
    contractBalance(contract: $contract, asset: $asset) {
      ...contractBalanceFragment
    }
  }
  ${Ig}
`,
  Bg = Fe`
  query getBalance($owner: Address!, $assetId: AssetId!) {
    balance(owner: $owner, assetId: $assetId) {
      ...balanceFragment
    }
  }
  ${Tl}
`,
  Vg = Fe`
  query getBalances(
    $filter: BalanceFilterInput!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    balances(filter: $filter, after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          ...balanceFragment
        }
      }
    }
  }
  ${Tl}
`,
  jg = Fe`
  query getMessages($owner: Address!, $after: String, $before: String, $first: Int, $last: Int) {
    messages(owner: $owner, after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          ...messageFragment
        }
      }
    }
  }
  ${_l}
`,
  zg = Fe`
  query getMessageProof($transactionId: TransactionId!, $messageId: MessageId!) {
    messageProof(transactionId: $transactionId, messageId: $messageId) {
      ...messageProofFragment
    }
  }
  ${xg}
`,
  Gg = Fe`
  mutation dryRun($encodedTransaction: HexString!, $utxoValidation: Boolean) {
    dryRun(tx: $encodedTransaction, utxoValidation: $utxoValidation) {
      ...receiptFragment
    }
  }
  ${xl}
`,
  Jg = Fe`
  mutation submit($encodedTransaction: HexString!) {
    submit(tx: $encodedTransaction) {
      id
    }
  }
`,
  Hg = Fe`
  mutation startSession {
    startSession
  }
`,
  Wg = Fe`
  mutation endSession($sessionId: ID!) {
    endSession(id: $sessionId)
  }
`,
  Kg = Fe`
  mutation execute($sessionId: ID!, $op: String!) {
    execute(id: $sessionId, op: $op)
  }
`,
  Qg = Fe`
  mutation reset($sessionId: ID!) {
    reset(id: $sessionId)
  }
`,
  Yg = (t, e, r) => t();
function Xg(t, e = Yg) {
  return {
    getVersion(r, n) {
      return e((i) => t.request(Ng, r, { ...n, ...i }), 'getVersion', 'query');
    },
    getInfo(r, n) {
      return e((i) => t.request(Sg, r, { ...n, ...i }), 'getInfo', 'query');
    },
    getChain(r, n) {
      return e((i) => t.request(Mg, r, { ...n, ...i }), 'getChain', 'query');
    },
    getTransaction(r, n) {
      return e((i) => t.request(Ag, r, { ...n, ...i }), 'getTransaction', 'query');
    },
    getTransactionWithReceipts(r, n) {
      return e((i) => t.request(Og, r, { ...n, ...i }), 'getTransactionWithReceipts', 'query');
    },
    getTransactions(r, n) {
      return e((i) => t.request(Rg, r, { ...n, ...i }), 'getTransactions', 'query');
    },
    getTransactionsByOwner(r, n) {
      return e((i) => t.request(Dg, r, { ...n, ...i }), 'getTransactionsByOwner', 'query');
    },
    getBlock(r, n) {
      return e((i) => t.request($g, r, { ...n, ...i }), 'getBlock', 'query');
    },
    getBlockWithTransactions(r, n) {
      return e((i) => t.request(kg, r, { ...n, ...i }), 'getBlockWithTransactions', 'query');
    },
    getBlocks(r, n) {
      return e((i) => t.request(Cg, r, { ...n, ...i }), 'getBlocks', 'query');
    },
    getCoin(r, n) {
      return e((i) => t.request(Pg, r, { ...n, ...i }), 'getCoin', 'query');
    },
    getCoins(r, n) {
      return e((i) => t.request(Lg, r, { ...n, ...i }), 'getCoins', 'query');
    },
    getResourcesToSpend(r, n) {
      return e((i) => t.request(Fg, r, { ...n, ...i }), 'getResourcesToSpend', 'query');
    },
    getContract(r, n) {
      return e((i) => t.request(Ug, r, { ...n, ...i }), 'getContract', 'query');
    },
    getContractBalance(r, n) {
      return e((i) => t.request(qg, r, { ...n, ...i }), 'getContractBalance', 'query');
    },
    getBalance(r, n) {
      return e((i) => t.request(Bg, r, { ...n, ...i }), 'getBalance', 'query');
    },
    getBalances(r, n) {
      return e((i) => t.request(Vg, r, { ...n, ...i }), 'getBalances', 'query');
    },
    getMessages(r, n) {
      return e((i) => t.request(jg, r, { ...n, ...i }), 'getMessages', 'query');
    },
    getMessageProof(r, n) {
      return e((i) => t.request(zg, r, { ...n, ...i }), 'getMessageProof', 'query');
    },
    dryRun(r, n) {
      return e((i) => t.request(Gg, r, { ...n, ...i }), 'dryRun', 'mutation');
    },
    submit(r, n) {
      return e((i) => t.request(Jg, r, { ...n, ...i }), 'submit', 'mutation');
    },
    startSession(r, n) {
      return e((i) => t.request(Hg, r, { ...n, ...i }), 'startSession', 'mutation');
    },
    endSession(r, n) {
      return e((i) => t.request(Wg, r, { ...n, ...i }), 'endSession', 'mutation');
    },
    execute(r, n) {
      return e((i) => t.request(Kg, r, { ...n, ...i }), 'execute', 'mutation');
    },
    reset(r, n) {
      return e((i) => t.request(Qg, r, { ...n, ...i }), 'reset', 'mutation');
    },
  };
}
var Zg = (t) => 'utxoId' in t,
  Ka = (t) => 'id' in t,
  ey = (t) => {
    var e, r, n, i, a;
    switch (t.type) {
      case Ht.Coin: {
        let o = Y((e = t.predicate) != null ? e : '0x'),
          c = Y((r = t.predicateData) != null ? r : '0x');
        return {
          type: Ht.Coin,
          utxoID: { transactionId: ee(Y(t.id).slice(0, 32)), outputIndex: Y(t.id)[32] },
          owner: ee(t.owner),
          amount: G(t.amount),
          assetId: ee(t.assetId),
          txPointer: {
            blockHeight: Fr(Y(t.txPointer).slice(0, 8)),
            txIndex: Fr(Y(t.txPointer).slice(8, 16)),
          },
          witnessIndex: t.witnessIndex,
          maturity: (n = t.maturity) != null ? n : 0,
          predicateLength: o.length,
          predicateDataLength: c.length,
          predicate: ee(o),
          predicateData: ee(c),
        };
      }
      case Ht.Contract:
        return {
          type: Ht.Contract,
          utxoID: { transactionId: $t, outputIndex: 0 },
          balanceRoot: $t,
          stateRoot: $t,
          txPointer: {
            blockHeight: Fr(Y(t.txPointer).slice(0, 8)),
            txIndex: Fr(Y(t.txPointer).slice(8, 16)),
          },
          contractID: ee(t.contractId),
        };
      case Ht.Message: {
        let o = Y((i = t.predicate) != null ? i : '0x'),
          c = Y((a = t.predicateData) != null ? a : '0x');
        return {
          type: Ht.Message,
          sender: ee(t.sender),
          recipient: ee(t.recipient),
          amount: G(t.amount),
          nonce: G(t.nonce),
          witnessIndex: t.witnessIndex,
          dataLength: t.data.length,
          predicateLength: o.length,
          predicateDataLength: c.length,
          data: ee(t.data),
          predicate: ee(o),
          predicateData: ee(c),
        };
      }
      default:
        throw new Error('Invalid Input type');
    }
  },
  ty = (t) => {
    switch (t.type) {
      case Qe.Coin:
        return { type: Qe.Coin, to: ee(t.to), amount: G(t.amount), assetId: ee(t.assetId) };
      case Qe.Contract:
        return { type: Qe.Contract, inputIndex: t.inputIndex, balanceRoot: $t, stateRoot: $t };
      case Qe.Message:
        return { type: Qe.Message, recipient: ee(t.recipient), amount: G(t.amount) };
      case Qe.Change:
        return { type: Qe.Change, to: ee(t.to), amount: G(0), assetId: ee(t.assetId) };
      case Qe.Variable:
        return { type: Qe.Variable, to: $t, amount: G(0), assetId: $t };
      case Qe.ContractCreated:
        return {
          type: Qe.ContractCreated,
          contractId: ee(t.contractId),
          stateRoot: ee(t.stateRoot),
        };
      default:
        throw new Error('Invalid Output type');
    }
  },
  ry = (t) => t.type === Wt.Revert && t.val.toString('hex') === Xb,
  ny = (t) =>
    t.type === Wt.Panic &&
    t.contractId !== '0x0000000000000000000000000000000000000000000000000000000000000000',
  iy = (t) =>
    t.reduce(
      (e, r) => (
        ry(r) && e.missingOutputVariables.push(r), ny(r) && e.missingOutputContractIds.push(r), e
      ),
      { missingOutputVariables: [], missingOutputContractIds: [] }
    ),
  Il = (t, e, r) => G(Math.ceil(t.toNumber() / r.toNumber()) * e.toNumber()),
  ay = (t) => {
    let e = t.find((r) => r.type === Wt.ScriptResult);
    return e && e.type === Wt.ScriptResult ? e.gasUsed : G(0);
  },
  tc = ({ receipts: t, gasPrice: e, margin: r }) => {
    let n = Fh(ay(t), r || 1),
      i = Il(n, e, vl);
    return { gasUsed: n, fee: i };
  },
  sy = 'https://fuellabs.github.io/block-explorer-v2',
  oy = (t, e) =>
    `${{ address: 'address', txId: 'transaction', blockNumber: 'block' }[t] || t}/${e}`,
  C5 = ({ blockExplorerUrl: t, path: e, providerUrl: r, address: n, txId: i, blockNumber: a }) => {
    let o = t || sy,
      c = [
        { key: 'address', value: n },
        { key: 'txId', value: i },
        { key: 'blockNumber', value: a },
      ],
      h = c.filter((F) => !!F.value).map(({ key: F, value: j }) => ({ key: F, value: j }));
    if (h.length > 1)
      throw new Error(
        `Only one of the following can be passed in to buildBlockExplorerUrl: ${c
          .map((F) => F.key)
          .join(', ')}`
      );
    if (h.length === 0 && !e)
      throw new Error(
        `One of the following must be passed in to buildBlockExplorerUrl: ${c
          .map((F) => F.key)
          .join(', ')}, path`
      );
    if (e && h.length > 0) {
      let F = c.map(({ key: j }) => j).join(', ');
      throw new Error(
        `You cannot pass in a path to buildBlockExplorerUrl along with any of the following: ${F}`
      );
    }
    let m = /^\/|\/$/gm,
      w = e ? e.replace(m, '') : oy(h[0].key, h[0].value),
      x = o.replace(m, ''),
      T = r?.replace(m, ''),
      I = T ? encodeURIComponent(T) : void 0,
      M = x.match(/^https?:\/\//) ? '' : 'https://',
      k = T != null && T.match(/^https?:\/\//) ? '' : 'https://';
    return `${M}${x}/${w}${I ? `?providerUrl=${k}${I}` : ''}`;
  };
function rc(t) {
  return (
    Object.keys(t).forEach((e) => {
      switch (t[e].constructor.name) {
        case 'Uint8Array':
          t[e] = ee(t[e]);
          break;
        case 'Array':
          t[e] = rc(t[e]);
          break;
        case 'BN':
          t[e] = t[e].toHex();
          break;
        case 'Address':
          t[e] = t[e].toB256();
          break;
        case 'Object':
          t[e] = rc(t[e]);
          break;
      }
    }),
    t
  );
}
function cy(t) {
  return rc(Qn(t));
}
function fy(t) {
  return new Promise((e) => {
    setTimeout(() => {
      e(!0);
    }, t);
  });
}
var uy = (t) => {
    let e = new Uint8Array(32);
    return e.set(Y(t)), e;
  },
  dy = (t) => {
    let e, r;
    return (
      Array.isArray(t) ? ((e = t[0]), (r = t[1])) : ((e = t.key), (r = t.value)),
      { key: ee(e), value: ee(uy(r)) }
    );
  },
  ly = (t) => {
    let e = Y(t);
    return { data: ee(e), dataLength: e.length };
  },
  Ru = { bytes: Y('0x24000000'), encodeScriptData: () => new Uint8Array(0) },
  hy = {
    bytes: Y('0x5040C0105D44C0064C40001124000000'),
    encodeScriptData: () => new Uint8Array(0),
  },
  py = class extends Error {
    constructor() {
      super(...arguments),
        (this.name = 'ChangeOutputCollisionError'),
        (this.message =
          'A ChangeOutput with the same "assetId" already exists for a different "to" address');
    }
  },
  my = class extends Error {
    constructor(t) {
      super(),
        (this.index = t),
        (this.name = 'NoWitnessAtIndexError'),
        (this.message = `Witness at index "${t}" was not found`);
    }
  },
  vy = class extends Error {
    constructor(t) {
      super(),
        (this.owner = t),
        (this.name = 'NoWitnessByOwnerError'),
        (this.message = `A witness for the given owner "${t}" was not found`);
    }
  },
  Nl = class {
    constructor({
      gasPrice: t,
      gasLimit: e,
      maturity: r,
      inputs: n,
      outputs: i,
      witnesses: a,
    } = {}) {
      (this.inputs = []),
        (this.outputs = []),
        (this.witnesses = []),
        (this.gasPrice = G(t ?? 0)),
        (this.gasLimit = G(e ?? 0)),
        (this.maturity = r ?? 0),
        (this.inputs = [...(n ?? [])]),
        (this.outputs = [...(i ?? [])]),
        (this.witnesses = [...(a ?? [])]);
    }
    getBaseTransaction() {
      var t, e, r, n, i, a;
      let o = (e = (t = this.inputs) == null ? void 0 : t.map(ey)) != null ? e : [],
        c = (n = (r = this.outputs) == null ? void 0 : r.map(ty)) != null ? n : [],
        h = (a = (i = this.witnesses) == null ? void 0 : i.map(ly)) != null ? a : [];
      return {
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        maturity: this.maturity,
        inputs: o,
        outputs: c,
        witnesses: h,
        inputsCount: o.length,
        outputsCount: c.length,
        witnessesCount: h.length,
      };
    }
    toTransactionBytes() {
      return new ma().encode(this.toTransaction());
    }
    pushInput(t) {
      return this.inputs.push(t), this.inputs.length - 1;
    }
    pushOutput(t) {
      return this.outputs.push(t), this.outputs.length - 1;
    }
    createWitness() {
      return this.witnesses.push('0x'), this.witnesses.length - 1;
    }
    updateWitnessByOwner(t, e) {
      let r = this.getCoinInputWitnessIndexByOwner(t);
      typeof r == 'number' && this.updateWitness(r, e);
    }
    updateWitness(t, e) {
      if (!this.witnesses[t]) throw new my(t);
      this.witnesses[t] = e;
    }
    getCoinInputs() {
      return this.inputs.filter((t) => t.type === Ht.Coin);
    }
    getCoinOutputs() {
      return this.outputs.filter((t) => t.type === Qe.Coin);
    }
    getChangeOutputs() {
      return this.outputs.filter((t) => t.type === Qe.Change);
    }
    getCoinInputWitnessIndexByOwner(t) {
      var e, r;
      let n = ci(t);
      return (r =
        (e = this.inputs.find((i) => i.type === Ht.Coin && ee(i.owner) === n.toB256())) == null
          ? void 0
          : e.witnessIndex) != null
        ? r
        : null;
    }
    updateWitnessByCoinInputOwner(t, e) {
      let r = this.getCoinInputWitnessIndexByOwner(t);
      if (!r) throw new vy(ci(t));
      this.updateWitness(r, e);
    }
    addResource(t) {
      let e = Ka(t) ? t.owner : t.recipient,
        r = Ka(t) ? t.assetId : yr,
        n = Ka(t) ? Ht.Coin : Ht.Message,
        i = this.getCoinInputWitnessIndexByOwner(e);
      typeof i != 'number' && (i = this.createWitness()),
        this.pushInput(
          Ka(t)
            ? {
                type: n,
                ...t,
                owner: t.owner.toB256(),
                witnessIndex: i,
                txPointer: '0x00000000000000000000000000000000',
              }
            : {
                type: n,
                ...t,
                sender: t.sender.toB256(),
                recipient: t.recipient.toB256(),
                witnessIndex: i,
                txPointer: '0x00000000000000000000000000000000',
              }
        );
      let a = this.getChangeOutputs().find((o) => ee(o.assetId) === r);
      if (a && ee(a.to) !== e.toB256()) throw new py();
      a || this.pushOutput({ type: Qe.Change, to: e.toB256(), assetId: r });
    }
    addResources(t) {
      t.forEach((e) => this.addResource(e));
    }
    addCoinOutput(t, e, r = yr) {
      this.pushOutput({ type: Qe.Coin, to: ci(t).toB256(), amount: e, assetId: r });
    }
    addCoinOutputs(t, e) {
      e.map(El).forEach((r) => {
        this.pushOutput({
          type: Qe.Coin,
          to: ci(t).toB256(),
          amount: r.amount,
          assetId: r.assetId,
        });
      });
    }
    byteSize() {
      return this.toTransactionBytes().length;
    }
    chargeableByteSize() {
      let t = this.witnesses.reduce((e, r) => e + Y(r).length, 0);
      return G(this.toTransactionBytes().length - t);
    }
    calculateFee() {
      let t = Il(this.gasLimit, this.gasPrice, vl);
      return { assetId: yr, amount: t.isZero() ? G(1) : t };
    }
    addMessage(t) {
      let e = this.getCoinInputWitnessIndexByOwner(t.recipient);
      typeof e != 'number' && (e = this.createWitness()),
        this.pushInput({
          type: Ht.Message,
          ...t,
          sender: t.sender.toBytes(),
          recipient: t.recipient.toBytes(),
          witnessIndex: e,
        });
    }
    addMessages(t) {
      t.forEach((e) => this.addMessage(e));
    }
    toJSON() {
      return cy(this);
    }
  },
  mi = class extends Nl {
    constructor({ script: e, scriptData: r, ...n } = {}) {
      super(n),
        (this.type = _n.Script),
        (this.script = Y(e ?? Ru.bytes)),
        (this.scriptData = Y(r ?? Ru.encodeScriptData()));
    }
    static from(e) {
      return e instanceof this ? e : new this(e);
    }
    toTransaction() {
      var e, r;
      let n = Y((e = this.script) != null ? e : '0x'),
        i = Y((r = this.scriptData) != null ? r : '0x');
      return {
        type: _n.Script,
        ...super.getBaseTransaction(),
        scriptLength: n.length,
        scriptDataLength: i.length,
        receiptsRoot: $t,
        script: ee(n),
        scriptData: ee(i),
      };
    }
    getContractInputs() {
      return this.inputs.filter((e) => e.type === Ht.Contract);
    }
    getContractOutputs() {
      return this.outputs.filter((e) => e.type === Qe.Contract);
    }
    getVariableOutputs() {
      return this.outputs.filter((e) => e.type === Qe.Variable);
    }
    setScript(e, r) {
      (this.script = e.bytes),
        (this.scriptData = e.encodeScriptData(r)),
        this.bytesOffset === void 0 && (this.bytesOffset = this.scriptData.byteLength);
    }
    addVariableOutputs(e = 1) {
      let r = e;
      for (; r; ) this.pushOutput({ type: Qe.Variable }), (r -= 1);
      return this.outputs.length - 1;
    }
    addMessageOutputs(e = 1) {
      let r = e;
      for (; r; )
        this.pushOutput({
          type: Qe.Message,
          recipient: '0x0000000000000000000000000000000000000000000000000000000000000000',
          amount: 0,
        }),
          (r -= 1);
      return this.outputs.length - 1;
    }
    addContract(e) {
      let r = ci(e);
      if (this.getContractInputs().find((i) => i.contractId === r.toB256())) return;
      let n = super.pushInput({
        type: Ht.Contract,
        contractId: r.toB256(),
        txPointer: '0x00000000000000000000000000000000',
      });
      this.pushOutput({ type: Qe.Contract, inputIndex: n });
    }
  },
  Du = class extends Nl {
    constructor({ bytecodeWitnessIndex: e, salt: r, storageSlots: n, ...i } = {}) {
      super(i),
        (this.type = _n.Create),
        (this.bytecodeWitnessIndex = e ?? 0),
        (this.salt = ee(r ?? $t)),
        (this.storageSlots = [...(n ?? [])]);
    }
    static from(e) {
      return e instanceof this ? e : new this(e);
    }
    toTransaction() {
      var e, r;
      let n = this.getBaseTransaction(),
        i = this.bytecodeWitnessIndex,
        a = (r = (e = this.storageSlots) == null ? void 0 : e.map(dy)) != null ? r : [];
      return {
        type: _n.Create,
        ...n,
        bytecodeLength: n.witnesses[i].dataLength / 4,
        bytecodeWitnessIndex: i,
        storageSlotsCount: a.length,
        salt: this.salt ? ee(this.salt) : $t,
        storageSlots: a,
      };
    }
    getContractCreatedOutputs() {
      return this.outputs.filter((e) => e.type === Qe.ContractCreated);
    }
    addContractCreatedOutput(e, r) {
      this.pushOutput({ type: Qe.ContractCreated, contractId: e, stateRoot: r });
    }
  },
  Dr = (t) => {
    if (t instanceof mi || t instanceof Du) return t;
    switch (t.type) {
      case _n.Script:
        return mi.from(t);
      case _n.Create:
        return Du.from(t);
      default:
        throw new Error(`Unknown transaction type: ${t.type}`);
    }
  },
  by = 5e3,
  gy = 500,
  $u = (t) => {
    let e = new ml().decode(Y(t.rawPayload), 0)[0];
    switch (e.type) {
      case Wt.ReturnData:
        return { ...e, data: t.data };
      case Wt.LogData:
        return { ...e, data: t.data };
      default:
        return e;
    }
  },
  yy = class {
    constructor(t, e) {
      (this.gasUsed = G(0)), (this.attempts = 0), (this.id = t), (this.provider = e);
    }
    async fetch() {
      var t;
      let { transaction: e } = await this.provider.operations.getTransactionWithReceipts({
        transactionId: this.id,
      });
      if (!e) throw new Error('No Transaction was received from the client.');
      let r = (t = new ma().decode(Y(e.rawPayload), 0)) == null ? void 0 : t[0];
      return { transactionWithReceipts: e, transaction: r };
    }
    async waitForResult() {
      var t, e;
      let { transactionWithReceipts: r, transaction: n } = await this.fetch();
      switch ((t = r.status) == null ? void 0 : t.type) {
        case 'SubmittedStatus':
          return (
            (this.attempts += 1), await fy(Math.min(gy * this.attempts, by)), this.waitForResult()
          );
        case 'FailureStatus': {
          let i = r.receipts.map($u),
            { gasUsed: a, fee: o } = tc({ receipts: i, gasPrice: G(r?.gasPrice) });
          return (
            (this.gasUsed = a),
            {
              status: { type: 'failure', reason: r.status.reason },
              receipts: i,
              transactionId: this.id,
              blockId: r.status.block.id,
              time: r.status.time,
              gasUsed: a,
              fee: o,
              transaction: n,
            }
          );
        }
        case 'SuccessStatus': {
          let i = ((e = r.receipts) == null ? void 0 : e.map($u)) || [],
            { gasUsed: a, fee: o } = tc({ receipts: i, gasPrice: G(r?.gasPrice) });
          return {
            status: { type: 'success', programState: r.status.programState },
            receipts: i,
            transactionId: this.id,
            blockId: r.status.block.id,
            time: r.status.time,
            gasUsed: a,
            fee: o,
            transaction: n,
          };
        }
        default:
          throw new Error('Invalid Transaction status');
      }
    }
    async wait() {
      let t = await this.waitForResult();
      if (t.status.type === 'failure') throw new Error(`Transaction failed: ${t.status.reason}`);
      return t;
    }
  },
  wy = 10,
  No = (t) => {
    let e = new ml().decode(Y(t.rawPayload), 0)[0];
    switch (e.type) {
      case Wt.ReturnData:
        return { ...e, data: t.data };
      case Wt.LogData:
        return { ...e, data: t.data };
      default:
        return e;
    }
  },
  Ey = (t) => {
    let { name: e, baseChainHeight: r, peerCount: n, consensusParameters: i, latestBlock: a } = t;
    return {
      name: e,
      baseChainHeight: G(r),
      peerCount: n,
      consensusParameters: {
        contractMaxSize: G(i.contractMaxSize),
        maxInputs: G(i.maxInputs),
        maxOutputs: G(i.maxOutputs),
        maxWitnesses: G(i.maxWitnesses),
        maxGasPerTx: G(i.maxGasPerTx),
        maxScriptLength: G(i.maxScriptLength),
        maxScriptDataLength: G(i.maxScriptDataLength),
        maxStorageSlots: G(i.maxStorageSlots),
        maxPredicateLength: G(i.maxPredicateLength),
        maxPredicateDataLength: G(i.maxPredicateDataLength),
        gasPriceFactor: G(i.gasPriceFactor),
        gasPerByte: G(i.gasPerByte),
        maxMessageDataLength: G(i.maxMessageDataLength),
      },
      latestBlock: {
        id: a.id,
        height: G(a.header.height),
        time: a.header.time,
        transactions: a.transactions.map((o) => ({ id: o.id })),
      },
    };
  },
  xy = (t) => ({ minGasPrice: G(t.minGasPrice), nodeVersion: t.nodeVersion }),
  _y = class {
    constructor(e) {
      (this.url = e),
        (this.addMissingVariables = async (r) => {
          let n = 0,
            i = 0,
            a = 0;
          if (r.type !== _n.Create)
            do {
              let o = ee(r.toTransactionBytes()),
                { dryRun: c } = await this.operations.dryRun({
                  encodedTransaction: o,
                  utxoValidation: !1,
                }),
                h = c.map(No),
                { missingOutputVariables: m, missingOutputContractIds: w } = iy(h);
              if (((n = m.length), (i = w.length), n === 0 && i === 0)) return;
              r.addVariableOutputs(n),
                w.forEach(({ contractId: x }) => r.addContract(Ct.fromString(x))),
                (a += 1);
            } while (a < wy);
        }),
        (this.operations = this.createOperations(e));
    }
    createOperations(e) {
      this.url = e;
      let r = new bl.GraphQLClient(e);
      return Xg(r);
    }
    connect(e) {
      this.operations = this.createOperations(e);
    }
    async getVersion() {
      let {
        nodeInfo: { nodeVersion: e },
      } = await this.operations.getVersion();
      return e;
    }
    async getNetwork() {
      return { name: 'fuelv2', chainId: 3735928559 };
    }
    async getBlockNumber() {
      let { chain: e } = await this.operations.getChain();
      return G(e.latestBlock.header.height, 10);
    }
    async getNodeInfo() {
      let { nodeInfo: e } = await this.operations.getInfo();
      return xy(e);
    }
    async getChain() {
      let { chain: e } = await this.operations.getChain();
      return Ey(e);
    }
    async sendTransaction(e) {
      let r = Dr(e);
      await this.addMissingVariables(r);
      let n = ee(r.toTransactionBytes()),
        { gasUsed: i, minGasPrice: a } = await this.getTransactionCost(r, 0);
      if (G(i).gt(G(r.gasLimit)))
        throw new Error(`gasLimit(${r.gasLimit}) is lower than the required (${i})`);
      if (G(a).gt(G(r.gasPrice)))
        throw new Error(`gasPrice(${r.gasPrice}) is lower than the required ${a}`);
      let {
        submit: { id: o },
      } = await this.operations.submit({ encodedTransaction: n });
      return new yy(o, this);
    }
    async call(e, { utxoValidation: r } = {}) {
      let n = Dr(e);
      await this.addMissingVariables(n);
      let i = ee(n.toTransactionBytes()),
        { dryRun: a } = await this.operations.dryRun({
          encodedTransaction: i,
          utxoValidation: r || !1,
        });
      return { receipts: a.map(No) };
    }
    async simulate(e) {
      let r = Dr(e);
      await this.addMissingVariables(r);
      let n = ee(r.toTransactionBytes()),
        { dryRun: i } = await this.operations.dryRun({ encodedTransaction: n, utxoValidation: !0 });
      return { receipts: i.map(No) };
    }
    async getTransactionCost(e, r = 0.2) {
      let n = Dr(Qn(e)),
        { minGasPrice: i } = await this.getNodeInfo(),
        a = Lh(n.gasPrice, i),
        o = 1 + r;
      (n.gasLimit = aa), (n.gasPrice = G(0));
      let { receipts: c } = await this.call(n),
        { gasUsed: h, fee: m } = tc({ gasPrice: a, receipts: c, margin: o });
      return { minGasPrice: i, gasPrice: a, gasUsed: h, fee: m };
    }
    async getCoins(e, r, n) {
      return (
        await this.operations.getCoins({
          first: 10,
          ...n,
          filter: { owner: e.toB256(), assetId: r && ee(r) },
        })
      ).coins.edges
        .map((i) => i.node)
        .map((i) => ({
          id: i.utxoId,
          assetId: i.assetId,
          amount: G(i.amount),
          owner: Ct.fromAddressOrString(i.owner),
          status: i.status,
          maturity: G(i.maturity).toNumber(),
          blockCreated: G(i.blockCreated),
        }));
    }
    async getResourcesToSpend(e, r, n) {
      var i, a;
      let o = {
        messages: ((i = n?.messages) == null ? void 0 : i.map((c) => ee(c))) || [],
        utxos: ((a = n?.utxos) == null ? void 0 : a.map((c) => ee(c))) || [],
      };
      return (
        await this.operations.getResourcesToSpend({
          owner: e.toB256(),
          queryPerAsset: r.map(El).map(({ assetId: c, amount: h, max: m }) => ({
            assetId: ee(c),
            amount: h.toString(10),
            max: m ? m.toString(10) : void 0,
          })),
          excludedIds: o,
        })
      ).resourcesToSpend
        .flat()
        .map((c) =>
          Zg(c)
            ? {
                id: c.utxoId,
                amount: G(c.amount),
                status: c.status,
                assetId: c.assetId,
                owner: Ct.fromAddressOrString(c.owner),
                maturity: G(c.maturity).toNumber(),
                blockCreated: G(c.blockCreated),
              }
            : {
                sender: Ct.fromAddressOrString(c.sender),
                recipient: Ct.fromAddressOrString(c.recipient),
                nonce: G(c.nonce),
                amount: G(c.amount),
                data: pa.decodeData(c.data),
                daHeight: G(c.daHeight),
                fuelBlockSpend: G(c.fuelBlockSpend),
              }
        );
    }
    async getBlock(e) {
      let r;
      typeof e == 'number'
        ? (r = { blockHeight: G(e).toString(10) })
        : e === 'latest'
        ? (r = { blockHeight: (await this.getBlockNumber()).toString(10) })
        : (r = { blockId: G(e).toString(10) });
      let { block: n } = await this.operations.getBlock(r);
      return n
        ? {
            id: n.id,
            height: G(n.header.height),
            time: n.header.time,
            transactionIds: n.transactions.map((i) => i.id),
          }
        : null;
    }
    async getBlockWithTransactions(e) {
      let r;
      typeof e == 'number'
        ? (r = { blockHeight: G(e).toString(10) })
        : e === 'latest'
        ? (r = { blockHeight: (await this.getBlockNumber()).toString() })
        : (r = { blockId: e });
      let { block: n } = await this.operations.getBlockWithTransactions(r);
      return n
        ? {
            id: n.id,
            height: G(n.header.height, 10),
            time: n.header.time,
            transactionIds: n.transactions.map((i) => i.id),
            transactions: n.transactions.map((i) => {
              var a;
              return (a = new ma().decode(Y(i.rawPayload), 0)) == null ? void 0 : a[0];
            }),
          }
        : null;
    }
    async getTransaction(e) {
      var r;
      let { transaction: n } = await this.operations.getTransaction({ transactionId: e });
      return n ? ((r = new ma().decode(Y(n.rawPayload), 0)) == null ? void 0 : r[0]) : null;
    }
    async getContract(e) {
      let { contract: r } = await this.operations.getContract({ contractId: e });
      return r || null;
    }
    async getContractBalance(e, r) {
      let { contractBalance: n } = await this.operations.getContractBalance({
        contract: e.toB256(),
        asset: ee(r),
      });
      return G(n.amount, 10);
    }
    async getBalance(e, r) {
      let { balance: n } = await this.operations.getBalance({ owner: e.toB256(), assetId: ee(r) });
      return G(n.amount, 10);
    }
    async getBalances(e, r) {
      return (
        await this.operations.getBalances({ first: 10, ...r, filter: { owner: e.toB256() } })
      ).balances.edges
        .map((n) => n.node)
        .map((n) => ({ assetId: n.assetId, amount: G(n.amount) }));
    }
    async getMessages(e, r) {
      return (
        await this.operations.getMessages({ first: 10, ...r, owner: e.toB256() })
      ).messages.edges
        .map((n) => n.node)
        .map((n) => ({
          sender: Ct.fromAddressOrString(n.sender),
          recipient: Ct.fromAddressOrString(n.recipient),
          nonce: G(n.nonce),
          amount: G(n.amount),
          data: pa.decodeData(n.data),
          daHeight: G(n.daHeight),
          fuelBlockSpend: G(n.fuelBlockSpend),
        }));
    }
    async getMessageProof(e, r) {
      let n = await this.operations.getMessageProof({ transactionId: e, messageId: r });
      return n.messageProof
        ? {
            proofSet: n.messageProof.proofSet,
            proofIndex: G(n.messageProof.proofIndex),
            sender: Ct.fromAddressOrString(n.messageProof.sender),
            recipient: Ct.fromAddressOrString(n.messageProof.recipient),
            nonce: n.messageProof.nonce,
            amount: G(n.messageProof.amount),
            data: n.messageProof.data,
            signature: n.messageProof.signature,
            header: {
              id: n.messageProof.header.id,
              daHeight: G(n.messageProof.header.daHeight),
              transactionsCount: G(n.messageProof.header.transactionsCount),
              outputMessagesCount: G(n.messageProof.header.outputMessagesCount),
              transactionsRoot: n.messageProof.header.transactionsRoot,
              outputMessagesRoot: n.messageProof.header.outputMessagesRoot,
              height: G(n.messageProof.header.height),
              prevRoot: n.messageProof.header.prevRoot,
              time: n.messageProof.header.time,
              applicationHash: n.messageProof.header.applicationHash,
            },
          }
        : null;
    }
    async buildSpendPredicate(e, r, n, i, a = yr, o, c) {
      let h = await this.getResourcesToSpend(e.address, [[r, a]]),
        m = { fundTransaction: !0, ...o },
        w = new mi({ gasLimit: aa, ...m }),
        x;
      i && e.types && (x = new us().encode(e.types, i));
      let T = h.reduce(
        (M, k) => (
          w.addResource({ ...k, predicate: e.bytes, predicateData: x }),
          (w.outputs = []),
          M.add(k.amount)
        ),
        G(0)
      );
      w.addCoinOutput(n, T, a);
      let I = [];
      if ((m.fundTransaction && I.push(w.calculateFee()), I.length && c)) {
        let M = await this.getResourcesToSpend(c, I);
        w.addResources(M);
      }
      return w;
    }
    async submitSpendPredicate(e, r, n, i, a = yr, o, c) {
      var h;
      let m = await this.buildSpendPredicate(e, r, n, i, a, o, c);
      try {
        return await (await this.sendTransaction(m)).waitForResult();
      } catch (w) {
        throw (((h = w?.response) == null ? void 0 : h.errors) || []).some(({ message: x }) =>
          x.includes('unexpected block execution error TransactionValidity(InvalidPredicate')
        )
          ? new Error('Invalid Predicate')
          : w;
      }
    }
  },
  Ty = '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
function Di(t) {
  return Zt(t);
}
var Iy = class {
    constructor(t, e, r, n, i, a = 0) {
      (this.left = t),
        (this.right = e),
        (this.parent = r),
        (this.hash = n),
        (this.data = i),
        (this.index = a);
    }
  },
  ku = Iy;
function Ny(t) {
  return Di('0x00'.concat(t.slice(2)));
}
function Sy(t, e) {
  return Di('0x01'.concat(t.slice(2)).concat(e.slice(2)));
}
function My(t) {
  if (!t.length) return Ty;
  let e = [];
  for (let a = 0; a < t.length; a += 1) {
    let o = Ny(t[a]);
    e.push(new ku(-1, -1, -1, o, t[a]));
  }
  let r = e,
    n = (e.length + 1) >> 1,
    i = e.length & 1;
  for (;;) {
    let a = 0;
    for (; a < n - i; a += 1) {
      let o = a << 1,
        c = Sy(r[o].hash, r[o + 1].hash);
      e[a] = new ku(r[o].index, r[o + 1].index, -1, c, '');
    }
    if ((i === 1 && (e[a] = r[a << 1]), n === 1)) break;
    (i = n & 1), (n = (n + 1) >> 1), (r = e);
  }
  return e[0].hash;
}
var Ay = '0x00',
  Sl = '0x01';
function Oy(t, e) {
  let r = '0x00'.concat(t.slice(2)).concat(Di(e).slice(2));
  return [Di(r), r];
}
function ni(t, e) {
  let r = '0x01'.concat(t.slice(2)).concat(e.slice(2));
  return [Di(r), r];
}
function So(t) {
  let e = Sl.length;
  return ['0x'.concat(t.slice(e, e + 64)), '0x'.concat(t.slice(e + 64))];
}
function Ry(t) {
  let e = Sl.length;
  return ['0x'.concat(t.slice(e, e + 64)), '0x'.concat(t.slice(e + 64))];
}
function Mo(t) {
  return t.slice(0, 4) === Ay;
}
var Dy = class {
    constructor(e, r, n, i, a) {
      (this.SideNodes = e),
        (this.NonMembershipLeafData = r),
        (this.BitMask = n),
        (this.NumSideNodes = i),
        (this.SiblingData = a);
    }
  },
  $y = Dy,
  ky = class {
    constructor(e, r, n) {
      (this.SideNodes = e), (this.NonMembershipLeafData = r), (this.SiblingData = n);
    }
  },
  Cy = ky,
  Yt = '0x0000000000000000000000000000000000000000000000000000000000000000';
function ui(t, e) {
  let r = t.slice(2),
    n = '0x'.concat(r.slice(Math.floor(e / 8) * 2, Math.floor(e / 8) * 2 + 2));
  return (Number(n) & (1 << (8 - 1 - (e % 8)))) > 0 ? 1 : 0;
}
function Py(t) {
  let e = 0,
    r = t.length - 1,
    n = t;
  for (; e < r; ) ([n[e], n[r]] = [n[r], n[e]]), (e += 1), (r -= 1);
  return n;
}
function Ly(t, e) {
  let r = 0;
  for (let n = 0; n < 256 && ui(t, n) === ui(e, n); n += 1) r += 1;
  return r;
}
function Fy(t) {
  let e = [],
    r = [],
    n;
  for (let i = 0; i < t.SideNodes.length; i += 1)
    (n = t.SideNodes[i]), n === Yt ? e.push(0) : (r.push(n), e.push(1));
  return new $y(r, t.NonMembershipLeafData, e, t.SideNodes.length, t.SiblingData);
}
var Uy = class {
    constructor() {
      let e = {};
      (this.ms = e), (this.root = Yt), (this.ms[this.root] = Yt);
    }
    get(e) {
      return this.ms[e];
    }
    set(e, r) {
      this.ms[e] = r;
    }
    setRoot(e) {
      this.root = e;
    }
    sideNodesForRoot(e, r) {
      let n = [];
      if (r === Yt) return [n, Yt, '', ''];
      let i = this.get(r);
      if (Mo(i)) return [n, r, i, ''];
      let a,
        o,
        c = '',
        h = '';
      for (let w = 0; w < 256; w += 1) {
        if (
          (([a, o] = Ry(i)),
          ui(e, w) === 1 ? ((h = a), (c = o)) : ((h = o), (c = a)),
          n.push(h),
          c === Yt)
        ) {
          i = '';
          break;
        }
        if (((i = this.get(c)), Mo(i))) break;
      }
      let m = this.get(h);
      return [Py(n), c, i, m];
    }
    deleteWithSideNodes(e, r, n, i) {
      if (n === Yt) return this.root;
      let [a] = So(i);
      if (a !== e) return this.root;
      let o = '',
        c = '',
        h = '',
        m = '',
        w = !1;
      for (let x = 0; x < r.length; x += 1)
        if (r[x] !== '') {
          if (((h = r[x]), c === ''))
            if (((m = this.get(h)), Mo(m))) {
              (o = h), (c = h);
              continue;
            } else (c = Yt), (w = !0);
          (!w && h === Yt) ||
            (w || (w = !0),
            ui(e, r.length - 1 - x) === 1 ? ([o, c] = ni(h, c)) : ([o, c] = ni(c, h)),
            this.set(o, c),
            (c = o));
        }
      return o === '' && (o = Yt), o;
    }
    updateWithSideNodes(e, r, n, i, a) {
      let o, c;
      this.set(Di(r), r), ([o, c] = Oy(e, r)), this.set(o, c), (c = o);
      let h;
      if (i === Yt) h = 256;
      else {
        let [m] = So(a);
        h = Ly(e, m);
      }
      h !== 256 &&
        (ui(e, h) === 1 ? ([o, c] = ni(i, c)) : ([o, c] = ni(c, i)), this.set(o, c), (c = o));
      for (let m = 0; m < 256; m += 1) {
        let w,
          x = 256 - n.length;
        if (m - x < 0 || n[m - x] === '')
          if (h !== 256 && h > 256 - 1 - m) w = Yt;
          else continue;
        else w = n[m - x];
        ui(e, 256 - 1 - m) === 1 ? ([o, c] = ni(w, c)) : ([o, c] = ni(c, w)),
          this.set(o, c),
          (c = o);
      }
      return o;
    }
    update(e, r) {
      let [n, i, a] = this.sideNodesForRoot(e, this.root),
        o;
      r === Yt
        ? (o = this.deleteWithSideNodes(e, n, i, a))
        : (o = this.updateWithSideNodes(e, r, n, i, a)),
        this.setRoot(o);
    }
    delete(e) {
      this.update(e, Yt);
    }
    prove(e) {
      let [r, n, i, a] = this.sideNodesForRoot(e, this.root),
        o = [];
      for (let h = 0; h < r.length; h += 1) r[h] !== '' && o.push(r[h]);
      let c = '';
      if (n !== Yt) {
        let [h] = So(i);
        h !== e && (c = i);
      }
      return new Cy(o, c, a);
    }
    proveCompacted(e) {
      let r = this.prove(e);
      return Fy(r);
    }
  },
  qy = Uy,
  By = [
    'Success',
    'Revert',
    'OutOfGas',
    'TransactionValidity',
    'MemoryOverflow',
    'ArithmeticOverflow',
    'ContractNotFound',
    'MemoryOwnership',
    'NotEnoughBalance',
    'ExpectedInternalContext',
    'AssetIdNotFound',
    'InputNotFound',
    'OutputNotFound',
    'WitnessNotFound',
    'TransactionMaturity',
    'InvalidMetadataIdentifier',
    'MalformedCallStructure',
    'ReservedRegisterNotWritable',
    'ErrorFlag',
    'InvalidImmediateValue',
    'ExpectedCoinInput',
    'MaxMemoryAccess',
    'MemoryWriteOverlap',
    'ContractNotInInputs',
    'InternalBalanceOverflow',
    'ContractMaxSize',
    'ExpectedUnallocatedStack',
    'MaxStaticContractsReached',
    'TransferAmountCannotBeZero',
    'ExpectedOutputVariable',
    'ExpectedParentInternalContext',
    'IllegalJump',
    'NonZeroMessageOutputRecipient',
    'ZeroedMessageOutputRecipient',
  ],
  Ao = 'https://docs.rs/fuel-asm/latest/fuel_asm/enum.PanicReason.html',
  Vy = (t) => (By.includes(t) ? t : 'unknown'),
  jy = (t) => {
    if (t?.type === 'failure') {
      let e = Vy(t.reason);
      return { doc: e !== 'unknown' ? `${Ao}#variant.${e}` : Ao, reason: e };
    }
    return { doc: Ao, reason: 'unknown' };
  },
  Cu = (t, e) => (typeof e == 'bigint' ? e.toString() : e),
  zy = (t, e) => `${t === $t ? 'script' : t}: ${e}`,
  Gy = class extends Error {
    constructor(e, r, n) {
      let i = JSON.stringify(jy(e.status), null, 2),
        a = e.receipts.filter((m) => m.type === Wt.Revert),
        o = a.length
          ? `Reverts:
${a.map(({ id: m, ...w }) => zy(m, `${w.val} ${JSON.stringify(w, Cu)}`)).join(`
`)}`
          : null,
        c = n.length
          ? `Logs:
${JSON.stringify(n, null, 2)}`
          : null,
        h = `Receipts:
${JSON.stringify(
  e.receipts.map(({ type: m, ...w }) => ({ type: Wt[m], ...w })),
  Cu,
  2
)}`;
      super(`${r}

${i}

${
  o
    ? `${o}

`
    : ''
}${
        c
          ? `${c}

`
          : ''
      }${h}`),
        (this.logs = n);
    }
  };
function Jy(t) {
  let e = [...t.receipts],
    r = e.pop();
  if (!r) throw new Error('Expected scriptResultReceipt');
  if (r.type !== Wt.ScriptResult) throw new Error(`Invalid scriptResultReceipt type: ${r.type}`);
  let n = e.pop();
  if (!n) throw new Error('Expected returnReceipt');
  if (n.type !== Wt.Return && n.type !== Wt.ReturnData && n.type !== Wt.Revert)
    throw new Error(`Invalid returnReceipt type: ${n.type}`);
  return {
    code: r.result,
    gasUsed: r.gasUsed,
    receipts: e,
    scriptResultReceipt: r,
    returnReceipt: n,
    callResult: t,
  };
}
var Ml = class {
  constructor(e, r, n) {
    (this.bytes = Y(e)), (this.scriptDataEncoder = r), (this.scriptResultDecoder = n);
  }
  getScriptDataOffset() {
    return Pm + Lm + new ft(this.bytes.length).encodedLength;
  }
  getArgOffset() {
    return this.getScriptDataOffset() + km + Eo + Cm + Eo + Eo;
  }
  encodeScriptData(e) {
    return this.scriptDataEncoder(e);
  }
  decodeCallResult(e, r = []) {
    try {
      let n = Jy(e);
      return this.scriptResultDecoder(n);
    } catch (n) {
      throw new Gy(e, n.message, r);
    }
  }
};
new Ml(
  '0x24000000',
  () => new Uint8Array(0),
  () => {}
);
var Hy = Object.defineProperty,
  Wy = (t, e) => {
    for (var r in e) Hy(t, r, { get: e[r], enumerable: !0 });
  },
  Ky = {};
Wy(Ky, {
  assert: () => Xy,
  getContractId: () => Yy,
  getContractRoot: () => Al,
  getContractStorageRoot: () => Qy,
  includeHexPrefix: () => Zy,
});
var Al = (t) => {
    let e = [];
    for (let r = 0; r < t.length; r += 8) {
      let n = new Uint8Array(8);
      n.set(t.slice(r, r + 8)), e.push(n);
    }
    return My(e.map((r) => ee(r)));
  },
  Qy = (t) => {
    let e = new qy();
    return t.forEach(({ key: r, value: n }) => e.update(r, n)), e.root;
  },
  Yy = (t, e, r) => {
    let n = Al(Y(t));
    return Zt(de(['0x4655454C', e, n, r]));
  };
function Xy(t, e) {
  if (!t) throw new Error(e);
}
var Zy = (t, e) => ee(t, { ...e, allowMissingPrefix: !0 }),
  Pu = [
    {
      type: 'function',
      inputs: [
        {
          name: 'script_data',
          type: 'struct ScriptData',
          components: [
            {
              name: 'calls',
              type: '[enum Option; 5]',
              components: [
                {
                  name: '__array_element',
                  type: 'enum Option',
                  components: [
                    { name: 'None', type: '()', components: [], typeArguments: null },
                    {
                      name: 'Some',
                      type: 'struct MulticallCall',
                      components: [
                        {
                          name: 'contract_id',
                          type: 'struct ContractId',
                          components: [
                            { name: 'value', type: 'b256', components: null, typeArguments: null },
                          ],
                          typeArguments: null,
                        },
                        { name: 'fn_selector', type: 'u64', components: null, typeArguments: null },
                        {
                          name: 'fn_arg',
                          type: 'enum CallValue',
                          components: [
                            { name: 'Value', type: 'u64', components: null, typeArguments: null },
                            {
                              name: 'Data',
                              type: '(u64, u64)',
                              components: [
                                {
                                  name: '__tuple_element',
                                  type: 'u64',
                                  components: null,
                                  typeArguments: null,
                                },
                                {
                                  name: '__tuple_element',
                                  type: 'u64',
                                  components: null,
                                  typeArguments: null,
                                },
                              ],
                              typeArguments: null,
                            },
                          ],
                          typeArguments: null,
                        },
                        {
                          name: 'parameters',
                          type: 'struct CallParameters',
                          components: [
                            {
                              name: 'amount',
                              type: 'enum Option',
                              components: [
                                { name: 'None', type: '()', components: [], typeArguments: null },
                                {
                                  name: 'Some',
                                  type: 'u64',
                                  components: null,
                                  typeArguments: null,
                                },
                              ],
                              typeArguments: [
                                { name: 'T', type: 'u64', components: null, typeArguments: null },
                              ],
                            },
                            {
                              name: 'asset_id',
                              type: 'enum Option',
                              components: [
                                { name: 'None', type: '()', components: [], typeArguments: null },
                                {
                                  name: 'Some',
                                  type: 'struct ContractId',
                                  components: [
                                    {
                                      name: 'value',
                                      type: 'b256',
                                      components: null,
                                      typeArguments: null,
                                    },
                                  ],
                                  typeArguments: null,
                                },
                              ],
                              typeArguments: [
                                {
                                  name: 'T',
                                  type: 'struct ContractId',
                                  components: [
                                    {
                                      name: 'value',
                                      type: 'b256',
                                      components: null,
                                      typeArguments: null,
                                    },
                                  ],
                                  typeArguments: null,
                                },
                              ],
                            },
                            {
                              name: 'gas',
                              type: 'enum Option',
                              components: [
                                { name: 'None', type: '()', components: [], typeArguments: null },
                                {
                                  name: 'Some',
                                  type: 'u64',
                                  components: null,
                                  typeArguments: null,
                                },
                              ],
                              typeArguments: [
                                { name: 'T', type: 'u64', components: null, typeArguments: null },
                              ],
                            },
                          ],
                          typeArguments: null,
                        },
                      ],
                      typeArguments: null,
                    },
                  ],
                  typeArguments: [
                    {
                      name: 'T',
                      type: 'struct MulticallCall',
                      components: [
                        {
                          name: 'contract_id',
                          type: 'struct ContractId',
                          components: [
                            { name: 'value', type: 'b256', components: null, typeArguments: null },
                          ],
                          typeArguments: null,
                        },
                        { name: 'fn_selector', type: 'u64', components: null, typeArguments: null },
                        {
                          name: 'fn_arg',
                          type: 'enum CallValue',
                          components: [
                            { name: 'Value', type: 'u64', components: null, typeArguments: null },
                            {
                              name: 'Data',
                              type: '(u64, u64)',
                              components: [
                                {
                                  name: '__tuple_element',
                                  type: 'u64',
                                  components: null,
                                  typeArguments: null,
                                },
                                {
                                  name: '__tuple_element',
                                  type: 'u64',
                                  components: null,
                                  typeArguments: null,
                                },
                              ],
                              typeArguments: null,
                            },
                          ],
                          typeArguments: null,
                        },
                        {
                          name: 'parameters',
                          type: 'struct CallParameters',
                          components: [
                            {
                              name: 'amount',
                              type: 'enum Option',
                              components: [
                                { name: 'None', type: '()', components: [], typeArguments: null },
                                {
                                  name: 'Some',
                                  type: 'u64',
                                  components: null,
                                  typeArguments: null,
                                },
                              ],
                              typeArguments: [
                                { name: 'T', type: 'u64', components: null, typeArguments: null },
                              ],
                            },
                            {
                              name: 'asset_id',
                              type: 'enum Option',
                              components: [
                                { name: 'None', type: '()', components: [], typeArguments: null },
                                {
                                  name: 'Some',
                                  type: 'struct ContractId',
                                  components: [
                                    {
                                      name: 'value',
                                      type: 'b256',
                                      components: null,
                                      typeArguments: null,
                                    },
                                  ],
                                  typeArguments: null,
                                },
                              ],
                              typeArguments: [
                                {
                                  name: 'T',
                                  type: 'struct ContractId',
                                  components: [
                                    {
                                      name: 'value',
                                      type: 'b256',
                                      components: null,
                                      typeArguments: null,
                                    },
                                  ],
                                  typeArguments: null,
                                },
                              ],
                            },
                            {
                              name: 'gas',
                              type: 'enum Option',
                              components: [
                                { name: 'None', type: '()', components: [], typeArguments: null },
                                {
                                  name: 'Some',
                                  type: 'u64',
                                  components: null,
                                  typeArguments: null,
                                },
                              ],
                              typeArguments: [
                                { name: 'T', type: 'u64', components: null, typeArguments: null },
                              ],
                            },
                          ],
                          typeArguments: null,
                        },
                      ],
                      typeArguments: null,
                    },
                  ],
                },
              ],
              typeArguments: null,
            },
          ],
          typeArguments: null,
        },
      ],
      name: 'main',
      outputs: [
        {
          name: '',
          type: 'struct ScriptReturn',
          components: [
            {
              name: 'call_returns',
              type: '[enum Option; 5]',
              components: [
                {
                  name: '__array_element',
                  type: 'enum Option',
                  components: [
                    { name: 'None', type: '()', components: [], typeArguments: null },
                    {
                      name: 'Some',
                      type: 'enum CallValue',
                      components: [
                        { name: 'Value', type: 'u64', components: null, typeArguments: null },
                        {
                          name: 'Data',
                          type: '(u64, u64)',
                          components: [
                            {
                              name: '__tuple_element',
                              type: 'u64',
                              components: null,
                              typeArguments: null,
                            },
                            {
                              name: '__tuple_element',
                              type: 'u64',
                              components: null,
                              typeArguments: null,
                            },
                          ],
                          typeArguments: null,
                        },
                      ],
                      typeArguments: null,
                    },
                  ],
                  typeArguments: [
                    {
                      name: 'T',
                      type: 'enum CallValue',
                      components: [
                        { name: 'Value', type: 'u64', components: null, typeArguments: null },
                        {
                          name: 'Data',
                          type: '(u64, u64)',
                          components: [
                            {
                              name: '__tuple_element',
                              type: 'u64',
                              components: null,
                              typeArguments: null,
                            },
                            {
                              name: '__tuple_element',
                              type: 'u64',
                              components: null,
                              typeArguments: null,
                            },
                          ],
                          typeArguments: null,
                        },
                      ],
                      typeArguments: null,
                    },
                  ],
                },
              ],
              typeArguments: null,
            },
          ],
          typeArguments: null,
        },
      ],
    },
  ],
  e4 =
    '0x90000004470000000000000000000cd45dfcc00110fff3001a5c5000910005b861440006724002d0164114005b40100d360000006158000c61440001504175305f5d10a6504175305d4570a6504171385f5d1027504171385d417027134100007340001a9000001f1a445000910000085d43f0005f4500009000002b504171385d4170271341004073400024900000291a445000910000085d43f0015f4500009000002b360000001a44000050417528504175286041100850457528504170085041700860411008504170085d4100001341000073400037900000396144000c9000003b360000001a440000504174305f5d1086504174305d4570865d43f00210450440504174485f5d108961440001504175405f5d10a8504175405d4570a8504171405f5d1028504171405d417028134100007340004f900000541a445000910000085d43f0005f45000090000060504171405d41702813410040734000599000005e1a445000910000085d43f0015f45000090000060360000001a44000050417538504175386041100850457538504170005041700060411008504170005d410000134100007340006c9000006e6144000690000078504170005d410000134100407340007390000076360000001a44000090000078360000001a4400005d43f00220451400504173805f5d1070504174485d497089504173805d4170701a445000910000105f4520005f450001504175a8504175a8604110105d47f00326440000504470015041726050417260604110a026000000504070011a445000910000105f4500005f440001504174785041747860411010504173505f5c006a5d47f0025d43f00412451400504173005f5d1060504173505d45706a504173005d41706016411400734000a4900000b150496000504173505d41706a5545009010452440504170785041707860411090504170785d41000013410040734001249000031f504972601a445000910000a050411000604120a05041748850417488604110a026000000504070011a445000910000105f4500005f44000150417198504171986041101050517198505574885d454001504174085f5d10815d4540015d43f00310450440504173c85f5d10795d4140005d4d4001504573c85d457079154914c0734800d3900000e12644000050487001504573a85f5d207515453000734400da900000de504573a85d457075284504c0900000de504173a85d417075900000e15f510000504173c85d4170795f5100015d454000504174085d417081104504405d43f0032845540050557198505174785d41400113410000734000f1900000f35d4150019000011c5d455001504174105f5d10825d4550015d41400110450440504173d05f5d107a5d4150005d4d5001504573d05d45707a154914c073480102900001102644000050487001504573b05f5d207615453000734401099000010d504573b05d457076284504c09000010d504173b05d417076900001105f550000504173d05d41707a5f5500015d4940005d455000504174105d417082104504405d414001284524005d417082504171985d450000504171985d41000125450000504574885d43f003254500005041707850450008504171a8504171a860411088504171a850450028504171085041710860411018504171085d41000013410000734001339000013f504171085d450002504175485f5d10a9504175485d4970a91a445000910000185d43f0005f4500005f4520029000017b504171085d41000013410040734001449000016050417108504100085d450000504173e85f5d107d50417108504100085d450001504173785f5d106f504175a85d450000504173e85d41707d10450440504173785d41706f1a485000910000105f4910005f4900011a445000910000185d43f0015f45000050411008604120109000017b50417108504100085d450000504173f05f5d107e50417108504100085d450001504173905f5d1072504175a85d450000504173f05d41707e10450440504173905d4170721a485000910000105f4910005f4900011a445000910000185d43f0015f4500005041100860412010504173085041730860411018504171a850550000504171a85d51000450457308504171a8504d0040504170105041701060411018504170105d410000134100007340018d90000194504170105d450002504175505f5d10aa504175505d4570aa900001a8504170105d4100001341004073400199900001a150417010504100085d450000504174385f5d1087504174385d457087900001a850417010504100085d450000504174505f5d108a504174505d45708a504173205f5d1064504173205d4970641a4450009100003050411000604150205f4540045f45200550417230504172306041103050453000504170285041702860411010504170285d41000013410040734001be900001c5504170285d450001504171485f5d1029504171485d457029900001cd504170285d41000013410000734001ca900001cc1a440000900001cd1a440000504171505f5d102a50453010504170385041703860411028504170385d41000013410040734001d8900001df504170385045000850417358504173586041102050497358900001f1504170385d41000013410000734001e4900001eb1a485000910000205d47f00a104513005041200060411020900001f11a485000910000205d47f00a10451300504120006041102050417158504171586041202050453038504170605041706060411010504170605d41000013410040734001fd90000204504170605d450001504173405f5d1068504173405d4570689000020c504170605d41000013410000734002099000020b1a44a0009000020c1a44a000504173485f5d1069504d7230504171505d49702a50457158504173485d4170692d4d24501a44e000504170705f5d100e504170705d41700e134100007340021d900002281a44d000504175785f5d10af504175785d4570af1a485000910000185d43f0005f4900005f4910029000023d504170705d45700e504173885f5d10711a44d000504174585f5d108b504174585d49708b504173885d4170711a445000910000105f4520005f4500011a485000910000185d43f0015f490000504120086041101050417460504174606041201850457460504171205041712060411018504171205d410000134100007340024990000255504171205d450002504175a05f5d10b4504175a05d4970b41a445000910000185d43f0005f4500005f45200290000309504171205d410000134100407340025a900002b250417120504100085d450000504174285f5d108550417120504100085d450001504173985f5d1073504174285d497085504173985d4170731a445000910000105f4520005f45000150417178504171786041101050557478505171785d4140011341000073400275900002775d455001900002a15d455001504174185f5d10835d4550015d41400110450440504173d85f5d107b5d4150005d4d5001504573d85d45707b154914c073480286900002942644000050487001504573b85f5d2077154530007344028d90000291504573b85d457077284504c090000291504173b85d417077900002945f550000504173d85d41707b5f5500015d4940005d455000504174185d417083104504405d41400128452400504174185d457083504173f85f5d107f504173f85d45707f504173985d4170731a485000910000105f4910005f4900011a445000910000185d43f0015f45000050411008604120109000030950417120504100085d450000504174405f5d108850417120504100085d450001504173a05f5d1074504174405d497088504173a05d4170741a445000910000105f4520005f45000150417188504171886041101050557478505171885d41400113410000734002cd900002cf5d455001900002f95d455001504174205f5d10845d4550015d41400110450440504173e05f5d107c5d4150005d4d5001504573e05d45707c154914c0734802de900002ec2644000050487001504573c05f5d207815453000734402e5900002e9504573c05d457078284504c0900002e9504173c05d417078900002ec5f550000504173e05d41707c5f5500015d4940005d455000504174205d417084104504405d41400128452400504174205d457084504174005f5d1080504174005d457080504173a05d4170741a485000910000105f4910005f4900011a445000910000185d43f0015f4500005041100860412010504173285041732860411018504973281a445000910000205d43f0015f450000504110086041201850417558504175586041102050457260504173505d41706a5549002010491480504575585d43f009284914009000032e504175801a445000910000205d43f0005f450000504175806041102050457260504173505d41706a5549002010491480504575805d43f0092849140050417350504173505d41706a104014005f5d006a9000009d470000000000000000000000000000000000000100000000000002d000000000000000a00000000000000090000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000cfc';
new Ml(
  e4,
  (t) => {
    let e = Pu[0].inputs,
      r = new us().getCoder(e[0]),
      n = r.coders.calls.length;
    if (t.length > n) throw new Error(`At most ${n} calls are supported`);
    let i = new Uint8Array(),
      a = [];
    for (let h = 0; h < n; h += 1) {
      let m = t[h],
        w;
      if (m) {
        let x = Y(m.data),
          T = x.slice(0, 8),
          I = x.slice(8, 16).some((F) => F === 1),
          M = x.slice(16),
          k;
        I
          ? ((k = { Data: [i.length, M.length] }), (i = de([i, M])))
          : (k = { Value: new V().decode(M, 0)[0] }),
          (w = {
            contract_id: { value: m.contractId },
            fn_selector: new V().decode(T, 0)[0],
            fn_arg: k,
            parameters: {
              amount: m.amount ? G(m.amount) : void 0,
              asset_id: m.assetId ? { value: m.assetId } : void 0,
              gas: m.gas ? G(m.gas) : void 0,
            },
          });
      } else w = void 0;
      a.push(w);
    }
    let o = { calls: a },
      c = r.encode(o);
    return de([c, i]);
  },
  (t) => {
    if (Fr(t.code) !== 0) throw new Error(`Script returned non-zero result: ${t.code}`);
    if (t.returnReceipt.type !== Wt.ReturnData)
      throw new Error('Expected returnReceipt to be a ReturnDataReceipt');
    let e = Y(t.returnReceipt.data),
      r = Pu[0].outputs,
      n = new us().getCoder(r[0]),
      [i, a] = n.decode(e, 0),
      o = e.slice(a),
      c = [];
    return (
      i.call_returns.forEach((h, m) => {
        if (h)
          if (h.Data) {
            let [w, x] = h.Data;
            c[m] = o.slice(Fr(w), Fr(w) + Fr(x));
          } else c[m] = new V().encode(h.Value);
      }),
      c
    );
  }
);
new Le(Yn.FUELS);
function t4(t) {
  return Zt(vn(t, 'utf-8'));
}
function r4(t) {
  let e = Dr(t).toTransaction();
  return (
    e.type === _n.Script && (e.receiptsRoot = $t),
    (e.inputs = e.inputs.map((r) => {
      let n = Qn(r);
      switch (n.type) {
        case Ht.Coin:
          return n;
        case Ht.Contract:
          return (
            (n.utxoID = { transactionId: $t, outputIndex: 0 }),
            (n.balanceRoot = $t),
            (n.stateRoot = $t),
            n
          );
        default:
          return n;
      }
    })),
    (e.outputs = e.outputs.map((r) => {
      let n = Qn(r);
      switch (n.type) {
        case Qe.Contract:
          return (n.balanceRoot = $t), (n.stateRoot = $t), n;
        case Qe.Change:
          return (n.amount = G(0)), n;
        case Qe.Variable:
          return (n.to = $t), (n.amount = G(0)), (n.assetId = $t), n;
        default:
          return n;
      }
    })),
    (e.witnessesCount = 0),
    (e.witnesses = []),
    Zt(new ma().encode(e))
  );
}
function n4(t) {
  return Zt(t);
}
new Le(Yn.FUELS);
var Ol = {};
const i4 = 'elliptic',
  a4 = '6.5.4',
  s4 = 'EC cryptography',
  o4 = 'lib/elliptic.js',
  c4 = ['lib'],
  f4 = {
    lint: 'eslint lib test',
    'lint:fix': 'npm run lint -- --fix',
    unit: 'istanbul test _mocha --reporter=spec test/index.js',
    test: 'npm run lint && npm run unit',
    version: 'grunt dist && git add dist/',
  },
  u4 = { type: 'git', url: 'git@github.com:indutny/elliptic' },
  d4 = ['EC', 'Elliptic', 'curve', 'Cryptography'],
  l4 = 'Fedor Indutny <fedor@indutny.com>',
  h4 = 'MIT',
  p4 = { url: 'https://github.com/indutny/elliptic/issues' },
  m4 = 'https://github.com/indutny/elliptic',
  v4 = {
    brfs: '^2.0.2',
    coveralls: '^3.1.0',
    eslint: '^7.6.0',
    grunt: '^1.2.1',
    'grunt-browserify': '^5.3.0',
    'grunt-cli': '^1.3.2',
    'grunt-contrib-connect': '^3.0.0',
    'grunt-contrib-copy': '^1.0.0',
    'grunt-contrib-uglify': '^5.0.0',
    'grunt-mocha-istanbul': '^5.0.2',
    'grunt-saucelabs': '^9.0.1',
    istanbul: '^0.4.5',
    mocha: '^8.0.1',
  },
  b4 = {
    'bn.js': '^4.11.9',
    brorand: '^1.1.0',
    'hash.js': '^1.0.0',
    'hmac-drbg': '^1.0.1',
    inherits: '^2.0.4',
    'minimalistic-assert': '^1.0.1',
    'minimalistic-crypto-utils': '^1.0.1',
  },
  g4 = {
    name: i4,
    version: a4,
    description: s4,
    main: o4,
    files: c4,
    scripts: f4,
    repository: u4,
    keywords: d4,
    author: l4,
    license: h4,
    bugs: p4,
    homepage: m4,
    devDependencies: v4,
    dependencies: b4,
  };
var mr = {},
  Cr = {},
  y4 = {
    get exports() {
      return Cr;
    },
    set exports(t) {
      Cr = t;
    },
  };
(function (t) {
  (function (e, r) {
    function n(N, p) {
      if (!N) throw new Error(p || 'Assertion failed');
    }
    function i(N, p) {
      N.super_ = p;
      var l = function () {};
      (l.prototype = p.prototype), (N.prototype = new l()), (N.prototype.constructor = N);
    }
    function a(N, p, l) {
      if (a.isBN(N)) return N;
      (this.negative = 0),
        (this.words = null),
        (this.length = 0),
        (this.red = null),
        N !== null &&
          ((p === 'le' || p === 'be') && ((l = p), (p = 10)),
          this._init(N || 0, p || 10, l || 'be'));
    }
    typeof e == 'object' ? (e.exports = a) : (r.BN = a), (a.BN = a), (a.wordSize = 26);
    var o;
    try {
      typeof window < 'u' && typeof window.Buffer < 'u' ? (o = window.Buffer) : (o = cc.Buffer);
    } catch {}
    (a.isBN = function (p) {
      return p instanceof a
        ? !0
        : p !== null &&
            typeof p == 'object' &&
            p.constructor.wordSize === a.wordSize &&
            Array.isArray(p.words);
    }),
      (a.max = function (p, l) {
        return p.cmp(l) > 0 ? p : l;
      }),
      (a.min = function (p, l) {
        return p.cmp(l) < 0 ? p : l;
      }),
      (a.prototype._init = function (p, l, s) {
        if (typeof p == 'number') return this._initNumber(p, l, s);
        if (typeof p == 'object') return this._initArray(p, l, s);
        l === 'hex' && (l = 16),
          n(l === (l | 0) && l >= 2 && l <= 36),
          (p = p.toString().replace(/\s+/g, ''));
        var f = 0;
        p[0] === '-' && (f++, (this.negative = 1)),
          f < p.length &&
            (l === 16
              ? this._parseHex(p, f, s)
              : (this._parseBase(p, l, f), s === 'le' && this._initArray(this.toArray(), l, s)));
      }),
      (a.prototype._initNumber = function (p, l, s) {
        p < 0 && ((this.negative = 1), (p = -p)),
          p < 67108864
            ? ((this.words = [p & 67108863]), (this.length = 1))
            : p < 4503599627370496
            ? ((this.words = [p & 67108863, (p / 67108864) & 67108863]), (this.length = 2))
            : (n(p < 9007199254740992),
              (this.words = [p & 67108863, (p / 67108864) & 67108863, 1]),
              (this.length = 3)),
          s === 'le' && this._initArray(this.toArray(), l, s);
      }),
      (a.prototype._initArray = function (p, l, s) {
        if ((n(typeof p.length == 'number'), p.length <= 0))
          return (this.words = [0]), (this.length = 1), this;
        (this.length = Math.ceil(p.length / 3)), (this.words = new Array(this.length));
        for (var f = 0; f < this.length; f++) this.words[f] = 0;
        var v,
          y,
          E = 0;
        if (s === 'be')
          for (f = p.length - 1, v = 0; f >= 0; f -= 3)
            (y = p[f] | (p[f - 1] << 8) | (p[f - 2] << 16)),
              (this.words[v] |= (y << E) & 67108863),
              (this.words[v + 1] = (y >>> (26 - E)) & 67108863),
              (E += 24),
              E >= 26 && ((E -= 26), v++);
        else if (s === 'le')
          for (f = 0, v = 0; f < p.length; f += 3)
            (y = p[f] | (p[f + 1] << 8) | (p[f + 2] << 16)),
              (this.words[v] |= (y << E) & 67108863),
              (this.words[v + 1] = (y >>> (26 - E)) & 67108863),
              (E += 24),
              E >= 26 && ((E -= 26), v++);
        return this.strip();
      });
    function c(N, p) {
      var l = N.charCodeAt(p);
      return l >= 65 && l <= 70 ? l - 55 : l >= 97 && l <= 102 ? l - 87 : (l - 48) & 15;
    }
    function h(N, p, l) {
      var s = c(N, l);
      return l - 1 >= p && (s |= c(N, l - 1) << 4), s;
    }
    a.prototype._parseHex = function (p, l, s) {
      (this.length = Math.ceil((p.length - l) / 6)), (this.words = new Array(this.length));
      for (var f = 0; f < this.length; f++) this.words[f] = 0;
      var v = 0,
        y = 0,
        E;
      if (s === 'be')
        for (f = p.length - 1; f >= l; f -= 2)
          (E = h(p, l, f) << v),
            (this.words[y] |= E & 67108863),
            v >= 18 ? ((v -= 18), (y += 1), (this.words[y] |= E >>> 26)) : (v += 8);
      else {
        var g = p.length - l;
        for (f = g % 2 === 0 ? l + 1 : l; f < p.length; f += 2)
          (E = h(p, l, f) << v),
            (this.words[y] |= E & 67108863),
            v >= 18 ? ((v -= 18), (y += 1), (this.words[y] |= E >>> 26)) : (v += 8);
      }
      this.strip();
    };
    function m(N, p, l, s) {
      for (var f = 0, v = Math.min(N.length, l), y = p; y < v; y++) {
        var E = N.charCodeAt(y) - 48;
        (f *= s), E >= 49 ? (f += E - 49 + 10) : E >= 17 ? (f += E - 17 + 10) : (f += E);
      }
      return f;
    }
    (a.prototype._parseBase = function (p, l, s) {
      (this.words = [0]), (this.length = 1);
      for (var f = 0, v = 1; v <= 67108863; v *= l) f++;
      f--, (v = (v / l) | 0);
      for (var y = p.length - s, E = y % f, g = Math.min(y, y - E) + s, u = 0, b = s; b < g; b += f)
        (u = m(p, b, b + f, l)),
          this.imuln(v),
          this.words[0] + u < 67108864 ? (this.words[0] += u) : this._iaddn(u);
      if (E !== 0) {
        var d = 1;
        for (u = m(p, b, p.length, l), b = 0; b < E; b++) d *= l;
        this.imuln(d), this.words[0] + u < 67108864 ? (this.words[0] += u) : this._iaddn(u);
      }
      this.strip();
    }),
      (a.prototype.copy = function (p) {
        p.words = new Array(this.length);
        for (var l = 0; l < this.length; l++) p.words[l] = this.words[l];
        (p.length = this.length), (p.negative = this.negative), (p.red = this.red);
      }),
      (a.prototype.clone = function () {
        var p = new a(null);
        return this.copy(p), p;
      }),
      (a.prototype._expand = function (p) {
        for (; this.length < p; ) this.words[this.length++] = 0;
        return this;
      }),
      (a.prototype.strip = function () {
        for (; this.length > 1 && this.words[this.length - 1] === 0; ) this.length--;
        return this._normSign();
      }),
      (a.prototype._normSign = function () {
        return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
      }),
      (a.prototype.inspect = function () {
        return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
      });
    var w = [
        '',
        '0',
        '00',
        '000',
        '0000',
        '00000',
        '000000',
        '0000000',
        '00000000',
        '000000000',
        '0000000000',
        '00000000000',
        '000000000000',
        '0000000000000',
        '00000000000000',
        '000000000000000',
        '0000000000000000',
        '00000000000000000',
        '000000000000000000',
        '0000000000000000000',
        '00000000000000000000',
        '000000000000000000000',
        '0000000000000000000000',
        '00000000000000000000000',
        '000000000000000000000000',
        '0000000000000000000000000',
      ],
      x = [
        0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5,
      ],
      T = [
        0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7,
        19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881,
        64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
        243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176,
      ];
    (a.prototype.toString = function (p, l) {
      (p = p || 10), (l = l | 0 || 1);
      var s;
      if (p === 16 || p === 'hex') {
        s = '';
        for (var f = 0, v = 0, y = 0; y < this.length; y++) {
          var E = this.words[y],
            g = (((E << f) | v) & 16777215).toString(16);
          (v = (E >>> (24 - f)) & 16777215),
            v !== 0 || y !== this.length - 1 ? (s = w[6 - g.length] + g + s) : (s = g + s),
            (f += 2),
            f >= 26 && ((f -= 26), y--);
        }
        for (v !== 0 && (s = v.toString(16) + s); s.length % l !== 0; ) s = '0' + s;
        return this.negative !== 0 && (s = '-' + s), s;
      }
      if (p === (p | 0) && p >= 2 && p <= 36) {
        var u = x[p],
          b = T[p];
        s = '';
        var d = this.clone();
        for (d.negative = 0; !d.isZero(); ) {
          var _ = d.modn(b).toString(p);
          (d = d.idivn(b)), d.isZero() ? (s = _ + s) : (s = w[u - _.length] + _ + s);
        }
        for (this.isZero() && (s = '0' + s); s.length % l !== 0; ) s = '0' + s;
        return this.negative !== 0 && (s = '-' + s), s;
      }
      n(!1, 'Base should be between 2 and 36');
    }),
      (a.prototype.toNumber = function () {
        var p = this.words[0];
        return (
          this.length === 2
            ? (p += this.words[1] * 67108864)
            : this.length === 3 && this.words[2] === 1
            ? (p += 4503599627370496 + this.words[1] * 67108864)
            : this.length > 2 && n(!1, 'Number can only safely store up to 53 bits'),
          this.negative !== 0 ? -p : p
        );
      }),
      (a.prototype.toJSON = function () {
        return this.toString(16);
      }),
      (a.prototype.toBuffer = function (p, l) {
        return n(typeof o < 'u'), this.toArrayLike(o, p, l);
      }),
      (a.prototype.toArray = function (p, l) {
        return this.toArrayLike(Array, p, l);
      }),
      (a.prototype.toArrayLike = function (p, l, s) {
        var f = this.byteLength(),
          v = s || Math.max(1, f);
        n(f <= v, 'byte array longer than desired length'),
          n(v > 0, 'Requested array length <= 0'),
          this.strip();
        var y = l === 'le',
          E = new p(v),
          g,
          u,
          b = this.clone();
        if (y) {
          for (u = 0; !b.isZero(); u++) (g = b.andln(255)), b.iushrn(8), (E[u] = g);
          for (; u < v; u++) E[u] = 0;
        } else {
          for (u = 0; u < v - f; u++) E[u] = 0;
          for (u = 0; !b.isZero(); u++) (g = b.andln(255)), b.iushrn(8), (E[v - u - 1] = g);
        }
        return E;
      }),
      Math.clz32
        ? (a.prototype._countBits = function (p) {
            return 32 - Math.clz32(p);
          })
        : (a.prototype._countBits = function (p) {
            var l = p,
              s = 0;
            return (
              l >= 4096 && ((s += 13), (l >>>= 13)),
              l >= 64 && ((s += 7), (l >>>= 7)),
              l >= 8 && ((s += 4), (l >>>= 4)),
              l >= 2 && ((s += 2), (l >>>= 2)),
              s + l
            );
          }),
      (a.prototype._zeroBits = function (p) {
        if (p === 0) return 26;
        var l = p,
          s = 0;
        return (
          l & 8191 || ((s += 13), (l >>>= 13)),
          l & 127 || ((s += 7), (l >>>= 7)),
          l & 15 || ((s += 4), (l >>>= 4)),
          l & 3 || ((s += 2), (l >>>= 2)),
          l & 1 || s++,
          s
        );
      }),
      (a.prototype.bitLength = function () {
        var p = this.words[this.length - 1],
          l = this._countBits(p);
        return (this.length - 1) * 26 + l;
      });
    function I(N) {
      for (var p = new Array(N.bitLength()), l = 0; l < p.length; l++) {
        var s = (l / 26) | 0,
          f = l % 26;
        p[l] = (N.words[s] & (1 << f)) >>> f;
      }
      return p;
    }
    (a.prototype.zeroBits = function () {
      if (this.isZero()) return 0;
      for (var p = 0, l = 0; l < this.length; l++) {
        var s = this._zeroBits(this.words[l]);
        if (((p += s), s !== 26)) break;
      }
      return p;
    }),
      (a.prototype.byteLength = function () {
        return Math.ceil(this.bitLength() / 8);
      }),
      (a.prototype.toTwos = function (p) {
        return this.negative !== 0 ? this.abs().inotn(p).iaddn(1) : this.clone();
      }),
      (a.prototype.fromTwos = function (p) {
        return this.testn(p - 1) ? this.notn(p).iaddn(1).ineg() : this.clone();
      }),
      (a.prototype.isNeg = function () {
        return this.negative !== 0;
      }),
      (a.prototype.neg = function () {
        return this.clone().ineg();
      }),
      (a.prototype.ineg = function () {
        return this.isZero() || (this.negative ^= 1), this;
      }),
      (a.prototype.iuor = function (p) {
        for (; this.length < p.length; ) this.words[this.length++] = 0;
        for (var l = 0; l < p.length; l++) this.words[l] = this.words[l] | p.words[l];
        return this.strip();
      }),
      (a.prototype.ior = function (p) {
        return n((this.negative | p.negative) === 0), this.iuor(p);
      }),
      (a.prototype.or = function (p) {
        return this.length > p.length ? this.clone().ior(p) : p.clone().ior(this);
      }),
      (a.prototype.uor = function (p) {
        return this.length > p.length ? this.clone().iuor(p) : p.clone().iuor(this);
      }),
      (a.prototype.iuand = function (p) {
        var l;
        this.length > p.length ? (l = p) : (l = this);
        for (var s = 0; s < l.length; s++) this.words[s] = this.words[s] & p.words[s];
        return (this.length = l.length), this.strip();
      }),
      (a.prototype.iand = function (p) {
        return n((this.negative | p.negative) === 0), this.iuand(p);
      }),
      (a.prototype.and = function (p) {
        return this.length > p.length ? this.clone().iand(p) : p.clone().iand(this);
      }),
      (a.prototype.uand = function (p) {
        return this.length > p.length ? this.clone().iuand(p) : p.clone().iuand(this);
      }),
      (a.prototype.iuxor = function (p) {
        var l, s;
        this.length > p.length ? ((l = this), (s = p)) : ((l = p), (s = this));
        for (var f = 0; f < s.length; f++) this.words[f] = l.words[f] ^ s.words[f];
        if (this !== l) for (; f < l.length; f++) this.words[f] = l.words[f];
        return (this.length = l.length), this.strip();
      }),
      (a.prototype.ixor = function (p) {
        return n((this.negative | p.negative) === 0), this.iuxor(p);
      }),
      (a.prototype.xor = function (p) {
        return this.length > p.length ? this.clone().ixor(p) : p.clone().ixor(this);
      }),
      (a.prototype.uxor = function (p) {
        return this.length > p.length ? this.clone().iuxor(p) : p.clone().iuxor(this);
      }),
      (a.prototype.inotn = function (p) {
        n(typeof p == 'number' && p >= 0);
        var l = Math.ceil(p / 26) | 0,
          s = p % 26;
        this._expand(l), s > 0 && l--;
        for (var f = 0; f < l; f++) this.words[f] = ~this.words[f] & 67108863;
        return s > 0 && (this.words[f] = ~this.words[f] & (67108863 >> (26 - s))), this.strip();
      }),
      (a.prototype.notn = function (p) {
        return this.clone().inotn(p);
      }),
      (a.prototype.setn = function (p, l) {
        n(typeof p == 'number' && p >= 0);
        var s = (p / 26) | 0,
          f = p % 26;
        return (
          this._expand(s + 1),
          l
            ? (this.words[s] = this.words[s] | (1 << f))
            : (this.words[s] = this.words[s] & ~(1 << f)),
          this.strip()
        );
      }),
      (a.prototype.iadd = function (p) {
        var l;
        if (this.negative !== 0 && p.negative === 0)
          return (this.negative = 0), (l = this.isub(p)), (this.negative ^= 1), this._normSign();
        if (this.negative === 0 && p.negative !== 0)
          return (p.negative = 0), (l = this.isub(p)), (p.negative = 1), l._normSign();
        var s, f;
        this.length > p.length ? ((s = this), (f = p)) : ((s = p), (f = this));
        for (var v = 0, y = 0; y < f.length; y++)
          (l = (s.words[y] | 0) + (f.words[y] | 0) + v),
            (this.words[y] = l & 67108863),
            (v = l >>> 26);
        for (; v !== 0 && y < s.length; y++)
          (l = (s.words[y] | 0) + v), (this.words[y] = l & 67108863), (v = l >>> 26);
        if (((this.length = s.length), v !== 0)) (this.words[this.length] = v), this.length++;
        else if (s !== this) for (; y < s.length; y++) this.words[y] = s.words[y];
        return this;
      }),
      (a.prototype.add = function (p) {
        var l;
        return p.negative !== 0 && this.negative === 0
          ? ((p.negative = 0), (l = this.sub(p)), (p.negative ^= 1), l)
          : p.negative === 0 && this.negative !== 0
          ? ((this.negative = 0), (l = p.sub(this)), (this.negative = 1), l)
          : this.length > p.length
          ? this.clone().iadd(p)
          : p.clone().iadd(this);
      }),
      (a.prototype.isub = function (p) {
        if (p.negative !== 0) {
          p.negative = 0;
          var l = this.iadd(p);
          return (p.negative = 1), l._normSign();
        } else if (this.negative !== 0)
          return (this.negative = 0), this.iadd(p), (this.negative = 1), this._normSign();
        var s = this.cmp(p);
        if (s === 0) return (this.negative = 0), (this.length = 1), (this.words[0] = 0), this;
        var f, v;
        s > 0 ? ((f = this), (v = p)) : ((f = p), (v = this));
        for (var y = 0, E = 0; E < v.length; E++)
          (l = (f.words[E] | 0) - (v.words[E] | 0) + y),
            (y = l >> 26),
            (this.words[E] = l & 67108863);
        for (; y !== 0 && E < f.length; E++)
          (l = (f.words[E] | 0) + y), (y = l >> 26), (this.words[E] = l & 67108863);
        if (y === 0 && E < f.length && f !== this)
          for (; E < f.length; E++) this.words[E] = f.words[E];
        return (
          (this.length = Math.max(this.length, E)), f !== this && (this.negative = 1), this.strip()
        );
      }),
      (a.prototype.sub = function (p) {
        return this.clone().isub(p);
      });
    function M(N, p, l) {
      l.negative = p.negative ^ N.negative;
      var s = (N.length + p.length) | 0;
      (l.length = s), (s = (s - 1) | 0);
      var f = N.words[0] | 0,
        v = p.words[0] | 0,
        y = f * v,
        E = y & 67108863,
        g = (y / 67108864) | 0;
      l.words[0] = E;
      for (var u = 1; u < s; u++) {
        for (
          var b = g >>> 26,
            d = g & 67108863,
            _ = Math.min(u, p.length - 1),
            O = Math.max(0, u - N.length + 1);
          O <= _;
          O++
        ) {
          var D = (u - O) | 0;
          (f = N.words[D] | 0),
            (v = p.words[O] | 0),
            (y = f * v + d),
            (b += (y / 67108864) | 0),
            (d = y & 67108863);
        }
        (l.words[u] = d | 0), (g = b | 0);
      }
      return g !== 0 ? (l.words[u] = g | 0) : l.length--, l.strip();
    }
    var k = function (p, l, s) {
      var f = p.words,
        v = l.words,
        y = s.words,
        E = 0,
        g,
        u,
        b,
        d = f[0] | 0,
        _ = d & 8191,
        O = d >>> 13,
        D = f[1] | 0,
        $ = D & 8191,
        z = D >>> 13,
        H = f[2] | 0,
        K = H & 8191,
        le = H >>> 13,
        oe = f[3] | 0,
        te = oe & 8191,
        Re = oe >>> 13,
        xe = f[4] | 0,
        he = xe & 8191,
        qe = xe >>> 13,
        Ve = f[5] | 0,
        fe = Ve & 8191,
        He = Ve >>> 13,
        Ge = f[6] | 0,
        ve = Ge & 8191,
        rt = Ge >>> 13,
        nt = f[7] | 0,
        pe = nt & 8191,
        Ke = nt >>> 13,
        dt = f[8] | 0,
        ye = dt & 8191,
        it = dt >>> 13,
        at = f[9] | 0,
        _e = at & 8191,
        lt = at >>> 13,
        ht = v[0] | 0,
        Te = ht & 8191,
        st = ht >>> 13,
        pt = v[1] | 0,
        Ie = pt & 8191,
        Ze = pt >>> 13,
        We = v[2] | 0,
        ge = We & 8191,
        et = We >>> 13,
        tt = v[3] | 0,
        be = tt & 8191,
        mt = tt >>> 13,
        vt = v[4] | 0,
        Ne = vt & 8191,
        bt = vt >>> 13,
        gt = v[5] | 0,
        we = gt & 8191,
        ot = gt >>> 13,
        je = v[6] | 0,
        Se = je & 8191,
        yt = je >>> 13,
        wt = v[7] | 0,
        Me = wt & 8191,
        Et = wt >>> 13,
        Be = v[8] | 0,
        Ae = Be & 8191,
        xt = Be >>> 13,
        _t = v[9] | 0,
        Oe = _t & 8191,
        Tt = _t >>> 13;
      (s.negative = p.negative ^ l.negative),
        (s.length = 19),
        (g = Math.imul(_, Te)),
        (u = Math.imul(_, st)),
        (u = (u + Math.imul(O, Te)) | 0),
        (b = Math.imul(O, st));
      var ze = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (ze >>> 26)) | 0),
        (ze &= 67108863),
        (g = Math.imul($, Te)),
        (u = Math.imul($, st)),
        (u = (u + Math.imul(z, Te)) | 0),
        (b = Math.imul(z, st)),
        (g = (g + Math.imul(_, Ie)) | 0),
        (u = (u + Math.imul(_, Ze)) | 0),
        (u = (u + Math.imul(O, Ie)) | 0),
        (b = (b + Math.imul(O, Ze)) | 0);
      var ct = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (ct >>> 26)) | 0),
        (ct &= 67108863),
        (g = Math.imul(K, Te)),
        (u = Math.imul(K, st)),
        (u = (u + Math.imul(le, Te)) | 0),
        (b = Math.imul(le, st)),
        (g = (g + Math.imul($, Ie)) | 0),
        (u = (u + Math.imul($, Ze)) | 0),
        (u = (u + Math.imul(z, Ie)) | 0),
        (b = (b + Math.imul(z, Ze)) | 0),
        (g = (g + Math.imul(_, ge)) | 0),
        (u = (u + Math.imul(_, et)) | 0),
        (u = (u + Math.imul(O, ge)) | 0),
        (b = (b + Math.imul(O, et)) | 0);
      var en = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (en >>> 26)) | 0),
        (en &= 67108863),
        (g = Math.imul(te, Te)),
        (u = Math.imul(te, st)),
        (u = (u + Math.imul(Re, Te)) | 0),
        (b = Math.imul(Re, st)),
        (g = (g + Math.imul(K, Ie)) | 0),
        (u = (u + Math.imul(K, Ze)) | 0),
        (u = (u + Math.imul(le, Ie)) | 0),
        (b = (b + Math.imul(le, Ze)) | 0),
        (g = (g + Math.imul($, ge)) | 0),
        (u = (u + Math.imul($, et)) | 0),
        (u = (u + Math.imul(z, ge)) | 0),
        (b = (b + Math.imul(z, et)) | 0),
        (g = (g + Math.imul(_, be)) | 0),
        (u = (u + Math.imul(_, mt)) | 0),
        (u = (u + Math.imul(O, be)) | 0),
        (b = (b + Math.imul(O, mt)) | 0);
      var tn = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (tn >>> 26)) | 0),
        (tn &= 67108863),
        (g = Math.imul(he, Te)),
        (u = Math.imul(he, st)),
        (u = (u + Math.imul(qe, Te)) | 0),
        (b = Math.imul(qe, st)),
        (g = (g + Math.imul(te, Ie)) | 0),
        (u = (u + Math.imul(te, Ze)) | 0),
        (u = (u + Math.imul(Re, Ie)) | 0),
        (b = (b + Math.imul(Re, Ze)) | 0),
        (g = (g + Math.imul(K, ge)) | 0),
        (u = (u + Math.imul(K, et)) | 0),
        (u = (u + Math.imul(le, ge)) | 0),
        (b = (b + Math.imul(le, et)) | 0),
        (g = (g + Math.imul($, be)) | 0),
        (u = (u + Math.imul($, mt)) | 0),
        (u = (u + Math.imul(z, be)) | 0),
        (b = (b + Math.imul(z, mt)) | 0),
        (g = (g + Math.imul(_, Ne)) | 0),
        (u = (u + Math.imul(_, bt)) | 0),
        (u = (u + Math.imul(O, Ne)) | 0),
        (b = (b + Math.imul(O, bt)) | 0);
      var rn = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (rn >>> 26)) | 0),
        (rn &= 67108863),
        (g = Math.imul(fe, Te)),
        (u = Math.imul(fe, st)),
        (u = (u + Math.imul(He, Te)) | 0),
        (b = Math.imul(He, st)),
        (g = (g + Math.imul(he, Ie)) | 0),
        (u = (u + Math.imul(he, Ze)) | 0),
        (u = (u + Math.imul(qe, Ie)) | 0),
        (b = (b + Math.imul(qe, Ze)) | 0),
        (g = (g + Math.imul(te, ge)) | 0),
        (u = (u + Math.imul(te, et)) | 0),
        (u = (u + Math.imul(Re, ge)) | 0),
        (b = (b + Math.imul(Re, et)) | 0),
        (g = (g + Math.imul(K, be)) | 0),
        (u = (u + Math.imul(K, mt)) | 0),
        (u = (u + Math.imul(le, be)) | 0),
        (b = (b + Math.imul(le, mt)) | 0),
        (g = (g + Math.imul($, Ne)) | 0),
        (u = (u + Math.imul($, bt)) | 0),
        (u = (u + Math.imul(z, Ne)) | 0),
        (b = (b + Math.imul(z, bt)) | 0),
        (g = (g + Math.imul(_, we)) | 0),
        (u = (u + Math.imul(_, ot)) | 0),
        (u = (u + Math.imul(O, we)) | 0),
        (b = (b + Math.imul(O, ot)) | 0);
      var nn = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (nn >>> 26)) | 0),
        (nn &= 67108863),
        (g = Math.imul(ve, Te)),
        (u = Math.imul(ve, st)),
        (u = (u + Math.imul(rt, Te)) | 0),
        (b = Math.imul(rt, st)),
        (g = (g + Math.imul(fe, Ie)) | 0),
        (u = (u + Math.imul(fe, Ze)) | 0),
        (u = (u + Math.imul(He, Ie)) | 0),
        (b = (b + Math.imul(He, Ze)) | 0),
        (g = (g + Math.imul(he, ge)) | 0),
        (u = (u + Math.imul(he, et)) | 0),
        (u = (u + Math.imul(qe, ge)) | 0),
        (b = (b + Math.imul(qe, et)) | 0),
        (g = (g + Math.imul(te, be)) | 0),
        (u = (u + Math.imul(te, mt)) | 0),
        (u = (u + Math.imul(Re, be)) | 0),
        (b = (b + Math.imul(Re, mt)) | 0),
        (g = (g + Math.imul(K, Ne)) | 0),
        (u = (u + Math.imul(K, bt)) | 0),
        (u = (u + Math.imul(le, Ne)) | 0),
        (b = (b + Math.imul(le, bt)) | 0),
        (g = (g + Math.imul($, we)) | 0),
        (u = (u + Math.imul($, ot)) | 0),
        (u = (u + Math.imul(z, we)) | 0),
        (b = (b + Math.imul(z, ot)) | 0),
        (g = (g + Math.imul(_, Se)) | 0),
        (u = (u + Math.imul(_, yt)) | 0),
        (u = (u + Math.imul(O, Se)) | 0),
        (b = (b + Math.imul(O, yt)) | 0);
      var er = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (er >>> 26)) | 0),
        (er &= 67108863),
        (g = Math.imul(pe, Te)),
        (u = Math.imul(pe, st)),
        (u = (u + Math.imul(Ke, Te)) | 0),
        (b = Math.imul(Ke, st)),
        (g = (g + Math.imul(ve, Ie)) | 0),
        (u = (u + Math.imul(ve, Ze)) | 0),
        (u = (u + Math.imul(rt, Ie)) | 0),
        (b = (b + Math.imul(rt, Ze)) | 0),
        (g = (g + Math.imul(fe, ge)) | 0),
        (u = (u + Math.imul(fe, et)) | 0),
        (u = (u + Math.imul(He, ge)) | 0),
        (b = (b + Math.imul(He, et)) | 0),
        (g = (g + Math.imul(he, be)) | 0),
        (u = (u + Math.imul(he, mt)) | 0),
        (u = (u + Math.imul(qe, be)) | 0),
        (b = (b + Math.imul(qe, mt)) | 0),
        (g = (g + Math.imul(te, Ne)) | 0),
        (u = (u + Math.imul(te, bt)) | 0),
        (u = (u + Math.imul(Re, Ne)) | 0),
        (b = (b + Math.imul(Re, bt)) | 0),
        (g = (g + Math.imul(K, we)) | 0),
        (u = (u + Math.imul(K, ot)) | 0),
        (u = (u + Math.imul(le, we)) | 0),
        (b = (b + Math.imul(le, ot)) | 0),
        (g = (g + Math.imul($, Se)) | 0),
        (u = (u + Math.imul($, yt)) | 0),
        (u = (u + Math.imul(z, Se)) | 0),
        (b = (b + Math.imul(z, yt)) | 0),
        (g = (g + Math.imul(_, Me)) | 0),
        (u = (u + Math.imul(_, Et)) | 0),
        (u = (u + Math.imul(O, Me)) | 0),
        (b = (b + Math.imul(O, Et)) | 0);
      var an = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (an >>> 26)) | 0),
        (an &= 67108863),
        (g = Math.imul(ye, Te)),
        (u = Math.imul(ye, st)),
        (u = (u + Math.imul(it, Te)) | 0),
        (b = Math.imul(it, st)),
        (g = (g + Math.imul(pe, Ie)) | 0),
        (u = (u + Math.imul(pe, Ze)) | 0),
        (u = (u + Math.imul(Ke, Ie)) | 0),
        (b = (b + Math.imul(Ke, Ze)) | 0),
        (g = (g + Math.imul(ve, ge)) | 0),
        (u = (u + Math.imul(ve, et)) | 0),
        (u = (u + Math.imul(rt, ge)) | 0),
        (b = (b + Math.imul(rt, et)) | 0),
        (g = (g + Math.imul(fe, be)) | 0),
        (u = (u + Math.imul(fe, mt)) | 0),
        (u = (u + Math.imul(He, be)) | 0),
        (b = (b + Math.imul(He, mt)) | 0),
        (g = (g + Math.imul(he, Ne)) | 0),
        (u = (u + Math.imul(he, bt)) | 0),
        (u = (u + Math.imul(qe, Ne)) | 0),
        (b = (b + Math.imul(qe, bt)) | 0),
        (g = (g + Math.imul(te, we)) | 0),
        (u = (u + Math.imul(te, ot)) | 0),
        (u = (u + Math.imul(Re, we)) | 0),
        (b = (b + Math.imul(Re, ot)) | 0),
        (g = (g + Math.imul(K, Se)) | 0),
        (u = (u + Math.imul(K, yt)) | 0),
        (u = (u + Math.imul(le, Se)) | 0),
        (b = (b + Math.imul(le, yt)) | 0),
        (g = (g + Math.imul($, Me)) | 0),
        (u = (u + Math.imul($, Et)) | 0),
        (u = (u + Math.imul(z, Me)) | 0),
        (b = (b + Math.imul(z, Et)) | 0),
        (g = (g + Math.imul(_, Ae)) | 0),
        (u = (u + Math.imul(_, xt)) | 0),
        (u = (u + Math.imul(O, Ae)) | 0),
        (b = (b + Math.imul(O, xt)) | 0);
      var sn = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (sn >>> 26)) | 0),
        (sn &= 67108863),
        (g = Math.imul(_e, Te)),
        (u = Math.imul(_e, st)),
        (u = (u + Math.imul(lt, Te)) | 0),
        (b = Math.imul(lt, st)),
        (g = (g + Math.imul(ye, Ie)) | 0),
        (u = (u + Math.imul(ye, Ze)) | 0),
        (u = (u + Math.imul(it, Ie)) | 0),
        (b = (b + Math.imul(it, Ze)) | 0),
        (g = (g + Math.imul(pe, ge)) | 0),
        (u = (u + Math.imul(pe, et)) | 0),
        (u = (u + Math.imul(Ke, ge)) | 0),
        (b = (b + Math.imul(Ke, et)) | 0),
        (g = (g + Math.imul(ve, be)) | 0),
        (u = (u + Math.imul(ve, mt)) | 0),
        (u = (u + Math.imul(rt, be)) | 0),
        (b = (b + Math.imul(rt, mt)) | 0),
        (g = (g + Math.imul(fe, Ne)) | 0),
        (u = (u + Math.imul(fe, bt)) | 0),
        (u = (u + Math.imul(He, Ne)) | 0),
        (b = (b + Math.imul(He, bt)) | 0),
        (g = (g + Math.imul(he, we)) | 0),
        (u = (u + Math.imul(he, ot)) | 0),
        (u = (u + Math.imul(qe, we)) | 0),
        (b = (b + Math.imul(qe, ot)) | 0),
        (g = (g + Math.imul(te, Se)) | 0),
        (u = (u + Math.imul(te, yt)) | 0),
        (u = (u + Math.imul(Re, Se)) | 0),
        (b = (b + Math.imul(Re, yt)) | 0),
        (g = (g + Math.imul(K, Me)) | 0),
        (u = (u + Math.imul(K, Et)) | 0),
        (u = (u + Math.imul(le, Me)) | 0),
        (b = (b + Math.imul(le, Et)) | 0),
        (g = (g + Math.imul($, Ae)) | 0),
        (u = (u + Math.imul($, xt)) | 0),
        (u = (u + Math.imul(z, Ae)) | 0),
        (b = (b + Math.imul(z, xt)) | 0),
        (g = (g + Math.imul(_, Oe)) | 0),
        (u = (u + Math.imul(_, Tt)) | 0),
        (u = (u + Math.imul(O, Oe)) | 0),
        (b = (b + Math.imul(O, Tt)) | 0);
      var on = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (on >>> 26)) | 0),
        (on &= 67108863),
        (g = Math.imul(_e, Ie)),
        (u = Math.imul(_e, Ze)),
        (u = (u + Math.imul(lt, Ie)) | 0),
        (b = Math.imul(lt, Ze)),
        (g = (g + Math.imul(ye, ge)) | 0),
        (u = (u + Math.imul(ye, et)) | 0),
        (u = (u + Math.imul(it, ge)) | 0),
        (b = (b + Math.imul(it, et)) | 0),
        (g = (g + Math.imul(pe, be)) | 0),
        (u = (u + Math.imul(pe, mt)) | 0),
        (u = (u + Math.imul(Ke, be)) | 0),
        (b = (b + Math.imul(Ke, mt)) | 0),
        (g = (g + Math.imul(ve, Ne)) | 0),
        (u = (u + Math.imul(ve, bt)) | 0),
        (u = (u + Math.imul(rt, Ne)) | 0),
        (b = (b + Math.imul(rt, bt)) | 0),
        (g = (g + Math.imul(fe, we)) | 0),
        (u = (u + Math.imul(fe, ot)) | 0),
        (u = (u + Math.imul(He, we)) | 0),
        (b = (b + Math.imul(He, ot)) | 0),
        (g = (g + Math.imul(he, Se)) | 0),
        (u = (u + Math.imul(he, yt)) | 0),
        (u = (u + Math.imul(qe, Se)) | 0),
        (b = (b + Math.imul(qe, yt)) | 0),
        (g = (g + Math.imul(te, Me)) | 0),
        (u = (u + Math.imul(te, Et)) | 0),
        (u = (u + Math.imul(Re, Me)) | 0),
        (b = (b + Math.imul(Re, Et)) | 0),
        (g = (g + Math.imul(K, Ae)) | 0),
        (u = (u + Math.imul(K, xt)) | 0),
        (u = (u + Math.imul(le, Ae)) | 0),
        (b = (b + Math.imul(le, xt)) | 0),
        (g = (g + Math.imul($, Oe)) | 0),
        (u = (u + Math.imul($, Tt)) | 0),
        (u = (u + Math.imul(z, Oe)) | 0),
        (b = (b + Math.imul(z, Tt)) | 0);
      var cn = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (cn >>> 26)) | 0),
        (cn &= 67108863),
        (g = Math.imul(_e, ge)),
        (u = Math.imul(_e, et)),
        (u = (u + Math.imul(lt, ge)) | 0),
        (b = Math.imul(lt, et)),
        (g = (g + Math.imul(ye, be)) | 0),
        (u = (u + Math.imul(ye, mt)) | 0),
        (u = (u + Math.imul(it, be)) | 0),
        (b = (b + Math.imul(it, mt)) | 0),
        (g = (g + Math.imul(pe, Ne)) | 0),
        (u = (u + Math.imul(pe, bt)) | 0),
        (u = (u + Math.imul(Ke, Ne)) | 0),
        (b = (b + Math.imul(Ke, bt)) | 0),
        (g = (g + Math.imul(ve, we)) | 0),
        (u = (u + Math.imul(ve, ot)) | 0),
        (u = (u + Math.imul(rt, we)) | 0),
        (b = (b + Math.imul(rt, ot)) | 0),
        (g = (g + Math.imul(fe, Se)) | 0),
        (u = (u + Math.imul(fe, yt)) | 0),
        (u = (u + Math.imul(He, Se)) | 0),
        (b = (b + Math.imul(He, yt)) | 0),
        (g = (g + Math.imul(he, Me)) | 0),
        (u = (u + Math.imul(he, Et)) | 0),
        (u = (u + Math.imul(qe, Me)) | 0),
        (b = (b + Math.imul(qe, Et)) | 0),
        (g = (g + Math.imul(te, Ae)) | 0),
        (u = (u + Math.imul(te, xt)) | 0),
        (u = (u + Math.imul(Re, Ae)) | 0),
        (b = (b + Math.imul(Re, xt)) | 0),
        (g = (g + Math.imul(K, Oe)) | 0),
        (u = (u + Math.imul(K, Tt)) | 0),
        (u = (u + Math.imul(le, Oe)) | 0),
        (b = (b + Math.imul(le, Tt)) | 0);
      var fn = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (fn >>> 26)) | 0),
        (fn &= 67108863),
        (g = Math.imul(_e, be)),
        (u = Math.imul(_e, mt)),
        (u = (u + Math.imul(lt, be)) | 0),
        (b = Math.imul(lt, mt)),
        (g = (g + Math.imul(ye, Ne)) | 0),
        (u = (u + Math.imul(ye, bt)) | 0),
        (u = (u + Math.imul(it, Ne)) | 0),
        (b = (b + Math.imul(it, bt)) | 0),
        (g = (g + Math.imul(pe, we)) | 0),
        (u = (u + Math.imul(pe, ot)) | 0),
        (u = (u + Math.imul(Ke, we)) | 0),
        (b = (b + Math.imul(Ke, ot)) | 0),
        (g = (g + Math.imul(ve, Se)) | 0),
        (u = (u + Math.imul(ve, yt)) | 0),
        (u = (u + Math.imul(rt, Se)) | 0),
        (b = (b + Math.imul(rt, yt)) | 0),
        (g = (g + Math.imul(fe, Me)) | 0),
        (u = (u + Math.imul(fe, Et)) | 0),
        (u = (u + Math.imul(He, Me)) | 0),
        (b = (b + Math.imul(He, Et)) | 0),
        (g = (g + Math.imul(he, Ae)) | 0),
        (u = (u + Math.imul(he, xt)) | 0),
        (u = (u + Math.imul(qe, Ae)) | 0),
        (b = (b + Math.imul(qe, xt)) | 0),
        (g = (g + Math.imul(te, Oe)) | 0),
        (u = (u + Math.imul(te, Tt)) | 0),
        (u = (u + Math.imul(Re, Oe)) | 0),
        (b = (b + Math.imul(Re, Tt)) | 0);
      var un = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (un >>> 26)) | 0),
        (un &= 67108863),
        (g = Math.imul(_e, Ne)),
        (u = Math.imul(_e, bt)),
        (u = (u + Math.imul(lt, Ne)) | 0),
        (b = Math.imul(lt, bt)),
        (g = (g + Math.imul(ye, we)) | 0),
        (u = (u + Math.imul(ye, ot)) | 0),
        (u = (u + Math.imul(it, we)) | 0),
        (b = (b + Math.imul(it, ot)) | 0),
        (g = (g + Math.imul(pe, Se)) | 0),
        (u = (u + Math.imul(pe, yt)) | 0),
        (u = (u + Math.imul(Ke, Se)) | 0),
        (b = (b + Math.imul(Ke, yt)) | 0),
        (g = (g + Math.imul(ve, Me)) | 0),
        (u = (u + Math.imul(ve, Et)) | 0),
        (u = (u + Math.imul(rt, Me)) | 0),
        (b = (b + Math.imul(rt, Et)) | 0),
        (g = (g + Math.imul(fe, Ae)) | 0),
        (u = (u + Math.imul(fe, xt)) | 0),
        (u = (u + Math.imul(He, Ae)) | 0),
        (b = (b + Math.imul(He, xt)) | 0),
        (g = (g + Math.imul(he, Oe)) | 0),
        (u = (u + Math.imul(he, Tt)) | 0),
        (u = (u + Math.imul(qe, Oe)) | 0),
        (b = (b + Math.imul(qe, Tt)) | 0);
      var Lr = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (Lr >>> 26)) | 0),
        (Lr &= 67108863),
        (g = Math.imul(_e, we)),
        (u = Math.imul(_e, ot)),
        (u = (u + Math.imul(lt, we)) | 0),
        (b = Math.imul(lt, ot)),
        (g = (g + Math.imul(ye, Se)) | 0),
        (u = (u + Math.imul(ye, yt)) | 0),
        (u = (u + Math.imul(it, Se)) | 0),
        (b = (b + Math.imul(it, yt)) | 0),
        (g = (g + Math.imul(pe, Me)) | 0),
        (u = (u + Math.imul(pe, Et)) | 0),
        (u = (u + Math.imul(Ke, Me)) | 0),
        (b = (b + Math.imul(Ke, Et)) | 0),
        (g = (g + Math.imul(ve, Ae)) | 0),
        (u = (u + Math.imul(ve, xt)) | 0),
        (u = (u + Math.imul(rt, Ae)) | 0),
        (b = (b + Math.imul(rt, xt)) | 0),
        (g = (g + Math.imul(fe, Oe)) | 0),
        (u = (u + Math.imul(fe, Tt)) | 0),
        (u = (u + Math.imul(He, Oe)) | 0),
        (b = (b + Math.imul(He, Tt)) | 0);
      var vr = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (vr >>> 26)) | 0),
        (vr &= 67108863),
        (g = Math.imul(_e, Se)),
        (u = Math.imul(_e, yt)),
        (u = (u + Math.imul(lt, Se)) | 0),
        (b = Math.imul(lt, yt)),
        (g = (g + Math.imul(ye, Me)) | 0),
        (u = (u + Math.imul(ye, Et)) | 0),
        (u = (u + Math.imul(it, Me)) | 0),
        (b = (b + Math.imul(it, Et)) | 0),
        (g = (g + Math.imul(pe, Ae)) | 0),
        (u = (u + Math.imul(pe, xt)) | 0),
        (u = (u + Math.imul(Ke, Ae)) | 0),
        (b = (b + Math.imul(Ke, xt)) | 0),
        (g = (g + Math.imul(ve, Oe)) | 0),
        (u = (u + Math.imul(ve, Tt)) | 0),
        (u = (u + Math.imul(rt, Oe)) | 0),
        (b = (b + Math.imul(rt, Tt)) | 0);
      var dn = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (dn >>> 26)) | 0),
        (dn &= 67108863),
        (g = Math.imul(_e, Me)),
        (u = Math.imul(_e, Et)),
        (u = (u + Math.imul(lt, Me)) | 0),
        (b = Math.imul(lt, Et)),
        (g = (g + Math.imul(ye, Ae)) | 0),
        (u = (u + Math.imul(ye, xt)) | 0),
        (u = (u + Math.imul(it, Ae)) | 0),
        (b = (b + Math.imul(it, xt)) | 0),
        (g = (g + Math.imul(pe, Oe)) | 0),
        (u = (u + Math.imul(pe, Tt)) | 0),
        (u = (u + Math.imul(Ke, Oe)) | 0),
        (b = (b + Math.imul(Ke, Tt)) | 0);
      var Sr = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (Sr >>> 26)) | 0),
        (Sr &= 67108863),
        (g = Math.imul(_e, Ae)),
        (u = Math.imul(_e, xt)),
        (u = (u + Math.imul(lt, Ae)) | 0),
        (b = Math.imul(lt, xt)),
        (g = (g + Math.imul(ye, Oe)) | 0),
        (u = (u + Math.imul(ye, Tt)) | 0),
        (u = (u + Math.imul(it, Oe)) | 0),
        (b = (b + Math.imul(it, Tt)) | 0);
      var ln = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      (E = (((b + (u >>> 13)) | 0) + (ln >>> 26)) | 0),
        (ln &= 67108863),
        (g = Math.imul(_e, Oe)),
        (u = Math.imul(_e, Tt)),
        (u = (u + Math.imul(lt, Oe)) | 0),
        (b = Math.imul(lt, Tt));
      var hn = (((E + g) | 0) + ((u & 8191) << 13)) | 0;
      return (
        (E = (((b + (u >>> 13)) | 0) + (hn >>> 26)) | 0),
        (hn &= 67108863),
        (y[0] = ze),
        (y[1] = ct),
        (y[2] = en),
        (y[3] = tn),
        (y[4] = rn),
        (y[5] = nn),
        (y[6] = er),
        (y[7] = an),
        (y[8] = sn),
        (y[9] = on),
        (y[10] = cn),
        (y[11] = fn),
        (y[12] = un),
        (y[13] = Lr),
        (y[14] = vr),
        (y[15] = dn),
        (y[16] = Sr),
        (y[17] = ln),
        (y[18] = hn),
        E !== 0 && ((y[19] = E), s.length++),
        s
      );
    };
    Math.imul || (k = M);
    function F(N, p, l) {
      (l.negative = p.negative ^ N.negative), (l.length = N.length + p.length);
      for (var s = 0, f = 0, v = 0; v < l.length - 1; v++) {
        var y = f;
        f = 0;
        for (
          var E = s & 67108863, g = Math.min(v, p.length - 1), u = Math.max(0, v - N.length + 1);
          u <= g;
          u++
        ) {
          var b = v - u,
            d = N.words[b] | 0,
            _ = p.words[u] | 0,
            O = d * _,
            D = O & 67108863;
          (y = (y + ((O / 67108864) | 0)) | 0),
            (D = (D + E) | 0),
            (E = D & 67108863),
            (y = (y + (D >>> 26)) | 0),
            (f += y >>> 26),
            (y &= 67108863);
        }
        (l.words[v] = E), (s = y), (y = f);
      }
      return s !== 0 ? (l.words[v] = s) : l.length--, l.strip();
    }
    function j(N, p, l) {
      var s = new Z();
      return s.mulp(N, p, l);
    }
    a.prototype.mulTo = function (p, l) {
      var s,
        f = this.length + p.length;
      return (
        this.length === 10 && p.length === 10
          ? (s = k(this, p, l))
          : f < 63
          ? (s = M(this, p, l))
          : f < 1024
          ? (s = F(this, p, l))
          : (s = j(this, p, l)),
        s
      );
    };
    function Z(N, p) {
      (this.x = N), (this.y = p);
    }
    (Z.prototype.makeRBT = function (p) {
      for (var l = new Array(p), s = a.prototype._countBits(p) - 1, f = 0; f < p; f++)
        l[f] = this.revBin(f, s, p);
      return l;
    }),
      (Z.prototype.revBin = function (p, l, s) {
        if (p === 0 || p === s - 1) return p;
        for (var f = 0, v = 0; v < l; v++) (f |= (p & 1) << (l - v - 1)), (p >>= 1);
        return f;
      }),
      (Z.prototype.permute = function (p, l, s, f, v, y) {
        for (var E = 0; E < y; E++) (f[E] = l[p[E]]), (v[E] = s[p[E]]);
      }),
      (Z.prototype.transform = function (p, l, s, f, v, y) {
        this.permute(y, p, l, s, f, v);
        for (var E = 1; E < v; E <<= 1)
          for (
            var g = E << 1, u = Math.cos((2 * Math.PI) / g), b = Math.sin((2 * Math.PI) / g), d = 0;
            d < v;
            d += g
          )
            for (var _ = u, O = b, D = 0; D < E; D++) {
              var $ = s[d + D],
                z = f[d + D],
                H = s[d + D + E],
                K = f[d + D + E],
                le = _ * H - O * K;
              (K = _ * K + O * H),
                (H = le),
                (s[d + D] = $ + H),
                (f[d + D] = z + K),
                (s[d + D + E] = $ - H),
                (f[d + D + E] = z - K),
                D !== g && ((le = u * _ - b * O), (O = u * O + b * _), (_ = le));
            }
      }),
      (Z.prototype.guessLen13b = function (p, l) {
        var s = Math.max(l, p) | 1,
          f = s & 1,
          v = 0;
        for (s = (s / 2) | 0; s; s = s >>> 1) v++;
        return 1 << (v + 1 + f);
      }),
      (Z.prototype.conjugate = function (p, l, s) {
        if (!(s <= 1))
          for (var f = 0; f < s / 2; f++) {
            var v = p[f];
            (p[f] = p[s - f - 1]),
              (p[s - f - 1] = v),
              (v = l[f]),
              (l[f] = -l[s - f - 1]),
              (l[s - f - 1] = -v);
          }
      }),
      (Z.prototype.normalize13b = function (p, l) {
        for (var s = 0, f = 0; f < l / 2; f++) {
          var v = Math.round(p[2 * f + 1] / l) * 8192 + Math.round(p[2 * f] / l) + s;
          (p[f] = v & 67108863), v < 67108864 ? (s = 0) : (s = (v / 67108864) | 0);
        }
        return p;
      }),
      (Z.prototype.convert13b = function (p, l, s, f) {
        for (var v = 0, y = 0; y < l; y++)
          (v = v + (p[y] | 0)),
            (s[2 * y] = v & 8191),
            (v = v >>> 13),
            (s[2 * y + 1] = v & 8191),
            (v = v >>> 13);
        for (y = 2 * l; y < f; ++y) s[y] = 0;
        n(v === 0), n((v & -8192) === 0);
      }),
      (Z.prototype.stub = function (p) {
        for (var l = new Array(p), s = 0; s < p; s++) l[s] = 0;
        return l;
      }),
      (Z.prototype.mulp = function (p, l, s) {
        var f = 2 * this.guessLen13b(p.length, l.length),
          v = this.makeRBT(f),
          y = this.stub(f),
          E = new Array(f),
          g = new Array(f),
          u = new Array(f),
          b = new Array(f),
          d = new Array(f),
          _ = new Array(f),
          O = s.words;
        (O.length = f),
          this.convert13b(p.words, p.length, E, f),
          this.convert13b(l.words, l.length, b, f),
          this.transform(E, y, g, u, f, v),
          this.transform(b, y, d, _, f, v);
        for (var D = 0; D < f; D++) {
          var $ = g[D] * d[D] - u[D] * _[D];
          (u[D] = g[D] * _[D] + u[D] * d[D]), (g[D] = $);
        }
        return (
          this.conjugate(g, u, f),
          this.transform(g, u, O, y, f, v),
          this.conjugate(O, y, f),
          this.normalize13b(O, f),
          (s.negative = p.negative ^ l.negative),
          (s.length = p.length + l.length),
          s.strip()
        );
      }),
      (a.prototype.mul = function (p) {
        var l = new a(null);
        return (l.words = new Array(this.length + p.length)), this.mulTo(p, l);
      }),
      (a.prototype.mulf = function (p) {
        var l = new a(null);
        return (l.words = new Array(this.length + p.length)), j(this, p, l);
      }),
      (a.prototype.imul = function (p) {
        return this.clone().mulTo(p, this);
      }),
      (a.prototype.imuln = function (p) {
        n(typeof p == 'number'), n(p < 67108864);
        for (var l = 0, s = 0; s < this.length; s++) {
          var f = (this.words[s] | 0) * p,
            v = (f & 67108863) + (l & 67108863);
          (l >>= 26), (l += (f / 67108864) | 0), (l += v >>> 26), (this.words[s] = v & 67108863);
        }
        return l !== 0 && ((this.words[s] = l), this.length++), this;
      }),
      (a.prototype.muln = function (p) {
        return this.clone().imuln(p);
      }),
      (a.prototype.sqr = function () {
        return this.mul(this);
      }),
      (a.prototype.isqr = function () {
        return this.imul(this.clone());
      }),
      (a.prototype.pow = function (p) {
        var l = I(p);
        if (l.length === 0) return new a(1);
        for (var s = this, f = 0; f < l.length && l[f] === 0; f++, s = s.sqr());
        if (++f < l.length)
          for (var v = s.sqr(); f < l.length; f++, v = v.sqr()) l[f] !== 0 && (s = s.mul(v));
        return s;
      }),
      (a.prototype.iushln = function (p) {
        n(typeof p == 'number' && p >= 0);
        var l = p % 26,
          s = (p - l) / 26,
          f = (67108863 >>> (26 - l)) << (26 - l),
          v;
        if (l !== 0) {
          var y = 0;
          for (v = 0; v < this.length; v++) {
            var E = this.words[v] & f,
              g = ((this.words[v] | 0) - E) << l;
            (this.words[v] = g | y), (y = E >>> (26 - l));
          }
          y && ((this.words[v] = y), this.length++);
        }
        if (s !== 0) {
          for (v = this.length - 1; v >= 0; v--) this.words[v + s] = this.words[v];
          for (v = 0; v < s; v++) this.words[v] = 0;
          this.length += s;
        }
        return this.strip();
      }),
      (a.prototype.ishln = function (p) {
        return n(this.negative === 0), this.iushln(p);
      }),
      (a.prototype.iushrn = function (p, l, s) {
        n(typeof p == 'number' && p >= 0);
        var f;
        l ? (f = (l - (l % 26)) / 26) : (f = 0);
        var v = p % 26,
          y = Math.min((p - v) / 26, this.length),
          E = 67108863 ^ ((67108863 >>> v) << v),
          g = s;
        if (((f -= y), (f = Math.max(0, f)), g)) {
          for (var u = 0; u < y; u++) g.words[u] = this.words[u];
          g.length = y;
        }
        if (y !== 0)
          if (this.length > y)
            for (this.length -= y, u = 0; u < this.length; u++) this.words[u] = this.words[u + y];
          else (this.words[0] = 0), (this.length = 1);
        var b = 0;
        for (u = this.length - 1; u >= 0 && (b !== 0 || u >= f); u--) {
          var d = this.words[u] | 0;
          (this.words[u] = (b << (26 - v)) | (d >>> v)), (b = d & E);
        }
        return (
          g && b !== 0 && (g.words[g.length++] = b),
          this.length === 0 && ((this.words[0] = 0), (this.length = 1)),
          this.strip()
        );
      }),
      (a.prototype.ishrn = function (p, l, s) {
        return n(this.negative === 0), this.iushrn(p, l, s);
      }),
      (a.prototype.shln = function (p) {
        return this.clone().ishln(p);
      }),
      (a.prototype.ushln = function (p) {
        return this.clone().iushln(p);
      }),
      (a.prototype.shrn = function (p) {
        return this.clone().ishrn(p);
      }),
      (a.prototype.ushrn = function (p) {
        return this.clone().iushrn(p);
      }),
      (a.prototype.testn = function (p) {
        n(typeof p == 'number' && p >= 0);
        var l = p % 26,
          s = (p - l) / 26,
          f = 1 << l;
        if (this.length <= s) return !1;
        var v = this.words[s];
        return !!(v & f);
      }),
      (a.prototype.imaskn = function (p) {
        n(typeof p == 'number' && p >= 0);
        var l = p % 26,
          s = (p - l) / 26;
        if ((n(this.negative === 0, 'imaskn works only with positive numbers'), this.length <= s))
          return this;
        if ((l !== 0 && s++, (this.length = Math.min(s, this.length)), l !== 0)) {
          var f = 67108863 ^ ((67108863 >>> l) << l);
          this.words[this.length - 1] &= f;
        }
        return this.strip();
      }),
      (a.prototype.maskn = function (p) {
        return this.clone().imaskn(p);
      }),
      (a.prototype.iaddn = function (p) {
        return (
          n(typeof p == 'number'),
          n(p < 67108864),
          p < 0
            ? this.isubn(-p)
            : this.negative !== 0
            ? this.length === 1 && (this.words[0] | 0) < p
              ? ((this.words[0] = p - (this.words[0] | 0)), (this.negative = 0), this)
              : ((this.negative = 0), this.isubn(p), (this.negative = 1), this)
            : this._iaddn(p)
        );
      }),
      (a.prototype._iaddn = function (p) {
        this.words[0] += p;
        for (var l = 0; l < this.length && this.words[l] >= 67108864; l++)
          (this.words[l] -= 67108864),
            l === this.length - 1 ? (this.words[l + 1] = 1) : this.words[l + 1]++;
        return (this.length = Math.max(this.length, l + 1)), this;
      }),
      (a.prototype.isubn = function (p) {
        if ((n(typeof p == 'number'), n(p < 67108864), p < 0)) return this.iaddn(-p);
        if (this.negative !== 0)
          return (this.negative = 0), this.iaddn(p), (this.negative = 1), this;
        if (((this.words[0] -= p), this.length === 1 && this.words[0] < 0))
          (this.words[0] = -this.words[0]), (this.negative = 1);
        else
          for (var l = 0; l < this.length && this.words[l] < 0; l++)
            (this.words[l] += 67108864), (this.words[l + 1] -= 1);
        return this.strip();
      }),
      (a.prototype.addn = function (p) {
        return this.clone().iaddn(p);
      }),
      (a.prototype.subn = function (p) {
        return this.clone().isubn(p);
      }),
      (a.prototype.iabs = function () {
        return (this.negative = 0), this;
      }),
      (a.prototype.abs = function () {
        return this.clone().iabs();
      }),
      (a.prototype._ishlnsubmul = function (p, l, s) {
        var f = p.length + s,
          v;
        this._expand(f);
        var y,
          E = 0;
        for (v = 0; v < p.length; v++) {
          y = (this.words[v + s] | 0) + E;
          var g = (p.words[v] | 0) * l;
          (y -= g & 67108863),
            (E = (y >> 26) - ((g / 67108864) | 0)),
            (this.words[v + s] = y & 67108863);
        }
        for (; v < this.length - s; v++)
          (y = (this.words[v + s] | 0) + E), (E = y >> 26), (this.words[v + s] = y & 67108863);
        if (E === 0) return this.strip();
        for (n(E === -1), E = 0, v = 0; v < this.length; v++)
          (y = -(this.words[v] | 0) + E), (E = y >> 26), (this.words[v] = y & 67108863);
        return (this.negative = 1), this.strip();
      }),
      (a.prototype._wordDiv = function (p, l) {
        var s = this.length - p.length,
          f = this.clone(),
          v = p,
          y = v.words[v.length - 1] | 0,
          E = this._countBits(y);
        (s = 26 - E), s !== 0 && ((v = v.ushln(s)), f.iushln(s), (y = v.words[v.length - 1] | 0));
        var g = f.length - v.length,
          u;
        if (l !== 'mod') {
          (u = new a(null)), (u.length = g + 1), (u.words = new Array(u.length));
          for (var b = 0; b < u.length; b++) u.words[b] = 0;
        }
        var d = f.clone()._ishlnsubmul(v, 1, g);
        d.negative === 0 && ((f = d), u && (u.words[g] = 1));
        for (var _ = g - 1; _ >= 0; _--) {
          var O = (f.words[v.length + _] | 0) * 67108864 + (f.words[v.length + _ - 1] | 0);
          for (O = Math.min((O / y) | 0, 67108863), f._ishlnsubmul(v, O, _); f.negative !== 0; )
            O--, (f.negative = 0), f._ishlnsubmul(v, 1, _), f.isZero() || (f.negative ^= 1);
          u && (u.words[_] = O);
        }
        return (
          u && u.strip(),
          f.strip(),
          l !== 'div' && s !== 0 && f.iushrn(s),
          { div: u || null, mod: f }
        );
      }),
      (a.prototype.divmod = function (p, l, s) {
        if ((n(!p.isZero()), this.isZero())) return { div: new a(0), mod: new a(0) };
        var f, v, y;
        return this.negative !== 0 && p.negative === 0
          ? ((y = this.neg().divmod(p, l)),
            l !== 'mod' && (f = y.div.neg()),
            l !== 'div' && ((v = y.mod.neg()), s && v.negative !== 0 && v.iadd(p)),
            { div: f, mod: v })
          : this.negative === 0 && p.negative !== 0
          ? ((y = this.divmod(p.neg(), l)),
            l !== 'mod' && (f = y.div.neg()),
            { div: f, mod: y.mod })
          : this.negative & p.negative
          ? ((y = this.neg().divmod(p.neg(), l)),
            l !== 'div' && ((v = y.mod.neg()), s && v.negative !== 0 && v.isub(p)),
            { div: y.div, mod: v })
          : p.length > this.length || this.cmp(p) < 0
          ? { div: new a(0), mod: this }
          : p.length === 1
          ? l === 'div'
            ? { div: this.divn(p.words[0]), mod: null }
            : l === 'mod'
            ? { div: null, mod: new a(this.modn(p.words[0])) }
            : { div: this.divn(p.words[0]), mod: new a(this.modn(p.words[0])) }
          : this._wordDiv(p, l);
      }),
      (a.prototype.div = function (p) {
        return this.divmod(p, 'div', !1).div;
      }),
      (a.prototype.mod = function (p) {
        return this.divmod(p, 'mod', !1).mod;
      }),
      (a.prototype.umod = function (p) {
        return this.divmod(p, 'mod', !0).mod;
      }),
      (a.prototype.divRound = function (p) {
        var l = this.divmod(p);
        if (l.mod.isZero()) return l.div;
        var s = l.div.negative !== 0 ? l.mod.isub(p) : l.mod,
          f = p.ushrn(1),
          v = p.andln(1),
          y = s.cmp(f);
        return y < 0 || (v === 1 && y === 0)
          ? l.div
          : l.div.negative !== 0
          ? l.div.isubn(1)
          : l.div.iaddn(1);
      }),
      (a.prototype.modn = function (p) {
        n(p <= 67108863);
        for (var l = (1 << 26) % p, s = 0, f = this.length - 1; f >= 0; f--)
          s = (l * s + (this.words[f] | 0)) % p;
        return s;
      }),
      (a.prototype.idivn = function (p) {
        n(p <= 67108863);
        for (var l = 0, s = this.length - 1; s >= 0; s--) {
          var f = (this.words[s] | 0) + l * 67108864;
          (this.words[s] = (f / p) | 0), (l = f % p);
        }
        return this.strip();
      }),
      (a.prototype.divn = function (p) {
        return this.clone().idivn(p);
      }),
      (a.prototype.egcd = function (p) {
        n(p.negative === 0), n(!p.isZero());
        var l = this,
          s = p.clone();
        l.negative !== 0 ? (l = l.umod(p)) : (l = l.clone());
        for (
          var f = new a(1), v = new a(0), y = new a(0), E = new a(1), g = 0;
          l.isEven() && s.isEven();

        )
          l.iushrn(1), s.iushrn(1), ++g;
        for (var u = s.clone(), b = l.clone(); !l.isZero(); ) {
          for (var d = 0, _ = 1; !(l.words[0] & _) && d < 26; ++d, _ <<= 1);
          if (d > 0)
            for (l.iushrn(d); d-- > 0; )
              (f.isOdd() || v.isOdd()) && (f.iadd(u), v.isub(b)), f.iushrn(1), v.iushrn(1);
          for (var O = 0, D = 1; !(s.words[0] & D) && O < 26; ++O, D <<= 1);
          if (O > 0)
            for (s.iushrn(O); O-- > 0; )
              (y.isOdd() || E.isOdd()) && (y.iadd(u), E.isub(b)), y.iushrn(1), E.iushrn(1);
          l.cmp(s) >= 0 ? (l.isub(s), f.isub(y), v.isub(E)) : (s.isub(l), y.isub(f), E.isub(v));
        }
        return { a: y, b: E, gcd: s.iushln(g) };
      }),
      (a.prototype._invmp = function (p) {
        n(p.negative === 0), n(!p.isZero());
        var l = this,
          s = p.clone();
        l.negative !== 0 ? (l = l.umod(p)) : (l = l.clone());
        for (var f = new a(1), v = new a(0), y = s.clone(); l.cmpn(1) > 0 && s.cmpn(1) > 0; ) {
          for (var E = 0, g = 1; !(l.words[0] & g) && E < 26; ++E, g <<= 1);
          if (E > 0) for (l.iushrn(E); E-- > 0; ) f.isOdd() && f.iadd(y), f.iushrn(1);
          for (var u = 0, b = 1; !(s.words[0] & b) && u < 26; ++u, b <<= 1);
          if (u > 0) for (s.iushrn(u); u-- > 0; ) v.isOdd() && v.iadd(y), v.iushrn(1);
          l.cmp(s) >= 0 ? (l.isub(s), f.isub(v)) : (s.isub(l), v.isub(f));
        }
        var d;
        return l.cmpn(1) === 0 ? (d = f) : (d = v), d.cmpn(0) < 0 && d.iadd(p), d;
      }),
      (a.prototype.gcd = function (p) {
        if (this.isZero()) return p.abs();
        if (p.isZero()) return this.abs();
        var l = this.clone(),
          s = p.clone();
        (l.negative = 0), (s.negative = 0);
        for (var f = 0; l.isEven() && s.isEven(); f++) l.iushrn(1), s.iushrn(1);
        do {
          for (; l.isEven(); ) l.iushrn(1);
          for (; s.isEven(); ) s.iushrn(1);
          var v = l.cmp(s);
          if (v < 0) {
            var y = l;
            (l = s), (s = y);
          } else if (v === 0 || s.cmpn(1) === 0) break;
          l.isub(s);
        } while (!0);
        return s.iushln(f);
      }),
      (a.prototype.invm = function (p) {
        return this.egcd(p).a.umod(p);
      }),
      (a.prototype.isEven = function () {
        return (this.words[0] & 1) === 0;
      }),
      (a.prototype.isOdd = function () {
        return (this.words[0] & 1) === 1;
      }),
      (a.prototype.andln = function (p) {
        return this.words[0] & p;
      }),
      (a.prototype.bincn = function (p) {
        n(typeof p == 'number');
        var l = p % 26,
          s = (p - l) / 26,
          f = 1 << l;
        if (this.length <= s) return this._expand(s + 1), (this.words[s] |= f), this;
        for (var v = f, y = s; v !== 0 && y < this.length; y++) {
          var E = this.words[y] | 0;
          (E += v), (v = E >>> 26), (E &= 67108863), (this.words[y] = E);
        }
        return v !== 0 && ((this.words[y] = v), this.length++), this;
      }),
      (a.prototype.isZero = function () {
        return this.length === 1 && this.words[0] === 0;
      }),
      (a.prototype.cmpn = function (p) {
        var l = p < 0;
        if (this.negative !== 0 && !l) return -1;
        if (this.negative === 0 && l) return 1;
        this.strip();
        var s;
        if (this.length > 1) s = 1;
        else {
          l && (p = -p), n(p <= 67108863, 'Number is too big');
          var f = this.words[0] | 0;
          s = f === p ? 0 : f < p ? -1 : 1;
        }
        return this.negative !== 0 ? -s | 0 : s;
      }),
      (a.prototype.cmp = function (p) {
        if (this.negative !== 0 && p.negative === 0) return -1;
        if (this.negative === 0 && p.negative !== 0) return 1;
        var l = this.ucmp(p);
        return this.negative !== 0 ? -l | 0 : l;
      }),
      (a.prototype.ucmp = function (p) {
        if (this.length > p.length) return 1;
        if (this.length < p.length) return -1;
        for (var l = 0, s = this.length - 1; s >= 0; s--) {
          var f = this.words[s] | 0,
            v = p.words[s] | 0;
          if (f !== v) {
            f < v ? (l = -1) : f > v && (l = 1);
            break;
          }
        }
        return l;
      }),
      (a.prototype.gtn = function (p) {
        return this.cmpn(p) === 1;
      }),
      (a.prototype.gt = function (p) {
        return this.cmp(p) === 1;
      }),
      (a.prototype.gten = function (p) {
        return this.cmpn(p) >= 0;
      }),
      (a.prototype.gte = function (p) {
        return this.cmp(p) >= 0;
      }),
      (a.prototype.ltn = function (p) {
        return this.cmpn(p) === -1;
      }),
      (a.prototype.lt = function (p) {
        return this.cmp(p) === -1;
      }),
      (a.prototype.lten = function (p) {
        return this.cmpn(p) <= 0;
      }),
      (a.prototype.lte = function (p) {
        return this.cmp(p) <= 0;
      }),
      (a.prototype.eqn = function (p) {
        return this.cmpn(p) === 0;
      }),
      (a.prototype.eq = function (p) {
        return this.cmp(p) === 0;
      }),
      (a.red = function (p) {
        return new R(p);
      }),
      (a.prototype.toRed = function (p) {
        return (
          n(!this.red, 'Already a number in reduction context'),
          n(this.negative === 0, 'red works only with positives'),
          p.convertTo(this)._forceRed(p)
        );
      }),
      (a.prototype.fromRed = function () {
        return (
          n(this.red, 'fromRed works only with numbers in reduction context'),
          this.red.convertFrom(this)
        );
      }),
      (a.prototype._forceRed = function (p) {
        return (this.red = p), this;
      }),
      (a.prototype.forceRed = function (p) {
        return n(!this.red, 'Already a number in reduction context'), this._forceRed(p);
      }),
      (a.prototype.redAdd = function (p) {
        return n(this.red, 'redAdd works only with red numbers'), this.red.add(this, p);
      }),
      (a.prototype.redIAdd = function (p) {
        return n(this.red, 'redIAdd works only with red numbers'), this.red.iadd(this, p);
      }),
      (a.prototype.redSub = function (p) {
        return n(this.red, 'redSub works only with red numbers'), this.red.sub(this, p);
      }),
      (a.prototype.redISub = function (p) {
        return n(this.red, 'redISub works only with red numbers'), this.red.isub(this, p);
      }),
      (a.prototype.redShl = function (p) {
        return n(this.red, 'redShl works only with red numbers'), this.red.shl(this, p);
      }),
      (a.prototype.redMul = function (p) {
        return (
          n(this.red, 'redMul works only with red numbers'),
          this.red._verify2(this, p),
          this.red.mul(this, p)
        );
      }),
      (a.prototype.redIMul = function (p) {
        return (
          n(this.red, 'redMul works only with red numbers'),
          this.red._verify2(this, p),
          this.red.imul(this, p)
        );
      }),
      (a.prototype.redSqr = function () {
        return (
          n(this.red, 'redSqr works only with red numbers'),
          this.red._verify1(this),
          this.red.sqr(this)
        );
      }),
      (a.prototype.redISqr = function () {
        return (
          n(this.red, 'redISqr works only with red numbers'),
          this.red._verify1(this),
          this.red.isqr(this)
        );
      }),
      (a.prototype.redSqrt = function () {
        return (
          n(this.red, 'redSqrt works only with red numbers'),
          this.red._verify1(this),
          this.red.sqrt(this)
        );
      }),
      (a.prototype.redInvm = function () {
        return (
          n(this.red, 'redInvm works only with red numbers'),
          this.red._verify1(this),
          this.red.invm(this)
        );
      }),
      (a.prototype.redNeg = function () {
        return (
          n(this.red, 'redNeg works only with red numbers'),
          this.red._verify1(this),
          this.red.neg(this)
        );
      }),
      (a.prototype.redPow = function (p) {
        return (
          n(this.red && !p.red, 'redPow(normalNum)'), this.red._verify1(this), this.red.pow(this, p)
        );
      });
    var me = { k256: null, p224: null, p192: null, p25519: null };
    function ue(N, p) {
      (this.name = N),
        (this.p = new a(p, 16)),
        (this.n = this.p.bitLength()),
        (this.k = new a(1).iushln(this.n).isub(this.p)),
        (this.tmp = this._tmp());
    }
    (ue.prototype._tmp = function () {
      var p = new a(null);
      return (p.words = new Array(Math.ceil(this.n / 13))), p;
    }),
      (ue.prototype.ireduce = function (p) {
        var l = p,
          s;
        do
          this.split(l, this.tmp), (l = this.imulK(l)), (l = l.iadd(this.tmp)), (s = l.bitLength());
        while (s > this.n);
        var f = s < this.n ? -1 : l.ucmp(this.p);
        return (
          f === 0
            ? ((l.words[0] = 0), (l.length = 1))
            : f > 0
            ? l.isub(this.p)
            : l.strip !== void 0
            ? l.strip()
            : l._strip(),
          l
        );
      }),
      (ue.prototype.split = function (p, l) {
        p.iushrn(this.n, 0, l);
      }),
      (ue.prototype.imulK = function (p) {
        return p.imul(this.k);
      });
    function X() {
      ue.call(
        this,
        'k256',
        'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f'
      );
    }
    i(X, ue),
      (X.prototype.split = function (p, l) {
        for (var s = 4194303, f = Math.min(p.length, 9), v = 0; v < f; v++) l.words[v] = p.words[v];
        if (((l.length = f), p.length <= 9)) {
          (p.words[0] = 0), (p.length = 1);
          return;
        }
        var y = p.words[9];
        for (l.words[l.length++] = y & s, v = 10; v < p.length; v++) {
          var E = p.words[v] | 0;
          (p.words[v - 10] = ((E & s) << 4) | (y >>> 22)), (y = E);
        }
        (y >>>= 22),
          (p.words[v - 10] = y),
          y === 0 && p.length > 10 ? (p.length -= 10) : (p.length -= 9);
      }),
      (X.prototype.imulK = function (p) {
        (p.words[p.length] = 0), (p.words[p.length + 1] = 0), (p.length += 2);
        for (var l = 0, s = 0; s < p.length; s++) {
          var f = p.words[s] | 0;
          (l += f * 977), (p.words[s] = l & 67108863), (l = f * 64 + ((l / 67108864) | 0));
        }
        return (
          p.words[p.length - 1] === 0 && (p.length--, p.words[p.length - 1] === 0 && p.length--), p
        );
      });
    function J() {
      ue.call(this, 'p224', 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
    }
    i(J, ue);
    function Q() {
      ue.call(this, 'p192', 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
    }
    i(Q, ue);
    function re() {
      ue.call(this, '25519', '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
    }
    i(re, ue),
      (re.prototype.imulK = function (p) {
        for (var l = 0, s = 0; s < p.length; s++) {
          var f = (p.words[s] | 0) * 19 + l,
            v = f & 67108863;
          (f >>>= 26), (p.words[s] = v), (l = f);
        }
        return l !== 0 && (p.words[p.length++] = l), p;
      }),
      (a._prime = function (p) {
        if (me[p]) return me[p];
        var l;
        if (p === 'k256') l = new X();
        else if (p === 'p224') l = new J();
        else if (p === 'p192') l = new Q();
        else if (p === 'p25519') l = new re();
        else throw new Error('Unknown prime ' + p);
        return (me[p] = l), l;
      });
    function R(N) {
      if (typeof N == 'string') {
        var p = a._prime(N);
        (this.m = p.p), (this.prime = p);
      } else n(N.gtn(1), 'modulus must be greater than 1'), (this.m = N), (this.prime = null);
    }
    (R.prototype._verify1 = function (p) {
      n(p.negative === 0, 'red works only with positives'),
        n(p.red, 'red works only with red numbers');
    }),
      (R.prototype._verify2 = function (p, l) {
        n((p.negative | l.negative) === 0, 'red works only with positives'),
          n(p.red && p.red === l.red, 'red works only with red numbers');
      }),
      (R.prototype.imod = function (p) {
        return this.prime ? this.prime.ireduce(p)._forceRed(this) : p.umod(this.m)._forceRed(this);
      }),
      (R.prototype.neg = function (p) {
        return p.isZero() ? p.clone() : this.m.sub(p)._forceRed(this);
      }),
      (R.prototype.add = function (p, l) {
        this._verify2(p, l);
        var s = p.add(l);
        return s.cmp(this.m) >= 0 && s.isub(this.m), s._forceRed(this);
      }),
      (R.prototype.iadd = function (p, l) {
        this._verify2(p, l);
        var s = p.iadd(l);
        return s.cmp(this.m) >= 0 && s.isub(this.m), s;
      }),
      (R.prototype.sub = function (p, l) {
        this._verify2(p, l);
        var s = p.sub(l);
        return s.cmpn(0) < 0 && s.iadd(this.m), s._forceRed(this);
      }),
      (R.prototype.isub = function (p, l) {
        this._verify2(p, l);
        var s = p.isub(l);
        return s.cmpn(0) < 0 && s.iadd(this.m), s;
      }),
      (R.prototype.shl = function (p, l) {
        return this._verify1(p), this.imod(p.ushln(l));
      }),
      (R.prototype.imul = function (p, l) {
        return this._verify2(p, l), this.imod(p.imul(l));
      }),
      (R.prototype.mul = function (p, l) {
        return this._verify2(p, l), this.imod(p.mul(l));
      }),
      (R.prototype.isqr = function (p) {
        return this.imul(p, p.clone());
      }),
      (R.prototype.sqr = function (p) {
        return this.mul(p, p);
      }),
      (R.prototype.sqrt = function (p) {
        if (p.isZero()) return p.clone();
        var l = this.m.andln(3);
        if ((n(l % 2 === 1), l === 3)) {
          var s = this.m.add(new a(1)).iushrn(2);
          return this.pow(p, s);
        }
        for (var f = this.m.subn(1), v = 0; !f.isZero() && f.andln(1) === 0; ) v++, f.iushrn(1);
        n(!f.isZero());
        var y = new a(1).toRed(this),
          E = y.redNeg(),
          g = this.m.subn(1).iushrn(1),
          u = this.m.bitLength();
        for (u = new a(2 * u * u).toRed(this); this.pow(u, g).cmp(E) !== 0; ) u.redIAdd(E);
        for (
          var b = this.pow(u, f), d = this.pow(p, f.addn(1).iushrn(1)), _ = this.pow(p, f), O = v;
          _.cmp(y) !== 0;

        ) {
          for (var D = _, $ = 0; D.cmp(y) !== 0; $++) D = D.redSqr();
          n($ < O);
          var z = this.pow(b, new a(1).iushln(O - $ - 1));
          (d = d.redMul(z)), (b = z.redSqr()), (_ = _.redMul(b)), (O = $);
        }
        return d;
      }),
      (R.prototype.invm = function (p) {
        var l = p._invmp(this.m);
        return l.negative !== 0 ? ((l.negative = 0), this.imod(l).redNeg()) : this.imod(l);
      }),
      (R.prototype.pow = function (p, l) {
        if (l.isZero()) return new a(1).toRed(this);
        if (l.cmpn(1) === 0) return p.clone();
        var s = 4,
          f = new Array(1 << s);
        (f[0] = new a(1).toRed(this)), (f[1] = p);
        for (var v = 2; v < f.length; v++) f[v] = this.mul(f[v - 1], p);
        var y = f[0],
          E = 0,
          g = 0,
          u = l.bitLength() % 26;
        for (u === 0 && (u = 26), v = l.length - 1; v >= 0; v--) {
          for (var b = l.words[v], d = u - 1; d >= 0; d--) {
            var _ = (b >> d) & 1;
            if ((y !== f[0] && (y = this.sqr(y)), _ === 0 && E === 0)) {
              g = 0;
              continue;
            }
            (E <<= 1),
              (E |= _),
              g++,
              !(g !== s && (v !== 0 || d !== 0)) && ((y = this.mul(y, f[E])), (g = 0), (E = 0));
          }
          u = 26;
        }
        return y;
      }),
      (R.prototype.convertTo = function (p) {
        var l = p.umod(this.m);
        return l === p ? l.clone() : l;
      }),
      (R.prototype.convertFrom = function (p) {
        var l = p.clone();
        return (l.red = null), l;
      }),
      (a.mont = function (p) {
        return new q(p);
      });
    function q(N) {
      R.call(this, N),
        (this.shift = this.m.bitLength()),
        this.shift % 26 !== 0 && (this.shift += 26 - (this.shift % 26)),
        (this.r = new a(1).iushln(this.shift)),
        (this.r2 = this.imod(this.r.sqr())),
        (this.rinv = this.r._invmp(this.m)),
        (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
        (this.minv = this.minv.umod(this.r)),
        (this.minv = this.r.sub(this.minv));
    }
    i(q, R),
      (q.prototype.convertTo = function (p) {
        return this.imod(p.ushln(this.shift));
      }),
      (q.prototype.convertFrom = function (p) {
        var l = this.imod(p.mul(this.rinv));
        return (l.red = null), l;
      }),
      (q.prototype.imul = function (p, l) {
        if (p.isZero() || l.isZero()) return (p.words[0] = 0), (p.length = 1), p;
        var s = p.imul(l),
          f = s.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
          v = s.isub(f).iushrn(this.shift),
          y = v;
        return (
          v.cmp(this.m) >= 0 ? (y = v.isub(this.m)) : v.cmpn(0) < 0 && (y = v.iadd(this.m)),
          y._forceRed(this)
        );
      }),
      (q.prototype.mul = function (p, l) {
        if (p.isZero() || l.isZero()) return new a(0)._forceRed(this);
        var s = p.mul(l),
          f = s.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
          v = s.isub(f).iushrn(this.shift),
          y = v;
        return (
          v.cmp(this.m) >= 0 ? (y = v.isub(this.m)) : v.cmpn(0) < 0 && (y = v.iadd(this.m)),
          y._forceRed(this)
        );
      }),
      (q.prototype.invm = function (p) {
        var l = this.imod(p._invmp(this.m).mul(this.r2));
        return l._forceRed(this);
      });
  })(t, se);
})(y4);
var tf = {};
(function (t) {
  var e = t;
  function r(a, o) {
    if (Array.isArray(a)) return a.slice();
    if (!a) return [];
    var c = [];
    if (typeof a != 'string') {
      for (var h = 0; h < a.length; h++) c[h] = a[h] | 0;
      return c;
    }
    if (o === 'hex') {
      (a = a.replace(/[^a-z0-9]+/gi, '')), a.length % 2 !== 0 && (a = '0' + a);
      for (var h = 0; h < a.length; h += 2) c.push(parseInt(a[h] + a[h + 1], 16));
    } else
      for (var h = 0; h < a.length; h++) {
        var m = a.charCodeAt(h),
          w = m >> 8,
          x = m & 255;
        w ? c.push(w, x) : c.push(x);
      }
    return c;
  }
  e.toArray = r;
  function n(a) {
    return a.length === 1 ? '0' + a : a;
  }
  e.zero2 = n;
  function i(a) {
    for (var o = '', c = 0; c < a.length; c++) o += n(a[c].toString(16));
    return o;
  }
  (e.toHex = i),
    (e.encode = function (o, c) {
      return c === 'hex' ? i(o) : o;
    });
})(tf);
(function (t) {
  var e = t,
    r = Cr,
    n = Xn,
    i = tf;
  (e.assert = n),
    (e.toArray = i.toArray),
    (e.zero2 = i.zero2),
    (e.toHex = i.toHex),
    (e.encode = i.encode);
  function a(w, x, T) {
    var I = new Array(Math.max(w.bitLength(), T) + 1);
    I.fill(0);
    for (var M = 1 << (x + 1), k = w.clone(), F = 0; F < I.length; F++) {
      var j,
        Z = k.andln(M - 1);
      k.isOdd() ? (Z > (M >> 1) - 1 ? (j = (M >> 1) - Z) : (j = Z), k.isubn(j)) : (j = 0),
        (I[F] = j),
        k.iushrn(1);
    }
    return I;
  }
  e.getNAF = a;
  function o(w, x) {
    var T = [[], []];
    (w = w.clone()), (x = x.clone());
    for (var I = 0, M = 0, k; w.cmpn(-I) > 0 || x.cmpn(-M) > 0; ) {
      var F = (w.andln(3) + I) & 3,
        j = (x.andln(3) + M) & 3;
      F === 3 && (F = -1), j === 3 && (j = -1);
      var Z;
      F & 1
        ? ((k = (w.andln(7) + I) & 7), (k === 3 || k === 5) && j === 2 ? (Z = -F) : (Z = F))
        : (Z = 0),
        T[0].push(Z);
      var me;
      j & 1
        ? ((k = (x.andln(7) + M) & 7), (k === 3 || k === 5) && F === 2 ? (me = -j) : (me = j))
        : (me = 0),
        T[1].push(me),
        2 * I === Z + 1 && (I = 1 - I),
        2 * M === me + 1 && (M = 1 - M),
        w.iushrn(1),
        x.iushrn(1);
    }
    return T;
  }
  e.getJSF = o;
  function c(w, x, T) {
    var I = '_' + x;
    w.prototype[x] = function () {
      return this[I] !== void 0 ? this[I] : (this[I] = T.call(this));
    };
  }
  e.cachedProperty = c;
  function h(w) {
    return typeof w == 'string' ? e.toArray(w, 'hex') : w;
  }
  e.parseBytes = h;
  function m(w) {
    return new r(w, 'hex', 'le');
  }
  e.intFromLE = m;
})(mr);
var ba = {},
  w4 = {
    get exports() {
      return ba;
    },
    set exports(t) {
      ba = t;
    },
  },
  Oo;
w4.exports = function (e) {
  return Oo || (Oo = new Mn(null)), Oo.generate(e);
};
function Mn(t) {
  this.rand = t;
}
ba.Rand = Mn;
Mn.prototype.generate = function (e) {
  return this._rand(e);
};
Mn.prototype._rand = function (e) {
  if (this.rand.getBytes) return this.rand.getBytes(e);
  for (var r = new Uint8Array(e), n = 0; n < r.length; n++) r[n] = this.rand.getByte();
  return r;
};
if (typeof self == 'object')
  self.crypto && self.crypto.getRandomValues
    ? (Mn.prototype._rand = function (e) {
        var r = new Uint8Array(e);
        return self.crypto.getRandomValues(r), r;
      })
    : self.msCrypto && self.msCrypto.getRandomValues
    ? (Mn.prototype._rand = function (e) {
        var r = new Uint8Array(e);
        return self.msCrypto.getRandomValues(r), r;
      })
    : typeof window == 'object' &&
      (Mn.prototype._rand = function () {
        throw new Error('Not implemented yet');
      });
else
  try {
    var Lu = cc;
    if (typeof Lu.randomBytes != 'function') throw new Error('Not supported');
    Mn.prototype._rand = function (e) {
      return Lu.randomBytes(e);
    };
  } catch {}
var rf = {},
  Bn = Cr,
  Da = mr,
  Ms = Da.getNAF,
  E4 = Da.getJSF,
  As = Da.assert;
function Ln(t, e) {
  (this.type = t),
    (this.p = new Bn(e.p, 16)),
    (this.red = e.prime ? Bn.red(e.prime) : Bn.mont(this.p)),
    (this.zero = new Bn(0).toRed(this.red)),
    (this.one = new Bn(1).toRed(this.red)),
    (this.two = new Bn(2).toRed(this.red)),
    (this.n = e.n && new Bn(e.n, 16)),
    (this.g = e.g && this.pointFromJSON(e.g, e.gRed)),
    (this._wnafT1 = new Array(4)),
    (this._wnafT2 = new Array(4)),
    (this._wnafT3 = new Array(4)),
    (this._wnafT4 = new Array(4)),
    (this._bitLength = this.n ? this.n.bitLength() : 0);
  var r = this.n && this.p.div(this.n);
  !r || r.cmpn(100) > 0
    ? (this.redN = null)
    : ((this._maxwellTrick = !0), (this.redN = this.n.toRed(this.red)));
}
var Ys = Ln;
Ln.prototype.point = function () {
  throw new Error('Not implemented');
};
Ln.prototype.validate = function () {
  throw new Error('Not implemented');
};
Ln.prototype._fixedNafMul = function (e, r) {
  As(e.precomputed);
  var n = e._getDoubles(),
    i = Ms(r, 1, this._bitLength),
    a = (1 << (n.step + 1)) - (n.step % 2 === 0 ? 2 : 1);
  a /= 3;
  var o = [],
    c,
    h;
  for (c = 0; c < i.length; c += n.step) {
    h = 0;
    for (var m = c + n.step - 1; m >= c; m--) h = (h << 1) + i[m];
    o.push(h);
  }
  for (
    var w = this.jpoint(null, null, null), x = this.jpoint(null, null, null), T = a;
    T > 0;
    T--
  ) {
    for (c = 0; c < o.length; c++)
      (h = o[c]),
        h === T ? (x = x.mixedAdd(n.points[c])) : h === -T && (x = x.mixedAdd(n.points[c].neg()));
    w = w.add(x);
  }
  return w.toP();
};
Ln.prototype._wnafMul = function (e, r) {
  var n = 4,
    i = e._getNAFPoints(n);
  n = i.wnd;
  for (
    var a = i.points,
      o = Ms(r, n, this._bitLength),
      c = this.jpoint(null, null, null),
      h = o.length - 1;
    h >= 0;
    h--
  ) {
    for (var m = 0; h >= 0 && o[h] === 0; h--) m++;
    if ((h >= 0 && m++, (c = c.dblp(m)), h < 0)) break;
    var w = o[h];
    As(w !== 0),
      e.type === 'affine'
        ? w > 0
          ? (c = c.mixedAdd(a[(w - 1) >> 1]))
          : (c = c.mixedAdd(a[(-w - 1) >> 1].neg()))
        : w > 0
        ? (c = c.add(a[(w - 1) >> 1]))
        : (c = c.add(a[(-w - 1) >> 1].neg()));
  }
  return e.type === 'affine' ? c.toP() : c;
};
Ln.prototype._wnafMulAdd = function (e, r, n, i, a) {
  var o = this._wnafT1,
    c = this._wnafT2,
    h = this._wnafT3,
    m = 0,
    w,
    x,
    T;
  for (w = 0; w < i; w++) {
    T = r[w];
    var I = T._getNAFPoints(e);
    (o[w] = I.wnd), (c[w] = I.points);
  }
  for (w = i - 1; w >= 1; w -= 2) {
    var M = w - 1,
      k = w;
    if (o[M] !== 1 || o[k] !== 1) {
      (h[M] = Ms(n[M], o[M], this._bitLength)),
        (h[k] = Ms(n[k], o[k], this._bitLength)),
        (m = Math.max(h[M].length, m)),
        (m = Math.max(h[k].length, m));
      continue;
    }
    var F = [r[M], null, null, r[k]];
    r[M].y.cmp(r[k].y) === 0
      ? ((F[1] = r[M].add(r[k])), (F[2] = r[M].toJ().mixedAdd(r[k].neg())))
      : r[M].y.cmp(r[k].y.redNeg()) === 0
      ? ((F[1] = r[M].toJ().mixedAdd(r[k])), (F[2] = r[M].add(r[k].neg())))
      : ((F[1] = r[M].toJ().mixedAdd(r[k])), (F[2] = r[M].toJ().mixedAdd(r[k].neg())));
    var j = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
      Z = E4(n[M], n[k]);
    for (
      m = Math.max(Z[0].length, m), h[M] = new Array(m), h[k] = new Array(m), x = 0;
      x < m;
      x++
    ) {
      var me = Z[0][x] | 0,
        ue = Z[1][x] | 0;
      (h[M][x] = j[(me + 1) * 3 + (ue + 1)]), (h[k][x] = 0), (c[M] = F);
    }
  }
  var X = this.jpoint(null, null, null),
    J = this._wnafT4;
  for (w = m; w >= 0; w--) {
    for (var Q = 0; w >= 0; ) {
      var re = !0;
      for (x = 0; x < i; x++) (J[x] = h[x][w] | 0), J[x] !== 0 && (re = !1);
      if (!re) break;
      Q++, w--;
    }
    if ((w >= 0 && Q++, (X = X.dblp(Q)), w < 0)) break;
    for (x = 0; x < i; x++) {
      var R = J[x];
      R !== 0 &&
        (R > 0 ? (T = c[x][(R - 1) >> 1]) : R < 0 && (T = c[x][(-R - 1) >> 1].neg()),
        T.type === 'affine' ? (X = X.mixedAdd(T)) : (X = X.add(T)));
    }
  }
  for (w = 0; w < i; w++) c[w] = null;
  return a ? X : X.toP();
};
function Ir(t, e) {
  (this.curve = t), (this.type = e), (this.precomputed = null);
}
Ln.BasePoint = Ir;
Ir.prototype.eq = function () {
  throw new Error('Not implemented');
};
Ir.prototype.validate = function () {
  return this.curve.validate(this);
};
Ln.prototype.decodePoint = function (e, r) {
  e = Da.toArray(e, r);
  var n = this.p.byteLength();
  if ((e[0] === 4 || e[0] === 6 || e[0] === 7) && e.length - 1 === 2 * n) {
    e[0] === 6 ? As(e[e.length - 1] % 2 === 0) : e[0] === 7 && As(e[e.length - 1] % 2 === 1);
    var i = this.point(e.slice(1, 1 + n), e.slice(1 + n, 1 + 2 * n));
    return i;
  } else if ((e[0] === 2 || e[0] === 3) && e.length - 1 === n)
    return this.pointFromX(e.slice(1, 1 + n), e[0] === 3);
  throw new Error('Unknown point format');
};
Ir.prototype.encodeCompressed = function (e) {
  return this.encode(e, !0);
};
Ir.prototype._encode = function (e) {
  var r = this.curve.p.byteLength(),
    n = this.getX().toArray('be', r);
  return e ? [this.getY().isEven() ? 2 : 3].concat(n) : [4].concat(n, this.getY().toArray('be', r));
};
Ir.prototype.encode = function (e, r) {
  return Da.encode(this._encode(r), e);
};
Ir.prototype.precompute = function (e) {
  if (this.precomputed) return this;
  var r = { doubles: null, naf: null, beta: null };
  return (
    (r.naf = this._getNAFPoints(8)),
    (r.doubles = this._getDoubles(4, e)),
    (r.beta = this._getBeta()),
    (this.precomputed = r),
    this
  );
};
Ir.prototype._hasDoubles = function (e) {
  if (!this.precomputed) return !1;
  var r = this.precomputed.doubles;
  return r ? r.points.length >= Math.ceil((e.bitLength() + 1) / r.step) : !1;
};
Ir.prototype._getDoubles = function (e, r) {
  if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
  for (var n = [this], i = this, a = 0; a < r; a += e) {
    for (var o = 0; o < e; o++) i = i.dbl();
    n.push(i);
  }
  return { step: e, points: n };
};
Ir.prototype._getNAFPoints = function (e) {
  if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
  for (var r = [this], n = (1 << e) - 1, i = n === 1 ? null : this.dbl(), a = 1; a < n; a++)
    r[a] = r[a - 1].add(i);
  return { wnd: e, points: r };
};
Ir.prototype._getBeta = function () {
  return null;
};
Ir.prototype.dblp = function (e) {
  for (var r = this, n = 0; n < e; n++) r = r.dbl();
  return r;
};
var x4 = mr,
  Ot = Cr,
  nf = bi,
  Bi = Ys,
  _4 = x4.assert;
function Nr(t) {
  Bi.call(this, 'short', t),
    (this.a = new Ot(t.a, 16).toRed(this.red)),
    (this.b = new Ot(t.b, 16).toRed(this.red)),
    (this.tinv = this.two.redInvm()),
    (this.zeroA = this.a.fromRed().cmpn(0) === 0),
    (this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0),
    (this.endo = this._getEndomorphism(t)),
    (this._endoWnafT1 = new Array(4)),
    (this._endoWnafT2 = new Array(4));
}
nf(Nr, Bi);
var T4 = Nr;
Nr.prototype._getEndomorphism = function (e) {
  if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
    var r, n;
    if (e.beta) r = new Ot(e.beta, 16).toRed(this.red);
    else {
      var i = this._getEndoRoots(this.p);
      (r = i[0].cmp(i[1]) < 0 ? i[0] : i[1]), (r = r.toRed(this.red));
    }
    if (e.lambda) n = new Ot(e.lambda, 16);
    else {
      var a = this._getEndoRoots(this.n);
      this.g.mul(a[0]).x.cmp(this.g.x.redMul(r)) === 0
        ? (n = a[0])
        : ((n = a[1]), _4(this.g.mul(n).x.cmp(this.g.x.redMul(r)) === 0));
    }
    var o;
    return (
      e.basis
        ? (o = e.basis.map(function (c) {
            return { a: new Ot(c.a, 16), b: new Ot(c.b, 16) };
          }))
        : (o = this._getEndoBasis(n)),
      { beta: r, lambda: n, basis: o }
    );
  }
};
Nr.prototype._getEndoRoots = function (e) {
  var r = e === this.p ? this.red : Ot.mont(e),
    n = new Ot(2).toRed(r).redInvm(),
    i = n.redNeg(),
    a = new Ot(3).toRed(r).redNeg().redSqrt().redMul(n),
    o = i.redAdd(a).fromRed(),
    c = i.redSub(a).fromRed();
  return [o, c];
};
Nr.prototype._getEndoBasis = function (e) {
  for (
    var r = this.n.ushrn(Math.floor(this.n.bitLength() / 2)),
      n = e,
      i = this.n.clone(),
      a = new Ot(1),
      o = new Ot(0),
      c = new Ot(0),
      h = new Ot(1),
      m,
      w,
      x,
      T,
      I,
      M,
      k,
      F = 0,
      j,
      Z;
    n.cmpn(0) !== 0;

  ) {
    var me = i.div(n);
    (j = i.sub(me.mul(n))), (Z = c.sub(me.mul(a)));
    var ue = h.sub(me.mul(o));
    if (!x && j.cmp(r) < 0) (m = k.neg()), (w = a), (x = j.neg()), (T = Z);
    else if (x && ++F === 2) break;
    (k = j), (i = n), (n = j), (c = a), (a = Z), (h = o), (o = ue);
  }
  (I = j.neg()), (M = Z);
  var X = x.sqr().add(T.sqr()),
    J = I.sqr().add(M.sqr());
  return (
    J.cmp(X) >= 0 && ((I = m), (M = w)),
    x.negative && ((x = x.neg()), (T = T.neg())),
    I.negative && ((I = I.neg()), (M = M.neg())),
    [
      { a: x, b: T },
      { a: I, b: M },
    ]
  );
};
Nr.prototype._endoSplit = function (e) {
  var r = this.endo.basis,
    n = r[0],
    i = r[1],
    a = i.b.mul(e).divRound(this.n),
    o = n.b.neg().mul(e).divRound(this.n),
    c = a.mul(n.a),
    h = o.mul(i.a),
    m = a.mul(n.b),
    w = o.mul(i.b),
    x = e.sub(c).sub(h),
    T = m.add(w).neg();
  return { k1: x, k2: T };
};
Nr.prototype.pointFromX = function (e, r) {
  (e = new Ot(e, 16)), e.red || (e = e.toRed(this.red));
  var n = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b),
    i = n.redSqrt();
  if (i.redSqr().redSub(n).cmp(this.zero) !== 0) throw new Error('invalid point');
  var a = i.fromRed().isOdd();
  return ((r && !a) || (!r && a)) && (i = i.redNeg()), this.point(e, i);
};
Nr.prototype.validate = function (e) {
  if (e.inf) return !0;
  var r = e.x,
    n = e.y,
    i = this.a.redMul(r),
    a = r.redSqr().redMul(r).redIAdd(i).redIAdd(this.b);
  return n.redSqr().redISub(a).cmpn(0) === 0;
};
Nr.prototype._endoWnafMulAdd = function (e, r, n) {
  for (var i = this._endoWnafT1, a = this._endoWnafT2, o = 0; o < e.length; o++) {
    var c = this._endoSplit(r[o]),
      h = e[o],
      m = h._getBeta();
    c.k1.negative && (c.k1.ineg(), (h = h.neg(!0))),
      c.k2.negative && (c.k2.ineg(), (m = m.neg(!0))),
      (i[o * 2] = h),
      (i[o * 2 + 1] = m),
      (a[o * 2] = c.k1),
      (a[o * 2 + 1] = c.k2);
  }
  for (var w = this._wnafMulAdd(1, i, a, o * 2, n), x = 0; x < o * 2; x++)
    (i[x] = null), (a[x] = null);
  return w;
};
function jt(t, e, r, n) {
  Bi.BasePoint.call(this, t, 'affine'),
    e === null && r === null
      ? ((this.x = null), (this.y = null), (this.inf = !0))
      : ((this.x = new Ot(e, 16)),
        (this.y = new Ot(r, 16)),
        n && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)),
        this.x.red || (this.x = this.x.toRed(this.curve.red)),
        this.y.red || (this.y = this.y.toRed(this.curve.red)),
        (this.inf = !1));
}
nf(jt, Bi.BasePoint);
Nr.prototype.point = function (e, r, n) {
  return new jt(this, e, r, n);
};
Nr.prototype.pointFromJSON = function (e, r) {
  return jt.fromJSON(this, e, r);
};
jt.prototype._getBeta = function () {
  if (this.curve.endo) {
    var e = this.precomputed;
    if (e && e.beta) return e.beta;
    var r = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (e) {
      var n = this.curve,
        i = function (a) {
          return n.point(a.x.redMul(n.endo.beta), a.y);
        };
      (e.beta = r),
        (r.precomputed = {
          beta: null,
          naf: e.naf && { wnd: e.naf.wnd, points: e.naf.points.map(i) },
          doubles: e.doubles && { step: e.doubles.step, points: e.doubles.points.map(i) },
        });
    }
    return r;
  }
};
jt.prototype.toJSON = function () {
  return this.precomputed
    ? [
        this.x,
        this.y,
        this.precomputed && {
          doubles: this.precomputed.doubles && {
            step: this.precomputed.doubles.step,
            points: this.precomputed.doubles.points.slice(1),
          },
          naf: this.precomputed.naf && {
            wnd: this.precomputed.naf.wnd,
            points: this.precomputed.naf.points.slice(1),
          },
        },
      ]
    : [this.x, this.y];
};
jt.fromJSON = function (e, r, n) {
  typeof r == 'string' && (r = JSON.parse(r));
  var i = e.point(r[0], r[1], n);
  if (!r[2]) return i;
  function a(c) {
    return e.point(c[0], c[1], n);
  }
  var o = r[2];
  return (
    (i.precomputed = {
      beta: null,
      doubles: o.doubles && { step: o.doubles.step, points: [i].concat(o.doubles.points.map(a)) },
      naf: o.naf && { wnd: o.naf.wnd, points: [i].concat(o.naf.points.map(a)) },
    }),
    i
  );
};
jt.prototype.inspect = function () {
  return this.isInfinity()
    ? '<EC Point Infinity>'
    : '<EC Point x: ' +
        this.x.fromRed().toString(16, 2) +
        ' y: ' +
        this.y.fromRed().toString(16, 2) +
        '>';
};
jt.prototype.isInfinity = function () {
  return this.inf;
};
jt.prototype.add = function (e) {
  if (this.inf) return e;
  if (e.inf) return this;
  if (this.eq(e)) return this.dbl();
  if (this.neg().eq(e)) return this.curve.point(null, null);
  if (this.x.cmp(e.x) === 0) return this.curve.point(null, null);
  var r = this.y.redSub(e.y);
  r.cmpn(0) !== 0 && (r = r.redMul(this.x.redSub(e.x).redInvm()));
  var n = r.redSqr().redISub(this.x).redISub(e.x),
    i = r.redMul(this.x.redSub(n)).redISub(this.y);
  return this.curve.point(n, i);
};
jt.prototype.dbl = function () {
  if (this.inf) return this;
  var e = this.y.redAdd(this.y);
  if (e.cmpn(0) === 0) return this.curve.point(null, null);
  var r = this.curve.a,
    n = this.x.redSqr(),
    i = e.redInvm(),
    a = n.redAdd(n).redIAdd(n).redIAdd(r).redMul(i),
    o = a.redSqr().redISub(this.x.redAdd(this.x)),
    c = a.redMul(this.x.redSub(o)).redISub(this.y);
  return this.curve.point(o, c);
};
jt.prototype.getX = function () {
  return this.x.fromRed();
};
jt.prototype.getY = function () {
  return this.y.fromRed();
};
jt.prototype.mul = function (e) {
  return (
    (e = new Ot(e, 16)),
    this.isInfinity()
      ? this
      : this._hasDoubles(e)
      ? this.curve._fixedNafMul(this, e)
      : this.curve.endo
      ? this.curve._endoWnafMulAdd([this], [e])
      : this.curve._wnafMul(this, e)
  );
};
jt.prototype.mulAdd = function (e, r, n) {
  var i = [this, r],
    a = [e, n];
  return this.curve.endo ? this.curve._endoWnafMulAdd(i, a) : this.curve._wnafMulAdd(1, i, a, 2);
};
jt.prototype.jmulAdd = function (e, r, n) {
  var i = [this, r],
    a = [e, n];
  return this.curve.endo
    ? this.curve._endoWnafMulAdd(i, a, !0)
    : this.curve._wnafMulAdd(1, i, a, 2, !0);
};
jt.prototype.eq = function (e) {
  return (
    this === e ||
    (this.inf === e.inf && (this.inf || (this.x.cmp(e.x) === 0 && this.y.cmp(e.y) === 0)))
  );
};
jt.prototype.neg = function (e) {
  if (this.inf) return this;
  var r = this.curve.point(this.x, this.y.redNeg());
  if (e && this.precomputed) {
    var n = this.precomputed,
      i = function (a) {
        return a.neg();
      };
    r.precomputed = {
      naf: n.naf && { wnd: n.naf.wnd, points: n.naf.points.map(i) },
      doubles: n.doubles && { step: n.doubles.step, points: n.doubles.points.map(i) },
    };
  }
  return r;
};
jt.prototype.toJ = function () {
  if (this.inf) return this.curve.jpoint(null, null, null);
  var e = this.curve.jpoint(this.x, this.y, this.curve.one);
  return e;
};
function Jt(t, e, r, n) {
  Bi.BasePoint.call(this, t, 'jacobian'),
    e === null && r === null && n === null
      ? ((this.x = this.curve.one), (this.y = this.curve.one), (this.z = new Ot(0)))
      : ((this.x = new Ot(e, 16)), (this.y = new Ot(r, 16)), (this.z = new Ot(n, 16))),
    this.x.red || (this.x = this.x.toRed(this.curve.red)),
    this.y.red || (this.y = this.y.toRed(this.curve.red)),
    this.z.red || (this.z = this.z.toRed(this.curve.red)),
    (this.zOne = this.z === this.curve.one);
}
nf(Jt, Bi.BasePoint);
Nr.prototype.jpoint = function (e, r, n) {
  return new Jt(this, e, r, n);
};
Jt.prototype.toP = function () {
  if (this.isInfinity()) return this.curve.point(null, null);
  var e = this.z.redInvm(),
    r = e.redSqr(),
    n = this.x.redMul(r),
    i = this.y.redMul(r).redMul(e);
  return this.curve.point(n, i);
};
Jt.prototype.neg = function () {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
Jt.prototype.add = function (e) {
  if (this.isInfinity()) return e;
  if (e.isInfinity()) return this;
  var r = e.z.redSqr(),
    n = this.z.redSqr(),
    i = this.x.redMul(r),
    a = e.x.redMul(n),
    o = this.y.redMul(r.redMul(e.z)),
    c = e.y.redMul(n.redMul(this.z)),
    h = i.redSub(a),
    m = o.redSub(c);
  if (h.cmpn(0) === 0) return m.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var w = h.redSqr(),
    x = w.redMul(h),
    T = i.redMul(w),
    I = m.redSqr().redIAdd(x).redISub(T).redISub(T),
    M = m.redMul(T.redISub(I)).redISub(o.redMul(x)),
    k = this.z.redMul(e.z).redMul(h);
  return this.curve.jpoint(I, M, k);
};
Jt.prototype.mixedAdd = function (e) {
  if (this.isInfinity()) return e.toJ();
  if (e.isInfinity()) return this;
  var r = this.z.redSqr(),
    n = this.x,
    i = e.x.redMul(r),
    a = this.y,
    o = e.y.redMul(r).redMul(this.z),
    c = n.redSub(i),
    h = a.redSub(o);
  if (c.cmpn(0) === 0) return h.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var m = c.redSqr(),
    w = m.redMul(c),
    x = n.redMul(m),
    T = h.redSqr().redIAdd(w).redISub(x).redISub(x),
    I = h.redMul(x.redISub(T)).redISub(a.redMul(w)),
    M = this.z.redMul(c);
  return this.curve.jpoint(T, I, M);
};
Jt.prototype.dblp = function (e) {
  if (e === 0) return this;
  if (this.isInfinity()) return this;
  if (!e) return this.dbl();
  var r;
  if (this.curve.zeroA || this.curve.threeA) {
    var n = this;
    for (r = 0; r < e; r++) n = n.dbl();
    return n;
  }
  var i = this.curve.a,
    a = this.curve.tinv,
    o = this.x,
    c = this.y,
    h = this.z,
    m = h.redSqr().redSqr(),
    w = c.redAdd(c);
  for (r = 0; r < e; r++) {
    var x = o.redSqr(),
      T = w.redSqr(),
      I = T.redSqr(),
      M = x.redAdd(x).redIAdd(x).redIAdd(i.redMul(m)),
      k = o.redMul(T),
      F = M.redSqr().redISub(k.redAdd(k)),
      j = k.redISub(F),
      Z = M.redMul(j);
    Z = Z.redIAdd(Z).redISub(I);
    var me = w.redMul(h);
    r + 1 < e && (m = m.redMul(I)), (o = F), (h = me), (w = Z);
  }
  return this.curve.jpoint(o, w.redMul(a), h);
};
Jt.prototype.dbl = function () {
  return this.isInfinity()
    ? this
    : this.curve.zeroA
    ? this._zeroDbl()
    : this.curve.threeA
    ? this._threeDbl()
    : this._dbl();
};
Jt.prototype._zeroDbl = function () {
  var e, r, n;
  if (this.zOne) {
    var i = this.x.redSqr(),
      a = this.y.redSqr(),
      o = a.redSqr(),
      c = this.x.redAdd(a).redSqr().redISub(i).redISub(o);
    c = c.redIAdd(c);
    var h = i.redAdd(i).redIAdd(i),
      m = h.redSqr().redISub(c).redISub(c),
      w = o.redIAdd(o);
    (w = w.redIAdd(w)),
      (w = w.redIAdd(w)),
      (e = m),
      (r = h.redMul(c.redISub(m)).redISub(w)),
      (n = this.y.redAdd(this.y));
  } else {
    var x = this.x.redSqr(),
      T = this.y.redSqr(),
      I = T.redSqr(),
      M = this.x.redAdd(T).redSqr().redISub(x).redISub(I);
    M = M.redIAdd(M);
    var k = x.redAdd(x).redIAdd(x),
      F = k.redSqr(),
      j = I.redIAdd(I);
    (j = j.redIAdd(j)),
      (j = j.redIAdd(j)),
      (e = F.redISub(M).redISub(M)),
      (r = k.redMul(M.redISub(e)).redISub(j)),
      (n = this.y.redMul(this.z)),
      (n = n.redIAdd(n));
  }
  return this.curve.jpoint(e, r, n);
};
Jt.prototype._threeDbl = function () {
  var e, r, n;
  if (this.zOne) {
    var i = this.x.redSqr(),
      a = this.y.redSqr(),
      o = a.redSqr(),
      c = this.x.redAdd(a).redSqr().redISub(i).redISub(o);
    c = c.redIAdd(c);
    var h = i.redAdd(i).redIAdd(i).redIAdd(this.curve.a),
      m = h.redSqr().redISub(c).redISub(c);
    e = m;
    var w = o.redIAdd(o);
    (w = w.redIAdd(w)),
      (w = w.redIAdd(w)),
      (r = h.redMul(c.redISub(m)).redISub(w)),
      (n = this.y.redAdd(this.y));
  } else {
    var x = this.z.redSqr(),
      T = this.y.redSqr(),
      I = this.x.redMul(T),
      M = this.x.redSub(x).redMul(this.x.redAdd(x));
    M = M.redAdd(M).redIAdd(M);
    var k = I.redIAdd(I);
    k = k.redIAdd(k);
    var F = k.redAdd(k);
    (e = M.redSqr().redISub(F)), (n = this.y.redAdd(this.z).redSqr().redISub(T).redISub(x));
    var j = T.redSqr();
    (j = j.redIAdd(j)),
      (j = j.redIAdd(j)),
      (j = j.redIAdd(j)),
      (r = M.redMul(k.redISub(e)).redISub(j));
  }
  return this.curve.jpoint(e, r, n);
};
Jt.prototype._dbl = function () {
  var e = this.curve.a,
    r = this.x,
    n = this.y,
    i = this.z,
    a = i.redSqr().redSqr(),
    o = r.redSqr(),
    c = n.redSqr(),
    h = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(a)),
    m = r.redAdd(r);
  m = m.redIAdd(m);
  var w = m.redMul(c),
    x = h.redSqr().redISub(w.redAdd(w)),
    T = w.redISub(x),
    I = c.redSqr();
  (I = I.redIAdd(I)), (I = I.redIAdd(I)), (I = I.redIAdd(I));
  var M = h.redMul(T).redISub(I),
    k = n.redAdd(n).redMul(i);
  return this.curve.jpoint(x, M, k);
};
Jt.prototype.trpl = function () {
  if (!this.curve.zeroA) return this.dbl().add(this);
  var e = this.x.redSqr(),
    r = this.y.redSqr(),
    n = this.z.redSqr(),
    i = r.redSqr(),
    a = e.redAdd(e).redIAdd(e),
    o = a.redSqr(),
    c = this.x.redAdd(r).redSqr().redISub(e).redISub(i);
  (c = c.redIAdd(c)), (c = c.redAdd(c).redIAdd(c)), (c = c.redISub(o));
  var h = c.redSqr(),
    m = i.redIAdd(i);
  (m = m.redIAdd(m)), (m = m.redIAdd(m)), (m = m.redIAdd(m));
  var w = a.redIAdd(c).redSqr().redISub(o).redISub(h).redISub(m),
    x = r.redMul(w);
  (x = x.redIAdd(x)), (x = x.redIAdd(x));
  var T = this.x.redMul(h).redISub(x);
  (T = T.redIAdd(T)), (T = T.redIAdd(T));
  var I = this.y.redMul(w.redMul(m.redISub(w)).redISub(c.redMul(h)));
  (I = I.redIAdd(I)), (I = I.redIAdd(I)), (I = I.redIAdd(I));
  var M = this.z.redAdd(c).redSqr().redISub(n).redISub(h);
  return this.curve.jpoint(T, I, M);
};
Jt.prototype.mul = function (e, r) {
  return (e = new Ot(e, r)), this.curve._wnafMul(this, e);
};
Jt.prototype.eq = function (e) {
  if (e.type === 'affine') return this.eq(e.toJ());
  if (this === e) return !0;
  var r = this.z.redSqr(),
    n = e.z.redSqr();
  if (this.x.redMul(n).redISub(e.x.redMul(r)).cmpn(0) !== 0) return !1;
  var i = r.redMul(this.z),
    a = n.redMul(e.z);
  return this.y.redMul(a).redISub(e.y.redMul(i)).cmpn(0) === 0;
};
Jt.prototype.eqXToP = function (e) {
  var r = this.z.redSqr(),
    n = e.toRed(this.curve.red).redMul(r);
  if (this.x.cmp(n) === 0) return !0;
  for (var i = e.clone(), a = this.curve.redN.redMul(r); ; ) {
    if ((i.iadd(this.curve.n), i.cmp(this.curve.p) >= 0)) return !1;
    if ((n.redIAdd(a), this.x.cmp(n) === 0)) return !0;
  }
};
Jt.prototype.inspect = function () {
  return this.isInfinity()
    ? '<EC JPoint Infinity>'
    : '<EC JPoint x: ' +
        this.x.toString(16, 2) +
        ' y: ' +
        this.y.toString(16, 2) +
        ' z: ' +
        this.z.toString(16, 2) +
        '>';
};
Jt.prototype.isInfinity = function () {
  return this.z.cmpn(0) === 0;
};
var di = Cr,
  Rl = bi,
  Xs = Ys,
  I4 = mr;
function Vi(t) {
  Xs.call(this, 'mont', t),
    (this.a = new di(t.a, 16).toRed(this.red)),
    (this.b = new di(t.b, 16).toRed(this.red)),
    (this.i4 = new di(4).toRed(this.red).redInvm()),
    (this.two = new di(2).toRed(this.red)),
    (this.a24 = this.i4.redMul(this.a.redAdd(this.two)));
}
Rl(Vi, Xs);
var N4 = Vi;
Vi.prototype.validate = function (e) {
  var r = e.normalize().x,
    n = r.redSqr(),
    i = n.redMul(r).redAdd(n.redMul(this.a)).redAdd(r),
    a = i.redSqrt();
  return a.redSqr().cmp(i) === 0;
};
function Vt(t, e, r) {
  Xs.BasePoint.call(this, t, 'projective'),
    e === null && r === null
      ? ((this.x = this.curve.one), (this.z = this.curve.zero))
      : ((this.x = new di(e, 16)),
        (this.z = new di(r, 16)),
        this.x.red || (this.x = this.x.toRed(this.curve.red)),
        this.z.red || (this.z = this.z.toRed(this.curve.red)));
}
Rl(Vt, Xs.BasePoint);
Vi.prototype.decodePoint = function (e, r) {
  return this.point(I4.toArray(e, r), 1);
};
Vi.prototype.point = function (e, r) {
  return new Vt(this, e, r);
};
Vi.prototype.pointFromJSON = function (e) {
  return Vt.fromJSON(this, e);
};
Vt.prototype.precompute = function () {};
Vt.prototype._encode = function () {
  return this.getX().toArray('be', this.curve.p.byteLength());
};
Vt.fromJSON = function (e, r) {
  return new Vt(e, r[0], r[1] || e.one);
};
Vt.prototype.inspect = function () {
  return this.isInfinity()
    ? '<EC Point Infinity>'
    : '<EC Point x: ' +
        this.x.fromRed().toString(16, 2) +
        ' z: ' +
        this.z.fromRed().toString(16, 2) +
        '>';
};
Vt.prototype.isInfinity = function () {
  return this.z.cmpn(0) === 0;
};
Vt.prototype.dbl = function () {
  var e = this.x.redAdd(this.z),
    r = e.redSqr(),
    n = this.x.redSub(this.z),
    i = n.redSqr(),
    a = r.redSub(i),
    o = r.redMul(i),
    c = a.redMul(i.redAdd(this.curve.a24.redMul(a)));
  return this.curve.point(o, c);
};
Vt.prototype.add = function () {
  throw new Error('Not supported on Montgomery curve');
};
Vt.prototype.diffAdd = function (e, r) {
  var n = this.x.redAdd(this.z),
    i = this.x.redSub(this.z),
    a = e.x.redAdd(e.z),
    o = e.x.redSub(e.z),
    c = o.redMul(n),
    h = a.redMul(i),
    m = r.z.redMul(c.redAdd(h).redSqr()),
    w = r.x.redMul(c.redISub(h).redSqr());
  return this.curve.point(m, w);
};
Vt.prototype.mul = function (e) {
  for (
    var r = e.clone(), n = this, i = this.curve.point(null, null), a = this, o = [];
    r.cmpn(0) !== 0;
    r.iushrn(1)
  )
    o.push(r.andln(1));
  for (var c = o.length - 1; c >= 0; c--)
    o[c] === 0 ? ((n = n.diffAdd(i, a)), (i = i.dbl())) : ((i = n.diffAdd(i, a)), (n = n.dbl()));
  return i;
};
Vt.prototype.mulAdd = function () {
  throw new Error('Not supported on Montgomery curve');
};
Vt.prototype.jumlAdd = function () {
  throw new Error('Not supported on Montgomery curve');
};
Vt.prototype.eq = function (e) {
  return this.getX().cmp(e.getX()) === 0;
};
Vt.prototype.normalize = function () {
  return (this.x = this.x.redMul(this.z.redInvm())), (this.z = this.curve.one), this;
};
Vt.prototype.getX = function () {
  return this.normalize(), this.x.fromRed();
};
var S4 = mr,
  mn = Cr,
  Dl = bi,
  Zs = Ys,
  M4 = S4.assert;
function Zr(t) {
  (this.twisted = (t.a | 0) !== 1),
    (this.mOneA = this.twisted && (t.a | 0) === -1),
    (this.extended = this.mOneA),
    Zs.call(this, 'edwards', t),
    (this.a = new mn(t.a, 16).umod(this.red.m)),
    (this.a = this.a.toRed(this.red)),
    (this.c = new mn(t.c, 16).toRed(this.red)),
    (this.c2 = this.c.redSqr()),
    (this.d = new mn(t.d, 16).toRed(this.red)),
    (this.dd = this.d.redAdd(this.d)),
    M4(!this.twisted || this.c.fromRed().cmpn(1) === 0),
    (this.oneC = (t.c | 0) === 1);
}
Dl(Zr, Zs);
var A4 = Zr;
Zr.prototype._mulA = function (e) {
  return this.mOneA ? e.redNeg() : this.a.redMul(e);
};
Zr.prototype._mulC = function (e) {
  return this.oneC ? e : this.c.redMul(e);
};
Zr.prototype.jpoint = function (e, r, n, i) {
  return this.point(e, r, n, i);
};
Zr.prototype.pointFromX = function (e, r) {
  (e = new mn(e, 16)), e.red || (e = e.toRed(this.red));
  var n = e.redSqr(),
    i = this.c2.redSub(this.a.redMul(n)),
    a = this.one.redSub(this.c2.redMul(this.d).redMul(n)),
    o = i.redMul(a.redInvm()),
    c = o.redSqrt();
  if (c.redSqr().redSub(o).cmp(this.zero) !== 0) throw new Error('invalid point');
  var h = c.fromRed().isOdd();
  return ((r && !h) || (!r && h)) && (c = c.redNeg()), this.point(e, c);
};
Zr.prototype.pointFromY = function (e, r) {
  (e = new mn(e, 16)), e.red || (e = e.toRed(this.red));
  var n = e.redSqr(),
    i = n.redSub(this.c2),
    a = n.redMul(this.d).redMul(this.c2).redSub(this.a),
    o = i.redMul(a.redInvm());
  if (o.cmp(this.zero) === 0) {
    if (r) throw new Error('invalid point');
    return this.point(this.zero, e);
  }
  var c = o.redSqrt();
  if (c.redSqr().redSub(o).cmp(this.zero) !== 0) throw new Error('invalid point');
  return c.fromRed().isOdd() !== r && (c = c.redNeg()), this.point(c, e);
};
Zr.prototype.validate = function (e) {
  if (e.isInfinity()) return !0;
  e.normalize();
  var r = e.x.redSqr(),
    n = e.y.redSqr(),
    i = r.redMul(this.a).redAdd(n),
    a = this.c2.redMul(this.one.redAdd(this.d.redMul(r).redMul(n)));
  return i.cmp(a) === 0;
};
function ut(t, e, r, n, i) {
  Zs.BasePoint.call(this, t, 'projective'),
    e === null && r === null && n === null
      ? ((this.x = this.curve.zero),
        (this.y = this.curve.one),
        (this.z = this.curve.one),
        (this.t = this.curve.zero),
        (this.zOne = !0))
      : ((this.x = new mn(e, 16)),
        (this.y = new mn(r, 16)),
        (this.z = n ? new mn(n, 16) : this.curve.one),
        (this.t = i && new mn(i, 16)),
        this.x.red || (this.x = this.x.toRed(this.curve.red)),
        this.y.red || (this.y = this.y.toRed(this.curve.red)),
        this.z.red || (this.z = this.z.toRed(this.curve.red)),
        this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)),
        (this.zOne = this.z === this.curve.one),
        this.curve.extended &&
          !this.t &&
          ((this.t = this.x.redMul(this.y)),
          this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
}
Dl(ut, Zs.BasePoint);
Zr.prototype.pointFromJSON = function (e) {
  return ut.fromJSON(this, e);
};
Zr.prototype.point = function (e, r, n, i) {
  return new ut(this, e, r, n, i);
};
ut.fromJSON = function (e, r) {
  return new ut(e, r[0], r[1], r[2]);
};
ut.prototype.inspect = function () {
  return this.isInfinity()
    ? '<EC Point Infinity>'
    : '<EC Point x: ' +
        this.x.fromRed().toString(16, 2) +
        ' y: ' +
        this.y.fromRed().toString(16, 2) +
        ' z: ' +
        this.z.fromRed().toString(16, 2) +
        '>';
};
ut.prototype.isInfinity = function () {
  return (
    this.x.cmpn(0) === 0 &&
    (this.y.cmp(this.z) === 0 || (this.zOne && this.y.cmp(this.curve.c) === 0))
  );
};
ut.prototype._extDbl = function () {
  var e = this.x.redSqr(),
    r = this.y.redSqr(),
    n = this.z.redSqr();
  n = n.redIAdd(n);
  var i = this.curve._mulA(e),
    a = this.x.redAdd(this.y).redSqr().redISub(e).redISub(r),
    o = i.redAdd(r),
    c = o.redSub(n),
    h = i.redSub(r),
    m = a.redMul(c),
    w = o.redMul(h),
    x = a.redMul(h),
    T = c.redMul(o);
  return this.curve.point(m, w, T, x);
};
ut.prototype._projDbl = function () {
  var e = this.x.redAdd(this.y).redSqr(),
    r = this.x.redSqr(),
    n = this.y.redSqr(),
    i,
    a,
    o,
    c,
    h,
    m;
  if (this.curve.twisted) {
    c = this.curve._mulA(r);
    var w = c.redAdd(n);
    this.zOne
      ? ((i = e.redSub(r).redSub(n).redMul(w.redSub(this.curve.two))),
        (a = w.redMul(c.redSub(n))),
        (o = w.redSqr().redSub(w).redSub(w)))
      : ((h = this.z.redSqr()),
        (m = w.redSub(h).redISub(h)),
        (i = e.redSub(r).redISub(n).redMul(m)),
        (a = w.redMul(c.redSub(n))),
        (o = w.redMul(m)));
  } else
    (c = r.redAdd(n)),
      (h = this.curve._mulC(this.z).redSqr()),
      (m = c.redSub(h).redSub(h)),
      (i = this.curve._mulC(e.redISub(c)).redMul(m)),
      (a = this.curve._mulC(c).redMul(r.redISub(n))),
      (o = c.redMul(m));
  return this.curve.point(i, a, o);
};
ut.prototype.dbl = function () {
  return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
};
ut.prototype._extAdd = function (e) {
  var r = this.y.redSub(this.x).redMul(e.y.redSub(e.x)),
    n = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),
    i = this.t.redMul(this.curve.dd).redMul(e.t),
    a = this.z.redMul(e.z.redAdd(e.z)),
    o = n.redSub(r),
    c = a.redSub(i),
    h = a.redAdd(i),
    m = n.redAdd(r),
    w = o.redMul(c),
    x = h.redMul(m),
    T = o.redMul(m),
    I = c.redMul(h);
  return this.curve.point(w, x, I, T);
};
ut.prototype._projAdd = function (e) {
  var r = this.z.redMul(e.z),
    n = r.redSqr(),
    i = this.x.redMul(e.x),
    a = this.y.redMul(e.y),
    o = this.curve.d.redMul(i).redMul(a),
    c = n.redSub(o),
    h = n.redAdd(o),
    m = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(i).redISub(a),
    w = r.redMul(c).redMul(m),
    x,
    T;
  return (
    this.curve.twisted
      ? ((x = r.redMul(h).redMul(a.redSub(this.curve._mulA(i)))), (T = c.redMul(h)))
      : ((x = r.redMul(h).redMul(a.redSub(i))), (T = this.curve._mulC(c).redMul(h))),
    this.curve.point(w, x, T)
  );
};
ut.prototype.add = function (e) {
  return this.isInfinity()
    ? e
    : e.isInfinity()
    ? this
    : this.curve.extended
    ? this._extAdd(e)
    : this._projAdd(e);
};
ut.prototype.mul = function (e) {
  return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
};
ut.prototype.mulAdd = function (e, r, n) {
  return this.curve._wnafMulAdd(1, [this, r], [e, n], 2, !1);
};
ut.prototype.jmulAdd = function (e, r, n) {
  return this.curve._wnafMulAdd(1, [this, r], [e, n], 2, !0);
};
ut.prototype.normalize = function () {
  if (this.zOne) return this;
  var e = this.z.redInvm();
  return (
    (this.x = this.x.redMul(e)),
    (this.y = this.y.redMul(e)),
    this.t && (this.t = this.t.redMul(e)),
    (this.z = this.curve.one),
    (this.zOne = !0),
    this
  );
};
ut.prototype.neg = function () {
  return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
};
ut.prototype.getX = function () {
  return this.normalize(), this.x.fromRed();
};
ut.prototype.getY = function () {
  return this.normalize(), this.y.fromRed();
};
ut.prototype.eq = function (e) {
  return this === e || (this.getX().cmp(e.getX()) === 0 && this.getY().cmp(e.getY()) === 0);
};
ut.prototype.eqXToP = function (e) {
  var r = e.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(r) === 0) return !0;
  for (var n = e.clone(), i = this.curve.redN.redMul(this.z); ; ) {
    if ((n.iadd(this.curve.n), n.cmp(this.curve.p) >= 0)) return !1;
    if ((r.redIAdd(i), this.x.cmp(r) === 0)) return !0;
  }
};
ut.prototype.toP = ut.prototype.normalize;
ut.prototype.mixedAdd = ut.prototype.add;
(function (t) {
  var e = t;
  (e.base = Ys), (e.short = T4), (e.mont = N4), (e.edwards = A4);
})(rf);
var eo = {},
  Ro,
  Fu;
function O4() {
  return (
    Fu ||
      ((Fu = 1),
      (Ro = {
        doubles: {
          step: 4,
          points: [
            [
              'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
              'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821',
            ],
            [
              '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
              '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf',
            ],
            [
              '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
              'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695',
            ],
            [
              '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
              '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9',
            ],
            [
              '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
              '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36',
            ],
            [
              '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
              '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f',
            ],
            [
              'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
              '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999',
            ],
            [
              '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
              'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09',
            ],
            [
              'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
              '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d',
            ],
            [
              'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
              'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088',
            ],
            [
              'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
              '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d',
            ],
            [
              '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
              '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8',
            ],
            [
              '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
              '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a',
            ],
            [
              '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
              '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453',
            ],
            [
              '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
              '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160',
            ],
            [
              '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
              '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0',
            ],
            [
              '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
              '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6',
            ],
            [
              '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
              '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589',
            ],
            [
              '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
              'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17',
            ],
            [
              'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
              '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda',
            ],
            [
              'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
              '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd',
            ],
            [
              '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
              '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2',
            ],
            [
              '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
              '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6',
            ],
            [
              'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
              '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f',
            ],
            [
              '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
              'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01',
            ],
            [
              'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
              '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3',
            ],
            [
              'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
              'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f',
            ],
            [
              'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
              '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7',
            ],
            [
              'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
              'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78',
            ],
            [
              'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
              '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1',
            ],
            [
              '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
              'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150',
            ],
            [
              '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
              '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82',
            ],
            [
              'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
              '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc',
            ],
            [
              '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
              'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b',
            ],
            [
              'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
              '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51',
            ],
            [
              'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
              '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45',
            ],
            [
              'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
              'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120',
            ],
            [
              '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
              '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84',
            ],
            [
              '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
              '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d',
            ],
            [
              '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
              'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d',
            ],
            [
              '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
              '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8',
            ],
            [
              'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
              '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8',
            ],
            [
              '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
              '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac',
            ],
            [
              '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
              'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f',
            ],
            [
              '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
              '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962',
            ],
            [
              'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
              '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907',
            ],
            [
              '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
              'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec',
            ],
            [
              'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
              'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d',
            ],
            [
              'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
              '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414',
            ],
            [
              '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
              'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd',
            ],
            [
              '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
              'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0',
            ],
            [
              'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
              '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811',
            ],
            [
              'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
              '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1',
            ],
            [
              'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
              '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c',
            ],
            [
              '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
              'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73',
            ],
            [
              '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
              '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd',
            ],
            [
              'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
              'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405',
            ],
            [
              '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
              'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589',
            ],
            [
              '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
              '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e',
            ],
            [
              '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
              '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27',
            ],
            [
              'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
              'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1',
            ],
            [
              '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
              '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482',
            ],
            [
              '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
              '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945',
            ],
            [
              'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
              '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573',
            ],
            [
              'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
              'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82',
            ],
          ],
        },
        naf: {
          wnd: 7,
          points: [
            [
              'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
              '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672',
            ],
            [
              '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
              'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6',
            ],
            [
              '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
              '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da',
            ],
            [
              'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
              'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37',
            ],
            [
              '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
              'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b',
            ],
            [
              'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
              'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81',
            ],
            [
              'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
              '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58',
            ],
            [
              'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
              '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77',
            ],
            [
              '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
              '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a',
            ],
            [
              '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
              '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c',
            ],
            [
              '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
              '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67',
            ],
            [
              '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
              '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402',
            ],
            [
              'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
              'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55',
            ],
            [
              'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
              '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482',
            ],
            [
              '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
              'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82',
            ],
            [
              '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
              'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396',
            ],
            [
              '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
              '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49',
            ],
            [
              '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
              '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf',
            ],
            [
              '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
              '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a',
            ],
            [
              '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
              'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7',
            ],
            [
              'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
              'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933',
            ],
            [
              '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
              '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a',
            ],
            [
              '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
              '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6',
            ],
            [
              'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
              'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37',
            ],
            [
              '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
              '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e',
            ],
            [
              'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
              'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6',
            ],
            [
              'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
              'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476',
            ],
            [
              '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
              '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40',
            ],
            [
              '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
              '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61',
            ],
            [
              '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
              '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683',
            ],
            [
              'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
              '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5',
            ],
            [
              '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
              '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b',
            ],
            [
              'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
              '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417',
            ],
            [
              '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
              'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868',
            ],
            [
              '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
              'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a',
            ],
            [
              'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
              'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6',
            ],
            [
              '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
              '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996',
            ],
            [
              '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
              'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e',
            ],
            [
              'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
              'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d',
            ],
            [
              '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
              '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2',
            ],
            [
              '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
              'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e',
            ],
            [
              '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
              '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437',
            ],
            [
              '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
              'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311',
            ],
            [
              'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
              '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4',
            ],
            [
              '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
              '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575',
            ],
            [
              '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
              'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d',
            ],
            [
              '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
              'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d',
            ],
            [
              'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
              'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629',
            ],
            [
              'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
              'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06',
            ],
            [
              '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
              '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374',
            ],
            [
              '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
              '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee',
            ],
            [
              'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
              '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1',
            ],
            [
              'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
              'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b',
            ],
            [
              '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
              '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661',
            ],
            [
              '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
              '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6',
            ],
            [
              'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
              '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e',
            ],
            [
              '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
              '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d',
            ],
            [
              'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
              'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc',
            ],
            [
              '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
              'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4',
            ],
            [
              '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
              '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c',
            ],
            [
              'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
              '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b',
            ],
            [
              'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
              '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913',
            ],
            [
              '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
              '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154',
            ],
            [
              '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
              '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865',
            ],
            [
              '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
              'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc',
            ],
            [
              '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
              'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224',
            ],
            [
              '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
              '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e',
            ],
            [
              '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
              '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6',
            ],
            [
              '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
              '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511',
            ],
            [
              '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
              'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b',
            ],
            [
              'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
              'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2',
            ],
            [
              '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
              'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c',
            ],
            [
              'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
              '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3',
            ],
            [
              'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
              '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d',
            ],
            [
              'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
              '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700',
            ],
            [
              'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
              '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4',
            ],
            [
              '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
              'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196',
            ],
            [
              '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
              '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4',
            ],
            [
              '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
              'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257',
            ],
            [
              'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
              'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13',
            ],
            [
              'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
              '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096',
            ],
            [
              'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
              'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38',
            ],
            [
              'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
              '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f',
            ],
            [
              '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
              '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448',
            ],
            [
              'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
              '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a',
            ],
            [
              'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
              '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4',
            ],
            [
              '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
              '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437',
            ],
            [
              '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
              'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7',
            ],
            [
              'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
              '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d',
            ],
            [
              'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
              '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a',
            ],
            [
              'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
              '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54',
            ],
            [
              '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
              '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77',
            ],
            [
              'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
              'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517',
            ],
            [
              '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
              'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10',
            ],
            [
              'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
              'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125',
            ],
            [
              'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
              '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e',
            ],
            [
              '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
              'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1',
            ],
            [
              'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
              '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2',
            ],
            [
              'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
              '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423',
            ],
            [
              'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
              '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8',
            ],
            [
              '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
              'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758',
            ],
            [
              '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
              'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375',
            ],
            [
              'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
              '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d',
            ],
            [
              '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
              'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec',
            ],
            [
              '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
              '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0',
            ],
            [
              '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
              'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c',
            ],
            [
              'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
              'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4',
            ],
            [
              '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
              'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f',
            ],
            [
              '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
              '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649',
            ],
            [
              '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
              'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826',
            ],
            [
              '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
              '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5',
            ],
            [
              'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
              'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87',
            ],
            [
              '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
              '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b',
            ],
            [
              'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
              '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc',
            ],
            [
              '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
              '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c',
            ],
            [
              'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
              'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f',
            ],
            [
              'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
              '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a',
            ],
            [
              'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
              'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46',
            ],
            [
              '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
              'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f',
            ],
            [
              '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
              '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03',
            ],
            [
              '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
              'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08',
            ],
            [
              '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
              '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8',
            ],
            [
              '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
              '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373',
            ],
            [
              '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
              'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3',
            ],
            [
              '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
              '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8',
            ],
            [
              '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
              '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1',
            ],
            [
              '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
              '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9',
            ],
          ],
        },
      })),
    Ro
  );
}
(function (t) {
  var e = t,
    r = On,
    n = rf,
    i = mr,
    a = i.assert;
  function o(m) {
    m.type === 'short'
      ? (this.curve = new n.short(m))
      : m.type === 'edwards'
      ? (this.curve = new n.edwards(m))
      : (this.curve = new n.mont(m)),
      (this.g = this.curve.g),
      (this.n = this.curve.n),
      (this.hash = m.hash),
      a(this.g.validate(), 'Invalid curve'),
      a(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
  }
  e.PresetCurve = o;
  function c(m, w) {
    Object.defineProperty(e, m, {
      configurable: !0,
      enumerable: !0,
      get: function () {
        var x = new o(w);
        return Object.defineProperty(e, m, { configurable: !0, enumerable: !0, value: x }), x;
      },
    });
  }
  c('p192', {
    type: 'short',
    prime: 'p192',
    p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
    a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
    b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
    n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
    hash: r.sha256,
    gRed: !1,
    g: [
      '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
      '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811',
    ],
  }),
    c('p224', {
      type: 'short',
      prime: 'p224',
      p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
      a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
      b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
      n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
      hash: r.sha256,
      gRed: !1,
      g: [
        'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
        'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34',
      ],
    }),
    c('p256', {
      type: 'short',
      prime: null,
      p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
      a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
      b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
      n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
      hash: r.sha256,
      gRed: !1,
      g: [
        '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
        '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5',
      ],
    }),
    c('p384', {
      type: 'short',
      prime: null,
      p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff',
      a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc',
      b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
      n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
      hash: r.sha384,
      gRed: !1,
      g: [
        'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7',
        '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f',
      ],
    }),
    c('p521', {
      type: 'short',
      prime: null,
      p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff',
      a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc',
      b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
      n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
      hash: r.sha512,
      gRed: !1,
      g: [
        '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
        '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650',
      ],
    }),
    c('curve25519', {
      type: 'mont',
      prime: 'p25519',
      p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
      a: '76d06',
      b: '1',
      n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
      hash: r.sha256,
      gRed: !1,
      g: ['9'],
    }),
    c('ed25519', {
      type: 'edwards',
      prime: 'p25519',
      p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
      a: '-1',
      c: '1',
      d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
      n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
      hash: r.sha256,
      gRed: !1,
      g: [
        '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',
        '6666666666666666666666666666666666666666666666666666666666666658',
      ],
    });
  var h;
  try {
    h = O4();
  } catch {
    h = void 0;
  }
  c('secp256k1', {
    type: 'short',
    prime: 'k256',
    p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
    a: '0',
    b: '7',
    n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
    h: '1',
    hash: r.sha256,
    beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
    lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
    basis: [
      { a: '3086d221a7d46bcde86c90e49284eb15', b: '-e4437ed6010e88286f547fa90abfe4c3' },
      { a: '114ca50f7a8e2f3f657c1108d9d44cfd8', b: '3086d221a7d46bcde86c90e49284eb15' },
    ],
    gRed: !1,
    g: [
      '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
      '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
      h,
    ],
  });
})(eo);
var R4 = On,
  Gn = tf,
  $l = Xn;
function $n(t) {
  if (!(this instanceof $n)) return new $n(t);
  (this.hash = t.hash),
    (this.predResist = !!t.predResist),
    (this.outLen = this.hash.outSize),
    (this.minEntropy = t.minEntropy || this.hash.hmacStrength),
    (this._reseed = null),
    (this.reseedInterval = null),
    (this.K = null),
    (this.V = null);
  var e = Gn.toArray(t.entropy, t.entropyEnc || 'hex'),
    r = Gn.toArray(t.nonce, t.nonceEnc || 'hex'),
    n = Gn.toArray(t.pers, t.persEnc || 'hex');
  $l(
    e.length >= this.minEntropy / 8,
    'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits'
  ),
    this._init(e, r, n);
}
var D4 = $n;
$n.prototype._init = function (e, r, n) {
  var i = e.concat(r).concat(n);
  (this.K = new Array(this.outLen / 8)), (this.V = new Array(this.outLen / 8));
  for (var a = 0; a < this.V.length; a++) (this.K[a] = 0), (this.V[a] = 1);
  this._update(i), (this._reseed = 1), (this.reseedInterval = 281474976710656);
};
$n.prototype._hmac = function () {
  return new R4.hmac(this.hash, this.K);
};
$n.prototype._update = function (e) {
  var r = this._hmac().update(this.V).update([0]);
  e && (r = r.update(e)),
    (this.K = r.digest()),
    (this.V = this._hmac().update(this.V).digest()),
    e &&
      ((this.K = this._hmac().update(this.V).update([1]).update(e).digest()),
      (this.V = this._hmac().update(this.V).digest()));
};
$n.prototype.reseed = function (e, r, n, i) {
  typeof r != 'string' && ((i = n), (n = r), (r = null)),
    (e = Gn.toArray(e, r)),
    (n = Gn.toArray(n, i)),
    $l(
      e.length >= this.minEntropy / 8,
      'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits'
    ),
    this._update(e.concat(n || [])),
    (this._reseed = 1);
};
$n.prototype.generate = function (e, r, n, i) {
  if (this._reseed > this.reseedInterval) throw new Error('Reseed is required');
  typeof r != 'string' && ((i = n), (n = r), (r = null)),
    n && ((n = Gn.toArray(n, i || 'hex')), this._update(n));
  for (var a = []; a.length < e; )
    (this.V = this._hmac().update(this.V).digest()), (a = a.concat(this.V));
  var o = a.slice(0, e);
  return this._update(n), this._reseed++, Gn.encode(o, r);
};
var $4 = Cr,
  k4 = mr,
  nc = k4.assert;
function Kt(t, e) {
  (this.ec = t),
    (this.priv = null),
    (this.pub = null),
    e.priv && this._importPrivate(e.priv, e.privEnc),
    e.pub && this._importPublic(e.pub, e.pubEnc);
}
var C4 = Kt;
Kt.fromPublic = function (e, r, n) {
  return r instanceof Kt ? r : new Kt(e, { pub: r, pubEnc: n });
};
Kt.fromPrivate = function (e, r, n) {
  return r instanceof Kt ? r : new Kt(e, { priv: r, privEnc: n });
};
Kt.prototype.validate = function () {
  var e = this.getPublic();
  return e.isInfinity()
    ? { result: !1, reason: 'Invalid public key' }
    : e.validate()
    ? e.mul(this.ec.curve.n).isInfinity()
      ? { result: !0, reason: null }
      : { result: !1, reason: 'Public key * N != O' }
    : { result: !1, reason: 'Public key is not a point' };
};
Kt.prototype.getPublic = function (e, r) {
  return (
    typeof e == 'string' && ((r = e), (e = null)),
    this.pub || (this.pub = this.ec.g.mul(this.priv)),
    r ? this.pub.encode(r, e) : this.pub
  );
};
Kt.prototype.getPrivate = function (e) {
  return e === 'hex' ? this.priv.toString(16, 2) : this.priv;
};
Kt.prototype._importPrivate = function (e, r) {
  (this.priv = new $4(e, r || 16)), (this.priv = this.priv.umod(this.ec.curve.n));
};
Kt.prototype._importPublic = function (e, r) {
  if (e.x || e.y) {
    this.ec.curve.type === 'mont'
      ? nc(e.x, 'Need x coordinate')
      : (this.ec.curve.type === 'short' || this.ec.curve.type === 'edwards') &&
        nc(e.x && e.y, 'Need both x and y coordinate'),
      (this.pub = this.ec.curve.point(e.x, e.y));
    return;
  }
  this.pub = this.ec.curve.decodePoint(e, r);
};
Kt.prototype.derive = function (e) {
  return e.validate() || nc(e.validate(), 'public point not validated'), e.mul(this.priv).getX();
};
Kt.prototype.sign = function (e, r, n) {
  return this.ec.sign(e, this, r, n);
};
Kt.prototype.verify = function (e, r) {
  return this.ec.verify(e, r, this);
};
Kt.prototype.inspect = function () {
  return (
    '<Key priv: ' +
    (this.priv && this.priv.toString(16, 2)) +
    ' pub: ' +
    (this.pub && this.pub.inspect()) +
    ' >'
  );
};
var Os = Cr,
  af = mr,
  P4 = af.assert;
function to(t, e) {
  if (t instanceof to) return t;
  this._importDER(t, e) ||
    (P4(t.r && t.s, 'Signature without r or s'),
    (this.r = new Os(t.r, 16)),
    (this.s = new Os(t.s, 16)),
    t.recoveryParam === void 0
      ? (this.recoveryParam = null)
      : (this.recoveryParam = t.recoveryParam));
}
var L4 = to;
function F4() {
  this.place = 0;
}
function Do(t, e) {
  var r = t[e.place++];
  if (!(r & 128)) return r;
  var n = r & 15;
  if (n === 0 || n > 4) return !1;
  for (var i = 0, a = 0, o = e.place; a < n; a++, o++) (i <<= 8), (i |= t[o]), (i >>>= 0);
  return i <= 127 ? !1 : ((e.place = o), i);
}
function Uu(t) {
  for (var e = 0, r = t.length - 1; !t[e] && !(t[e + 1] & 128) && e < r; ) e++;
  return e === 0 ? t : t.slice(e);
}
to.prototype._importDER = function (e, r) {
  e = af.toArray(e, r);
  var n = new F4();
  if (e[n.place++] !== 48) return !1;
  var i = Do(e, n);
  if (i === !1 || i + n.place !== e.length || e[n.place++] !== 2) return !1;
  var a = Do(e, n);
  if (a === !1) return !1;
  var o = e.slice(n.place, a + n.place);
  if (((n.place += a), e[n.place++] !== 2)) return !1;
  var c = Do(e, n);
  if (c === !1 || e.length !== c + n.place) return !1;
  var h = e.slice(n.place, c + n.place);
  if (o[0] === 0)
    if (o[1] & 128) o = o.slice(1);
    else return !1;
  if (h[0] === 0)
    if (h[1] & 128) h = h.slice(1);
    else return !1;
  return (this.r = new Os(o)), (this.s = new Os(h)), (this.recoveryParam = null), !0;
};
function $o(t, e) {
  if (e < 128) {
    t.push(e);
    return;
  }
  var r = 1 + ((Math.log(e) / Math.LN2) >>> 3);
  for (t.push(r | 128); --r; ) t.push((e >>> (r << 3)) & 255);
  t.push(e);
}
to.prototype.toDER = function (e) {
  var r = this.r.toArray(),
    n = this.s.toArray();
  for (
    r[0] & 128 && (r = [0].concat(r)), n[0] & 128 && (n = [0].concat(n)), r = Uu(r), n = Uu(n);
    !n[0] && !(n[1] & 128);

  )
    n = n.slice(1);
  var i = [2];
  $o(i, r.length), (i = i.concat(r)), i.push(2), $o(i, n.length);
  var a = i.concat(n),
    o = [48];
  return $o(o, a.length), (o = o.concat(a)), af.encode(o, e);
};
var Jn = Cr,
  kl = D4,
  U4 = mr,
  ko = eo,
  q4 = ba,
  Cl = U4.assert,
  sf = C4,
  ro = L4;
function _r(t) {
  if (!(this instanceof _r)) return new _r(t);
  typeof t == 'string' &&
    (Cl(Object.prototype.hasOwnProperty.call(ko, t), 'Unknown curve ' + t), (t = ko[t])),
    t instanceof ko.PresetCurve && (t = { curve: t }),
    (this.curve = t.curve.curve),
    (this.n = this.curve.n),
    (this.nh = this.n.ushrn(1)),
    (this.g = this.curve.g),
    (this.g = t.curve.g),
    this.g.precompute(t.curve.n.bitLength() + 1),
    (this.hash = t.hash || t.curve.hash);
}
var B4 = _r;
_r.prototype.keyPair = function (e) {
  return new sf(this, e);
};
_r.prototype.keyFromPrivate = function (e, r) {
  return sf.fromPrivate(this, e, r);
};
_r.prototype.keyFromPublic = function (e, r) {
  return sf.fromPublic(this, e, r);
};
_r.prototype.genKeyPair = function (e) {
  e || (e = {});
  for (
    var r = new kl({
        hash: this.hash,
        pers: e.pers,
        persEnc: e.persEnc || 'utf8',
        entropy: e.entropy || q4(this.hash.hmacStrength),
        entropyEnc: (e.entropy && e.entropyEnc) || 'utf8',
        nonce: this.n.toArray(),
      }),
      n = this.n.byteLength(),
      i = this.n.sub(new Jn(2));
    ;

  ) {
    var a = new Jn(r.generate(n));
    if (!(a.cmp(i) > 0)) return a.iaddn(1), this.keyFromPrivate(a);
  }
};
_r.prototype._truncateToN = function (e, r) {
  var n = e.byteLength() * 8 - this.n.bitLength();
  return n > 0 && (e = e.ushrn(n)), !r && e.cmp(this.n) >= 0 ? e.sub(this.n) : e;
};
_r.prototype.sign = function (e, r, n, i) {
  typeof n == 'object' && ((i = n), (n = null)),
    i || (i = {}),
    (r = this.keyFromPrivate(r, n)),
    (e = this._truncateToN(new Jn(e, 16)));
  for (
    var a = this.n.byteLength(),
      o = r.getPrivate().toArray('be', a),
      c = e.toArray('be', a),
      h = new kl({
        hash: this.hash,
        entropy: o,
        nonce: c,
        pers: i.pers,
        persEnc: i.persEnc || 'utf8',
      }),
      m = this.n.sub(new Jn(1)),
      w = 0;
    ;
    w++
  ) {
    var x = i.k ? i.k(w) : new Jn(h.generate(this.n.byteLength()));
    if (((x = this._truncateToN(x, !0)), !(x.cmpn(1) <= 0 || x.cmp(m) >= 0))) {
      var T = this.g.mul(x);
      if (!T.isInfinity()) {
        var I = T.getX(),
          M = I.umod(this.n);
        if (M.cmpn(0) !== 0) {
          var k = x.invm(this.n).mul(M.mul(r.getPrivate()).iadd(e));
          if (((k = k.umod(this.n)), k.cmpn(0) !== 0)) {
            var F = (T.getY().isOdd() ? 1 : 0) | (I.cmp(M) !== 0 ? 2 : 0);
            return (
              i.canonical && k.cmp(this.nh) > 0 && ((k = this.n.sub(k)), (F ^= 1)),
              new ro({ r: M, s: k, recoveryParam: F })
            );
          }
        }
      }
    }
  }
};
_r.prototype.verify = function (e, r, n, i) {
  (e = this._truncateToN(new Jn(e, 16))), (n = this.keyFromPublic(n, i)), (r = new ro(r, 'hex'));
  var a = r.r,
    o = r.s;
  if (a.cmpn(1) < 0 || a.cmp(this.n) >= 0 || o.cmpn(1) < 0 || o.cmp(this.n) >= 0) return !1;
  var c = o.invm(this.n),
    h = c.mul(e).umod(this.n),
    m = c.mul(a).umod(this.n),
    w;
  return this.curve._maxwellTrick
    ? ((w = this.g.jmulAdd(h, n.getPublic(), m)), w.isInfinity() ? !1 : w.eqXToP(a))
    : ((w = this.g.mulAdd(h, n.getPublic(), m)),
      w.isInfinity() ? !1 : w.getX().umod(this.n).cmp(a) === 0);
};
_r.prototype.recoverPubKey = function (t, e, r, n) {
  Cl((3 & r) === r, 'The recovery param is more than two bits'), (e = new ro(e, n));
  var i = this.n,
    a = new Jn(t),
    o = e.r,
    c = e.s,
    h = r & 1,
    m = r >> 1;
  if (o.cmp(this.curve.p.umod(this.curve.n)) >= 0 && m)
    throw new Error('Unable to find sencond key candinate');
  m ? (o = this.curve.pointFromX(o.add(this.curve.n), h)) : (o = this.curve.pointFromX(o, h));
  var w = e.r.invm(i),
    x = i.sub(a).mul(w).umod(i),
    T = c.mul(w).umod(i);
  return this.g.mulAdd(x, o, T);
};
_r.prototype.getKeyRecoveryParam = function (t, e, r, n) {
  if (((e = new ro(e, n)), e.recoveryParam !== null)) return e.recoveryParam;
  for (var i = 0; i < 4; i++) {
    var a;
    try {
      a = this.recoverPubKey(t, e, i);
    } catch {
      continue;
    }
    if (a.eq(r)) return i;
  }
  throw new Error('Unable to find valid recovery factor');
};
var $a = mr,
  Pl = $a.assert,
  qu = $a.parseBytes,
  ji = $a.cachedProperty;
function Bt(t, e) {
  (this.eddsa = t),
    (this._secret = qu(e.secret)),
    t.isPoint(e.pub) ? (this._pub = e.pub) : (this._pubBytes = qu(e.pub));
}
Bt.fromPublic = function (e, r) {
  return r instanceof Bt ? r : new Bt(e, { pub: r });
};
Bt.fromSecret = function (e, r) {
  return r instanceof Bt ? r : new Bt(e, { secret: r });
};
Bt.prototype.secret = function () {
  return this._secret;
};
ji(Bt, 'pubBytes', function () {
  return this.eddsa.encodePoint(this.pub());
});
ji(Bt, 'pub', function () {
  return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
});
ji(Bt, 'privBytes', function () {
  var e = this.eddsa,
    r = this.hash(),
    n = e.encodingLength - 1,
    i = r.slice(0, e.encodingLength);
  return (i[0] &= 248), (i[n] &= 127), (i[n] |= 64), i;
});
ji(Bt, 'priv', function () {
  return this.eddsa.decodeInt(this.privBytes());
});
ji(Bt, 'hash', function () {
  return this.eddsa.hash().update(this.secret()).digest();
});
ji(Bt, 'messagePrefix', function () {
  return this.hash().slice(this.eddsa.encodingLength);
});
Bt.prototype.sign = function (e) {
  return Pl(this._secret, 'KeyPair can only verify'), this.eddsa.sign(e, this);
};
Bt.prototype.verify = function (e, r) {
  return this.eddsa.verify(e, r, this);
};
Bt.prototype.getSecret = function (e) {
  return Pl(this._secret, 'KeyPair is public only'), $a.encode(this.secret(), e);
};
Bt.prototype.getPublic = function (e) {
  return $a.encode(this.pubBytes(), e);
};
var V4 = Bt,
  j4 = Cr,
  no = mr,
  z4 = no.assert,
  io = no.cachedProperty,
  G4 = no.parseBytes;
function ei(t, e) {
  (this.eddsa = t),
    typeof e != 'object' && (e = G4(e)),
    Array.isArray(e) && (e = { R: e.slice(0, t.encodingLength), S: e.slice(t.encodingLength) }),
    z4(e.R && e.S, 'Signature without R or S'),
    t.isPoint(e.R) && (this._R = e.R),
    e.S instanceof j4 && (this._S = e.S),
    (this._Rencoded = Array.isArray(e.R) ? e.R : e.Rencoded),
    (this._Sencoded = Array.isArray(e.S) ? e.S : e.Sencoded);
}
io(ei, 'S', function () {
  return this.eddsa.decodeInt(this.Sencoded());
});
io(ei, 'R', function () {
  return this.eddsa.decodePoint(this.Rencoded());
});
io(ei, 'Rencoded', function () {
  return this.eddsa.encodePoint(this.R());
});
io(ei, 'Sencoded', function () {
  return this.eddsa.encodeInt(this.S());
});
ei.prototype.toBytes = function () {
  return this.Rencoded().concat(this.Sencoded());
};
ei.prototype.toHex = function () {
  return no.encode(this.toBytes(), 'hex').toUpperCase();
};
var J4 = ei,
  H4 = On,
  W4 = eo,
  $i = mr,
  K4 = $i.assert,
  Ll = $i.parseBytes,
  Fl = V4,
  Bu = J4;
function sr(t) {
  if ((K4(t === 'ed25519', 'only tested with ed25519 so far'), !(this instanceof sr)))
    return new sr(t);
  (t = W4[t].curve),
    (this.curve = t),
    (this.g = t.g),
    this.g.precompute(t.n.bitLength() + 1),
    (this.pointClass = t.point().constructor),
    (this.encodingLength = Math.ceil(t.n.bitLength() / 8)),
    (this.hash = H4.sha512);
}
var Q4 = sr;
sr.prototype.sign = function (e, r) {
  e = Ll(e);
  var n = this.keyFromSecret(r),
    i = this.hashInt(n.messagePrefix(), e),
    a = this.g.mul(i),
    o = this.encodePoint(a),
    c = this.hashInt(o, n.pubBytes(), e).mul(n.priv()),
    h = i.add(c).umod(this.curve.n);
  return this.makeSignature({ R: a, S: h, Rencoded: o });
};
sr.prototype.verify = function (e, r, n) {
  (e = Ll(e)), (r = this.makeSignature(r));
  var i = this.keyFromPublic(n),
    a = this.hashInt(r.Rencoded(), i.pubBytes(), e),
    o = this.g.mul(r.S()),
    c = r.R().add(i.pub().mul(a));
  return c.eq(o);
};
sr.prototype.hashInt = function () {
  for (var e = this.hash(), r = 0; r < arguments.length; r++) e.update(arguments[r]);
  return $i.intFromLE(e.digest()).umod(this.curve.n);
};
sr.prototype.keyFromPublic = function (e) {
  return Fl.fromPublic(this, e);
};
sr.prototype.keyFromSecret = function (e) {
  return Fl.fromSecret(this, e);
};
sr.prototype.makeSignature = function (e) {
  return e instanceof Bu ? e : new Bu(this, e);
};
sr.prototype.encodePoint = function (e) {
  var r = e.getY().toArray('le', this.encodingLength);
  return (r[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0), r;
};
sr.prototype.decodePoint = function (e) {
  e = $i.parseBytes(e);
  var r = e.length - 1,
    n = e.slice(0, r).concat(e[r] & -129),
    i = (e[r] & 128) !== 0,
    a = $i.intFromLE(n);
  return this.curve.pointFromY(a, i);
};
sr.prototype.encodeInt = function (e) {
  return e.toArray('le', this.encodingLength);
};
sr.prototype.decodeInt = function (e) {
  return $i.intFromLE(e);
};
sr.prototype.isPoint = function (e) {
  return e instanceof this.pointClass;
};
(function (t) {
  var e = t;
  (e.version = g4.version),
    (e.utils = mr),
    (e.rand = ba),
    (e.curve = rf),
    (e.curves = eo),
    (e.ec = B4),
    (e.eddsa = Q4);
})(Ol);
function ii() {
  return new Ol.ec('secp256k1');
}
var Ul = class {
    constructor(t) {
      typeof t == 'string' && t.match(/^[0-9a-f]*$/i) && t.length === 64 && (t = `0x${t}`);
      let e = Y(t),
        r = ii().keyFromPrivate(e, 'hex');
      (this.compressedPublicKey = ee(r.getPublic(!0, 'array'))),
        (this.publicKey = ee(r.getPublic(!1, 'array').slice(1))),
        (this.privateKey = ee(e)),
        (this.address = Ct.fromPublicKey(this.publicKey));
    }
    sign(t) {
      let e = ii().keyFromPrivate(Y(this.privateKey), 'hex').sign(Y(t), { canonical: !0 }),
        r = zr(e.r, 32),
        n = zr(e.s, 32);
      return (n[0] |= (e.recoveryParam || 0) << 7), ee(de([r, n]));
    }
    addPoint(t) {
      let e = ii().keyFromPublic(Y(this.compressedPublicKey)),
        r = ii().keyFromPublic(Y(t)),
        n = e.getPublic().add(r.getPublic());
      return ee(n.encode('array', !0));
    }
    static recoverPublicKey(t, e) {
      let r = Y(e),
        n = r.slice(0, 32),
        i = r.slice(32, 64),
        a = (i[0] & 128) >> 7;
      return (
        (i[0] &= 127), ii().recoverPubKey(Y(t), { r: n, s: i }, a).encode('array', !1).slice(1)
      );
    }
    static recoverAddress(t, e) {
      return Ct.fromPublicKey(Ul.recoverPublicKey(t, e));
    }
    static generatePrivateKey(t) {
      return t ? n4(de([yn(32), Y(t)])) : yn(32);
    }
    static extendPublicKey(t) {
      let e = ii().keyFromPublic(Y(t));
      return ee(e.getPublic(!1, 'array').slice(1));
    }
  },
  ga = Ul;
class ql {
  constructor(e) {
    Ua(this, 'alphabet', e),
      Ua(this, 'base', e.length),
      Ua(this, '_alphabetMap', {}),
      Ua(this, '_leader', e.charAt(0));
    for (let r = 0; r < e.length; r++) this._alphabetMap[e.charAt(r)] = r;
  }
  encode(e) {
    let r = Y(e);
    if (r.length === 0) return '';
    let n = [0];
    for (let a = 0; a < r.length; ++a) {
      let o = r[a];
      for (let c = 0; c < n.length; ++c)
        (o += n[c] << 8), (n[c] = o % this.base), (o = (o / this.base) | 0);
      for (; o > 0; ) n.push(o % this.base), (o = (o / this.base) | 0);
    }
    let i = '';
    for (let a = 0; r[a] === 0 && a < r.length - 1; ++a) i += this._leader;
    for (let a = n.length - 1; a >= 0; --a) i += this.alphabet[n[a]];
    return i;
  }
  decode(e) {
    if (typeof e != 'string') throw new TypeError('Expected String');
    let r = [];
    if (e.length === 0) return new Uint8Array(r);
    r.push(0);
    for (let n = 0; n < e.length; n++) {
      let i = this._alphabetMap[e[n]];
      if (i === void 0) throw new Error('Non-base' + this.base + ' character');
      let a = i;
      for (let o = 0; o < r.length; ++o) (a += r[o] * this.base), (r[o] = a & 255), (a >>= 8);
      for (; a > 0; ) r.push(a & 255), (a >>= 8);
    }
    for (let n = 0; e[n] === this._leader && n < e.length - 1; ++n) r.push(0);
    return Y(new Uint8Array(r.reverse()));
  }
}
new ql('abcdefghijklmnopqrstuvwxyz234567');
const of = new ql('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
var Qa = [
    'abandon',
    'ability',
    'able',
    'about',
    'above',
    'absent',
    'absorb',
    'abstract',
    'absurd',
    'abuse',
    'access',
    'accident',
    'account',
    'accuse',
    'achieve',
    'acid',
    'acoustic',
    'acquire',
    'across',
    'act',
    'action',
    'actor',
    'actress',
    'actual',
    'adapt',
    'add',
    'addict',
    'address',
    'adjust',
    'admit',
    'adult',
    'advance',
    'advice',
    'aerobic',
    'affair',
    'afford',
    'afraid',
    'again',
    'age',
    'agent',
    'agree',
    'ahead',
    'aim',
    'air',
    'airport',
    'aisle',
    'alarm',
    'album',
    'alcohol',
    'alert',
    'alien',
    'all',
    'alley',
    'allow',
    'almost',
    'alone',
    'alpha',
    'already',
    'also',
    'alter',
    'always',
    'amateur',
    'amazing',
    'among',
    'amount',
    'amused',
    'analyst',
    'anchor',
    'ancient',
    'anger',
    'angle',
    'angry',
    'animal',
    'ankle',
    'announce',
    'annual',
    'another',
    'answer',
    'antenna',
    'antique',
    'anxiety',
    'any',
    'apart',
    'apology',
    'appear',
    'apple',
    'approve',
    'april',
    'arch',
    'arctic',
    'area',
    'arena',
    'argue',
    'arm',
    'armed',
    'armor',
    'army',
    'around',
    'arrange',
    'arrest',
    'arrive',
    'arrow',
    'art',
    'artefact',
    'artist',
    'artwork',
    'ask',
    'aspect',
    'assault',
    'asset',
    'assist',
    'assume',
    'asthma',
    'athlete',
    'atom',
    'attack',
    'attend',
    'attitude',
    'attract',
    'auction',
    'audit',
    'august',
    'aunt',
    'author',
    'auto',
    'autumn',
    'average',
    'avocado',
    'avoid',
    'awake',
    'aware',
    'away',
    'awesome',
    'awful',
    'awkward',
    'axis',
    'baby',
    'bachelor',
    'bacon',
    'badge',
    'bag',
    'balance',
    'balcony',
    'ball',
    'bamboo',
    'banana',
    'banner',
    'bar',
    'barely',
    'bargain',
    'barrel',
    'base',
    'basic',
    'basket',
    'battle',
    'beach',
    'bean',
    'beauty',
    'because',
    'become',
    'beef',
    'before',
    'begin',
    'behave',
    'behind',
    'believe',
    'below',
    'belt',
    'bench',
    'benefit',
    'best',
    'betray',
    'better',
    'between',
    'beyond',
    'bicycle',
    'bid',
    'bike',
    'bind',
    'biology',
    'bird',
    'birth',
    'bitter',
    'black',
    'blade',
    'blame',
    'blanket',
    'blast',
    'bleak',
    'bless',
    'blind',
    'blood',
    'blossom',
    'blouse',
    'blue',
    'blur',
    'blush',
    'board',
    'boat',
    'body',
    'boil',
    'bomb',
    'bone',
    'bonus',
    'book',
    'boost',
    'border',
    'boring',
    'borrow',
    'boss',
    'bottom',
    'bounce',
    'box',
    'boy',
    'bracket',
    'brain',
    'brand',
    'brass',
    'brave',
    'bread',
    'breeze',
    'brick',
    'bridge',
    'brief',
    'bright',
    'bring',
    'brisk',
    'broccoli',
    'broken',
    'bronze',
    'broom',
    'brother',
    'brown',
    'brush',
    'bubble',
    'buddy',
    'budget',
    'buffalo',
    'build',
    'bulb',
    'bulk',
    'bullet',
    'bundle',
    'bunker',
    'burden',
    'burger',
    'burst',
    'bus',
    'business',
    'busy',
    'butter',
    'buyer',
    'buzz',
    'cabbage',
    'cabin',
    'cable',
    'cactus',
    'cage',
    'cake',
    'call',
    'calm',
    'camera',
    'camp',
    'can',
    'canal',
    'cancel',
    'candy',
    'cannon',
    'canoe',
    'canvas',
    'canyon',
    'capable',
    'capital',
    'captain',
    'car',
    'carbon',
    'card',
    'cargo',
    'carpet',
    'carry',
    'cart',
    'case',
    'cash',
    'casino',
    'castle',
    'casual',
    'cat',
    'catalog',
    'catch',
    'category',
    'cattle',
    'caught',
    'cause',
    'caution',
    'cave',
    'ceiling',
    'celery',
    'cement',
    'census',
    'century',
    'cereal',
    'certain',
    'chair',
    'chalk',
    'champion',
    'change',
    'chaos',
    'chapter',
    'charge',
    'chase',
    'chat',
    'cheap',
    'check',
    'cheese',
    'chef',
    'cherry',
    'chest',
    'chicken',
    'chief',
    'child',
    'chimney',
    'choice',
    'choose',
    'chronic',
    'chuckle',
    'chunk',
    'churn',
    'cigar',
    'cinnamon',
    'circle',
    'citizen',
    'city',
    'civil',
    'claim',
    'clap',
    'clarify',
    'claw',
    'clay',
    'clean',
    'clerk',
    'clever',
    'click',
    'client',
    'cliff',
    'climb',
    'clinic',
    'clip',
    'clock',
    'clog',
    'close',
    'cloth',
    'cloud',
    'clown',
    'club',
    'clump',
    'cluster',
    'clutch',
    'coach',
    'coast',
    'coconut',
    'code',
    'coffee',
    'coil',
    'coin',
    'collect',
    'color',
    'column',
    'combine',
    'come',
    'comfort',
    'comic',
    'common',
    'company',
    'concert',
    'conduct',
    'confirm',
    'congress',
    'connect',
    'consider',
    'control',
    'convince',
    'cook',
    'cool',
    'copper',
    'copy',
    'coral',
    'core',
    'corn',
    'correct',
    'cost',
    'cotton',
    'couch',
    'country',
    'couple',
    'course',
    'cousin',
    'cover',
    'coyote',
    'crack',
    'cradle',
    'craft',
    'cram',
    'crane',
    'crash',
    'crater',
    'crawl',
    'crazy',
    'cream',
    'credit',
    'creek',
    'crew',
    'cricket',
    'crime',
    'crisp',
    'critic',
    'crop',
    'cross',
    'crouch',
    'crowd',
    'crucial',
    'cruel',
    'cruise',
    'crumble',
    'crunch',
    'crush',
    'cry',
    'crystal',
    'cube',
    'culture',
    'cup',
    'cupboard',
    'curious',
    'current',
    'curtain',
    'curve',
    'cushion',
    'custom',
    'cute',
    'cycle',
    'dad',
    'damage',
    'damp',
    'dance',
    'danger',
    'daring',
    'dash',
    'daughter',
    'dawn',
    'day',
    'deal',
    'debate',
    'debris',
    'decade',
    'december',
    'decide',
    'decline',
    'decorate',
    'decrease',
    'deer',
    'defense',
    'define',
    'defy',
    'degree',
    'delay',
    'deliver',
    'demand',
    'demise',
    'denial',
    'dentist',
    'deny',
    'depart',
    'depend',
    'deposit',
    'depth',
    'deputy',
    'derive',
    'describe',
    'desert',
    'design',
    'desk',
    'despair',
    'destroy',
    'detail',
    'detect',
    'develop',
    'device',
    'devote',
    'diagram',
    'dial',
    'diamond',
    'diary',
    'dice',
    'diesel',
    'diet',
    'differ',
    'digital',
    'dignity',
    'dilemma',
    'dinner',
    'dinosaur',
    'direct',
    'dirt',
    'disagree',
    'discover',
    'disease',
    'dish',
    'dismiss',
    'disorder',
    'display',
    'distance',
    'divert',
    'divide',
    'divorce',
    'dizzy',
    'doctor',
    'document',
    'dog',
    'doll',
    'dolphin',
    'domain',
    'donate',
    'donkey',
    'donor',
    'door',
    'dose',
    'double',
    'dove',
    'draft',
    'dragon',
    'drama',
    'drastic',
    'draw',
    'dream',
    'dress',
    'drift',
    'drill',
    'drink',
    'drip',
    'drive',
    'drop',
    'drum',
    'dry',
    'duck',
    'dumb',
    'dune',
    'during',
    'dust',
    'dutch',
    'duty',
    'dwarf',
    'dynamic',
    'eager',
    'eagle',
    'early',
    'earn',
    'earth',
    'easily',
    'east',
    'easy',
    'echo',
    'ecology',
    'economy',
    'edge',
    'edit',
    'educate',
    'effort',
    'egg',
    'eight',
    'either',
    'elbow',
    'elder',
    'electric',
    'elegant',
    'element',
    'elephant',
    'elevator',
    'elite',
    'else',
    'embark',
    'embody',
    'embrace',
    'emerge',
    'emotion',
    'employ',
    'empower',
    'empty',
    'enable',
    'enact',
    'end',
    'endless',
    'endorse',
    'enemy',
    'energy',
    'enforce',
    'engage',
    'engine',
    'enhance',
    'enjoy',
    'enlist',
    'enough',
    'enrich',
    'enroll',
    'ensure',
    'enter',
    'entire',
    'entry',
    'envelope',
    'episode',
    'equal',
    'equip',
    'era',
    'erase',
    'erode',
    'erosion',
    'error',
    'erupt',
    'escape',
    'essay',
    'essence',
    'estate',
    'eternal',
    'ethics',
    'evidence',
    'evil',
    'evoke',
    'evolve',
    'exact',
    'example',
    'excess',
    'exchange',
    'excite',
    'exclude',
    'excuse',
    'execute',
    'exercise',
    'exhaust',
    'exhibit',
    'exile',
    'exist',
    'exit',
    'exotic',
    'expand',
    'expect',
    'expire',
    'explain',
    'expose',
    'express',
    'extend',
    'extra',
    'eye',
    'eyebrow',
    'fabric',
    'face',
    'faculty',
    'fade',
    'faint',
    'faith',
    'fall',
    'false',
    'fame',
    'family',
    'famous',
    'fan',
    'fancy',
    'fantasy',
    'farm',
    'fashion',
    'fat',
    'fatal',
    'father',
    'fatigue',
    'fault',
    'favorite',
    'feature',
    'february',
    'federal',
    'fee',
    'feed',
    'feel',
    'female',
    'fence',
    'festival',
    'fetch',
    'fever',
    'few',
    'fiber',
    'fiction',
    'field',
    'figure',
    'file',
    'film',
    'filter',
    'final',
    'find',
    'fine',
    'finger',
    'finish',
    'fire',
    'firm',
    'first',
    'fiscal',
    'fish',
    'fit',
    'fitness',
    'fix',
    'flag',
    'flame',
    'flash',
    'flat',
    'flavor',
    'flee',
    'flight',
    'flip',
    'float',
    'flock',
    'floor',
    'flower',
    'fluid',
    'flush',
    'fly',
    'foam',
    'focus',
    'fog',
    'foil',
    'fold',
    'follow',
    'food',
    'foot',
    'force',
    'forest',
    'forget',
    'fork',
    'fortune',
    'forum',
    'forward',
    'fossil',
    'foster',
    'found',
    'fox',
    'fragile',
    'frame',
    'frequent',
    'fresh',
    'friend',
    'fringe',
    'frog',
    'front',
    'frost',
    'frown',
    'frozen',
    'fruit',
    'fuel',
    'fun',
    'funny',
    'furnace',
    'fury',
    'future',
    'gadget',
    'gain',
    'galaxy',
    'gallery',
    'game',
    'gap',
    'garage',
    'garbage',
    'garden',
    'garlic',
    'garment',
    'gas',
    'gasp',
    'gate',
    'gather',
    'gauge',
    'gaze',
    'general',
    'genius',
    'genre',
    'gentle',
    'genuine',
    'gesture',
    'ghost',
    'giant',
    'gift',
    'giggle',
    'ginger',
    'giraffe',
    'girl',
    'give',
    'glad',
    'glance',
    'glare',
    'glass',
    'glide',
    'glimpse',
    'globe',
    'gloom',
    'glory',
    'glove',
    'glow',
    'glue',
    'goat',
    'goddess',
    'gold',
    'good',
    'goose',
    'gorilla',
    'gospel',
    'gossip',
    'govern',
    'gown',
    'grab',
    'grace',
    'grain',
    'grant',
    'grape',
    'grass',
    'gravity',
    'great',
    'green',
    'grid',
    'grief',
    'grit',
    'grocery',
    'group',
    'grow',
    'grunt',
    'guard',
    'guess',
    'guide',
    'guilt',
    'guitar',
    'gun',
    'gym',
    'habit',
    'hair',
    'half',
    'hammer',
    'hamster',
    'hand',
    'happy',
    'harbor',
    'hard',
    'harsh',
    'harvest',
    'hat',
    'have',
    'hawk',
    'hazard',
    'head',
    'health',
    'heart',
    'heavy',
    'hedgehog',
    'height',
    'hello',
    'helmet',
    'help',
    'hen',
    'hero',
    'hidden',
    'high',
    'hill',
    'hint',
    'hip',
    'hire',
    'history',
    'hobby',
    'hockey',
    'hold',
    'hole',
    'holiday',
    'hollow',
    'home',
    'honey',
    'hood',
    'hope',
    'horn',
    'horror',
    'horse',
    'hospital',
    'host',
    'hotel',
    'hour',
    'hover',
    'hub',
    'huge',
    'human',
    'humble',
    'humor',
    'hundred',
    'hungry',
    'hunt',
    'hurdle',
    'hurry',
    'hurt',
    'husband',
    'hybrid',
    'ice',
    'icon',
    'idea',
    'identify',
    'idle',
    'ignore',
    'ill',
    'illegal',
    'illness',
    'image',
    'imitate',
    'immense',
    'immune',
    'impact',
    'impose',
    'improve',
    'impulse',
    'inch',
    'include',
    'income',
    'increase',
    'index',
    'indicate',
    'indoor',
    'industry',
    'infant',
    'inflict',
    'inform',
    'inhale',
    'inherit',
    'initial',
    'inject',
    'injury',
    'inmate',
    'inner',
    'innocent',
    'input',
    'inquiry',
    'insane',
    'insect',
    'inside',
    'inspire',
    'install',
    'intact',
    'interest',
    'into',
    'invest',
    'invite',
    'involve',
    'iron',
    'island',
    'isolate',
    'issue',
    'item',
    'ivory',
    'jacket',
    'jaguar',
    'jar',
    'jazz',
    'jealous',
    'jeans',
    'jelly',
    'jewel',
    'job',
    'join',
    'joke',
    'journey',
    'joy',
    'judge',
    'juice',
    'jump',
    'jungle',
    'junior',
    'junk',
    'just',
    'kangaroo',
    'keen',
    'keep',
    'ketchup',
    'key',
    'kick',
    'kid',
    'kidney',
    'kind',
    'kingdom',
    'kiss',
    'kit',
    'kitchen',
    'kite',
    'kitten',
    'kiwi',
    'knee',
    'knife',
    'knock',
    'know',
    'lab',
    'label',
    'labor',
    'ladder',
    'lady',
    'lake',
    'lamp',
    'language',
    'laptop',
    'large',
    'later',
    'latin',
    'laugh',
    'laundry',
    'lava',
    'law',
    'lawn',
    'lawsuit',
    'layer',
    'lazy',
    'leader',
    'leaf',
    'learn',
    'leave',
    'lecture',
    'left',
    'leg',
    'legal',
    'legend',
    'leisure',
    'lemon',
    'lend',
    'length',
    'lens',
    'leopard',
    'lesson',
    'letter',
    'level',
    'liar',
    'liberty',
    'library',
    'license',
    'life',
    'lift',
    'light',
    'like',
    'limb',
    'limit',
    'link',
    'lion',
    'liquid',
    'list',
    'little',
    'live',
    'lizard',
    'load',
    'loan',
    'lobster',
    'local',
    'lock',
    'logic',
    'lonely',
    'long',
    'loop',
    'lottery',
    'loud',
    'lounge',
    'love',
    'loyal',
    'lucky',
    'luggage',
    'lumber',
    'lunar',
    'lunch',
    'luxury',
    'lyrics',
    'machine',
    'mad',
    'magic',
    'magnet',
    'maid',
    'mail',
    'main',
    'major',
    'make',
    'mammal',
    'man',
    'manage',
    'mandate',
    'mango',
    'mansion',
    'manual',
    'maple',
    'marble',
    'march',
    'margin',
    'marine',
    'market',
    'marriage',
    'mask',
    'mass',
    'master',
    'match',
    'material',
    'math',
    'matrix',
    'matter',
    'maximum',
    'maze',
    'meadow',
    'mean',
    'measure',
    'meat',
    'mechanic',
    'medal',
    'media',
    'melody',
    'melt',
    'member',
    'memory',
    'mention',
    'menu',
    'mercy',
    'merge',
    'merit',
    'merry',
    'mesh',
    'message',
    'metal',
    'method',
    'middle',
    'midnight',
    'milk',
    'million',
    'mimic',
    'mind',
    'minimum',
    'minor',
    'minute',
    'miracle',
    'mirror',
    'misery',
    'miss',
    'mistake',
    'mix',
    'mixed',
    'mixture',
    'mobile',
    'model',
    'modify',
    'mom',
    'moment',
    'monitor',
    'monkey',
    'monster',
    'month',
    'moon',
    'moral',
    'more',
    'morning',
    'mosquito',
    'mother',
    'motion',
    'motor',
    'mountain',
    'mouse',
    'move',
    'movie',
    'much',
    'muffin',
    'mule',
    'multiply',
    'muscle',
    'museum',
    'mushroom',
    'music',
    'must',
    'mutual',
    'myself',
    'mystery',
    'myth',
    'naive',
    'name',
    'napkin',
    'narrow',
    'nasty',
    'nation',
    'nature',
    'near',
    'neck',
    'need',
    'negative',
    'neglect',
    'neither',
    'nephew',
    'nerve',
    'nest',
    'net',
    'network',
    'neutral',
    'never',
    'news',
    'next',
    'nice',
    'night',
    'noble',
    'noise',
    'nominee',
    'noodle',
    'normal',
    'north',
    'nose',
    'notable',
    'note',
    'nothing',
    'notice',
    'novel',
    'now',
    'nuclear',
    'number',
    'nurse',
    'nut',
    'oak',
    'obey',
    'object',
    'oblige',
    'obscure',
    'observe',
    'obtain',
    'obvious',
    'occur',
    'ocean',
    'october',
    'odor',
    'off',
    'offer',
    'office',
    'often',
    'oil',
    'okay',
    'old',
    'olive',
    'olympic',
    'omit',
    'once',
    'one',
    'onion',
    'online',
    'only',
    'open',
    'opera',
    'opinion',
    'oppose',
    'option',
    'orange',
    'orbit',
    'orchard',
    'order',
    'ordinary',
    'organ',
    'orient',
    'original',
    'orphan',
    'ostrich',
    'other',
    'outdoor',
    'outer',
    'output',
    'outside',
    'oval',
    'oven',
    'over',
    'own',
    'owner',
    'oxygen',
    'oyster',
    'ozone',
    'pact',
    'paddle',
    'page',
    'pair',
    'palace',
    'palm',
    'panda',
    'panel',
    'panic',
    'panther',
    'paper',
    'parade',
    'parent',
    'park',
    'parrot',
    'party',
    'pass',
    'patch',
    'path',
    'patient',
    'patrol',
    'pattern',
    'pause',
    'pave',
    'payment',
    'peace',
    'peanut',
    'pear',
    'peasant',
    'pelican',
    'pen',
    'penalty',
    'pencil',
    'people',
    'pepper',
    'perfect',
    'permit',
    'person',
    'pet',
    'phone',
    'photo',
    'phrase',
    'physical',
    'piano',
    'picnic',
    'picture',
    'piece',
    'pig',
    'pigeon',
    'pill',
    'pilot',
    'pink',
    'pioneer',
    'pipe',
    'pistol',
    'pitch',
    'pizza',
    'place',
    'planet',
    'plastic',
    'plate',
    'play',
    'please',
    'pledge',
    'pluck',
    'plug',
    'plunge',
    'poem',
    'poet',
    'point',
    'polar',
    'pole',
    'police',
    'pond',
    'pony',
    'pool',
    'popular',
    'portion',
    'position',
    'possible',
    'post',
    'potato',
    'pottery',
    'poverty',
    'powder',
    'power',
    'practice',
    'praise',
    'predict',
    'prefer',
    'prepare',
    'present',
    'pretty',
    'prevent',
    'price',
    'pride',
    'primary',
    'print',
    'priority',
    'prison',
    'private',
    'prize',
    'problem',
    'process',
    'produce',
    'profit',
    'program',
    'project',
    'promote',
    'proof',
    'property',
    'prosper',
    'protect',
    'proud',
    'provide',
    'public',
    'pudding',
    'pull',
    'pulp',
    'pulse',
    'pumpkin',
    'punch',
    'pupil',
    'puppy',
    'purchase',
    'purity',
    'purpose',
    'purse',
    'push',
    'put',
    'puzzle',
    'pyramid',
    'quality',
    'quantum',
    'quarter',
    'question',
    'quick',
    'quit',
    'quiz',
    'quote',
    'rabbit',
    'raccoon',
    'race',
    'rack',
    'radar',
    'radio',
    'rail',
    'rain',
    'raise',
    'rally',
    'ramp',
    'ranch',
    'random',
    'range',
    'rapid',
    'rare',
    'rate',
    'rather',
    'raven',
    'raw',
    'razor',
    'ready',
    'real',
    'reason',
    'rebel',
    'rebuild',
    'recall',
    'receive',
    'recipe',
    'record',
    'recycle',
    'reduce',
    'reflect',
    'reform',
    'refuse',
    'region',
    'regret',
    'regular',
    'reject',
    'relax',
    'release',
    'relief',
    'rely',
    'remain',
    'remember',
    'remind',
    'remove',
    'render',
    'renew',
    'rent',
    'reopen',
    'repair',
    'repeat',
    'replace',
    'report',
    'require',
    'rescue',
    'resemble',
    'resist',
    'resource',
    'response',
    'result',
    'retire',
    'retreat',
    'return',
    'reunion',
    'reveal',
    'review',
    'reward',
    'rhythm',
    'rib',
    'ribbon',
    'rice',
    'rich',
    'ride',
    'ridge',
    'rifle',
    'right',
    'rigid',
    'ring',
    'riot',
    'ripple',
    'risk',
    'ritual',
    'rival',
    'river',
    'road',
    'roast',
    'robot',
    'robust',
    'rocket',
    'romance',
    'roof',
    'rookie',
    'room',
    'rose',
    'rotate',
    'rough',
    'round',
    'route',
    'royal',
    'rubber',
    'rude',
    'rug',
    'rule',
    'run',
    'runway',
    'rural',
    'sad',
    'saddle',
    'sadness',
    'safe',
    'sail',
    'salad',
    'salmon',
    'salon',
    'salt',
    'salute',
    'same',
    'sample',
    'sand',
    'satisfy',
    'satoshi',
    'sauce',
    'sausage',
    'save',
    'say',
    'scale',
    'scan',
    'scare',
    'scatter',
    'scene',
    'scheme',
    'school',
    'science',
    'scissors',
    'scorpion',
    'scout',
    'scrap',
    'screen',
    'script',
    'scrub',
    'sea',
    'search',
    'season',
    'seat',
    'second',
    'secret',
    'section',
    'security',
    'seed',
    'seek',
    'segment',
    'select',
    'sell',
    'seminar',
    'senior',
    'sense',
    'sentence',
    'series',
    'service',
    'session',
    'settle',
    'setup',
    'seven',
    'shadow',
    'shaft',
    'shallow',
    'share',
    'shed',
    'shell',
    'sheriff',
    'shield',
    'shift',
    'shine',
    'ship',
    'shiver',
    'shock',
    'shoe',
    'shoot',
    'shop',
    'short',
    'shoulder',
    'shove',
    'shrimp',
    'shrug',
    'shuffle',
    'shy',
    'sibling',
    'sick',
    'side',
    'siege',
    'sight',
    'sign',
    'silent',
    'silk',
    'silly',
    'silver',
    'similar',
    'simple',
    'since',
    'sing',
    'siren',
    'sister',
    'situate',
    'six',
    'size',
    'skate',
    'sketch',
    'ski',
    'skill',
    'skin',
    'skirt',
    'skull',
    'slab',
    'slam',
    'sleep',
    'slender',
    'slice',
    'slide',
    'slight',
    'slim',
    'slogan',
    'slot',
    'slow',
    'slush',
    'small',
    'smart',
    'smile',
    'smoke',
    'smooth',
    'snack',
    'snake',
    'snap',
    'sniff',
    'snow',
    'soap',
    'soccer',
    'social',
    'sock',
    'soda',
    'soft',
    'solar',
    'soldier',
    'solid',
    'solution',
    'solve',
    'someone',
    'song',
    'soon',
    'sorry',
    'sort',
    'soul',
    'sound',
    'soup',
    'source',
    'south',
    'space',
    'spare',
    'spatial',
    'spawn',
    'speak',
    'special',
    'speed',
    'spell',
    'spend',
    'sphere',
    'spice',
    'spider',
    'spike',
    'spin',
    'spirit',
    'split',
    'spoil',
    'sponsor',
    'spoon',
    'sport',
    'spot',
    'spray',
    'spread',
    'spring',
    'spy',
    'square',
    'squeeze',
    'squirrel',
    'stable',
    'stadium',
    'staff',
    'stage',
    'stairs',
    'stamp',
    'stand',
    'start',
    'state',
    'stay',
    'steak',
    'steel',
    'stem',
    'step',
    'stereo',
    'stick',
    'still',
    'sting',
    'stock',
    'stomach',
    'stone',
    'stool',
    'story',
    'stove',
    'strategy',
    'street',
    'strike',
    'strong',
    'struggle',
    'student',
    'stuff',
    'stumble',
    'style',
    'subject',
    'submit',
    'subway',
    'success',
    'such',
    'sudden',
    'suffer',
    'sugar',
    'suggest',
    'suit',
    'summer',
    'sun',
    'sunny',
    'sunset',
    'super',
    'supply',
    'supreme',
    'sure',
    'surface',
    'surge',
    'surprise',
    'surround',
    'survey',
    'suspect',
    'sustain',
    'swallow',
    'swamp',
    'swap',
    'swarm',
    'swear',
    'sweet',
    'swift',
    'swim',
    'swing',
    'switch',
    'sword',
    'symbol',
    'symptom',
    'syrup',
    'system',
    'table',
    'tackle',
    'tag',
    'tail',
    'talent',
    'talk',
    'tank',
    'tape',
    'target',
    'task',
    'taste',
    'tattoo',
    'taxi',
    'teach',
    'team',
    'tell',
    'ten',
    'tenant',
    'tennis',
    'tent',
    'term',
    'test',
    'text',
    'thank',
    'that',
    'theme',
    'then',
    'theory',
    'there',
    'they',
    'thing',
    'this',
    'thought',
    'three',
    'thrive',
    'throw',
    'thumb',
    'thunder',
    'ticket',
    'tide',
    'tiger',
    'tilt',
    'timber',
    'time',
    'tiny',
    'tip',
    'tired',
    'tissue',
    'title',
    'toast',
    'tobacco',
    'today',
    'toddler',
    'toe',
    'together',
    'toilet',
    'token',
    'tomato',
    'tomorrow',
    'tone',
    'tongue',
    'tonight',
    'tool',
    'tooth',
    'top',
    'topic',
    'topple',
    'torch',
    'tornado',
    'tortoise',
    'toss',
    'total',
    'tourist',
    'toward',
    'tower',
    'town',
    'toy',
    'track',
    'trade',
    'traffic',
    'tragic',
    'train',
    'transfer',
    'trap',
    'trash',
    'travel',
    'tray',
    'treat',
    'tree',
    'trend',
    'trial',
    'tribe',
    'trick',
    'trigger',
    'trim',
    'trip',
    'trophy',
    'trouble',
    'truck',
    'true',
    'truly',
    'trumpet',
    'trust',
    'truth',
    'try',
    'tube',
    'tuition',
    'tumble',
    'tuna',
    'tunnel',
    'turkey',
    'turn',
    'turtle',
    'twelve',
    'twenty',
    'twice',
    'twin',
    'twist',
    'two',
    'type',
    'typical',
    'ugly',
    'umbrella',
    'unable',
    'unaware',
    'uncle',
    'uncover',
    'under',
    'undo',
    'unfair',
    'unfold',
    'unhappy',
    'uniform',
    'unique',
    'unit',
    'universe',
    'unknown',
    'unlock',
    'until',
    'unusual',
    'unveil',
    'update',
    'upgrade',
    'uphold',
    'upon',
    'upper',
    'upset',
    'urban',
    'urge',
    'usage',
    'use',
    'used',
    'useful',
    'useless',
    'usual',
    'utility',
    'vacant',
    'vacuum',
    'vague',
    'valid',
    'valley',
    'valve',
    'van',
    'vanish',
    'vapor',
    'various',
    'vast',
    'vault',
    'vehicle',
    'velvet',
    'vendor',
    'venture',
    'venue',
    'verb',
    'verify',
    'version',
    'very',
    'vessel',
    'veteran',
    'viable',
    'vibrant',
    'vicious',
    'victory',
    'video',
    'view',
    'village',
    'vintage',
    'violin',
    'virtual',
    'virus',
    'visa',
    'visit',
    'visual',
    'vital',
    'vivid',
    'vocal',
    'voice',
    'void',
    'volcano',
    'volume',
    'vote',
    'voyage',
    'wage',
    'wagon',
    'wait',
    'walk',
    'wall',
    'walnut',
    'want',
    'warfare',
    'warm',
    'warrior',
    'wash',
    'wasp',
    'waste',
    'water',
    'wave',
    'way',
    'wealth',
    'weapon',
    'wear',
    'weasel',
    'weather',
    'web',
    'wedding',
    'weekend',
    'weird',
    'welcome',
    'west',
    'wet',
    'whale',
    'what',
    'wheat',
    'wheel',
    'when',
    'where',
    'whip',
    'whisper',
    'wide',
    'width',
    'wife',
    'wild',
    'will',
    'win',
    'window',
    'wine',
    'wing',
    'wink',
    'winner',
    'winter',
    'wire',
    'wisdom',
    'wise',
    'wish',
    'witness',
    'wolf',
    'woman',
    'wonder',
    'wood',
    'wool',
    'word',
    'work',
    'world',
    'worry',
    'worth',
    'wrap',
    'wreck',
    'wrestle',
    'wrist',
    'write',
    'wrong',
    'yard',
    'year',
    'yellow',
    'you',
    'young',
    'youth',
    'zebra',
    'zero',
    'zone',
    'zoo',
  ],
  Y4 = ((t) => ((t.english = 'english'), t))(Y4 || {});
function ic(t) {
  let e = t.normalize('NFKD'),
    r = [];
  for (let n = 0; n < e.length; n += 1) {
    let i = e.charCodeAt(n);
    if (i < 128) r.push(i);
    else if (i < 2048) r.push((i >> 6) | 192), r.push((i & 63) | 128);
    else if ((i & 64512) === 55296) {
      n += 1;
      let a = e.charCodeAt(n);
      if (n >= e.length || (a & 64512) !== 56320) throw new Error('invalid utf-8 string');
      let o = 65536 + ((i & 1023) << 10) + (a & 1023);
      r.push((o >> 18) | 240),
        r.push(((o >> 12) & 63) | 128),
        r.push(((o >> 6) & 63) | 128),
        r.push((o & 63) | 128);
    } else r.push((i >> 12) | 224), r.push(((i >> 6) & 63) | 128), r.push((i & 63) | 128);
  }
  return Y(r);
}
function X4(t) {
  return (1 << t) - 1;
}
function Bl(t) {
  return ((1 << t) - 1) << (8 - t);
}
function Co(t) {
  return Array.isArray(t) ? t : t.split(/\s+/);
}
function Z4(t) {
  return Array.isArray(t) ? t.join(' ') : t;
}
function e2(t) {
  let e = [0],
    r = 11;
  for (let a = 0; a < t.length; a += 1)
    r > 8
      ? ((e[e.length - 1] <<= 8), (e[e.length - 1] |= t[a]), (r -= 8))
      : ((e[e.length - 1] <<= r),
        (e[e.length - 1] |= t[a] >> (8 - r)),
        e.push(t[a] & X4(8 - r)),
        (r += 3));
  let n = t.length / 4,
    i = Y(Zt(t))[0] & Bl(n);
  return (e[e.length - 1] <<= n), (e[e.length - 1] |= i >> (8 - n)), e;
}
function t2(t, e) {
  let r = Math.ceil((11 * t.length) / 8),
    n = Y(new Uint8Array(r)),
    i = 0;
  for (let h = 0; h < t.length; h += 1) {
    let m = e.indexOf(t[h].normalize('NFKD'));
    if (m === -1) throw new Error('invalid mnemonic');
    for (let w = 0; w < 11; w += 1)
      m & (1 << (10 - w)) && (n[i >> 3] |= 1 << (7 - (i % 8))), (i += 1);
  }
  let a = (32 * t.length) / 3,
    o = t.length / 3,
    c = Bl(o);
  if ((Y(Zt(n.slice(0, a / 8)))[0] & c) !== (n[n.length - 1] & c))
    throw new Error('invalid checksum');
  return n.slice(0, a / 8);
}
var r2 = ic('Bitcoin seed'),
  n2 = 76066276,
  i2 = 70615956;
function Vu(t) {
  if (t.length !== 2048) throw new Error('Invalid word list length');
}
function a2(t) {
  if (t.length % 4 !== 0 || t.length < 16 || t.length > 32) throw new Error('invalid entropy');
}
function Po(t) {
  if (![12, 15, 18, 21, 24].includes(t.length)) throw new Error('invalid mnemonic size');
}
var In = class {
    constructor(t = Qa) {
      (this.wordlist = t), Vu(this.wordlist);
    }
    mnemonicToEntropy(t) {
      return In.mnemonicToEntropy(t, this.wordlist);
    }
    entropyToMnemonic(t) {
      return In.entropyToMnemonic(t, this.wordlist);
    }
    static mnemonicToEntropy(t, e = Qa) {
      let r = Co(t);
      return Po(r), ee(t2(r, e));
    }
    static entropyToMnemonic(t, e = Qa) {
      let r = Y(t, { allowMissingPrefix: !0 });
      return (
        Vu(e),
        a2(r),
        e2(r)
          .map((n) => e[n])
          .join(' ')
      );
    }
    static mnemonicToSeed(t, e = '') {
      Po(Co(t));
      let r = ic(Z4(t)),
        n = ic(`mnemonic${e}`);
      return _d(r, n, 2048, 64, 'sha512');
    }
    static mnemonicToMasterKeys(t, e = '') {
      let r = In.mnemonicToSeed(t, e);
      return In.masterKeysFromSeed(r);
    }
    static isMnemonicValid(t) {
      let e = Co(t),
        r = 0;
      for (Po(e); r < e.length; ) {
        if (In.binarySearch(e[r]) === !1) return !1;
        r += 1;
      }
      return !0;
    }
    static binarySearch(t) {
      let e = Qa,
        r = 0,
        n = e.length - 1;
      for (; r <= n; ) {
        let i = Math.floor((r + n) / 2);
        if (e[i] === t) return !0;
        t < e[i] ? (n = i - 1) : (r = i + 1);
      }
      return !1;
    }
    static masterKeysFromSeed(t) {
      let e = Y(t);
      if (e.length < 16 || e.length > 64) throw new Error('invalid seed');
      return Y(fs(sa.sha512, r2, e));
    }
    static seedToExtendedKey(t, e = !1) {
      let r = In.masterKeysFromSeed(t),
        n = Y(e ? i2 : n2),
        i = '0x00',
        a = '0x00000000',
        o = '0x00000000',
        c = r.slice(32),
        h = r.slice(0, 32),
        m = de([n, i, a, o, c, de(['0x00', h])]),
        w = oc(Zt(Zt(m)), 0, 4);
      return of.encode(de([m, w]));
    }
    static generate(t = 32, e = '') {
      let r = e ? Zt(de([yn(t), Y(e)])) : yn(t);
      return In.entropyToMnemonic(r);
    }
  },
  Vl = In,
  jl = 2147483648,
  zl = ee('0x0488ade4'),
  cf = ee('0x0488b21e'),
  Gl = ee('0x04358394'),
  ff = ee('0x043587cf');
function ju(t) {
  return of.encode(de([t, oc(Zt(Zt(t)), 0, 4)]));
}
function s2(t = !1, e = !1) {
  return t ? (e ? ff : cf) : e ? Gl : zl;
}
function o2(t) {
  return [cf, ff].includes(ee(t.slice(0, 4)));
}
function c2(t) {
  return [zl, Gl, cf, ff].includes(ee(t.slice(0, 4)));
}
function f2(t, e = 0) {
  let r = t.split('/');
  if (r.length === 0 || (r[0] === 'm' && e !== 0)) throw new Error(`invalid path - ${t}`);
  return (
    r[0] === 'm' && r.shift(),
    r.map((n) => (~n.indexOf("'") ? parseInt(n, 10) + jl : parseInt(n, 10)))
  );
}
var si = class {
    constructor(t) {
      if (
        ((this.depth = 0),
        (this.index = 0),
        (this.fingerprint = ee('0x00000000')),
        (this.parentFingerprint = ee('0x00000000')),
        t.privateKey)
      ) {
        let e = new ga(t.privateKey);
        (this.publicKey = ee(e.compressedPublicKey)), (this.privateKey = ee(t.privateKey));
      } else {
        if (!t.publicKey) throw new Error('Public and Private Key are missing!');
        this.publicKey = ee(t.publicKey);
      }
      (this.parentFingerprint = t.parentFingerprint || this.parentFingerprint),
        (this.fingerprint = oc(xm(Zt(this.publicKey)), 0, 4)),
        (this.depth = t.depth || this.depth),
        (this.index = t.index || this.index),
        (this.chainCode = t.chainCode);
    }
    get extendedKey() {
      return this.toExtendedKey();
    }
    deriveIndex(t) {
      let e = this.privateKey && Y(this.privateKey),
        r = Y(this.publicKey),
        n = Y(this.chainCode),
        i = new Uint8Array(37);
      if (t & jl) {
        if (!e) throw new Error('Derive hardened requires privateKey');
        i.set(e, 1);
      } else i.set(Y(this.publicKey));
      i.set(zr(t, 4), 33);
      let a = Y(fs(sa.sha512, n, i)),
        o = a.slice(0, 32),
        c = a.slice(32);
      if (e) {
        let m = '0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
          w = G(o).add(e).mod(m).toBytes(32);
        return new si({
          privateKey: w,
          chainCode: c,
          index: t,
          depth: this.depth + 1,
          parentFingerprint: this.fingerprint,
        });
      }
      let h = new ga(ee(o)).addPoint(r);
      return new si({
        publicKey: h,
        chainCode: c,
        index: t,
        depth: this.depth + 1,
        parentFingerprint: this.fingerprint,
      });
    }
    derivePath(t) {
      return f2(t, this.depth).reduce((e, r) => e.deriveIndex(r), this);
    }
    toExtendedKey(t = !1, e = !1) {
      if (this.depth >= 256) throw new Error('Depth too large!');
      let r = s2(this.privateKey == null || t, e),
        n = ee(this.depth),
        i = this.parentFingerprint,
        a = fc(this.index, 4),
        o = this.chainCode,
        c = this.privateKey != null && !t ? de(['0x00', this.privateKey]) : this.publicKey,
        h = de([r, n, i, a, o, c]);
      return ju(h);
    }
    static fromSeed(t) {
      let e = Vl.masterKeysFromSeed(t);
      return new si({ chainCode: Y(e.slice(32)), privateKey: Y(e.slice(0, 32)) });
    }
    static fromExtendedKey(t) {
      let e = of.decode(t),
        r = ju(e.slice(0, 78)) === t;
      if (e.length !== 82 || !c2(e)) throw new Error('Invalid extended key');
      if (!r) throw new Error('Invalid checksum key');
      let n = e[4],
        i = ee(e.slice(5, 9)),
        a = parseInt(ee(e.slice(9, 13)).substring(2), 16),
        o = ee(e.slice(13, 45)),
        c = e.slice(45, 78);
      if ((n === 0 && i !== '0x00000000') || (n === 0 && a !== 0)) throw new Error('Invalid depth');
      if (o2(e)) {
        if (c[0] !== 3) throw new Error('Invalid public extended key');
        return new si({ publicKey: c, chainCode: o, index: a, depth: n, parentFingerprint: i });
      }
      if (c[0] !== 0) throw new Error('Invalid private extended key');
      return new si({
        privateKey: c.slice(1),
        chainCode: o,
        index: a,
        depth: n,
        parentFingerprint: i,
      });
    }
  },
  Lo = si,
  Rs = 'http://127.0.0.1:4000/graphql',
  Jl = class extends xd {
    constructor(t, e = Rs) {
      super(),
        (this.provider = this.connect(e)),
        typeof t == 'string' ? (this._address = Ct.fromString(t)) : (this._address = ci(t));
    }
    get address() {
      return this._address;
    }
    connect(t) {
      if (t)
        typeof t == 'string'
          ? this.provider
            ? this.provider.connect(t)
            : (this.provider = new _y(t))
          : (this.provider = t);
      else throw new Error('Provider is required');
      return this.provider;
    }
    async getResourcesToSpend(t, e) {
      return this.provider.getResourcesToSpend(this.address, t, e);
    }
    async getCoins(t) {
      let e = [],
        r;
      for (;;) {
        let n = await this.provider.getCoins(this.address, t, { first: 9999, after: r });
        if ((e.push(...n), !(n.length >= 9999))) break;
        throw new Error(`Wallets with more than ${9999} coins are not yet supported`);
      }
      return e;
    }
    async getMessages() {
      let t = [],
        e;
      for (;;) {
        let r = await this.provider.getMessages(this.address, { first: 9999, after: e });
        if ((t.push(...r), !(r.length >= 9999))) break;
        throw new Error(`Wallets with more than ${9999} messages are not yet supported`);
      }
      return t;
    }
    async getBalance(t = yr) {
      return await this.provider.getBalance(this.address, t);
    }
    async getBalances() {
      let t = [],
        e;
      for (;;) {
        let r = await this.provider.getBalances(this.address, { first: 9999, after: e });
        if ((t.push(...r), !(r.length >= 9999))) break;
        throw new Error(`Wallets with more than ${9999} balances are not yet supported`);
      }
      return t;
    }
    async fund(t) {
      let e = t.calculateFee(),
        r = await this.getResourcesToSpend([e]);
      t.addResources(r);
    }
    async transfer(t, e, r = yr, n = {}) {
      let i = { gasLimit: aa, ...n },
        a = new mi(i);
      a.addCoinOutput(t, e, r);
      let o = a.calculateFee(),
        c = [];
      o.assetId === ee(r) ? ((o.amount = o.amount.add(e)), (c = [o])) : (c = [[e, r], o]);
      let h = await this.getResourcesToSpend(c);
      return a.addResources(h), this.sendTransaction(a);
    }
    async withdrawToBaseLayer(t, e, r = {}) {
      let n = Y('0x'.concat(t.toHexString().substring(2).padStart(64, '0'))),
        i = Y('0x'.concat(G(e).toHex().substring(2).padStart(16, '0'))),
        a = { script: new Uint8Array([...Y(hy.bytes), ...n, ...i]), gasLimit: aa, ...r },
        o = new mi(a);
      o.addMessageOutputs();
      let c = o.calculateFee(),
        h = [];
      (c.amount = c.amount.add(e)), (h = [c]);
      let m = await this.getResourcesToSpend(h);
      return o.addResources(m), this.sendTransaction(o);
    }
    async sendTransaction(t) {
      let e = Dr(t);
      return await this.provider.addMissingVariables(e), this.provider.sendTransaction(e);
    }
    async simulateTransaction(t) {
      let e = Dr(t);
      return await this.provider.addMissingVariables(e), this.provider.simulate(e);
    }
    async buildPredicateTransaction(t, e, r = yr, n) {
      let i = { fundTransaction: !0, ...n },
        a = new mi({ gasLimit: aa, ...i });
      a.addCoinOutput(t, e, r);
      let o = [];
      if ((i.fundTransaction && o.push(a.calculateFee()), o.length)) {
        let c = await this.getResourcesToSpend(o);
        a.addResources(c);
      }
      return a;
    }
    async submitPredicate(t, e, r = yr, n) {
      let i = await this.buildPredicateTransaction(t, e, r, n);
      return (await this.sendTransaction(i)).waitForResult();
    }
    async submitSpendPredicate(t, e, r, n = yr, i) {
      return this.provider.submitSpendPredicate(t, e, this.address, r, n, i);
    }
  },
  Hl = class extends Jl {
    constructor(t, e = Rs) {
      let r = new ga(t);
      super(r.address, e), (this.signer = () => r), (this.provider = this.connect(e));
    }
    get privateKey() {
      return this.signer().privateKey;
    }
    get publicKey() {
      return this.signer().publicKey;
    }
    async signMessage(t) {
      return this.signer().sign(t4(t));
    }
    async signTransaction(t) {
      let e = Dr(t),
        r = r4(e);
      return this.signer().sign(r);
    }
    async populateTransactionWitnessesSignature(t) {
      let e = Dr(t),
        r = await this.signTransaction(e);
      return e.updateWitnessByOwner(this.address, r), e;
    }
    async sendTransaction(t) {
      let e = Dr(t);
      return (
        await this.provider.addMissingVariables(e),
        this.provider.sendTransaction(await this.populateTransactionWitnessesSignature(e))
      );
    }
    async simulateTransaction(t) {
      let e = Dr(t);
      return (
        await this.provider.addMissingVariables(e),
        this.provider.call(await this.populateTransactionWitnessesSignature(e), {
          utxoValidation: !0,
        })
      );
    }
  };
Hl.defaultPath = "m/44'/1179993420'/0'/0/0";
var Wl = class extends Jl {
    unlock(t) {
      return new gr(t, this.provider);
    }
  },
  gr = class extends Hl {
    lock() {
      return (this.signer = () => new ga('0x00')), new Wl(this.address, this.provider);
    }
    static generate(t) {
      let e = ga.generatePrivateKey(t?.entropy);
      return new gr(e, t?.provider);
    }
    static fromSeed(t, e, r) {
      let n = Lo.fromSeed(t).derivePath(e || gr.defaultPath);
      return new gr(n.privateKey, r);
    }
    static fromMnemonic(t, e, r, n) {
      let i = Vl.mnemonicToSeed(t, r),
        a = Lo.fromSeed(i).derivePath(e || gr.defaultPath);
      return new gr(a.privateKey, n);
    }
    static fromExtendedKey(t, e) {
      let r = Lo.fromExtendedKey(t);
      return new gr(r.privateKey, e);
    }
  },
  Ya = class {
    static fromAddress(t, e = Rs) {
      return new Wl(t, e);
    }
    static fromPrivateKey(t, e = Rs) {
      return new gr(t, e);
    }
  };
(Ya.generate = gr.generate),
  (Ya.fromSeed = gr.fromSeed),
  (Ya.fromMnemonic = gr.fromMnemonic),
  (Ya.fromExtendedKey = gr.fromExtendedKey);
var ac = {},
  u2 = {
    get exports() {
      return ac;
    },
    set exports(t) {
      ac = t;
    },
  },
  vi = typeof Reflect == 'object' ? Reflect : null,
  zu =
    vi && typeof vi.apply == 'function'
      ? vi.apply
      : function (e, r, n) {
          return Function.prototype.apply.call(e, r, n);
        },
  os;
vi && typeof vi.ownKeys == 'function'
  ? (os = vi.ownKeys)
  : Object.getOwnPropertySymbols
  ? (os = function (e) {
      return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
    })
  : (os = function (e) {
      return Object.getOwnPropertyNames(e);
    });
function d2(t) {
  console && console.warn && console.warn(t);
}
var Kl =
  Number.isNaN ||
  function (e) {
    return e !== e;
  };
function Xe() {
  Xe.init.call(this);
}
u2.exports = Xe;
ac.once = m2;
Xe.EventEmitter = Xe;
Xe.prototype._events = void 0;
Xe.prototype._eventsCount = 0;
Xe.prototype._maxListeners = void 0;
var Gu = 10;
function ao(t) {
  if (typeof t != 'function')
    throw new TypeError(
      'The "listener" argument must be of type Function. Received type ' + typeof t
    );
}
Object.defineProperty(Xe, 'defaultMaxListeners', {
  enumerable: !0,
  get: function () {
    return Gu;
  },
  set: function (t) {
    if (typeof t != 'number' || t < 0 || Kl(t))
      throw new RangeError(
        'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
          t +
          '.'
      );
    Gu = t;
  },
});
Xe.init = function () {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) &&
    ((this._events = Object.create(null)), (this._eventsCount = 0)),
    (this._maxListeners = this._maxListeners || void 0);
};
Xe.prototype.setMaxListeners = function (e) {
  if (typeof e != 'number' || e < 0 || Kl(e))
    throw new RangeError(
      'The value of "n" is out of range. It must be a non-negative number. Received ' + e + '.'
    );
  return (this._maxListeners = e), this;
};
function Ql(t) {
  return t._maxListeners === void 0 ? Xe.defaultMaxListeners : t._maxListeners;
}
Xe.prototype.getMaxListeners = function () {
  return Ql(this);
};
Xe.prototype.emit = function (e) {
  for (var r = [], n = 1; n < arguments.length; n++) r.push(arguments[n]);
  var i = e === 'error',
    a = this._events;
  if (a !== void 0) i = i && a.error === void 0;
  else if (!i) return !1;
  if (i) {
    var o;
    if ((r.length > 0 && (o = r[0]), o instanceof Error)) throw o;
    var c = new Error('Unhandled error.' + (o ? ' (' + o.message + ')' : ''));
    throw ((c.context = o), c);
  }
  var h = a[e];
  if (h === void 0) return !1;
  if (typeof h == 'function') zu(h, this, r);
  else for (var m = h.length, w = th(h, m), n = 0; n < m; ++n) zu(w[n], this, r);
  return !0;
};
function Yl(t, e, r, n) {
  var i, a, o;
  if (
    (ao(r),
    (a = t._events),
    a === void 0
      ? ((a = t._events = Object.create(null)), (t._eventsCount = 0))
      : (a.newListener !== void 0 &&
          (t.emit('newListener', e, r.listener ? r.listener : r), (a = t._events)),
        (o = a[e])),
    o === void 0)
  )
    (o = a[e] = r), ++t._eventsCount;
  else if (
    (typeof o == 'function' ? (o = a[e] = n ? [r, o] : [o, r]) : n ? o.unshift(r) : o.push(r),
    (i = Ql(t)),
    i > 0 && o.length > i && !o.warned)
  ) {
    o.warned = !0;
    var c = new Error(
      'Possible EventEmitter memory leak detected. ' +
        o.length +
        ' ' +
        String(e) +
        ' listeners added. Use emitter.setMaxListeners() to increase limit'
    );
    (c.name = 'MaxListenersExceededWarning'),
      (c.emitter = t),
      (c.type = e),
      (c.count = o.length),
      d2(c);
  }
  return t;
}
Xe.prototype.addListener = function (e, r) {
  return Yl(this, e, r, !1);
};
Xe.prototype.on = Xe.prototype.addListener;
Xe.prototype.prependListener = function (e, r) {
  return Yl(this, e, r, !0);
};
function l2() {
  if (!this.fired)
    return (
      this.target.removeListener(this.type, this.wrapFn),
      (this.fired = !0),
      arguments.length === 0
        ? this.listener.call(this.target)
        : this.listener.apply(this.target, arguments)
    );
}
function Xl(t, e, r) {
  var n = { fired: !1, wrapFn: void 0, target: t, type: e, listener: r },
    i = l2.bind(n);
  return (i.listener = r), (n.wrapFn = i), i;
}
Xe.prototype.once = function (e, r) {
  return ao(r), this.on(e, Xl(this, e, r)), this;
};
Xe.prototype.prependOnceListener = function (e, r) {
  return ao(r), this.prependListener(e, Xl(this, e, r)), this;
};
Xe.prototype.removeListener = function (e, r) {
  var n, i, a, o, c;
  if ((ao(r), (i = this._events), i === void 0)) return this;
  if (((n = i[e]), n === void 0)) return this;
  if (n === r || n.listener === r)
    --this._eventsCount === 0
      ? (this._events = Object.create(null))
      : (delete i[e], i.removeListener && this.emit('removeListener', e, n.listener || r));
  else if (typeof n != 'function') {
    for (a = -1, o = n.length - 1; o >= 0; o--)
      if (n[o] === r || n[o].listener === r) {
        (c = n[o].listener), (a = o);
        break;
      }
    if (a < 0) return this;
    a === 0 ? n.shift() : h2(n, a),
      n.length === 1 && (i[e] = n[0]),
      i.removeListener !== void 0 && this.emit('removeListener', e, c || r);
  }
  return this;
};
Xe.prototype.off = Xe.prototype.removeListener;
Xe.prototype.removeAllListeners = function (e) {
  var r, n, i;
  if (((n = this._events), n === void 0)) return this;
  if (n.removeListener === void 0)
    return (
      arguments.length === 0
        ? ((this._events = Object.create(null)), (this._eventsCount = 0))
        : n[e] !== void 0 &&
          (--this._eventsCount === 0 ? (this._events = Object.create(null)) : delete n[e]),
      this
    );
  if (arguments.length === 0) {
    var a = Object.keys(n),
      o;
    for (i = 0; i < a.length; ++i) (o = a[i]), o !== 'removeListener' && this.removeAllListeners(o);
    return (
      this.removeAllListeners('removeListener'),
      (this._events = Object.create(null)),
      (this._eventsCount = 0),
      this
    );
  }
  if (((r = n[e]), typeof r == 'function')) this.removeListener(e, r);
  else if (r !== void 0) for (i = r.length - 1; i >= 0; i--) this.removeListener(e, r[i]);
  return this;
};
function Zl(t, e, r) {
  var n = t._events;
  if (n === void 0) return [];
  var i = n[e];
  return i === void 0
    ? []
    : typeof i == 'function'
    ? r
      ? [i.listener || i]
      : [i]
    : r
    ? p2(i)
    : th(i, i.length);
}
Xe.prototype.listeners = function (e) {
  return Zl(this, e, !0);
};
Xe.prototype.rawListeners = function (e) {
  return Zl(this, e, !1);
};
Xe.listenerCount = function (t, e) {
  return typeof t.listenerCount == 'function' ? t.listenerCount(e) : eh.call(t, e);
};
Xe.prototype.listenerCount = eh;
function eh(t) {
  var e = this._events;
  if (e !== void 0) {
    var r = e[t];
    if (typeof r == 'function') return 1;
    if (r !== void 0) return r.length;
  }
  return 0;
}
Xe.prototype.eventNames = function () {
  return this._eventsCount > 0 ? os(this._events) : [];
};
function th(t, e) {
  for (var r = new Array(e), n = 0; n < e; ++n) r[n] = t[n];
  return r;
}
function h2(t, e) {
  for (; e + 1 < t.length; e++) t[e] = t[e + 1];
  t.pop();
}
function p2(t) {
  for (var e = new Array(t.length), r = 0; r < e.length; ++r) e[r] = t[r].listener || t[r];
  return e;
}
function m2(t, e) {
  return new Promise(function (r, n) {
    function i(o) {
      t.removeListener(e, a), n(o);
    }
    function a() {
      typeof t.removeListener == 'function' && t.removeListener('error', i),
        r([].slice.call(arguments));
    }
    rh(t, e, a, { once: !0 }), e !== 'error' && v2(t, i, { once: !0 });
  });
}
function v2(t, e, r) {
  typeof t.on == 'function' && rh(t, 'error', e, r);
}
function rh(t, e, r, n) {
  if (typeof t.on == 'function') n.once ? t.once(e, r) : t.on(e, r);
  else if (typeof t.addEventListener == 'function')
    t.addEventListener(e, function i(a) {
      n.once && t.removeEventListener(e, i), r(a);
    });
  else
    throw new TypeError(
      'The "emitter" argument must be of type EventEmitter. Received type ' + typeof t
    );
}
var b2 = {},
  so = {},
  ka = {};
(function (t) {
  var e =
    (se && se.__extends) ||
    (function () {
      var I = function (M, k) {
        return (
          (I =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (F, j) {
                F.__proto__ = j;
              }) ||
            function (F, j) {
              for (var Z in j) Object.prototype.hasOwnProperty.call(j, Z) && (F[Z] = j[Z]);
            }),
          I(M, k)
        );
      };
      return function (M, k) {
        if (typeof k != 'function' && k !== null)
          throw new TypeError('Class extends value ' + String(k) + ' is not a constructor or null');
        I(M, k);
        function F() {
          this.constructor = M;
        }
        M.prototype = k === null ? Object.create(k) : ((F.prototype = k.prototype), new F());
      };
    })();
  Object.defineProperty(t, '__esModule', { value: !0 }),
    (t.createJSONRPCNotification =
      t.createJSONRPCRequest =
      t.createJSONRPCSuccessResponse =
      t.createJSONRPCErrorResponse =
      t.JSONRPCErrorCode =
      t.JSONRPCErrorException =
      t.isJSONRPCResponses =
      t.isJSONRPCResponse =
      t.isJSONRPCRequests =
      t.isJSONRPCRequest =
      t.isJSONRPCID =
      t.JSONRPC =
        void 0),
    (t.JSONRPC = '2.0');
  var r = function (I) {
    return typeof I == 'string' || typeof I == 'number' || I === null;
  };
  t.isJSONRPCID = r;
  var n = function (I) {
    return (
      I.jsonrpc === t.JSONRPC && I.method !== void 0 && I.result === void 0 && I.error === void 0
    );
  };
  t.isJSONRPCRequest = n;
  var i = function (I) {
    return Array.isArray(I) && I.every(t.isJSONRPCRequest);
  };
  t.isJSONRPCRequests = i;
  var a = function (I) {
    return (
      I.jsonrpc === t.JSONRPC && I.id !== void 0 && (I.result !== void 0 || I.error !== void 0)
    );
  };
  t.isJSONRPCResponse = a;
  var o = function (I) {
    return Array.isArray(I) && I.every(t.isJSONRPCResponse);
  };
  t.isJSONRPCResponses = o;
  var c = function (I, M, k) {
      var F = { code: I, message: M };
      return k != null && (F.data = k), F;
    },
    h = (function (I) {
      e(M, I);
      function M(k, F, j) {
        var Z = I.call(this, k) || this;
        return Object.setPrototypeOf(Z, M.prototype), (Z.code = F), (Z.data = j), Z;
      }
      return (
        (M.prototype.toObject = function () {
          return c(this.code, this.message, this.data);
        }),
        M
      );
    })(Error);
  (t.JSONRPCErrorException = h),
    (function (I) {
      (I[(I.ParseError = -32700)] = 'ParseError'),
        (I[(I.InvalidRequest = -32600)] = 'InvalidRequest'),
        (I[(I.MethodNotFound = -32601)] = 'MethodNotFound'),
        (I[(I.InvalidParams = -32602)] = 'InvalidParams'),
        (I[(I.InternalError = -32603)] = 'InternalError');
    })(t.JSONRPCErrorCode || (t.JSONRPCErrorCode = {}));
  var m = function (I, M, k, F) {
    return { jsonrpc: t.JSONRPC, id: I, error: c(M, k, F) };
  };
  t.createJSONRPCErrorResponse = m;
  var w = function (I, M) {
    return { jsonrpc: t.JSONRPC, id: I, result: M ?? null };
  };
  t.createJSONRPCSuccessResponse = w;
  var x = function (I, M, k) {
    return { jsonrpc: t.JSONRPC, id: I, method: M, params: k };
  };
  t.createJSONRPCRequest = x;
  var T = function (I, M) {
    return { jsonrpc: t.JSONRPC, method: I, params: M };
  };
  t.createJSONRPCNotification = T;
})(ka);
var Ca = {};
Object.defineProperty(Ca, '__esModule', { value: !0 });
Ca.DefaultErrorCode = void 0;
Ca.DefaultErrorCode = 0;
var g2 =
    (se && se.__awaiter) ||
    function (t, e, r, n) {
      function i(a) {
        return a instanceof r
          ? a
          : new r(function (o) {
              o(a);
            });
      }
      return new (r || (r = Promise))(function (a, o) {
        function c(w) {
          try {
            m(n.next(w));
          } catch (x) {
            o(x);
          }
        }
        function h(w) {
          try {
            m(n.throw(w));
          } catch (x) {
            o(x);
          }
        }
        function m(w) {
          w.done ? a(w.value) : i(w.value).then(c, h);
        }
        m((n = n.apply(t, e || [])).next());
      });
    },
  y2 =
    (se && se.__generator) ||
    function (t, e) {
      var r = {
          label: 0,
          sent: function () {
            if (a[0] & 1) throw a[1];
            return a[1];
          },
          trys: [],
          ops: [],
        },
        n,
        i,
        a,
        o;
      return (
        (o = { next: c(0), throw: c(1), return: c(2) }),
        typeof Symbol == 'function' &&
          (o[Symbol.iterator] = function () {
            return this;
          }),
        o
      );
      function c(m) {
        return function (w) {
          return h([m, w]);
        };
      }
      function h(m) {
        if (n) throw new TypeError('Generator is already executing.');
        for (; o && ((o = 0), m[0] && (r = 0)), r; )
          try {
            if (
              ((n = 1),
              i &&
                (a =
                  m[0] & 2
                    ? i.return
                    : m[0]
                    ? i.throw || ((a = i.return) && a.call(i), 0)
                    : i.next) &&
                !(a = a.call(i, m[1])).done)
            )
              return a;
            switch (((i = 0), a && (m = [m[0] & 2, a.value]), m[0])) {
              case 0:
              case 1:
                a = m;
                break;
              case 4:
                return r.label++, { value: m[1], done: !1 };
              case 5:
                r.label++, (i = m[1]), (m = [0]);
                continue;
              case 7:
                (m = r.ops.pop()), r.trys.pop();
                continue;
              default:
                if (
                  ((a = r.trys),
                  !(a = a.length > 0 && a[a.length - 1]) && (m[0] === 6 || m[0] === 2))
                ) {
                  r = 0;
                  continue;
                }
                if (m[0] === 3 && (!a || (m[1] > a[0] && m[1] < a[3]))) {
                  r.label = m[1];
                  break;
                }
                if (m[0] === 6 && r.label < a[1]) {
                  (r.label = a[1]), (a = m);
                  break;
                }
                if (a && r.label < a[2]) {
                  (r.label = a[2]), r.ops.push(m);
                  break;
                }
                a[2] && r.ops.pop(), r.trys.pop();
                continue;
            }
            m = e.call(t, r);
          } catch (w) {
            (m = [6, w]), (i = 0);
          } finally {
            n = a = 0;
          }
        if (m[0] & 5) throw m[1];
        return { value: m[0] ? m[1] : void 0, done: !0 };
      }
    };
Object.defineProperty(so, '__esModule', { value: !0 });
so.JSONRPCClient = void 0;
var ai = ka,
  Fo = Ca,
  w2 = (function () {
    function t(e, r) {
      (this._send = e), (this.createID = r), (this.idToResolveMap = new Map()), (this.id = 0);
    }
    return (
      (t.prototype._createID = function () {
        return this.createID ? this.createID() : ++this.id;
      }),
      (t.prototype.timeout = function (e, r) {
        var n = this;
        r === void 0 &&
          (r = function (o) {
            return (0, ai.createJSONRPCErrorResponse)(o, Fo.DefaultErrorCode, 'Request timeout');
          });
        var i = function (o, c) {
            var h = setTimeout(function () {
              o.forEach(function (m) {
                var w = n.idToResolveMap.get(m);
                w && (n.idToResolveMap.delete(m), w(r(m)));
              });
            }, e);
            return c().then(
              function (m) {
                return clearTimeout(h), m;
              },
              function (m) {
                return clearTimeout(h), Promise.reject(m);
              }
            );
          },
          a = function (o, c) {
            var h = (Array.isArray(o) ? o : [o])
              .map(function (m) {
                return m.id;
              })
              .filter(Ju);
            return i(h, function () {
              return n.requestAdvanced(o, c);
            });
          };
        return {
          request: function (o, c, h) {
            var m = n._createID();
            return i([m], function () {
              return n.requestWithID(o, c, h, m);
            });
          },
          requestAdvanced: function (o, c) {
            return a(o, c);
          },
        };
      }),
      (t.prototype.request = function (e, r, n) {
        return this.requestWithID(e, r, n, this._createID());
      }),
      (t.prototype.requestWithID = function (e, r, n, i) {
        return g2(this, void 0, void 0, function () {
          var a, o;
          return y2(this, function (c) {
            switch (c.label) {
              case 0:
                return (a = (0, ai.createJSONRPCRequest)(i, e, r)), [4, this.requestAdvanced(a, n)];
              case 1:
                return (
                  (o = c.sent()),
                  o.result !== void 0 && !o.error
                    ? [2, o.result]
                    : o.result === void 0 && o.error
                    ? [
                        2,
                        Promise.reject(
                          new ai.JSONRPCErrorException(o.error.message, o.error.code, o.error.data)
                        ),
                      ]
                    : [2, Promise.reject(new Error('An unexpected error occurred'))]
                );
            }
          });
        });
      }),
      (t.prototype.requestAdvanced = function (e, r) {
        var n = this,
          i = Array.isArray(e);
        Array.isArray(e) || (e = [e]);
        var a = e.filter(function (h) {
            return Ju(h.id);
          }),
          o = a.map(function (h) {
            return new Promise(function (m) {
              return n.idToResolveMap.set(h.id, m);
            });
          }),
          c = Promise.all(o).then(function (h) {
            return i || !h.length ? h : h[0];
          });
        return this.send(i ? e : e[0], r).then(
          function () {
            return c;
          },
          function (h) {
            return (
              a.forEach(function (m) {
                n.receive(
                  (0, ai.createJSONRPCErrorResponse)(
                    m.id,
                    Fo.DefaultErrorCode,
                    (h && h.message) || 'Failed to send a request'
                  )
                );
              }),
              c
            );
          }
        );
      }),
      (t.prototype.notify = function (e, r, n) {
        var i = (0, ai.createJSONRPCNotification)(e, r);
        this.send(i, n).then(void 0, function () {});
      }),
      (t.prototype.send = function (e, r) {
        return this._send(e, r);
      }),
      (t.prototype.rejectAllPendingRequests = function (e) {
        this.idToResolveMap.forEach(function (r, n) {
          return r((0, ai.createJSONRPCErrorResponse)(n, Fo.DefaultErrorCode, e));
        }),
          this.idToResolveMap.clear();
      }),
      (t.prototype.receive = function (e) {
        var r = this;
        Array.isArray(e) || (e = [e]),
          e.forEach(function (n) {
            var i = r.idToResolveMap.get(n.id);
            i && (r.idToResolveMap.delete(n.id), i(n));
          });
      }),
      t
    );
  })();
so.JSONRPCClient = w2;
var Ju = function (t) {
    return t != null;
  },
  oo = {},
  Ds =
    (se && se.__assign) ||
    function () {
      return (
        (Ds =
          Object.assign ||
          function (t) {
            for (var e, r = 1, n = arguments.length; r < n; r++) {
              e = arguments[r];
              for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            }
            return t;
          }),
        Ds.apply(this, arguments)
      );
    },
  Hu =
    (se && se.__awaiter) ||
    function (t, e, r, n) {
      function i(a) {
        return a instanceof r
          ? a
          : new r(function (o) {
              o(a);
            });
      }
      return new (r || (r = Promise))(function (a, o) {
        function c(w) {
          try {
            m(n.next(w));
          } catch (x) {
            o(x);
          }
        }
        function h(w) {
          try {
            m(n.throw(w));
          } catch (x) {
            o(x);
          }
        }
        function m(w) {
          w.done ? a(w.value) : i(w.value).then(c, h);
        }
        m((n = n.apply(t, e || [])).next());
      });
    },
  Wu =
    (se && se.__generator) ||
    function (t, e) {
      var r = {
          label: 0,
          sent: function () {
            if (a[0] & 1) throw a[1];
            return a[1];
          },
          trys: [],
          ops: [],
        },
        n,
        i,
        a,
        o;
      return (
        (o = { next: c(0), throw: c(1), return: c(2) }),
        typeof Symbol == 'function' &&
          (o[Symbol.iterator] = function () {
            return this;
          }),
        o
      );
      function c(m) {
        return function (w) {
          return h([m, w]);
        };
      }
      function h(m) {
        if (n) throw new TypeError('Generator is already executing.');
        for (; o && ((o = 0), m[0] && (r = 0)), r; )
          try {
            if (
              ((n = 1),
              i &&
                (a =
                  m[0] & 2
                    ? i.return
                    : m[0]
                    ? i.throw || ((a = i.return) && a.call(i), 0)
                    : i.next) &&
                !(a = a.call(i, m[1])).done)
            )
              return a;
            switch (((i = 0), a && (m = [m[0] & 2, a.value]), m[0])) {
              case 0:
              case 1:
                a = m;
                break;
              case 4:
                return r.label++, { value: m[1], done: !1 };
              case 5:
                r.label++, (i = m[1]), (m = [0]);
                continue;
              case 7:
                (m = r.ops.pop()), r.trys.pop();
                continue;
              default:
                if (
                  ((a = r.trys),
                  !(a = a.length > 0 && a[a.length - 1]) && (m[0] === 6 || m[0] === 2))
                ) {
                  r = 0;
                  continue;
                }
                if (m[0] === 3 && (!a || (m[1] > a[0] && m[1] < a[3]))) {
                  r.label = m[1];
                  break;
                }
                if (m[0] === 6 && r.label < a[1]) {
                  (r.label = a[1]), (a = m);
                  break;
                }
                if (a && r.label < a[2]) {
                  (r.label = a[2]), r.ops.push(m);
                  break;
                }
                a[2] && r.ops.pop(), r.trys.pop();
                continue;
            }
            m = e.call(t, r);
          } catch (w) {
            (m = [6, w]), (i = 0);
          } finally {
            n = a = 0;
          }
        if (m[0] & 5) throw m[1];
        return { value: m[0] ? m[1] : void 0, done: !0 };
      }
    },
  E2 =
    (se && se.__spreadArray) ||
    function (t, e, r) {
      if (r || arguments.length === 2)
        for (var n = 0, i = e.length, a; n < i; n++)
          (a || !(n in e)) && (a || (a = Array.prototype.slice.call(e, 0, n)), (a[n] = e[n]));
      return t.concat(a || Array.prototype.slice.call(e));
    };
Object.defineProperty(oo, '__esModule', { value: !0 });
oo.JSONRPCServer = void 0;
var ur = ka,
  x2 = Ca,
  _2 = function () {
    return (0, ur.createJSONRPCErrorResponse)(null, ur.JSONRPCErrorCode.ParseError, 'Parse error');
  },
  T2 = function (t) {
    return (0, ur.createJSONRPCErrorResponse)(
      (0, ur.isJSONRPCID)(t.id) ? t.id : null,
      ur.JSONRPCErrorCode.InvalidRequest,
      'Invalid Request'
    );
  },
  I2 = function (t) {
    return (0, ur.createJSONRPCErrorResponse)(
      t,
      ur.JSONRPCErrorCode.MethodNotFound,
      'Method not found'
    );
  },
  N2 = (function () {
    function t(e) {
      e === void 0 && (e = {});
      var r;
      (this.mapErrorToJSONRPCErrorResponse = O2),
        (this.nameToMethodDictionary = {}),
        (this.middleware = null),
        (this.errorListener = (r = e.errorListener) !== null && r !== void 0 ? r : console.warn);
    }
    return (
      (t.prototype.hasMethod = function (e) {
        return !!this.nameToMethodDictionary[e];
      }),
      (t.prototype.addMethod = function (e, r) {
        this.addMethodAdvanced(e, this.toJSONRPCMethod(r));
      }),
      (t.prototype.toJSONRPCMethod = function (e) {
        return function (r, n) {
          var i = e(r.params, n);
          return Promise.resolve(i).then(function (a) {
            return A2(r.id, a);
          });
        };
      }),
      (t.prototype.addMethodAdvanced = function (e, r) {
        var n;
        this.nameToMethodDictionary = Ds(
          Ds({}, this.nameToMethodDictionary),
          ((n = {}), (n[e] = r), n)
        );
      }),
      (t.prototype.receiveJSON = function (e, r) {
        var n = this.tryParseRequestJSON(e);
        return n ? this.receive(n, r) : Promise.resolve(_2());
      }),
      (t.prototype.tryParseRequestJSON = function (e) {
        try {
          return JSON.parse(e);
        } catch {
          return null;
        }
      }),
      (t.prototype.receive = function (e, r) {
        return Array.isArray(e) ? this.receiveMultiple(e, r) : this.receiveSingle(e, r);
      }),
      (t.prototype.receiveMultiple = function (e, r) {
        return Hu(this, void 0, void 0, function () {
          var n,
            i = this;
          return Wu(this, function (a) {
            switch (a.label) {
              case 0:
                return [
                  4,
                  Promise.all(
                    e.map(function (o) {
                      return i.receiveSingle(o, r);
                    })
                  ),
                ];
              case 1:
                return (
                  (n = a.sent().filter(S2)),
                  n.length === 1 ? [2, n[0]] : n.length ? [2, n] : [2, null]
                );
            }
          });
        });
      }),
      (t.prototype.receiveSingle = function (e, r) {
        return Hu(this, void 0, void 0, function () {
          var n, i;
          return Wu(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  (n = this.nameToMethodDictionary[e.method]),
                  (0, ur.isJSONRPCRequest)(e) ? [3, 1] : [2, T2(e)]
                );
              case 1:
                return [4, this.callMethod(n, e, r)];
              case 2:
                return (i = a.sent()), [2, R2(e, i)];
            }
          });
        });
      }),
      (t.prototype.applyMiddleware = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this.middleware
          ? (this.middleware = this.combineMiddlewares(E2([this.middleware], e, !0)))
          : (this.middleware = this.combineMiddlewares(e));
      }),
      (t.prototype.combineMiddlewares = function (e) {
        return e.length ? e.reduce(this.middlewareReducer) : null;
      }),
      (t.prototype.middlewareReducer = function (e, r) {
        return function (n, i, a) {
          return e(
            function (o, c) {
              return r(n, o, c);
            },
            i,
            a
          );
        };
      }),
      (t.prototype.callMethod = function (e, r, n) {
        var i = this,
          a = function (c, h) {
            return e
              ? e(c, h)
              : c.id !== void 0
              ? Promise.resolve(I2(c.id))
              : Promise.resolve(null);
          },
          o = function (c) {
            return (
              i.errorListener(
                'An unexpected error occurred while executing "'.concat(
                  r.method,
                  '" JSON-RPC method:'
                ),
                c
              ),
              Promise.resolve(i.mapErrorToJSONRPCErrorResponseIfNecessary(r.id, c))
            );
          };
        try {
          return (this.middleware || M2)(a, r, n).then(void 0, o);
        } catch (c) {
          return o(c);
        }
      }),
      (t.prototype.mapErrorToJSONRPCErrorResponseIfNecessary = function (e, r) {
        return e !== void 0 ? this.mapErrorToJSONRPCErrorResponse(e, r) : null;
      }),
      t
    );
  })();
oo.JSONRPCServer = N2;
var S2 = function (t) {
    return t !== null;
  },
  M2 = function (t, e, r) {
    return t(e, r);
  },
  A2 = function (t, e) {
    return t !== void 0 ? (0, ur.createJSONRPCSuccessResponse)(t, e) : null;
  },
  O2 = function (t, e) {
    var r,
      n = (r = e?.message) !== null && r !== void 0 ? r : 'An unexpected error occurred',
      i = x2.DefaultErrorCode,
      a;
    return (
      e instanceof ur.JSONRPCErrorException && ((i = e.code), (a = e.data)),
      (0, ur.createJSONRPCErrorResponse)(t, i, n, a)
    );
  },
  R2 = function (t, e) {
    return (
      e ||
      (t.id !== void 0
        ? (0, ur.createJSONRPCErrorResponse)(
            t.id,
            ur.JSONRPCErrorCode.InternalError,
            'Internal error'
          )
        : null)
    );
  },
  co = {},
  D2 =
    (se && se.__awaiter) ||
    function (t, e, r, n) {
      function i(a) {
        return a instanceof r
          ? a
          : new r(function (o) {
              o(a);
            });
      }
      return new (r || (r = Promise))(function (a, o) {
        function c(w) {
          try {
            m(n.next(w));
          } catch (x) {
            o(x);
          }
        }
        function h(w) {
          try {
            m(n.throw(w));
          } catch (x) {
            o(x);
          }
        }
        function m(w) {
          w.done ? a(w.value) : i(w.value).then(c, h);
        }
        m((n = n.apply(t, e || [])).next());
      });
    },
  $2 =
    (se && se.__generator) ||
    function (t, e) {
      var r = {
          label: 0,
          sent: function () {
            if (a[0] & 1) throw a[1];
            return a[1];
          },
          trys: [],
          ops: [],
        },
        n,
        i,
        a,
        o;
      return (
        (o = { next: c(0), throw: c(1), return: c(2) }),
        typeof Symbol == 'function' &&
          (o[Symbol.iterator] = function () {
            return this;
          }),
        o
      );
      function c(m) {
        return function (w) {
          return h([m, w]);
        };
      }
      function h(m) {
        if (n) throw new TypeError('Generator is already executing.');
        for (; o && ((o = 0), m[0] && (r = 0)), r; )
          try {
            if (
              ((n = 1),
              i &&
                (a =
                  m[0] & 2
                    ? i.return
                    : m[0]
                    ? i.throw || ((a = i.return) && a.call(i), 0)
                    : i.next) &&
                !(a = a.call(i, m[1])).done)
            )
              return a;
            switch (((i = 0), a && (m = [m[0] & 2, a.value]), m[0])) {
              case 0:
              case 1:
                a = m;
                break;
              case 4:
                return r.label++, { value: m[1], done: !1 };
              case 5:
                r.label++, (i = m[1]), (m = [0]);
                continue;
              case 7:
                (m = r.ops.pop()), r.trys.pop();
                continue;
              default:
                if (
                  ((a = r.trys),
                  !(a = a.length > 0 && a[a.length - 1]) && (m[0] === 6 || m[0] === 2))
                ) {
                  r = 0;
                  continue;
                }
                if (m[0] === 3 && (!a || (m[1] > a[0] && m[1] < a[3]))) {
                  r.label = m[1];
                  break;
                }
                if (m[0] === 6 && r.label < a[1]) {
                  (r.label = a[1]), (a = m);
                  break;
                }
                if (a && r.label < a[2]) {
                  (r.label = a[2]), r.ops.push(m);
                  break;
                }
                a[2] && r.ops.pop(), r.trys.pop();
                continue;
            }
            m = e.call(t, r);
          } catch (w) {
            (m = [6, w]), (i = 0);
          } finally {
            n = a = 0;
          }
        if (m[0] & 5) throw m[1];
        return { value: m[0] ? m[1] : void 0, done: !0 };
      }
    };
Object.defineProperty(co, '__esModule', { value: !0 });
co.JSONRPCServerAndClient = void 0;
var Xa = ka,
  k2 = (function () {
    function t(e, r, n) {
      n === void 0 && (n = {});
      var i;
      (this.server = e),
        (this.client = r),
        (this.errorListener = (i = n.errorListener) !== null && i !== void 0 ? i : console.warn);
    }
    return (
      (t.prototype.applyServerMiddleware = function () {
        for (var e, r = [], n = 0; n < arguments.length; n++) r[n] = arguments[n];
        (e = this.server).applyMiddleware.apply(e, r);
      }),
      (t.prototype.hasMethod = function (e) {
        return this.server.hasMethod(e);
      }),
      (t.prototype.addMethod = function (e, r) {
        this.server.addMethod(e, r);
      }),
      (t.prototype.addMethodAdvanced = function (e, r) {
        this.server.addMethodAdvanced(e, r);
      }),
      (t.prototype.timeout = function (e) {
        return this.client.timeout(e);
      }),
      (t.prototype.request = function (e, r, n) {
        return this.client.request(e, r, n);
      }),
      (t.prototype.requestAdvanced = function (e, r) {
        return this.client.requestAdvanced(e, r);
      }),
      (t.prototype.notify = function (e, r, n) {
        this.client.notify(e, r, n);
      }),
      (t.prototype.rejectAllPendingRequests = function (e) {
        this.client.rejectAllPendingRequests(e);
      }),
      (t.prototype.receiveAndSend = function (e, r, n) {
        return D2(this, void 0, void 0, function () {
          var i, a;
          return $2(this, function (o) {
            switch (o.label) {
              case 0:
                return (0, Xa.isJSONRPCResponse)(e) || (0, Xa.isJSONRPCResponses)(e)
                  ? (this.client.receive(e), [3, 4])
                  : [3, 1];
              case 1:
                return (0, Xa.isJSONRPCRequest)(e) || (0, Xa.isJSONRPCRequests)(e)
                  ? [4, this.server.receive(e, r)]
                  : [3, 3];
              case 2:
                return (i = o.sent()), i ? [2, this.client.send(i, n)] : [3, 4];
              case 3:
                return (
                  (a = 'Received an invalid JSON-RPC message'),
                  this.errorListener(a, e),
                  [2, Promise.reject(new Error(a))]
                );
              case 4:
                return [2];
            }
          });
        });
      }),
      t
    );
  })();
co.JSONRPCServerAndClient = k2;
(function (t) {
  var e =
      (se && se.__createBinding) ||
      (Object.create
        ? function (n, i, a, o) {
            o === void 0 && (o = a);
            var c = Object.getOwnPropertyDescriptor(i, a);
            (!c || ('get' in c ? !i.__esModule : c.writable || c.configurable)) &&
              (c = {
                enumerable: !0,
                get: function () {
                  return i[a];
                },
              }),
              Object.defineProperty(n, o, c);
          }
        : function (n, i, a, o) {
            o === void 0 && (o = a), (n[o] = i[a]);
          }),
    r =
      (se && se.__exportStar) ||
      function (n, i) {
        for (var a in n)
          a !== 'default' && !Object.prototype.hasOwnProperty.call(i, a) && e(i, n, a);
      };
  Object.defineProperty(t, '__esModule', { value: !0 }), r(so, t), r(ka, t), r(oo, t), r(co, t);
})(b2);
export {
  mi as A,
  Ym as B,
  Wt as H,
  _y as K,
  ma as N,
  Wl as P,
  Dr as Q,
  aa as S,
  ml as U,
  Ht as V,
  Qe as X,
  _n as Z,
  ps as _,
  t5 as a,
  r5 as b,
  oi as c,
  b2 as d,
  ac as e,
  se as f,
  Mh as g,
  k5 as h,
  G as i,
  Il as j,
  Ct as k,
  Y as l,
  Ya as m,
  Fe as n,
  bl as o,
  yr as p,
  $5 as q,
  vl as r,
  rs as s,
  C5 as t,
  Vl as u,
  Z2 as v,
  t4 as w,
  X2 as x,
  ee as y,
  yy as z,
};
