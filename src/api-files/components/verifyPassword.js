
const bcrypt = require('bcrypt')
const { default: Users } = require('../models/Users')



const verifyPassword = async (id, pass) => {
    const userData = await Users.findOne({_id: id})
    const dbPass = userData.user_pass
    let result = await bcrypt.compare(pass, dbPass)
    return result
}


module.exports = verifyPassword