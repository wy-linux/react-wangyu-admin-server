const express = require("express")
const router = express.Router()
const {Menu, User, Role} = require('../../model')
const userRouter = require("./user")
const roleRouter = require("./role")
const menuRouter = require("./menu")

router.use("/permission", userRouter)
router.use("/permission", roleRouter)
router.use("/permission", menuRouter)

router.use("/permission/info", async(req, res) => {
    const routes = []
    const buttons = []
    try {
        const user = await User.findOne({_id: req.userId})
        let roleSelect = await Promise.all(user.roleSelect.map((role) => Role.findOne({_id: role})))
        roleSelect = roleSelect.map((role) => role.menuSelect).flat(Infinity)
        const menusSet = new Set(roleSelect)
        let menus = await Menu.find()
        for(let i = 0; i < menus.length; i++) {
            //按钮权限
            if(menus[i].level === 4 && menusSet.has(menus[i].id)) {
                buttons.push(menus[i].code)
            //路由权限
            }else if(menus[i].code !== '' && menusSet.has(menus[i].id)){
                routes.push(menus[i].code)
            }
        } 
    } catch (err) {
        //todo
    } finally {
        res.send({
            data: {
                routes,
                buttons,
                name: req.userId,
                avatar: 'wangyu-admin'
            },
            message: '获取成功'
        })
    }
})
module.exports = router
