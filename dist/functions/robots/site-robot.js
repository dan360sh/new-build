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
exports.SiteRobot = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class SiteRobot {
    constructor() {
        this.userDataDir = './user-data-dir';
        this.x = 184;
        this.y = 130;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("site");
            const browser = yield puppeteer_1.default.launch({
                defaultViewport: {
                    width: 1280,
                    height: 720,
                    deviceScaleFactor: 1, // масштаб (1 = 100%)
                    isMobile: false, // мобильный режим
                    hasTouch: false // сенсорный экран
                },
                userDataDir: this.userDataDir,
                headless: false
            });
            this.page = yield browser.newPage();
            return;
        });
    }
    move(x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            this.x = x;
            this.y = y;
            yield this.page.mouse.move(x, y);
            yield this.mauseRender(this.x, this.y);
        });
    }
    click(x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            this.x = x;
            this.y = y;
            yield this.page.mouse.click(x, y);
            yield this.mauseRender(this.x, this.y);
        });
    }
    goPage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto(url);
            yield this.mauseRender(this.x, this.y);
        });
    }
    scrin() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = 'C:/projects/widget-ts/img/screenshot.png';
            yield this.page.screenshot({ path: path });
            return path;
        });
    }
    mauseRender(x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.evaluate(({ x, y }) => {
                const id = '__mouse-indicator';
                let el = document.getElementById(id);
                if (!el) {
                    el = document.createElement('div');
                    el.id = id;
                    el.style.position = 'absolute';
                    el.style.width = '30px';
                    el.style.height = '30px';
                    el.style.borderRadius = '50%';
                    el.style.backgroundColor = 'rgba(255, 0, 0, 0.63)'; // жёлтый, полупрозрачный
                    el.style.pointerEvents = 'none';
                    el.style.border = 'solid 2px black';
                    el.style.zIndex = '999999';
                    document.body.appendChild(el);
                }
                el.style.left = `${x - 15}px`; // центр по X
                el.style.top = `${y - 15}px`; // центр по Y
            }, { x, y });
        });
    }
}
exports.SiteRobot = SiteRobot;
