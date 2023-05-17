const jwt = require('jsonwebtoken')
const { default: setCookie } = require('src/api-files/components/setCookie')

const LoggedIn = async (req, res) => {
    const authHeader = req.headers['authorization']
    const authToken = authHeader && authHeader.split(' ')[1]
    try{
    const {user_id} = await jwt.verify(authToken, process.env.JWT_SECRET)
    const newAuthToken = await jwt.sign({user_id: user_id}, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })
    setCookie(res, 'authToken', newAuthToken)
    res.json({
      success: true,
      newAuthToken: newAuthToken,
    })
    }
    catch(err){
      res.json({
        error: {
          message: err.message
        }
      })
    }
}
  


module.exports = LoggedIn