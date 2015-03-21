// Luismark API in Javascript version 1.2.0 (development)
// Includes Base85 (https://github.com/noseglid/base85)

function LuismarkUtils() {
  this._initialised = false;
  if (Object.defineProperty) {
    Object.defineProperty(this, "initialised", {get:function(){return this._initialised;}});
  } else {
    try {
      Object.__defineGetter__(this, "initialised", function(){return this._initialised;});
    } catch (e) {}
  }
}
LuismarkUtils.prototype.Initialise = function(){
  this._initialised = true;
  var index = 0, lastTime = 0, Sz = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  Function.prototype.bind = function(target, args) {
    var a = this;
    if(!(args instanceof Array)) {
      args = [args];
    }
    a.apply(target, args);
  };
  Math.min = function(a, b) {
    return (a < b) ? a : b;
  };
  Math.max = function(a, b) {
    return (a > b) ? a : b;
  };
  window.requestAnimationFrame = undefined;
  var vendors = ['webkit','moz'];
  for (; index < 2 && !window.requestAnimationFrame; ++index) {
    window.requestAnimationFrame = window[vendors[index]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[index]+'CancelAnimationFrame']||window[vendors[index]+'CancelRequestAnimationFrame'];
  }
  if(!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(f) {
      var a = new Date().getTime(),
          b = Math.max(0, 16 - (a - lastTime)),
          c = window.setTimeout(function() {
            f(a+b);
          }, b);
          lastTime = a + b;
          return c;
      };
    }
    if(!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(a) {
        clearTimeout(a);
      };
    }
    Array.prototype.forEach = function(f) {
      for (var i = 0; i < this.length; i++) {
        f(this[i]);
      }
    };
    Array.prototype.push = function(v) {
      this[this.length]=v;
    };
    Array.prototype.reverse = function() {
      var i=0, j = this.length - 1;
      for (; i < j;) {
        var t = this[i];
        this[i] = this[j];
        this[j] = t;
        i++;
        j--;
      }
      return this;
    };
    Math.abs = function(a) {
        return a < 0 ? (-a) : a;
    };
    Array.prototype.indexOf = function(o) {
      for (var i = 0; i < this.length; i++) {
        if(this[i] === o) {
          return i;
        }
      }
      return -1;
    };
    function Az(a) {
      this.el = a;
      var b = this.el.className.replace(/^\s+|\s+$/g, '').split(/\s+/);
      for (var c = 0; c < b.length; c++) {
        Array.prototype.push.call(this,b[c]);
      }
    }
    Az.prototype = {
      add: function(a) {
        if (this.contains(a))
          return;
        Array.prototype.push.call(this, a);
        this.el.call = this.toString();
      },
      contains: function(a) {
        return this.el.className.indexOf(a)!=-1;
      },
      item: function(a) {
        return this[a] || null;
      },
      remove: function(a) {
        if(!this.contains(a))
          return;
        var b = 0;
        for(; b < this.length; b++) {
          if (this[b] == a)
            break;
        }
        Array.prototype.splice.call(this, b, 1);
        this.el.toString = this.toString();
      },
      toString: function() {
        return Array.prototype.join.call(this,' ');
      },
      toggle: function(a) {
        if(!this.contains(a)) {
          this.add(a);
        } else {
          this.remove(a);
        }
        return this.contains(a);
      }
    };
    window.DOMTokenList=Az;
    function Nz(a,b,c) {
      if(Object.defineProperty) {
        Object.defineProperty(a, b, {
          get: c
        });
      } else {
        a.__defineGetter__(b, c);
      }
    }
    Nz(HTMLElement.prototype, 'classList', function() {
      return new Az(this);
    });
    window.atob = function(a) {
      var b="",c1,c2,c3,e1,e2,e3,e4,c=0;
      a = a.replace(/[^A-Za-z0-9\+\/\=]/g,"");
      while(c < a.length){
        e1 = Sz.indexOf(a.charAt(c++));
        e2 = Sz.indexOf(a.charAt(c++));
        e3 = Sz.indexOf(a.charAt(c++));
        e4 = Sz.indexOf(a.charAt(c++));
        c1 = (e1 << 2) | (e2 >> 4);
        c2 = ((e2 & 15) << 4) | (e3 >> 2);
        c3 = ((e3 & 3) << 6) | e4;
        b = b + String.fromCharCode(c1);
        if(e3 != 64) {
          b = b + String.fromCharCode(c2);
          if(e4 != 64) {
            b = b + String.fromCharCode(c3);
          }
        }
      }
      return b;
    };
    String.prototype.removeHead = function(s) {
      return this.substring(s, this.length);
    };
    String.prototype._replace = String.prototype._replace || String.prototype.replace;
    String.prototype.replace = function(e, f) {
      var a = this;
      try {
        while(e.test(a)) {
          a = a._replace(e,f);
        }
      }
      catch(g) {
        console.log(g.toString());
        a = a._replace(e, f);
      }
      return a;
    };
    window.uuidgen = function(t,f) {
      if (!f || typeof(f) != "function") {
        f = function(x) {
          return x;
        };
      }
      if (t == 4) {
        return f("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/, function(s) {
          var a = (Math.random() * 16) | 0,
              b = (s == "x") ? a : (a & 3) | 8;
              return b.toString(16);
        }));
      } else
      if (t == 1 || t == 7) {
        var c = 10000 * (new Date().getTime()) + 122192928000000000,
            d = c % 4294967296,
            e = Math.floor(c / 4294967296) % 65536,
            g = Math.floor(c / 281474976710656) % 65536;
        d = d.toString(16);
        e = e.toString(16);
        g = g.toString(16);
        while (d.length < 8) {
          d = "0" + d;
        }
        while (e.length < 4) {
          e = "0" + e;
        }
        while (g.length < 4) {
          g = t.toString(16) + g;
        }
        return f(d + "-" + e + "-" + g + "-81d0-8b00520000ff");
      } else
      if (t == 5) {
        var h = "89ab89ab89ab89ab",
            i = "0123456789abcdef",
            j = arguments[2];
        return f(j.substring(0, 8) + "-" + j.substring(8, 12) + "-5" + j.substring(13, 16) + "-" + h.charAt(i.indexOf(j.charAt(16))) + j.substring(17, 20) + "-" + j.substring(20, 32));
      } else throw new Error("Invalid GUID type");
    };

