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
exports.Chats = void 0;
const stream_1 = require("stream");
const __1 = require("../..");
const llm_1 = require("./llm");
const newChatMessage = { data: [], stepObject: { start: 0, stop: 0, allQuantity: 0 } };
class Chats {
    constructor(user, llms, provider, ws) {
        this.user = user;
        this.llms = llms;
        this.provider = provider;
        this.ws = ws;
        this.fileService = __1.ConfigInstance.fileService;
        this.stopEvent = new stream_1.EventEmitter();
        //список всех чатов;
        this.chatArray = [];
        //открытый чат
        this.openChat = null;
        this.streamId = {};
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatArray = yield this.getChats();
            this.user.send({ type: 'get-chats', data: this.chatArray });
            this.user.send({ type: 'get-llms', data: this.llms });
        });
    }
    stop() {
        var _a, _b, _c;
        console.log("stop 123", this.streamId);
        console.log("stop 123", (_a = this.openChat) === null || _a === void 0 ? void 0 : _a.settings.id);
        if (this.openChat) {
            if (this.streamId[(_b = this.openChat) === null || _b === void 0 ? void 0 : _b.settings.id]) {
                console.log("stop 222");
                this.streamId[(_c = this.openChat) === null || _c === void 0 ? void 0 : _c.settings.id].abort();
            }
        }
    }
    settingsChat(settings) {
        var _a, _b;
        console.log("settingsChat1", this.chatArray);
        for (let i = 0; i < this.chatArray.length; i++) {
            if (this.chatArray[i].id == settings.id && this.openChat) {
                this.chatArray[i] = settings;
                settings.tokenCount = this.openChat.settings.tokenCount;
                this.openChat.settings = settings;
                console.log(this.openChat.settings, "this.openChat.settings");
                if (!settings.noSave) {
                    this.fileService.save(this.user.id, 'chats-settings/' + ((_a = this.openChat) === null || _a === void 0 ? void 0 : _a.settings.id) + 'chats.json', JSON.stringify((_b = this.openChat) === null || _b === void 0 ? void 0 : _b.settings), 'text');
                    this.fileService.save(this.user.id, 'chats.json', JSON.stringify(this.chatArray), 'text');
                }
                break;
            }
        }
        //console.log("settingsChat1", this.chatArray);
    }
    getChats() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getChats111");
            const rawData = yield this.fileService.load(this.user.id, 'chats.json', 'array');
            if (rawData) {
                return rawData;
            }
            return [];
        });
    }
    createChat(newChat) {
        //id чата
        //const idChat  = crypto.randomUUID();
        newChat.noSave = true;
        this.chatArray.push(newChat);
        newChat.tokenCount = 0;
        this.openChat = { settings: newChat, context: [], };
        return this.openChat;
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("sendMessage11");
            if (this.openChat) {
                console.log("sendMessage22");
                let llm = this.llms.find(e => { var _a; return e.id == ((_a = this.openChat) === null || _a === void 0 ? void 0 : _a.settings.llmId); });
                if (llm) {
                    let provider = this.provider.find(e => e.id == llm.providerId);
                    if (provider && this.openChat.context) {
                        const llmService = new llm_1.Llm();
                        llmService.preparationSendLlmMessage(message, this.openChat.context, llm, provider, this.openChat, this.user, this.streamId, this.chatArray);
                        //this.sendLlmMessage(message, this.openChat.context, this.ws, llm, provider, this.openChat);
                    }
                }
            }
        });
    }
    loadChat(id, loadMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("load chat", id);
            let chatFind = this.chatArray.find(e => e.id == id);
            if (chatFind) {
                if (chatFind.noSave) {
                    console.log("ебать noSave");
                    this.openChat = { settings: chatFind, context: [] };
                    this.ws.send(JSON.stringify({ type: 'load-chat', data: { context: newChatMessage, settings: this.openChat.settings } }));
                }
                else {
                    this.openChat = { settings: chatFind, context: [] };
                    const settings = yield this.fileService.load(this.user.id, 'chats-settings/' + id + 'chats.json', 'text');
                    const context = yield this.fileService.load(this.user.id, 'chats-context/' + id + 'chats.json', 'array');
                    const message = yield this.fileService.load(this.user.id, 'chats-messages/' + id + 'chats.json', 'array', 1, 10);
                    if (context) {
                        this.openChat.context = context;
                    }
                    if (settings) {
                        this.openChat.settings = JSON.parse(settings);
                        console.log("load");
                        this.ws.send(JSON.stringify({ type: 'load-chat', data: { context: message, settings: this.openChat.settings } }));
                    }
                }
            }
            else {
                let newChat = { id: id, name: "Новый чат", llmId: "5353", time: Date.now().toString(), maxToken: 5000, temperature: 0.7, tokenCount: 0 };
                //все равно создадим кастомный
                this.openChat = this.createChat(newChat);
                this.ws.send(JSON.stringify({ type: 'load-chat', data: { context: newChatMessage, settings: this.openChat.settings } }));
            }
        });
    }
    deleteChat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fileService.deleteOne(this.user.id, 'chats.json', { id: id }, "array");
            //         await this.fileService.save(userId, 'chats-context/'+ openChat.settings.id+'chats.json', messageContext, 'array');
            // await this.fileService.save(userId, 'chats-messages/'+ openChat.settings.id+'chats.json',messageChat, 'array');
            this.fileService.drop(this.user.id, 'chats-context/' + id + 'chats.json');
            this.fileService.drop(this.user.id, 'chats-messages/' + id + 'chats.json');
            console.log("deleteChat", id);
        });
    }
    reloadingChat(id, step) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.fileService.load(this.user.id, 'chats-messages/' + id + 'chats.json', 'array', step.start, step.stop);
            this.user.send({ type: 'reloading-chat', data: message });
        });
    }
}
exports.Chats = Chats;
