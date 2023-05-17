import error from 'src/api-files/components/customError'
import connectToDB from 'src/api-files/config/dbConnect'
import bcrypt from 'bcrypt'
import Users from 'src/api-files/models/Users'
import checkEmailExist from 'src/api-files/components/checkEmailExist'
import checkTelExist from 'src/api-files/components/checkTelExist'


export default async function handler({body, ...req}, res) {
    try{
        if(req.method !== 'POST'){
            error('Only POST Requests', 404)
        }
        await connectToDB()
        let emailExist = await checkEmailExist(body.email)
        let telExist = body.tel==='' ? false : await checkTelExist(body.tel)
    
        telExist && error('This phone number is registered')
        emailExist && error('Email exists, please login')
        
        var hash = await bcrypt.hash(body.pass, 10)

        // MongoDB
        const result = await Users.create({
            user_fname: body.fname,
            user_lname: body.lname,
            user_email: body.email,
            user_tel: body.tel,
            user_pass: hash,
            user_reg_date: new Date()
        })

        res.json({
            success: true,
            emailExist: false,
            telExist: false,
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