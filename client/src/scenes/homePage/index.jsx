import React from 'react'
import Navbar from '../navbar/index'
import { Box, useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux'

const HomePage = () => {
  return (
    <Box>
      <Navbar />
    </Box>
  )
}

export default HomePage
