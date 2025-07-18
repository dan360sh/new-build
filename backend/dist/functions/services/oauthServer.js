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
exports.generateUUID = generateUUID;
const __1 = require("../..");
function generateUUID() {
    const buf = new Uint16Array(8);
    return (pad4(buf[0]) + pad4(buf[1]) + '-' + pad4(buf[2]) + '-' +
        pad4(buf[3]) + '-' + pad4(buf[4]) + '-' +
        pad4(buf[5]) + pad4(buf[6]) + pad4(buf[7]));
}
function pad4(num) {
    let ret = num.toString(16);
    while (ret.length < 4) {
        ret = '0' + ret;
    }
    return ret;
}
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
                    return { token: user.token, name: user.name, id: user.idname };
                }
                else {
                    //crypto.randomUUID();
                    const newPassword = generateUUID();
                    mongo.save("user", [Object.assign({ token: newPassword }, data)], "array");
                    return { token: newPassword, name: data.name, id: data.idname };
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
            return { token: user.token, name: user.name, id: user.idname };
        });
    }
}
exports.Oauth = Oauth;
