const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 4000
const helmet = require('helmet')
const cors = require('cors')
const cookie_parser = require('cookie-parser')
const dbConnect = require('./utils/dbConnect')


// middlewares
app.use('*', cors({origin: ['https://tailor.devbyclace.com', 'http://localhost:3000', 'http://172.20.10.5:3000'],
                         credentials: true,
                         methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
                         allowedHeaders: ['Content-Type', 'Authorization']}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(helmet())
app.use(cookie_parser())
app.disable('x-powered-by')

// view engine
app.set('view engine', 'ejs');


// Routes
app.use('/api', require('./routes'))
app.use( async (req, res) => {
    res.send({
        success: true,
        message: 'clace academy server',
        data: null
    })
})


// init server
async function startServer () {
    try {
        await dbConnect()
        app.listen(PORT, () => {
            console.log(` server started on PORT: ${PORT}`)
        })
    }
    catch(err) {
        process.exit(1)
    }
}
startServer()