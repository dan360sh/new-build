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
exports.DBMongo = void 0;
const mongodb_1 = require("mongodb");
class DBMongo {
    constructor() {
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.MONGODB_URI) {
                throw new Error('MONGODB_URI environment variable is not defined');
            }
            try {
                const client = new mongodb_1.MongoClient(process.env.MONGODB_URI);
                this.db = client.db('myDatabase');
                console.log('Connected to MongoDB');
            }
            catch (error) {
                console.error('MongoDB connection error:', error);
                throw error;
            }
        });
    }
    /**
     * Сохраняет данные в базу
     * @param name - название записи
     * @param data - данные (текст или массив)
     * @param type - тип данных ('text' или 'array')
     */
    save(name, data, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (type == "text") {
                    const collection = this.db.collection('text');
                    yield collection.replaceOne({ name }, { name, data }, { upsert: true });
                }
                else {
                    const collection = this.db.collection(name);
                    data = data;
                    yield collection.insertMany(data);
                }
            }
            catch (error) {
                console.error('Error saving data:', error);
                throw error;
            }
        });
    }
    /**
     * Загружает данные по имени
     * @param name - название записи
     * @returns сохраненные данные
     */
    load(name, type, start, stop) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (type == "text") {
                    const collection = this.db.collection('text');
                    const entry = yield collection.findOne({ name: name }, { projection: { _id: 0, data: 1 } });
                    if (entry) {
                        return entry.data + "";
                    }
                    return null;
                }
                else {
                    const collection = this.db.collection(name);
                    if (start && stop) {
                        start = start - 1;
                        const estimate = yield collection.estimatedDocumentCount();
                        if (stop > estimate) {
                            stop = estimate;
                        }
                        if (start > stop) {
                            return null;
                        }
                        let count = (stop - start) + start;
                        return yield collection.find({}, { projection: { _id: 0 } })
                            .sort({ _id: 1 }) // Гарантированный порядок добавления
                            .skip(estimate - count)
                            .limit(stop - start)
                            .toArray();
                    }
                    else {
                        let a = yield collection.find({}, { projection: { _id: 0 } }).toArray();
                        return a;
                    }
                }
            }
            catch (error) {
                console.error('Error loading data:', error);
                throw error;
            }
        });
    }
    findOne(name, search) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("findOne", name, search);
            const collection = this.db.collection(name);
            const documents = yield collection.find({}).toArray();
            console.log("documents", documents);
            let token = yield collection.findOne(search);
            console.log("tttt", token);
            return token;
        });
    }
}
exports.DBMongo = DBMongo;
