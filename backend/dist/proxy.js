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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3700;
// Конфигурация OpenRouter
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = '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'; // Лучше использовать process.env
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/v1/chat/completions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isStreaming = req.body.stream === true;
        console.log(req.body, "req.body");
        // Исправлено: URL должен быть ASCII (без кириллицы и спецсимволов)
        const headers = {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://your-site.com', // Только латиница!
            'X-Title': 'Your Proxy', // Только ASCII-символы
            'Content-Type': 'application/json',
        };
        if (isStreaming) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
        }
        const response = yield axios_1.default.post(`${OPENROUTER_API_URL}/chat/completions`, req.body, {
            headers,
            responseType: isStreaming ? 'stream' : 'json',
        });
        if (isStreaming) {
            response.data.on('data', (chunk) => {
                console.log(chunk.toString(), "chunk.toString()");
                res.write(chunk.toString());
            });
            response.data.on('end', () => {
                res.end();
            });
        }
        else {
            res.json(response.data);
        }
    }
    catch (error) {
        console.error('Ошибка проксирования:', error);
        res.status(500).json({ error: 'Ошибка проксирования запроса' });
    }
}));
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Прокси-сервер запущен на http://localhost:${PORT}`);
});
