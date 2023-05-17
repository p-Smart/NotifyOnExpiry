import axios from 'axios'


export const authLayer = async ({req, res}) => {
    try{
    const {data} = await axios.get(`${process.env.SERVER_DOMAIN}/user/check-logged-in`, {
        headers: {
          'Authorization' : 'Bearer ' + req.cookies.authToken
        }
      })
      if (data.success){
        const newAuthToken = data.newAuthToken
        try{
            const {data} = await axios.get(`${process.env.SERVER_DOMAIN}/user/fetch-user`, {
                headers: {
                  'Authorization' : 'Bearer ' + newAuthToken
                }
              })
              return({
                props: {
                data : data.userData
                }
              })
        }
        catch(err){
            return({
              redirect: {
                  destination: `/login?${err.message}`,
                  permanent: false
              }
          })
        }
      }
      else{
        return({
            redirect: {
                destination: `/login?${data.error.message}`,
                permanent: false
            }
        })
      }
    }
    catch(err){
      return({
        redirect: {
            destination: `/login?${err.message}`,
            permanent: false
        }
    })
    }
}