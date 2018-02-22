
function format(statements) {
    let out = '';
    for (let i = 0; i < statements.length; i++) {
        var stmnt = statements[i];
        switch (stmnt.type) {
        case 'assignment':
            out += assignment(stmnt);
            break;
        case 'macro':
            out += macro(stmnt);
            break;
        case 'comment':
            out += comment(stmnt);
            break;
        case 'spacer':
            out += '\n';
            break;
        }
    }
    return out;
}

function assignment(stmnt) {
    return comment(stmnt.comment) + stmnt.variable +
        ' = ' + expression(stmnt.expr) + '\n';
}

function expression(expr) {
    switch (expr.type) {
    case 'null':
        return 'null';
    case 'boolean':
        return expr.value ? 'True' : 'False';
    case 'number':
        return expr.value + '';
    case 'string':
        return JSON.stringify(expr.value);
    case 'object':
        return object(expr.pairs);
    case 'array':
        return array(expr.elements);
    case 'macro':
        return macro(expr);
    case 'identifier':
        return expr.name;
    default:
        return '';
    }
}

function object(pairs) {
    if (pairs.length === 0) {
        return '{}';
    }
    let out = '{\n';
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        let pairStr = JSON.stringify(pair.key); 
        pairStr += ': '
        pairStr += expression(pair.value)
        pairStr += ',';
        out += indent(pairStr) + '\n';
    }
    out += '}';
    return out;
}

function array(elems) {
    if (elems.length === 0) {
        return '[]';
    }
    let out = '[\n';
    for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];
        out += indent(expression(elem.expr) + ',') + '\n';
    }
    out += ']';
    return out;
}

function macro(def) {
    switch (def.name) {
    case 'sdk_init':
        return sdkInit(def.args);
    default:
        return '';
    }
}

function sdkInit(args) {
    const sdkName = camelCase(args[0].name);
    const initOptsName = camelCase(args[1].name);
    const remainingArgs = args.slice(2);

    let out = sdkName + ' = learnosity_sdk.request.Init(\n';
    let argsStr = '';
    if (remainingArgs[0]) {
        argsStr += expression(remainingArgs[0]);
    }
    for (let i = 1; i < remainingArgs.length; i++) {
        argsStr += ',\n' + expression(remainingArgs[i]);
    }
    out += indent(argsStr);
    out += '\n)\n';
    out += initOptsName + ' = ' + sdkName + '.generate()';
    return out;
}

function comment(data) {
    if (data) {
        return '# ' +
            data.text.replace(/\n\s*/g, '\n# ') +
            '\n';
    } else {
        return '';
    }
}

function indent(str) {
    return '    ' + str.replace(/\n/g, '\n    ');
}

function camelCase(str) {
    const split = str.split('_');
    let out = '';
    if (split[0]) {
        out += split[0];
    }
    for (let i = 1; i < split.length; i++) {
        const word = split[i];
        out += word.charAt(0).toUpperCase() + word.slice(1);
    }
    return out;
}

exports.format = format;
