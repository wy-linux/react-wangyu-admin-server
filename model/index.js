const mongoose = require('mongoose')
const UserSchema = require('./user/index')
const RoleSchema = require('./role/index')
const MenuSchema = require('./menu/index')

mongoose.connect('mongodb://root:root@localhost:27017/react_admin', {
    useNewUrlParser:true,
})

const User = mongoose.model('User', UserSchema)
const Role = mongoose.model('Role', RoleSchema)
const Menu = mongoose.model('Menu', MenuSchema)

module.exports = {User, Role, Menu}