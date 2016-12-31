"use strict";
const fs          = require("fs");
const Readable    = require("stream").Readable;
const Writable    = require("stream").Writable;
const Transform   = require("stream").Transform;

/**
 * Генератор случайных чисел
 * @param {Number} min минимальное число (по умолчанию 1)
 * @param {Number} max максимальное число (по умолчанию 100)
 * @param {Number} countMax максимальное кол-во генерируемых чисел (-1 без ограничения)
 */
class CGeneratorRandomNumber extends Readable {
    constructor(min = 1, max = 100, countMax = -1, options = {}) {
        options.objectMode = true;
        super(options);
        this.min = min;
        this.max = max;
        this.count = 0;
        this.countMax = countMax; 
    }

    _read() {
        this.push(this._random(this.min, this.max).toString()) ;
        this.count += 1;
        if (this.countMax > -1 && this.count >= this.countMax) {
            this.push(null);
        }
    }

    _random(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
}

/**
 *  Вывод данных в консоль
 */
class CWrite extends Writable {
    constructor(options) {
        super(options);
    }

    _write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    }
}

/**
 * Добавление суффикса к данным с задержкой в 1 сек
 * @param {String} add добавляемая строка 
 */
class CAddSuffix extends Transform {
    constructor(add, options={}) {
        super(options);
        this.add = add;
    }

    _transform(chunk, encoding, callback) {
        setTimeout(callback, 1000 * 1, null, chunk + this.add);
    }
}

function handleError (err) {
    console.log(err.message);
}

(new CGeneratorRandomNumber(1, 100))
    .on("error", (e) => handleError(e))
    .pipe(new CAddSuffix("."))
    .on("error", (e) => handleError(e))
    .pipe(new CWrite())
    .on("error", (e) => handleError(e));
