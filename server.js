const app = require('./app')
const https = require('https')
const fs = require('fs')
const path = require('path')
const key  = fs.readFileSync(path.resolve(__dirname, 'ssl/wangyu.cloud.key'), 'utf8');
const cert = fs.readFileSync(path.resolve(__dirname, 'ssl/wangyu.cloud_bundle.crt'), 'utf8')
const options = {
    key,
    cert 
}
const port = 7000
const server = https.createServer(options, app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function onError(error) {
    console.log(error);
}

function onListening(error) {
    console.log('Listening on', port);
}
