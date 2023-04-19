const nanoTest   = new (require('nanoTest')).test({
    'progress_bar':false,
    'debug_print':'short'
});
const fs = require('fs');
const $meta = new (require('./index.js')).base();



const _monkey_sample = {
    name: [ 'tadada' ],
    version: [ '0.2.66' ],
    description: [ 'kavabunga' ],                                
    author: [ 'Wanghsinche ' ],
    include: [ 'http://www.test.com.us/*', 'http://test.com' ],
    require: [ 'http://meme.com/andera.js' ],
    grant: [ 'GM_xmlhttpRequest' ],
    'run-at': [ 'document-body' ]
};

const _delta_sample = {
    testa: [ 'ok that have to be' ],
    'json:first': [ 'just test' ]
};


const readFile = function (file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function (error, data) {
            if (error) return reject(error);
            resolve(data);
        });
    });
};

(async function(){
    const _monkey = (await readFile('test/examples/monkey_meta.txt')).toString('utf8');
    const _delta = (await readFile('test/examples/delta_meta.txt')).toString('utf8');
    nanoTest.add(
        'monkey runtest',
        {
            'function':$meta.read,
            'options':[_monkey]
        },
       'j==',
        _monkey_sample
    );

    nanoTest.add(
        'delta runtest',
        {
            'function':$meta.read,
            'options':[_delta]
        },
        'j==',
        _delta_sample
    );



    nanoTest.run();


})();


