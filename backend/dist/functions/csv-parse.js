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
exports.csvParse = csvParse;
const fs_1 = __importDefault(require("fs"));
//146132188855-3h1mtqscj5ert04d3rk72abv13fvbknv.apps.googleusercontent.com
function csvParse() {
    // console.log("csv start")
    // csv()
    // .fromFile("input.csv")
    // .then((jsonObj)=>{
    //     console.log(jsonObj[0]);
    //     /**
    //      * [
    //      * 	{a:"1", b:"2", c:"3"},
    //      * 	{a:"4", b:"5". c:"6"}
    //      * ]
    //      */ 
    // })
    let i = 1;
    const fileStream = fs_1.default.createReadStream("input.csv");
    let header = null;
    fileStream.on("data", (e) => __awaiter(this, void 0, void 0, function* () {
        const lines = (e + "").split('\n');
        if (!header) {
            header = lines[0].split(";");
            console.log(header);
        }
        else {
            for (let i = 1; i < lines.length - 1; i++) {
                lines[i].split(";");
            }
        }
        console.log(lines.length, "eeee");
    }));
    // fs.readFile("input.csv", function(error,data){
    //     if(error) {  // если возникла ошибка
    //         return console.log(error);
    //     }
    //     console.log(data.toString(), "xxxx" + i);   // выводим считанные данные
    //     i++;
    // });
}