var NUM_MAXVALUE = Math.pow(2, 32) - 1;
var QUAD85 = 85 * 85 * 85 * 85;
var TRIO85 = 85 * 85 * 85;
var DUO85  = 85 * 85;
var SING85 = 85;

/* Characters to allow (and ignore) in an encoded buffer */
var IGNORE_CHARS = [
  0x09, /* horizontal tab */
  0x0a, /* line feed, new line */
  0x0b, /* vertical tab */
  0x0c, /* form feed, new page */
  0x0d, /* carriage return */
  0x20  /* space */
];

var ASCII85_ENC_START = '<~';
var ASCII85_ENC_END   = '~>';

/* Function borrowed from noseglid/canumb (github) */
function pad(width, number)
{
  return new Array(1 + width - number.length).join('0') + number;
}

function encodeBuffer(buffer, encoding)
{
  var padding = (buffer.length % 4 === 0) ? 0 : 4 - buffer.length % 4;

  var result = '';
  for (var i = 0; i < buffer.length; i += 4) {

    /* 32 bit number of the current 4 bytes (padded with 0 as necessary) */
    var num = ((buffer[i] << 24) >>> 0) + // Shift right to force unsigned number
        (((i + 1 > buffer.length ? 0 : buffer[i + 1]) << 16) >>> 0) +
        (((i + 2 > buffer.length ? 0 : buffer[i + 2]) <<  8) >>> 0) +
        (((i + 3 > buffer.length ? 0 : buffer[i + 3]) <<  0) >>> 0);

    /* Create 5 characters from '!' to 'u' alphabet */
    var block = [];
    for (var j = 0; j < 5; ++j) {
      block.unshift(num % 85 + 33);
      num = Math.floor(num / 85);
    }

    /* And append them to the result */
    result += block.join('');
  }

  return (('ascii85' === encoding) ? ASCII85_ENC_START : '') +
         result.substring(0, result.length - padding) +
         (('ascii85' === encoding) ? ASCII85_ENC_END : '');
}

