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
exports.SshClient = void 0;
const ssh2_1 = require("ssh2");
// const sshConfig: ConnectConfig = {
//   host: 'your.server.com',
//   port: 22,
//   username: 'yourUsername',
//   // Используйте либо password, либо privateKey
//   // password: 'yourPassword',
//   privateKey: readFileSync('/home/user/.ssh/id_rsa'),
// };
class SshClient {
    constructor(sshConfig) {
        this.currentPath = ''; // Текущий рабочий каталог
        this.conn = new ssh2_1.Client();
        this.conn.connect(sshConfig);
        this.conn.on('ready', () => __awaiter(this, void 0, void 0, function* () {
            console.log('✅ SSH-подключение установлено');
            yield this.updateCurrentPath(); // Получаем текущий путь при подключении
            console.log(`📂 Текущий путь: ${this.currentPath}`);
        }));
        this.conn.on('error', (err) => {
            console.error('❌ Ошибка SSH-соединения:', err);
        });
    }
    // Обновляет текущий путь (вызывается после cd, mkdir и т.д.)
    updateCurrentPath() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.conn.exec('pwd', (err, stream) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    let output = '';
                    stream
                        .on('data', (data) => {
                        output += data.toString();
                    })
                        .on('close', () => {
                        this.currentPath = output.trim(); // Удаляем лишние пробелы и переносы
                        resolve();
                    })
                        .stderr.on('data', (data) => {
                        reject(new Error(data.toString()));
                    });
                });
            });
        });
    }
    execCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.conn.exec(command, (err, stream) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    let output = '';
                    stream
                        .on('data', (data) => {
                        output += data.toString();
                    })
                        .on('close', () => __awaiter(this, void 0, void 0, function* () {
                        if (command.startsWith('cd ')) {
                            yield this.updateCurrentPath(); // Обновляем путь после cd
                            console.log(`🔄 Новый путь: ${this.currentPath}`);
                        }
                        resolve(output.trim());
                    }))
                        .stderr.on('data', (data) => {
                        reject(new Error(data.toString()));
                    });
                });
            });
        });
    }
}
exports.SshClient = SshClient;
