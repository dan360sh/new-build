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
exports.BD = void 0;
const sequelize_1 = require("sequelize");
class BD {
    constructor() {
        this.sequelize = new sequelize_1.Sequelize('mydatabase', 'myuser', 'mypassword', {
            host: 'localhost',
            dialect: 'postgres',
            logging: false // Отключаем логи запросов для чистоты вывода
        });
        // Определение модели
        this.user = this.sequelize.define('User', {
            idname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            email: { type: sequelize_1.DataTypes.STRING, unique: true },
            token: { type: sequelize_1.DataTypes.STRING, allowNull: false }
        }, {
            tableName: 'users',
            timestamps: false // Отключаем автоматические поля createdAt/updatedAt
        });
        // Проверка подключения и синхронизация
        this.initializeDatabase();
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sequelize.authenticate();
                console.log('Connection to DB has been established successfully.');
                // Синхронизируем модель с базой (создаем таблицу если ее нет)
                yield this.user.sync({ alter: true }); // alter: true безопаснее чем force: true
                console.log('User table has been synchronized');
            }
            catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        });
    }
    authorization(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield this.user.findOne({
                where: {
                    token: token
                }
            });
            return userExists;
        });
    }
    oauthUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.user.findOne({
                    where: {
                        idname: data.idname
                    }
                });
                if (userExists) {
                    console.log("User exists:", userExists.toJSON());
                    console.log(userExists, "userExists", { token: userExists.token, name: userExists.name });
                    return { token: userExists.token, name: userExists.name, id: userExists.idname };
                }
                else {
                    console.log("User not found, creating new one");
                    const newPassword = crypto.randomUUID();
                    const newUser = yield this.user.create(Object.assign({ token: newPassword }, data));
                    console.log();
                    return { token: newUser.token, name: newUser.name, id: userExists.idname };
                }
            }
            catch (error) {
                console.error("Error in oauthUser:", error);
                throw error;
            }
        });
    }
}
exports.BD = BD;
