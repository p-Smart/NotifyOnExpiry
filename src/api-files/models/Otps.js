const mongoose = require('mongoose')
const Schema = mongoose.Schema

const detailConfig = {
    type: String,
    default: ''
}
const dateConfig = {
    type: Date,
    default: new Date()
}

const Otps = mongoose.model('Otps', new Schema({
    otp: {
        type: String,
        required: true
    },
    created_at: dateConfig,
    expires_on: dateConfig,
    email: {
        type: String,
        required: true
    },
    tel: detailConfig,
    user_id: detailConfig
  }, 
  {
    collection: 'otps'
  })
)

module.exports = Otps