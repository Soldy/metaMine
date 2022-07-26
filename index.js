
const _DeltaBase = function (){
    this.typeCheck = function(line){
        return _firstLineCheck(line);
    };
    this.dataMine = function(lines){
        return _dataMine(lines);
    };
    this.getRaw = function(lines){
        return _getRaw(lines);
    };
    const _firstLineCheck = (line)=>{
        line = line.replace(/^\s*/gm, '');
        if (line.slice(0,3) !== '/**')
            return false;
        const cleaned = line.replace('/**', '')
            .replace(/^\s*/gm, '');
        if(cleaned.slice(0,11).toLowerCase() === 'deltascript')
            return true;
        if(cleaned.slice(0,12).toLowerCase() === 'delta script')
            return true;
        return false;
    };
    const _lastLineCheck = (line)=>{
        line = line.replace(/^\s*/gm, '');
        if (line.slice(0,3) === '**/')
            return true;
        return false;
    };
    const _dataMine = function(lines){
        let out = {};
        for (let line of lines){
            if(line.slice(0, 1) !== '*')
                continue;
            let cleaned = line.replace('*', '')
                .replace(/^\s*/gm, '');
            if(cleaned.slice(0, 1) !== '@')
                continue;
            cleaned = cleaned.replace('@', '');
            let name = cleaned.slice(0, cleaned.indexOf(' '));
            let value = cleaned.replace(name, '')
                .replace(/^\s*/gm, '');
            if(typeof out[name] === 'undefined')
                out[name] = [];
            if(value === 'true')
                out[name].push(true);
            else 
                out[name].push(value);
        }
        return out;
    };
    const _getRaw = function(lines){
        let out = [];
        let started = false;
        for(let i of lines)
            if(started){
                out.push(i);
                if(_lastLineCheck(i))
                    return out;
            }else
            if(_firstLineCheck(i)){
                out.push(i);
                started = true;
            }
        throw Error('No meta tag found');
    };
};
const _MonkeyBase = function (){
    this.typeCheck = function(line){
        return _firstLineCheck(line);
    };
    this.getRaw = function(lines){
        return _getRaw(lines);
    };
    this.dataMine = function(lines){
        return _dataMine(lines);
    };
    const _firstLineCheck = (line)=>{
        line = line.replace(/^\s*/gm, '');
        if(
            (line.slice(0, 2) === '//')&&
             (line.toLowerCase().indexOf('==userscript==') > 1)
        )
            return true;
        return false;
    };
    const _lastLineCheck = (line)=>{
        line = line.replace(/^\s*/gm, '');
        if(
            (line.slice(0, 2) === '//')&&
             (line.toLowerCase().indexOf('==/userscript==') > 1)
        )
            return true;
        return false;
    };
    const _dataMine = function(lines){
        let out = {};
        for (let line of lines){
            if(line.slice(0, 2) !== '//')
                continue;
            let cleaned = line.replace('//', '')
                .replace(/^\s*/gm, '');
            if(cleaned.slice(0, 1) !== '@')
                continue;
            cleaned = cleaned.replace('@', '');
            let name = cleaned.slice(0, cleaned.indexOf(' '));
            let value = cleaned.replace(name, '')
                .replace(/^\s*/gm, '');
            if(typeof out[name] === 'undefined')
                out[name] = [];
            if(value === 'true')
                out[name].push(true);
            else 
                out[name].push(value);
        }
        return out;
    };
    const _getRaw = function(lines){
        let out = [];
        let started = false;
        for(let i of lines)
            if(started){
                out.push(i);
                if(_lastLineCheck(i))
                    return out;
            }else if(_firstLineCheck(i)){
                out.push(i);
                started = true;
            }
        throw Error('No meta tag found');
    };
};

const _MetaMineBase = function(){
    this.read = function(input_){
        return _read(input_);
    };
    const _types = [
        'delta',
        'monkey'
    ];
    const _agents = {
        delta: new _DeltaBase(),
        monkey: new _MonkeyBase(),
    };

    const _read = function(input_){
        const lines = input_.split(/\r?\n/);
        const type = _types[
            _typeCheck(lines)
        ];
        const raw = _agents[type].getRaw(lines);
        return _agents[type].dataMine(raw);

    };
    const _typeCheck = function(lines){
        for(let i of lines){
            if(_agents.monkey.typeCheck(i))
                return 1;
            else if(_agents.delta.typeCheck(i) === true)
                return 0;
        }
        throw Error('Unknown meta type');
    };

};



exports.base = _MetaMineBase;
