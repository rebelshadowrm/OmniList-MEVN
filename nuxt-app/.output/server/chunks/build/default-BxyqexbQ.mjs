import { _ as _export_sfc, f as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import require$$2$1 from 'http';
import require$$2 from 'https';
import require$$0 from 'url';
import require$$0$2 from 'stream';
import require$$4 from 'assert';
import require$$0$1 from 'zlib';
import { createPinia, defineStore } from 'pinia';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';

class TokenService {
  static accessToken = null;
  static refreshToken = null;
  static canUseStorage() {
    return false;
  }
  static getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }
    if (!this.canUseStorage()) {
      return null;
    }
    this.accessToken = localStorage.getItem("access_token");
    return this.accessToken;
  }
  static setAccessToken(accessToken) {
    this.accessToken = accessToken ?? null;
    if (this.canUseStorage()) {
      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
      } else {
        localStorage.removeItem("access_token");
      }
    }
  }
  static setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken ?? null;
    if (this.canUseStorage()) {
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      } else {
        localStorage.removeItem("refresh_token");
      }
    }
  }
  static getRefreshToken() {
    if (this.refreshToken) {
      return this.refreshToken;
    }
    if (!this.canUseStorage()) {
      return null;
    }
    this.refreshToken = localStorage.getItem("refresh_token");
    return this.refreshToken;
  }
  static clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (this.canUseStorage()) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var axios$2 = { exports: {} };
