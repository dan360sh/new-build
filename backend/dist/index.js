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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigInstance = void 0;
const ws_connect_1 = require("./functions/ws-connect");
const mcpService_1 = require("./functions/services/mcpService");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const dbmongo_1 = require("./functions/services/dbmongo");
const fileService_1 = require("./functions/services/fileService");
const oauthServer_1 = require("./functions/services/oauthServer");
class ConfigInstance {
}
exports.ConfigInstance = ConfigInstance;
(() => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
    let m = {
        cmd: {
            command: 'node',
            args: [path_1.default.resolve(__dirname, '../mcp/cmd/dist/index.js')]
        }
    };
    if (process.env.MONGODB_URI) {
        const mong = new dbmongo_1.DBMongo();
        yield mong.connect();
        yield mong.save('system/llm.json', `[{
    "id": "5454",
    "name": "deepSeek",
    "providerId": "1234",
    "description": "я китайский клон gpt",
    "icon": "string",
    "price": 12,
    "url": "hat.deepseek.com",
    "model": "openai/gpt-4o",
    "contextSize": 200000,
    "properties":["see", "text-generation"]
},
{
    "id": "5353",
    "name": "gema",
    "providerId": "4321",
    "description": "я гугловская мини сеть",
    "icon": "string",
    "price": 12,
    "url": "hat.deepseek.com",
    "model": "gemma3:12b",
    "contextSize": 100000,
    "properties":["see", "text-generation"]
}

]`, 'text');
        yield mong.save('system/provider.json', `[
    {
        "id": "1234",
        "type": "openai",
        "baseURL": "https://openrouter.ai/api/v1",
        "apiKey": "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"
    },
    {
        "id": "4321",
        "type": "openai",
        "baseURL": "http://178.57.98.210:11434/v1",
        "apiKey": "ollama"
    }
]`, 'text');
        ConfigInstance.mongo = mong;
    }
    ConfigInstance.fileService = new fileService_1.FileService();
    const mcp = new mcpService_1.McpService();
    yield mcp.init(m);
    // const  result  = await mcp.mspArray['cmd'].callTool({name: 'execute_command', arguments : {"command": "lscpu"}});
    // console.log(result, "result") 
    ConfigInstance.mcp = mcp;
    console.log(process.env.MONGODB_URI, 'host');
    console.log("dssdds");
    //const bd = new BD();
    const oauth = new oauthServer_1.Oauth();
    new ws_connect_1.WsConnect(oauth);
}))();
