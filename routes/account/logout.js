const route = require('express').Router()
const enforceLogin = require('../../utils/middlewares/enforceLogin')


// get default user
route.use(enforceLogin, async (req, res) => {
    // clear cookie
    await res.clearCookie('accessToken')

    res.send({
        success: true,
        message: 'logout successful',
        data: null
    })
})

module.exports = route