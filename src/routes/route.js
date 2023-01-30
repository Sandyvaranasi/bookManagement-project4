const express = require("express");
const router = express.Router();
const bookController=require("../controllers/bookController")
const userController=require("../controllers/userController")
const reviewController=require('../controllers/reviewController')
const { authentication, authorisation } = require("../middlewares/auth")

//user
router.post("/register", userController.createUser)
router.post("/login", userController.login)

//books
router.post("/books",authentication, bookController.createBooks)
router.get("/books",authentication, bookController.getBooks)
router.get("/books/:bookId",authentication, bookController.getBooksById)

//update
router.put("/books/:bookId",authentication,authorisation, bookController.updateBooks)
router.delete("/books/:bookId", authentication,authorisation,bookController.deleteBooks)

//REVIEW
router.post("/books/:bookId/review", reviewController.createReviws)
router.put("/books/:bookId/review/:reviewId", reviewController.updateReviews)
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReviews)

router.all('/*',function(req,res){
    res.status(400).send({status:false, message:"Invalid URL"}) 
})

module.exports = router;
