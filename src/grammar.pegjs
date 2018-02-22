
LrnCodeSample "code sample"
    = _ statements:(__ Statement __ '\n')* _
    {
        return statements.map(line => {
            return line[1];
        });
    }

Statement "statement"
    = Assignment
    / Macro
    / Comment
    / Spacer

Spacer
    = ''
    { return {type: 'spacer'} }

Comment "comment"
    = '/*' text:([\x20-\x29\x2B-\x7E\n\r\t] / '*' !'/')* '*/'
    {
        return {
            type: 'comment',
            text: text.join('').trim()
        };
    }


Assignment "assignment"
    = comment:(comment:Comment _ {return comment})?
        id:Identifier _ '=' _ expr:Expression
    {
        return {
            type: 'assignment',
            variable: id.name,
            expr: expr,
            comment: comment
        };
    }

Identifier "identifier"
    = lead:[A-Za-z_] trailing:[A-Za-z0-9_]*
    {
        return {
            type: 'identifier',
            name: lead + trailing.join('')
        };
    }

Expression "expression"
    = Null
    / Boolean
    / Number
    / String
    / Object
    / Array
    / Macro
    / Identifier

Null "null"
    = 'null'
    { return { type: 'null'}; }

Boolean "boolean"
    = 'true' 
    { return { type: 'boolean', value: true }; }
    / 'false'
    { return { type: 'boolean', value: false }; }

Number "number"
    = '-'? ('0' / [1-9] [0-9]*) ('.' [0-9]+) ?
    {
        return {
            type: 'number',
            value: parseFloat(text())
        };
    }

String "string"
    = '"' val:(UnescapedChar / EscapeChar val:EscapedChar {return val})*  '"'
    {
        return {
            type: 'string',
            value: val.join('')
        };
    }

EscapeChar = '\\'

UnescapedChar = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]

EscapedChar
    = '"'
    / '\\'
    / '/'
    / 'b' { return '\b'; }
    / 'f' { return '\f'; }
    / 'n' { return '\n'; }
    / 'r' { return '\r'; }
    / 't' { return '\t'; }
    / 'u' digits:$(HexDigit HexDigit HexDigit HexDigit)
    { return String.fromCharCode(parseInt(digits, 16)); };

HexDigit = [0-9A-Fa-f]

Object "object"
    = '{'
        pairs:(
            first:Pair rest:(',' pair:Pair {return pair})*
            {return [first].concat(rest)}
        )?
    '}'
    {
        return {
            type: 'object',
            pairs: pairs || []
        };
    }

Pair "pair"
    = _ comment:Comment? _ key:String _ ':' _ value:Expression _
    {
        return {
            key: key.value,
            value: value,
            comment: comment
        };
    }

Array "array"
    = '['
        elems:(
            first:ArrayElem
            rest:(_ ',' _ elem:ArrayElem {return elem})*
            {return [first].concat(rest)}
        )?
        ']'
    {
        return {
            type: 'array',
            elements: elems || []
        };
    }

ArrayElem "array element"
    = _ comment:Comment? _ expr:Expression _
    {
        return {
            expr: expr,
            comment: comment
        };
    }


Macro "macro"
    = name:Identifier _ 
        '(' _
        args:(
            first:Expression
            rest:(_ ',' _ arg:Expression {return arg})* _
            {return [first].concat(rest)}

        )? _
        ')'
    {
        return {
            type: 'macro',
            name: name.name,
            args: args
        };
    }

_ "whitespace or newline"
    = [ \t\r\n]*

__ "whitespace"
    = [ \t]*
