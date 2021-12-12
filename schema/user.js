const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    username: String,
    password: String,
    classMode: String,
    active: { type: String, default: true }
}, { timestamps: true })

module.exports = model('User', userSchema)