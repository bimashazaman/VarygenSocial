import Post from '../models/Post.js'
import User from '../models/User.js'

// Function to create a new post
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body

    // Find the user who is creating the post
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Create a new post object
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    })

    // Save the post to the database
    const savedPost = await newPost.save()
    res.status(201).json(savedPost) // Returning the newly created post
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Function to get a feed of posts with pagination
export const getFeedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query // Setting up default pagination values
    const skipIndex = (page - 1) * limit

    // Retrieve and sort posts by creation date, with pagination
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)
      .populate('userId', 'firstName lastName')
      .exec()

    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Function to get posts by a specific user with pagination
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 20 } = req.query
    const skipIndex = (page - 1) * limit

    // Find and sort posts by a specific user
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)
      .populate('userId', 'firstName lastName')
      .exec()

    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Function to like or unlike a post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    // Check if the post exists
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Toggle the like status of the post
    const isLiked = post.likes.get(userId)
    const update = isLiked
      ? { $unset: { [`likes.${userId}`]: '' } }
      : { $set: { [`likes.${userId}`]: true } }

    // Update the post in the database
    const updatedPost = await Post.findByIdAndUpdate(id, update, { new: true })

    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