var bind;
var hasRequiredBind;
function requireBind() {
  if (hasRequiredBind) return bind;
  hasRequiredBind = 1;
  bind = function bind2(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };
  return bind;
}
var utils;
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  var bind2 = requireBind();
  var toString = Object.prototype.toString;
  function isArray(val) {
    return Array.isArray(val);
  }
  function isUndefined(val) {
    return typeof val === "undefined";
  }
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
  }
  function isArrayBuffer(val) {
    return toString.call(val) === "[object ArrayBuffer]";
  }
  function isFormData(val) {
    return toString.call(val) === "[object FormData]";
  }
  function isArrayBufferView(val) {
    var result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  function isString(val) {
    return typeof val === "string";
  }
  function isNumber(val) {
    return typeof val === "number";
  }
  function isObject(val) {
    return val !== null && typeof val === "object";
  }
  function isPlainObject(val) {
    if (toString.call(val) !== "[object Object]") {
      return false;
    }
    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }
  function isDate(val) {
    return toString.call(val) === "[object Date]";
  }
  function isFile(val) {
    return toString.call(val) === "[object File]";
  }
  function isBlob(val) {
    return toString.call(val) === "[object Blob]";
  }
  function isFunction(val) {
    return toString.call(val) === "[object Function]";
  }
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }
  function isURLSearchParams(val) {
    return toString.call(val) === "[object URLSearchParams]";
  }
  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
  }
  function isStandardBrowserEnv() {
    return false;
  }
  function forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  function merge() {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === "function") {
        a[key] = bind2(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }
  function stripBOM(content) {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  }
  utils = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isFunction,
    isStream,
    isURLSearchParams,
    isStandardBrowserEnv,
    forEach,
    merge,
    extend,
    trim,
    stripBOM
  };
  return utils;
}
var buildURL;
var hasRequiredBuildURL;
function requireBuildURL() {
  if (hasRequiredBuildURL) return buildURL;
  hasRequiredBuildURL = 1;
  var utils2 = requireUtils();
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  buildURL = function buildURL2(url, params, paramsSerializer) {
    if (!params) {
      return url;
    }
    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils2.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      utils2.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (utils2.isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }
        utils2.forEach(val, function parseValue(v) {
          if (utils2.isDate(v)) {
            v = v.toISOString();
          } else if (utils2.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + "=" + encode(v));
        });
      });
      serializedParams = parts.join("&");
    }
    if (serializedParams) {
      var hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  };
  return buildURL;
}
var InterceptorManager_1;
var hasRequiredInterceptorManager;
function requireInterceptorManager() {
  if (hasRequiredInterceptorManager) return InterceptorManager_1;
  hasRequiredInterceptorManager = 1;
  var utils2 = requireUtils();
  function InterceptorManager() {
    this.handlers = [];
  }
  InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  };
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils2.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };
  InterceptorManager_1 = InterceptorManager;
  return InterceptorManager_1;
}
var normalizeHeaderName;
var hasRequiredNormalizeHeaderName;
function requireNormalizeHeaderName() {
  if (hasRequiredNormalizeHeaderName) return normalizeHeaderName;
  hasRequiredNormalizeHeaderName = 1;
  var utils2 = requireUtils();
  normalizeHeaderName = function normalizeHeaderName2(headers, normalizedName) {
    utils2.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };
  return normalizeHeaderName;
}
var enhanceError;
var hasRequiredEnhanceError;
function requireEnhanceError() {
  if (hasRequiredEnhanceError) return enhanceError;
  hasRequiredEnhanceError = 1;
  enhanceError = function enhanceError2(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }
    error.request = request;
    error.response = response;
    error.isAxiosError = true;
    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    };
    return error;
  };
  return enhanceError;
}
var transitional;
var hasRequiredTransitional;
function requireTransitional() {
  if (hasRequiredTransitional) return transitional;
  hasRequiredTransitional = 1;
  transitional = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  return transitional;
}
var createError;
var hasRequiredCreateError;
function requireCreateError() {
  if (hasRequiredCreateError) return createError;
  hasRequiredCreateError = 1;
  var enhanceError2 = requireEnhanceError();
  createError = function createError2(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError2(error, config, code, request, response);
  };
  return createError;
}
var settle;
var hasRequiredSettle;
function requireSettle() {
  if (hasRequiredSettle) return settle;
  hasRequiredSettle = 1;
  var createError2 = requireCreateError();
  settle = function settle2(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError2(
        "Request failed with status code " + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };
  return settle;
}
var isAbsoluteURL;
var hasRequiredIsAbsoluteURL;
function requireIsAbsoluteURL() {
  if (hasRequiredIsAbsoluteURL) return isAbsoluteURL;
  hasRequiredIsAbsoluteURL = 1;
  isAbsoluteURL = function isAbsoluteURL2(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  };
  return isAbsoluteURL;
}
var combineURLs;
var hasRequiredCombineURLs;
function requireCombineURLs() {
  if (hasRequiredCombineURLs) return combineURLs;
  hasRequiredCombineURLs = 1;
  combineURLs = function combineURLs2(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  };
  return combineURLs;
}
var buildFullPath;
var hasRequiredBuildFullPath;
function requireBuildFullPath() {
  if (hasRequiredBuildFullPath) return buildFullPath;
  hasRequiredBuildFullPath = 1;
  var isAbsoluteURL2 = requireIsAbsoluteURL();
  var combineURLs2 = requireCombineURLs();
  buildFullPath = function buildFullPath2(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL2(requestedURL)) {
      return combineURLs2(baseURL, requestedURL);
    }
    return requestedURL;
  };
  return buildFullPath;
}
var followRedirects = { exports: {} };
var debug_1;
var hasRequiredDebug;
function requireDebug() {
  if (hasRequiredDebug) return debug_1;
  hasRequiredDebug = 1;
  var debug;
  debug_1 = function() {
    if (!debug) {
      try {
        debug = require("debug")("follow-redirects");
      } catch (error) {
      }
      if (typeof debug !== "function") {
        debug = function() {
        };
      }
    }
    debug.apply(null, arguments);
  };
  return debug_1;
}
var hasRequiredFollowRedirects;
function requireFollowRedirects() {
  if (hasRequiredFollowRedirects) return followRedirects.exports;
  hasRequiredFollowRedirects = 1;
  var url = require$$0;
  var URL = url.URL;
  var http = require$$2$1;
  var https = require$$2;
  var Writable = require$$0$2.Writable;
  var assert = require$$4;
  var debug = requireDebug();
  var useNativeURL = false;
  try {
    assert(new URL());
  } catch (error) {
    useNativeURL = error.code === "ERR_INVALID_URL";
  }
  var preservedUrlFields = [
    "auth",
    "host",
    "hostname",
    "href",
    "path",
    "pathname",
    "port",
    "protocol",
    "query",
    "search",
    "hash"
  ];
  var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
  var eventHandlers = /* @__PURE__ */ Object.create(null);
  events.forEach(function(event) {
    eventHandlers[event] = function(arg1, arg2, arg3) {
      this._redirectable.emit(event, arg1, arg2, arg3);
    };
  });
  var InvalidUrlError = createErrorType(
    "ERR_INVALID_URL",
    "Invalid URL",
    TypeError
  );
  var RedirectionError = createErrorType(
    "ERR_FR_REDIRECTION_FAILURE",
    "Redirected request failed"
  );
  var TooManyRedirectsError = createErrorType(
    "ERR_FR_TOO_MANY_REDIRECTS",
    "Maximum number of redirects exceeded",
    RedirectionError
  );
  var MaxBodyLengthExceededError = createErrorType(
    "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
    "Request body larger than maxBodyLength limit"
  );
  var WriteAfterEndError = createErrorType(
    "ERR_STREAM_WRITE_AFTER_END",
    "write after end"
  );
  var destroy = Writable.prototype.destroy || noop;
  function RedirectableRequest(options, responseCallback) {
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];
    if (responseCallback) {
      this.on("response", responseCallback);
    }
    var self = this;
    this._onNativeResponse = function(response) {
      try {
        self._processResponse(response);
      } catch (cause) {
        self.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
      }
    };
    this._performRequest();
  }
  RedirectableRequest.prototype = Object.create(Writable.prototype);
  RedirectableRequest.prototype.abort = function() {
    destroyRequest(this._currentRequest);
    this._currentRequest.abort();
    this.emit("abort");
  };
  RedirectableRequest.prototype.destroy = function(error) {
    destroyRequest(this._currentRequest, error);
    destroy.call(this, error);
    return this;
  };
  RedirectableRequest.prototype.write = function(data2, encoding, callback) {
    if (this._ending) {
      throw new WriteAfterEndError();
    }
    if (!isString(data2) && !isBuffer(data2)) {
      throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (isFunction(encoding)) {
      callback = encoding;
      encoding = null;
    }
    if (data2.length === 0) {
      if (callback) {
        callback();
      }
      return;
    }
    if (this._requestBodyLength + data2.length <= this._options.maxBodyLength) {
      this._requestBodyLength += data2.length;
      this._requestBodyBuffers.push({ data: data2, encoding });
      this._currentRequest.write(data2, encoding, callback);
    } else {
      this.emit("error", new MaxBodyLengthExceededError());
      this.abort();
    }
  };
  RedirectableRequest.prototype.end = function(data2, encoding, callback) {
    if (isFunction(data2)) {
      callback = data2;
      data2 = encoding = null;
    } else if (isFunction(encoding)) {
      callback = encoding;
      encoding = null;
    }
    if (!data2) {
      this._ended = this._ending = true;
      this._currentRequest.end(null, null, callback);
    } else {
      var self = this;
      var currentRequest = this._currentRequest;
      this.write(data2, encoding, function() {
        self._ended = true;
        currentRequest.end(null, null, callback);
      });
      this._ending = true;
    }
  };
  RedirectableRequest.prototype.setHeader = function(name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
  };
  RedirectableRequest.prototype.removeHeader = function(name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
  };
  RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
    var self = this;
    function destroyOnTimeout(socket) {
      socket.setTimeout(msecs);
      socket.removeListener("timeout", socket.destroy);
      socket.addListener("timeout", socket.destroy);
    }
    function startTimer(socket) {
      if (self._timeout) {
        clearTimeout(self._timeout);
      }
      self._timeout = setTimeout(function() {
        self.emit("timeout");
        clearTimer();
      }, msecs);
      destroyOnTimeout(socket);
    }
    function clearTimer() {
      if (self._timeout) {
        clearTimeout(self._timeout);
        self._timeout = null;
      }
      self.removeListener("abort", clearTimer);
      self.removeListener("error", clearTimer);
      self.removeListener("response", clearTimer);
      self.removeListener("close", clearTimer);
      if (callback) {
        self.removeListener("timeout", callback);
      }
      if (!self.socket) {
        self._currentRequest.removeListener("socket", startTimer);
      }
    }
    if (callback) {
      this.on("timeout", callback);
    }
    if (this.socket) {
      startTimer(this.socket);
    } else {
      this._currentRequest.once("socket", startTimer);
    }
    this.on("socket", destroyOnTimeout);
    this.on("abort", clearTimer);
    this.on("error", clearTimer);
    this.on("response", clearTimer);
    this.on("close", clearTimer);
    return this;
  };
  [
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
  ].forEach(function(method) {
    RedirectableRequest.prototype[method] = function(a, b) {
      return this._currentRequest[method](a, b);
    };
  });
  ["aborted", "connection", "socket"].forEach(function(property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
      get: function() {
        return this._currentRequest[property];
      }
    });
  });
  RedirectableRequest.prototype._sanitizeOptions = function(options) {
    if (!options.headers) {
      options.headers = {};
    }
    if (options.host) {
      if (!options.hostname) {
        options.hostname = options.host;
      }
      delete options.host;
    }
    if (!options.pathname && options.path) {
      var searchPos = options.path.indexOf("?");
      if (searchPos < 0) {
        options.pathname = options.path;
      } else {
        options.pathname = options.path.substring(0, searchPos);
        options.search = options.path.substring(searchPos);
      }
    }
  };
  RedirectableRequest.prototype._performRequest = function() {
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
      throw new TypeError("Unsupported protocol " + protocol);
    }
    if (this._options.agents) {
      var scheme = protocol.slice(0, -1);
      this._options.agent = this._options.agents[scheme];
    }
    var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
    request._redirectable = this;
    for (var event of events) {
      request.on(event, eventHandlers[event]);
    }
    this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : (
      // When making a request to a proxy, […]
      // a client MUST send the target URI in absolute-form […].
      this._options.path
    );
    if (this._isRedirect) {
      var i = 0;
      var self = this;
      var buffers = this._requestBodyBuffers;
      (function writeNext(error) {
        if (request === self._currentRequest) {
          if (error) {
            self.emit("error", error);
          } else if (i < buffers.length) {
            var buffer = buffers[i++];
            if (!request.finished) {
              request.write(buffer.data, buffer.encoding, writeNext);
            }
          } else if (self._ended) {
            request.end();
          }
        }
      })();
    }
  };
  RedirectableRequest.prototype._processResponse = function(response) {
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
      this._redirects.push({
        url: this._currentUrl,
        headers: response.headers,
        statusCode
      });
    }
    var location = response.headers.location;
    if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
      response.responseUrl = this._currentUrl;
      response.redirects = this._redirects;
      this.emit("response", response);
      this._requestBodyBuffers = [];
      return;
    }
    destroyRequest(this._currentRequest);
    response.destroy();
    if (++this._redirectCount > this._options.maxRedirects) {
      throw new TooManyRedirectsError();
    }
    var requestHeaders;
    var beforeRedirect = this._options.beforeRedirect;
    if (beforeRedirect) {
      requestHeaders = Object.assign({
        // The Host header was set by nativeProtocol.request
        Host: response.req.getHeader("host")
      }, this._options.headers);
    }
    var method = this._options.method;
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
    // the server is redirecting the user agent to a different resource […]
    // A user agent can perform a retrieval request targeting that URI
    // (a GET or HEAD request if using HTTP) […]
    statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
      this._options.method = "GET";
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
    var currentUrlParts = parseUrl(this._currentUrl);
    var currentHost = currentHostHeader || currentUrlParts.host;
    var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, { host: currentHost }));
    var redirectUrl = resolveUrl(location, currentUrl);
    debug("redirecting to", redirectUrl.href);
    this._isRedirect = true;
    spreadUrlObject(redirectUrl, this._options);
    if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) {
      removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
    }
    if (isFunction(beforeRedirect)) {
      var responseDetails = {
        headers: response.headers,
        statusCode
      };
      var requestDetails = {
        url: currentUrl,
        method,
        headers: requestHeaders
      };
      beforeRedirect(this._options, responseDetails, requestDetails);
      this._sanitizeOptions(this._options);
    }
    this._performRequest();
  };
  function wrap(protocols) {
    var exports$1 = {
      maxRedirects: 21,
      maxBodyLength: 10 * 1024 * 1024
    };
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function(scheme) {
      var protocol = scheme + ":";
      var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
      var wrappedProtocol = exports$1[scheme] = Object.create(nativeProtocol);
      function request(input, options, callback) {
        if (isURL(input)) {
          input = spreadUrlObject(input);
        } else if (isString(input)) {
          input = spreadUrlObject(parseUrl(input));
        } else {
          callback = options;
          options = validateUrl(input);
          input = { protocol };
        }
        if (isFunction(options)) {
          callback = options;
          options = null;
        }
        options = Object.assign({
          maxRedirects: exports$1.maxRedirects,
          maxBodyLength: exports$1.maxBodyLength
        }, input, options);
        options.nativeProtocols = nativeProtocols;
        if (!isString(options.host) && !isString(options.hostname)) {
          options.hostname = "::1";
        }
        assert.equal(options.protocol, protocol, "protocol mismatch");
        debug("options", options);
        return new RedirectableRequest(options, callback);
      }
      function get(input, options, callback) {
        var wrappedRequest = wrappedProtocol.request(input, options, callback);
        wrappedRequest.end();
        return wrappedRequest;
      }
      Object.defineProperties(wrappedProtocol, {
        request: { value: request, configurable: true, enumerable: true, writable: true },
        get: { value: get, configurable: true, enumerable: true, writable: true }
      });
    });
    return exports$1;
  }
  function noop() {
  }
  function parseUrl(input) {
    var parsed;
    if (useNativeURL) {
      parsed = new URL(input);
    } else {
      parsed = validateUrl(url.parse(input));
      if (!isString(parsed.protocol)) {
        throw new InvalidUrlError({ input });
      }
    }
    return parsed;
  }
  function resolveUrl(relative, base) {
    return useNativeURL ? new URL(relative, base) : parseUrl(url.resolve(base, relative));
  }
  function validateUrl(input) {
    if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
      throw new InvalidUrlError({ input: input.href || input });
    }
    if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
      throw new InvalidUrlError({ input: input.href || input });
    }
    return input;
  }
  function spreadUrlObject(urlObject, target) {
    var spread2 = target || {};
    for (var key of preservedUrlFields) {
      spread2[key] = urlObject[key];
    }
    if (spread2.hostname.startsWith("[")) {
      spread2.hostname = spread2.hostname.slice(1, -1);
    }
    if (spread2.port !== "") {
      spread2.port = Number(spread2.port);
    }
    spread2.path = spread2.search ? spread2.pathname + spread2.search : spread2.pathname;
    return spread2;
  }
  function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for (var header in headers) {
      if (regex.test(header)) {
        lastValue = headers[header];
        delete headers[header];
      }
    }
    return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
  }
  function createErrorType(code, message, baseClass) {
    function CustomError(properties) {
      Error.captureStackTrace(this, this.constructor);
      Object.assign(this, properties || {});
      this.code = code;
      this.message = this.cause ? message + ": " + this.cause.message : message;
    }
    CustomError.prototype = new (baseClass || Error)();
    Object.defineProperties(CustomError.prototype, {
      constructor: {
        value: CustomError,
        enumerable: false
      },
      name: {
        value: "Error [" + code + "]",
        enumerable: false
      }
    });
    return CustomError;
  }
  function destroyRequest(request, error) {
    for (var event of events) {
      request.removeListener(event, eventHandlers[event]);
    }
    request.on("error", noop);
    request.destroy(error);
  }
  function isSubdomain(subdomain, domain) {
    assert(isString(subdomain) && isString(domain));
    var dot = subdomain.length - domain.length - 1;
    return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
  }
  function isString(value) {
    return typeof value === "string" || value instanceof String;
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function isBuffer(value) {
    return typeof value === "object" && "length" in value;
  }
  function isURL(value) {
    return URL && value instanceof URL;
  }
  followRedirects.exports = wrap({ http, https });
  followRedirects.exports.wrap = wrap;
  return followRedirects.exports;
}
var data;
var hasRequiredData;
function requireData() {
  if (hasRequiredData) return data;
  hasRequiredData = 1;
  data = {
    "version": "0.26.1"
  };
  return data;
}
var Cancel_1;
var hasRequiredCancel;
function requireCancel() {
  if (hasRequiredCancel) return Cancel_1;
  hasRequiredCancel = 1;
  function Cancel(message) {
    this.message = message;
  }
  Cancel.prototype.toString = function toString() {
    return "Cancel" + (this.message ? ": " + this.message : "");
  };
  Cancel.prototype.__CANCEL__ = true;
  Cancel_1 = Cancel;
  return Cancel_1;
}
var http_1;
var hasRequiredHttp;
function requireHttp() {
  if (hasRequiredHttp) return http_1;
  hasRequiredHttp = 1;
  var utils2 = requireUtils();
  var settle2 = requireSettle();
  var buildFullPath2 = requireBuildFullPath();
  var buildURL2 = requireBuildURL();
  var http = require$$2$1;
  var https = require$$2;
  var httpFollow = requireFollowRedirects().http;
  var httpsFollow = requireFollowRedirects().https;
  var url = require$$0;
  var zlib = require$$0$1;
  var VERSION = requireData().version;
  var createError2 = requireCreateError();
  var enhanceError2 = requireEnhanceError();
  var transitionalDefaults = requireTransitional();
  var Cancel = requireCancel();
  var isHttps = /https:?/;
  function setProxy(options, proxy, location) {
    options.hostname = proxy.host;
    options.host = proxy.host;
    options.port = proxy.port;
    options.path = location;
    if (proxy.auth) {
      var base64 = Buffer.from(proxy.auth.username + ":" + proxy.auth.password, "utf8").toString("base64");
      options.headers["Proxy-Authorization"] = "Basic " + base64;
    }
    options.beforeRedirect = function beforeRedirect(redirection) {
      redirection.headers.host = redirection.host;
      setProxy(redirection, proxy, redirection.href);
    };
  }
  http_1 = function httpAdapter(config) {
    return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
      var onCanceled;
      function done() {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(onCanceled);
        }
        if (config.signal) {
          config.signal.removeEventListener("abort", onCanceled);
        }
      }
      var resolve = function resolve2(value) {
        done();
        resolvePromise(value);
      };
      var rejected = false;
      var reject = function reject2(value) {
        done();
        rejected = true;
        rejectPromise(value);
      };
      var data2 = config.data;
      var headers = config.headers;
      var headerNames = {};
      Object.keys(headers).forEach(function storeLowerName(name) {
        headerNames[name.toLowerCase()] = name;
      });
      if ("user-agent" in headerNames) {
        if (!headers[headerNames["user-agent"]]) {
          delete headers[headerNames["user-agent"]];
        }
      } else {
        headers["User-Agent"] = "axios/" + VERSION;
      }
      if (data2 && !utils2.isStream(data2)) {
        if (Buffer.isBuffer(data2)) ;
        else if (utils2.isArrayBuffer(data2)) {
          data2 = Buffer.from(new Uint8Array(data2));
        } else if (utils2.isString(data2)) {
          data2 = Buffer.from(data2, "utf-8");
        } else {
          return reject(createError2(
            "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
            config
          ));
        }
        if (config.maxBodyLength > -1 && data2.length > config.maxBodyLength) {
          return reject(createError2("Request body larger than maxBodyLength limit", config));
        }
        if (!headerNames["content-length"]) {
          headers["Content-Length"] = data2.length;
        }
      }
      var auth = void 0;
      if (config.auth) {
        var username = config.auth.username || "";
        var password = config.auth.password || "";
        auth = username + ":" + password;
      }
      var fullPath = buildFullPath2(config.baseURL, config.url);
      var parsed = url.parse(fullPath);
      var protocol = parsed.protocol || "http:";
      if (!auth && parsed.auth) {
        var urlAuth = parsed.auth.split(":");
        var urlUsername = urlAuth[0] || "";
        var urlPassword = urlAuth[1] || "";
        auth = urlUsername + ":" + urlPassword;
      }
      if (auth && headerNames.authorization) {
        delete headers[headerNames.authorization];
      }
      var isHttpsRequest = isHttps.test(protocol);
      var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
      try {
        buildURL2(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, "");
      } catch (err) {
        var customErr = new Error(err.message);
        customErr.config = config;
        customErr.url = config.url;
        customErr.exists = true;
        reject(customErr);
      }
      var options = {
        path: buildURL2(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ""),
        method: config.method.toUpperCase(),
        headers,
        agent,
        agents: { http: config.httpAgent, https: config.httpsAgent },
        auth
      };
      if (config.socketPath) {
        options.socketPath = config.socketPath;
      } else {
        options.hostname = parsed.hostname;
        options.port = parsed.port;
      }
      var proxy = config.proxy;
      if (!proxy && proxy !== false) {
        var proxyEnv = protocol.slice(0, -1) + "_proxy";
        var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
        if (proxyUrl) {
          var parsedProxyUrl = url.parse(proxyUrl);
          var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
          var shouldProxy = true;
          if (noProxyEnv) {
            var noProxy = noProxyEnv.split(",").map(function trim(s) {
              return s.trim();
            });
            shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
              if (!proxyElement) {
                return false;
              }
              if (proxyElement === "*") {
                return true;
              }
              if (proxyElement[0] === "." && parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
                return true;
              }
              return parsed.hostname === proxyElement;
            });
          }
          if (shouldProxy) {
            proxy = {
              host: parsedProxyUrl.hostname,
              port: parsedProxyUrl.port,
              protocol: parsedProxyUrl.protocol
            };
            if (parsedProxyUrl.auth) {
              var proxyUrlAuth = parsedProxyUrl.auth.split(":");
              proxy.auth = {
                username: proxyUrlAuth[0],
                password: proxyUrlAuth[1]
              };
            }
          }
        }
      }
      if (proxy) {
        options.headers.host = parsed.hostname + (parsed.port ? ":" + parsed.port : "");
        setProxy(options, proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
      }
      var transport;
      var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
      if (config.transport) {
        transport = config.transport;
      } else if (config.maxRedirects === 0) {
        transport = isHttpsProxy ? https : http;
      } else {
        if (config.maxRedirects) {
          options.maxRedirects = config.maxRedirects;
        }
        transport = isHttpsProxy ? httpsFollow : httpFollow;
      }
      if (config.maxBodyLength > -1) {
        options.maxBodyLength = config.maxBodyLength;
      }
      if (config.insecureHTTPParser) {
        options.insecureHTTPParser = config.insecureHTTPParser;
      }
      var req = transport.request(options, function handleResponse(res) {
        if (req.aborted) return;
        var stream = res;
        var lastRequest = res.req || req;
        if (res.statusCode !== 204 && lastRequest.method !== "HEAD" && config.decompress !== false) {
          switch (res.headers["content-encoding"]) {
            /*eslint default-case:0*/
            case "gzip":
            case "compress":
            case "deflate":
              stream = stream.pipe(zlib.createUnzip());
              delete res.headers["content-encoding"];
              break;
          }
        }
        var response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          config,
          request: lastRequest
        };
        if (config.responseType === "stream") {
          response.data = stream;
          settle2(resolve, reject, response);
        } else {
          var responseBuffer = [];
          var totalResponseBytes = 0;
          stream.on("data", function handleStreamData(chunk) {
            responseBuffer.push(chunk);
            totalResponseBytes += chunk.length;
            if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
              rejected = true;
              stream.destroy();
              reject(createError2(
                "maxContentLength size of " + config.maxContentLength + " exceeded",
                config,
                null,
                lastRequest
              ));
            }
          });
          stream.on("aborted", function handlerStreamAborted() {
            if (rejected) {
              return;
            }
            stream.destroy();
            reject(createError2("error request aborted", config, "ERR_REQUEST_ABORTED", lastRequest));
          });
          stream.on("error", function handleStreamError(err) {
            if (req.aborted) return;
            reject(enhanceError2(err, config, null, lastRequest));
          });
          stream.on("end", function handleStreamEnd() {
            try {
              var responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
              if (config.responseType !== "arraybuffer") {
                responseData = responseData.toString(config.responseEncoding);
                if (!config.responseEncoding || config.responseEncoding === "utf8") {
                  responseData = utils2.stripBOM(responseData);
                }
              }
              response.data = responseData;
            } catch (err) {
              reject(enhanceError2(err, config, err.code, response.request, response));
            }
            settle2(resolve, reject, response);
          });
        }
      });
      req.on("error", function handleRequestError(err) {
        if (req.aborted && err.code !== "ERR_FR_TOO_MANY_REDIRECTS") return;
        reject(enhanceError2(err, config, null, req));
      });
      req.on("socket", function handleRequestSocket(socket) {
        socket.setKeepAlive(true, 1e3 * 60);
      });
      if (config.timeout) {
        var timeout = parseInt(config.timeout, 10);
        if (isNaN(timeout)) {
          reject(createError2(
            "error trying to parse `config.timeout` to int",
            config,
            "ERR_PARSE_TIMEOUT",
            req
          ));
          return;
        }
        req.setTimeout(timeout, function handleRequestTimeout() {
          req.abort();
          var timeoutErrorMessage = "";
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          } else {
            timeoutErrorMessage = "timeout of " + config.timeout + "ms exceeded";
          }
          var transitional2 = config.transitional || transitionalDefaults;
          reject(createError2(
            timeoutErrorMessage,
            config,
            transitional2.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
            req
          ));
        });
      }
      if (config.cancelToken || config.signal) {
        onCanceled = function(cancel) {
          if (req.aborted) return;
          req.abort();
          reject(!cancel || cancel && cancel.type ? new Cancel("canceled") : cancel);
        };
        config.cancelToken && config.cancelToken.subscribe(onCanceled);
        if (config.signal) {
          config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
        }
      }
      if (utils2.isStream(data2)) {
        data2.on("error", function handleStreamError(err) {
          reject(enhanceError2(err, config, null, req));
        }).pipe(req);
      } else {
        req.end(data2);
      }
    });
  };
  return http_1;
}
var defaults_1;
var hasRequiredDefaults;
function requireDefaults() {
  if (hasRequiredDefaults) return defaults_1;
  hasRequiredDefaults = 1;
  var utils2 = requireUtils();
  var normalizeHeaderName2 = requireNormalizeHeaderName();
  var enhanceError2 = requireEnhanceError();
  var transitionalDefaults = requireTransitional();
  var DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  function setContentTypeIfUnset(headers, value) {
    if (!utils2.isUndefined(headers) && utils2.isUndefined(headers["Content-Type"])) {
      headers["Content-Type"] = value;
    }
  }
  function getDefaultAdapter() {
    var adapter;
    if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
      adapter = requireHttp();
    }
    return adapter;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils2.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils2.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults = {
    transitional: transitionalDefaults,
    adapter: getDefaultAdapter(),
    transformRequest: [function transformRequest(data2, headers) {
      normalizeHeaderName2(headers, "Accept");
      normalizeHeaderName2(headers, "Content-Type");
      if (utils2.isFormData(data2) || utils2.isArrayBuffer(data2) || utils2.isBuffer(data2) || utils2.isStream(data2) || utils2.isFile(data2) || utils2.isBlob(data2)) {
        return data2;
      }
      if (utils2.isArrayBufferView(data2)) {
        return data2.buffer;
      }
      if (utils2.isURLSearchParams(data2)) {
        setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
        return data2.toString();
      }
      if (utils2.isObject(data2) || headers && headers["Content-Type"] === "application/json") {
        setContentTypeIfUnset(headers, "application/json");
        return stringifySafely(data2);
      }
      return data2;
    }],
    transformResponse: [function transformResponse(data2) {
      var transitional2 = this.transitional || defaults.transitional;
      var silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      var forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
      if (strictJSONParsing || forcedJSONParsing && utils2.isString(data2) && data2.length) {
        try {
          return JSON.parse(data2);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw enhanceError2(e, this, "E_JSON_PARSE");
            }
            throw e;
          }
        }
      }
      return data2;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*"
      }
    }
  };
  utils2.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });
  utils2.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    defaults.headers[method] = utils2.merge(DEFAULT_CONTENT_TYPE);
  });
  defaults_1 = defaults;
  return defaults_1;
}
var transformData;
var hasRequiredTransformData;
function requireTransformData() {
  if (hasRequiredTransformData) return transformData;
  hasRequiredTransformData = 1;
  var utils2 = requireUtils();
  var defaults = requireDefaults();
  transformData = function transformData2(data2, headers, fns) {
    var context = this || defaults;
    utils2.forEach(fns, function transform(fn) {
      data2 = fn.call(context, data2, headers);
    });
    return data2;
  };
  return transformData;
}
var isCancel;
var hasRequiredIsCancel;
function requireIsCancel() {
  if (hasRequiredIsCancel) return isCancel;
  hasRequiredIsCancel = 1;
  isCancel = function isCancel2(value) {
    return !!(value && value.__CANCEL__);
  };
  return isCancel;
}
var dispatchRequest;
var hasRequiredDispatchRequest;
function requireDispatchRequest() {
  if (hasRequiredDispatchRequest) return dispatchRequest;
  hasRequiredDispatchRequest = 1;
  var utils2 = requireUtils();
  var transformData2 = requireTransformData();
  var isCancel2 = requireIsCancel();
  var defaults = requireDefaults();
  var Cancel = requireCancel();
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new Cancel("canceled");
    }
  }
  dispatchRequest = function dispatchRequest2(config) {
    throwIfCancellationRequested(config);
    config.headers = config.headers || {};
    config.data = transformData2.call(
      config,
      config.data,
      config.headers,
      config.transformRequest
    );
    config.headers = utils2.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );
    utils2.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );
    var adapter = config.adapter || defaults.adapter;
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData2.call(
        config,
        response.data,
        response.headers,
        config.transformResponse
      );
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel2(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData2.call(
            config,
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }
      return Promise.reject(reason);
    });
  };
  return dispatchRequest;
}
var mergeConfig;
var hasRequiredMergeConfig;
function requireMergeConfig() {
  if (hasRequiredMergeConfig) return mergeConfig;
  hasRequiredMergeConfig = 1;
  var utils2 = requireUtils();
  mergeConfig = function mergeConfig2(config1, config2) {
    config2 = config2 || {};
    var config = {};
    function getMergedValue(target, source) {
      if (utils2.isPlainObject(target) && utils2.isPlainObject(source)) {
        return utils2.merge(target, source);
      } else if (utils2.isPlainObject(source)) {
        return utils2.merge({}, source);
      } else if (utils2.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(prop) {
      if (!utils2.isUndefined(config2[prop])) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (!utils2.isUndefined(config1[prop])) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    function valueFromConfig2(prop) {
      if (!utils2.isUndefined(config2[prop])) {
        return getMergedValue(void 0, config2[prop]);
      }
    }
    function defaultToConfig2(prop) {
      if (!utils2.isUndefined(config2[prop])) {
        return getMergedValue(void 0, config2[prop]);
      } else if (!utils2.isUndefined(config1[prop])) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    function mergeDirectKeys(prop) {
      if (prop in config2) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    var mergeMap = {
      "url": valueFromConfig2,
      "method": valueFromConfig2,
      "data": valueFromConfig2,
      "baseURL": defaultToConfig2,
      "transformRequest": defaultToConfig2,
      "transformResponse": defaultToConfig2,
      "paramsSerializer": defaultToConfig2,
      "timeout": defaultToConfig2,
      "timeoutMessage": defaultToConfig2,
      "withCredentials": defaultToConfig2,
      "adapter": defaultToConfig2,
      "responseType": defaultToConfig2,
      "xsrfCookieName": defaultToConfig2,
      "xsrfHeaderName": defaultToConfig2,
      "onUploadProgress": defaultToConfig2,
      "onDownloadProgress": defaultToConfig2,
      "decompress": defaultToConfig2,
      "maxContentLength": defaultToConfig2,
      "maxBodyLength": defaultToConfig2,
      "transport": defaultToConfig2,
      "httpAgent": defaultToConfig2,
      "httpsAgent": defaultToConfig2,
      "cancelToken": defaultToConfig2,
      "socketPath": defaultToConfig2,
      "responseEncoding": defaultToConfig2,
      "validateStatus": mergeDirectKeys
    };
    utils2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
      var merge = mergeMap[prop] || mergeDeepProperties;
      var configValue = merge(prop);
      utils2.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  };
  return mergeConfig;
}
var validator;
var hasRequiredValidator;
function requireValidator() {
  if (hasRequiredValidator) return validator;
  hasRequiredValidator = 1;
  var VERSION = requireData().version;
  var validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
    validators[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators.transitional = function transitional2(validator2, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return function(value, opt, opts) {
      if (validator2 === false) {
        throw new Error(formatMessage(opt, " has been removed" + (version ? " in " + version : "")));
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new TypeError("options must be an object");
    }
    var keys = Object.keys(options);
    var i = keys.length;
    while (i-- > 0) {
      var opt = keys[i];
      var validator2 = schema[opt];
      if (validator2) {
        var value = options[opt];
        var result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new TypeError("option " + opt + " must be " + result);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw Error("Unknown option " + opt);
      }
    }
  }
  validator = {
    assertOptions,
    validators
  };
  return validator;
}
var Axios_1;
var hasRequiredAxios$2;
function requireAxios$2() {
  if (hasRequiredAxios$2) return Axios_1;
  hasRequiredAxios$2 = 1;
  var utils2 = requireUtils();
  var buildURL2 = requireBuildURL();
  var InterceptorManager = requireInterceptorManager();
  var dispatchRequest2 = requireDispatchRequest();
  var mergeConfig2 = requireMergeConfig();
  var validator2 = requireValidator();
  var validators = validator2.validators;
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  Axios.prototype.request = function request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig2(this.defaults, config);
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = "get";
    }
    var transitional2 = config.transitional;
    if (transitional2 !== void 0) {
      validator2.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    var requestInterceptorChain = [];
    var synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    var responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    var promise;
    if (!synchronousRequestInterceptors) {
      var chain = [dispatchRequest2, void 0];
      Array.prototype.unshift.apply(chain, requestInterceptorChain);
      chain = chain.concat(responseInterceptorChain);
      promise = Promise.resolve(config);
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }
      return promise;
    }
    var newConfig = config;
    while (requestInterceptorChain.length) {
      var onFulfilled = requestInterceptorChain.shift();
      var onRejected = requestInterceptorChain.shift();
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected(error);
        break;
      }
    }
    try {
      promise = dispatchRequest2(newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    while (responseInterceptorChain.length) {
      promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
    }
    return promise;
  };
  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig2(this.defaults, config);
    return buildURL2(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
  };
  utils2.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig2(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils2.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    Axios.prototype[method] = function(url, data2, config) {
      return this.request(mergeConfig2(config || {}, {
        method,
        url,
        data: data2
      }));
    };
  });
  Axios_1 = Axios;
  return Axios_1;
}
var CancelToken_1;
var hasRequiredCancelToken;
function requireCancelToken() {
  if (hasRequiredCancelToken) return CancelToken_1;
  hasRequiredCancelToken = 1;
  var Cancel = requireCancel();
  function CancelToken(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    this.promise.then(function(cancel) {
      if (!token._listeners) return;
      var i;
      var l = token._listeners.length;
      for (i = 0; i < l; i++) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = function(onfulfilled) {
      var _resolve;
      var promise = new Promise(function(resolve) {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message) {
      if (token.reason) {
        return;
      }
      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
  }
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };
  CancelToken.prototype.subscribe = function subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  };
  CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    var index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  };
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  };
  CancelToken_1 = CancelToken;
  return CancelToken_1;
}
var spread;
var hasRequiredSpread;
function requireSpread() {
  if (hasRequiredSpread) return spread;
  hasRequiredSpread = 1;
  spread = function spread2(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };
  return spread;
}
var isAxiosError;
var hasRequiredIsAxiosError;
function requireIsAxiosError() {
  if (hasRequiredIsAxiosError) return isAxiosError;
  hasRequiredIsAxiosError = 1;
  var utils2 = requireUtils();
  isAxiosError = function isAxiosError2(payload) {
    return utils2.isObject(payload) && payload.isAxiosError === true;
  };
  return isAxiosError;
}
var hasRequiredAxios$1;
function requireAxios$1() {
  if (hasRequiredAxios$1) return axios$2.exports;
  hasRequiredAxios$1 = 1;
  var utils2 = requireUtils();
  var bind2 = requireBind();
  var Axios = requireAxios$2();
  var mergeConfig2 = requireMergeConfig();
  var defaults = requireDefaults();
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind2(Axios.prototype.request, context);
    utils2.extend(instance, Axios.prototype, context);
    utils2.extend(instance, context);
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig2(defaultConfig, instanceConfig));
    };
    return instance;
  }
  var axios2 = createInstance(defaults);
  axios2.Axios = Axios;
  axios2.Cancel = requireCancel();
  axios2.CancelToken = requireCancelToken();
  axios2.isCancel = requireIsCancel();
  axios2.VERSION = requireData().version;
  axios2.all = function all(promises) {
    return Promise.all(promises);
  };
  axios2.spread = requireSpread();
  axios2.isAxiosError = requireIsAxiosError();
  axios$2.exports = axios2;
  axios$2.exports.default = axios2;
  return axios$2.exports;
}
var axios$1;
var hasRequiredAxios;
function requireAxios() {
  if (hasRequiredAxios) return axios$1;
  hasRequiredAxios = 1;
  axios$1 = requireAxios$1();
  return axios$1;
}
var axiosExports = requireAxios();
const axios = /* @__PURE__ */ getDefaultExportFromCjs(axiosExports);
const axiosAuth = axios.create();
axiosAuth.defaults.withCredentials = true;
axiosAuth.interceptors.request.use(
  (config) => {
    const authConfig = config;
    const token = TokenService.getAccessToken();
    const headers = config.headers ?? {};
    if (!authConfig.skipAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }
    headers["Content-Type"] = "application/json";
    config.headers = headers;
    return config;
  },
  (error) => Promise.reject(error)
);
axiosAuth.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const authConfig = error?.config;
    if (authConfig?.skipAuthRefresh) {
      return Promise.reject(error);
    }
    if (error.response?.status === 403) {
      const retry = await resetTokenAndReattemptRequest(error);
      return retry;
    }
    return Promise.reject(error);
  }
);
let isAlreadyFetchingAccessToken = false;
let subscribers = [];
async function resetTokenAndReattemptRequest(error) {
  try {
    const originalConfig = error.config;
    if (!originalConfig) {
      return Promise.reject(error);
    }
    const retryOriginalRequest = new Promise((resolve, reject) => {
      addSubscriber((accessToken) => {
        const headers = originalConfig.headers ?? {};
        headers.Authorization = `Bearer ${accessToken}`;
        originalConfig.headers = headers;
        axios(originalConfig).then(resolve).catch(reject);
      });
    });
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      const response = await axios.post(
        "/api/refresh",
        void 0,
        { withCredentials: true }
      );
      const newToken = response.data?.accessToken ?? null;
      if (!newToken) {
        TokenService.clearTokens();
        isAlreadyFetchingAccessToken = false;
        subscribers = [];
        return Promise.reject(error);
      }
      TokenService.setAccessToken(newToken);
      isAlreadyFetchingAccessToken = false;
      onAccessTokenFetched(newToken);
    }
    return retryOriginalRequest;
  } catch (err) {
    TokenService.clearTokens();
    isAlreadyFetchingAccessToken = false;
    subscribers = [];
    return Promise.reject(err);
  }
}
function onAccessTokenFetched(accessToken) {
  subscribers.forEach((callback) => callback(accessToken));
  subscribers = [];
}
function addSubscriber(callback) {
  subscribers.push(callback);
}
createPinia();
defineStore("theme", {
  state: () => ({
    colors: {}
  }),
  actions: {
    setThemeState(colors) {
      this.colors = colors ?? {};
    },
    clearThemeState() {
      this.colors = {};
    }
  }
});
defineStore("session", {
  state: () => ({
    userData: {
      user: null
    },
    isLoggedIn: false,
    isInitialized: false,
    loading: false,
    error: ""
  }),
  actions: {
    setUser(user) {
      this.userData.user = user;
      this.isLoggedIn = !!user;
      this.isInitialized = true;
      if (!user) {
        this.error = "";
      }
    },
    clearUser() {
      this.userData.user = null;
      this.isLoggedIn = false;
      this.isInitialized = true;
    },
    setLoading(value) {
      this.loading = value;
    },
    setInitialized(value) {
      this.isInitialized = value;
    },
    setError(value) {
      this.error = value ?? "";
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`<main data-v-0dd6a2d6>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0dd6a2d6"]]);

export { _default as default };
//# sourceMappingURL=default-BxyqexbQ.mjs.map
