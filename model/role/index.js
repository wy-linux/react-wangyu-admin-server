const mongoose = require('mongoose')
const {todayTime} = require('../../utils')
const RoleSchema = mongoose.Schema({
    roleName: {type: String, default: ''},
    createTime: {type: String, default: todayTime},
    updateTime: {type: String, default: todayTime},
    // select: {type: Boolean, default: true},
    menuSelect: {type: [String], default: []}
})
module.exports = RoleSchema