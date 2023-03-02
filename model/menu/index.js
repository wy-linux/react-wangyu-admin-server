const mongoose = require('mongoose')
const {todayTime} = require('../../utils')
const MenuSchema = mongoose.Schema({
    // id: {type: Number},
    pid: {type: String, default: ''},
    name: {type: String, default: ''},
    code: {type: String, default: ''},
    toCode: {type: String, default: ''},
    createTime: {type: String, default: todayTime},
    updateTime: {type: String, default: todayTime},
    select: {type: Boolean, default: false},
    level: {type: Number, default: 1},
    type: {type: Number, default: 1}
    // children: {type: [], default: []}
})
module.exports = MenuSchema