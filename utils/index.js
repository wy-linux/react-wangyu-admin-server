const jwt = require('jsonwebtoken')
const {SECRET} = require('./secret')

const _toTwoDigits = num => num > 9 ? `${num}` : `0${num}`;
function today() {
    const date = new Date();
    const array = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    return array.map(i => _toTwoDigits(i)).join('-');
}
function time() {
    const date = new Date();
    const array = [date.getHours(), date.getMinutes(), date.getSeconds()];
    return array.map(i => _toTwoDigits(i)).join(':');   
}
function todayTime() {
    return `${today()} ${time()}`
}
function menuListToTree(list) {
    if(!list.length) return 
    const children = []
    const treeNode = list.shift()
    for (let i = 0; i < list.length; i++) {
        if(treeNode._id.toString() === list[i].pid) {
            children.push(list[i])
        }
    }
    menuListToTree(list)
    treeNode.children = children
    return treeNode
}
function listToRecords(list) {
    const total = list.length
    const records = list
    return {
        records,
        total
    }
}
const auth = async (req, res, next) => {
    if(!req.headers.authorization ) {
        req.user = null
        return res.send('暂无权限')
    }
    const raw = String(req.headers.authorization)
    const tokenData = jwt.verify(raw, SECRET)
    // const user = await User.findById(tokenData.id)
    //定义成req.user以便与后面的中间件可以访问
    req.userId = tokenData.id
    next()
}
module.exports = {today, time, todayTime, menuListToTree, listToRecords, auth}