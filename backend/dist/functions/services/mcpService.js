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
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpService = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
class McpService {
    constructor() {
        this.tools = {};
        this.mspArray = {};
        this.promt = `Ты  способен взаимодействовать с системой через MCP (Multi-Command Protocol). 
    Твоя задача выполнить задание всеми доступными способами, пользуйся инструментами если это необходимо.
    Ты можешь выполнять команды на локальной или удалённой системе, используя предоставленные инструменты. Инструменты описаны в tools, в формате:
    {"название mcp сервера": {"tools": [{"name": "название инструмента", "description": "описание инструмента", "inputSchema": {type: "тип ответа", properties: {"example":{"type":"string"}}}}]} ...}
    Когда тебе нужно выполнить команду напиши запрос в формате json внутри тега <mcp-tools>: <mcp-tools>{"название mcp сервера": {"название инструмента": {"example1":"команда", "example2":"команда"}}}</mcp-tools>.
    После запроса тебе вернется ответ от инструмента.
    tools: 
    `;
    }
    init(tr) {
        return __awaiter(this, void 0, void 0, function* () {
            // file.load
            for (let el in tr) {
                const transport = new stdio_js_1.StdioClientTransport(tr[el]);
                const client = new index_js_1.Client({
                    name: "cmd",
                    version: "1.0.0"
                }, {
                    capabilities: {
                        tools: {}
                    }
                });
                try {
                    yield client.connect(transport);
                    this.mspArray[el] = client;
                    //const result = await client.listTools();
                    this.tools[el] = yield client.listTools();
                    const res = yield client.callTool({ name: "execute_command", arguments: {
                            command: "ollama ls",
                            newSession: true
                        } });
                    //  const promt = await client.listPrompts();
                    //  console.log("promt", promt);
                    //console.log("true", res);
                    // const parsed = ListToolsResultSchema.parse(result);
                    // console.log("parsed.tools", parsed.tools);
                }
                catch (e) {
                    console.log("error", e);
                }
            }
            return;
        });
    }
}
exports.McpService = McpService;
