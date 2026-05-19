import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className='w-screen'>
    <Routes>
      <Route path='/' element={<div className='w-full'>Root element of Stashify!</div>}/>
    </Routes>
    </div>
  )
}

export default App
