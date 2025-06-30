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
exports.Robot = void 0;
const openai_1 = __importDefault(require("openai"));
class Robot {
    constructor() {
        this.messages = [{
                role: 'system',
                content: `Ты — помощник на сайте магазина одежды. 
        Твоя задача помочь клиенту подобрать товар и продать его, задавай наводящие вопросы, чтобы узнать потребность клиента.
        У тебя есть векторная база данных товаров, ты можешь сделать в нее запрос для получения списка нужных товаров, для этого введи "search" в поле "action" и запрос в поле "data",
        если ты отвечаешь пользователю введи "response" в поле "action".
        Ответь в формате JSON с полями:
        - "action": "search"
        - "data": "текст ответа или запроса"
        Отвечай на русском, кратко и по делу.
        `,
            }];
        this.openai = new openai_1.default({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: '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',
            defaultHeaders: {
                'HTTP-Referer': 'no', // Optional. Site URL for rankings on openrouter.ai.
                'X-Title': 'test', // Optional. Site title for rankings on openrouter.ai.
            },
        });
    }
    start() {
        console.log("start");
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.messages.push(message);
            console.log(this.messages);
            const completion = yield this.openai.chat.completions.create({
                model: 'openai/gpt-4o',
                messages: this.messages,
                max_tokens: 2000,
                temperature: 0.7,
            });
            console.log(completion, "completion");
            let text = "";
            // if(completion.error) {
            //   text = completion.error.message;
            // }
            if (completion.choices && completion.choices[0].message.content) {
                text = completion.choices[0].message.content;
                // let json = JSON.parse(text);
                //console.log(json, "json");
            }
            else {
                return "error";
            }
            this.messages.push({
                role: 'assistant',
                content: text,
            });
            return text;
        });
    }
}
exports.Robot = Robot;
