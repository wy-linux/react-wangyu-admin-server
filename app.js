const express = require('express')
const bodyParser = require('body-parser');
const router = require("./router")
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", false);
    //预请求每隔1小时发一次
    res.setHeader('Access-Control-Max-Age', 3600);
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization, Accept,X-Requested-With, token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,HEAD");
    req.method === 'OPTIONS' ? res.send('CURRENT SERVICES SUPPORT CROSS DOMAIN REQUESTS!') : next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//路由处理
app.use(router)

app.use(express.static(__dirname));
// app.listen(7000, () => {
//     console.log('http://localhost:7000');
// })
module.exports = app