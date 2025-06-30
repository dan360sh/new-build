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
exports.queryGemma = queryGemma;
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const win_robot_1 = require("./win-robot");
const line_photo_1 = require("./line-photo");
//const path = require('path');
function queryGemma() {
    return __awaiter(this, void 0, void 0, function* () {
        const ruler = new line_photo_1.ImageRuler();
        //new SiteRobot();
        const siteRobot = new win_robot_1.WinRobot();
        // await siteRobot.init();
        let myURL = 'https://vk.com/feed';
        const url = 'http://localhost:11434/api/generate';
        // await siteRobot.goPage(myURL);
        let x = 184;
        let y = 130;
        yield siteRobot.move(x, y);
        let base64Image;
        const promtx = "на что наведен полупрозрачный красный круг с черной обводкой на фото, и можешь сказать его координаты в пикселях?";
        const prompt2 = `
    Предоставлен скриншот интерфейса. 
    Найди кнопку "Настройки" и верни координаты клика в формате JSON:
    {"x": число, "y": число} 
    Строго следуй формату.
    `;
        let promptxx = `Ты агент который ходит по сайтам и выполняет действия, которые приказал пользователь.
    у тебя есть интерфейс взаимодействия с браузером. Ты должен отвечать согласно этому формату JSON:
    {type: 'тип действия', action: 'действие'} type может быть 'gotourl' и click, 'gotourl' - это переход по ссылке, при нем action может быть только ссылка на сайт,
    например: {type: 'gotourl', action: 'https://ollama.com/search?c=vision'}. type 'click' - это нажатие в нужном тебе месте страницы, формат {x: координата, y: координата}
    например: {type: 'click', action: {x: 10, y: 24}} . type 'move' - это наведение мыши, например: {type: 'move', action: {x: 10, y: 24}} .
    Строго следуй формату, генерируй только одно действие и заканчивай.
    Полупрозрачный красный круг с черной обводкой на фото это там где находится курсор.
    Координаты курсора: {x: ${x}, y: ${y}} .
    URL где ты сейчас находишься: ${myURL} .
    Страницу сайта которая сейчас отображается перед тобой ты можешь видеть в фото.
    Приказ пользователя который ты должен выполнить конечным действием: 'Включи мне музыку на моей странице вконтакте'
    `;
        const stek = [];
        //       например: 'На изображении есть иконка браузера, возможно она мне будет полезна, ее координаты примерно [200, 700], попробую навести на нее курсор'
        start();
        function start() {
            return __awaiter(this, void 0, void 0, function* () {
                const imagePath = yield siteRobot.scrin();
                try {
                    yield ruler.addRulersToImage(imagePath, 'C:/projects/widget-ts/img/screenshot2.png', x, y);
                    const data = yield promises_1.default.readFile('C:/projects/widget-ts/img/screenshot2.png');
                    base64Image = data.toString('base64');
                }
                catch (err) {
                    console.error("Ошибка файла:", err);
                }
                let stekString = "";
                //let x = 1;
                for (let i of stek) {
                    stekString += `${x}. ${JSON.stringify(i)} `;
                    x++;
                }
                console.log(stekString, "stekString");
                let prompt = `Ты агент который может тыкать кнопки на компьютере и выполняет действия, которые приказал пользователь.
    у тебя есть интерфейс взаимодействия с операционной системой. Ты должен отвечать согласно этому формату JSON:
    {type: 'тип действия', action: 'действие', comment: 'перемещаю курсор в сторону браузера'} comment - твой коментарий к твоему действию, чтобы тебе было легче понимать, что ты делаешь. type может быть 'move' и click, 
    type 'click' - это нажатие в нужном тебе месте страницы, формат 'left' или 'right' в зависимости какой кнопкой мыши должно быть выполнено нажатие.
    например: {type: 'click', action: 'left', comment: 'жму на иконку браузера'} . type 'move' - это наведение мыши, например: {type: 'move', action: {x: 10, y: 24}, comment: 'двигаю правее, пытаюсь определить координаты иконки'} .
    Строго следуй формату, генерируй только одно действие и заканчивай.
    Но перед выводом формата ты можешь порассуждать чисто для себя, что тебе делать, порассуждай какие элементы ты видишь, какие могут быть полезны, подумай как на них нажать.
    Координаты курсора: {x: ${x}, y: ${y}} .
    Сверху на фото находится линейка с координатами x, слева сбоку линейка с координатами y, орентируйся на линейки и координаты курсора для определения координат.
    URL где ты сейчас находишься: ${myURL} .
    Экран который сейчас отображается перед тобой ты можешь видеть в фото.
    После выполнения действия, программа вернется и отобразит предыдущеи действия в стеке действий, можешь анализировать их для большего понимания (последний номер это твое последнее действие).
    Стек действий: ${stekString} .
    Приказ пользователя который ты должен выполнить конечным действием: 'Включи мне музыку на моей странице вконтакте в браузере chrome'
    `;
                const data = {
                    model: 'gemma3:12b',
                    prompt: prompt,
                    images: [base64Image],
                    stream: false
                };
                try {
                    console.log("начало запроса к llama");
                    const response = yield axios_1.default.post(url, data);
                    console.log(response.data);
                    let raw = response.data.response.trim();
                    console.log("конец запроса к llama");
                    if (raw.startsWith('```json')) {
                        raw = raw.replace(/```json\s*/g, '').replace(/```/g, '').trim();
                    }
                    const coords = JSON.parse(raw);
                    stek.push(coords);
                    console.log(coords);
                    if (coords.type === "move") {
                        x = coords.action.x;
                        y = coords.action.y;
                        yield siteRobot.move(x, y);
                    }
                    else if (coords.type === "click") {
                        yield siteRobot.click(coords.action);
                    }
                    // else if (coords.type === "gotourl") {
                    //     myURL = coords.action;
                    //     await siteRobot.goPage(myURL);
                    // }
                    start();
                    // return response.data.response;
                }
                catch (error) {
                    console.error('Ошибка при обращении к Ollama:', error);
                    throw error;
                }
            });
        }
    });
}
// Пример чата :
//   const url = 'http://localhost:11434/api/chat';
//   const data = {
//     model: 'gemma3:12b',
//     messages: [
//         {
//             role: "system",
//             content: "Если пользовотель просит сгенерировать фото то ответь в формате json: {text:'text', images: ['текст фото в формате base64']}"
//         },
//         {
//             role: "user",
//             content: prompt,
//             images: null
//         }
//     ],
//     stream: false
//   };
