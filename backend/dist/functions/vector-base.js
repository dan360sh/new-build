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
exports.VectorBace = void 0;
const weaviate_ts_client_1 = __importDefault(require("weaviate-ts-client"));
class VectorBace {
    constructor() {
        this.client = weaviate_ts_client_1.default.client({
            scheme: 'http',
            host: 'localhost:8080',
        });
    }
    addData(data, classData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.data
                .creator()
                .withClassName(classData)
                .withProperties(data)
                .do();
        });
    }
    addClass(classData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const existingClasses = yield this.client.schema.getter().do();
            const classExists = (_a = existingClasses.classes) === null || _a === void 0 ? void 0 : _a.some(cls => cls.class === classData);
            if (!classExists) {
                yield this.client.schema
                    .classCreator()
                    .withClass({
                    class: 'Article',
                    properties: [
                        {
                            name: 'title',
                            dataType: ['text'],
                        },
                        {
                            name: 'content',
                            dataType: ['text'],
                        },
                    ],
                }).do();
            }
            else {
                console.log('Класс Article уже существует, пропускаем создание');
            }
        });
    }
    searchData(search, classData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.graphql
                .get()
                .withClassName(classData)
                .withFields(`['title', 'content']`)
                .withNearText({ concepts: [search] })
                .withLimit(1)
                .do();
        });
    }
}
exports.VectorBace = VectorBace;
