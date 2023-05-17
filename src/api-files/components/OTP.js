const Otps = require("../models/Otps");
const { sqlQuery } = require("./database")
const crypto = require('crypto');
const generate = async () => {
  const buffer = crypto.randomBytes(4);
  const integer = buffer.readUInt32BE(0);
  const OTP = (Math.abs(integer) % 1000000).toString().padStart(6, '0');
  const duplicate = await Otps.findOne({otp: OTP})
  
  return !duplicate ? OTP : await generate()
}



const generateOTP = async (options={expires: 30, email: '', tel: '', user_id: ''}) => {
    const {expires, email, tel, user_id} = options

    const userOtps = await Otps.find({$or: [{user_email: email}, {user_tel: tel}, {user_id: user_id}]})

    if (userOtps){
        await Otps.deleteOne({$or: [{user_email: email}, {user_tel: tel}, {user_id: user_id}]})
    }
    
    const OTP = await generate()

    await Otps.create({
        otp: OTP,
        created_at: new Date(),
        expires_on: new Date(Date.now() + (expires * 60 * 1000)),
        email: email,
        tel: tel,
        user_id: user_id
    })
    return OTP
}

const validateOTP = async (otp) => {
    const userOtps = await Otps.findOne({otp: otp})
    if (!userOtps){
        return {
            valid: false,
            message: 'Invalid OTP'
        }
    }
    else{
        await Otps.deleteOne({otp: otp})
        const {expires_on} = userOtps
        const now = new Date();
        return expires_on >= now ? {valid: true} : {valid: false, message: 'Expired OTP, request a new one'}
    }
}


const deleteExpiredOTPs = async () => {
    await Otps.deleteMany({expires_on: {$lt: new Date()}})
}


module.exports = {
    generateOTP : generateOTP,
    deleteExpiredOTPs: deleteExpiredOTPs,
    validateOTP: validateOTP
}