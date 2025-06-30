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
exports.LlmList = void 0;
const openai_1 = __importDefault(require("openai"));
const __1 = require("../..");
class LlmList {
    constructor() {
        this.fileService = __1.ConfigInstance.fileService;
    }
    loadLlmList() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileLlm = yield this.fileService.load('system', 'llm.json', 'text');
            if (fileLlm) {
                let llms = JSON.parse(fileLlm);
                return llms;
            }
            return [];
        });
    }
    loadProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileProvider = yield this.fileService.load('system', 'provider.json', 'text');
            if (fileProvider) {
                let provider = JSON.parse(fileProvider);
                for (let l of provider) {
                    l.llm = new openai_1.default({
                        baseURL: l.baseURL,
                        apiKey: l.apiKey,
                        defaultHeaders: {
                            'HTTP-Referer': 'no', // Optional. Site URL for rankings on openrouter.ai.
                            'X-Title': 'test', // Optional. Site title for rankings on openrouter.ai.
                        },
                    });
                }
                return provider;
            }
            return [];
        });
    }
}
exports.LlmList = LlmList;
