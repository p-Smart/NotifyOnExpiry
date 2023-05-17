const { default: Users } = require("src/api-files/models/Users")
import mongoose from 'mongoose'
import error from 'src/api-files/components/customError'
import sendEmail from 'src/api-files/components/sendEmail'
import connectToDB from 'src/api-files/config/dbConnect'
import Products from 'src/api-files/models/Products'



const FetchUser = async(req, res) => {
    try{
        if(req.method !== 'GET'){
            error('Only GET Requests', 404)
        }
        
        await connectToDB()
        const twoWeeksAhead = new Date();
        twoWeeksAhead.setDate(twoWeeksAhead.getDate() + 14);

        const almExpiredProds = await Products.find({
            prod_exp_date: {
              $gte: new Date(),    // Current date or later
              $lte: twoWeeksAhead, // Two weeks ahead
            },
            notifications_sent: 0
        })

        const responses = []
        await Promise.all(
            almExpiredProds.map(async ({ prod_name, prod_exp_date, user_id, _id }) => {
              try {
                const { user_email, user_fname } = await Users.findOne({ _id: user_id });
                const res = await sendEmail(user_email, prod_name, prod_exp_date, user_fname)
                responses.push(res)
                res.includes('Message queued') && await Products.updateOne({_id: _id}, {notifications_sent: 1})
              } catch (err) {
                console.error(err.message);
              }
            })
        );

        


      res.status(200).json({
        success: true,
        message: responses
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