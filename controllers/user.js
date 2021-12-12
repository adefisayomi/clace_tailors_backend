const User = require('../schema/user')
const {newUser} = require('../utils/joi/user')
const multiple = require('../utils/dbValidators/multiple')
const bcrypt = require('bcryptjs')
const SendEmail = require('../utils/email_transporter')
const crypto = require('crypto')
const validateUpdate = require('../utils/joi/updateUser')
const jwt = require('jsonwebtoken')


// create a user
async function createUser (payload, req, res) {
    try {
        if (!payload) throw new Error('require payload')
        
        // validate input
        const {value, error} = newUser.validate(payload)
        if (error) throw new Error (error.message.replaceAll(/["]/g, ''))

        // checkmultiple inputs
        const inUse = await multiple({email: value.email})
        if (inUse) throw new Error(inUse)

        // hash password
        const pwd = crypto.randomUUID().split('').slice(0, 8).join('')
        const salt = bcrypt.genSaltSync(12);
        const password = bcrypt.hashSync(pwd, salt);

        // create user
        const user = new User({
            ...value, password,
            username: value.email.split('@')[0]
        })
        await user.save()

        // create accessToken
        const loginPayload = {
            id: user.id,
            email: user.email,
            username: user.username
        }
        const token = jwt.sign(loginPayload, process.env.ACCESS_TOKEN_SEC, { expiresIn: '24h' })
        
        // create access token cookie on the server
        await res.cookie('accessToken', token, { httpOnly: true, maxAge: 1000*60*60*24 })

        // send email to user
        const sendMail = await SendEmail({to: user.email, file: 'welcome', content: { password: pwd, username: user.username, email: user.email }})
        if (!sendMail.success) throw new Error(sendMail.message)

        return ({
            success: true,
            message: `profile successfuly created`,
            data: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        })

    }
    catch(err) {
        return ({
            success: false,
            message: err.message,
            data: null
        })
    }
}


// get a single user
async function getUser (param) {
    try {
        const users = await User.find()
        const user = await users.find(value => (
            value.email == param ||
            value.id == param ||
            value.phone == param ||
            value.username == param
        ))
        if (!user) throw new Error('User does not exist.')

        return ({
            success: true,
            message: `${user.firstName}'s' data`,
            data: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                classMode: user.classMode
            }
        })
    }
    catch(err) {
        return ({
            success: false,
            message: err.message,
            data: null
        })
    }
}

// update user
async function updateUser (param, payload= {}) {

    try{
        // validate update data payload
        let data = await validateUpdate(payload)
        if (!data.success) throw new Error(data.message)
        data = data.data

        // get User
        const user = await User.findOne({email: param.email})

        // hash Password
        if ('password' in data) {
            const pwdMatch =  bcrypt.compareSync(data.password.old, user.password)
            if (!pwdMatch) throw new Error ('Password does not match')

            const salt = bcrypt.genSaltSync(12);
            data.password = bcrypt.hashSync(data.password.new, salt);

        }
        // if email, phone, or username in data
        const check = ['email', 'phone', 'username']
        for (let [key, value] of Object.entries(data)) {
            if (check.includes(key) && user[key] !== value) {
                const inUse = await multiple({[key]: value})
                if (inUse) throw new Error(inUse)
            }
        }
        // Perform update
        const doUpdate = await User.findOneAndUpdate({id: user.id}, data)
        await doUpdate.save()
        return ({
            success: true,
            message: 'User successfuly updated',
            data: null
        })
    }
    catch(err) {
        return ({
            success: false,
            message: err.message,
            data: null
        })
    }
}



module.exports = {
    createUser,
    getUser,
    updateUser
}