

const error = (message, status=200) => {
    const error = new Error(message)
    error.status = status
    throw error
}


export default error