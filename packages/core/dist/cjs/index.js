"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginInjectedApi = exports.isCapability = exports.SUPERUSER = exports.isAbility = exports.isResourcePointer = exports.ability = exports.capability = void 0;
const token = __importStar(require("./token.js"));
const verifyLib = __importStar(require("./verify.js"));
const attenuation = __importStar(require("./attenuation.js"));
const builder_js_1 = __importDefault(require("./builder.js"));
const store_js_1 = __importDefault(require("./store.js"));
__exportStar(require("./attenuation.js"), exports);
__exportStar(require("./builder.js"), exports);
__exportStar(require("./store.js"), exports);
__exportStar(require("./token.js"), exports);
__exportStar(require("./types.js"), exports);
__exportStar(require("./verify.js"), exports);
__exportStar(require("./plugins.js"), exports);
__exportStar(require("./util.js"), exports);
exports.capability = __importStar(require("./capability/index.js"));
exports.ability = __importStar(require("./capability/ability.js"));
var resource_pointer_js_1 = require("./capability/resource-pointer.js");
Object.defineProperty(exports, "isResourcePointer", { enumerable: true, get: function () { return resource_pointer_js_1.isResourcePointer; } });
var ability_js_1 = require("./capability/ability.js");
Object.defineProperty(exports, "isAbility", { enumerable: true, get: function () { return ability_js_1.isAbility; } });
Object.defineProperty(exports, "SUPERUSER", { enumerable: true, get: function () { return ability_js_1.SUPERUSER; } });
var index_js_1 = require("./capability/index.js");
Object.defineProperty(exports, "isCapability", { enumerable: true, get: function () { return index_js_1.isCapability; } });
const getPluginInjectedApi = (plugins) => {
    const build = token.build(plugins);
    const sign = token.sign(plugins);
    const signWithKeypair = token.signWithKeypair(plugins);
    const validate = token.validate(plugins);
    const validateProofs = token.validateProofs(plugins);
    const verify = verifyLib.verify(plugins);
    const delegationChains = attenuation.delegationChains(plugins);
    const Builder = (0, builder_js_1.default)(plugins);
    const Store = (0, store_js_1.default)(plugins);
    return {
        build,
        sign,
        signWithKeypair,
        validate,
        validateProofs,
        verify,
        delegationChains,
        Builder,
        Store
    };
};
exports.getPluginInjectedApi = getPluginInjectedApi;
//# sourceMappingURL=index.js.map