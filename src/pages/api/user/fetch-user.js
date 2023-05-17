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
        const userData = await Users.findOne({_id: user_id})
        const products = await Products.find({user_id: user_id})
        const { user_pass, ...newUserData } = userData._doc;

        const filterProduct1 = await Products.find({ user_id: user_id }).sort({ created_at: -1 }).limit(5)
        const filterProduct2 = await Products.find({ prod_exp_date: { $lte: new Date() }, user_id: user_id })

        const twoWeeksAhead = new Date();
        twoWeeksAhead.setDate(twoWeeksAhead.getDate() + 14);

        const filterProduct3 = await Products.find({
          prod_exp_date: {
            $gte: new Date(),    // Current date or later
            $lte: twoWeeksAhead, // Two weeks ahead
          },
          user_id: user_id
        });

        const filterProduct4 = await Products.find({user_id: user_id, prod_exp_date: { $gte: new Date() }});

        const totalExpirationRemaining = filterProduct4.reduce((total, product) => {
          const expirationDate = new Date(product.prod_exp_date);
          const remainingDays = Math.ceil((expirationDate - Date.now()) / (1000 * 60 * 60 * 24));
          return total + remainingDays;
        }, 0);
        
        const averageExpirationRemaining = Math.floor(totalExpirationRemaining / filterProduct4.length);

      res.json({
        success: true,
        userData: {...newUserData, authToken: authToken, totalProd: products.length , recentProd: filterProduct1, expiredProd: filterProduct2.length, upcomingExpProd: filterProduct3.length, avgExpRemaining: averageExpirationRemaining}
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