"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_config_1 = require("./config/server.config");
const app = (0, express_1.default)();
app.listen(server_config_1.serverconfig.PORT, () => {
    console.log(`Server is running on ${server_config_1.serverconfig.PORT}`);
});
//# sourceMappingURL=server.js.map