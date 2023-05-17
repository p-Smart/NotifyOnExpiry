const Users = require('../models/Users');
const crypto = require('crypto')
const generateUuid = async() => {

    let id = crypto.randomBytes(4).toString('hex')
    try{
    const duplicate = await Users.findOne({ user_id: id })
    if (duplicate){
      return generateUuid()
    }
    return id
    }
    catch(err){
      throw new Error(err.message)
    }
  }


module.exports = generateUuid