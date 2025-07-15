"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const __1 = require("../..");
class Profile {
    constructor(user) {
        this.user = user;
        this.fileService = __1.ConfigInstance.fileService;
    }
    // добавление профиля
    addProfile() {
    }
    //получение профиля
    getProfile() {
    }
}
exports.Profile = Profile;
