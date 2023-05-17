const mongoose = require('mongoose')
const Schema = mongoose.Schema

const detailConfig = {
    type: String,
    required: true
}
const otherConfig = {
  type: String,
  default: ''
}

const UsersModel = new Schema({
    user_fname: detailConfig,
    user_lname: detailConfig,
    user_email: detailConfig,
    user_tel: otherConfig,
    user_pass: detailConfig,
    user_reg_date: {
      type: Date,
      default: new Date()
    }
  })

const Users = mongoose.models.Users ||  mongoose.model('Users', UsersModel)

export default Users