import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// REGISTER USER

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      location,
      occupation,
      friends,
      viewedProfile,
      impressions,
    } = req.body

    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // Generating salt and hashing the password
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    // Creating a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      location,
      occupation,
      friends,
      viewedProfile: 0,
      impressions: 0,
    })

    // Saving the new user
    const savedUser = await newUser.save()

    // Sending the response
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

// LOGGING USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(400).json({ error: 'The user does not exist.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    const userObj = user.toObject()
    delete userObj.password

    res.status(200).json({ token, user: userObj })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}
