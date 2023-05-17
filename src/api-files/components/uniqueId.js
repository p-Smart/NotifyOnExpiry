const crypto = require('crypto')

const uniqueId = () =>  crypto.randomBytes(8).toString('hex');

module.exports = uniqueId