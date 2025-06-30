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
const fs_1 = __importDefault(require("fs"));
function filesIs(pathName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathArray2 = [];
        if (!fs_1.default.existsSync(pathName)) {
            LOLpathName(pathName.split("/"));
            console.log("eee");
        }
        else {
            fs_1.default.writeFileSync(pathName, data);
            return;
        }
        function LOLpathName(pathArray) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!fs_1.default.existsSync(pathArray.join("/"))) {
                    console.log("pathArray", pathArray);
                    let s = pathArray.pop();
                    if (s) {
                        pathArray2.push(s);
                    }
                    yield LOLpathName(pathArray);
                }
                else {
                    if (pathArray2.length !== 1) {
                        console.log(pathArray2, 'pathArray2');
                        let s = pathArray2.pop();
                        if (s) {
                            pathArray.push(s);
                        }
                        fs_1.default.mkdirSync(pathArray.join("/"));
                        yield LOLpathName(pathArray);
                    }
                    else {
                        fs_1.default.writeFileSync(pathName, data);
                        return;
                    }
                }
                return;
            });
        }
    });
}
// (async () => { 
//     await filesIs ("/mcp2/data/user/xxx/index.json");
// })();
//fs.writeFileSync("/mcp2/data/user/index.json", "{div:'sdsdsds2'}")
//fs.mkdirSync("/mcp2/data/index.json");
filesIs("/mcp2/data/45654645/user/lol/index.json", "{div:'sdsdsds2'}");
