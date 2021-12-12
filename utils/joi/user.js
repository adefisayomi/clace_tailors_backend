const joi = require('joi')
const {phone} = require('phone')


const newUser = joi.object({
    // firstName: joi.string()
    //         .min(3)
    //         .max(20)
    //         .required()
    //         .label('First name'),

    // lastName: joi.string()
    //         .min(3)
    //         .max(20)
    //         .allow('')
    //         .label('Last name'),
    // classMode: joi.string()
    //         .required()
    //         .label('Class mode')
    //         .custom(value => {
    //             const class_mode = ['weekends', 'weekdays']
    //             if (!class_mode.includes(value.toLowerCase())) {
    //                 throw new Error('class mode can either be weekends or weekdays')
    //             }
    //             return value
    //         }),

    // phone: joi.number()
    //         .required()
    //         .label('Phone number')
    //         .custom(value => {
    //             const {isValid, phoneNumber} = phone(JSON.stringify(value), {country: 'NG'})
    //             if (!isValid) throw new Error ('Phone number is invalid')
    //             return phoneNumber.replace('+', '')
    //         }),

    email: joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'co'] } })
            .required()
            .label('Email')
})


module.exports = {
    newUser
}