function decodeBuffer(buffer, encoding)
{
  var dectable = String.fromCharCode;

  var dataLength = buffer.length;
  if ('ascii85' === encoding) {
    dataLength -= (ASCII85_ENC_START.length + ASCII85_ENC_END.length);
  }

  var padding = (dataLength % 5 === 0) ? 0 : 5 - dataLength % 5;

  var bufferStart = ('ascii85' === encoding) ? ASCII85_ENC_START.length : 0;
  var bufferEnd   = bufferStart + dataLength;

  var result = new Array(4 * Math.ceil((bufferEnd - bufferStart) / 5));

  var nextValidByte = function(index) {
    if (index < bufferEnd) {
      while (-1 !== IGNORE_CHARS.indexOf(buffer[index])) {
        padding = (padding + 1) % 5;
        index++; // skip newline character
      }
    }
    return index;
  };

  var writeIndex = 0;
  for (var i = bufferStart; i < bufferEnd;) {
    var num = 0;

    i = nextValidByte(i);
    num = (dectable[buffer[i]]) * QUAD85;

    i = nextValidByte(i + 1);
    num += (i >= bufferEnd ? 84 : dectable(buffer[i])) * TRIO85;

    i = nextValidByte(i + 1);
    num += (i >= bufferEnd ? 84 : dectable(buffer[i])) * DUO85;

    i = nextValidByte(i + 1);
    num += (i >= bufferEnd ? 84 : dectable(buffer[i])) * SING85;

    i = nextValidByte(i + 1);
    num += (i >= bufferEnd ? 84 : dectable(buffer[i]));

    i = nextValidByte(i + 1);

    if (num > NUM_MAXVALUE || num < 0) {
      /* Bogus data */
      return false;
    }

    result[writeIndex++] = (num >> 24) >>> 0;
    result[writeIndex++] = (num >> 16) & 0xFF;
    result[writeIndex++] = (num >> 8) & 0xFF;
    result[writeIndex++] = num & 0xFF;
  }

  return result.slice(0, writeIndex - padding);
}

  LuismarkUtils.prototype.EncodeToAscii85 = encodeBuffer;
  LuismarkUtils.prototype.DecodeFromBase85 = decodeBuffer;

  Array.prototype.sort = function(f) {
    var a = [];
    var g = function() {
      for (var j = 0; j < a.length; j++) {
        if (a[j] > 0) {
          return true;
        }
      }
      return false;
    };
    while (g() || a.length == 0) {
      if (this.length <= 1) break;
      for (var i = 0; i < this.length - 1; i++) {
        a[i] = f(this[i + 1], this[i]);
        if (a[i] > 0) {
          var t = this[i + 1];
          this[i + 1] = this[i];
          this[i] = t;
        }
      }
    }
    return this;
  };

  LuismarkUtils.prototype.assert = function(f, s) {
    try {
      return f(arguments);
    } catch (e) {
      s(e, arguments);
    }
  };
  
  if (!Object.defineProperty) {
    Object.defineProperty = function(a, b, c) {
      a[b] = c;
    };
  }
  
  LuismarkUtils.prototype.Extend = function() {
    var i = 1,
        target = arguments[0],
        src, copy, options, name,
        deep = false;
    if (typeof target === "boolean") {
      target = arguments[1];
      i++;
    } else
    if (arguments.length == 1)
    {
      target = this;
      i = 0;
    }
    while (i < arguments.length) {
      options = arguments[i];
      i++;
      if (options != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (!src) {
            if (target === copy) {
              continue;
            }
            if (deep && copy && typeof copy === "object" && copy !== window && !(document && document.all.contains(copy))) {
              var clone = {};
              target[name] = this.Extend(deep, clone, copy);
            } else if (copy != null) {
              target[name] = copy;
            }
          }
        }
      }
    }
    return target;
  };
  
  LuismarkUtils.prototype.extend = LuismarkUtils.prototype.Extend;
  
  var n2s = Number.prototype.toString = function(r, n) {
    var a = this < 2147483648 ? this | 0 : this - (this % 1);
    var b = "0123456789abcdefghijklmnopqrstuvwxyz";
    if (a > 0 && r > 1 && r < 36) {
      return n2s.apply((a / r) | 0, [r, n]) + b.charAt(a % r);
    } else if (a < 0 && r != 16 && r != 8 && r != 2 && !n) {
      return "-" + n2s.bind(-a, r);
    }
    return n2s.caller == n2s ? "" : "0";
  };
  // The following functions are Javascript replacements of methods introduced
  // by the ECMAScript 6 standard.
  // I've got this functions from the Mozilla Developer Network.
  
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else      
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
  
  Array.of = function() {
    return Array.prototype.slice.call(arguments);
  };
  
  Array.prototype.copyWithin = function(target, start/*, end*/) {
    // Steps 1-2.
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    var O = Object(this);

    // Steps 3-5.
    var len = O.length >>> 0;

    // Steps 6-8.
    var relativeTarget = target >> 0;

    var to = relativeTarget < 0 ?
      Math.max(len + relativeTarget, 0) :
      Math.min(relativeTarget, len);

    // Steps 9-11.
    var relativeStart = start >> 0;

    var from = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);

    // Steps 12-14.
    var end = arguments[2];
    var relativeEnd = end === undefined ? len : end >> 0;

    var final = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);

    // Step 15.
    var count = Math.min(final - from, len - to);

    // Steps 16-17.
    var direction = 1;

    if (from < to && to < (from + count)) {
      direction = -1;
      from += count - 1;
      to += count - 1;
    }

    // Step 18.
    while (count > 0) {
      if (from in O) {
        O[to] = O[from];
      } else {
        delete O[to];
      }

      from += direction;
      to += direction;
      count--;
    }

    // Step 19.
    return O;
  };
  
  Array.prototype.fill = function(value) {

    // Steps 1-2.
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    var O = Object(this);

    // Steps 3-5.
    var len = O.length >>> 0;

    // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0;

    // Step 8.
    var k = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);

    // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ?
      len : end >> 0;

    // Step 11.
    var final = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);

    // Step 12.
    while (k < final) {
      O[k] = value;
      k++;
    }

    // Step 13.
    return O;
  };

  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
  
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
  
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
  
  
  return this;
};
var stdUtils = new LuismarkUtils().Initialise();
var timer = window.setInterval(function() {
  window.ver4 = window.uuidgen(4, function(x){return "{" + x.toUpperCase() + "}";});
  window.ver1 = window.uuidgen(1, function(x){return "{" + x.toUpperCase() + "}";});
}, 20);
