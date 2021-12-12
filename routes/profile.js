const route = require('express').Router()
const {getUser, updateUser} = require('../controllers/user')
const enforceLogin = require('../utils/middlewares/enforceLogin')
const User = require('../schema/user')


// get default user
route.get('/', enforceLogin, async (req, res) => {
    const user = await User.findOne({email: req.user.email}).select('-password')
    res.send({
        success: true,
        message: 'profile info',
        data: user
    })
})

// get user profile by param
route.get('/:id', async (req, res) => {
    const id = req.params.id
    const user = await getUser(id)
    res.send(user)
})

// update user
route.put('/update',enforceLogin, async (req, res) => {
    const update = await updateUser(req.user, req.body)
    res.send(update)
})


module.exports = route