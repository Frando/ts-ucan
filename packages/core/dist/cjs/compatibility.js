"use strict";
// A module to hold all the ugly compatibility logic
// for getting from old UCANs to newer version UCANs.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCompatibility = void 0;
const semver = __importStar(require("./semver.js"));
const util = __importStar(require("./util.js"));
const super_user_js_1 = require("./capability/super-user.js");
const types_js_1 = require("./types.js");
const index_js_1 = require("./capability/index.js");
const VERSION_0_3 = { major: 0, minor: 3, patch: 0 };
function isUcanHeader_0_3_0(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "alg") && typeof obj.alg === "string"
        && util.hasProp(obj, "typ") && typeof obj.typ === "string"
        && util.hasProp(obj, "uav") && typeof obj.uav === "string";
}
function isUcanPayload_0_3_0(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "iss") && typeof obj.iss === "string"
        && util.hasProp(obj, "aud") && typeof obj.aud === "string"
        && (!util.hasProp(obj, "nbf") || typeof obj.nbf === "number")
        && util.hasProp(obj, "exp") && typeof obj.exp === "number"
        && util.hasProp(obj, "rsc") && (typeof obj.rsc === "string" || util.isRecord(obj))
        && util.hasProp(obj, "ptc") && typeof obj.ptc === "string"
        && (!util.hasProp(obj, "prf") || typeof obj.prf === "string");
}
function handleCompatibility(header, payload) {
    const fail = (place, reason) => new Error(`Can't parse UCAN ${place}: ${reason}`);
    if (!util.isRecord(header))
        throw fail("header", "Invalid format: Expected a record");
    // parse either the "ucv" or "uav" as a version in the header
    // we translate 'uav: 1.0.0' into 'ucv: 0.3.0'
    let version = "0.8.1";
    if (!util.hasProp(header, "ucv") || typeof header.ucv !== "string") {
        if (!util.hasProp(header, "uav") || typeof header.uav !== "string") {
            throw fail("header", "Invalid format: Missing version indicator");
        }
        else if (header.uav !== "1.0.0") {
            throw fail("header", `Unsupported version 'uav: ${header.uav}'`);
        }
        version = "0.3.0";
    }
    else if (semver.lt(header.ucv, "0.8.0")) {
        throw fail("header", `Unsupported version 'ucv: ${header.ucv}'`);
    }
    if (semver.gte(version, "0.8.0")) {
        if (typeof header.ucv !== "string") {
            throw fail("header", "Invalid format: Missing 'ucv' key or 'ucv' is not a string");
        }
        header.ucv = semver.parse(header.ucv);
        if (header.ucv == null) {
            throw fail("header", "Invalid format: 'ucv' string cannot be parsed into a semantic version");
        }
        if (!(0, types_js_1.isUcanHeader)(header))
            throw fail("header", "Invalid format");
        if (!(0, types_js_1.isUcanPayload)(payload))
            throw fail("payload", "Invalid format");
        return { header, payload };
    }
    // we know it's version 0.3.0
    if (!isUcanHeader_0_3_0(header))
        throw fail("header", "Invalid version 0.3.0 format");
    if (!isUcanPayload_0_3_0(payload))
        throw fail("payload", "Invalid version 0.3.0 format");
    return {
        header: {
            alg: header.alg,
            typ: header.typ,
            ucv: VERSION_0_3,
        },
        payload: {
            iss: payload.iss,
            aud: payload.aud,
            nbf: payload.nbf,
            exp: payload.exp,
            att: (() => {
                if (payload.rsc === super_user_js_1.SUPERUSER || typeof payload.rsc === "string")
                    return [
                        (0, index_js_1.my)(super_user_js_1.SUPERUSER)
                    ];
                const resources = payload.rsc;
                return Object.keys(resources).map(rscKey => {
                    return {
                        with: { scheme: rscKey, hierPart: resources[rscKey] },
                        can: payload.ptc === super_user_js_1.SUPERUSER
                            ? super_user_js_1.SUPERUSER
                            : { namespace: rscKey, segments: [payload.ptc] }
                    };
                });
            })(),
            prf: payload.prf != null ? [payload.prf] : []
        },
    };
}
exports.handleCompatibility = handleCompatibility;
//# sourceMappingURL=compatibility.js.map