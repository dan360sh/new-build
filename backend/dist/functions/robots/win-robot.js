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
exports.WinRobot = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
const screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
const promises_1 = __importDefault(require("fs/promises"));
class WinRobot {
    constructor() {
        // Получаем размеры экрана
        this.screenSize = robotjs_1.default.getScreenSize();
    }
    // Клик мышью
    click(button = 'left', double = false) {
        robotjs_1.default.mouseClick(button, double);
        console.log(`Совершен ${double ? 'двойной ' : ''}клик ${button} кнопкой мыши`);
    }
    move(x, y) {
        // Проверяем, чтобы координаты не выходили за пределы экрана
        x = Math.max(0, Math.min(x, this.screenSize.width));
        y = Math.max(0, Math.min(y, this.screenSize.height));
        robotjs_1.default.moveMouse(x, y);
        console.log(`Мышь перемещена в (${x}, ${y})`);
    }
    scrin() {
        return __awaiter(this, arguments, void 0, function* (savePath = 'C:/projects/widget-ts/img/screenshot.png') {
            const imgBuffer = yield (0, screenshot_desktop_1.default)({ format: 'png' });
            yield promises_1.default.writeFile(savePath, imgBuffer);
            console.log(`Скриншот сохранен в ${savePath}`);
            return savePath;
        });
    }
}
exports.WinRobot = WinRobot;
