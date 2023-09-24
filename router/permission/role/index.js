const express = require("express")
const router = express.Router()
const { Role, Menu } = require('../../../model/index')
const { todayTime, listToRecords, menuListToTree } = require('../../../utils')

router.get('/role/info', async (req, res) => {
    let role = await Role.findOne({ name: '超级管理员' })
    if (!role) {
        role = await Role.create({
            roleName: '超级管理员',
        })
    }
    let roles = await Role.find()
    res.send({
        data: listToRecords(roles),
        message: '获取成功'
    })
})
router.get('/role/delete/:id', async (req, res) => {
    await Role.findByIdAndDelete({ _id: req.params.id })
    res.send({
        message: '删除成功'
    })
})
router.post('/role/add', async (req, res) => {
    await Role.create({ roleName: req.body.roleName })
    res.send({
        message: '添加成功'
    })
})
router.post('/role/update', async (req, res) => {
    await Role.updateOne({ _id: req.body._id }, {
        $set: {
            roleName: req.body.roleName,
            updateTime: todayTime()
        }
    })
    res.send({
        message: '修改成功'
    })
})



//role集合中每一个文档都有对menu选中列表的关联
router.get('/role/menuInfo/:id', async (req, res) => {
    const { id } = req.params
    const role = await Role.findOne({ _id: id })
    let menus = await Menu.find()
    menus = menus.map((menu) => {
        if (role.menuSelect.includes(menu.id)) {
            menu.select = true
        }
        return menu.toObject()
    })
    const Tree = menuListToTree(menus)
    res.send({
        data: [Tree],
        message: '获取成功'
    })
})
router.post('/role/menuInfo/update', async (req, res) => {
    const { roleId, permissionId } = req.body
    await Role.updateOne({ _id: roleId }, {
        $set: {
            menuSelect: permissionId,
            updateTime: todayTime()
        }
    })
    res.send({
        message: '修改成功'
    })
})
module.exports = router