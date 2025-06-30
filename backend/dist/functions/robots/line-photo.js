"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ImageRuler = void 0;
const canvas_1 = require("canvas");
const fs = __importStar(require("fs"));
class ImageRuler {
    constructor() {
        this.options = {
            rulerWidth: 30,
            backgroundColor: '#f0f0f0',
            textColor: '#333333',
            lineColor: '#666666',
            fontSize: 10,
            majorTickInterval: 50,
            minorTickInterval: 10,
        };
    }
    /**
     * Добавляет линейки к изображению
     * @param inputPath - путь к входному изображению
     * @param outputPath - путь для сохранения результата
     */
    addRulersToImage(inputPath, outputPath, x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Загружаем изображение
                const image = yield (0, canvas_1.loadImage)(inputPath);
                const originalWidth = image.width;
                const originalHeight = image.height;
                // Создаем новый canvas с учетом размера линеек
                const newWidth = originalWidth + this.options.rulerWidth;
                const newHeight = originalHeight + this.options.rulerWidth;
                const canvas = (0, canvas_1.createCanvas)(newWidth, newHeight);
                const ctx = canvas.getContext('2d');
                // Заливаем фон
                ctx.fillStyle = this.options.backgroundColor;
                ctx.fillRect(0, 0, newWidth, newHeight);
                // Рисуем горизонтальную линейку (сверху)
                this.drawHorizontalRuler(ctx, this.options.rulerWidth, 0, originalWidth);
                // Рисуем вертикальную линейку (слева)
                this.drawVerticalRuler(ctx, 0, this.options.rulerWidth, originalHeight);
                // Размещаем оригинальное изображение
                ctx.drawImage(image, this.options.rulerWidth, this.options.rulerWidth);
                yield this.drawCursor(ctx, { x: x + this.options.rulerWidth, y: y + this.options.rulerWidth });
                // Сохраняем результат
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync(outputPath, buffer);
                console.log('загружено:', outputPath);
                console.log(`Изображение с линейками сохранено: ${outputPath}`);
                console.log(`Размер оригинала: ${originalWidth}x${originalHeight}`);
                console.log(`Размер с линейками: ${newWidth}x${newHeight}`);
            }
            catch (error) {
                console.error('Ошибка при обработке изображения:', error);
                throw error;
            }
        });
    }
    /**
   * Рисует курсор на изображении
   */
    drawCursor(ctx, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cursorImg = yield (0, canvas_1.loadImage)("C:/projects/widget-ts/img/cursor.png");
                //   // Рассчитываем координаты с учетом линейки
                //   const x = options.x + this.options.rulerWidth;
                //   const y = options.y + this.options.rulerWidth;
                // Размеры курсора после масштабирования
                const width = cursorImg.width * 0.1;
                const height = cursorImg.height * 0.1;
                // Рисуем курсор с учетом смещения
                ctx.drawImage(cursorImg, options.x, options.y, width, height);
                console.log(`Курсор добавлен в координаты: ${options.x}, ${options.y}`);
            }
            catch (error) {
                console.error('Ошибка при загрузке изображения курсора:', error);
                throw error;
            }
        });
    }
    /**
     * Рисует горизонтальную линейку
     */
    drawHorizontalRuler(ctx, x, y, width) {
        const rulerHeight = this.options.rulerWidth;
        // Фон линейки
        ctx.fillStyle = this.options.backgroundColor;
        ctx.fillRect(x, y, width, rulerHeight);
        // Настройки для текста и линий
        ctx.strokeStyle = this.options.lineColor;
        ctx.fillStyle = this.options.textColor;
        ctx.font = `${this.options.fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;
        // Рисуем деления и цифры
        for (let i = 0; i <= width; i += this.options.minorTickInterval) {
            const tickX = x + i;
            const isMajorTick = i % this.options.majorTickInterval === 0;
            // Длина деления
            const tickHeight = isMajorTick ? rulerHeight * 0.6 : rulerHeight * 0.3;
            // Рисуем деление
            ctx.beginPath();
            ctx.moveTo(tickX, y + rulerHeight);
            ctx.lineTo(tickX, y + rulerHeight - tickHeight);
            ctx.stroke();
            // Добавляем цифры для больших делений
            if (isMajorTick && i > 0) {
                ctx.fillText(i.toString(), tickX, y + rulerHeight * 0.25);
            }
        }
        // Рамка линейки
        ctx.strokeRect(x, y, width, rulerHeight);
    }
    /**
     * Рисует вертикальную линейку
     */
    drawVerticalRuler(ctx, x, y, height) {
        const rulerWidth = this.options.rulerWidth;
        // Фон линейки
        ctx.fillStyle = this.options.backgroundColor;
        ctx.fillRect(x, y, rulerWidth, height);
        // Настройки для текста и линий
        ctx.strokeStyle = this.options.lineColor;
        ctx.fillStyle = this.options.textColor;
        ctx.font = `${this.options.fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;
        // Рисуем деления и цифры
        for (let i = 0; i <= height; i += this.options.minorTickInterval) {
            const tickY = y + i;
            const isMajorTick = i % this.options.majorTickInterval === 0;
            // Длина деления
            const tickWidth = isMajorTick ? rulerWidth * 0.6 : rulerWidth * 0.3;
            // Рисуем деление
            ctx.beginPath();
            ctx.moveTo(x + rulerWidth, tickY);
            ctx.lineTo(x + rulerWidth - tickWidth, tickY);
            ctx.stroke();
            // Добавляем цифры для больших делений
            if (isMajorTick && i > 0) {
                // Поворачиваем текст для вертикальной линейки
                ctx.save();
                ctx.translate(x + rulerWidth * 0.25, tickY);
                ctx.rotate(-Math.PI / 2);
                ctx.fillText(i.toString(), 0, 0);
                ctx.restore();
            }
        }
        // Рамка линейки
        ctx.strokeRect(x, y, rulerWidth, height);
    }
}
exports.ImageRuler = ImageRuler;
