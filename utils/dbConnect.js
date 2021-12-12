const { connect } = require('mongoose')

let connected = null

module.exports = async () => {
    try {
        if (connected) return
        else {
            const createConnection = await connect(process.env.DATABASE_URI)
            connected = createConnection.connection.readyState
            console.log(`<<< Database connection successful >>>`)
        }
    } catch (err) {
        console.log({
            databaseError: err.message
        })
        process.exit(1)
    }
}