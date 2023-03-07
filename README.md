### Node + Express + MongoDB 后台管理系统模板的后端接口
```shell
1. npm install  下载相关依赖
2. node server.js 启动接口
```
#### menus"树形"路由列表设计
1. MongoDB是文档型数据库，可以直接存储树形数据，但树形结构不便于对每一个menu路由节点单独操作(增删改查)
2. 仿照MySQL 表的设计方式，将menus路由列表展平，由pid字段连接
```javascript
//为了便于对 单个"权限路由"进行增删改查， 给每个"权限路由"增加pid字段存储父节点的id
const MenuSchema = mongoose.Schema({
    pid: {type: String, default: ''},
    name: {type: String, default: ''},
    code: {type: String, default: ''},
    //......
})
//查询数据库时，将"权限路由"列表递归，由pid字段重新生成一棵存储"权限路由"信息的树
function menuListToTree(list) {
    if(!list.length) return 
    const children = []
    const treeNode = list.shift()
    for (let i = 0; i < list.length; i++) {
        if(treeNode._id.toString() === list[i].pid) {
            children.push(list[i])
        }
    }
    menuListToTree(list)
    treeNode.children = children
    return treeNode
}
```
#### menus权限路由列表的"动态"生成
```javascript
//roleSelect字段存储当前用户的角色信息
const UserSchema = mongoose.Schema({
    email: {type: String, unique: true},
    //......
    roleSelect: {type: [String], default: []}
})
//menuSelect字段存储当前角色 menu权限路由id
const RoleSchema = mongoose.Schema({
    roleName: {type: String, default: ''},
    //......
    menuSelect: {type: [String], default: []}
})


//首先获取当前用户的roleSelect角色列表
const user = await User.findOne({_id: req.userId})
let roleSelect = await Promise.all(user.roleSelect.map((role) => Role.findOne({_id: role})))
//将角色列表展平并去重
roleSelect = roleSelect.map((role) => role._doc.menuSelect).flat(Infinity)
const menusSet = new Set(roleSelect)
//查询所有的menus权限路由列表，循环判断当前角色是否拥有权限
let menus = await Menu.find().exec()
const routes = []
const buttons = []
for(let i = 0; i < menus.length; i++) {
    //按钮权限
    if(menus[i].level === 4 && menusSet.has(menus[i]._id.toString())) {
        buttons.push(menus[i].code)
    }else if(menus[i].code !== '' && menusSet.has(menus[i]._id.toString())){//路由权限
        routes.push(menus[i].code)
    }
}
```