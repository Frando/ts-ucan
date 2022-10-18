"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
const core_1 = require("@ucans/core");
const plugin_js_1 = require("./ed25519/plugin.js");
const plugin_js_2 = require("./p256/plugin.js");
const plugin_js_3 = require("./rsa/plugin.js");
exports.defaults = new core_1.Plugins([plugin_js_1.ed25519Plugin, plugin_js_2.p256Plugin, plugin_js_3.rsaPlugin, plugin_js_3.rsaOldPlugin], {});
//# sourceMappingURL=default-plugins.js.map