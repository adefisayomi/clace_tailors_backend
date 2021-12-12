const User = require('../../schema/user')

module.exports = async (payload) => {
    if (payload) {
        for (let [key, value] of Object.entries(payload)) {
            if (key && value) {
                const inUse = await User.exists({ [key]: value })
                if (inUse) {
                    return (`${value} is already in use`)
                }
            }
        }
        return null
    }
}