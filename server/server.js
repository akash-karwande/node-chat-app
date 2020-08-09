const express = require('express');
const path = require('path');



const publicPath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;
var app = express();
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.send('hey there');
});


app.listen(3000, () => {
    console.log(`started up at port ${port}`);
});