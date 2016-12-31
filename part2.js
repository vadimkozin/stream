"use strict";
const fs        = require("fs");
let crypto      = require("crypto");
const Transform = require("stream").Transform;

const input = fs.createReadStream("input.txt");
const output = fs.createWriteStream("output.txt");

class CCrypto extends Transform {
    constructor(hash, digest, options = {}) {
        //options.objectMode = true;
        super(options);
        this.hash = hash;
        this.digest = digest;

        if  (["latin1", "hex", "base64"].indexOf(digest) == -1) {
            this.digest = "hex";
        }
    }

    _transform(chunk, encoding, callback) {
        this.hash.update(chunk);
        callback();
    }

    _flush(callback) {
        this.push(this.hash.digest(this.digest));
        callback();
    }
}

input.on("error", (err) => {
    if (err.code == "ENOENT") {
        console.log(`Файл не найден: ${err.path}`);
    } else {
        console.error(err);
    }
});

output.on("error", (err) => {  
    console.error(`Ошибка записи в файл: ${err.message}`);
});


const md5 = crypto.createHash("md5");
let p = input.pipe(new CCrypto(md5, "hex"));
p.pipe(output);
p.pipe(process.stdout);
p.on("finish", () => console.log("\n."));



