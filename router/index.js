const child_process = require('child_process');
const express = require("express")
const router = express.Router()
const permissionRouter = require("./permission")
const {auth} = require('../utils')
//从备份还原数据库
router.use('/mongorestore', (req, res) => {
    child_process.exec('mongorestore -h 127.0.0.1 -d react_admin --drop  /root/package/mongo-dump/react_admin', (err) => {
        if(err) {
            res.send({
                message: '还原数据库失败！'
            })
        } else {
            res.send({
                message: '还原数据库成功！'
            })
        }
    })
})

router.use(auth, permissionRouter)
module.exports = router
