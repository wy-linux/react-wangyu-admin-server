const child_process = require('child_process');
const path = require('path')
const express = require("express")
const router = express.Router()
const permissionRouter = require("./permission")
const {auth} = require('../utils')

const DATA_PATH = path.join(__dirname, '../data')
//从备份还原数据库
router.use('/mongorestore', (req, res) => {
    child_process.exec(`mongorestore -h 127.0.0.1 -d react_admin --drop ${DATA_PATH}`, (err) => {
        if(err) {
            res.status(400).send({
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
