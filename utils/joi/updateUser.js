const joi = require('joi')
const {phone} = require('phone')


module.exports = async (payload= {}) => {
    try {
        if (!payload) throw new Error('empty payload')

        let { value, error } = updateUser.validate(payload)
        if (error) throw new Error(error.message.replaceAll(/["]/g, ''))

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


const updateUser = joi.object({
    firstName: joi.string()
            .min(3)
            .max(20)
            .allow("")
            .label('First name'),
    username: joi.string()
            .min(3)
            .max(20)
            .allow("")
            .label('Username'),
    password: joi.object({
        old: joi.string()
                .label('Old password')
                .required(),
        new: joi.string()
                .min(6)
                .label('New password')
                .required(),
    }),

    lastName: joi.string()
            .min(3)
            .max(20)
            .allow('')
            .label('Last name'),

    classMode: joi.string()
            .allow("")
            .label('Class mode')
            .custom(value => {
                const class_mode = ['weekends', 'weekdays']
                if (!class_mode.includes(value.toLowerCase())) {
                    throw new Error('class mode can either be weekends or weekdays')
                }
                return value
            }),

    phone: joi.number()
            .allow("")
            .label('Phone number')
            .custom(value => {
                const {isValid, phoneNumber} = phone(JSON.stringify(value), {country: 'NG'})
                if (!isValid) throw new Error ('Phone number is invalid')
                return phoneNumber.replace('+', '')
            }),

    email: joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'co'] } })
            .allow("")
            .label('Email')
})