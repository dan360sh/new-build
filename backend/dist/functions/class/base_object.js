"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseObject = void 0;
const __1 = require("../..");
class BaseObject {
    constructor(name, user) {
        this.name = name;
        this.user = user;
        this.fileService = __1.ConfigInstance.fileService;
        //в разработке
        // user.onMessaage(e => {
        //     const data = JSON.parse(e);
        //     if(data.type == ""){
        //     }
        // })
    }
    update(el) {
        this.fileService.save(this.user.id, this.name, JSON.stringify(el), 'text');
        this.user.send({ type: this.name, data: el });
    }
}
exports.BaseObject = BaseObject;
