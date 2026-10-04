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
    PORT: Number(process.env.PORT) || 8080,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
    JWT_SECRET: process.env.JWT_SECRET || "secretkey",
    SALTROUNDS: Number(process.env.SALTROUNDS) || 10
};
//# sourceMappingURL=server.config.js.map