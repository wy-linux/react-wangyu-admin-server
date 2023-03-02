const mongoose = require('mongoose')
const {todayTime} = require('../../utils')
const UserSchema = mongoose.Schema({
    email: {type: String, unique: true},
        //MD5加密不安全, 使用bcrypt
    password: {type: String, set(val) {
        return require('bcrypt').hashSync(val, 10)
    }},
    name: {type: String, default: ''},
    // roleList: {type: [String], default: []},
    createTime: {type: String, default: todayTime},
    updateTime: {type: String, default: todayTime},
    roleSelect: {type: [String], default: []}
})
module.exports = UserSchema