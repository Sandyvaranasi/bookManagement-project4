const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({

        bookId: {
            type : mongoose.Schema.Types.ObjectId,
            required :true,
            ref : "book"
        },
        reviewedBy: {
            type : String,
            required:true,
            default : 'Guest',
            trim : true
        },
        reviewedAt: {
            type : Date,
            required:true
        },
        rating: {
            type : Number,
             minLength : 1,
              maxLength : 5,
              required:true
        },
        review: String,
        isDeleted: {
            type : Boolean,
             default: false
        },
},{timestamps:true}
)

module.exports = mongoose.model('review',reviewsSchema)
