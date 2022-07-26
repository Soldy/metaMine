const fs = require('fs');
const $meta = new (require('./index.js')).base();

const _monkey = fs.readFileSync('test/examples/monkey_meta.txt','UTF-8').toString('utf8');
const _delta = fs.readFileSync('test/examples/delta_meta.txt','UTF-8').toString('utf8');

const _monkey_object = $meta.read(_monkey)
const _delta_object = $meta.read(_delta);

console.log(_monkey_object);
console.log(_delta_object);
