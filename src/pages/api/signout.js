import error from 'src/api-files/components/customError'
import setCookie from 'src/api-files/components/setCookie'
import connectToDB from 'src/api-files/config/dbConnect'


export default async function handler({body, ...req}, res) {
    try{
        if(req.method !== 'GET'){
            error('Only GET Requests', 404)
        }
        await connectToDB()
        
        
        setCookie(res, 'authToken', '')
        
        res.redirect('/login')
    }
    catch(err){
        res.status(err.status || 500).json({
            error: {
              message: err.message
            }
        })
    }
}