"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_config_1 = require("./config/server.config");
const error_middlware_1 = require("./middlewares/error.middlware");
const dbconfig_1 = require("./config/dbconfig");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', auth_routes_1.default);
app.use(error_middlware_1.generalErrorMiddleware);
app.listen(server_config_1.serverconfig.PORT, async () => {
    console.log(`Server is running on ${server_config_1.serverconfig.PORT}`);
    await (0, dbconfig_1.DbConnect)();
});
//# sourceMappingURL=server.js.map