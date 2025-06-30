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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llm = void 0;
const __1 = require("../..");
class Llm {
    constructor() {
        this.fileService = __1.ConfigInstance.fileService;
    }
    preparationSendLlmMessage(messageUser, context, ws, llms, provider, openChat, userId, streamId, chatArray) {
        return __awaiter(this, void 0, void 0, function* () {
            ws.send(JSON.stringify({ type: 'send-token', data: { id: openChat === null || openChat === void 0 ? void 0 : openChat.settings.id, type: "start" } }));
            console.log("start", JSON.stringify({ type: 'send-token', data: { id: openChat === null || openChat === void 0 ? void 0 : openChat.settings.id, type: "start" } }));
            const mcp = __1.ConfigInstance.mcp;
            console.log(JSON.stringify(mcp.tools), 'mcp.tools');
            this.saveChat(openChat, [{ role: "user", content: messageUser }], [{ role: "user", content: [{ type: 'message', data: messageUser }] }], userId);
            const promt = mcp.promt + JSON.stringify(mcp.tools);
            context.unshift({ role: "system", content: promt });
            // сохранение чата
            const findChat = chatArray.find(e => e.id == openChat.settings.id);
            if (findChat) {
                findChat.noSave = false;
            }
            console.log(chatArray, " chatArray");
            this.fileService.save(userId, 'chats.json', JSON.stringify(chatArray), 'text');
            openChat.settings.time = Date.now().toString();
            this.fileService.save(userId, 'chats-settings/' + openChat.settings.id + 'chats.json', JSON.stringify(openChat.settings), 'text');
            yield this.sendLlmMessage(context, ws, llms, provider, openChat, userId, streamId, chatArray);
            delete streamId[openChat.settings.id];
            context.shift();
            ws.send(JSON.stringify({ type: 'send-token', data: { id: openChat.settings.id, type: "stop" } }));
            console.log("stop", JSON.stringify({ type: 'send-token', data: { id: openChat.settings.id, type: "stop" } }));
        });
    }
    sendLlmMessage(context, ws, llms, provider, openChat, userId, streamId, chatArray) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d;
            let toolFlag = false;
            let message = "";
            console.log(context, "context");
            const messageContext = [];
            const messageChat = [];
            if (provider.llm) {
                streamId[openChat === null || openChat === void 0 ? void 0 : openChat.settings.id] = new AbortController();
                try {
                    const completion = yield provider.llm.chat.completions.create({
                        model: llms.model,
                        messages: context,
                        max_tokens: 100000,
                        temperature: 0.7,
                        stream: true
                    }, { signal: streamId[openChat === null || openChat === void 0 ? void 0 : openChat.settings.id].signal });
                    try {
                        for (var _e = true, completion_1 = __asyncValues(completion), completion_1_1; completion_1_1 = yield completion_1.next(), _a = completion_1_1.done, !_a; _e = true) {
                            _c = completion_1_1.value;
                            _e = false;
                            let token = _c;
                            yield completion;
                            //console.log("token.usage",token.usage);
                            ws.send(JSON.stringify({ type: 'send-token', data: { id: openChat === null || openChat === void 0 ? void 0 : openChat.settings.id, token: token.choices[0].delta } }));
                            // console.log("token.choices[0].delta", token.choices[0].delta.content)
                            message += token.choices[0].delta.content;
                            //let mesList = message.split('<mcp-tools>');
                            let tools = this.extractTextFromMCPTools(message);
                            if (tools) {
                                toolFlag = true;
                                console.log(tools, "tools");
                                let toolsParse = JSON.parse(tools);
                                console.log(toolsParse, "toolsParse");
                                let mcpArray = {};
                                for (let nameMcp in toolsParse) {
                                    console.log(toolsParse[nameMcp], "toolsParse[nameMcp]");
                                    for (let com in toolsParse[nameMcp]) {
                                        const mcpServer = __1.ConfigInstance.mcp.mspArray[nameMcp];
                                        console.log({ name: com, arguments: toolsParse[nameMcp][com] }, "{name: com, arguments : toolsParse[nameMcp][com]}");
                                        const r = yield mcpServer.callTool({ name: com, arguments: toolsParse[nameMcp][com] });
                                        JSON.stringify(r);
                                        mcpArray[com] = r;
                                        console.log(r, "rrrr");
                                    }
                                }
                                let ms = message.split('<mcp-tools>')[0];
                                ms = ms.trim();
                                let messageChatContent = [];
                                if (ms.length > 0) {
                                    messageChatContent.push({ type: 'message', data: ms });
                                }
                                messageChatContent.push({ type: 'tool', data: { request: tools, response: JSON.stringify(mcpArray) } });
                                messageChat.push({ role: "assistant", content: messageChatContent });
                                messageContext.push({ role: "assistant", content: message });
                                messageContext.push({ role: "user", content: JSON.stringify(mcpArray) });
                                console.log(toolsParse, 'toolsParse');
                                break;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_e && !_a && (_b = completion_1.return)) yield _b.call(completion_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                catch (e) {
                    console.log("была остановка", e);
                }
                if (!toolFlag) {
                    messageContext.push({ role: "assistant", content: message });
                    messageChat.push({ role: "assistant", content: [{ type: 'message', data: message }] });
                }
                yield this.saveChat(openChat, messageContext, messageChat, userId);
                const completionx = yield provider.llm.chat.completions.create({
                    model: llms.model,
                    messages: context,
                    max_tokens: 1,
                });
                console.log('Ответ:', completionx.choices[0].message.content);
                console.log('Использование токенов:', (_d = completionx.usage) === null || _d === void 0 ? void 0 : _d.total_tokens);
                if (completionx.usage) {
                    let count = completionx.usage.total_tokens - openChat.settings.tokenCount;
                    openChat.settings.tokenCount = completionx.usage.total_tokens;
                    ws.send(JSON.stringify({ type: 'token-count', data: openChat.settings.tokenCount }));
                }
                if (toolFlag) {
                    console.log("Второй заход");
                    yield this.sendLlmMessage(context, ws, llms, provider, openChat, userId, streamId, chatArray);
                }
                return;
            }
        });
    }
    extractTextFromMCPTools(inputString) {
        const regex = /<mcp-tools>(.*?)<\/mcp-tools>/;
        const match = inputString.match(regex);
        return match ? match[1] : null;
    }
    saveChat(openChat, messageContext, messageChat, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = openChat.context) === null || _a === void 0 ? void 0 : _a.push(...messageContext);
            openChat.messages.push(...messageChat);
            yield this.fileService.save(userId, 'chats-context/' + openChat.settings.id + 'chats.json', messageContext, 'array');
            yield this.fileService.save(userId, 'chats-messages/' + openChat.settings.id + 'chats.json', messageChat, 'array');
            return;
        });
    }
}
exports.Llm = Llm;
