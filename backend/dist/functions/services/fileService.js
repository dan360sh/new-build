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
exports.FileService = void 0;
const fs_1 = __importDefault(require("fs"));
const __1 = require("../..");
const filePath = "/mcp2/data";
class FileService {
    constructor() {
        if (process.env.MONGODB_URI) {
            this.mongo = __1.ConfigInstance.mongo;
        }
        if (!this.mongo) {
            console.log("нет mongo");
        }
    }
    filesIs(pathName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathArray2 = [];
            if (!fs_1.default.existsSync(pathName)) {
                LOLpathName(pathName.split("/"));
            }
            else {
                fs_1.default.writeFileSync(pathName, data);
                return;
            }
            function LOLpathName(pathArray) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!fs_1.default.existsSync(pathArray.join("/"))) {
                        let s = pathArray.pop();
                        if (s) {
                            pathArray2.push(s);
                        }
                        yield LOLpathName(pathArray);
                    }
                    else {
                        if (pathArray2.length !== 1) {
                            let s = pathArray2.pop();
                            if (s) {
                                pathArray.push(s);
                            }
                            fs_1.default.mkdirSync(pathArray.join("/"));
                            yield LOLpathName(pathArray);
                        }
                        else {
                            fs_1.default.writeFileSync(pathName, data);
                            return;
                        }
                    }
                    return;
                });
            }
        });
    }
    save(id, file, data, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mongo) {
                const pathName = id + '/' + file;
                yield this.mongo.save(pathName, data, type);
            }
            else {
                const pathName = filePath + '/' + id + '/' + file;
                if (type == 'array') {
                    let text = "";
                    if (fs_1.default.existsSync(pathName)) {
                        text = fs_1.default.readFileSync(pathName, 'utf-8');
                        let textm = JSON.parse(text);
                        textm.push(...data);
                        data = textm;
                    }
                    data = JSON.stringify(data);
                }
                data = data;
                yield this.filesIs(pathName, data);
            }
        });
    }
    load(id, file, type, start, stop) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mongo) {
                const pathName = id + '/' + file;
                let m = yield this.mongo.load(pathName, type, start, stop);
                return m;
            }
            else {
                const pathName = filePath + '/' + id + '/' + file;
                if (fs_1.default.existsSync(pathName)) {
                    if (type == "array") {
                        let data = fs_1.default.readFileSync(pathName, 'utf-8');
                        data = JSON.parse(data);
                        if (start && stop) {
                            start = start - 1;
                            const a = data.length - start;
                            const b = a - (stop - start);
                            return data.slice(b, a);
                        }
                        return data;
                    }
                    else {
                        return fs_1.default.readFileSync(pathName, 'utf-8');
                    }
                }
                return null;
            }
        });
    }
    updateOne(id, file, search, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mongo) {
                const pathName = id + '/' + file;
                yield this.mongo.updateOne(pathName, search, data);
            }
        });
    }
    drop(id, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mongo) {
                const pathName = id + '/' + file;
                yield this.mongo.drop(pathName);
            }
        });
    }
    deleteOne(id, file, search, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mongo) {
                if (type == 'array') {
                    const pathName = id + '/' + file;
                    yield this.mongo.deleteOne(pathName, search);
                }
            }
        });
    }
}
exports.FileService = FileService;
