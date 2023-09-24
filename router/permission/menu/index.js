const express = require("express")
const router = express.Router()
const {Menu} = require('../../../model/index')
const {todayTime, menuListToTree} = require('../../../utils')

router.get('/menu/info', async(req, res) => {
    let menu = await Menu.findOne({name: '全部数据'})
    if(!menu) {
        menu = await Menu.create({
            name: '全部数据',
        })
    }
    let menus  = await Menu.find().exec()
    menus = menus.map((menu) => menu.toObject())
    const Tree = menuListToTree(menus)
    res.send({
        data: [Tree],
        message: '获取成功'
    })
})
router.get('/menu/delete/:id', async(req, res) => {
    const menus = await Menu.find()
    //先删除子节点
    menus.forEach(async(menu) => {
        if(menu.pid === req.params.id) {
            await Menu.findByIdAndDelete({_id: menu.id})
        }
    })
    //再删除当前节点
    await Menu.findByIdAndDelete({_id: req.params.id})
    res.send({
        message: '删除成功'
    })
})
router.post('/menu/add', async(req, res) => {
    const { pid, level, type, name, code, toCode} = req.body
    await Menu.create({
       pid, level, type, name, code, toCode
    })
    res.send({
        message: '新增成功'
    })
})
router.post('/menu/update', async(req, res) => {
    const { _id, pid, level, type, name, code, toCode} = req.body
    await Menu.updateOne({_id}, {$set:{
       pid, level, type, name, code, toCode, 
       updateTime: todayTime()
    }})
    res.send({
        message: '修改成功'
    })
})
module.exports = router