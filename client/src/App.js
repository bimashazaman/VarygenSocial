import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './scenes/homePage'
import LoginPage from './scenes/loginPage'
import ProfilePage from './scenes/profilePage'

function App() {
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/profile/:userId' element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
