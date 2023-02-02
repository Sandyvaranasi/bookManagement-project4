const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bookModel =require('../models/bookModel')

const authentication = function (req, res, next) {
    try {
        let token = req.headers.token

        if (!token) return res.status(401).send({ status: false, message: "missing mandatory header" })

        jwt.verify(token, "secretKey", function (err, decodedToken) {
            
            if (decodedToken) {
                req.userId = decodedToken.userId
                next()
            } else {
                return res.status(401).send({ status: false, message: err.message })
            
            }
        })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const authorisation = async function (req, res, next) {
    try {
        const token = req.headers['x-api-key']
        const userIdInToken = jwt.decode(token).userId

        const booksId = req.params.bookId

        if (!mongoose.isValidObjectId(booksId)) {
            return res.status(404).send({
                status: false,
                message: "Please enter Valid Object Id"
            })
        }
        const userId = await bookModel.findById(booksId).select({ userId: 1,_id:0 })
        if (!userId) {
            return res.status(404).send({
                status: false,
                message: "Book Id Doesn't exist"
            })
        }

        if (userId.userId != userIdInToken)
            return res.status(403).send({
                status: false,
                message: "You are not Authorized"
            })

        next()
    }
    catch(err){
        return res.status(500).send({
            status: false,
            message: err.message
   })
}

}

module.exports = { authentication, authorisation}