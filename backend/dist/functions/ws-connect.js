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
exports.WsConnect = void 0;
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chats_1 = require("./services/chats");
const llm_list_1 = require("./services/llm-list");
const __1 = require("..");
const user_object_1 = require("./class/user_object");
// export interface AllUser {
//     name: string, 
//     token: string, 
//     id: string,
//     tickets: number
// }
class WsConnect {
    constructor(bd) {
        this.bd = bd;
        this.userList = new user_object_1.UserList();
        console.log("WsConnect я первый");
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let port = process.env.WS_PORT;
            this.wss = new ws_1.WebSocketServer({ port: port });
            const llmList = new llm_list_1.LlmList();
            const listLlm = yield llmList.loadLlmList();
            const providers = yield llmList.loadProviders();
            __1.ConfigInstance.llmList = listLlm;
            __1.ConfigInstance.provider = providers;
            this.wss.on('connection', (ws) => {
                //let id: string | null | undefined = null;
                let chat = null;
                let user = null;
                ws.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                    console.log(`Получено: ${message}`);
                    console.log("Получено", user);
                    const data = JSON.parse(message);
                    if (data.type === "oauth") {
                        const decoded = jsonwebtoken_1.default.decode(data.data);
                        console.log(decoded, "decoded");
                        let u = yield this.bd.oauthUser({
                            idname: decoded.sub,
                            name: decoded.name,
                            email: decoded.email,
                        });
                        console.log(user, "user1111");
                        if (u) {
                            user = this.userList.add(ws, u);
                            chat = new chats_1.Chats(user, listLlm, providers, ws);
                        }
                        ws.send(JSON.stringify({ type: "authorization", data: u }));
                    }
                    else if (data.type === "authorization") {
                        let u = yield this.bd.authorization(data.data);
                        console.log("authorization user", user);
                        if (u) {
                            user = this.userList.add(ws, u);
                            ws.send(JSON.stringify({ type: "authorization", data: { name: user.name, token: user.token } }));
                            user.subscriptionService.sendSubscription();
                            //    newUser.send({type: "xxx", data: {name: "xxx"}});
                            chat = new chats_1.Chats(user, listLlm, providers, ws);
                        }
                    }
                    else if (data.type === "exit" && user) {
                        user = null;
                        chat = null;
                    }
                    else if (data.type === "create-chat" && user) {
                        if (chat) {
                            let req = yield chat.createChat(data.data);
                            console.log(req, "req");
                            ws.send(JSON.stringify({ type: "create-chat", data: req }));
                        }
                    }
                    else if (data.type === "send-message" && user) {
                        if (chat) {
                            yield chat.sendMessage(data.data);
                        }
                    }
                    else if (data.type === "load-chat" && user) {
                        console.log("Удалить это надо");
                        if (chat) {
                            chat.loadChat(data.data);
                        }
                    }
                    else if (data.type == "stop" && user) {
                        if (chat) {
                            chat.stop();
                        }
                    }
                    else if (data.type == "settings-chat" && user) {
                        if (chat) {
                            chat.settingsChat(data.data);
                        }
                    }
                    else if (data.type == "dlete-chat" && user) {
                        if (chat) {
                            chat.deleteChat(data.data);
                        }
                    }
                    else if (data.type == "reloading-chat" && user) {
                        if (chat) {
                            chat.reloadingChat(data.data.id, data.data.step);
                        }
                    }
                }));
            });
        });
    }
}
exports.WsConnect = WsConnect;
