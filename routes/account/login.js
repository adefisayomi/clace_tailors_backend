const route = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validateLogin = require('../../utils/joi/login')
const User = require('../../schema/user')



route.use(async (req, res) => {
    try {
        // extract input data from request data
        let data = await validateLogin(req.body)
        if (!data.success) throw new Error(data.message)
        data = data.data

        // get user
        const user = await User.findOne({ [data.type]: data[data.type] })
        if (!user) throw new Error('user does not exist.')

        // compare password
        const validPassword = bcrypt.compareSync(data.password, user.password)
        if (!validPassword) throw new Error('Password is not valid')

        // create accessToken
        const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            classMode: user.classMode
        }
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SEC, { expiresIn: '24h' })
        
        // create access token cookie on the server
        await res.cookie('accessToken', token, { httpOnly: true, maxAge: 1000*60*60*24 })

        res.send ({
            success: true,
            message: `logged in as ${user.firstName}`,
            data: payload
        })
    }                               
    catch(err) {
        res.send ({
            success: false,
            message: err.message,
            data: null
        })
    }
})

module.exports = route