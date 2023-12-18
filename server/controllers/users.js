import User from '../models/User'

// Function to get a user by ID
export const getUser = async (req, res) => {
  try {
    // Extracting the user ID from the request parameters
    const { id } = req.params

    // Fetching the user from the database
    const user = await User.findById(id)

    // Handling the case where the user is not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Excluding sensitive data (like password) from the response
    const { password, ...userResponse } = user.toObject()

    // Sending the user data as response
    res.status(200).json(userResponse)
  } catch (error) {
    // Handling any other errors
    res.status(500).json({ message: error.message })
  }
}

// Function to get the friends of a user
export const getUserFriends = async (req, res) => {
  try {
    // Extracting user ID from request parameters
    const { id } = req.params

    // Fetching the user and handling non-existent user
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Fetching friends' details
    const friends = await Promise.all(
      user.friends.map((friendId) =>
        User.findById(
          friendId,
          'firstName lastName email picturePath location occupation'
        )
      )
    )

    // Responding with the friends' details
    res.status(200).json(friends)
  } catch (error) {
    // Handling invalid user ID and other errors
    const status = error.name === 'CastError' ? 400 : 500
    res.status(status).json({ message: error.message })
  }
}

// Function to add or remove a friend for a user
export const addRemoveFriend = async (req, res) => {
  try {
    // Extracting user ID and friend ID from the request parameters
    const { id, friendId } = req.params

    // Fetching the user and the friend from the database
    const user = await User.findById(id)
    const friend = await User.findById(friendId)

    // Handling non-existent user or friend
    if (!user || !friend) {
      const message = !user ? 'User not found' : 'Friend not found'
      return res.status(404).json({ message })
    }

    // Adding or removing the friend from the user's list
    const isAlreadyFriend = user.friends.includes(friendId)
    if (isAlreadyFriend) {
      user.friends.pull(friendId)
      friend.friends.pull(id)
    } else {
      user.friends.push(friendId)
      friend.friends.push(id)
    }

    // Saving the updated user and friend documents
    await user.save()
    await friend.save()

    // Responding with a success message
    res.status(200).json({ message: 'Friends list updated' })
  } catch (error) {
    // Handling any other errors
    res.status(500).json({ message: error.message })
  }
}
