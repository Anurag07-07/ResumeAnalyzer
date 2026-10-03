"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverconfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
function run() {
    dotenv_1.default.config();
}
run();
exports.serverconfig = {
    PORT: Number(process.env.PORT) || 8080
};
//# sourceMappingURL=server.config.js.map