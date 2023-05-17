const { default: Users } = require("../models/Users")



const checkEmailExist = async (email) => {    
    const duplicate = await Users.findOne({ user_email: email })
    return duplicate
}


module.exports = checkEmailExist