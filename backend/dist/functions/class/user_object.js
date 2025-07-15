"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserList = exports.UserObject = void 0;
const subscriptionService_1 = require("../services/subscriptionService");
class UserObject {
    constructor(ws, user) {
        this.ws = ws;
        this.user = user;
        this.items = [];
        this.eventMessage = "";
        this.add(ws);
        this.id = user.id;
        this.name = user.name;
        this.token = user.token;
        this.subscriptionService = new subscriptionService_1.SubscriptionService(this);
    }
    // Добавляем объект в массив
    add(item) {
        // Сохраняем оригинальный метод close
        //const originalClose = item.close.bind(item);
        // Переопределяем метод close
        item.on("close", () => {
            this.remove(item);
        });
        item.on('message', (message) => {
            try {
                let mes = JSON.parse(message);
                if (this.messageEvent) {
                    if (mes.type == this.eventMessage) {
                        this.messageEvent(this.ws, mes.data);
                    }
                }
            }
            catch (e) {
            }
        });
        this.items.push(item);
        console.log("add user", this.items.length);
    }
    // Удаляем объект из массива
    remove(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        console.log("remove user", this.items);
        if (this.items.length == 0 && this.closeF) {
            this.closeF(this.id);
        }
    }
    send(message) {
        for (let ws of this.items) {
            ws.send(JSON.stringify(message));
        }
    }
    close(f) {
        this.closeF = f;
    }
    onMessaage(event, f) {
        this.messageEvent = f;
        this.eventMessage = event;
    }
}
exports.UserObject = UserObject;
class UserList {
    constructor() {
        this.users = [];
    }
    add(ws, user) {
        const find = this.users.find(e => e.id == user.id);
        if (!find) {
            const newUser = new UserObject(ws, user);
            newUser.close((e) => {
                this.remove(newUser);
            });
            this.users.push(newUser);
            return newUser;
        }
        else {
            find.add(ws);
            return find;
        }
    }
    // Удаляем объект из массива
    remove(item) {
        const index = this.users.indexOf(item);
        if (index !== -1) {
            console.log("Удаляем объект user из массива");
            this.users.splice(index, 1);
        }
    }
}
exports.UserList = UserList;
