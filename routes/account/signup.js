const routes = require('express').Router()
const {createUser} = require('../../controllers/user')


// signup a new user
routes.use(async (req, res) => {
    const user = await createUser(req.body, req, res)
    res.send(user)
})


module.exports = routes