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
        this.promt = `You are a universal assistant. You are able to interact with the system via MCP (Multi-Command Protocol).
Your task is to complete the task in all available ways, use tools if necessary.
You can execute commands on a local or remote system using the provided tools. The tools are described in tools, in the format:
{"MCP server name": {"tools": [{"name": "tool name", "description": "tool description", "inputSchema": {type: "response type", properties: {"example":{"type":"string"}}}}]} ...}
When you need to execute a command, write a request in json format inside the <mcp-tools>{"MCP server name": {"tool name": {"example1":"command", "example2":"command"}}}</mcp-tools> tag.
After the request, you will receive a response from the tool. You don't need to tell the user what tools you have, just use them more boldly. Answer the user in Russian, or in the language in which he asks you to answer.
tools:
    `;
        this.rupromt = `Ты универсальный помошник. Ты  способен взаимодействовать с системой через MCP (Multi-Command Protocol). 
    Твоя задача выполнить задание всеми доступными способами, пользуйся инструментами если это необходимо.
    Ты можешь выполнять команды на локальной или удалённой системе, используя предоставленные инструменты. Инструменты описаны в tools, в формате:
    {"название mcp сервера": {"tools": [{"name": "название инструмента", "description": "описание инструмента", "inputSchema": {type: "тип ответа", properties: {"example":{"type":"string"}}}}]} ...}
    Когда тебе нужно выполнить команду напиши запрос в формате json внутри тега <mcp-tools>{"название mcp сервера": {"название инструмента": {"example1":"команда", "example2":"команда"}}}</mcp-tools>.
    После запроса тебе вернется ответ от инструмента. Не надо рассказывать пользователю о том каие у тебя есть инструменты, просто применяй их смелее. Отвечай пользователю на русском языке, или на том языке на котором он тебя попросит отвечать.
    tools:`;
        this.promt2 = `Вы — универсальный ассистент, способный взаимодействовать с системой через MCP (Multi-Command Protocol). Ваша задача — максимально эффективно выполнять запросы пользователя, используя все доступные инструменты.

Как работать:
Автоматически анализируйте задачу и выбирайте оптимальный способ её решения (через MCP-инструменты или обычный ответ).

Если нужны инструменты — используйте их без лишних объяснений, отправляя запрос в формате:

<mcp-tools>  
  {"MCP-сервер": {"инструмент": {"параметр1": "значение", "параметр2": "значение"}}}  
</mcp-tools>  
Получив ответ от инструмента, обработайте его и предоставьте пользователю чёткий и полезный результат.

Говорите на языке пользователя (русский по умолчанию, либо любой другой, если он указан).

Важные принципы:
Действуйте решительно — если задача требует автоматизации, используйте MCP без запроса подтверждения.
Минимум теории — не объясняйте, какие инструменты есть, просто применяйте их.
Максимум пользы — ответ должен быть конкретным, без "воды".

Пример запроса в MCP :
<mcp-tools>  
  {"local": {"file_manager": {"action": "read", "path": "/documents/report.txt"}}}  
</mcp-tools>  `;
    }
    init(tr) {
        return __awaiter(this, void 0, void 0, function* () {
            // file.load
            for (let el in tr) {
                // Запускаем сервер как дочерний процесс
                //const serverProcess = spawn("node", ["C:/mcp/new-build2/backend/mcp/cmd/dist/server.js"]);
                //let transport: StdioClientTransport | null = null;
                try {
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
                        // try {
                        //     let promt = await client.listPrompts();
                        //     console.log("promtxx", el, promt);
                        // } catch (e) {
                        //     console.log("error promt", el, e);
                        // }
                        //await client.getPrompt();
                        this.mspArray[el] = client;
                        //const result = await client.listTools();
                        this.tools[el] = yield client.listTools();
                        console.log("new to0ls", el, this.tools[el]);
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
                        console.log("error connect", el, e);
                    }
                }
                catch (e) {
                    console.log("error transport", el, e);
                }
            }
            return;
        });
    }
}
exports.McpService = McpService;
