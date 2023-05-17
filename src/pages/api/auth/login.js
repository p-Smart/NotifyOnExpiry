import error from 'src/api-files/components/customError'
import connectToDB from 'src/api-files/config/dbConnect'
import Users from 'src/api-files/models/Users'
import checkEmailExist from 'src/api-files/components/checkEmailExist'
import checkTelExist from 'src/api-files/components/checkTelExist'
import verifyPassword from 'src/api-files/components/verifyPassword'
import jwt from 'jsonwebtoken'
import setCookie from 'src/api-files/components/setCookie'


export default async function handler({body, ...req}, res) {
    try{
        if(req.method !== 'POST'){
            error('Only POST Requests', 404)
        }
        await connectToDB()
        const email = body.email?.toLowerCase()
        const tel = body.tel
        const pass = body.pass

        !email && !pass && !tel && error('Parameters missing')

        const emailExist = email && await checkEmailExist(email)
        email && !emailExist && error('Invalid username or password')

        const telExist = tel && await checkTelExist(tel)
        tel && !telExist && error('Invalid username or password')

        const userData = await Users.findOne({$or: [{user_email: email}, {user_tel: tel}]})

        const passwordCorrect = await verifyPassword(userData?._id, pass)
        !passwordCorrect && error('Invalid username or password')

        let user_id = userData?._id
        let authToken = await jwt.sign({user_id: user_id}, process.env.JWT_SECRET, {
        expiresIn: '60m'
        })
        
        setCookie(res, 'authToken', authToken)
        
        res.json({
        success: true,
        authToken: authToken
        })
    }
    catch(err){
        res.status(err.status || 500).json({
            error: {
              message: err.message
            }
        })
    }
}