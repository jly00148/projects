const mongoose = require('mongoose');

// 1.定义Schema
const UserSchema = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

// 2生成模型Model：
const UserModel = mongoose.model('User',UserSchema);

// 3导出模型Model：
module.exports = UserModel;