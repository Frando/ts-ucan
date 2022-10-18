"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.first = exports.all = exports.isAsyncIterable = exports.isIterable = exports.isRecord = exports.hasProp = exports.generateNonce = void 0;
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateNonce = (len = 6) => {
    let nonce = "";
    for (let i = 0; i < len; i++) {
        nonce += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return nonce;
};
exports.generateNonce = generateNonce;
function hasProp(data, prop) {
    return typeof data === "object" && data != null && prop in data;
}
exports.hasProp = hasProp;
function isRecord(data) {
    return typeof data === "object" && data != null;
}
exports.isRecord = isRecord;
function isIterable(obj) {
    return typeof obj === "object" && obj != null && Symbol.iterator in obj;
}
exports.isIterable = isIterable;
function isAsyncIterable(obj) {
    return typeof obj === "object" && obj != null && Symbol.asyncIterator in obj;
}
exports.isAsyncIterable = isAsyncIterable;
function all(it) {
    if (isIterable(it)) {
        const arr = [];
        for (const elem of it) {
            arr.push(elem);
        }
        return arr;
    }
    else if (isAsyncIterable(it)) {
        return (() => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const arr = [];
            try {
                for (var it_1 = __asyncValues(it), it_1_1; it_1_1 = yield it_1.next(), !it_1_1.done;) {
                    const elem = it_1_1.value;
                    arr.push(elem);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (it_1_1 && !it_1_1.done && (_a = it_1.return)) yield _a.call(it_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return arr;
        }))();
    }
    else {
        throw new TypeError(`Expected either Iterable or AsyncIterable, but got ${it}`);
    }
}
exports.all = all;
function first(it) {
    if (isIterable(it)) {
        for (const elem of it) {
            return elem;
        }
        return undefined;
    }
    else if (isAsyncIterable(it)) {
        return (() => __awaiter(this, void 0, void 0, function* () {
            var e_2, _a;
            try {
                for (var it_2 = __asyncValues(it), it_2_1; it_2_1 = yield it_2.next(), !it_2_1.done;) {
                    const elem = it_2_1.value;
                    return elem;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (it_2_1 && !it_2_1.done && (_a = it_2.return)) yield _a.call(it_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return undefined;
        }))();
    }
    else {
        throw new TypeError(`Expected either Iterable or AsyncIterable, but got ${it}`);
    }
}
exports.first = first;
//# sourceMappingURL=util.js.map