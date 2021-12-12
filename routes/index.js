const route = require('express').Router()


// account
route.post('/signup', require('./account/signup'))
route.post('/login', require('./account/login'))
route.delete('/logout', require('./account/logout'))

// profile
route.use('/profile', require('./profile'))

module.exports = route