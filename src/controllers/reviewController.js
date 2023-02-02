const mongoose = require('mongoose');

const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');

const validators = require('../validations/validation')


const createReviws = async function (req, res) {
    try {

        if (Object.keys(req.body).length==0) {
            return res.status(400).send({status:false,message:"Please send mandatory field"})
        }

        if(!mongoose.isValidObjectId(req.params.bookId)) return res.status(400).send({status:false,message:"invalid bookId"})

        if (!req.body.bookId) {
            req.body.bookId = req.params.bookId
        }
        if (!req.body.reviewedAt) {
            req.body.reviewedAt = Date.now()
        }

        let { bookId, reviewedBy, rating, review, reviewedAt } = req.body

        if(!mongoose.isValidObjectId(req.body.bookId)) return res.status(400).send({status:false,message:"invalid bookId"})
        if (!reviewedBy) reviewedBy = 'Guest'
        //if (typeof (reviewedBy) != 'string') return res.status(400).send({ status: false, messsage: "wrong name format" })
       // if (!validators.validate(reviewedBy)) return res.status(400).send({ status: false, message: "invalid reviewser's name" })

        if (!rating) return res.status(400).send({ status: false, message: "rating is mandatory" })
        //if (typeof (rating) != 'number') return res.status(400).send({ status: false, messsage: "wrong rating format" })
        if (rating < 1 || rating > 5) return res.status(400).send({ status: false, message: "rating should be from 1 to 5" })

        // if (review) {
        //     if (typeof (review) != 'string') return res.status(400).send({ status: false, messsage: "wrong review format" })
        // }

        let book = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true });

        if (!book) return res.status(404).send({ status: false, message: "no such book found" });

        const reviewCreated = await reviewModel.create(req.body)

        book = book.toObject();

        book.reviewsData = reviewCreated
        res.status(201).send({ status: true, message: "Success", data: book });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

const updateReviews = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!mongoose.isValidObjectId(req.params.bookId)) return res.status(400).send({ status: false, message: "Please provide valid bookId" });
        if (!mongoose.isValidObjectId(req.params.reviewId)) return res.status(400).send({ status: false, message: "Please provide valid reviewId" });

        let data = req.body;
  
        let { review, rating, reviewedBy } = data;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "provide some data to update" });

        // if (review) {
        //     if (review.trim() == "" || typeof (review) != "string") return res.status(400).send({ status: false, message: "invalid review input" });
        // }
        // if (rating) {
        //     if (typeof (rating) != "number" || rating < 1 || rating > 5) return res.status(400).send({ status: false, message: "invalid rating input, must be between 1 to 5" });
        // }
        // if (reviewedBy) {
        //     if (typeof (reviewedBy) != "string" || reviewedBy.trim() == "" || !validators.validate(reviewedBy)) return res.status(400).send({ status: false, message: "invalid reviewedBy input" });
        // }

        let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!bookData) return res.status(404).send({ status: false, message: "no such book" });

        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, data, { new: true });
        if (!updatedReview) return res.status(404).send({ status: false, message: "no such review exist for this id" });

        bookData = bookData.toObject();

        let reviews = await reviewModel.find({ bookId: bookId, isDeleted: false });

        bookData.reviewData = reviews;

        return res.status(200).send({ status: true, message: "Success", data: bookData });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const deleteReviews = async function (req, res) {
    try {
        let reviewId = req.params.reviewId;
        let bookId = req.params.bookId;

        if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "invalid reviewId" });
        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "invalid bookId" });

        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!updatedReview) return res.status(404).send({ status: false, message: "no such review to delete" });

        let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } }, { new: true });
        if (!updatedBook) return res.status(404).send({ status: false, message: "no such book foud for this id" });

        res.status(200).send({ status: true, message: "Review deleted successfully" })


    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createReviws, updateReviews, deleteReviews }



