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
exports.Payment = void 0;
const yoo_checkout_1 = require("@a2seven/yoo-checkout");
const __1 = require("../..");
class Payment {
    constructor(user) {
        this.user = user;
        const key = process.env.YOOKASSA_KEY ? process.env.YOOKASSA_KEY : "";
        this.fileService = __1.ConfigInstance.fileService;
        this.checkout = new yoo_checkout_1.YooCheckout({ shopId: '1123783', secretKey: key });
        console.log(this.checkout, "checkout");
        this.user.onMessaage('pay', (ws, data) => __awaiter(this, void 0, void 0, function* () {
            const e = yield this.fileService.load(this.user.id, 'analytics', "array", 1, 100);
            if (e) {
                ws.send(JSON.stringify({ type: 'pay', data: e }));
            }
        }));
    }
    pay() {
        return __awaiter(this, void 0, void 0, function* () {
            const idempotenceKey = '02547fc4-a1f0-59db-808e-f0d67c2ed5a9';
            const createPayload = {
                amount: {
                    value: '25.25',
                    currency: 'RUB'
                },
                payment_method_data: {
                    type: "bank_card"
                },
                confirmation: {
                    type: 'redirect',
                    return_url: 'localhost/ffdfd'
                },
                capture: true,
                description: 'Заказ №72',
            };
            try {
                const payment = yield this.checkout.createPayment(createPayload, idempotenceKey);
                console.log("payment11", payment);
            }
            catch (error) {
                console.error("error22", error);
            }
        });
    }
}
exports.Payment = Payment;
