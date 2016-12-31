"use strict";
const fs   = require("fs");
let crypto = require("crypto");

const input = fs.createReadStream("input.txt");
const output = fs.createWriteStream("output.bin");

input.on("error", (err) => {
    if (err.code == "ENOENT") {
        console.log(`Файл не найден: ${err.path}`);
    } else {
        console.error(err);
    }
});

output.on('error', (err) => {  
    console.error(`Ошибка записи в файл: ${err.message}`);
});

let p = input.pipe(crypto.createHash("md5"));
p.pipe(output);
p.pipe(process.stdout)
p.on("finish", () => console.log("\n."));
