// 创建路由对象，并编写路由，然后导出
const express = require("express")
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../../utils/secret')
const {listToRecords, todayTime} = require('../../../utils')
const router = express.Router()
const {User, Role} = require('../../../model/index')
router.get('/user/info', async(req, res) => {
    let user = await User.findOne({email: '查看所有路由@web.com'})
    if(!user) {
        user = await User.create({
            email: '查看所有路由@web.com',
            password: '123456',
            name: '查看所有路由'
        })
    }
    let users = await User.find()
    users = users.map((role) => role._doc)
    res.send({
        data: listToRecords(users),
        message: '获取成功'
    })
})
router.post('/user/add', async(req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })
    if(user) {
        res.send({
            message: '邮箱已存在'
        })
    }
    await User.create({
        ...req.body
    })
    res.send({
        message: '添加成功'
    })
})
router.post('/user/update', async(req, res) => {
    const {_id, email, name} = req.body
    await User.updateOne(
        {_id}, 
        {$set:
            {
                email,
                name,
                updateTime: todayTime()
            }
        }
    )
    res.send({
        message: '更新成功'
    })
})
router.get('/user/delete/:id', async(req, res) => {
    await User.findOneAndDelete({ _id: req.params.id})
    res.send({
        message: '删除成功'
    })
})
router.post('/user/login', async(req, res) => {
  const user = await User.findOne({
      email: req.body.email
  })
  if(!user) {
      //00表示客户端提交信息有问题
      return res.status(400).send({
          message: '用户名不存在'
      })
  }
  const isPasswordValid = require('bcrypt').compareSync(
      req.body.password,
      user.password
  )
  if(!isPasswordValid) {
      return res.status(400).send({
          message: '密码不正确'
      })     
  }
  //生成token
  const token = jwt.sign({
      id: String(user._id)       
  }, SECRET)
  res.send({
      message: '登录成功',
      data: token
  })
})
router.get('/user/logout', async(req, res) => {
    res.send({
        message: '退出登录'
    })
})



router.get('/user/roleInfo/:id', async(req, res) => {
    const user = await User.findOne({_id: req.params.id})
    const roles = await Role.find()
    const allRolesList = roles.map((role) => role._doc)
    const assignRoles = allRolesList.filter((role) => {
        if(user.roleSelect.includes(role._id)) {
            return role
        }
    })
    res.send({
        data:{
            allRolesList,
            assignRoles
        },
        message: '获取成功'
    })
})
router.post('/user/roleInfo/update', async(req, res) => {
    const {userId, roleIds} = req.body
    await User.updateOne({_id: userId}, {$set:{
        roleSelect: roleIds.split(','),
        updateTime: todayTime()
    }})
    res.send({
        message: '修改成功'
    })
})
module.exports = router