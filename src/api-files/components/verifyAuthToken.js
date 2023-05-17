const jwt = require('jsonwebtoken')
const { default: error } = require('./customError')

const verifyAuthToken = async (req, res) => {
    const authHeader = req.headers?.['authorization']
    const authToken = (authHeader && authHeader.split(' ')[1]) || req.cookies.authToken || req.query.token
    try{
    const {user_id} = await jwt.verify(authToken, process.env.JWT_SECRET)
    req.user_id = user_id
    req.authToken = authToken
    return {
      user_id: user_id,
      authToken: authToken
    }
    }
    catch(err){
        error('Not authorized', 401)
        // res.status(401).json({
        //   success: false,
        //   error: false,
        //   message: 'Not authorized'
        // })
      }
}

module.exports = verifyAuthToken