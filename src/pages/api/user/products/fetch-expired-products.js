const { default: Users } = require("src/api-files/models/Users")
import mongoose from 'mongoose'
import error from 'src/api-files/components/customError'
import verifyAuthToken from 'src/api-files/components/verifyAuthToken'
import connectToDB from 'src/api-files/config/dbConnect'
import Products from 'src/api-files/models/Products'


const FetchUser = async(req, res) => {
    try{
        var {user_id, authToken} = await verifyAuthToken(req, res)
        if(req.method !== 'GET'){
            error('Only GET Requests', 404)
        }
        
        await connectToDB()

        user_id = new mongoose.Types.ObjectId(user_id)
        const products = await Products.find({ user_id: user_id, prod_exp_date: {$lte: new Date()} }).sort({ created_at: -1 });

      res.json({
        success: true,
        products: products
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



export default FetchUser