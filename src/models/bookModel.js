const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      lowercase:true,
      trim:true
    },
    excerpt: {
      type: String,
      trim:true,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      trim:true
    },
    subcategory: {
      type: String,
      required: true,
      trim:true
    },
    reviews: {
        type: Number,
        default: 0,
      },
    //comment: Holds number of reviews of this book
    deletedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    releasedAt: {
      type: Date,
      required: true
    },
    bookCover : String
  },
  { timestamps: true }
);

module.exports = mongoose.model("book", bookSchema);
