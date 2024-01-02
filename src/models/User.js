const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    username: {type: String, require: true, unique: true},
    name: {
        first: {type: String, require: true},
        last: {type: String, require: true}
    },
    age: Number,
    email: String
}, {timestamps: true})

const User = model('user', UserSchema)
module.exports = {User}