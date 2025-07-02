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
exports.Oauth = void 0;
const __1 = require("../..");
class Oauth {
    oauthUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongo = __1.ConfigInstance.mongo;
            if (mongo) {
                const user = yield mongo.findOne("user", { idname: data.idname });
                if (user) {
                    let t = yield __1.ConfigInstance.fileService.load(user.idname, "tickets", "text");
                    if (typeof t === "string") {
                        t = Number(t);
                    }
                    return { token: user.token, name: user.name, id: user.idname, tickets: t };
                }
                else {
                    const newPassword = crypto.randomUUID();
                    mongo.save("user", [Object.assign({ token: newPassword }, data)], "array");
                    //если пользователя нет, то при регистрации дарим ему подарок;
                    __1.ConfigInstance.fileService.save(data.idname, "tickets", "100", "text");
                    return { token: newPassword, name: data.name, id: data.idname, tickets: 100 };
                }
            }
            return null;
        });
    }
    authorization(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongo = __1.ConfigInstance.mongo;
            const user = yield (mongo === null || mongo === void 0 ? void 0 : mongo.findOne("user", { token: token }));
            console.log(user, " user auth");
            if (!user) {
                return null;
            }
            let t = yield __1.ConfigInstance.fileService.load(user.idname, "tickets", "text");
            if (typeof t === "string") {
                t = Number(t);
            }
            return { token: user.token, name: user.name, id: user.idname, tickets: t };
        });
    }
}
exports.Oauth = Oauth;
