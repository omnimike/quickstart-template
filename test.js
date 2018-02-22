
const parser = require('./src/grammar');
const php = require('./src/php');
const python = require('./src/python');
const javascript = require('./src/javascript');

const test = `
/* Author API configuration parameters. */
/* Author API  parameters. */
one = 1
one_point_two = 1.2

true_var = true
false_var = false
null_var = null
str_var = " this is a string"
str_var = " this is a \\nstring"
obj = {}
obj = {"one": "two"}
obj = {
    "one": "two",
    "three": "four"
}
arr = [
    {
        "more stuff": "has val"
    },
    [],
    [
        ["asdf"]
    ]
]
`;

const goal = `
/* Author API configuration parameters. */
request = {
    /* Display the item list view on load. */
    "mode": "item_list",
    "title.show": true,
    "user": {
        /* Unique author id */
        "id": "author123456"
    }
}

/*
    Public & private security keys required to access Learnosity APIs and
    data. These keys grant access to Learnosity's public demos account.
    Learnosity will provide keys for your own private account.
*/
consumer_key = "my_consumer_key"
consumer_secret = "my_consumer_secret"

/* Parameters used to create security authorization. */
security = {
    "domain": "localhost",
    "consumer_key": consumer_key
}

/*
    Use Learnosity SDK to construct Author API configuration parameters,
    and sign them securely with the $security and $consumerSecret parameters.

*/
sdk_init(
    init,
    signed_request, 
    "author",
    security,
    consumer_secret,
    request
)
`;

const parsed = parser.parse(goal);
console.log(JSON.stringify(parsed, null, 4));
console.log('\n\n Javascript\n');
console.log(javascript.format(parsed));
console.log('\n\n PHP\n');
console.log(php.format(parsed));
console.log('\n\n Python\n');
console.log(python.format(parsed));
