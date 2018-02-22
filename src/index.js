
const php = require('./php');
const javascript = require('./javascript');
const python = require('./python');
const parser = require('./grammar');

module.exports = {
    php: (code) => php.format(parser.parse(code)),
    python: (code) => python.format(parser.parse(code)),
    javascript: (code) => javascript.format(parser.parse(code)),
};
