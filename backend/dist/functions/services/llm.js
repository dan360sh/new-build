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
        this.countTokens = 0;
    }
    preparationSendLlmMessage(messageUser, context, llms, provider, openChat, user, streamId, chatArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                user.send({ type: 'send-token', data: { id: openChat === null || openChat === void 0 ? void 0 : openChat.settings.id, type: "start" } });
                this.countTokens = 0;
                const mcp = __1.ConfigInstance.mcp;
                console.log(JSON.stringify(mcp.tools), 'mcp.tools');
                this.saveChat(openChat, [{ role: "user", content: messageUser }], [{ role: "user", content: [{ type: 'message', data: messageUser }] }], user.id);
                const promt = mcp.promt + JSON.stringify(mcp.tools);
                context.unshift({ role: "system", content: promt });
                // сохранение чата
                const findChat = chatArray.find(e => e.id == openChat.settings.id);
                if (findChat && findChat.noSave) {
                    findChat.noSave = false;
                    this.fileService.save(user.id, 'chats.json', [findChat], 'array');
                    console.log(chatArray, "chatArray save");
                }
                this.fileService.save(user.id, 'chats.json', JSON.stringify(chatArray), 'text');
                openChat.settings.time = Date.now().toString();
                yield this.sendLlmMessage(context, llms, provider, openChat, user, streamId, chatArray);
                context.shift();
                if (openChat.settings.name === "Новый чат") {
                    const nameNew = yield this.newName(context);
                    if (nameNew) {
                        console.log("save new name", nameNew);
                        openChat.settings.name = nameNew;
                        const findChat = chatArray.find(e => e.id == openChat.settings.id);
                        if (findChat) {
                            findChat.name = nameNew;
                            this.fileService.updateOne(user.id, 'chats.json', { id: findChat.id }, findChat);
                        }
                    }
                }
                this.fileService.save(user.id, 'chats-settings/' + openChat.settings.id + 'chats.json', JSON.stringify(openChat.settings), 'text');
                delete streamId[openChat.settings.id];
                user.send({ type: 'send-token', data: { id: openChat.settings.id, type: "stop" } });
                console.log("stop", JSON.stringify({ type: 'send-token', data: { id: openChat.settings.id, type: "stop" } }));
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    sendLlmMessage(context, llms, provider, openChat, user, streamId, chatArray) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            let toolFlag = false;
            let message = "";
            const messageContext = [];
            const messageChat = [];
            console.log(context, "context");
            if (provider.llm) {
                streamId[openChat === null || openChat === void 0 ? void 0 : openChat.settings.id] = new AbortController();
                try {
                    const completion = yield provider.llm.chat.completions.create({
                        model: llms.model,
                        messages: context,
                        max_tokens: 100,
                        temperature: 0.7,
                        stream: true
                    }, { signal: streamId[openChat === null || openChat === void 0 ? void 0 : openChat.settings.id].signal });
                    try {
                        for (var _d = true, completion_1 = __asyncValues(completion), completion_1_1; completion_1_1 = yield completion_1.next(), _a = completion_1_1.done, !_a; _d = true) {
                            _c = completion_1_1.value;
                            _d = false;
                            let token = _c;
                            user.send({ type: 'send-token', data: { id: openChat === null || openChat === void 0 ? void 0 : openChat.settings.id, token: token.choices[0].delta } });
                            if (token.usage) {
                                console.log("token.usage1", token.usage);
                            }
                            message += token.choices[0].delta.content;
                            let tools = this.extractTextFromMCPTools(message);
                            if (tools) {
                                try {
                                    toolFlag = true;
                                    let toolsParse = JSON.parse(tools);
                                    let mcpArray = {};
                                    for (let nameMcp in toolsParse) {
                                        for (let com in toolsParse[nameMcp]) {
                                            const mcpServer = __1.ConfigInstance.mcp.mspArray[nameMcp];
                                            const r = yield mcpServer.callTool({ name: com, arguments: toolsParse[nameMcp][com] });
                                            JSON.stringify(r);
                                            mcpArray[com] = r;
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
                                    break;
                                }
                                catch (e) {
                                    console.log("tool error", e);
                                }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = completion_1.return)) yield _b.call(completion_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                catch (e) {
                    console.log("была остановка", e);
                    messageChat.push({ role: "assistant", content: [{ type: 'message', data: message }] });
                }
                if (!toolFlag) {
                    messageContext.push({ role: "assistant", content: message });
                    messageChat.push({ role: "assistant", content: [{ type: 'message', data: message }] });
                }
                yield this.saveChat(openChat, messageContext, messageChat, user.id);
                const completionx = yield provider.llm.chat.completions.create({
                    model: llms.model,
                    messages: context,
                    max_tokens: 1,
                });
                console.log('Ответ:', completionx.choices[0].message.content);
                console.log('Использование токенов:', completionx.usage);
                if (completionx.usage) {
                    let count = completionx.usage.total_tokens - completionx.usage.prompt_tokens;
                    this.countTokens = this.countTokens + count;
                    user.subscriptionService.updateTickets(llms, count);
                    openChat.settings.tokenCount = completionx.usage.total_tokens;
                    user.send({ type: 'token-count', data: { tokenCount: openChat.settings.tokenCount } });
                }
                if (toolFlag) {
                    console.log("Второй заход");
                    yield this.sendLlmMessage(context, llms, provider, openChat, user, streamId, chatArray);
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
            yield this.fileService.save(userId, 'chats-context/' + openChat.settings.id + 'chats.json', messageContext, 'array');
            yield this.fileService.save(userId, 'chats-messages/' + openChat.settings.id + 'chats.json', messageChat, 'array');
            return;
        });
    }
    newName(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const idNameLlm = process.env.GN_NAME;
            console.log("newName", idNameLlm);
            const llm = __1.ConfigInstance.llmList.find(e => idNameLlm == e.id);
            if (llm) {
                let provider = __1.ConfigInstance.provider.find(e => e.id == llm.providerId);
                const context = [{ role: "system",
                        content: "Придумай название для чата операясь на контекст сообщений, уложись от одного до трех слов. Твой ответ должен быть только из названия чата, никаких пояснений и ничего лишнего" }];
                context.push({ role: "user", content: `Контекст: ` + JSON.stringify(messageContext) });
                const completion = yield ((_a = provider === null || provider === void 0 ? void 0 : provider.llm) === null || _a === void 0 ? void 0 : _a.chat.completions.create({
                    model: llm.model,
                    messages: context,
                    max_tokens: 12,
                    temperature: 0.7
                }));
                console.log("newName message");
                return completion === null || completion === void 0 ? void 0 : completion.choices[0].message.content;
            }
            return null;
        });
    }
}
exports.Llm = Llm;
