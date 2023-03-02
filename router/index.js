const express = require("express")
const router = express.Router()
const permissionRouter = require("./permission")
router.use(permissionRouter)
module.exports = router
