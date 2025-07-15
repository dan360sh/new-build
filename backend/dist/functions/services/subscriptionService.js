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
exports.SubscriptionService = void 0;
const __1 = require("../..");
//this.countTokens * llms.price / 1000000
class SubscriptionService {
    constructor(user) {
        this.user = user;
        this.fileService = __1.ConfigInstance.fileService;
        this.create();
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            let subscription = {
                tickets: 100,
                // Колличество тикетов за подписку 
                ticketsSubscript: 0,
                // Есть подписка
                subscriptionFlag: false,
                //Дата подписки
                dateSubscription: new Date(),
                //Тип подписки
                typeSubscription: "defolte",
                //Автопродление подписки
                autoRenewal: false,
                //Цена подписки
                priceSubscription: 0,
                // Оплачена ли подписка 
                paymentFlag: false
            };
            let load = yield this.fileService.load(this.user.id, "subscription", "text");
            if (load) {
                this.subscription = JSON.parse(load);
            }
            else {
                this.fileService.save(this.user.id, "subscription", JSON.stringify(subscription), "text");
                this.subscription = subscription;
            }
            this.user.send({ type: 'subscription-update', data: this.subscription });
            this.user.onMessaage('analytics', (ws, data) => __awaiter(this, void 0, void 0, function* () {
                const e = yield this.fileService.load(this.user.id, 'analytics', "array", 1, 100);
                if (e) {
                    ws.send(JSON.stringify({ type: 'analytics', data: e }));
                }
            }));
        });
    }
    sendSubscription() {
        this.user.send({ type: 'subscription-update', data: this.subscription });
    }
    // update (el: Subscription) {
    // }
    // Обновляет токены
    updateTickets(llm, count) {
        console.log(" updateTickets", count);
        if (this.subscription) {
            this.subscription.tickets = this.subscription.tickets - (llm.price * count / 1000000);
            this.user.send({ type: 'subscription-update', data: this.subscription });
            this.fileService.save(this.user.id, "subscription", JSON.stringify(this.subscription), "text");
            let anal = {
                // время
                time: new Date(),
                // название модели
                name: llm.name,
                // цена за токены
                price: llm.price,
                // колличество токенов 
                countTokens: count,
                //сколько списано билетов
                writtenOff: llm.price * count / 1000000
            };
            this.fileService.save(this.user.id, 'analytics', [anal], 'array');
        }
    }
}
exports.SubscriptionService = SubscriptionService;
