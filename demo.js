
const express = require('express');
const app = express();

app.use(express.static('demo'));
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.listen(3000, () => console.log('listening on port 3000'));
