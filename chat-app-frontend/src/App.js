import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register/Register';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login/Login';
import SetAvatar from './pages/SetAvatar/SetAvatar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/setAvatar' element={<SetAvatar />} />
        <Route path='/' element={<Chat />} />
      </Routes>

    </Router>
  )
}

export default App;