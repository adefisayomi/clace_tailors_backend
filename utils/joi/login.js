const joi = require('joi')
const {phone} = require('phone')



module.exports = async ({username, password}) => {
    try {
        if (!username || !password) throw new Error('incomplete login input.')

        // check if username = { email, username, phone }
        const type = username.includes('@') ? 'email' : !isNaN(username) ? 'phone' : 'username'
        const loginObject = { [type]: username, password }

        let { value, error } = account[type].validate(loginObject)
        if (error) throw new Error(error.message.replaceAll(/["]/g, ''))
        value = {...value, type}

        return ({
            success: true,
            message: 'data valid',
            data: value
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



const account = {
    ['email']: joi.object({

        email: joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .label('Email')
                .required(),

        password: joi.string()
                .alphanum()
                .required()
    }),

    ['username']: joi.object({

        username: joi.string()
                    .required(),
                    
        password: joi.string()
                .alphanum()
                .required()
    }),

    ['phone']: joi.object({

        phone: joi.number()
                .label('Phone number')
                .required()
                .custom(value => {
                    const {isValid, phoneNumber} = phone(JSON.stringify(value), {country: 'NG'})
                    if (!isValid) throw new Error ('Phone number is invalid')
                    return phoneNumber.replace('+', '')
                }),
        password: joi.string()
                .alphanum()
                .required()
    }),
}
