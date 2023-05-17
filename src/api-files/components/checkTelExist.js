const { default: Users } = require("../models/Users")




const checkTelExist = async (tel) => {
    const duplicate = await Users.findOne({ user_tel: tel })
    return duplicate
}


module.exports = checkTelExist