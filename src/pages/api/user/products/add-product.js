import mongoose from 'mongoose'
import verifyAuthToken from 'src/api-files/components/verifyAuthToken'
import Products from 'src/api-files/models/Products'



const AddProducts = async({body, ...req}, res) => {
    
    try{
        var {user_id, authToken} = await verifyAuthToken(req, res)
        if(req.method !== 'POST'){
            error('Only GET Requests', 404)
        }
        const products = body.map( (product) => ({
            user_id: user_id,
            created_at: new Date(),
            notifications_sent: 0,
            ...product
        }))
        await Products.create(products)
        res.json({
            success: true,
            message: `${products.length} Product(s) uploaded successfully`
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



export default AddProducts