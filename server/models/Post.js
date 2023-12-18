import mongoose from 'mongoose'

// Schema definition for a Post
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    picturePath: { type: String },
    userPicturePath: { type: String },
    location: String,
    description: String,
    likes: { type: Map, of: Boolean },
    comments: { type: Array, default: [] },
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post
