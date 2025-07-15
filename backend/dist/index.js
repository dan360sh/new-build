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
        },
        // sequentialThinking : {
        //     command: "npx",
        //     args: [
        //         "-y",
        //         "@modelcontextprotocol/server-sequential-thinking"
        //     ]
        // },
        // filesystem: {
        //     command: "npx",
        //     args: [
        //         "-y",
        //         "@modelcontextprotocol/server-filesystem",
        //         "/"
        //     ]
        // },
        // browserMcp: {
        //     command: "npx",
        //     "args": [
        //         "@browsermcp/mcp"
        //     ]
        // }
    };
    if (process.env.MONGODB_URI) {
        const mong = new dbmongo_1.DBMongo();
        yield mong.connect();
        let llms = [{
                "id": "5454",
                "name": "deepSeek",
                "providerId": "1234",
                "description": "я китайский клон gpt",
                "icon": "string",
                "price": 12,
                "url": "hat.deepseek.com",
                "model": "openai/gpt-4o",
                "contextSize": 200000,
                "properties": ["see", "text-generation"]
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
                "properties": ["see", "text-generation"]
            },
            {
                "id": "5456",
                "name": "Hunyuan A13B Instruct",
                "providerId": "4322",
                "description": "Какая-то хрень",
                "icon": "string",
                "price": 12,
                "url": "hat.deepseek.com",
                "model": "openai/gpt-4o",
                "contextSize": 200000,
                "properties": ["see", "text-generation"]
            },
            {
                "id": "1459",
                "name": "Google: Gemma 3n 2B",
                "providerId": "12323",
                "description": "гугловская мини нейросеть",
                "icon": "string",
                "price": 12,
                "url": "hat.deepseek.com",
                "model": "openai/gpt-4o",
                "contextSize": 200000,
                "properties": ["see", "text-generation"]
            },
            {
                "id": "34521",
                "name": "тестовая",
                "providerId": "55555",
                "description": "гугловская мини нейросеть",
                "icon": "string",
                "price": 12,
                "url": "hat.deepseek.com",
                "model": "openai/gpt-4o",
                "contextSize": 200000,
                "properties": ["see", "text-generation"]
            },
            {
                "id": "66666",
                "name": "Kimi K2",
                "providerId": "55555",
                "description": "OpenRouter provides an OpenAI-compatible completion API to 400+ models & providers that you can call directly, or using the OpenAI SDK. Additionally, some third-party SDKs are available.",
                "icon": "string",
                "price": 12,
                "url": "hat.deepseek.com",
                "model": "openai/gpt-4o",
                "contextSize": 200000,
                "properties": ["see", "text-generation"]
            },
        ];
        yield mong.save('system/llm.json', JSON.stringify(llms), 'text');
        const newProvider = [
            {
                "id": "1234",
                "type": "openai",
                "baseURL": "https://openrouter.ai/api/v1",
                "apiKey": "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"
            },
            {
                "id": "4321",
                "type": "openai",
                "baseURL": "http://localhost:11434/v1",
                "apiKey": "ollama"
            },
            {
                "id": "4322",
                "type": "openai",
                "baseURL": "https://openrouter.ai/api/v1",
                "apiKey": "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"
            },
            {
                "id": "12323",
                "type": "openai",
                "baseURL": "https://openrouter.ai/api/v1",
                "apiKey": "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"
            },
            {
                "id": "55555",
                "type": "openai",
                "baseURL": "http://localhost:3700/v1",
                "apiKey": "xxxx"
            },
            {
                "id": "66666",
                "type": "openai",
                "baseURL": "https://openrouter.ai/api/v1",
                "apiKey": "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"
            },
        ];
        yield mong.save('system/provider.json', JSON.stringify(newProvider), 'text');
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
    //const p = new Payment();
    //p.pay();
    try {
        new ws_connect_1.WsConnect(oauth);
    }
    catch (e) {
        console.log(e, "Вылет");
    }
}))();
function x1(oauth) {
    try {
        new ws_connect_1.WsConnect(oauth);
    }
    catch (e) {
        console.log(e, "Вылет");
    }
}
