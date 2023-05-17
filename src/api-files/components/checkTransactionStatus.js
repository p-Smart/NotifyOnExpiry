const {pool} = require('./database')
const axios = require('axios')
const generateTxRef = require('./generateTxRef')

const CheckTransactionStatus = async () => {
    const conn = await pool.getConnection()
    try{
        var [rows] = await conn.query(`SELECT * FROM transactions WHERE status = ? AND created_on <= DATE_SUB(NOW(), INTERVAL 10 MINUTE) ORDER BY created_on ASC LIMIT 0,50`, ['PENDING'])
        await conn.beginTransaction()
        await (Array.from(rows)).forEach( async ({tx_ref, user_id, payment_provider, tx_type, amount}) => {

            if(tx_type === 'DEPOSIT'){

                if (payment_provider === 'FLUTTERWAVE'){
                    try{
                        const {data} = await axios.get(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,{
                        headers: {
                        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                        }
                        })
                        if( data.status === 'success' ){
                            await conn.query(`UPDATE transactions SET 
                            status = ?,
                            finalized_on = NOW() WHERE tx_ref = ?`, ['COMPLETED', tx_ref])
                            
                            var [rows] = await conn.query(`SELECT main_balance FROM users WHERE user_id = ?`, [user_id])
                            const prevBalance = rows[0].main_balance
                            const newBalance = parseFloat(prevBalance) + parseFloat(data.data.amount)
                
                            await conn.query(`UPDATE users SET
                            main_balance = ? WHERE user_id = ?`, [newBalance, user_id])
                            
                            await conn.commit()
                        }
            
                        }
                        catch(err){
                            if (err?.response?.data?.status === 'error'){
                                try{
                                    await conn.query(`UPDATE transactions SET 
                                    status = ?,
                                    finalized_on = NOW() WHERE tx_ref = ?`, ['FAILED', tx_ref])
                                    await conn.commit()
                                }
                                catch(err){console.log(err)}
                            }
                            else(console.log(err))
                        }       
                }
                // End of Flutterwave API



                else if (payment_provider === 'PAYSTACK'){
                    try{
                        const {data} = await axios.get(`https://api.paystack.co/transaction/verify/${tx_ref}`,{
                        headers: {
                            Authorization: `Bearer ${process.env.PYS_SECRET_KEY}`,
                            'Content-Type': 'application/json'
                        }
                        })
                        if(data.data.status==='success'){
                            await conn.query(`UPDATE transactions SET 
                            status = ?,
                            finalized_on = NOW() WHERE tx_ref = ?`, ['COMPLETED', tx_ref])
                            
                            var [rows] = await conn.query(`SELECT main_balance FROM users WHERE user_id = ?`, [user_id])
                            const prevBalance = rows[0].main_balance
                            const newBalance = parseFloat(prevBalance) + parseFloat((data.data.amount)).toFixed(2) / 100
                
                            await conn.query(`UPDATE users SET
                            main_balance = ? WHERE user_id = ?`, [newBalance, user_id])
                        }
                        else if(data.data.status === 'abandoned' || data.data.status === 'failed'){
                            await conn.query(`UPDATE transactions SET 
                            status = ?,
                            finalized_on = NOW() WHERE tx_ref = ?`, ['FAILED', tx_ref])
                        }
                        await conn.commit()
                    }
                    catch(err){
                        if (err?.response?.data?.status === false){
                            try{
                                await conn.query(`UPDATE transactions SET 
                            status = ?,
                            finalized_on = NOW() WHERE tx_ref = ?`, ['FAILED', tx_ref])
                            await conn.commit()
                            }
                            catch(err){console.log(err)}
                        }
                        else{ console.log(err) }
                    }
                }
                // End of Paystack API
            }

            else if (tx_type === 'WITHDRAWAL'){
                try{
                    const {data} = await axios.get(`https://api.paystack.co/transfer/verify/${tx_ref}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.PYS_SECRET_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    })
                    if(data?.status === true && data?.data?.status === 'success'){
                        await conn.query(`UPDATE transactions SET 
                        status = ?,
                        finalized_on = NOW() WHERE tx_ref = ?`, ['COMPLETED', tx_ref])
                        await conn.commit()
                    }
                }
                catch(err){
                    if(err?.response?.data?.status === false || err?.response?.data?.data?.status === 'abandoned'){
                        try{
                            await conn.query(`UPDATE transactions SET 
                        status = ?,
                        finalized_on = NOW() WHERE tx_ref = ?`, ['FAILED', tx_ref])
                        
                        const [rows] = await conn.query(`SELECT main_balance FROM users WHERE user_id = ?`, [user_id])
                        const currentBalance = parseFloat(rows[0].main_balance)
                        const newBalance = currentBalance + parseFloat(amount)


                        await conn.query(`UPDATE users SET
                        main_balance = ? WHERE user_id = ?`, [newBalance, user_id])

                        const txRef = await generateTxRef()
                        await conn.query(`INSERT INTO transactions SET
                        user_id = ?,
                        tx_ref = ?,
                        amount = ?,
                        tx_type = ?,
                        status = ?,
                        payment_provider = ?
                        `, [user_id, txRef, amount, 'REFUND', 'COMPLETED', 'SMARTFIGURES'])
                        await conn.commit()
                        }
                        catch(err){console.log(err)}
                    }
                }
            }

        })
        }
        catch(err){
            console.log(err)
            await conn.rollback()
        }
        finally{
            await conn.release()
        }
}


module.exports = CheckTransactionStatus